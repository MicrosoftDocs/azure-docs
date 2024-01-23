---
title: "Tutorial: Offline Migration from on-premises and Azure virtual machines using the Azure portal and CLI"
description: "Learn about Offline migration of your on-premises or Azure virtual machines PostgreSQL databases to Azure Database for PostgreSQL - Flexible Server."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/22/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: tutorial
---

# Tutorial: Offline migration from on-premises or Azure virtual machines to Azure Database for PostgreSQL - Flexible Server Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This tutorial guides you to migrate a PostgreSQL instance from your on-premises or Azure virtual machines (VMs) to Azure Database for PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service that's integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL flexible server.

In this document, you learn
> [!div class="checklist"]
> - Prerequisites  
> - Configure the Migration task
> - Monitor the migration
> - Post migration

## Prerequisites

[!INCLUDE [prerequisites-postgresql-migration-service-offline-iaas](includes/prerequisites-postgresql-migration-service-offline-iaas.md)]

#### [Portal](#tab/portal)

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for the PostgreSQL flexible server.

1. In the **Overview** tab of the flexible server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\offline-portal-select-migration-pane.png" alt-text="Screenshot of the migration selection." lightbox="media\tutorial-migration-service-offline-iaas\offline-portal-select-migration-pane.png":::

1. Select the **Create** button to migrate from on-premises or Azure VMs to flexible server.

    > [!NOTE]  
    > The first time you use the migration service, an empty grid appears with a prompt to begin your first migration.

  If migrations to your flexible server target are already created, the grid now contains information about attempted migrations.

1. Select the **Create** button to go through a wizard-based series of tabs to perform a migration.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-create-migration.png" alt-text="Screenshot of the create migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-create-migration.png":::

### Setup

The first tab is the setup tab.

The user needs to provide multiple details related to the migration like the migration name, the source server type, the migration option, and migration mode. 

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type** - Depending on your PostgreSQL source, you can select Azure Database for PostgreSQL single server, on-premises, Azure VM, AWS RDS for PostgreSQL.

- **Migration Option** - Allows you to perform validations before triggering a migration. You can pick any of the following options
    - **Validate** - Checks your server and database readiness for migration to the target.
    - **Migrate** - Skips validations and starts migrations.
    - **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered if there are no validation failures.
        - Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration.

