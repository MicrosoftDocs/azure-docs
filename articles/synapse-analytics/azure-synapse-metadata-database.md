---
title: Azure Synapse Analytics' shared Database #Required; update as needed page title displayed in search results. Include the brand.
description: Azure Synapse Analytics provides a shared meta data model where creating a database in Spark will make it accessible from its SQL Analytics On-Demand and SQL Analytics Pool engines. #Required; Add article description that is displayed in search results.
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: MikeRys #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/23/2019 #Update with current date; mm/dd/yyyy format.
ms.author: mrys #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Azure Synapse Analytics' shared Database

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark Pools, SQL Analytics On-Demand engine and SQL Analytics Pools. 

Once a database has been created with a Spark job, that database will become visible as a database with that same name to all current and future Spark Pools in the workspace as well as the SQL Analytics On-Demand engine. 

If there are SQL Analytics Pools in the workspace that have their meta data synchronization enabled or if a new SQL Pool is being created with the meta data synchronization enabled, these Spark created databases will be mapped automatically into the SQL Pool's database to special schemas inside the SQL Pool's database. Each such schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark generated database are exposed as external tables in the corresponding special schema. 

The Spark's default database, called `default`, will also be visible in the SQL Analytics On-Demand context as a database called `default`, and in any of the SQL Analytics Pool databases as the schema `$default`.

Since the databases are synchronized to SQL Analytics On-Demand and the SQL Analytics Pools asynchronously, there will be a delay until they appear.

If SQL Analytics On-Demand already has created a database of that name, an error is raised and the synchronization fails. If you want to have the database accessible from within SQL Analytics On-Demand, you will have to choose a different name that is not in conflict.

## Security model

In the current public preview, the Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. 

The security principal who creates a database, is considered the owner of that database and has all the rights to the database and its object.

In order to give a security principal, e.g., a user or a security group, access to a database, you want to provide the appropriate POSIX folder and file permissions to the underlying folders and files in the `warehouse` directory. For example, in order for a security principal to be able to read a table in a database, all the folders starting at the database folder in the `warehouse` directory need to have X and R permissions assigned to that security principal and files (such as the table's underlying data files) require R permissions. If a security principal requires the ability to create objects or drop objects in a database, additional W permissions are required on the folders and files in the `warehouse` folder.

<!-- ## Example: TBD -->

## Next steps
- [Learn more about Azure Synapse Analytics' shared Meta Data](azure-synapse-metadata-overview.md)
- [Learn more about Azure Synapse Analytics' shared Meta Data Tables](azure-synapse-metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics On-Demand]()
- [Learn more about the Synchronization with SQL Analyiics Pools]()
