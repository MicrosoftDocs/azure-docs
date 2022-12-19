---
title: "Tutorial: Add sign-in to an application"
description: Add sign-in to an ASP.NET Core application using Visual Studio.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
#Customer intent: As an application developer, I want to install the NuGet packages necessary for authentication in my IDE, and implement authentication in my web app.
---

# Tutorial: Add sign-in to an application

<!-- Remove AAD replace with IDE -->

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
1. With the **Browse** tab selected, search for and select **Microsoft.Identity.Web**. Click the **Project** checkbox, and then select **Install**.
1. Repeat the previous step for the **Microsoft.Identity.Web.UI** package.

### [Visual Studio Code](#tab/visual-studio-code)

1. In Visual Studio Code, select **Terminal** then **New Terminal.**
1. Ensure that the correct directory is selected (*NewApp1*), then enter the following into the terminal to install the relevant NuGet packages;

```powershell
dotnet add package Microsoft.Identity.Web --version 2.0.5-preview
dotnet add package Microsoft.Identity.Web.UI --version 2.0.5-preview
dotnet add package Microsoft.Identity.Web.Diagnostics --version 2.0.5-preview
```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

<!-- Needs testing for confirmation -->
1. In the top menu, select **Tools** > **Manage NuGet Packages**.
1. Search for **Microsoft.Identity.Web**, select the `Microsoft.Identity.Web` package, select **Project**, and then select **Add Package**.
1. Modify your search to read **Microsoft.Identity.Web.UI** and select **Add Packages**.
1. In the pop-up, ensure the correct project is selected, then click **Ok**.
1. Click **Accept** if additional **License Acceptance** windows appear. 

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

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

<!-- Confirmation and testing needed here -->
1. Expand **Pages**, right-click **Shared**, and then select **Add > Razor page**.
1. Select **Razor Page - Empty**, and then select **Add**.
1. Enter *_LoginPartial.cshtml* for the name, and then select **Add**.
---

## Display the sign-in and sign-out experience

1. Open *_LoginPartial.cshtml* and add the following code for adding the sign-in and sign-out experience:

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

1. Open *_Layout.cshtml* and add a reference to `_LoginPartial` created in the previous step. This single line is best placed between `</ul>` and `</div>`.

    ```csharp
      </ul>
      <partial name="_LoginPartial" />
    </div>
    ```

<!-- Suitable links required for See also-->

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Call an API and display results](web-app-tutorial-05-call-web-api.md)