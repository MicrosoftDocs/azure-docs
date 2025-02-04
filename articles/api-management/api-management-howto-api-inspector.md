---
title: Tutorial - Debug APIs in Azure API Management using request tracing
description: Follow the steps of this tutorial to enable tracing and inspect request processing steps in Azure API Management.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: tutorial
ms.date: 11/04/2024
ms.author: danlep
ms.custom: devdivchpfy22
---

# Tutorial: Debug your APIs using request tracing

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This tutorial describes how to inspect (trace) request processing in Azure API Management. Tracing helps you debug and troubleshoot your API.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Trace an example call in the test console
> * Review request processing steps
> * Enable tracing for an API

:::image type="content" source="media/api-management-howto-api-inspector/api-inspector-002.png" alt-text="Screenshot showing the API inspector." lightbox="media/api-management-howto-api-inspector/api-inspector-002.png":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the following tutorial: [Import and publish your first API](import-and-publish.md).


[!INCLUDE [api-management-tracing-alert](../../includes/api-management-tracing-alert.md)]

## Trace a call in the portal

Follow these steps to trace an API request in the test console in the portal. This example assumes that you [imported](import-and-publish.md) a sample API in a previous tutorial. You can follow similar steps with a different API that you imported.

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs** > **APIs**.
1. Select  **Petstore API** from your API list.
1. Select the **Test** tab.
1. Select the **Find pet by ID** operation.
1. In the *petId* **Query parameter**, enter *1*.
1. Optionally check the value for the **Ocp-Apim-Subscription-Key** header used in the request by selecting the "eye" icon.
    > [!TIP]
    > You can override the value of **Ocp-Apim-Subscription-Key** by retrieving a key for another subscription in the portal. Select **Subscriptions**, and open the context menu (**...**) for another subscription. Select **Show/hide keys** and copy one of the keys. You can also regenerate keys if needed. Then, in the test console, select **+ Add header** to add an **Ocp-Apim-Subscription-Key** header with the new key value.

1. Select **Trace**. 


## Review trace information

1. After the call completes, go to the **Trace** tab in the **HTTP response**.
1. Select any of the following links to jump to detailed trace info: **Inbound**, **Backend**, **Outbound**, **On error**.

     :::image type="content" source="media/api-management-howto-api-inspector/response-trace-1.png" alt-text="Review response trace":::

    * **Inbound** - Shows the original request API Management received from the caller and the policies applied to the request. For example, if you added policies in [Tutorial: Transform and protect your API](transform-api.md), they appear here.

    * **Backend** - Shows the requests API Management sent to the API backend and the response it received.

    * **Outbound** - Shows the policies applied to the response before sending back to the caller.

    * **On error** - Shows the errors that occurred during the processing of the request and the policies applied to the errors.

    > [!TIP]
    > Each step also shows the elapsed time since the request is received by API Management.


## Enable tracing for an API

The following high level steps are required to enable tracing for a request to API Management when using `curl`, a REST client such as Visual Studio Code with the REST Client extension, or a client app. Currently these steps must be followed using the [API Management REST API](/rest/api/apimanagement):

1. Obtain a debug token for tracing.
1. Add the token value in an `Apim-Debug-Authorization` request header to the API Management gateway.
1. Obtain a trace ID in the `Apim-Trace-Id` response header.
1. Retrieve the trace corresponding to the trace ID.

Detailed steps follow.

> [!NOTE]
> * These steps require API Management REST API version 2023-05-01-preview or later. You must be assigned the Contributor or higher role on the API Management instance to call the REST API.
> * For information about authenticating to the REST API, see [Azure REST API reference](/rest/api/azure). 

1. **Obtain a debug token** - Call the API Management gateway's [List debug credentials](/rest/api/apimanagement/gateway/list-debug-credentials) API. In the URI, enter "managed" for the instance's managed gateway in the cloud, or the gateway ID for a self-hosted gateway. For example, to obtain trace credentials for the instance's managed gateway, use a request similar to the following:

    ```http
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/gateways/managed/listDebugCredentials?api-version=2023-05-01-preview
    ```
    
    In the request body, pass the full resource ID of the API that you want to trace, and specify `purposes` as `tracing`. By default the token credential returned in the response expires after 1 hour, but you can specify a different value in the payload. For example:

    ```json
    {
        "credentialsExpireAfter": PT1H,
        "apiId": ""/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/apis/{apiId}",
        "purposes": ["tracing"]
    }
    ```

    > [!NOTE]
    > The `apiId` can only be pulled from the full resource ID, not the name displayed in the portal.

    Get apiId:

    
    ```azurecli
    az apim api list --resource-group <resource-group> --service-name <service-name> -o table
    ```
        
    The debug credential is returned in the response, similar to the following:

    ```json
    {
          "token": "aid=api-name&......."
    }
    ```

