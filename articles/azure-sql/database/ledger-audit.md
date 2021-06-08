---
title: "Azure SQL Database audit events with ledger-enabled tables"
description: Overview of Azure SQL Database ledger auditing capabilities
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# Azure SQL Database audit events with ledger-enabled tables

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

When performing forensics activities with ledger-enabled tables, in addition to the data captured in the ledger view and database ledger, additional action IDs are added to the SQL audit logs.  The following table outlines these new audit logging events along with the conditions that trigger the events.

## Enable ledger

| Column | Value |
|--|--|
| **action_id** | ENLR |
| **name** | ENABLE LEDGER  |
| **class_desc** | OBJECT |
| **covering_action_desc** | NULL |
| **parent_class_desc** | DATABASE |
| **covering_parent_action_name** | LEDGER_OPERATION_GROUP |
| **configuration_level** | NULL |
| **configuration_group_name** | LEDGER_OPERATION_GROUP |
| **action_in_log** | 1 |

**Condition triggering the event**: Creating a new ledger table or converting a regular table to a ledger table.

## Alter ledger

| Column | Value |
|--|--|
| **action_id** | ALLR |
| **name** | ALTER LEDGER |
| **class_desc** | OBJECT |
| **covering_action_desc** | NULL |
| **parent_class_desc** | DATABASE |
| **covering_parent_action_name** | LEDGER_OPERATION_GROUP |
| **configuration_level** | NULL |
| **configuration_group_name** | LEDGER_OPERATION_GROUP |
| **action_in_log** | 1 |

**Condition triggering the event**: Dropping or renaming a ledger table, converting a ledger table  to a normal table, adding, dropping or renaming a column in a ledger table.


## Generate ledger digest

| Column | Value |
|--|--|
| **action_id** | GDLR |
| **name** | GENERATE LEDGER DIGEST |
| **class_desc** | DATABASE |
| **covering_action_desc** | LEDGER_OPERATION_GROUP |
| **parent_class_desc** | SERVER |
| **covering_parent_action_name** | LEDGER_OPERATION_GROUP |
| **configuration_level** | NULL |
| **configuration_group_name** | LEDGER_OPERATION_GROUP  |
| **action_in_log** | 1 |

**Condition triggering the event**: Generating a ledger digest.

## Verify ledger

| Column | Value |
|--|--|
| **action_id** | VFLR |
| **name** | VERIFY LEDGER |
| **class_desc** | DATABASE |
| **covering_action_desc** | LEDGER_OPERATION_GROUP |
| **parent_class_desc** | SERVER |
| **covering_parent_action_name** | LEDGER_OPERATION_GROUP |
| **configuration_level** | NULL |
| **configuration_group_name** | LEDGER_OPERATION_GROUP |
| **action_in_log** | 1 |

**Condition triggering the event**: Verifying a ledger digest.

## Ledger operation Group

| Column | Value |
|--|--|
| **action_id** | OPLR |
| **name** | LEDGER_OPERATION_GROUP |
| **class_desc** | DATABASE |
| **covering_action_desc** | NULL |
| **parent_class_desc** | SERVER |
| **covering_parent_action_name** | NULL |
| **configuration_level** | GROUP |
| **configuration_group_name** | LEDGER_OPERATION_GROUP |
| **action_in_log** | 0 |

**Condition triggering the event**: N/A

| Column | Value |
|--|--|
| **action_id** | OPLR |
| **name** | LEDGER_OPERATION_GROUP |
| **class_desc** | SERVER |
| **covering_action_desc** | NULL |
| **parent_class_desc** | NULL |
| **covering_parent_action_name** | NULL |
| **configuration_level** | GROUP |
| **configuration_group_name** | LEDGER_OPERATION_GROUP |
| **action_in_log** | 0 |

**Condition triggering the event**: N/A 

## Next steps

- [Auditing for Azure SQL Database and Azure Synapse Analytics](auditing-overview.md)
- [Azure SQL Database ledger Overview](ledger-overview.md)
- [Quickstart: Create an Azure SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md)
