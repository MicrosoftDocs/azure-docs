---
title: Desktop app that calls web APIs (acquiring a token for the app) - Microsoft identity platform
description: Learn how to build a Desktop app that calls web APIs (acquiring a token for the app |)
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
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a Desktop app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Desktop app that calls web APIs - acquire a token

Once you have built you `IPublicClientApplication`, you'll use it to acquire a token that you'll then use to call a web API.

## Recommended pattern

The web API is defined by its `scopes`. Whatever the experience you provide in your application, the pattern that you'll want to use is:

- Systematically attempting to get a token from the token cache by calling `AcquireTokenSilent`
- If this call fails, use the `AcquireToken` flow that you want to use (here represented by `AcquireTokenXX`)

```CSharp
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

Here is now the detail of the various ways to acquire tokens in a desktop application

## Acquiring a token interactively

The following example shows minimal code to get a token interactively for reading the user's profile with Microsoft Graph.

```CSharp
string[] scopes = new string["user.read"];
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

`AcquireTokenInteractive` has only one mandatory parameter ``scopes``, which contains an enumeration of strings that define the scopes for which a token is required. If the token is for the Microsoft Graph, the required scopes can be found in api reference of each Microsoft graph API in the section named "Permissions". For instance, to [list the user's contacts](https://developer.microsoft.com/graph/docs/api-reference/v1.0/api/user_list_contacts), the scope "User.Read", "Contacts.Read" will need to be used. See also [Microsoft Graph permissions reference](https://developer.microsoft.com/graph/docs/concepts/permissions_reference).

On Android, you need to also specify the parent activity (using `.WithParentActivityOrWindow`, see below) so that the token gets back to that parent activity after the interaction. If you don't specify it, an exception will be thrown when calling `.ExecuteAsync()`.

### Specific optional parameters

#### WithParentActivityOrWindow

Being interactive, UI is important. `AcquireTokenInteractive` has one specific optional parameter enabling to specify, for platforms supporting it, the parent UI. When used in a desktop application, `.WithParentActivityOrWindow` has a different type depending on the platform:

```CSharp
// net45
WithParentActivityOrWindow(IntPtr windowPtr)
WithParentActivityOrWindow(IWin32Window window)

// Mac
WithParentActivityOrWindow(NSWindow window)

// .Net Standard (this will be on all platforms at runtime, but only on NetStandard at build time)
WithParentActivityOrWindow(object parent).
```

Remarks:

- On .NET Standard, the expected `object` is an `Activity` on Android, a `UIViewController` on iOS, an `NSWindow` on MAC, and a `IWin32Window` or `IntPr` on Windows.
- On Windows, you must call `AcquireTokenInteractive` from the UI thread so that the embedded browser gets the appropriate UI synchronization context.  Not calling from the UI thread may cause messages to not pump properly and/or deadlock scenarios with the UI. One way of calling MSAL from the UI thread if you aren't on the UI thread already is to use the `Dispatcher` on WPF.
- If you're using WPF, to get a window from a WPF control, you can use  `WindowInteropHelper.Handle` class. The call is then, from a WPF control (`this`):
  
  ```CSharp
  result = await app.AcquireTokenInteractive(scopes)
                    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
                    .ExecuteAsync();
  ```

#### WithPrompt

`WithPrompt()` is used to control the interactivity with the user by specifying a Prompt

<img src="https://user-images.githubusercontent.com/13203188/53438042-3fb85700-39ff-11e9-9a9e-1ff9874197b3.png" width="25%" />

The class defines the following constants:

- ``SelectAccount``: will force the STS to present the account selection dialog containing accounts for which the user has a session. This option is useful when applications developers want to let user choose among different identities. This option drives MSAL to send ``prompt=select_account`` to the identity provider. This option is the default, and it does of good job of providing the best possible experience based on the available information (account, presence of a session for the user, and so on. ...). Don't change it unless you have good reason to do it.
- ``Consent``: enables the application developer to force the user be prompted for consent even if consent was granted before. In this case, MSAL sends `prompt=consent` to the identity provider. This option can be used in some security focused applications where the organization governance demands that the user is presented the consent dialog each time the application is used.
- ``ForceLogin``: enables the application developer to have the user prompted for credentials by the service even if this user-prompt wouldn't be needed. This option can be useful if Acquiring a token fails, to let the user re-sign-in. In this case, MSAL sends `prompt=login` to the identity provider. Again, we've seen it used in some security focused applications where the organization governance demands that the user relogs-in each time they access specific parts of an application.
- ``Never`` (for .NET 4.5 and WinRT only) won't prompt the user, but instead will try to use the cookie stored in the hidden embedded web view (See below: Web Views in MSAL.NET). Using this option might fail, and in that case `AcquireTokenInteractive` will throw an exception to notify that a UI interaction is needed, and you'll need to use another `Prompt` parameter.
- ``NoPrompt``: Won't send any prompt to the identity provider. This option is only useful for Azure AD B2C edit profile policies (See [B2C specifics](https://aka.ms/msal-net-b2c-specificities)).

#### WithExtraScopeToConsent

This modifier is used in an advanced scenario where you want the user to pre-consent to several resources upfront (and don't want to use the incremental consent, which is normally used with MSAL.NET / the Microsoft identity platform v2.0). For details see [How-to : have the user consent upfront for several resources](scenario-desktop-production.md#how-to-have--the-user-consent-upfront-for-several-resources).

```CSharp
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

#### WithCustomWebUi

##### WithCustomWebUi is an extensibility point

`WithCustomWebUi` is an extensibility point that allows you provide your own UI in public client applications, and to let the user go through the /Authorize endpoint of the identity provider and let them sign in and consent. MSAL.NET can, then, redeem the authentication code and get a token. It's for instance used in Visual Studio to have electrons applications (for instance VS Feedback) provide the web interaction, but leave it to MSAL.NET to do most of the work. You can also use it if you want to provide UI automation. In public client applications, MSAL.NET uses the PKCE standard ([RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636)) to ensure that security is respected: Only MSAL.NET can redeem the code.

  ```CSharp
  using Microsoft.Identity.Client.Extensions;
  ```

##### How to use WithCustomWebUi

In order to use `.WithCustomWebUI`, you need to:
  
  1. Implement the `ICustomWebUi`  interface (See [here](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/src/Microsoft.Identity.Client/Extensibility/ICustomWebUI.cs#L32-L70). You'll basically need to implement one method `AcquireAuthorizationCodeAsync` accepting the authorization code URL (computed by MSAL.NET), letting the user go through the interaction with the identity provider, and then returning back the URL by which the identity provider would have called your implementation back (including the authorization code). If you have issues, your implementation should throw a `MsalExtensionException` exception to nicely cooperate with MSAL.
  2. In your `AcquireTokenInteractive` call, you can use `.WithCustomUI()` modifier passing the instance of your custom web UI

     ```CSharp
     result = await app.AcquireTokenInteractive(scopes)
                       .WithCustomWebUi(yourCustomWebUI)
                       .ExecuteAsync();
     ```

##### Examples of implementation of ICustomWebUi in test automation - SeleniumWebUI

The MSAL.NET team have rewritten our UI tests to leverage this extensibility mechanism. In case you're interested you can have a look at the [SeleniumWebUI](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/tests/Microsoft.Identity.Test.Integration/Infrastructure/SeleniumWebUI.cs#L15-L160) class in the MSAL.NET source code

#### Other optional parameters

Learn more about all the other optional parameters for `AcquireTokenInteractive` from the reference documentation for [AcquireTokenInteractiveParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokeninteractiveparameterbuilder?view=azure-dotnet-preview#methods)

## Integrated Windows authentication

If you want to sign in a domain user on a domain or Azure AD joined machine, you need to use:

```csharp
AcquireTokenByIntegratedWindowsAuth(IEnumerable<string> scopes)
```

### Constraints

- AcquireTokenByIntegratedWindowsAuth (IWA) is only usable for **Federated** users only, that is, users created in an Active Directory and backed by Azure Active Directory. Users created directly in AAD, without AD backing - **managed** users - can't use this authentication flow. This limitation doesn't affect the Username/Password flow.
- IWA is for apps written for .NET Framework, .NET Core, and UWP platforms
- IWA does NOT bypass MFA (multi factor authentication). If MFA is configured, IWA might fail if an MFA challenge is required, because MFA requires user interaction.
  > [!NOTE]
  > This one is tricky. IWA is non-interactive, but 2FA requires user interactivity. You do not control when the identity provider requests 2FA to be performed, the tenant admin does. From our observations, 2FA is required when you login from a different country, when not connected via VPN to a corporate network, and sometimes even when connected via VPN. Don’t expect a deterministic set of rules, Azure Active Directory uses AI to continuously learn if 2FA is required. You should fallback to a user prompt (interactive authentication or device code flow) if IWA fails.

- The authority passed in the `PublicClientApplicationBuilder` needs to be:
  - tenant-ed (of the form `https://login.microsoftonline.com/{tenant}/` where `tenant` is either the guid representing the tenant ID or a domain associated with the tenant.
  - for any work and school accounts (`https://login.microsoftonline.com/organizations/`)

  > Microsoft personal accounts are not supported (you cannot use /common or /consumers tenants)

- Because Integrated Windows Authentication is a silent flow:
  - the user of your application must have previously consented to use the application
  - or the tenant admin must have previously consented to all users in the tenant to use the application.
  - In other words:
    - either you as a developer have pressed the **Grant** button on the Azure portal for yourself,
    - or a tenant admin has pressed the **Grant/revoke admin consent for {tenant domain}** button in the **API permissions** tab of the registration for the application (See [Add permissions to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-web-apis))
    - or you've provided a way for users to consent to the application (See [Requesting individual user consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#requesting-individual-user-consent))
    - or you've provided a way for the tenant admin to consent for the application (See [admin consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#requesting-consent-for-an-entire-tenant))

- This flow is enabled for .net desktop, .net core, and Windows Universal (UWP) Apps. On .NET core only the overload taking the username is available, as the .NET Core platform can't ask the username to the OS.
  
For more information on consent, see [v2.0 permissions and consent](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent)

### How to use it

You normally need only one parameter (`scopes`). However depending on the way your Windows administrator has setup the policies, it can be possible that applications on your windows machine aren't allowed to look up the logged-in user. In that case, use a second method `.WithUsername()` and pass in the username of the logged in user as a UPN format - `joe@contoso.com`.

The following sample presents the most current case, with explanations of the kind of exceptions you can get, and their mitigations

```CSharp
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

For the list of possible modifiers on AcquireTokenByIntegratedWindowsAuthentication, see [AcquireTokenByIntegratedWindowsAuthParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokenbyintegratedwindowsauthparameterbuilder?view=azure-dotnet-preview#methods)

## Username / Password

You can also acquire a token by providing the username and password. This flow is limited and not recommended, but there are still use cases where it's necessary.

### This flow isn't recommended

This flow is **not recommended** because your application asking a user for their password isn't secure. For more information about this problem, see [this article](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/). The preferred flow for acquiring a token silently on Windows domain joined machines is [Integrated Windows Authentication](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Integrated-Windows-Authentication). Otherwise you can also use [Device code flow](https://aka.ms/msal-net-device-code-flow)

> [!NOTE] 
> Although this is useful in some cases (DevOps scenarios), if you want to use Username/password in interactive scenarios where you provide your onw UI, you should really think about how to move away from it. By using username/password you are giving-up a number of things:
>
> - core tenants of modern identity: password gets fished, replayed. Because we have this concept of a share secret that can be intercepted.
> This is incompatible with passwordless.
> - users who need to do MFA won't be able to sign-in (as there is no interaction)
> - Users won't be able to do single sign-on

### Constraints

The following constraints also apply:

- The Username/Password flow isn't compatible with Conditional Access and multi-factor authentication: As a consequence, if your app runs in an Azure AD tenant where the tenant admin requires multi-factor authentication, you can't use this flow. Many organizations do that.
- It works only for Work and school accounts (not MSA)
- The flow is available on .net desktop and .net core, but not on UWP

### B2C specifics

[More information on using ROPC with B2C](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics#resource-owner-password-credentials-ropc-with-b2c).

### How to use it?

`IPublicClientApplication`contains the method `AcquireTokenByUsernamePassword`

The following sample presents a simplified case

```CSharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app;
 app = PublicClientApplicationBuild.Create(clientId)
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

The following sample presents the most current case, with explanations of the kind of exceptions you can get, and their mitigations

```CSharp
static async Task GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication app;
 app = PublicClientApplicationBuild.Create(clientId)
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

For details on all the modifiers that can be applied to `AcquireTokenByUsernamePassword`, see [AcquireTokenByUsernamePasswordParameterBuilder](/dotnet/api/microsoft.identity.client.acquiretokenbyusernamepasswordparameterbuilder?view=azure-dotnet-preview#methods)

## Command-line tool (without web browser)

### Device code flow Why? and how?

If  you're writing a command-line tool (that doesn't have Web controls), and can't or don't want to use the previous flows, you'll need to use `AcquireTokenWithDeviceCode`.

Interactive authentication with Azure AD requires a web browser (for details see [Usage of web browsers](https://aka.ms/msal-net-uses-web-browser)). However, to authenticate users on devices or operating systems that don't provide a Web browser, Device code flow lets the user use another device (for instance another computer or a mobile phone) to sign in interactively. By using the device code flow, the application obtains tokens through a two-step process especially designed for these devices/OS. Examples of such applications are applications running on iOT, or Command-Line tools (CLI). The idea is that:

1. Whenever user authentication is required, the app provides a code and asks the user to use another device (such as an internet-connected smartphone) to navigate to a URL (for instance, `https://microsoft.com/devicelogin`), where the user will be prompted to enter the code. That done, the web page will lead the user through a normal authentication experience, including consent prompts and multi-factor authentication if necessary.

2. Upon successful authentication, the command-line app will receive the required tokens through a back channel and will use it to perform the web API calls it needs.

### Code

`IPublicClientApplication`contains a method named `AcquireTokenWithDeviceCode`

```CSharp
 AcquireTokenWithDeviceCode(IEnumerable<string> scopes,
                            Func<DeviceCodeResult, Task> deviceCodeResultCallback)
```

This method takes as parameters:

- The `scopes` to request an access token for
- A callback that will receive the `DeviceCodeResult`

  ![image](https://user-images.githubusercontent.com/13203188/56024968-7af1b980-5d11-11e9-84c2-5be2ef306dc5.png)

The following sample code presents the most current case, with explanations of the kind of exceptions you can get, and their mitigation.

```CSharp
static async Task<AuthenticationResult> GetATokenForGraph()
{
 string authority = "https://login.microsoftonline.com/contoso.com";
 string[] scopes = new string[] { "user.read" };
 IPublicClientApplication pca = PublicClientApplicationBuilder
      .Create(clientId)
      .WithAuthority(authority)
      .Build();

 AuthenticationResult result = null;
 var accounts = await app.GetAccountsAsync();

 // All AcquireToken* methods store the tokens in the cache, so check the cache first
 try
 {
  result = await app.AcquireTokenSilent(scopes, accounts.FirstOrDefault())
       .ExecuteAsync();
 }
 catch (MsalUiRequiredException ex)
 {
  // A MsalUiRequiredException happened on AcquireTokenSilent.
  // This indicates you need to call AcquireTokenInteractive to acquire a token
  System.Diagnostics.Debug.WriteLine($"MsalUiRequiredException: {ex.Message}");
 }

 try
 {
  result = await app.AcquireTokenWithDeviceCode(scopes,
      deviceCodeCallback =>
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
  // If you use a CancellationToken, and call the Cancel() method on it, then this may be triggered
  // to indicate that the operation was cancelled.
  // See https://docs.microsoft.com/dotnet/standard/threading/cancellation-in-managed-threads
  // for more detailed information on how C# supports cancellation in managed threads.
 }
 catch (MsalClientException ex)
 {
  // Verification code expired before contacting the server
  // This exception will occur if the user does not manage to sign-in before a time out (15 mins) and the
  // call to `AcquireTokenWithDeviceCode` is not cancelled in between
 }
}
```

## File based token cache

In MSAL.NET, an in-memory token cache is provided by default.

### Serialization is customizable in Windows desktop apps and web apps/web APIs

In the case of .NET Framework and .NET core, if you don't do anything extra, the in-memory token cache lasts for the duration of the application. To understand why serialization isn't provided out of the box, remember MSAL .NET desktop/core applications can be console or Windows applications (which would have access to the file system), **but also** Web applications or web API. These Web apps and web APIs might use some specific cache mechanisms like databases, distributed caches, redis caches and so on. To have a persistent token cache application in .NET Desktop or Core, you'll need to customize the serialization.

Classes and interfaces involved in token cache serialization are the following types:

- ``ITokenCache``, which defines events to subscribe to token cache serialization requests, as well as methods to serialize or de-serialize the cache at various formats (ADAL v3.0, MSAL 2.x, and MSAL 3.x = ADAL v5.0)
- ``TokenCacheCallback`` is a callback passed to the events so that you can handle the serialization. they'll be called with arguments of type ``TokenCacheNotificationArgs``.
- ``TokenCacheNotificationArgs`` only provides the ``ClientId`` of the application and a reference to the user for which the token is available

  ![image](https://user-images.githubusercontent.com/13203188/56027172-d58d1480-5d15-11e9-8ada-c0292f1800b3.png)

> [!IMPORTANT]
> MSAL.NET creates token caches for you and provides you with the `IToken` cache when you call an application's `GetUserTokenCache` and `GetAppTokenCache` methods. You aren't supposed to implement the interface yourself. Your responsibility, when you implement a custom token cache serialization, is to:
>
> - React to `BeforeAccess` and `AfterAccess` "events" (or they *Async* counterpart). The`BeforeAccess` delegate is responsible to deserialize the cache, whereas the `AfterAccess` one is responsible for serializing the cache.
> - Part of these events store or load blobs, which are passed through the event argument to whatever storage you want.

The strategies are different depending on if you're writing a token cache serialization for a public client application (Desktop), or a confidential client application (web app/web API, daemon app).

Since MSAL V2.x you have several options, depending on if you want to serialize the cache only to the MSAL.NET format (unified format cache that is common with MSAL, but also across the platforms), or if you also want to support the [legacy](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization) Token cache serialization of ADAL V3.

The customization of Token cache serialization to share the SSO state between ADAL.NET 3.x, ADAL.NET 5.x, and MSAL.NET is explained in part of the following sample: [active-directory-dotnet-v1-to-v2](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2)

### Simple token cache serialization (MSAL only)

Below is an example of a naive implementation of custom serialization of a token cache for desktop applications. Here the user token cache in a file in the same folder as the application.

After you build the application, you enable the serialization by calling ``TokenCacheHelper.EnableSerialization()`` passing the application `UserTokenCache`

```CSharp
app = PublicClientApplicationBuilder.Create(ClientId)
    .Build();
TokenCacheHelper.EnableSerialization(app.UserTokenCache);
```

This helper class looks like the following code snippet:

```CSharp
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

A preview of a product quality token cache file-based serializer for public client applications (for desktop applications running on Windows, Mac and linux) is available from the [Microsoft.Identity.Client.Extensions.Msal](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/tree/master/src/Microsoft.Identity.Client.Extensions.Msal) open-source library. You can include it in your applications from the following nuget package: [Microsoft.Identity.Client.Extensions.Msal](https://www.nuget.org/packages/Microsoft.Identity.Client.Extensions.Msal/).

> [!NOTE]
> Disclaimer. The  Microsoft.Identity.Client.Extensions.Msal library is an extension over MSAL.NET. Classes in these libraries might make their way into MSAL.NET in the future, as is or with breaking changes.

### Dual token cache serialization (MSAL unified cache + ADAL V3)

If you want to implement token cache serialization both with the Unified cache format (common to ADAL.NET 4.x and MSAL.NET 2.x, and with other MSALs of the same generation or older, on the same platform), you can get inspired by the following code:

```CSharp
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

```CSharp
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
   usertokenCache = cache;
   UnifiedCacheFileName = unifiedCacheFileName;
   AdalV3CacheFileName = adalV3CacheFileName;

   usertokenCache.SetBeforeAccess(BeforeAccessNotification);
   usertokenCache.SetAfterAccess(AfterAccessNotification);
  }

  /// <summary>
  /// Token cache
  /// </summary>
  static ITokenCache usertokenCache;

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
> [Calling a web API from the desktop app](scenario-desktop-call-api.md)
