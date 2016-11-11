---
title: Azure Advisor Performance Recommendations | Microsoft Docs
description: Use Advisor to optimize the performances of your Azure deployments.
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

# Azure Advisor Performance Recommendations

Advisor performance recommendations help enhance and improve the speed and responsiveness of your business-critical applications. You can get performance recommendations using Advisor from the **Performance** tab of the Advisor dashboard.

## Enhance the performance of your SQL database

Advisor provides you with a consistent, consolidated view of recommendations for all your Azure resources. It integrates with SQL Database Advisor to bring you recommendations for improving the performance of your SQL Azure database.  
SQL Database Advisor assesses the performance of your SQL Azure databases by analyzing your usage history. It then offers recommendations that are best suited for running your database’s typical workload. SQL database advisor recommendations offer inline actions.

You can either apply each recommendation individally at a time, or, enable Advisor to automatically apply all recommendations at once.

> [!NOTE]
> To get recommendations a database must have about a week of usage, and within that week there must be some consistent activity. SQL Database Advisor can more easily optimize for consistent query patterns than it can for random spotty bursts of activity.

For more information about SQL database advisor, see  [SQL Database Advisor](https://azure.microsoft.com/en-us/documentation/articles/sql-database-advisor/).

![Enhance the performance of your SQL database](./media/advisor-performance-recommendations/advisor-performance-sql-db-example.png)

## Redis Cache recommendations

Azure Advisor identifies Redis Cache instances where performance may be adversely impacted by high memory usage, server load, network bandwidth, or large number of client connections. It also provides best practices recommendations to avoid potential issues. These recommendations offer inline actions. For more information about Redis Cache recommendations, see [Redis Cache Advisor](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#redis-cache-advisor).


## App Services recommendations

Azure Advisor integrates best practices recommendations for improving your App Services experience and discovering relevant platform capabilities. Examples include detection of instances where memory or CPU resources are exhausted by app runtimes with mitigation options, and detection of instances where collocating resources like web apps and databases can improve performance and lower cost. For more information about App Services recommendations, see [Best Practices for Azure App Service](https://azure.microsoft.com/en-us/documentation/articles/app-service-best-practices/).


![App Services recommendations](./media/advisor-performance-recommendations/advisor-performance-app-service.png)


## Next Steps

See these resources to learn more about Advisor recommendations:

-  [Introduction to Advisor](advisor-overview.md)
-  [Advisor FAQs](advisor-faqs.md)
-  [Get Started with Advisor](advisor-get-started.md)
-  [Advisor High Availability Recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Security Recommendations](advisor-security-recommendations.md)
-  [Advisor Cost Recommendations](advisor-performance-recommendations.md)
