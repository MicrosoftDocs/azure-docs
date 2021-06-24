---
title: Agentless replication of VMware virtual machines concepts 
description: Describes concepts related to agentless migration of VMware VMs in Azure Migrate.
author: anvar-ms
ms.author: anvar
ms.manager: bsiva
ms.topic: conceptual
ms.date: 05/31/2021

---
# Azure Migrate agentless migration of VMware virtual machines

This article describes the replication concepts when migrating VMware VMs using Azure Migrate: Server Migration's agentless migration method.

## Replication process

The agentless replication option works by using VMware snapshots and VMware changed block tracking (CBT) technology to replicate data from virtual machine disks. The following block diagram shows you various steps involved when you migrate your virtual machines using Azure Migrate: Server Migration tool.

 ![Migration steps.](./media/concepts-vmware-agentless-migration/migration-phases.png)

When replication is configured for a virtual machine, it first goes through an initial replication phase. During initial replication, a VM snapshot is taken, and a full copy of data from the snapshot disks is replicated to managed disks in your target subscription.

After initial replication for the VM is complete, the replication process transitions to an incremental replication (delta replication) phase. In the incremental replication phase, data changes that have occurred since the beginning of the last completed replication cycle are replicated and written to the replica managed disks, thus keeping replication in sync with changes happening on the VM.

VMware changed block tracking (CBT) technology is used to keep track of changes between replication cycles. At the start of the replication cycle, a VM snapshot is taken and changed block tracking is used to get the changes between the current snapshot and the last successfully replicated snapshot. Only the data that has changed since the previous completed replication cycle is replicated to keep replication for the VM in sync. At the end of each replication cycle, the snapshot is released, and snapshot consolidation is performed for the virtual machine.

When you perform the migrate operation on a replicating virtual machine, there's an on-demand delta replication cycle that replicates the remaining changes since the last replication cycle. After the on-demand cycle completes, the replica managed disks corresponding to the virtual machine are used to create the virtual machine in Azure. Right before triggering migrate/failover, you must shut down the on-premises virtual machine. Shutting down the virtual machine ensures zero data loss during migration.


Once the migration is successful and the VM boots up in Azure, ensure that you stop the replication of the VM. Stopping the replication will delete the intermediate disks (seed disks) that were created during data replication, and you'll also avoid incurring extra charges associated with the storage transactions on these disks.

## Replication cycles

Replication cycles refer to the periodic process of transferring data from on-premises environment to Azure managed disks. A full replication cycle consists of the following steps:

1. Create VMware snapshot for each disk associated with the VM
2. Upload data to log storage account in Azure
3. Release snapshot
4. Consolidate VMware disks

A cycle is said to be complete once the disks are consolidated.

## Components involved in replication

**On-premises components:** Azure Migrate appliance has the following components that are responsible for replication

- DRA agent
- Gateway agent

**Azure components:** The following table summarizes various Azure Artifacts that are created while using the agentless method of VMware VM migration.

| Component | Region | Subscription | Description |
| --- | --- | --- | --- |
| Recovery services vault | Azure Migrate project's region | Azure Migrate project's subscription | Used to orchestrate data replication |
| Service Bus | Target region | Azure Migrate project's subscription | Used for communication between cloud service and Azure Migrate appliance |
| Log storage account | Target region | Azure Migrate project's subscription | Used to store replication data, which is read by the service and applied on customer's managed disk |
| Gateway storage account | Target region | Azure Migrate project's subscription | Used to store machine states during replication |
| Key vault | Target region | Azure Migrate project's subscription | Manages the log storage account keys, stores the service bus connection strings |
| Azure Virtual Machine | Target region | Target subscription | VM created in Azure when you migrate |
| Azure Managed Disks | Target region | Target subscription | Managed disks attached to Azure VMs |
| Network interface cards | Target region | Target subscription | The NICs attached to the VMs created in Azure |

## Permissions required

When you start replication for the first time, the logged-in user must be assigned the following roles:

- Owner or Contributor and User Access Administrator on the Azure Migrate project's Resource Group and the target Resource Group

For the subsequent replications, the logged-in user must be assigned the following roles:

- Owner or Contributor on the Azure Migrate project's Resource Group and the target Resource Group

In addition to the roles described above, the logged-in user would need the following permission at a subscription level - Microsoft.Resources/subscriptions/resourceGroups/read


