export const sendCookie = (user, res, statusCode, msg) => {
  const token = user.getJwtToken();

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    sameSite: 'None',
    secure: true,
    // domain: 'www.rashidyachts-marina.com', 
    path: '/', 
  };

  if (msg !== undefined) {
    res.status(statusCode).cookie("token", token, cookieOptions).json({
      success: true,
      user,
      message: msg,
    });
  } else {
    res.status(statusCode).cookie("token", token, cookieOptions).json({
      success: true,
      user,
    });
  }
}
