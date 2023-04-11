---
title: Sign in and sign out from an ASP.NET Core application with CIAM
description: 
services: active-directory
author: cilwerner
ms.author: cwerner
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/07/2023
ms.custom: it-pro
#Customer intent
---

# Sign in and sign out from an ASP.NET Core application with CIAM

In the [previous article](./how-to-webapp-dotnet-02-prepare-app.md), an ASP.NET Core project was created and configured for authentication. This tutorial will install the required packages and add code that implements authentication to the sign in and sign out experience.

## Prerequisites

- Completion of the prerequisites and steps in [Tutorial: Prepare an application for authentication](./how-to-webapp-dotnet-02-prepare-app.md).


## Install identity packages

Identity related NuGet packages must be installed in the project for authentication of users to be enabled.

1. In the terminal, navigate to *ASPNET_CIAMWebApp*.
1. Enter the following commands to install the relevant NuGet packages:

    ```powershell
    dotnet add package Microsoft.Identity.Web.UI
    dotnet add package Microsoft.Identity.Web.MicrosoftGraph
    ```

## Implement authentication and acquire tokens

1. Open *Program.cs* and replace the entire contents of the file with the following snippet:

    ```csharp
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;

    var builder = WebApplication.CreateBuilder(args);

    // Add services to the container.
    builder.Services.AddControllersWithViews();

    // Sign-in users with the Microsoft identity platform
    builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
        .AddMicrosoftIdentityWebApp(builder.Configuration);

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

## Add the sign in and sign out experience

After installing the NuGet packages and adding necessary code for authentication, add the sign in and sign out experiences.


<!--Assuming VSCode experience-->
1. In the Explorer bar, select **Pages**, right-click **Shared**, and select **New File**. Give it the name *_LoginPartial.cshtml*.
1. Open *_LoginPartial.cshtml* and add the following code for adding the sign in and sign out experience:

    ```csharp
    @using System.Security.Principal

    <ul class="navbar-nav">
    @if (User.Identity is not null && User.Identity.IsAuthenticated)
    {
            <li class="nav-item">
                <span class="nav-link text-dark">Hello @User.Identity.Name!</span>
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

1. Next, add a reference to `_LoginPartial` in the *Layout.cshtml* file, which is located in the same folder. It is recommended to place this after the `navbar-collapse` class as shown in the following snippet:

	```html
    <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
        <partial name="_LoginPartial" />
    ```

## Add the API and enable results to be displayed

1. 

## Test the application

1. Start the application by typing the following in the terminal:

### [.NET 6.0](#tab/dotnet6)

    ```powershell
    dotnet run
    ```

### [.NET 7.0](#tab/dotnet7)

    ```powershell
    dotnet run --launch-profile https
    ```

