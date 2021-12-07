---
title: Complete migration using a distributed availability group
description: Review the prerequisites to migrate your SQL Server to SQL Server on Azure VMs using a distributed availability group. 
ms.service: virtual-machines-sql
ms.subservice: migration-guide
author: MashaMSFT
ms.topic: how-to
ms.date: 12/15/2021
ms.author: mathoma
---
# Complete migration using a distributed availability group

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
THIS ARTICLE IS NOT YET READY, ITS JUST A STUB FOR AN EXAMPLE 
!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

This article assumes you've already configured your dag for your [single databases](sql-server-distributed-availability-group-migrate-single-instance.md) or your [availability group](sql-server-distributed-availability-group-migrate-ag.md) and now you're ready to finalize the migration to SQL Server on Azure VMs. 

## Monitor migration

use script

Run this query on the Global Primary(OnPremNode1/SQL1) and the forwarder(AzureNode1/SQL1) and check the results to see if synchronization_state_desc for primary availability group(OnPremAG) and secondary availability group(AzureAG) is SYNCHRONIZED, for distributed availability group(DAG) it is synchronizing and the last_hardened_lsn is the same per database on both the global primary and  forwarder.  

If not rerun the query on both side every 5 seconds until it is the case: 

SELECT ag.name 

      	 , drs.database_id 

       	, db_name(drs.database_id) as database_name 

       , drs.group_id 

       , drs.replica_id 

       , drs.synchronization_state_desc 

       , drs.last_hardened_lsn   

FROM sys.dm_hadr_database_replica_states drs  

INNER JOIN sys.availability_groups ag on drs.group_id = ag.group_id; 

## Cut over

Failover from source side to the target side by performing a distributed availability group failover(Only manual failover is supported at this time), Following Fail over to a secondary availability group to failover DAG from OnPremAG to AzureAG. 

Cutover 

After failover finished, remove the distributed availability group on source side(OnPremNode1/SQL1) and target side(AzureNode1/SQL1) 

 DROP AVAILABILITY GROUP [DAG] 

Note: After migration and cutover finished, before you abandon the source side, notice that if the target Azure SQL VMs have joined to domain controller configured on source side during the migration, then don’t delete domain controller on source side until you setup new domain on target and add those Azure SQL VMs into new domain.  



## Next steps

Once you have configured both source and target environment to meet the prerequisites, you're ready to migrate either your [single instance](sql-server-distributed-availability-group-migrate-prerequisites.md) of SQL Server or an [Always On availability group](sql-server-distributed-availability-group-migrate-ag.md) to your target SQL Server VM(s). 



