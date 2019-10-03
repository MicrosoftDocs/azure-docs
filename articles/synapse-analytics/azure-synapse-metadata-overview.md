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

<!---Recommended: Remove all the comments in this template before you sign-off or merge to master.--->

<!---overview articles are for new customers and explain the service from a technical point of view.
They are not intended to define benefits or value prop; that would be in marketing content.
--->

# What is Azure Synapse Analytics' shared Meta Data Model? 
<!---Required: 
For the H1 - that's the primary heading at the top of the article - use the format "What is <service>?"
You can also use this in the TOC if your service name doesn’t cause the phrase to wrap.
--->

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark Pools, SQL Analytics On-Demand engine and SQL Pools. 

In the current public preview, the sharing is designed to support the so-called modern data warehouse pattern and gives the workspace's SQL engines access to databases and tables created with Spark while also allowing the SQL engines to create their own objects that are not being shared with the other engines.

## Supporting the Modern Data Warehouse Pattern with Shared Meta Data

The shared meta data model supports the modern data warehouse pattern as showin in Figure 1 below:

1. data from the data lake is being prepared and structured efficiently with Spark by storing the prepared data in (possibly partitioned) tables contained in a database.

2. The Spark created databases and their tables will become visible in the SQL Analytics On-Demand engine. Databases [ADD LINK] are being created automatically in the SQL Analytics On-Demand meta data, and both the external and managed tables [ADD LINK] created by a Spark job will be made accessible as external tables in the SQL Analytics On-Demand meta data in the `dbo` schema of the corresponding database. For more details, see [ADD LINK].

3. If there are SQL Analytics Pools in the workspace that have their meta data synchronization enabled [ADD LINK] or if a new SQL Pool is being created with the meta data synchronization enabled, the Spark created databases and their tables will be mapped automatically into the SQL Pool's database as follows: The databases generated in Spark are mapped to special schemas inside the SQL Pool's database. Each such schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark generated database are exposed as external tables in the corresponding special schema. For more details, see [ADD LINK].

[INSERT PICTURE]

__Figure 1 -__ Supporting the Modern Data Warehouse Pattern with Shared Meta Data

These shared meta data objects can now be queried (but not updated or changed) by the SQL engines that have access to them. 

## Security model at a glance

In the current public preview, the Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. When the table is being queried by any of the engines that the query submitter has the right to use, the query submitter's security principal is being passed through, down to the underlying files, and permissions are checked at the file system level.

For more details, see [ADD LINK].

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
