// Analytics Dashboard Script
class AnalyticsDashboard {
        constructor() {
                this.baseUrl = window.location.hostname === 'localhost'
                        ? 'http://localhost:5000/api/analytics'
                        : 'https://api.yourdomain.com/api/analytics';

                // Preload Google GeoChart package with optional Maps API key
                if (typeof google !== 'undefined') {
                        const mapsApiKey = window.GOOGLE_MAPS_API_KEY || null;
                        const loadOptions = { packages: ['geochart'] };
                        if (mapsApiKey) {
                                loadOptions.mapsApiKey = mapsApiKey;
                        } else {
                                console.warn('Google Maps API key not found (set window.GOOGLE_MAPS_API_KEY) — GeoCharts may fail to load.');
                        }
                        google.charts.load('current', loadOptions);
                }

                this.init();
        }

        async init() {
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
                } else {
                        this.setupEventListeners();
                }
        }

        setupEventListeners() {
                // Listen for tab switching to load analytics when analytics tab is clicked
                const analyticsTab = document.getElementById('analyticsTab');
                if (analyticsTab) {
                        analyticsTab.addEventListener('click', () => {
                                // Small delay to ensure the analytics section is visible
                                setTimeout(() => this.loadAnalyticsData(), 100);
                        });
                }

                // Listen for refresh button click
                const refreshBtn = document.getElementById('refreshAnalyticsBtn');
                if (refreshBtn) {
                        refreshBtn.addEventListener('click', () => {
                                this.loadAnalyticsData();
                        });
                }

                // Close detail modal
                const closeModalBtn = document.getElementById('closeDetailModal');
                const detailModal = document.getElementById('analyticsDetailModal');
                if (closeModalBtn && detailModal) {
                        closeModalBtn.addEventListener('click', () => {
                                detailModal.classList.add('hidden');
                        });
                        // Click outside modal to close
                        detailModal.addEventListener('click', (e) => {
                                if (e.target === detailModal) {
                                        detailModal.classList.add('hidden');
                                }
                        });
                }
        }

        addCardClickHandlers() {
                const mapping = [
                        { id: 'analyticsReferrer', key: 'referrers', title: 'Top Referrers' },
                        { id: 'analyticsGeolocation', key: 'geo', title: 'Visitors by Country' },
                        { id: 'analyticsDeviceOSBrowser', key: 'device', title: 'Device / OS / Browser' },
                        { id: 'analyticsClickEvents', key: 'topClicks', title: 'Top Clicked Elements' },
                        { id: 'analyticsUTMTags', key: 'utm', title: 'UTM Tags' }
                ];

                mapping.forEach(({ id, key, title }) => {
                        const el = document.getElementById(id);
                        if (el) {
                                el.style.cursor = 'pointer';
                                el.addEventListener('click', () => {
                                        if (!this.currentData) return;
                                        const items = this.currentData[key] || [];
                                        this.showDetailModal(title, items, key);
                                });
                        }
                });
        }

        showDetailModal(title, items, type) {
                const modal = document.getElementById('analyticsDetailModal');
                const titleEl = document.getElementById('detailModalTitle');
                const content = document.getElementById('detailModalContent');
                if (!modal || !titleEl || !content) return;

                titleEl.textContent = title;
                content.innerHTML = '';

                if (type === 'geo') {
                        // Create container for chart
                        const chartDiv = document.createElement('div');
                        chartDiv.id = 'geoChartContainer';
                        chartDiv.style.width = '100%';
                        chartDiv.style.height = '400px';
                        content.appendChild(chartDiv);

                        // Load Google Charts if not already
                        if (typeof google !== 'undefined' && google.visualization && google.visualization.GeoChart) {
                                this.drawGeoChart(items, 'geoChartContainer');
                        } else if (typeof google !== 'undefined' && google.charts) {
                                google.charts.setOnLoadCallback(() => this.drawGeoChart(items, 'geoChartContainer'));
                        }
                } else if (!items || items.length === 0) {
                        content.textContent = 'No data available';
                } else {
                        const ul = document.createElement('ul');
                        ul.className = 'list-disc list-inside space-y-1';
                        items.forEach((item) => {
                                let text = '';
                                switch (type) {
                                        case 'referrers':
                                                text = `${this.formatReferrer(item._id)} — ${item.count}`;
                                                break;
                                        case 'geo':
                                                text = `${item._id || 'Unknown'} — ${item.count}`;
                                                break;
                                        case 'device':
                                                text = `${item._id.device || 'Unknown'} / ${item._id.os || ''} / ${item._id.browser || ''} — ${item.count}`;
                                                break;
                                        case 'topClicks':
                                                text = `${item._id || 'Unknown'} — ${item.count}`;
                                                break;
                                        case 'utm':
                                                text = `${this.formatUTM(item._id)} — ${item.count}`;
                                                break;
                                        default:
                                                text = JSON.stringify(item);
                                }
                                const li = document.createElement('li');
                                li.textContent = text;
                                ul.appendChild(li);
                        });
                        content.appendChild(ul);
                }

                modal.classList.remove('hidden');
        }

        async loadAnalyticsData() {
                try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                                console.error('No authentication token found');
                                return;
                        }

                        // Show loading state
                        this.showLoading(true);

                        const response = await fetch(`${this.baseUrl}/dashboard`, {
                                method: 'GET',
                                headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                }
                        });

                        if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();
                        this.updateDashboard(data);
                } catch (error) {
                        console.error('Error loading analytics data:', error);
                        this.showError('Failed to load analytics data');
                } finally {
                        // Hide loading state
                        this.showLoading(false);
                }
        }

        updateDashboard(data) {
                // Store raw arrays for modal use
                this.currentData = data;

                // Update page views
                this.updateElement('analyticsPageViews', data.pageViews || 0);

                // Update unique visitors
                this.updateElement('analyticsUniqueVisitors', data.uniqueVisitors || 0);

                // Update sessions
                this.updateElement('analyticsSessions', data.sessions || 0);

                // Update referrer (show top referrer)
                const topReferrer = data.referrers && data.referrers.length > 0 ?
                        `${this.formatReferrer(data.referrers[0]._id)} (${data.referrers[0].count})` :
                        'No data';
                this.updateElement('analyticsReferrer', topReferrer);

                // Update bounce rate
                const bounceRate = data.bounceRate ? `${data.bounceRate.toFixed(1)}%` : '0%';
                this.updateElement('analyticsBounceRate', bounceRate);

                // Update session duration (convert to minutes)
                const avgDuration = data.avgSessionDuration ?
                        `${Math.round(data.avgSessionDuration / 60)}m` : '0m';
                this.updateElement('analyticsSessionDuration', avgDuration);

                // Update geolocation (show top country)
                const topCountry = data.geo && data.geo.length > 0
                        ? `${data.geo[0]._id || 'Unknown'} (${data.geo[0].count})`
                        : 'No data';
                this.updateElement('analyticsGeolocation', topCountry);

                // Draw mini geo preview
                if (typeof google !== 'undefined' && google.visualization && google.visualization.GeoChart) {
                        const previewOptions = {
                                legend: 'none',
                                colorAxis: { colors: ['#63b3ed', '#2563eb'] },
                                datalessRegionColor: '#2d3748',
                                backgroundColor: 'transparent',
                        };
                        this.drawGeoChart(data.geo, 'analyticsGeolocationMap', previewOptions);
                } else if (typeof google !== 'undefined' && google.charts) {
                        google.charts.setOnLoadCallback(() => {
                                const previewOptions = {
                                        legend: 'none',
                                        colorAxis: { colors: ['#63b3ed', '#2563eb'] },
                                        datalessRegionColor: '#2d3748',
                                        backgroundColor: 'transparent',
                                };
                                this.drawGeoChart(data.geo, 'analyticsGeolocationMap', previewOptions);
                        });
                }

                // Update device/OS/browser (show top device)
                const topDevice = data.device && data.device.length > 0
                        ? `${data.device[0]._id.device || 'Unknown'} (${data.device[0].count})`
                        : 'No data';
                this.updateElement('analyticsDeviceOSBrowser', topDevice);

                // Update scroll depth
                const avgScroll = data.avgScroll ? `${Math.round(data.avgScroll)}%` : '0%';
                this.updateElement('analyticsScrollDepth', avgScroll);

                // Update click events (show total clicks)
                const totalClicks = data.topClicks ?
                        data.topClicks.reduce((sum, click) => sum + click.count, 0) : 0;
                this.updateElement('analyticsClickEvents', totalClicks);

                // Update UTM tags (show top UTM)
                const topUTM = data.utm && data.utm.length > 0 ?
                        `${this.formatUTM(data.utm[0]._id)} (${data.utm[0].count})` :
                        'No data';
                this.updateElement('analyticsUTMTags', topUTM);

                // Update errors
                this.updateElement('analyticsErrors', data.errors || 0);

                // Attach click handlers now that DOM values exist
                this.addCardClickHandlers();
        }

        updateElement(elementId, value) {
                const element = document.getElementById(elementId);
                if (element) {
                        element.textContent = value;
                        element.classList.add('analytics-card-value');
                }
        }

        showLoading(show) {
                const refreshBtn = document.getElementById('refreshAnalyticsBtn');
                if (refreshBtn) {
                        if (show) {
                                refreshBtn.disabled = true;
                                refreshBtn.innerHTML = `
                    <svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Loading...
                `;
                        } else {
                                refreshBtn.disabled = false;
                                refreshBtn.innerHTML = `
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Refresh Data
                `;
                        }
                }
        }

        showError(message) {
                // Show error using SweetAlert2 if available
                if (typeof Swal !== 'undefined') {
                        Swal.fire({
                                icon: 'error',
                                title: 'Analytics Error',
                                text: message,
                                confirmButtonColor: '#2563eb'
                        });
                } else {
                        console.error(message);
                }
        }

        drawGeoChart(items, containerId = 'geoChartContainer', customOptions = {}) {
                if (typeof google === 'undefined' || !google.charts) {
                        console.error('Google Charts library not loaded');
                        return;
                }

                // Prepare data
                const dataArray = [['Country', 'Visits']];
                items.forEach(item => {
                        dataArray.push([item._id || 'Unknown', item.count]);
                });

                const dataTable = google.visualization.arrayToDataTable(dataArray);

                const defaultOptions = {
                        colorAxis: { colors: ['#aec7e8', '#1f77b4'] },
                        backgroundColor: 'transparent',
                        defaultColor: '#777',
                };

                const options = Object.assign({}, defaultOptions, customOptions);

                const chartDiv = document.getElementById(containerId);
                if (!chartDiv) return;

                const chart = new google.visualization.GeoChart(chartDiv);
                chart.draw(dataTable, options);
        }

        // Helper to format referrer nicely
        formatReferrer(ref) {
                if (!ref) return 'Direct';
                try {
                        const url = new URL(ref);
                        return url.hostname;
                } catch (e) {
                        // Fallback: strip protocol and path
                        return ref.replace(/^https?:\/\//, '').split('/')[0];
                }
        }

        // Helper to format UTM string
        formatUTM(utmStr) {
                if (!utmStr) return 'None';
                // Ensure it starts with ? for URLSearchParams
                const qs = utmStr.startsWith('utm_') ? '?' + utmStr : utmStr;
                const params = new URLSearchParams(qs);
                const source = params.get('utm_source') || 'unknown';
                const medium = params.get('utm_medium');
                const campaign = params.get('utm_campaign');
                let label = source;
                if (medium) label += ` / ${medium}`;
                if (campaign) label += ` / ${campaign}`;
                return label;
        }
}

// Initialize analytics dashboard when script loads
const analyticsDashboard = new AnalyticsDashboard(); 