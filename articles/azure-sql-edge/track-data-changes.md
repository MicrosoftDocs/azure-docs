---
title: Track data changes in Azure SQL Edge
description: Learn about change tracking and change data capture in Azure SQL Edge.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
---
# Track data changes in Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge supports the two SQL Server features that track changes to data in a database: [change tracking](/sql/relational-databases/track-changes/track-data-changes-sql-server#Tracking) and [change data capture](/sql/relational-databases/track-changes/track-data-changes-sql-server#Capture). These features enable applications to determine the data modification language changes (insert, update, and delete operations) that were made to user tables in a database. You can enable change data capture and change tracking on the same database. No special considerations are required.

The ability to query for data that has changed in a database is an important requirement for some applications to be efficient. Typically, to determine data changes, application developers must implement a custom tracking method in their applications by using a combination of triggers, timestamp columns, and additional tables. Creating these applications usually involves a lot of work to implement, leads to schema updates, and often carries a high performance overhead.

In the case of an IoT solution, where you need to periodically move data from the edge to a cloud or datacenter, change tracking can be useful. Users can quickly and effectively query only the changes from the last sync, and upload those changes to the cloud or datacenter target. For more information, see [Benefits of using change data capture or change tracking](/sql/relational-databases/track-changes/track-data-changes-sql-server#benefits-of-using-change-data-capture-or-change-tracking).

These two features aren't the same. For more information, see [Feature differences between change data capture and change tracking](/sql/relational-databases/track-changes/track-data-changes-sql-server#feature-differences-between-change-data-capture-and-change-tracking)

## Change data capture

To understand the details of how this feature works, see [About change data capture](/sql/relational-databases/track-changes/about-change-data-capture-sql-server).

To understand how to enable or disable this feature, see [Enable and disable change data capture](/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server).

To administer and monitor this feature, see [Administer and monitor change data capture](/sql/relational-databases/track-changes/administer-and-monitor-change-data-capture-sql-server).

To understand how to query and work with the changed data, see [Work with change data](/sql/relational-databases/track-changes/work-with-change-data-sql-server).

> [!NOTE]  
> Change Data Capture functions which are dependent on CLR aren't supported on Azure SQL Edge.

## Change tracking

To understand the details of how this feature works, see [About change tracking](/sql/relational-databases/track-changes/about-change-tracking-sql-server).

To understand how to enable or disable this feature, see [Enable and disable change tracking](/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server).

To administer, monitor, and manage this feature, see [Administer and monitor change tracking](/sql/relational-databases/track-changes/manage-change-tracking-sql-server).

To understand how to query and work with the changed data, see [Work with change data](/sql/relational-databases/track-changes/work-with-change-tracking-sql-server).

## Temporal tables

Azure SQL Edge also supports the temporal tables feature of SQL Server. This feature (also known as *system-versioned temporal tables*) brings built-in support for providing information about data stored in the table at any point in time. The feature provides more than just the data that is correct at the current moment in time.

A system-versioned temporal table is a type of user table designed to keep a full history of data changes, and to allow easy point-in-time analysis. This type of temporal table is referred to as a system-versioned temporal table, because the system manages the period of validity for each row (that is, the Database Engine).

Every temporal table has two explicitly defined columns, each with a **datetime2** data type. These columns are referred to as *period* columns. The system uses these period columns exclusively, to record the period of validity for each row whenever a row is modified.

In addition to these period columns, a temporal table also contains a reference to another table with a mirrored schema. The system uses this table to automatically store the previous version of the row each time a row in the temporal table gets updated or deleted. This additional table is referred to as the *history* table, while the main table that stores current (actual) row versions is referred to as the *current* table, or simply as the temporal table. During temporal table creation, users can specify an existing history table (it must be compliant with the schema), or let the system create the default history table.

For more information, see [Temporal tables](/sql/relational-databases/tables/temporal-tables).

## Next steps

- [Data streaming in Azure SQL Edge](stream-data.md)
- [Machine learning and AI with ONNX in Azure SQL Edge](onnx-overview.md)
- [Configure replication to Azure SQL Edge](configure-replication.md)
- [Backup and restore databases in Azure SQL Edge](backup-restore.md)
