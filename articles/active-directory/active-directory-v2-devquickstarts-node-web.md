<properties
	pageTitle="App Model v2.0 | Microsoft Azure"
	description="How to build a Node JS web app that signs users in with both personal Microsoft Account and work or school accounts."
	services="active-directory"
	documentationCenter="nodejs"
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
  ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="08/02/2015"
	ms.author="brandwe"/>

# App Model v2.0 Preview: Add sign-in to an nodeJS Web App


  > [AZURE.NOTE]
    This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).


Here we'll use Passport to:

- Sign the user into the app using Azure AD and the v2.0 app model.
- Display some information about the user.
- Sign the user out of the app.

In order to do this, you'll need to:

1. Register an app.
2. Set up your app to use the Passport-azure-ad strategy.
3. Use Passport to issue sign-in and sign-out requests to Azure AD.
4. Print out data about the user.

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git```

The completed application is provided at the end of this tutorial as well.

## *1. Register an App*
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Web** platform for your app.
- Enter the correct **Redirect URI**. The redirect uri indicates to Azure AD where authentication responses should be directed - the default for this tutorial is `http://localhost:3000/auth/openid/return`.

## *2. Set up your app to use the passport-node-js strategy*
Here, we'll configure the Express middleware to use the OpenID Connect authentication protocol.  Passport will be used to issue sign-in and sign-out requests, manage the user's session, and get information about the user, amongst other things.

