const Pool = require('pg').Pool;
const pool = new Pool ({
    user: 'me',
    host: 'localhost',
    database: 'personalbudget',
    password: 'password',
    post: 5432
});

const getAllEnvelopesFromDatabase = (req, res) => {
    pool.query ('SELECT * FROM envelopes ORDER BY id ASC;',
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
};

const getEnvelopeFromDatabaseById = (req, res) => {
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

const addEnvelopeToDatabase = (req, res) => {
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

const deleteEnvelopeFromDatabaseById = (req, res) => {
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

const transferMoney = async (from, to, amount) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const substractMoneyText = 'UPDATE envelopes SET budget = budget - $1 WHERE id = $2';
        const addMoneyText = 'UPDATE envelopes SET budget = budget + $1 WHERE id = $2';
        await client.query(substractMoneyText, [amount, from]);
        await client.query(addMoneyText, [amount, to]);
        
        //Add transaction to transactions table
        const transactionText = 'INSERT INTO transactions (from_envelope_id, to_envelope_id, date, amount) VALUES ($1, $2, $3, $4)';
        await client.query(transactionText, [from, to, new Date(), amount]);

        await client.query('COMMIT');
    } catch(error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

const getAllTransactionsFromDatabase = (req, res) => {
    pool.query ('SELECT * FROM transactions ORDER BY id ASC;',
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
}

const getTransactionFromDatabaseById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query ('SELECT * FROM transactions WHERE id = $1', [id],
        (error, results) => {
            if (error){
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
}

const createTransaction = (req, res) => {
    const {from, to, amount} = req.body;

    transferMoney(from, to, amount).then(() =>
        res.status(200).send(`Transaction complete.`),    
    ).catch(error => res.status(500).send());
}



module.exports = {
    getAllEnvelopesFromDatabase,
    getEnvelopeFromDatabaseById,
    getTotalBudget,
    addEnvelopeToDatabase,
    deleteEnvelopeFromDatabaseById,
    substractMoneyFromEnvelopeById,
    getAllTransactionsFromDatabase,
    getTransactionFromDatabaseById,
    createTransaction
};