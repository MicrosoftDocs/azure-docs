---
title: Tutrial - Debug APIs n Azure API Management using request tracing
description: Follow the steps of this tutorial to enable tracing and inspect request processing steps in Azure API Management.
services: api-management
documentationcenter: ''
author: vladvino
editor: ''

ms.service: api-management
ms.topic: tutorial
ms.date: 10/14/2020
ms.author: apimpm

---

# Debug your APIs using request tracing

This tutorial describes how to inspect request processing in Azure API Management to help you with debugging and troubleshooting your API. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Trace a call

:::image type="content" source="media/api-management-howto-api-inspector/api-inspector001.png" alt-text="API inspector":::

## Prerequisites

+ Learn the [Azure API Management terminology](api-management-terminology.md).
+ Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
+ Complete the following tutorial: [Import and publish your first API](import-and-publish.md).
* The **Allow tracing** setting for the subscription key used for your API must be enabled. To verify in the portal, navigate to your API Management instance and select **Subscriptions**.

   :::image type="content" source="media/api-management-howto-api-inspector/allowtracing.png" alt-text="Allow tracing for subscription":::

## Trace a call

1. Sign in to the [Azure portal](https://portal.azure.com), and navigate to your API Management instance.
1. Select **APIs**.
1. Select  **Demo Conference API** from your API list.
1. Select the **Test** tab.
1. Select the **GetSpeakers** operation.
1. Add an HTTP header:
    1. Under **Headers**, select **+ Add header**.
    1. In **Name**, enter or select **Ocp-Admin-Trace**.
    1. In **Value**, enter **true**.
1. Select **Send** to make an API call.

  :::image type="content" source="media/api-management-howto-api-inspector/06-debug-your-apis-01-trace-call.png" alt-text="Configure API tracing":::

> [!TIP]
> If **Ocp-Apim-Subscription-Key** isn't automatically populated in the HTTP request, you can retrieve it by going to the Developer Portal and expose the keys on the profile page. Then, add it to the header.
>   :::image type="content" source="media/api-management-howto-api-inspector/request-header.png" alt-text="Request header":::

## Review trace information

1. After the call completes, go to the **Trace** tab in the **HTTP Response**.
1.  Select any of the following links to jump to detailed trace info: **Inbound**, **Backend**, **Outbound**.

    * In the **Inbound** section, you see the original request API Management received from the caller and the policies applied to the request. including the rate-limit and set-header policies we added in step 2.

    In the **backend** section, you see the requests API Management sent to the API backend and the response it received.

    In the **outbound** section, you see all the policies applied to the response before sending back to the caller.

    > [!TIP]
    > Each step also shows the elapsed time since the request is received by API Management.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Trace a call

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Use revisions](api-management-get-started-revise-api.md)
