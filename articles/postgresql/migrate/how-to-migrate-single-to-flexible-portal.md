---
title: "Migrate from Single Server to Flexible Server by using the Azure portal"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: Learn about migrating your Single Server databases to Azure database for PostgreSQL Flexible Server by using the Azure portal.
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: conceptual
ms.date: 05/09/2022
---

# Migrate from Single Server to Flexible Server by using the Azure portal

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

This article shows you how to use the migration tool in the Azure portal to migrate databases from Azure Database for PostgreSQL Single Server to Flexible Server.

>[!NOTE]
> The migration tool is in public preview.

## Getting started

1. If you're new to Microsoft Azure, [create an account](https://azure.microsoft.com/free/) to evaluate the offerings.

2. Complete the prerequisites listed in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#migration-prerequisites). It is very important to complete the prerequisite steps before you initiate a migration using this tool.

## Configure the migration task

The migration tool comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Go to your Azure Database for PostgreSQL Flexible Server target. If you haven't created a Flexible Server target, [create one now](../flexible-server/quickstart-create-server-portal.md).

3. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration (preview)** and select it.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png" alt-text="Screenshot of the details belonging to Migration tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png":::

4. Select the **Migrate from Single Server** button to start a migration from Single Server to Flexible Server. If this is the first time you're using the migration tool, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png" alt-text="Screenshot of the Migrate from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png":::

    If you've already created migrations to your Flexible Server target, the grid is populated with information about migrations that were attempted to this target from the Single Server(s).

5. Select the **Migrate from Single Server** button. You'll go through a wizard-based series of tabs to create a migration to this Flexible Server target from any Single Server.

Alternatively, you can initiate the migration process from the Azure Database for PostgreSQL Single Server.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Upon selecting the Single Server, you can observe the **Migrate your PostgreSQL single server to a fully managed PostgreSQL flexible server. Flexible server provides more granular control, flexibility and better cost optimization. Migrate now.** banner in the Overview tab. Click on **Migrate now** to get started.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-initiate-migrate-from-single-server.png" alt-text="Screenshot to initiate migration from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-initiate-migrate-from-single-server.png":::

3. You will be taken to a page with two options. If you have already created a Flexible Server and want to use that as the target, choose **Select existing**, and select the corresponding Subscription, Resource group and Server name details. Once the selections have been made, click on **Go to Migration wizard** and skip to the instructions under the **Setup tab** section in this page.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-choose-between-flexible-server.png" alt-text="Screenshot to choose existing flexible server option." lightbox="./media/concepts-single-to-flexible/single-to-flex-choose-between-flexible-server.png":::

4. Should you choose to Create a new Flexible Server, select **Create new** and click on **Go to Create Wizard**. This action will take you through the Flexible Server creation process and deploy the Flexible Server.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-create-new.png" alt-text="Screenshot to choose new flexible server option." lightbox="./media/concepts-single-to-flexible/single-to-flex-create-new.png":::

5. Once the Flexible Server is deployed, select to open the Flexible Server menu. On the left panel, scroll down to **Migration (preview)** and select it.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png" alt-text="Screenshot of the details related to Migration tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-preview.png":::

6. Select the **Migrate from Single Server** button to start a migration from Single Server to Flexible Server. If this is the first time you're using the migration tool, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png" alt-text="Screenshot of the Migrate from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png":::

    If you've already created migrations to your Flexible Server target, the grid is populated with information about migrations that were attempted to this target from Single Server sources.

7. Select the **Migrate from Single Server** button. You'll go through a wizard-based series of tabs to create a migration to this Flexible Server from any Single Server.

### Setup tab

