---
title: "Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how an app implements Microsoft sign-in on an ASP.NET Core web app by using OpenID Connect
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 09/11/2020
ms.author: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal accounts, as well as work and school accounts, from any Azure Active Directory instance.
---

# Quickstart: Add sign-in with Microsoft to an ASP.NET Core web app

In this quickstart, you download and run a code sample that demonstrates how an ASP.NET Core web app can sign in users from any Azure Active Directory (Azure AD) organization.  

> [!div renderon="docs"]
> The following diagram shows how the sample app works:
>
> ![Diagram of the interaction between the web browser, the web app, and the Microsoft identity platform in the sample app.](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)
>
> ## Prerequisites
>
> * [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
> * [.NET Core SDK 3.1+](https://dotnet.microsoft.com/download)
>
> ## Register and download the app
> You have two options to start building your application: automatic or manual configuration.
>
> ### Automatic configuration
> If you want to automatically configure your app and then download the code sample, follow these steps:
>
> 1. Go to the <a href="https://aka.ms/aspnetcore2-1-aad-quickstart-v2/" target="_blank">Azure portal page for app registration</a>.
> 1. Enter a name for your application and select **Register**.
> 1. Follow the instructions to download and automatically configure your new application in one click.
>
> ### Manual configuration
> If you want to manually configure your application and code sample, use the following procedures.
> #### Step 1: Register your application
> 1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: on the top menu to select the tenant in which you want to register the application.
> 1. Search for and select **Azure Active Directory**.
> 1. Under **Manage**, select **App registrations** > **New registration**.
> 1. For **Name**, enter a name for your application. For example, enter **AspNetCore-Quickstart**. Users of your app will see this name, and you can change it later.
> 1. For **Redirect URI**, enter **https://localhost:44321/signin-oidc**.
> 1. Select **Register**.
> 1. Under **Manage**, select **Authentication**.
> 1. For **Front-channel logout URL**, enter **https://localhost:44321/signout-oidc**.
> 1. Under **Implicit grant and hybrid flows**, select **ID tokens**.
> 1. Select **Save**.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure your application in the Azure portal
> For the code sample in this quickstart to work:
> - For **Redirect URI**, enter **https://localhost:44321/** and **https://localhost:44321/signin-oidc**.
> - For **Front-channel logout URL**, enter **https://localhost:44321/signout-oidc**. 
>
> The authorization endpoint will issue request ID tokens.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make this change for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-aspnet-webapp/green-check.png) Your application is configured with these attributes.

#### Step 2: Download the ASP.NET Core project

> [!div renderon="docs"]
> [Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1.zip)

> [!div renderon="portal" class="sxs-lookup"]
> Run the project.

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1.zip)

