const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');
const { validateBody, isValidId, contactAddSchema, contactUpdateSchema } = require('../middlewares/validation');

// GET all contacts with pagination, sorting and filtering
router.get('/', contactsController.getAllContacts);

// GET a contact by ID
router.get('/:contactId', isValidId, contactsController.getContactById);

// POST create a new contact
router.post('/', validateBody(contactAddSchema), contactsController.addContact);

// PATCH update a contact
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), contactsController.updateContact);

// DELETE a contact
router.delete('/:contactId', isValidId, contactsController.deleteContact);

module.exports = router;