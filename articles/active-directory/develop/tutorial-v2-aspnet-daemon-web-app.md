---
title: Call an ASP.NET Web API protected by Azure AD- Microsoft identity platform
description: In this quickstart, learn how to call an ASP.NET web API protected by Azure Active Directory from a Windows Desktop (WPF) application. The WPF client authenticates a user, requests an access token, and calls the web API.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/20/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET
#Customer intent: As an application developer, I want to know how to set up OpenId Connect authentication in a web application built using Node.js with Express.
ms.collection: M365-identity-device-management
---

# Build a multi-tenant daemon with the Microsoft identity platform endpoint

In this tutorial, you learn how to use the Microsoft identity platform to access the data of Microsoft business customers in a long-running, non-interactive process. The sample daemon uses the [OAuth2 client credentials grant](v2-oauth2-client-creds-grant-flow.md) to acquire an access token, which it then uses to call the [Microsoft Graph](https://graph.microsoft.io) and access organizational data.

The app is built as an ASP.NET MVC application, and uses the OWIN OpenID Connect middleware to sign in users.  Its "daemon" component in this sample is an API controller, which, when called, pulls in a list of users in the customer's Azure AD tenant from Microsoft Graph.  This `SyncController.cs` is triggered by an AJAX call in the web application, and uses the [Microsoft Authentication Library (MSAL) for .NET](msal-overview.md) to acquire an access token for Microsoft Graph.

For a simpler console daemon application, check out the [.NET Core daemon quickstart](quickstart-v2-netcore-daemon.md).

## Scenario

Because the app is a multi-tenant app intended for use by any Microsoft business customer, it must provide a way for customers to "sign up" or "connect" the application to their company data.  During the connect flow, a company administrator first grants **application permissions** directly to the app so that it can access company data in a non-interactive fashion, without the presence of a signed-in user.  The majority of the logic in this sample shows how to achieve this connect flow using the identity platform [admin consent](v2-permissions-and-consent.md#using-the-admin-consent-endpoint) endpoint.

![Topology](./media/tutorial-v2-aspnet-daemon-webapp/topology.png)

For more information on the concepts used in this sample, be sure to read the [identity platform endpoint client credentials protocol documentation](v2-oauth2-client-creds-grant-flow.md).

## Prerequisites

To run the sample in this quickstart, you'll need:

- [Visual Studio 2017 or 2019](https://visualstudio.microsoft.com/downloads/)
- An Azure Active Directory (Azure AD) tenant. For more information on how to get an Azure AD tenant, see [How to get an Azure AD tenant](quickstart-create-new-tenant.md)
- One or more user accounts in your Azure AD tenant. This sample will not work with a Microsoft account (formerly Windows Live account). Therefore, if you signed in to the [Azure portal](https://portal.azure.com) with a Microsoft account and have never created a user account in your directory before, you need to do that now.

## Clone or download this repository

From your shell or command line:

```Shell
git clone https://github.com/Azure-Samples/active-directory-dotnet-daemon-v2.git
```

Or [download the sample in a ZIP file](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp/archive/master.zip).

## Register the sample application with your Azure AD tenant

There is one project in this sample. To register it, you can:

- Either follow the steps [Register the sample with your Azure Active Directory tenant](#register-the-sample-application-with-your-azure-ad-tenant) and [Configure the sample to use your Azure AD tenant](#choose-the-azure-ad-tenant-for-the-applications)
- Or use PowerShell scripts that:
  - **Automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you
  - Modify the Visual Studio projects' configuration files.

If you want to use this automation:

1. On Windows, run PowerShell and navigate to the root of the cloned directory
1. In PowerShell run:

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Azure AD application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```PowerShell
   .\AppCreationScripts\Configure.ps1
   ```

   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp/blob/master/AppCreationScripts/AppCreationScripts.md)

1. Open the Visual Studio solution and click start to run the code.

If you don't want to use this automation, follow the steps below.

### Choose the Azure AD tenant for the applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account is present in more than one Azure AD tenant, select your profile at the top-right corner in the menu on top of the page, and then **switch directory**.
   Change your portal session to the desired Azure AD tenant.

### Register the client app (dotnet-web-daemon-v2)

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. When the **Register an application page** appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `dotnet-web-daemon-v2`.
   - In the **Supported account types** section, select **Accounts in any organizational directory**.
   - In the Redirect URI (optional) section, select **Web** in the combo-box and enter the following redirect URIs:
       - `https://localhost:44316/`
       - `https://localhost:44316/Account/GrantPermissions`
          If there are more than one redirect URIs, you'd need to add them from the **Authentication** tab later after the app has been created successfully.
1. Select **Register** to create the application.
1. On the app **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the Visual Studio configuration file for this project.
1. In the list of pages for the app, select **Authentication**.
   - In the **Advanced settings** section set **Logout URL** to `https://localhost:44316/Account/EndSession`
   - In the **Advanced settings** | **Implicit grant** section, check **Access tokens** and **ID tokens** as this sample requires the [Implicit grant flow](v2-oauth2-implicit-grant-flow.md) to be enabled to sign in the user, and call an API.
1. Select **Save**.
1. From the **Certificates & secrets** page, in the **Client secrets** section, choose **New client secret**:

   - Type a key description (of instance `app secret`),
   - Select a key duration of either **In 1 year**, **In 2 years**, or **Never Expires**.
   - When you press the **Add** button, the key value will be displayed, copy, and save the value in a safe location.
   - You'll need this key later to configure the project in Visual Studio. This key value will not be displayed again, nor retrievable by any other means,
     so record it as soon as it is visible from the Azure portal.
1. In the list of pages for the app, select **API permissions**
   - Click the **Add a permission** button and then,
   - Ensure that the **Microsoft APIs** tab is selected
   - In the *Commonly used Microsoft APIs* section, click on **Microsoft Graph**
   - In the **Application permissions** section, ensure that the right permissions are checked: **User.Read.All**
   - Select the **Add permissions** button

## Configure the sample to use your Azure AD tenant

In the steps below, "ClientID" is the same as "Application ID" or "AppId".

Open the solution in Visual Studio to configure the projects

### Configure the client project

If you used the setup scripts, the following changes will have been applied for you.

1. Open the `UserSync\Web.Config` file
1. Find the app key `ida:ClientId` and replace the existing value with the application ID (clientId) of the `dotnet-web-daemon-v2` application copied from the Azure portal.
1. Find the app key `ida:ClientSecret` and replace the existing value with the key you saved during the creation of the `dotnet-web-daemon-v2` app, in the Azure portal.

## Run the sample

Clean the solution, rebuild the solution, and run  UserSync application, and begin by signing in as an administrator in your Azure AD tenant.  If you don't have an Azure AD tenant for testing, you can [follow these instructions](quickstart-create-new-tenant.md) to get one.

When you sign in, the app will first ask you for permission to sign you in & read your user profile.  This consent allows the application to ensure that you are a business user.

![User Consent](./media/tutorial-v2-aspnet-daemon-webapp/firstconsent.png)

The application will then try to sync a list of users from your Azure AD tenant, via the Microsoft Graph.  If it is unable to do so, it will ask you (the tenant administrator) to connect your tenant to the application.

The application will then ask for permission to read the list of users in your tenant.

![Admin Consent](./media/tutorial-v2-aspnet-daemon-webapp/adminconsent.PNG)

**You will be signed out from the app after granting permission**. This is done to ensure that any existing access tokens for Graph is removed from the token cache. Once you sign in again, the  fresh token obtained will have the necessary permissions to make calls to MS Graph.
When you grant the permission, the application will then be able to query for users at any point.  You can verify this by clicking the **Sync Users** button on the users page, refreshing the list of users.  Try adding or removing a user and resyncing the list (but note that it only syncs the first page of users!).

## About the code

The relevant code for this sample is in the following files:

- Initial sign-in: `App_Start\Startup.Auth.cs`, `Controllers\AccountController.cs`.  In particular, the actions on the controller have an Authorize attribute, which forces the user to sign in. The application uses the [authorization code flow](v2-oauth2-auth-code-flow.md) to sign in the user.
- Syncing the list of users to the local in-memory store: `Controllers\SyncController.cs`
- Displaying the list of users from the local in-memory store: `Controllers\UserController.cs`
- Acquiring permissions from the tenant admin using the admin consent endpoint: `Controllers\AccountController.cs`

## Recreate this sample app

1. In Visual Studio, create a new `Visual C#` `ASP.NET Web Application (.NET Framework)` project. In the next screen, choose the `MVC` project template. Also add folder and core references for `Web API` as you would be adding a Web API controller later.  Leave the project's chosen authentication mode as the default, that is, `No Authentication`".
2. Select the project in the **Solution Explorer** window and press the **F4** key to bring project properties. In the project properties, set **SSL Enabled** to be `True`. Note the **SSL URL**. You will need it when configuring this application's registration in the Azure portal.
3. Add the following ASP.Net OWIN middleware NuGets: `Microsoft.Owin.Security.ActiveDirectory`, `Microsoft.Owin.Security.Cookies` and `Microsoft.Owin.Host.SystemWeb`, `Microsoft.IdentityModel.Protocol.Extensions`, `Microsoft.Owin.Security.OpenIdConnect` and `Microsoft.Identity.Client`. 
4. In the `App_Start` folder, create a class `Startup.Auth.cs`. Remove `.App_Start` from the namespace name.  Replace the code for the `Startup` class with the code from the same file of the sample app.  Be sure to take the whole class definition!  The definition changes from `public class Startup` to `public partial class Startup`
5. In `Startup.Auth.cs` resolve missing references by adding `using` statements as suggested by Visual Studio intellisense.
6. Right-click on the project, select Add, select "Class", and in the search box enter "OWIN".  "OWIN Startup class" will appear as a selection; select it, and name the class `Startup.cs`.
7. In `Startup.cs`, replace the code for the `Startup` class with the code from the same file of the sample app.  Again, note the definition changes from `public class Startup` to `public partial class Startup`.
8. In the  folder, add a new class called `MsGraphUser.cs`.  Replace the implementation with the contents of the file of the same name from the sample.
9. Add a new **MVC 5 Controller - Empty** called `AccountController`. Replace the implementation with the contents of the file of the same name from the sample.
10. Add a new **MVC 5 Controller - Empty** called `UserController`. Replace the implementation with the contents of the file of the same name from the sample.
11. Add a new **Web API 2 Controller - Empty** called `SyncController`. Replace the implementation with the contents of the file of the same name from the sample.
12. For the user interface, in the `Views\Account` folder, add three **Empty (without model) Views** named `GrantPermissions`, `Index` and `UserMismatch` and one named `Index` in the `Views\User` folder. Replace the implementation with the contents of the file of the same name from the sample.
13. Update the `Shared\_Layout.cshtml` and `Home\Index.cshtml` to correctly link the various views together.

## Deploy this sample to Azure

This project has WebApp / Web API projects. To deploy them to Azure Web Sites, you'll need, for each one, to:

- create an Azure Web Site
- publish the Web App / Web APIs to the web site, and
- update its client(s) to call the web site instead of IIS Express.

### Create and publish the `dotnet-web-daemon-v2` to an Azure Web Site

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Click `Create a resource` in the top left-hand corner, select **Web** --> **Web App**, and give your web site a name, for example, `dotnet-web-daemon-v2-contoso.azurewebsites.net`.
1. Thereafter select the `Subscription`, `Resource Group`, `App service plan and Location`. `OS` will be **Windows** and `Publish` will be **Code**.
1. Click `Create` and wait for the App Service to be created.
1. Once you get the `Deployment succeeded` notification, then click on `Go to resource` to navigate to the newly created App service.
1. Once the web site is created, locate it in the **Dashboard** and click it to open **App Services** **Overview** screen.
1. From the **Overview** tab of the App Service, download the publish profile by clicking the **Get publish profile** link and save it.  Other deployment mechanisms, such as from source control, can also be used.
1. Switch to Visual Studio and go to the dotnet-web-daemon-v2 project.  Right click on the project in the Solution Explorer and select **Publish**.  Click **Import Profile** on the bottom bar, and import the publish profile that you downloaded earlier.
1. Click on **Configure** and in the `Connection tab`, update the Destination URL so that it is a `https` in the home page url, for example [https://dotnet-web-daemon-v2-contoso.azurewebsites.net](https://dotnet-web-daemon-v2-contoso.azurewebsites.net). Click **Next**.
1. On the Settings tab, make sure `Enable Organizational Authentication` is NOT selected.  Click **Save**. Click on **Publish** on the main screen.
1. Visual Studio will publish the project and automatically open a browser to the URL of the project.  If you see the default web page of the project, the publication was successful.

### Update the Azure AD tenant application registration for `dotnet-web-daemon-v2`

1. Navigate back to the [Azure portal](https://portal.azure.com).
In the left-hand navigation pane, select the **Azure Active Directory** service, and then select **App registrations**.
1. In the resultant screen, select the `dotnet-web-daemon-v2` application.
1. In the **Authentication** | page for your application, update the Logout URL fields with the address of your service, for example [https://dotnet-web-daemon-v2-contoso.azurewebsites.net](https://dotnet-web-daemon-v2-contoso.azurewebsites.net)
1. From the *Branding* menu, update the **Home page URL**, to the address of your service, for example [https://dotnet-web-daemon-v2-contoso.azurewebsites.net](https://dotnet-web-daemon-v2-contoso.azurewebsites.net). Save the configuration.
1. Add the same URL in the list of values of the *Authentication -> Redirect URIs* menu. If you have multiple redirect urls, make sure that there a new entry using the App service's Uri for each redirect url.

## Community help and support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`adal` `msal` `dotnet`].

If you find and bug in the sample, please raise the issue on [GitHub Issues](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp/issues).

If you find a bug in MSAL.NET, please raise the issue on [MSAL.NET GitHub Issues](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues).

To provide a recommendation, visit the following [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Next steps
Learn more about the different [Authentication flows and application scenarios](authentication-flows-app-scenarios.md) that the Microsoft identity platform supports.

For more information, see the following conceptual documentation:

- [Tenancy in Azure Active Directory](single-and-multi-tenant-apps.md)
- [Understanding Azure AD application consent experiences](application-consent-experience.md)
- [How to: Sign in any Azure Active Directory user using the multi-tenant application pattern](howto-convert-app-to-be-multi-tenant.md)
- [Understand user and admin consent](howto-convert-app-to-be-multi-tenant.md#understand-user-and-admin-consent)
- [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md)
- [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md)
- [Quickstart: Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md)
- [Acquiring a token for an application with client credential flows](msal-client-applications.md)

For a simpler multi-tenant console daemon application, check out the [.NET Core daemon quickstart](quickstart-v2-netcore-daemon.md).
