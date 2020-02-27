---
title: "Tutorial: Protect a Node.js web API using Azure Active Directory B2C and grant access to SPA"
titleSuffix: Azure AD B2C
description: In this tutorial, learn how to use Active Directory B2C to protect a Node.js web API and call it from a single-page application.
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

# Tutorial: Protect a Node.js Web API using Azure Active Directory B2C and grant access to SPA

This tutorial shows you how to call an Azure Active Directory B2C (Azure AD B2C)-protected Node.js web API from a single-page application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

## Prerequisites

* Complete the steps and prerequisites in [Tutorial: Enable authentication in a single-page application using Azure Active Directory B2C](tutorial-single-page-app.md).
* [Visual Studio Code](https://code.visualstudio.com/)
* [Node.js](https://nodejs.org/en/download/)

## Add a web API application

[!INCLUDE [active-directory-b2c-appreg-webapi](../../includes/active-directory-b2c-appreg-webapi.md)]

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, some users could have both read and write access, whereas other users might have read-only permissions. In this tutorial, you define both read and write permissions for the web API.

[!INCLUDE [active-directory-b2c-scopes](../../includes/active-directory-b2c-scopes.md)]

Record the value under **SCOPES** for the `demo.read` scope to use in a later step when you configure the single-page application. The full scope value is similar to `https://contosob2c.onmicrosoft.com/api/demo.read`.

## Grant permissions

To call a protected web API from another application, you need to grant that application permissions to the web API.

In the prerequisite tutorial, you created a web application named *webapp1*. In this tutorial, you configure that application to call the web API you created in a previous section, *webapi1*.

[!INCLUDE [active-directory-b2c-permissions-api](../../includes/active-directory-b2c-permissions-api.md)]

Your single-page web application is registered to call the protected web API. A user authenticates with Azure AD B2C to use the single-page application. The single-page app obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API code to use your Azure AD B2C tenant. In this tutorial, you configure a sample Node.js web API you download from GitHub.

[Download a \*.zip archive](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi/archive/master.zip) or clone the sample web API project from GitHub.

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

### Configure the web API

1. Open the **index.js** file in Visual Studio Code.
1. Modify the file to reflect your tenant name, the application ID of the web API application, the name of your sign-up/sign-in policy, and the scopes you defined earlier. The block should look similar to the following example (with appropriate `tenantIdGuid` and `clientId` values):

    ```javascript
    var clientID = "<your-webapi-application-ID>"; 
    var b2cDomainHost = "fabrikamb2c.b2clogin.com";
    var tenantIdGuid = "<your-webapi-tenant-ID>";
    var policyName = "B2C_1_signupsignin1";
    ```

#### Enable CORS

To allow your single-page application to call the Node.js web API, you need to enable [CORS](https://expressjs.com/en/resources/middleware/cors.html) in the web API. In a real application you should be careful about which domain is making the request, but for this example we will allow requests coming from any domain. To do so, use the following middleware:

    ```javascript
     app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    ```

### Configure the single-page application

The single-page application (SPA) from the [previous tutorial](tutorial-single-page-app.md) in the series uses Azure AD B2C for user sign-up and sign-in, and calls the Node.js web API protected by the *frabrikamb2c* demo tenant.

In this section, you update the single-page application to call the Node.js web API protected by *your* Azure AD B2C tenant and which you run on your local machine.

To change the settings in the SPA:

1. Open the *apiConfig.js* file in the [active-directory-b2c-javascript-msal-singlepageapp][github-js-spa] project you downloaded or cloned in the previous tutorial.
1. Configure the sample with the URI for the *demo.read* scope you created earlier and the URL of the web API.
    1. In the `apiConfig` definition, replace the `b2cScopes` value with the full URI for the scope (the **SCOPE** value you recorded earlier).
    1. Change the `webApi` value to the redirect URI you added when you registered the web API application in an earlier step.

    The `apiConfig` definition should look similar to the following code block (with your tenant name in the place of `<your-tenant-name>`):

    ```javascript
    const apiConfig = {
        b2cScopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"],
        webApi: "http://localhost:5000/"
    };

    // request to acquire a token for resource access
    const tokenRequest = {
        scopes: apiConfig.b2cScopes
    };
    ```

## Run the SPA and web API

Finally, you run both the Node.js web API and the sample JavaScript single-page application on your local machine. Then, you sign in to the single-page application and press a button to initiate a request to the protected API.

Although both applications run locally in this tutorial, they use Azure AD B2C for secure sign-up/sign-in and to grant access to the protected web API.

### Run the Node.js web API

1. Open a console window and change to the directory containing the Node.js web API sample. For example: `cd active-directory-b2c-javascript-nodejs-webapi`

1. Run the following commands:

    ```console
    npm install && npm update
    node index.js
    ```

    The console window displays the port number where the application is hosted.

    ```console
    Listening on port 5000...
    ```
    ```

### Run the single page app

1. Open a console window and change to the directory containing the JavaScript SPA sample. For example:

    `cd active-directory-b2c-javascript-msal-singlepageapp`

1. Run the following commands:

    ```console
    npm install && npm update
    npm start
    ```

    The console window displays the port number of where the application is hosted.

    ```console
    Listening on port 6420...
    ```

1. Navigate to `http://localhost:6420` in your browser to view the application.
1. Sign in using the email address and password you used in the [previous tutorial](tutorial-single-page-app.md). Upon successful login, you should see the `User 'Your Username' logged-in` message.
1. Select the **Call Web API** button. The SPA obtains an authorization grant from Azure AD B2C, then accesses the protected web API to display the contents of its index page:

    ```Output
    Web APi returned:
    "<html>\r\n<head>\r\n  <title>Azure AD B2C API Sample</title>\r\n ...
    ```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Configure the sample to use the application

Now that you've seen an SPA request a resource from a protected web API, gain a deeper understanding of how these application types interact with each other and with Azure AD B2C.

> [!div class="nextstepaction"]
> [Application types that can be used in Active Directory B2C >](application-types.md)

<!-- Links - EXTERNAL -->
[github-js-spa]: https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp
