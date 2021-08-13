---
title: Elastic data map
description: This article explains the concepts of the Elastic Data Map in Azure Purview
author: chanuengg
ms.author: csugunan
ms.service: purview
ms.subservice: purview-data-map
ms.topic: conceptual
ms.date: 08/16/2021
ms.custom: template-concept 
---

# Elastic data map in Azure Purview

Azure Purview Data Map provides the foundation for data discovery and effective data governance. It captures metadata about enterprise data present in analytics, software-as-a-service (SaaS), operation systems on-premises, hybrid, and multi-cloud environments. Purview Data Map is automatically kept up to date with built-in automated scanning and classification system. With an intuitive UI, developers can further programmatically interact with the Data Map using open-source Apache Atlas APIs.

## Elastic data map

All Azure Purview accounts have a Data Map that can elastically grow starting at one capacity unit. They scale up and down based on request load within the elasticity window ([check current limits](how-to-manage-quotas.md)). You can request an increase in quota with a larger capacity of elasticity window by completing the [survey here](https://aka.ms/PurviewProdSurvey).

## Data map capacity unit

Elastic Data Map comes with an operation throughput component and storage component that are represented as Capacity Unit (CU). All Azure Purview accounts, by default, come with one capacity unit and elastically grow based on usage. Each Data Map capacity unit includes a throughput of 25 operations/sec and 2GB of metadata storage limit.  

### Operations

Operation is the throughput measure of the Purview Data Map and it includes the Create, Read, Write, Update, Delete operations on metadata stored in the Data Map. Some examples of an operation are listed below:

- Create an asset in Data Map
- Add a relationship to an asset such as owner, steward, parent, lineage, etc.
- Edit an asset to add business metadata such as description, glossary term, etc.
- Keyword search returning results to search result page.

### Storage

Storage is the second component of DataMap that includes technical, business, and semantic metadata. The technical metadata includes schema, data type, columns, and so on that are automatically discovered from Purview scanning and classification. The business metadata includes automated (for example, promoted  from Power BI datasets, descriptions from SQL tables) and manual tagging of descriptions, glossary terms and so on.  

## Data map billing

Customers are at minimum billed for one capacity unit (25 ops/sec and 2GB) and extra billing is based on the consumption of each extra capacity unit rolled up to the hour. The DataMap operations scale in the increments of 25 operations/sec and metadata storage scales in the increments of 2GB size. Purview Data Map can automatically scale up and down within the elasticity window ([check current limits](how-to-manage-quotas.md)). However, to get the next level of elasticity window, support ticket needs to be created.

Data Map Capacity unit comes with a cap on operations throughput and storage. If storage exceeds the current capacity unit, customers are charged for the next capacity unit even if the operations throughput isn't used. The below table shows the Data Map capacity unit ranges. Contact support if the Data Map capacity unit goes beyond 100 capacity unit.

|Data Map Capacity Unit  |Operations/Sec throughput   |Storage capacity in GB|
|----------|-----------|------------|
|1    |25      |2     |
|2    |50      |4     |
|3    |75      |6     |
|4    |100     |8     |
|5    |125     |10    |
|6    |150     |12   |
|7    |175      |14     |
|8    |200     |16    |
|9    |225      |18    |
|10    |250     |20    |
|..   |..      |..     |
|100    |2500     |200   |

### Billing examples

- Purview Data Map’s operation throughput for the given hour is less than or equal to 25 Ops/Sec and storage size is 1GB. Customers are billed for one capacity unit.

- Purview Data Map’s operation throughput for the given hour is less than or equal to 25 Ops/Sec and storage size is 3GB. Customers are billed for two capacity unit.

- Purview Data Map’s operation throughput for the given hour is 50 Ops/Sec and storage size is 1GB. Customers are billed for two capacity unit.

- Purview Data Map’s operation throughput for the given hour is 50 Ops/Sec and storage size is 5GB. Customers are billed for three capacity unit.

- Purview Data Map’s operation throughput for the given hour is 250 Ops/Sec and storage size is 5GB. Customers are billed for 10 capacity unit.


### Detailed billing example

The Data Map billing example below shows a Data Map with growing metadata storage and variable operations per second consumption over a six-hour window from 12 PM to 6 PM. The red line in the graph below is operations per second consumption and the blue dotted line is metadata storage consumption over this six-hour window: 

:::image type="content" source="./media/concept-elastic-data-map/operations-and-metadata.png" alt-text="Chart depicting number of operations and growth of metadata over time.":::

Each Data Map capacity unit supports 25 operations/second and 2GB of metadata storage. The Data Map is billed on an hourly basis. You are billed for the maximum Data Map capacity unit needed within the hour. At times, you may need more operations/second within the hour, and this will increase the number of capacity units needed within that hour. At other times, your operations/second usage may be low, but you may still need a large volume of metadata storage. In this case, the metadata storage is what determines how many capacity units you need within the hour. 

The table below shows the maximum number of operations/second and metadata storage used per hour for this billing example: 

:::image type="content" source="./media/concept-elastic-data-map/billing-table.png" alt-text="Table depicting max number of operations and growth of metadata over time.":::

Based on the Data Map operations/second and metadata storage consumption in this period, this Data Map would be billed for 20 capacity-unit hours over this six-hour period (1 + 3 + 4 + 3 + 6 + 3): 

:::image type="content" source="./media/concept-elastic-data-map/billing-capacity-hours.png" alt-text="Table depicting number of CU hours over time.":::


## Working with elastic data map

- **Elastic Data Map with auto-scale** – you will start with a Data Map as low as one capacity unit that can autoscale based on load. For most organizations, this feature will lead to increased savings and a lower price point for starting with data governance projects. This feature will impact pricing.

- **Enhanced scanning & ingestion** – you can track and control the population of the data assets, and classification and lineage across both the scanning and ingestion processes. This feature will impact pricing.

- **Advanced resource set** – you can reduce the size of the Data Map by processing partitioned files in a data lake such that it’s treated as a single data asset called as [resource set](concept-resource-sets.md). This is an optional feature that will impact pricing.

## Scenario

Claudia is an Azure admin at Contoso who wants to provision a new Azure Purview account from Azure portal. While provisioning, she doesn’t know the required size of Purview DataMap to support the future state of the platform. However, she knows that the Purview Data Map is billed by Capacity Units that has a storage and operations throughput component. She wants to provision the smallest Data Map to keep the cost low and grow the Data Map size elastically based on consumption.  

With few clicks Claudia can create a Purview account with the default Data Map size of 1 capacity unit that can automatically scale up and down. The auto-scaling feature also allows for capacity to be tuned based on intermittent or planned data bursts during specific periods. Claudia follows the next steps in provisioning experience to set up network configuration and completes the provisioning.  

In the Azure monitor metrics page, Claudia can see the consumption of the Data Map storage and operations throughput. She can further set up an alert when the storage or operations throughput reaches a certain limit to monitor the consumption and billing of the new Purview account.  

## Summary

With elastic Data Map, Purview provides low-cost barrier for customers to start their data governance journey.
Purview DataMap can grow elastically with pay as you go model starting from as small as 1 Capacity unit  
Customers don’t need to worry about choosing the correct Data Map size for their data estate at provision time and deal with platform migrations in the future due to size limits.

## Next Steps

- [Create an Azure Purview account](create-catalog-portal.md)
- [Purview Pricing](https://azure.microsoft.com/pricing/details/azure-purview/)
