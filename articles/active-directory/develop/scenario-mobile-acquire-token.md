---
title: Acquire a token to call a web API (mobile apps)
description: Learn how to build a mobile app that calls web APIs. (Get a token for the app.)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: henrymbugua
ms.reviewer: brandwe, jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform.
---

# Get a token for a mobile app that calls web APIs

Before your app can call protected web APIs, it needs an access token. This article walks you through the process to get a token by using the Microsoft Authentication Library (MSAL).

## Define a scope

When you request a token, define a scope. The scope determines what data your app can access.

The easiest way to define a scope is to combine the desired web API's `App ID URI` with the scope `.default`. This definition tells the Microsoft identity platform that your app requires all scopes that are set in the portal.

### Android
```Java
String[] SCOPES = {"https://graph.microsoft.com/.default"};
```

### iOS
```swift
let scopes = ["https://graph.microsoft.com/.default"]
```

### Xamarin
```csharp
var scopes = new [] {"https://graph.microsoft.com/.default"};
```

## Get tokens

### Acquire tokens via MSAL

MSAL allows apps to acquire tokens silently and interactively. When you call `AcquireTokenSilent()` or `AcquireTokenInteractive()`, MSAL returns an access token for the requested scopes. The correct pattern is to make a silent request and then fall back to an interactive request.

#### Android

```Java
String[] SCOPES = {"https://graph.microsoft.com/.default"};
PublicClientApplication sampleApp = new PublicClientApplication(
                    this.getApplicationContext(),
                    R.raw.auth_config);

// Check if there are any accounts we can sign in silently.
// Result is in the silent callback (success or error).
sampleApp.getAccounts(new PublicClientApplication.AccountsLoadedCallback() {
    @Override
    public void onAccountsLoaded(final List<IAccount> accounts) {

        if (accounts.isEmpty() && accounts.size() == 1) {
            // TODO: Create a silent callback to catch successful or failed request.
            sampleApp.acquireTokenSilentAsync(SCOPES, accounts.get(0), getAuthSilentCallback());
        } else {
            /* No accounts or > 1 account. */
        }
    }
});

[...]

// No accounts found. Interactively request a token.
// TODO: Create an interactive callback to catch successful or failed requests.
sampleApp.acquireToken(getActivity(), SCOPES, getAuthInteractiveCallback());
```

#### iOS

First try acquiring a token silently:

```objc

NSArray *scopes = @[@"https://graph.microsoft.com/.default"];
NSString *accountIdentifier = @"my.account.id";

MSALAccount *account = [application accountForIdentifier:accountIdentifier error:nil];

MSALSilentTokenParameters *silentParams = [[MSALSilentTokenParameters alloc] initWithScopes:scopes account:account];
[application acquireTokenSilentWithParameters:silentParams completionBlock:^(MSALResult *result, NSError *error) {

    if (!error)
    {
        // You'll want to get the account identifier to retrieve and reuse the account
        // for later acquireToken calls
        NSString *accountIdentifier = result.account.identifier;

        // Access token to call the web API
        NSString *accessToken = result.accessToken;
    }

    // Check the error
    if (error && [error.domain isEqual:MSALErrorDomain] && error.code == MSALErrorInteractionRequired)
    {
        // Interactive auth will be required, call acquireTokenWithParameters:error:
        return;
    }
}];
```

```swift

let scopes = ["https://graph.microsoft.com/.default"]
let accountIdentifier = "my.account.id"

guard let account = try? application.account(forIdentifier: accountIdentifier) else { return }
let silentParameters = MSALSilentTokenParameters(scopes: scopes, account: account)
application.acquireTokenSilent(with: silentParameters) { (result, error) in

    guard let authResult = result, error == nil else {

    let nsError = error! as NSError

    if (nsError.domain == MSALErrorDomain &&
        nsError.code == MSALError.interactionRequired.rawValue) {

            // Interactive auth will be required, call acquireToken()
            return
         }
         return
     }

    // You'll want to get the account identifier to retrieve and reuse the account
    // for later acquireToken calls
    let accountIdentifier = authResult.account.identifier

    // Access token to call the web API
    let accessToken = authResult.accessToken
}
```

If MSAL returns `MSALErrorInteractionRequired`, then try acquiring tokens interactively:

```objc
UIViewController *viewController = ...; // Pass a reference to the view controller that should be used when getting a token interactively
MSALWebviewParameters *webParameters = [[MSALWebviewParameters alloc] initWithAuthPresentationViewController:viewController];
MSALInteractiveTokenParameters *interactiveParams = [[MSALInteractiveTokenParameters alloc] initWithScopes:scopes webviewParameters:webParameters];
[application acquireTokenWithParameters:interactiveParams completionBlock:^(MSALResult *result, NSError *error) {
    if (!error)
    {
        // You'll want to get the account identifier to retrieve and reuse the account
        // for later acquireToken calls
        NSString *accountIdentifier = result.account.identifier;

        NSString *accessToken = result.accessToken;
    }
}];
```

```swift
let viewController = ... // Pass a reference to the view controller that should be used when getting a token interactively
let webviewParameters = MSALWebviewParameters(authPresentationViewController: viewController)
let interactiveParameters = MSALInteractiveTokenParameters(scopes: scopes, webviewParameters: webviewParameters)
application.acquireToken(with: interactiveParameters, completionBlock: { (result, error) in

    guard let authResult = result, error == nil else {
        print(error!.localizedDescription)
        return
    }

    // Get access token from result
    let accessToken = authResult.accessToken
})
```