1. **Add the token value in a request header** - To enable tracing for a request to the API Management gateway, send the token value in an `Apim-Debug-Authorization` header. For example, to trace a call to the Petstore API that you imported in a previous tutorial, you might use a request similar to the following:

    ```bash
    curl -v https://apim-hello-world.azure-api.net/pet/1 HTTP/1.1 \
        -H "Ocp-Apim-Subscription-Key: <subscription-key>" \
        -H "Apim-Debug-Authorization: aid=api-name&......."
    ```

1. **Evaluate the response** - The response can contain one of the following headers depending on the state of the debug token:
    * If the debug token is valid, the response includes an `Apim-Trace-Id` header whose value is the trace ID, similar to the following:

        ```http
        Apim-Trace-Id: 0123456789abcdef....
        ```
        
    * If the debug token is expired, the response includes an `Apim-Debug-Authorization-Expired` header with information about expiration date.
    * If the debug token was obtained for a different API, the response includes an `Apim-Debug-Authorization-WrongAPI` header with an error message.

1. **Retrieve the trace** - Pass the trace ID obtained in the previous step to the gateway's [List trace](/rest/api/apimanagement/gateway/list-trace) API. For example, to retrieve the trace for the managed gateway, use a request similar to the following:

    ```http
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/gateways/managed/listTrace?api-version=2023-05-01-preview
    ```

    In the request body, pass the trace ID obtained in the previous step.

    ```json
    {
        "traceId": "0123456789abcdef...."
    }
    ```
    
    The response body contains the trace data for the previous API request to the gateway. The trace is similar to the trace you can see by tracing a call in the portal's test console.


### Example `.http` file for VS Code REST Client extension

To help automate these steps with the [Visual Studio Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension, you can use the following example `.http` file:

```http
@subscriptionId = // Your subscription ID
@resourceGroup = // Your resource group
@apimName = // Your API Management service name
@clientId = // Client ID from an app registration for authentication
@clientSecret = // Client secret from app registration
@externalHost = // The host name of the App Gateway or the fully qualified gateway URL
@subscriptionKey = // API Management subscription key
@apiEndPoint = // API URL
@requestBody = // Data to send
@tenantId = // Tenant ID
 
POST https://login.microsoftonline.com/{{tenandId}}/oauth2/token
content-type: application/x-www-form-urlencoded
 
grant_type=client_credentials&client_id={{clientId}}&client_secret={{clientSecret}}&resource=https%3A%2F%2Fmanagement.azure.com%2F
 
###
@authToken = {{login.response.body.$.access_token}}
###
# @name listDebugCredentials
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.ApiManagement/service/{{apimName}}/gateways/managed/listDebugCredentials?api-version=2023-05-01-preview
Authorization: Bearer {{authToken}}
Content-Type: application/json
{
    "credentialsExpireAfter": "PT1H",
    "apiId": "/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.ApiManagement/service/{{apimName}}/apis/{{apiId}}",
    "purposes": ["tracing"]
}
 
###
@debugToken = {{listDebugCredentials.response.body.$.token}}
 
###
# @name callApi
curl -k -H "Apim-Debug-Authorization: {{debugToken}}" -H 'Host: {{externalHost}}' -H 'Ocp-Apim-Subscription-Key: {{subscriptionKey}}' -H 'Content-Type: application/json' '{{apiEndPoint}}' -d '{{requestBody}}'
 
###
@traceId = {{callApi.response.headers.Apim-Trace-Id}}
 
###
# @name getTrace
POST https://management.azure.com/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroup}}/providers/Microsoft.ApiManagement/service/{{apimName}}/gateways/managed/listTrace?api-version=2024-06-01-preview
Authorization: Bearer {{authToken}}
Content-Type: application/json
 
{
    "traceId": "{{traceId}}"
}
```

For information about customizing trace information, see the [trace](trace-policy.md) policy.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Trace an example call in the test console
> * Review request processing steps
> * Enable tracing for an API

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Use revisions](api-management-get-started-revise-api.md)
