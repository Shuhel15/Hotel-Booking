export const addError = (req, res, next) => {
  res.status(404)
    .render('partials/404',
      { pageTitle: "Page Not Found",
         isLoggedIn: req.isLoggedIn,
         user:req.session.user
      }
      
    );
}