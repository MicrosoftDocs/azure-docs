---
title: Azure Active Directory v2.0 Node.js web app sign-in | Microsoft Docs
description: Learn how to build a Node.js web app that signs in a user by using both a personal Microsoft account and a work or school account.
services: active-directory
documentationcenter: nodejs
author: brandwe
manager: mbaldwin
editor: ''

ms.assetid: 1b889e72-f5c3-464a-af57-79abf5e2e147
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: article
ms.date: 05/13/2017
ms.author: brandwe
ms.custom: aaddev

---
# Add sign-in to a Node.js web app

> [!NOTE]
> Not all Azure Active Directory scenarios and features work with the v2.0 endpoint. To determine whether you should use the v2.0 endpoint or the v1.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).
> 

In this tutorial, we use Passport to do the following tasks:

* In a web app, sign in the user by using Azure Active Directory (Azure AD) and the v2.0 endpoint.
* Display information about the user.
* Sign the user out of the app.

**Passport** is authentication middleware for Node.js. Flexible and modular, Passport can be unobtrusively dropped into any Express-based or restify web application. In Passport, a comprehensive set of strategies support authentication by using a username and password, Facebook, Twitter, or other options. We have developed a strategy for Azure AD. In this article, we show you how to install the module, and then add the Azure AD `passport-azure-ad` plug-in.

