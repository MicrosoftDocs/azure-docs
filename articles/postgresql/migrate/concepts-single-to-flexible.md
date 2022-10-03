---
title: "Migration tool - Azure Database for PostgreSQL Single Server to Flexible Server - Concepts"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Concepts about migrating your Single server to Azure database for PostgreSQL Flexible server.
author: shriram-muthukrishnan
ms.author: shriramm
ms.service: postgresql
ms.topic: conceptual
ms.date: 08/31/2022
ms.custom: "mvc, references_regions"
---

# Migration tool - Azure Database for PostgreSQL Single Server to Flexible Server (preview)

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

Azure Database for PostgreSQL Flexible Server provides zone-redundant high availability, control over price, and control over maintenance windows. You can use the available migration tool to move your databases from Single Server to Flexible Server. To understand the differences between the two deployment options, see [this comparison chart](../flexible-server/concepts-compare-single-server-flexible-server.md).

Single to Flexible server migration tool is designed to help you with your migration from Single to flexible server task. The tool allows you to initiate migrations for multiple servers and databases in a repeatable way. The tool automates most of the migration steps to make the migration journey across Azure platforms as seamless as possible. The tool is offered **free of cost**.

>[!NOTE]
> The migration tool is in public preview. Feature, functionality, and user interfaces are subject to change. Migration initiation from Single Server is enabled in preview in these regions: Central US, West US, South Central US, North Central US, East Asia, Switzerland North, Australia South East, UAE North, UK West and Canada East. However, you can use the migration wizard from the Flexible Server side as well, in all regions.

## Recommended migration path

The migration tool is agnostic of source and target PostgreSQL versions. Here are some guidelines. 

