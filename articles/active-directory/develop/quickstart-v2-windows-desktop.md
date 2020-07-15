---
title: Microsoft identity platform Windows desktop quickstart
description: Learn how a Windows desktop .NET (XAML) application can get an access token and call an API protected by an Microsoft identity platform endpoint
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 12/12/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40
#Customer intent: As an application developer, I want to learn how my Windows desktop .NET application can get an access token and call an API that's protected by an Microsoft identity platform endpoint.
---

# Quickstart: Acquire a token and call Microsoft Graph API from a Windows desktop app

In this quickstart, you'll learn how to write a Windows desktop .NET (WPF) application that can sign in personal, work and school accounts, get an access token, and call the Microsoft Graph API. (See [How the sample works](#how-the-sample-works) for an illustration.)

> [!div renderon="docs"]
> ## Register and download your quickstart app
> You have two options to start your quickstart application:
> * [Express] [Option 1: Register and auto configure your app and then download your code sample](#option-1-register-and-auto-configure-your-app-and-then-download-your-code-sample)
> * [Manual] [Option 2: Register and manually configure your application and code sample](#option-2-register-and-manually-configure-your-application-and-code-sample)
>
> ### Option 1: Register and auto configure your app and then download your code sample
>
> 1. Go to the new [Azure portal - App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/WinDesktopQuickstartPage/sourceType/docs).
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions to download and automatically configure your new application with just one click.
>
> ### Option 2: Register and manually configure your application and code sample
>
> #### Step 1: Register your application
> To register your application and add the app's registration information to your solution manually, follow these steps:
>
> 1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
> 1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
> 1. Go to the [App registrations](https://aka.ms/MobileAppReg) blade for Azure Active Directory in the Azure portal.
> 1. Select **New registration**.
>      - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `Win-App-calling-MsGraph`.
>      - In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (for example, Skype, Xbox, Outlook.com)**.
>      - Select **Register** to create the application.
> 1. In the list of pages for the app, select **Authentication**.
> 1. In the **Redirect URIs** | **Suggested Redirect URIs for public clients (mobile, desktop)** section, use **https://login.microsoftonline.com/common/oauth2/nativeclient**.
> 1. Select **Save**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in Azure portal
> For the code sample for this quickstart to work, you need to add a reply URL as **https://login.microsoftonline.com/common/oauth2/nativeclient**.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make this change for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-windows-desktop/green-check.png) Your application is configured with these attributes.

#### Step 2: Download your Visual Studio project

> [!div renderon="docs"]
> [Download the Visual Studio project](https://github.com/Azure-Samples/active-directory-dotnet-desktop-msgraph-v2/archive/msal3x.zip)

> [!div class="sxs-lookup" renderon="portal"]
> Run the project using Visual Studio 2019.
> [!div renderon="portal" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-dotnet-desktop-msgraph-v2/archive/msal3x.zip)

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We have configured your project with values of your app's properties and it's ready to run.

> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`

> [!div renderon="docs"]
> #### Step 3: Configure your Visual Studio project
> 1. Extract the zip file to a local folder close to the root of the disk, for example, **C:\Azure-Samples**.
> 1. Open the project in Visual Studio.
> 1. Edit **App.Xaml.cs** and replace the values of the fields `ClientId` and `Tenant` with the following code:
>
>    ```csharp
>    private static string ClientId = "Enter_the_Application_Id_here";
>    private static string Tenant = "Enter_the_Tenant_Info_Here";
>    ```
>
> Where:
> - `Enter_the_Application_Id_here` - is the **Application (client) ID** for the application you registered.
> - `Enter_the_Tenant_Info_Here` - is set to one of the following options:
>   - If your application supports **Accounts in this organizational directory**, replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
>   - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`
>   - If your application supports **Accounts in any organizational directory and personal Microsoft accounts**, replace this value with `common`
>
> > [!TIP]
> > To find the values of **Application (client) ID**, **Directory (tenant) ID**, and **Supported account types**, go to the app's **Overview** page in the Azure portal.

## More information

### How the sample works
![Shows how the sample app generated by this quickstart works](media/quickstart-v2-windows-desktop/windesktop-intro.svg)

### MSAL.NET
MSAL ([Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client)) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. You can install MSAL by running the following command in Visual Studio's **Package Manager Console**:

```powershell
Install-Package Microsoft.Identity.Client -IncludePrerelease
```

### MSAL initialization

You can add the reference for MSAL by adding the following code:

```csharp
using Microsoft.Identity.Client;
```

Then, initialize MSAL using the following code:

```csharp
public static IPublicClientApplication PublicClientApp;
PublicClientApplicationBuilder.Create(ClientId)
                .WithRedirectUri("https://login.microsoftonline.com/common/oauth2/nativeclient")
                .WithAuthority(AzureCloudInstance.AzurePublic, Tenant)
                .Build();
```

> |Where: | Description |
> |---------|---------|
> | `ClientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |

### Requesting tokens

MSAL has two methods for acquiring tokens: `AcquireTokenInteractive` and `AcquireTokenSilent`.

#### Get a user token interactively

Some situations require forcing users interact with the Microsoft identity platform endpoint through a popup window to either validate their credentials or to give consent. Some examples include:

- The first time users sign in to the application
- When users may need to reenter their credentials because the password has expired
- When your application is requesting access to a resource that the user needs to consent to
- When two factor authentication is required

```csharp
authResult = await App.PublicClientApp.AcquireTokenInteractive(_scopes)
                                      .ExecuteAsync();
```

> |Where:| Description |
> |---------|---------|
> | `_scopes` | Contains the scopes being requested, such as `{ "user.read" }` for Microsoft Graph or `{ "api://<Application ID>/access_as_user" }` for custom web APIs. |

#### Get a user token silently

You don't want to require the user to validate their credentials every time they need to access a resource. Most of the time you want token acquisitions and renewal without any user interaction. You can use the `AcquireTokenSilent` method to obtain tokens to access protected resources after the initial `AcquireTokenInteractive` method:

```csharp
var accounts = await App.PublicClientApp.GetAccountsAsync();
var firstAccount = accounts.FirstOrDefault();
authResult = await App.PublicClientApp.AcquireTokenSilent(scopes, firstAccount)
                                      .ExecuteAsync();
```

> |Where: | Description |
> |---------|---------|
> | `scopes` | Contains the scopes being requested, such as `{ "user.read" }` for Microsoft Graph or `{ "api://<Application ID>/access_as_user" }` for custom web APIs. |
> | `firstAccount` | Specifies the first user in the cache (MSAL support multiple users in a single app). |

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

Try out the Windows desktop tutorial for a complete step-by-step guide on building applications and new features, including a full explanation of this quickstart.

> [!div class="nextstepaction"]
> [Call Graph API tutorial](https://docs.microsoft.com/azure/active-directory/develop/guidedsetups/active-directory-windesktop)
