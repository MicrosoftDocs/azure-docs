---
title: Desktop app calling Web APIs - scenario landing page | Azure
description: Learn how to build a desktop app calling web apis on behalf of the user
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/16/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a desktop app that can call Web APIs on behalf of its user, using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Scenario - Desktop application calling an API on behalf of the user

Learn all you need to build a daemon application calling Web APIs

## Overview

You write a desktop application, and you want to sign-in users to your application and call Web APIs such as the Microsoft Graph, other Microsoft APIs, or your own Web API. You have several possibilities:

- If your web application supports graphical controls, for instance if it's a Windows.Form application or a WPF application, you can use the interactive token acquisition.
- For Windows hosted applications, it's also possible for applications running on computers joined to a Windows domain or AAD joined to acquire a token silently by using Integrated Windows Authentication.
- Finally, and although it's not recommended, you can use Username/Password in public client applications; It's still needed in some scenarios (like DevOps), but beware that using it will impose constraints
  on your application. For instance it won't be able to sign-in user who need to perform Multi Factor Authentication (conditional access) and it won't enable your application to benefit from Single Sign On. 
  It's also against the principles of modern authentication and is only provided for legacy reasons.

  ![Desktop application](media/scenarios/desktop-app.svg)

- If you are writing a portable command line tool, is probably a .NET Core application running on Linux or Mac, you will be able to use neither the interactive authentication (as .NET Core does not provide a [Web browser](https://aka.ms/msal-net-uses-web-browser)),
  nor Integrated Windows Authentication. The best option in that case is to use device code flow. This flow is also used for applications without a browser, such as  iOT applications

  ![Browserless application](media/scenarios/device-code-flow-app.svg)

### Getting started

If you have not already, created your first application by following the .NET desktop quickstart: [Quickstart: Acquire a token and call Microsoft Graph API from a Windows desktop app](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-windows-desktop)

The rest of this article contains all the content to understand how to build a desktop application

### Specifics

Desktop applications have a number of specificities. this depends mainly on whether your application uses the interactive authentication or not.

## App Registration specifics

### Supported accounts types

The account types supported in desktop application depend on the experience you want to light-up, and therefore on the flows you want to use

#### Audience for interactive token acquisition

If  your desktop application uses interactive authentication, you can sign-in users from any [account type](v2-supported-account-types.md)

#### Audience for desktop app silent flows

- if you intend to leverage Integrated Windows authentication or username password, your need to sign-in users in your own tenant (LOB developer), or in Azure Active directory organizations (ISV scenario). These are not supported for Microsoft personal accounts
- If you want to use the Device code flow, you cannot sign-in users with their Microsoft personal accounts yet
- If you sign-in users with social identities passing a B2C authority and policy, you can only use the interactive and username-password authentication.

### API permissions

Desktop application will call APIs on behalf of the signed-in user. they need to request delegated permissions. They cannot request application permissions (which are only handled in daemon applications)

### Redirect URIs for desktop applications

Again the redirect URIs to use in desktop application will depend on the flow you want to use. 

- if you are using the interactive authentication, you will want to use `https://login.microsoftonline.com/common/oauth2/nativeclient`. You'll achieve this by clicking the corresponding URL in the **Authentication** section for your application
  
  > [!IMPORTANT]
  > Today MSAL.NET uses another Redirect URI by default in desktop applications running on Windows (`urn:ietf:wg:oauth:2.0:oob`). In the future we'll want to change this default, and therefore we recommend that you use `https://login.microsoftonline.com/common/oauth2/nativeclient`

- if you app is only using Integrated Windows authentication, Username/Password or Device Code Flow, you don't need to register a redirect URI for your application. This is because these flows do a round-trip to the Microsoft identity platform v2.0 endpoint and your application won't be called back on any specific URI. In order to distinguish them from a confidential client application flow which does not have redirect URIs either (the client credential flow used in daemon applications), you need to express that your application is a public client application. This is achieved by going to the **Authentication** section for your application, and in the **Advanced settings** sub-section, choose **Yes**, to the question **Treat application as a public client** (in the **Default client type** paragraph)

  ![Allow public client](media/scenarios/Defaut-client-type.png)

## Desktop application's code configuration

From a code point of view, desktop applications are public client applications, and therefore you will build and manipulate MSAL.NET `IPublicClientApplication`. Again things will be a bit different wether you use interactive authentication or not.

![IPublicClientApplication](media/scenarios/PublicClientApplication.png)

### Building a Public client application

#### Exclusively by code

The following code instantiates a Public client application, signing-in users in the Microsoft Azure public cloud, with their work and school accounts, or their personal Microsoft accounts.

```CSharp
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId)
    .Build();
```

If you intend to use interactive authentication, as seen above, you want to use the .WithRedirectUri modifier:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithRedirectUri(PublicClientApplicationBuilder.DefaultInteractiveDesktopRedirectUri)
         .Build();
```

#### Using configuration files

The following code instantiates a Public client application from a configuration object, which could be filled-in programmatically or read from a configuration file

```CSharp
PublicClientApplicationOptions options = GetOptions(); // your own method
IPublicClientApplication app = PublicClientApplicationBuilder.CreateWithApplicationOptions(options)
    .Build();
```

#### More elaborated configuration

You can elaborate the application building by adding a number of modifiers. For instance if you want your application to be a multi-tenant application in a national or sovereign cloud, you could write:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAadAuthority(AzureCloudInstance.AzureUsGovernment, 
                         AadAuthorityAudience.AzureAdMultipleOrgs)
        .Build();
```

There is also an override for ADFS 2019

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAdfsAuthority("https://consoso.com/adfs")
        .Build();
```

Finally, if you want to acquire tokens for an Azure AD B2C tenant, can specify your tenant like this:

```CSharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithB2CAuthority("https://fabrikamb2c.b2clogin.com/tfp/{tenant}/{PolicySignInSignUp}")
        .Build();
```

#### Learn more

To learn more on how to configure an MSAL.NET desktop application:

- For the list of all modifiers available on `PublicClientApplicationBuilder`, see the reference documentation [PublicClientApplicationBuilder](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.appconfig.publicclientapplicationbuilder?view=azure-dotnet-preview#methods)
- For the description of all the options exposed in `PublicClientApplicationOptions` see [PublicClientApplicationOptions ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.appconfig.publicclientapplicationoptions?view=azure-dotnet-preview), in the reference documentation


#### complete example - configuration of a public client application with configuration Options

Imagine a .NET Core console application which has the following `appsettings.json` configuration file:

```JSon
{
  "Authentication": {
    "AzureCloudInstance": "AzurePublic",
    "AadAuthorityAudience": "AzureAdMultipleOrgs",
    "ClientId": "ebe2ab4d-12b3-4446-8480-5c3828d04c50"
  },

  "WebAPI": {
    "MicrosoftGraphBaseEndpoint": "https://graph.microsoft.com"
  }
}
```

You have very little code to read this file using the .NET provided configuration framework;

```CSharp
public class SampleConfiguration
{
 /// <summary>
 /// Authentication options
 /// </summary>
 public PublicClientApplicationOptions PublicClientApplicationOptions { get; set; }

 /// <summary>
 /// Base URL for Microsoft Graph (it varies depending on whether the application is ran
 /// in Microsoft Azure public clouds or national / sovereign clouds
 /// </summary>
 public string MicrosoftGraphBaseEndpoint { get; set; }

 /// <summary>
 /// Reads the configuration from a json file
 /// </summary>
 /// <param name="path">Path to the configuration json file</param>
 /// <returns>SampleConfiguration as read from the json file</returns>
 public static SampleConfiguration ReadFromJsonFile(string path)
 {
  // .NET configuration
  IConfigurationRoot Configuration;
  var builder = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile(path);
  Configuration = builder.Build();

  // Read the auth and graph endpoint config
  SampleConfiguration config = new SampleConfiguration()
  {
   PublicClientApplicationOptions = new PublicClientApplicationOptions()
  };
  Configuration.Bind("Authentication", config.PublicClientApplicationOptions);
  config.MicrosoftGraphBaseEndpoint =
  Configuration.GetValue<string>("WebAPI:MicrosoftGraphBaseEndpoint");
  return config;
 }
}
```

Now, to create your application, you will just need to write the following code:

```CSharp
SampleConfiguration config = SampleConfiguration.ReadFromJsonFile("appsettings.json");
var app = PublicClientApplicationBuilder.CreateWithApplicationOptions(config.PublicClientApplicationOptions)
           .Build();
```

and of course, you understand that before the .Build(), you can override your configuration with calls to .WithXXX as seen previously.

## Acquiring a token in a desktop application

Once you have built you `IPublicClientApplication` you will use it to acquire a token that you will then use to call a Web API defined by its `scopes`. Whatever the experience you provide in your application, the pattern that you will want to use is systematically:

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

Here is now the detail of the various way to acquire tokens in a desktop application

### Acquiring a token interactively

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

#### Mandatory parameters

`AcquireTokenInteractive` has only one mandatory parameter ``scopes``, which contains an enumeration of strings which define the scopes for which a token is required. If the token is for the Microsoft Graph, the required scopes can be found in api reference of each Microsoft graph API in the section named "Permissions". For instance, to [list the user's contacts](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/user_list_contacts), the scope "User.Read", "Contacts.Read" will need to be used. See also [Microsoft Graph permissions reference](https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference).

On Android, you need to also specify the parent activity (using `.WithParentActivityOrWindow`, see below) so that the token gets back to that parent activity after the interaction. If you don't specify it, an exception will be thrown when calling `.ExecuteAsync()`.

#### Specific optional parameters

##### WithParentActivityOrWindow

Being interactive, UI is important. `AcquireTokenInteractive` has one specific optional parameters enabling to specify, for platforms supporting it, the parent UI. In the case of a desktop application `.WithParentActivityOrWindow` has a different type depending on the platform:

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
- On Windows, you must call `AcquireTokenInteractive` from the UI thread so that the embedded browser gets the appropriate UI synchronization context.  Not calling from the UI thread may cause messages to not pump properly and/or deadlock scenarios with the UI. One way of achieving this, if you are not on the UI thread is to use the `Dispatcher` on WPF.
- If you are using WPF, to get a window from a WPF control, you can use  `WindowInteropHelper.Handle` class. The call is then, from a WPF control (this):
  
  ```CSharp
  result = await app.AcquireTokenInteractive(scopes)
                    .WithParentActivityOrWindow(new WindowInteropHelper(this).Handle)
                    .ExecuteAsync();
  ```

##### WithPrompt

`WithPrompt()` is used to control the interactivity with the user by specifying a Prompt

<img src="https://user-images.githubusercontent.com/13203188/53438042-3fb85700-39ff-11e9-9a9e-1ff9874197b3.png" width="25%" />

The class defines the following constants:

- ``SelectAccount``: will force the STS to present the account selection dialog containing accounts for which the user has a session. This is useful when applications developers want to let user choose among different identities. This is done by sending ``prompt=select_account`` to the identity provider. This is the default, and it does of good job of providing the best possible experience based on the available information (account, presence of a session for the user, etc ...). You should not change it unless you have good reason to do it.
- ``Consent``: enables the application developer to force the user be prompted for consent even if consent was granted before. This is done by sending `prompt=consent` to the identity provider. This can be used in some security focused applications where the organization governance demands that the user is presented the consent dialog each time the application is used.
- ``ForceLogin``: enables the application developer to have the user prompted for credentials by the service even if this would not be needed. This can be useful if Acquiring a token fails, to let the user re-sign-in. This is done by sending `prompt=login` to the identity provider. Again, we've seen it used in some security focused applications where the organization governance demands that the user re-logs-in each time they access specific parts of an application.
- ``Never`` (for .NET 4.5 and WinRT only) will not prompt the user, but instead will try to use the cookie stored in the hidden embedded web view (See below: Web Views in MSAL.NET). This might fail, and in that case `AcquireTokenInteractive` will throw an exception to notify that a UI interaction is needed, and you'll need to use another `Prompt` parameter.
- ``NoPrompt``: Won't send any prompt to the identity provider. This is actually only useful in the case of B2C edit profile policies (See [B2C specifics](AAD-B2C-specifics)).

##### WithExtraScopeToConsent

This is used in an advanced scenario where you want the user to pre-consent to several resources upfront (and don't want to use the incremental consent which is normally used with MSAL.NET / the Microsoft identity platform v2.0). For details see [How-to : have the user consent upfront for several resources](#have-the-user-consent-upfront-for-several-resources) below

```CSharp
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

##### WithCustomWebUi

###### WithCustomWebUi is an extensibility point

`WithCustomWebUi` is an extensibility point that allows you provide your own UI in public client applications, and to let the user go through the /Authorize endpoint of the identity provider and let them sign-in and consent. MSAL.NET will then be able to redeem the authentication code and get a token. It's for instance used in Visual Studio to have electrons applications (for instance VS Feedback) provide the web interaction, but leave it to MSAL.NET to do most of the work. You can also use it if you want to provide UI automation. Note that, in public client applications, MSAL.NET leverages the PKCE standard ([RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636)) to ensure that security is respected: Only MSAL.NET can redeem the code.

  ```CSharp
  using Microsoft.Identity.Client.Extensions;
  ```

###### How to use WithCustomWebUi

To leverage this you need to:
  
  1. Implement the `ICustomWebUi`  interface (See [here](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/src/Microsoft.Identity.Client/Extensibility/ICustomWebUI.cs#L32-L70). You'll basically need to implement one method `AcquireAuthorizationCodeAsync` accepting the authorization code URL (computed by MSAL.NET), letting the user go through the interaction with the identity provider, and then returning back the URL by which the identity provider would have called your implementation back (including the authorization code). In case of issues, your implementation should throw a `MsalExtensionException` exception in order to nicely cooperate with MSAL.
  2. In your `AcquireTokenInteractive` call you can use `.WithCustomUI()` modifier passing the instance of your custom web UI

     ```CSharp
     result = await app.AcquireTokenInteractive(scopes)
                       .WithCustomWebUi(yourCustomWebUI)
                       .ExecuteAsync();
     ```

###### Examples of implementation of ICustomWebUi in test automation - SeleniumWebUI

The MSAL.NET team have rewritten our UI tests to leverage this extensibility mechanism. In case you are interested you can have a look at the [SeleniumWebUI](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/blob/053a98d16596be7e9ca1ab916924e5736e341fe8/tests/Microsoft.Identity.Test.Integration/Infrastructure/SeleniumWebUI.cs#L15-L160) class in the MSAL.NET source code

##### Other optional parameters

For the list of all the other optional parameters for AcquireTokenInteractive see the reference doucumentation for [AcquireTokenInteractiveParameterBuilder ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.apiconfig.acquiretokeninteractiveparameterbuilder?view=azure-dotnet-preview#methods)

### Acquiring a token for the domain user in Domain or Azure AD joined machine

If you want to sign-in with the domain user on a domain or Azure AD joined machine, you need to use:

```csharp
AcquireTokenByIntegratedWindowsAuth(IEnumerable<string> scopes)
```

#### Constraints

- AcquireTokenByIntegratedWindowsAuth (IWA) is only usable for **Federated** users only, i.e. those created in an Active Directory and backed by Azure Active Directory. Users created directly in AAD, without AD backing - **managed** users - cannot use this auth flow. This limitation does not affect the Username/Password flow.
- IWA is for apps written for .NET Framework, .NET Core and UWP platforms
- IWA does NOT bypass MFA (multi factor authentication). If MFA is configured, IWA might fail if an MFA challenge is required, because MFA requires user interaction.
  > [!NOTE]
  > This one is tricky. IWA is non-interactive, but 2FA requires user interactivity. You do not control when the identity provider requests 2FA to be performed, the tenant admin does. From our observations, 2FA is required when you login from a different country, when not connected via VPN to a corporate network, and sometimes even when connected via VPN. Don’t expect a deterministic set of rules, Azure Active Directory uses AI to continuously learn if 2FA is required. You should fallback to a user prompt (interactive authentication or device code flow) if IWA fails

- The authority passed in the `PublicClientApplicationBuilder` needs to be:
  - tenanted (of the form `https://login.microsoftonline.com/{tenant}/` where `tenant` is either the guid representing the tenant ID or a domain associated with the tenant.
  - for any work and school accounts (`https://login.microsoftonline.com/organizations/`)

  > Microsoft personal accounts are not supported (you cannot use /common or /consumers tenants)

- Because Integrated Windows Authentication is a silent flow:
  - the user of your application must have previously consented to use the application 
  - or the tenant admin must have previously consented to all users in the tenant to use the application.
  - This means that:
    - either you as a developer have pressed the **Grant** button on the Azure portal for yourself, 
    - or a tenant admin has pressed the **Grant/revoke admin consent for {tenant domain}** button in the **API permissions** tab of the registration for the application (See [Add permissions to access web APIs](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-configure-app-access-web-apis#add-permissions-to-access-web-apis))
    - or you have provided a way for users to consent to the application (See [Requesting individual user consent](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#requesting-individual-user-consent))
    - or you have provided a way for the tenant admin to consent for the application (See [admin consent](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#requesting-consent-for-an-entire-tenant))

- This flow is enabled for .net desktop, .net core and Windows Universal Apps. On .net core only the overload taking the username is available as the .NET Core platform cannot ask the username to the OS.
  
For more details on consent see [v2.0 permissions and consent](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent)

#### How to use it

You should normally use only one parameter (`scopes`). However depending on the way your Windows administrator has setup the policies, it can be possible that applications on your windows machine are not allowed to lookup the logged-in user. In that case, use a second method `.WithUsername()` and pass in the username of the logged in user as a UPN format - `joe@contoso.com`.

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

For the list of possible modifiers on AcquireTokenByIntegratedWindowsAuthentication, see [AcquireTokenByIntegratedWindowsAuthParameterBuilder ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.apiconfig.acquiretokenbyintegratedwindowsauthparameterbuilder?view=azure-dotnet-preview#methods)

### Acquiring a token using Username / Password

#### This flow is not recommended

This flow is **not recommended** because your application asking a user for their password is not secure. For more information about this problem, see [this article](https://news.microsoft.com/features/whats-solution-growing-problem-passwords-says-microsoft/). The preferred flow for acquiring a token silently on Windows domain joined machines is [Integrated Windows Authentication](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Integrated-Windows-Authentication). Otherwise you can also use [Device code flow](https://aka.ms/msal-net-device-code-flow)

> Although this is useful in some cases (DevOps scenarios), if you want to use Username/password in interactive scenarios where you provide your onw UI, you should really think about how to move away from it. By using username/password you are giving-up a number of things:
> - core tenants of modern identity: password gets fished, replayed. Because we have this concept of a share secret that can be intercepted.
> This is incompatible with passwordless.
> - users who need to do MFA won't be able to sign-in (as there is no interaction)
> - Users won't be able to do single sign-on

#### Constraints

Apart from the [Integrated Windows Authentication constraints](), the following constraints also apply:

- Available starting with MSAL 2.1.0
- The Username/Password flow is not compatible with conditional access and multi-factor authentication: As a consequence, if your app runs in an Azure AD tenant where the tenant admin requires multi-factor authentication, you cannot use this flow. Many organizations do that.
- It works only for Work and school accounts (not MSA)
- The flow is available on .net desktop and .net core, but not on UWP

#### B2C specifics

[More information on using ROPC with B2C](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/AAD-B2C-specifics#resource-owner-password-credentials-ropc-with-b2c).

#### How to use it?

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
   // ex.Message = "Could not identify the user logged into the OS. See http://aka.ms/msal-net-iwa for details."
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

For details on all the modifiers that can be applied to `AcquireTokenByUsernamePassword`, see [AcquireTokenByUsernamePasswordParameterBuilder ](https://docs.microsoft.com/en-us/dotnet/api/microsoft.identity.client.apiconfig.acquiretokenbyusernamepasswordparameterbuilder?view=azure-dotnet-preview#methods)

### Acquiring a token in a command line tool

If  you are writing a command line tool that does not how Web controls, you need to use `AcquireTokenWithDeviceCode`.

## File based token cache

## Calling an API

## Handling errors in desktop applications

### Incremental consent

### Handling conditional access

## Other specificities

### Have the user consent upfront for several resources

> Note: Getting consent for several resources works for Azure AD v2.0, but not for Azure AD B2C. B2C supports only admin consent, not user consent.

The Azure AD v2.0 endpoint does not allow you to get a token for several resources at once. Therefore the scopes parameter should only contain scopes for a single resource. However, you can ensure that the user pre-consents to several resources by using the `extraScopesToConsent` parameter.

For instance if you have two resources, which have 2 scopes each:

- `https://mytenant.onmicrosoft.com/customerapi` (with 2 scopes `customer.read` and `customer.write`)
- `https://mytenant.onmicrosoft.com/vendorapi` (with 2 scopes `vendor.read` and `vendor.write`)

you should use the .WithAdditionalPromptToConsent modifier which has the `extraScopesToConsent` parameter

For instance:

```CSharp
string[] scopesForCustomerApi = new string[]
{
  "https://mytenant.onmicrosoft.com/customerapi/customer.read",
  "https://mytenant.onmicrosoft.com/customerapi/customer.write"
};
string[] scopesForVendorApi = new string[]
{
 "https://mytenant.onmicrosoft.com/vendorapi/vendor.read",
 "https://mytenant.onmicrosoft.com/vendorapi/vendor.write"
};

var accounts = await app.GetAccountsAsync();
var result = await app.AcquireTokenInteractive(scopesForCustomerApi)
                     .WithAccount(accounts.FirstOrDefault())
                     .WithExtraScopeToConsent(scopesForVendorApi)
                     .ExecuteAsync();
```

This will get you an access token for the first Web API.
Then when you need to call the second one, you can call

```CSharp
AcquireTokenSilent(scopesForVendorApi, accounts.FirstOrDefault()).ExecuteAsync();
```

## Microsoft personal account require re-consenting each time the app is run

For Microsoft personal accounts users, re-prompting for consent on each native client (desktop/mobile app) call to authorize is the intended behavior. Native client identity is inherently insecure, and the Microsoft identity platform chose to mitigate this insecurity for consumer services by prompting for consent each time the application is authorized.

## Next Steps
