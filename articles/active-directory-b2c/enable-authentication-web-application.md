---
title: Enable authentication in a web app by using Azure Active Directory B2C building blocks
description: This article discusses how to use the building blocks of Azure Active Directory B2C to sign in and sign up users in an ASP.NET web app.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 06/11/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own web app by using Azure AD B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own ASP.NET web application. Learn how create an ASP.NET Core web application with ASP.NET Core middleware that uses the [OpenID Connect](openid-connect.md) protocol. 

Use this article in conjunction with [Configure authentication in a sample web app](configure-authentication-sample-web-app.md), replacing the sample web app with your own web app.

## Prerequisites

To review the prerequisites and integration instructions, see [Configure authentication in a sample web application](configure-authentication-sample-web-app.md).

## Step 1: Create a web app project

You can use an existing ASP.NET model-view-controller (MVC) web app project or create new one. To create a new project, open a command shell, and then enter the following command:

```dotnetcli
dotnet new mvc -o mywebapp
```

The preceding command does the following:

* It creates a new MVC web app.  
* The `-o mywebapp` parameter creates a directory named *mywebapp* with the source files for the app.

## Step 2: Add the authentication libraries

Add the Microsoft Identity Web library, which is a set of ASP.NET Core libraries that simplify adding Azure AD B2C authentication and authorization support to your web app. The Microsoft Identity Web library sets up the authentication pipeline with cookie-based authentication. It takes care of sending and receiving HTTP authentication messages, token validation, claims extraction, and more.

To add the Microsoft Identity Web library, install the packages by running the following commands: 

# [Visual Studio](#tab/visual-studio)

```dotnetcli
dotnet add package Microsoft.Identity.Web
dotnet add package Microsoft.Identity.Web.UI
```

# [Visual Studio Code](#tab/visual-studio-code)

```dotnetcli
Install-Package Microsoft.Identity.Web
Install-Package Microsoft.Identity.Web.UI 
```

---


## Step 3: Initiate the authentication libraries

The Microsoft Identity Web middleware uses a startup class that runs when the hosting process starts. In this step, you add the necessary code to initiate the authentication libraries.

Open *Startup.cs* and then, at the beginning of the class, add the following `using` declarations:

```csharp
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;
```

Because Microsoft Identity Web uses cookie-based authentication to protect your web app, the following code sets the *SameSite* cookie settings. It then reads the `AzureAdB2C` application settings and initiates the middleware controller with its view. 

Replace the `ConfigureServices(IServiceCollection services)` function with the following code snippet: 

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.Configure<CookiePolicyOptions>(options =>
    {
        // This lambda determines whether user consent for non-essential cookies is needed for a given request.
        options.CheckConsentNeeded = context => true;
        options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
        // Handling SameSite cookie according to https://learn.microsoft.com/aspnet/core/security/samesite?view=aspnetcore-3.1
        options.HandleSameSiteCookieCompatibility();
    });

    // Configuration to sign-in users with Azure AD B2C
    services.AddMicrosoftIdentityWebAppAuthentication(Configuration, "AzureAdB2C");

    services.AddControllersWithViews()
        .AddMicrosoftIdentityUI();

    services.AddRazorPages();

    //Configuring appsettings section AzureAdB2C, into IOptions
    services.AddOptions();
    services.Configure<OpenIdConnectOptions>(Configuration.GetSection("AzureAdB2C"));
}
```

The following code adds the cookie policy and uses the authentication model. Replace the `Configure` function with the following code snippet: 

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    // Add the Microsoft Identity Web cookie policy
    app.UseCookiePolicy();
    app.UseRouting();
    // Add the ASP.NET Core authentication service
    app.UseAuthentication();
    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllerRoute(
            name: "default",
            pattern: "{controller=Home}/{action=Index}/{id?}");
        
        // Add endpoints for Razor pages
        endpoints.MapRazorPages();
    });
};
```

## Step 4: Add the UI elements

To add user interface elements, use a partial view that contains logic for checking to see whether users are signed in. If users aren't signed in, the partial view renders the sign-in button. If they are signed in, it shows the user's display name and sign-out button.
  
Create a new file, *\_LoginPartial.cshtml*, inside the */Views/Shared* folder with the following code snippet:

```razor
@using System.Security.Principal
@if (User.Identity.IsAuthenticated)
{
    <ul class="nav navbar-nav navbar-right">
        <li class="navbar-text">Hello @User.Identity.Name</li>
        <!-- The Account controller is not defined in this project. Instead, it is part of Microsoft.Identity.Web.UI nuget package and
            it defines some well known actions such as SignUp/In, SignOut and EditProfile-->
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="EditProfile">
                <button type="submit" class="btn btn-primary" style="margin-right:5px">Edit Profile</button>
            </form>
        </li>
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignOut">
                <button type="submit" class="btn btn-primary">Sign Out</button>
            </form>
        </li>
    </ul>
}
else
{
    <ul class="nav navbar-nav navbar-right">
        <li class="navbar-btn">
            <form method="get" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignIn">
                <button type="submit" class="btn btn-primary">Sign Up/In</button>
            </form>
        </li>
    </ul>
}
```

Modify your */Views/Shared_Layout.cshtml* file to include the *_LoginPartial.cshtml* file you added. The *_Layout.cshtml* file is a common layout that gives users a consistent experience as they go from page to page. The layout includes common user interface elements, such as the app header and footer.

> [!NOTE]
> Depending on the .NET Core version you're running and whether you're adding sign-in to an existing app, the UI elements might look different. If so, be sure to include *_LoginPartial* in the proper location within the page layout.

Open the */Views/Shared/_Layout.cshtml* file, and then add the following `div` element.

```razor
<div class="navbar-collapse collapse">
...
</div>
```

Replace this element with the following Razor code:

```razor
<div class="navbar-collapse collapse">
  <ul class="nav navbar-nav">
    <li><a asp-area="" asp-controller="Home" asp-action="Index">Home</a></li>
    <li><a asp-area="" asp-controller="Home" asp-action="Claims">Claims</a></li>
  </ul>
  <partial name="_LoginPartial" />
</div>
```

The preceding Razor code includes a link to the `Claims` action that you'll create in the next step.

## Step 5: Add the claims view

To view the ID token claims, under the */Views/Home* folder, add the *Claims.cshtml* view.

```razor
@using System.Security.Claims

@{
  ViewData["Title"] = "Claims";
}
<h2>@ViewData["Title"].</h2>

<table class="table-hover table-condensed table-striped">
  <tr>
    <th>Claim Type</th>
    <th>Claim Value</th>
  </tr>

  @foreach (Claim claim in User.Claims)
  {
    <tr>
      <td>@claim.Type</td>
      <td>@claim.Value</td>
    </tr>
  }
</table>
```

In this step, you add the `Claims` action that links the *Claims.cshtml* view to the *Home* controller. The `Claims` action uses the `Authorize` attribute, which limits access to the action to authenticated users.  

In the */Controllers/HomeController.cs* controller, add the following action:

```csharp
[Authorize]
public IActionResult Claims()
{
    return View();
}
```

At the beginning of the class, add the following `using` declaration:

```csharp
using Microsoft.AspNetCore.Authorization;
```

## Step 6: Add the app settings

Azure AD B2C identity provider settings are stored in the *appsettings.json* file. Open *appsettings.json*, and then add the following settings:

```JSon
"AzureAdB2C": {
  "Instance": "https://<your-tenant-name>.b2clogin.com",
  "ClientId": "<web-app-application-id>",
  "Domain": "<your-b2c-domain>",
  "SignedOutCallbackPath": "/signout-oidc",
  "SignUpSignInPolicyId": "<your-sign-up-in-policy>"
}
```

The required information is described in the [Configure authentication in a sample web app](configure-authentication-sample-web-app.md) article. Use the following settings:

* **Instance**: Replace `<your-tenant-name>` with the first part of your Azure AD B2C [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `https://contoso.b2clogin.com`).
* **Domain**: Replace `<your-b2c-domain>` with your Azure AD B2C full [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `contoso.onmicrosoft.com`).
* **Client ID**: Replace `<web-app-application-id>` with the Application ID from [Step 2](configure-authentication-sample-web-app.md#step-2-register-a-web-application).
* **Policy name**: Replace `<your-sign-up-in-policy>` with the user flows you created in [Step 1](configure-authentication-sample-web-app.md#step-1-configure-your-user-flow).

## Step 7: Run your application

1. Build and run the project.
1. Go to `https://localhost:5001`. 
1. Select **Sign Up/In**.
1. Complete the sign-up or sign-in process.

After you're successfully authenticated, you'll see your display name in the navigation bar. To view the claims that the Azure AD B2C token returns to your app, select **Claims**.

## Next steps
* Learn how to [customize and enhance the Azure AD B2C authentication experience for your web app](enable-authentication-web-application-options.md).
