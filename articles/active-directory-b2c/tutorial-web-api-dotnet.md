---
title: "Tutorial: Grant access to an ASP.NET web API"
titleSuffix: Azure AD B2C
description: Tutorial on how to use Active Directory B2C to protect an ASP.NET web API and call it from an ASP.NET web application.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 10/14/2019
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Grant access to an ASP.NET web API using Azure Active Directory B2C

This tutorial shows you how to call a protected web API resource in Azure Active Directory B2C (Azure AD B2C) from an ASP.NET web application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Complete the steps and prerequisites in [Tutorial: Enable authenticate in a web application using Azure Active Directory B2C](tutorial-web-app-dotnet.md).

## Add a web API application

Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapi1*.
1. Under **Redirect URI**, select **Web**, and then enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:44332`.
1. Select **Register**.
1. Record the **Application (client) ID** for use in a later step.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications (Legacy)**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:44332`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

* * *

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, users of the web API could have both read and write access, or users of the web API might have only read access. In this tutorial, you use scopes to define read and write permissions for the web API.

[!INCLUDE [active-directory-b2c-scopes](../../includes/active-directory-b2c-scopes.md)]

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. In the prerequisite tutorial, you created a web application in Azure AD B2C named *webapp1*. You use this application to call the web API.

[!INCLUDE [active-directory-b2c-permissions-api](../../includes/active-directory-b2c-permissions-api.md)]

Your application is registered to call the protected web API. A user authenticates with Azure AD B2C to use the application. The application obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API to use your Azure AD B2C tenant. In this tutorial, you configure a sample web API. The sample web API is included in the project you downloaded in the prerequisite tutorial.

There are two projects in the sample solution:

* **TaskWebApp** - Create and edit a task list. The sample uses the **sign-up or sign-in** user flow to sign up or sign in users.
* **TaskService** - Supports the create, read, update, and delete task list functionality. The API is protected by Azure AD B2C and called by TaskWebApp.

### Configure the web application

1. Open the **B2C-WebAPI-DotNet** solution in Visual Studio.
1. In the **TaskWebApp** project, open **Web.config**.
1. To run the API locally, use the localhost setting for **api:TaskServiceUrl**. Change the Web.config as follows:

    ```csharp
    <add key="api:TaskServiceUrl" value="https://localhost:44332/"/>
    ```

1. Configure the URI of the API. This is the URI the web application uses to make the API request. Also, configure the requested permissions.

    ```csharp
    <add key="api:ApiIdentifier" value="https://<Your tenant name>.onmicrosoft.com/api/" />
    <add key="api:ReadScope" value="demo.read" />
    <add key="api:WriteScope" value="demo.write" />
    ```

### Configure the web API

1. In the **TaskService** project, open **Web.config**.
1. Configure the API to use your tenant.

    ```csharp
    <add key="ida:AadInstance" value="https://<Your tenant name>.b2clogin.com/{0}/{1}/v2.0/.well-known/openid-configuration" />
    <add key="ida:Tenant" value="<Your tenant name>.onmicrosoft.com" />
    ```

1. Set the client ID to the Application ID of your registered web API application, *webapi1*.

    ```csharp
    <add key="ida:ClientId" value="<application-ID>"/>
    ```

1. Update the user flow setting with the name of your sign-up and sign-in user flow, *B2C_1_signupsignin1*.

    ```csharp
    <add key="ida:SignUpSignInPolicyId" value="B2C_1_signupsignin1" />
    ```

1. Configure the scopes setting to match those you created in the portal.

    ```csharp
    <add key="api:ReadScope" value="demo.read" />
    <add key="api:WriteScope" value="demo.write" />
    ```

## Run the sample

You need to run both the **TaskWebApp** and **TaskService** projects.

1. In Solution Explorer, right-click on the solution and select **Set StartUp Projects...**.
1. Select **Multiple startup projects**.
1. Change the **Action** for both projects to **Start**.
1. Click **OK** to save the configuration.
1. Press **F5** to run both applications. Each application opens in its own browser window.
    * `https://localhost:44316/` is the web application.
    * `https://localhost:44332/` is the web API.

1. In the web application, select **sign-up / sign-in** to sign in to the web application. Use the account that you previously created.
1. After you sign in, select **To-do list** and create a to-do list item.

When you create a to-do list item, the web application makes a request to the web API to generate the to-do list item. Your protected web application is calling the web API protected by Azure AD B2C.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

> [!div class="nextstepaction"]
> [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md)
