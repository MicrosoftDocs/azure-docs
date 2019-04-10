# Scenario - Sign in users and acquire tokens in a JavaScript single page application(SPA)

## Scenario

### Overview

Many modern web applications are built as client side single page applications written using JavaScript or a SPA framework such as Angular, Vue.js and React.js. These applications run in a web browser and thus have different authentication characteristics than traditional server side web applications. The Microsoft identity platform enables single page applications to sign in users and get tokens to access backend services or web APIs using the [OAuth 2.0 implicit flow](./v2-oauth2-implicit-grant-flow.md). The implicit flow allows the application to get ID tokens to represent the authenticated user and also access tokens needed to call protected APIs.

![Single page apps](./media/scenarios/spa-app.svg)

Note that this authentication flow does not include application scenarios using cross-platform JavaScript frameworks such as Electron, React-Native, etc. since they require further capabilities for interaction with the native platforms.

### Specifics

The following aspects are required to enable this scenario for your application:

* Application registration with Azure AD involves enabling the implicit flow and setting a redirect URI to which tokens are returned.

* Application configuration with the registered application properties such as Applicaiton ID.
* Using MSAL library to perform the auth flow to sign in and acquire tokens.

## MSAL libraries supporting implicit flow

Microsoft identity platform provides MSAL.js library to support the implicit flow using the industry recommended secure practices.  

The libraries supporting implicit flow are:

  MSAL library | Description
  ------------ | ----------
![MSAL.js](media/sample-v2-code/logo_js.png) <br/> [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)  | Plain JavaScript library that can be used in any client side web apps built using JavaScript or SPA frameworks such as Angular, Vue.js, React.js, etc. This library is in public preview with production support.
![MSAL Angular](media/sample-v2-code/logo_angular.png) <br/> [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) | Wrapper of the core MSAL.js library to simplify use in single page apps built with the Angular framework. This library is in public preview and has [known issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues?q=is%3Aopen+is%3Aissue+label%3Aangular) with certain Angular versions and browsers.


## App registration Specifics

Follow the steps to [register a new application with Azure AD](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app), and select the supported accounts for your application. Note that the SPA scenario can support authentication with accounts in your organization or any organization and personal Microsoft accounts.

Next, here are the specific aspects of application registration that apply to single page applications.


### Authentication - Registering a Redirect URI

The implicit flow sends the tokens in a redirect to the single page application running in a web browser. Therefore, it is an important requirement to register a redirect URI where your application can receive the tokens. Please ensure that the redirect URI matches exactly with the URI for your application.

