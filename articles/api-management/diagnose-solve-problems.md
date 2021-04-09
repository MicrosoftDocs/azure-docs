---
title: Azure API Management Diagnose and solve problems
description: Learn how to troubleshoot issues with your API in Azure API Management with the Diagnose and Solve tool in the Azure portal. 
author: rzhang628
ms.service: api-management
ms.topic: article
ms.date: 02/05/2021
ms.author: rongzhang
---

# Azure API Management Diagnostics overview

When you build and manage an API in Azure API Management, you want to be prepared for any issues that may arise, from 404 not found errors to 502 bad gateway error. API Management Diagnostics is an intelligent and interactive experience to help you troubleshoot your API Management service with no configuration required. When you run into issues with your published APIs, API Management Diagnostics points out what’s wrong, and guides you to the right information to quickly troubleshoot and resolve the issue.

## Open API Management Diagnostics

To access API Management Diagnostics, navigate to your API Management service instance in the [Azure portal](https://portal.azure.com). In the left navigation, select **Diagnose and solve problems**.

:::image type="content" source="media/diagnose-solve-problems/apim-diagnostic-home.png" alt-text="Screenshot shows how to navigate to diagnostics.":::



## Intelligent search

You can search your issues or problems in the search bar on the top of the page. The search also helps you find the tools that may help to troubleshoot or resolve your issues. 

:::image type="content" source="media/diagnose-solve-problems/intelligent-search.png" alt-text="screenshot of intelligent search.":::


## Troubleshooting categories

You can troubleshoot issues under categories. Common issues that are related to your API performance, gateway, API policies, and service tier can all be analyzed within each category. Each category also provides more specific diagnostics checks. 

:::image type="content" source="media/diagnose-solve-problems/troubleshooting-category.png" alt-text="screenshot of category overview.":::


### Availability and performance

Check your API availability and performance issues under this category. After selecting this category tile, you will see an overview of your API Management instance's availability. You can click on any of the cards to dive deep to the specifics of each issue. The check will also provide you multiple graphs, including one that gives you the ability to compare the responses on the gateway vs the backend. 

:::image type="content" source="media/diagnose-solve-problems/category-interactive-search-1.png" alt-text="Screenshot 1 of interactive interface check.":::



:::image type="content" source="media/diagnose-solve-problems/category-interactive-search-2.png" alt-text="Screenshot 2 of Interactive Interface check.":::

### API policies

This category detects errors and show you solutions for policy issues. 

A similar interactive interface guides you to the data metrics to help you troubleshoot your API policies configuration.

:::image type="content" source="media/diagnose-solve-problems/proxy-policies.png" alt-text="screenshot of API Policies category tile.":::

### Gateway performance 

For gateway requests or responses or any 4xx or 5xx errors on your gateway, use this category to diagnose and troubleshoot. Similarly, leverage the interactive interface to dive deep on the specific area that you want to check for your API gateway performance. 

:::image type="content" source="media/diagnose-solve-problems/gateway-performance-tile.png" alt-text="screenshot of Gateway performance category tile.":::

### Service upgrade

This category checks which service tier (SKU) you are currently using and reminds you to upgrade to avoid any issues that may be related to that tier. The same interactive interface helps you go deep with more graphics and a summary check result. 

:::image type="content" source="media/diagnose-solve-problems/service-sku.png" alt-text="screenshot of service upgrade category tile.":::

## Search documentation

In addition to the diagnostic tools, you can search for documentation related to your issue. Towards the end of the diagnostics, you'll find an option to describe your problem so we can recommend relevant docs related to your issue. 

 :::image type="content" source="media/diagnose-solve-problems/search-documentation.png" alt-text="screenshot 1 of how to use Search Documentation function.":::


 :::image type="content" source="media/diagnose-solve-problems/search-documentation-2.png" alt-text="screenshot 2 of how to use Search Documentation.":::


## Next steps

* Also use [API analytics](howto-use-analytics.md) to analyze the usage and performance of the APIs. 
* Want to troubleshoot Web Apps issues with Diagnostics? Read it [here](../app-service/overview-diagnostics.md)
* Leverage Diagnostics to check Azure Kubernetes Services issues. See [Diagnostics on AKS](../aks/concepts-diagnostics.md)
* Post your questions or feedback at [UserVoice](https://feedback.azure.com/forums/248703-api-management) by adding "[Diag]" in the title.
