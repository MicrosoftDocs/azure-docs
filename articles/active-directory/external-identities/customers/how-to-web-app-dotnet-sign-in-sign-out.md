---
title: Tutorial - Add sign-in and sign-out to an ASP.NET web application for a customer tenant
description: Learn how to configure an ASP.NET web application to sign in and sign out users with your Azure Active Directory (Azure AD) for customers tenant.
services: active-directory
author: cilwerner
ms.author: cwerner
manager: celestedg
ms.service: active-directory
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant.
---

# Tutorial: Add sign-in and sign-out to an ASP.NET web application for a customer tenant

In the [previous article](./how-to-web-app-dotnet-sign-in-prepare-app.md), you created an ASP.NET project in Visual Studio Code and configured it for authentication.

In this tutorial you'll:

> [!div class="checklist"]
> * Add sign-in and sign-out experiences
> * Add code to view ID token claims
> * Sign-in and sign-out of the application using the user flow

## Prerequisites

- Completion of the prerequisites and steps in [Prepare an ASP.NET web app for authentication in a customer tenant](./how-to-web-app-dotnet-sign-in-prepare-app.md).

## Add the sign-in and sign out experience

After installing the NuGet packages and adding necessary code for authentication, we need to add the sign-in and sign out experiences. The code reads the ID token claims to check that the user is authenticated and uses `User.Claims` to extract ID token claims.

1. In your IDE, navigate to *Views/Shared*, and create a new file called *_LoginPartial.cshtml*.
1. Open *_LoginPartial.cshtml* and add the following code for adding the sign in and sign out experience. 

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

The web app is now configured to sign in users with the Microsoft identity platform. The next step is to add code that allows us to view the ID token claims. The app will check that the user is authenticated using `User.Identity.IsAuthenticated`, and lists out the ID token claims by looping through each item in `User.Claims`, returning their `Type` and `Value`.

1. Open *Views/Home/Index.cshtml* and replace the contents of the file with the following snippet:

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

## Sign-in to the application

1. Start the application by typing the following in the terminal to launch the `https` profile in the *launchSettings.json* file.

    ```powershell
    dotnet run --launch-profile https
    ```

1. Open a new private browser, and enter the application URI into the browser, in this case `https://localhost:7274`.
1. To test the sign-up user flow you configured earlier, select **No account? Create one**.
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