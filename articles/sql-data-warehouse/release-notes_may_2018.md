---
title: Azure SQL Data Warehouse Release Nodes May 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 05/25/2018
ms.author: twounder
ms.reviewer: twounder
---

# Release Notes May 2018
The following new features, enhancements, and changes have been introduced this month.

## GDPR Compliance
## Alter View

## Rejected Row Support

## SP_DATATYPE_INFO
The [sp_datatype_info](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-datatype-info-transact-sql) system stored procedure returns information about the data types supported by the current environment. It is commonly used by tools connecting through ODBC connections for data type investigation.

### Examples
#### A. Listing all data types
The following example retrieves details for all data types supported by SQL Data Warehouse.

```sql
EXEC sp_datatype_info
```

#### B. Listing a single data type
The following example shows how to view information for a single data type.

```sql
EXEC sp_datatype_info -11
```
