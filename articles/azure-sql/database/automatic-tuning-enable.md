---
title: Enable automatic tuning
description: You can enable automatic tuning on your database easily using the Azure portal.
services: sql-database
ms.service: sql-database
ms.subservice: performance
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: danimir
ms.author: danil
ms.reviewer: jrasnik, carlrab
ms.date: 12/03/2019
---
# Enable automatic tuning in the Azure portal to monitor queries and improve workload performance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Azure SQL Database automatically manages data services that constantly monitor your queries and identifies the action that you can perform to improve performance of your workload. You can review recommendations and manually apply them, or let Azure SQL Database automatically apply corrective actions - this is known as **automatic tuning mode**.

Automatic tuning can be enabled at the server or the database level through:

- The [Azure portal](automatic-tuning-enable.md#azure-portal)
- [REST API](automatic-tuning-enable.md#rest-api) calls
- [T-SQL](/sql/t-sql/statements/alter-database-transact-sql-set-options?view=azuresqldb-current) commands

> [!NOTE]
> For Azure SQL Managed Instance, the supported option FORCE_LAST_GOOD_PLAN can only be configured through [T-SQL](https://azure.microsoft.com/blog/automatic-tuning-introduces-automatic-plan-correction-and-t-sql-management) only. The Azure portal based configuration and automatic index tuning options described in this article do not apply to Azure SQL Managed Instance.

> [!NOTE]
> Configuring automatic tuning options through the ARM (Azure Resource Manager) template is not supported at this time.

## Enable automatic tuning on server

On the server level you can choose to inherit automatic tuning configuration from "Azure Defaults" or not to inherit the configuration. Azure defaults are FORCE_LAST_GOOD_PLAN is enabled, CREATE_INDEX is disabled, and DROP_INDEX is disabled.

> [!IMPORTANT]
> As of March, 2020 new Azure defaults for automatic tuning are as follows:
>
> - FORCE_LAST_GOOD_PLAN = enabled, CREATE_INDEX = disabled, and DROP_INDEX = disabled.
> - Existing servers with no automatic tuning preferences configured are automatically configured to INHERIT the Azure defaults. This applies to all customers currently having server settings for automatic tuning in an undefined state.
> - New servers created will automatically be configured to INHERIT the Azure defaults (unlike earlier when automatic tuning configuration was in an undefined state upon new server creation).

### Azure portal

To enable automatic tuning on a [server](logical-servers.md) in Azure SQL Database, navigate to the server in the Azure portal and then select **Automatic tuning** in the menu.

![Server](./media/automatic-tuning-enable/server.png)

> [!NOTE]
> Please note that the **DROP_INDEX** option at this time is not compatible with applications using partition switching and index hints and should not be enabled in these cases. Dropping unused indexes is not supported for Premium and Business Critical service tiers.

Select the automatic tuning options you want to enable and select **Apply**.

Automatic tuning options on a server are applied to all databases on this server. By default, all databases inherit configuration from their parent server, but this can be overridden and specified for each database individually.

### REST API

To find out more about using a REST API to enable automatic tuning on a **server**, see [Server automatic tuning UPDATE and GET HTTP methods](/rest/api/sql/serverautomatictuning).

## Enable automatic tuning on an individual database

Azure SQL Database enables you to individually specify the automatic tuning configuration for each database. On the database level you can choose to inherit automatic tuning configuration from the parent server, "Azure Defaults" or not to inherit the configuration. Azure Defaults are set to FORCE_LAST_GOOD_PLAN is enabled, CREATE_INDEX is disabled, and DROP_INDEX is disabled.

> [!TIP]
> The general recommendation is to manage the automatic tuning configuration at **server level** so the same configuration settings can be applied on every database automatically. Configure automatic tuning on an individual database only if you need that database to have different settings than others inheriting settings from the same server.

### Azure portal

To enable automatic tuning on a **single database**, navigate to the database in the Azure portal and select **Automatic tuning**.

Individual automatic tuning settings can be separately configured for each database. You can manually configure an individual automatic tuning option, or specify that an option inherits its settings from the server.

![Database](./media/automatic-tuning-enable/database.png)

Please note that DROP_INDEX option at this time is not compatible with applications using partition switching and index hints and should not be enabled in these cases.

Once you have selected your desired configuration, click **Apply**.

### Rest API

To find out more about using a REST API to enable automatic tuning on a single database, see [Azure SQL Database automatic tuning UPDATE and GET HTTP methods](/rest/api/sql/databaseautomatictuning).

### T-SQL

To enable automatic tuning on a single database via T-SQL, connect to the database and execute the following query:

```SQL
ALTER DATABASE current SET AUTOMATIC_TUNING = AUTO | INHERIT | CUSTOM
```

Setting automatic tuning to AUTO will apply Azure Defaults. Setting it to INHERIT, automatic tuning configuration will be inherited from the parent server. Choosing CUSTOM, you will need to manually configure automatic tuning.

To configure individual automatic tuning options via T-SQL, connect to the database and execute the query such as this one:

```SQL
ALTER DATABASE current SET AUTOMATIC_TUNING (FORCE_LAST_GOOD_PLAN = ON, CREATE_INDEX = ON, DROP_INDEX = OFF)
```

Setting the individual tuning option to ON will override any setting that database inherited and enable the tuning option. Setting it to OFF will also override any setting that database inherited and disable the tuning option. Automatic tuning option, for which DEFAULT is specified, will inherit the automatic tuning configuration from the server level settings.  

> [!IMPORTANT]
> In the case of [active geo-replication](auto-failover-group-overview.md), Automatic tuning needs to be configured on the primary database only. Automatically applied tuning actions, such as for example index create or delete will be automatically replicated to the read-only secondary. Attempting to enable Automatic tuning via T-SQL on the read-only secondary will result in a failure as having a different tuning configuration on the read-only secondary is unsupported.
>

To find out more abut T-SQL options to configure automatic tuning, see [ALTER DATABASE SET Options (Transact-SQL)](/sql/t-sql/statements/alter-database-transact-sql-set-options?view=azuresqldb-current).

## Disabled by the system

Automatic tuning is monitoring all the actions it takes on the database and in some cases it can determine that automatic tuning can't properly work on the database. In this situation, the tuning option will be disabled by the system. In most cases this happens because Query Store is not enabled or it's in read-only state on a specific database.

## Permissions

As automatic tuning is an Azure feature, to use it you will need to use Azure's built-in RBAC roles. Using SQL Authentication only will not be sufficient to use the feature from the Azure portal.

To use automatic tuning, the minimum required permission to grant to the user is Azure's built-in [SQL Database contributor](../../role-based-access-control/built-in-roles.md#sql-db-contributor) role. You can also consider using higher privilege roles such as SQL Server Contributor, SQL Managed Instance Contributor, Contributor, and Owner.

## Configure automatic tuning e-mail notifications

See the [automatic tuning e-mail notifications](automatic-tuning-email-notifications-configure.md) guide.

## Next steps

- Read the [Automatic tuning article](automatic-tuning-overview.md) to learn more about automatic tuning and how it can help you improve your performance.
- See [Performance recommendations](database-advisor-implement-performance-recommendations.md) for an overview of Azure SQL Database performance recommendations.
- See [Query Performance Insights](query-performance-insight-use.md) to learn about viewing the performance impact of your top queries.
