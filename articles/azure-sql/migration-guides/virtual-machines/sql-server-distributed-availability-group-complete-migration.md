---
title: Complete migration using a distributed availability group
titleSuffix: SQL Server on Azure VMs
description: Use a distributed availability group to complete the migration of your SQL Server databases to SQL Server on Azure VMs. 
ms.service: virtual-machines-sql
ms.subservice: migration-guide
author: MashaMSFT
ms.topic: how-to
ms.date: 12/15/2021
ms.author: mathoma
---
# Complete migration using a distributed AG

Use a [distributed availability group (AG)](/sql/database-engine/availability-groups/windows/distributed-availability-groups) to migrate your databases from SQL Server to SQL Server on Azure Virtual Machines (VMs). 

This article assumes you've already configured your distributed ag for either your [standalone databases](sql-server-distributed-availability-group-migrate-standalone-instance.md) or your [availability group databases](sql-server-distributed-availability-group-migrate-ag.md) and now you're ready to finalize the migration to SQL Server on Azure VMs. 

## Monitor migration

Use Transact-SQL (T-SQL) to monitor the progress of your migration. 

Run the following script on the global primary and the forwarder and validate that the state  for `synchronization_state_desc` for the primary availability group (**OnPremAG**) and the secondary availability group (**AzureAG**) is `SYNCHRONIZED`. Confirm that the the `synchronization_state_desc` for the distributed AG (**DAG**) is synchronizing and the `last_hardened_lsn` is the same per database on both the global primary and the forwarder. 

If not, rerun the query on both sides every 5 seconds or so until it is the case. 

Use the following script to monitor the migration:

```sql
SELECT ag.name 
       , drs.database_id 
       , db_name(drs.database_id) as database_name 
       , drs.group_id 
       , drs.replica_id 
       , drs.synchronization_state_desc 
       , drs.last_hardened_lsn   
FROM sys.dm_hadr_database_replica_states drs  
INNER JOIN sys.availability_groups ag on drs.group_id = ag.group_id; 
```

## Complete migration 

Once you've validated the states of the availability group and the distributed ag, you're ready to complete the migration. This consists of failing over the distributed ag to the forwarder (the target SQL Server in Azure), and then cutting over the application to the new primary on the Azure side. 

To failover your distributed availability group, review [failover to secondary availability group](/sql/database-engine/availability-groups/windows/configure-distributed-availability-groups#failover). 

After the failover, update the connection string of your application to connect to the new primary replica in Azure. At this point, you can choose to maintain the distributed availability group, or use `DROP AVAILABILITY GROUP [DAG]` on the both the source and target SQL Server instances to drop it. 

If your domain controller is on the source side, validate that your target SQL Server VMs in Azure have joined the domain before abandoning the source SQL Server instances. Do not delete the domain controller on the source side until you [create a domain](../../virtual-machines/windows/availability-group-manually-configure-prerequisites-tutorial-multi-subnet.md#create-domain-controllers) on the source side in Azure and add your SQL Server VMs to this new domain. 


## Next steps

For a tutorial showing you how to migrate a database to SQL Server on Azure Virtual Machines using the T-SQL RESTORE command, see [Migrate a SQL Server database to SQL Server on a virtual machine](../../virtual-machines/windows/migrate-to-vm-from-sql-server.md). 

For information about SQL Server on Azure Virtual Machines, see the [Overview](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md). 

For information about connecting apps to SQL Server on Azure Virtual Machines, see [Connect applications](../../virtual-machines/windows/ways-to-connect-to-sql.md). 



