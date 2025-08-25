const express = require('express');
const router = express.Router();

const { validateCreateLead, validateUpdateLead } = require('../middleware/validateLead');
const controller = require('../controllers/leadsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// POST /leads
router.post('/', validateCreateLead, controller.createLead);

// GET /leads (list)
router.get('/', controller.listLeads);

// GET /leads/:id
router.get('/:id', controller.getLead);

// PUT /leads/:id
router.put('/:id', validateUpdateLead, controller.updateLead);

// DELETE /leads/:id
router.delete('/:id', controller.deleteLead);

module.exports = router;
