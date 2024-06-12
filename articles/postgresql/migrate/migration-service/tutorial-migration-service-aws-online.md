---
title: "Tutorial: Migrate online from AWS RDS using the migration service with the Azure portal and Azure CLI"
description: "Learn to migrate online seamlessly from AWS RDS to Azure Database for PostgreSQL using the new migration service in Azure, simplifying the transition while ensuring data integrity and efficient deployment."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/20/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: tutorial
ms.custom:
  - devx-track-azurecli
# customer intent: As a developer, I want to learn how to migrate from AWS RDS to Azure Database for PostgreSQL using the migration service, so that I can simplify the transition and ensure data integrity.
---

# Tutorial: Migrate online from AWS RDS PostgreSQL to Azure Database for PostgreSQL using the migration service

This tutorial guides you in migrating a PostgreSQL instance from your AWS RDS to Azure Database for a PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to the Azure Database for PostgreSQL flexible server.

> [!div class="checklist"]
>  
> - Configure your Azure Database for PostgreSQL Flexible Server
> - Configure the migration task
> - Monitor the migration
> - Cancel the migration
> - Post migration

## Prerequisites

Before you begin the migration process, make sure you have completed the following prerequisites:

- The source PostgreSQL version must be 9.5 or greater
- Install test_decoding - Source Setup
- Target setup
- Source version
- Enable CDC as a source
- Network setup
- Extensions
- Users and roles
- Server parameters

### Source setup (Install test_decoding)

