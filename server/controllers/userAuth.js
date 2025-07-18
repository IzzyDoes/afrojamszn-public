const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const fs = require("fs")

// Helper function to read Docker secrets or fall back to environment variables
const getSecret = (secretName, envVarName) => {
        try {
                const secretPath = `/run/secrets/${secretName}`;
                if (fs.existsSync(secretPath)) {
                        return fs.readFileSync(secretPath, 'utf8').trim();
                }
        } catch (error) {
                console.log(`Could not read secret ${secretName}, falling back to environment variable`);
        }
        return process.env[envVarName];
};

const register = async (req, res) => {
        try {
                const { username, password, role } = req.body
                const hashedPwd = await bcrypt.hash(password, 10)
                const newUser = new User({ username, password: hashedPwd, role })
                await newUser.save()
                res.status(201).json({ message: `User registered with username: ${username}` })
        } catch (error) {
                res.status(500).json({ message: 'Error creating user', error })
        }




}

const login = async (req, res) => {
        try {
                const { username, password } = req.body
                const user = await User.findOne({ username })
                if (!user) {
                        return res.status(404).json({ message: `User with username: ${username}, is not found`, error })
                }
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                        return res.status(400).json({ message: `Invalid Credentials`, error })
                }
                const jwtSecret = getSecret('jwt_secret', 'JWT_SECRET');
                if (!jwtSecret) {
                        return res.status(500).json({ message: 'JWT secret not configured' });
                }
                
                const token = jwt.sign(
                        { id: user._id, role: user.role },
                        jwtSecret,
                        { expiresIn: "2h" }
                )
                res.status(200).json({ token, role: user.role })
        } catch (error) {
                res.status(500).json({ message: `Error logging in`, error })
        }
}


module.exports = { register, login }