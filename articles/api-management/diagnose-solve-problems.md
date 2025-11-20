---
title: Azure API Management Diagnose and Solve Problems
description: Learn how to troubleshoot issues with your API in Azure API Management by using the Diagnose and Solve tool in the Azure portal. 
author: dlepow
ms.service: azure-api-management
ms.topic: overview
ms.date: 10/03/2025
ms.author: danlep
---

# Azure API Management Diagnostics overview

[!INCLUDE [api-management-availability-premium-dev-standard-basic-consumption](../../includes/api-management-availability-premium-dev-standard-basic-consumption.md)]

When you build and manage an API in Azure API Management, you want to be prepared for any issues that might arise, from **404 not found** errors to a **502 bad gateway** error. API Management Diagnostics is an intelligent and interactive experience that helps you troubleshoot your APIs published in API Management with no configuration required. When you run into issues with your published APIs, API Management Diagnostics points out what's wrong, and guides you to the right information to quickly troubleshoot and resolve the issue.

Although this experience is most helpful for issues that occurred with your API within the last 24 hours, all the diagnostic graphs are always available for you to analyze.

## Open API Management Diagnostics

To access API Management Diagnostics, navigate to your API Management service instance in the [Azure portal](https://portal.azure.com). In the sidebar menu, select **Diagnose and solve problems**.

:::image type="content" source="media/diagnose-solve-problems/apim-diagnostic-home.png" alt-text="Screenshot shows how to navigate to diagnostics.":::

## Intelligent search

You can search for issues or problems in the search bar at the top of the page. The search also helps you find the tools to help troubleshoot or resolve your issues. 

:::image type="content" source="media/diagnose-solve-problems/intelligent-search.png" alt-text="screenshot of intelligent search.":::

## Troubleshooting categories

You can troubleshoot issues by category. Common issues that are related to your API performance, gateway, API policies, and service tier can all be analyzed within each category. Each category also provides more specific diagnostics checks. 

:::image type="content" source="media/diagnose-solve-problems/troubleshooting-category.png" alt-text="screenshot of category overview.":::

### Availability and performance

Check your API availability and performance issues under this category. Selecting this category tile shows a few common checks that are recommended. Select each item to dive deep to the specifics of each issue. The check also provides you with a graph showing your API performance and a summary of performance issues. For example, your API service might have had a 5xx error and timeout in the last hour at the backend. 

:::image type="content" source="media/diagnose-solve-problems/category-interactive-search-1.png" alt-text="Screenshot 1 of interactive interface check.":::

:::image type="content" source="media/diagnose-solve-problems/category-interactive-search-2.png" alt-text="Screenshot 2 of Interactive Interface check.":::

### API policies

This category detects errors and notifies you of your policy issues. 

An interactive interface guides you to the data metrics to help you troubleshoot your API policies configuration.

:::image type="content" source="media/diagnose-solve-problems/proxy-policies.png" alt-text="screenshot of API Policies category tile.":::

### Gateway performance 

For gateway requests or responses or any 4xx or 5xx errors on your gateway, use this category to monitor and troubleshoot. Similarly, use the interactive interface to dive deep into the specific area that you want to check for your API gateway performance. 

:::image type="content" source="media/diagnose-solve-problems/gateway-performance-tile.png" alt-text="screenshot of Gateway performance category tile.":::

### Service upgrade

This category checks which service tier (SKU) you're currently using and reminds you to upgrade to avoid any issues that might be related to that tier. The interactive interface helps you go deep with more graphics and a summary check result. 

:::image type="content" source="media/diagnose-solve-problems/service-sku.png" alt-text="screenshot of service upgrade category tile.":::

## Search documentation

In addition to the **Diagnose and solve problems** tools, you can search for troubleshooting documentation related to your  issue. After running the diagnostics on your service, select **Search Documentation** in the interactive interface. 

:::image type="content" source="media/diagnose-solve-problems/search-documentation.png" alt-text="Screenshot showing how to use Search Documentation function.":::

:::image type="content" source="media/diagnose-solve-problems/search-documentation-2.png" alt-text="Screenshot showing the results of Search Documentation.":::

## Related content

* [Monitor API Management](monitor-api-management.md)
* [Diagnostics in Azure App Service](../app-service/overview-diagnostics.md)
* [Azure Kubernetes Service Diagnose and Solve Problems overview](/azure/aks/concepts-diagnostics)
* [Post a question or feedback](https://feedback.azure.com/d365community/forum/e808a70c-ff24-ec11-b6e6-000d3a4f0858) (add "[Diag]" in the title)
