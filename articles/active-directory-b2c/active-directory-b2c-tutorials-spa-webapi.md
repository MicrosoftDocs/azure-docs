---
title: Tutorial - Grant access to an ASP.NET Core web API from a single-page application - Azure Active Directory B2C
description: Learn how to use Active Directory B2C to protect a .NET Core web API and call the API from an single-page application.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.author: marsma
ms.date: 07/24/2019
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

## Prerequisites

Complete the steps and prerequisites in [Tutorial: Enable single-page app authentication with accounts using Azure Active Directory B2C](active-directory-b2c-tutorials-spa.md).

## Add a web API application

Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
1. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications**, and then select **Add**.
1. Enter a name for the application. For example, *webapi1*.
1. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
1. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:5000`.
1. For **App ID URI**, enter an API endpoint identifier to the URI shown. For the tutorial, enter `api`, so that the full URI is similar to `https://contosotenant.onmicrosoft.com/api`.
1. Click **Create**.
1. Select the *webapi1* application to open its properties page.
1. On the properties page, record the **Application ID** to use in a later step when you configure the web application.

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, some users could have both read and write access, whereas other users might have read-only permissions. In this tutorial, you define read permissions for the web API.

1. Select **Applications**, and then select *webapi1* to open its properties page if it's not already open.
1. Select **Published scopes**.
1. For **scope**, enter `Hello.Read`, and for description, enter `Read access to hello`.
1. For **scope**, enter `Hello.Write`, and for description, enter `Write access to hello`.
1. Click **Save**.

The published scopes can be used to grant a client app permission to the web API.

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. In the prerequisite tutorial, you created a web application in Azure AD B2C named *webapp1*. You use this application to call the web API.

1. Select **Applications**, and then select *webapp1*.
1. Select **API access**, and then select **Add**.
1. In the **Select API** dropdown, select *webapi1*.
1. In the **Select Scopes** dropdown, select the **Hello.Read** and **Hello.Write** scopes that you previously defined.
1. Click **OK**.

Your **My sample single page app** is registered to call the protected **Hello Core API**. A user authenticates with Azure AD B2C to use the single page application. The single page app obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API code to use your Azure AD B2C tenant. In this tutorial, you configure a sample .NET Core web application you can download from GitHub. [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi/archive/master.zip) or clone the sample web app from GitHub.

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-dotnetcore-webapi.git
```

### Configure the web API

1. Open the **B2C-WebAPI.sln** solution in Visual Studio.
1. Open the **appsettings.json** file.
1. Modify the `AzureAdB2C` block to reflect your tenant name, the application ID of the web API application, the name of your sign-up/sign-in policy, and the scopes you defined earlier. The block should look similar to the following example (with appropriate `Tenant` and `ClientId` values):

    ```json
    "AzureAdB2C": {
      "Tenant": "<your-tenant-name>.onmicrosoft.com",
      "ClientId": "<webapi-application-ID>",
      "Policy": "B2C_1_signupsignin1",

      "ScopeRead": "Hello.Read",
      "ScopeRead": "Hello.Write"
    },
    ```

#### Enable CORS

To allow your single page application to call the ASP.NET Core web API, you need to enable [CORS](https://docs.microsoft.com/aspnet/core/security/cors).

1. In **Startup.cs**, add CORS to the `ConfigureServices()` method.

    ```csharp
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
    ```

1. Also within the `ConfigureServices()` method, set the `jwtOptions.Authority` value to the following token issuer URI.

    Replace `<your-tenant-name>` with the name of your B2C tenant.

    ```csharp
    jwtOptions.Authority = $"https://<your-tenant-name>.b2clogin.com/{Configuration["AzureAdB2C:Tenant"]}/{Configuration["AzureAdB2C:Policy"]}/v2.0";
    ```

1. In the `Configure()` method, configure CORS.

    ```csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        app.UseCors(builder =>
            builder.WithOrigins("http://localhost:6420").AllowAnyHeader().AllowAnyMethod());
    ```

1. Under **Properties** in the Solution Explorer, open the **launchSettings.json** file, then find the `iisExpress` block.
1. Update the `applicationURL` value with the port number your specified when you registered the *webapi1* application in an earlier step. For example:

    ```json
    "iisExpress": {
      "applicationUrl": "http://localhost:5000/",
      "sslPort": 0
    }
    ```

### Configure the single-page application

The single-page application (SPA) from the [previous tutorial](active-directory-b2c-tutorials-spa.md) in the series uses Azure AD B2C for user sign-up and sign-in, and calls the protected ASP.NET Core web API. In this section, you update the single page application to call the .NET Core web API.

To change the settings in the SPA:

1. Open the `index.html` file in the project you downloaded or cloned in the previous tutorial ([active-directory-b2c-javascript-msal-singlepageapp][github-js-spa]).
1. Configure the sample with the URI for the *Hello.Read* scope you created earlier and the URL for the web API.

   In the `appConfig` definition, replace the `b2cScopes` value with the URI for the scope. Next, change the `webApi` value to the *applicationURL* value from the previous section. For example (replace `<your-tenant-name>` with the name of your B2C tenant):

    ```javascript
    // The current application coordinates were pre-registered in a B2C tenant.
    var appConfig = {
      b2cScopes: ["https://<your-tenant-name>.onmicrosoft.com/api/Hello.Read"],
      webApi: "http://localhost:5000/"
    };
    ```

## Run the SPA and web API

You need to run both the Node.js single-page application and the .NET Core web API.

### Run the ASP.NET Core Web API

Press **F5** to debug the **B2C-WebAPI.sln** solution in Visual Studio.

When the project launches, a web page is displayed in your default browser announcing the web API is available for requests.

### Run the single page app

1. Open a console window and change to the directory containing the Node.js sample. For example `cd active-directory-b2c-javascript-msal-singlepageapp`.
1. Run the following commands:
    ```console
    npm install && npm update
    node server.js
    ```

    The console window displays the port number of where the application is hosted.

    ```console
    Listening on port 6420...
    ```

1. Use a browser to navigate to the address `http://localhost:6420` to view the application.
1. Sign in using the email address and password used in [Authenticate users with Azure Active Directory B2C in a single page application (JavaScript)](active-directory-b2c-tutorials-spa.md).
1. Click **Call API**.

After you sign up or sign in with a user account, the sample calls the protected web API and returns a result.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

> [!div class="nextstepaction"]
> [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md)

<!-- Links - EXTERNAL -->
[github-js-spa]: https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp
