---
title: "Quickstart: ASP.NET Core web app that signs in users and calls Microsoft Graph"
description: Learn how an ASP.NET Core web app leverages Microsoft.Identity.Web to implement Microsoft sign-in using OpenID Connect and call Microsoft Graph
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 11/22/2021
ms.author: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal Microsoft accounts and work/school accounts from any Azure Active Directory instance,  then access their data in Microsoft Graph on their behalf.
---

In this quickstart, you download and run a code sample that demonstrates how an ASP.NET Core web app can sign in users from any Azure Active Directory (Azure AD) organization.  

See [How the sample works](#how-the-sample-works) for an illustration.

## Prerequisites

* [Visual Studio](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
* [.NET Core SDK 3.1+](https://dotnet.microsoft.com/download)

## Register and download your quickstart application

#### Step 1: Register your application
1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. For **Name**, enter a name for your application. For example, enter **AspNetCore-Quickstart**. Users of your app will see this name, and you can change it later.
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

#### Step 2: Download the ASP.NET Core project

[Download the ASP.NET Core solution](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/archive/aspnetcore3-1-callsgraph.zip)

[!INCLUDE [active-directory-develop-path-length-tip](../../../../../includes/active-directory-develop-path-length-tip.md)]

#### Step 3: Configure your ASP.NET Core project
1. Extract the .zip archive into a local folder near the root of your drive. For example, extract into *C:\Azure-Samples*.

   We recommend extracting the archive into a directory near the root of your drive to avoid errors caused by path length limitations on Windows.
1. Open the solution in Visual Studio 2019.
1. Open the *appsettings.json* file and modify the following code:

   ```json
   "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
   "ClientId": "Enter_the_Application_Id_here",
   "TenantId": "common",
   ```

   - Replace `Enter_the_Application_Id_here` with the application (client) ID of the application that you registered in the Azure portal. You can find the **Application (client) ID** value on the app's **Overview** page.
   - Replace `common` with one of the following:
      - If your application supports **Accounts in this organizational directory only**, replace this value with the directory (tenant) ID (a GUID) or the tenant name (for example, `contoso.onmicrosoft.com`). You can find the **Directory (tenant) ID** value on the app's **Overview** page.
      - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`.
      - If your application supports **All Microsoft account users**, leave this value as `common`.
    - Replace `Enter_the_Client_Secret_Here` with the **Client secret** you created and recorded in an earlier step.

For this quickstart, don't change any other values in the *appsettings.json* file.

#### Step 4: Build and run the application

Build and run the app in Visual Studio by selecting the **Debug** menu > **Start Debugging**, or by pressing the F5 key.

You're prompted for your credentials, and then asked to consent to the permissions that your app requires. Select **Accept** on the consent prompt.

:::image type="content" source="../../media/quickstart-v2-aspnet-core-webapp/webapp-01-consent.png" alt-text="Screenshot of the consent dialog box, showing the permissions that the app is requesting from the user.":::

After consenting to the requested permissions, the app displays that you've successfully logged in using your Azure Active Directory credentials, and you'll see your email address in the "Api result" section of the page. This was extracted using Microsoft Graph.

:::image type="content" source="../../media/quickstart-v2-aspnet-core-webapp-calls-graph/webapp-02-signed-in.png" alt-text="Web browser displaying the running web app and the user signed in":::


## More information

This section gives an overview of the code required to sign in users and call the Microsoft Graph API on their behalf. This overview can be useful to understand how the code works, main arguments, and also if you want to add sign-in to an existing ASP.NET Core application and call Microsoft Graph. It uses [Microsoft.Identity.Web](../../microsoft-identity-web.md), which is a wrapper around [MSAL.NET](../../msal-overview.md).

### How the sample works

![Diagram of the interaction between the web browser, the web app, and the Microsoft identity platform in the sample app.](../../media/quickstart-v2-aspnet-core-webapp/aspnetcorewebapp-intro.svg)

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

The line that contains `.AddMicrosoftIdentityWebApp` adds Microsoft identity platform authentication to your application. The application is then configured to sign in users based on the following information in the `AzureAD` section of the *appsettings.json* configuration file:

| *appsettings.json* key | Description                                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ClientId`             | Application (client) ID of the application registered in the Azure portal.                                                                                       |
| `Instance`             | Security token service (STS) endpoint for the user to authenticate. This value is typically `https://login.microsoftonline.com/`, indicating the Azure public cloud. |
| `TenantId`             | Name of your tenant or the tenant ID (a GUID), or `common` to sign in users with work or school accounts or Microsoft personal accounts.                             |

The `EnableTokenAcquisitionToCallDownstreamApi` method enables your application to acquire a token to call protected web APIs. `AddMicrosoftGraph` enables your controllers or Razor pages to benefit directly the `GraphServiceClient` (by dependency injection) and the `AddInMemoryTokenCaches` methods enables your app to benefit from a token cache.

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

You can protect a controller or its methods by applying the `[Authorize]` attribute to the controller's class or one or more of its methods. This `[Authorize]` attribute restricts access by allowing only authenticated users. If the user isn't already authenticated, an authentication challenge can be started to access the controller. In this quickstart, the scopes are read from the configuration file:

```csharp
[AuthorizeForScopes(ScopeKeySection = "DownstreamApi:Scopes")]
public async Task<IActionResult> Index()
{
    var user = await _graphServiceClient.Me.Request().GetAsync();
    ViewData["ApiResult"] = user.DisplayName;

    return View();
}
```

[!INCLUDE [Help and support](../../../../../includes/active-directory-develop-help-support-include.md)]

## Next steps

The GitHub repo that contains the ASP.NET Core code sample referenced in this quickstart includes instructions and more code samples that show you how to:

- Add authentication to a new ASP.NET Core web application.
- Call Microsoft Graph, other Microsoft APIs, or your own web APIs.
- Add authorization.
- Sign in users in national clouds or with social identities.

> [!div class="nextstepaction"]
> [ASP.NET Core web app tutorials on GitHub](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/)
