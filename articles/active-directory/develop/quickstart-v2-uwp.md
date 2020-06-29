---
title: Microsoft identity platform Windows UWP quickstart | Azure
description: Learn how a Universal Windows Platform (XAML) application can get an access token and call an API protected by Microsoft identity platform endpoint.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 12/12/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:UWP
#Customer intent: As an application developer, I want to learn how my Universal Windows Platform (XAML) application can get an access token and call an API that's protected by an Microsoft identity platform endpoint.
---

# Quickstart: Call the Microsoft Graph API from a Universal Windows Platform (UWP) application

This quickstart contains a code sample that demonstrates how a Universal Windows Platform (UWP) application can sign in users with personal accounts or work and school accounts, get an access token, and call the Microsoft Graph API. (See [How the sample works](#how-the-sample-works) for an illustration.)

> [!div renderon="docs"]
> ## Register and download your quickstart app
> [!div renderon="docs" class="sxs-lookup"]
> You have two options to start your quickstart application:
> * [Express] [Option 1: Register and auto configure your app and then download your code sample](#option-1-register-and-auto-configure-your-app-and-then-download-your-code-sample)
> * [Manual] [Option 2: Register and manually configure your application and code sample](#option-2-register-and-manually-configure-your-application-and-code-sample)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the new [Azure portal - App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/UwpQuickstartPage/sourceType/docs) pane.
> 1. Enter a name for your application and click **Register**.
> 1. Follow the instructions to download and automatically configure your new application for you in one click.
>
> ### Option 2: Register and manually configure your application and code sample
> [!div renderon="docs"]
> #### Step 1: Register your application
> To register your application and add the app's registration information to your solution, follow these steps:
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
> 1. Navigate to the Microsoft identity platform for developers [App registrations](https://aka.ms/MobileAppReg) page.
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter your application's registration information:
>      - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `UWP-App-calling-MsGraph`.
>      - In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (for example, Skype, Xbox, Outlook.com)**.
>      - Select **Register** to create the application.
> 1. In the list of pages for the app, select **Authentication**.
> 1. In the **Redirect URIs** | **Suggested Redirect URIs for public clients (mobile, desktop)** section, check **https://login.microsoftonline.com/common/oauth2/nativeclient**.
> 1. Select **Save**.

> [!div renderon="portal" class="sxs-lookup"]
> #### Step 1: Configure your application
> For the code sample for this quickstart to work, you need to add a redirect URI as **https://login.microsoftonline.com/common/oauth2/nativeclient**.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make this change for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-uwp/green-check.png) Your application is configured with these attributes.

#### Step 2: Download your Visual Studio project

> [!div renderon="docs"]
> [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-dotnet-native-uwp-v2/archive/msal3x.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Run the project using Visual Studio 2019.
> [!div renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-dotnet-native-uwp-v2/archive/msal3x.zip)

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties and it's ready to run.

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
> #### Step 3: Configure your Visual Studio project
>
> 1. Extract the zip file to a local folder close to the root of the disk, for example, **C:\Azure-Samples**.
> 1. Open the project in Visual Studio. You might be prompted to install a UWP SDK. In that case, accept.
> 1. Edit **MainPage.Xaml.cs** and replace the values of the `ClientId` field:
>
>    ```csharp
>    private const string ClientId = "Enter_the_Application_Id_here";
>    ```
> Where:
> - `Enter_the_Application_Id_here` - is the Application Id for the application you registered.
>
> > [!TIP]
> > To find the value of *Application ID*, go to the **Overview** section in the portal

#### Step 4: Run your application

If you want to try the quickstart on your Windows machine:

1. In the Visual Studio toolbar, choose the right platform (probably **x64** or **x86**, not ARM). You will observe that the target device changes from *Device* to *Local Machine*
1. Select Debug | **Start Without Debugging**

## More information

This section provides more information about the quickstart.

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-uwp/uwp-intro.svg)

### MSAL.NET

MSAL ([Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)) is the library used to sign in users and request security tokens. The security tokens are used to access an API protected by Microsoft Identity platform for developers. You can install MSAL by running the following command in Visual Studio's *Package Manager Console*:

```powershell
Install-Package Microsoft.Identity.Client
```

### MSAL initialization

You can add the reference for MSAL by adding the following code:

```csharp
using Microsoft.Identity.Client;
```

Then, MSAL is initialized using the following code:

```csharp
public static IPublicClientApplication PublicClientApp;
PublicClientApp = PublicClientApplicationBuilder.Create(ClientId)
                                                .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
                                                    .Build();
```

> |Where: ||
> |---------|---------|
> | `ClientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |

### Requesting tokens

MSAL has two methods for acquiring tokens in a UWP app: `AcquireTokenInteractive` and `AcquireTokenSilent`.

#### Get a user token interactively

Some situations require forcing users to interact with the Microsoft identity platform endpoint through a popup window to either validate their credentials or to give consent. Some examples include:

- The first-time users sign in to the application
- When users may need to reenter their credentials because the password has expired
- When your application is requesting access to a resource, that the user needs to consent to
- When two factor authentication is required

```csharp
authResult = await App.PublicClientApp.AcquireTokenInteractive(scopes)
                      .ExecuteAsync();
```

> |Where:||
> |---------|---------|
> | `scopes` | Contains the scopes being requested, such as `{ "user.read" }` for Microsoft Graph or `{ "api://<Application ID>/access_as_user" }` for custom web APIs. |

#### Get a user token silently

Use the `AcquireTokenSilent` method to obtain tokens to access protected resources after the initial `AcquireTokenInteractive` method. You don’t want to require the user to validate their credentials every time they need to access a resource. Most of the time you want token acquisitions and renewal without any user interaction

```csharp
var accounts = await App.PublicClientApp.GetAccountsAsync();
var firstAccount = accounts.FirstOrDefault();
authResult = await App.PublicClientApp.AcquireTokenSilent(scopes, firstAccount)
                                      .ExecuteAsync();
```

> |Where: ||
> |---------|---------|
> | `scopes` | Contains the scopes being requested, such as `{ "user.read" }` for Microsoft Graph or `{ "api://<Application ID>/access_as_user" }` for custom web APIs |
> | `firstAccount` | Specifies the first user account in the cache (MSAL supports multiple users in a single app) |

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

Try out the Windows desktop tutorial for a complete step-by-step guide on building applications and new features, including a full explanation of this quickstart.

> [!div class="nextstepaction"]
> [UWP - Call Graph API tutorial](tutorial-v2-windows-uwp.md)
