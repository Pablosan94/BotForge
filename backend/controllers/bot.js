const Bot = require('../models/Bot');

exports.listBots = async (req, res) => {
  const { active: activeOnly } = req.query;
  const filter = activeOnly ? { status: 'active' } : {};

  try {
    const bots = await Bot.aggregate([
      { $match: filter },
      {
        $addFields: {
          customSortWeight: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'active'] }, then: 0 },
                { case: { $eq: ['$status', 'preview'] }, then: 1 },
                { case: { $eq: ['$status', 'inactive'] }, then: 2 },
              ],
              default: 999, // For any other status not defined in customSortOrder
            },
          },
        },
      },
      { $sort: { customSortWeight: 1 } },
    ]);
    res.send(bots);
  } catch (err) {
    res.status(500).send('Something went wrong!');
  }
};

exports.findBot = async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    res.send(bot);
  } catch (err) {
    res.status(404).send('Could not find a bot with that id');
  }
};

exports.createBot = async (req, res) => {
  try {
    res.status(201).send(await Bot.create(req.body));
  } catch (err) {
    res
      .status(500)
      .send(Object.keys(err.errors).map((key) => err.errors[key].message));
  }
};

exports.updateBot = async (req, res) => {
  try {
    await Bot.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    res.send(await Bot.findById(req.params.id));
  } catch (err) {
    res
      .status(500)
      .send(Object.keys(err.errors).map((key) => err.errors[key].message));
  }
};

exports.deleteBot = async (req, res) => {
  try {
    res.send(await Bot.findByIdAndDelete(req.params.id));
  } catch (err) {
    res.status(500).send('Failed to delete the bot');
  }
};
