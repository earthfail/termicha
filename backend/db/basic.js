const { query, getClient } = require('./db.js');
const bcrypt = require('bcrypt');

// Example of usage

async function getUsers() {
    const res = await query('SELECT * FROM app_user');
    return res.rows;
  }
  
  
  async function getUserById(id) {
    const client = await getClient();
    try {
      const res = await client.query('SELECT * FROM app_user WHERE id = $1', [id]);
      return res.rows[0];
    } finally {
      client.release();
    }
  }
  
  async function usernameExists(username){
    try {
      console.log(await getUsers());
      const res = await query('SELECT * FROM app_user WHERE username = $1', [username]);
      return res.rowCount > 0;
    } catch (err){
      console.error('Error executing query:', err);
      return false;
    }
  }
  
  async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
  
  async function verifyPassword(username, password) {
    try {
      const user = await query('SELECT * FROM app_user WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return false; // User not found
      }

      const hashedPassword = user.rows[0].password_hash;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      return passwordMatch;
    } catch (err) {
      console.error('Error verifying password:', err);
      return false; // Return false in case of an error
    }
  }

  async function registerNewUser(username, password){
    // expecting valid username and password
    try {
        const _query = 'INSERT INTO app_user (username, password_hash) VALUES ($1, $2)';
        await query(_query, [username, password]);
    } catch (err){
        throw err;
    }
  }


  module.exports = {
    getUserById,
    getUsers,
    usernameExists,
    verifyPassword,
    registerNewUser,
    hashPassword
  };