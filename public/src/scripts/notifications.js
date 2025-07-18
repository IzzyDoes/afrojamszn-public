// Notification utility using SweetAlert2
class NotificationManager {
        static showSuccess(message, title = 'Success') {
                return Swal.fire({
                        icon: 'success',
                        title: title,
                        text: message,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                });
        }

        static showError(message, title = 'Error') {
                return Swal.fire({
                        icon: 'error',
                        title: title,
                        text: message,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                });
        }

        static showWarning(message, title = 'Warning') {
                return Swal.fire({
                        icon: 'warning',
                        title: title,
                        text: message,
                        confirmButtonColor: '#f39c12',
                        confirmButtonText: 'OK'
                });
        }

        static showInfo(message, title = 'Information') {
                return Swal.fire({
                        icon: 'info',
                        title: title,
                        text: message,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                });
        }

        static showConfirm(message, title = 'Confirm') {
                return Swal.fire({
                        title: title,
                        text: message,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                });
        }

        static showLoading(message = 'Loading...') {
                Swal.fire({
                        title: message,
                        allowOutsideClick: false,
                        didOpen: () => {
                                Swal.showLoading();
                        }
                });
        }

        static close() {
                Swal.close();
        }
}

// Export for use in other scripts
window.NotificationManager = NotificationManager; 