const {Clue, ClueList} = require('../models/clues-model')

// Creating New Clue
createClue = (req, res) => {
    console.log("Creating Clue", req.body)

    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Missing Clue Body'
        })
    }

    let clues = []

    var i = 1;
    req.body.clueList.forEach(function(clue){
        clues.push(new Clue({
            message: clue.message,
            sequence: i
            })
        )
        i++;
    })

    let clueList = new ClueList({
        clues: clues,
        category: req.body.category
    })

    console.log("clueList", clueList)    

    clueList
        .save()
        .then(() => {
            return res.status(201).json({
                status: 'Success',
                message: clueList._id
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: "Create Clue Failed",
                error
            })
        })
}

// Get clue by id
getClue = async (req, res) => {
    console.log("Getting Clue", req.query)

    await ClueList.findOne({ _id: req.query.id }, (error, clue) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!clue) {
            return res.status(404).json({ status: 'Fail', message: 'Clue not found' })
        }

        return res.status(200).json({ status: 'Success', message: clue })
    }).catch(err => console.log(err))
}

// Get all clues
getClues = async (req, res) => {
    console.log("Getting Clues")

    await ClueList.find({}, (error, clues) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (clues.length == 0) {
            return res.status(404).json({ success: false, error: 'No Clues' })
        }

        return res.status(200).json({ status: 'Success', message: clues })
    }).catch(err => console.log(err))
}

// Delete clue by id
deleteClue = async (req, res) => {
    console.log("Deleting Clue", req.query)

    await ClueList.findOneAndDelete({ _id: req.query.id }, (error, clue) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!clue) {
            return res.status(404).json({ status: 'Fail', message: 'Clue not found' })
        }


        return res.status(200).json({ status: 'Success', message: clue })
    }).catch(err => console.log(err))

}

// Not MVP
// Update clue by id
updateClue = async (req, res) => {
    console.log("Updating Clue", req.query, req.body)

    if (Object.keys(req.body).length == 0) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Missing Clue Body'
        })
    }

    await ClueList.findOne({ _id: req.query.id }, (error, clueList) => {
        if (error) {
            return res.status(400).json({ status: 'Fail', message: error })
        }

        if (!clueList) {
            return res.status(404).json({ status: 'Fail', message: 'Clue not found' })
        }

        let clues = clueList.clues

        var i;
        for (i=0; i < req.body.clueList.length; i++) {
            clues[i].message = req.body.clueList[i].message
            clues[i].sequence = req.body.clueList[i].sequence
        }

        clueList.category = req.body.category

        console.log("clue updated", clueList)    
    

        clueList
        .save()
        .then(() => {
            return res.status(200).json({
                status: 'Success',
                message: 'Updated ' + clueList._id
            })
        })
        .catch(error => {
            return res.status(400).json({
                status: 'Fail',
                message: "Clue Update Failed",
                error
            })
        })
    }).catch(err => console.log(err))


    
    
}


module.exports = {
    createClue,
    getClue,
    getClues,
    deleteClue,
    updateClue
}