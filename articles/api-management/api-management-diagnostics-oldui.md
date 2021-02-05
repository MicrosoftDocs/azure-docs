---
title: Diagnostics and solve tool
description: Learn how you can troubleshoot issues with your API in Azure API Management Service with the diagnostics and solve tool in the Azure portal. 
keywords: API Management, azure API Management, diagnostics, support, API, troubleshooting, self-help
author: 

ms.topic: article
ms.date: 01/14/2021
ms.author: rongzhang
ms.custom: 

---
# Azure API Management diagnostics overview

When you built and are connected to an API, you want to be prepared for any issues that may arise, from 500 errors to your users telling you that their site is down. API Management Diagnostics is an intelligent and interactive experience to help you troubleshoot your API with no configuration required. When you do run into issues with your API, API Management diagnostics points out what’s wrong to guide you to the right information to more easily and quickly troubleshoot and resolve the issue.

Although this experience is most helpful when you’re having issues with your API within the last 24 hours, all the diagnostic graphs are always available for you to analyze.

## Open API Management diagnostics

To access API Management diagnostics, navigate to your API Management Environment in the [Azure portal](https://portal.azure.com). In the left navigation, click on **Diagnose and solve problems**.

![Navigate to Diagnostics](.media/api-magament-diagnostics/apimdisgnostichome.png)

## Intellective Search

You can search your issues or problems in the search bar on the top of the page. The search can also help you find the tools that may help to troubleshoot or resolve your issues. 

![search bar](.media/api-magament-diagnostics/intellectivesearch.png)

## Troubleshooting Category

You can troubleshoot issues under categories. Common issues that are related to your API performance, gateway, proxy policies can all be analyzed within each category. You can find more specific check information under each category. 

![category](.media/api-magament-diagnostics/troubleshootingcategory.png)

### Availability and Performance

You can check your API availability and performance issues under this category. After clicking to this category tile, you will see a few common checks are recommended in an interactive interface. Click each check, you can dive deep  to the specifics of each issue. The check will also provide you a graph analysis to show your API performance. It will summarize issues that happened on your API performance. For example, your API service may have a 5xx error and time out in the last hour at the backend. 

![interactive interface check 1](.media/api-magament-diagnostics/categoryinteractivesearch1.png)
![interactive interface check 2](.media/api-magament-diagnostics/categoryinteractivesearch2.png)

### Proxy and Policies

This category detects your proxy errors and returns you the error information to help notifies your proxy policy issues and help you troubleshoot the issues. 

You will experience similar interactive interface and be guided to the data metrics that is related to your API policies configuration.

![proxy and policy category overview](.media/api-magament-diagnostics/proxypolicies.png)

### Gateway Performance 

For gateway requests or responses or any 4xx or 5xx errors on your gateway, you can use this category to monitor then troubleshoot. Similarly, you can leverage the interactive interface to dive deep on the specific area that you want to check for your API gateway performance. 

![gateway performance overview](.media/api-magament-diagnostics/gatewayperformance.png)

### Service Upgrade

This category checks what service SKUs are you currently on and reminds you to upgrade to avoid any issues may related to upgrade. The same interactive interface will help you go deep with more graphics and summarized check result. 

![service upgrade category overview](.media/api-magament-diagnostics/servicesku.png)
 

Post your questions or feedback at [UserVoice](https://feedback.azure.com/forums/248703-api-management) by adding "[Diag]" in the title.


