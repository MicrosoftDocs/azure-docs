---
title: Failure to create or delete a database or table in Azure Data Explorer
description: This article describes troubleshooting steps for creating and deleting databases and tables in Azure Data Explorer.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
services: data-explorer
ms.topic: conceptual
ms.date: 09/24/2018
---

# Troubleshoot: Failure to create or delete a database or table in Azure Data Explorer

In Azure Data Explorer, you regularly work with databases and tables. This article provides troubleshooting steps for issues that can come up.

## Creating a database

1. Ensure you have adequate permissions. To create a database, you must be a member of the *Contributor* or *Owner* role for the Azure subscription. If necessary, work with your subscription administrator so they can add you to the appropriate role.

1. Ensure that there are no name validation errors for the database name. The name must be alphanumeric, with a maximum length of 260 characters.

1. Ensure that the database retention and caching values are within allowable ranges. Retention must be between 1 and 36500 days (100 years). Caching must be between 1 and the maximum value set for retention.

## Deleting or renaming a database

Ensure you have adequate permissions. To delete or rename a database, you must be a member of the *Contributor* or *Owner* role for the Azure subscription. If necessary, work with your subscription administrator so they can add you to the appropriate role.

## Creating a table

1. Ensure you have adequate permissions. To create a table, you must be a member of the *database admin* or *database user* role in the database or the *Contributor* or *Owner* role for the Azure subscription. If necessary, work with your subscription or cluster administrator so they can add you to the appropriate role.

    For more information about permissions, see [Manage database permissions](manage-database-permissions.md).

1. Ensure that a table with the same name doesn't already exist. If it exists, then you can: Create a table with a different name; rename the existing table (requires *table admin* role); or drop the existing table (requires *database admin* role). Use the following commands.

    ```Kusto
    .drop table <TableName>

   .rename table <OldTableName> to <NewTableName>
    ```

## Deleting or renaming a table

Ensure you have adequate permissions. To delete or rename a table, you must be a member of the *database admin* or *table admin* role in the database. If necessary, work with your subscription or cluster administrator so they can add you to the appropriate role.

For more information about permissions, see [Manage database permissions](manage-database-permissions.md).

## General guidance

1. Check the [Azure service health dashboard](https://azure.microsoft.com/status/>). Look for the status of Azure Data Explorer in the region where you're trying to work with a database or table.

    If the status isn't **Good** (green check mark), try again after the status improves.

1. If you still need assistance solving your issue, please open a support request in the [Azure portal](https://portal.azure.com).

## Next steps

[Check cluster health](check-cluster-health.md)