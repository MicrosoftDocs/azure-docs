---
title: "Tutorial: Migrate offline from AWS RDS using the migration service with the Azure portal and Azure CLI"
description: "Learn to migrate offline seamlessly from AWS RDS to Azure Database for PostgreSQL using the new migration service in Azure, simplifying the transition while ensuring data integrity and efficient deployment."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: azure-database-postgresql
ms.subservice: migration-guide
ms.topic: tutorial
ms.custom:
  - devx-track-azurecli
# customer intent: As a developer, I want to learn how to migrate from AWS RDS to Azure Database for PostgreSQL using the migration service, so that I can simplify the transition and ensure data integrity.
---

# Tutorial: Migrate offline from AWS RDS PostgreSQL to Azure Database for PostgreSQL with the migration service

This article explores how to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL offline.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL server.

> [!div class="checklist"]
>  
> - Prerequisites
> - Perform the migration
> - Monitor the migration
> - Check the migration when completed

## Prerequisites

To complete the migration, you need the following prerequisites:

[!INCLUDE [prerequisites-migration-service-postgresql-offline-aws](includes/aws/prerequisites-migration-service-postgresql-offline-aws.md)]

## Perform the migration

You can migrate by using the Azure portal or the Azure CLI.

#### [Portal](#tab/portal)

The Azure portal provides a simple and intuitive wizard-based experience that guides you through migration. Following the steps outlined in this tutorial, you can seamlessly transfer your database to Azure Database for PostgreSQL - Flexible Server and take advantage of its powerful features and scalability.

To migrate with the Azure portal, you first configure the migration task, connect to the source and target, and then perform the migration.

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for the PostgreSQL flexible server.

1. In the **Overview** tab of the flexible server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="media/tutorial-migration-service-aws-offline/offline-portal-select-migration-pane.png" alt-text="Screenshot of the migration selection in the Azure portal." lightbox="media/tutorial-migration-service-aws-offline/offline-portal-select-migration-pane.png":::

1. Select the **Create** button to migrate from AWS RDS to a flexible server.

    > [!NOTE]  
    > The first time you use the migration service, an empty grid appears with a prompt to begin your first migration.

    If migrations to your flexible server target are already created, the grid now contains information about attempted migrations.

1. Select the **Create** button to go through a wizard-based series of tabs to perform a migration.

    :::image type="content" source="media/tutorial-migration-service-aws-offline/portal-offline-create-migration.png" alt-text="Screenshot of the create migration page." lightbox="media/tutorial-migration-service-aws-offline/portal-offline-create-migration.png":::

#### Setup

The user needs to provide multiple details related to the migration, such as the migration name, source server type, option, and mode.

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type** - Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL.

- **Migration Option** - Allows you to perform validations before triggering a migration. You can pick any of the following options
    - **Validate** - Checks your server and database readiness for migration to the target.
    - **Migrate** - Skips validations and starts migrations.
    - **Validate and Migrate** — Performs validation before triggering a migration. If there are no validation failures, the migration is triggered.

Choosing the **Validate** or **Validate and Migrate** option is always a good practice for performing premigration validations before running the migration.