In the [Azure portal](https://go.microsoft.com/fwlink/?linkid=2083908), navigate to your registered application, on the **Authentication** page of the application, select the **Web** platform and enter the value of the redirect URI for your application in the **Redirect URI** field.

### Authentication - Enabling the implicit flow

On the same **Authentication** page, under **Advanced settings**, you must also enable the **Implicit grant**. If your application is only performing sign in of users and getting ID tokens, it is sufficient to enable **ID tokens** checkbox.
If your application also needs to get access tokens to call APIs, make sure to enable the **Access tokens** checkbox as well. For more information, see [ID tokens](./id-tokens.md) and [Access tokens](./access-tokens.md).

## MSAL libraries: Application code configuration

In MSAL library, the application registration information is passed as configuration during the library initialization.

# [JS](#tab/Javascript)

```JS
// Configuration object constructed
const config:Configuration = {

    auth: {
        clientID: 'your_app_id',
        redirectUri: "your_app_redirect_uri" //defaults to application start page
    }
}

// create UserAgentApplication instance
const userAgentApplication = new UserAgentApplication(config);
```

# [Angular](#tab/angular)

```JS
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id'
            })]
         })

  export class AppModule { }
```

# [Other](#tab/other)

```Text
The protocol requests use the client ID and redirect URI as shown below.
```
---

## MSAL libraries: Login

Before you can get tokens to access APIs in your application, you will need an authenticated user context. Use the `loginRedirect` or `loginPopup` methods to login users with MSAL.js. You can also optionally pass the scopes of the APIs for which you need the user to consent at the time of login.

### Login with popup

# [JS](#tab/Javascript)

```JS
var loginRequest: AuthenticationParameters = {
    scopes: ["user.read", "user.write"]
}

userAgentApplication.loginPopup(loginRequest).then(function (AuthResponse r) {
    //login success
}).catch(function (AuthError e) {
    //login failure
    console.log(e);
});
```

# [Angular](#tab/angular)

The MSAL Angular wrapper allows you to secure specific routes in your application by just adding the `MsalGuard` to the route definition. This will invoke the login method when that route is accessed.

```JS
// In app.routes.ts
{ path: 'product', component: ProductComponent, canActivate : [MsalGuard],
    children: [
      { path: 'detail/:id', component: ProductDetailComponent  }
    ]
   },
  { path: 'myProfile' ,component: MsGraphComponent, canActivate : [MsalGuard] },
```

For Popup experience, enable the `popUp` config option. You can also pass the scopes that require consent as follows:

```JS
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                popUp: true,
                consentScopes: ["user.read", "user.write"]
            })]
         })
```

# [Other](#tab/other)

Using the protocol request directly:

```Text
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=your_app_id
&response_type=id_token
&redirect_uri=your_app_redirect_uri
&scope=openid
&response_mode=fragment
&state=12345
&nonce=678910
```
---

### Login with redirect

# [JS](#tab/Javascript)

The redirect methods do not return a promise  due to the navigation away from the main app. To process and access the returned tokens, you will need to register success and error callbacks before calling the redirect methods.

```JS
userAgentApplication.handleRedirectCallbacks(success: tokenReceivedCallback, error: errorReceivedCallback);

var loginRequest: AuthenticationParameters = {
    scopes: ["user.read", "user.write"]
}

try {
    userAgentApplication.loginRedirect(loginRequest);
} catch (AuthError e) {
    console.log(e); // error when callbacks are not registered
}

function tokenReceivedCallback(AuthResponse response) {
    switch(response.tokenType) {
        case "id_token":
            // Call acquireToken
        case "access_token":
            // Call api
        case "id_token_token":
            // Call api
    }
}

function errorReceivedCallback(AuthError e) {
    if (error instanceof ClientAuthError) {
		// Check error and mitigate
	} else if (error instanceof ServerAuthError) {
		// Check error and mitigate
	} else {
		// Unknown error
	}
}
```

# [Angular](#tab/angular)

This is the same as described above under popup section. The default flow is redirect.

# [Other](#tab/other)

This is the same protocol request as shown above.

---

> [!NOTE]
> The ID token does not contain the consented scopes and only represents the authenticated user. The consented scopes are returned in the access token which you will acquire in the next step.

## MSAL libraries: Token acquisition

The pattern for acquiring tokens for APIs with MSAL.js is to first attempt a silent token request using the `acquireTokenSilent` method. The library performs this request from a hidden iframe. This method also allows the library to renew tokens. If the silent token request fails for some reasons such as an expired Azure AD session or a password change, you can invoke an interactive method(which will prompt the user) such as `acquireTokenPopup` or `acquireTokenRedirect` to acquire tokens.

You can set the API scopes that you want the access token to include when building the access token request. Note that all requested scopes may not be granted in the access token based on the user's consent.

### Acquire token with popup

# [JS](#tab/Javascript)

The above pattern using Popup methods:

```JS
var accessTokenRequest: AuthenticationParameters = {
    scopes: ["user.read"]
}

userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(AuthResponse r) {
    // Acquire token silent success
    // call API with token
}).catch(function (AuthError e) {
    //Acquire token silent failure, send an interactive request.
    if (e instanceof InteractionRequiredAuthError) {
        userAgentApplication.acquireTokenPopup(accessTokenRequest).then(function(AuthResponse r) {
            // Acquire token interactive success
        }).catch(function(AuthError e) {
            // Acquire token interactive failure
            console.log(e);
        });
    }
    console.log(e);
});
```

# [Angular](#tab/angular)

The MSAL Angular wrapper provides the convenience of adding the HTTP interceptor `MsalInterceptor` which will automatically acquire access tokens silently and attach them to the HTTP requests to APIs.

You can specify the scopes for APIs in the `protectedResourceMap` config option which the MsalInterceptor will request when automatically acquiring tokens.

```JS
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                protectedResourceMap: {"https://graph.microsoft.com/v1.0/me", ["user.read", "mail.send"]}
            })]
         })

providers: [ ProductService, {
        provide: HTTP_INTERCEPTORS,
        useClass: MsalInterceptor,
        multi: true
    }
   ],
```

For success and failure of the silent token acquisition, MSAL Angular provides callbacks you can subscribe to. It is also important to remember to unsubscribe.

```JS
// In app.component.ts
 ngOnInit() {
    this.subscription=  this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
    });
}

ngOnDestroy() {
   this.broadcastService.getMSALSubject().next(1);
   if(this.subscription) {
     this.subscription.unsubscribe();
   }
 }
```

Alternatively, you can also explicitly acquire tokens using the acquire token methods as described in the core MSAL.js library.

# [Other](#tab/other)

Using the protocol request directly:
```Text
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=your_app_id
&response_type=token
&redirect_uri=your_app_redirect_uri
&scope=https%3A%2F%2Fgraph.microsoft.com%2Fuser.read
&response_mode=fragment
&state=12345
&nonce=678910
&prompt=none
&login_hint=your_username
```

---

### Acquire token with redirect

# [JS](#tab/Javascript)

The pattern is as described above but shown with a redirect method to acquire token interactively. Note that you will need to register the redirect callbacks as mentioned above.

```JS
var accessTokenRequest: AuthenticationParameters = {
    scopes: ["user.read"]
}

userAgentApplication.handleRedirectCallbacks(success: tokenReceivedCallback, error: errorReceivedCallback);


userAgentApplication.acquireTokenSilent(accessTokenRequest).then(function(AuthResponse r) {
    // Acquire token silent success
    // call API with token
}).catch(function (AuthError e) {
    //Acquire token silent failure, send an interactive request.
    if (e instanceof InteractionRequiredAuthError) {
        try {
            userAgentApplication.acquireTokenRedirect(accessTokenRequest);
        } catch (AuthError e) {
            console.log(e); // error when callbacks are not registered
        }
    }
    console.log(e);
});

function tokenReceivedCallback(AuthResponse response) {
    switch(response.tokenType) {
        case "id_token":
            // Call acquireToken
        case "access_token":
            // Call api
        case "id_token_token":
            // Call api
    }
}

function errorReceivedCallback(AuthError e) {
    if (error instanceof ClientAuthError) {
		// Check error and mitigate
	} else if (error instanceof ServerAuthError) {
		// Check error and mitigate
	} else {
		// Unknown error
	}
}
```

# [Angular](#tab/angular)

This is the same as described above.

# [Other](#tab/other)

This is the same protocol request as shown above.

---

> [!NOTE]
> If your application already has an authenticated user context or id token, you can skip the login step and directly acquire tokens. See [sso without msal.js login](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/Sso#sso-to-an-app-without-msaljs-login) for more details.

## MSAL libraries: Logout

The MSAL library provides a logout method that will clear the cache in the browser storage and send a logout request to Azure AD. After logout, it redirects back to the application start page by default.

You can configure the URI to which it should redirect after logout by setting the `postLogoutRedirectUri`. Note that this URI should also be registered as the Logout URI in your application registration.

# [JS](#tab/Javascript)

```JS
const config:Configuration = {

    auth: {
        clientID: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const userAgentApplication = new UserAgentApplication(config);
userAgentApplication.logout();

```

# [Angular](#tab/angular)

```JS
//In app.module.ts
@NgModule({
  imports: [ MsalModule.forRoot({
                clientID: 'your_app_id',
                postLogoutRedirectUri: "your_app_logout_redirect_uri"
            })]
         })

// In app.component.ts
this.authService.logout();
```

# [Other](#tab/other)

Using the protocol request directly:
```Text
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout?post_logout_redirect_uri=your_app_logout_redirect_uri
```

---

## Next steps

Here are a few links to learn more:

- Try the quickstart: [Sign in users and acquire an access token from a JavaScript single page application](./quickstart-v2-javascript.md)

- [MSAL.js Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki)

- [Reference documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/docs/classes/_useragentapplication_.useragentapplication.html)

- Other samples / tutorials:
  - [Call MS Graph API from a JavaScript SPA](./tutorial-v2-javascript-spa.md) is a deep dive of the quickstart sample which shows how to sign in users and get an access token to call the MS Graph API using MSAL.js

  - [SPA with an ASP.NET backend](https://github.com/Azure-Samples/active-directory-javascript-singlepageapp-dotnet-webapi-v2) is a sample demonstrating how to get tokens for your own backend web API using MSAL.js

  - [SPA with Azure AD B2C](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp) shows how to use MSAL.js to sign in users in an app registered with Azure AD B2C.

  - [SPA sample using msal-angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular/samples/MSALAngularDemoApp)

- Protocol documentation: [OAuth 2.0 implicit flow](./v2-oauth2-implicit-grant-flow.md)
