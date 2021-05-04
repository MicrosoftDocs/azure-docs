---
title: Single-page app sign-in & sign-out 
titleSuffix: Microsoft identity platform
description: Learn how to build a single-page application (sign-in)
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/11/2020
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform.
---

# Single-page application: Sign-in and Sign-out

Learn how to add sign-in to the code for your single-page application.

Before you can get tokens to access APIs in your application, you need an authenticated user context. You can sign in users to your application in MSAL.js in two ways:

* [Pop-up window](#sign-in-with-a-pop-up-window), by using the `loginPopup` method
* [Redirect](#sign-in-with-redirect), by using the `loginRedirect` method

You can also optionally pass the scopes of the APIs for which you need the user to consent at the time of sign-in.

> [!NOTE]
> If your application already has access to an authenticated user context or ID token, you can skip the login step and directly acquire tokens. For details, see [SSO without MSAL.js login](msal-js-sso.md#sso-without-msaljs-login).

## Choosing between a pop-up or redirect experience

The choice between a pop-up or redirect experience depends on your application flow:

* If you don't want users to move away from your main application page during authentication, we recommend the pop-up method. Because the authentication redirect happens in a pop-up window, the state of the main application is preserved.

* If users have browser constraints or policies where pop-up windows are disabled, you can use the redirect method. Use the redirect method with the Internet Explorer browser, because there are [known issues with pop-up windows on Internet Explorer](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/internet-explorer.md#popups).

## Sign-in with a pop-up window

# [JavaScript (MSAL.js v2)](#tab/javascript2)

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

let username = "";

const myMsal = new PublicClientApplication(config);

myMsal.loginPopup(loginRequest)
    .then(function (loginResponse) {
        //login success

        // In case multiple accounts exist, you can select
        const currentAccounts = myMsal.getAllAccounts();
    
        if (currentAccounts === null) {
            // no accounts detected
        } else if (currentAccounts.length > 1) {
            // Add choose account code here
        } else if (currentAccounts.length === 1) {
            username = currentAccounts[0].username;
        }
    
    }).catch(function (error) {
        //login failure
        console.log(error);
    });
```

# [JavaScript (MSAL.js v1)](#tab/javascript1)

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

const myMsal = new UserAgentApplication(config);

myMsal.loginPopup(loginRequest)
    .then(function (loginResponse) {
        //login success
    }).catch(function (error) {
        //login failure
        console.log(error);
    });
```

# [Angular (MSAL.js v2)](#tab/angular2)

The MSAL Angular wrapper allows you to secure specific routes in your application by adding `MsalGuard` to the route definition. This guard will invoke the method to sign in when that route is accessed.

```javascript
// In app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
            MsalGuard
        ]
    },
    {
        path: '',
        component: HomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: false })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
```

For a pop-up window experience, set the `interactionType` configuration to `InteractionType.Popup` in the Guard configuration. You can also pass the scopes that require consent as follows:

```javascript
// In app.module.ts
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalModule } from '@azure/msal-angular';

@NgModule({
    imports: [
        MsalModule.forRoot( new PublicClientApplication({
            auth: {
                clientId: 'Enter_the_Application_Id_Here',
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: isIE,
            }
        }), {
            interactionType: InteractionType.Popup, // Msal Guard Configuration
            authRequest: {
                scopes: ['user.read']
            }
        }, null)
    ]
})
export class AppModule { }
```

# [Angular (MSAL.js v1)](#tab/angular1)
The MSAL Angular wrapper allows you to secure specific routes in your application by adding `MsalGuard` to the route definition. This guard will invoke the method to sign in when that route is accessed.
```javascript
// In app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [
      MsalGuard
    ]
  },
  {
    path: '',
    component: HomeComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

For a pop-up window experience, enable the `popUp` configuration option. You can also pass the scopes that require consent as follows:

```javascript
// In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot({
            auth: {
                clientId: 'your_app_id',
            }
        }, {
            popUp: true,
            consentScopes: ["User.ReadWrite"]
        })
    ]
})
```

# [React](#tab/react)

The MSAL React wrapper allows you to protect specific components by wrapping them in the `MsalAuthenticationTemplate` component. This component will invoke login if a user is not already signed in or render child components otherwise.

```javascript
import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";

function WelcomeUser() {
    const { accounts } = useMsal();
    const username = accounts[0].username;
    
    return <p>Welcome, {username}</p>
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <MsalAuthenticationTemplate interactionType={InteractionType.Popup}>
            <p>This will only render if a user is signed-in.</p>
            <WelcomeUser />
        </MsalAuthenticationTemplate>
      )
};
```

You can also use the `@azure/msal-browser` APIs directly to invoke a login paired with the `AuthenticatedTemplate` and/or `UnauthenticatedTemplate` components to render specific contents to signed-in or signed-out users respectively. This is the recommended approach if you need to invoke login as a result of user interaction such as a button click.

```javascript
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function signInClickHandler(instance) {
    instance.loginPopup();
}

