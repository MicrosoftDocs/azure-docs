---
title: "Tutorial: Add sign in to an application"
description: Add sign in to an ASP.NET Core application using Visual Studio.
services: active-directory
author: cilwerner

ms.service: active-directory
ms.subservice: develop
ms.author: cwerner
manager: CelesteDG
ms.topic: tutorial
ms.date: 02/09/2023
#Customer intent: As an application developer, I want to install the NuGet packages necessary for authentication in my IDE, and implement authentication in my web app.
---

# Tutorial: Add sign in to an application

In the [previous tutorial](web-app-tutorial-02-prepare-application.md), an ASP.NET Core project was created and configured for authentication. This tutorial will install the required packages and add code that implements authentication to the sign in and sign out experience.

In this tutorial:

> [!div class="checklist"]
> * Identify and install the NuGet packages that are needed for authentication
> * Implement authentication in the code
> * Add the sign in and sign out experiences

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Prepare an application for authentication](web-app-tutorial-02-prepare-application.md).

## Install identity packages

Identity related **NuGet packages** must be installed in the project for authentication of users to be enabled.

### [Visual Studio](#tab/visual-studio)

1. In the top menu of Visual Studio, select **Tools > NuGet Package Manager > Manage NuGet Packages for Solution**.
1. With the **Browse** tab selected, search for and select **Microsoft.Identity.Web.UI**. Select the **Project** checkbox, and then select **Install**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In the Visual Studio Code terminal, navigate to *NewWebAppLocal*. 
1. Enter the following commands to install the relevant NuGet packages:

    ```powershell
    dotnet add package Microsoft.Identity.Web.UI
    dotnet add package Microsoft.Identity.Web.Diagnostics
    ``` 

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. In the top menu, select **Tools** > **Manage NuGet Packages**.
1. Search for **Microsoft.Identity.Web**, select the `Microsoft.Identity.Web` package, select **Project**, and then select **Add Package**.
1. Modify your search to read **Microsoft.Identity.Web.UI** and select **Add Packages**.
1. In the pop-up, ensure the correct project is selected, then select **Ok**.
1. Select **Accept** if additional **License Acceptance** windows appear.
---

## Implement authentication and acquire tokens

1. Open *Program.cs* and replace the entire file contents with the following snippet:
   
   :::code language="csharp" source="~/ms-identity-docs-code-dotnet/web-app-aspnet/Program.cs" :::

## Add the sign in and sign out experience

After installing the NuGet packages and adding necessary code for authentication, add the sign in and sign out experiences.

### Create the *_LoginPartial.cshtml* file

### [Visual Studio](#tab/visual-studio)

1. Expand **Pages**, right-click **Shared**, and then select **Add > Razor page**.
1. Select **Razor Page - Empty**, and then select **Add**.
1. Enter *_LoginPartial.cshtml* for the name, and then select **Add**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In the Explorer bar, select **Pages**, right-click **Shared**, and select **New File**. Give it the name *_LoginPartial.cshtml*.

### [Visual Studio for Mac](#tab/visual-studio-for-mac)

1. Expand **Pages**, right-click **Shared**, and then select **Add > Razor page**.
1. Select **Razor Page - Empty**, and then select **Add**.
1. Enter *_LoginPartial.cshtml* for the name, and then select **Add**.
---

### Edit the *_LoginPartial.cshtml* file

1. Open *_LoginPartial.cshtml* and add the following code for adding the sign in and sign out experience:

   :::code language="csharp" source="~/ms-identity-docs-code-dotnet/web-app-aspnet/Pages/Shared/_LoginPartial.cshtml" :::

1. Open *_Layout.cshtml* and add a reference to `_LoginPartial` created in the previous step. This single line should be placed between `</ul>` and `</div>`:

   :::code language="csharp" source="~/ms-identity-docs-code-dotnet/web-app-aspnet/Pages/Shared/_Layout.cshtml" range="29-31" :::

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Call an API and display results](web-app-tutorial-04-call-web-api.md)
