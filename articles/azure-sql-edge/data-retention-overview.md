---
title: Data retention policy overview - Azure SQL Edge
description: Learn about the data retention policy in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.reviewer: randolphwest
ms.date: 09/04/2020
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - data retention
services: sql-edge
---

# Data retention overview

Collection and storage of data from connected IoT devices is important to drive and gain operational and business insights. However given the volume of data originating from these devices, it becomes important for organizations to carefully plan the amount of data they want to retain and at what granularity. While retaining all data at all granularity is desirable, it's not always practical. Additionally, the volume of data that can be retained is constrained by the amount of storage available on the IoT or Edge devices. 

In Azure SQL Edge database administrators can define data retention policy on a SQL Edge database and its underlying tables. Once the data retention policy is defined, a background system task will run to purge any obsolete (old) data from the user tables. 

> [!Note]
> Data once purged from the table, is not recoverable. The only possible way to recover the purged data is to restore the database from an older backup.

Quickstarts:

- [Enable and disable data retention policies](data-retention-enable-disable.md)
- [Manage historical data with retention policy](data-retention-cleanup.md)

## How data retention works

To configure data retention, you can use DDL statements. For more information, [Enable and Disable Data Retention Policies](data-retention-enable-disable.md). For automatic deletion of the obsolete records, data retention must first be enabled for both the database and the tables that you want to be purged within that database. 

After data retention is configured for a table, a background task runs to identify the obsolete records in a table and delete those records. If for some reason, the automatic cleanup of the tasks is not running or is unable to keep up with the deletes, then a manual cleanup operation can be performed on these tables. For more information on automatic and manual cleanups, refer [Automatic and Manual Cleanup](data-retention-cleanup.md).

## Limitations and restrictions

- Data Retention, if enabled, is automatically disabled when the database is restored from a full backup or is reattached. 
- Data Retention cannot be enabled for a Temporal History Table
- Data Retention filter colomn cannot be altered. To alter the column, disable data retention on the table.  

## Next Steps

- [Machine Learning and Artificial Intelligence with ONNX in SQL Edge](onnx-overview.md).
- [Building an end to end IoT Solution with SQL Edge using IoT Edge](tutorial-deploy-azure-resources.md).
- [Data Streaming in Azure SQL Edge](stream-data.md)
