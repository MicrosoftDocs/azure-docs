---
title: Build a Node.js Express web app for sign-in and sign out with Azure Active Directory | Microsoft Docs
description: Learn how to build a Node.js Express MVC web app that integrates with Azure AD for sign-in.
services: active-directory
documentationcenter: nodejs
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 81deecec-dbe2-4e75-8bc0-cf3788645f99
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: quickstart
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to use the Passport authentication middleware to sign in users, get information about the users, and sign out users.
---

# Quickstart: Build a Node.js Express web app for sign-in and sign out with Azure Active Directory

[!INCLUDE [active-directory-develop-applies-v1](../../../includes/active-directory-develop-applies-v1.md)]

Passport is authentication middleware for Node.js. Passport is Flexible and modular, and you can unobtrusively drop it into any Express-based or restify web application. A comprehensive set of strategies support authentication that uses a username and password, Facebook, Twitter, and more. For Azure Active Directory (Azure AD), we'll install this module and then add the Azure AD `passport-azure-ad` plug-in.

In this quickstart, you'll learn how to use Passport to:

* Sign the user in to the app with Azure AD.
* Display information about the user.
* Sign the user out of the app.

To build the complete, working application, you'll need to:

1. Register an app.
2. Set up your app to use the `passport-azure-ad` strategy.
3. Use Passport to issue sign-in and sign-out requests to Azure AD.
4. Print data about the user.

## Prerequisites

To get started, complete these prerequisites:

* [Download the app's skeleton as a .zip file](https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS/archive/skeleton.zip)
  
    * Clone the skeleton:

        ```git clone --branch skeleton https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS.git```

    The code for this quickstart is maintained [on GitHub](https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS). The completed application is provided at the end of this quickstart as well.

* Have an Azure AD tenant in which you can create users and register an application. If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).

## Step 1: Register an app

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the menu at the top of the page, select your account. Under the **Directory** list, choose the Active Directory tenant where you want to register your application.
1. Select **All services** in the menu on the left side of the screen, and then select **Azure Active Directory**.
1. Select **App registrations**, and then select **Add**.
1. Follow the prompts to create a **Web Application** and/or **WebAPI**.

    * The **Name** of the application describes your application to users.
    * The **Sign-On URL** is the base URL of your app. The skeleton's default is `http://localhost:3000/auth/openid/return`.

1. After you register, Azure AD assigns your app a unique application ID. You need this value in the following sections, so copy it from the application page.
1. From the **Settings > Properties** page for your application, update the App ID URI. 
    
    The **App ID URI** is a unique identifier for your application. The convention is to use the format `https://<tenant-domain>/<app-name>`, for example: `https://contoso.onmicrosoft.com/my-first-aad-app`.

