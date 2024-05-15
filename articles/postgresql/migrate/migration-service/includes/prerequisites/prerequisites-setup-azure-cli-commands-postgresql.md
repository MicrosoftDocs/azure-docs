---
title: Set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server
author: markingmyname
ms.author: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
ms.custom: devx-track-azurecli
---

To begin migrating using Azure CLI, you need to install the Azure CLI on your local machine.

## Set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server

- Install the Azure CLI depending on the operating system to run the CLI commands.
- Azure CLI can be installed from - [How to install the Azure CLI](/cli/azure/install-azure-cli).
- If Azure CLI is already installed, check the version by issuing the az version command. The version should be at least 2.56.0 or above to use the migration service.
- Once installed, run the az sign in command. This opens the default browser and loads an Azure sign-in page to authenticate. Pass in your Azure credentials to do a successful authentication. For other ways to sign with Azure CLI, visit this link.

### Setup CLI commands for the migration service

All the CLI commands start with `az postgres flexible-server migration`. There are also help statements provided to assist you in understanding the various options and framing the correct syntax for the CLI commands.

Once the CLI is installed, open the command prompt and log into the Azure account using the below command.

Example with Windows command prompt: `az login`.

### Commands to use with the migration service

The migration service provides the following commands to help you migrate your PostgreSQL databases to Azure Database for PostgreSQL - Flexible Server.

#### The help command

The command ```az postgres flexible-server migration –-help``` provides the name and the corresponding verbs.

#### The create command

The create command helps to migrate from a source server to a target server.

The help command allows users to understand the different arguments used for creating and initiating the migration `az postgres flexible-server migration create --help`.

```bash
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --migration-option ValidateAndMigrate --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode offline
```

Different substates flow when the create command is triggered.

- The migration moves to the InProgress state and the PerformingPreRequisiteSteps substate.

- After the PerformingPreRequisiteSteps substate is completed, the migration moves to the substate of Migrating Data, where the Cloning/Copying of the databases takes place.

- Each database migrated has its section with all migration details, such as table count, incremental inserts, deletions, and pending bytes.

- The time that the Migrating Data substate takes to finish depends on the size of the databases that are migrated.

- The migration moves to the Succeeded state after the Migrating Data substate finishes successfully. If there's a problem at the Migrating Data substate, the migration moves into a Failed state.

Let us understand the details of each parameter used in the create command.

| Parameter Name | Description |
| --- | --- |
| `subscription` | Subscription ID of PostgreSQL Flexible server |
| `resource-group` | Resource group of PostgreSQL Flexible server |
| `name` | Name of the PostgreSQL Flexible server |
| `migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with -, and no two migrations to a Flexible Server target can have the same name. |
| `migration-mode` | This is an optional parameter. Default value: Offline. Offline migration involves copying your source databases at a point in time to your target server. |
| `migration-option` | Allows you to perform validations before triggering a migration. Default is ValidateAndMigrate. Allowed values are - Migrate, Validate, ValidateAndMigrate.
| `properties` | Absolute path to a JSON file that has the information about the source server |

You must provide a JSON file with the absolute path as a parameter while initiating the migration.

The JSON file contains the following information:

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

#### The list command

The list command lists all the migration attempts made to an Azure Database for PostgreSQL target.

```bash
az postgres flexible-server migration list [--subscription] [--resource-group][--name] [--filter]
```

| Parameter Name | Description |
| --- | --- |
| `subscription` | Subscription ID of PostgreSQL Flexible server target |
| `resource-group` | Resource group of PostgreSQL Flexible server target |
| `name` | Name of the PostgreSQL Flexible server target |
| `filter` | To filter migrations, two values are supported – Active and All |

#### The show command

The show command helps you monitor ongoing migrations and gives the current state and substate of the migration. These details include information on the current state and substate of the migration.

```bash
az postgres flexible-server migration show [--subscription][--resource-group][--name][--migration-name]
```

| Parameter Name | Description |
| --- | --- |
| `subscription` | Subscription ID of PostgreSQL Flexible server target |
| `resource-group` | Resource group of PostgreSQL Flexible server target |
| `name` | Name of the PostgreSQL Flexible server target |
| `migration-name` | Unique identifier to migrations attempted to Flexible Server. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with -, and no two migrations to a Flexible Server target can have the same name. |

Different states supported within the show command

| Migration State | Description |
| --- | --- |
| `InProgress` | The migration infrastructure is set up, or the actual data migration is in progress |
| `Canceled` | The migration is canceled or deleted |
| `Failed` | The migration has failed |
| `Succeeded` | The migration has succeeded and is complete |
| `WaitingForUserAction` | Applicable only for online migration. Waiting for user action to perform cutover |
| `ValidationFailed` | The validation at the database or server level has failed |

Different sub states supported within the show command for migration

| Migration SubState | Description |
| --- | --- |
| `PerformingPreRequisiteSteps` | Infrastructure is set up and is prepped for data migration |
| `MigratingData` | Data migration is in progress |
| `Completed` | Migration is completed |
| `Failed` | Migration is failed |
| `Validation in Progress` | Validation is in progress |
| `CompletingMigration` | Migration is in the final stages of completion |

Validation details are at the Instance and Database level

- **Validation at Instance level**
    - Contains validation related to the connectivity check, source version that is, PostgreSQL version >= 9.5, server parameter check that is, if the extensions are enabled in the server parameters of the Azure Database for PostgreSQL - flexible server.

- **Validation at Database level**
    - Contains validation of the individual databases related to extensions, collations support in Azure Database for PostgreSQL - flexible server.

Different sub states supported within show command for validation.

| Validation SubState | Description |
| --- | --- |
| `Failed` | Validation is failed |
| `Succeeded` | Validation is successful |
| `Warning` | Validation is in Warning. Warnings are informative messages that you need to keep in mind while planning the migration |

### Cancel the migration

You can cancel any ongoing migration attempts by using the `cancel` command. This command stops the particular migration attempt but doesn't drop or roll back any changes on your target server. Here's the CLI command to delete a migration:

```azurecli-interactive
az postgres flexible-server migration update cancel [--subscription][--resource-group][--name][--migration-name]
```

For example:

```azurecli-interactive
az postgres flexible-server migration update cancel --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1"
```

For more information about this command, use the `help` parameter:

```azurecli-interactive
az postgres flexible-server migration update cancel -- help
```
