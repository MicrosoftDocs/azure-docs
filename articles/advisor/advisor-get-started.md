---
title: Get started with Azure Advisor | Microsoft Docs
description: Get started with Azure Advisor.
services: advisor
documentationcenter: NA
author: kumudd
manager: carmonm
editor: ''

ms.assetid: 
ms.service: advisor
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/16/2016
ms.author: kumudd
---

# Get started with Azure Advisor

Learn how to access Advisor using the Azure portal, get recommendations, implement recommendations, search for recommendations, and refresh recommendations.

## Get Advisor recommendations

1. Sign in into the [Azure portal](https://portal.azure.com).
2. In the left-navigation pane, click **More services**, and then in the service menu pane, scroll down to **Monitoring and Management**, and then click **Azure Advisor**. This launches the Advisor dashboard.

  ![Access Azure Advisor using the Azure portal](./media/advisor-overview/advisor-azure-portal-menu.png) 

3. On the Advisor dashboard, select the subscription for which you’d like to receive recommendations. The Advisor dashboard displays personalized recommendations for a selected subscription. 
4. To get recommendations for a particular category, click on one of the categories.
 
> [!NOTE]
> Azure Advisor generates recommendations for subscriptions where you are assigned the role of **Owner**, **Contributor**, or **Reader**.

  ![Azure Advisor dashboard](./media/advisor-overview/advisor-all-tab.png)

## Get Advisor recommendation details and implement a recommendation

The **Recommendation** blade in Advisor offers additional information about the Advisor recommendation. 

1. Sign into the [Azure portal](https://portal.azure.com), and then launch [Azure Advisor](https://aka.ms/azureadvisordashboard).
2. On the **Advisor recommendations** dashboard, click **Get Recommendation**.
3. From the list of recommendations, click a recommendation that you want to review in detail. This launches the recommendation blade.
4. On the recommendations blade, review information about actions that you can perform to resolve a potential issue, or take advantage of a cost saving opportunity. 
  
  ![Advisor recommendation action example](./media/advisor-overview/advisor-recommendation-action-example.png)

## Search for Advisor recommendations

You can search for recommendations for a particular subscription or resource group. You can also search for recommendations by status.

1. Sign into the Azure portal, and then launch Azure Advisor.
2. Search for recommendations by filtering for subscriptions, resource groups, and recommendation status (**Active** or **Snoozed**).
3. Click **Get recommendations** to get a list of Advisor recommendations based on your search filters.

  ![](./media/advisor-get-started/advisor-search.png)

## Snooze Advisor recommendations

1. Sign into the Azure portal, and then launch Azure Advisor.
2. Click **Get Recommendation**, and then from the list of recommendations, click a recommendation.
3. On the **Recommendation** blade, click **Snooze**.  You can specify a snooze time period or select **Never** to dismiss the recommendation.

  ![Advisor recommendation action example](./media/advisor-get-started/advisor-snooze.png)



## Next steps

See these resources to learn more about Advisor:
-  [Introduction to Azure Advisor](advisor-overview.md)
-  [Advisor High Availability recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Security recommendations](advisor-security-recommendations.md)
-  [Advisor Performance recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost recommendations](advisor-performance-recommendations.md)
