<properties
	pageTitle="Add sign-in to a Node.js web app for Azure B2C preview | Microsoft Azure"
	description="How to build a Node.js web app that signs in users by using a B2C tenant."
	services="active-directory-b2c"
	documentationCenter=""
	authors="brandwe"
	manager="msmbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
  ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="hero-article"
	ms.date="07/22/2016"
	ms.author="brandwe"/>


# B2C preview: Add sign-in to a Node.js web app

**Passport** is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively installed in any Express-based or Restify web application. A comprehensive set of strategies supports authentication by using a user name and password, Facebook, Twitter, and more. 

> [AZURE.NOTE] This article does not cover how to implement sign-in, sign-up and profile management by using Azure Active Directory B2C. It focuses on calling web APIs after the user is authenticated. If you haven't already, you should start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

We have developed a strategy for Azure Active Directory (Azure AD). You will install this module and then add the Azure AD `passport-azure-ad` plug-in.

To do this, you need to:

1. Register an application by using Azure AD.
2. Set up your app to use the `passport-azure-ad` plug-in.
3. Use Passport to issue sign-in and sign-out requests to Azure AD.
4. Print user data.

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-NodeJS). To follow along, you can [download the app's skeleton as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-NodeJS/archive/skeleton.zip). You can also clone the skeleton:

```git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-NodeJS.git```

The completed application is provided at the end of this tutorial.

> [AZURE.WARNING] 	For this B2C preview, you must use the same **Client ID**/**Application ID** and policies for both the web API task server and the client that connects to it. This is also true for the iOS and Android tutorials. If you have previously created an application in either of those Quickstarts, use those values; don't create new ones.

## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue in this guide.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to communicate securely with your app. Both the client app and web API will be represented by a single **Application ID**, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **web app**/**web API** in the application.
- Enter `http://localhost/TodoListService` as a **Reply URL**. It is the default URL for this code sample.
- Create an **Application secret** for your application and copy it. You will need it later. Note that this value needs to be [XML escaped](https://www.w3.org/TR/2006/REC-xml11-20060816/#dt-escape) before you use it.
- Copy the **Application ID** that is assigned to your app. You'll also need this later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This app contains three identity experiences: sign up, sign in, and sign in by using Facebook. You need to create one policy of each type, as described in the [policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create your three policies, be sure to:

- Choose the **Display name** and other sign-up attributes in your sign-up policy.
- Choose the **Display name** and **Object ID** application claims in every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need these policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you create your three policies, you're ready to build your app.

Note that this article does not cover how to use the policies you just created. To learn about how policies work in Azure AD B2C, start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Add prerequisites to your directory

From the command line, change directories to your root folder, if you're not already there. Run the following commands:

- `npm install express`
- `npm install ejs`
- `npm install ejs-locals`
- `npm install restify`
- `npm install mongoose`
- `npm install bunyan`
- `npm install assert-plus`
- `npm install passport`
- `npm install webfinger`
- `npm install body-parser`
- `npm install express-session`
- `npm install cookie-parser`

In addition, we used `passport-azure-ad` for our preview in the skeleton of the Quickstart.

- `npm install passport-azure-ad`

This will install the libraries that `passport-azure-ad` depends on.

## Set up your app to use the Passport-Node.js strategy
Configure the Express middleware to use the OpenID Connect authentication protocol. Passport will be used to issue sign-in and sign-out requests, manage user sessions, and get information about users, among other actions.

Open the `config.js` file in the root of the project and enter your app's configuration values in the `exports.creds` section.
- `clientID`: The **Application ID** assigned to your app in the registration portal.
- `returnURL`: The **Redirect URI** you entered in the portal.
- `tenantName`: The tenant name of your app, for example, **contoso.onmicrosoft.com**.

[AZURE.INCLUDE [active-directory-b2c-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

Open the `app.js` file in the root of the project. Add the following call to invoke the `OIDCStrategy` strategy that comes with `passport-azure-ad`.


```JavaScript
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// Add some logging
var log = bunyan.createLogger({
    name: 'Microsoft OIDC Example Web Application'
});
```

Use the strategy you just referenced to handle sign-in requests.

```JavaScript
// Use the OIDCStrategy in Passport (Section 2).
//
//   Strategies in Passport require a "validate" function that accepts
//   credentials (in this case, an OpenID identifier), and invokes a callback
//   by using a user object.
passport.use(new OIDCStrategy({
    callbackURL: config.creds.returnURL,
    realm: config.creds.realm,
    clientID: config.creds.clientID,
    oidcIssuer: config.creds.issuer,
    identityMetadata: config.creds.identityMetadata,
    skipUserProfile: config.creds.skipUserProfile,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    tenantName: config.creds.tenantName
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
    log.info('Example: Email address we received was: ', profile.email);
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
Passport uses a similar pattern for all of its strategies (including Twitter and Facebook). All strategy writers adhere to this pattern. When you look at the strategy, you can see that you pass it a `function()` that has a token and a `done` as the parameters. The strategy comes back to you after it has done all of its work. Store the user and stash the token so that you don’t need to ask for it again.

> [AZURE.IMPORTANT]
The preceding code takes all users whom the server authenticates. This is autoregistration. When you use production servers, you don’t want to let in users unless they have gone through a registration process that you have set up. You can often see this pattern in consumer apps. These allow you to register by using Facebook, but then they ask you to fill out additional information. If our application wasn’t a sample, we could extract an email address from the token object that is returned, and then ask the user to fill out additional information. Because this is a test server, we simply add users to the in-memory database.

Add the methods that allow you to keep track of users who have signed in, as required by Passport. This includes serializing and deserializing user information:

```JavaScript

// Passport session setup. (Section 2)

//   To support persistent sign-in sessions, Passport needs to be able to
//   serialize users into and deserialize users out of sessions. Typically,
//   this is as simple as storing the user ID when Passport serializes a user
//   and finding the user by ID when Passport deserializes that user.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(id, done) {
  findByEmail(id, function (err, user) {
    done(err, user);
  });
});

// Array to hold users who have signed in
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

Add the code to load the Express engine. In the following, you can see that we use the default `/views` and `/routes` pattern that Express provides.

```JavaScript

// configure Express (Section 2)

var app = express();


app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(cookieParser());
  app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: false }));
  app.use(bodyParser.urlencoded({ extended : true }));
  // Initialize Passport!  Also use passport.session() middleware to support
  // persistent sign-in sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/../../public'));
});

```

Add the `POST` routes that hand off the actual sign-in requests to the `passport-azure-ad` engine:

```JavaScript

// Our Auth routes (Section 3)

// GET /auth/openid
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in OpenID authentication involves redirecting
//   the user to an OpenID provider. After the user is authenticated,
//   the OpenID provider redirects the user back to this application at
//   /auth/openid/return

app.get('/auth/openid',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    log.info('Authentication was called in the Sample');
    res.redirect('/');
  });

// GET /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   sign-in page. Otherwise, the primary route function will be called.
//   In this example, it redirects the user to the home page.
app.get('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {

    res.redirect('/');
  });

// POST /auth/openid/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   sign-in page. Otherwise, the primary route function will be called.
//   In this example, it will redirect the user to the home page.

app.post('/auth/openid/return',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
  function(req, res) {

    res.redirect('/');
  });
```

## Use Passport to issue sign-in and sign-out requests to Azure AD

Your app is now properly configured to communicate with the v2.0 endpoint by using the OpenID Connect authentication protocol. `passport-azure-ad` has taken care of the details of crafting authentication messages, validating tokens from Azure AD, and maintaining user session. All that remains is to give your users a way to sign in and sign out, and to gather additional information on users who have signed in.

First, add the default, sign-in, account, and sign-out methods to your `app.js` file:

```JavaScript

//Routes (Section 4)

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

To review these methods in detail:
- The `/` route redirects to the `index.ejs` view by passing the user in the request (if it exists).
- The `/account` route first verifies that you are authenticated (the implementation for this is below). It then passes the user in the request so that you can get additional information about the user.
- The `/login` route calls the `azuread-openidconnect` authenticator from `passport-azure-ad`. If it doesn't succeed, the route redirects the user back to `/login`.
- `/logout` simply calls `logout.ejs` (and its route). This clears cookies and then returns the user back to `index.ejs`.


For the last part of `app.js`, add the `EnsureAuthenticated` method that is used in the `/account` route.

```JavaScript

// Simple route middleware to ensure that the user is authenticated. (Section 4)

//   Use this route middleware on any resource that needs to be protected. If
//   the request is authenticated (typically via a persistent sign-in session),
//   then the request will proceed. Otherwise, the user will be redirected to the
//   sign-in page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

```

Finally, create the server itself in `app.js`.

```JavaScript

app.listen(3000);

```


## Create the views and routes in Express to call your policies

Your `app.js` is now complete. You just need to add the routes and views that allow you to call the sign-in and sign-up policies. These also handle the `/logout` and `/login` routes you created.

Create the `/routes/index.js` route under the root directory.

```JavaScript

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
```

Create the `/routes/user.js` route under the root directory.

```JavaScript

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
```

These simple routes pass along requests to your views. They include the user, if one is present.

Create the `/views/index.ejs` view under the root directory. This is a simple page that calls policies for sign-in and sign-out. You can also use it to grab account information. Note that you can use the conditional `if (!user)` as the user is passed through in the request to provide evidence that the user is signed in.

```JavaScript
<% if (!user) { %>
	<h2>Welcome! Please sign in.</h2>
	<a href="/login/?p=your facebook policy">Sign in with Facebook</a>
	<a href="/login/?p=your email sign-in policy">Sign in with email</a>
	<a href="/login/?p=your email sign-up policy">Sign up with email</a>
<% } else { %>
	<h2>Hello, <%= user.displayName %>.</h2>
	<a href="/account">Account info</a></br>
	<a href="/logout">Log out</a>
<% } %>
```

Create the `/views/account.ejs` view under the root directory so that you can view additional information that `passport-azure-ad` put in the user request.

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
<p>Full Claims</p>
<%- JSON.stringify(user) %>
<p></p>
<a href="/logout">Log Out</a>
<% } %>
```

You can now build and run your app.

Run `node app.js` and navigate to `http://localhost:3000`


Sign up or sign in to the app by using email or Facebook. Sign out and sign back in as a different user.

##Next steps

For reference, the completed sample (without your configuration values) [is provided as a .zip file](https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-NodeJS/archive/complete.zip). You can also clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-WebApp-OpenIDConnect-nodejs.git```

You can now move on to more advanced topics. You might try:

[Secure a web API by using the B2C model in Node.js](active-directory-b2c-devquickstarts-api-node.md)

<!--

For additional resources, check out:
You can now move on to more advanced B2C topics. You might try:

[Call a Node.js web API from a Node.js web app]()

[Customizing the your B2C App's UX >>]()

-->
