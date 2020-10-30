---
title: Tutorial - Debug APIs in Azure API Management using request tracing
description: Follow the steps of this tutorial to enable tracing and inspect request processing steps in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
editor: ''

ms.service: api-management
ms.topic: tutorial
ms.date: 10/30/2020
ms.author: apimpm

---

# Tutorial: Debug your APIs using request tracing

This tutorial describes how to inspect (trace) request processing in Azure API Management to help you debug and troubleshoot your API. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Trace an example call
> * Review request processing steps

:::image type="content" source="media/api-management-howto-api-inspector/api-inspector001.png" alt-text="API inspector":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the following tutorial: [Import and publish your first API](import-and-publish.md).

## Verify allow tracing setting 

The **Allow tracing** setting for the subscription used for your API must be enabled. If you're using the built-in all-access subscription, it's enabled by default. To verify in the portal, navigate to your API Management instance and select **Subscriptions**.

   :::image type="content" source="media/api-management-howto-api-inspector/allow-tracing.png" alt-text="Allow tracing for subscription":::

## Trace a call

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs**.
1. Select  **Demo Conference API** from your API list.
1. Select the **Test** tab.
1. Select the **GetSpeakers** operation.
1. Confirm that the HTTP request header includes **Ocp-Admin-Trace: True** and a valid value for **Ocp-Admin-Subscription-Key**. If it isn't, select **+ Add Header** to add the header.
1. Select **Send** to make an API call.

  :::image type="content" source="media/api-management-howto-api-inspector/06-debug-your-apis-01-trace-call.png" alt-text="Configure API tracing":::

> [!TIP]
> If **Ocp-Apim-Subscription-Key** isn't automatically populated in the HTTP request, you can retrieve it in the portal. Select **Subscriptions**, and open the context menu (**...**) for your suscription. Select **Show/hide keys**. You can also regenerate keys if needed. Then, add a key to the header.

## Review trace information

1. After the call completes, go to the **Trace** tab in the **HTTP Response**.
1. Select any of the following links to jump to detailed trace info: **Inbound**, **Backend**, **Outbound**.

     :::image type="content" source="media/api-management-howto-api-inspector/response-trace.png" alt-text="Review response trace":::

    * **Inbound** - Shows the original request API Management received from the caller and the policies applied to the request. For example, if you added policies in [Tutorial: Transform and protect your API](transform-api.md), they will appear here.

    * **Backend** - Shows the requests API Management sent to the API backend and the response it received.

    * **Outbound** - Shows the policies applied to the response before sending back to the caller.

    > [!TIP]
    > Each step also shows the elapsed time since the request is received by API Management.

1. On the **Message** tab, the **ocp-apim-trace-location** header shows the location of the trace data stored in Azure blob storage. If needed, go to this location to retrieve the trace.

     :::image type="content" source="media/api-management-howto-api-inspector/response-message.png" alt-text="Trace location in Azure Storage":::
## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Trace an example call
> * Review request processing steps

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Use revisions](api-management-get-started-revise-api.md)