[!INCLUDE [active-directory-develop-path-length-tip](../../../includes/active-directory-develop-path-length-tip.md)]

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
> We've configured your project with values of your app's properties, and it's ready to run.
> [!div class="sxs-lookup" renderon="portal"]
> > [!NOTE]
> > `Enter_the_Supported_Account_Info_Here`
> [!div renderon="docs"]
> #### Step 3: Configure your ASP.NET Core project
> 1. Extract the .zip archive into a local folder near the root of your drive. For example, extract into *C:\Azure-Samples*.
> 
>    We recommend extracting the archive into a directory near the root of your drive to avoid errors caused by path length limitations on Windows.
> 1. Open the solution in Visual Studio 2019.
> 1. Open the *appsettings.json* file and modify the following code:
>
>    ```json
>    "Domain": "Enter the domain of your tenant, e.g. contoso.onmicrosoft.com",
>    "ClientId": "Enter_the_Application_Id_here",
>    "TenantId": "common",
>    ```
>
>    - Replace `Enter_the_Application_Id_here` with the application (client) ID of the application that you registered in the Azure portal. You can find the **Application (client) ID** value on the app's **Overview** page.
>    - Replace `common` with one of the following:
>       - If your application supports **Accounts in this organizational directory only**, replace this value with the directory (tenant) ID (a GUID) or the tenant name (for example, `contoso.onmicrosoft.com`). You can find the **Directory (tenant) ID** value on the app's **Overview** page.
>       - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`.
>       - If your application supports **All Microsoft account users**, leave this value as `common`.
>
> For this quickstart, don't change any other values in the *appsettings.json* file.
>
> #### Step 4: Build and run the application
>
> Build and run the app in Visual Studio by selecting the **Debug** menu > **Start Debugging**, or by pressing the F5 key.
>
> You're prompted for your credentials, and then asked to consent to the permissions that your app requires. Select **Accept** on the consent prompt.
>
> :::image type="content" source="media/quickstart-v2-aspnet-core-webapp/webapp-01-consent.png" alt-text="Screenshot of the consent dialog box, showing the permissions that the app is requesting from the user.":::
>
> After you consent to the requested permissions, the app displays that you've successfully signed in with your Azure Active Directory credentials.
>
> :::image type="content" source="media/quickstart-v2-aspnet-core-webapp/webapp-02-signed-in.png" alt-text="Screenshot of a web browser that shows the running web app and the signed-in user.":::

## More information

This section gives an overview of the code required to sign in users. This overview can be useful to understand how the code works, what the main arguments are, and how to add sign-in to an existing ASP.NET Core application.

> [!div class="sxs-lookup" renderon="portal"]
> ### How the sample works
>
> ![Diagram of the interaction between the web browser, the web app, and the Microsoft identity platform in the sample app.](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

### Startup class

The *Microsoft.AspNetCore.Authentication* middleware uses a `Startup` class that's run when the hosting process starts:

```csharp
  public void ConfigureServices(IServiceCollection services)
  {
      services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
          .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"));

      services.AddControllersWithViews(options =>
      {
          var policy = new AuthorizationPolicyBuilder()
              .RequireAuthenticatedUser()
              .Build();
          options.Filters.Add(new AuthorizeFilter(policy));
      });
      services.AddRazorPages()
          .AddMicrosoftIdentityUI();
  }
```

The `AddAuthentication()` method configures the service to add cookie-based authentication. This authentication is used in browser scenarios and to set the challenge to OpenID Connect.

The line that contains `.AddMicrosoftIdentityWebApp` adds Microsoft identity platform authentication to your application. The application is then configured to sign in users based on the following information in the `AzureAD` section of the *appsettings.json* configuration file:

| *appsettings.json* key | Description                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ClientId`             | Application (client) ID of the application registered in the Azure portal.                                                                                       |
| `Instance`             | Security token service (STS) endpoint for the user to authenticate. This value is typically `https://login.microsoftonline.com/`, indicating the Azure public cloud. |
| `TenantId`             | Name of your tenant or the tenant ID (a GUID), or `common` to sign in users with work or school accounts or Microsoft personal accounts.                             |

The `Configure()` method contains two important methods, `app.UseAuthentication()` and `app.UseAuthorization()`, that enable their named functionality. Also in the `Configure()` method, you must register Microsoft Identity Web routes with at least one call to `endpoints.MapControllerRoute()` or a call to `endpoints.MapControllers()`:

```csharp
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{

    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
    endpoints.MapRazorPages();
});

// endpoints.MapControllers(); // REQUIRED if MapControllerRoute() isn't called.
```

### Attribute for protecting a controller or methods

You can protect a controller or controller methods by using the `[Authorize]` attribute. This attribute restricts access to the controller or methods by allowing only authenticated users. An authentication challenge can then be started to access the controller if the user isn't authenticated.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

The GitHub repo that contains this ASP.NET Core tutorial includes instructions and more code samples that show you how to:

- Add authentication to a new ASP.NET Core web application.
- Call Microsoft Graph, other Microsoft APIs, or your own web APIs.
- Add authorization.
- Sign in users in national clouds or with social identities.

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorials on GitHub](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