-	To begin, open the `config.js` file in the root of the project, and enter your app's configuration values in the `exports.creds` section.
    -	The `clientID:` is the **Application Id** assigned to your app in the registration portal.
    -	The `returnURL` is the **Redirect Uri** you entered in the portal.
    - The `clientSecret` is the secret you generated in the portal
    - The `realm` is the **Redirect Uri** you entered in the portal without the route. (example: http//localhost:3000)
    - The `issuer` is where you append the **Application Id** after, as an example: https://sts.windows.net/96702724-991f-4576-bc90-be9862749ac5/

- Next open `app.js` file in the root of the proejct and add the follwing call to invoke the `OIDStrategy` strategy that comes with `passport-azure-ad`


```JavaScript
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
```

- After that, use the strategy we just referenced to handle our login requests

```JavaScript
// Use the OIDCStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier), and invoke a callback
//   with a user object.
passport.use(new OIDCStrategy({
    callbackURL: config.creds.returnURL,
    realm: config.creds.realm,
    clientID: config.creds.clientID,
    clientSecret: config.creds.clientSecret,
    oidcIssuer: config.creds.issuer,
    identityMetadata: config.creds.identityMetadata,
    skipUserProfile: true // doesn't fetch user profile
  },
  function(iss, sub, email, claims, profile, accessToken, refreshToken, done) {
    log.info('We received claims of: ', claims);
    log.info('Example: Email address we received was: ', claims.preferred_username);
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByEmail(claims.preferred_username, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(claims);
          return done(null, claims);
        }
        return done(null, user);
      });
    });
  }
));
```
Passport uses a similar pattern for all it’s Strategies (Twitter, Facebook, etc.) that all Strategy writers adhere to. Looking at the strategy you see we pass it a function() that has a token and a done as the parameters. The strategy will dutifully come back to us once it does all it’s work. Once it does we’ll want to store the user and stash the token so we won’t need to ask for it again.

**SIDEBAR:** Auto-registration and why you shouldn’t do it

The code above takes any user that happens to authenticate to our server. This is known as auto registration. In production servers you wouldn’t want to let anyone in without first having them go through a registration process you decide. This is usually the pattern you see in consumer apps who allow you to register with Facebook but then ask you to fill out additional information. If this wasn’t a command line program, we could have just extracted the email from the token object that is returned and then asked them to fill out additional information. Since this is a test server we simply add them to the in-memory database.

**SIDEBAR 2:** Using the “owner” we get from the token.

When writing APIs you should always link the data to something unique from the token that the user can’t spoof. When this server stores TODO items, it stores them based on the subscription ID of the user in the token (called through token.sub) which we put in the “owner” field. This ensures that only that user can access his TODOs and no one else can access the TODOs entered. There is no exposure in the API of “owner” so an external user can request other’s TODOs even if they are authenticated.

- Next, let's add the methods that will allow us to keep track of the logged in users as required by Passport. This includes serializing and deserializing the user's information:

```JavaScript

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.preferred_username);
});

passport.deserializeUser(function(id, done) {
  findByEmail(id, function (err, user) {
    done(err, user);
  });
});

// array to hold logged in users
var users = [];

var findByEmail = function(email, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.preferred_username === email) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

```

- Next, let's add the code to load the express engine. Here you see we use the default /views and /routes pattern that Express provides.

```JavaScript

var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(cookieParser());
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(bodyParser.urlencoded({ extended : true }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

```

## *3. Use Passport to issue sign-in and sign-out requests to Azure AD*

Your app is now properly configured to communicate with the v2.0 endpoint using the OpenID Connect authentication protocol.  `passport-azure-ad` has taken care of all of the ugly details of crafting authentication messages, validating tokens from Azure AD, and maintaining user session.  All that remains is to give your users a way to sign in, sign out, and gather additional info on the logged in user.

- First, lets add the default, login, account, and logout methods to our `app.js` file:

```JavaScript


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', 
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    log.info('Login was called in the Sample');
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

```

-	Let's review these in detail:
    -	The `/` route will redirect to the index.ejs view passing the user in the request (if it exists)
    - The `/account` route will first ***ensure we are authenticated*** (we implement that below) and then pass the user in the request so that we can get additional information about the user.
    - The `/login` route will call our azuread-openidconnect authenticator from `passport-azuread` and if that doesn't succeed will redirect the user back to /login
    - The `/logout` will simply call the logout.ejs (and route) which clears cookies and then return the user back to index.ejs


- For the last part of `app.js`, let's add the EnsureAuthenticated method that is used in `/account` above.

```JavaScript

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
```

- Finally, let's actually create the server itself in `app.js`:

```JavaScript

app.listen(3000);

```


## *4. Create the views and routes in express to display our user in the website*

We have our `app.js` complete. Now we simply need to add the routes and views that will show the information we get to the user as well as handle the `/logout` and `/login` routes we've created.

- Create the `/routes/index.js` route under the root directory.

```JavaScript
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
```

- Create the `/routes/user.js` route under the root directory

```JavaScript
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
```

These simple routes will just pass along the request to our views, including the user if present.

- Create the `/views/index.ejs` view under the root directory. this is a simple page that will call our login and logout methods and allow us to grab account information. Notice that we can use the conditional `if (!user)` as the user being passed through in the request is evidence we have a logged in user.

```JavaScript
<% if (!user) { %>
	<h2>Welcome! Please log in.</h2>
	<a href="/login">Log In</a>
<% } else { %>
	<h2>Hello, <%= user.name %>.</h2>
	<a href="/account">Account Info</a></br>
	<a href="/logout">Log Out</a>
<% } %>
```

- Create the `/views/account.ejs` view under the root directory so that we can view additional information that `passport-azuread` has put in the user request.

```Javascript
<% if (!user) { %>
	<h2>Welcome! Please log in.</h2>
	<a href="/login">Log In</a>
<% } else { %>
<p>displayName: <%= user.name %></p>
<p>Profile ID: <%= user.sub %></p>
<a href="/logout">Log Out</a>
<% } %>
```

- Finally, let's make this look pretty by adding a layout. Create the '/views/layout.ejs' view under the root directory

```JavaScript

<!DOCTYPE html>
<html>
	<head>
		<title>Passport-OpenID Example</title>
	</head>
	<body>
		<% if (!user) { %>
			<p>
			<a href="/">Home</a> | 
			<a href="/login">Log In</a>
			</p>
		<% } else { %>
			<p>
			<a href="/">Home</a> | 
			<a href="/account">Account</a> | 
			<a href="/logout">Log Out</a>
			</p>
		<% } %>
		<%- body %>
	</body>
</html>
```

Finally, build and run your app! 

Run `node app.js` and navigate to http://localhost:3000


Sign in with either a personal Microsoft Account or a work or school account, and notice how the user's identity is reflected in the /account list.  You now have a web app secured using industry standard protocols that can authenticate users with both their personal and work/school accounts.

For reference, the completed sample (without your configuration values) [is provided as a .zip here](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs/archive/complete.zip), or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git```

You can now move onto more advanced topics.  You may want to try:

[Secure a Web API with the v2.0 app model >>](active-directory-devquickstarts-webapi-dotnet.md)

For additional resources, check out:
- [The App Model v2.0 Preview >>](active-directory-appmodel-v2-overview.md)
- [StackOverflow "azure-active-directory" tag >>](http://stackoverflow.com/questions/tagged/azure-active-directory)
