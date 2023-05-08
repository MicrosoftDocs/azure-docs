---
title: "Tutorial: Migrate Azure Database for PostgreSQL - Single Server to Flexible Server using the Azure portal"
titleSuffix: "Azure Database for PostgreSQL Flexible Server"
description: "Learn about migrating your Single Server databases to Azure Database for PostgreSQL Flexible Server by using the Azure portal."
author: hariramt
ms.author: hariramt
ms.service: postgresql
ms.topic: tutorial
ms.date: 02/02/2023
ms.custom: seo-lt-2023
---

# Tutorial: Migrate Azure Database for PostgreSQL - Single Server to Flexible Server by using the Azure portal

[!INCLUDE[applies-to-postgres-single-flexible-server](../includes/applies-to-postgresql-single-flexible-server.md)]

You can migrate an instance of Azure Database for PostgreSQL – Single Server to Azure Database for PostgreSQL – Flexible Server by using the Azure portal. In this tutorial, we perform migration of a sample database from an Azure Database for PostgreSQL single server to a PostgreSQL flexible server using the Azure portal.

In this tutorial, you learn to:

> [!div class="checklist"]
>
> * Configure your Azure Database for PostgreSQL Flexible Server
> * Configure the migration task
> * Monitor the migration
> * Cancel the migration
> * Migration best practices

## Configure your Azure Database for PostgreSQL Flexible Server

> [!IMPORTANT]
> To provide the best migration experience, performing migration using a burstable SKU of Flexible server is not supported. Please use a general purpose or a memory optimized SKU (4 VCore or higher) as your Target Flexible server to perform the migration. Once the migration is complete, you can downscale to a burstable instance if necessary.

1. Create the target flexible server. For guided steps, refer to the quickstart [Create an Azure Database for PostgreSQL flexible server using the Portal](../flexible-server/quickstart-create-server-portal.md)

2. Allowlist all required extensions as shown in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#allow-list-required-extensions). It is important to allowlist the extensions before you initiate a migration using this tool.

## Configure the migration task

The migration tool comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Go to your Azure Database for PostgreSQL Flexible Server target.

3. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="./media/concepts-single-to-flexible/azure-portal-overview-page.png" alt-text="Screenshot of the Overview page." lightbox="./media/concepts-single-to-flexible/azure-portal-overview-page.png":::

4. Select the **Migrate from Single Server** button to start a migration from Single Server to Flexible Server. If this is the first time you're using the migration tool, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png" alt-text="Screenshot of the Migrate from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-migrate-single-server.png":::

    If you've already created migrations to your Flexible Server target, the grid contains information about migrations that were attempted to this target from the Single Server(s).

5. Select the **Migrate from Single Server** button. You go through a wizard-based series of tabs to create a migration into this Flexible Server target from any source Single Server.

Alternatively, you can initiate the migration process from the Azure Database for PostgreSQL Single Server.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Upon selecting the Single Server, you can observe a migration-related banner in the Overview tab. Select **Migrate now** to get started.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-initiate-migrate-from-single-server.png" alt-text="Screenshot to initiate migration from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-initiate-migrate-from-single-server.png":::

3. You're taken to a page with two options. If you've already created a Flexible Server and want to use that as the target, choose **Select existing**, and select the corresponding Subscription, Resource group and Server name details. Once the selections are made, select **Go to Migration wizard** and skip to the instructions under the **Setup tab** section in this page.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-choose-between-flexible-server.png" alt-text="Screenshot to choose existing flexible server option." lightbox="./media/concepts-single-to-flexible/single-to-flex-choose-between-flexible-server.png":::

4. Should you choose to Create a new Flexible Server, select **Create new** and select **Go to Create Wizard**. This action takes you through the Flexible Server creation process and deploys the Flexible Server.

    :::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-create-new.png" alt-text="Screenshot to choose new flexible server option." lightbox="./media/concepts-single-to-flexible/single-to-flex-create-new.png":::

