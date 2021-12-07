---
title: Use distributed AG to migrate availability group
description: Learn to use a distributed availability group (AG) to migrate a database (or multiple databases) from a single instance of SQL Server to a target SQL Server on Azure VM. 
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

This article is intended for databases participating in an availability group, and requires a Windows Server Failover Cluster (WSFC) and an availability group listener. It's also possible to [migrate databases from a single SQL Server instance](sql-server-distributed-availability-group-migrate-single-instance). 

## Initial setup

The first step is to create your SQL Server VMs in Azure. You can do so by using the [Azure portal](../../virtual-machines/windows/sql-vm-create-portal-quickstart.md), [Azure Powershell](../../virtual-machines/windows/sql-vm-create-powershell-quickstart.md), or an [ARM template](../../virtual-machines/windows/create-sql-vm-resource-manager-template.md). 

Be sure to configure your SQL Server VMs according to the [prerequisites](sql-server-distributed-availability-group-migrate-prerequisites.md). Choose between a single subnet deployment, which relies on an Azure Load Balancer or distributed network name to route traffic to  your availability group listener, or a multi-subnet deployment which does not have such a requirement. The multi-subnet deployment is recommended. To learn more, see [connectivity](availability-group-overview.md#connectivity). 

For simplicity, join your target SQL Server VMs to the same domain as your source SQL Server. Otherwise, join your target SQL Server VM to a domain that's federated with the domain of your source SQL Server. 

Use the same SQL Server instance names for the target as the source SQL Server instances. Using a different instance name for each replica is not recommended, and may causes issues with file paths when adding new databases. 

This article uses the following example parameters:
- Database name: **Adventureworks**
- Source machine names: **OnPremNode1** (Primary), **OnPremNode2** (Secondary)
- Source SQL Server instance names: **SQL1**, **SQL2**
- Source availability group name (global primary in DAG): **OnPremAg**
- Source availability group listener name: **OnPremAG_LST**

- Target SQL Server VM names: **AzureNode1** (Primary), **Azure Node2** (Secondary)
- Target SQL Server on Azure VM instance names: **SQL1**, **SQL2**
- Target availability group name (forwarder in DAG): **AzureAG**
- - Source availability group listener name: **AzureAG_LST**

- Endpoint name: **Hadr_endpoint**
- Distributed availability group name: **DAG**
- Domain name: **Contoso** 

## Create endpoints

Use Transact-SQL (T-SQL) to create endpoints on both your two source instances (**OnPremNode1\SQL1**, **OnPremNode2\SQL2**) and target (**AzureNode1\SQL1**, **AzureNode2\SQL2**) SQL Server instances. 

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

Domain accounts automatically have access to endpoints, but service accounts may not automatically be part of the sysadmin group and may not have connect permission. To manually grant the SQL Server service account connect permission to endpoint,  run the following T-SQL script on both servers: 

```sql
GRANT CONNECT ON ENDPOINT::[Hadr_endpoint] TO [<your account>] 
```

## Create source AG

Since a distributed availability group is a special availability group that spans across two individual availability groups, you first need to create an availability group on the two source SQL Server instances. 

If you already have an availability group on your source instances, skip this section. 

Use Transact-SQL (T-SQL) to create an availability group (**OnPremAg**) between your two source instances (**OnPremNode1\SQL1**, **OnPremNode2\SQL2**) for the example **Adventureworks** database. 

To create the availability group on the source instances, run this script on the source primary replica (**OnPremNode1\SQL1**): 

```sql
CREATE AVAILABILITY GROUP [OnPremAG]  
WITH ( AUTOMATED_BACKUP_PREFERENCE = PRIMARY, 
    DB_FAILOVER = OFF,  
    DTC_SUPPORT = NONE,  
    REQUIRED_SYNCHRONIZED_SECONDARIES_TO_COMMIT = 0)  
FOR DATABASE  [Adventureworks]  
REPLICA ON  
    N'OnPremNode1\SQL1' WITH (ENDPOINT_URL = N'TCP://OnPremNode1.contoso.com:5022',  
    FAILOVER_MODE = AUTOMATIC, 
    AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,  
    SEEDING_MODE = AUTOMATIC,  
    SECONDARY_ROLE(ALLOW_CONNECTIONS = NO)),   
    N'OnPremNode2\SQL2' WITH (ENDPOINT_URL = N'TCP://OnPremNode2.contoso.com:5022',  
    FAILOVER_MODE = AUTOMATIC,  
    AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,  
    SEEDING_MODE = AUTOMATIC,  
    SECONDARY_ROLE(ALLOW_CONNECTIONS = NO));	 
```

Next, to join the secondary replica (**OnPremNode2\SQL2**) to the availability group (**OnPremAg**). 

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
WITH DHCP 
  ON (N'10.91.136.0', N'255.255.252.0') 
, PORT=60173); 
GO 
```


## Create target AG

You also need to create an availability group on the target SQL Server VMs as well. 

If you already have an availability group configured between your SQL Server instances in Azure, skip this section. 

Use Transact-SQL (T-SQL) to create an availability group (**AzureAG**) on the target SQL Server instances (**AzureNode1\SQL1** and **AzureNode2\SQL2**). 

To create the availability group on the target, run this script on the target primary replica: 

```sql
CREATE AVAILABILITY GROUP [AzureAG]
FOR
   REPLICA ON N'AzureNode1\SQL1' WITH (ENDPOINT_URL = N'TCP://AzureNode1.contoso.com:5022',
   FAILOVER_MODE = MANUAL,
   AVAILABILITY_MODE = SYNCHRONOUS_COMMIT, 
   BACKUP_PRIORITY = 50,
   SECONDARY_ROLE(ALLOW_CONNECTIONS = NO),
   SEEDING_MODE = AUTOMATIC),    
