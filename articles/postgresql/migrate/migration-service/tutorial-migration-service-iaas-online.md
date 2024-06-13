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

This tutorial guides you in migrating a PostgreSQL instance from your on-premises or Azure virtual machines (VMs) to Azure Database for PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL flexible server.

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

## Perform the migration

You can perform the migration by using the Azure portal or the Azure CLI.

#### [Portal](#tab/portal)

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration** and select it.
:::image type="content" source="../media/offline_portal_select_migration_pane.png" alt-text="Migrationselection.":::

1. Select the **Create** button to start a migration from On-Premises/Azure VM to Flexible Server. If this is the first time you're using the migration service, an empty grid appears with a prompt to begin your first migration.

 :::image type="content" source="../media/portal_offline_create_migration.png" alt-text="Createmigration.":::

  If you've already created migrations to your Flexible Server target, the grid contains information about migrations that were attempted.

1. Select the **Create** button. You go through a wizard-based series of tabs to create a migration into this Flexible Server target from the PostgreSQL source Server.

#### Setup

The first tab is the setup tab where user needs to provide migration details like migration name, source type to initiate the migrations
:::image type="content" source="../media/portal_online_setup_migration.png" alt-text="Setupmigration.":::

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type** - Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL, Azure Database for PostgreSQL - Single server, on-premises, Azure VM.

- **Migration Option** gives you the option to perform validations before triggering a migration. You can pick any of the following options:
     - **Validate** - Checks your server and database readiness for migration to the target.
     - **Migrate** - Skips validations and starts migrations.
     - **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered only if there are no validation failures.

It is always a good practice to choose **Validate** or **Validate and Migrate** option to perform pre-migration validations before running the migration. To learn more about the pre-migration validation refer to this [documentation](concepts-premigration-migration-service.md).

**Migration mode** gives you the option to pick the mode for the migration. **Offline** is the default option.

Select the **Next : Connect to source** button.

#### Runtime Server

The Migration Runtime Server is a specialized feature within the [migration service in Azure Database for PostgreSQL](concepts-migration-service-postgresql.md), designed to act as an intermediary server during migration. It's a separate Azure Database for PostgreSQL - Flexible Server instance that isn't the target server but is used to facilitate the migration of databases from a source environment that is only accessible via a private network.

:::image type="content" source="media/tutorial-migration-service-iaas-offline/portal-offline-runtime-server-migration-iaas.png" alt-text="Screenshot of the migration Runtime Server page.":::

For more information about the Runtime Server, visit the [Migration Runtime Server](concepts-migration-service-runtime-server.md).

#### Connect to Source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab** that is the source of the databases.

:::image type="content" source="../media/portal_offline_connectsource_migration.png" alt-text="Connectsourcemigration.":::

- **Server Name** - Provide the Hostname or the IP address os the source PostgreSQL instance
- **Port** - Port number of the Source server
- **Server admin login name** - Username of the source PostgreSQL server
- **Password** - Password of the source PostgreSQL server
- **SSL Mode** - Supported values are prefer and require. When the SSL at source PostgreSQL server is OFF then use the SSLMODE=prefer. If the SSL at source server is ON then use the SSLMODE=require. SSL values can be determined in postgresql.conf file.
- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step else need to identify the networking issues between target and source, verify username/password for source. Test connection will take few minutes to establish connection between target and source

After the successful test connection, select the **Next: Select Migration target**

#### Connect to Target

The **select migration target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="../media/portal_offline_connecttarget_migration.png" alt-text="Connecttargetmigration.":::

- **Admin username** - Admin username of the target PostgreSQL server
- **Password** - Password of the target PostgreSQL server
- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step else need to identify the networking issues between target and source, verify username/password for target. Test connection will take few minutes to establish connection between target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

#### Select Databases for Migration

Under this tab, there is a list of user databases inside the source server selected in the setup tab. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="../media/portal_offline_fetchdb_migration.png" alt-text="FetchDBmigration.":::

Post selecting the databases, select the **Next:Summary**

#### Summary

The **Summary** tab summarizes all the source and target details for creating the validation or migration. Review the details and select the start button.

:::image type="content" source="../media/portal_offline_summary_migration.png" alt-text="Summarymigration.":::

### Monitor the migration

After you select the start button, a notification appears in a few seconds to say that the validation or migration creation is successful. You are redirected automatically to the **Migration** blade of Flexible Server. This has a new entry for the recently created validation or migration.
:::image type="content" source="../media/portal_offline_monitor_migration.png" alt-text="Monitormigration.":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration** and **Start time**. The entries are displayed in the descending order of the start time with the most recent entry on the top. You can use the refresh button to refresh the status of the validation or migration.
You can also select the migration name in the grid to see the associated details.

As soon as the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes 2-3 minutes for the workflow to set up the migration infrastructure and network connections.

### Migration Details

In the Setup tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** sub state is completed, the workflow moves into the sub state of **Validation in Progress**.
- If validation has errors, the migration will move into a **Failed** state.
- If validation completes without any error, the migration will start and the workflow will move into the sub state of **Migrating Data**.

