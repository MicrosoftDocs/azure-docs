---
title: "Tutorial: Offline migration from on-premises and Azure virtual machines using the migration service with the Azure portal and CLI"
description: "Learn to migrate seamlessly from on-premises or an Azure VM to Azure Database for PostgreSQL - Flexible Server using the new migration service in Azure, simplifying the transition while ensuring data integrity and efficient deployment."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: devx-track-azurecli
ms.topic: tutorial
---

# Tutorial: Offline migration to Azure Database for PostgreSQL from on-premises or Azure VM-hosted PostgreSQL using migration service Preview

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This tutorial guides you in migrating a PostgreSQL instance from your on-premises or Azure virtual machines (VMs) to Azure Database for PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL flexible server.

In this document, you learn:
> [!div class="checklist"]
> - Prerequisites  
> - Configure the migration task
> - Monitor the migration
> - Post migration

[!INCLUDE [prerequisites-migration-service-postgresql](includes/prerequisites-migration-service-postgresql.md)]

#### [Portal](#tab/portal)

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for the PostgreSQL flexible server.

1. In the **Overview** tab of the flexible server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\offline-portal-select-migration-pane.png" alt-text="Screenshot of the migration selection." lightbox="media\tutorial-migration-service-offline-iaas\offline-portal-select-migration-pane.png":::

1. Select the **Create** button to migrate to a flexible server from on-premises or Azure VMs.

    > [!NOTE]  
    > The first time you use the migration service, an empty grid appears with a prompt to begin your first migration.

    If migrations to your flexible server target have already been created, the grid now contains information about attempted migrations.

1. Select the **Create** button to go through a wizard-based series of tabs to perform a migration.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-create-migration.png" alt-text="Screenshot of the create migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-create-migration.png":::

## Setup

The first tab is the setup tab.

The user needs to provide multiple details related to the migration, like the migration name, source server type, option, and mode.

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type** - Depending on your PostgreSQL source, you can select Azure Database for PostgreSQL single server, on-premises, Azure VM.

- **Migration Option** - Allows you to perform validations before triggering a migration. You can pick any of the following options
    - **Validate** - Checks your server and database readiness for migration to the target.
    - **Migrate** - Skips validations and starts migrations.
    - **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered if there are no validation failures.
        - Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration.