1. From the **Settings > Reply URLs** page for your application, add the URL added in Sign-on URL from Step 5 and select **Save**.
1. To create a secret key, follow step 4 in [To add application credentials, or permissions to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#to-add-application-credentials-or-permissions-to-access-web-apis).

   > [!IMPORTANT]
   > Copy the application key value. This is the value for the `clientSecret`, which you'll need for **Step 3** below. 

## Step 2: Add prerequisites to your directory

1. From the command line, change directories to your root folder if you're not already there, and then run the following commands:

    * `npm install express`
    * `npm install ejs`
    * `npm install ejs-locals`
    * `npm install restify`
    * `npm install mongoose`
    * `npm install bunyan`
    * `npm install assert-plus`
    * `npm install passport`

1. You also need `passport-azure-ad` so run the following command:

    * `npm install passport-azure-ad`

This installs the libraries that `passport-azure-ad` depends on.

## Step 3: Set up your app to use the passport-node-js strategy

Here, you'll configure Express to use the OpenID Connect authentication protocol. Passport is used to do various things, including issue sign-in and sign-out requests, manage the user's session, and get information about the user.

1. Open the `config.js` file at the root of the project, and then enter your app's configuration values in the `exports.creds` section.

    * The `clientID` is the **Application Id** that's assigned to your app in the registration portal.
    * The `returnURL` is the **Reply URL** that you entered in the portal.
    * The `clientSecret` is the secret that you generated in the portal.

1. Next, open the `app.js` file in the root of the project. Then add the following call to invoke the `OIDCStrategy` strategy that comes with `passport-azure-ad`.

    ```JavaScript
    var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

    // add a logger

    var log = bunyan.createLogger({
        name: 'Microsoft OIDC Example Web Application'
    });
    ```

1. After that, use the strategy we just referenced to handle our sign-in requests.

    ```JavaScript
    // Use the OIDCStrategy within Passport. (Section 2)
    //
    //   Strategies in passport require a `validate` function that accepts
    //   credentials (in this case, an OpenID identifier), and invokes a callback
    //   with a user object.
    passport.use(new OIDCStrategy({
        callbackURL: config.creds.returnURL,
        realm: config.creds.realm,
        clientID: config.creds.clientID,
        clientSecret: config.creds.clientSecret,
        oidcIssuer: config.creds.issuer,
        identityMetadata: config.creds.identityMetadata,
        skipUserProfile: config.creds.skipUserProfile,
        responseType: config.creds.responseType,
        responseMode: config.creds.responseMode
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
        if (!profile.email) {
        return done(new Error("No email found"), null);
        }
        // asynchronous verification, for effect...
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
   Passport uses a similar pattern for all its strategies (Twitter, Facebook, and so on) that all strategy writers adhere to. Looking at the strategy, you see that we pass it a function that has a token and a done as the parameters. The strategy comes back to us after it does its work. Then we want to store the user and stash the token so we don't need to ask for it again.

   > [!IMPORTANT]
   > The previous code takes any user that happens to authenticate to our server. This is known as auto-registration. We    recommend that you don't let anyone authenticate to a production server without first having them register via a process that you decide on. This is usually the pattern you see in consumer apps, which allow you to register with Facebook but then ask you to provide additional information. If this weren't a sample application, we could have extracted the user's email address from the token object that is returned and then asked the user to fill out additional information. Because this is a test server, we add them to the in-memory database.

1. Add the methods that enable us to track the signed-in users as required by Passport. These methods include serializing and deserializing the user's information.

    ```JavaScript
    // Passport session setup. (Section 2)

    //   To support persistent sign-in sessions, Passport needs to be able to
    //   serialize users into the session and deserialize them out of the session. Typically,
    //   this is done simply by storing the user ID when serializing and finding
    //   the user by ID when deserializing.
    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function(id, done) {
        findByEmail(id, function (err, user) {
            done(err, user);
        });
    });

    // array to hold signed-in users
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

1. Add the code to load the Express engine. Here we use the default /views and /routes pattern that Express provides.

    ```JavaScript
    // configure Express (section 2)

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

1. Finally, add the routes that hand off the actual sign-in requests to the `passport-azure-ad` engine:

    ```JavaScript
    // Our Auth routes (section 3)

    // GET /auth/openid
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request. The first step in OpenID authentication involves redirecting
    //   the user to their OpenID provider. After authenticating, the OpenID
    //   provider redirects the user back to this application at
    //   /auth/openid/return.
    app.get('/auth/openid',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
    function(req, res) {
        log.info('Authentication was called in the Sample');
        res.redirect('/');
    });

    // GET /auth/openid/return
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request. If authentication fails, the user is redirected back to the
    //   sign-in page. Otherwise, the primary route function is called,
    //   which, in this example, redirects the user to the home page.
    app.get('/auth/openid/return',
      passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
      function(req, res) {
        log.info('We received a return from AzureAD.');
        res.redirect('/');
      });

    // POST /auth/openid/return
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request. If authentication fails, the user is redirected back to the
    //   sign-in page. Otherwise, the primary route function is called,
    //   which, in this example, redirects the user to the home page.
    app.post('/auth/openid/return',
      passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
      function(req, res) {
        log.info('We received a return from AzureAD.');
        res.redirect('/');
      });
    ```

## Step 4: Use Passport to issue sign-in and sign-out requests to Azure AD

Your app is now properly configured to communicate with the endpoint by using the OpenID Connect authentication protocol. `passport-azure-ad` has taken care of all the details of crafting authentication messages, validating tokens from Azure AD, and maintaining user sessions. All that remains is giving your users a way to sign in and sign out, and gathering additional information about the signed-in users.

1. Add the default, sign-in, account, and sign-out methods to our `app.js` file:

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
        log.info('Login was called in the Sample');
        res.redirect('/');
    });

    app.get('/logout', function(req, res){
      req.logout();
      res.redirect('/');
    });
    ```

