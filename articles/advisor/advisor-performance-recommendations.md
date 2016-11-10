<properties
   pageTitle="Azure Advisor Performance Recommendations| Microsoft Azure"
   description="Use Azure advisor to optimize the performances of your Azure deployments."
   services="advisor"
   documentationCenter=""
   authors="kumudd"
   manager="carmonm"
   editor="" />
<tags
   ms.service="advisor"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="11/16/2016"
   ms.author="kumudd" />

# Azure Advisor Performance Recommendations
Azure Advisor helps optimize the performances of SQL Database, Redis Cache, and App services in your Azure deployments.

## Enhance the performance of your SQL database

Advisor provides you with a consistent, consolidated view of recommendations for all your Azure resources. It integrates with SQL Database Advisor to bring you recommendations for improving the performance of your SQL Azure database.  
SQL Database Advisor assesses the performance of your SQL Azure databases by analyzing your usage history. It then offers recommendations that are best suited for running your database’s typical workload. SQL database advisor recommendations offer inline actions.
You can apply individual recommendations one at a time or enable advisor to automatically apply recommendations.

> [AZURE.NOTE]
> To get recommendations a database must have about a week of usage, and within that week there must be some consistent activity. SQL Database Advisor can more easily optimize for consistent query patterns than it can for random spotty bursts of activity.

More information about SQL database advisor can be found [here](https://azure.microsoft.com/en-us/documentation/articles/sql-database-advisor/).

<ADD NEW IMAGE>

![](./media/advisor-performance-recommendations/image19.png)

## Redis Cache recommendations

Azure Advisor identifies Redis Cache instances where performance may be adversely impacted by high memory usage, server load, network bandwidth or large number of client connections. It also provides best practices recommendations to avoid potential issues. These recommendations offer inline actions. For more information about these recommendations, see [Redis Cache Advisor](https://azure.microsoft.com/en-us/documentation/articles/cache-configure/#redis-cache-advisor).

<ADD NEW IMAGE>

![](./media/advisor-performance-recommendations/image20.png)

## App Services recommendations

Azure Advisor integrates best practices recommendations for improving your App Services experience and discovering relevant platform capabilities. Examples include detection of instances where memory or CPU resources are exhausted by app runtimes with mitigation options, as well as detection of instances where collocating resources like web apps and databases can improve performance and lower cost. For more information about these recommendations, see [Best Practices for Azure App Service](https://azure.microsoft.com/en-us/documentation/articles/app-service-best-practices/).

<ADD NEW IMAGE>

![](./media/advisor-performance-recommendations/image21.png)


## Related

-  [Introduction to Advisor](advisor-overview.md)
-  [Advisor FAQs](advisor-FAQs.md)
-  [Get Started with Advisor](advisor-get-started.md)
-  [Advisor High Availability Recommendations](advisor-high-availability-recommendations.md)
-  [Advisor Security Recommendations](advisor-security-recommendations.md)
-  [Advisor Cost Recommendations](advisor-performance-recommendations.md)
