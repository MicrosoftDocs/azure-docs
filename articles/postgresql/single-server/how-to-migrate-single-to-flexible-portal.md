---
title: "Migrate PostgreSQL Single Server to Flexible Server using the Azure portal"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about migrating your Single server databases to Azure database for PostgreSQL Flexible server using Portal.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Migrate Single Server to Flexible Server PostgreSQL using the Azure portal

This guide shows you how to use Single to Flexible server migration feature to migrate databases from Azure database for PostgreSQL Single server to Flexible server.

## Before you begin

1. If you are new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate our offerings. 
2. Register your subscription for the Azure Database Migration Service

Go to Azure portal homepage and navigate to your subscription as shown below.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-azure-portal.png" alt-text="Screenshot of Azure Portal Subscription details." lightbox="./media/concepts-single-to-flexible/single-to-flex-azure-portal.png":::

In your subscription, navigate to **Resource Providers** from the left navigation menu. Search for **Microsoft.DataMigration**; as shown below and click on **Register**.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-register-data-migration.png" alt-text="Screenshot of Register button for Data Migration Service." lightbox="./media/concepts-single-to-flexible/single-to-flex-register-data-migration.png":::

## Pre-requisites

Take care of the pre-requisites listed [here](./concepts-single-to-flexible.md#pre-requisites) to get started with the migration feature.

## Configure migration task

Single to Flexible server migration feature comes with a simple, wizard-based portal experience. Let us get started to know the steps needed to consume the tool from portal.

1. **Sign into the Azure portal -** Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Navigate to your Azure database for PostgreSQL flexible server.If you have not created an Azure database for PostgreSQL flexible server, create one using this [link](../flexible-server/quickstart-create-server-portal.md).

3. In the **Overview** tab of your flexible server, use the left navigation menu and scroll down to the option of **Migration (preview)** and click on it.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png" alt-text="Screenshot of Migration Preview Tab details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png":::

4. Click the **Migrate from Single Server** button to start a migration from Single Server to Flexible Server. If this is the first time you are using the migration feature, you will see an empty grid with a prompt to begin your first migration.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png" alt-text="Screenshot of Migrate from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png":::

    If you have already created migrations to your flexible server, you should see the grid populated with information of the list of migrations that were attempted to this flexible server from single servers.

5. Click on the **Migrate from Single Server** button. You will be taken through a wizard-based user interface to create a migration to this flexible server from any single server.

### Setup tab

The first is the setup tab which has basic information about the migration and the list of pre-requisites that need to be taken care of to get started with migrations. The list of pre-requisites is the same as the ones listed in the pre-requisites section [here](./concepts-single-to-flexible.md). Click on the provided link to know more about the same.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-setup.png" alt-text="Screenshot of Setup Tab details." lightbox="./media/concepts-single-to-flexible/single-to-flex-setup.png":::

- The **Migration name** is the unique identifier for each migration to this flexible server. This field accepts only alphanumeric characters and does not accept any special characters except **&#39;-&#39;**. The name cannot start with a **&#39;-&#39;** and should be unique for a target server. No two migrations to the same flexible server can have the same name.
- The **Migration resource group** is where all the migration-related components will be created by this migration feature.

By default, it is resource group of the target flexible server and all the components will be cleaned up automatically once the migration completes. If you want to create a temporary resource group for migration-related purposes, create a resource group and select the same from the dropdown.

- For the **Azure Active Directory App**, click the **select** option and pick the app that was created as a part of the pre-requisite step. Once the Azure AD App is chosen, paste the client secret that was generated for the Azure AD app to the **Azure Active Directory Client Secret** field.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-client-secret.png" alt-text="Screenshot of field to enter Client Secret." lightbox="./media/concepts-single-to-flexible/single-to-flex-client-secret.png":::

Click on the **Next** button.

### Source tab

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-source.png" alt-text="Screenshot of source database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-source.png":::

The source tab prompts you to give details related to the source single server from which databases needs to be migrated. As soon as you pick the **Subscription** and  **Resource Group**, the dropdown for server names will have the list of single servers under that resource group across regions. It is recommended to migrate databases from a single server to flexible server in the same region.

Choose the single server from which you want to migrate databases from, in the drop down.

Once the single server is chosen, the fields such as  **Location, PostgreSQL version, Server admin login name**  are automatically pre-populated. The server admin login name is the admin username that was used to create the single server. Enter the password for the **server admin login name**. This is required for the migration feature to login into the single server to initiate the dump and migration.

You should also see the list of user databases inside the single server that you can pick for migration. You can select up to eight databases that can be migrated in a single migration attempt. If there are more than eight user databases, create multiple migrations using the same experience between the source and target servers.

The final property in the source tab is migration mode. The migration feature offers online and offline mode of migration. To know more about the migration modes and their differences, please visit this [link](./concepts-single-to-flexible.md).

Once you pick the migration mode, the restrictions associated with the mode are displayed.

After filling out all the fields, please click the **Next** button.

### Target tab

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-target.png" alt-text="Screenshot of target database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-target.png":::

This tab displays metadata of the flexible server like the **Subscription**, **Resource Group**, **Server name**, **Location**, and **PostgreSQL version**. It displays  **server admin login name**  which is the admin username that was used during the creation of the flexible server.Enter the corresponding password for the admin user. This is required for the migration feature to login into the flexible server to perform restore operations.

Choose an option **yes/no** for **Authorize DB overwrite**.

- If you set the option to **Yes**, you give this migration service permission to overwrite existing data in case when a database that is being migrated to flexible server is already present.
- If set to **No**, it goes into a waiting state and asks you for permission either to overwrite the data or to cancel the migration.

Click on the **Next** button

### Networking tab

The content on the Networking tab depends on the networking topology of your source and target servers.

- If both source and target servers are in public access, then you are going to see the message below.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-networking.png" alt-text="Screenshot of Migration Networking configuration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-networking.png":::

In this case, you need not do anything and can just click on the **Next**  button.

- If either the source or target server is configured in private access, then the content of the networking tab is going to be different. Let us try to understand what does private access mean for single server and flexible server:

- **Single Server Private Access**  –  **Deny public network access** set to **Yes**  and a private end point configured
- **Flexible Server Private Access**  – When flexible server is deployed inside a Vnet.

If either source or target is configured in private access, then the networking tab looks like the following

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-private.png" alt-text="Screenshot of Networking Private Access configuration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-private.png":::

All the fields will be automatically populated with subnet details. This is the subnet in which the migration feature will deploy Azure DMS to move data between the source and target.

You can go ahead with the suggested subnet or choose a different subnet. But make sure that the selected subnet can connect to both the source and target servers.

After picking a subnet, click on **Next** button

### Review + create tab

This tab gives a summary of all the details for creating the migration. Review the details and click on the **Create** button to start the migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-review.png" alt-text="Screenshot of Migration review." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-review.png":::

## Monitoring migrations

After clicking on the **Create** button, you should see a notification in a few seconds saying the migration was successfully created.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-monitoring.png" alt-text="Screenshot of Migration monitoring." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-monitoring.png":::

You should automatically be redirected to **Migrations (Preview)** page of flexible server that will have a new entry of the recently created migration

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-review-tab.png" alt-text="Screenshot of Migration review tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-review-tab.png":::

The grid displaying the migrations has various columns including  **Name**, **Status**,  **Source server name**, **Region**, **Version**, **Database names**, and the  **Migration start time**. By default, the grid shows the list of migrations in the decreasing order of migration start time. In other words, recent migrations appear on top of the grid.

You can use the refresh button to refresh the status of the migrations.

You can click on the migration name in the grid to see the details of that migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-grid.png" alt-text="Screenshot of Migration grid." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-grid.png":::

- As soon as the migration is created, the migration moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes up to 10 minutes for the migration workflow to move out of this substate since it takes time to create and deploy DMS, add its IP on firewall list of source and target servers and to perform a few maintenance tasks.
- After the **PerformingPreRequisiteSteps** substate is completed, the migration moves to the substate of **Migrating Data** where the dump and restore of the databases take place.
- The time taken for **Migrating Data** substate to complete is dependent on the size of databases that are being migrated.
- You can click on each of the DBs that are being migrated and a fan-out blade appears that has all migration details such as table count, incremental inserts, deletes, pending bytes, etc.
- For **Offline** mode, the migration moves to **Succeeded** state as soon as the **Migrating Data** state completes successfully. If there is an issue at the **Migrating Data** state, the migration moves into a **Failed** state.
- For **Online** mode, the migration moves to the state of **WaitingForUserAction** and **WaitingForCutOver** substate after the **Migrating Data** substate completes successfully.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-status-wait.png" alt-text="Screenshot of Migration status." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-status-wait.png":::

You can click on the migration name to go into the migration details page and should see the substate of **WaitingForCutover**.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-cutover.png" alt-text="Screenshot of Migration ready for cutover." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-cutover.png":::

At this stage, the ongoing writes at your source single server will be replicated to the target flexible server using the logical decoding feature of PostgreSQL. You should wait until the replication reaches a state where the target is almost in sync with the source. You can monitor the replication lag by clicking on each of the databases that are being migrated. It opens a fan-out blade with a bunch of metrics. Look for the value of **Pending Bytes** metric and it should be nearing zero over time. Once it reaches to a few MB for all the databases, stop any further writes to your single server and wait until the metric reaches 0. This should be followed by the validation of data and schema on your flexible server to make sure it matches exactly with the source server.

After completing the above steps, click on the **Cutover** button. You should see the following message

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-click-cutover.png" alt-text="Screenshot of cutover button before migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-click-cutover.png":::

Click on the **Yes** button to start cutover.

In a few seconds after starting cutover, you should see the following notification

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-successful-cutover.png" alt-text="Screenshot of Successful cutover after migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-successful-cutover.png":::

Once the cutover is complete, the migration moves to **Succeeded** state and migration of schema data from your single server to flexible server is now complete. You can use the refresh button in the page to check if the cutover was successful.

After completing the above steps, you can make changes to your application code to point database connection strings to the flexible server and start using it as the primary database server.

Possible migration states include

- **InProgress**: The migration infrastructure is being setup, or the actual data migration is in progress.
- **Canceled**: The migration has been canceled or deleted.
- **Failed**: The migration has failed.
- **Succeeded**: The migration has succeeded and is complete.
- **WaitingForUserAction**: Migration is waiting on a user action..

Possible migration substates include

- **PerformingPreRequisiteSteps**: Infrastructure is being set up and is being prepped for data migration
- **MigratingData**: Data is being migrated
- **CompletingMigration**: Migration cutover in progress
- **WaitingForLogicalReplicationSetupRequestOnSourceDB**: Waiting for logical replication enablement.
- **WaitingForCutoverTrigger**: Migration is ready for cutover.
- **WaitingForTargetDBOverwriteConfirmation**: Waiting for confirmation on target overwrite as data is present in the target server being migrated into.
- **Completed**: Cutover was successful, and migration is complete.

## Cancel migrations

You also have the option to cancel any ongoing migrations. For a migration to be canceled, it must be in  **InProgress**  or  **WaitingForUserAction**  state. You cannot cancel a migration that has either already **Succeeded**  or  **Failed**.

You can choose multiple ongoing migrations at once and can cancel them.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-multiple.png" alt-text="Screenshot of multiple migrations in process." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-multiple.png":::

Note that **cancel migration** just stops any more further migration activity on your target server. It will not drop or roll back any changes on your target server that were done by the migration attempts. Make sure to drop the databases involved in a canceled migration on your target server.

## Post migration steps

Make sure the post migration steps listed [here](./concepts-single-to-flexible.md) are followed for a successful end to end migration.

## Next steps
- [Single Server to Flexible migration concepts](./concepts-single-to-flexible.md)