1. Review these in detail:

    * The `/`route redirects to the index.ejs view, passing the user in the request (if it exists).
    * The `/account` route first *ensures we are authenticated* (we implement that in the following example), and then passes the user in the request so that we can get additional information about the user.
    * The `/login` route calls our azuread-openidconnect authenticator from `passport-azuread`. If that doesn't succeed, it redirects the user back to /login.
    * The `/logout` route simply calls the logout.ejs (and route), which clears cookies and then returns the user back to index.ejs.

1. For the last part of `app.js`, add the **EnsureAuthenticated** method that is used in `/account`, as shown earlier.

    ```JavaScript
    // Simple route middleware to ensure user is authenticated. (section 4)

    //   Use this route middleware on any resource that needs to be protected. If
    //   the request is authenticated (typically via a persistent sign-in session),
    //   the request proceeds. Otherwise, the user is redirected to the
    //   sign-in page.
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/login')
    }
    ```

1. Finally, create the server itself in `app.js`:

    ```JavaScript
    app.listen(3000);
    ```

## Step 5: To display our user in the website, create the views and routes in Express

Now `app.js` is complete. You simply need to add the routes and views that show the information we get to the user, as well as handle the `/logout` and `/login` routes that we  created.

1. Create the `/routes/index.js` route under the root directory.

    ```JavaScript
    /*
     * GET home page.
     */

    exports.index = function(req, res){
      res.render('index', { title: 'Express' });
    };
    ```

1. Create the `/routes/user.js` route under the root directory.

    ```JavaScript
    /*
     * GET users listing.
     */

    exports.list = function(req, res){
      res.send("respond with a resource");
    };
    ```

    These pass along the request to our views, including the user if present.

1. Create the `/views/index.ejs` view under the root directory. This is a simple page that calls our login and logout methods and enables us to grab account information. Notice that we can use the conditional `if (!user)` as the user being passed through in the request is evidence we have a signed-in user.

    ```JavaScript
    <% if (!user) { %>
        <h2>Welcome! Please log in.</h2>
        <a href="/login">Log In</a>
    <% } else { %>
        <h2>Hello, <%= user.displayName %>.</h2>
        <a href="/account">Account Info</a></br>
        <a href="/logout">Log Out</a>
    <% } %>
    ```

1. Create the `/views/account.ejs` view under the root directory so that we can view additional information that `passport-azure-ad` has put in the user request.

    ```Javascript
    <% if (!user) { %>
        <h2>Welcome! Please log in.</h2>
        <a href="/login">Log In</a>
    <% } else { %>
    <p>displayName: <%= user.displayName %></p>
    <p>givenName: <%= user.name.givenName %></p>
    <p>familyName: <%= user.name.familyName %></p>
    <p>UPN: <%= user._json.upn %></p>
    <p>Profile ID: <%= user.id %></p>
    <p>Full Claimes</p>
    <%- JSON.stringify(user) %>
    <p></p>
    <a href="/logout">Log Out</a>
    <% } %>
    ```

1. Add a layout to enhance the appearance of the page. Create the `/views/layout.ejs` view under the root directory.

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

## Step 6: Build and run your app

1. Run `node app.js`, and then go to `http://localhost:3000`.
1. Sign in with either a personal Microsoft account or a work or school account.

    Notice how the user's identity is reflected in the /account list. You now have a web app that's secured with industry standard protocols that can authenticate users with both their personal and work/school accounts.

    For reference, the completed sample (without your configuration values) [is provided as a .zip file](https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS/archive/master.zip). Alternatively, you can clone it from GitHub:

    ```git clone --branch master https://github.com/AzureADQuickStarts/WebApp-OpenIDConnect-NodeJS.git```

## Next steps

You can now move on to try other scenarios:

> [!div class="nextstepaction"]
> [Secure a Web API with Azure AD](quickstart-v1-nodejs-webapi.md)