## Download
The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs). To follow the tutorial, you can [download the app's skeleton as a .zip file](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs/archive/skeleton.zip) or clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git```

You also can get the completed application at the end of this tutorial.

## 1: Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList), or follow [these detailed steps](active-directory-v2-app-registration.md) to register an app. Make sure you:

* Copy the **Application Id** assigned to your app. You need it for this tutorial.
* Add the **Web** platform for your app.
* Copy the **Redirect URI** from the portal. You must use the default URI value of `urn:ietf:wg:oauth:2.0:oob`.

## 2: Add prerequisities to your directory
At a command prompt, change directories to go to your root folder, if you are not already there. Run the following commands:

* `npm install express`
* `npm install ejs`
* `npm install ejs-locals`
* `npm install restify`
* `npm install mongoose`
* `npm install bunyan`
* `npm install assert-plus`
* `npm install passport`
* `npm install webfinger`
* `npm install body-parser`
* `npm install express-session`
* `npm install cookie-parser`

In addition, we use `passport-azure-ad` in the skeleton of the quickstart:

* `npm install passport-azure-ad`

This installs the libraries that `passport-azure-ad` uses.

## 3: Set up your app to use the passport-node-js strategy
Set up the Express middleware to use the OpenID Connect authentication protocol. You use Passport to issue sign-in and sign-out requests, manage the user's session, and get information about the user, among other things.

1.  In the root of the project, open the Config.js file. In the `exports.creds` section, enter your app's configuration values.
  
  * `clientID`: The **Application Id** that's assigned to your app in the Azure portal.
  * `returnURL`: The **Redirect URI** that you entered in the portal.
  * `clientSecret`: The secret that you generated in the portal.

2.  In the root of the project, open the App.js file. To invoke the OIDCStrategy stratey, which comes with `passport-azure-ad`, add the following call:

  ```JavaScript
  var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

  // Add some logging
  var log = bunyan.createLogger({
      name: 'Microsoft OIDC Example Web Application'
  });
  ```

3.  To handle your sign-in requests, use the strategy you just referenced:

  ```JavaScript
  // Use the OIDCStrategy within Passport (section 2)
  //
  //   Strategies in Passport require a `validate` function. The function accepts
  //   credentials (in this case, an OpenID identifier), and invokes a callback
  //   with a user object.
  passport.use( new OIDCStrategy({
      callbackURL: config.creds.returnURL,
      realm: config.creds.realm,
      clientID: config.creds.clientID,
      clientSecret: config.creds.clientSecret,
      oidcIssuer: config.creds.issuer,
      identityMetadata: config.creds.identityMetadata,
      responseType: config.creds.responseType,
      responseMode: config.creds.responseMode,
      skipUserProfile: config.creds.skipUserProfile
      scope: config.creds.scope
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      log.info('Example: Email address we received was: ', profile.email);
      // Asynchronous verification, for effect...
      process.nextTick(function () {
        findByEmail(profile.email, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  ));
  ```

Passport uses a similar pattern for all its strategies (Twitter, Facebook, and so on). All strategy writers adhere to the pattern. Pass the strategy a `function()` that uses a token and `done` as parameters. The strategy is returned after it does all its work. Store the user and stash the token so you don’t need to ask for it again.

  > [!IMPORTANT]
  > The preceding code takes any user that can authenticate to your server. This is known as auto-registration. On a production server, you wouldn’t want to let anyone in without first having them go through a registration process that you choose. This is usually the pattern that you see in consumer apps. The app might allow you to register with Facebook, but then it asks you to enter additional information. If you weren't using a command-line program for this tutorial, you could extract the email from the token object that is returned. Then, you might ask the user to enter additional information. Because this is a test server, you add the user directly to the in-memory database.
  > 
  > 

4.  Add the methods that you use to keep track of users who are signed in, as required by Passport. This includes serializing and deserializing the user's information:

  ```JavaScript

  // Passport session setup (section 2)

  //   To support persistent login sessions, Passport needs to be able to
  //   serialize users into, and deserialize users out of, the session. Typically,
  //   this is as simple as storing the user ID when serializing, and finding
  //   the user by ID when deserializing.
  passport.serializeUser(function(user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function(id, done) {
    findByEmail(id, function (err, user) {
      done(err, user);
    });
  });

  // Array to hold signed-in users
  var users = [];

  var findByEmail = function(email, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      log.info('we are using user: ', user);
      if (user.email === email) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  };
  ```

5.  Add the code that loads the Express engine. You use the default /views and /routes pattern that Express provides:

  ```JavaScript

  // Set up Express (section 2)

  var app = express();

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

6.  Add the POST routes that hand off the actual sign-in requests to the `passport-azure-ad` engine:

  ```JavaScript

  // Auth routes (section 3)

  // GET /auth/openid
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request. The first step in OpenID authentication involves redirecting
  //   the user to the user's OpenID provider. After authenticating, the OpenID
  //   provider redirects the user back to this application at
  //   /auth/openid/return.

  app.get('/auth/openid',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
      log.info('Authentication was called in the sample');
      res.redirect('/');
    });

  // GET /auth/openid/return
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request. If authentication fails, the user is redirected back to the
  //   sign-in page. Otherwise, the primary route function is called.
  //   In this example, it redirects the user to the home page.
  app.get('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {

      res.redirect('/');
    });

  // POST /auth/openid/return
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request. If authentication fails, the user is redirected back to the
  //   sign-in page. Otherwise, the primary route function is called. 
  //   In this example, it redirects the user to the home page.

  app.post('/auth/openid/return',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {

      res.redirect('/');
    });
  ```

## 4: Use Passport to issue sign-in and sign-out requests to Azure AD
Your app is now set up to communicate with the v2.0 endpoint by using the OpenID Connect authentication protocol. The `passport-azure-ad` strategy takes care of all the details of crafting authentication messages, validating tokens from Azure AD, and maintaining the user session. All that is left to do is to give your users a way to sign in and sign out, and to gather more information about the user who is signed in.

1.  Add the **default**, **login**, **account**, and **logout** methods to your App.js file:

  ```JavaScript

  //Routes (section 4)

  app.get('/', function(req, res){
    res.render('index', { user: req.user });
  });

  app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
  });

  app.get('/login',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
      log.info('Login was called in the sample');
      res.redirect('/');
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  ```

  Here are the details:
    
    * The `/` route redirects to the index.ejs view. It passes the user in the request (if it exists).
    * The `/account` route first *ensures that you are authenticated* (you implement that in the following code). Then, it passes the user in the request. This is so you can get more information about the user.
    * The `/login` route calls your `azuread-openidconnect` authenticator from `passport-azuread`. If that doesn't succeed, it redirects the user back to `/login`.
    * The `/logout` route calls the logout.ejs view (and route). This clears cookies, and then returns the user back to index.ejs.

2.  Add the **EnsureAuthenticated** method that you used earlier in `/account`:

  ```JavaScript

  // Route middleware to ensure the user is authenticated (section 4)

  //   Use this route middleware on any resource that needs to be protected. If
  //   the request is authenticated (typically via a persistent login session),
  //   the request proceeds. Otherwise, the user is redirected to the
  //   sign-in page.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

  ```

3.  In App.js, create the server:

  ```JavaScript

  app.listen(3000);

  ```


## 5: Create the views and routes in Express that you show your user on the website
Add the routes and views that show information to the user. The routes and views also handle the `/logout` and `/login` routes that you created.

1. In the root directory, create the `/routes/index.js` route.

  ```JavaScript

  /*
  * GET home page.
  */

  exports.index = function(req, res){
    res.render('index', { title: 'Express' });
  };
  ```

2.  In the root directory, create the `/routes/user.js` route.

  ```JavaScript

  /*
  * GET users listing.
  */

  exports.list = function(req, res){
    res.send("respond with a resource");
  };
  ```

  `/routes/index.js` and `/routes/user.js` are simple routes that pass along the request to your views, including the user, if present.

3.  In the root directory, create the `/views/index.ejs` view. This page calls your **login** and **logout** methods. You also use the `/views/index.ejs` view to capture account information. You can use the conditional `if (!user)` as the user being passed through in the request. It is evidence that you have a user signed in.

  ```JavaScript
  <% if (!user) { %>
      <h2>Welcome! Please sign in.</h2>
      <a href="/login">Sign in</a>
  <% } else { %>
      <h2>Hello, <%= user.displayName %>.</h2>
      <a href="/account">Account info</a></br>
      <a href="/logout">Sign out</a>
  <% } %>
  ```

4.  In the root directory, create the `/views/account.ejs` view. The `/views/account.ejs` view allows you to view additional information that `passport-azuread` puts in the user request.

  ```Javascript
  <% if (!user) { %>
      <h2>Welcome! Please sign in.</h2>
      <a href="/login">Sign in</a>
  <% } else { %>
  <p>displayName: <%= user.displayName %></p>
  <p>givenName: <%= user.name.givenName %></p>
  <p>familyName: <%= user.name.familyName %></p>
  <p>UPN: <%= user._json.upn %></p>
  <p>Profile ID: <%= user.id %></p>
  <p>Full Claimes</p>
  <%- JSON.stringify(user) %>
  <p></p>
  <a href="/logout">Sign out</a>
  <% } %>
  ```

5.  Add a layout. In the root directory, create the `/views/layout.ejs` view.

  ```HTML

  <!DOCTYPE html>
  <html>
      <head>
          <title>Passport-OpenID Example</title>
      </head>
      <body>
          <% if (!user) { %>
              <p>
              <a href="/">Home</a> |
              <a href="/login">Sign in</a>
              </p>
          <% } else { %>
              <p>
              <a href="/">Home</a> |
              <a href="/account">Account</a> |
              <a href="/logout">Sign out</a>
              </p>
          <% } %>
          <%- body %>
      </body>
  </html>
  ```

6.  To build and run your app, run `node app.js`. Then, go to `http://localhost:3000`.

7.  Sign in with either a personal Microsoft account or a work or school account. Note that the user's identity is reflected in the /account list. 

You now have a web app that is secured by using industry standard protocols. You can authenticate users in your app by using their personal and work or school accounts.

## Next steps
For reference, the completed sample (without your configuration values) is provided as [a .zip file](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs/archive/complete.zip). You also can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git```

Next, you can move on to more advanced topics. You might want to try:

[Secure a Node.js web API by using the v2.0 endpoint](active-directory-v2-devquickstarts-node-api.md)

Here are some additional resources:

* [Azure AD v2.0 developer guide](active-directory-appmodel-v2-overview.md)
* [Stack Overflow "azure-active-directory" tag](http://stackoverflow.com/questions/tagged/azure-active-directory)

### Get security updates for our products
We encourage you to sign up to be notified when security incidents occur. On the [Microsoft Technical Security Notifications](https://technet.microsoft.com/security/dd252948) page, subscribe to Security Advisories Alerts.

