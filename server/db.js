//global variables
let envelopes = [];
let envelopeIdCounter = 1;
let totalBudget = 0;


const getAllFromDatabase = () => {
    return envelopes;
}

const getFromDatabaseById = (id) => {
    return envelopes.find(element => element.id === id)
}


const addToDatabase = (instance) => {
    if (isValidEnvelope(instance)) {
        instance.id = `${envelopeIdCounter++}`;
        envelopes.push(instance);
    }
    return envelopes[envelopes.length - 1];
}

const deleteFromDatabaseById = (id) => {
    const index = envelopes.findIndex(element => element.id === id);
    if (index !== -1){
        envelopes.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

const isValidEnvelope = (instance) => {
    instance.title = instance.title || '';
    instance.description = instance.description || '';
    if (typeof instance.title !== 'string' || typeof instance.description !== 'string') {
        throw new Error ("Envelope's title and description must be strings!")
    }
    if (!isNaN(parseFloat(instance.budget)) && isFinite(instance.budget)) {
        instance.budget = Number(instance.budget);
    } else {
        throw new Error ("Budget must be a number!")
    }
    return true;
}

module.exports = {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    deleteFromDatabaseById
}