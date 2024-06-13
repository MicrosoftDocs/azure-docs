---
title: "Tutorial: Migrate online from AWS RDS using the migration service with the Azure portal and Azure CLI"
description: "Learn to migrate online seamlessly from AWS RDS to Azure Database for PostgreSQL using the new migration service in Azure, simplifying the transition while ensuring data integrity and efficient deployment."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/12/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: tutorial
ms.custom:
  - devx-track-azurecli
# customer intent: As a developer, I want to learn how to migrate from AWS RDS to Azure Database for PostgreSQL using the migration service, so that I can simplify the transition and ensure data integrity.
---

# Tutorial: Migrate online from AWS RDS PostgreSQL to Azure Database for PostgreSQL using the migration service

In this tutorial, we explore how to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL online.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL server.

> [!div class="checklist"]
>  
> - Configure your Azure Database for PostgreSQL Flexible Server
> - Configure the migration task
> - Monitor the migration
> - Check the migration when completed

## Prerequisites

To complete the migration, you need the following prerequisites:

[!INCLUDE [prerequisites-migration-service-postgresql-online-iaas](includes/iaas/prerequisites-migration-service-postgresql-online-iaas.md)]

## Perform the migration

You can perform the migration by using the Azure portal or the Azure CLI.

#### [Portal](#tab/portal)

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the Flexible Server's Overview tab, on the left menu, scroll down to Migration and select it.

    :::image type="content" source="media/tutorial-migration-service-aws-online/migration-portal-select.png" alt-text="Screenshot of the Migration selection." lightbox="media/tutorial-migration-service-aws-online/migration-portal-select.png":::

1. Select the **Create** button to migrate from AWS RDS to Azure Database for PostgreSQL - Flexible Server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="media/tutorial-migration-service-aws-online/portal-online-create-migration.png" alt-text="Screenshot of creating a migration." lightbox="media/tutorial-migration-service-aws-online/portal-online-create-migration.png":::

    If you've already created migrations to your Azure Database for PostgreSQL target, the grid contains information about attempted migrations.

1. Select the **Create** button. You then go through a wizard-based series of tabs to create a migration into this Azure Database for PostgreSQL target from the PostgreSQL source instance.

#### Setup

The first tab is the setup tab, where the user needs to provide migration details like migration name source type to initiate the migrations

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-portal-setup.png" alt-text="Screenshot of Setup migration." lightbox="media/tutorial-migration-service-aws-online/aws-portal-setup.png":::

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type**—Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL or Azure Database for PostgreSQL—single server, on-premises, or Azure VM.

