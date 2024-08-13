---
title: "Tutorial: Migrate online from AWS RDS using the migration service with the Azure portal and Azure CLI"
description: "Learn to migrate online seamlessly from AWS RDS to Azure Database for PostgreSQL using the new migration service in Azure, simplifying the transition while ensuring data integrity and efficient deployment."
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

# Tutorial: Migrate online from AWS RDS PostgreSQL to Azure Database for PostgreSQL with the migration service Preview

This article explores how to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL online.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL server.

> [!div class="checklist"]
>  
> - Prerequisites
> - Perform the migration
> - Monitor the migration
> - Cutover
> - Check the migration when completed

## Prerequisites

To complete the migration, you need the following prerequisites:

[!INCLUDE [prerequisites-migration-service-postgresql-online-iaas](includes/aws/prerequisites-migration-service-postgresql-online-aws.md)]

## Perform the migration

You can migrate by using the Azure portal or the Azure CLI.

#### [Portal](#tab/portal)

The Azure portal provides a simple and intuitive wizard-based experience that guides you through migration. Following the steps outlined in this tutorial, you can seamlessly transfer your database to Azure Database for PostgreSQL - Flexible Server and take advantage of its powerful features and scalability.

To migrate with the Azure portal, you first configure the migration task, connect to the source and target, and then perform the migration.

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the Flexible Server's Overview tab, on the left menu, scroll down to Migration and select it.

    :::image type="content" source="media/tutorial-migration-service-aws-online/migration-portal-select.png" alt-text="Screenshot of the Migration selection." lightbox="media/tutorial-migration-service-aws-online/migration-portal-select.png":::

1. Select the **Create** button to migrate from AWS RDS to Azure Database for PostgreSQL - Flexible Server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="media/tutorial-migration-service-aws-online/portal-online-create-migration.png" alt-text="Screenshot of creating a migration." lightbox="media/tutorial-migration-service-aws-online/portal-online-create-migration.png":::

    If you've already created migrations to your Azure Database for PostgreSQL target, the grid contains information about attempted migrations.

1. Select the **Create ** button. Then, you go through a wizard-based series of tabs to create a migration into this Azure Database for PostgreSQL target from the PostgreSQL source instance.

#### Setup

The first tab is the **Setup** tab, where the user needs to provide migration details like migration name source type to initiate the migrations.

:::image type="content" source="media/tutorial-migration-service-aws-online/01-portal-online-setup-aws.png" alt-text="Screenshot of the Setup migration in the Azure portal." lightbox="media/tutorial-migration-service-aws-online/01-portal-online-setup-aws.png":::

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type**—Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL or Azure Database for PostgreSQL—single server, on-premises, or Azure VM.

- **Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options:

     - **Validate** - Checks your server and database readiness for migration to the target.
     - **Migrate** - Skips validations and starts migrations.
     - **Validate and Migrate**—Performs validation before triggering a migration. The migration is triggered only if there are no validation failures.

