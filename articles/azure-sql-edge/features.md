---
title: Supported features of Azure SQL Edge (Preview) 
description: Learn about details of features supported by Azure SQL Edge (Preview)
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

This article provides details of features supported by Azure SQL Edge. Azure SQL Edge, is built on the latest version of the Microsoft SQL Server Database Engine on Linux, and supports a subset of the features supported in SQL Server 2019 for Linux, in addition to some features that are currently not supported or available in SQL Server 2019 on Linux or on Windows. For a complete list of the features supported in SQL Server on Linux, see [Editions and supported features of SQL Server 2019 on Linux](https://docs.microsoft.com/sql/linux/sql-server-linux-editions-and-components-2019). For editions and supported features of SQL Server on Windows, refer [Editions and supported features of SQL Server 2019 (15.x)](https://docs.microsoft.com/sql/sql-server/editions-and-components-of-sql-server-version-15).

> [!NOTE]
> Azure SQL Edge is currently in (Preview) and as such should NOT be used in production environments. Microsoft may recommend running Azure SQL Edge in production environments after validation of the deployment and the use case scenarios.

## Azure SQL Edge Editions

Azure SQL Edge is available with two different editions or software plans. These editions have identical feature sets and only differ in terms of their usage rights and the amount of cpu/memory they can access on the host system.

   |**Plan**  |**Description**  |
   |---------|---------|
   |Azure SQL Edge Developer  |  Development only sku, each Azure SQL Edge Developer container is limited to up to 4 cores and 32 GB Memory  |
   |Azure SQL Edge    |  Production sku,  each Azure SQL Edge container is limited to up to 8 cores and 64 GB Memory  |

## Operating System

Azure SQL Edge containers are currently based on Ubuntu 16.04 and as such are only supported to run on docker hosts running either Ubuntu 16.04 (recommended) or Ubuntu 18.04. Azure SQL Edge can also run on other operating system hosts, for example, other distributions of Linux or on Windows (using Docker CE or Docker EE), however these configurations are not extensively tested by Microsoft.

Azure SQL Edge is currently only supported for deployment through Azure IoT Edge. For more information on the supported systems for Azure IoT Edge, refer [Azure IoT Edge supported systems](https://docs.microsoft.com/azure/iot-edge/support).

The recommended configuration for running Azure SQL Edge on Windows is to configure an Ubuntu VM on the Windows host, and then run SQL Edge inside the linux VM.

## Hardware Support

Azure SQL Edge requires a 64-bit processor, which can be from Intel, AMD or ARM, with a minimum of one processor and one GB of RAM on the host. While the startup memory footprint of Azure SQL Edge is close to 500 MB, the additional memory is needed for other IoT Edge modules running on the edge device.

## Azure SQL Edge Components

Azure SQL Edge only supports the database engine and does not include support for other components available with SQL Server 2019 on Windows or with SQL Server 2019 on Linux. Specifically, Azure SQL Edge does not support SQL Server components like Analysis Services, Reporting Services, Integration Services, Master Data Services, Machine Learning Services (In-Database) and Machine Learning Server (standalone).

## Supported Features

In addition to supporting a subset of SQL Server on Linux features, Azure SQL Edge includes support for the following new features. 

- SQL Streaming, which is based on the same engine that powers Azure Stream Analytics, provides real-time data streaming capabilities in Azure SQL Edge. 
- New T-SQL function call Date_Bucket for Time-Series data analytics.
- Machine Learning capabilities through the ONNX runtime, included with the SQL engine.

## SQL Server on Linux features not supported in Azure SQL Edge

The list below includes the SQL Server 2019 on Linux features that are currently not supported in Azure SQL Edge.

| Area | Unsupported feature or service |
|-----|-----|
| **Database Design** | In-Memory OLTP and related DDL commands and Transact-SQL functions, catalog views and dynamic management views |
| &nbsp; | HierarchyID Data Type and related DDL commands and Transact-SQL functions, catalog views and dynamic management views |
| &nbsp; | Spatial Data Type and related DDL commands and Transact-SQL functions, catalog views and dynamic management views |
| &nbsp; | Stretch DB and related DDL commands and Transact-SQL functions, catalog views and dynamic management views |
| &nbsp; | Full Text Indexes and search and related DDL commands and Transact-SQL functions, catalog views and dynamic management views|
| &nbsp; | FileTable, FILESTREAM, and related DDL commands and Transact-SQL functions, catalog views and dynamic management views|
| **Database Engine** | Replication. However Azure SQL Edge can be configured as a push subscriber of a replication topology. |
| &nbsp; | Polybase. However Azure SQL Edge can be configured as a target for External tables in Polybase |
| &nbsp; | Language extensibility through Java and Spark |
| &nbsp; | Active Directory Integration |
| &nbsp; | Database Snapshots |
| &nbsp; | Support for Persistent Memory |
| &nbsp; | Microsoft Distributed Transaction Coordinator |
| &nbsp; | Resource Governor and IO Resource Governance |
| &nbsp; | Buffer Pool Extension |
| &nbsp; | Distributed query with 3rd-party connections |
| &nbsp; | Linked Servers |
| &nbsp; | System extended stored procedures (XP_CMDSHELL, etc.) |
| &nbsp; | CLR Assemblies and related DDL commands and Transact-SQL functions, catalog views and dynamic management views |
| &nbsp; | CLR-dependent T-SQL functions like ASSEMBLYPROPERTY, FORMAT, PARSE, TRY_PARSE |
| &nbsp; | CLR-dependent date and time catalog views, functions, and query clauses |
| &nbsp; | Buffer Pool Extension |
| &nbsp; | Database Mail |
| **SQL Server Agent** |  Subsystems: CmdExec, PowerShell, Queue Reader, SSIS, SSAS, SSRS |
| &nbsp; | Alerts |
| &nbsp; | Managed Backup |
| **High Availability** | Always On Availability Groups  |
| &nbsp; | Basic Availability Groups |
| &nbsp; | Always On Failover cluster instance |
| &nbsp; | Database Mirroring |
| &nbsp; | Hot add memory and CPU |
| **Security** | Extensible Key Management |
| &nbsp; | Active directory Integration|
| &nbsp; | Support for Secure Enclaves|
| **Services** | SQL Server Browser |
| &nbsp; | Machine Learning through R and Python |
| &nbsp; | StreamInsight |
| &nbsp; | Analysis Services |
| &nbsp; | Reporting Services |
| &nbsp; | Data Quality Services |
| &nbsp; | Master Data Services |
| &nbsp; | Distributed Replay |
| **Manageability** | SQL Server Utility Control Point |

## Next Steps

- [Deploy Azure SQL Edge](deploy-portal.md)
- [Configure Azure SQL Edge](configure.md)
- [Connect to an instance of Azure SQL Edge using SQL Server client tools](connect.md)
- [Backup and Restore databases in Azure SQL Edge](backup-restore.md)
