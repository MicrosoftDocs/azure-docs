---
title: Route traffic using parameter-based path selection in portal - Azure Application Gateway
description: Use the Azure portal to configure an application gateway to choose the backend pool based on the value of a header, part of a URL, or a query string in the request.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 09/10/2024
ms.author: greglin
ms.custom: mvc
---
# Perform parameter-based path selection with Azure Application Gateway - Azure portal

This article describes how to use the Azure portal to configure an [Azure Application Gateway v2 SKU](./application-gateway-autoscaling-zone-redundant.md) instance to perform parameter-based path selection by combining the capabilities of URL Rewrite with path-based routing.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

You need to have an Application Gateway v2 SKU instance to finish the steps in this article. URL Rewrite and rewriting headers aren't supported in the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](./tutorial-autoscale-ps.md) instance before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Configure parameter-based path selection

For this example, you have a shopping website. The product category is passed as a query string in the URL. To route the request to the backend based on the query string, follow these steps.

1. Create a path map.

   :::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-1.png" alt-text="Screenshot that shows a URL Rewrite scenario 1-1.":::

1. Create a rewrite set that has three rewrite rules:

   * The first rule has a condition that checks the `query_string` variable for `category=shoes`. An action rewrites the URL path to `/listing1`. **Reevaluate path map** is enabled.
   * The second rule has a condition that checks the `query_string` variable for `category=bags`. An action rewrites the URL path to `/listing2`. **Reevaluate path map** is enabled.
   * The third rule has a condition that checks the `query_string` variable for `category=accessories`. An action rewrites the URL path to `/listing3`. **Reevaluate path map** is enabled.

     :::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-2.png" alt-text="Screenshot that shows the URL Rewrite scenario 1-2.":::

1. Associate this rewrite set with the default path of the previous path-based rule.

   :::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-3.png" alt-text="Screenshot that shows the URL rewrite scenario 1-3.":::

If the user requests `contoso.com/listing?category=any`, it's matched with the default path because the path patterns in the path map (`/listing1`, /`listing2`, /`listing3`) don't match. Because you associated the previous rewrite set with this path, this rewrite set is evaluated. The query string doesn't match the condition in any of the three rewrite rules in this rewrite set, so no rewrite action takes place. The request is routed unchanged to the backend associated with the default path (which is `GenericList`).

If the user requests `contoso.com/listing?category=shoes`, the default path is matched. In this case, the condition in the first rule matches. The action associated with the condition is executed, which rewrites the URL path to `/listing1` and reevaluates the path map. When the path map is reevaluated, the request matches the path associated with the pattern `/listing1`. The request is routed to the backend associated with this pattern (`ShoesListBackendPool`).

> [!NOTE]
> You can extend this scenario to any header or cookie value, URL path, query string, or server variables based on the conditions defined. You can then route requests based on those conditions.

## Related content

To learn more about how to set up some common use cases, see [Common header rewrite scenarios](./rewrite-http-headers-url.md).