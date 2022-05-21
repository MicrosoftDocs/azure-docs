---
title: "Migrate from Azure Database for PostgreSQL Single Server to Flexible Server - Concepts"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Concepts about migrating your Single server to Azure database for PostgreSQL Flexible server.
author: shriram-muthukrishnan
ms.author: shriramm
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/11/2022
ms.custom: "mvc, references_regions"
---

# Migrate from Azure Database for PostgreSQL Single Server to Flexible Server (Preview)

>[!NOTE]
> Single Server to Flexible Server migration feature is in public preview.

Azure Database for PostgreSQL Flexible Server provides zone redundant high availability, control over price, and control over maintenance window.  Single to Flexible Server Migration feature enables customers to migrate their databases from Single server to Flexible. See this [documentation](../flexible-server/concepts-compare-single-server-flexible-server.md) to understand the differences between Single and Flexible servers. Customers can initiate migrations for multiple servers and databases in a repeatable fashion using this migration feature. This feature automates most of the steps needed to do the migration and thus making the migration journey across Azure platforms as seamless as possible. The feature is provided free of cost for customers.

Single to Flexible server migration is enabled in **Preview** in  Australia Southeast, Canada Central, Canada East, East Asia, North Central US, South Central US, Switzerland North, UAE North, UK South, UK West, West US, and Central US.

## Overview

Single to Flexible server migration feature provides an inline experience to migrate databases from Single Server (source) to Flexible Server (target).

You choose the source server and can select up to **8** databases from it. This limitation is per migration task. The migration feature automates the following steps:

1. Creates the migration infrastructure in the region of the target flexible server
2. Creates public IP address and attaches it to the migration infrastructure
3. Allow-listing of migration infrastructure’s IP address on the firewall rules of both source and target servers
4. Creates a migration project with both source and target types as Azure database for PostgreSQL
5. Creates a migration activity to migrate the databases specified by the user from source to target.
6. Migrates schema from source to target
7. Creates databases with the same name on the target Flexible server
8. Migrates data from source to target

Following is the flow diagram for Single to Flexible migration feature.
:::image type="content" source="./media/concepts-single-to-flexible/concepts-flow-diagram.png" alt-text="Diagram that shows Single to Flexible Server migration." lightbox="./media/concepts-single-to-flexible/concepts-flow-diagram.png":::
    
**Steps:**
1. Create a Flex PG server
2. Invoke migration
3. Migration infrastructure provisioned (DMS)
4. Initiates migration – (4a) Initial dump/restore (online & offline) (4b) streaming the changes (online only)
5. Cutover to the target
   
The migration feature is exposed through **Azure Portal** and via easy-to-use **Azure CLI** commands. It allows you to create migrations, list migrations, display migration details, modify the state of the migration, and delete   migrations

## Migration modes comparison

Single to Flexible Server migration supports online and offline mode of migrations. Online option provides reduced downtime migration with logical replication restrictions while the offline option offers a simple migration but may incur extended downtime depending on the size of databases.

The following table summarizes the differences between these two modes of migration.

|    Capability        | Online | Offline |
|:---------------|:-------------|:-----------------|
| Database availability for reads during migration | Available | Available |
| Database availability for writes during migration | Available | Generally, not recommended. Any writes initiated after the migration is not captured or migrated |
| Application Suitability | Applications that need maximum uptime | Applications that can afford a planned downtime window |
| Environment Suitability | Production environments | Usually Development, Testing environments and some production that can afford  downtime |
| Suitability for Write-heavy workloads | Suitable but expected to reduce the workload during migration | Not Applicable. Writes at source after migration begins are not replicated to target. |
| Manual Cutover | Required | Not required |
| Downtime Required | Less | More |
| Logical replication limitations  | Applicable | Not Applicable |
| Migration time required  | Depends on Database size and the write activity until cutover | Depends on Database size |

**Migration steps involved for Offline mode** = Dump of the source Single Server database followed by the Restore at the target Flexible server.

The following table shows the approximate time taken to perform offline migrations for databases of various sizes.  

>[!NOTE]
> Add ~15 minutes for the migration infrastructure to get deployed for each migration task, where each task can migrate up to 8 databases.

| Database Size | Approximate Time Taken (HH:MM) |
|:---------------|:-------------|
| 1 GB | 00:01 |
| 5 GB | 00:05 |
| 10 GB | 00:10 |
| 50 GB | 00:45 |
| 100 GB | 06:00 |
| 500 GB | 08:00 |
| 1000 GB | 09:30 |

**Migration steps involved for Online mode** = Dump of the source Single Server database(s), Restore of that dump in the target Flexible server, followed by Replication of ongoing changes (change data capture using logical decoding).

The time taken for an online migration to complete is dependent on the incoming writes to the source server. The higher the write workload is on the source, the more time it takes for the data to the replicated to the target flexible server.

Based on the above differences, pick the mode that best works for your workloads.



## Migration steps

### Pre-requisites

Follow the steps provided in this section before you get started with the single to flexible server migration feature.

- **Target Server Creation** - You need to create the target PostgreSQL flexible server before using the migration feature. Use the creation [QuickStart guide](../flexible-server/quickstart-create-server-portal.md) to create one.

