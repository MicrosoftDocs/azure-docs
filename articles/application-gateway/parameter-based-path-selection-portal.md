---
title: Route traffic using parameter based path selection in portal - Azure Application Gateway
description: Learn how to use the Azure portal to configure an Azure Application Gateway to choose the backend pool based on the value of a header, part of URL, or query string in the request.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 09/10/2024
ms.author: greglin
ms.custom: mvc
---
# Perform parameter based path selection with Azure Application Gateway - Azure portal

This article describes how to use the Azure portal to configure an [Application Gateway v2 SKU](./application-gateway-autoscaling-zone-redundant.md) instance to perform parameter based path selection by combining the capabilities of URL Rewrite with path-based routing.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

You need to have an Application Gateway v2 SKU instance to complete the steps in this article. URL rewrite and rewriting headers aren't supported in the v1 SKU. If you don't have the v2 SKU, create an [Application Gateway v2 SKU](./tutorial-autoscale-ps.md) instance before you begin.


## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/) with your Azure account.

## Configure parameter based path selection

For this example, you have a shopping website and the product category is passed as query string in the URL, and you want to route the request to backend based on the query string, then:

**Step 1:**  Create a path-map as shown in the following image:

:::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-1.png" alt-text="A screenshot of URL rewrite scenario 1-1.":::

**Step 2 (a):** Create a rewrite set which has 3 rewrite rules: 

* The first rule has a condition that checks the *query_string* variable for *category=shoes* and has an action that rewrites the URL path to /*listing1* and has **Reevaluate path map** enabled

* The second rule has a condition that checks the *query_string* variable for *category=bags* and has an action that rewrites the URL path to /*listing2*  and has **Reevaluate path map** enabled

* The third rule has a condition that checks the *query_string* variable for *category=accessories* and has an action that rewrites the URL path to /*listing3* and has **Reevaluate path map** enabled

    :::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-2.png" alt-text="A screenshot of URL rewrite scenario 1-2.":::

 
**Step 2 (b):** Associate this rewrite set with the default path of the previous path-based rule:

:::image type="content" source="./media/rewrite-http-headers-url/url-scenario1-3.png" alt-text="A screenshot of URL rewrite scenario 1-3.":::

If the user requests *contoso.com/listing?category=any*, then it's matched with the default path since none of the path patterns in the path map (/listing1, /listing2, /listing3) are matched. Since you associated the previous rewrite set with this path, this rewrite set is evaluated. Because the query string doesn't match the condition in any of the 3 rewrite rules in this rewrite set, no rewrite action takes place. Therefore, the request is routed unchanged to the backend associated with the default path (which is *GenericList*).

If the user requests *contoso.com/listing?category=shoes*, then the default path is matched. However, in this case, the condition in the first rule matches. Therefore, the action associated with the condition is executed, which rewrites the URL path to /*listing1*  and reevaluates the path-map. When the path-map is reevaluated, the request matches the path associated with pattern */listing1* and the request is routed to the backend associated with this pattern (ShoesListBackendPool).

> [!NOTE]
> This scenario can be extended to any header or cookie value, URL path, query string or server variables based on the conditions defined and essentially enables you to route requests based on those conditions.

## Next steps

To learn more about how to set up some common use cases, see [common header rewrite scenarios](./rewrite-http-headers-url.md).