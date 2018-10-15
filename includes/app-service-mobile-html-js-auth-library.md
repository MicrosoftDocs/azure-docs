### <a name="server-auth"></a>How to: Authenticate with a provider (Server Flow)
To have Mobile Apps manage the authentication process in your app, you must register your app with your identity
provider. Then in your Azure App Service, you need to configure the application ID and secret provided by your provider.
For more information, see the tutorial [Add authentication to your app](../articles/app-service-mobile/app-service-mobile-cordova-get-started-users.md).

Once you have registered your identity provider, call the `.login()` method with the name of your provider. For
example, to sign in with Facebook use the following code:

```
client.login("facebook").done(function (results) {
     alert("You are now signed in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});
```

The valid values for the provider are 'aad', 'facebook', 'google', 'microsoftaccount', and 'twitter'.

> [!NOTE]
> Google Authentication does not currently work via Server Flow.  To authenticate with Google, you must
> use a [client-flow method](#client-auth).

In this case, Azure App Service manages the OAuth 2.0 authentication flow.  It displays the sign-in page of the selected
provider and generates an App Service authentication token after successful sign-in with the identity provider. The login
function, when complete, returns a JSON object that exposes both the user ID and App Service authentication token
in the userId and authenticationToken fields, respectively. This token can be cached and reused until it expires.

### <a name="client-auth"></a>How to: Authenticate with a provider (Client Flow)

Your app can also independently contact the identity provider and then provide the returned token to your App Service for
authentication. This client flow enables you to provide a single sign-in experience for users or to retrieve additional
user data from the identity provider.

#### Social Authentication basic example

This example uses Facebook client SDK for authentication:

```
client.login(
     "facebook",
     {"access_token": token})
.done(function (results) {
     alert("You are now signed in as: " + results.userId);
}, function (err) {
     alert("Error: " + err);
});

```
This example assumes that the token provided by the respective provider SDK is stored in the token variable.

#### Microsoft Account example

The following example uses the Live SDK, which supports single-sign-on for Windows Store apps by using Microsoft Account:

```
WL.login({ scope: "wl.basic"}).then(function (result) {
      client.login(
            "microsoftaccount",
            {"authenticationToken": result.session.authentication_token})
      .done(function(results){
            alert("You are now signed in as: " + results.userId);
      },
      function(error){
            alert("Error: " + err);
      });
});

```

This example gets a token from Live Connect, which is supplied to your App Service by calling the login function.

### <a name="auth-getinfo"></a>How to: Obtain information about the authenticated user

The authentication information can be retrieved from the `/.auth/me` endpoint using an HTTP call with any AJAX
library.  Ensure you set the `X-ZUMO-AUTH` header to your authentication token.  The authentication token
is stored in `client.currentUser.mobileServiceAuthenticationToken`.  For example, to use the fetch API:

```
var url = client.applicationUrl + '/.auth/me';
var headers = new Headers();
headers.append('X-ZUMO-AUTH', client.currentUser.mobileServiceAuthenticationToken);
fetch(url, { headers: headers })
    .then(function (data) {
        return data.json()
    }).then(function (user) {
        // The user object contains the claims for the authenticated user
    });
```

Fetch is available as [an npm package](https://www.npmjs.com/package/whatwg-fetch) or for browser
download from [CDNJS](https://cdnjs.com/libraries/fetch). You could also use jQuery or another AJAX API
to fetch the information.  Data is received as a JSON object.
