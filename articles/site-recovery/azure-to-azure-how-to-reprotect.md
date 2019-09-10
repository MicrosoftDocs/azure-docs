---
title: Reprotect failed over Azure VMs back to the primary Azure region with Azure Site Recovery | Microsoft Docs
description: Describes how to reprotect Azure VMs in a secondary region, after failover from a primary region, using Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram
manager: gauravd
ms.service: site-recovery
ms.topic: article
ms.date: 11/27/2018
ms.author: rajanaki


---
# Reprotect failed over Azure VMs to the primary region


When you [fail over](site-recovery-failover.md) Azure VMs from one region to another using [Azure Site Recovery](site-recovery-overview.md), the VMs boot up in the secondary region, in an unprotected state. If fail back the VMs to the primary region, you need to do the following:

- Reprotect the VMs in the secondary region, so that they start to replicate to the primary region.
- After reprotection completes and the VMs are replicating, you can fail them over from the secondary to primary region.

## Prerequisites
1. The VM failover from the primary to secondary region must be committed.
2. The primary target site should be available, and you should be able to access or create resources in that region.

## Reprotect a VM

1. In **Vault** > **Replicated items**, right-click the failed over VM, and select **Re-Protect**. The reprotection direction should show from secondary to primary.

   ![Reprotect](./media/site-recovery-how-to-reprotect-azure-to-azure/reprotect.png)

2. Review the resource group, network, storage, and availability sets. Then click **OK**. If there are any resources marked as new, they are created as part of the reprotection process.
3. The reprotection job seeds the target site with the latest data. After that finishes, delta replication takes place. Then, you can fail over back to the primary site. You can select the storage account or the network you want to use during reprotect, using the customize option.

   ![Customize option](./media/site-recovery-how-to-reprotect-azure-to-azure/customize.png)

### Customize reprotect settings

You can customize the following properties of the target VMe during reprotection.

![Customize](./media/site-recovery-how-to-reprotect-azure-to-azure/customizeblade.png)

|Property |Notes  |
|---------|---------|
|Target resource group     | Modify the target resource group in which the VM is created. As the part of reprotection, the target VM is deleted. You can choose a new resource group under which to create the VM after failover.        |
|Target virtual network     | The target network can't be changed during the reprotect job. To change the network, redo the network mapping.         |
|Target Storage (Secondary VM does not use managed disks)     | You can change the storage account that the VM uses after failover.         |
|Replica managed disks (Secondary VM uses managed disks)    | Site Recovery creates replica managed disks in the primary region to mirror the secondary VM's managed disks.         |
|Cache Storage     | You can specify a cache storage account to be used during replication. By default, a new cache storage account is be created, if it doesn't exist.         |
|Availability Set     |If the VM in the secondary region is part of an availability set, you can choose an availability set for the target VM in the primary region. By default, Site Recovery tries to find the existing availability set in the primary region, and use it. During customization, you can specify a new availability set.         |


### What happens during reprotection?

By default the following occurs:

1. A cache storage account is created in the region where the failed over VM is running.
2. If the target storage account (the original storage account in the primary region) doesn't exist, a new one is created. The assigned storage account name is the name of the storage account used by the secondary VM, suffixed with "asr".
3. If your VM uses managed disks, replica managed disks are created in the primary region to store the data replicated from the secondary VM's disks.
4. If the target availability set doesn't exist, a new one is created as part of the reprotect job if required. If you have customized the reprotection settings, then the selected set is used.

When you trigger a reprotect job, and the target VM exists, the following occurs:

1. The target side VM is turned off if it's running.
2. If the VM is using managed disks, a copy of original disks are created with '-ASRReplica' suffix. The original disks are deleted. The '-ASRReplica' copies are used for replication.
3. If the VM is using unmanaged disks, the target VM's data disks are detached and used for replication. A copy of the OS disk is created and attached on the VM. The original OS disk is detached and used for replication.
4. Only changes between the source disk and the target disk are synchronized. The differentials are computed by comparing both the disks and then transferred. To find the estimated time check below.
5. After the synchronization completes, the delta replication begins, and creates a recovery point in line with the replication policy.

When you trigger a reprotect job, and the target VM and disks do not exist, the following occurs:
1. If the VM is using managed disks, replica disks are created with '-ASRReplica' suffix. The '-ASRReplica' copies are used for replication.
2. If the VM is using unmanaged disks, replica disks are created in the target storage account.
3. The entire disks are copied from the failed over region to the new target region.
4. After the synchronization completes, the delta replication begins, and creates a recovery point in line with the replication policy.

#### Estimated time  to do the reprotection 

In most cases, Azure Site Recovery doesn’t replicates the complete data to the source region. 
Below are the conditions that determines how much data would be replicated :

1.	If the source VM data is deleted, corrupted or inaccessible due to some reason like resource group change/delete then during reprotection complete IR will happen as there is no data available on the source region to use.
2.	If the source VM data is accessible then only  differentials are computed by comparing both the disks and then transferred. Check the below table to get the estimated time 

|**Example situation ** | **Time taken to Reprotect  ** |
|--- | --- |
|Source region has 1 VM with 1 TB standard Disk<br/>- Only 127 GB data is used and rest of the disk is empty<br/>- Disk type is standard with 60 MiB/S throughput<br/>- No data change after failover| Approximate time 45 minutes – 1.5 hours<br/> - During reprotection Site Recovery will populate the checksum of whole data  which will take 127 GB/ 45 MBs ~45 minutes<br/>- Some overhead  time is required for Site Recovery to do auto scale that  is 20-30 minutes<br/>- No Egress charges |
|Source region has 1 VM with 1 TB standard Disk<br/>- Only 127 GB data is used and rest of the disk is empty<br/>- Disk type is standard with 60 MiB/S throughput<br/>- 45 GB data changes after failover| Approximate time 1 hours – 2 hours<br/>- During reprotection Site Recovery will populate the checksum of whole data  which will take 127 GB/ 45 MBs ~45 minutes<br/>- Transfer time to apply changes of 45 GB that is 45 GB/ 45 MBps ~ 17 minutes<br/>- Egress charges would be only for 45 GB data not for the checksum|
 



## Next steps

After the VM is protected, you can initiate a failover. The failover shuts down the VM in the secondary region, and creates and boots VM in the primary region, with some small downtime. We recommend you choose a time accordingly, and that you run a test failover before initiating a full failover to the primary site. [Learn more](site-recovery-failover.md) about failover.