You can see the results of validation under the **Validation** tab and monitor the migration under the **Migration** tab.

:::image type="content" source="../media/portal_offline_validation_migration.png" alt-text="Validationmigration.":::
:::image type="content" source="../media/portal_offline_details_migration.png" alt-text="Detailsmigration.":::

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

### Cutover

In case of both **Migrate** as well as **Validate and Migrate**, completion of the Online migration requires another step - a Cutover action is required from the user. After the copy/clone of the base data is complete, the migration moves to `WaitingForUserAction` state and `WaitingForCutoverTrigger`` substate. In this state, user can trigger cutover from the portal by selecting the migration.

Before initiating cutover, it's important to ensure that:

- Writes to the source are stopped - `Latency` value is 0 or close to 0 The `Latency` information can be obtained from the migration details screen as shown below:
-
:::image type="content" source="../media/portal_online_cutover_migration.png" alt-text="Cutovermigration.":::

- `latency` value decreases to 0 or close to 0
- `latency` value indicates when the target last synced up with the source. At this point, writes to the source can be stopped and cutover initiated.In case there is heavy traffic at the source, it is recommended to stop writes first so that `Latency` can come close to 0 and then cutover is initiated.
- The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with non-zero `Latency`, the replication will stop until that point in time. All the data on source until the cutover point is then applied on the target. Say a latency was 15 minutes at cutover point, so all the change data in the last 15 minutes will be applied on the target.
- Time taken will depend on the backlog of changes occurred in the last 15 minutes. Hence, it is recommended that the latency goes to zero or near zero, before triggering the cutover.

:::image type="content" source="../media/portal_online_confirm_cutover.png" alt-text="Confirmcutovermigration.":::

- The migration moves to the `Succeeded` state as soon as the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

:::image type="content" source="../media/portal_online_successful_migration.png" alt-text="Successmigration.":::

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Cancelled** state.
Canceling a migration stops further migration activity on your target server and moves to a **Cancelled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.

#### [CLI](#tab/cli)

This tutorial explores using the Azure CLI to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL. The Azure CLI provides a powerful and flexible command-line interface that allows you to perform various tasks, including database migration. Following the steps outlined in this tutorial, you can seamlessly transfer your database to Azure and take advantage of its powerful features and scalability.

Once the CLI is installed, open the command prompt and log into your Azure account using the below command.

```azurecli-interactive
`az login`
```

### Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

#### Connect to sourceal, we will be migrating PostgreSQL database residing in Azure VM with public access to Azure Database for PostgreSQL – Flexible server using Azure CLI.

#### Connect to the source

- In this tutorial, source PostgreSQL version used is 14.8 and it is installed in one of the Azure VM with operating system as Ubuntu.
- Source PostgreSQL instance contains around 10 databases and for this tutorial we are going to migrate "ticketdb","timedb","salesdb" and "postgres" into Azure Database for PostgreSQL – Flexible server.

:::image type="content" source="../media/az_migration_source_cli.png" alt-text="Azmigrationsource.":::

#### Create target Azure Database for PostgreSQL – Flexible server

We used the [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server instance in the Azure portal](..\..\flexible-server\quickstart-create-server-portal.md) to create a corresponding PostgreSQL target flexible server. We kept the SKU same and given we are just migrating a small sample database; we are allocating 128 GB of storage. Below is the target server screenshot once created –

:::image type="content" source="../media/flexibleservertargetcreation.png" alt-text="Flexibleservertarget.":::

#### Perform migration using CLI

- Open the command prompt and login into the Azure using `az login` command

:::image type="content" source="../media/azlogintutorialcli.png" alt-text="Azlogincli.":::

:::image type="content" source="../media/successazlogincli.png" alt-text="Azsuccesslogin.":::

- Edit the below placeholders `<< >>` in the JSON lines and store in the local machine as `<<filename>>.json` where the CLI is being invoked. In this tutorial, we have saved the file in C:\migration-CLI\migration_body.json

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

- Run the following command, to check if there are any migrations already performed. The migration name is the unique across the migrations within the Azure Database for PostgreSQL – Flexible server target.

```bash
az postgres flexible-server migration list --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --filter All
```
:::image type="content" source="../media/listcli.png" alt-text="Listcli.":::

- In the above steps, there are no migrations performed so we will start with the new migration by running the following command –

```bash
az postgres flexible-server migration create --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --properties "C:\migration-cli\migration_body.json"
```
:::image type="content" source="../media/createmigrationcli.png" alt-text="Createcli.":::

- Run the following command to get the status of the migration that got initiated in the previous step. You can check the status of the migration by providing the migration name

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
- Copy other server settings like tags, alerts, and firewall rules (if applicable) from the source instance to the flexible server.
- Make changes to your application to point the connection strings to a flexible server.
- Monitor the database performance closely to see if it requires performance tuning.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from AWS RDS](tutorial-migration-service-aws.md)
- [Best practices](best-practices-migration-service-postgresql.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
