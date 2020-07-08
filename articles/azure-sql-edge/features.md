---
title: Supported features of Azure SQL Edge (Preview) 
description: Learn about details of features supported by Azure SQL Edge (Preview).
keywords: introduction to SQL Edge, what is SQL Edge, SQL Edge overview
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Supported features of Azure SQL Edge (Preview) 

Azure SQL Edge is built on the latest version of the Microsoft SQL Server Database Engine on Linux. It supports a subset of the features supported in SQL Server 2019 on Linux, in addition to some features that are currently not supported or available in SQL Server 2019 on Linux (or in SQL Server on Windows).

For a complete list of the features supported in SQL Server on Linux, see [Editions and supported features of SQL Server 2019 on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-editions-and-components-2019). For editions and supported features of SQL Server on Windows, see [Editions and supported features of SQL Server 2019 (15.x)](https://docs.microsoft.com/sql/sql-server/editions-and-components-of-sql-server-version-15).

> [!NOTE]
> Azure SQL Edge is currently in preview, and as such shouldn't be used in production environments. Microsoft might recommend running Azure SQL Edge in production environments, depending on validation of the deployment and your use case scenarios.

## Azure SQL Edge editions

Azure SQL Edge is available with two different editions or software plans. These editions have identical feature sets, and only differ in terms of their usage rights and the amount of memory and cores they can access on the host system.

   |**Plan**  |**Description**  |
   |---------|---------|
   |Azure SQL Edge Developer  |  For development only. Each Azure SQL Edge Developer container is limited to up to 4 cores and 32 GB memory.  |
   |Azure SQL Edge    |  For production. Each Azure SQL Edge container is limited to up to 8 cores and 64 GB memory.  |

## Operating system

Azure SQL Edge containers are currently based on Ubuntu 16.04, and as such are only supported to run on Docker hosts running either Ubuntu 16.04 (recommended) or Ubuntu 18.04. Azure SQL Edge can also run on other operating system hosts. For example, it can run on other distributions of Linux or on Windows (by using Docker CE or Docker EE). Note, however, that Microsoft hasn't extensively tested these configurations.

Azure SQL Edge is currently only supported for deployment through Azure IoT Edge. For more information, see [Azure IoT Edge supported systems](https://docs.microsoft.com/azure/iot-edge/support).

The recommended configuration for running Azure SQL Edge on Windows is to configure an Ubuntu VM on the Windows host, and then run Azure SQL Edge inside the Linux VM.

## Hardware support

Azure SQL Edge requires a 64-bit processor, which can be from Intel, AMD, or ARM, with a minimum of one processor and one GB of RAM on the host. While the startup memory footprint of Azure SQL Edge is close to 500 MB, the additional memory is needed for other IoT Edge modules running on the edge device.

## Azure SQL Edge components

Azure SQL Edge only supports the database engine. It doesn't include support for other components available with SQL Server 2019 on Windows or with SQL Server 2019 on Linux. Specifically, Azure SQL Edge doesn't support SQL Server components like Analysis Services, Reporting Services, Integration Services, Master Data Services, Machine Learning Services (In-Database), and Machine Learning Server (standalone).

## Supported features

In addition to supporting a subset of features of SQL Server on Linux, Azure SQL Edge includes support for the following new features: 

- SQL streaming, which is based on the same engine that powers Azure Stream Analytics, provides real-time data streaming capabilities in Azure SQL Edge. 
- The T-SQL function call `Date_Bucket` for Time-Series data analytics.
- Machine learning capabilities through the ONNX runtime, included with the SQL engine.

## Unsupported features

The following list includes the SQL Server 2019 on Linux features that aren't currently supported in Azure SQL Edge.

| Area | Unsupported feature or service |
|-----|-----|
| **Database Design** | In-memory OLTP, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views. |
| &nbsp; | `HierarchyID` data type, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views. |
| &nbsp; | `Spatial` data type, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views. |
| &nbsp; | Stretch DB, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views. |
| &nbsp; | Full-text indexes and search, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views.|
| &nbsp; | `FileTable`, `FILESTREAM`, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views.|
| **Database Engine** | Replication. Note that you can configure Azure SQL Edge as a push subscriber of a replication topology. |
| &nbsp; | Polybase. Note that you can configure Azure SQL Edge as a target for external tables in Polybase. |
| &nbsp; | Language extensibility through Java and Spark. |
| &nbsp; | Active Directory integration. |
| &nbsp; | Database snapshots. |
| &nbsp; | Support for persistent memory. |
| &nbsp; | Microsoft Distributed Transaction Coordinator. |
| &nbsp; | Resource governor and IO resource governance. |
| &nbsp; | Buffer pool extension. |
| &nbsp; | Distributed query with third-party connections. |
| &nbsp; | Linked servers. |
| &nbsp; | System extended stored procedures (such as `XP_CMDSHELL`). |
| &nbsp; | CLR assemblies, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views. |
| &nbsp; | CLR-dependent T-SQL functions, such as `ASSEMBLYPROPERTY`, `FORMAT`, `PARSE`, and `TRY_PARSE`. |
| &nbsp; | CLR-dependent date and time catalog views, functions, and query clauses. |
| &nbsp; | Buffer pool extension. |
| &nbsp; | Database mail. |
| **SQL Server Agent** |  Subsystems: CmdExec, PowerShell, Queue Reader, SSIS, SSAS, and SSRS. |
| &nbsp; | Alerts. |
| &nbsp; | Managed backup. |
| **High Availability** | Always On availability groups.  |
| &nbsp; | Basic availability groups. |
| &nbsp; | Always On failover cluster instance. |
| &nbsp; | Database mirroring. |
| &nbsp; | Hot add memory and CPU. |
| **Security** | Extensible key management. |
| &nbsp; | Active Directory integration.|
| &nbsp; | Support for secure enclaves.|
| **Services** | SQL Server Browser. |
| &nbsp; | Machine Learning through R and Python. |
| &nbsp; | StreamInsight. |
| &nbsp; | Analysis Services. |
| &nbsp; | Reporting Services. |
| &nbsp; | Data Quality Services. |
| &nbsp; | Master Data Services. |
| &nbsp; | Distributed Replay. |
| **Manageability** | SQL Server Utility Control Point. |

## Next steps

- [Deploy Azure SQL Edge](deploy-portal.md)
- [Configure Azure SQL Edge](configure.md)
- [Connect to an instance of Azure SQL Edge using SQL Server client tools](connect.md)
- [Backup and restore databases in Azure SQL Edge](backup-restore.md)
