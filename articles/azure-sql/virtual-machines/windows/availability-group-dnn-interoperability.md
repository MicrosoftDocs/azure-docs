---
title: Feature interoperability with availability groups and DNN listener
description: "Learn about the additional considerations when working with certain SQL Server features and a distributed network name (DNN) listener with an Always On availability group on SQL Server on Azure VMs. " 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management
ms.service: virtual-machines-sql
ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "10/08/2020"
ms.author: mathoma

---

# Feature interoperability with AG and DNN listener
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

There are certain SQL Server features that rely on a hard-coded virtual network name (VNN). As such, when using the distributed network name (DNN) listener with your Always On availability group and SQL Server on Azure VMs, there are some additional considerations. 

This article details SQL Server features and interoperability with the availability group DNN listener. 


## Client drivers

For ODBC, OLEDB, ADO.NET, JDBC, PHP, and Node.js drivers, users need to explicitly specify the DNN listener name and port as the server name in the connection string. To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string if the SQL client supports it. 

## Tools

Users of [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms), [sqlcmd](/sql/tools/sqlcmd-utility), [Azure Data Studio](/sql/azure-data-studio/what-is), and [SQL Server Data Tools](/sql/ssdt/sql-server-data-tools) need to explicitly specify the DNN listener name as the server name in the connection string to connect to the listener. 

## Availability groups and FCI

You can configure an Always On availability group by using a failover cluster instance (FCI) as one of the replicas. For this configuration to work with the DNN listener, the failover cluster instance must also use the DNN as there is no way to put the FCI virtual IP address in the AG DNN IP list. 

In this configuration, the mirroring endpoint URL for the FCI replica needs to use the FCI DNN. Likewise, if the FCI is used as a read-only replica, the read-only routing to the FCI replica needs to use the FCI DNN. 

The format for the mirroring endpoint is: `ENDPOINT_URL = 'TCP://<FCI DNN DNS name>:<mirroring endpoint port>'`. 

For example, if your FCI DNN DNS name is `dnnlsnr`, and `5022` is the port of the FCI's mirroring endpoint, the Transact-SQL (T-SQL) code snippet to create the endpoint URL looks like: 

```sql
ENDPOINT_URL = 'TCP://dnnlsnr:5022'
```

Likewise, the format for the read-only routing URL is: `TCP://<FCI DNN DNS name>:<SQL Server instance port>`. 

For example, if your DNN DNS name is `dnnlsnr`, and `1444` is the port used by the read-only target SQL Server FCI, the T-SQL code snippet to create the read-only routing URL looks like: 

```sql
READ_ONLY_ROUTING_URL = 'TCP://dnnlsnr:1444'
```

You can omit the port in the URL if it is the default 1433 port. For a named instance, configure a static port for the named instance and specify it in the read-only routing URL.  

## Distributed availability group

Distributed availability groups are not currently supported with the DNN listener. 



## Replication

Transactional, Merge and Snapshot replication all support replacing the VNN listener with the DNN listener in replication objects that connect to the listener. 

Use the default port 1433 if the Subscriber is an availability group database or the distributor is an availability group database. 

It may be necessary to change the SQL Server agent account to a SQL Server account with necessary priviliges. 

For more information on how to use replication with availability groups, see [Publisher and AG](/sql/database-engine/availability-groups/windows/configure-replication-for-always-on-availability-groups-sql-server), [Subscriber and AG](/sql/database-engine/availability-groups/windows/replication-subscribers-and-always-on-availability-groups-sql-server), and [Distributor and AG](/sql/relational-databases/replication/configure-distribution-availability-group)


## MSDTC

The FCI can participate in distributed transactions coordinated by Microsoft Distributed Transaction Coordinator (MSDTC). Though both clustered MSDTC and local MSDTC are supported with FCI DNN, in Azure, a load balancer is still necessary for clustered MSDTC. The DNN defined in the FCI does not replace the Azure Load Balancer requirement for the clustered MSDTC in Azure. 

## FileStream

Though FileStream is supported for a database in an FCI, accessing FileStream or FileTable by using File System APIs with DNN is not supported. 

## Linked servers

Using a linked server with an FCI DNN is supported. Either use the DNN directly to configure a linked server, or use a network alias to map the VNN to the DNN. 


For example, to create a linked server with DNN DNS name `dnnlsnr` for named instance `insta1`, use the following Transact-SQL (T-SQL) command:

```sql
USE [master]   
GO   

EXEC master.dbo.sp_addlinkedserver    
    @server = N'dnnlsnr\inst1',    
    @srvproduct=N'SQL Server' ;   
GO 
```

Alternatively, you can create the linked server using the virtual network name (VNN) instead, but you will then need to define a network alias to map the VNN to the DNN. 

For example, for instance name `insta1`, VNN name `vnnname`, and DNN name `dnnlsnr`, use the following Transact-SQL (T-SQL) command to create a linked server using the VNN:

```sql
USE [master]
GO   

EXEC master.dbo.sp_addlinkedserver   
    @server = N'vnnname\inst1',    
    @srvproduct=N'SQL Server' ;   
GO 

```

Then, create a network alias to map `vnnname\insta1` to `dnnlsnr\insta1`. 



## Frequently asked questions


- Which SQL Server version brings DNN support? 

   SQL Server 2019 CU2 and later.

- What is the expected failover time when DNN is used?

   For DNN, the failover time will be just the FCI failover time, without any time added (like probe time when you're using Azure Load Balancer).

- Is there any version requirement for SQL clients to support DNN with OLEDB and ODBC?

   We recommend `MultiSubnetFailover=True` connection string support for DNN. It's available starting with SQL Server 2012 (11.x).

- Are any SQL Server configuration changes required for me to use DNN? 

   SQL Server does not require any configuration change to use DNN, but some SQL Server features might require more consideration. 

- Does DNN support multiple-subnet clusters?

   Yes. The cluster binds the DNN in DNS with the physical IP addresses of all nodes in the cluster regardless of the subnet. The SQL client tries all IP addresses of the DNS name regardless of the subnet. 



## Next steps

For more information, see: 

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [SQL Server failover cluster instances](/sql/sql-server/failover-clusters/windows/always-on-failover-cluster-instances-sql-server)

