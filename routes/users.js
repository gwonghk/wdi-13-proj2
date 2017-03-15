module.exports = function(app, passport){

	// logout
	 app.get('/logout', function(req, res){
	    req.logout();
	    res.redirect('/');
	  });

	// go Home
	app.get('/home', function(req, res){
		// make sure that they have logged in
	    if(req.user){
	    	res.render('home', {});
	    }else{
	        res.redirect("/");
	    }
	});

	// go Error
	app.get('/error', function(req, res){
		res.send("404");
	});

	/**
	 *	Facebook
	 */
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'})); //change scope: email to find the email from the FB json file, makes it accessible for me
	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/home',
		failureRedirect: '/error'
	}));
}

