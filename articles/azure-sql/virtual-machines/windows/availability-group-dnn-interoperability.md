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

# Feature interoperability with AG and DNN listener (Preview)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

There are certain SQL Server features that rely on a hard-coded virtual network name (VNN). As such, when using the distributed network name (DNN) listener with your Always On availability group and SQL Server on Azure VMs, there are some additional considerations. 

This article details SQL Server features and interoperability with the availability group DNN listener. 


## Client drivers

For ODBC, OLEDB, ADO.NET, JDBC, PHP, and Node.js drivers, users need to explicitly specify the DNN listener name and port as the server name in the connection string. To ensure rapid connectivity upon failover, add `MultiSubnetFailover=True` to the connection string if the SQL client supports it. 

## Tools

Users of [SQL Server Management Studio](/sql/ssms/sql-server-management-studio-ssms), [sqlcmd](/sql/tools/sqlcmd-utility), [Azure Data Studio](/sql/azure-data-studio/what-is), and [SQL Server Data Tools](/sql/ssdt/sql-server-data-tools) need to explicitly specify the DNN listener name as the server name in the connection string to connect to the listener. 

Creating the DNN listener via the SQL Server Management Studio (SSMS) GUI is currently not supported. 


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

Transactional, Merge and Snapshot Replication all support replacing the VNN listener with the DNN listener and port in replication objects that connect to the listener. 

For more information on how to use replication with availability groups, see [Publisher and AG](/sql/database-engine/availability-groups/windows/configure-replication-for-always-on-availability-groups-sql-server), [Subscriber and AG](/sql/database-engine/availability-groups/windows/replication-subscribers-and-always-on-availability-groups-sql-server), and [Distributor and AG](/sql/relational-databases/replication/configure-distribution-availability-group).

## MSDTC

Both local and clustered MSDTC is supported but MSDTC uses a dynamic port, which requires a standard Azure Load Balancer to configure the HA port. As such, either the VM must use a standard IP reservation, or it cannot be exposed to the internet. 

Define two rules, one for the RPC Endpoint Mapper port 135, and one for the real MSDTC port. After failover, modify the LB rule to the new MSDTC port after it changes on the new node. 

If the MSDTC is local, be sure to allow outbound communication. 

## Distributed query 

Distributed query relies on a linked server, which can be configured using the AG DNN listener and port. If the port is not 1433, choose the **Use other data source** option in SQL Server Management Studio (SSMS) when configuring your linked server. 

## FileStream

Filestream is supported but not for scenarios where users access the scoped file share by using the Windows File API. 

## Filetable

Filetable is supported but not for scenarios where users access the scoped file share by using the Windows File API. 

## Linked servers

Configure the linked server using the AG DNN listener name and port. If the port is not 1433, choose the **Use other data source** option in SQL Server Management Studio (SSMS) when configuring your linked server. 


## Frequently asked questions


- Which SQL Server version brings AG DNN listener support? 

   SQL Server 2019 CU8 and later.

- What is the expected failover time when the DNN listener is used?

   For DNN listener, the failover time will be just the AG failover time, without any additional time (like probe time when you're using Azure Load Balancer).

- Is there any version requirement for SQL clients to support DNN with OLEDB and ODBC?

   We recommend `MultiSubnetFailover=True` connection string support for DNN listener. It's available starting with SQL Server 2012 (11.x).

- Are any SQL Server configuration changes required for me to use the DNN listener? 

   SQL Server does not require any configuration change to use DNN, but some SQL Server features might require more consideration. 

- Does DNN support multiple-subnet clusters?

   Yes. The cluster binds the DNN in DNS with the physical IP addresses of all replicas in the availability regardless of the subnet. The SQL client tries all IP addresses of the DNS name regardless of the subnet. 



## Next steps

For more information, see: 

- [Windows cluster technologies](/windows-server/failover-clustering/failover-clustering-overview)   
- [Always on availability group](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)

