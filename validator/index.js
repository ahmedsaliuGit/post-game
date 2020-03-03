exports.createPostValidator = (req, res, next) => {
  req.check("title", "Title is required").notEmpty();
  req.check("title", "Title must be at least 5 characters long.").isLength({
    min: 5,
    max: 150
  });

  req.check("body", "Body is required").notEmpty();
  req.check("body", "Body must be at least 5 characters long.").isLength({
    min: 5,
    max: 2000
  });

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(422).json({ error: firstError });
  }

  //   continue with next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req.check("name", "Name must be at least 5 characters long.").isLength({
    min: 5,
    max: 150
  });

  req.check("email", "Email is required").notEmpty();
  req
    .check("email", "Email must be between 5 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 5,
      max: 2000
    });

  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must at least contain 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain number");

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(422).json({ error: firstError });
  }

  //   continue with next middleware
  next();
};
