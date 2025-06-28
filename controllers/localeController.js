export function changeLocale(req, res, next) {
  const locale = req.params.locale;

  //set a cookie to the response
  res.cookie("nodeapp-locale", locale, {
    maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
  });
  //redirect the same page
  res.redirect("back");
}
