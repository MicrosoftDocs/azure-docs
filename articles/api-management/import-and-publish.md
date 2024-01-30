---
title: Tutorial - Import and publish your first API in Azure API Management
description: In this tutorial, you import an OpenAPI specification API into Azure API Management, and then test your API in the Azure portal.

author: dlepow
ms.service: api-management
ms.custom: mvc, devdivchpfy22, engagement-fy23
ms.topic: tutorial
ms.date: 06/15/2023
ms.author: danlep

---
# Tutorial: Import and publish your first API

This tutorial shows how to import an OpenAPI specification backend API in JSON format into Azure API Management. Microsoft provides the backend API used in this example, and hosts it on Azure at `https://conferenceapi.azurewebsites.net`.

Once you import the backend API into API Management, your API Management API becomes a façade for the backend API. You can customize the façade to your needs in API Management without touching the backend API. For more information, see [Transform and protect your API](transform-api.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Import an API into API Management
> * Test the API in the Azure portal

After import, you can manage the API in the Azure portal.

:::image type="content" source="media/import-and-publish/created-api.png" alt-text="Screenshot of a new API in API Management in the portal.":::

## Prerequisites

- Understand [Azure API Management terminology](api-management-terminology.md).
- [Create an Azure API Management instance](get-started-create-service-instance.md).

[!INCLUDE [api-management-navigate-to-instance.md](../../includes/api-management-navigate-to-instance.md)]

## Import and publish a backend API

This section shows how to import and publish an OpenAPI specification backend API.

1. In the left navigation of your API Management instance, select **APIs**.
1. Select the **OpenAPI** tile.
1. In the **Create from OpenAPI specification** window, select **Full**.
1. Enter the values from the following table.

   You can set API values during creation or later by going to the **Settings** tab.

   :::image type="content" source="media/import-and-publish/open-api-specs.png" alt-text="Screenshot of creating an API in the portal.":::


   |Setting|Value|Description|
   |-------|-----|-----------|
   |**OpenAPI specification**|*https:\//conferenceapi.azurewebsites.net?format=json*|Specifies the backend service implementing the API and the operations that the API supports. <br/><br/>The backend service URL appears later as the **Web service URL** on the API's **Settings** page.<br/><br/>After import, you can add, edit, rename, or delete operations in the specification.  |
   | **Include query parameters in operation templates** | Selected (default) | Specifies whether to import required query parameters in the specification as template parameters in API Management.  |
   |**Display name**|After you enter the OpenAPI specification URL, API Management fills out this field based on the JSON.|The name displayed in the [developer portal](api-management-howto-developer-portal.md).|
   |**Name**|After you enter the OpenAPI specification URL, API Management fills out this field based on the JSON.|A unique name for the API.|
   |**Description**|After you enter the OpenAPI specification URL, API Management fills out this field based on the JSON.|An optional description of the API.|
   |**URL scheme**|**HTTPS**|Which protocols can access the API.|
   |**API URL suffix**|*conference*|The suffix appended to the base URL for the API Management service. API Management distinguishes APIs by their suffix, so the suffix must be unique for every API for a given publisher.|
   |**Tags**| |Tags for organizing APIs for searching, grouping, or filtering.|
   |**Products**|**Unlimited**|Association of one or more APIs. Each API Management instance comes with two sample products: **Starter** and **Unlimited**. You publish an API by associating the API with a product, **Unlimited** in this example.<br/><br/> You can include several APIs in a product and offer product [subscriptions](api-management-subscriptions.md) to developers through the developer portal. To add this API to another product, type or select the product name. Repeat this step to add the API to multiple products. You can also add APIs to products later from the **Settings** page.<br/><br/>  For more information about products, see [Create and publish a product](api-management-howto-add-products.md).|
   |**Gateways**|**Managed**|API gateway(s) that expose the API. This field is available only in **Developer** and **Premium** tier services.<br/><br/>**Managed** indicates the gateway built into the API Management service and hosted by Microsoft in Azure. [Self-hosted gateways](self-hosted-gateway-overview.md) are available only in the Premium and Developer service tiers. You can deploy them on-premises or in other clouds.<br/><br/> If no gateways are selected, the API won't be available and your API requests won't succeed.|
   |**Version this API?**|Select or deselect|For more information, see [Publish multiple versions of your API](api-management-get-started-publish-versions.md).|

   > [!NOTE]
   > To publish the API to API consumers, you must associate it with a product.

1. Select **Create** to create your API.

If you have problems importing an API definition, see the [list of known issues and restrictions](api-management-api-import-restrictions.md).

## Test the new API in the Azure portal

You can call API operations directly from the Azure portal, which provides a convenient way to view and test the operations. In the portal's test console, by default, APIs are called by using a key from the built-in all-access subscription. You can also test API calls by using a subscription key scoped to a product.

1. In the left navigation of your API Management instance, select **APIs** > **Demo Conference API**.
1. Select the **Test** tab, and then select **GetSpeakers**. The page shows **Query parameters** and **Headers**, if any. 

    In the **HTTP request** section, the **Ocp-Apim-Subscription-Key** header is filled in automatically for you, which you can see if you select the "eye" icon.
1. Select **Send**.

   :::image type="content" source="media/import-and-publish/test-new-api.png" alt-text="Screenshot of testing an API in Azure portal." lightbox="media/import-and-publish/test-new-api.png":::

   The backend responds with **200 OK** and some data.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Import your first API
> * Test the API in the Azure portal

Advance to the next tutorial to learn how to create and publish a product:

> [!div class="nextstepaction"]
> [Create and publish a product](api-management-howto-add-products.md)