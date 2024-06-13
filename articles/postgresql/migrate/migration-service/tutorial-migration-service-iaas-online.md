---
title: "Migrate online from on-premises or an Azure VM to Azure Database for PostgreSQL"
description: "Learn to migrate seamlessly from on-premises or an Azure VM to Azure Database for PostgreSQL - Flexible Server using the new migration service in Azure."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/13/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: tutorial
ms.custom:
  - devx-track-azurecli
# CustomerIntent: As a user, I want to learn how to perform offline migration from on-premises and Azure virtual machines to Azure Database for PostgreSQL - Flexible Server using the migration service in Azure, so that I can simplify the transition and ensure data integrity and efficient deployment.
---

# Tutorial: Migrate online from an Azure VM or an on-premises PostgreSQL server to Azure Database for PostgreSQL with the migration service

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

This article guides you in migrating a PostgreSQL instance from your on-premises or Azure virtual machines (VMs) to Azure Database for PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to the Azure Database for PostgreSQL flexible server.

> [!div class="checklist"]
>  
> - Configure your Azure Database for PostgreSQL Flexible Server
> - Configure the migration task
> - Monitor the migration
> - Check the migration when completed

## Prerequisites

To begin the migration, you need the following prerequisites:

[!INCLUDE [prerequisites-migration-service-postgresql-offline-aws](includes/aws/prerequisites-migration-service-postgresql-offline-aws.md)]

## Perform the migration

You can migrate by using the Azure portal or the Azure CLI.

#### [Portal](#tab/portal)

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the Flexible Server's **Overview** tab, on the left menu, scroll down to Migration and select it.

    :::image type="content" source="media/tutorial-migration-service-iaas-online/offline_portal_select_migration_pane.png" alt-text="Migrationselection.":::

1. Select the **Create** button to migrate from an Azure virtual machine (VM) or an on-premises PostgreSQL server to the Flexible Server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="media/tutorial-migration-service-iaas-online/portal_offline_create_migration.png" alt-text="Createmigration.":::

    If you've already created migrations to your Flexible Server target, the grid contains information about attempted migrations.

1. Select the **Create** button. You then go through a wizard-based series of tabs to create a migration into this Flexible Server target from the PostgreSQL source Server.

#### Setup

The first tab is the setup tab, where the user provides migration details like migration name and source type to initiate the migrations.

:::image type="content" source="media/tutorial-migration-service-iaas-online/01-portal-online-setup-iaas.png" alt-text="Setup migration.":::

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type**—Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL or Azure Database for PostgreSQL—single server, on-premises, or Azure VM.

- **Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options:
     - **Validate** - Checks your server and database readiness for migration to the target.
     - **Migrate** - Skips validations and starts migrations.
     - **Validate and Migrate**—Performs validation before triggering a migration. The migration is triggered only if there are no validation failures.

Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration. To learn more about the premigration validation, refer to this [documentation](concepts-premigration-migration-service.md).

**Migration mode** allows you to choose the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to source** button.

#### Runtime Server

The Migration Runtime Server is a specialized feature within the [migration service in Azure Database for PostgreSQL](concepts-migration-service-postgresql.md), designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

:::image type="content" source="media/tutorial-migration-service-iaas-online/02-portal-online-runtime-server-iaas.png" alt-text="Screenshot of the migration Runtime Server page.":::

For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

#### Connect to source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab** that is the source of the databases.

:::image type="content" source="media/tutorial-migration-service-iaas-online/03-portal-online-connect-to-source-iaas.png" alt-text="Connectsourcemigration.":::

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance
- **Port** - Port number of the Source server
- **Server admin login name** - Username of the source PostgreSQL server
- **Password** - Password of the source PostgreSQL server
- **SSL Mode** - Supported values are preferred and required. When the SSL at the source PostgreSQL server is OFF, then use the SSLMODE=prefer. If the SSL at the source server is ON, then use the SSLMODE=require. SSL values can be determined in postgresql.conf file.
- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step. Else, you need to identify the networking issues between the target and source and verify the username/password for the source. Test connection takes few minutes to establish a connection between the target and source

After the successful test connection, select the **Next: Select Migration target**

#### Select migration target

The **select migration target** tab displays metadata for the Flexible Server target, such as the subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="media/tutorial-migration-service-iaas-online/04-portal-online-select-migration-target-iaas.png" alt-text="Connecttargetmigration.":::

- **Admin username** - Admin username of the target PostgreSQL server
- **Password** - Password of the target PostgreSQL server
- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step. Else, we need to identify the networking issues between target and source and verify the username/password for the target. The test connection takes a few minutes to establish connection between the target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

#### Select databases for migration

Under this tab, a list of user databases is inside the source server selected in the setup tab. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="media/tutorial-migration-service-iaas-online/05-portal-online-select-database-for-migration-iaas.png" alt-text="FetchDBmigration.":::

After selecting the databases, select the **Next: Summary**

#### Summary

The **Summary** tab summarizes all the source and target details for creating the validation or migration. Review the details and select the start button.

:::image type="content" source="media/tutorial-migration-service-iaas-online/06-portal-online-summary-iaas.png" alt-text="Summarymigration.":::

### Monitor the migration

