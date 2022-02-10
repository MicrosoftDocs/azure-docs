---
author: henrymbuguakiarie
ms.author: henrymbugua
ms.date: 01/14/2022
ms.service: active-directory
ms.subservice: develop
ms.topic: include
---

In this tutorial, you register a web app that uses the Microsoft Authentication Library (MSAL) in the Microsoft Identity platform.

Follow the steps in this tutorial to:

> [!div class="checklist"]
>
> - Register your application with Azure AD
> - Configure redirect URIs in your single-page app

## Register your application with Azure AD

First, complete the steps in [Register an application with the Microsoft identity platform](../../quickstart-register-app.md) to register the sample app.

Use the following settings for your app registration:

| App registration <br/> setting | Value for this sample app                          | Notes                                                                                                       |
|:------------------------------:|:---------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| **Name**                       | `active-directory-dotnet-webapp-aspnetcore`        | Suggested value for this sample. <br/> You can change the app name at any time.                             |
| **Supported account types**    | **My organization only**                           | Required for this sample. <br/> Support for the Single tenant.                                              |
| **Platform type**              | `Web`                                              | Required value for this sample. <br/> Enables the required and optional settings for the app type.          |
| **Redirect URIs**              | `https://localhost:5001/signin-oidc`               | Required value for this sample. <br/> You can change that later in your own implementation.                 |
| **Front-channel logout URL**   | `https://localhost:5001/signout-oidc`              | Required value for this sample. <br/> You can change that later in your own implementation.                 |
| **Client secret**              | _Value shown in Azure portal_                      | :warning: Record this value immediately! <br/> It's shown only _once_ (when you create it).                 |

## Configure a redirect URI

:::code language="json" source="~/ms-identity-docs-code-dotnet/src/sign-in-webapp/appsettings.json" highlight="15":::

## Next steps

In this tutorial, you <!-- $TASKS_COMPLETED_AND_LEARNINGS_HERE -->.

In the next tutorial, you build on these learnings by <!-- $TASKS_AND_LEARNINGS_IN_NEXT_TUTORIAL_HERE -->.

> [!div class="nextstepaction"] 
> [Sign in user](../../web-app-tutorial-03-sign-in-users.md)
