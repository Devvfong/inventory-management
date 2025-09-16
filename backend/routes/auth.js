// Authentication routes for user registration, login, and profile
const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const verifyAuth = require('../middleware/verifyAuth');

/**
 * POST /api/auth/register
 * Register a new user using Supabase Admin API
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Create user using Supabase Admin API
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email for development
            user_metadata: {
                name: name || 'User'
            }
        });

        if (error) {
            console.error('Registration error:', error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/auth/login
 * Login user using Supabase signInWithPassword
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Sign in user with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error);
            return res.status(401).json({ error: error.message });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name
            },
            session: {
                access_token: data.session.access_token,
                expires_at: data.session.expires_at
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', verifyAuth, async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.user_metadata?.name || 'User',
                created_at: req.user.created_at
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;