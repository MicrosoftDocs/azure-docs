---
title: Tutorial - Grant access to an ASP.NET Core web API from a single-page application - Azure Active Directory B2C | Microsoft Docs
description: Tutorial on how to use Active Directory B2C to protect an .NET Core web api and call it from a single page app.
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

# Tutorial: Grant access to an ASP.NET Core web API from a single-page application using Azure Active Directory B2C

This tutorial shows you how to call an Azure Active Directory (Azure AD) B2C protected ASP.NET Core web API resource from a single-page application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Complete the steps and prerequisites in [Tutorial: Enable single-page app authentication with accounts using Azure Active Directory B2C](active-directory-b2c-tutorials-spa.md).

## Add a web API application

Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:5000`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, some users could have both read and write access, whereas other users might have read-only permissions. In this tutorial, you define read permissions for the web API.

1. Select **Applications**, and then select *webapi1*.
2. Select **Published scopes**.
3. For **scope**, enter `Hello.Read`, and for description, enter `Read access to hello`.
4. For **scope**, enter `Hello.Write`, and for description, enter `Write access to hello`.
5. Click **Save**.

The published scopes can be used to grant a client app permission to the web API.

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. In the prerequisite tutorial, you created a web application in Azure AD B2C named *webapp1*. You use this application to call the web API.

1. Select **Applications**, and then select *webapp1*.
2. Select **API access**, and then select **Add**.
3. In the **Select API** dropdown, select *webapi1*.
4. In the **Select Scopes** dropdown, select the **Hello.Read** and **Hello.Write** scopes that you previously defined.
5. Click **OK**.

Your **My sample single page app** is registered to call the protected **Hello Core API**. A user authenticates with Azure AD B2C to use the single page application. The single page app obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API code to use your Azure AD B2C tenant. In this tutorial, you configure a sample .NET Core web application you can download from GitHub. [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi/archive/master.zip) or clone the sample web app from GitHub.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi.git
```

### Configure the web API

1. Open the **B2C-WebAPI.sln** solution in Visual Studio.
2. Open the **appsettings.json** file. Update the following values to configure the web api to use your tenant:

    ```javascript
    "AzureAdB2C": 
      {
        "Tenant": "<your tenant name>.onmicrosoft.com", 
        "ClientId": "<application-ID>",
        "Policy": "B2C_1_signupsignin1>",
        "ScopeRead": "Hello.Read"  
      },
    ```

#### Enable CORS

To allow your single page application to call the ASP.NET Core web API, you need to enable [CORS](https://docs.microsoft.com/aspnet/core/security/cors).

1. In **Startup.cs**, add CORS to the `ConfigureServices()` method.

    ```C#
    public void ConfigureServices(IServiceCollection services) {
      services.AddCors();
    ```

2. In **Startup.cs**, configure CORS in the `Configure()` method.

    ```C#
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) {
      app.UseCors(builder =>
        builder.WithOrigins("http://localhost:6420").AllowAnyHeader().AllowAnyMethod());
    ```

3. Open the **launchSettings.json** file under **Properties**, locate the **iisSettings** *applicationURL* setting, and set the port number to the one registered for the API Reply URL `http://localhost:5000`.

### Configure the single page application

The single page application uses Azure AD B2C for user sign-up, sign-in, and calls the protected ASP.NET Core web API. You update the single page application to call the .NET Core web API.

To change the app settings:

1. Open the `index.html` file.
2. Configure the sample with the Azure AD B2C tenant registration information. In the following code, add your tenant name to **b2cScopes** and change the **webApi** value to the *applicationURL* value that you previously recorded:

    ```javascript
    // The current application coordinates were pre-registered in a B2C tenant.
    var applicationConfig = {
        clientID: '<application-ID>',
        authority: "https://<your-tenant-name>.b2clogin.com/tfp/<your-tenant-name>.onmicrosoft.com/B2C_1_signupsignin1",
        b2cScopes: ["https://<Your tenant name>.onmicrosoft.com/api/Hello.Read"],
        webApi: 'http://localhost:5000/api/values',
    };
    ```

## Run the SPA application and web API

You need to run both the Node.js single page application and the .NET Core web API.

### Run the ASP.NET Core Web API 

Press **F5** to debug the **B2C-WebAPI.sln** solution in Visual Studio.

When the project launches, a web page is displayed in your default browser announcing the web api is available for requests.

### Run the single page app

1. Launch a Node.js command prompt.
2. Change to the directory containing the Node.js sample. For example `cd c:\active-directory-b2c-javascript-msal-singlepageapp`
3. Run the following commands:
    ```
    npm install && npm update
    node server.js
    ```

    The console window displays the port number of where the application is hosted.
    
    ```
    Listening on port 6420...
    ```

4. Use a browser to navigate to the address `http://localhost:6420` to view the application.
5. Sign in using the email address and password used in [Authenticate users with Azure Active Directory B2C in a single page application (JavaScript)](active-directory-b2c-tutorials-spa.md).
6. Click **Call API**.

After you sign up or sign in with a user account, the sample calls the protected web api and returns a result.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

> [!div class="nextstepaction"]
> [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md)
