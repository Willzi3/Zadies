const sql = require('mssql');
const dbConfig = require('../config/dbConfig'); // Import dbConfig

//Fetch single product
const showProduct = async (req, res) => {

    const { product_id } = req.params;

    try {
        const pool = await sql.connect(dbConfig);

        console.log(`Requested product_id: ${product_id}`);

        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query('SELECT * FROM products WHERE product_id = @product_id');

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(404).send('Product not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
};
//Fetch all products
const showAllProducts = async (req, res) => {
    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`SELECT * FROM products`);
        //Return Products as JSON
        res.status(200).json(result.recordset);
    }catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products')
    }
}
//Create product
const createProduct = async (req, res) => {
    const { name, description, price, stock_quantity, category, created_at, product_image } = req.body;

    try{
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Decimal, price)
            .input('stock_quantity', sql.Int, stock_quantity)
            .input('category', sql.NVarChar, category)
            .input('created_at', sql.DateTime, created_at)
            .input('product_image', sql.NVarChar, product_image)
            .query(`INSERT INTO products (name, description, price, stock_quantity, category, created_at, product_image)
                VALUES (@name, @description, @price, @stock_quantity, @category, @created_at, @product_image)`);

        res.status(201).send('Product created successfully')
        
    }catch (err){
        console.error('Error creating product:', err);
        res.status(500).send('Error creating prduct');
    }
}
//Update product
const updateProduct = async (req, res) => {

    const { product_id } = req.params;
    const { name, description, price, stock_quantity, category, created_at, product_image } = req.body;

    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Decimal, price)
            .input('stock_quantity', sql.Int, stock_quantity)
            .input('category', sql.NVarChar, category)
            .input('created_at', sql.DateTime, created_at)
            .input('product_image', sql.NVarChar, product_image)
            .query(`UPDATE products SET name = @name,
                description = @description,
                price = @price,
                stock_quantity = @stock_quantity,
                category = @category,
                created_at = @created_at,
                product_image = @product_image
                WHERE  product_id = @product_id
                
                `);

                if (result.rowsAffected === 0) {
                    return res.status(404).send('Product not found');
                }
        
        const updatedProductResult = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query(`SELECT * FROM products WHERE product_id = @product_id`);

        const updatedProduct = updatedProductResult.recordset[0];

        res.json({
            message: 'Product successfully updated',
            product: updatedProduct
        });

    }catch (err){
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
    }
}

//Delete product
const deleteProduct = async (req, res) => {
    const { product_id } = req.params;

    try{
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('product_id', sql.Int, product_id)
            .query(`DELETE FROM products WHERE product_id = @product_id`);

            if (result.rowsAffected === 0) {
                return res.status(404).send('Product not Found')
            }

            res.send('Product deleted Successfully');
    }catch (err) {
        console.error('Error deleting Product:', err);
        res.status(500).send('Error deleting Product');
    }
}


    module.exports = {
        showProduct, //fetch single product
        showAllProducts, //fetch all products
        createProduct, //create new product
        updateProduct, //update product
        deleteProduct //delete product
    }