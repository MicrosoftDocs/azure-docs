---
title: Sign in users in your own ASP.NET web application by using Microsoft Entra - Sign in and sign out 
description: Add sign in to an ASP.NET application and sign-in, sign-out of an application
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
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant.
---

# Sign in users in your own ASP.NET web application by using Microsoft Entra - Sign in and sign out

In the [previous article](./how-to-web-app-dotnet-sign-in-prepare-app.md), an ASP.NET project was created and configured for authentication. This article will demonstrate how to install the required packages, add code that implements authentication to the sign in and sign out experience. Finally, you'll sign-in and sign-out of the application.

## Prerequisites

- Completion of the prerequisites and steps in [Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your application](./how-to-web-app-dotnet-sign-in-prepare-app.md).

## Install identity packages

Identity related NuGet packages must be installed in the project for authentication of users to be enabled.

1. In the terminal, navigate to *aspnet_ciam_webapp*.
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
    using aspnet_ciam_webapp.Models;
    ```

1. Additionally, add the following attribute directly above the `HomeController` class definition:

    ```csharp
    [Authorize]
    ```

1. Open *Program.cs* and add the following snippet to the top of the file:

    ```csharp
    using Microsoft.AspNetCore.Authentication.OpenIdConnect;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;
    ```

1. Next we need to add the services to the container and sign users in with the Microsoft identity platform. After `Services.AddControllersWithViews();` add the following snippet:

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


## Add the sign-in and sign-out experience

After installing the NuGet packages and adding necessary code for authentication, we need to add the sign-in and sign-out experiences.

1. In your IDE, navigate to *Views* > *Shared*, and create a new file called *_LoginPartial.cshtml*.
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

1. Next, add a reference to `_LoginPartial` in the *Layout.cshtml* file, which is located in the same folder. It's recommended to place this after the `navbar-collapse` class as shown in the following snippet:

	```html
    <div class="navbar-collapse collapse d-sm-inline-flex flex-sm-row-reverse">
        <partial name="_LoginPartial" />
    </div>
    ```

## Sign-in to the application

1. Start the application by typing the following in the terminal to launch the `https` profile in the *launchSettings.json* file.

    ```powershell
    dotnet run --launch-profile https
    ```

1. Open a new private browser, and enter the application URI into the browser, for example `https://localhost:{port}`.
1. Select **No account? Create one**, which starts the sign-up flow.
1. In the **Create account** window, enter the email address registered to your CIAM tenant which will start the sign-up flow as a user for your application.
1. After entering a one-time passcode from the CIAM tenant, enter a new password and more account details, this sign-up flow is completed.
    1. If a window appears prompting you to **Stay signed in**, choose either **Yes** or **No**.
1. The ASP.NET Welcome page appears in your browser as depicted in the following screenshot:

    :::image type="content" source="media/how-to-web-app-dotnet-sign-in-sign-in-out/display-aspnet-welcome.png" alt-text="Screenshot of sign in into an ASP.NET web app.":::

## Sign out of the application

1. To sign out of the application, select **Sign out** in the navigation bar.
1. A window appears asking which account to sign out of.
1. Upon successful sign out, a final window will appear advising you to close all browser windows.

## Next steps

> [!div class="nextstepaction"]
> [Enable self-service password reset](./how-to-enable-password-reset-customers.md)