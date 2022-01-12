---
title: Use distributed AG to migrate availability group
titleSuffix: SQL Server on Azure VMs
description: Learn to use a distributed availability group (AG) to migrate a database (or multiple databases) from a source SQL Server Always On availability group to a target SQL Server on Azure VM. 
ms.service: virtual-machines-sql
ms.subservice: migration-guide
author: MashaMSFT
ms.topic: how-to
ms.date: 12/15/2021
ms.author: mathoma
---
# Use distributed AG to migrate availability group

Use a [distributed availability group (AG)](/sql/database-engine/availability-groups/windows/distributed-availability-groups) to migrate databases in an Always On availability group while maintaining high availability and disaster recovery (HADR) support post migration on your SQL Server on Azure Virtual Machines (VMs). 

Once you've validated your source SQL Server instances meet the [prerequisites](sql-server-distributed-availability-group-migrate-prerequisites.md), follow the steps in this article to create a distributed availability between your existing availability group, and your target availability group on your SQL Server on Azure VMs. 

This article is intended for databases participating in an availability group, and requires a Windows Server Failover Cluster (WSFC) and an availability group listener. It's also possible to [migrate databases from a standalone SQL Server instance](sql-server-distributed-availability-group-migrate-standalone-instance.md). 

:::image type="content" source="media/sql-server-distributed-availability-group-migrate-ag/migrate-availability-group-with-dag.png" alt-text="Diagram explaining availability group migration using a distributed availability group":::

## Initial setup

The first step is to create your SQL Server VMs in Azure. You can do so by using the [Azure portal](../../virtual-machines/windows/sql-vm-create-portal-quickstart.md), [Azure PowerShell](../../virtual-machines/windows/sql-vm-create-powershell-quickstart.md), or an [ARM template](../../virtual-machines/windows/create-sql-vm-resource-manager-template.md). 

