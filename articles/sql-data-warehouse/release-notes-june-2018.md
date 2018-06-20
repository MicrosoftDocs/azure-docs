---
title: Azure SQL Data Warehouse Release Notes June 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 06/18/2018
ms.author: twounder
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse (June 2018)?
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in June 2018. 

## Features
### User Defined Restore Points
SQL Data Warehouse automatically takes snapshots of your data warehouse every 8 hours guaranteeing an eight-hour recovery point objective (RPO). While this automated snapshots ease the management burden of running your data warehouse, there is a need to take snapshots at critical times based on your business need. For example, taking a snapshot right before a significant data load or the deployment of new scripts into the data warehouse to enable a restore point right before the operation. 

SQL Data Warehouse now supports [user-defined restore points](https://azure.microsoft.com/blog/quick-recovery-time-with-sql-data-warehouse-using-user-defined-restore-points/) through the [New-AzureRmSqlDatabaseRestorePoint](https://docs.microsoft.com/powershell/module/azurerm.sql/new-azurermsqldatabaserestorepoin) cmdlet.

```PowerShell
New-AzureRmSqlDatabaseRestorePoint -ResourceGroupName $ResourceGroupName -ServerName $ServerName -DatabaseName $DatabaseName -RestorePointLabel $RestorePointName
```

### Column Level Security
Managing data access and security in your data warehouse is critical to building trust with your customers and partners. SQL Data Warehouse [now supports Column-Level Security (CLS)](https://azure.microsoft.com/blog/column-level-security-is-now-supported-in-azure-sql-data-warehouse/) that allows you to adjust permissions to view sensitive data, by limiting user access to specific columns in your tables without having to redesign your data warehouse.

CLS enables you to control access to table columns based on the user's execution context or their group membership by using standard [GRANT](https://docs.microsoft.com/azure/sql-data-warehouse/column-level-security) T-SQL statement. The access restriction logic is located in the database tier itself rather than away from the data in another application, simplifying the overall security implementation.


```sql
CREATE USER Nurse WITHOUT LOGIN;   
GRANT SELECT ON Membership(MemberID, FirstName, LastName, Phone, Email) TO Nurse;   
EXECUTE AS USER = 'Nurse';   
SELECT * FROM Membership;   
Msg 230, Level 14, State 1, Line 12 

The SELECT permission was denied on the column 'SSN' of the object 'Membership', database 'CLS_TestDW', schema 'dbo'.
```
## Behavior Changes
None