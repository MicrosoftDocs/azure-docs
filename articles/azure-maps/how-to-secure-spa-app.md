---
title: How to secure a single page application with non-interactive sign-in
titleSuffix: Azure Maps
description: How to configure a single page application with non-interactive Azure role-based access control (Azure RBAC) and Azure Maps Web SDK.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/12/2020
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: timlt
ms.custom: devx-track-js
---

# How to secure a single page application with non-interactive sign-in

The following guide pertains to an application using Azure Active Directory (Azure AD) to provide an access token to Azure Maps applications when the user can't sign in to Azure AD. This flow requires hosting of a web service which must be secured to only be accessed by the single page web application. There are multiple implementations which can accomplish authentication to Azure AD. This guide leverages the product, Azure Function to acquire access tokens.

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

> [!Tip]
> Azure maps can support access tokens from user sign-on / interactive flows. Interactive flows enable a more restricted scope of access revocation and secret management.

## Create Azure Function

Create a secured web service application which is responsible for authentication to Azure AD. 

1. Create a function in the Azure portal. For more information, see [Create Azure Function](../azure-functions/functions-get-started.md).

2. Configure CORS policy on the Azure function to be accessible by the single page web application. This will secure browser clients to the allowed origins of your web application. See [Add CORS functionality](../app-service/app-service-web-tutorial-rest-api.md#add-cors-functionality).

3. [Add a system-assigned identity](../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity) on the Azure function to enable creation of a service principal to authenticate to Azure AD.  

4. Grant role-based access for the system-assigned identity to the Azure Maps account. See [Grant role-based access](#grant-role-based-access) for details.

5. Write code for the Azure function to obtain Azure Maps access tokens using system-assigned identity with one of the supported mechanisms or the REST protocol. See [Obtain tokens for Azure resources](../app-service/overview-managed-identity.md?tabs=dotnet#add-a-system-assigned-identity)

    A sample REST protocol example:

    ```http
    GET /MSI/token?resource=https://atlas.microsoft.com/&api-version=2019-08-01 HTTP/1.1
    Host: localhost:4141
    ```

    Sample response:

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

6. Configure security for the Azure function HttpTrigger

   * [Create a function access key](../azure-functions/functions-bindings-http-webhook-trigger.md?tabs=csharp#authorization-keys)
   * [Secure HTTP endpoint](../azure-functions/functions-bindings-http-webhook-trigger.md?tabs=csharp#secure-an-http-endpoint-in-production) for the Azure function in production.
   
7. Configure web application Azure Maps Web SDK. 

    ```javascript
    //URL to custom endpoint to fetch Access token
    var url = 'https://<APP_NAME>.azurewebsites.net/api/<FUNCTION_NAME>?code=<API_KEY>';

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

## Grant role-based access

You grant *Azure role-based access control (Azure RBAC)* access by assigning the system-assigned identity to one or more Azure role definitions. To view Azure role definitions that are available for Azure Maps, go to **Access control (IAM)**. Select **Roles**, and then search for roles that begin with *Azure Maps*.

1. Go to your **Azure Maps Account**. Select **Access control (IAM)** > **Role assignment**.

    > [!div class="mx-imgBorder"]
    > ![Grant access using Azure RBAC](./media/how-to-manage-authentication/how-to-grant-rbac.png)

2. On the **Role assignments** tab, under **Role**, select a built in Azure Maps role definition such as **Azure Maps Data Reader** or **Azure Maps Data Contributor**. Under **Assign access to**, select **Function App**. Select the principal by name. Then select **Save**.

   * See details on [Assign Azure roles](../role-based-access-control/role-assignments-portal.md).

> [!WARNING]
> Azure Maps built-in role definitions provide a very large authorization access to many Azure Maps REST APIs. To restrict APIs access to a minimum, see [create a custom role definition and assign the system-assigned identity](../role-based-access-control/custom-roles.md) to the custom role definition. This will enable the least privilege necessary for the application to access Azure Maps.

## Next steps

Further understanding of Single Page Application Scenario:
> [!div class="nextstepaction"]
> [Single-page application](../active-directory/develop/scenario-spa-overview.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore other samples that show how to integrate Azure AD with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps Samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples/tree/master/src/ClientGrant)