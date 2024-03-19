---
title: PostgreSQL - Single Server to Flexible Server portal migration
author: markingmyname
ms.author: maghan
ms.date: 03/15/2024
ms.service: postgresql
ms.topic: include
---

You can migrate using the Azure portal.

#### [Offline](#tab/offline)

[!INCLUDE [prerequisites-migration-service-postgresql](../prerequisites/prerequisites-migration-service-postgresql-offline-single-server.md)]

## Configure your Azure Database for PostgreSQL Flexible Server

- Create the target flexible server. For guided steps, refer to the quickstart [Create an Azure Database for PostgreSQL flexible server using the portal](../../../../flexible-server/quickstart-create-server-portal.md).

- Allowlist extensions whose libraries must be loaded at server start. It's essential that the extension is on the allowlist before you initiate a migration.

- Check if the data distribution among a database's tables is skewed, with most of the data present in a single (or few) tables. If it's skewed, the migration speed could be slower than expected. In this case, the migration speed can be increased by [migrating the large table in parallel](../../best-practices-migration-service-postgresql.md#improve-migration-speed---parallel-migration-of-tables).

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). To sign in, enter your credentials. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-overview.png" alt-text="Screenshot of the flexible Overview page." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-overview.png":::

1. Select the **Create** button to start a migration from a single server to a flexible server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-grid.png" alt-text="Screenshot of the migration tab in flexible server." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-grid.png":::

    If you've already created migrations to your Flexible Server target, the grid contains information about migrations that were attempted to this target from the Single Server.

1. Select the **Migrate from Single Server** button. You go through a wizard-based series of tabs to create a migration into this Flexible Server target from any source Single Server.

Alternatively, you can initiate the migration process from the Azure Database for PostgreSQL Single Server.