- **test_decoding** receives WAL through the logical decoding mechanism and decodes it into text representations of the operations performed.
- In Amazon RDS for PostgreSQL, the test_decoding plugin is preinstalled and ready for logical replication. This allows you to easily set up logical replication slots and stream WAL changes, facilitating use cases such as change data capture (CDC) or replication to external systems.
- For more information about the test-decoding plugin, see the [PostgreSQL documentation](https://www.postgresql.org/docs/16/test-decoding.html)

### Target setup

- Before migrating, an Azure Database for PostgreSQL must be created.
- SKU provisioned for Azure Database for PostgreSQL must match the source.

To create a new Azure Database for PostgreSQL, visit - [Create an Azure Database for PostgreSQL](../../flexible-server/quickstart-create-server-portal.md)
### Source version

### Enable CDC as a source

- test_decoding logical decoding plugin captures the changed records from the source.
- In the source, PostgreSQL instance, modify the following parameters by creating a new parameter group:
    - Set `rds.logical_replication = 1`
    - Set `max_replication_slots` to a value greater than one; the value should be greater than the number of databases selected for migration.
    - Set `max_wal_senders` to a value greater than one. It should be at least the same as `max_replication_slots`, plus the number of senders already used on your instance.
    - The `wal_sender_timeout` parameter ends inactive replication connections longer than the specified number of milliseconds. The default for an AWS RDS for PostgreSQL instance is `30000 milliseconds (30 seconds)`. Setting the value to 0 (zero) disables the timeout mechanism and is a valid setting for migration.

### Network setup

Networking is required to establish a successful connectivity between the source and target.

- You need to set up Express route/ IP Sec VPN/ VPN tunneling while connecting your source from AWS RDS to Azure.
- For detailed information on the networking setup required when using the migration service in Azure Database for PostgreSQL, refer to the following Microsoft documentation - [Network guide for migration service in Azure Database for PostgreSQL](how-to-network-setup-migration-service.md)

### Extensions

- Use the select command in the source to list all the extensions that are being used - `select extname, extversion from pg_extension;`
- Search for azure.extensions server parameter on the Server parameter page on your Azure Database for PostgreSQL – Flexible server. Enable the extensions found in the source within the PostgreSQL flexible server.

:::image type="content" source="media/tutorial-migration-service-aws-online/az-flexible-server-enable-extensions.png" alt-text="Screenshot of Enable extensions.":::

- Check if the list contains any of the following extensions -
    - PG_CRON
    - PG_HINT_PLAN
    - PG_PARTMAN_BGW
    - PG_PREWARM
    - PG_STAT_STATEMENTS
    - PG_AUDIT
    - PGLOGICAL
    - WAL2JSON
If yes, search the server parameters page for the shared_preload_libraries parameter. This parameter indicates the set of extension libraries that are preloaded at the server restart.

:::image type="content" source="media/tutorial-migration-service-aws-online/az-flexible-server-shared-preload-extensions.png" alt-text="Screenshot of shared Preload libraries.":::

### Users and Roles

- The users and different roles must be migrated manually to the Azure Database for PostgreSQL – Flexible server. For migrating users and roles, you can use `pg_dumpall --globals-only -U <<username> -f <<filename>>.sql`.
- Azure Database for PostgreSQL – The flexible server doesn't support any superuser; users having roles of superuser need to be removed before migration.

### Server Parameters

- You need to manually configure the server parameter values in the Azure Database for PostgreSQL – Flexible server based on the server parameter values configured in the source.
- 
#### [Portal](#tab/portal)

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the Flexible Server's Overview tab, on the left menu, scroll down to Migration and select it.

    :::image type="content" source="media/tutorial-migration-service-aws-online/migration-portal-select.png" alt-text="Screenshot of Screenshot of the Migration selection." lightbox="media/tutorial-migration-service-aws-online/migration-portal-select.png":::

1. Select the **Create** button to migrate from AWS RDS to Azure Database for PostgreSQL - Flexible Server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="media/tutorial-migration-service-aws-online/portal-online-create-migration.png" alt-text="Screenshot of Screenshot of creating a migration." lightbox="media/tutorial-migration-service-aws-online/portal-online-create-migration.png"::: image type="content" source="media/tutorial-migration-service-aws-online/portal-online-create-migration.png" alt-text="Screenshot of Screenshot of creating a migration."

  If you've already created migrations to your Azure Database for PostgreSQL - Flexible Server target, the grid contains information about attempted migrations.

1. Select the ** Create ** button. You'll then go through a wizard-based series of tabs to create a migration into this Azure Database for PostgreSQL—Flexible Server target from the PostgreSQL source instance.

### Setup

The first tab is the setup tab, where the user needs to provide migration details like migration name source type to initiate the migrations

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-portal-setup.png" alt-text="Screenshot of Screenshot of Setup migration." lightbox="media/tutorial-migration-service-aws-online/aws-portal-setup.png":::

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type**—Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL or Azure Database for PostgreSQL—single server, on-premises, or Azure VM.

- **Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options:

     - **Validate** - Checks your server and database readiness for migration to the target.
     - **Migrate** - Skips validations and starts migrations.
     - **Validate and Migrate**—Performs validation before triggering a migration. The migration is triggered only if there are no validation failures.

Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration. To learn more about the premigration validation, refer to this [documentation](concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to the Source** button.

### Connect to Source

The **Connect to Source** tab prompts you to provide details related to the Source selected in the **Setup Tab**, which is the Source of the databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-connect-source.png" alt-text="Screenshot of Screenshot of Connectsourcemigration." lightbox="media/tutorial-migration-service-aws-online/aws-connect-source.png":::

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance
- **Port** - Port number of the Source server
- **Server admin login name** - Username of the source PostgreSQL server
- **Password** - Password of the Source PostgreSQL server
- **SSL Mode**—The supported values are prefer and require. When the SSL at the Source PostgreSQL server is OFF, use SSLMODE=prefer. If the SSL at the source server is ON, use SSLMODE=require. SSL values can be determined in the Postgresql.conf file.
- **Test Connection** - Performs the connectivity test between target and Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and Source and verify the username/password for the Source. Test connection takes a few minutes to establish a connection between the target and Source

After the successful test connection, select the **Next: Select Migration target**

### Connect to Target

The **select migration target** tab displays metadata for the Flexible Server target, such as the subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-connect-target.png" alt-text="Screenshot of Screenshot of Connecttargetmigration.":::

- **Admin username** - Admin username of the target PostgreSQL server
- **Password** - Password of the target PostgreSQL server
- **Test Connection** - Performs the connectivity test between the target and Source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the Source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and the source.

After the successful test connection, select the **Next: Select Database(s) for Migration**

### Select databases for migration

Under this tab, a list of user databases is inside the source server selected in the setup tab. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-fetch-db.png" alt-text="Screenshot of Screenshot of FetchDBmigration.":::

After selecting the databases, select the **Next: Summary**

### Summary

The **Summary** tab summarizes all the Source and target details for creating the validation or migration. Review the details and select the start button.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-summary.png" alt-text="Screenshot of Screenshot of Summary migration.":::

### Monitor the migration

After you select the start button, a notification appears in a few seconds saying that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of Flexible Server, which has a new entry for the recently created validation or migration.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-monitor.png" alt-text="Screenshot of Screenshot of Monitor migration." lightbox="media/tutorial-migration-service-aws-online/aws-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration, and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry at the top. You can use the refresh button to refresh the status of the validation or migration.
Select the migration name in the grid to see the associated details.

As soon as the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substrate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

### Migration details

In the Setup tab, we have selected the migration option as **Migrate and Validate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.
- If validation completes without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the results of validation and migration at the instance and database level.

:::image type="content" source="media/tutorial-migration-service-aws-online/aws-details-migration.png" alt-text="Screenshot of Screenshot of Details migration." lightbox="media/tutorial-migration-service-aws-online/aws-details-migration.png":::

Possible migration states include:

- **In progress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Validation Failed** : The validation has failed.
- **Succeeded**: The migration has succeeded and is complete.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure setup is underway for data migration.
- **Validation in Progress**: Validation is in progress.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in final stages of completion.
- **Completed**: Migration has been completed.

### Cutover

If there are both **Migrate** and **Validate and Migrate**, completion of the Online migration requires another step—the user must take a Cutover action. After the copy/clone of the base data is complete, the migration moves to the `WaitingForUserAction` state and the `WaitingForCutoverTrigger' substate. In this state, the user can trigger the cutover from the portal by selecting the migration.

Before initiating cutover, it's important to ensure that:

- Writes to the Source are stopped - `Latency` value is 0 or close to 0 The `Latency` information can be obtained from the migration details screen as shown below:

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-cutover-migration.png" alt-text="Screenshot of Screenshot of Cutover migration." lightbox="media/tutorial-migration-service-aws-online/aws-cutover-migration.png":::

- `latency` value decreases to 0 or close to 0

- The `latency` value indicates when the target last synced with the Source. At this point, writing to the Source can be stopped, and cutover can be initiated. In case there's heavy traffic at the Source, it's recommended to stop writes first so that `Latency` can come close to 0, and then cutover is initiated.
The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency,` the replication stops until that point in time. All the data on the Source until the cutover point is then applied on the target. Say a latency was 15 minutes at the cutover point, so all the changed data in the last 15 minutes are applied on the target.
Time depends on the backlog of changes occurring in the last 15 minutes. Hence, it's recommended that the latency go to zero or near zero before triggering the cutover.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png" alt-text="Screenshot of Screenshot of Confirmcutovermigration." lightbox="media/tutorial-migration-service-aws-online/aws-confirm-cutover.png":::

- The migration moves to the `Succeeded` state when the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

    :::image type="content" source="media/tutorial-migration-service-aws-online/aws-success-migration.png" alt-text="Screenshot of Screenshot of Success migration." lightbox="media/tutorial-migration-service-aws-online/aws-success-migration.png":::

#### [CLI](#tab/cli)

You can also migrate using Azure CLI.

In this tutorial, we explore how to use the Azure CLI to migrate your PostgreSQL database from AWS RDS to Azure Database for PostgreSQL. The Azure CLI provides a powerful and flexible command-line interface that allows you to perform a wide range of tasks, including database migration. By following the steps outlined in this tutorial, you can seamlessly transfer your database to Azure and take advantage of its powerful features and scalability.

For more information about the Azure CLI, visit [Set up Azure CLI for migration service in Azure Database for PostgreSQL - Flexible Server](includes/prerequisites/prerequisites-setup-azure-cli-commands-postgresql.md).

Once the CLI is installed, open the command prompt and log into your Azure account using the below command.

```azurecli-interactive
`az login`
```

### Cutover the migration

After the base data migration is complete, the migration task moves to the `WaitingForCutoverTrigger` substate. In this state, users can trigger the cutover from the portal by selecting the migration name in the migration grid or through the CLI using the command below.

For example:

```azurecli-interactive
az postgres flexible-server migration update --subscription 11111111-1111-1111-1111-111111111111 --resource-group my-learning-rg --name myflexibleserver --migration-name CLIMigrationExample --cutover
```

Before initiating cutover, it's important to ensure that:

- Writes to the source are stopped
- `latency` value decreases to 0 or close to 0
- The `latency` value indicates when the target last synced with the source. At this point, writes to the source can be stopped and cutover initiated. In case there's heavy traffic at the source, it's recommended to stop writes first so that `Latency` can come close to 0, and then cutover is initiated.
- The Cutover operation applies all pending changes from the Source to the Target and completes the migration. If you trigger a "Cutover" even with nonzero `Latency`, the replication stops until that point in time. All the data on source until the cutover point is then applied on the target. Say a latency was 15 minutes at cutover point, so all the changed data in the last 15 minutes are applied on the target.
The time depends on the backlog of changes occurring in the last 15 minutes. Hence, it's recommended that the latency go to zero or near zero before triggering the cutover.

The `latency` information can be obtained using the migration show command.
Here's a snapshot of the migration before initiating the cutover:

:::image type="content" source="media/tutorial-migration-service-aws-online/show-migration-cli.png" alt-text="Screenshot of Screenshot of a sample Azure CLI output.":::

After the cutover is initiated, pending data captured during CDC is written to the target, and migration is now complete.

If the cutover is unsuccessful, the migration moves to `Failed` state.

For more information about this command, use the `help` parameter.

## End-to-end flow tutorial

In this tutorial, we'll migrate a PostgreSQL database residing in an Azure VM with public access to an Azure Database for PostgreSQL Flexible server using Azure CLI.

### Connect to the source (CLI)

- In this tutorial, source AWS RDS for the PostgreSQL version used is 14.8

- For this tutorial, we're going to migrate "db8_1","db8_2" and "postgres" into Azure Database for PostgreSQL – Flexible Server.

:::image type="content" source="media/tutorial-migration-service-aws-online/source-details.png" alt-text="Screenshot of output source details.":::

### Create target Azure Database for PostgreSQL

We used the [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server instance in the Azure portal](../../flexible-server/quickstart-create-server-portal.md) to create a corresponding PostgreSQL target flexible server. Below is the target server screenshot once created –

:::image type="content" source="media/tutorial-migration-service-aws-online/create-target.png" alt-text="Screenshot of creating the flexible server target.":::

### Setup the prerequisites

Ensure that all the prerequisites are completed before the start of migration.

- Networking establishment between source and target.
- Azure CLI environment and all the appropriate defaults are set up.
- Extensions are allowed, listed, and included in shared-load libraries.
- Users or Roles are migrated.
- Server Parameters are configured appropriately.

### Perform migration using CLI

- Open the command prompt and login into the Azure using `az login` command

:::image type="content" source="media/tutorial-migration-service-aws-online/az-login-tutorial-cli.png" alt-text="Screenshot of the Azure CLI login prompt.":::

:::image type="content" source="media/tutorial-migration-service-aws-online/success-az-login-cli.png" alt-text="Screenshot of a success Azure CLI login.":::

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

:::image type="content" source="media/tutorial-migration-service-aws-online/create-migration-cli.png" alt-text="Screenshot of the page that shows the create Azure CLI migration.":::

Run the following command to get the migration status initiated in the previous step. You can check the status of the migration by providing the migration name

```bash
az postgres flexible-server migration show --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Migration ID>>
```

:::image type="content" source="media/tutorial-migration-service-aws-online/show-migration-cli.png" alt-text="Screenshot of the page that shows the Azure CLI migration .":::

In Online migrations, after the base data migration is complete, the migration task moves to the `WaitingForCutoverTrigger` substate. In this state, the user can trigger the cutover through the CLI using the command below. The cutover can also be triggered from the portal by selecting the migration name in the migration grid.

```bash
az postgres flexible-server migration update --subscription <<subscription ID>> --resource-group <<resource group name>> --name <<Name of the Flexible Server>> --migration-name <<Unique Migration Name>> --cutover
```

:::image type="content" source="media/tutorial-migration-service-aws-online/wait-cutover.png" alt-text="Screenshot of Waiting for cutover.":::

:::image type="content" source="media/tutorial-migration-service-aws-online/initiate-cutover.png" alt-text="Screenshot of Intiating cutover.":::

-  You can also see the status in the Azure Database for PostgreSQL – Flexible server portal

---

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Can be celled** state.
Canceling a migration stops further migration activity on your target server and moves to a **Can be celled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server that is involved in a canceled migration.

## Post Migration

After completing the migration successfully, you need to manually validate the data between source and target and verify that all the objects in the target database are successfully created.

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.
- Post verification, enable the high availability option on your flexible server as needed.
- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.
- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.
- Copy other server settings like tags, alerts, and firewall rules (if applicable) from the source instance to the flexible server.
- Make changes to your application to point the connection strings to a flexible server.
- Monitor the database performance closely to see if it requires performance tuning.

## Migration best practices

For a successful end-to-end migration, follow the post-migration steps in [Best practices for seamless migration into Azure Database for PostgreSQL](best-practices-migration-service-postgresql.md). After you complete the preceding steps, you can change your application code to point database connection strings to Flexible Server. You can then start using the target as the primary database server.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from on-premises and Azure VMs](tutorial-migration-service-iaas.md)
- [Best practices](best-practices-migration-service-postgresql.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [premigration validations](concepts-premigration-migration-service.md)