Be sure to configure your SQL Server VMs according to the [prerequisites](sql-server-distributed-availability-group-migrate-prerequisites.md). Choose between a single subnet deployment, which relies on an Azure Load Balancer or distributed network name to route traffic to  your availability group listener, or a multi-subnet deployment which does not have such a requirement. The multi-subnet deployment is recommended. To learn more, see [connectivity](../../virtual-machines/windows/availability-group-overview.md#connectivity). 

For simplicity, join your target SQL Server VMs to the same domain as your source SQL Server instances. Otherwise, join your target SQL Server VM to a domain that's federated with the domain of your source SQL Server instances. 

To use automatic seeding to create your distributed availability group (DAG), the instance name for the global primary (source) of the DAG must match the instance name of the forwarder (target) of the DAG. If there is an instance name mismatch between the global primary and forwarder, then you must use manual seeding to create the DAG, and manually add any additional database files in the future.

This article uses the following example parameters:

- Database name: **Adventureworks**
- Source machine names : **OnPremNode1** (global primary in DAG), **OnPremNode2** 
- Source SQL Server instance names: **MSSQLSERVER**, **MSSQLSERVER**
- Source availability group name : **OnPremAg**
- Source availability group listener name: **OnPremAG_LST**
- Target SQL Server VM names: **SQLVM1** (forwarder in DAG), **SQLVM2** 
- Target SQL Server on Azure VM instance names: **MSSQLSERVER**, **MSSQLSERVER**
- Target availability group name: **AzureAG**
- Source availability group listener name: **AzureAG_LST**
- Endpoint name: **Hadr_endpoint**
- Distributed availability group name: **DAG**
- Domain name: **Contoso** 

## Create endpoints

Use Transact-SQL (T-SQL) to create endpoints on both your two source instances (**OnPremNode1**, **OnPremNode2**) and target SQL Server instances (**SQLVM1**, **SQLVM2**). 

If you already have an availability group configured on the source instances, only run this script on the two target instances. 

To create your endpoints, run this T-SQL script on both source and target servers: 

```sql
CREATE ENDPOINT [Hadr_endpoint]  
   STATE=STARTED 
   AS TCP (LISTENER_PORT = 5022, LISTENER_IP = ALL) 
FOR DATA_MIRRORING ( 
   ROLE = ALL,  
   AUTHENTICATION = WINDOWS NEGOTIATE, 
   ENCRYPTION = REQUIRED ALGORITHM AES 
) 
GO 
```

Domain accounts automatically have access to endpoints, but service accounts may not automatically be part of the sysadmin group and may not have connect permission. To manually grant the SQL Server service account connect permission to the endpoint, run the following T-SQL script on both servers: 

```sql
GRANT CONNECT ON ENDPOINT::[Hadr_endpoint] TO [<your account>] 
```

## Create source AG

Since a distributed availability group is a special availability group that spans across two individual availability groups, you first need to create an availability group on the two source SQL Server instances. 

If you already have an availability group on your source instances, skip this section. 

Use Transact-SQL (T-SQL) to create an availability group (**OnPremAG**) between your two source instances (**OnPremNode1**, **OnPremNode2**) for the example **Adventureworks** database. 

To create the availability group on the source instances, run this script on the source primary replica (**OnPremNode1**): 

```sql
CREATE AVAILABILITY GROUP [OnPremAG]  
WITH ( AUTOMATED_BACKUP_PREFERENCE = PRIMARY, 
    DB_FAILOVER = OFF,  
    DTC_SUPPORT = NONE,  
FOR DATABASE  [Adventureworks]  
REPLICA ON  
    N'OnPremNode1' WITH (ENDPOINT_URL = N'TCP://OnPremNode1.contoso.com:5022',  
    FAILOVER_MODE = AUTOMATIC, 
    AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,  
    SEEDING_MODE = AUTOMATIC,  
    SECONDARY_ROLE(ALLOW_CONNECTIONS = NO)),   
    N'OnPremNode2' WITH (ENDPOINT_URL = N'TCP://OnPremNode2.contoso.com:5022',  
    FAILOVER_MODE = AUTOMATIC,  
    AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,  
    SEEDING_MODE = AUTOMATIC,  
    SECONDARY_ROLE(ALLOW_CONNECTIONS = NO));	 
```

Next, to join the secondary replica (**OnPremNode2**) to the availability group (**OnPremAg**). 

To join the availability group, run this script on the source secondary replica: 

```sql
ALTER AVAILABILITY GROUP [OnPremAG] JOIN; 
GO 
ALTER AVAILABILITY GROUP [OnPremAG] GRANT CREATE ANY DATABASE; 
GO 
```

Finally, create the listener for your global forwarder availability group (**OnPremAG**). 

To create the listener, run this script on the source primary replica: 

```sql
USE [master] 
GO 
ALTER AVAILABILITY GROUP [OnPremAG] 
ADD LISTENER N'OnPremAG_LST' ( 
WITH IP ((<available static ip>, <mask>) 
, PORT=60173); 
GO

```


## Create target AG

You also need to create an availability group on the target SQL Server VMs as well. 

If you already have an availability group configured between your SQL Server instances in Azure, skip this section. 

Use Transact-SQL (T-SQL) to create an availability group (**AzureAG**) on the target SQL Server instances (**SQLVM1** and **SQLVM2**). 

To create the availability group on the target, run this script on the target primary replica: 

```sql
CREATE AVAILABILITY GROUP [AzureAG]
FOR
   REPLICA ON N'SQLVM1' WITH (ENDPOINT_URL = N'TCP://SQLVM1.contoso.com:5022',
   FAILOVER_MODE = MANUAL,
   AVAILABILITY_MODE = SYNCHRONOUS_COMMIT, 
   BACKUP_PRIORITY = 50,
   SECONDARY_ROLE(ALLOW_CONNECTIONS = NO),
   SEEDING_MODE = AUTOMATIC),    
N'SQLVM2' WITH (ENDPOINT_URL = N'TCP://SQLVM2.contoso.com:5022',    
   FAILOVER_MODE = MANUAL,    
   AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,    
   BACKUP_PRIORITY = 50,    
   SECONDARY_ROLE(ALLOW_CONNECTIONS = NO),    
   SEEDING_MODE = AUTOMATIC);   
GO 
```

Next, join the target secondary replica (**SQLVM2**) to the availability group (**AzureAG**). 

Run this script on the target secondary replica: 

```sql
ALTER AVAILABILITY GROUP [AzureAG]   JOIN; 
GO 
ALTER AVAILABILITY GROUP [AzureAG]   GRANT CREATE ANY DATABASE; 
GO 
```

Finally, create a listener (**AzureAG_LST**) for your target availability group (**AzureAG**). If you deployed your SQL Server VMs to multiple subnets, create your listener using Transact-SQL. If you deployed your SQL Server VMs to a single subnet, configure either an [Azure Load Balancer](../../virtual-machines/windows/availability-group-vnn-azure-load-balancer-configure.md), or a [distributed network name](../../virtual-machines/windows/availability-group-distributed-network-name-dnn-listener-configure.md) for your listener. 

To create your listener, run this script on the primary replica of the availability group in Azure. 

```sql
ALTER AVAILABILITY GROUP [AzureAG]
ADD LISTENER N'AzureAG_LST' (
WITH IP
( (N'<primary replica's secondary ip >', N'<primary mask>'), (N'<secondary replica's secondary ip>', N'<secondary mask>') )
, PORT=<port number you set>);
GO
```



## Create distributed AG 

After you have your source (**OnPremAG**) and target (**AzureAG**) availability groups configured, create your distributed availability group to span both individual availability groups. 

Use Transact-SQL on the source SQL Server global primary (**OnPremNode1**) and AG (**OnPremAG**) to create the distributed availability group (**DAG**). 

To create the distributed AG on the source, run this script on the source global primary: 

```sql
CREATE AVAILABILITY GROUP [DAG]  
 		  WITH (DISTRIBUTED)    
  		 AVAILABILITY GROUP ON  
  'OnPremAG' WITH   
  (		 
 LISTENER_URL = 'tcp://OnPremAG_LST.contoso.com:5022',   
 AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,   
 FAILOVER_MODE = MANUAL,    
 SEEDING_MODE = AUTOMATIC    
  ),    
  'AzureAG' WITH   
  (    
 LISTENER_URL = 'tcp://AzureAG_LST.contoso.com:5022', 
 AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,  
 FAILOVER_MODE = MANUAL,    
 SEEDING_MODE = AUTOMATIC    
  );     
GO 

```

>[!NOTE]
> The seeding mode is set to `AUTOMATIC` as the version of SQL Server on the target and source is the same. If your SQL Server target is a higher version, or if your global primary and forwarder have different instance names, then create the distributed ag, and join the secondary AG to the distributed ag with **SEEDING_MODE** set to `MANUAL`. Then manually restore your databases from the source to the target SQL Server instance. Review [upgrading versions during migration](/sql/database-engine/availability-groups/windows/distributed-availability-groups#cautions-when-using-distributed-availability-groups-to-migrate-to-higher-sql-server-versions) to learn more. 

After your distributed AG is created, join the target AG (**AzureAG**) on the target forwarder instance (**SQLVM1**) to the distributed AG (**DAG**). 

To join the target AG to the distributed AG, run this script on the target forwarder: 

```sql
ALTER AVAILABILITY GROUP [DAG]  
   JOIN    
   		AVAILABILITY GROUP ON   
  'OnPremAG' WITH     
 	 (    
 LISTENER_URL = 'tcp://OnPremAG_LST.contoso.com:5022',  
 AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT, 
 FAILOVER_MODE = MANUAL, 
 SEEDING_MODE = AUTOMATIC  
  ),    
  'AzureAG' WITH    
 	 (    
 LISTENER_URL = 'tcp://AzureAG_LST.contoso.com:5022',    
 AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,    
 FAILOVER_MODE = MANUAL,    
 SEEDING_MODE = AUTOMATIC    
  );     
GO    
```

If you need to cancel, pause, or delay synchronization between the source and target availability groups (such as, for example, performance issues), run this script on the source global primary instance (**OnPremNode1**): 

```sql
ALTER AVAILABILITY GROUP [DAG] 
   MODIFY  
   AVAILABILITY GROUP ON   
   'AzureAG' WITH 
   (  SEEDING_MODE = MANUAL  );  
```

To learn more, review [cancel automatic seeding to forwarder](/sql/database-engine/availability-groups/windows/configure-distributed-availability-groups#cancel-automatic-seeding-to-forwarder). 

## Next steps

After your distributed availability group is created, you are ready to [complete the migration](sql-server-distributed-availability-group-complete-migration.md). 
