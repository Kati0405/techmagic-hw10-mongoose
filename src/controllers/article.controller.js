import Article from '../models/article.model.js';
import User from '../models/user.model.js';

export const getArticles = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 5 } = req.query;
    const query = { title: new RegExp(search, 'i') };
    const result = await Article.find(query)
      .populate('owner', 'fullName email age')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const { ownerId, title, subtitle, description, category } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json('Owner is not found');
    }
    const article = new Article({
      owner: ownerId,
      title,
      subtitle,
      description,
      owner,
      category,
    });
    owner.numberOfArticles += 1;
    await owner.save();

    await article.save();
    res.status(200).json({ message: 'Article created successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateArticleById = async (req, res, next) => {
  const articleId = req.params.id;
  const { title, subtitle, description, category, owner } = req.body;
  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    const userId = article.owner;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (article.owner.toString() !== owner) {
      return res
        .status(403)
        .json({ message: 'Only owner can update this article' });
    }

    article.title = title;
    article.subtitle = subtitle;
    article.description = description;
    article.category = category;

    await article.save();
    res.status(200).json({ message: 'Article updated successfully' });
  } catch (err) {
    next(err);
  }
};

export const deleteArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById({ _id: req.params.id });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const owner = await User.findById(article.owner);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    owner.numberOfArticles -= 1;
    await owner.save();
    await Article.deleteOne({ _id: req.params.id });
    res.status(200).send({ message: 'Article was deleted successfully' });
  } catch (err) {
    next(err);
  }
};
