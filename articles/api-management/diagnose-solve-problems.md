---
title: Diagnose and solve problems
description: Learn how to troubleshoot issues with your API in Azure API Management with the Diagnostics and solve tool in the Azure portal. 
author: rzhang628
ms.service: api-management
ms.topic: article
ms.date: 02/05/2021
ms.author: rongzhang
---

# Azure API Management Diagnostics overview

When you built and managed an API in Azure API Management, you want to be prepared for any issues that may arise, from 404 not found errors to 502 bad gateway error. API Management Diagnostics is an intelligent and interactive experience to help you troubleshoot your API published in APIM with no configuration required. When you do run into issues with your published APIs, API Management Diagnostics points out what’s wrong, and guides you to the right information to quickly troubleshoot and resolve the issue.

Although this experience is most helpful when you re having issues with your API within the last 24 hours, all the diagnostic graphs are always available for you to analyze.

## Open API Management Diagnostics

To access API Management Diagnostics, navigate to your API Management service instance in the [Azure portal](https://portal.azure.com). In the left navigation, select **Diagnose and solve problems**.

:::image type="content" source="media/diagnose-solve-problems/apimdisgnostichome.png" alt-text="Navigate to Diagnostics.":::



## Intelligent search

You can search your issues or problems in the search bar on the top of the page. The search also helps you find the tools that may help to troubleshoot or resolve your issues. 

:::image type="content" source="media/diagnose-solve-problems/intelligentsearch.png" alt-text="Intelligent search.":::


## Troubleshooting categories

You can troubleshoot issues under categories. Common issues that are related to your API performance, gateway, API policies, and service tier can all be analyzed within each category. Each category also provides more specific diagnostics checks. 

:::image type="content" source="media/diagnose-solve-problems/troubleshootingcategory.png" alt-text="Category View.":::


### Availability and Performance

Check your API availability and performance issues under this category. After selecting this category tile, you will see a few common checks are recommended in an interactive interface. Click each check to dive deep to the specifics of each issue. The check will also provide you a graph showing your API performance and a summary of performance issues. For example, your API service may have had a 5xx error and timeout in the last hour at the backend. 

:::image type="content" source="media/diagnose-solve-problems/categoryinteractivesearch1.png" alt-text="Interactive Interface check 1.":::



:::image type="content" source="media/diagnose-solve-problems/categoryinteractivesearch2.png" alt-text="Interactive Interface check 2.":::

### API Policies

This category detects errors and notifies you of your policy issues. 

A similar interactive interface guides you to the data metrics to help you troubleshoot your API policies configuration.

:::image type="content" source="media/diagnose-solve-problems/proxypolicies.png" alt-text="API Policies .":::

### Gateway Performance 

For gateway requests or responses or any 4xx or 5xx errors on your gateway, use this category to monitor and troubleshoot. Similarly, leverage the interactive interface to dive deep on the specific area that you want to check for your API gateway performance. 

:::image type="content" source="media/diagnose-solve-problems/gatewaypreformancetile.png" alt-text="Gateway 4xx responses .":::

### Service Upgrade

This category checks which service tier (SKU) you are currently using and reminds you to upgrade to avoid any issues that may be related to that tier. The same interactive interface helps you go deep with more graphics and a summary check result. 

:::image type="content" source="media/diagnose-solve-problems/servicesku.png" alt-text="service upgrade.":::

## Search documentation

In additional to the Diagnose and solve problems tools, you can search for troubleshooting documentation related to your  issue. After running the diagnostics on your service, select **Search Documentation** in the interactive interface. 

 :::image type="content" source="media/diagnose-solve-problems/searchdocumentation.png" alt-text="Search Documentation.":::


 :::image type="content" source="media/diagnose-solve-problems/searchdocumentation2.png" alt-text="Search Documentation 2.":::


## Next steps

* Also use [API analytics](howto-use-analytics.md) to analyze the usage and performance of the APIs. 
* Want to troubleshoot Web Apps issues with Diagnostics? Read it [here](../app-service/overview-diagnostics.md)
* Leverage Diagnostics to check Azure Kubernetes Services issues. See [Diagnostics on AKS](../aks/concepts-diagnostics.md)
* Post your questions or feedback at [UserVoice](https://feedback.azure.com/forums/248703-api-management) by adding "[Diag]" in the title.