## Data integrity

There are two stages in every replication cycle that ensures data integrity between the on-premises disk (source disk) and the replica disk in Azure (target disk).

1. First, we validate if every sector that has changed in the source disk is replicated to the target disk. Validation is performed using bitmaps.
Source disk is divided into sectors of 512 bytes. Every sector in the source disk is mapped to a bit in the bitmap. When data replication starts, bitmap is created for all the changed blocks (in delta cycle) in the source disk that needs to be replicated. Similarly, when the data is transferred to the target Azure disk, a bitmap is created. Once the data transfer completes successfully, the cloud service compares the two bitmaps to ensure no changed block is missed. In case there's any mismatch between the bitmaps, the cycle is considered failed. As every cycle is resynchronization, the mismatch will be fixed in the next cycle.

1. Next we ensure that the data that's transferred to the Azure disks is the same as the data that was replicated from the source disks. Every changed block that is uploaded is compressed and encrypted before it's written as a blob in the log storage account. We compute the checksum of this block before compression. This checksum is stored as metadata along with the compressed data. Upon decompression, the checksum for the data is calculated and compared with the checksum computed in the source environment. If there's a mismatch, the data is not written to the Azure disks, and the cycle is considered failed. As every cycle is resynchronization, the mismatch will be fixed in the next cycle.

## Security

The Azure Migrate appliance compresses data and encrypts before uploading. Data is transmitted over a secure communication channel over https and uses TLS 1.2 or later. Additionally, Azure Storage automatically encrypts your data when it is persisted it to the cloud (encryption-at-rest).



## Migration phase

When a VM undergoes replication, there are few states that are possible:

- **Initial Replication (Queued):** The VM is queued for replication (or migration) when there are other VMs that are consuming the on-premises resources during replication (or migration). Once the resources are free, this VM will be processed.
- **Initial replication:** The VM is undergoing initial replication. When the VM is undergoing initial replication, you cannot proceed with test migration and migration. You can only stop replication at this stage.
- **Test migration pending:** The VM is in delta replication phase, and you can now perform test migration (or migration).
- **Migration in progress (Queued):** The VM is queued for migration when there are other VMs that are consuming the on-premises resources during replication (or migration). Once the resources are free, the VM will be processed for migration.
- **Migration in progress:** The VM is migrating. You can select the link to check the ongoing migration job. This job consists of five stages: Prerequisites check for migration, shutting down the virtual machine (optional step), prepare for migration, creation of Azure VM, start the Azure VM.
- **Not applicable:** When the VM has successfully migrated and/or when you have stopped replication, the status changes to not applicable. Once you stop replication and the operation finishes successfully, the VM will be removed from the list of replicating machines. You can find the VM in the virtual machines tab in the Replicate wizard.

> [!Note]
> Some VMs are put in queued state to ensure minimal impact on the source environment due to storage IOPS consumption. These VMs are processed based on the scheduling logic as described in the next section.

## Scheduling logic

Initial replication is scheduled when replication is configured for a VM. It is followed by incremental replications (delta replications).

Delta replication cycles are scheduled as follows:

- First delta replication cycle is scheduled immediately after the initial replication cycle completes
- Next delta replication cycles are scheduled according to the following logic: 
max [(Previous delta replication cycle time/2), 1 hour]

That is, next delta replication will be scheduled no sooner than one hour. For example, if a VM takes four hours for a delta replication cycle, the next delta replication cycle is scheduled in two hours, and not in the next hour.

> [!Note]
> The scheduling logic is different after the initial replication completes. The first delta cycle is scheduled immediately after the initial replication completes and subsequent cycles follow the scheduling logic described above.


- When you trigger migration, an on-demand delta replication cycle (pre-failover delta replication cycle) is performed for the VM prior to migration.

**Prioritization of VMs for various stages of replication**

- Ongoing VM replications are prioritized over scheduled replications (new replications)
- Pre-migrate (on-demand delta replication) cycle has the highest priority followed by initial replication cycle. Delta replication cycle has the least priority.

That is, whenever a migrate operation is triggered, the on-demand replication cycle for the VM is scheduled and other ongoing replications take back seat if they are competing for resources.

**Constraints:**

We use the following constraints to ensure that we don't exceed the IOPS limits on the SANs.

