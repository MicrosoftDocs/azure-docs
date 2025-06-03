---
title: Understanding Azure Site Recovery for Managed Disks Charges
description: This article summarizes the costs disaster recovery and migration deployment scenarios.
ms.topic: overview
ms.service: azure-site-recovery
ms.date: 05/30/2025
ms.author: jsuri
author: jyothisuri
---

# Azure to Azure for managed disks and associated costs

Azure to Azure (A2A) disaster recovery in Site Recovery is a robust disaster recovery solution offering seamless replication and failover capabilities for virtual and physical machines. It is important to understand the cost components associated with using Site Recovery to manage expenses effectively. Following is a detailed breakdown of the charges you may incur when using this service.

You can use this [pricing calculator](https://aka.ms/asr_a2a_calculator) to simulate the estimated costs for Azure to Azure Managed Disks. 

> [!NOTE]
> This calculator gives an estimate of Site Recovery usage costs. It shouldn't be taken as the final cost. If you have any issues or feedback, contact askasr@microsoft.com.

## Protected Instance License fee

The Protected Instance License fee is a fundamental charge for using Azure Site Recovery. This license is billed per protected instance, where an instance refers to either a virtual machine or a physical server. The fee is a fixed cost and applies uniformly across different types of instances.

## Storage cost

Storage cost is a significant part of the overall expense when using Azure Site Recovery. This cost includes:

- **Replica Storage**: The replica storage in the target location mirrors source storage. This storage is used during replication, and its size and type depend on the source storage configuration. Applicable only for A2A.
   >[!Note]
   >Premium SSD v2 source disks will have Premium SSDv1 replica disks. 
- **Cache Storage Account Cost**:
  - **Azure Virtual Machines**: The cache storage account is in the source region. When a user selects *High Churn* the cache storage account uses Premium Block Blob. For *Normal Churn* it uses a General Purpose Storage Account. The charges depend on the type of storage account used. There are minimal egress costs only in A2A for Delta Replication.
  - **VMware/Physical Machines/Hyper-V Machines**: The cache storage account is in the target region, charged at General Purpose Storage Account pricing as per the user's selection.


## Storage Transactional cost

Storage transactions incur charges during the replication process and regular virtual machine operations after a failover or test failover. These costs are associated with the read and write operations performed on the cache storage account. During initial replication or resync, attaching more disks to a VM increases transactional costs. After that, transactional costs depend on the churn on the source disks for delta replication.


## Network Egress cost

Network egress costs, also known as outbound data transfer charges, occur when replication traffic leaves an Azure region. This charge applies only when replicating an Azure virtual machine from one region to another. Azure Site Recovery compresses data before transmission, reducing the volume of egress data and subsequently lowering the cost. For estimation purposes, a compression factor of up to 50% can be assumed when the entire data is differential.


## Snapshot cost

This cost includes:

- **Source**:
  - For Premium SSD disks, incremental snapshots are charged.
  - For Standard and Premium SSD v2 disks (preview), one full snapshot followed by incremental snapshots is charged.
- **Target**:
  - Snapshot costs are associated with the recovery points created by Azure Site Recovery. These snapshots capture the replica storage at a point in time and are charged based on the consumed capacity. Pricing details align with Page Blob Snapshots. [Learn more](https://azure.microsoft.com/pricing/details/storage/page-blobs/#:~:text=Note%3A%20Snapshots%20are%20charged,at%20%240.12%20%2FGB%20per%20month.?msockid=3816c7206e2268e7035dd3316f7069f4).


## Temporary Source Disk cost

This cost is applicable only during the initial replication. The duration for replicating 1 TB of data can be approximately assumed to be 6 hours. For example, if your data is 12 TB, the initial replication takes about 12 hours. The temporary source disk size and SKU type would be the same as the source data disk SKU and would be charged for the time it takes for the initial replication to complete. 


## Optional costs

### Capacity Reservation cost

Site Recovery doesn't reserve any capacity on the target. If users need a higher probability of capacity for failover in the target region, they can use Capacity Reservation, which incurs additional costs. After deployment, capacity is reserved for your use and is always available within the scope of applicable service-level agreements (SLAs). This is not an Azure Site Recovery cost but an auxiliary cost for better infrastructure availability. After creating the capacity reservation, you can use the resources immediately. Capacity is reserved until the user deletes the reservation. [Learn more](/azure/virtual-machines/capacity-reservation-overview#pricing-and-billing).


## Conclusion

Understanding the various cost components of Azure Site Recovery is essential for effective budgeting and cost management. Each of these charges contributes to the overall expense of maintaining a reliable disaster recovery solution. By carefully planning and monitoring the frequency of disaster recovery drills, the type of storage used, and the regions involved, you can optimize the costs associated with Azure Site Recovery.

> [!NOTE]
> - **Disaster Recovery Drills**: Each disaster recovery drill, such as test failovers, involves creating a snapshot of the replica storage. These snapshots are stored as new target storage disks, contributing to the overall storage cost until the user decides to clean up the test failover. The frequency and number of drills conducted throughout the year directly impact this minimal cost.
>
> - **Compute Capacity Cost**: The Compute Capacity Cost is relevant only during active disaster recovery drills or an actual disaster. This cost is associated with the virtual machine compute capacity used during a test failover or failover event. Under normal conditions, with no ongoing drills or disaster events, this cost is typically zero.


## Next steps

- Get started with [Azure VM replication between regions](azure-to-azure-quickstart.md).
- Get started with [VMware VM replication](vmware-azure-enable-replication.md).
- Get started with [Disaster recovery for VMs on Azure Extended Zones](disaster-recovery-for-edge-zone-vm-tutorial.md).
