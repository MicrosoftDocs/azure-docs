---
title: How to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server
description: Learn how to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server and begin migrating your data.
author: markingmyname
ms.author: maghan
ms.date: 06/19/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
---

# How to set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server

The Azure CLI is a set of commands used across Azure services to create and manage resources. It provides the same capabilities as the Azure portal but is optimized for users who prefer to work within a command-line environment. To begin migrating using Azure CLI, you need to install the Azure CLI on your local machine.

## Prerequisites

- **Install Azure CLI**: Depending on your operating system, download and install the Azure CLI. It’s available for Windows, macOS, and Linux.
- **Azure CLI Installation Guide**: Follow the instructions provided in the official Azure documentation to install the Azure CLI - [How to install the Azure CLI](/cli/azure/install-azure-cli).
- **Check Azure CLI Version**: Ensure that your Azure CLI version is at least 2.56.0 or higher, as this is required for the migration service. Use the command `az --version` to check your current version.
- **Sign in to Azure**: After installation, execute `az login` to authenticate. This opens your default browser to complete the sign-in process with your Azure credentials.

These steps prepare your environment for using the Azure CLI to manage the migration service in Azure Database for PostgreSQL effectively. Always refer to the latest Azure documentation for any updates or changes to the installation process.

## Set up CLI commands for the migration service

All the CLI commands start with `az postgres flexible-server migration`. There are also help statements provided to assist you in understanding the various options and framing the correct syntax for the CLI commands.

Once the CLI is installed, open the command prompt and log into the Azure account using the below command.

```azurecli-interactive
az login
```

## Migrate commands

The migration service provides the following commands to help you migrate your PostgreSQL instances to Azure Database for PostgreSQL - Flexible Server.

### Help command

The `--help` command in Azure CLI is a valuable option that provides detailed documentation about the commands and their subcommands, including the required verbs for operations. The `–-help`command displays the necessary commands and their associated actions for migration service in Azure Database for PostgreSQL.

```azurecli-interactive
az postgres flexible-server migration –-help
```

The output guides you through the necessary steps and parameters required to manage your database migrations effectively using the Azure CLI.

### Create command

The `az postgres flexible-server migration create` command in Azure CLI is used to initiate a new migration workflow. It facilitates the migration of databases from a source PostgreSQL instance to a target Azure Database for PostgreSQL - Flexible Server instance. This command sets up the necessary parameters and configurations to ensure a smooth and efficient migration process.

For more information, see [az postgres flexible-server migration create](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-create)

### List command

The `az postgres flexible-server migration list` command is used to list all the migration attempts made to an Azure Database for PostgreSQL target. This command provides an overview of the migrations that have been initiated, allowing you to track the status and details of each migration attempt.

For more information, see [az postgres flexible-server migration list](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-list)

### Show command

The `az postgres flexible-server migration show` command helps you monitor ongoing migrations and gives the current state and substate of the migration. These details include information on the current state and substate of the migration.

For more information, see [az postgres flexible-server migration show](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-show)

Some possible migration states:

#### Migration states

| State | Description |
| --- | --- |
| **InProgress** | The migration infrastructure setup is underway, or the actual data migration is in progress. |
| **Canceled** | The migration is canceled or deleted. |
| **Failed** | The migration has failed. |
| **Validation Failed** | The validation has failed. |
| **Succeeded** | The migration has succeeded and is complete. |
| **WaitingForUserAction** | Applicable only for online migration. Waiting for user action to perform cutover. |

#### Migration substates

| Substate | Description |
| --- | --- |
| **PerformingPreRequisiteSteps** | Infrastructure setup is underway for data migration. |
| **Validation in Progress** | Validation is in progress. |
| **MigratingData** | Data migration is in progress. |
| **CompletingMigration** | Migration is in the final stages of completion. |
| **Completed** | Migration has been completed. |
| **Failed** | Migration has failed. |

#### Validation substates

| Substate | Description |
| --- | --- |
| **Failed** | Validation has failed. |
| **Succeeded** | Validation is successful. |
| **Warning** | Validation is in warning. | 

### Update command

The `az postgres flexible-server migration update` command is used to manage the migration process to an Azure Database for PostgreSQL Flexible Server. Specifically, it can be used to:

