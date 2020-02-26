---
title: Azure Synapse Analytics shared metadata tables 
description: Azure Synapse Analytics provides a shared metadata model where creating a table in Spark will make it accessible from its SQL Analytics and SQL Pool engines without duplicating the data. 
services: sql-data-warehouse 
author: MikeRys 
ms.service: sql-data-warehouse 
ms.topic: overview 
ms.subservice: 
ms.date: 10/23/2019 
ms.author: mrys 
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared metadata tables


Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark Pools, SQL Analytics On-Demand engine and SQL Pools. 

[!INCLUDE [synapse-analytics-preview-terms](../../includes/synapse-analytics-preview-terms.md)]

The sharing supports the modern data warehouse pattern and gives the workspace SQL engines access to databases and tables created with Spark while also allowing the SQL engines to create their own objects that are not being shared with the other engines.

## Support the modern data warehouse

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

The shared metadata model supports the modern data warehouse pattern in the following ways:

* Data from the data lake is prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) tables contained in possibly several databases.

* The Spark created databases and their tables become visible in any of the Azure Synapse workspace Spark pool instances and can be used from any of the Spark jobs. This is subject to the [permissions](#security-model-at-a-glance) since all Spark pools in a workspace share the same underlying catalog meta store. 

* The Spark created databases and their tables become visible in the workspace SQL on-demand engine. [Databases](metadata-database.md) are created automatically in the SQL on-demand metadata, and both the [external and managed tables](metadata-table.md) created by a Spark job are made accessible as external tables in the SQL on-demand metadata in the `dbo` schema of the corresponding database. <!--For more details, see [ADD LINK].-->

* If there are SQL pool instances in the workspace that have their metadata synchronization enabled <!--[ADD LINK]--> or if a new SQL pool instance is created with the metadata synchronization enabled, the Spark created databases and their tables will be mapped automatically into the SQL pool database as described in [Azure Synapse Analytics shared database](metadata-database.md).

<!--For more details, see [ADD LINK].-->

<!--[INSERT PICTURE]-->

<!--__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with Shared metadata-->

The object synchronization occurs asynchronously. Objects will have a slight delay of a few seconds until they appear. Once they appear, they can be queried, but not updated nor changed by the SQL engines that have access to them. 

## Security model at a glance

The Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. When the table is being queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is passed through, to the underlying files, and permissions are checked at the file system level.

<!--For more details, see [ADD LINK].-->

## Change maintenance

Change maintenance.

<!---Required:
The introductory paragraph helps customers quickly determine whether an article is relevant.
Describe in customer-friendly terms what the service is and does, and why the customer should care. Keep it short for the intro.
You can go into more detail later in the article. Many services add artwork or videos below the introduction.
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

<!---Screenshots and videos can add another way to show and tell the overview story. But don’t overdo them. Make sure that they offer value for the overview.
If users access your product/service via a web browser, the first screenshot should always include the full browser window in Chrome or Safari. This is to show users that the portal is browser-based - OS and browser agnostic.


--->

## <article body>
<!---
After the intro, you can develop your overview by discussing the features that answer the "Why should I care" question with a bit more depth.
Be sure to call out any basic requirements and dependencies, as well as limitations or overhead.
Don't catalog every feature, and some may only need to be mentioned as available, without any discussion.
--->

## <Top task>
<!---Suggested:
An effective way to structure you overview article is to create an H2 for the top customer tasks identified in milestone one of the [APEX content model](contribute-get-started-mvc.md) and describe how the product/service helps customers with that task.
Create a new H2 for each task you list.


--->

## Next steps

<!---Some context for the following links goes here--->
<!--- [link to next logical step for the customer](quickstart-view-occupancy.md)--->

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".


--->
