---
title: Recommended cluster settings for availability group
description: Learn how to modify your cluster settings to better support an availability group for a SQL Server on Azure VM. 
services: virtual-machines
documentationCenter: na
author: MashaMSFT
editor: monicar
tags: azure-service-management

ms.assetid: 601eebb1-fc2c-4f5b-9c05-0e6ffd0e5334
ms.service: virtual-machines-sql
ms.subservice: hadr

ms.topic: overview
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: "03/03/2021"
ms.author: mathoma

---

# Recommended cluster settings for availability group
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

If above actions do not result in improved performance such in the scenario where you are unable to move to a VM or disks with higher limit due to financial or other constraints, you can opt for relaxed monitoring of the SQL Always On AG/FCI. Please note that this will mask the underlying problem only and these are only temporary solution and reduces (not eliminates) the likelihood of a failure. You might need to do trial and error to find the optimum values for your environment.

## Always On Parameters for relaxed monitoring    
Here are Always on AG/FCI parameters that can modified to achieve relaxed monitoring:  
• Lease timeout 
o Prevents split-brain 
o Default: 20000
• HealthCheck timeout 
o determines health of the Primary replica 
o Default: 30000
• Failure-Condition Level 
o conditions that trigger an automatic failover
Additionally, if you are concerned about primary and secondary replica connectivity timeout, you can review following parameter:
• Session timeout
o Check communication issue between Primary and Secondary
o Default 10 seconds
Constraints to follow  
Few things to consider before making any changes.
• It is not advised to lower any timeout values below their default values
• SameSubnetThreshold <= CrossSubnetThreshold
• SameSubnetDelay <= CrossSubnetDelay
• The lease interval (½ * LeaseTimeout) must be shorter than SameSubnetThreshold * SameSubnetDelay


## Lease timeout
Lease timeout prevents split brain scenario. On an Azure VM this can happen if there is resource contention like slow IO, high CPU or low memory. Here are some guidelines to relax the health timeout, if the underlying conditions cannot be avoided easily.  
Parameter Recommended values for SQL Always on HA on Azure VM
 
Windows Sever 2012 or later  Windows Server 2008/R2
SameSubnetDelay 1 second 2 second
SameSubnetThreshold 40 heartbeats 10 heartbeats
CrossSubnetDelay 1 second 2 second
CrossSubnetThreshold 40 heartbeats 20 heartbeats
AG LeaseTimeout 
<
2* SameSubnetThreshold * SameSubnetDelay Should be <120 seconds, recommended to start with 40 seconds Should be <40 seconds, recommended to start with 30 seconds
 
 
## How to Relax lease timeout   

The lease mechanism is controlled by a single value specific to each AG in a WSFC cluster. To navigate to this value in Failover Cluster Manager:
1. In the roles tab, find the target AG role. Click on the target AG role.
2. Right-click the AG resource at the bottom of the window and select Properties.

 

3. In the popup window, navigate to the properties tab and there will be a list of values specific to this AG. Click the LeaseTimeout value to change it.
   
## Health-Check Timeout Threshold

WSFC resource DLL of the availability group performs a health check of the primary replica by calling the sp_server_diagnostics stored procedure on the instance of SQL Server that hosts the primary replica. sp_server_diagnostics returns results at an interval that equals 1/3 of the health-check timeout threshold for the availability group. The default health-check timeout threshold is 30 seconds, which causes sp_server_diagnostics to return at a 10-second interval. If sp_server_diagnostics is slow or is not returning information, the resource DLL will wait for the full interval of the health-check timeout threshold before determining that the primary replica is unresponsive. If the primary replica is unresponsive, an automatic failover is initiated, if currently supported.
Relax Health-Check Timeout
In order to Relax Health-Check Timeout to 60000 milli second following command can be used
ALTER AVAILABILITY GROUP AG1 SET (HEALTH_CHECK_TIMEOUT =60000);
 Failure-Condition Level 
