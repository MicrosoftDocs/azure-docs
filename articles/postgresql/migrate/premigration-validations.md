---
title: "Migration service - premigration validations"
titleSuffix: Azure Database for PostgreSQL Flexible Server
description: premigration validations to identify issues before running migrations
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 01/18/2024
ms.service: postgresql
ms.topic: conceptual
ms.custom:
---

# Premigration validations for the migrations service in Azure Database for PostgreSQL

Premigration validation is a set of rules that involves assessing and verifying the readiness of a source database system for migration to Azure Database for PostgreSQL – Flexible Server. This process aims to identify and address potential issues that might affect the database's migration or post-migration operation.

## How to use premigration validation?

To use premigration validation when migrating to Azure Database for PostgreSQL - flexible server, you can select the appropriate migration option either through the Azure portal during the setup or by specifying the --migration-option parameter in the Azure CLI when creating a migration. Here's how to do it in both methods:

### Use the Azure portal

- Navigate to the Migration tab within the Azure Database for PostgreSQL - Flexible server.
- Create a new migration project or select an existing one.
- Start a new migration activity within your project.
- When prompted, choose the migration option that includes validation. This could be labeled as validate, validateandmigrate, or a similar term depending on the context of the portal's interface.

:::image type="content" source="media\pre-migration-validation\migration-option-pre.png" alt-text="Screenshot of selecting migration option from portal." lightbox="media\pre-migration-validation\migration-option-pre.png":::

### Use Azure CLI

Open your command-line interface.
Ensure you have the Azure CLI installed and you're logged into your Azure account using az sign-in.
Construct your migration task creation command with the Azure CLI.
Include the --migration-option parameter followed by the option validate to perform only the premigration validation, or validateandmigrate to perform validation and then proceed with the migration if the validation is successful.
You can pick any of the following options.

- **Validate** - Use this option to check your server and database readiness for migration to the target. **This option will not start data migration and will not require any server downtime.**
The result of the Validate option can be
    - **Succeeded** - No issues were found, and you can plan for the migration
    - **Failed** - There were errors found during validation, which can cause the migration to fail. Review the list of errors and their suggested workarounds and take corrective measures before planning the migration.
    - **Warning** - Warnings are informative messages you must remember while planning the migration.

    Plan your migrations better by performing premigration validations in advance to know the potential issues you might encounter while performing migrations.

- **Migrate** - Use this option to kickstart the migration without going through a validation process. It's recommended to perform validation before triggering a migration to increase the chances of success. Once validation is done, you can use this option to start the migration process.

- **Validate and Migrate** - In this option, validations are performed, and migration gets triggered if all checks are in the **succeeded** or **warning** state. Validation failures don't start the migration between source and target servers.

We recommend that customers use premigration validations in the following way:

1. Choose the **Validate** option and run premigration validation on an advanced date of your planned migration.

1. Analyze the output and take any remedial actions for any errors.

1. Rerun Step 1 until the validation is successful

1. Start the migration using the **Validate and Migrate** option on the planned date and time.


## Related content

- [Known issues and limitations](known-issues-and-limitations.md)
- [Networking setup](network-setup.md)
- [Prerequisites](prerequisites.md)

