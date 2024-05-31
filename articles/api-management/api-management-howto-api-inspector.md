---
title: Tutorial - Debug APIs in Azure API Management using request tracing
description: Follow the steps of this tutorial to enable tracing and inspect request processing steps in Azure API Management.
services: api-management
author: dlepow
ms.service: api-management
ms.topic: tutorial
ms.date: 05/05/2024
ms.author: danlep
ms.custom: devdivchpfy22
---

# Tutorial: Debug your APIs using request tracing

[!INCLUDE [api-management-availability-premium-dev-standard-basic-consumption](../../includes/api-management-availability-premium-dev-standard-basic-consumption.md)]

This tutorial describes how to inspect (trace) request processing in Azure API Management. Tracing helps you debug and troubleshoot your API.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Trace an example call in the test console
> * Review request processing steps
> * Enable tracing for an API

:::image type="content" source="media/api-management-howto-api-inspector/api-inspector-002.png" alt-text="Screenshot showing the API inspector." lightbox="media/api-management-howto-api-inspector/api-inspector-002.png":::

[!INCLUDE [api-management-availability-tracing-v2-tiers](../../includes/api-management-availability-tracing-v2-tiers.md)]

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the following tutorial: [Import and publish your first API](import-and-publish.md).


[!INCLUDE [api-management-tracing-alert](../../includes/api-management-tracing-alert.md)]

## Trace a call in the portal

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs**.
1. Select  **Demo Conference API** from your API list.
1. Select the **Test** tab.
1. Select the **GetSpeakers** operation.
1. Optionally check the value for the **Ocp-Apim-Subscription-Key** header used in the request by selecting the "eye" icon.
    > [!TIP]
    > You can override the value of **Ocp-Apim-Subscription-Key** by retrieving a key for another subscription in the portal. Select **Subscriptions**, and open the context menu (**...**) for another subscription. Select **Show/hide keys** and copy one of the keys. You can also regenerate keys if needed. Then, in the test console, select **+ Add header** to add an **Ocp-Apim-Subscription-Key** header with the new key value.

1. Select **Trace**. 


## Review trace information

1. After the call completes, go to the **Trace** tab in the **HTTP response**.
1. Select any of the following links to jump to detailed trace info: **Inbound**, **Backend**, **Outbound**, **On error**.

     :::image type="content" source="media/api-management-howto-api-inspector/response-trace-1.png" alt-text="Review response trace":::

    * **Inbound** - Shows the original request API Management received from the caller and the policies applied to the request. For example, if you added policies in [Tutorial: Transform and protect your API](transform-api.md), they'll appear here.

    * **Backend** - Shows the requests API Management sent to the API backend and the response it received.

    * **Outbound** - Shows the policies applied to the response before sending back to the caller.

    * **On error** - Shows the errors that occurred during the processing of the request and the policies applied to the errors.

    > [!TIP]
    > Each step also shows the elapsed time since the request is received by API Management.


## Enable tracing for an API

You can enable tracing for an API when making requests to API Management using `curl`, a REST client such as Visual Studio Code with the REST Client extension, or a client app. 

Enable tracing by the following steps using calls to the API Management REST API.

> [!NOTE]
> The following steps require API Management REST API version 2023-05-01-preview or later. You must be assigned the Contributor or higher role on the API Management instance to call the REST API.

1. Obtain trace credentials by calling the [List debug credentials](/rest/api/apimanagement/gateway/list-debug-credentials) API. Pass the gateway ID in the URI, or use "managed" for the instance's managed gateway in the cloud. For example, to obtain trace credentials for the managed gateway, use a call similar to the following:

    ```http
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/gateways/managed/listDebugCredentials?api-version=2023-05-01-preview
    ```
    
    In the request body, pass the full resource ID of the API that you want to trace, and specify `purposes` as `tracing`. By default the token credential returned in the response expires after 1 hour, but you can specify a different value in the payload.

    ```json
    {
        "credentialsExpireAfter": PT1H,
        "apiId": "<API resource ID>",
        "purposes: ["tracing"]
    }
    ```
        
    The token credential is returned in the response, similar to the following:

    ```json
    {
          "token": "aid=api-name&p=tracing&ex=......."
    }
    ```

1. To enable tracing for a request to the API Management gateway, send the token value in an `Apim-Debug-Authorization` header. For example, to trace a call to the demo conference API, use a call similar to the following:

    ```bash
    curl -v GET https://apim-hello-world.azure-api.net/conference/speakers HTTP/1.1 -H "Ocp-Apim-Subscription-Key: <subscription-key>" -H "Apim-Debug-Authorization: aid=api-name&p=tracing&ex=......."
    ```
1. Depending on the token, the response contains different headers:
    * If the token is valid, the response includes an `Apim-Trace-Id` header whose value is the trace ID.
    * If the token is expired, the response includes an `Apim-Debug-Authorization-Expired` header with information about expiration date.
    * If the token was obtained for wrong API, the response includes an `Apim-Debug-Authorization-WrongAPI` header with an error message.

1. To retrieve the trace, pass the trace ID obtained in the previous step to the [List trace](/rest/api/apimanagement/gateway/list-trace) API for the gateway. For example, to retrieve the trace for the managed gateway, use a call similar to the following:

    ```http
    POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ApiManagement/service/{serviceName}/gateways/managed/listTrace?api-version=2023-05-01-preview
    ```

    In the request body, pass the trace ID obtained in the previous step.

    ```json
    {
        "traceId": "<trace ID>"
    }
    ```
    
    The response body contains the trace data for the previous API request to the gateway. The trace is similar to the trace you can see by tracing a call in the portal's test console.


For information about customizing trace information, see the [trace](trace-policy.md) policy.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Trace an example call
> * Review request processing steps
> * Enable tracing for an API

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Use revisions](api-management-get-started-revise-api.md)
