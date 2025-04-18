const Contact = require('../db/models/contact');
const HttpError = require('../helpers/HttpError');

// Get all contacts with pagination, sorting and filtering
const getAllContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const skip = (page - 1) * perPage;
    const limit = Number(perPage);
    
    // Build filter object
    const filter = {};
    if (type) filter.contactType = type;
    if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get contacts with pagination
    const contacts = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalItems = await Contact.countDocuments(filter);
    
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = Number(page);

    // Prepare pagination info
    const paginationInfo = {
      data: contacts,
      page: currentPage,
      perPage: limit,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: paginationInfo,
    });
  } catch (error) {
    next(error);
  }
};

// Get contact by ID
const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    
    if (!contact) {
      throw new HttpError(404, 'Contact not found');
    }
    
    res.json({
      status: 200,
      message: 'Contact found',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Add new contact
const addContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Update contact
const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );
    
    if (!contact) {
      throw new HttpError(404, 'Contact not found');
    }
    
    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact
const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findByIdAndDelete(contactId);
    
    if (!contact) {
      throw new HttpError(404, 'Contact not found');
    }
    
    res.json({
      status: 200,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
};