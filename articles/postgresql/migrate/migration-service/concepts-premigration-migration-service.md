---
title: "Migration service - premigration validations"
description: premigration validations to identify issues before running migrations
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.topic: conceptual
---

# Premigration validations for the migrations service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

Premigration validation is a set of rules that involves assessing and verifying the readiness of a source database system for migration to Azure Database for PostgreSQL. This process identifies and addresses potential issues affecting the database's migration or post-migration operation.

## How do you use the premigration validation feature?

To use premigration validation when migrating to Azure Database for PostgreSQL - flexible server, you can select the appropriate migration option either through the Azure portal during the setup or by specifying the `--migration-option` parameter in the Azure CLI when creating a migration. Here's how to do it in both methods:

### Use the Azure portal

- Navigate to the migration tab within the Azure Database for PostgreSQL.

- Select the **Create** button

- In the Setup page, choose the migration option that includes validation. This could be labeled as **validate**, **validate and migrate**

    :::image type="content" source="media\concepts-premigration-migration-service\premigration-option.png" alt-text="Screenshot of premigration option to start migration." lightbox="media\concepts-premigration-migration-service\premigration-option.png":::

### Use Azure CLI

- Open your command-line interface.

- Ensure you have the Azure CLI installed and you're logged into your Azure account using az sign-in.

- The version should be at least 2.56.0 or above to use the migration option.  

Construct your migration task creation command with the Azure CLI.

```bash
az postgres flexible-server migration create --subscription <subscription ID> --resource-group <Resource group Name> --name <Flexible server Name> --migration-name <Unique migration ID> --migration-option ValidateAndMigrate --properties "Path of the JSON File" --migration-mode offline
```

Include the `--migration-option` parameter followed by the option validate to perform only the premigration **Validate**, **Migrate**, or **ValidateAndMigrate** to perform validation and then proceed with the migration if the validation is successful.

## Pre-migration validation options

You can pick any of the following options.

- **Validate** - Use this option to check your server and database readiness for migration to the target. **This option will not start data migration and will not require any server downtime.**
     - Plan your migrations better by performing premigration validations in advance to know the potential issues you might encounter while performing migrations.

- **Migrate** - Use this option to kickstart the migration without going through a validation process. Perform validation before triggering a migration to increase the chances of success. Once validation is done, you can use this option to start the migration process.

- **ValidateandMigrate** - This option performs validations, and migration gets triggered if all checks are in the **succeeded** or **warning** state. Validation failures don't start the migration between source and target servers.

We recommend that customers use premigration validations to identify issues before running migrations. This helps you to plan your migrations better and avoid any surprises during the migration process.

1. Choose the **Validate** option and run premigration validation on an advanced date of your planned migration.

1. Analyze the output and take any remedial actions for any errors.

1. Rerun Step 1 until the validation is successful.

1. Start the migration using the **Validate and Migrate** option on the planned date and time.

## Validation states 

The result post running the validated option can be:

- **Succeeded** - No issues were found, and you can plan for the migration
- **Failed** - There were errors found during validation, which can cause the migration to fail. Review the list of errors and their suggested workarounds and take corrective measures before planning the migration.
- **Warning** - Warnings are informative messages you must remember while planning the migration. 


## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
