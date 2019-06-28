---
title: Tutorial - Grant access to an ASP.NET web API - Azure Active Directory B2C | Microsoft Docs
description: Tutorial on how to use Active Directory B2C to protect an ASP.NET web API and call it from an ASP.NET web application.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.author: marsma
ms.date: 02/04/2019
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Grant access to an ASP.NET web API using Azure Active Directory B2C

This tutorial shows you how to call a protected web API resource in Azure Active Directory (Azure AD) B2C from an ASP.NET web application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Complete the steps and prerequisites in [Tutorial: Enable authenticate in a web application using Azure Active Directory B2C](active-directory-b2c-tutorials-web-app.md).

## Add a web API application

Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:44332`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, users of the web API could have both read and write access, or users of the web API might have only read access. In this tutorial, you use scopes to define read and write permissions for the web API.

1. Select **Applications**, and then select *webapi1*.
2. Select **Published scopes**.
3. For **scope**, enter `Hello.Read`, and for description, enter `Read access to hello`.
4. For **scope**, enter `Hello.Write`, and for description, enter `Write access to hello`.
5. Click **Save**.

The published scopes can be used to grant a client application permission to the web API.

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. In the prerequisite tutorial, you created a web application in Azure AD B2C named *webapp1*. You use this application to call the web API.

1. Select **Applications**, and then select *webapp1*.
2. Select **API access**, and then select **Add**.
3. In the **Select API** dropdown, select *webapi1*.
4. In the **Select Scopes** dropdown, select the **Hello.Read** and **Hello.Write** scopes that you previously defined.
5. Click **OK**.

Your application is registered to call the protected web API. A user authenticates with Azure AD B2C to use the application. The application obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API to use your Azure AD B2C tenant. In this tutorial, you configure a sample web API. The sample web API is included in the project you downloaded in the prerequisite tutorial.

There are two projects in the sample solution:

The following two projects are in the sample solution:

- **TaskWebApp** - Create and edit a task list. The sample uses the **sign-up or sign-in** user flow to sign up or sign in users.
- **TaskService** - Supports the create, read, update, and delete task list functionality. The API is protected by Azure AD B2C and called by TaskWebApp.

### Configure the web application

1. Open the **B2C-WebAPI-DotNet** solution in Visual Studio.
2. Open **Web.config** in the **TaskWebApp** project.
3. To run the API locally, use the localhost setting for **api:TaskServiceUrl**. Change the Web.config as follows: 

    ```C#
    <add key="api:TaskServiceUrl" value="https://localhost:44332/"/>
    ```

3. Configure the URI of the API. This is the URI the web application uses to make the API request. Also, configure the requested permissions.

    ```C#
    <add key="api:ApiIdentifier" value="https://<Your tenant name>.onmicrosoft.com/api/" />
    <add key="api:ReadScope" value="Hello.Read" />
    <add key="api:WriteScope" value="Hello.Write" />
    ```

### Configure the web API

1. Open **Web.config** in the **TaskService** project.
2. Configure the API to use your tenant.

    ```C#
    <add key="ida:Tenant" value="<Your tenant name>.onmicrosoft.com" />
    ```

3. Set the client ID to the registered Application ID for your API.

    ```C#
    <add key="ida:ClientId" value="<application-ID>"/>
    ```

4. Update the user flow setting with the name of the sign up and sign-in user flow.

    ```C#
    <add key="ida:SignUpSignInUserFlowId" value="B2C_1_signupsignin1" />
    ```

5. Configure the scopes setting to match what you created in the portal.

    ```C#
    <add key="api:ReadScope" value="Hello.Read" />
    <add key="api:WriteScope" value="Hello.Write" />
    ```

## Run the sample

You need to run both the **TaskWebApp** and **TaskService** projects. 

1. In Solution Explorer, right-click on the solution and select **Set StartUp Projects...**. 
2. Select **Multiple startup projects**.
3. Change the **Action** for both projects to **Start**.
4. Click **OK** to save the configuration.
5. Press **F5** to run both applications. Each application opens in its own browser tab.
    `https://localhost:44316/` is the web application.
    `https://localhost:44332/` is the web API.

6. In the web application, click **sign-up / sign-in** to sign in to the web application. Use the account that you previously created. 
7. After you sign in, click **To-do list** and create a to-do list item.

When you create a to-do list item, the web application makes a request to the web API to generate the to-do list item. You're protected web application is calling the protected web API in your Azure AD B2C tenant.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

> [!div class="nextstepaction"]
> [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md)
