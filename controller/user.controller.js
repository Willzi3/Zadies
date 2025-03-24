//Import mssql
const sql = require('mssql');
 // Import dbConfig
const dbConfig = require('../config/dbConfig');

// Fetch single user
const showUser = async (req, res) => {

    const { user_id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);

        console.log(`Requested user_id: ${user_id}`);

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('SELECT * FROM users WHERE user_id = @user_id');

// Check if the user was found
if (result.recordset.length === 0) {
    return res.status(404).send('User not found');
}

// Respond with the found user
res.json(result.recordset[0]);

} catch (err) {
console.error('Error fetching user:', err);
// Provide a more detailed error message for easier debugging
res.status(500).send('An error occurred while fetching the user');
}
};
//Fetch all users
const showAllUsers = async (req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`SELECT * FROM users`);
        res.json(result.recordset);
    }catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Error fetching users')
    }
}
//Create user
const createUser = async (req, res) => {
    const { username, password_hash, email, role, created_at, last_login} = req.body;
    try{
        const pool = await sql.connect(dbConfig);

             // Insert the new user and capture the ID of the inserted row
             const insertResult = await pool.request()
             .input('username', sql.NVarChar, username)
             .input('password_hash', sql.NVarChar, password_hash)
             .input('email', sql.NVarChar, email)
             .input('role', sql.NVarChar, role)
             .input('created_at', sql.DateTime, created_at)
             .input('last_login', sql.DateTime, last_login)
             .query(`
                 INSERT INTO users (username, password_hash, email, role, created_at, last_login)
                 OUTPUT INSERTED.user_id
                 VALUES (@username, @password_hash, @email, @role, @created_at, @last_login)
             `);
            
        //Get inserted users ID
        const newUserId = insertResult.recordset[0].user_id;     
            
        //fetch newly created users details
        const newUserResult = await pool.request()
                .input('user_id', sql.Int, newUserId)
                .query(`SELECT * FROM users WHERE user_id = @user_id`)
            
                res.status(201).send('User created Successfully');

        const newUser = newUserResult.recordset[0];

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    }catch(err){
        console.error('Error creating user', err);
        res.status(500).send('Error creating user')
    }
}
//Update user
const updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { username, password_hash, email, role, last_login } = req.body;

    try{
        //establish connection via sql
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
        .input('user_id', sql.Int, user_id)
        .input('username', sql.NVarChar, username)
        .input('password_hash', sql.NVarChar, password_hash)
        .input('email', sql.NVarChar, email)
        .input('role', sql.NVarChar, role)
        .input('last_login', sql.DateTime, last_login)
        .query(`UPDATE users
            SET username = @username,
            password_hash = @password_hash,
            email = @email,
            role = @role,
            last_login = @last_login
            WHERE user_id = @user_id`);

        //Check if any rows are affected
       if (result.rowsAffected[0] === 0) {
            return res.status(404).send('User not found')
       }

        //fetch updated user
        const newUpdatedResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`SELECT * FROM users WHERE user_id = @user_id`);


        const updatedUser = newUpdatedResult.recordset[0];

       // Respond with updated details
        res.status(201).json({
            message: 'User created successfully',
            user: updatedUser
        })


    }catch(err){
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
}
//Delete user
const deleteUser = async (req, res) => {
    const { user_id } = req.params;
    try{
        //establish sql connection
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`DELETE FROM users WHERE user_id = @user_id`);

        //check for affect rows
        if (result.rowsAffected === 0) {
            return res.status(404).send('User not found')
        }

        res.send('User Successfully Deleted')
    }catch(err){
        console.error('Error deleting user:', err);
        res.status(500).send('Error deleting user');
    }
}


module.exports = {
    showUser, //Show individual user
    showAllUsers, //Show all users
    createUser, //Create user
    updateUser, //Update user
    deleteUser //Delete user
}