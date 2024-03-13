---
title: PostgreSQL - AWS RDS PostgreSQL to Flexible Server portal migration
author: markingmyname
ms.author: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

You can migrate using the Azure portal.

## Configure the migration task

The migration service comes with a simple, wizard-based experience on the Azure portal.

1. Open your web browser and go to the [portal](https://portal.azure.com/). Enter your credentials to sign in. The default view is your service dashboard.

1. Go to your Azure Database for the PostgreSQL flexible server.

1. In the **Overview** tab of the flexible server, on the left menu, scroll down to **Migration** and select it.

    :::image type="content" source="../../media\tutorial-migration-service-aws\offline-portal-select-migration-pane.png" alt-text="Screenshot of the migration selection." lightbox="../../media\tutorial-migration-service-aws\offline-portal-select-migration-pane.png":::

1. Select the **Create** button to migrate from AWS RDS to a flexible server.

    > [!NOTE]  
    > The first time you use the migration service, an empty grid appears with a prompt to begin your first migration.

    If migrations to your flexible server target have already been created, the grid now contains information about attempted migrations.

1. Select the **Create** button to go through a wizard-based series of tabs to perform a migration.

    :::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-create-migration.png" alt-text="Screenshot of the create migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-create-migration.png":::

## Setup

The first tab is the setup tab.

The user needs to provide multiple details related to the migration like the migration name, source server type, option, and mode.

- **Migration name** is the unique identifier for each migration to this Flexible Server target. This field accepts only alphanumeric characters and doesn't accept any special characters except a hyphen (-). The name can't start with a hyphen and should be unique for a target server. No two migrations to the same Flexible Server target can have the same name.

- **Source Server Type** - Depending on your PostgreSQL source, you can select AWS RDS for PostgreSQL.

- **Migration Option** - Allows you to perform validations before triggering a migration. You can pick any of the following options
    - **Validate** - Checks your server and database readiness for migration to the target.
    - **Migrate** - Skips validations and starts migrations.
    - **Validate and Migrate** - Performs validation before triggering a migration. Migration gets triggered if there are no validation failures.
        - Choosing the **Validate** or **Validate and Migrate** option is always a good practice to perform premigration validations before running the migration.

To learn more about the premigration validation, visit [premigration](../../concepts-premigration-migration-service.md).

- **Migration mode** allows you to pick the mode for the migration. **Offline** is the default option.

Select the **Next: Connect to source** button.

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-setup-migration-aws.png" alt-text="Screenshot of the setup migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-setup-migration-aws.png":::

## Connect to the source

The **Connect to Source** tab prompts you to give details related to the source selected in the **Setup Tab**, which is the source of the databases.

- **Server Name** - Provide the Hostname or the IP address of the source PostgreSQL instance

- **Port** - Port number of the Source server

- **Server admin login name** - Username of the source PostgreSQL server

- **Password** - Password of the source PostgreSQL server

- **SSL Mode** - Supported values are preferred and required. When the SSL at the source PostgreSQL server is OFF, use the SSLMODE=prefer. If the SSL at the source server is ON, use the SSLMODE=require. SSL values can be determined in postgresql.conf file.

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can go ahead with the next step; they need to identify the networking issues between the target and source and verify the username/password for the source. Test connection takes a few minutes to establish a connection between the target and source.

After the successful test connection, select the **Next: Select Migration target** button.

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-connect-source-migration-aws.png" alt-text="Screenshot of the connect to source page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-connect-source-migration-aws.png":::

## Connect to the target

The **select migration target** tab displays metadata for the Flexible Server target, like subscription name, resource group, server name, location, and PostgreSQL version.

- **Admin username** - Admin username of the target PostgreSQL server

- **Password** - Password of the target PostgreSQL server

- **Test Connection** - Performs the connectivity test between target and source. Once the connection is successful, users can proceed with the next step. Otherwise, we need to identify the networking issues between the target and the source and verify the username/password for the target. Test connection takes a few minutes to establish a connection between the target and source

After the successful test connection, select the **Next: Select Database(s) for Migration**

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-connect-target-migration.png" alt-text="Screenshot of the connect target migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-connect-target-migration.png":::

## Select databases for migration

Under the **Select database for migration** tab, you can choose a list of user databases to migrate from your source PostgreSQL server.  
After selecting the databases, select the **Next:Summary**

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-fetchdb-migration-aws.png" alt-text="Screenshot of the fetchDB migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-fetchdb-migration-aws.png":::

## Summary

The **Summary** tab summarizes all the source and target details for creating the validation or migration. Review the details and select the **Start Validation and Migration** button.

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-summary-migration-aws.png" alt-text="Screenshot of the summary migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-summary-migration-aws.png":::

## Monitor the migration

After you select the **Start Validation and Migration** button, a notification appears in a few seconds to say that the validation or migration creation is successful. You're redirected automatically to the **Migration** page of flexible server. The entry is in the **InProgress** state and **PerformingPreRequisiteSteps** substate. The workflow takes 2-3 minutes to set up the migration infrastructure and check network connections.

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-monitor-migration-aws.png" alt-text="Screenshot of the monitor migration page." lightbox="../../media\tutorial-migration-service-aws\portal-offline-monitor-migration-aws.png":::

The grid that displays the migrations has these columns: **Name**, **Status**, **Migration mode**, **Migration type**, **Source server**, **Source server type**, **Databases**, **Duration** and **Start time**. The entries are displayed in the descending order of the start time, with the most recent entry on the top. You can use the refresh button to refresh the status of the validation or migration run.

## Migration details

Select the migration name in the grid to see the associated details.

In the **Setup** tab, we have selected the migration option as **Validate and Migrate**. In this scenario, validations are performed first before migration starts. After the **PerformingPreRequisiteSteps** substrate is completed, the workflow moves into the substrate of **Validation in Progress**.

- If validation has errors, the migration moves into a **Failed** state.

- If validation is complete without any error, the migration starts, and the workflow moves into the substate of **Migrating Data**.

Validation details are available at the instance and database level.

- **Validation at Instance level**
    - Contains validation related to the connectivity check, source version, that is, PostgreSQL version >= 9.5, server parameter check, that is, if the extensions are enabled in the server parameters of the Azure Database for PostgreSQL - flexible server.

- **Validation at Database level**
    - It contains validation of the individual databases related to extensions and collations support in Azure Database for PostgreSQL, a flexible server.

You can see the **validation** and the **migration** status under the migration details page.

:::image type="content" source="../../media\tutorial-migration-service-aws\portal-offline-details-migration-aws.png" alt-text="Screenshot of the details showing validation and migration." lightbox="../../media\tutorial-migration-service-aws\portal-offline-details-migration-aws.png":::

Possible migration states include:

- **InProgress**: The migration infrastructure setup is underway, or the actual data migration is in progress.
- **Canceled**: The migration is canceled or deleted.
- **Failed**: The migration has failed.
- **Validation Failed** : The validation has failed.
- **Succeeded**: The migration has succeeded and is complete.
- **WaitingForUserAction**: Applicable only for online migration. Waiting for user action to perform cutover.

Possible migration substates include:

- **PerformingPreRequisiteSteps**: Infrastructure setup is underway for data migration.
- **Validation in Progress**: Validation is in progress.
- **MigratingData**: Data migration is in progress.
- **CompletingMigration**: Migration is in the final stages of completion.
- **Completed**: Migration has been completed.
- **Failed**: Migration is failed.

Possible validation substates include:

- **Failed**: Validation is failed.
- **Succeeded**: Validation is successful.
- **Warning**: Validation is in Warning. Warnings are informative messages that you must remember while planning the migration.

## Cancel the migration using the portal

You can cancel any ongoing validations or migrations. The workflow must be in the **InProgress** state to be canceled. You can't cancel a validation or migration that's in the **Succeeded** or **Failed** state.

- Canceling a validation stops further validation activity, and the validation moves to a **Can be called** state.
- Canceling a migration stops further migration activity on your target server and moves to a **Can be called** state. It doesn't drop or roll back any changes on your target server. Be sure to drop the databases on your target server involved in a canceled migration.