- Each Azure Migrate appliance supports replication of 52 disks in parallel
- Each ESXi host supports eight disks. Every ESXi host has a 32-MB NFC buffer. So, we can schedule eight disks on the host (Each disk takes up 4 MB of buffer for IR, DR).
- Each datastore can have a maximum of 15 disk snapshots. The only exception is when a VM has more than 15 disks attached to it.

## Scale-out replication

Azure Migrate supports concurrent replication of 500 virtual machines. When you are planning to replicate more than 300 virtual machines, you must deploy a scale-out appliance. The scale-out appliance is similar to an Azure Migrate primary appliance but consists only of gateway agent to facilitate data transfer to Azure. The following diagram shows the recommended way to use the scale-out appliance.

![Scale-out configuration.](./media/concepts-vmware-agentless-migration/scale-out-configuration.png)


You can deploy the scale-out appliance anytime after configuring the primary appliance until there are 300 VMs replicating concurrently. When there are 300 VMs replicating concurrently, you must deploy the scale-out appliance to proceed.

## Stop replication

When you stop replication, the intermediate managed disks (seed disks) created during replication will be deleted. The VM for which the replication is stopped can be replicated and migrated again following the usual steps.

You can stop replication at two stages:

-  When the replication is ongoing
-  When the migration for a VM has completed

As best practice, you should always stop the replication after the VM has migrated successfully to Azure to ensure that you don't incur extra charges for storage transactions on the intermediate managed disks (seed disks).

In some cases, you will notice that stop replication takes time. It is because whenever you stop replication, the ongoing replication cycle is completed (only when the VM is in delta sync) before deleting the artifacts.

## Impact of churn

We try to minimize the amount of data transfer in each replication cycle by allowing the data to fold as much as possible before we schedule the next cycle. Because agentless replication folds in data, the _churn pattern_ is more important than the _churn rate_. When a file is written again and again, the rate doesn't have much impact. However, a pattern in which every other sector is written causes high churn in the next cycle.

## Management of replication

### Throttling

You can increase or decrease the replication bandwidth using the _NetQosPolicy._ The _AppNamePrefix_ to use in the _NetQosPolicy_ is "GatewayWindowsService.exe". 

You could create a policy on the Azure Migrate appliance to throttle replication traffic from the appliance by creating a policy such as this one:

```New-NetQosPolicy -Name "ThrottleReplication" -AppPathNameMatchCondition "GatewayWindowsService.exe" -ThrottleRateActionBitsPerSecond 1MB```

> [!NOTE]
> This is applicable to all the replicating VMs from the Azure Migrate appliance simultaneously.

You can also increase and decrease replication bandwidth based on a schedule using the [sample script](./common-questions-server-migration.md).

### Blackout window

Azure Migrate provides a configuration-based mechanism through which customers can specify the time interval during which they don't want any replications to proceed. This time interval is called the blackout window. The need for a blackout window can arise in multiple scenarios such as when the source environment is resource constrained, when customers want replication to go through only non-business hours, etc.

> [!NOTE]
> The existing replication cycles at the start of the blackout window will complete before the replication pauses.

A blackout window can be specified for the appliance by creating/updating the file GatewayDataWorker.json in C:\ProgramData\Microsoft Azure\Config. A typical file would be of the form:

```
{
    
    "BlackoutWindows": "List of blackout windows"
    
}
```

    
The list of blackout windows is a "|" delimited string of the format "DayOfWeek;StartTime;Duration". The duration can be specified in days, hours, and minutes. For example, the blackout windows can be specified as:

```
{
    
    "BlackoutWindows": "Monday;7:00;7h | Tuesday;8:00;1d7h | Wednesday;16:00;1d | Thursday;18:00;5h | Friday;13:00;8m"
    
}
```
    
The first value in the above example indicates a blackout window starting every Monday at 7:00 AM local time (time on the appliance) and lasting 7 hours.

Once the GatewayDataWorker.json is created/updated with these contents, the Gateway service on the appliance needs to be restarted for these changes to take effect.

In the scale-out scenario, the primary appliance and the scale-out appliance honor the blackout windows independently. As a best practice, we recommend keeping the windows consistent across appliances.

## Next steps
[Migrate VMware VMs](tutorial-migrate-vmware.md) with agentless migration.