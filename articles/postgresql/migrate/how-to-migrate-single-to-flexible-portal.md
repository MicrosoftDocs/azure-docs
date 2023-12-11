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

2. Allowlist extensions whose libraries need to be loaded at server start, by following the steps mentioned in this [doc](./concepts-single-to-flexible.md#allow-list-required-extensions). It is important to allowlist these extensions before you initiate a migration using this tool.

3. Check if the data distribution among all the tables of a database is skewed with most of the data present in a single (or few) tables. If it is skewed, the migration speed could be slower than expected. In this case, the migration speed can be increased by [migrating the large table(s) in parallel](./concepts-single-to-flexible.md#improve-migration-speed---parallel-migration-of-tables).

## Configure the migration task

The migration tool comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Go to your Azure Database for PostgreSQL Flexible Server target.

3. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="./media/concepts-single-to-flexible/flexible-overview.png" alt-text="Screenshot of the flexible Overview page." lightbox="./media/concepts-single-to-flexible/flexible-overview.png":::

4. Select the **Migrate from Single Server** button to start a migration from Single Server to Flexible Server. If this is the first time you're using the migration tool, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-grid.png" alt-text="Screenshot of the Migration tab in flexible." lightbox="./media/concepts-single-to-flexible/flexible-migration-grid.png":::

    If you've already created migrations to your Flexible Server target, the grid contains information about migrations that were attempted to this target from the Single Server(s).

5. Select the **Migrate from Single Server** button. You go through a wizard-based series of tabs to create a migration into this Flexible Server target from any source Single Server.

Alternatively, you can initiate the migration process from the Azure Database for PostgreSQL Single Server.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

2. Upon selecting the Single Server, you can observe a migration-related banner in the Overview tab. Select **Migrate now** to get started.

    :::image type="content" source="./media/concepts-single-to-flexible/single-banner.png" alt-text="Screenshot to initiate migration from Single Server tab." lightbox="./media/concepts-single-to-flexible/single-banner.png":::

3. You're taken to a page with two options. If you've already created a Flexible Server and want to use that as the target, choose **Select existing**, and select the corresponding Subscription, Resource group and Server name details. Once the selections are made, select **Go to Migration wizard** and skip to the instructions under the **Setup tab** section in this page.

    :::image type="content" source="./media/concepts-single-to-flexible/single-click-banner.png" alt-text="Screenshot to choose existing flexible server option." lightbox="./media/concepts-single-to-flexible/single-click-banner.png":::

4. Should you choose to Create a new Flexible Server, select **Create new** and select **Go to Create Wizard**. This action takes you through the Flexible Server creation process and deploys the Flexible Server.

    :::image type="content" source="./media/concepts-single-to-flexible/single-banner-create-new.png" alt-text="Screenshot to choose new flexible server option." lightbox="./media/concepts-single-to-flexible/single-banner-create-new.png":::

After deploying the Flexible Server, follow the steps 3 to 5 under [Configure the migration task](#configure-the-migration-task)

### Setup tab

The first tab is **Setup**. Just in case you missed it, allowlist necessary extensions as shown in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#allow-list-required-extensions). It is important to allowlist these extensions before you initiate a migration using this tool.

>[!NOTE]
> If TIMESCALEDB, POSTGIS_TOPOLOGY, POSTGIS_TIGER_GEOCODER, POSTGRES_FDW or PG_PARTMAN extensions are used in your single server database, please raise a support request since the Single to Flex migration tool will not handle these extensions.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-setup.png" alt-text="Screenshot of the details belonging to Set up tab." lightbox="./media/concepts-single-to-flexible/flexible-migration-setup.png":::

**Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

**Migration Option** gives you the option to perform validations before triggering a migration. You can pick any of the following options
 - **Validate** - Checks your server and database readiness for migration to the target.
 - **Migrate** - Skips validations and starts migrations.
 - **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered only if there are no validation failures.

It is always a good practice to choose **Validate** or **Validate and Migrate** option to perform pre-migration validations before running the migration. To learn more about the pre-migration validation refer to this [documentation](./concepts-single-to-flexible.md#pre-migration-validations).

**Migration mode** gives you the option to pick the mode for the migration. **Offline** is the default option. Support for online migrations will be introduced later in the tool.

Select the **Next** button.

### Source tab

The **Source** tab prompts you to give details related to the Single Server that is the source of the databases.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-source.png" alt-text="Screenshot of source database server details." lightbox="./media/concepts-single-to-flexible/flexible-migration-source.png":::

After you make the **Subscription** and  **Resource Group** selections, the dropdown list for server names shows Single Servers under that resource group across regions. Select the source that you want to migrate databases from. Note that you can migrate databases from a Single Server to a target Flexible Server in the same region. Cross region migrations are supported only in China regions.

After you choose the Single Server source, the **Location**, **PostgreSQL version**, and **Server admin login name** boxes are populated automatically. The server admin login name is the admin username used to create the Single Server. In the **Password** box, enter the password for that admin user. The migration tool performs the migration of single server databases as the admin user.

After filling out all the fields, select the **Next** button.

### Target tab

The **Target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version. 

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-target.png" alt-text="Screenshot of target database server details." lightbox="./media/concepts-single-to-flexible/flexible-migration-target.png":::

For **Server admin login name**, the tab displays the admin username used during the creation of the Flexible Server target. Enter the corresponding password for the admin user.

Select the **Next** button.

### Select Database(s) for Migration tab

Under this tab, there is a list of user databases inside the Single Server. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-database.png" alt-text="Screenshot of Databases to migrate." lightbox="./media/concepts-single-to-flexible/flexible-migration-database.png":::

### Review

>[!NOTE]
> Gentle reminder to allowlist necessary [extensions](./concepts-single-to-flexible.md#allow-list-required-extensions) before you select **Create** in case it is not yet complete.

The **Review** tab summarizes all the details for creating the validation or migration. Review the details and click on the start button.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-review.png" alt-text="Screenshot of details to review for the migration." lightbox="./media/concepts-single-to-flexible/flexible-migration-review.png":::

## Monitor the migration

After you click the start button, a notification appears in a few seconds to say that the validation or migration creation is successful. You are redirected automatically to the **Migration** blade of Flexible Server. This has a new entry for the recently created validation or migration.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-monitor.png" alt-text="Screenshot of recently created migration details." lightbox="./media/concepts-single-to-flexible/flexible-migration-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**,  **Source DB server**, **Resource group**, **Region**, **Databases**, and **Start time**. The entries are displayed in the descending order of the start time with the most recent entry on the top.

You can use the refresh button to refresh the status of the validation or migration.
You can also select the migration name in the grid to see the associated details.

As soon as the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. It takes 2-3 minutes for the workflow to set up the migration infrastructure and network connections.

Let us look at how to monitor migrations for each of the **Migration Option**.

### Validate 

After the **PerformingPreRequisiteSteps** substate is completed, the validation moves to the substate of **Validation in Progress** where checks are done on the source and target server to assess the readiness for migration. 

The validation moves to the **Succeeded** state if all validations are either in **Succeeded** or **Warning** state. 

:::image type="content" source="./media/concepts-single-to-flexible/validation-successful.png" alt-text="Screenshot of the validation grid." lightbox="./media/concepts-single-to-flexible/validation-successful.png":::

The validation grid has the following columns
- **Finding** - Represents the validation rules that are used to check readiness for migration.
- **Finding Status** - Represents the result for each rule and can have any of the three values
    - **Succeeded** - If no errors were found.  
    - **Failed** - If there are validation errors.
    - **Warning** - If there are validation warnings.
- **Impacted Object** - Represents the object name for which the errors or warnings are raised. 
- **Object Type** - This can have the value **Database** for database level validations and **Instance** for server level validations.

The validation moves to **Validation Failed** state if there are any errors in the validation. Click on the **Finding** in the grid whose status is **Failed** and a fan-out pane appears giving the details and the corrective action you should take to avoid this error.

:::image type="content" source="./media/concepts-single-to-flexible/validation-failed.png" alt-text="Screenshot of the validation grid with failed status." lightbox="./media/concepts-single-to-flexible/validation-failed.png":::

### Migrate 

After the **PerformingPreRequisiteSteps** substate is completed, the migration moves to the substate of **Migrating Data** when the Cloning/Copying of the databases takes place.  The time for migration to complete depends on the size and shape of databases that you are migrating. If the data is mostly evenly distributed across all the tables, the migration is quick. Skewed table sizes take a relatively longer time.

When you select any of the databases in migration, a fan-out pane appears. It has all the table count - copied, queued, copying and errors apart from the database migration status.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-progress-dbclick.png" alt-text="Screenshot of the migration grid containing all DB details." lightbox="./media/concepts-single-to-flexible/flexible-migration-progress-dbclick.png":::

The migration moves to the **Succeeded** state as soon as the **Migrating Data** state finishes successfully. If there's an issue at the **Migrating Data** state, the migration moves into a **Failed** state.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-progress-dbsuccess.png" alt-text="Screenshot of the migration result." lightbox="./media/concepts-single-to-flexible/flexible-migration-progress-dbsuccess.png":::

Once the migration moves to the **Succeeded** state, migration of schema and data from your Single Server to your Flexible Server target is complete. You can use the refresh button on the page to confirm the same.

:::image type="content" source="./media/concepts-single-to-flexible/flexible-migration-progress-complete.png" alt-text="Screenshot of the completed migrations." lightbox="./media/concepts-single-to-flexible/flexible-migration-progress-complete.png":::

### Validate and Migrate

In this option, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** sub state is completed, the workflow moves into the sub state of **Validation in Progress**. 
- If validation has errors, the migration will move into a **Failed** state.
- If validation completes without any error, the migration will start and the workflow will move into the sub state of **Migrating Data**. 

You can see the results of validation under the **Validation** tab and monitor the migration under the **Migration** tab.

:::image type="content" source="./media/concepts-single-to-flexible/validate-and-migrate-1.png" alt-text="Screenshot showing validations tab in details page." lightbox="./media/concepts-single-to-flexible/validate-and-migrate-1.png":::

:::image type="content" source="./media/concepts-single-to-flexible/validate-and-migrate-2.png" alt-text="Screenshot showing migrations tab in details page." lightbox="./media/concepts-single-to-flexible/validate-and-migrate-2.png":::

After the migration has moved to the **Succeeded** state, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#post-migration).

Possible migration states include:

- **InProgress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Validation Failed** : The validation has failed.
- **Succeeded**: The migration has succeeded and is complete.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure set up is underway for data migration.
- **Validation in Progress**: Validation is in progress.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in final stages of completion.
- **Completed**: Migration has successfully completed.

## Cancel the migration

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Cancelled** state.
Canceling a migration stops further migration activity on your target server and moves to a **Cancelled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.

## Migration best practices

For a successful end-to-end migration, follow the post-migration steps in [Migrate from Azure Database for PostgreSQL Single Server to Flexible Server](./concepts-single-to-flexible.md#post-migration). After you complete the preceding steps, you can change your application code to point database connection strings to Flexible Server. You can then start using the target as the primary database server.