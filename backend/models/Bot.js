const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const BotSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  basePersonality: {
    type: String,
    required: true,
  },
  personalityTraits: {
    type: [String],
  },
  useCaseTemplate: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'inactive', 'preview'],
      message: '{VALUE} is not a supported status',
    },
  },
});

BotSchema.plugin(uniqueValidator);

const Bot = mongoose.model('Bot', BotSchema);
module.exports = Bot;