To learn more about the premigration validation, visit [premigration](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to source** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-setup-migration.png" alt-text="Screenshot of the setup migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-setup-migration.png":::

### Connect to source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab**, which is the source of the databases.

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance

- **Port** - Port number of the Source server

- **Server admin login name** - Username of the source PostgreSQL server

- **Password** - Password of the source PostgreSQL server

- **SSL Mode** - Supported values are preferred and required. When the SSL at the source PostgreSQL server is OFF, use the SSLMODE=prefer. If the SSL at the source server is ON, use the SSLMODE=require. SSL values can be determined in postgresql.conf file.

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step; they need to identify the networking issues between the target and source and verify the username/password for the source. Test connection takes a few minutes to establish a connection between the target and source.

After the successful test connection, select the **Next: Select Migration target** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-connect-source-migration.png" alt-text="Screenshot of connect source migration page.":::

### Connect to target

The **select migration target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version.

- **Admin username** - Admin username of the target PostgreSQL server

- **Password** - Password of the target PostgreSQL server

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-connect-target-migration.png" alt-text="Screenshot of the connect target migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-connect-target-migration.png":::

### Select databases for migration

Under the **Select database for migration** tab, you can choose a list of user databases to migrate from your source PostgreSQL server. 
After selecting the databases, select the **Next:Summary**

:::image type="content" source="media/tutorial-migration-service-offline-iaas\portal-offline-fetchdb-migration.png" alt-text="Screenshot of the fetchDB migration page.":::

### Summary

The **Summary** tab summarizes all the source and target details for creating the validation or migration. Review the details and select the **Start** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-summary-migration.png" alt-text="Screenshot of the summary migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-summary-migration.png":::

### Monitor the migration

After you select the **Start** button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of flexible server. The entry is in the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-monitor-migration.png" alt-text="Screenshot of the monitor migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-monitor-migration.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration** and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry on the top. You can use the refresh button to refresh the status of the validation or migration.

Select the migration name in the grid to see the associated details.

When the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

### Migration details

In the **Setup** tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.

- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the validation results under the **Validation** tab and monitor the migration under the **Migration** tab.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-validation-migration.png" alt-text="Screenshot of the validation migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-validation-migration.png":::

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-details-migration.png" alt-text="Screenshot of the details migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-details-migration.png":::

Possible migration states include:

- **InProgress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Validation Failed** : The validation has failed.
- **Succeeded**: The migration has succeeded and is complete.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure setup is underway for data migration.
- **Validation in Progress**: Validation is in progress.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in the final stages of completion.
- **Completed**: Migration has been completed.

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

Canceling a validation stops further validation activity, and the validation moves to a **Can be called** state.
Canceling a migration stops further migration activity on your target server and moves to a **Can be called** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.

#### [CLI](#tab/cli)

### Azure CLI Setup

- Install the Azure CLI depending on the operating system to run the CLI commands.
- Azure CLI can be installed from - [How to install the Azure CLI](/cli/azure/install-azure-cli).
- If Azure CLI is already installed, check the version by issuing az version command. The version should be at least 2.56.0 or above to use the migration service.
- Once installed, run the az sign in command. This opens the default browser and loads an Azure sign-in page to authenticate. Pass in your Azure credentials to do a successful authentication. For other ways to sign with Azure CLI, visit this link.

## Start with CLI

All the CLI commands start with `az postgres flexible-server migration`. There are also help statements provided to assist you in understanding the various options and framing the correct syntax for the CLI commands.

Once the CLI is installed, open the command prompt and log into the Azure account using the below command.

Example with Windows command prompt: `az login`.

## Commands

Let us take a deep dive into the CLI commands.

### Help

The command ```az postgres flexible-server migration –-help``` provides the name and the corresponding verbs.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\az-flexible-migration-help-CLI.png" alt-text="Screenshot of the az migration help cli results." lightbox="media\tutorial-migration-service-offline-iaas\az-flexible-migration-help-CLI.png":::

### Create

The create command helps to migrate from a source server to a target server.

The help command allows users to understand the different arguments used for creating and initiating the migration `az postgres flexible-server migration create --help`.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\az-flexible-migration-help-create-CLI.png" alt-text="Screenshot of the az migration create help cli results." lightbox="media\tutorial-migration-service-offline-iaas\az-flexible-migration-help-create-CLI.png":::

```bash
az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --properties "C:\Users\Administrator\Documents\migrationBody.JSON" --migration-mode offline
```

Different substates flow when the create command is triggered.

- The migration moves to the InProgress state and the PerformingPreRequisiteSteps substate.

- After the PerformingPreRequisiteSteps substrate is completed, the migration moves to the substrate of Migrating Data, where the Cloning/Copying of the databases takes place.

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
| `properties` | Absolute path to a JSON file that has the information about the source server |

You must provide a JSON file with the absolute path as a parameter while initiating the migration.

The JSON file contains the following information:

| Property Name | Description |
| --- | --- |
| `sourceDbServerResourceId` | Source server details in the format - `<<hostname or IP address>>:<<port>>@<<username>>` |
| `AdminCredentials` | This parameter lists passwords for admin users for both the source server and the target PostgreSQL flexible server. These passwords help to authenticate against the source and target servers |
| `targetServerUserName` | The default value is the admin user created during the creation of the flexible server, and the password provided uses for authentication against this user. If you aren't using the default user, this parameter is the user or role on the target server for migration. This user should be a member of azure_pg_admin, pg_read_all_settings, pg_read_all_stats, and pg_stat_scan_tables roles and should have the Create role, Create DB attributes |
| `dbsToMigrate` | Specify the list of databases that you want to migrate to Flexible Server. You can include a maximum of eight database names at a time. Providing the list of DBs in array format. |
| `OverwriteDBsInTarget` | When set to true (default), if the target server happens to have an existing database with the same name as the one you're trying to migrate, the migration tool automatically overwrites the database |
| `MigrationMode` | Mode of the migration. The supported value is "Offline" |

### List

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

### Show

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

Different states supported within show command

| Migration State | Description |
| --- | --- |
| `InProgress` | The migration infrastructure is set up, or the actual data migration is in progress |
| `Canceled` | The migration is canceled or deleted |
| `Failed` | The migration has failed |
| `Succeeded` | The migration has succeeded and is complete |

Different substates supported within show command

| Migration SubState | Description |
| --- | --- |
| `PerformingPreRequisiteSteps` | Infrastructure is set up and is prepped for data migration |
| `MigratingData` | Data migration is in progress |
| `Completed / Failed` | Migration is completed or failed |

## End-to-end flow tutorial

We migrate the PostgreSQL database residing in Azure VM with public access to Azure Database for PostgreSQL flexible server using Azure CLI.

### Step 1 - Connect to the source

- In this tutorial, the source PostgreSQL version used is 14.8, and it's installed in one of the Azure VMs with the operating system Ubuntu.
- Source PostgreSQL instance contains around 10 databases and for this tutorial we're going to migrate "ticketdb","timedb","salesdb" and "postgres" into Azure Database for PostgreSQL flexible server.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\az-migration-source-CLI.png" alt-text="Screenshot of the az migration source page." lightbox="media\tutorial-migration-service-offline-iaas\az-migration-source-CLI.png":::

### Step 2 - Create target Azure Database for PostgreSQL flexible server

We used the [QuickStart guide](/azure/postgresql/flexible-server/quickstart-create-server-portal) to create a corresponding PostgreSQL target flexible server. We kept the SKU the same; given we're migrating a small sample database, we're allocating 128 GB of storage. Below is the target server screenshot once created –

:::image type="content" source="media\tutorial-migration-service-offline-iaas\flexible-server-target-creation.png" alt-text="Screenshot of the flexible server target." lightbox="media\tutorial-migration-service-offline-iaas\flexible-server-target-creation.png":::

### Step 3 - Set up the prerequisites

Ensure that all the prerequisites are completed before the start of migration.

- Networking establishment between source and target.
- For this tutorial, we have modified the pg_hba.conf file in the source

:::image type="content" source="media\tutorial-migration-service-offline-iaas\pg-hbaconf.png" alt-text="Screenshot of the Pg_hba option result." lightbox="media\tutorial-migration-service-offline-iaas\pg-hbaconf.png":::

- Azure CLI environment and all the appropriate defaults are set up.
- Extensions are allowed, listed, and included in shared-load libraries.
- Users and Roles are migrated.
- Server Parameters are configured appropriately.

### Step 4 - Perform migration using CLI

- Open the command prompt and sign in into the Azure using `az login` command

:::image type="content" source="media\tutorial-migration-service-offline-iaas\az-login-tutorial-CLI.png" alt-text="Screenshot of the az login cli." lightbox="media\tutorial-migration-service-offline-iaas\az-login-tutorial-CLI.png":::

:::image type="content" source="media\tutorial-migration-service-offline-iaas\success-az-login-CLI.png" alt-text="Screenshot of the az success sign in." lightbox="media\tutorial-migration-service-offline-iaas\success-az-login-CLI.png":::

- Edit the below placeholders `<< >>` in the JSON lines and store them in the local machine as `<<filename>>.json` where the CLI is being invoked. In this tutorial, we have saved the file in C:\migration-CLI\migration_body.json

```bash
{
"properties": {
"SourceDBServerResourceId": "<<hostname or IP address>>:<<port>>@<<username>>",
        "SecretParameters": {
            "AdminCredentials": {
                "SourceServerPassword": "<<Source Password>>",
                "TargetServerPassword": "<<Target Password>>"
            }
        },
     "targetServerUserName":"<<Target username>>",
        "DBsToMigrate": [
            << comma separated list of databases like - "ticketdb","timedb","salesdb" >>
        ],
        "OverwriteDBsInTarget": "true",
        "MigrationMode": "Offline"
    }
}
```

- Run the following command to check if any migrations are complete. The migration name is unique across the migrations within the Azure Database for PostgreSQL flexible server target.

```bash
az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
```

:::image type="content" source="media\tutorial-migration-service-offline-iaas\list-cli.png" alt-text="Listcli." lightbox="media\tutorial-migration-service-offline-iaas\list-cli.png":::

- In the above steps, there are no migrations performed so we start with the new migration by running the following command –

```bash
az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --properties "C:\migration-cli\migration_body.json"
```

:::image type="content" source="media\tutorial-migration-service-offline-iaas\create-migration-CLI.png" alt-text="Screenshot of the create cli." lightbox="media\tutorial-migration-service-offline-iaas\create-migration-CLI.png":::

- Run the following command to get the migration status initiated in the previous step. You can check the status of the migration by providing the migration name

```bash
az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
```

:::image type="content" source="media\tutorial-migration-service-offline-iaas\show-migration-cli.png" alt-text="Screenshot of showing the cli migration.." lightbox="media\tutorial-migration-service-offline-iaas\show-migration-cli.png":::

- You can also see the status in the Azure Database for PostgreSQL flexible server portal

:::image type="content" source="media\tutorial-migration-service-offline-iaas\status-migration-portal.png" alt-text="Screenshot of status migration portal." lightbox="media\tutorial-migration-service-offline-iaas\status-migration-portal.png":::

### Step 5 - Post Migration

After successfully completing the databases, you need to manually validate the data between source and target and verify all the objects in the target database are successfully created.

## Post migration

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.

- Post verification, enable the high availability option on your flexible server as needed.

- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.

- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.

- Copy other server settings like tags, alerts, and firewall rules (if applicable) from the source instance to the flexible server.

- Make changes to your application to point the connection strings to a flexible server.

- Monitor the database performance closely to see if it requires performance tuning.

## Migration best practices

For a successful end-to-end migration, follow the post-migration steps in [Migrate to Azure Database for PostgreSQL - Flexible Server](../concepts-single-to-flexible.md#post-migration). After you complete the preceding steps, you can change your application code to point database connection strings to Flexible Server. You can then start using the target as the primary database server.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