- **Perform a cutover**: This finalizes the migration process by switching the database traffic from the source server to the target Flexible Server.
    - After the base data migration is complete, the migration task moves to the `WaitingForCutoverTrigger` substate. In this state, users can trigger the cutover from the portal by selecting the migration name in the migration grid or through the CLI.
    - Before initiating cutover, it's important to ensure that:
        - Writes to the source are stopped
        - `latency` value decreases to 0 or close to 0
        - `latency` value indicates when the target last synced with the source. At this point, writes to the source can be stopped and cutover initiated. In case there's heavy traffic at the source, it's recommended to stop writes first so that `Latency` can come close to 0, and then a cutover is initiated.
        - The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency`, the replication stops until that point in time. All the data on source until the cutover point is then applied on the target. Say a latency was 15 minutes at the cutover point, so all the changed data in the last 15 minutes applies to the target.
- **Cancel the migration**: If needed, this option allows you to stop the migration process.
- **Setup logical replication at the source**: This is useful when the source server is an Azure Database for PostgreSQL - Single Server, as it prepares the server for data replication to the Flexible Server.

For more information, see [az postgres flexible-server migration update](/cli/azure/postgres/flexible-server/migration#az-postgres-flexible-server-migration-update)

## Summary

The following table summarizes the parameters used by the migration commands:

| Parameter | Relevant commands | Description |
| --- | --- | --- |
| `subscription` | create, list, show, update | Subscription ID of PostgreSQL Flexible server |
| `resource-group` | create, list, show, update | Resource group of PostgreSQL Flexible server |
| `name` | create, list, show | Name of the PostgreSQL Flexible server |
| `migration-name` | create, show, update | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with -, and no two migrations to a Flexible Server target can have the same name. |
| `filter` | list | To filter migrations, two values are supported – Active and All  |
| `help` | create, list, show, update | Provides information about each command. |
| `migration-mode` | create | This is an optional parameter. Allowed Values are - offline, online. Default value: Offline.|
| `migration-option` | create | Allows you to perform validations before triggering a migration. Default is ValidateAndMigrate. Allowed values are - Migrate, Validate, ValidateAndMigrate.
| `properties` | create | Absolute path to a JSON file that has the information about the source, target server, databases to migrate, SSL modes, defining source types |

### Details of the JSON file

The `az postgres flexible-server migration create` command requires a JSON file path as part of `--properties` parameter, which contains configuration details for the migration, such as the source database server resource ID, admin credentials, databases to migrate, and other important settings. Below are the different properties:

| Property Name | Description |
| --- | --- |
| `sourceDbServerResourceId` | Source server details in the format for on-premises, Azure virtual machines (VMs), AWS_RDS - `<<hostname or IP address>>:<<port>>@<<username>>`. If the source server is Azure Database for PostgreSQL - Single server then the resource ID is in the format - `/subscriptions/<<Subscription ID>>/resourceGroups/<<Resource Group Name>>/providers/Microsoft.DBforPostgreSQL/servers/<<PostgreSQL Single Server name>>`|
| `adminCredentials` | This parameter lists passwords for admin users for both the source server and the target PostgreSQL flexible server. These passwords help to authenticate against the source and target servers. It includes two subproperties, `sourceServerPassword` and `targetServerPassword` |
| `targetServerUserName` | The default value is the admin user created during the creation of the PostgreSQL target flexible server, and the password provided is used for authentication against this user. |
| `dbsToMigrate` | Specify the list of databases that you want to migrate to Flexible Server. You can include a maximum of eight database names at a time. Providing the list of DBs in array format. |
| `overwriteDBsInTarget` | When set to true (default), if the target server happens to have an existing database with the same name as the one you're trying to migrate, the migration service automatically overwrites the database |
| `migrationRuntimeResourceId` | Required if a runtime server needs to be used for migration. The format is - `/subscriptions/<<Subscription ID>>/resourceGroups/<<Resource Group Name>>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<<PostgreSQL Flexible Server name>>` |
| `sourceType` | Required parameter. Values can be - on-premises, AWS_RDS, AzureVM, PostgreSQLSingleServer |
| `sslMode` | SSL modes for migration. SSL mode for PostgreSQLSingleServer is VerifyFull and Prefer/Require for other source types. |

## Related content

- [Migration service in Azure Database for PostgreSQL](overview-migration-service-postgresql.md)
- [Migrate from Single Server to Flexible Server](tutorial-migration-service-single-to-flexible.md)
- [Migrate offline from AWS RDS PostgreSQL](tutorial-migration-service-aws-offline.md)
- [Migrate online from AWS RDS PostgreSQL](tutorial-migration-service-aws-online.md)
- [Migrate offline from on-premises or an Azure VM hosted PostgreSQL](tutorial-migration-service-iaas-offline.md)
- [Migrate online from on-premises or an Azure VM hosted PostgreSQL](tutorial-migration-service-iaas-online.md)