After deploying the Flexible Server, follow the steps 3 to 5 under [Configure the migration task](#configure-the-migration-task)

### Setup tab

The first tab is **Setup**. Just in case you missed it, allowlist all required extensions as shown in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#allow-list-required-extensions). It is important to allowlist the extensions before you initiate a migration using this tool.

>[!NOTE]
> If TIMESCALEDB, PG_PARTMAN, POSTGRES_FDW or POSTGIS_TIGER_DECODER extensions are used in your single server database, please raise a support request since the Single to Flex migration tool will not handle these extensions.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-setup.png" alt-text="Screenshot of the details belonging to Set up tab." lightbox="./media/concepts-single-to-flexible/single-to-flex-setup.png":::

**Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

Select the **Next** button.

### Source tab

The **Source** tab prompts you to give details related to the Single Server that is the source of the databases.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-source.png" alt-text="Screenshot of source database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-source.png":::

After you make the **Subscription** and  **Resource Group** selections, the dropdown list for server names shows Single Servers under that resource group across regions. Select the source that you want to migrate databases from. Note that you can migrate databases from a Single Server to a target Flexible Server in the same region - cross region migrations aren't supported.

After you choose the Single Server source, the **Location**, **PostgreSQL version**, and **Server admin login name** boxes are populated automatically. The server admin login name is the admin username used to create the Single Server. In the **Password** box, enter the password for that admin user. The migration tool performs the migration of single server databases as the admin user.

Under **Choose databases to migrate**, there's a list of user databases inside the Single Server. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

The final property on the **Source** tab is **Migration mode**. The migration tool offers offline mode of migration as default.

After filling out all the fields, select the **Next** button.

### Target tab

The **Target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version. 

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-target.png" alt-text="Screenshot of target database server details." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-target.png":::

For **Server admin login name**, the tab displays the admin username used during the creation of the Flexible Server target. Enter the corresponding password for the admin user.

For **Authorize DB overwrite**:

- If you select **Yes**, you give this migration tool permission to overwrite existing data if the database is already present.
- If you select **No**, the migration tool does not overwrite the data for the database that is already present.

Select the **Next** button.

### Review + create tab

>[!NOTE]
> Gentle reminder to allowlist the [extensions](./concepts-single-to-flexible.md#allow-list-required-extensions) before you select **Create** in case it is not yet complete.

The **Review + create** tab summarizes all the details for creating the migration. Review the details and select the **Create** button to start the migration.

:::image type="content" source="./media/concepts-single-to-flexible/single-to-flex-migration-review.png" alt-text="Screenshot of details to review for the migration." lightbox="./media/concepts-single-to-flexible/single-to-flex-migration-review.png":::

## Monitor the migration

After you select the **Create** button, a notification appears in a few seconds to say that the migration creation is successful. You are redirected automatically to the **Migration** page of Flexible Server. That page has a new entry for the recently created migration.

:::image type="content" source="./media/concepts-single-to-flexible/azure-portal-migration-grid-monitor.png" alt-text="Screenshot of recently created migration details." lightbox="./media/concepts-single-to-flexible/azure-portal-migration-grid-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**,  **Source DB server**, **Resource group**, **Region**, **Databases**, and **Start time**. The migrations are in the descending order of migration start time with the most recent migration on top.

You can use the refresh button to refresh the status of the migrations.
You can also select the migration name in the grid to see the details of that migration.

:::image type="content" source="./media/concepts-single-to-flexible/azure-portal-migration-in-progress.png" alt-text="Screenshot of the migration in detail." lightbox="./media/concepts-single-to-flexible/azure-portal-migration-in-progress.png":::

As soon as the migration is created, the migration moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes 2-3 minutes for the migration workflow to set up the migration infrastructure and network connections.

After the **PerformingPreRequisiteSteps** substate is completed, the migration moves to the substate of **Migrating Data** when the Cloning/Copying of the databases takes place.  The time for migration to complete depends on the size and shape of databases that you are migrating. If the data is mostly evenly distributed across all the tables, the migration is quick. Skewed table sizes take a relatively longer time.

When you select each of the databases in migration, a fan-out pane appears. It has all the table count - copied, queued, copying and errors apart from the database migration status.

:::image type="content" source="./media/concepts-single-to-flexible/azure-portal-db-status-in-progress.png" alt-text="Screenshot of the migration grid containing all DB details." lightbox="./media/concepts-single-to-flexible/azure-portal-db-status-in-progress.png":::

The migration moves to the **Succeeded** state as soon as the **Migrating Data** state finishes successfully. If there's an issue at the **Migrating Data** state, the migration moves into a **Failed** state.

:::image type="content" source="./media/concepts-single-to-flexible/azure-portal-db-status-completed.png" alt-text="Screenshot of the migration result." lightbox="./media/concepts-single-to-flexible/azure-portal-db-status-completed.png":::

Once the migration moves to the **Succeeded** state, migration of schema and data from your Single Server to your Flexible Server target is complete. You can use the refresh button on the page to confirm the same.

:::image type="content" source="./media/concepts-single-to-flexible/azure-portal-migration-grid-completed.png" alt-text="Screenshot of the completed migrations." lightbox="./media/concepts-single-to-flexible/azure-portal-migration-grid-completed.png":::

After the migration has moved to the **Succeeded** state, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#post-migration).

Possible migration states include:

- **InProgress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Succeeded**: The migration has succeeded and is complete.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure set up is underway for data migration.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in final stages of completion.
- **Completed**: Migration has successfully completed.

## Cancel the migration

You can cancel any ongoing migrations. To cancel a migration, it must be in the **InProgress** state. You can't cancel a migration that's in the **Succeeded** or **Failed** state.

You can choose multiple ongoing migrations at once and cancel them.
Cancelling a migration stops further migration activity on your target server. It doesn't drop or roll back any changes on your target server from the migration attempts. Be sure to drop the databases on your target server involved in a canceled migration.

## Migration best practices

For a successful end-to-end migration, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#post-migration). After you complete the preceding steps, you can change your application code to point database connection strings to Flexible Server. You can then start using the target as the primary database server.