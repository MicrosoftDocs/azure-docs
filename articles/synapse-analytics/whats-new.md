---
title: What's new? 
description: Learn about the new features and documentation improvements for Azure Synapse Analytics
services: synapse-analytics
author: ryanmajidi
ms.author: rymajidi 
ms.service: synapse-analytics
ms.subservice: overview
ms.topic: conceptual
ms.date: 01/28/2022
---

# What's new in Azure Synapse Analytics?

This article lists updates to Azure Synapse Analytics that are published in Jan 2022. Each update links to the Azure Synapse Analytics blog and an article that provides more information. For previous months releases, check out [Azure Synapse Analytics - updates archive](whats-new-archive.md).

## Jan 2022 update

The following updates are new to Azure Synapse Analytics this month.

### Apache Spark for Synapse

You can now use four new database templates in Azure Synapse. [Learn more about Automotive, Genomics, Manufacturing, and Pharmaceuticals templates from the blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/four-additional-azure-synapse-database-templates-now-available/ba-p/3058044) or the [database templates article](./database-designer/overview-database-templates.md). These templates are currently in public preview and are available within the Synapse Studio gallery.

### Machine Learning

Improvements to the Synapse Machine Learning library v0.9.5 (previously called MMLSpark). This release simplifies the creation of massively scalable machine learning pipelines with Apache Spark. To learn more, [read the blog post about the new capabilities in this release](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_3) or see the [full release notes](https://microsoft.github.io/SynapseML/)

### Security

* The Azure Synapse Analytics security overview - A whitepaper that covers the five layers of security. The security layers include authentication, access control, data protection, network security, and threat protection. [Understand each security feature in detailed](./guidance/security-white-paper-introduction.md) to implement an industry-standard security baseline and protect your data on the cloud.

* TLS 1.2 is now required for newly created Synapse Workspaces. To learn more, see how [TLS 1.2 provides enhanced security using this article](./security/connectivity-settings.md) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_6). Login attempts to a newly created Synapse workspace from connections using a TLS versions lower than 1.2 will fail.

### Data Integration

* Data quality validation rules using Assert transformation - You can now easily add data quality, data validation, and schema validation to your Synapse ETL jobs by leveraging Assert transformation in Synapse data flows. To learn more, see the [Assert transformation in mapping data flow article](/data-factory/data-flow-assert.md) or [the blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_8).

* Native data flow connector for Dynamics - Synapse data flows can now read and write data directly to Dynamics through the new data flow Dynamics connector. Learn more on how to [Create data sets in data flows to read, transform, aggregate, join, etc. using this article](../data-factory/connector-dynamics-crm-office-365.md) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_9). You can then write the data back into Dynamics using the built-in Synapse Spark compute.

* IntelliSense and auto-complete added to pipeline expressions - IntelliSense makes creating expressions, editing them easy. To learn more, see how to [check your expression syntax, find functions, and add code to your pipelines.](https://techcommunity.microsoft.com/t5/azure-data-factory-blog/intellisense-support-in-expression-builder-for-more-productive/ba-p/3041459)

### Synapse SQL

* COPY schema discovery for complex data ingestion. To learn more, see the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_12) or [how Github leveraged this functionality in Introducing Automatic Schema Discovery with auto table creation for complex datatypes](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/introducing-automatic-schema-discovery-with-auto-table-creation/ba-p/3068927).

* Serverless SQL pools now support the HASHBYTES function. HASHBYTES is a T-SQL function which hashes values. Learn how to use [hash values in distributing data using this article](/sql/t-sql/functions/hashbytes-transact-sql) or the [blog post](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/azure-synapse-analytics-january-update-2022/ba-p/3071681#TOCREF_13).

## Next steps

[Get started with Azure Synapse Analytics](get-started.md)