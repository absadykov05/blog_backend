import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["fullName", "avatarURL", "email"] })
      .exec();
    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось загрузить статьи",
    });
  }
};

export const getAllSorted = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["fullName", "avatarURL", "email"] })
      .exec();
    let sortedPosts = posts.sort((p1, p2) =>
      p1.viewsCount < p2.viewsCount ? 1 : p1.viewsCount > p2.viewsCount ? -1 : 0
    );
    res.json(sortedPosts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось загрузить статьи",
    });
  }
};

export const getOne = (req, res) => {
  try {
    const id = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate({ path: "user", select: ["fullName", "avatarURL", "email"] })
      .then((doc, err) => {
        if (err) {
          console.log(err);
          return res.status(501).json({
            message: "Не удалось найти пост",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json(doc);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось найти пост",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageURL: req.body.imageURL,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось создать статью 111",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    PostModel.findOneAndDelete({
      _id: id,
    }).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(501).json({
          message: "Не удалось удалить пост",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }

      res.json({
        success: true,
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось удалить пост",
    });
  }
};

export const update = (req, res) => {
  try {
    const id = req.params.id;
    PostModel.updateOne(
      {
        _id: id,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageURL: req.body.imageURL,
        user: req.userId,
      }
    ).then(
      res.json({
        success: true,
      })
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось обновить пост",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(3).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 3);

    res.json(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось загрузить статьи",
    });
  }
};

export const getOneTag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await PostModel.find().exec();
    const filteredPosts = [];
    posts.map((obj) => {
      obj.tags.map((el) => {
        if (el === tag) {
          filteredPosts.push(obj);
        }
      });
    });
    res.json(filteredPosts);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось загрузить посты по тегу",
    });
  }
};

export const comment = async (req, res) => {
  try {
    const id = req.params.id;

    PostModel.updateOne(
      {
        _id: id,
      },
      {
        $push: { comments: req.body },
      }
    ).then(
      res.json({
        success: req.body,
      })
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось написать коментарий",
    });
  }
};