The first tab is **Setup**. It has basic information about the migration and the list of prerequisites for getting started with migrations. These prerequisites are the same as the ones listed in the [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#migration-prerequisites) article.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-setup.png" alt-text="Screenshot of the details belonging to Setup tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-setup.png":::

**Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and does not accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

**Migration resource group** is where the migration tool will create all the migration-related components. By default, the resource group of the Flexible Server target and all the components will be cleaned up automatically after the migration finishes. If you want to create a temporary resource group for the migration, create it and then select it from the dropdown list.

For **Azure Active Directory App**, click the **select** option and choose the Azure Active Directory app that you created for the prerequisite step. Then, in the **Azure Active Directory Client Secret** box, paste the client secret that was generated for that app.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-client-secret.png" alt-text="Screenshot of the box to enter a client secret." lightbox="./media/concepts-single-to-flexible/single-to-flex-client-secret.png":::

Select the **Next** button.

### Source tab

The **Source** tab prompts you to give details related to the Single Server that databases need to be migrated from.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-source.png" alt-text="Screenshot of source database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-source.png":::

After you make the **Subscription** and  **Resource Group** selections, the dropdown list for server names shows Single Servers under that resource group across regions. Select the source that you want to migrate databases from. We recommend that you migrate databases from a Single Server to a target Flexible Server in the same region.

After you choose the Single Server source, the **Location**, **PostgreSQL version**, and **Server admin login name** boxes are automatically populated. The server admin login name is the admin username that was used to create the Single Server. In the **Password** box, enter the password for that admin login name. It will enable the migration tool to log in to the Single Server to initiate the dump and migration.

Under **Choose databases to migrate**, there's a list of user databases inside the Single Server. You can select up to eight databases that can be migrated in a single migration attempt. If there are more than eight user databases, create multiple migrations by using the same experience between the source and target servers.

The final property on the **Source** tab is **Migration mode**. The migration tool offers online and offline modes of migration. The [concepts article](./concepts-single-to-flexible.md) talks more about the migration modes and their differences. After you choose the migration mode, the restrictions that are associated with that mode appear.

When you're finished filling out all the fields, select the **Next** button.

### Target tab

The **Target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version. 

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-target.png" alt-text="Screenshot of target database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-target.png":::

For **Server admin login name**, the tab displays the admin username that was used during the creation of the Flexible Server target. Enter the corresponding password for the admin user. This password is required for the migration tool to log in to the Flexible Server target and perform restore operations.

For **Authorize DB overwrite**:

- If you select **Yes**, you give this migration service permission to overwrite existing data if a database that's being migrated to Flexible Server is already present.
- If you select **No**, the migration service goes into a waiting state and asks you for permission to either overwrite the data or cancel the migration.

Select the **Next** button.

### Networking tab

The content on the **Networking** tab depends on the networking topology of your source and target servers. If both source and target servers are in public access, the following message appears.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-networking.png" alt-text="Screenshot of a message that says you're all set to create a migration because source and target servers are in public access." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-networking.png":::

In this case, you don't need to do anything and can select the **Next**  button.

If either the source and/or target server is configured in private access, the content of the **Networking** tab is different.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-private.png" alt-text="Screenshot of the Networking tab for private access configuration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-private.png":::

Let's try to understand what private access means for Single Server and Flexible Server:

- **Single Server Private Access**: **Deny public network access** is set to **Yes**, and a private endpoint is configured.
- **Flexible Server Private Access**: A Flexible Server target is deployed inside a virtual network.

For private access, all the fields are automatically populated with subnet details. This is the subnet in which the migration tool will deploy Azure Database Migration Service to move data between the source and the target.

You can use the suggested subnet or choose a different one. But make sure that the selected subnet can connect to both the source and target servers.

After you choose a subnet, select the **Next** button.

### Review + create tab

>[!NOTE]
> Gentle reminder to complete the [prerequisites](./concepts-single-to-flexible.md#migration-prerequisites) before you click **Create** in case it is not yet complete.

The **Review + create** tab summarizes all the details for creating the migration. Review the details and select the **Create** button to start the migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-review.png" alt-text="Screenshot of details to review for the migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-review.png":::

## Monitor migrations

After you select the **Create** button, a notification appears in a few seconds to say that the migration was successfully created.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-monitoring.png" alt-text="Screenshot of the message that you successfully created a migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-monitoring.png":::

You should automatically be redirected to the **Migration (Preview)** page of Flexible Server. That page has a new entry for the recently created migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-review-tab.png" alt-text="Screenshot of recently created migration details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-review-tab.png":::

The grid that displays the migrations has these columns: **Name**, **Status**,  **Source DB server**, **Resource group**, **Region**, **Version**, **Databases**, and **Start time**. By default, the grid shows the list of migrations in descending order of migration start times. In other words, recent migrations appear on top of the grid.

You can use the refresh button to refresh the status of the migrations.

You can also select the migration name in the grid to see the details of that migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-grid.png" alt-text="Screenshot of the migration grid containing all migrations." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-grid.png":::

As soon as the migration is created, the migration moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes up to 10 minutes for the migration workflow to move out of this substate. The reason is that it takes time to create and deploy Database Migration Service, add the IP address on the firewall list of source and target servers, and perform maintenance tasks.

After the **PerformingPreRequisiteSteps** substate is completed, the migration moves to the substate of **Migrating Data** where the dump and restore of the databases take place. The time that the **Migrating Data** substate takes to finish depends on the size of databases that you're migrating.

When you select each of the databases that are being migrated, a fan-out pane appears. It has all the migration details, such as table count, incremental inserts, deletes, and pending bytes.

For offline mode, the migration moves to the **Succeeded** state as soon as the **Migrating Data** state finishes successfully. If there's an issue at the **Migrating Data** state, the migration moves into a **Failed** state.

For online mode, the migration moves to the **WaitingForUserAction** state and the **WaitingForCutOver** substate after the **Migrating Data** substate finishes successfully.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-status-wait.png" alt-text="Screenshot of migration status after clicking on the migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-status-wait.png":::

Select the migration name to open the migration details page. There, you should see the substate of **WaitingForCutover**.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-cutover.png" alt-text="Screenshot of the migration status at waiting for cutover." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-cutover.png":::

At this stage, the ongoing writes at your Single Server are replicated to the Flexible Server via the logical decoding feature of PostgreSQL. You should wait until the replication reaches a state where the target is almost in sync with the source.

You can monitor the replication lag by selecting each database that's being migrated. That opens a fan-out pane with metrics. The value of the **Pending Bytes** metric should be nearing zero over time. After it reaches a few megabytes for all the databases, stop any further writes to your Single Server and wait until the metric reaches 0. Then, validate the data and schemas on your Flexible Server target to make sure that they match exactly with the source server.

After you complete the preceding steps, select the **Cutover** button. The following message appears.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-click-cutover.png" alt-text="Screenshot of the cutover button before migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-click-cutover.png":::

Select the **Yes** button to start cutover.

A few seconds after you start cutover, the following notification appears.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-successful-cutover.png" alt-text="Screenshot of successful cutover after migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-successful-cutover.png":::

When the cutover is complete, the migration moves to the **Succeeded** state. Migration of schema and data from your Single Server to your Flexible Server target is now complete. You can use the refresh button on the page to check if the cutover was successful.

After you complete the preceding steps, you can change your application code to point database connection strings to Flexible Server. You can then start using the target as the primary database server.

Possible migration states include:

- **InProgress**: The migration infrastructure is being set up, or the actual data migration is in progress.
- **Canceled**: The migration has been canceled or deleted.
- **Failed**: The migration has failed.
- **Succeeded**: The migration has succeeded and is complete.
- **WaitingForUserAction**: The migration is waiting for a user action.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure is being set up and is being prepped for data migration.
- **MigratingData**: Data is being migrated.
- **CompletingMigration**: Migration cutover is in progress.
- **WaitingForLogicalReplicationSetupRequestOnSourceDB**: Waiting for logical replication enablement.
- **WaitingForCutoverTrigger**: Migration is ready for cutover.
- **WaitingForTargetDBOverwriteConfirmation**: Waiting for confirmation on target overwrite. Data is present in the target server that you're migrating into.
- **Completed**: Cutover was successful, and migration is complete.

## Cancel migrations

You have the option to cancel any ongoing migrations. For a migration to be canceled, it must be in the **InProgress** or  **WaitingForUserAction** state. You can't cancel a migration that's in the **Succeeded** or **Failed** state.

You can choose multiple ongoing migrations at once and cancel them.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-multiple.png" alt-text="Screenshot of canceling multiple migrations in process." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-multiple.png":::

Canceling a migration stops further migration activity on your target server. It doesn't drop or roll back any changes on your target server from the migration attempts. Be sure to drop the databases involved in a canceled migration on your target server.

## Next steps

Follow the [post-migration steps](./concepts-single-to-flexible.md) for a successful end-to-end migration.