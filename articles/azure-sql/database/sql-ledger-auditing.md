---
title: "Auditing using SQL ledger"
description: Overview of SQL ledger auditing capabilities
ms.custom: ""
ms.date: "05/25/2021"
ms.service: sql-database
ms.subservice: security
ms.reviewer: vanto
ms.topic: conceptual
author: JasonMAnderson
ms.author: janders
---

# SQL audit events with SQL ledger

When performing forensics activities with ledger-enabled tables, in addition to the data captured in the ledger view and database ledger, additional action IDs are added to the SQL audit logs.  The following table outlines these new audit logging events along with the conditions that trigger the events.



| action_id | name                   | class_desc | covering_action_desc   | parent_class_desc | covering_parent_action_name | configuration_level | configuration_group_name | action_in_log | Condition triggering the event                               |
| --------- | ---------------------- | ---------- | ---------------------- | ----------------- | --------------------------- | ------------------- | ------------------------ | ------------- | ------------------------------------------------------------ |
| ENLR      | ENABLE LEDGER          | OBJECT     | NULL                   | DATABASE          | LEDGER_OPERATION_GROUP      | NULL                | LEDGER_OPERATION_GROUP   | 1             | Creating a new ledger table or converting a regular table to a ledger table. |
| ALLR      | ALTER LEDGER           | OBJECT     | NULL                   | DATABASE          | LEDGER_OPERATION_GROUP      | NULL                | LEDGER_OPERATION_GROUP   | 1             | Dropping or renaming a ledger table, converting a ledger table  to a normal table, adding, dropping or renaming a column in a ledger table. |
| GDLR      | GENERATE LEDGER DIGEST | DATABASE   | LEDGER_OPERATION_GROUP | SERVER            | LEDGER_OPERATION_GROUP      | NULL                | LEDGER_OPERATION_GROUP   | 1             | Generating a ledger digest.                                  |
| VFLR      | VERIFY LEDGER          | DATABASE   | LEDGER_OPERATION_GROUP | SERVER            | LEDGER_OPERATION_GROUP      | NULL                | LEDGER_OPERATION_GROUP   | 1             | Verifying a ledger digest.                                   |
| OPLR      | LEDGER_OPERATION_GROUP | DATABASE   | NULLER                 | SERVER            | NULL                        | GROUP               | LEDGER_OPERATION_GROUP   | 0             | N/A                                                          |
| OPLR      | LEDGER_OPERATION_GROUP | SERVER     | NULL                   | NULL              | NULL                        | GROUP               | NULL                     | 0             | N/A                                                          |


## Next steps

- [Auditing for Azure SQL Database and Azure Synapse Analytics](auditing-overview.md)   
