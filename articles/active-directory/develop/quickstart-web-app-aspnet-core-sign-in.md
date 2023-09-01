---
title: "Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET Core web app"
description: Learn how an ASP.NET Core web app leverages Microsoft.Identity.Web to implement Microsoft sign-in using OpenID Connect and call Microsoft Graph
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity

ms.date: 04/16/2023
ms.author: cwerner

ms.reviewer: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal Microsoft accounts and work/school accounts from any Azure Active Directory instance,  then access their data in Microsoft Graph on their behalf.
---

# Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET Core web app

The following quickstart uses a ASP.NET Core web app code sample to demonstrate how to sign in users from any Azure Active Directory (Azure AD) organization.  

See [How the sample works](#how-the-sample-works) for an illustration.

## Prerequisites

* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
* [.NET Core SDK 6.0+](https://dotnet.microsoft.com/download)

## Register and download your quickstart application

### Step 1: Register your application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. For **Name**, enter a name for the application.  For example, enter **AspNetCore-Quickstart**. Users of the app will see this name, and can be changed later.
1. Set the **Redirect URI** type to **Web** and value to `https://localhost:44321/signin-oidc`.
1. Select **Register**.
1. Under **Manage**, select **Authentication**.
1. For **Front-channel logout URL**, enter **https://localhost:44321/signout-oidc**.
1. Under **Implicit grant and hybrid flows**, select **ID tokens**.
1. Select **Save**.
1. Under **Manage**, select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Enter a **Description**, for example `clientsecret1`.
1. Select **In 1 year** for the secret's expiration.
1. Select **Add** and immediately record the secret's **Value** for use in a later step. The secret value is *never displayed again* and is irretrievable by any other means. Record it in a secure location as you would any password.

### Step 2: Download the ASP.NET Core project

[Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1-callsgraph.zip)

### Step 3: Configure your ASP.NET Core project

1. Extract the *.zip* file to a local folder that's close to the root of the disk to avoid errors caused by path length limitations on Windows. For example, extract to *C:\Azure-Samples*.
1. Open the solution in the chosen code editor.
1. In *appsettings.json*, replace the values of `ClientId`, and `TenantId`. The value for the application (client) ID and the directory (tenant) ID, can be found in the app's **Overview** page on the Azure portal.

   ```json
   "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
   "ClientId": "Enter_the_Application_Id_here",
   "TenantId": "common",
   ```

   - `Enter_the_Application_Id_Here` is the application (client) ID for the registered application.
   - Replace `Enter_the_Tenant_Info_Here` with one of the following:
      - If the application supports **Accounts in this organizational directory only**, replace this value with the directory (tenant) ID (a GUID) or tenant name (for example, `contoso.onmicrosoft.com`). The directory (tenant) ID can be found on the app's **Overview** page.
      - If the application supports **Accounts in any organizational directory**, replace this value with `organizations`.
      - If the application supports **All Microsoft account users**, leave this value as `common`.
    - Replace `Enter_the_Client_Secret_Here` with the **Client secret** that was created and recorded in an earlier step.

For this quickstart, don't change any other values in the *appsettings.json* file.
 
### Step 4: Build and run the application

Build and run the app in Visual Studio by selecting the **Debug** menu > **Start Debugging**, or by pressing the F5 key. 

A prompt for credentials will appear, and then a request for consent to the permissions that the app requires. Select **Accept** on the consent prompt.

:::image type="content" source="media/quickstart-v2-aspnet-core-webapp/webapp-01-consent.png" alt-text="Screenshot of the consent dialog box, showing the permissions that the app is requesting from the user.":::

After consenting to the requested permissions, the app displays that sign-in has been successful using correct Azure Active Directory credentials. The user's account email address will be displayed in the *API result* section of the page. This was extracted using the Microsoft Graph API.

:::image type="content" source="media/quickstart-v2-aspnet-core-webapp-calls-graph/webapp-02-signed-in.png" alt-text="Screenshot of the web browser displaying the running web app and the user signed in.":::

## More information

This section gives an overview of the code required to sign in users and call the Microsoft Graph API on their behalf. This overview can be useful to understand how the code works, main arguments, and also if you want to add sign-in to an existing ASP.NET Core application and call Microsoft Graph. It uses [Microsoft.Identity.Web](microsoft-identity-web.md), which is a wrapper around [MSAL.NET](msal-overview.md).

### How the sample works

![Diagram of the interaction between the web browser, the web app, and the Microsoft identity platform in the sample app.](media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

### Startup class

The *Microsoft.AspNetCore.Authentication* middleware uses a `Startup` class that's executed when the hosting process starts:

```csharp
  // Get the scopes from the configuration (appsettings.json)
  var initialScopes = Configuration.GetValue<string>("DownstreamApi:Scopes")?.Split(' ');

  public void ConfigureServices(IServiceCollection services)
  {
      // Add sign-in with Microsoft
      services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(Configuration.GetSection("AzureAd"))

            // Add the possibility of acquiring a token to call a protected web API
            .EnableTokenAcquisitionToCallDownstreamApi(initialScopes)

                // Enables controllers and pages to get GraphServiceClient by dependency injection
                // And use an in memory token cache
                .AddMicrosoftGraph(Configuration.GetSection("DownstreamApi"))
                .AddInMemoryTokenCaches();

      services.AddControllersWithViews(options =>
      {
          var policy = new AuthorizationPolicyBuilder()
              .RequireAuthenticatedUser()
              .Build();
          options.Filters.Add(new AuthorizeFilter(policy));
      });

      // Enables a UI and controller for sign in and sign out.
      services.AddRazorPages()
          .AddMicrosoftIdentityUI();
  }
```

The `AddAuthentication()` method configures the service to add cookie-based authentication. This authentication is used in browser scenarios and to set the challenge to OpenID Connect.

The line that contains `.AddMicrosoftIdentityWebApp` adds Microsoft identity platform authentication to the application. The application is then configured to sign in users based on the following information in the `AzureAD` section of the *appsettings.json* configuration file:

| *appsettings.json* key | Description                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ClientId`             | Application (client) ID of the application registered in the Azure portal.                                                                                       |
| `Instance`             | Security token service (STS) endpoint for the user to authenticate. This value is typically `https://login.microsoftonline.com/`, indicating the Azure public cloud. |
| `TenantId`             | Name of your tenant or the tenant ID (a GUID), or `common` to sign in users with work or school accounts or Microsoft personal accounts.                             |

The `EnableTokenAcquisitionToCallDownstreamApi` method enables the application to acquire a token to call protected web APIs. `AddMicrosoftGraph` enables the controllers or Razor pages to benefit directly the `GraphServiceClient` (by dependency injection) and the `AddInMemoryTokenCaches` methods enables your app to benefit from a token cache.

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
```

### Protect a controller or a controller's method

The controller or its methods can be protected by applying the `[Authorize]` attribute to the controller's class or one or more of its methods. This `[Authorize]` attribute restricts access by allowing only authenticated users. If the user isn't already authenticated, an authentication challenge can be started to access the controller. In this quickstart, the scopes are read from the configuration file:

```csharp
[AuthorizeForScopes(ScopeKeySection = "DownstreamApi:Scopes")]
public async Task<IActionResult> Index()
{
    var user = await _graphServiceClient.Me.GetAsync();
    ViewData["ApiResult"] = user.DisplayName;

    return View();
}
```

[!INCLUDE [Help and support](includes/error-handling-and-tips/help-support-include.md)]

## Next steps

The following GitHub repository contains the ASP.NET Core code sample referenced in this quickstart and more samples that show how to achieve the following:

- Add authentication to a new ASP.NET Core web application.
- Call Microsoft Graph, other Microsoft APIs, or your own web APIs.
- Add authorization.
- Sign in users in national clouds or with social identities.

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorials on GitHub](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
