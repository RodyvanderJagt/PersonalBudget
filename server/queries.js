const Pool = require('pg').Pool;
const pool = new Pool ({
    user: 'me',
    host: 'localhost',
    database: 'personalbudget',
    password: 'password',
    post: 5432
});

const getAllFromDatabase = (req, res) => {
    pool.query ('SELECT * FROM envelopes ORDER BY id ASC;',
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
};

const getFromDatabaseById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query ('SELECT * FROM envelopes WHERE id = $1', [id],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
};

const getTotalBudget = (req, res) => {
    pool.query ('SELECT SUM(budget) AS total FROM envelopes',
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).send(`Your total budget is: ${results.rows[0].total}`);
        }
    )
};

const addToDatabase = (req, res) => {
    const {name, description, budget} = req.body;

    pool.query ('INSERT INTO envelopes (name, description, budget) VALUES($1, $2, $3) RETURNING id',
        [name, description, budget],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(201).send(`Envelope created with id ${results.rows[0].id}`);
        }
    )
};

const deleteFromDatabaseById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query ('DELETE FROM envelopes WHERE id = $1', [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Envelope deleted with id ${id}`);
        }
    )
};

const substractMoneyFromEnvelopeById = (req, res) => {
    const id = parseInt(req.params.id);
    const {cost} = req.body;

    pool.query ('UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *', [cost, id],
        (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Money substracted from envelope, your new budget is: ${results.rows[0].budget}`);        
        }
    )
};

const transferMoneyById = async (req, res) => {
    const client = await pool.connect();

    try {
        const from = parseInt(req.params.from);
        const to = parseInt(req.params.to);
        const {amount} = req.body;
        await client.query('BEGIN');
        const substractMoneyText = 'UPDATE envelopes SET budget = budget - $1 WHERE id = $2';
        const addMoneyText = 'UPDATE envelopes SET budget = budget + $1 WHERE id = $2';
        await client.query(substractMoneyText, [amount, from]);
        await client.query(addMoneyText, [amount, to]);
        await client.query('COMMIT', (error, results) => {
                if (error){
                    throw error;
                }
                res.status(200).send(`Transfer successful`);
            }
        );
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}



module.exports = {
    getAllFromDatabase,
    getFromDatabaseById,
    getTotalBudget,
    addToDatabase,
    deleteFromDatabaseById,
    substractMoneyFromEnvelopeById,
    transferMoneyById
};