After you select the start button, a notification appears in a few seconds saying that the validation or migration creation is successful. You're redirected automatically to the **Migration** blade of Flexible Server, which has a new entry for the recently created validation or migration.
:::image type="content" source="media/tutorial-migration-service-iaas-online/portal_offline_monitor_migration.png" alt-text="Monitormigration.":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration, and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry at the top. You can use the refresh button to refresh the status of the validation or migration.
Select the migration name in the grid to see the associated details.

When the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2 to 3 minutes to set up the migration infrastructure and network connections.

### Migration Details

In the Setup tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.
- If validation has errors, the migration moves into a **Failed** state.
- If validation completes without error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

The validation results are displayed under the **Validation** tab, and the migration is monitored under the **Migration** tab.

:::image type="content" source="media/tutorial-migration-service-iaas-online/portal_offline_validation_migration.png" alt-text="Validationmigration.":::

:::image type="content" source="media/tutorial-migration-service-iaas-online/portal_offline_details_migration.png" alt-text="Detailsmigration.":::

Some possible migration states:

### Migration States

| State | Description |
| --- | --- |
| **InProgress** | The migration infrastructure setup is underway, or the actual data migration is in progress. |
| **Canceled** | The migration is canceled or deleted. |
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

### Cutover

If there are both **Migrate** and **Validate and Migrate**, completion of the Online migration requires another step—the user must take a Cutover action. After the copy/clone of the base data is complete, the migration moves to the `WaitingForUserAction` state and the `WaitingForCutoverTrigger' substrate. In this state, the user can trigger the cutover from the portal by selecting the migration.

Before initiating cutover, it's important to ensure that:

- Writes to the source are stopped - `Latency` value is 0 or close to 0. The `Latency` information can be obtained from the migration details screen as shown below:

    :::image type="content" source="media/tutorial-migration-service-iaas-online/portal-online-cutover_migration.png" alt-text="Cutovermigration.":::

- `latency` value decreases to 0 or close to 0
- `latency` value indicates when the target last synced with the source. Writing to the source can be stopped at this point, and a cutover can be initiated. In case there's heavy traffic at the source, it's recommended to stop writes first so that `Latency` can come close to 0, and then a cutover is initiated.
- The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency`, the replication stops until that point in time. All the data on the source until the cutover point is then applied to the target. if you experience a latency of 15 minutes at the cutover point, all the changed data in the last 15 minutes are applied to the target.
The time depends on the backlog of changes occurring in the last 15 minutes. Hence, it's recommended that the latency go to zero or near zero before triggering the cutover.

    :::image type="content" source="media/tutorial-migration-service-iaas-online/portal-online-confirm-cutover.png" alt-text="Confirmcutovermigration.":::

- The migration moves to the `Succeeded` state when the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

    :::image type="content" source="media/tutorial-migration-service-iaas-online/portal-online-successful-migration.png" alt-text="Successmigration.":::

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Cancelled** state.

Canceling a migration stops further migration activity on your target server and moves to a **Cancelled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server that is involved in a canceled migration.

#### [CLI](#tab/cli)

This article explores using the Azure CLI to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL. The Azure CLI provides a powerful and flexible command-line interface that allows you to perform various tasks, including database migration. Following the steps outlined in this article, you can seamlessly transfer your database to Azure and take advantage of its powerful features and scalability.

Once the CLI is installed, open the command prompt and log into your Azure account using the below command.

```azurecli-interactive
`az login`
```

### Configure the migration task

We begin migrating the PostgreSQL database residing in an Azure VM with public access to an Azure Database for PostgreSQL Flexible server using Azure CLI.

#### Connect to the source

In this article, the source PostgreSQL version used is 14.8, and it's installed in one of the Azure VMs with an operating system of Ubuntu.
The source PostgreSQL instance contains around 10 databases, and for this article, we're going to migrate "ticketdb," "timedb," "salesdb," and "postgres" into the Azure Database for PostgreSQL—Flexible server.

#### Create target Azure Database for PostgreSQL – Flexible server

We used the [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server instance in the Azure portal](..\..\flexible-server\quickstart-create-server-portal.md) to create a corresponding PostgreSQL target flexible server. We kept the SKU the same, and given we're just migrating a small sample database, we're allocating 128 GB of storage. Below is the target server screenshot once created –

    :::image type="content" source="media/tutorial-migration-service-iaas-online/flexibleservertargetcreation.png" alt-text="Flexibleservertarget.":::

#### Perform migration using CLI

- Open the command prompt and login into the Azure using `az login` command

- Edit the below placeholders `<< >>` in the JSON lines and store them in the local machine as `<<filename>>.json` where the CLI is being invoked. In this article, we have saved the file in C:\migration-CLI\migration_body.json

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
        "MigrationMode": "Online",
    "sourceType": "OnPremises",
    "sslMode": "Prefer"
    }
}
```

- Run the following command to check if any migrations have already been performed. The migration name is unique across the migrations within the Azure Database for PostgreSQL – Flexible server target.

```bash
az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
```

- In the above steps, there are no migrations performed so we start with the new migration by running the following command –

```bash
az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --properties "C:\migration-cli\migration_body.json"
```

- Run the following command to get the migration status initiated in the previous step. You can check the status of the migration by providing the migration name

```bash
az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
```

- You can also see the status in the Azure Database for PostgreSQL – Flexible server portal

---

## Check the migration when complete

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

- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from AWS RDS](tutorial-migration-service-aws.md)
- [Best practices](best-practices-migration-service-postgresql.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
