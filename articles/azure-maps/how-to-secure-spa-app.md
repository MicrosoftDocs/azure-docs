---
title: How to secure a single-page web application with non-interactive sign-in in Microsoft Azure Maps
titleSuffix: Azure Maps
description: How to configure a single-page web application with non-interactive Azure role-based access control (Azure RBAC) and Azure Maps Web SDK.
author: eriklindeman
ms.author: eriklind
ms.date: 10/28/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
ms.custom: subject-rbac-steps
---

# How to secure a single-page web application with non-interactive sign-in

Secure a single-page web application with Microsoft Entra ID, even when the user isn't able to sign in to Microsoft Entra ID.

To create this non-interactive authentication flow, first create an Azure Function secure web service that's responsible for acquiring access tokens from Microsoft Entra ID. This web service is exclusively available only to your single-page web application.

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

> [!TIP]
> Azure Maps can support access tokens from user sign-on or interactive flows. You can use interactive flows for a more restricted scope of access revocation and secret management.

## Create an Azure function

To create a secured web service application that's responsible for authentication to Microsoft Entra ID:

1. Create a function in the Azure portal. For more information, see [Getting started with Azure Functions].

2. Configure CORS policy on the Azure function to be accessible by the single-page web application. The CORS policy secures browser clients to the allowed origins of your web application. For more information, see [Add CORS functionality].

3. [Add a system-assigned identity] on the Azure function to enable creation of a service principal to authenticate to Microsoft Entra ID.  

4. Grant role-based access for the system-assigned identity to the Azure Maps account. For more information, see [Grant role-based access].

5. Write code for the Azure function to obtain Azure Maps access tokens using system-assigned identity with one of the supported mechanisms or the REST protocol. For more information, see [Obtain tokens for Azure resources].

    Here's an example REST protocol:

    ```http
    GET /MSI/token?resource=https://atlas.microsoft.com/&api-version=2019-08-01 HTTP/1.1
    Host: localhost:4141
    ```

    And here's an example response:

    ```http
    HTTP/1.1 200 OK
    Content-Type: application/json

    {
        "access_token": "eyJ0eXAi…",
        "expires_on": "1586984735",
        "resource": "https://atlas.microsoft.com/",
        "token_type": "Bearer",
        "client_id": "..."
    }
    ```

6. Configure security for the Azure function HttpTrigger:

   1. [Create a function access key]
   1. [Secure HTTP endpoint](../azure-functions/functions-bindings-http-webhook-trigger.md?tabs=csharp#secure-an-http-endpoint-in-production) for the Azure function in production.

7. Configure a web application Azure Maps Web SDK.

    ```javascript
    //URL to custom endpoint to fetch Access token
    var url = 'https://{App-Name}.azurewebsites.net/api/{Function-Name}?code={API-Key}';

    var map = new atlas.Map('myMap', {
                center: [-122.33, 47.6],
                zoom: 12,
                language: 'en-US',
                view: "Auto",
            authOptions: {
                authType: "anonymous",
                clientId: "<insert>", // azure map account client id
                getToken: function(resolve, reject, map) {
                    fetch(url).then(function(response) {
                        return response.text();
                    }).then(function(token) {
                        resolve(token);
                    });
                }
            }
        });

        // use the following events to debug, you can remove them at any time.
        map.events.add("tokenacquired", function () {
            console.log("token acquired");
        });
        map.events.add("error", function (err) {
            console.log(JSON.stringify(err.error));
        });
    ```

[!INCLUDE [grant role-based access to users](./includes/grant-rbac-users.md)]

## Next steps

Further understanding of a single-page application scenario:
> [!div class="nextstepaction"]
> [Single-page application](../active-directory/develop/scenario-spa-overview.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore other samples that show how to integrate Microsoft Entra ID with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/ClientGrant)

[Getting started with Azure Functions]: ../azure-functions/functions-get-started.md
[Add CORS functionality]: ../app-service/app-service-web-tutorial-rest-api.md#add-cors-functionality
[Add a system-assigned identity]: ../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity
[Grant role-based access]: #grant-role-based-access-for-users-to-azure-maps
[Obtain tokens for Azure resources]: ../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity
[Create a function access key]: ../azure-functions/functions-bindings-http-webhook-trigger.md?tabs=csharp#authorization-keys
