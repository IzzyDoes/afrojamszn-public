// Development server with nodemon
const { spawn } = require('child_process');
const path = require('path');

console.log(' Starting development server...');
console.log('Server will restart on file changes');
console.log(' Access your app at: http://localhost:5000');

const nodemon = spawn('npx', ['nodemon', 'app.js'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
});

nodemon.on('error', (error) => {
        console.error('Failed to start development server:', error);
        process.exit(1);
});

nodemon.on('close', (code) => {
        console.log(` Development server stopped with code ${code}`);
        process.exit(code);
}); 
