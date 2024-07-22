---
title: "Migration service - Premigration validations"
description: Learn about premigration validations to identify issues before you run a migration to Azure Database for PostgreSQL.
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 06/19/2024
ms.service: postgresql
ms.topic: conceptual
---

# Premigration validations for the migrations service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

Premigration validation is a set of rules that involves assessing and verifying the readiness of a source database system for migration to Azure Database for PostgreSQL. This process identifies and addresses potential issues affecting the database's migration or post-migration operation.

## How do you use the premigration validation feature?

To use premigration validation when you migrate to Azure Database for PostgreSQL - Flexible Server, you have two migration options:

- Use the Azure portal during setup.
- Specify the `--migration-option` parameter in the Azure CLI when you create a migration.

Here's how to do it in both methods.

### Use the Azure portal

1. Go to the migration tab in Azure Database for PostgreSQL.

1. Select **Create**.

1. On the **Setup** page, choose the migration option that includes validation. Select **Validate** or **Validate and Migrate**.

    :::image type="content" source="media\concepts-premigration-migration-service\premigration-option.png" alt-text="Screenshot that shows the premigration option to start migration." lightbox="media\concepts-premigration-migration-service\premigration-option.png":::

### Use the Azure CLI

1. Open your command-line interface.

1. Ensure that you have the Azure CLI installed and that you're signed in to your Azure account by using `az sign-in`.
   The version should be at least 2.56.0 or above to use the migration option.

1. Construct your migration task creation command with the Azure CLI.

    ```bash
    az postgres flexible-server migration create --subscription <subscription ID> --resource-group <Resource group Name> --name <Flexible server Name> --migration-name <Unique migration ID> --migration-option ValidateAndMigrate --properties "Path of the JSON File" --migration-mode offline
    ```

1. Include the `--migration-option` parameter followed by the `Validate` option to perform only the premigration. Use `Validate`, `Migrate`, or `ValidateAndMigrate` to perform validation. If the validation is successful, continue with the migration.

## Premigration validation options

You can choose any of the following options:

- **Validate**: Use this option to check your server and database readiness for migration to the target. *This option won't start data migration and won't require any server downtime.*
     - Plan your migrations better by performing premigration validations in advance to know the potential issues you might encounter while you perform migrations.
- **Migrate**: Use this option to kickstart the migration without going through a validation process. Perform validation before you trigger a migration to increase the chances of success. After validation is finished, you can use this option to start the migration process.
- **Validate and Migrate**: This option performs validations, and migration gets triggered if all checks are in the **Succeeded** or **Warning** state. Validation failures don't start the migration between source and target servers.

We recommend that you use premigration validations to identify issues before you run migrations. This technique helps you to plan your migrations better and avoid any surprises during the migration process.

1. Choose the **Validate** option and run premigration validation on an advanced date of your planned migration.

1. Analyze the output and take any remedial actions for any errors.

1. Rerun step 1 until the validation is successful.

1. Start the migration by using the **Validate and Migrate** option on the planned date and time.

## Validation states

After you run the **Validate** option, you see one of the following options:

- **Succeeded**: No issues were found and you can plan for the migration.
- **Failed**: Errors were found during validation, which can cause the migration to fail. Review the list of errors and their suggested workarounds. Take corrective measures before you plan the migration.
- **Warning**: Warnings are informative messages you must remember while you plan the migration.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