1. Open your web browser and go to the [portal](https://portal.azure.com/). To sign in, you must enter your credentials. The default view is your service dashboard.

1. Upon selecting the Single Server, you can observe a migration-related banner in the Overview tab. Select **Migrate now** to get started.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-banner.png" alt-text="Screenshot to initiate migration from Single Server tab." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-banner.png":::

1. You're taken to a page with two options. If you've already created a Flexible Server and want to use that as the target, choose **Select existing**, and select the corresponding Subscription, Resource group, and Server name details. Once the selections are made, select **Go to Migration wizard** and skip to the instructions under this page's **Setup tab** section.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-click-banner.png" alt-text="Screenshot to choose existing flexible server option." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-click-banner.png":::

1. Should you choose to Create a new Flexible Server, select **Create new** and select **Go to Create Wizard**. This action takes you through the Flexible Server creation process and deploys the Flexible Server.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-banner-create-new.png" alt-text="Screenshot to choose new flexible server option." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-banner-create-new.png":::

After deploying the Flexible Server, follow the steps 3 to 5 under [Configure the migration task.](#configure-the-migration-task)

### Setup tab

The first tab is **Setup**. In case you missed it, allowlist necessary extensions as shown in It's essential to allowlist these extensions before you initiate a migration.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-setup-offline.png" alt-text="Screenshot of the details belonging to the set up tab for offline." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-setup-offline.png":::

**Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

**Source server type** indicates the source. In this case, it's Azure Database for PostgreSQL Single server

**Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options.
- **Validate** - Checks your server and database readiness for migration to the target.
- **Migrate** - Skips validations and starts migrations.
- **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered only if there are no validation failures.

It's always a good practice to choose **Validate** or **Validate and Migrate** option to perform premigration validations before running the migration.

If the **Online** migration preview is selected, Logical replication must be turned on in the source Single server. If it's not turned on, the migration service automatically turns on logical replication at the source Single server. Replication can also be set up manually under the **Replication** tab in the Single server-side pane by setting the Azure replication support level to **Logical**. Either approach restarts the source single server.

Select the **Next : Connect to Source** button.

### Source tab

The **Source** tab prompts you to give details related to the Single Server, which is the source of the databases.

After you make the **Subscription** and **Resource Group** selections, the dropdown list for server names shows Single Servers under that resource group across regions. Select the source that you want to migrate databases from. You can migrate databases from a Single Server to a target Flexible Server in the same region. Cross-region migrations are enabled only for India, China, and UAE servers.

After you choose the Single Server source, the **Location**, **PostgreSQL version**, and **Server admin login name** boxes are populated automatically. The server admin sign-in name is the admin username used to create the Single Server. In the **Password** box, enter the password for that admin user. The migration service migrates single server databases as the admin user.

After filling out all the fields, select the **Connect to source** link. This validates that the source server details entered are correct and that the source server is reachable.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-source.png" alt-text="Screenshot of source database server details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-source.png":::

Select the **Next : Select migration target** button to continue.

### Target tab

The **Target** tab displays metadata for the Flexible Server target, such as subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-target.png" alt-text="Screenshot of target database server details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-target.png":::

For **Server admin login name**, the tab displays the admin username used during creating the Flexible Server target. Enter the corresponding password for the admin user. After filling out the password, select the **Connect to target** link. This validates that the target server details entered are correct and target server is reachable.

Select the **Next** button to select the databases to migrate.

### Select Databases for the migration tab

Under this tab, there's a list of user databases inside the Single Server. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases. By default, selected databases with the same name on the target are overwritten.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-database.png" alt-text="Screenshot of Databases to migrate." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-database.png":::

Select the **Next** button to review the details.

### Summary

The **Summary** tab summarizes all the details for creating the validation or migration. Review the details and select on the start button.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-review.png" alt-text="Screenshot of details to review for the migration." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-review.png":::

## Monitor the migration portal

After you select the start button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of Flexible Server. This has a new entry for the recently created validation or migration.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-monitor.png" alt-text="Screenshot of recently created migration details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration type**, **Migration mode**, **Source server**, **Source server type**, **Databases**, **Start time** and **Duration**. The entries are displayed in the descending order of the start time with the most recent entry on the top.

You can use the refresh button to refresh the status of the validation or migration.
You can also select the migration name in the grid to see the associated details.

When the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

Let us look at how to monitor migrations for each **Migration Option**.

### Validate

After the **PerformingPreRequisiteSteps** substate is completed, the validation moves to the substate of **Validation in Progress** where checks are done on the source and target server to assess the readiness for migration.

The validation moves to the **Succeeded** state if all validations are either in **Succeeded** or **Warning** state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validation-successful.png" alt-text="Screenshot of the validation grid." lightbox="../../media/tutorial-migration-service-single-to-flexible/validation-successful.png":::

The validation grid has the
- **Validation details for instance** and **Validation details for databases** sections, representing the validation rules used to check migration readiness.
- **Validation Status** - Represents the result for each rule and can have any of the three values
    - **Succeeded** - If no errors were found.
    - **Failed** - If there are validation errors.
    - **Warning** - If there are validation warnings.
- **Duration** - Time taken for the Validation operation.
- **Start and End time** - Start and end time of the validation operation in UTC.

The **Validation status** moves to **Failed** state if there are any errors in the validation. Select the **Validation name** or **Database name** validation that has failed, and a fan-out pane gives the details and the corrective action you should take to avoid this error.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validation-failed.png" alt-text="Screenshot of the validation grid with failed status." lightbox="../../media/tutorial-migration-service-single-to-flexible/validation-failed.png":::

### Migrate

After the **PerformingPreRequisiteSteps** substrate is completed, the migration moves to the substrate of **Migrating Data** when the Cloning/Copying of the databases takes place. The time for migration to complete depends on the size and shape of the databases you're migrating. The migration is quick if the data is mostly evenly distributed across all the tables. Skewed table sizes take a relatively longer time.

When you select any of the databases in migration, a fan-out pane appears. It has all the table count - copied, queued, copying, and errors apart from the database migration status.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbclick.png" alt-text="Screenshot of the migration grid containing all DB details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbclick.png":::

The migration moves to the **Succeeded** state when the **Migrating Data** state finishes successfully. If there's an issue at the **Migrating Data** state, the migration moves into a **Failed** state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbsuccess.png" alt-text="Screenshot of the migration result." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbsuccess.png":::

Once the migration moves to the **Succeeded** state, schema and data migration from your Single Server to your Flexible Server target is complete. You can use the refresh button on the page to confirm the same.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-complete.png" alt-text="Screenshot of the completed migrations." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-complete.png":::

### Validate and Migrate

In this option, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.
- If validation has errors, the migration moves into a **Failed** state.
- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the results of **Validate and Migrate** once the operation is complete.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validate-and-migrate-1.png" alt-text="Screenshot showing validations tab in details page." lightbox="../../media/tutorial-migration-service-single-to-flexible/validate-and-migrate-1.png":::

#### [Online (preview)](#tab/online)

[!INCLUDE [prerequisites-migration-service-postgresql-online-single-server](../prerequisites/prerequisites-migration-service-postgresql-online-single-server.md)]

## Configure your Azure Database for PostgreSQL Flexible Server

- Create the target flexible server. For guided steps, refer to the quickstart [Create an Azure Database for PostgreSQL flexible server using the portal](../../../../flexible-server/quickstart-create-server-portal.md).

- Allowlist extensions whose libraries must be loaded at server start. It's essential that the extension is on the allowlist before you initiate a migration.

- Check if the data distribution among a database's tables is skewed, with most of the data present in a single (or few) tables. If it's skewed, the migration speed could be slower than expected. In this case, the migration speed can be increased by [migrating the large table in parallel](../../best-practices-migration-service-postgresql.md#improve-migration-speed---parallel-migration-of-tables).

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal. Here's how to start:

1. Open your web browser and go to the [portal](https://portal.azure.com/). To sign in, enter your credentials. The default view is your service dashboard.

1. Go to your Azure Database for PostgreSQL Flexible Server target.

1. In the **Overview** tab of the Flexible Server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-overview.png" alt-text="Screenshot of the flexible Overview page." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-overview.png":::

1. Select the **Create** button to start a migration from a single server to a flexible server. If this is your first time using the migration service, an empty grid appears with a prompt to begin your first migration.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-grid.png" alt-text="Screenshot of the migration tab in flexible server." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-grid.png":::

    If you've already created migrations to your Flexible Server target, the grid contains information about migrations that were attempted to this target from the Single Server.

1. Select the **Migrate from Single Server** button. You go through a wizard-based series of tabs to create a migration into this Flexible Server target from any source Single Server.

Alternatively, you can initiate the migration process from the Azure Database for PostgreSQL Single Server.

1. Open your web browser and go to the [portal](https://portal.azure.com/). To sign in, you must enter your credentials. The default view is your service dashboard.

1. Upon selecting the Single Server, you can observe a migration-related banner in the Overview tab. Select **Migrate now** to get started.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-banner.png" alt-text="Screenshot to initiate migration from Single Server tab." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-banner.png":::

1. You're taken to a page with two options. If you've already created a Flexible Server and want to use that as the target, choose **Select existing**, and select the corresponding Subscription, Resource group, and Server name details. Once the selections are made, select **Go to Migration wizard** and skip to the instructions under this page's **Setup tab** section.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-click-banner.png" alt-text="Screenshot to choose existing flexible server option." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-click-banner.png":::

1. Should you choose to Create a new Flexible Server, select **Create new** and select **Go to Create Wizard**. This action takes you through the Flexible Server creation process and deploys the Flexible Server.

    :::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/single-banner-create-new.png" alt-text="Screenshot to choose new flexible server option." lightbox="../../media/tutorial-migration-service-single-to-flexible/single-banner-create-new.png":::

After deploying the Flexible Server, follow the steps 3 to 5 under [Configure the migration task.](#configure-the-migration-task)

### Setup tab

The first tab is **Setup**. In case you missed it, allowlist necessary extensions as shown in It's essential to allowlist these extensions before you initiate a migration.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-setup-online.png" alt-text="Screenshot of the details belonging to the set up tab for online." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-setup-online.png":::

**Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

**Source server type** indicates the source. In this case, it's Azure Database for PostgreSQL Single server

**Migration Option** allows you to perform validations before triggering a migration. You can pick any of the following options.
- **Validate** - Checks your server and database readiness for migration to the target.
- **Migrate** - Skips validations and starts migrations.
- **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered only if there are no validation failures.

It's always a good practice to choose **Validate** or **Validate and Migrate** option to perform premigration validations before running the migration.

If the **Online** migration preview is selected, Logical replication must be turned on in the source Single server. If it's not turned on, the migration service automatically turns on logical replication at the source Single server. Replication can also be set up manually under the **Replication** tab in the Single server-side pane by setting the Azure replication support level to **Logical**. Either approach restarts the source single server.

Select the **Next : Connect to Source** button.

### Source tab

The **Source** tab prompts you to give details related to the Single Server, which is the source of the databases.

After you make the **Subscription** and **Resource Group** selections, the dropdown list for server names shows Single Servers under that resource group across regions. Select the source that you want to migrate databases from. You can migrate databases from a Single Server to a target Flexible Server in the same region. Cross-region migrations are enabled only for India, China, and UAE servers.

After you choose the Single Server source, the **Location**, **PostgreSQL version**, and **Server admin login name** boxes are populated automatically. The server admin sign-in name is the admin username used to create the Single Server. In the **Password** box, enter the password for that admin user. The migration service migrates single server databases as the admin user.

After filling out all the fields, select the **Connect to source** link. This validates that the source server details entered are correct and that the source server is reachable.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-source.png" alt-text="Screenshot of source database server details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-source.png":::

Select the **Next : Select migration target** button to continue.

### Target tab

The **Target** tab displays metadata for the Flexible Server target, such as subscription name, resource group, server name, location, and PostgreSQL version.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-target.png" alt-text="Screenshot of target database server details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-target.png":::

For **Server admin login name**, the tab displays the admin username used during creating the Flexible Server target. Enter the corresponding password for the admin user. After filling out the password, select the **Connect to target** link. This validates that the target server details entered are correct and target server is reachable.

Select the **Next** button to select the databases to migrate.

### Select Databases for the migration tab

Under this tab, there's a list of user databases inside the Single Server. You can select and migrate up to eight databases in a single migration attempt. If there are more than eight user databases, the migration process is repeated between the source and target servers for the next set of databases. By default, selected databases with the same name on the target are overwritten.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-database.png" alt-text="Screenshot of Databases to migrate." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-database.png":::

Select the **Next** button to review the details.

### Summary

The **Summary** tab summarizes all the details for creating the validation or migration. Review the details and select on the start button.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-review.png" alt-text="Screenshot of details to review for the migration." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-review.png":::

## Monitor the migration using Azure portal

After you select the start button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of Flexible Server. This has a new entry for the recently created validation or migration.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-monitor.png" alt-text="Screenshot of recently created migration details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-monitor.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration type**, **Migration mode**, **Source server**, **Source server type**, **Databases**, **Start time** and **Duration**. The entries are displayed in the descending order of the start time with the most recent entry on the top.

You can use the refresh button to refresh the status of the validation or migration.
You can also select the migration name in the grid to see the associated details.

When the validation or migration is created, it moves to the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and network connections.

Let us look at how to monitor migrations for each **Migration Option**.

### Validate

After the **PerformingPreRequisiteSteps** substate is completed, the validation moves to the substate of **Validation in Progress** where checks are done on the source and target server to assess the readiness for migration.

The validation moves to the **Succeeded** state if all validations are either in **Succeeded** or **Warning** state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validation-successful.png" alt-text="Screenshot of the validation grid." lightbox="../../media/tutorial-migration-service-single-to-flexible/validation-successful.png":::

The validation grid has the
- **Validation details for instance** and **Validation details for databases** sections, representing the validation rules used to check migration readiness.
- **Validation Status** - Represents the result for each rule and can have any of the three values
    - **Succeeded** - If no errors were found.
    - **Failed** - If there are validation errors.
    - **Warning** - If there are validation warnings.
- **Duration** - Time taken for the Validation operation.
- **Start and End time** - Start and end time of the validation operation in UTC.

The **Validation status** moves to **Failed** state if there are any errors in the validation. Select the **Validation name** or **Database name** validation that has failed, and a fan-out pane gives the details and the corrective action you should take to avoid this error.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validation-failed.png" alt-text="Screenshot of the validation grid with failed status." lightbox="../../media/tutorial-migration-service-single-to-flexible/validation-failed.png":::

### Migrate

After the **PerformingPreRequisiteSteps** substrate is completed, the migration moves to the substrate of **Migrating Data** when the Cloning/Copying of the databases takes place. The time for migration to complete depends on the size and shape of the databases you're migrating. The migration is quick if the data is mostly evenly distributed across all the tables. Skewed table sizes take a relatively longer time.

When you select any of the databases in migration, a fan-out pane appears. It has all the table count - copied, queued, copying, and errors apart from the database migration status.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbclick.png" alt-text="Screenshot of the migration grid containing all DB details." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbclick.png":::

The migration moves to the **Succeeded** state when the **Migrating Data** state finishes successfully. If there's an issue at the **Migrating Data** state, the migration moves into a **Failed** state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbsuccess.png" alt-text="Screenshot of the migration result." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-dbsuccess.png":::

Once the migration moves to the **Succeeded** state, schema and data migration from your Single Server to your Flexible Server target is complete. You can use the refresh button on the page to confirm the same.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-complete.png" alt-text="Screenshot of the completed migrations." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-complete.png":::

### Validate and Migrate

In this option, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substate is completed, the workflow moves into the substate of **Validation in Progress**.
- If validation has errors, the migration moves into a **Failed** state.
- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

You can see the results of **Validate and Migrate** once the operation is complete.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/validate-and-migrate-1.png" alt-text="Screenshot showing validations tab in details page." lightbox="../../media/tutorial-migration-service-single-to-flexible/validate-and-migrate-1.png":::

### Cutover migration

If there's both **Migrate** and **Validate and Migrate**, completion of the Online migration requires another step - a Cutover action is required from the user. After the copy/clone of the base data is complete, the migration moves to the `WaitingForUserAction` state and the `WaitingForCutoverTrigger` substrate. In this state, user can trigger cutover from the portal by selecting the migration.

Before initiating cutover, it's essential to ensure that:

- Writes to the source are stopped -`Latency (minutes)` parameter is 0 or close to 0
The `Latency (minutes)` information can be obtained from the migration details screen as shown below:

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-cutover.png" alt-text="Screenshot showing migration ready for cutover." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-cutover.png":::

`Latency (minutes)` parameter indicates when the target last synced up with the source. For example, for the Orders Database above, it's 0.33333. It means that the changes that occurred in the last ~0.3 minutes at the source are yet to be synced to the target, for the Orders Database. At this point, writes to the source can be stopped and cutover initiated. In case there's heavy traffic at the source, it's recommended to stop writes first so that `Latency (minutes)` can come close to 0, and then a cutover is initiated. The Cutover operation applies all pending changes from the source to the Target and completes the migration. If you trigger a "Cutover" even with **non-zero Latency**, the replication stops until that point in time. All the data on the source until the cutover point is then applied to the target. Say a latency was 15 minutes at the cutover point, so all the change data in the last 15 minutes are applied to the target. Time taken depends on the backlog of changes that occurred in the last 15 minutes. Hence, it's recommended that the latency goes to zero or near zero, before triggering the cutover.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-click-cutover.png" alt-text="Screenshot showing select cutover." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-click-cutover.png":::

The migration moves to the `Succeeded` state as soon as the `Migrating Data` substate or the cutover (in Online migration) finishes successfully. If there's a problem at the `Migrating Data` substate, the migration moves into a `Failed` state.

:::image type="content" source="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-online-dbsuccess.png" alt-text="Screenshot showing cutover success." lightbox="../../media/tutorial-migration-service-single-to-flexible/flexible-migration-progress-online-dbsuccess.png":::

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

---

## Cancel the migration using the portal

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

Canceling a validation stops any further validation activity and the validation moves to a **Canceled** state.
Canceling a migration stops further migration activity on your target server and moves to a **Canceled** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.