The failure-condition level specifies what failure conditions trigger an automatic failover. There are five failure-condition levels, which range from the least restrictive (level one) to the most restrictive (level five). A given level encompasses the less restrictive levels. Thus, the strictest level, five, includes the four less restrictive conditions, and so forth. You can set the FAILURE_CONDITION_LEVEL to less restrictive value from default of 3 when you cannot resolve the underlying issue easily. Following command sets failure condition to the least restrictive level of 1 for the availability group named AG1   
ALTER AVAILABILITY GROUP AG1 SET (FAILURE_CONDITION_LEVEL = 1);

## Session timeout

The session-timeout period is a replica property that controls how long (in seconds) that an availability replica waits for a ping response from a connected replica before considering the connection to have failed. By default, a replica waits 10 seconds for a ping response. This replica property applies only the connection between a given secondary replica and the primary replica of the availability group.
We recommend that you keep the time-out period at 10 seconds or greater.  For Synchronous replica, changing session-timeout to high value can increase HADR_Sync_commit waits. 
The following example, entered on the primary replica of the AccountsAG availability group, changes the session-timeout value to 15 seconds for the replica located on the INSTANCE09 server instance.
ALTER AVAILABILITY GROUP AccountsAG   
   MODIFY REPLICA ON 'INSTANCE09' WITH (SESSION_TIMEOUT = 15);  

## Known issues

If the Windows cluster settings are too aggressive for your environment, you may see following message in the system event log frequently. To get more information please review Troubleshooting cluster issue with Event ID 1135
Event ID 1135
Cluster node 'Node1' was removed from the active failover cluster membership. The Cluster service on this node may have stopped. This could also be due to the node having lost communication with other active nodes in the failover cluster. Run the Validate a Configuration wizard to check your network configuration. If the condition persists, check for hardware or software errors related to the network adapters on this node. Also check for failures in any other network components to which the node is connected such as hubs, switches, or bridges.

If the SQL AG/FCI monitoring process is too aggressive, you may see frequent AG/FCI restarts, failures or failovers. For AG, additionally you can see following messages following messages in the SQL Server: 

19407   The lease between availability group ‘PRODAG’ and the Windows Server Failover Cluster has expired. A connectivity issue occurred between the instance of SQL Server and the Windows Server Failover Cluster. To determine whether the availability group is failing over correctly, check the corresponding availability group resource in the Windows Server Failover Cluster

19419  The renewal of the lease between availability group ‘%.*ls’ and the Windows Server Failover Cluster failed because the existing lease is no longer valid.
If the session timeout is too aggressive for your environment, you may see following messages frequently:
Message 35201: A connection timeout has occurred while attempting to establish a connection to availability replica 'replicaname' with id [availability_group_id]. Either a networking or firewall issue exists, or the endpoint address provided for the replica is not the database mirroring endpoint of the host server instance. 
Message 35206: A connection timeout has occurred on a previously established connection to availability replica 'replicaname' with id [availability_group_id]. Either a networking or a firewall issue exists, or the availability replica has transitioned to the resolving role.

## Relax monitoring on certain periods of time
In some scenario, it might be beneficial to opt for more relaxed monitoring on certain period of time of in certain environments. One example can be an environment might see cluster or AG/FCI failures only during maintenance hours due to increased IO loads resulting in Azure VM or disk IO throttling. Some examples of increased IOs can be: 
• Database backup 
• Index maintenances  
• Update statistics  
• DBCC CHECKDB  
• VM backup 
Ideal solution to avoid these IO would be going for lager VM or disk size, if the IO load cannot be spread out or reduced. But if higher size is not an acceptance solution, having an even more relaxed environment might be considered. Here are the steps can be followed to achieve this:
• Just before high resource consuming activity set the monitoring for Windows cluster (and if needed Always On AG/FCI) to more relaxed so that possibility of a failure is minimized. 
• Complete the activity. 
• Change the monitoring setting back to what is needed during normal business operation. 
Yous use SQL agent jobs to achieve this.  Please note that a hard failure during a more relaxed environment will of course take longer to detect. 

Note
Changing the cluster threshold parameters or AG/FCI timeouts/Failure condition level will take effect immediately, you don't have to restart the cluster or any resources.
