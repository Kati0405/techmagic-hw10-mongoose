import User from '../models/user.model.js';
import Article from '../models/article.model.js';

export const getUsers = async (req, res, next) => {
  try {
    const sort = req.query.sort === 'desc' ? -1 : 1;
    await User.find({}, { fullName: 1, email: 1, age: 1 })
      .sort({ age: sort })
      .then((users) => res.status(200).json({ users }));
  } catch (err) {
    next(err);
  }
};

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const articles = await Article.find({ owner: req.params.id }).select(
      'title subtitle createdAt'
    );

    const userData = {
      _id: user._id,
      fullName: `${user.firstName} ${user.lastName}`,
      age: user.age,
      email: user.email,
      numberOfArticles: user.numberOfArticles,
      role: user.role,
      articles: articles,
    };
    res.json(userData);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, age } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      role,
      age,
    });
    await user.save().then((result) => {
      res.status(200).json({ message: 'User created successfully', result });
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const { firstName, lastName, age } = req.body;
    await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          firstName,
          lastName,
          age,
          fullName: `${firstName} ${lastName}`,
        },
      }
    );
    res.status(200).send({ message: 'User details changed successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });

    if (!user) {
      req.status(404).send({ message: 'User not found' });
    }

    await Article.deleteMany({ owner: req.params.id });
    res.status(200).send({ message: 'User was deleted successfully' });
  } catch (err) {
    next(err);
  }
};
