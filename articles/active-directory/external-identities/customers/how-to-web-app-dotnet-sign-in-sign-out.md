---
title: Sign in and sign out users to an ASP.NET web application
description: Add sign in to an ASP.NET application and sign-in, sign out of an application
services: active-directory
author: cilwerner
ms.author: cwerner
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: it-pro
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant.
---

# Sign in and sign out: Sign in users in your own ASP.NET web application by using an Azure Active Directory (AD) for customers tenant

In the [previous article](./how-to-web-app-dotnet-sign-in-prepare-app.md), an ASP.NET project was created and configured for authentication. This article demonstrates how to install the required packages, add code that implements authentication to the sign in and sign out experience. Finally, you'll sign in and sign out of the application.

## Prerequisites

- Completion of the prerequisites and steps in [Sign in users in your own ASP.NET web application by using an Azure AD for customers tenant - Prepare your application](./how-to-web-app-dotnet-sign-in-prepare-app.md).

## Install identity packages

Identity related NuGet packages must be installed in the project for authentication of users to be enabled.

1. In the terminal, navigate to *aspnet_webapp*.
1. Enter the following commands to install the relevant NuGet package:

    ```powershell
    dotnet add package Microsoft.Identity.Web.UI
    ```

## Add source code to Program and Controller

1. In your code editor, open *Controllers\HomeController.cs* file.
1. Authorization needs to be added to the controller, add `Microsoft.AspNetCore.Authorization` so that the top of the file is identical to the following snippet:

    ```cshtml
    using System.Diagnostics;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using aspnet_webapp.Models;
    ```

1. Additionally, add the `[Authorize]` attribute directly above the `HomeController` class definition, which ensures that only authenticated users can use the web app:

    ```csharp
    [Authorize]
    ```

1. Open *Program.cs* and replace the contents of the file with the following snippet:

    ```csharp
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;
    using System.IdentityModel.Tokens.Jwt;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllersWithViews();

    // This is required to be instantiated before the OpenIdConnectOptions starts getting configured.
    // By default, the claims mapping will map claim names in the old format to accommodate older SAML applications.
    // For instance, 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' instead of 'roles' claim.
    // This flag ensures that the ClaimsIdentity claims collection will be built from the claims in the token
    JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

    // Sign-in users with the Microsoft identity platform
    builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(builder.Configuration)
        .EnableTokenAcquisitionToCallDownstreamApi()
        .AddInMemoryTokenCaches();

    builder.Services.AddControllersWithViews(options =>
    {
        var policy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
        options.Filters.Add(new AuthorizeFilter(policy));
    }).AddMicrosoftIdentityUI();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (!app.Environment.IsDevelopment())
    {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
    }

    app.UseHttpsRedirection();
    app.UseStaticFiles();

    app.UseRouting();
    app.UseAuthorization();

    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");

    app.Run();

    ```

## Add the sign-in and sign out experience

After installing the NuGet packages and adding necessary code for authentication, we need to add the sign-in and sign out experiences.

1. In your IDE, navigate to *Views/Shared*, and create a new file called *_LoginPartial.cshtml*.
1. Open *_LoginPartial.cshtml* and add the following code for adding the sign in and sign out experience. The code reads the ID token claims to check that the user is authenticated and uses `User.Claims` to extract ID token claims. In this case, `preferred_username`.

    ```csharp
    @using System.Security.Principal

    <ul class="navbar-nav">
    @if (User.Identity is not null && User.Identity.IsAuthenticated)
    {
            <li class="nav-item">
                <span class="nav-link text-dark">Hello @User.Claims.First(c => c.Type == "preferred_username").Value!</span>
            </li>
            <li class="nav-item">
                <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignOut">Sign out</a>
            </li>
    }
    else
    {
            <li class="nav-item">
                <a class="nav-link text-dark" asp-area="MicrosoftIdentity" asp-controller="Account" asp-action="SignIn">Sign in</a>
            </li>
    }
    </ul>
    ```

1. Next, add a reference to `_LoginPartial` in the *Layout.cshtml* file, which is located in the same folder. It's recommended to place this after the `navbar-collapse` class as shown in the following snippet:

	```html
    <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
        <partial name="_LoginPartial" />
    </div>
    ```

## View ID token claims

Open *Views/Home/Index.cshtml* and replace the contents of the file with the following snippet:

```csharp
@{
ViewData["Title"] = "Home Page";
}

<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        text-align: justify;
        padding: 8px;
        border-bottom: 1px solid #ddd;
        border-top: 1px solid #ddd;
    }
</style>

<div class="text-center">
    <h1 class="display-4">Welcome</h1>

    @if (@User.Identity is not null && @User.Identity.IsAuthenticated)
    {
        <p>You are signed in! Below are the claims in your ID token. For more information, visit: <a href="https://learn.microsoft.com/azure/active-directory/develop/id-tokens">Microsoft identity platform ID tokens</a></p>
        <table>
            <tbody>
                
                @foreach (var item in @User.Claims)
                {
                    <tr>
                        <td>@item.Type</td>
                        <td>@item.Value</td>
                    </tr>
                }
            </tbody>
        </table>
    }

    <br />
    <p>Learn about <a href="https://learn.microsoft.com/azure/active-directory/develop/v2-overview">building web apps with Microsoft identity platform</a>.</p>
</div>
```

Using the token claims, the app checks that the user is authenticated using `User.Identity.IsAuthenticated`, and lists out the ID token claims by looping through each item in `User.Claims`, returning their `Type` and `Value`.

## Sign-in to the application

1. Start the application by typing the following in the terminal to launch the `https` profile in the *launchSettings.json* file.

    ```powershell
    dotnet run --launch-profile https
    ```

1. Open a new private browser, and enter the application URI into the browser, for example `https://localhost:{port}`.
1. Select **No account? Create one**, which starts the sign-up flow.
1. In the **Create account** window, enter the email address registered to your customer tenant, which will start the sign-up flow as a user for your application.
1. After entering a one-time passcode from the customer tenant, enter a new password and more account details, this sign-up flow is completed.
    1. If a window appears prompting you to **Stay signed in**, choose either **Yes** or **No**.
1. The ASP.NET Welcome page appears in your browser as depicted in the following screenshot:

    :::image type="content" source="media/how-to-web-app-dotnet-sign-in-sign-in-out/display-aspnet-welcome.png" alt-text="Screenshot of sign in into an ASP.NET web app.":::

## Sign out of the application

1. To sign out of the application, select **Sign out** in the navigation bar.
1. A window appears asking which account to sign out of.
1. Upon successful sign out, a final window appears advising you to close all browser windows.

## Next steps

> [!div class="nextstepaction"]
> [Enable self-service password reset](./how-to-enable-password-reset-customers.md)
