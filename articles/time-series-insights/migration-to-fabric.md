---
title: 'Migrating to Real-Time Intelligence in Microsoft Fabric | Microsoft Docs'
description: How to migrate Azure Time Series Insights environments to Real-Time Intelligence in Microsoft Fabric.
ms.service: time-series-insights
author: cosh
ms.author: herauch
ms.topic: conceptual
ms.date: 6/6/2024
ms.custom: attributes
---

# Migrating to Real-Time Intelligence in Microsoft Fabric

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

## Overview
Time Series Insights is a service that enables operational analytics and reporting on historical data. It offers data ingestion, storage, contextualization, analysis, and querying capabilities. As part of migrating to [Real-Time Intelligence](/fabric/real-time-intelligence/overview), all of these capabilities can be met and even improved by migrating to [Eventhouse](/fabric/real-time-intelligence/eventhouse), the time series database in Real-Time Intelligence.

> [!NOTE]
> We recommend that you migrate your Time Series Insights to [Eventhouse](/fabric/real-time-intelligence/eventhouse) in Fabric Real-Time Intelligence. Eventhouse is a SaaS offering of [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), a service that is trusted by many customers. However, if you want to migrate to Azure Data Explorer (the PaaS offering), you can use the guidance in the [tsi2rti repository](https://aka.ms/tsi2rti) under **Readiness**. The repository also contains tools that can help you migrate to either Eventhouse or Azure Data Explorer. 

## Migration steps

Time Series Insights has two offerings, Gen1 and Gen2, with different migration steps.

If you need more migration guidance from Microsoft, such as architecture review, clarification about specific capabilities, please fill out your request [here](https://aka.ms/TSI2FabricMigrationHelp). Microsoft will evaluate your request and contact you as soon as possible to discuss the migration details and support needed.

### Time Series Insights Gen1

Time Series Insights Gen1 doesn’t have cold Storage or hierarchy capability. All data has a fixed retention period. The suggested migration path is to set up parallel data ingestion to Eventhouse. After the fixed data retention period passes, the Time Series Insights environment can be deleted, as Eventhouse will contain the same data.

1. [Create an Eventhouse](/fabric/real-time-intelligence/create-eventhouse).
1. Set up parallel [ingestion](/fabric/real-time-intelligence/get-data-event-hub) from [Azure Event Hubs](/azure/event-hubs/event-hubs-about) to the Eventhouse.
1. Continue ingesting data for the period of fixed retention.
1. Start using Eventhouse.
1. Delete the Time Series Insights environment.
Detailed FAQ and engineering experiences are outlined in [How to migrate Time Series Insights Gen1 to Real-Time Intelligence](./how-to-tsi-gen1-migration.md)

### Time Series Insights Gen2

Time Series Insights Gen2 stores all data on cold storage using Parquet format as a blob in the customer’s subscription. To migrate data, the customer should take the blob and import it into Eventhouse using the GetData experience.

1. [Create an Eventhouse](/fabric/real-time-intelligence/create-eventhouse).
1. Redirect data [ingestion](/fabric/real-time-intelligence/get-data-event-hub) to Eventhouse.
1. [Import](/fabric/real-time-intelligence/get-data-azure-storage) Time Series Insights cold data.
1. Start using Eventhouse.
1. Delete the Time Series Insights Environment .

Detailed FAQ and engineering experience are outlined in [How to migrate TSI Gen2 to Real-Time Intelligence](./how-to-tsi-gen2-migration.md)

### Data consumption and visualization

Once you successfully migrate your data and established continuous data ingestion from your sources, you can consume the data using various tools and technologies. These include:

* [Power BI](/fabric/real-time-intelligence/create-powerbi-report): Power BI is a powerful business intelligence tool that allows you to create interactive visualizations and reports based on your data. You can connect Power BI to your Real-Time Intelligence environment and use its rich set of features to gain insights from your data.

* [KQL Querysets](/fabric/real-time-intelligence/create-query-set): KQL (Kusto Query Language) is a query language used in Azure Data Explorer and other Azure services. With KQL, you can write powerful queries to analyze and manipulate your data in Real-Time Intelligence. 

* [Real-Time Dashboards](/fabric/real-time-intelligence/dashboard-real-time-create): Real-Time Intelligence provides built-in support for creating real-time dashboards. These dashboards allow you to monitor and visualize your data in real-time, providing you with up-to-date insights and analytics. You can customize these dashboards to suit your specific needs and requirements.

* [KustoTrender](https://github.com/Azure/azure-kusto-trender): A JavaScript library for custom time series dashboards

* SDKs for Custom Applications: Fabric Real-Time Intelligence offers SDKs (Software Development Kits) for various programming languages, including [C#](/azure/data-explorer/kusto/api/netfx/about-the-sdk?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric), Java [Java](/azure/data-explorer/kusto/api/java/kusto-java-client-library?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric), and [Node.js](/azure/data-explorer/kusto/api/node/kusto-node-client-library?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric). These SDKs provide a set of libraries and tools that allow you to integrate Real-Time Intelligence into your custom applications. You can use these SDKs to perform data ingestion, querying, and other operations programmatically.

### Migration of the Time Series Model

Time Series Insights Gen 2 offers the capability to contextualize raw time series data using a model known as the [Time Series Model](/azure/time-series-insights/concepts-model-overview), which defines assets and their relationships as hierarchies. Using the [Kusto Graph Semantics](/azure/data-explorer/graph-overview?context=%2Ffabric%2Fcontext%2Fcontext-rti&pivots=fabric) within Eventhouse, it's possible to model the Time Series Model hierarchy as a graph. This enables the traversal of assets within the graph and facilitates the contextualization of time series data.

> [!NOTE]
> Your Time Series Insights resources will be automatically deleted if you cannot migrate from Time Series Insights to Real-Time Intelligence by 7 July 2024. You’ll be able to access Gen2 data in your storage account. However, you can only perform management operations (such as updating storage account settings, getting storage account properties/keys, and deleting storage accounts) through Azure Resource Manager. 
