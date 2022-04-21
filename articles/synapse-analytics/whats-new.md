---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 03/11/2022
---

# What's new in Azure Synapse Analytics?

This article lists updates to Azure Synapse Analytics that are published in Feb 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

The following updates are new to Azure Synapse Analytics this month.

## SQL

* Serverless SQL Pools now support more consistent query execution times. [Learn how Serverless SQL pools automatically detect spikes in read latency and support consistent query execution time.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_2)

* [The `OPENJSON` function makes it easy to get array element indexes](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_3). To learn more, see how the OPENJSON function in a serverless SQL pool allows you to [parse nested arrays and return one row for each JSON array element with the index of each element](/sql/t-sql/functions/openjson-transact-sql?view=azure-sqldw-latest&preserve-view=true#array-element-identity).

## Data integration

* [Upserting data is now supported by the copy activity](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_5). See how you can natively load data into a temporary table and then merge that data into a sink table with [upsert.](../data-factory/connector-azure-sql-database.md?tabs=data-factory#upsert-data)

* [Transform Dynamics Data Visually in Synapse Data Flows.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_6) Learn more on how to use a [Dynamics dataset or an inline dataset as source and sink types to transform data at scale.](../data-factory/connector-dynamics-crm-office-365.md?tabs=data-factory#mapping-data-flow-properties)

* [Connect to your SQL sources in data flows using Always Encrypted](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_7). To learn more, see [how to securely connect to your SQL databases from Synapse data flows using Always Encrypted.](../data-factory/connector-azure-sql-database.md?tabs=data-factory)

* [Capture descriptions from asserts in Data Flows](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_8) To learn more, see [how to define your own dynamic descriptive messages](../data-factory/data-flow-expressions-usage.md#assertErrorMessages) in the assert data flow transformation at the row or column level.

* [Easily define schemas for complex type fields.](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-february-update-2022/ba-p/3221841#TOCREF_9) To learn more, see how you can make the engine to [automatically detect the schema of an embedded complex field inside a string column](../data-factory/data-flow-parse.md).

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)
