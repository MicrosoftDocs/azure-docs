---
title: Azure SQL Database Managed Instance T-SQL Differences | Microsoft Docs
description: This article discusses the T-SQL differences between Azure SQL Database Managed Instance and SQL Server.
author: CarlRabeler
editor: 
ms.service: sql-database
ms.custom:
ms.devlang: 
ms.topic: article
ms.workload: "Active"
ms.date: 02/28/2018
ms.author: carlrab
manager: cguyer
---

# Azure SQL Database Managed Instance T-SQL differences from SQL Server

## Auditing

- TO URL - new syntax
- TO FILE - not supported

See [Auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine)    

## Backup and restore

- Restore
 - Syntax 
    - RESTORE DATABASE - supported
    - RESTORE HEADER ONLY - supported
    - RESTORE FILELISTONLY ONLY - supported
    - RESTORE VERIFYONLY ONLY - supported
    - RESTORE LABELONLY ONLY - supported
    - RESTORE LOG ONLY - not supported
    - RESTORE REWINDONLY ONLY - not supported
 - Source 
  - FROM URL (Azure blob storage) - supported
  - FROM DISK?TAPE/backup device - not supported
  - Backup sets - not supported
 - WITH options are not supported (No differential, STATS, etc.)    
 - ASYNC RESTORE - RESTORE continues even if client connection breaks. If customer loses connection, he/she can check sys.dm_operation_status view for the status of a restore operation (as well as CREATE and DROP database) 
- Service master key [backup](https://docs.microsoft.com/sql/t-sql/statements/backup-service-master-key-transact-sql)/[restore](https://docs.microsoft.com/sql/t-sql/statements/restore-service-master-key-transact-sql) - not supported (managed by SQL Database service)
- Master key [backup](https://docs.microsoft.com/en-us/sql/t-sql/statements/backup-master-key-transact-sql)/[restore](https://docs.microsoft.com/en-us/sql/t-sql/statements/restore-master-key-transact-sql) - not supported (managed by SQL Database service)

## Buffer pool extension

Buffer pool extension - not supported
- 

## Credential

Identity 
- Azure Key vault - supported
- SHARED ACCESS SIGNATURE - supported
- Windows user - not supported

See [CREATE CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/create-credential-transact-sql) and [ALTER CREDENTIAL](https://docs.microsoft.com/sql/t-sql/statements/alter-credential-transact-sql) 

## CLR

## Create database / alter database

- Multiple log files - not supported
- In-memory objects - not supported in General Purpose service tier

## DBCC

- [DBCC TRACESTATUS](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-tracestatus-transact-sql) - Supported
 - [Trace Flags (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql) – not supported 
 - [DBCC TRACEOFF](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceoff-transact-sql) – not supported
 - [DBCC TRACEON](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql) – not supported



## Extended Events

- [event_counter target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#eventcounter-target) - supported
- [histogram target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#histogram-target) - supported
- [ring_buffer target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#ringbuffer-target) - supported
- [pair_matching target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#pairmatching-target) - supported
- [etw_classic_sync target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#etwclassicsynctarget-target) - not supported, store xel files on Azure blob storage
- [event_file target](https://docs.microsoft.com/sql/relational-databases/extended-events/targets-for-extended-events-in-sql-server#eventfile-target) - not supported, store xel files on Azure blob storage

## File groups

File stream data - not supported

## Linked servers

Targets:
- Supported targets: SQL Server, SQL Database Managed Instance, SQL Server on a virtual machine
- Not supported targets: files, Analysis Services, other RDBMS
[sp_dropserver](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-dropserver-transact-sql) supported for dropping a linked server

## Logins

- SQL logins FROM CERTIFICATE, FROM ASYMMETRIC KEY, FROM SID - supported 
- Windows logins - not supported, use Azure Active Directory (AAD) users can be added per database as AAD users

## Replication

Replication - not yet supported

## Service broker

## SQL Server Agent

