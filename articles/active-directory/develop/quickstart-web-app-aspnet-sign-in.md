---
title: "Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET web app"
description: Download and run a code sample that shows how an ASP.NET web app can sign in Azure AD users.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.date: 07/28/2023
ms.author: cwerner

ms.reviewer: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET, contperf-fy21q1"
# Customer intent: As an application developer, I want to see a sample ASP.NET web app that can sign in Azure AD users.
---

# Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET web app

In this quickstart, you download and run a code sample that demonstrates an ASP.NET web application that can sign in users with Azure Active Directory (Azure AD) accounts. 

See [How the sample works](#how-the-sample-works) for an illustration.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
* [.NET Framework 4.7.2+](https://dotnet.microsoft.com/download/visual-studio-sdks)

## Register and download the app

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

You have two options to start building your application: automatic or manual configuration.

### Automatic configuration

If you want to automatically configure your app and then download the code sample, follow these steps:

1. Go to the [Azure portal - App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType/AngularSpaQuickstartPage/sourceType/docs) quickstart experience.
1. Enter a name for your application and select **Register**.
1. Follow the instructions to download and automatically configure your new application in one click.

### Manual configuration

If you want to manually configure your application and code sample, use the following procedures.

#### Step 1: Register your application

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. For **Name**, enter a name for your application. For example, enter **ASPNET-Quickstart**. Users of your app will see this name, and you can change it later.
1. Set the **Redirect URI** type to **Web** and value to `https://localhost:44368/`.
1. Select **Register**.
1. Under **Manage**, select **Authentication**.
1. In the **Implicit grant and hybrid flows** section, select **ID tokens**.
1. Select **Save**.

#### Step 2: Download the project

[Download the ASP.NET code sample](https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-DotNet/archive/master.zip)

[!INCLUDE [active-directory-develop-path-length-tip](includes/error-handling-and-tips/path-length-tip.md)]


#### Step 3: Run the project

1. Extract the .zip file to a local folder that's close to the root folder. For example, extract to *C:\Azure-Samples*.
   
   We recommend extracting the archive into a directory near the root of your drive to avoid errors caused by path length limitations on Windows.
2. Open the solution in Visual Studio (*AppModelv2-WebApp-OpenIDConnect-DotNet.sln*).
3. Depending on the version of Visual Studio, you might need to right-click the project **AppModelv2-WebApp-OpenIDConnect-DotNet** and then select **Restore NuGet packages**.
4. Open the Package Manager Console by selecting **View** > **Other Windows** > **Package Manager Console**. Then run `Update-Package Microsoft.CodeDom.Providers.DotNetCompilerPlatform -r`.

5. Edit *appsettings.json* and replace the parameters `ClientId`, `Tenant`, and `redirectUri` with:
   ```json
   "ClientId" :"Enter_the_Application_Id_here" />
   "TenantId": "Enter_the_Tenant_Info_Here" />
   "RedirectUri" :"https://localhost:44368/" />
   ```
   In that code:

   - `Enter_the_Application_Id_here` is the application (client) ID of the app registration that you created earlier. Find the application (client) ID on the app's **Overview** page in **App registrations** in the Azure portal.
   - `Enter_the_Tenant_Info_Here` is one of the following options:
     - If your application supports **My organization only**, replace this value with the directory (tenant) ID or tenant name (for example, `contoso.onmicrosoft.com`). Find the directory (tenant) ID on the app's **Overview** page in **App registrations** in the Azure portal.
     - If your application supports **Accounts in any organizational directory**, replace this value with `organizations`.
     - If your application supports **All Microsoft account users**, replace this value with `common`.
   - `redirectUri` is the **Redirect URI** you entered earlier in **App registrations** in the Azure portal.

## More information

This section gives an overview of the code required to sign in users. This overview can be useful to understand how the code works, what the main arguments are, and how to add sign-in to an existing ASP.NET application.


### How the sample works

![Diagram of the interaction between the web browser, the web app, and the Microsoft identity platform in the sample app.](media/quickstart-v2-aspnet-webapp/aspnetwebapp-intro.svg)

### OWIN middleware NuGet packages

You can set up the authentication pipeline with cookie-based authentication by using OpenID Connect in ASP.NET with OWIN middleware packages. You can install these packages by running the following commands in Package Manager Console within Visual Studio:

```powershell
Install-Package Microsoft.Identity.Web.Owin
Install-Package Microsoft.Identity.Web.GraphServiceClient
Install-Package Microsoft.Owin.Security.Cookies
```

### OWIN startup class

The OWIN middleware uses a *startup class* that runs when the hosting process starts. In this quickstart, the *startup.cs* file is in the root folder. The following code shows the parameters that this quickstart uses:

```csharp
    public void Configuration(IAppBuilder app)
    {
        app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

        app.UseCookieAuthentication(new CookieAuthenticationOptions());
        OwinTokenAcquirerFactory factory = TokenAcquirerFactory.GetDefaultInstance<OwinTokenAcquirerFactory>();

        app.AddMicrosoftIdentityWebApp(factory);
        factory.Services
            .Configure<ConfidentialClientApplicationOptions>(options => { options.RedirectUri = "https://localhost:44368/"; })
            .AddMicrosoftGraph()
            .AddInMemoryTokenCaches();
        factory.Build();
    }
```

|Where  | Description |
|---------|---------|
| `ClientId`     | The application ID from the application registered in the Azure portal. |
| `Authority`    | The security token service (STS) endpoint for the user to authenticate. It's usually `https://login.microsoftonline.com/{tenant}/v2.0` for the public cloud. In that URL, *{tenant}* is the name of your tenant, your tenant ID, or `common` for a reference to the common endpoint. (The common endpoint is used for multitenant applications.) |
| `RedirectUri`  | The URL where users are sent after authentication against the Microsoft identity platform. |
| `PostLogoutRedirectUri`     | The URL where users are sent after signing off. |
| `Scope`     | The list of scopes being requested, separated by spaces. |
| `ResponseType`     | The request that the response from authentication contains an authorization code and an ID token. |
| `TokenValidationParameters`     | A list of parameters for token validation. In this case, `ValidateIssuer` is set to `false` to indicate that it can accept sign-ins from any personal, work, or school account type. |
| `Notifications`     | A list of delegates that can be run on `OpenIdConnect` messages. |

### Authentication challenge

You can force a user to sign in by requesting an authentication challenge in your controller:

```csharp
public void SignIn()
{
    if (!Request.IsAuthenticated)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(
            new AuthenticationProperties{ RedirectUri = "/" },
            OpenIdConnectAuthenticationDefaults.AuthenticationType);
    }
}
```

> [!TIP]
> Requesting an authentication challenge by using this method is optional. You'd normally use it when you want a view to be accessible from both authenticated and unauthenticated users. Alternatively, you can protect controllers by using the method described in the next section.

### Attribute for protecting a controller or a controller actions

You can protect a controller or controller actions by using the `[Authorize]` attribute. This attribute restricts access to the controller or actions by allowing only authenticated users to access the actions in the controller. An authentication challenge will then happen automatically when an unauthenticated user tries to access one of the actions or controllers decorated by the `[Authorize]` attribute.

### Call Microsoft Graph from the controller

You can call Microsoft Graph from the controller by getting the instance of GraphServiceClient using the `GetGraphServiceClient` extension method on the controller, like in the following code:

```csharp
    try
    { 
        var me = await this.GetGraphServiceClient().Me.GetAsync();
        ViewBag.Username = me.DisplayName;
    }
    catch (ServiceException graphEx) when (graphEx.InnerException is MicrosoftIdentityWebChallengeUserException)
    {
        HttpContext.GetOwinContext().Authentication.Challenge(OpenIdConnectAuthenticationDefaults.AuthenticationType);
        return View();
    }
```

[!INCLUDE [Help and support](includes/error-handling-and-tips/help-support-include.md)]

## Next steps

For a complete step-by-step guide on building applications and new features, including a full explanation of this quickstart, try out the ASP.NET tutorial.

> [!div class="nextstepaction"]
> [Add sign-in to an ASP.NET web app](tutorial-v2-asp-webapp.md)