- **Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options:

     - **Validate** - Checks your server and database readiness for migration to the target.
     - **Migrate** - Skips validations and starts migrations.
     - **Validate and Migrate**—Performs validation before triggering a migration. The migration is triggered only if there are no validation failures.

Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration. To learn more about the premigration validation, refer to this [documentation](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to the Source** button.

#### Runtime Server

The Migration Runtime Server is a specialized feature within the [migration service in Azure Database for PostgreSQL](concepts-migration-service-postgresql.md), designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

:::image type="content" source="media/tutorial-migration-service-aws-offline/portal-offline-runtime-server-migration-aws.png" alt-text="Screenshot of the Migration Runtime Server page.":::

For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

#### Connect to source

The **Connect to Source** tab prompts you to provide details related to the Source selected in the **Setup Tab**, which is the Source of the databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-connect-source.png" alt-text="Screenshot of Connectsourcemigration." lightbox="media/tutorial-migration-service-aws-online/aws-connect-source.png":::

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance
- **Port** - Port number of the Source server
- **Server admin login name** - Username of the source PostgreSQL server
- **Password** - Password of the Source PostgreSQL server
- **SSL Mode**—The supported values are prefer and require. When the SSL at the Source PostgreSQL server is OFF, use SSLMODE=prefer. If the SSL at the source server is ON, use SSLMODE=require. SSL values can be determined in the Postgresql.conf file.
- **Test Connection** - Performs the connectivity test between target and Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and Source and verify the username/password for the Source. Test connection takes a few minutes to establish a connection between the target and Source

After the successful test connection, select the **Next: Select Migration target**

#### Select migration target

The **select migration target** tab displays metadata for the Flexible Server target, such as the subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-connect-target.png" alt-text="Screenshot of the connect target migration screen.":::

- **Admin username** - Admin username of the target PostgreSQL server
- **Password** - Password of the target PostgreSQL server
- **Test Connection** - Performs the connectivity test between the target and Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the Source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and the source.

After the successful test connection, select the **Next: Select Database(s) for Migration**

#### Select databases for migration

Under this tab, a list of user databases is inside the source server selected in the setup tab. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-fetch-db.png" alt-text="Screenshot of FetchDBmigration.":::

After selecting the databases, select the **Next: Summary**

#### Summary

The **Summary** tab summarizes all the Source and target details for creating the validation or migration. Review the details and select the start button.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-summary.png" alt-text="Screenshot of Summary migration.":::

#### Monitor the migration

After you select the start button, a notification appears in a few seconds saying that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of Flexible Server, which has a new entry for the recently created validation or migration.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-monitor.png" alt-text="Screenshot of Monitor migration." lightbox="media/tutorial-migration-service-aws-online/aws-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration**, and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry at the top. You can use the refresh button to refresh the status of the validation or migration.
Select the migration name in the grid to see the associated details.

As soon as the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substrate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

#### Migration details

In the Setup tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.
- If validation completes without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the results of validation and migration at the instance and database level.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-details-migration.png" alt-text="Screenshot of Details migration." lightbox="media/tutorial-migration-service-aws-online/aws-details-migration.png":::

Some possible migration states:

### Migration States

| State | Description |
| --- | --- |
| **InProgress** | The migration infrastructure setup is underway, or the actual data migration is in progress. |
| **Cancelled** | The migration is canceled or deleted. |
| **Failed** | The migration has failed. |
| **Validation Failed** | The validation has failed. |
| **Succeeded** | The migration has succeeded and is complete. |
| **WaitingForUserAction** | Applicable only for online migration. Waiting for user action to perform cutover. |

### Migration Substates

| Substate | Description |
| --- | --- |
| **PerformingPreRequisiteSteps** | Infrastructure setup is underway for data migration. |
| **Validation in Progress** | Validation is in progress. |
| **MigratingData** | Data migration is in progress. |
| **CompletingMigration** | Migration is in the final stages of completion. |
| **Completed** | Migration has been completed. |
| **Failed** | Migration has failed. |

### Validation Substates

| Substate | Description |
| --- | --- |
| **Failed** | Validation has failed. |
| **Succeeded** | Validation is successful. |
| **Warning** | Validation is in warning. | 

#### Cutover

If there are both **Migrate** and **Validate and Migrate**, completion of the Online migration requires another step—the user must take a Cutover action. After the copy/clone of the base data is complete, the migration moves to the `WaitingForUserAction` state and the `WaitingForCutoverTrigger' substate. In this state, the user can trigger the cutover from the portal by selecting the migration.

Before initiating cutover, it's important to ensure that:

- Writes to the Source are stopped - `Latency` value is 0 or close to 0 The `Latency` information can be obtained from the migration details screen as shown below:

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-cutover-migration.png" alt-text="Screenshot of Cutover migration." lightbox="media/tutorial-migration-service-aws-online/aws-cutover-migration.png":::

- `latency` value decreases to 0 or close to 0

- The `latency` value indicates when the target last synced with the Source. At this point, writing to the Source can be stopped, and cutover can be initiated. In case there's heavy traffic at the Source, it's recommended to stop writes first so that `Latency` can come close to 0, and then cutover is initiated.
The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency,` the replication stops until that point in time. All the data on the Source until the cutover point is then applied on the target. Say a latency was 15 minutes at the cutover point, so all the changed data in the last 15 minutes are applied on the target.
Time depends on the backlog of changes occurring in the last 15 minutes. Hence, it's recommended that the latency go to zero or near zero before triggering the cutover.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png" alt-text="Screenshot of Confirmcutovermigration." lightbox="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png":::

- The migration moves to the `Succeeded` state when the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-success-migration.png" alt-text="Screenshot of Success migration." lightbox="media/tutorial-migration-service-aws-online/aws-success-migration.png":::

#### [CLI](#tab/cli)

This tutorial explores using the Azure CLI to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL. The Azure CLI provides a powerful and flexible command-line interface that allows you to perform various tasks, including database migration. Following the steps outlined in this tutorial, you can seamlessly transfer your database to Azure and take advantage of its powerful features and scalability.

Once the CLI is installed, open the command prompt and log into your Azure account using the below command.

```azurecli-interactive
`az login`
```

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

#### Connect to source

- In this tutorial, source AWS RDS for the PostgreSQL version used is 14.8

- For this tutorial, we're going to migrate "db8_1","db8_2" and "postgres" into Azure Database for PostgreSQL – Flexible Server.

#### Create target Azure Database for PostgreSQL

We used the [Create an Azure Database for PostgreSQL Flexible Server instance](../../flexible-server/quickstart-create-server-portal.md) to create a corresponding PostgreSQL target flexible server.

### Migrate using Azure CLI

- Open the command prompt and login into the Azure using `az login` command

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
            << comma separated list of databases like - "db8_1","db8_2" >>
        ],
        "OverwriteDBsInTarget": "true",
        "MigrationMode": "Online",
    "sourceType": "AWS_RDS",
    "sslMode": "Require"
    }
}
```

- Run the following command to check if any migrations have already been performed. The migration name is the unique across the migrations within the Azure Database for PostgreSQL – Flexible server target.

```bash
az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
```

- In the above steps, there are no migrations performed so we'll start with the new migration by running the following command –

```bash
az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --properties "C:\migration-cli\migration_body.json"
```

Run the following command to get the migration status initiated in the previous step. You can check the status of the migration by providing the migration name

```bash
az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
```

In Online migrations, after the base data migration is complete, the migration task moves to the `WaitingForCutoverTrigger` substate. In this state, the user can trigger the cutover through the CLI using the command below. The cutover can also be triggered from the portal by selecting the migration name in the migration grid.

```bash
az postgres flexible-server migration update --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --cutover
```

-  You can also see the status in the Azure Database for PostgreSQL – Flexible server portal

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Canceled** state.
Canceling a migration stops further migration activity on your target server and moves to a **Canceled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server that is involved in a canceled migration.

---

## Check the migration when completed

After completing the databases, you need to manually validate the data between source and target and verify that all the objects in the target database are successfully created.

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.
- Post verification, enable the high availability option on your flexible server as needed.
- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.
- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.
Copy other server settings, such as tags, alerts, and firewall rules (if applicable), from the source instance to the flexible server.
- Make changes to your application to point the connection strings to a flexible server.
- Monitor the database performance closely to see if it requires performance tuning.

## Related content

- [Migrate offline from AWS RDS PostgreSQL](tutorial-migration-service-aws-offline.md)
- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from on-premises and Azure VMs](tutorial-migration-service-iaas.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
