---
title: Acquire a token to call a web API (desktop app) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a desktop app that calls web APIs to acquire a token for the app
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
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a desktop app that calls web APIs by using the Microsoft identity platform for developers.
---

# Desktop app that calls web APIs: Acquire a token

After you've built an instance of the public client application, you'll use it to acquire a token that you'll then use to call a web API.

## Recommended pattern

The web API is defined by its `scopes`. Whatever the experience you provide in your application, the pattern to use is:

- Systematically attempt to get a token from the token cache by calling `AcquireTokenSilent`.
- If this call fails, use the `AcquireToken` flow that you want to use, which is represented here by `AcquireTokenXX`.

# [.NET](#tab/dotnet)

### In MSAL.NET

```csharp
AuthenticationResult result;
var accounts = await app.GetAccountsAsync();
IAccount account = ChooseAccount(accounts); // for instance accounts.FirstOrDefault
                                            // if the app manages is at most one account  
try
{
 result = await app.AcquireTokenSilent(scopes, account)
                   .ExecuteAsync();
}
catch(MsalUiRequiredException ex)
{
  result = await app.AcquireTokenXX(scopes, account)
                    .WithOptionalParameterXXX(parameter)
                    .ExecuteAsync();
}
```

# [Java](#tab/java)

```java
CompletableFuture<IAuthenticationResult> future = app.acquireToken(parameters);

future.handle((res, ex) -> {
    if(ex != null) {
        System.out.println("Oops! We have an exception - " + ex.getMessage());
        return "Unknown!";
    }

    Collection<IAccount> accounts = app.getAccounts().join();

    CompletableFuture<IAuthenticationResult> future1;
    try {
        future1 = app.acquireTokenSilently
                (SilentParameters.builder(Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE),
                        accounts.iterator().next())
                        .forceRefresh(true)
                        .build());

    } catch (MalformedURLException e) {
        e.printStackTrace();
        throw new RuntimeException();
    }

    future1.join();
    IAccount account = app.getAccounts().join().iterator().next();
    app.removeAccount(account).join();

    return res;
}).join();
```

# [Python](#tab/python)

```Python
result = None

# Firstly, check the cache to see if this end user has signed in before
accounts = app.get_accounts(username=config["username"])
if accounts:
    result = app.acquire_token_silent(config["scope"], account=accounts[0])

if not result:
    result = app.acquire_token_by_xxx(scopes=config["scope"])
```

# [MacOS](#tab/macOS)

### In MSAL for iOS and macOS

Objective-C:

```objc
MSALAccount *account = [application accountForIdentifier:accountIdentifier error:nil];

MSALSilentTokenParameters *silentParams = [[MSALSilentTokenParameters alloc] initWithScopes:scopes account:account];
[application acquireTokenSilentWithParameters:silentParams completionBlock:^(MSALResult *result, NSError *error) {

    // Check the error
    if (error && [error.domain isEqual:MSALErrorDomain] && error.code == MSALErrorInteractionRequired)
    {
        // Interactive auth will be required, call acquireTokenWithParameters:error:
    }
}];
```
Swift:

```swift
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
}
```
---

Here are the various ways to acquire tokens in a desktop application.

## Acquire a token interactively

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