// SignInButton Component returns a button that invokes a popup login when clicked
function SignInButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    return <button onClick={() => signInClickHandler(instance)}>Sign In</button>
};

function WelcomeUser() {
    const { accounts } = useMsal();
    const username = accounts[0].username;
    
    return <p>Welcome, {username}</p>
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <>
            <AuthenticatedTemplate>
                <p>This will only render if a user is signed-in.</p>
                <WelcomeUser />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>This will only render if a user is not signed-in.</p>
                <SignInButton />
            </UnauthenticatedTemplate>
        </>
    )
}
```

---

## Sign-in with redirect

# [JavaScript (MSAL.js v2)](#tab/javascript2)

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

let username = "";

const myMsal = new PublicClientApplication(config);

function handleResponse(response) {
    //handle redirect response

    // In case multiple accounts exist, you can select
    const currentAccounts = myMsal.getAllAccounts();

    if (currentAccounts === null) {
        // no accounts detected
    } else if (currentAccounts.length > 1) {
        // Add choose account code here
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
    }
}

myMsal.handleRedirectPromise().then(handleResponse);

myMsal.loginRedirect(loginRequest);
```

# [JavaScript (MSAL.js v1)](#tab/javascript1)

The redirect methods don't return a promise because of the move away from the main app. To process and access the returned tokens, register success and error callbacks before you call the redirect methods.

```javascript

const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const loginRequest = {
    scopes: ["User.ReadWrite"]
}

const myMsal = new UserAgentApplication(config);

function authCallback(error, response) {
    //handle redirect response
}

myMsal.handleRedirectCallback(authCallback);

myMsal.loginRedirect(loginRequest);
```

# [Angular (MSAL.js v2)](#tab/angular2)

The code here is the same as described earlier in the section about sign-in with a pop-up window, except that the `interactionType` is set to `InteractionType.Redirect` for the MsalGuard Configuration, and the `MsalRedirectComponent` is bootstrapped to handle redirects.

```javascript
// In app.module.ts
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MsalModule, MsalRedirectComponent } from '@azure/msal-angular';

@NgModule({
    imports: [
        MsalModule.forRoot( new PublicClientApplication({
            auth: {
                clientId: 'Enter_the_Application_Id_Here',
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: isIE,
            }
        }), {
            interactionType: InteractionType.Redirect, // Msal Guard Configuration
            authRequest: {
                scopes: ['user.read']
            }
        }, null)
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
```

# [Angular (MSAL.js v1)](#tab/angular1)

The code here is the same as described earlier in the section about sign-in with a pop-up window. The default flow is redirect.

# [React](#tab/react)

The MSAL React wrapper allows you to protect specific components by wrapping them in the `MsalAuthenticationTemplate` component. This component will invoke login if a user is not already signed in or render child components otherwise.

```javascript
import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";

function WelcomeUser() {
    const { accounts } = useMsal();
    const username = accounts[0].username;
    
    return <p>Welcome, {username}</p>
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
            <p>This will only render if a user is signed-in.</p>
            <WelcomeUser />
        </MsalAuthenticationTemplate>
      )
};
```

You can also use the `@azure/msal-browser` APIs directly to invoke a login paired with the `AuthenticatedTemplate` and/or `UnauthenticatedTemplate` components to render specific contents to signed-in or signed-out users respectively. This is the recommended approach if you need to invoke login as a result of user interaction such as a button click.

```javascript
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function signInClickHandler(instance) {
    instance.loginRedirect();
}

// SignInButton Component returns a button that invokes a popup login when clicked
function SignInButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    return <button onClick={() => signInClickHandler(instance)}>Sign In</button>
};

function WelcomeUser() {
    const { accounts } = useMsal();
    const username = accounts[0].username;
    
    return <p>Welcome, {username}</p>
}

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <>
            <AuthenticatedTemplate>
                <p>This will only render if a user is signed-in.</p>
                <WelcomeUser />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>This will only render if a user is not signed-in.</p>
                <SignInButton />
            </UnauthenticatedTemplate>
        </>
    )
}
```

---

## Sign-out with a popup window

MSAL.js v2 provides a `logoutPopup` method that clears the cache in browser storage and opens a popup window to the Azure Active Directory (Azure AD) sign-out page. After sign-out, Azure AD redirects the popup back to your application and MSAL.js will close the popup.

You can configure the URI to which Azure AD should redirect after sign-out by setting `postLogoutRedirectUri`. This URI should be registered as a redirect Uri in your application registration.

