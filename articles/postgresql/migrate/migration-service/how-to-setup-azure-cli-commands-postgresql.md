---
title: How to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server
description: Learn how to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server and begin migrating your data.
author: markingmyname
ms.author: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom: devx-track-azurecli
---

# How to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server

To begin migrating using Azure CLI, you need to install the Azure CLI on your local machine.

## Prerequisites

- [Choose the right command line tool](/CLI/azure/choose-the-right-azure-command-line-tool)
- [Install Azure CLI](/cli/azure/install-azure-cli)
- [Review the az postgresql commands](/cli/azure/postgres?view=azure-cli-latest)

## Migrate commands

Migrating with the Azure CLI uses the following commands:

- [az postgres flexible-server migration create](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-create)
- [az postgres flexible-server migration list](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-list)
- [az postgres flexible-server migration show](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-show)

The following table defines the parameters and the commands that use them:

| Parameter | Relevant commands | Description |
| --- | --- | --- |
| `subscription` | Create, List, Show | Subscription ID of PostgreSQL Flexible server |
| `resource-group` | Create, List, Show | Resource group of PostgreSQL Flexible server |
| `name` | Create, List, Show | Name of the PostgreSQL Flexible server |
| `migration-name` | Create, Show | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with -, and no two migrations to a Flexible Server target can have the same name. |
| `filter` | List | To filter migrations, two values are supported – Active and All  
| `help` | Create, List, Show | Provides information about each command. |
| `migration-mode` | Create | This is an optional parameter. Default value: Offline. Offline migration involves copying your source databases at a point in time to your target server. |
| `migration-option` | Create | Allows you to perform validations before triggering a migration. Default is ValidateAndMigrate. Allowed values are - Migrate, Validate, ValidateAndMigrate.
| `properties` | Create | Absolute path to a JSON file that has the information about the source server |

The **create** command requires a JSON file, which contains the following information:

| Property Name | Description |
| --- | --- |
| `sourceDbServerResourceId` | Source server details in the format for on-premises, Azure virtual machines (VMs), AWS - `<<hostname or IP address>>:<<port>>@<<username>>` |
| `AdminCredentials` | This parameter lists passwords for admin users for both the source server and the target PostgreSQL flexible server. These passwords help to authenticate against the source and target servers |
| `targetServerUserName` | The default value is the admin user created during the creation of the flexible server, and the password provided is used for authentication against this user. If you aren't using the default user, this parameter is the user or role on the target server for migration. This user should be a member of azure_pg_admin, pg_read_all_settings, pg_read_all_stats, and pg_stat_scan_tables roles and should have the Create role, Create DB attributes |
| `dbsToMigrate` | Specify the list of databases that you want to migrate to Flexible Server. You can include a maximum of eight database names at a time. Providing the list of DBs in array format. |
| `OverwriteDBsInTarget` | When set to true (default), if the target server happens to have an existing database with the same name as the one you're trying to migrate, the migration tool automatically overwrites the database |
| `MigrationMode` | Mode of the migration. The supported value is "Offline" |
| `sourceType` | Required parameter. Values can be - OnPremises, AWS, AzureVM, PostgreSQLSingleServer |
| `sslMode` | SSL modes for migration. SSL mode for PostgreSQLSingleServer is VerifyFull and Prefer/Require for other source types |

## Related content

- [Migration service in Azure Database for PostgreSQL](../../concepts-migration-service-postgresql.md)
- [Migrate from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server using the migration service](../../tutorial-migration-service-single-to-flexible.md)
- [Migrate offline from AWS RDS PostgreSQL](../../tutorial-migration-service-aws-offline.md)
- [Migrate online from AWS RDS PostgreSQL](../../tutorial-migration-service-aws-online.md)
- [Migrate offline from on-premises or an Azure VM hosted PostgreSQL](../../tutorial-migration-service-iaas-offline.md)
- [Migrate online from on-premises or an Azure VM hosted PostgreSQL](../../tutorial-migration-service-iaas-online.md)
 
