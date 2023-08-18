---
title: Monitoring Azure Cosmos DB using third-party monitoring tools
description: This article will describe monitoring third-party tools helps monitoring Azure Cosmos DB.
author: manishmsfte
ms.author: mansha
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/28/2021
---

# Monitoring Azure Cosmos DB using third-party solutions
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Apart from Azure Monitor, you can use third party monitoring solutions to monitor your Azure Cosmos DB instances.

> [!IMPORTANT] 
> Solutions mentioned in this article are for information purpose only, the ownership lies to individual solution owner. We recommend users to do thorough evaluation and then select most suitable to you.

## Datadog
{Supports: API for NoSQL, MongoDB, Gremlin, Cassandra & Table}

[Datadog](https://www.datadoghq.com/) is a fully unified platform encompassing infrastructure monitoring, application performance monitoring, log management, user-experience monitoring, and more. By bringing together data from every tool and service in your company’s stack, Datadog provides a single source of truth for troubleshooting, optimizing performance, and cross-team collaboration.
Everything in Datadog is organized under the same set of tags, so all the data relevant to a particular issue is automatically correlated. By eliminating the blind spots, Datadog reduces the risk of overlooked errors, mitigates the burden of ongoing service maintenance, and accelerates digital transformations.

Datadog collects over 40 different gauge and count metrics from CosmosDB, including the total available storage per region, the number of SQL databases created, and more. These metrics are collected through the Datadog Azure integration, and appear in the platform 40% faster than the rest of the industry. Datadog also provides an out-of-the-box dashboard for CosmosDB, which provides immediate insight into the performance of CosmosDB instances. Users can visualize platform-level metrics, such as total request units consumed, also API-level metrics, such as the number of Cassandra keyspaces created to better understand their CosmosDB usage.

Datadog is being used by various Azure Cosmos DB customers, which include
- Maersk
- PWC 
- PayScale 
- AllScripts 
- Hearst



:::image type="content" source="./media/monitor-solutions/datadog-demo.gif" alt-text="Datadog demo" border="false":::
**Figure:**  Datadog in action

Useful links:
- [Pricing details](https://www.datadoghq.com/pricing/)
- [Get started with 14 days trial](https://www.datadoghq.com/free-datadog-trial/)


## Dynatrace
{Supports: API for NoSQL & MongoDB}

[Dynatrace](https://www.dynatrace.com/platform/) delivers software intelligence for the cloud to tame cloud complexity and accelerate digital transformation. With automatic and intelligent observability at scale, the Dynatrace all-in-one Software Intelligence Platform delivers precise answers about the performance and security of applications, the underlying infrastructure, and the experience of all users, so teams can automate cloud operations, release better software faster, and deliver unrivaled digital experiences.  
Using the API for MongoDB, Dynatrace collects and delivers CosmosDB metrics, which includes the numbers of calls and response times—all visualized according to aggregation, commands, read-, and write operations.  It also tells you exact database statements executed in your environment.  Lastly with the power of [Davis AI Engine](https://www.dynatrace.com/davis), it can detect exactly which database statement is the root cause of degradation and can see the database identified as the root cause.

:::image type="content" source="./media/monitor-solutions/dynatrace-demo.gif" alt-text="Dynatrace's various screen to provide monitoring information of Azure Cosmos DB" border="false":::
**Figure:** Dynatrace in Action

### Useful links

- [Try Dynatrace with 15 days free trial](https://www.dynatrace.com/trial)
- [Launch from Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration)
- [Documentation on how to use Azure Cosmos DB with Azure Monitor](https://www.dynatrace.com/support/help/setup-and-configuration/setup-on-cloud-platforms/microsoft-azure-services)
- [Azure Cosmos DB - Dynatrace Integration details](https://www.dynatrace.com/news/blog/azure-services-explained-part-4-azure-cosmos-db/?_ga=2.185016301.559899881.1623174355-748416177.1603817475)
- [Dynatrace Monitoring for Azure databases](https://www.dynatrace.com/technologies/azure-monitoring/azure-database-performance/)
- [Dynatrace for Azure solution overview](https://www.dynatrace.com/technologies/azure-monitoring/)
- [Solution Partners](https://www.dynatrace.com/partners/solution-partners/)

## Next steps
- [Monitoring Azure Cosmos DB data reference](./monitor-reference.md)