Choosing the **Validate** or **Validate and Migrate** option is always a good practice when performing premigration validations before running the migration. To learn more about the premigration validation, refer to this [documentation](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to the Source** button.

#### Select Runtime Server

The migration Runtime Server is a specialized feature within the migration service, designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

:::image type="content" source="media/tutorial-migration-service-aws-online/02-portal-online-runtime-server-aws.png" alt-text="Screenshot of the Migration Runtime Server page.":::

#### Connect to source

The **Connect to Source** tab prompts you to provide details related to the Source selected in the **Setup Tab**, which is the Source of the databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/03-portal-online-connect-source-aws.png" alt-text="Screenshot of Connectsourcemigration." lightbox="media/tutorial-migration-service-aws-online/03-portal-online-connect-source-aws.png":::

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance
- **Port** - Port number of the Source server
- **Server admin login name** - Username of the source PostgreSQL server
- **Password** - Password of the Source PostgreSQL server
- **SSL Mode**—The supported values are preferred and required. When the SSL at the Source PostgreSQL server is OFF, use SSLMODE=prefer. If the SSL at the source server is ON, use SSLMODE=require. SSL values can be determined in the Postgresql.conf file.
- **Test Connection**—Performs the connectivity test between the target and the Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the Source and verify the username/password for the Source. Establishing a test connection takes a few minutes.

After the successful test connection, select the **Next: Select Migration target**

#### Select migration target

The **select migration target** tab displays metadata for the Flexible Server target, such as the subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="media/tutorial-migration-service-aws-online/04-portal-online-select-migration-target-aws.png" alt-text="Screenshot of the connect target migration screen.":::

- **Admin username** - Admin username of the target PostgreSQL server
- **Password** - Password of the target PostgreSQL server
- **Test Connection** - Performs the connectivity test between the target and Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the Source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and the source.

After the successful test connection, select the **Next: Select Database(s) for Migration**

#### Select databases for migration

Under this tab, a list of user databases is inside the source server selected in the setup tab. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/05-portal-online-select-database-migration-aws.png" alt-text="Screenshot of FetchDBmigration.":::

After selecting the databases, select the **Next: Summary**

#### Summary

The **Summary** tab summarizes all the Source and target details for creating the validation or migration. Review the details and select the start button.

:::image type="content" source="media/tutorial-migration-service-aws-online/06-portal-online-summary-aws.png" alt-text="Screenshot of Summary migration.":::

#### Monitor the migration

After you select the start button, a notification will appear in a few seconds saying that the validation or migration creation is successful. You'll then be automatically redirected to the **Migration** page of Flexible Server, which has a new entry for the recently created validation or migration.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-monitor.png" alt-text="Screenshot of Monitor migration." lightbox="media/tutorial-migration-service-aws-online/aws-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration**, and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry at the top. You can use the refresh button to refresh the status of the validation or migration.
Select the migration name in the grid to see the associated details.

When the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substrate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

#### Migration details

In the Setup tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.
- If validation completes without error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the results of validation and migration at the instance and database level.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-details-migration.png" alt-text="Screenshot of Details migration." lightbox="media/tutorial-migration-service-aws-online/aws-details-migration.png":::

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

#### Cutover

If there are both **Migrate** and **Validate and Migrate**, completing the Online migration requires another step—the user must take a Cutover action. After the copy/clone of the base data is complete, the migration moves to the `WaitingForUserAction` state and the `WaitingForCutoverTrigger' substate. In this state, the user can trigger the cutover from the portal by selecting the migration.

Before initiating cutover, it's important to ensure that:

- Writes to the Source are stopped - `Latency` value is 0 or close to 0. The `Latency` information can be obtained from the migration details screen as shown below:

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-cutover-migration.png" alt-text="Screenshot of Cutover migration." lightbox="media/tutorial-migration-service-aws-online/aws-cutover-migration.png":::

- `latency` value decreases to 0 or close to 0

- The `latency` value indicates when the target last synced with the Source. At this point, writing to the Source can be stopped, and cutover can be initiated. In case there's heavy traffic at the Source, it's recommended to stop writes first so that `Latency` can come close to 0, and then a cutover is initiated.
The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency,` the replication stops until that point in time. All the data is on the Source until the cutover point is applied to the target. Say a latency was 15 minutes at the cutover point, so all the changed data in the last 15 minutes are applied to the target.
Time depends on the backlog of changes occurring in the last 15 minutes. Hence, it's recommended that the Latency go to zero or near zero before triggering the cutover.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png" alt-text="Screenshot of Confirmcutovermigration." lightbox="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png":::

- The migration moves to the `Succeeded` state when the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-success-migration.png" alt-text="Screenshot of Success migration." lightbox="media/tutorial-migration-service-aws-online/aws-success-migration.png":::

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
    az postgres flexible-server migration create --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --migration-mode online --migration-option ValidateAndMigrate --properties "C:\migration-cli\migration_body.json"
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

#### Cutover

- After the base data migration is complete in online migrations, the migration task moves to the `WaitingForCutoverTrigger` substate. In this state, the user can trigger the cutover through the CLI using the command below. The cutover can also be triggered from the portal by selecting the migration name in the migration grid.
- You can also initiate the cutover from the Azure portal.

    ```azurecli-interactive
    az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name migration1 --cutover
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

- [Migrate offline from AWS RDS PostgreSQL](tutorial-migration-service-aws-offline.md)
- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from on-premises and Azure VMs](tutorial-migration-service-iaas.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
