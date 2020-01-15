---
title: What is Azure Synapse Analytics' shared Meta Data Model #Required; update as needed page title displayed in search results. Include the brand.
description: Azure Synapse Analytics provides a shared meta data model where creating a database or table in Spark will make it accessible from its SQL Analytics and SQL Pool engines without duplicating the data or requiring user action. #Required; Add article description that is displayed in search results.
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: MikeRys #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/02/2019 #Update with current date; mm/dd/yyyy format.
ms.author: mrys #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---


# What is Azure Synapse Analytics' shared Meta Data Model? 
<!---Required: 
For the H1 - that's the primary heading at the top of the article - use the format "What is <service>?"
You can also use this in the TOC if your service name doesn’t cause the phrase to wrap.
--->

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark Pools, SQL Analytics On-Demand engine and SQL Pools. 

In the current public preview, the sharing is designed to support the so-called modern data warehouse pattern and gives the workspace's SQL engines access to databases and tables created with Spark while also allowing the SQL engines to create their own objects that are not being shared with the other engines.

## Supporting the Modern Data Warehouse Pattern with Shared Meta Data

The shared meta data model supports the modern data warehouse pattern as shown in Figure 1 below:

1. Data from the data lake is being prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) tables contained in a database.

2. The Spark created databases and their tables will become visible in any of the Synapse workspace's Spark Pool instances and can be used from any of the Spark jobs, subject to the [permissions](#Security-model-at-a-glance). 

3. The Spark created databases and their tables will also become visible in the SQL Analytics On-Demand engine. [Databases](azure-synapse-metadata-database.md) are being created automatically in the SQL Analytics On-Demand meta data, and both the [external and managed tables](azure-synapse-metadata-table.md) created by a Spark job will be made accessible as external tables in the SQL Analytics On-Demand meta data in the `dbo` schema of the corresponding database. <!--For more details, see [ADD LINK].-->

4. If there are SQL Analytics Pools in the workspace that have their meta data synchronization enabled [ADD LINK] or if a new SQL Pool is being created with the meta data synchronization enabled, the Spark created databases and their tables will be mapped automatically into the SQL Pool's database as follows: The databases generated in Spark are mapped to special schemas inside the SQL Pool's database. Each such schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark generated database are exposed as external tables in the corresponding special schema. <!--For more details, see [ADD LINK].-->

[INSERT PICTURE]

__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with Shared Meta Data

These shared meta data objects can now be queried (but not updated or changed) by the SQL engines that have access to them. 

## Which Meta Data Objects are shared?

Spark allows you to create databases, external and managed tables as well as views. However, since Spark views require a Spark engine to process the defining SparkSQL statement, only databases and their contained external and managed tables are being shared with the workspace's SQL engines. Views are only shared among the Spark Pool instances.

## Security model at a glance

In the current public preview, the Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. When the table is being queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through, down to the underlying files, and permissions are checked at the file system level.

<!-- For more details, see [ADD LINK].-->

## Change maintenance

If a meta data object gets deleted or changed with Spark, the changes will be picked up and propagated to the workspace's SQL Analytics On-Demand Engine as well as the workspace's SQL Analytics Pools that have the objects synchronized. As with the initial synchronization, this will occur asynchronously and be reflected in the SQL engines after a short delay.

## Next steps

- [Learn more about Azure Synapse Analytics' shared Meta Data Databases](azure-synapse-metadata-database.md)
- [Learn more about Azure Synapse Analytics' shared Meta Data Tables](azure-synapse-metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics On-Demand]()
- [Learn more about the Synchronization with SQL Analyiics Pools]()

<!---Some context for the following links goes here--->
<!--- [link to next logical step for the customer](quickstart-view-occupancy.md)--->

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".


--->
