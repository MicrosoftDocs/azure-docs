---
title: Tutorial - Debug APIs in Azure API Management using request tracing
description: Follow the steps of this tutorial to enable tracing and inspect request processing steps in Azure API Management.
services: api-management
documentationcenter: ''
author: dlepow
editor: ''
ms.service: api-management
ms.topic: tutorial
ms.date: 08/08/2022
ms.author: danlep
ms.custom: devdivchpfy22
---

# Tutorial: Debug your APIs using request tracing

This tutorial describes how to inspect (trace) request processing in Azure API Management. Tracing helps you debug and troubleshoot your API.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Trace an example call
> * Review request processing steps

:::image type="content" source="media/api-management-howto-api-inspector/api-inspector-002.png" alt-text="Screenshot showing the API inspector." lightbox="media/api-management-howto-api-inspector/api-inspector-002.png":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Verify allow tracing setting

To trace request processing, you must enable the **Allow tracing** setting for the subscription used to debug your API. To check in the portal:

1. Navigate to your API Management instance and select **Subscriptions** to review the settings.

   :::image type="content" source="media/api-management-howto-api-inspector/allow-tracing-1.png" alt-text="Screenshot showing how to allow tracing for subscription." lightbox="media/api-management-howto-api-inspector/allow-tracing-1.png":::
1. If tracing isn't enabled for the subscription you're using, select the subscription and enable **Allow tracing**.

[!INCLUDE [api-management-tracing-alert](../../includes/api-management-tracing-alert.md)]

## Trace a call

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs**.
1. Select  **Demo Conference API** from your API list.
1. Select the **Test** tab.
1. Select the **GetSpeakers** operation.
1. Optionally check the value for the **Ocp-Apim-Subscription-Key** header used in the request by selecting the "eye" icon.
    > [!TIP]
    > You can override the value of **Ocp-Apim-Subscription-Key** by retrieving a key for another subscription in the portal. Select **Subscriptions**, and open the context menu (**...**) for another subscription. Select **Show/hide keys** and copy one of the keys. You can also regenerate keys if needed. Then, in the test console, select **+ Add header** to add an **Ocp-Apim-Subscription-Key** header with the new key value.

1. Select **Trace**. 

    * If your subscription doesn't already allow tracing, you're prompted to enable it if you want to trace the call. 
    * You can also choose to send the request without tracing.

      :::image type="content" source="media/api-management-howto-api-inspector/06-debug-your-apis-01-trace-call-1.png" alt-text="Screenshot showing configure API tracing." lightbox="media/api-management-howto-api-inspector/06-debug-your-apis-01-trace-call-1.png":::

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

1. On the **Message** tab, the **ocp-apim-trace-location** header shows the location of the trace data stored in Azure blob storage. If needed, go to this location to retrieve the trace. Trace data can be accessed for up to 24 hours.

     :::image type="content" source="media/api-management-howto-api-inspector/response-message-1.png" alt-text="Trace location in Azure Storage":::

## Enable tracing using Ocp-Apim-Trace header

When making requests to API Management using `curl`, a REST client such as Postman, or a client app, enable tracing by adding the following request headers:

* **Ocp-Apim-Trace** - set value to `true`
* **Ocp-Apim-Subscription-Key** - set value to the key for a tracing-enabled subscription that allows access to the API

The response includes the **Ocp-Apim-Trace-Location** header, with a URL to the location of the trace data in Azure blob storage.

For information about customizing trace information, see the [trace](trace-policy.md) policy.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Trace an example call
> * Review request processing steps

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Use revisions](api-management-get-started-revise-api.md)
