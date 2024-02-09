---
title: Configure caching
titleSuffix: Azure Front Door
description: This article shows you how to configure caching on Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: how-to
ms.date: 01/16/2023
ms.author: jodowns
---

# Configure caching on Azure Front Door

This article shows you how to configure caching on Azure Front Door. To learn more about caching, see [Caching with Azure Front Door](front-door-caching.md).

## Prerequisites

Before you can create an Azure Front Door endpoint with Front Door manager, you must have an Azure Front Door profile created. The profile must have at least one or more endpoints. To organize your Azure Front Door endpoints by internet domains, web applications, or other criteria, you can use multiple profiles. 

To create an Azure Front Door profile and endpoint, see [Create an Azure Front Door profile](create-front-door-portal.md).

Caching can significantly decrease latency and reduce the load on origin servers. However, not all types of traffic can benefit from caching. Static assets such as images, CSS, and JavaScript files are ideal for caching. While dynamic assets, such as authenticated API endpoints, shouldn't be cached to prevent the leakage of personal information. It's recommended to have separate routes for static and dynamic assets, with caching disabled for the latter. 

> [!WARNING]
> Before you enable caching, thoroughly review the caching documentation, and test all possible scenarios before enabling caching. As noted previously, with misconfiguration you can inadvertently cache user specific data that can be shared by multiple users resulting privacy incidents.

## Configure caching by using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true) and navigate to your Azure Front Door profile.

1. Select **Front Door manager** and then select your route.
   
    :::image type="content" source="./media/how-to-configure-caching/select-route.png" alt-text="Screenshot of endpoint landing page.":::

1. Select **Enable caching**.

1. Specify the query string caching behavior. For more information, see [Caching with Azure Front Door](front-door-caching.md#query-string-behavior).

1. Optionally, select **Enable compression** for Front Door to compress responses to the client.

1. Select **Update**.

    :::image type="content" source="./media/how-to-configure-caching/update-route.png" alt-text="Screenshot of route with caching configured.":::

## Next steps

* Learn about the use of [origins and origin groups](origin.md) in an Azure Front Door configuration.
* Learn about [rules match conditions](rules-match-conditions.md) in an Azure Front Door rule set.
* Learn more about [policy settings](../web-application-firewall/afds/waf-front-door-policy-settings.md) for WAF with Azure Front Door.
* Learn how to create [custom rules](../web-application-firewall/afds/waf-front-door-custom-rules.md) to protect your Azure Front Door profile.
