---
title: Sign in and sign out from an ASP.NET Core application with CIAM
description: Add sign in to an ASP.NET Core application and sign-in, sign-out of application
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

In the [previous article](./how-to-webapp-dotnet-02-prepare-app.md), an ASP.NET Core project was created and configured for authentication. This how-to will install the required packages, add code that implements authentication to the sign in and sign out experience. Finally, you will sign-in and sign-out of the application.

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

## Add the sign in and sign out experience

After installing the NuGet packages and adding necessary code for authentication, add the sign in and sign out experiences.


1. In your IDE, create a new file called *_LoginPartial.cshtml*. 
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

## Edit Program.cs

1. Open Program.cs and add the following snippet to the top of the file:

    ```csharp
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;
    ```

1. Next we need to add the services to the container and sign users in with the the Microsoft identity platform. After `Services.AddControllersWithViews();` add the following snippet:

    ```csharp
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
    ```

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

1. You may need to enter the application URI into the browser, for example `https://localhost:{port}`. After the sign in window appears, select the account in which to sign in with.