MSAL for iOS and macOS supports various modifiers to get a token interactively or silently:
* [Common parameters for getting a token](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALTokenParameters.html#/Configuration%20parameters)
* [Parameters for getting an interactive token](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALInteractiveTokenParameters.html#/Configuring%20MSALInteractiveTokenParameters)
* [Parameters for getting a silent token](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALSilentTokenParameters.html)

#### Xamarin

The following example shows the minimal code to get a token interactively. The example uses Microsoft Graph to read the user's profile.

```csharp
string[] scopes = new string[] {"user.read"};
var app = PublicClientApplicationBuilder.Create(clientId).Build();
var accounts = await app.GetAccountsAsync();
AuthenticationResult result;
try
{
 result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
             .ExecuteAsync();
}
catch(MsalUiRequiredException)
{
 result = await app.AcquireTokenInteractive(scopes)
             .ExecuteAsync();
}
```

#### Mandatory parameters in MSAL.NET

`AcquireTokenInteractive` has only one mandatory parameter: `scopes`. The `scopes` parameter enumerates strings that define the scopes for which a token is required. If the token is for Microsoft Graph, you can find the required scopes in the API reference of each Microsoft Graph API. In the reference, go to the "Permissions" section.

For example, to [list the user's contacts](/graph/api/user-list-contacts), use the scope "User.Read", "Contacts.Read". For more information, see [Microsoft Graph permissions reference](/graph/permissions-reference).

On Android, you can specify parent activity when you create the app by using `PublicClientApplicationBuilder`. If you don't specify the parent activity at that time, later you can specify it by using `.WithParentActivityOrWindow` as in the following section. If you specify parent activity, then the token gets back to that parent activity after the interaction. If you don't specify it, then the `.ExecuteAsync()` call throws an exception.

#### Specific optional parameters in MSAL.NET

The following sections explain the optional parameters in MSAL.NET.

##### WithPrompt

The `WithPrompt()` parameter controls interactivity with the user by specifying a prompt.

![Image showing the fields in the Prompt structure. These constant values control interactivity with the user by defining the type of prompt displayed by the WithPrompt() parameter.](https://user-images.githubusercontent.com/13203188/53438042-3fb85700-39ff-11e9-9a9e-1ff9874197b3.png)

The class defines the following constants:

- `SelectAccount` forces the security token service (STS) to present the account-selection dialog box. The dialog box contains the accounts for which the user has a session. You can use this option when you want to let the user choose among different identities. This option drives MSAL to send `prompt=select_account` to the identity provider.

    The `SelectAccount` constant is the default, and it effectively provides the best possible experience based on the available information. The available information might include account, presence of a session for the user, and so on. Don't change this default unless you have a good reason to do it.
- `Consent` enables you to prompt the user for consent even if consent was granted before. In this case, MSAL sends `prompt=consent` to the identity provider.

    You might want to use the `Consent` constant in security-focused applications where the organization governance requires users to see the consent dialog box each time they use the application.
- `ForceLogin` enables the service to prompt the user for credentials even if the prompt isn't needed.

    This option can be useful if the token acquisition fails and you want to let the user sign in again. In this case, MSAL sends `prompt=login` to the identity provider. You might want to use this option in security-focused applications where the organization governance requires the user to sign in each time they access specific parts of the application.
- `Never` is for only .NET 4.5 and Windows Runtime (WinRT). This constant won't prompt the user, but it will try to use the cookie that's stored in the hidden embedded web view. For more information, see [Using web browsers with MSAL.NET](./msal-net-web-browsers.md).

    If this option fails, then `AcquireTokenInteractive` throws an exception to notify you that a UI interaction is needed. Then use another `Prompt` parameter.
- `NoPrompt` doesn't send a prompt to the identity provider.

    This option is useful only for edit-profile policies in Azure Active Directory B2C. For more information, see [B2C specifics](https://aka.ms/msal-net-b2c-specificities).

##### WithExtraScopeToConsent

Use the `WithExtraScopeToConsent` modifier in an advanced scenario where you want the user to provide upfront consent to several resources. You can use this modifier when you don't want to use incremental consent, which is normally used with MSAL.NET or the Microsoft identity platform. For more information, see [Have the user consent upfront for several resources](scenario-desktop-production.md#have-the-user-consent-upfront-for-several-resources).

Here's a code example:

```csharp
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

##### Other optional parameters

To learn about the other optional parameters for `AcquireTokenInteractive`, see the [reference documentation for AcquireTokenInteractiveParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokeninteractiveparameterbuilder#methods).

### Acquire tokens via the protocol

We don't recommend directly using the protocol to get tokens. If you do, then the app won't support some scenarios that involve single sign-on (SSO), device management, and Conditional Access.

When you use the protocol to get tokens for mobile apps, make two requests:

* Get an authorization code.
* Exchange the code for a token.

#### Get an authorization code

```
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=<CLIENT_ID>
&response_type=code
&redirect_uri=<ENCODED_REDIRECT_URI>
&response_mode=query
&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2F.default
&state=12345
```

#### Get access and refresh the token

```HTTP
POST /{tenant}/oauth2/v2.0/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=<CLIENT_ID>
&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default
&code=OAAABAAAAiL9Kn2Z27UubvWFPbm0gLWQJVzCTE9UkP3pSx1aXxUjq3n8b2JRLk4OxVXr...
&redirect_uri=<ENCODED_REDIRECT_URI>
&grant_type=authorization_code
```

## Next steps

Move on to the next article in this scenario,
[Calling a web API](scenario-mobile-call-api.md).