| Source Postgres version (Single Server) | Suggested Target Postgres version (Flexible server) | Remarks |
|:---------------|:-------------|:-----------------|
| Postgres 9.5 (Retired) | Postgres 13 | You can even directly migrate to Postgres 14. Verify your application compatibility. |
| Postgres 9.6 (Retired) | Postgres 13 | You can even directly migrate to Postgres 14. Verify your application compatibility. |
| Postgres 10 (Retiring Nov'22) | Postgres 14 |  Verify your application compatibility. |
| Postgres 11  | Postgres 14 | Verify your application compatibility. |
| Postgres 11  | Postgres 11 | You can choose to migrate to the same version in Flexible Server. You can then upgrade to a higher version in Flexible Server |

>[!IMPORTANT]
> If Flexible Server is not available in your Single Server region, you may choose to deploy Flexible server in an [alternate region](../flexible-server/overview.md#azure-regions). We continue to add support for more regions with Flexible server. 


## Overview

The migration tool provides an inline experience to migrate databases from Single Server (source) to Flexible Server (target).

You choose the source server and can select up to eight databases from it. This limitation is per migration task. The migration tool automates the following steps:

1. Creates the migration infrastructure in the region of the target server.
2. Creates a public IP address and attaches it to the migration infrastructure.
3. Adds the migration infrastructure's IP address to the allowlist on the firewall rules of both the source and target servers.
4. Creates a migration project with both source and target types as Azure Database for PostgreSQL.
5. Creates a migration activity to migrate the databases specified by the user from the source to the target.
6. Migrates schemas from the source to the target.
7. Creates databases with the same name on the Flexible Server target.
8. Migrates data from the source to the target.

The following diagram shows the process flow for migration from Single Server to Flexible Server via the migration tool.

:::image type="content" source="./media/concepts-single-to-flexible/concepts-flow-diagram.png" alt-text="Diagram that shows the Migration from Single Server to Flexible Server." lightbox="./media/concepts-single-to-flexible/concepts-flow-diagram.png":::

The steps in the process are:

1. Create a Flexible Server target.
2. Invoke migration.
3. Provision the migration infrastructure by using Azure Database Migration Service.
4. Start the migration.
   1. Initial dump/restore (online and offline)
   1. Streaming the changes (online only)
5. Cut over to the target.

The migration tool is exposed through the Azure portal and through easy-to-use Azure CLI commands. It allows you to create migrations, list migrations, display migration details, modify the state of the migration, and delete migrations.

## Comparison of migration modes

The tool supports two modes for migration from Single Server to Flexible Server. The *online* option provides reduced downtime for the migration, with logical replication restrictions. The *offline* option offers a simple migration but might incur extended downtime, depending on the size of databases.

The following table summarizes the differences between the migration modes.

|    Capability        | Online | Offline |
|:---------------|:-------------|:-----------------|
| Database availability for reads during migration | Available | Available |
| Database availability for writes during migration | Available | Generally not recommended, because any writes initiated after the migration are not captured or migrated |
| Application suitability | Applications that need maximum uptime | Applications that can afford a planned downtime window |
| Environment suitability | Production environments | Usually development environments, testing environments, and some production environments that can afford  downtime |
| Suitability for write-heavy workloads | Suitable but expected to reduce the workload during migration | Not applicable, because writes at the source after migration begins are not replicated to the target |
| Manual cutover | Required | Not required |
| Downtime required | Less | More |
| Logical replication limitations  | Applicable | Not applicable |
| Migration time required  | Depends on the database size and the write activity until cutover | Depends on the database size |

Based on those differences, pick the mode that best works for your workloads.

### Migration considerations for offline mode

The migration process for offline mode entails a dump of the source Single Server database, followed by a restore at the Flexible Server target.

The following table shows the approximate time for performing offline migrations for databases of various sizes.  

>[!NOTE]
> Add about 15 minutes for the migration infrastructure to be deployed for each migration task. Each task can migrate up to eight databases.

| Database size | Approximate time taken (HH:MM) |
|:---------------|:-------------|
| 1 GB | 00:01 |
| 5 GB | 00:05 |
| 10 GB | 00:10 |
| 50 GB | 00:45 |
| 100 GB | 06:00 |
| 500 GB | 08:00 |
| 1,000 GB | 09:30 |

### Migration considerations for online mode

The migration process for online mode entails a dump of the Single Server database(s), a restore of that dump in the Flexible Server target, and then replication of ongoing changes. You capture change data by using logical decoding.

The time for completing an online migration depends on the incoming writes to the source server. The higher the write workload is on the source, the more time it takes for the data to be replicated to Flexible Server.

To begin the migration in either Online or Offline mode, you can get started with the Prerequisites below.

## Migration prerequisites

>[!NOTE]
> It is very important to complete the prerequisite steps in this section before you initiate a migration using this tool.

#### Register your subscription for Azure Database Migration Service

   1. On the Azure portal, go to the subscription of your Target server.

      :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-azure-portal.png" alt-text="Screenshot of Azure portal subscription details." lightbox="./media/concepts-single-to-flexible/single-to-flex-azure-portal.png":::

   2. On the left menu, select **Resource Providers**. Search for **Microsoft.DataMigration**, and then select **Register**.

      :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-register-data-migration.png" alt-text="Screenshot of the Register button for Azure Data Migration Service." lightbox="./media/concepts-single-to-flexible/single-to-flex-register-data-migration.png":::

#### Enable logical replication

   [Enable logical replication](../single-server/concepts-logical.md) on the source server.

   :::image type="content" source="./media/concepts-single-to-flexible/logical-replication-support.png" alt-text="Screenshot of logical replication support in the Azure portal." lightbox="./media/concepts-single-to-flexible/logical-replication-support.png":::

   >[!NOTE]
   > Enabling logical replication will require a server restart for the change to take effect.

#### Create an Azure Database for PostgreSQL Flexible server

   [Create an Azure Database for PostgreSQL Flexible server](../flexible-server/quickstart-create-server-portal.md) which will be used as the Target (if not created already).

#### Set up and configure an Azure Active Directory (Azure AD) app

   [Set up and configure an Azure Active Directory (Azure AD) app](./how-to-set-up-azure-ad-app-portal.md). An Azure AD app is a critical component of the migration tool. It helps with role-based access control as the migration tool accesses both the source and target servers.

#### Assign contributor roles to Azure resources

   Assign [contributor roles](./how-to-set-up-azure-ad-app-portal.md#add-contributor-privileges-to-an-azure-resource) to source server, target server and the migration resource group. In case of private access for source/target server, add Contributor privileges to the corresponding VNet as well.

#### Verify replication privileges for Single server's admin user

   Please run the following query to check if single server's admin user has replication privileges.

```
   SELECT usename, userepl FROM pg_catalog.pg_user;
```

   Verify that the **userpl** column for the single server's admin user has the value **true**. If it is set to **false**, please grant the replication privileges to the admin user by running the following query on the single server.

 ```
   ALTER ROLE <adminusername> WITH REPLICATION;
```

#### Allow-list required extensions

   If you are using any PostgreSQL extensions on the Single Server, it has to be allow-listed on the Flexible Server before initiating the migration using the steps below:

   1. Use select command in the Single Server environment to list all the extensions in use.

      ```
      select * from pg_extension
      ```

      The output of the above command gives the list of extensions currently active on the Single Server

   2. Enable the list of extensions obtained from step 1 in the Flexible Server. Search for the 'azure.extensions' parameter by selecting the Server Parameters tab in the side pane. Select the extensions that are to be allow-listed and click Save.

      :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-azure-extensions.png" alt-text="Screenshot of PG extension support in the Flexible Server Azure portal." lightbox="./media/concepts-single-to-flexible/single-to-flex-azure-extensions.png":::

### Data and schema migration

After you finish the prerequisites, migrate the data and schemas by using one of these methods:

- [Migrate by using the Azure portal](../migrate/how-to-migrate-single-to-flexible-portal.md)
- [Migrate by using the Azure CLI](../migrate/how-to-migrate-single-to-flexible-cli.md)

### Post-migration actions and considerations

- If you are using sequences, once the migration has successfully completed, ensure that you update the current value of sequences in target database to match the values in the source database.

- All the resources that the migration tool creates will be automatically cleaned up, whether the migration succeeds, fails, or is canceled. No action is required from you.

- If your migration fails, you can create a new migration task with a different name and retry the operation.

- If you have more than eight databases on your Single Server and you want to migrate them all, we recommend that you create multiple migration tasks. Each task can migrate up to eight databases.

- The migration does not move the database users and roles of the source server. You have to manually create these and apply them to the target server after migration.

- For security reasons, we highly recommended that you delete the Azure AD app after the migration finishes.

- After you validate your data and make your application point to Flexible Server, you can consider deleting your Single Server.

## Limitations

### Size

- You can migrate databases of sizes **up to 1 TB** by using this tool. To migrate larger databases or heavy write workloads, contact your account team to reach out to us or file a support ticket.

- In one migration attempt, you can migrate up to eight user databases from Single Server to Flexible Server. If you have more databases to migrate, you can create multiple migrations between the same Single Server and Flexible Server.

### Performance

- The migration infrastructure is deployed on a four-vCore virtual machine that might limit migration performance. 

- The deployment of migration infrastructure takes 10 to 15 minutes before the actual data migration starts, regardless of the size of data or the migration mode (online or offline).

### Replication

- The migration tool uses a logical decoding feature of PostgreSQL to perform the online migration. The decoding feature has the following limitations. For more information about logical replication limitations, see the [PostgreSQL documentation](https://www.postgresql.org/docs/10/logical-replication-restrictions.html).
  - Data Definition Language (DDL) commands are not replicated.
  - Sequence data is not replicated.
  - Truncate commands are not replicated.
  
    To work around this limitation, use `DELETE` instead of `TRUNCATE`. To avoid accidental `TRUNCATE` invocations, you can revoke the `TRUNCATE` privilege from tables.

  - Views, materialized views, partition root tables, and foreign tables are not migrated.

- Logical decoding will use resources in the Single Server. Consider reducing the workload, or plan to scale CPU/memory resources at the Single Server during the migration.

### Other limitations

- The migration tool migrates only data and schemas of the Single Server databases to Flexible Server. It does not migrate other features, such as server parameters, connection security details, firewall rules, users, roles, and permissions. In other words, everything except data and schemas must be manually configured in the Flexible Server target.

- The migration tool does not validate the data in the Flexible Server target after migration. You must do this validation manually.

- The migration tool migrates only user databases, including Postgres databases. It doesn't migrate system or maintenance databases.

- If migration fails, there is no option to retry the same migration task. You have to create a new migration task with a unique name.

- The migration tool does not include an assessment of your Single Server.

## Best practices

- As part of discovery and assessment, take the server SKU, CPU usage, storage, database sizes, and extensions usage as some of the critical data to help with migrations.
- Plan the mode of migration for each database. For simpler migrations and smaller databases, consider offline mode.
- Batch similar-sized databases in a migration task.  
- Perform large database migrations with one or two databases at a time to avoid source-side load and migration failures.
- Perform test migrations before migrating for production:
  - Test migrations are an important for ensuring that you cover all aspects of the database migration, including application testing.
  
    The best practice is to begin by running a migration entirely for testing purposes. After a newly started migration enters the continuous replication (CDC) phase with minimal lag, make your Flexible Server target the primary database server. Use that target for testing the application to ensure expected performance and results. If you're migrating to a higher Postgres version, test for application compatibility.

  - After testing is completed, you can migrate the production databases. At this point, you need to finalize the day and time of production migration. Ideally, there's low application use at this time. All stakeholders who need to be involved should be available and ready. 
  
    The production migration requires close monitoring. For an online migration, the replication must be completed before you perform the cutover, to prevent data loss.

- Cut over all dependent applications to access the new primary database, and open the applications for production usage.
- After the application starts running on the Flexible Server target, monitor the database performance closely to see if performance tuning is required.

## Other migration methods

The intent of the tool is to provide a seamless migration experience for most workloads. However, you may also choose other options to migrate using [dump/restore](../single-server/how-to-upgrade-using-dump-and-restore.md) or using [Azure Database Migration Service (DMS)](../../dms/tutorial-postgresql-azure-postgresql-online-portal.md) or using any 3rd party tools.


## Next steps

- [Migrate to Flexible Server by using the Azure portal](../migrate/how-to-migrate-single-to-flexible-portal.md)
- [Migrate to Flexible Server by using the Azure CLI](../migrate/how-to-migrate-single-to-flexible-cli.md)