To learn more about the premigration validation, visit [premigration](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to source** button.

:::image type="content" source="media/tutorial-migration-service-aws-offline/01-portal-offline-setup-aws.png" alt-text="Screenshot of the Setup Migration page to get started.":::

#### Select Runtime Server

The migration Runtime Server is a specialized feature within the migration service, designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

:::image type="content" source="media/tutorial-migration-service-aws-offline/02-portal-offline-runtime-server-aws.png" alt-text="Screenshot of the Migration Runtime Server page.":::

#### Connect to source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab**, which is the source of the databases.

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance

- **Port** - Port number of the Source server

- **Server admin login name** - Username of the source PostgreSQL server

- **Password** - Password of the source PostgreSQL server

- **SSL Mode** - Supported values are preferred and required. When the SSL at the source PostgreSQL server is OFF, use the SSLMODE=prefer. If the SSL at the source server is ON, use the SSLMODE=require. SSL values can be determined in postgresql.conf file.

- **Test Connection**—Performs the connectivity test between the target and source. Once the connection is successful, users can proceed to the next step; they need to identify the networking issues between the target and source and verify the username/password for the source. Establishing a test connection takes a few minutes.

After the successful test connection, select the **Next: Select Migration target** button.

:::image type="content" source="media/tutorial-migration-service-aws-offline/03-portal-offline-connect-source-aws.png" alt-text="Screenshot of the connect to source page." lightbox="media/tutorial-migration-service-aws-offline/03-portal-offline-connect-source-aws.png":::

#### Select migration target

The **select migration target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version.

- **Admin username** - Admin username of the target PostgreSQL server

- **Password** - Password of the target PostgreSQL server

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the source and verify the target's username/password. Test connection takes a few minutes to establish a connection between the target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

:::image type="content" source="media/tutorial-migration-service-aws-offline/04-portal-offline-select-migration-target-aws.png" alt-text="Screenshot of the connect target migration page.":::

#### Select database for migration

Under the **Select database for migration** tab, you can choose a list of user databases to migrate from your source PostgreSQL server.  
After selecting the databases, select the **Next: Summary**

:::image type="content" source="media/tutorial-migration-service-aws-offline/05-portal-offline-select-database-aws.png" alt-text="Screenshot of the fetchDB migration page.":::

#### Summary

The Summary tab summarizes all the source and target details for creating the validation or migration. Review the details and select the Start Validation and Migration button.

:::image type="content" source="media/tutorial-migration-service-aws-offline/06-portal-offline-summary-aws.png" alt-text="Screenshot of the summary migration page.":::

### Monitor the migration

After you select the **Start Validation and Migration** button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're redirected to the flexible server **Migration** page instance. The entry is in the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and check network connections.

:::image type="content" source="media/tutorial-migration-service-aws-offline/portal-offline-monitor-migration-aws.png" alt-text="Screenshot of the monitor migration page." lightbox="media/tutorial-migration-service-aws-offline/portal-offline-monitor-migration-aws.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration, and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry on the top. You can use the refresh button to refresh the status of the validation or migration run.

### Migration details

Select the migration name in the grid to see the associated details.

In the **Setup** tab, we have selected the migration option as **Validate and Migrate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substrate is completed, the workflow moves into the substrate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.

- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

Validation details are available at the instance and database level.

- **Validation at Instance level**
    - Contains validation related to the connectivity check, source version, that is, PostgreSQL version >= 9.5, server parameter check, if the extensions are enabled in the server parameters of the Azure Database for PostgreSQL - flexible server.

- **Validation at Database level**
    - It contains validation of the individual databases related to extensions and collations support in Azure Database for PostgreSQL, a flexible server.

You can see the **validation** and the **migration** status under the migration details page.

:::image type="content" source="media/tutorial-migration-service-aws-offline/portal-offline-details-migration-aws.png" alt-text="Screenshot of the details showing validation and migration." lightbox="media/tutorial-migration-service-aws-offline/portal-offline-details-migration-aws.png":::

Some possible migration states:

### Migration states

| State | Description |
| --- | --- |
| **InProgress** | The migration infrastructure setup is underway, or the actual data migration is in progress. |
| **Canceled** | The migration is canceled or deleted. |
| **Failed** | The migration has failed. |
| **Validation Failed** | The validation has failed. |
| **Succeeded** | The migration has succeeded and is complete. |
| **WaitingForUserAction** | Applicable only for online migration. Waiting for user action to perform cutover. |

### Migration substates

| Substate | Description |
| --- | --- |
| **PerformingPreRequisiteSteps** | Infrastructure setup is underway for data migration. |
| **Validation in Progress** | Validation is in progress. |
| **MigratingData** | Data migration is in progress. |
| **CompletingMigration** | Migration is in the final stages of completion. |
| **Completed** | Migration has been completed. |
| **Failed** | Migration has failed. |

### Validation substates

| Substate | Description |
| --- | --- |
| **Failed** | Validation has failed. |
| **Succeeded** | Validation is successful. |
| **Warning** | Validation is in warning. | 

### Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

- Canceling a migration stops further migration activity on your target server and moves to a **Canceled** state. The cancel action rolls back all changes made by the migration service on your target server.

#### [CLI](#tab/cli)

This article explores using the Azure CLI to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL. The Azure CLI provides a powerful and flexible command-line interface that allows you to perform various tasks, including database migration. Following the steps outlined in this article, you can seamlessly transfer your database to Azure and take advantage of its powerful features and scalability.

To learn more about Azure CLI with the migration service, visit [How to set up Azure CLI for the migration service](how-to-setup-azure-cli-commands-postgresql.md).

Once the CLI is installed, open the command prompt and log into your Azure account using the below command.

```azurecli-interactive
az login
```

### Configure the migration task

To begin the migration, you need to create a JSON file with the migration details. The JSON file contains the following information:

- Edit the below placeholders `<< >>` in the JSON lines and store them in the local machine as `<<filename>>.json` where the CLI is being invoked. In this tutorial, we have saved the file in C:\migration-CLI\migration_body.json

```bash
{
"properties": {
"SourceDBServerResourceId": "<<source hostname or IP address>>:<<port>>@<<username>>",
        "SecretParameters": {
            "AdminCredentials": {
                "SourceServerPassword": "<<Source Password>>",
                "TargetServerPassword": "<<Target Password>>"
            },
			"targetServerUserName": "<<Target username>>"
        },
        "DBsToMigrate": "<<comma separated list of databases in a array like - ["ticketdb","timedb","inventorydb"]>>",
        "OverwriteDBsInTarget": "true",
        "sourceType": "AWS_RDS",
        "sslMode": "Require"
    }
}
```

- Run the following command to check if any migrations are running. The migration name is unique across the migrations within the Azure Database for PostgreSQL flexible server target.

    ```azurecli-interactive
    az postgres flexible-server migration list --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --filter All
    ```

- In the above steps, there are no migrations performed so we start with the new migration by running the following command

    ```azurecli-interactive
    az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --migration-mode offline --migration-option ValidateAndMigrate --properties "C:\migration-cli\migration_body.json"
    ```

- Run the following command to initiate the migration status in the previous step. You can check the status of the migration by providing the migration name

    ```azurecli-interactive
    az postgres flexible-server migration show --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1
    ```

- The status of the migration progress is shown in the Azure CLI.
- You can also see the status of the Azure Database for PostgreSQL flexible server in the Azure portal.

- You can cancel any ongoing migration attempts using the `cancel` command. This command stops the particular migration attempt and rolls back all changes on your target server. Here's the CLI command to delete a migration:

    ```azurecli-interactive
    az postgres flexible-server migration update cancel --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1
    ```

---

## Check the migration when complete

After completing the databases, you need to manually validate the data between the source, and the target and verify that all the objects in the target database are successfully created.

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.
- Post verification, enable the high availability option on your flexible server as needed.
- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.
- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.
- Copy other server settings, such as tags, alerts, and firewall rules (if applicable), from the source instance to the flexible server.
- Make changes to your application to point the connection strings to a flexible server.
- Monitor the database performance closely to see if it requires performance tuning.

## Related content

- [Migrate online from AWS RDS PostgreSQL](tutorial-migration-service-aws-online.md)
- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from on-premises and Azure VMs](tutorial-migration-service-iaas.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