N'AZUREAGNODE2\SQL2' WITH (ENDPOINT_URL = N'TCP://AZUREAGNODE2.contoso.com:5022',    
   FAILOVER_MODE = MANUAL,    
   AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,    
   BACKUP_PRIORITY = 50,    
   SECONDARY_ROLE(ALLOW_CONNECTIONS = NO),    
   SEEDING_MODE = AUTOMATIC);   
GO 
```

Next, join the target secondary replica (**AzureNode2\SQL2**) to the availability group (**AzureAG**). 

Run this script on the target secondary replica: 

```sql
ALTER AVAILABILITY GROUP [AzureAG]   JOIN; 
GO 
ALTER AVAILABILITY GROUP [AzureAG]   GRANT CREATE ANY DATABASE; 
GO 
```

Finally, create a listener (**AzureAG_LST**) for your target availability group (**AzureAG**). If you deployed your SQL Server VMs to multiple subnets, [create your listener](../../virtual-machines/availability-group-manually-configure-tutorial-multi-subnet.md#create-availability-group). If you deployed your SQL Server VMs to a single subnet, configure either an [Azure Load Balancer](../../virtual-machines/availability-group-vnn-azure-load-balancer-configure.md), or a [distributed network name](../../virtual-machines/availability-group-distributed-network-name-dnn-listener-configure.md) for your listener. 


!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
THIS IS AS FAR AS I'VE GOTTEN SO FAR THE REST IS NOT READY
!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






## Create distributed AG 

After you have your source (**OnPremAG**) and target (**AzureAG**) availability groups configured, create your distributed availability group to span both individual availability groups. 

Use Transact-SQL on the source SQL Server instance (**SQLonPrem\SQL1**) and AG (**OnPremAG**) to create the distributed availability group (**DAG**). 

To create the distributed AG on the source, run this script on the source: 

```sql
CREATE AVAILABILITY GROUP [DAG]   
   WITH (DISTRIBUTED)    
   AVAILABILITY GROUP ON 
      'OnPremAG' WITH    
      (		 
         LISTENER_URL = 'tcp://SQLonPrem.contoso.com:5022',   
         AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,   
         FAILOVER_MODE = MANUAL,    
         SEEDING_MODE = AUTOMATIC    
      ),    
      'AzureAG' WITH     
      (    
         LISTENER_URL = 'tcp://SQLonAzure.contoso.com:5022',  
         AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,    
         FAILOVER_MODE = MANUAL,    
         SEEDING_MODE = AUTOMATIC    
      );    
GO   

```

>[!NOTE]
> The seeding mode is set to `AUTOMATIC` as the version of SQL Server on the target and source is the same. If your SQL Server target is a higher version, then create the distributed ag, and join the secondary AG to the distributed ag with **seeding_mode** set to `manual`. Then manually restore your databases from the source to the target SQL Server instance. Review [upgrading versions during migration](/sql/database-engine/availability-groups/windows/distributed-availability-groups#migrate-to-higher-sql-server-versions) to learn more. 

After your distributed AG is created, join the target AG (**AzureAG**) on the target instance (**SQLonAzure\SQL1**) to the distributed AG (**DAG**). 

To join the target AG to the distributed AG, run this script on the target: 

```sql
ALTER AVAILABILITY GROUP [DAG]    
JOIN    
AVAILABILITY GROUP ON   
   'OnPremAG' WITH    
 	(LISTENER_URL = 'tcp://SQLonPrem.contoso.com:5022', 
    AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,  
    FAILOVER_MODE = MANUAL,  
    SEEDING_MODE = AUTOMATIC  
 	),   
   'AzureAG' WITH 
 	(LISTENER_URL = 'tcp://SQLonAzure.contoso.com:5022',    
    AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,   
    FAILOVER_MODE = MANUAL,    
    SEEDING_MODE = AUTOMATIC    
 	);     
GO  
```

If you need to cancel, pause, or delay synchronization between the source and target availability groups (such as, for example, performance issues), run this script on the source global primary instance (**SQLonPrem\SQL1**): 

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