`AcquireTokenInteractive` has only one mandatory parameter, ``scopes``, which contains an enumeration of strings that define the scopes for which a token is required. If the token is for Microsoft Graph, the required scopes can be found in the API reference of each Microsoft Graph API in the section named "Permissions." For instance, to [list the user's contacts](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/user_list_contacts), the scope "User.Read", "Contacts.Read" must be used. For more information, see [Microsoft Graph permissions reference](https://developer.microsoft.com/graph/docs/concepts/permissions_reference).

On Android, you also need to specify the parent activity by using `.WithParentActivityOrWindow`, as shown, so that the token gets back to that parent activity after the interaction. If you don't specify it, an exception is thrown when calling `.ExecuteAsync()`.

### Specific optional parameters in MSAL.NET

#### WithParentActivityOrWindow

The UI is important because it's interactive. `AcquireTokenInteractive` has one specific optional parameter that can specify, for platforms that support it, the parent UI. When used in a desktop application, `.WithParentActivityOrWindow` has a different type, which depends on the platform.

```csharp
// net45
WithParentActivityOrWindow(IntPtr windowPtr)
WithParentActivityOrWindow(IWin32Window window)

// Mac
WithParentActivityOrWindow(NSWindow window)

// .Net Standard (this will be on all platforms at runtime, but only on NetStandard at build time)
WithParentActivityOrWindow(object parent).
```

Remarks:

- On .NET Standard, the expected `object` is `Activity` on Android, `UIViewController` on iOS, `NSWindow` on MAC, and `IWin32Window` or `IntPr` on Windows.
- On Windows, you must call `AcquireTokenInteractive` from the UI thread so that the embedded browser gets the appropriate UI synchronization context. Not calling from the UI thread might cause messages to not pump properly and deadlock scenarios with the UI. One way of calling Microsoft Authentication Libraries (MSALs) from the UI thread if you aren't on the UI thread already is to use the `Dispatcher` on WPF.
- If you're using WPF, to get a window from a WPF control, you can use the `WindowInteropHelper.Handle` class. Then the call is from a WPF control (`this`):

  ```csharp
  result = await app.AcquireTokenInteractive(scopes)
                    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
                    .ExecuteAsync();
  ```

#### WithPrompt

`WithPrompt()` is used to control the interactivity with the user by specifying a prompt.

<img src="https://user-images.githubusercontent.com/13203188/53438042-3fb85700-39ff-11e9-9a9e-1ff9874197b3.png" width="25%" />

The class defines the following constants:

- ``SelectAccount`` forces the STS to present the account selection dialog box that contains accounts for which the user has a session. This option is useful when application developers want to let users choose among different identities. This option drives MSAL to send ``prompt=select_account`` to the identity provider. This option is the default. It does a good job of providing the best possible experience based on the available information, such as account and presence of a session for the user. Don't change it unless you have good reason to do it.
- ``Consent`` enables the application developer to force the user to be prompted for consent, even if consent was granted before. In this case, MSAL sends `prompt=consent` to the identity provider. This option can be used in some security-focused applications where the organization governance demands that the user is presented with the consent dialog box each time the application is used.
- ``ForceLogin`` enables the application developer to have the user prompted for credentials by the service, even if this user prompt might not be needed. This option can be useful to let the user sign in again if acquiring a token fails. In this case, MSAL sends `prompt=login` to the identity provider. Sometimes it's used in security-focused applications where the organization governance demands that the user re-signs in each time they access specific parts of an application.
- ``Never`` (for .NET 4.5 and WinRT only) won't prompt the user, but instead tries to use the cookie stored in the hidden embedded web view. For more information, see web views in MSAL.NET. Using this option might fail. In that case, `AcquireTokenInteractive` throws an exception to notify that a UI interaction is needed. You'll need to use another `Prompt` parameter.
- ``NoPrompt`` won't send any prompt to the identity provider. This option is useful only for Azure Active Directory (Azure AD) B2C edit profile policies. For more information, see [Azure AD B2C specifics](https://aka.ms/msal-net-b2c-specificities).

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

From MSAL.NET 4.1 [`SystemWebViewOptions`](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.systemwebviewoptions?view=azure-dotnet), you can specify:

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

To learn more about all the other optional parameters for `AcquireTokenInteractive`, see [AcquireTokenInteractiveParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokeninteractiveparameterbuilder?view=azure-dotnet-preview#methods).

# [Java](#tab/java)

MSAL Java doesn't provide an interactive acquire token method directly. Instead, it requires the application to send an authorization request in its implementation of the user interaction flow to obtain an authorization code. This code can then be passed to the `acquireToken` method to get the token.

```java
AuthorizationCodeParameters parameters =  AuthorizationCodeParameters.builder(
                authorizationCode, redirectUri)
                .build();
CompletableFuture<IAuthenticationResult> future = app.acquireToken(parameters);

future.handle((res, ex) -> {
    if(ex != null) {
        System.out.println("Oops! We have an exception - " + ex.getMessage());
        return "Unknown!";
    }

    Collection<IAccount> accounts = app.getAccounts().join();

    CompletableFuture<IAuthenticationResult> future1;
    try {
        future1 = app.acquireTokenSilently
                (SilentParameters.builder(Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE),
                        accounts.iterator().next())
                        .forceRefresh(true)
                        .build());

    } catch (MalformedURLException e) {
        e.printStackTrace();
        throw new RuntimeException();
    }

    future1.join();
    IAccount account = app.getAccounts().join().iterator().next();
    app.removeAccount(account).join();

    return res;
}).join();
```

# [Python](#tab/python)

MSAL Python doesn't provide an interactive acquire token method directly. Instead, it requires the application to send an authorization request in its implementation of the user interaction flow to obtain an authorization code. This code can then be passed to the `acquire_token_by_authorization_code` method to get the token.

```Python
result = None

# Firstly, check the cache to see if this end user has signed in before
accounts = app.get_accounts(username=config["username"])
if accounts:
    result = app.acquire_token_silent(config["scope"], account=accounts[0])

if not result:
    result = app.acquire_token_by_authorization_code(
         request.args['code'],
         scopes=config["scope"])    

```

# [MacOS](#tab/macOS)

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
---

## Integrated Windows Authentication

To sign in a domain user on a domain or Azure AD joined machine, use Integrated Windows Authentication (IWA).

### Constraints

- Integrated Windows Authentication is usable for *federated+* users only, that is, users created in Active Directory and backed by Azure AD. Users created directly in Azure AD without Active Directory backing, known as *managed* users, can't use this authentication flow. This limitation doesn't affect the username and password flow.
- IWA is for apps written for .NET Framework, .NET Core, and Universal Windows Platform (UWP) platforms.
- IWA doesn't bypass multifactor authentication (MFA). If MFA is configured, IWA might fail if an MFA challenge is required, because MFA requires user interaction.
  > [!NOTE]
  > This one is tricky. IWA is non-interactive, but MFA requires user interactivity. You don't control when the identity provider requests MFA to be performed, the tenant admin does. From our observations, MFA is required when you sign in from a different country, when not connected via VPN to a corporate network, and sometimes even when connected via VPN. Don't expect a deterministic set of rules. Azure AD uses AI to continuously learn if MFA is required. Fall back to a user prompt like interactive authentication or device code flow if IWA fails.

- The authority passed in `PublicClientApplicationBuilder` needs to be:
  - Tenanted of the form `https://login.microsoftonline.com/{tenant}/`, where `tenant` is either the GUID that represents the tenant ID or a domain associated with the tenant.
  - For any [work and school accounts](`https://login.microsoftonline.com/organizations/`).
  - Microsoft personal accounts aren't supported. You can't use /common or /consumers tenants.

- Because Integrated Windows Authentication is a silent flow:
  - The user of your application must have previously consented to use the application.
  - Or, the tenant admin must have previously consented to all users in the tenant to use the application.
  - In other words:
    - Either you as a developer selected the **Grant** button in the Azure portal for yourself.
    - Or, a tenant admin selected the **Grant/revoke admin consent for {tenant domain}** button on the **API permissions** tab of the registration for the application. For more information, see [Add permissions to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-web-apis).
    - Or, you've provided a way for users to consent to the application. For more information, see [Requesting individual user consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#requesting-individual-user-consent).
    - Or, you've provided a way for the tenant admin to consent to the application. For more information, see [Admin consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#requesting-consent-for-an-entire-tenant).

- This flow is enabled for .NET desktop, .NET Core, and UWP apps.

For more information on consent, see [Microsoft identity platform permissions and consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent).

### Learn how to use it

# [.NET](#tab/dotnet)

In MSAL.NET, you need to use:

```csharp
AcquireTokenByIntegratedWindowsAuth(IEnumerable<string> scopes)
```

You normally need only one parameter (`scopes`). Depending on the way your Windows administrator set up the policies, applications on your Windows machine might not be allowed to look up the signed-in user. In that case, use a second method, `.WithUsername()`, and pass in the username of the signed-in user as a UPN format, for example, `joe@contoso.com`. On .NET Core, only the overload taking the username is available because the .NET Core platform can't ask the username to the OS.

The following sample presents the most current case, with explanations of the kind of exceptions you can get and their mitigations.

```csharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app = PublicClientApplicationBuilder
      .Create(clientId)
      .WithAuthority(authority)
      .Build();

 var accounts = await app.GetAccountsAsync();

 AuthenticationResult result = null;
 if (accounts.Any())
 {
  result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
      .ExecuteAsync();
 }
 else
 {
  try
  {
   result = await app.AcquireTokenByIntegratedWindowsAuth(scopes)
      .ExecuteAsync(CancellationToken.None);
  }
  catch (MsalUiRequiredException ex)
  {
   // MsalUiRequiredException: AADSTS65001: The user or administrator has not consented to use the application
   // with ID '{appId}' named '{appName}'.Send an interactive authorization request for this user and resource.

   // you need to get user consent first. This can be done, if you are not using .NET Core (which does not have any Web UI)
   // by doing (once only) an AcquireToken interactive.

   // If you are using .NET core or don't want to do an AcquireTokenInteractive, you might want to suggest the user to navigate
   // to a URL to consent: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read

   // AADSTS50079: The user is required to use multi-factor authentication.
   // There is no mitigation - if MFA is configured for your tenant and AAD decides to enforce it,
   // you need to fallback to an interactive flows such as AcquireTokenInteractive or AcquireTokenByDeviceCode
   }
   catch (MsalServiceException ex)
   {
    // Kind of errors you could have (in ex.Message)

    // MsalServiceException: AADSTS90010: The grant type is not supported over the /common or /consumers endpoints. Please use the /organizations or tenant-specific endpoint.
    // you used common.
    // Mitigation: as explained in the message from Azure AD, the authority needs to be tenanted or otherwise organizations

    // MsalServiceException: AADSTS70002: The request body must contain the following parameter: 'client_secret or client_assertion'.
    // Explanation: this can happen if your application was not registered as a public client application in Azure AD
    // Mitigation: in the Azure portal, edit the manifest for your application and set the `allowPublicClient` to `true`
   }
   catch (MsalClientException ex)
   {
      // Error Code: unknown_user Message: Could not identify logged in user
      // Explanation: the library was unable to query the current Windows logged-in user or this user is not AD or AAD
      // joined (work-place joined users are not supported).

      // Mitigation 1: on UWP, check that the application has the following capabilities: Enterprise Authentication,
      // Private Networks (Client and Server), User Account Information

      // Mitigation 2: Implement your own logic to fetch the username (e.g. john@contoso.com) and use the
      // AcquireTokenByIntegratedWindowsAuth form that takes in the username

      // Error Code: integrated_windows_auth_not_supported_managed_user
      // Explanation: This method relies on an a protocol exposed by Active Directory (AD). If a user was created in Azure
      // Active Directory without AD backing ("managed" user), this method will fail. Users created in AD and backed by
      // AAD ("federated" users) can benefit from this non-interactive method of authentication.
      // Mitigation: Use interactive authentication
   }
 }


 Console.WriteLine(result.Account.Username);
}
```

For the list of possible modifiers on AcquireTokenByIntegratedWindowsAuthentication, see [AcquireTokenByIntegratedWindowsAuthParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokenbyintegratedwindowsauthparameterbuilder?view=azure-dotnet-preview#methods).

# [Java](#tab/java)

This extract is from the [MSAL Java dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/). Here's the class used in MSAL Java dev samples to configure the samples: [TestData](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/TestData.java).

```Java
PublicClientApplication app = PublicClientApplication.builder(TestData.PUBLIC_CLIENT_ID)
         .authority(TestData.AUTHORITY_ORGANIZATION)
         .telemetryConsumer(new Telemetry.MyTelemetryConsumer().telemetryConsumer)
         .build();

 IntegratedWindowsAuthenticationParameters parameters =
         IntegratedWindowsAuthenticationParameters.builder(
                 Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE), TestData.USER_NAME)
                 .build();

 Future<IAuthenticationResult> future = app.acquireToken(parameters);

 IAuthenticationResult result = future.get();

 return result;
```

# [Python](#tab/python)

This flow isn't yet supported in MSAL Python.

# [MacOS](#tab/macOS)

This flow doesn't apply to MacOS.

---

## Username and password

You can also acquire a token by providing the username and password. This flow is limited and not recommended, but there are still use cases where it's necessary.

### This flow isn't recommended

This flow is *not recommended* because having your application ask a user for their password isn't secure. For more information, see [What's the solution to the growing problem of passwords?](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/). The preferred flow for acquiring a token silently on Windows domain joined machines is [Integrated Windows Authentication](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Integrated-Windows-Authentication). You can also use [device code flow](https://aka.ms/msal-net-device-code-flow).

> [!NOTE]
> Using a username and password is useful in some cases, such as DevOps scenarios. But if you want to use a username and password in interactive scenarios where you provide your own UI, think about how to move away from it. By using a username and password, you're giving up a number of things:
>
> - Core tenets of modern identity. A password can get phished and replayed because a shared secret can be intercepted. It's incompatible with passwordless.
> - Users who need to do MFA can't sign in because there's no interaction.
> - Users can't do single sign-on (SSO).

### Constraints

The following constraints also apply:

- The username and password flow isn't compatible with conditional access and multifactor authentication. As a consequence, if your app runs in an Azure AD tenant where the tenant admin requires multifactor authentication, you can't use this flow. Many organizations do that.
- It works only for work and school accounts (not MSA).
- The flow is available on .NET desktop and .NET Core, but not on UWP.

### B2C specifics

For more information, see [Resource Owner Password Credentials (ROPC) with B2C](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics#resource-owner-password-credentials-ropc-with-b2c).

### Use it

# [.NET](#tab/dotnet)

`IPublicClientApplication`contains the method `AcquireTokenByUsernamePassword`.

The following sample presents a simplified case.

```csharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app;
 app = PublicClientApplicationBuilder.Create(clientId)
       .WithAuthority(authority)
       .Build();
 var accounts = await app.GetAccountsAsync();

 AuthenticationResult result = null;
 if (accounts.Any())
 {
  result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                    .ExecuteAsync();
 }
 else
 {
  try
  {
   var securePassword = new SecureString();
   foreach (char c in "dummy")        // you should fetch the password
    securePassword.AppendChar(c);  // keystroke by keystroke

   result = await app.AcquireTokenByUsernamePassword(scopes,
                                                    "joe@contoso.com",
                                                     securePassword)
                      .ExecuteAsync();
  }
  catch(MsalException)
  {
   // See details below
  }
 }
 Console.WriteLine(result.Account.Username);
}
```

The following sample presents the most current case, with explanations of the kind of exceptions you can get and their mitigations.

```csharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app;
 app = PublicClientApplicationBuilder.Create(clientId)
                                   .WithAuthority(authority)
                                   .Build();
 var accounts = await app.GetAccountsAsync();

 AuthenticationResult result = null;
 if (accounts.Any())
 {
  result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
                    .ExecuteAync();
 }
 else
 {
  try
  {
   var securePassword = new SecureString();
   foreach (char c in "dummy")        // you should fetch the password keystroke
    securePassword.AppendChar(c);  // by keystroke

   result = await app.AcquireTokenByUsernamePassword(scopes,
                                                    "joe@contoso.com",
                                                    securePassword)
                    .ExecuteAsync();
  }
  catch (MsalUiRequiredException ex) when (ex.Message.Contains("AADSTS65001"))
  {
   // Here are the kind of error messages you could have, and possible mitigations

   // ------------------------------------------------------------------------
   // MsalUiRequiredException: AADSTS65001: The user or administrator has not consented to use the application
   // with ID '{appId}' named '{appName}'. Send an interactive authorization request for this user and resource.

   // Mitigation: you need to get user consent first. This can be done either statically (through the portal),
   /// or dynamically (but this requires an interaction with Azure AD, which is not possible with
   // the username/password flow)
   // Statically: in the portal by doing the following in the "API permissions" tab of the application registration:
   // 1. Click "Add a permission" and add all the delegated permissions corresponding to the scopes you want (for instance
   // User.Read and User.ReadBasic.All)
   // 2. Click "Grant/revoke admin consent for <tenant>") and click "yes".
   // Dynamically, if you are not using .NET Core (which does not have any Web UI) by
   // calling (once only) AcquireTokenInteractive.
   // remember that Username/password is for public client applications that is desktop/mobile applications.
   // If you are using .NET core or don't want to call AcquireTokenInteractive, you might want to:
   // - use device code flow (See https://aka.ms/msal-net-device-code-flow)
   // - or suggest the user to navigate to a URL to consent: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read
   // ------------------------------------------------------------------------

   // ------------------------------------------------------------------------
   // ErrorCode: invalid_grant
   // SubError: basic_action
   // MsalUiRequiredException: AADSTS50079: The user is required to use multi-factor authentication.
   // The tenant admin for your organization has chosen to oblige users to perform multi-factor authentication.
   // Mitigation: none for this flow
   // Your application cannot use the Username/Password grant.
   // Like in the previous case, you might want to use an interactive flow (AcquireTokenInteractive()),
   // or Device Code Flow instead.
   // Note this is one of the reason why using username/password is not recommended;
   // ------------------------------------------------------------------------

   // ------------------------------------------------------------------------
   // ex.ErrorCode: invalid_grant
   // subError: null
   // Message = "AADSTS70002: Error validating credentials.
   // AADSTS50126: Invalid username or password
   // In the case of a managed user (user from an Azure AD tenant opposed to a
   // federated user, which would be owned
   // in another IdP through ADFS), the user has entered the wrong password
   // Mitigation: ask the user to re-enter the password
   // ------------------------------------------------------------------------

   // ------------------------------------------------------------------------
   // ex.ErrorCode: invalid_grant
   // subError: null
   // MsalServiceException: ADSTS50034: To sign into this application the account must be added to
   // the {domainName} directory.
   // or The user account does not exist in the {domainName} directory. To sign into this application,
   // the account must be added to the directory.
   // The user was not found in the directory
   // Explanation: wrong username
   // Mitigation: ask the user to re-enter the username.
   // ------------------------------------------------------------------------
  }
  catch (MsalServiceException ex) when (ex.ErrorCode == "invalid_request")
  {
   // ------------------------------------------------------------------------
   // AADSTS90010: The grant type is not supported over the /common or /consumers endpoints.
   // Please use the /organizations or tenant-specific endpoint.
   // you used common.
   // Mitigation: as explained in the message from Azure AD, the authority you use in the application needs
   // to be tenanted or otherwise "organizations". change the
   // "Tenant": property in the appsettings.json to be a GUID (tenant Id), or domain name (contoso.com)
   // if such a domain is registered with your tenant
   // or "organizations", if you want this application to sign-in users in any Work and School accounts.
   // ------------------------------------------------------------------------

  }
  catch (MsalServiceException ex) when (ex.ErrorCode == "unauthorized_client")
  {
   // ------------------------------------------------------------------------
   // AADSTS700016: Application with identifier '{clientId}' was not found in the directory '{domain}'.
   // This can happen if the application has not been installed by the administrator of the tenant or consented
   // to by any user in the tenant.
   // You may have sent your authentication request to the wrong tenant
   // Cause: The clientId in the appsettings.json might be wrong
   // Mitigation: check the clientId and the app registration
   // ------------------------------------------------------------------------
  }
  catch (MsalServiceException ex) when (ex.ErrorCode == "invalid_client")
  {
   // ------------------------------------------------------------------------
   // AADSTS70002: The request body must contain the following parameter: 'client_secret or client_assertion'.
   // Explanation: this can happen if your application was not registered as a public client application in Azure AD
   // Mitigation: in the Azure portal, edit the manifest for your application and set the `allowPublicClient` to `true`
   // ------------------------------------------------------------------------
  }
  catch (MsalServiceException)
  {
   throw;
  }

  catch (MsalClientException ex) when (ex.ErrorCode == "unknown_user_type")
  {
   // Message = "Unsupported User Type 'Unknown'. Please see https://aka.ms/msal-net-up"
   // The user is not recognized as a managed user, or a federated user. Azure AD was not
   // able to identify the IdP that needs to process the user
   throw new ArgumentException("U/P: Wrong username", ex);
  }
  catch (MsalClientException ex) when (ex.ErrorCode == "user_realm_discovery_failed")
  {
   // The user is not recognized as a managed user, or a federated user. Azure AD was not
   // able to identify the IdP that needs to process the user. That's for instance the case
   // if you use a phone number
   throw new ArgumentException("U/P: Wrong username", ex);
  }
  catch (MsalClientException ex) when (ex.ErrorCode == "unknown_user")
  {
   // the username was probably empty
   // ex.Message = "Could not identify the user logged into the OS. See https://aka.ms/msal-net-iwa for details."
   throw new ArgumentException("U/P: Wrong username", ex);
  }
  catch (MsalClientException ex) when (ex.ErrorCode == "parsing_wstrust_response_failed")
  {
   // ------------------------------------------------------------------------
   // In the case of a Federated user (that is owned by a federated IdP, as opposed to a managed user owned in an Azure AD tenant)
   // ID3242: The security token could not be authenticated or authorized.
   // The user does not exist or has entered the wrong password
   // ------------------------------------------------------------------------
  }
 }

 Console.WriteLine(result.Account.Username);
}
```

For more information on all the modifiers that can be applied to `AcquireTokenByUsernamePassword`, see [AcquireTokenByUsernamePasswordParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokenbyusernamepasswordparameterbuilder?view=azure-dotnet-preview#methods).

# [Java](#tab/java)

The following extract is from the [MSAL Java dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/). Here's the class used in MSAL Java dev samples to configure the samples: [TestData](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/TestData.java).

```Java
PublicClientApplication app = PublicClientApplication.builder(TestData.PUBLIC_CLIENT_ID)
        .authority(TestData.AUTHORITY_ORGANIZATION)
        .build();

UserNamePasswordParameters parameters = UserNamePasswordParameters.builder(
        Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE),
        TestData.USER_NAME,
        TestData.USER_PASSWORD.toCharArray())
        .build();

CompletableFuture<IAuthenticationResult> future = app.acquireToken(parameters);

future.handle((res, ex) -> {
    if(ex != null) {
        System.out.println("Oops! We have an exception - " + ex.getMessage());
        return "Unknown!";
    }

    Collection<IAccount> accounts = app.getAccounts().join();

    CompletableFuture<IAuthenticationResult> future1;
    try {
        future1 = app.acquireTokenSilently
                (SilentParameters.builder(Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE),
                        accounts.iterator().next())
                        .forceRefresh(true)
                        .build());

    } catch (MalformedURLException e) {
        e.printStackTrace();
        throw new RuntimeException();
    }

    future1.join();

    IAccount account = app.getAccounts().join().iterator().next();
    app.removeAccount(account).join();

    return res;
}).join();
```

# [Python](#tab/python)

This extract is from the [MSAL Python dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/dev/sample/).

```Python
# Create a preferably long-lived app instance which maintains a token cache.
app = msal.PublicClientApplication(
    config["client_id"], authority=config["authority"],
    # token_cache=...  # Default cache is in memory only.
                       # You can learn how to use SerializableTokenCache from
                       # https://msal-python.rtfd.io/en/latest/#msal.SerializableTokenCache
    )

# The pattern to acquire a token looks like this.
result = None

# Firstly, check the cache to see if this end user has signed in before
accounts = app.get_accounts(username=config["username"])
if accounts:
    logging.info("Account(s) exists in cache, probably with token too. Let's try.")
    result = app.acquire_token_silent(config["scope"], account=accounts[0])

if not result:
    logging.info("No suitable token exists in cache. Let's get a new one from AAD.")
    # See this page for constraints of Username Password Flow.
    # https://github.com/AzureAD/microsoft-authentication-library-for-python/wiki/Username-Password-Authentication
    result = app.acquire_token_by_username_password(
        config["username"], config["password"], scopes=config["scope"])
```

# [MacOS](#tab/macOS)

This flow isn't supported on MSAL for macOS.

---

## Command-line tool without a web browser

### Device code flow

If you're writing a command-line tool that doesn't have web controls, and you can't or don't want to use the previous flows, you need to use the device code flow.

Interactive authentication with Azure AD requires a web browser. For more information, see [Usage of web browsers](https://aka.ms/msal-net-uses-web-browser). To authenticate users on devices or operating systems that don't provide a web browser, device code flow lets the user use another device such as a computer or a mobile phone to sign in interactively. By using the device code flow, the application obtains tokens through a two-step process that's designed for these devices or OSes. Examples of such applications are applications that run on iOT or command-line tools (CLI). The idea is that:

1. Whenever user authentication is required, the app provides a code for the user. The user is asked to use another device, such as an internet-connected smartphone, to go to a URL, for instance, `https://microsoft.com/devicelogin`. Then the user is prompted to enter the code. That done, the web page leads the user through a normal authentication experience, which includes consent prompts and multifactor authentication, if necessary.

2. Upon successful authentication, the command-line app receives the required tokens through a back channel and uses them to perform the web API calls it needs.

### Use it

# [.NET](#tab/dotnet)

`IPublicClientApplication`contains a method named `AcquireTokenWithDeviceCode`.

```csharp
 AcquireTokenWithDeviceCode(IEnumerable<string> scopes,
                            Func<DeviceCodeResult, Task> deviceCodeResultCallback)
```

This method takes as parameters:

- The `scopes` to request an access token for.
- A callback that receives the `DeviceCodeResult`.

  ![DeviceCodeResult properties](https://user-images.githubusercontent.com/13203188/56024968-7af1b980-5d11-11e9-84c2-5be2ef306dc5.png)

The following sample code presents the most current case, with explanations of the kind of exceptions you can get and their mitigation.

```csharp
private const string ClientId = "<client_guid>";
private const string Authority = "https://login.microsoftonline.com/contoso.com";
private readonly string[] Scopes = new string[] { "user.read" };

static async Task<AuthenticationResult> GetATokenForGraph()
{
    IPublicClientApplication pca = PublicClientApplicationBuilder
            .Create(ClientId)
            .WithAuthority(Authority)
            .WithDefaultRedirectUri()
            .Build();

    var accounts = await pca.GetAccountsAsync();

    // All AcquireToken* methods store the tokens in the cache, so check the cache first
    try
    {
        return await pca.AcquireTokenSilent(Scopes, accounts.FirstOrDefault())
            .ExecuteAsync();
    }
    catch (MsalUiRequiredException ex)
    {
        // No token found in the cache or AAD insists that a form interactive auth is required (e.g. the tenant admin turned on MFA)
        // If you want to provide a more complex user experience, check out ex.Classification

        return await AcquireByDeviceCodeAsync(pca);
    }         
}

private async Task<AuthenticationResult> AcquireByDeviceCodeAsync(IPublicClientApplication pca)
{
    try
    {
        var result = await pca.AcquireTokenWithDeviceCode(scopes,
            deviceCodeResult =>
            {
                    // This will print the message on the console which tells the user where to go sign-in using
                    // a separate browser and the code to enter once they sign in.
                    // The AcquireTokenWithDeviceCode() method will poll the server after firing this
                    // device code callback to look for the successful login of the user via that browser.
                    // This background polling (whose interval and timeout data is also provided as fields in the
                    // deviceCodeCallback class) will occur until:
                    // * The user has successfully logged in via browser and entered the proper code
                    // * The timeout specified by the server for the lifetime of this code (typically ~15 minutes) has been reached
                    // * The developing application calls the Cancel() method on a CancellationToken sent into the method.
                    //   If this occurs, an OperationCanceledException will be thrown (see catch below for more details).
                    Console.WriteLine(deviceCodeResult.Message);
                return Task.FromResult(0);
            }).ExecuteAsync();

        Console.WriteLine(result.Account.Username);
        return result;
    }
    // TODO: handle or throw all these exceptions depending on your app
    catch (MsalServiceException ex)
    {
        // Kind of errors you could have (in ex.Message)

        // AADSTS50059: No tenant-identifying information found in either the request or implied by any provided credentials.
        // Mitigation: as explained in the message from Azure AD, the authoriy needs to be tenanted. you have probably created
        // your public client application with the following authorities:
        // https://login.microsoftonline.com/common or https://login.microsoftonline.com/organizations

        // AADSTS90133: Device Code flow is not supported under /common or /consumers endpoint.
        // Mitigation: as explained in the message from Azure AD, the authority needs to be tenanted

        // AADSTS90002: Tenant <tenantId or domain you used in the authority> not found. This may happen if there are
        // no active subscriptions for the tenant. Check with your subscription administrator.
        // Mitigation: if you have an active subscription for the tenant this might be that you have a typo in the
        // tenantId (GUID) or tenant domain name.
    }
    catch (OperationCanceledException ex)
    {
        // If you use a CancellationToken, and call the Cancel() method on it, then this *may* be triggered
        // to indicate that the operation was cancelled.
        // See https://docs.microsoft.com/dotnet/standard/threading/cancellation-in-managed-threads
        // for more detailed information on how C# supports cancellation in managed threads.
    }
    catch (MsalClientException ex)
    {
        // Possible cause - verification code expired before contacting the server
        // This exception will occur if the user does not manage to sign-in before a time out (15 mins) and the
        // call to `AcquireTokenWithDeviceCode` is not cancelled in between
    }
}
```
# [Java](#tab/java)

This extract is from the [MSAL Java dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/). Here's the class used in MSAL Java dev samples to configure the samples: [TestData](https://github.com/AzureAD/microsoft-authentication-library-for-java/blob/dev/src/samples/public-client/TestData.java).

```java
PublicClientApplication app = PublicClientApplication.builder(TestData.PUBLIC_CLIENT_ID)
        .authority(TestData.AUTHORITY_COMMON)
        .build();

Consumer<DeviceCode> deviceCodeConsumer = (DeviceCode deviceCode) -> {
    System.out.println(deviceCode.message());
};

CompletableFuture<IAuthenticationResult> future = app.acquireToken(
        DeviceCodeFlowParameters.builder(
                Collections.singleton(TestData.GRAPH_DEFAULT_SCOPE),
                deviceCodeConsumer)
                .build());

future.handle((res, ex) -> {
    if(ex != null) {
        System.out.println("Oops! We have an exception of type - " + ex.getClass());
        System.out.println("message - " + ex.getMessage());
        return "Unknown!";
    }
    System.out.println("Returned ok - " + res);

    return res;
});

future.join();
```

# [Python](#tab/python)

This extract is from the [MSAL Python dev samples](https://github.com/AzureAD/microsoft-authentication-library-for-python/blob/dev/sample/).

```Python
# Create a preferably long-lived app instance which maintains a token cache.
app = msal.PublicClientApplication(
    config["client_id"], authority=config["authority"],
    # token_cache=...  # Default cache is in memory only.
                       # You can learn how to use SerializableTokenCache from
                       # https://msal-python.rtfd.io/en/latest/#msal.SerializableTokenCache
    )

# The pattern to acquire a token looks like this.
result = None

# Note: If your device-flow app does not have any interactive ability, you can
#   completely skip the following cache part. But here we demonstrate it anyway.
# We now check the cache to see if we have some end users signed in before.
accounts = app.get_accounts()
if accounts:
    logging.info("Account(s) exists in cache, probably with token too. Let's try.")
    print("Pick the account you want to use to proceed:")
    for a in accounts:
        print(a["username"])
    # Assuming the end user chose this one
    chosen = accounts[0]
    # Now let's try to find a token in cache for this account
    result = app.acquire_token_silent(config["scope"], account=chosen)

if not result:
    logging.info("No suitable token exists in cache. Let's get a new one from AAD.")

    flow = app.initiate_device_flow(scopes=config["scope"])
    if "user_code" not in flow:
        raise ValueError(
            "Fail to create device flow. Err: %s" % json.dumps(flow, indent=4))

    print(flow["message"])
    sys.stdout.flush()  # Some terminal needs this to ensure the message is shown

    # Ideally you should wait here, in order to save some unnecessary polling
    # input("Press Enter after signing in from another device to proceed, CTRL+C to abort.")

    result = app.acquire_token_by_device_flow(flow)  # By default it will block
        # You can follow this instruction to shorten the block time
        #    https://msal-python.readthedocs.io/en/latest/#msal.PublicClientApplication.acquire_token_by_device_flow
        # or you may even turn off the blocking behavior,
        # and then keep calling acquire_token_by_device_flow(flow) in your own customized loop
```

# [MacOS](#tab/macOS)

This flow doesn't apply to MacOS.

---

## File-based token cache

In MSAL.NET, an in-memory token cache is provided by default.

### Serialization is customizable in Windows desktop apps and web apps or web APIs

In the case of .NET Framework and .NET Core, if you don't do anything extra, the in-memory token cache lasts for the duration of the application. To understand why serialization isn't provided out of the box, remember that MSAL .NET desktop or .NET Core applications can be console or Windows applications (which would have access to the file system) *but also* web applications or web APIs. These web apps and web APIs might use some specific cache mechanisms like databases, distributed caches, and Redis caches. To have a persistent token cache application in .NET desktop or .NET Core, you'll need to customize the serialization.

Classes and interfaces involved in token cache serialization are the following types:

- ``ITokenCache``, which defines events to subscribe to token cache serialization requests, and methods to serialize or deserialize the cache at various formats (ADAL v3.0, MSAL 2.x, and MSAL 3.x = ADAL v5.0).
- ``TokenCacheCallback`` is a callback passed to the events so that you can handle the serialization. They'll be called with arguments of type ``TokenCacheNotificationArgs``.
- ``TokenCacheNotificationArgs`` only provides the application ``ClientId`` and a reference to the user for which the token is available.

  ![Token cache serialization diagram](https://user-images.githubusercontent.com/13203188/56027172-d58d1480-5d15-11e9-8ada-c0292f1800b3.png)

> [!IMPORTANT]
> MSAL.NET creates token caches for you and provides you with the `IToken` cache when you call an application's `UserTokenCache` and `AppTokenCache` properties. You aren't supposed to implement the interface yourself. Your responsibility, when you implement a custom token cache serialization, is to:
>
> - React to `BeforeAccess` and `AfterAccess` events, or their *Async* counterpart. The`BeforeAccess` delegate is responsible for deserializing the cache. The `AfterAccess` delegate is responsible for serializing the cache.
> - Understand that part of these events store or load blobs, which are passed through the event argument to whatever storage you want.

The strategies are different depending on if you're writing a token cache serialization for a public client application, such as a desktop, or a confidential client application, such as a web app or web API or a daemon app.

Since MSAL v2.x, you have several options. Your choice depends on whether you want to serialize the cache only to the MSAL.NET format, which is a unified format cache that's common with MSAL but also across the platforms. Or, you might also want to support the [legacy](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization) token cache serialization of ADAL v3.

The customization of token cache serialization to share the SSO state between ADAL.NET 3.x, ADAL.NET 5.x, and MSAL.NET is explained in part of the sample [active-directory-dotnet-v1-to-v2](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2).

### Simple token cache serialization (MSAL only)

The following example is a naive implementation of custom serialization of a token cache for desktop applications. Here, the user token cache is in a file in the same folder as the application.

After you build the application, you enable the serialization by calling ``TokenCacheHelper.EnableSerialization()`` and passing the application `UserTokenCache`.

```csharp
app = PublicClientApplicationBuilder.Create(ClientId)
    .Build();
TokenCacheHelper.EnableSerialization(app.UserTokenCache);
```

This helper class looks like the following code snippet:

```csharp
static class TokenCacheHelper
 {
  public static void EnableSerialization(ITokenCache tokenCache)
  {
   tokenCache.SetBeforeAccess(BeforeAccessNotification);
   tokenCache.SetAfterAccess(AfterAccessNotification);
  }

  /// <summary>
  /// Path to the token cache
  /// </summary>
  public static readonly string CacheFilePath = System.Reflection.Assembly.GetExecutingAssembly().Location + ".msalcache.bin3";

  private static readonly object FileLock = new object();


  private static void BeforeAccessNotification(TokenCacheNotificationArgs args)
  {
   lock (FileLock)
   {
    args.TokenCache.DeserializeMsalV3(File.Exists(CacheFilePath)
            ? ProtectedData.Unprotect(File.ReadAllBytes(CacheFilePath),
                                      null,
                                      DataProtectionScope.CurrentUser)
            : null);
   }
  }

  private static void AfterAccessNotification(TokenCacheNotificationArgs args)
  {
   // if the access operation resulted in a cache update
   if (args.HasStateChanged)
   {
    lock (FileLock)
    {
     // reflect changesgs in the persistent store
     File.WriteAllBytes(CacheFilePath,
                         ProtectedData.Protect(args.TokenCache.SerializeMsalV3(),
                                                 null,
                                                 DataProtectionScope.CurrentUser)
                         );
    }
   }
  }
 }
```

A preview of a product quality token cache file-based serializer for public client applications for desktop applications running on Windows, Mac, and Linux is available from the [Microsoft.Identity.Client.Extensions.Msal](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/tree/master/src/Microsoft.Identity.Client.Extensions.Msal) open-source library. You can include it in your applications from the following NuGet package: [Microsoft.Identity.Client.Extensions.Msal](https://www.nuget.org/packages/Microsoft.Identity.Client.Extensions.Msal/).

> [!NOTE]
> Disclaimer: The Microsoft.Identity.Client.Extensions.Msal library is an extension over MSAL.NET. Classes in these libraries might make their way into MSAL.NET in the future, as is or with breaking changes.

### Dual token cache serialization (MSAL unified cache + ADAL v3)

You might want to implement token cache serialization with the Unified cache format. This format is common to ADAL.NET 4.x and MSAL.NET 2.x, and with other MSALs of the same generation or older, on the same platform. Get inspired by the following code:

```csharp
string appLocation = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location;
string cacheFolder = Path.GetFullPath(appLocation) + @"..\..\..\..");
string adalV3cacheFileName = Path.Combine(cacheFolder, "cacheAdalV3.bin");
string unifiedCacheFileName = Path.Combine(cacheFolder, "unifiedCache.bin");

IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
                                    .Build();
FilesBasedTokenCacheHelper.EnableSerialization(app.UserTokenCache,
                                               unifiedCacheFileName,
                                               adalV3cacheFileName);

```

This time the helper class looks like the following code:

```csharp
using System;
using System.IO;
using System.Security.Cryptography;
using Microsoft.Identity.Client;

namespace CommonCacheMsalV3
{
 /// <summary>
 /// Simple persistent cache implementation of the dual cache serialization (ADAL V3 legacy
 /// and unified cache format) for a desktop applications (from MSAL 2.x)
 /// </summary>
 static class FilesBasedTokenCacheHelper
 {
  /// <summary>
  /// Get the user token cache
  /// </summary>
  /// <param name="adalV3CacheFileName">File name where the cache is serialized with the
  /// ADAL V3 token cache format. Can
  /// be <c>null</c> if you don't want to implement the legacy ADAL V3 token cache
  /// serialization in your MSAL 2.x+ application</param>
  /// <param name="unifiedCacheFileName">File name where the cache is serialized
  /// with the Unified cache format, common to
  /// ADAL V4 and MSAL V2 and above, and also across ADAL/MSAL on the same platform.
  ///  Should not be <c>null</c></param>
  /// <returns></returns>
  public static void EnableSerialization(ITokenCache cache, string unifiedCacheFileName, string adalV3CacheFileName)
  {
   UnifiedCacheFileName = unifiedCacheFileName;
   AdalV3CacheFileName = adalV3CacheFileName;

   cache.SetBeforeAccess(BeforeAccessNotification);
   cache.SetAfterAccess(AfterAccessNotification);
  }

  /// <summary>
  /// File path where the token cache is serialized with the unified cache format
  /// (ADAL.NET V4, MSAL.NET V3)
  /// </summary>
  public static string UnifiedCacheFileName { get; private set; }

  /// <summary>
  /// File path where the token cache is serialized with the legacy ADAL V3 format
  /// </summary>
  public static string AdalV3CacheFileName { get; private set; }

  private static readonly object FileLock = new object();

  public static void BeforeAccessNotification(TokenCacheNotificationArgs args)
  {
   lock (FileLock)
   {
    args.TokenCache.DeserializeAdalV3(ReadFromFileIfExists(AdalV3CacheFileName));
    try
    {
     args.TokenCache.DeserializeMsalV3(ReadFromFileIfExists(UnifiedCacheFileName));
    }
    catch(Exception ex)
    {
     // Compatibility with the MSAL v2 cache if you used one
     args.TokenCache.DeserializeMsalV2(ReadFromFileIfExists(UnifiedCacheFileName));
    }
   }
  }

  public static void AfterAccessNotification(TokenCacheNotificationArgs args)
  {
   // if the access operation resulted in a cache update
   if (args.HasStateChanged)
   {
    lock (FileLock)
    {
     WriteToFileIfNotNull(UnifiedCacheFileName, args.TokenCache.SerializeMsalV3());
     if (!string.IsNullOrWhiteSpace(AdalV3CacheFileName))
     {
      WriteToFileIfNotNull(AdalV3CacheFileName, args.TokenCache.SerializeAdalV3());
     }
    }
   }
  }

  /// <summary>
  /// Read the content of a file if it exists
  /// </summary>
  /// <param name="path">File path</param>
  /// <returns>Content of the file (in bytes)</returns>
  private static byte[] ReadFromFileIfExists(string path)
  {
   byte[] protectedBytes = (!string.IsNullOrEmpty(path) && File.Exists(path))
       ? File.ReadAllBytes(path) : null;
   byte[] unprotectedBytes = encrypt ?
       ((protectedBytes != null) ? ProtectedData.Unprotect(protectedBytes, null, DataProtectionScope.CurrentUser) : null)
       : protectedBytes;
   return unprotectedBytes;
  }

  /// <summary>
  /// Writes a blob of bytes to a file. If the blob is <c>null</c>, deletes the file
  /// </summary>
  /// <param name="path">path to the file to write</param>
  /// <param name="blob">Blob of bytes to write</param>
  private static void WriteToFileIfNotNull(string path, byte[] blob)
  {
   if (blob != null)
   {
    byte[] protectedBytes = encrypt
      ? ProtectedData.Protect(blob, null, DataProtectionScope.CurrentUser)
      : blob;
    File.WriteAllBytes(path, protectedBytes);
   }
   else
   {
    File.Delete(path);
   }
  }

  // Change if you want to test with an un-encrypted blob (this is a json format)
  private static bool encrypt = true;
 }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Call a web API from the desktop app](scenario-desktop-call-api.md)
