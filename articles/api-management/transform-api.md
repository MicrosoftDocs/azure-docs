---
title: Tutorial - Transform and protect your API in Azure API Management
description: In this tutorial, you learn how to protect your API in API Management with transformation and throttling (rate-limiting) policies.

author: dlepow    
ms.service: azure-api-management
ms.custom: mvc, devdivchpfy22
ms.topic: tutorial
ms.date: 11/25/2024
ms.author: danlep
---

# Tutorial: Transform and protect your API

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

In this tutorial, you learn about configuring [policies](api-management-howto-policies.md) to protect or transform your API. Policies are a collection of statements that are run sequentially on the request or response of an API that modify the API's behavior. 

For example, you might want to set a custom response header. Or, protect your backend API by configuring a rate limit policy, so that the API isn't overused by developers. These examples are a simple introduction to API Management policies. For more policy options, see [API Management policies](api-management-policies.md).

> [!NOTE]
> By default, API Management configures a global [`forward-request`](forward-request-policy.md) policy. The `forward-request` policy is needed for the gateway to complete a request to a backend service.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Transform an API to set a custom response header
> * Protect an API by adding a rate limit policy (throttling)
> * Test the transformations

:::image type="content" source="media/transform-api/api-management-console-new.png" lightbox="media/transform-api/api-management-console-new.png" alt-text="Screenshot of API Management policies in the portal.":::

## Prerequisites

* Learn the [Azure API Management terminology](api-management-terminology.md).
* Understand the [concept of policies in Azure API Management](api-management-howto-policies.md).
* Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md). For this tutorial, we recommend that you use one of the classic or v2 tiers, for example, the Developer tier or the Basic v2 tier. The Consumption tier doesn't support all policies used in this tutorial.
* Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Test the original response

To see the original response:

1. In your API Management service instance, select **APIs**.
1. Select **Swagger Petstore** from your API list.
1. Select the **Test** tab, on the top of the screen.
1. Select the **GET Finds pets by status** operation, and optionally select a different value of the *status* **Query parameter**. Select **Send**.

The original API response should look similar to the following response:

:::image type="content" source="media/transform-api/test-original-response-new.png" lightbox="media/transform-api/test-original-response-new.png" alt-text="Screenshot of the original API response in the portal.":::

## Transform an API to add a custom response header

API Management includes several transformation policies that you can use to modify request or response payloads, headers, or status codes. In this example, you set a custom response header in the API response.

### Set the transformation policy

This section shows you how to configure a custom response header using the `set-header` policy. Here you use a form-based policy editor that simplifies the policy configuration.

1. Select **Swagger Petstore** > **Design** > **All operations**.
1. In the **Outbound processing** section, select **+ Add policy**.

   :::image type="content" source="media/transform-api/outbound-policy-small.png" alt-text="Screenshot of navigating to outbound policy in the portal." lightbox="media/transform-api/outbound-policy.png":::

1. In the **Add outbound policy** window, select **Set headers**.

   :::image type="content" source="media/transform-api/set-http-header.png" alt-text="Screenshot of configuring the Set headers policy in the portal.":::

1. To configure the Set headers policy, do the following:
    1. Under **Name**, enter **Custom**.
    1. Under **Value**, select **+ Add value**. Enter *"My custom value"*.
    1. Select **Save**.
  
1. After configuration, a **set-header** policy element appears in the **Outbound processing** section.

   :::image type="content" source="media/transform-api/set-policy.png" alt-text="Screenshot of the Set headers outbound policies in the portal.":::


## Protect an API by adding rate limit policy (throttling)

This section shows how to add protection to your backend API by configuring rate limits, so that the API isn't overused by developers. This example shows how to configure the `rate-limit-by-key` policy using the code editor. In this example, the limit is set to three calls per 15 seconds. After 15 seconds, a developer can retry calling the API.

> [!NOTE]
> This policy isn't supported in the Consumption tier.

1. Select **Swagger Petstore** > **Design** > **All operations**.
1. In the **Inbound processing** section, select the code editor (**</>**) icon.

   :::image type="content" source="media/transform-api/inbound-policy-code.png" lightbox="media/transform-api/inbound-policy-code.png" alt-text="Screenshot of navigating to inbound policy code editor in the portal.":::

1. Position the cursor inside the **`<inbound>`** element on a blank line. Then, select **Show snippets** at the top-right corner of the screen.

    :::image type="content" source="media/transform-api/show-snippets-2.png" alt-text="Screenshot of selecting show snippets in inbound policy editor in the portal.":::

1. In the right window, under **Access restriction policies**, select **Limit call rate per key**. 

    The **`<rate-limit-by-key />`** element is added at the cursor. 

   :::image type="content" source="media/transform-api/limit-call-rate-per-key.png" alt-text="Screenshot of inserting limit call rate per key policy in the portal.":::

1. Modify your **`<rate-limit-by-key />`** code in the  **`<inbound>`** element to the following code. Then select **Save**.

    ```xml
    <rate-limit-by-key calls="3" renewal-period="15" counter-key="@(context.Subscription.Id)" />
    ```


## Test the transformations

At this point, if you look at the code in the code editor, your policies look like the following code:

   ```xml
   <policies>
        <inbound>
            <rate-limit calls="3" renewal-period="15" counter-key="@(context.Subscription.Id)" />
            <base />
        </inbound>
        <outbound>
            <set-header name="Custom" exists-action="override">
                <value>"My custom value"</value>
              </set-header>
            <base />
        </outbound>
        <on-error>
            <base />
        </on-error>
    </policies>
   ```

The rest of this section tests policy transformations that you set in this article.

### Test the custom response header

1. Select **Swagger Petstore** > **Test**.
1. Select the **GET Finds pets by status** operation, and optionally select a different value of the *status* **Query parameter**. Select **Send**.

    As you can see, the custom response header is added:

    :::image type="content" source="media/transform-api/custom-response-header.png" alt-text="Screenshot showing custom response header in the portal.":::


### Test the rate limit (throttling)

1. Select **Swagger Petstore** > **Test**.
1. Select the **GET Finds Pets by Status** operation. Select **Send** several times in a row.

    After sending too many requests in the configured period, you get the **429 Too Many Requests** response.

    :::image type="content" source="media/transform-api/test-throttling-new.png" alt-text="Screenshot showing Too Many Requests in the response in the portal.":::

1. Wait for 15 seconds or more and then select **Send** again. This time you should get a **200 OK** response.

## Summary

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Transform an API to set a custom response header
> * Protect an API by adding a rate limit policy (throttling)
> * Test the transformations

## Next steps

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Monitor your API](api-management-howto-use-azure-monitor.md)
