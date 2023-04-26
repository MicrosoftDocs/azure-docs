---
title: Elastic data map
description: This article explains the concepts of the Elastic Data Map in Microsoft Purview
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 03/23/2023
ms.custom: template-concept 
---

# Elastic data map in Microsoft Purview

The Microsoft Purview Data Map provides the foundation for data discovery and data governance. It captures metadata about data present in analytics, software-as-a-service (SaaS), and operation systems in hybrid, on-premises, and multicloud environments. The data map stays up to date with its built-in scanning and classification system.

All Microsoft Purview accounts have a data map that starts at one capacity unit, and can elastically grow. They scale up and down based on request load and metadata stored within the data map.

## Data map capacity unit

The elastic data map has two components, metadata storage and operation throughput, represented as a capacity unit (CU). All Microsoft Purview accounts, by default, start with one capacity unit and elastically grow based on usage. Each data Map capacity unit includes a throughput of 25 operations/sec and 10 GB of metadata storage limit.  

### Operations

Operations are the throughput measure of the Microsoft Purview Data Map. They include any Create, Read, Write, Update, and Delete operations on metadata stored in the Data Map. Some examples of operations are listed below:

- Create an asset in Data Map
- Add a relationship to an asset such as owner, steward, parent, lineage, etc.
- Edit an asset to add business metadata such as description, glossary term, etc.
- Keyword search returning results to search result page.

### Storage

Storage is the second component of Data Map and includes the storage of technical, business, operational, and semantic metadata.

The technical metadata includes schema, data type, columns, and so on, that are discovered from Microsoft Purview [scanning](concept-scans-and-ingestion.md). The business metadata includes automated (for example, promoted from Power BI datasets, or descriptions from SQL tables) and manual tagging of descriptions, glossary terms, and so on. Examples of semantic metadata include the collection mapping to data sources, or classifications. The operational metadata includes Data factory copy and data flow activity run status, and runs time.

## Work with elastic data map

- **Elastic Data Map with auto-scale** – you'll start with a Data Map as low as one capacity unit that can autoscale based on load. For most organizations, this feature will lead to increased savings and a lower price point for starting data governance projects. This feature will impact pricing.

- **Enhanced scanning & ingestion** – you can track and control the population of the data assets, and classification and lineage across both the scanning and ingestion processes. This feature will impact pricing.

## Scenario

Claudia is an Azure admin at Contoso who wants to provision a new Microsoft Purview account from Azure portal. While provisioning, she doesn’t know the required size of Microsoft Purview Data Map to support the future state of the platform. However, she knows that the Microsoft Purview Data Map is billed by Capacity Units, which are affected by storage and operations throughput. She wants to provision the smallest Data Map to keep the cost low and grow the Data Map size elastically based on consumption.  

Claudia can create a Microsoft Purview account with the default Data Map size of one capacity unit that can automatically scale up and down. The autoscaling feature also allows for capacity to be tuned based on intermittent or planned data bursts during specific periods. Claudia follows the next steps in provisioning experience to set up network configuration and completes the provisioning.  

In the Azure monitor metrics page, Claudia can see the consumption of the Data Map storage and operations throughput. She can further set up an alert when the storage or operations throughput reaches a certain limit to monitor the consumption and billing of the new Microsoft Purview account.  

## Data map billing

Customers are billed for one capacity unit (25 ops/sec and 10 GB) and extra billing is based on the consumption of each extra capacity unit rolled up to the hour. The Data Map operations scale in the increments of 25 operations/sec and metadata storage scales in the increments of 10-GB size. Microsoft Purview Data Map can automatically scale up and down within the elasticity window ([check current limits](how-to-manage-quotas.md)). However, to get the next level of elasticity window, a support ticket needs to be created.

Data Map capacity units come with a cap on operations throughput and storage. If storage exceeds the current capacity unit, customers are charged for the next capacity unit even if the operations throughput isn't used. The below table shows the Data Map capacity unit ranges. Contact support if the Data Map capacity unit goes beyond 100 capacity unit.

|Data Map Capacity Unit  |Operations/Sec throughput   |Storage capacity in GB|
|----------|-----------|------------|
|1    |25      |10     |
|2    |50      |20     |
|3    |75      |30     |
|4    |100     |40     |
|5    |125     |50    |
|6    |150     |60   |
|7    |175      |70     |
|8    |200     |80    |
|9    |225      |90    |
|10    |250     |100    |
|..   |..      |..     |
|100    |2500     |1000   |

### Billing examples

- Microsoft Purview Data Map’s operation throughput for the given hour is less than or equal to 25 Ops/Sec and storage size is 1 GB. Customers are billed for one capacity unit.

- Microsoft Purview Data Map’s operation throughput for the given hour is less than or equal to 25 Ops/Sec and storage size is 15 GB. Customers are billed for two capacity units.

- Microsoft Purview Data Map’s operation throughput for the given hour is 50 Ops/Sec and storage size is 15 GB. Customers are billed for two capacity units.

- Microsoft Purview Data Map’s operation throughput for the given hour is 50 Ops/Sec and storage size is 25 GB. Customers are billed for three capacity units.

- Microsoft Purview Data Map’s operation throughput for the given hour is 250 Ops/Sec and storage size is 15 GB. Customers are billed for 10 capacity units.

### Detailed billing example

