---
title: Acquire a token to call a web API (mobile apps) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a mobile app that calls web APIs (getting a token for the app)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.reviwer: brandwe
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs by using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Mobile app that calls web APIs - get a token

Before you can begin calling protected web APIs, your app will need an access token. This article walks you through the process for getting a token by using the Microsoft Authentication Library (MSAL).

## Scopes to request

When you request a token, you need to define a scope. The scope determines what data your app can access.  

The easiest approach is to combine the desired web API's `App ID URI` with the scope `.default`. Doing so tells Microsoft identity platform that your app requires all scopes set in the portal.

#### Android
```Java
String[] SCOPES = {"https://graph.microsoft.com/.default"};
```

#### iOS
```swift
let scopes = ["https://graph.microsoft.com/.default"]
```

#### Xamarin
```csharp 
var scopes = new [] {"https://graph.microsoft.com/.default"};
```

## Get tokens

### Acquire tokens via MSAL

MSAL allows apps to acquire tokens silently and interactively. Just call these methods and MSAL returns an access token for the requested scopes. The correct pattern is to perform a silent request and fall back to an interactive request.

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
// TODO: Create an interactive callback to catch successful or failed request.
sampleApp.acquireToken(getActivity(), SCOPES, getAuthInteractiveCallback());        
```

#### iOS

**First try acquiring a token silently:**

Objective-C:

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
            
        // Access token to call the Web API
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
 
Swift:

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
            
    // Access token to call the Web API
    let accessToken = authResult.accessToken
}
```

**Then if MSAL returns `MSALErrorInteractionRequired`, try acquiring tokens interactively:**

Objective-C:

```objc
UIViewController *viewController = ...; // Pass a reference to the view controller that should be used when getting a token interactively
MSALWebviewParameters *webParameters = [[MSALWebviewParameters alloc] initWithParentViewController:viewController];
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

Swift:

```swift
let viewController = ... // Pass a reference to the view controller that should be used when getting a token interactively
let webviewParameters = MSALWebviewParameters(parentViewController: viewController)
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

MSAL for iOS and macOS supports various modifiers when getting a token interactively or silently.
* [Common parameters when getting a token](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALTokenParameters.html#/Configuration%20parameters)
* [Parameters for interactive token acquisition](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALInteractiveTokenParameters.html#/Configuring%20MSALInteractiveTokenParameters)
* [Parameters for silent token acquisition](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALSilentTokenParameters.html)

#### Xamarin

The following example shows minimal code to get a token interactively for reading the user's profile with Microsoft Graph.

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

`AcquireTokenInteractive` has only one mandatory parameter ``scopes``, which contains an enumeration of strings that define the scopes for which a token is required. If the token is for the Microsoft Graph, the required scopes can be found in api reference of each Microsoft graph API in the section named "Permissions". For instance, to [list the user's contacts](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/user_list_contacts), the scope "User.Read", "Contacts.Read" will need to be used. See also [Microsoft Graph permissions reference](https://developer.microsoft.com/graph/docs/concepts/permissions_reference).

If you have not specified it when building the app, on Android, you need to also specify the parent activity (using `.WithParentActivityOrWindow`, see below) so that the token gets back to that parent activity after the interaction. If you don't specify it, an exception will be thrown when calling `.ExecuteAsync()`.

#### Specific optional parameters in MSAL.NET

##### WithPrompt

`WithPrompt()` is used to control the interactivity with the user by specifying a Prompt

<img src="https://user-images.githubusercontent.com/13203188/53438042-3fb85700-39ff-11e9-9a9e-1ff9874197b3.png" width="25%" />

The class defines the following constants:

- ``SelectAccount``: will force the STS to present the account selection dialog containing accounts for which the user has a session. This option is useful when applications developers want to let user choose among different identities. This option drives MSAL to send ``prompt=select_account`` to the identity provider. This option is the default, and it does of good job of providing the best possible experience based on the available information (account, presence of a session for the user, and so on. ...). Don't change it unless you have good reason to do it.
- ``Consent``: enables the application developer to force the user be prompted for consent even if consent was granted before. In this case, MSAL sends `prompt=consent` to the identity provider. This option can be used in some security focused applications where the organization governance demands that the user is presented the consent dialog each time the application is used.
- ``ForceLogin``: enables the application developer to have the user prompted for credentials by the service even if this user-prompt wouldn't be needed. This option can be useful if Acquiring a token fails, to let the user re-sign-in. In this case, MSAL sends `prompt=login` to the identity provider. Again, we've seen it used in some security focused applications where the organization governance demands that the user relogs-in each time they access specific parts of an application.
- ``Never`` (for .NET 4.5 and WinRT only) won't prompt the user, but instead will try to use the cookie stored in the hidden embedded web view (See below: Web Views in MSAL.NET). Using this option might fail, and in that case `AcquireTokenInteractive` will throw an exception to notify that a UI interaction is needed, and you'll need to use another `Prompt` parameter.
- ``NoPrompt``: Won't send any prompt to the identity provider. This option is only useful for Azure AD B2C edit profile policies (See [B2C specifics](https://aka.ms/msal-net-b2c-specificities)).

##### WithExtraScopeToConsent

This modifier is used in an advanced scenario where you want the user to pre-consent to several resources upfront (and don't want to use the incremental consent, which is normally used with MSAL.NET / the Microsoft identity platform v2.0). For details see [How-to : have the user consent upfront for several resources](scenario-desktop-production.md#have-the-user-consent-upfront-for-several-resources).

```csharp
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

##### Other optional parameters

Learn more about all the other optional parameters for `AcquireTokenInteractive` from the reference documentation for [AcquireTokenInteractiveParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokeninteractiveparameterbuilder?view=azure-dotnet-preview#methods)

### Acquire tokens via the protocol

We don't recommend using the protocol directly. If you do, the app won’t support some single sign-on (SSO), device management, and Conditional Access scenarios.

When you use the protocol to get tokens for mobile apps, you need to make two requests: get an authorization code and exchange it for a token.

#### Get authorization code

```Text
https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
client_id=<CLIENT_ID>
&response_type=code
&redirect_uri=<ENCODED_REDIRECT_URI>
&response_mode=query
&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2F.default
&state=12345
```

#### Get access and refresh token

```Text
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

> [!div class="nextstepaction"]
> [Calling a web API](scenario-mobile-call-api.md)
