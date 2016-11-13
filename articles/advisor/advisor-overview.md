---
title: Introduction to Azure Advisor | Microsoft Docs
description: Use Azure Advisor to optimize the cost of your Azure deployments.
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

# Introduction to Azure Advisor

## What is Azure Advisor?
Azure Advisor is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments. It analyzes your resource configuration and usage telemetry t. It then recommends solutions to help improve the performance, security, and high availability of your resources while looking for opportunities to reduce your overall Azure spend.

You can access Advisor through the [Azure portal](https://aka.ms/azureadvisordashboard). Sign into the [portal](https://portal.azure.com), select **Browse**, and then scroll to **Azure Advisor**. The Advisor dashboard displays personalized recommendations for a selected subscription. The recommendations are divided into four categories. 

-   **High Availability** – to ensure and improve the continuity of your business-critical applications

-   **Security** – to detect threats and vulnerabilities that could lead to potential security breaches

-   **Performance** – to enhance the speed of your applications

-   **Cost** – to optimize and reduce your overall Azure spend

  ![Advisor recommendation types](./media/advisor-overview/advisor-all-tab-examples.png)

> [!NOTE]
> Azure Advisor generates recommendations for subscriptions where you are assigned the role of **Owner**, **Contributor** or **Reader**.

You can click a recommendation to learn additional information about it. You can also learn about actions you can perform to take advantage of an opportunity or resolve an issue. 
Advisor offers recommendations with inline actions or documentation links. Clicking an inline action takes you through a “guided user journey” to implement it. Clicking a documentation link points you to the documentation that describes how you can manually implement the action. 

Advisor updates recommendations on an hourly basis. If you don’t intend to take an immediate action on a recommendation, you can snooze it for a time period or dismiss it. 

## Frequently asked questions

### How do I access Advisor?
You can access Advisor through the Azure portal. Sign into the portal, select **Browse**, and then scroll to **Azure Advisor**. You can also view Advisor recommendations through the virtual machine resource blade. Choose a virtual machine, and then scroll to Advisor recommendations in the menu. 

### What permissions do I need to access Advisor?

To view Advisor recommendations, you must have access to at least one subscription. Your role must be either **Owner**, **Contributor**, or **Reader** for the subscription. Subscription owners and contributors can compute/generate recommendations. However, with a **Reader** role, you can only view Advisor recommendations. 

### How often are Advisor recommendations updated?

Advisor recommendations are updated on an hourly basis.

### What resources does Advisor provide recommendations for?

Advisor provides recommendations for virtual machines, availability sets, App Services, SQL servers, SQL databases, and Redis cache.

### Can I snooze or dismiss a recommendation?

To snooze or dismiss a recommendation, click the **Snooze** button or link. You can specify a snooze time period or select **Never** to dismiss the recommendation.

## Next steps

See these resources to learn more about Advisor recommendations:

-  [Get started with Advisor](advisor-get-started.md)
-  [Advisor High Availability recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Security recommendations](advisor-security-recommendations.md)
-  [Advisor Performance recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost recommendations](advisor-performance-recommendations.md)
