---
title: Azure Advisor frequently asked questions | Microsoft Docs
description: Get answers to frequently asked questions about Azure Advisor.
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
ms.date: 11/09/2016
ms.author: kumudd
---

# Azure Advisor frequently asked questions

This article includes frequently asked questions about Azure Advisor.

## What is Azure Advisor?

Azure Advisor is a personalized recommendation engine that helps you improve the cost effectiveness, performance, high availability, and security of your Azure resources. 

## How do I access Azure Advisor?
You can access Advisor through the Azure portal. Sign into the portal, select **Browse** and then scroll to **Azure Advisor**. You can also view Advisor recommendations through the virtual machine resource blade. Choose a virtual machine, and then scroll to Advisor recommendations in the menu. 

## What permissions do I need to access Azure Advisor?

To view Advisor recommendations, you must have access to at least one subscription. Your role must be either **Owner**, **Contributor**, or **Reader** to that subscription. Subscription owners and contributors can compute/generate recommendations. However, with a **Reader** role, you can only view Advisor recommendations. 

## What does Azure Advisor check?
Advisor analyzes your resource configuration and usage telemetry to detect risks and potential issues. It then draws on Azure best practices to recommend solutions to improve the cost effectiveness, performance, high availability, and security of your Azure resources. 
Advisor generates recommendations in four categories:
-	**High Availability:** to ensure and improve the continuity of your business critical applications running on Azure resources
-	**Security:** to detect threats and vulnerabilities that could lead to potential security breaches
-	**Performance:** to enhance the speed of your applications
-	**Cost:** to optimize and reduce your overall Azure spend

## How often are Azure Advisor recommendations updated?

Advisor recommendations are updated on an hourly basis.

## What resources does Azure Advisor provide recommendations for?

Advisor provides recommendations for virtual machines, availability sets, App Services, SQL servers, SQL databases, and Redis cache.

## Can I snooze or dismiss a recommendation?

To snooze or dismiss a recommendation, click the **Snooze** button or link. You can specify a snooze time period or select **Never** to dismiss the recommendation.

## Next Steps

See these resources to learn more about Azure Advisor:
-  [Advisor Overview](advisor-overview.md)
-  [Get Started with Advisor](advisor-get-started.md)
-  [Advisor High Availability Recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Security Recommendations](advisor-security-recommendations.md)
-  [Advisor Performance Recommendations](advisor-performance-recommendations.md)
-  [Advisor Cost Recommendations](advisor-performance-recommendations.md)