---
title: Supported features of Azure SQL Edge
description: Learn about details of features supported by Azure SQL Edge.
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - introduction to SQL Edge
  - what is SQL Edge
  - SQL Edge overview
---
# Supported features of Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

Azure SQL Edge is built on the latest version of the SQL Database Engine. It supports a subset of the features supported in SQL Server 2022 on Linux, in addition to some features that are currently not supported or available in SQL Server 2022 on Linux (or in SQL Server on Windows).

For a complete list of the features supported in SQL Server on Linux, see [Editions and supported features of SQL Server 2022 on Linux](/sql/linux/sql-server-linux-editions-and-components-2022). For editions and supported features of SQL Server on Windows, see [Editions and supported features of SQL Server 2022 (16.x)](/sql/sql-server/editions-and-components-of-sql-server-2022).

## Azure SQL Edge editions

Azure SQL Edge is available with two different editions or software plans. These editions have identical feature sets, and only differ in terms of their usage rights and the amount of memory and cores they can access on the host system.

| Plan | Description |
| --- | --- |
| Azure SQL Edge Developer | For development only. Each Azure SQL Edge Developer container is limited to a maximum of 4 cores and 32 GB of RAM. |
| Azure SQL Edge | For production. Each Azure SQL Edge container is limited to a maximum of 8 cores and 64 GB of RAM. |

## Operating system

Azure SQL Edge containers are based on Ubuntu 18.04, and as such are only supported to run on Docker hosts running either Ubuntu 18.04 LTS (recommended) or Ubuntu 20.04 LTS. It's possible to run Azure SQL Edge containers on other operating system hosts, for example, it can run on other distributions of Linux or on Windows (using Docker CE or Docker EE), however Microsoft doesn't recommend that you do this, as this configuration may not be extensively tested.

The recommended configuration for running Azure SQL Edge on Windows is to configure an Ubuntu VM on the Windows host, and then run Azure SQL Edge inside the Linux VM.

The recommended and supported file system for Azure SQL Edge is EXT4 and XFS. If persistent volumes are being used to back the Azure SQL Edge database storage, then the underlying host file system needs to be EXT4 and XFS.

## Hardware support

Azure SQL Edge requires an x86 64-bit processor, with a minimum of 1 CPU core, and 1 GB of RAM on the host. While the startup memory footprint of Azure SQL Edge is close to 450 MB, the additional memory is needed for other IoT Edge modules or processes running on the edge device. The actual memory and CPU requirements for Azure SQL Edge will vary based on the complexity of the workload and volume of data being processed. When you choose hardware for your solution, Microsoft recommends that you run extensive performance tests to ensure that the required performance characteristics for your solution are met.

## Azure SQL Edge components

Azure SQL Edge only supports the Database Engine. It doesn't include support for other components available with SQL Server 2022 on Windows or with SQL Server 2022 on Linux. Specifically, Azure SQL Edge doesn't support SQL Server components like Analysis Services, Reporting Services, Integration Services, Master Data Services, Machine Learning Services (In-Database), and Machine Learning Server (standalone).

## Supported features

In addition to supporting a subset of features of SQL Server on Linux, Azure SQL Edge includes support for the following new features:

- SQL streaming, which is based on the same engine that powers Azure Stream Analytics, provides real-time data streaming capabilities in Azure SQL Edge.
- The T-SQL function call `DATE_BUCKET` for Time-Series data analytics.
- Machine learning capabilities through the ONNX runtime, included with the SQL Database Engine.

## Unsupported features

The following list includes the SQL Server 2022 on Linux features that aren't currently supported in Azure SQL Edge.

| Area | Unsupported feature or service |
| --- | --- |
| **Database Design** | In-memory OLTP, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | **HierarchyID** data type, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | **Spatial** data type, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | Stretch DB, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | Full-text indexes and search, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | FileTable, FILESTREAM, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| **Database Engine** | Replication. You can configure Azure SQL Edge as a push subscriber of a replication topology. |
| | PolyBase. You can configure Azure SQL Edge as a target for external tables in PolyBase. |
| | Language extensibility through Java and Spark |
| | Active Directory integration |
| | Database Auto Shrink. The Auto shrink property for a database can be set using the `ALTER DATABASE <database_name> SET AUTO_SHRINK ON` command, however that change has no effect. The automatic shrink task won't run against the database. Users can still shrink the database files using the `DBCC` commands. |
| | Database snapshots |
| | Support for persistent memory |
| | Microsoft Distributed Transaction Coordinator |
| | Resource governor and IO resource governance |
| | Buffer pool extension |
| | Distributed query with third-party connections |
| | Linked servers |
| | System extended stored procedures (such as `xp_cmdshell`). |
| | CLR assemblies, and related DDL commands and Transact-SQL functions, catalog views, and dynamic management views |
| | CLR-dependent T-SQL functions, such as `ASSEMBLYPROPERTY`, `FORMAT`, `PARSE`, and `TRY_PARSE` |
| | CLR-dependent date and time catalog views, functions, and query clauses |
| | Buffer pool extension |
| | Database mail |
| | Service Broker |
| | Policy Based Management |
| | Management Data Warehouse |
| | Contained Databases |
| | S3-compatible object storage integration |
| | Microsoft Entra authentication |
| | Buffer pool parallel scan |
| | Hybrid buffer pool with direct write |
| | Concurrent updates to global allocation map (GAM) pages and shared global allocation map (SGAM) pages |
| | Integrated acceleration & offloading (Intel QAT) |
| | Intelligent Query Processing:<br /><br />- Parameter sensitive plan optimization<br />- Degree of Parallelism (DOP) feedback<br />- Optimized plan forcing<br />- Query Store Hints |
| | Language:<br /><br />- `SELECT ... WINDOW` clause<br />- `IS [NOT] DISTINCT FROM`<br />- JSON function enhancements (`ISJSON()`, `JSON_PATH_EXISTS()`, `JSON_OBJECT()`, `JSON_ARRAY()`)<br />- `LTRIM()` / `RTRIM()` enhancements<br />- `DATETRUNC()`<br />- Resumable add table constraints |
| **SQL Server Agent** | Subsystems: CmdExec, PowerShell, Queue Reader, SSIS, SSAS, and SSRS |
| | Alerts |
| | Managed backup |
| **High Availability** | Always On availability groups |
| | Basic availability groups |
| | Always On failover cluster instance |
| | Database mirroring |
| | Hot add memory and CPU |
| | Managed Instance link |
| | Contained Availability Groups |
| **Security** | Extensible key management |
| | Active Directory integration |
| | Support for secure enclaves |
| | Microsoft Defender for Cloud integration |
| | Microsoft Purview integration |
| | Ledger |
| **Services** | SQL Server Browser |
| | Machine Learning through R and Python |
| | StreamInsight |
| | Analysis Services |
| | Reporting Services |
| | Data Quality Services |
| | Master Data Services |
| | Distributed Replay |
| **Manageability** | SQL Server Utility Control Point |

## Next steps

- [Deploy Azure SQL Edge](deploy-portal.md)
- [Configure Azure SQL Edge](configure.md)
- [Connect to an instance of Azure SQL Edge using SQL Server client tools](connect.md)
- [Backup and restore databases in Azure SQL Edge](backup-restore.md)