- **Source Server pre-requisites** - You must [enable logical replication](./concepts-logical.md) on the source server.

    :::image type="content" source="./media/concepts-single-to-flexible/logical-replication-support.png" alt-text="Screenshot of logical replication support in Azure portal." lightbox="./media/concepts-single-to-flexible/logical-replication-support.png":::

>[!NOTE]
> Enabling logical replication will require a server reboot for the change to take effect.

- **Azure Active Directory App set up** - It is a critical component of the migration feature. Azure AD App helps with role-based access control as the migration feature needs access to both the source and target servers. See [How to setup and configure Azure AD App](./how-to-setup-azure-ad-app-portal.md) for step-by-step process.

### Data and schema migration

Once all these pre-requisites are taken care of, you can do the migration. This automated step involves schema and data migration using Azure portal or Azure CLI.

- [Migrate using Azure portal](./how-to-migrate-single-to-flexible-portal.md)
- [Migrate using Azure CLI](./how-to-migrate-single-to-flexible-cli.md)

### Post migration

- All the resources created by this migration tool will be automatically cleaned up irrespective of whether the migration has **succeeded/failed/cancelled**. There is no action required from you.

- If your migration has failed and you want to retry the migration, then you need to create a new migration task with a different name and retry the operation.

- If you have more than eight databases on your single server and if you want to migrate them all, then it is recommended to create multiple migration tasks with each task migrating up to eight databases.

- The migration does not move the database users and roles of the source server. This has to be manually created and applied to the target server post migration.

- For security reasons, it is highly recommended to delete the Azure Active Directory app once the migration completes.

- Post data validations and making your application point to flexible server, you can consider deleting your single server.

## Limitations

### Size limitations

- Databases of sizes up to 1TB can be migrated using this feature. To migrate larger databases or heavy write workloads, reach out to your account team or reach us @ AskAzureDBforPGS2F@microsoft.com.

- In one migration attempt, you can migrate up to eight user databases from a single server to flexible server. In case you have more databases to migrate, you can create multiple migrations between the same single and flexible servers.

### Performance limitations

- The migration infrastructure is deployed on a 4 vCore VM which may limit the migration performance. 

- The deployment of migration infrastructure takes ~10-15 minutes before the actual data migration starts - irrespective of the size of data or the migration mode (online or offline).

### Replication limitations

- Single to Flexible Server migration feature uses logical decoding feature of PostgreSQL to perform the online migration and it comes with the following limitations. See PostgreSQL documentation for [logical replication limitations](https://www.postgresql.org/docs/10/logical-replication-restrictions.html).
  - **DDL commands** are not replicated.
  - **Sequence** data is not replicated.
  - **Truncate** commands are not replicated.(**Workaround**: use DELETE instead of TRUNCATE. To avoid accidental TRUNCATE invocations, you can revoke the TRUNCATE privilege from tables)

  - Views, Materialized views, partition root tables and foreign tables will not be migrated.

- Logical decoding will use resources in the source single server. Consider reducing the workload or plan to scale CPU/memory resources at the Source Single Server during the migration.

### Other limitations

- The migration feature migrates only data and schema of the single server databases to flexible server. It does not migrate other features such as server parameters, connection security details, firewall rules, users, roles and permissions. In other words, everything except data and schema must be manually configured in the target flexible server.

- It does not validate the data in flexible server post migration. The customers must manually do this.

- The migration tool only migrates user databases including Postgres database and not system/maintenance databases.

- For failed migrations, there is no option to retry the same migration task. A new migration task with a unique name can to be created.

- The migration feature does not include assessment of your single server. 

## Best practices

- As part of discovery and assessment, take the server SKU,  CPU usage, storage, database sizes, and extensions usage as some of the critical data to help with migrations.
- Plan the mode of migration for each database. For less complex migrations and smaller databases, consider offline mode of migrations.
- Batch similar sized databases in a migration task.  
- Perform large database migrations with one or two databases at a time to avoid source-side load and migration failures.
- Perform test migrations before migrating for production.
  - **Testing migrations** is a very important aspect of database migration to ensure that all aspects of the migration are taken care of, including application testing. The best practice is to begin by running a migration entirely for testing purposes. Start a migration, and after it enters the continuous replication (CDC) phase with minimal lag, make your flexible server as the primary database server and use it for testing the application to ensure expected performance and results. If you are doing migration to a higher Postgres version, test for your application compatibility.

  - **Production migrations** - Once testing is completed, you can migrate the production databases. At this point you need to finalize the day and time of production migration. Ideally, there is low application use at this time. In addition, all stakeholders that need to be involved should be available and ready. The production migration would require close monitoring. It is important that for an online migration, the replication is completed before performing the cutover to prevent data loss.

- Cut over all dependent applications to access the new primary database and open the applications for production usage.
- Once the application starts running on flexible server, monitor the database performance closely to see if performance tuning is required.

## Next steps

- [Migrate to Flexible Server using Azure portal](./how-to-migrate-single-to-flexible-portal.md).
- [Migrate to Flexible Server using Azure CLI](./how-to-migrate-single-to-flexible-cli.md)