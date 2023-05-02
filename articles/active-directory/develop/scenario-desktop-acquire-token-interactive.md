---
title: Acquire a token to call a web API interactively (desktop app)
description: Learn how to build a desktop app that calls web APIs to acquire a token for the app interactively
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/25/2021
ms.author: dmwendia
ms.custom: aaddev, devx-track-python, has-adal-ref
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform.
---

# Desktop app that calls web APIs: Acquire a token interactively

The following example shows minimal code to get a token interactively for reading the user's profile with Microsoft Graph.

# [.NET](#tab/dotnet)

### In MSAL.NET

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

### Mandatory parameters

`AcquireTokenInteractive` has only one mandatory parameter, ``scopes``, which contains an enumeration of strings that define the scopes for which a token is required. If the token is for Microsoft Graph, the required scopes can be found in the API reference of each Microsoft Graph API in the section named "Permissions." For instance, to [list the user's contacts](/graph/api/user-list-contacts), the scope "User.Read", "Contacts.Read" must be used. For more information, see [Microsoft Graph permissions reference](/graph/permissions-reference).

On Android, you also need to specify the parent activity by using `.WithParentActivityOrWindow`, as shown, so that the token gets back to that parent activity after the interaction. If you don't specify it, an exception is thrown when calling `.ExecuteAsync()`.

### Specific optional parameters in MSAL.NET

#### WithParentActivityOrWindow

The UI is important because it's interactive. `AcquireTokenInteractive` has one specific optional parameter that can specify, for platforms that support it, the parent UI. When used in a desktop application, `.WithParentActivityOrWindow` has a different type, which depends on the platform. Alternatively you can omit the optional parent window parameter to create a window, if you do not want to control where the sign-in dialog appears on the screen. This would be applicable for applications which are command line based, used to pass calls to any other backend service and do not need any windows for user interaction.

```csharp
// net45
WithParentActivityOrWindow(IntPtr windowPtr)
WithParentActivityOrWindow(IWin32Window window)

// Mac
WithParentActivityOrWindow(NSWindow window)

// .NET Standard (this will be on all platforms at runtime, but only on .NET Standard platforms at build time)
WithParentActivityOrWindow(object parent).
```

Remarks:

- On .NET Standard, the expected `object` is `Activity` on Android, `UIViewController` on iOS, `NSWindow` on Mac, and `IWin32Window` or `IntPr` on Windows.
- On Windows, you must call `AcquireTokenInteractive` from the UI thread so that the embedded browser gets the appropriate UI synchronization context. Not calling from the UI thread might cause messages to not pump properly and deadlock scenarios with the UI. One way of calling Microsoft Authentication Libraries (MSALs) from the UI thread if you aren't on the UI thread already is to use the `Dispatcher` on WPF.
- If you're using WPF, to get a window from a WPF control, you can use the `WindowInteropHelper.Handle` class. Then the call is from a WPF control (`this`):

  ```csharp
  result = await app.AcquireTokenInteractive(scopes)
                    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
                    .ExecuteAsync();
  ```

#### WithPrompt

`WithPrompt()` is used to control the interactivity with the user by specifying a prompt. The exact behavior can be controlled by using the [Microsoft.Identity.Client.Prompt](/dotnet/api/microsoft.identity.client.prompt) structure.

The struct defines the following constants:

- `SelectAccount` forces the STS to present the account selection dialog box that contains accounts for which the user has a session. This option is useful when application developers want to let users choose among different identities. This option drives MSAL to send `prompt=select_account` to the identity provider. This option is the default. It does a good job of providing the best possible experience based on the available information, such as account and presence of a session for the user. Don't change it unless you have good reason to do it.
- `Consent` enables the application developer to force the user to be prompted for consent, even if consent was granted before. In this case, MSAL sends `prompt=consent` to the identity provider. This option can be used in some security-focused applications where the organization governance demands that the user is presented with the consent dialog box each time the application is used.
- `ForceLogin` enables the application developer to have the user prompted for credentials by the service, even if this user prompt might not be needed. This option can be useful to let the user sign in again if acquiring a token fails. In this case, MSAL sends `prompt=login` to the identity provider. Sometimes it's used in security-focused applications where the organization governance demands that the user re-signs in each time they access specific parts of an application.
- `Create` triggers a sign-up experience, which is used for External Identities, by sending `prompt=create` to the identity provider. This prompt should not be sent for Azure AD B2C apps. For more information, see [Add a self-service sign-up user flow to an app](../external-identities/self-service-sign-up-user-flow.md).
- `Never` (for .NET 4.5 and WinRT only) won't prompt the user, but instead tries to use the cookie stored in the hidden embedded web view. For more information, see web views in MSAL.NET. Using this option might fail. In that case, `AcquireTokenInteractive` throws an exception to notify that a UI interaction is needed. You'll need to use another `Prompt` parameter.
- `NoPrompt` won't send any prompt to the identity provider which therefore will decide to present the best sign-in experience to the user (single-sign-on, or select account). This option is also mandatory for Azure Active Directory (Azure AD) B2C edit profile policies. For more information, see [Azure AD B2C specifics](https://aka.ms/msal-net-b2c-specificities).

#### WithUseEmbeddedWebView

This method enables you to specify if you want to force the usage of an embedded WebView or the system WebView (when available). For more information, see [Usage of web browsers](msal-net-web-browsers.md).

```csharp
var result = await app.AcquireTokenInteractive(scopes)
                    .WithUseEmbeddedWebView(true)
                    .ExecuteAsync();
```

#### WithExtraScopeToConsent

This modifier is used in an advanced scenario where you want the user to pre-consent to several resources upfront, and you don't want to use incremental consent, which is normally used with MSAL.NET/the Microsoft identity platform. For more information, see [Have the user consent upfront for several resources](scenario-desktop-production.md#have-the-user-consent-upfront-for-several-resources).

```csharp
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

#### WithCustomWebUi

A web UI is a mechanism to invoke a browser. This mechanism can be a dedicated UI WebBrowser control or a way to delegate opening the browser.
MSAL provides web UI implementations for most platforms, but there are cases where you might want to host the browser yourself:

- Platforms that aren't explicitly covered by MSAL, for example, Blazor, Unity, and Mono on desktops.
- You want to UI test your application and use an automated browser that can be used with Selenium.
- The browser and the app that run MSAL are in separate processes.

##### At a glance

To achieve this, you give to MSAL `start Url`, which needs to be displayed in a browser of choice so that the end user can enter items such as their username.
After authentication finishes, your app needs to pass back to MSAL `end Url`, which contains a code provided by Azure AD.
The host of `end Url` is always `redirectUri`. To intercept `end Url`, do one of the following things:

- Monitor browser redirects until `redirect Url` is hit.
- Have the browser redirect to a URL, which you monitor.

##### WithCustomWebUi is an extensibility point

`WithCustomWebUi` is an extensibility point that you can use to provide your own UI in public client applications. You can also let the user go through the /Authorize endpoint of the identity provider and let them sign in and consent. MSAL.NET can then redeem the authentication code and get a token. For example, it's used in Visual Studio to have electrons applications (for instance, Visual Studio Feedback) provide the web interaction, but leave it to MSAL.NET to do most of the work. You can also use it if you want to provide UI automation. In public client applications, MSAL.NET uses the Proof Key for Code Exchange (PKCE) standard to ensure that security is respected. Only MSAL.NET can redeem the code. For more information, see [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636).

  ```csharp
  using Microsoft.Identity.Client.Extensions;
  ```

##### Use WithCustomWebUi

To use `.WithCustomWebUI`, follow these steps.

  1. Implement the `ICustomWebUi` interface. For more information, see [this website](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/src/Microsoft.Identity.Client/Extensibility/ICustomWebUI.cs#L32-L70). Implement one `AcquireAuthorizationCodeAsync`method and accept the authorization code URL computed by MSAL.NET. Then let the user go through the interaction with the identity provider and return back the URL by which the identity provider would have called your implementation back along with the authorization code. If you have issues, your implementation should throw a `MsalExtensionException` exception to nicely cooperate with MSAL.
  2. In your `AcquireTokenInteractive` call, use the `.WithCustomUI()` modifier passing the instance of your custom web UI.

     ```csharp
     result = await app.AcquireTokenInteractive(scopes)
                       .WithCustomWebUi(yourCustomWebUI)
                       .ExecuteAsync();
     ```

##### Examples of implementation of ICustomWebUi in test automation: SeleniumWebUI

The MSAL.NET team has rewritten the UI tests to use this extensibility mechanism. If you're interested, look at the [SeleniumWebUI](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/tests/Microsoft.Identity.Test.Integration/Infrastructure/SeleniumWebUI.cs#L15-L160) class in the MSAL.NET source code.

##### Provide a great experience with SystemWebViewOptions

From MSAL.NET 4.1 [`SystemWebViewOptions`](/dotnet/api/microsoft.identity.client.systemwebviewoptions), you can specify:

- The URI to go to (`BrowserRedirectError`) or the HTML fragment to display (`HtmlMessageError`) in case of sign-in or consent errors in the system web browser.
- The URI to go to (`BrowserRedirectSuccess`) or the HTML fragment to display (`HtmlMessageSuccess`) in case of successful sign-in or consent.
- The action to run to start the system browser. You can provide your own implementation by setting the `OpenBrowserAsync` delegate. The class also provides a default implementation for two browsers: `OpenWithEdgeBrowserAsync` and `OpenWithChromeEdgeBrowserAsync` for Microsoft Edge and [Microsoft Edge on Chromium](https://www.windowscentral.com/faq-edge-chromium), respectively.

To use this structure, write something like the following example:

```csharp
IPublicClientApplication app;
...

options = new SystemWebViewOptions
{
 HtmlMessageError = "<b>Sign-in failed. You can close this tab ...</b>",
 BrowserRedirectSuccess = "https://contoso.com/help-for-my-awesome-commandline-tool.html"
};

var result = app.AcquireTokenInteractive(scopes)
                .WithEmbeddedWebView(false)       // The default in .NET Core
                .WithSystemWebViewOptions(options)
                .Build();
```

#### Other optional parameters

To learn more about all the other optional parameters for `AcquireTokenInteractive`, see [AcquireTokenInteractiveParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokeninteractiveparameterbuilder#methods).

# [Java](#tab/java)

```java
private static IAuthenticationResult acquireTokenInteractive() throws Exception {

    // Load token cache from file and initialize token cache aspect. The token cache will have
    // dummy data, so the acquireTokenSilently call will fail.
    TokenCacheAspect tokenCacheAspect = new TokenCacheAspect("sample_cache.json");

    PublicClientApplication pca = PublicClientApplication.builder(CLIENT_ID)
            .authority(AUTHORITY)
            .setTokenCacheAccessAspect(tokenCacheAspect)
            .build();

    Set<IAccount> accountsInCache = pca.getAccounts().join();
    // Take first account in the cache. In a production application, you would filter
    // accountsInCache to get the right account for the user authenticating.
    IAccount account = accountsInCache.iterator().next();

    IAuthenticationResult result;
    try {
        SilentParameters silentParameters =
                SilentParameters
                        .builder(SCOPE, account)
                        .build();

        // try to acquire token silently. This call will fail since the token cache
        // does not have any data for the user you are trying to acquire a token for
        result = pca.acquireTokenSilently(silentParameters).join();
    } catch (Exception ex) {
        if (ex.getCause() instanceof MsalException) {

            InteractiveRequestParameters parameters = InteractiveRequestParameters
                    .builder(new URI("http://localhost"))
                    .scopes(SCOPE)
                    .build();

            // Try to acquire a token interactively with system browser. If successful, you should see
            // the token and account information printed out to console
            result = pca.acquireToken(parameters).join();
        } else {
            // Handle other exceptions accordingly
            throw ex;
        }
    }
    return result;
}
```

# [macOS](#tab/macOS)

### In MSAL for iOS and macOS

Objective-C:

```objc
MSALInteractiveTokenParameters *interactiveParams = [[MSALInteractiveTokenParameters alloc] initWithScopes:scopes webviewParameters:[MSALWebviewParameters new]];
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
let interactiveParameters = MSALInteractiveTokenParameters(scopes: scopes, webviewParameters: MSALWebviewParameters())
application.acquireToken(with: interactiveParameters, completionBlock: { (result, error) in

    guard let authResult = result, error == nil else {
        print(error!.localizedDescription)
        return
    }

    // Get access token from result
    let accessToken = authResult.accessToken
})
```

# [Node.js](#tab/nodejs)

In MSAL Node, you acquire tokens via authorization code flow with Proof Key for Code Exchange (PKCE). The process has two steps: first, the application obtains a URL that can be used to generate an authorization code. This URL can be opened in a browser of choice, where the user can input their credentials, and will be redirected back to the `redirectUri` (registered during the app registration) with an authorization code. Second, the application passes the authorization code received to the `acquireTokenByCode()` method which exchanges it for an access token.

```javascript
const msal = require("@azure/msal-node");

const msalConfig = {
    auth: {
        clientId: "your_client_id_here",
        authority: "your_authority_here",
    }
};

const pca = new msal.PublicClientApplication(msalConfig);

const {verifier, challenge} = await msal.cryptoProvider.generatePkceCodes();

const authCodeUrlParameters = {
    scopes: ["User.Read"],
    redirectUri: "your_redirect_uri",
    codeChallenge: challenge, // PKCE Code Challenge
    codeChallengeMethod: "S256" // PKCE Code Challenge Method 
};

// get url to sign user in and consent to scopes needed for application
pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
    console.log(response);

    const tokenRequest = {
        code: response["authorization_code"],
        codeVerifier: verifier // PKCE Code Verifier 
        redirectUri: "your_redirect_uri",
        scopes: ["User.Read"],
    };

    // acquire a token by exchanging the code
    pca.acquireTokenByCode(tokenRequest).then((response) => {
        console.log("\nResponse: \n:", response);
    }).catch((error) => {
        console.log(error);
    });
}).catch((error) => console.log(JSON.stringify(error)));
```

# [Python](#tab/python)

MSAL Python 1.7+ provides an interactive acquire token method.

```python
result = None

# Firstly, check the cache to see if this end user has signed in before
accounts = app.get_accounts(username=config["username"])
if accounts:
    result = app.acquire_token_silent(config["scope"], account=accounts[0])

if not result:
    result = app.acquire_token_interactive(  # It automatically provides PKCE protection
         scopes=config["scope"])
```

---
### Next steps

Move on to the next article in this scenario,
[Call a web API from the desktop app](scenario-desktop-call-api.md).
