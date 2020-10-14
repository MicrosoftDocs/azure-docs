---
title: Tutorial - Transform and protect your API in Azure API Management | Microsoft Docs
description: In this tutorial, you learn how to protect your API in API Management with transformation and throttling (rate-limiting) policies.

author: vladvino
ms.service: api-management
ms.custom: mvc
ms.topic: tutorial
ms.date: 09/28/2020
ms.author: apimpm
---

# Tutorial: Transform and protect your API

The tutorial shows how to transform your API so it does not reveal info about the private backend. For example, you might want to hide the info about the technology stack that is running on the backend. You might also want to hide original URLs that appear in the body of the API's HTTP response and instead redirect them to the APIM gateway.

This tutorial also shows you how easy it is to add protection for your backend API by configuring a rate limit with Azure API Management. For example, you may want to limit the rate of API calls so the API isn't overused by developers. For more information, see [API Management policies](api-management-policies.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> -   Transform an API to strip response headers
> -   Replace original URLs in the body of the API response with APIM gateway URLs
> -   Protect an API by adding a rate limit policy (throttling)
> -   Test the transformations

:::image type="content" source="media/transform-api/api-management-management-console.png" alt-text="Policies in portal":::

## Prerequisites

-   Learn the [Azure API Management terminology](api-management-terminology.md).
-   Understand the [concept of policies in Azure API Management](api-management-howto-policies.md).
-   Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
-   Also, complete the following tutorial: [Import and publish your first API](import-and-publish.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Transform an API to strip response headers

This section shows how to hide the HTTP headers that you don't want to show to your users. This example shows how to delete the following headers in the HTTP response:

-   **X-Powered-By**
-   **X-AspNet-Version**

### Test the original response

To see the original response:

1. In your API Management service instance, select **APIs**.
1. Select **Demo Conference API** from your API list.
1. Select the **Test** tab, on the top of the screen.
1. Select the **GetSpeakers** operation and select **Send**.

The original response should look similar to the following:

:::image type="content" source="media/transform-api/original-response.png" alt-text="Original API response":::

As you can see, the response includes the **X-AspNet-Version** and **X-Powered-By** headers.

### Set the transformation policy

1. Select **Demo Conference API** > **Design** > **All operations**.
4. In the **Outbound processing** section, select the code editor (**</>**) icon.

   :::image type="content" source="media/transform-api/04-ProtectYourAPI-01-SetPolicy-Outbound.png" alt-text="Navigate to outbound policy" border="false":::

1. Position the cursor inside the **&lt;outbound&gt;** element and select **Show snippets** at the top right corner.
1. In the right window, under **Transformation policies**, select ** Set HTTP header** twice (to insert two policy snippets).

   :::image type="content" source="media/transform-api/transform-api.png" alt-text="Set HTTP header policy":::

1. Modify your **\<outbound>** code to look like this:

   ```
   <set-header name="X-Powered-By" exists-action="delete" />
   <set-header name="X-AspNet-Version" exists-action="delete" />
   ```

   :::image type="content" source="media/transform-api/set-policy.png" alt-text="Set HTTP header":::

1. Select **Save**.

## Replace original URLs in the body of the API response with APIM gateway URLs

This section shows how to hide original URLs that appear in the body of the API's HTTP response and instead redirect them to the APIM gateway.

### Test the original response

To see the original response:

1. Select **Demo Conference API** > **Test**.
1. Select the **GetSpeakers** operation and select **Send**.

    As you can see, the response includes the original backend URLs:

    :::image type="content" source="media/transform-api/original-response2.png" alt-text="Original URLs in response":::


### Set the transformation policy

1.  Select **Demo Conference API** > **All operations** > **Design**.
1.  In the **Outbound processing** section, select the code editor (**</>**) icon.
1.  Position the cursor inside the **&lt;outbound&gt;** element and select **Show snippets** at the top right corner.
1.  In the right window, under **Transformation policies**, select **Mask URLs in content**. 
1.  Select **Save**.

## Protect an API by adding rate limit policy (throttling)

This section shows how to add protection for your backend API by configuring rate limits. For example, you may want to limit the rate of API calls so that the API isn't overused by developers. In this example, the limit is set to 3 calls per 15 seconds for each subscription ID. After 15 seconds, a developer can retry calling the API.

1.  Select **Demo Conference API** > **All operations** > **Design**.
1.  In the **Inbound processing** section, select the code editor (**</>**) icon.
1.  Position the cursor inside the **&lt;inbound&gt;** element.

    :::image type="content" source="media/transform-api/04-ProtectYourAPI-01-SetPolicy-Inbound.png" alt-text="Set inbound policy" border="false":::

1.  In the right window, under **Access restriction policies**, select **+ Limit call rate per key**.
1.  Modify your **rate-limit-by-key** code (in the **\<inbound\>** element) to the following code:

    ```
    <rate-limit-by-key calls="3" renewal-period="15" counter-key="@(context.Subscription.Id)" />
    ```

## Test the transformations

At this point, if you look at the code in the code editor, your policies look like this:

   ```
   <policies>
      <inbound>
        <rate-limit-by-key calls="3" renewal-period="15" counter-key="@(context.Subscription.Id)" />
        <base />
      </inbound>
      <backend>
        <base />
      </backend>
      <outbound>
        <set-header name="X-Powered-By" exists-action="delete" />
        <set-header name="X-AspNet-Version" exists-action="delete" />
        <redirect-content-urls />
        <base />
      </outbound>
      <on-error>
        <base />
      </on-error>
   </policies>
   ```

The rest of this section tests policy transformations that you set in this article.

### Test the stripped response headers

1. Select **Demo Conference API** > **Test**.
1. Select the **GetSpeakers** operation and select **Send**.

    As you can see, the headers have been stripped:

    :::image type="content" source="media/transform-api/final-response1.png" alt-text="Stripped response headers":::

### Test the replaced URL

1. Select **Demo Conference API** > **Test**.
1. Select the **GetSpeakers** operation and select **Send**.

    As you can see, the URL has been replaced.

    :::image type="content" source="media/transform-api/final-response2.png" alt-text="Replaced URL":::

### Test the rate limit (throttling)

1. Select **Demo Conference API** > **Test**.
1. Select the **GetSpeakers** operation. Select **Send** three times in a row.

    After sending the request 3 times, you get the **429 Too many requests** response.

    :::image type="content" source="media/transform-api/test-throttling.png" alt-text="Too many requests":::

1. Wait 15 seconds or so and select **Send** again. This time you should get a **200 OK** response.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> -   Transform an API to strip response headers
> -   Replace original URLs in the body of the API response with APIM gateway URLs
> -   Protect an API by adding rate limit policy (throttling)
> -   Test the transformations

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Monitor your API](api-management-howto-use-azure-monitor.md)
