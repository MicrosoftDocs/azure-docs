---
title: "Tutorial: Add sign-in to an application"
description: Add sign-in to an ASP.NET Core application using Visual Studio.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
---

# Tutorial: Add sign-in to an application in Azure Active Directory

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Identify and install the NuGet packages that are needed for authentication
> * Implement authentication in the code
> * Display the sign-in and sign-out experience

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Prepare an application for authentication](web-app-tutorial-02-prepare-application.md).
* Although any integrated development environment (IDE) that supports .NET applications can be used, the following IDEs are used for this tutorial. They can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
    - Visual Studio 2022
    - Visual Studio Code
    - Visual Studio 2022 for Mac

## Install identity packages

### [Visual Studio](#tab/visual-studio)

Identity related **NuGet packages** must be installed in the project for authentication of users to be enabled for the application.

1. Open the project that was previously created in Visual Studio. In the top menu of Visual Studio, select **Tools > NuGet Package Manager > Manage NuGet Packages for Solution**.
1. With the **Browse** tab selected, search for **Microsoft.Identity.Web**, select the `Microsoft.Identity.Web` package, select **Project**, and then select **Install**.
1. Repeat the previous step for the **Microsoft.Identity.Web.UI** package.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, select **Terminal** then **New Terminal.**
1. Ensure that you are in the correct directory (WebApp1), then enter the following into the terminal to install the relevant NuGet packages;

```powershell
dotnet add package Microsoft.Identity.Web --version 2.0.5-preview
dotnet add package Microsoft.Identity.Web.UI --version 2.0.5-preview
dotnet add package Microsoft.Identity.Web.Diagnostics --version 2.0.5-preview
```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

The same steps can be implemented in Visual Studio for Windows.

---

## Implement authentication

1. Open the *Program.cs* file and add the following statements to the top of the file:

    ```csharp
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc.Authorization;
    using Microsoft.Identity.Web;
    using Microsoft.Identity.Web.UI;
    ```

1. Add the `AzureAD` service that was defined in the *appsettings.json* file to the existing `builder` object:

    ```csharp
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddMicrosoftIdentityWebAppAuthentication(builder.Configuration, "AzureAd");
    ```

1. Modify the `AddRazorPages()` function to add authentication:

    ```csharp
    // Add services to the container.
    builder.Services.AddRazorPages().AddMvcOptions(options =>
    {
      var policy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
      options.Filters.Add(new AuthorizeFilter(policy));
    }).AddMicrosoftIdentityUI();
    ```

1. Update the `app` object to include the MVC options and authentication:

    ```csharp
    app.UseAuthentication();
    app.MapControllers();

    app.UseRouting();
    ```

## Create the *_LoginPartial.cshtml* file to enable the Login experience

### [Visual Studio](#tab/visual-studio)

1. Expand **Pages**, right-click **Shared**, and then select **Add > Razor page**.
1. Select **Razor Page - Empty**, and then select **Add**.
1. Enter *_LoginPartial.cshtml* for the name, and then select **Add**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In the Explorer bar, select **Pages**, then right-click **Shared**, and then select **New File**, and name it *_LoginPartial.cshtml*.
1. Open *_LoginPartial.cshtml*, and then add the following code for adding sign-in and sign-out to the page:

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. Steps for Mac
---

## Display the sign-in and sign-out experience

1. Open *_LoginPartial.cshtml* and add the following code for adding sign-in and sign-out to the page:

    ```csharp
    @using System.Security.Principal

    <ul class="navbar-nav">
      @if (User.Identity?.IsAuthenticated == true)
      {
        <li class="nav-item">
          <span class="navbar-text text-dark">Hello @User.Identity?.Name!</span>
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

1. Open *_Layout.cshtml* and add a reference to `_LoginPartial` created in the previous step. Ensure this is placed between the `</header` and `<footer class="border-top footer text-muted">`.

    ```csharp
    <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
      <ul class="navbar-nav flex-grow-1">
        <li class="nav-item">
          <a class="nav-link text-dark" asp-area="" asp-page="/Index">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-dark" asp-area="" asp-page="/Privacy">Privacy</a>
        </li>
      </ul>
      <partial name="_LoginPartial" />
    </div>
    ```

## See also

The following articles are related to the concepts presented in this tutorial:
<!-- Suitable links required -->

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare an application for authentication in the tenant](web-app-tutorial-04-prepare-tenant-app.md)