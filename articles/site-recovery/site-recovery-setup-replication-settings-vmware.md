---
title: Set up replication settings for Azure Site Recovery| Microsoft Docs
description: Describes how to deploy Site Recovery to orchestrate replication, failover and recovery of Hyper-V VMs in VMM clouds, to Azure.
services: site-recovery
documentationcenter: ''
author: sujayt
manager: rochakm
editor: rayne-wiselman

ms.assetid: 8e7d868e-00f3-4e8b-9a9e-f23365abf6ac
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 01/19/2017 
ms.author: sutalasi

---
# Manage replication policy for VMware to Azure


## Create a new replication policy

1. Click on 'Manage -> Site Recovery Infrastructure' on the menu on the left hand side. 
2. Select 'Replication policies' under 'For VMware and Physical machines' section.
3. Click on '+Replication policy' on the top.

  	![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/createpolicy.png)

4. Enter the policy name.

5. In RPO threshold, specify the RPO limit. Alerts will be generated when continuous replication exceeds this limit.
6. In Recovery point retention, specify in hours how long the retention window will be for each recovery point. Protected machines can be recovered to any point within a window. 

	> [!NOTE] 
	> Up to 24 hours retention is supported for machines replicated to premium storage and 72 hours retention is supported for machines replicated to standard storage.
	
	> [!NOTE] 
	> A replicaiton policy for failback will be automatically created.

7. In App-consistent snapshot frequency, specify how often (in minutes) recovery points containing application-consistent snapshots will be created.

8. Click 'OK'. The policy should be created in about 30 seconds to 1 minute.

![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Creating-Policy.png)

## Associate Configuration server with replication policy
1. Click on the replication policy to which you want to associate the configuration server.
2. Click on 'Associate' on top.
![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Associate-CS-1.PNG)

3. Select the 'Configuration server' from the list of servers.
4. Click OK. The confgiration server should be associated in about 1 to 2 minutes.

![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Associate-CS-2.png)

## Edit replication policy
1. Click on the replication policy for which you want to edit replication settings.
![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Select-Policy.png)

2. Click 'Edit Settings' on top.
![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Edit-Policy.png)

3. Change the settings based on your need.
4. Click 'Save' on top. The policy should be saved in about 2 to 5 minutes depending on how many VMs are using that replication policy.

![Create Replication policy](./media/site-recovery-setup-replication-settings-vmware/Save-Policy.png)

## Dissociate Configuration server from replication policy
1. Click on the replication policy to which you want to associate the configuration server.
2. Click on 'Dissociate' on top.
3. Select the 'Configuration server' from the list of servers.
4. Click OK. The configuration server should be dissociated in about 1 to 2 minutes.
	
	> [!NOTE] 
	> You cannot dissociate a Configuration server if there is at least one replicated item using the policy. Make sure there are no replicated items using the policy before dissociating the Configuration server.

## Delete replication policy 

1. Click on the replication policy which you want to delete.
2. Click on Delete. The policy should be deleted in about 30 seconds to 1 minute.

	> [!NOTE] 
	> You cannot delete a replication policy if it has at least 1 Configuration server associated to it. Make sure there are no replicated items using the policy and delete all the associated configuration servers before deleting the policy.