To learn more about the premigration validation, visit [premigration](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to source** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-setup-migration.png" alt-text="Screenshot of the setup migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-setup-migration.png":::

## Connect to the source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab**, which is the source of the databases.

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance

- **Port** - Port number of the Source server

- **Server admin login name** - Username of the source PostgreSQL server

- **Password** - Password of the source PostgreSQL server

- **SSL Mode** - Supported values are preferred and required. When the SSL at the source PostgreSQL server is OFF, use the SSLMODE=prefer. If the SSL at the source server is ON, use the SSLMODE=require. SSL values can be determined in postgresql.conf file.

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step; they need to identify the networking issues between the target and source and verify the username/password for the source. Test connection takes a few minutes to establish a connection between the target and source.

After the successful test connection, select the **Next: Select Migration target** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-connect-source-migration.png" alt-text="Screenshot of connect source migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-connect-source-migration.png":::

## Connect to the target

The **select migration target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version.

- **Admin username** - Admin username of the target PostgreSQL server

- **Password** - Password of the target PostgreSQL server

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-connect-target-migration.png" alt-text="Screenshot of the connect target migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-connect-target-migration.png":::

## Select databases for migration

Under the **Select database for migration** tab, you can choose a list of user databases to migrate from your source PostgreSQL server.

After selecting the databases, select the **Next: Summary**.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-fetchdb-migration.png" alt-text="Screenshot of the fetchDB migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-fetchdb-migration.png":::

## Summary

The **Summary** tab summarizes all the source and target details for creating the validation or migration. Review the details and select the **Start Validation and Migration** button.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-summary-migration.png" alt-text="Screenshot of the summary migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-summary-migration.png":::

## Monitor the migration

After you select the **Start Validation and Migration** button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're automatically redirected to the flexible server's **Migration** page. The entry is in the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and check network connections.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-monitor-migration.png" alt-text="Screenshot of the monitor migration page." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-monitor-migration.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration** and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry on the top. You can use the refresh button to refresh the status of the validation or migration run.

## Migration details

Select the migration name in the grid to see the associated details.

In the **Setup** tab, we have selected the migration option as **Validate and Migrate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substrate is completed, the workflow moves into the substrate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.

- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

Validation details are available at Instance and Database level.

- **Validation at Instance level**
    - Contains validation related to the connectivity check, source version, that is, PostgreSQL version >= 9.5, server parameter check, that is, if the extensions are enabled in the server parameters of the Azure Database for PostgreSQL - flexible server.
- **Validation at Database level**
    - It contains validation of the individual databases related to extensions and collations support in Azure Database for PostgreSQL, a flexible server.

You can see the **validation** and the **migration** status under the migration details page.
:::image type="content" source="media\tutorial-migration-service-offline-iaas\portal-offline-details-migration.png" alt-text="Screenshot of the details showing validation and migration." lightbox="media\tutorial-migration-service-offline-iaas\portal-offline-details-migration.png":::

Possible migration states include:

- **InProgress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Validation Failed** : The validation has failed.
- **Succeeded**: The migration has succeeded and is complete.
- **WaitingForUserAction**: Applicable only for online migration. Waiting for user action to perform cutover.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure setup is underway for data migration.
- **Validation in Progress**: Validation is in progress.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in the final stages of completion.
- **Completed**: Migration has been completed.
- **Failed**: Migration is failed.

Possible validation substates include:

- **Failed**: Validation is failed.
- **Succeeded**: Validation is successful.
- **Warning**: Validation is in Warning. Warnings are informative messages that you must remember while planning the migration.

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

- Canceling a validation stops further validation activity, and the validation moves to a **Can be called** state.

- Canceling a migration stops further migration activity on your target server and moves to a **Can be called** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.

#### [CLI](#tab/cli)

To begin migrating using Azure CLI, you need to install the Azure CLI on your local machine.

[!INCLUDE [setup-azure-cli-commands-postgresql](includes/setup-azure-cli-commands-postgresql.md)]

## Connect to the source

In this tutorial, the source PostgreSQL version used is 14.8, and it's installed in one of the Azure VMs with the operating system Ubuntu.

We're going to migrate "ticketdb","inventorydb","salesdb" into Azure Database for PostgreSQL flexible server.

:::image type="content" source="media\tutorial-migration-service-offline-iaas\az-migration-source-cli.png" alt-text="Screenshot of the az migration source page." lightbox="media\tutorial-migration-service-offline-iaas\az-migration-source-cli.png":::

## Perform migration using CLI

- Open the command prompt and sign in to the Azure using `az login` command

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\success-az-login-CLI.png" alt-text="Screenshot of the az success sign in." lightbox="media\tutorial-migration-service-offline-iaas\success-az-login-CLI.png":::

- Edit the below placeholders `<< >>` in the JSON lines and store them in the local machine as `<<filename>>.json` where the CLI is being invoked. In this tutorial, we have saved the file in C:\migration-CLI\migration_body.json

    ```bash
    {
    "properties": {
    "SourceDBServerResourceId": "<<source hostname or IP address>>:<<port>>@<<username>>",
            "SecretParameters": {
                "AdminCredentials": {
                    "SourceServerPassword": "<<Source Password>>",
                    "TargetServerPassword": "<<Target Password>>"
                }
            },
         "targetServerUserName":"<<Target username>>",
            "DBsToMigrate": [
               "<<comma separated list of databases like - "ticketdb","timedb","salesdb">>"
            ],
            "OverwriteDBsInTarget": "true",
            "MigrationMode": "Offline",
            "sourceType": "AzureVM",
            "sslMode": "Prefer"
        }
    }
    ```

- Run the following command to check if any migrations are running. The migration name is unique across the migrations within the Azure Database for PostgreSQL flexible server target.

    ```bash
    az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
    ```

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\list-CLI.png" alt-text="Screenshot of list the migration runs in CLI." lightbox="media\tutorial-migration-service-offline-iaas\list-CLI.png":::

- In the above steps, there are no migrations performed so we start with the new migration by running the following command

    ```bash
    az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --migration-option ValidateAndMigrate --properties "C:\migration-cli\migration_body.json"
    ```

- Run the following command to initiate the migration status in the previous step. You can check the status of the migration by providing the migration name

    ```bash
    az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
    ```

- The status of the migration progress is shown in the CLI.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\status-migration-cli.png" alt-text="Screenshot of status migration CLI." lightbox="media\tutorial-migration-service-offline-iaas\status-migration-cli.png":::

- You can also see the status in the Azure Database for PostgreSQL flexible server portal.

    :::image type="content" source="media\tutorial-migration-service-offline-iaas\status-migration-portal.png" alt-text="Screenshot of status migration portal." lightbox="media\tutorial-migration-service-offline-iaas\status-migration-portal.png":::
---

## Post migration

After completing the databases, you need to manually validate the data between source and target and verify that all the objects in the target database are successfully created.

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.

- Post verification, enable the high availability option on your flexible server as needed.

- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.

- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.

- Copy other server settings like tags, alerts, and firewall rules (if applicable) from the source instance to the flexible server.

- Make changes to your application to point the connection strings to a flexible server.

- Monitor the database performance closely to see if it requires performance tuning.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from AWS RDS](tutorial-migration-service-offline-aws.md)
- [Best practices](best-practices-migration-service-postgresql.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