You can also configure `logoutPopup` to redirect the main window to a different page, such as the home page or sign-in page, after logout is complete by passing `mainWindowRedirectUri` as part of the request.

# [JavaScript (MSAL.js v2)](#tab/javascript2)

```javascript
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", // defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const myMsal = new PublicClientApplication(config);

// you can select which account application should sign out
const logoutRequest = {
    account: myMsal.getAccountByHomeId(homeAccountId),
    mainWindowRedirectUri: "your_app_main_window_redirect_uri"
}

await myMsal.logoutPopup(logoutRequest);
```
# [JavaScript (MSAL.js v1)](#tab/javascript1)

Signing out with a popup window is not supported in MSAL.js v1

# [Angular (MSAL.js v2)](#tab/angular2)

```javascript
// In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot( new PublicClientApplication({
            auth: {
                clientId: 'your_app_id',
                postLogoutRedirectUri: 'your_app_logout_redirect_uri'
            }
        }), null, null)
    ]
})

// In app.component.ts
logout() {
    this.authService.logoutPopup({
        mainWindowRedirectUri: "/"
    });
}
```

# [Angular (MSAL.js v1)](#tab/angular1)

Signing out with a popup window is not supported in MSAL Angular v1

# [React](#tab/react)

```javascript
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function signOutClickHandler(instance) {
    const logoutRequest = {
        account: instance.getAccountByHomeId(homeAccountId),
        mainWindowRedirectUri: "your_app_main_window_redirect_uri",
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
    instance.logoutPopup(logoutRequest);
}

// SignOutButton Component returns a button that invokes a popup logout when clicked
function SignOutButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    return <button onClick={() => signOutClickHandler(instance)}>Sign Out</button>
};

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <>
            <AuthenticatedTemplate>
                <p>This will only render if a user is signed-in.</p>
                <SignOutButton />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>This will only render if a user is not signed-in.</p>
            </UnauthenticatedTemplate>
        </>
    )
}
```

---

## Sign-out with a redirect

MSAL.js provides a `logout` method in v1, and `logoutRedirect` method in v2, that clears the cache in browser storage and redirects the window to the Azure Active Directory (Azure AD) sign-out page. After sign-out, Azure AD redirects back to the page that invoked logout by default.

You can configure the URI to which it should redirect after sign-out by setting `postLogoutRedirectUri`. This URI should be registered as a redirect Uri in your application registration.

# [JavaScript (MSAL.js v2)](#tab/javascript2)

```javascript
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const myMsal = new PublicClientApplication(config);

// you can select which account application should sign out
const logoutRequest = {
    account: myMsal.getAccountByHomeId(homeAccountId)
}

myMsal.logoutRedirect(logoutRequest);
```

# [JavaScript (MSAL.js v1)](#tab/javascript1)

```javascript
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri", //defaults to application start page
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
}

const myMsal = new UserAgentApplication(config);

myMsal.logout();
```

# [Angular (MSAL.js v2)](#tab/angular2)

```javascript
// In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot( new PublicClientApplication({
            auth: {
                clientId: 'your_app_id',
                postLogoutRedirectUri: 'your_app_logout_redirect_uri'
            }
        }), null, null)
    ]
})

// In app.component.ts
logout() {
    this.authService.logoutRedirect();
}
```

# [Angular (MSAL.js v1)](#tab/angular1)

```javascript
//In app.module.ts
@NgModule({
    imports: [
        MsalModule.forRoot({
            auth: {
                clientId: 'your_app_id',
                postLogoutRedirectUri: "your_app_logout_redirect_uri"
            }
        })
    ]
})
// In app.component.ts
this.authService.logout();
```

# [React](#tab/react)

```javascript
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

function signOutClickHandler(instance) {
    const logoutRequest = {
        account: instance.getAccountByHomeId(homeAccountId),
        postLogoutRedirectUri: "your_app_logout_redirect_uri"
    }
    instance.logoutRedirect(logoutRequest);
}

// SignOutButton Component returns a button that invokes a redirect logout when clicked
function SignOutButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const { instance } = useMsal();

    return <button onClick={() => signOutClickHandler(instance)}>Sign Out</button>
};

// Remember that MsalProvider must be rendered somewhere higher up in the component tree
function App() {
    return (
        <>
            <AuthenticatedTemplate>
                <p>This will only render if a user is signed-in.</p>
                <SignOutButton />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>This will only render if a user is not signed-in.</p>
            </UnauthenticatedTemplate>
        </>
    )
}
```

---

## Next steps

Move on to the next article in this scenario, [Acquiring a token for the app](scenario-spa-acquire-token.md).
