import { body } from "express-validator";

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
    max: 12,
  }),
  body("fullName", "Укажите свое имя").isLength({ min: 3, max: 20 }),
  body("avatarURL", "Неверная ссылка на аватарку").optional().isURL(),
];

export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({
    min: 5,
    max: 12,
  }),
];

export const createPostValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Ввведите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(),
  body("imageURL", "Неверная ссылка на изображение").optional().isString(),
];
