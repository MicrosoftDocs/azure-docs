---
title: "Tutorial: Call an API and display the results"
description: Call an API and display the results.
services: active-directory
author: cilwerner

ms.service: active-directory
ms.subservice: develop
ms.author: cwerner
manager: CelesteDG
ms.topic: tutorial
ms.date: 02/09/2023
#Customer intent: As an application developer, I want to use my app to call a web API, in this case Microsoft Graph. I need to know how to modify my code so the API can be called successfully.
---

# Tutorial: Call an API and display the results

The application can now be configured to call an API. For the purposes of this tutorial, the Microsoft Graph API will be called to display the profile information of the logged-in user.

In this tutorial:

> [!div class="checklist"]
> * Call the API and display the results
> * Test the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Add sign in to an application](web-app-tutorial-03-sign-in-users.md).

## Call the API and display the results

1. Under **Pages**, open the *Index.cshtml.cs* file and replace the entire contents of the file with the following snippet. Check that the project `namespace` matches your project name.

   :::code language="csharp" source="~/ms-identity-docs-code-dotnet/web-app-aspnet/Pages/Index.cshtml.cs" :::

1. Open *Index.cshtml* and add the following code to the bottom of the file. This will handle how the information received from the API is displayed:

   :::code language="csharp" source="~/ms-identity-docs-code-dotnet/web-app-aspnet/Pages/Index.cshtml" range="13-17" :::

## Test the application

### [Visual Studio](#tab/visual-studio)
1. Start the application by selecting **Start without debugging**.

### [Visual Studio Code](#tab/visual-studio-code)
1. Start the application by typing the following in the terminal:

    #### [.NET 6.0](#tab/dotnet6)

    ```powershell
    dotnet run
    ```

    #### [.NET 7.0](#tab/dotnet7)

    ```powershell
    dotnet run --launch-profile https
    ```

### [Visual Studio for Mac](#tab/visual-studio-for-mac)
1. Start the application by selecting the **Play** icon.

---

2. Depending on your IDE, you may need to enter the application URI into the browser, for example `https://localhost:7100`. After the sign in window appears, select the account in which to sign in with. Ensure the account matches the criteria of the app registration.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/pick-account.png" alt-text="Screenshot depicting account options to sign in.":::
 
1. Upon selecting the account, a second window appears indicating that a code will be sent to your email address. Select **Send code**, and check your email inbox.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/sign-in-send-code.png" alt-text="Screenshot depicting a screen to send a code to the user's email.":::
 
1. Open the email from the sender **Microsoft account team**, and enter the 7-digit *single-use code*. Once entered, select **Sign in**.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/enter-code.png" alt-text="Screenshot depicting the single-use code sign in procedure.":::

1. For **Stay signed in**, you can select either **No** or **Yes**.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/stay-signed-in.png" alt-text="Screenshot depicting the option on whether to stay signed in.":::

1. The app will ask for permission to sign in and access data. Select **Accept** to continue.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/permissions-requested.png" alt-text="Screenshot depicting the permission requests.":::

1. The web app now displays profile data acquired from the Microsoft Graph API.

    :::image type="content" source="./media/web-app-tutorial-04-call-web-api/display-api-call-results.png" alt-text="Screenshot depicting the results of the API call.":::

## Next steps

Learn how to use the Microsoft identity platform by trying out the following tutorial series on how to build a web API.

> [!div class="nextstepaction"]
> [Tutorial: Register a web API with the Microsoft identity platform](web-api-tutorial-01-register-app.md)
