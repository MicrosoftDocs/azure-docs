---
title: Automated advisor performance recommendations for Azure Cosmos DB
description: 
author: ThomasWeiss
ms.author: thweiss
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 07/27/2020
ms.reviewer: sngun

---

# Automated recommendations for Azure Cosmos DB

All the cloud services including Azure Cosmos DB get frequent updates with new features, capabilities, and improvements. It’s important for your application to keep up with the latest performance and security updates. The Azure portal offers customized recommendations that enable you to maximize the performance of your application. The Azure Advisor in the Azure portal continuously analyzes the usage history of your Azure Cosmos DB resources and provides recommendations based on your workload patterns. These recommendations correspond to areas like partitioning, indexing, network, security etc. These customized recommendations help you to improve the performance of your application.

## View recommendations

You can view recommendations for Azure Cosmos DB in the following three ways:

1. One way to view the recommendations is within the notifications tab. Sign into your [Azure portal](https://portal.azure.com) and navigate to your Azure Cosmos account.  If there are new recommendations, you will see a message bar. You can select the message and view recommendations.

1. Another option is within your Azure Cosmos account, open the **Notifications** pane and then select the **Recommendations** tab.

1. You can also find the recommendations through [Azure Advisor](../advisor/advisor-overview.md) in categorized by different buckets such as cost, security, reliability, performance, and operational excellence. You can select specific subscriptions and filter by the resource type, which is **Azure Cosmos DB accounts**.  When you select a specific recommendation, it displays the actions you can take to benefit your workloads.

Not all recommendations shown in the Azure Cosmos DB pane are available in the Azure Advisor and vice versa. That’s because based on the type of recommendation they fit in either the Azure Advisor pane, Azure Cosmo DB pane or both.

Currently Azure Cosmos DB supports recommendations on the following areas. Each of these recommendations includes a link to the relevant section of the documentation, so it’s easy for you to take the next steps.

## SDK usage recommendations

In this category, the advisor detects the usage of an old version of SDKs and recommends that you upgrade to a newer version to leverage the latest bug fixes and performance improvements. Currently the following SDK-specific recommendations are available:

|Name  |Description  |
|---------|---------|
| OldSparkConnector | Detects the usage of old versions of the Spark connector and recommends upgrading. |
| OldDotNetSDK | Detects the usage of old versions of the .NET SDK and recommends upgrading. |
| OldJavaSDK | Detects the usage of old versions of the Java connector and recommends upgrading. |

## Indexing recommendations

In this category, the advisor detects the indexing mode, indexing policy, indexed paths and recommends changing if the current configuration impacts the query performance. Currently the following indexing-specific recommendations are available:

|Name  |Description  |
|---------|---------|
| LazyIndexing | Detects usage of lazy indexing and recommends using consistent indexing mode instead. The purpose of Azure Cosmos DB’s lazy indexing mode is limited and can impact the freshness of query results in some situations so consistent indexing mode is recommended. |
| CompositeIndexing	| Detects the accounts where queries could benefit from composite indexes and recommend using them. Composite indexes can dramatically improve the performance and throughput consumption of some queries.|
| DefaultIndexingWithManyPaths | Detects containers running on default indexing with many indexed paths and recommends customizing the indexing policy.|
| OrderByHighRuCharge| Detects containers issuing ORDER BY queries with high RU/s charge and recommends exploring composite indexes.|
| Mongo36NoIndexHighRuCharge| Detects Azure Cosmos DB’s API for MongoDB with 3.6 version of containers issuing queries with high RU/s charge and recommends adding indexes.|

## Cost optimization recommendations

In this category, the advisor detects the RU/s usage and determines that you can optimize the price by making some changes to your resources or by leveraging a different pricing model. Currently the following cost optimization-specific recommendations are available:

|Name  |Description  |
|---------|---------|
| ReservedCapacity | Detects your RU/s utilization and recommends reserved instances to users who can benefit from it. |
| ContainerInactivity | Detects the containers that haven't been used for more than 30 days and recommends reducing the throughput for such containers or deleting them.|
| NewSubscriptionHighBurnRate | Detects new subscriptions with accounts spending unusually high RU/s per day and provides them a notification. This notification is specifically to bring awareness to new customers that Azure Cosmos DB operates on provisioned throughput-based model and not consumption-based model. |

## Migration recommendations

In this category, the advisor detects that you are using legacy features recommends migrating so that you can leverage Azure Cosmos DB’s massive scalability and other benefits. Currently the following migration-specific recommendations are available:

|Name  |Description  |
|---------|---------|
| FixedCollection| Detects fixed-size containers that are approaching their max storage limit and recommends migrating them to partitioned containers.|

## Query usage recommendations

In this category, the advisor detects the query execution and identifies that the query performance can be tuned with some changes. Currently the following query usage recommendations are available:

|Name  |Description  |
|---------|---------|
| QueryPageSize | Detects queries issued with a fixed page size and recommends using -1 (no limit on the page size) instead of defining a specific value. This option reduces the number of network round trips required to retrieve all results. |

## Next steps