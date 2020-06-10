---
title: Tracking data changes in Azure SQL Edge (Preview)
description: Learn about change tracking and change data capture in Azure SQL Edge (Preview)
keywords:
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Tracking Data Changes in Azure SQL Edge (Preview)

Azure SQL Edge supports the two SQL Server features that track changes to data in a database:[Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/track-data-changes-sql-server#Tracking) and [Change Data Capture](https://docs.microsoft.com/sql/relational-databases/track-changes/track-data-changes-sql-server#Capture). These features enable applications to determine the DML changes (insert, update, and delete operations) that were made to user tables in a database. Change data capture and change tracking can be enabled on the same database; no special considerations are required.

The ability to query for data that has changed in a database is an important requirement for some applications to be efficient. Typically, to determine data changes, application developers must implement a custom tracking method in their applications by using a combination of triggers, timestamp columns, and additional tables. Creating these applications usually involves a lot of work to implement, leads to schema updates, and often carries a high performance overhead. In the case of IoT solution, where there is a need to periodically move data from the edge to a cloud or data center, change tracking can be very useful. This would allow used to quickly and effective query only the delta changes from the last sync and upload those changes to the cloud or data center target. For additional details on the benefits of using Change Tracking and Change Data Capture, refer [Benefits of Using Change Data Capture or Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/track-data-changes-sql-server#benefits-of-using-change-data-capture-or-change-tracking). 

To understand the feature differences between Change Tracking and Change Data Capture, refer [Feature Differences Between Change Data Capture and Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/track-data-changes-sql-server#feature-differences-between-change-data-capture-and-change-tracking)

## Change Data Capture

To understand the details of how Change Data Capture works, refer [About Change Data Capture](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-data-capture-sql-server).

To understand how to enable or disable Change Data Capture, refer [Enable and Disable Change Data Capture](https://docs.microsoft.com/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server)

To administer and monitor Change Data Capture, refer [Administer and Monitor Change Data Capture](https://docs.microsoft.com/sql/relational-databases/track-changes/administer-and-monitor-change-data-capture-sql-server)

To understand how to query and work with the changed data, refer [Work with Change Data](https://docs.microsoft.com/sql/relational-databases/track-changes/work-with-change-data-sql-server)

## Change Tracking

To understand the details of how Change Tracking works, refer [About Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/about-change-tracking-sql-server).

To understand how to enable or disable Change Tracking, refer [Enable and Disable Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/enable-and-disable-change-tracking-sql-server)

To administer, monitor and manage Change Tracking, refer [Administer and Monitor Change Tracking](https://docs.microsoft.com/sql/relational-databases/track-changes/manage-change-tracking-sql-server)

To understand how to query and work with the changed data, refer [Work with Change Data](https://docs.microsoft.com/sql/relational-databases/track-changes/work-with-change-tracking-sql-server)

## Temporal Tables

In addition to supporting Change Tracking and Change Data Capture features of SQL Server, Azure SQL Edge also supports the Temporal Tables feature of SQL Server. Temporal tables (also known as system-versioned temporal tables) as a database feature that brings built-in support for providing information about data stored in the table at any point in time rather than only the data that is correct at the current moment in time.

A system-versioned temporal table is a type of user table designed to keep a full history of data changes and allow easy point in time analysis. This type of temporal table is referred to as a system-versioned temporal table because the period of validity for each row is managed by the system (that is, database engine).

Every temporal table has two explicitly defined columns, each with a datetime2 data type. These columns are referred to as period columns. These period columns are used exclusively by the system to record period of validity for each row whenever a row is modified.

In addition to these period columns, a temporal table also contains a reference to another table with a mirrored schema. The system uses this table to automatically store the previous version of the row each time a row in the temporal table gets updated or deleted. This additional table is referred to as the history table, while the main table that stores current (actual) row versions is referred to as the current table or simply as the temporal table. During temporal table creation users can specify existing history table (must be schema compliant) or let system create default history table.

For more information on Temporal Tables, refer [Temporal tables](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables)

## See Also

- [Data Streaming in Azure SQL Edge (Preview) ](stream-data.md)
- [Machine learning and AI with ONNX in Azure SQL Edge (Preview) ](onnx-overview.md)
- [Configure replication to Azure SQL Edge (Preview) ](configure-replication.md)
- [Backup and Restore databases in Azure SQL Edge (Preview)](backup-restore.md)