The Data Map billing example below shows a Data Map with growing metadata storage and variable operations per second over a six-hour window from 12 PM to 6 PM. The red line in the graph is operations per second consumption, and the blue dotted line is metadata storage consumption over this six-hour window:

:::image type="content" source="./media/concept-elastic-data-map/operations-and-metadata.png" alt-text="Chart depicting number of operations and growth of metadata over time.":::

Each Data Map capacity unit supports 25 operations/second and 10 GB of metadata storage. The Data Map is billed hourly. It's billed for the maximum Data Map capacity units needed within the hour, with a minimum of one capacity unit. At times, you may need more operations/second within the hour, and this will increase the number of capacity units needed within that hour. At other times, your operations/second usage may be low, but you may still need a large volume of metadata storage. The metadata storage is what determines how many capacity units you need within the hour.

The table below shows the maximum number of operations/second and metadata storage used per hour for this billing example:

:::image type="content" source="./media/concept-elastic-data-map/billing-table.png" alt-text="Table depicting max number of operations and growth of metadata over time.":::

Based on the Data Map operations/second and metadata storage consumption in this period, this Data Map would be billed for 22 capacity-unit hours over this six-hour period (1 + 3 + 4 + 5 + 6 + 3):

:::image type="content" source="./media/concept-elastic-data-map/billing-capacity-hours.png" alt-text="Table depicting number of CU hours over time.":::

>[!Important]
>Microsoft Purview Data Map can automatically scale up and down within the elasticity window ([check current limits](how-to-manage-quotas.md)). To get the next level of the elasticity window, a support ticket needs to be created.

## Increase operations throughput limit

The default limit for maximum operations per second is 10 capacity units. If you're working with a very large Microsoft Purview environment and require a higher throughput, you can request a larger capacity of elasticity window by [creating a quota request](how-to-manage-quotas.md#request-quota-increase). Select "Data map capacity unit" as the quota type and provide as much relevant information as you can about your environment and the extra capacity you would like to request.

> [!IMPORTANT]
> There's no default limit for metadata storage. As you add more metadata to your data map, it will elastically increase. 

Increasing the operations throughput limit will also increase the minimum number of capacity units. If you increase the throughput limit to 20, the minimum capacity units you'll be charged is 2 CUs. The below table illustrates the possible throughput options. The number you enter in the quota request is the minimum number of capacity units on the account.


| Minimum capacity units | Operations throughput limit |
|----------|-----------|
| 1 |10 (Default)     |
| 2 |20     |
| 3 |30     |
| 4 |40     |
| 5 |50    |
| 6 |60   |
| 7 |70     |
| 8 |80    |
| 9 |90    |
| 10 |100    |

## Monitoring the elastic data map

The metrics _data map capacity units_ and the _data map storage size_ can be monitored in order to understand the data estate size and the billing.

1. Go to the [Azure portal](https://portal.azure.com), and navigate to the **Microsoft Purview accounts** page and select your _Purview account_

1. Select **Overview** and scroll down to observe the **Monitoring** section for _Data Map Capacity Units_ and _Data Map Storage Size_ metrics over different time periods

    :::image type="content" source="./media/concept-elastic-data-map/data-map-metrics.png" alt-text="Screenshot of the menu showing the elastic data map metrics overview page.":::

1. For other settings, navigate to the **Monitoring --> Metrics** to observe the **Data Map Capacity Units** and **Data Map Storage Size**.

    :::image type="content" source="./media/concept-elastic-data-map/elastic-data-map-metrics.png" alt-text="Screenshot of the menu showing the metrics.":::

1. Select the **Data Map Capacity Units** to view the data map capacity unit usage over the last 24 hours. Observe that hovering the mouse over the line graph indicates the data map capacity units consumed at that particular time on the particular day.

    :::image type="content" source="./media/concept-elastic-data-map/data-map-capacity-default.png" alt-text="Screenshot of the menu showing the data map capacity units consumed over 24 hours.":::

1. Select the **Local Time: Last 24 hours (Automatic - 1 hour)** at the top right of the screen to modify time range displayed for the graph.

    :::image type="content" source="./media/concept-elastic-data-map/data-map-capacity-custom.png" alt-text="Screenshot of the menu showing the data map capacity units consumed over a custom time range.":::

    :::image type="content" source="./media/concept-elastic-data-map/data-map-capacity-time-range.png" alt-text="Screenshot of the menu showing the data map capacity units consumed over a three day time range.":::

1. Customize the graph type by selecting the option as indicated below.

    :::image type="content" source="./media/concept-elastic-data-map/data-map-capacity-graph-type.png" alt-text="Screenshot of the menu showing the options to modify the graph type.":::

1. Select the **New chart** to add the graph for the Data Map Storage Size chart.

    :::image type="content" source="./media/concept-elastic-data-map/data-map-storage-size.png" alt-text="Screenshot of the menu showing the data map storage size used.":::

## Summary

With elastic Data Map, Microsoft Purview provides low-cost barrier for customers to start their data governance journey.
Microsoft Purview Data Map can grow elastically with pay as you go model starting from as small as one Capacity unit.
Customers don’t need to worry about choosing the correct Data Map size for their data estate at provision time and deal with platform migrations in the future due to size limits.

## Next Steps

- [Create a Microsoft Purview account](create-catalog-portal.md)
- [Microsoft Purview Pricing](https://azure.microsoft.com/pricing/details/azure-purview/)
