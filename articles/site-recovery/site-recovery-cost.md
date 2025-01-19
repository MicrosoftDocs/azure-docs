---
title: Understanding Azure Site Recovery for Managed Disks Charges
description: This article summarizes the costs disaster recovery and migration deployment scenarios.
ms.topic: overview
ms.service: azure-site-recovery
ms.date: 01/19/2025
ms.author: ankitadutta
author: ankitaduttaMSFT
---

# Azure Site Recovery for Managed Disks and associated costs

Azure Site Recovery (ASR) is a robust disaster recovery solution offering seamless replication and failover capabilities for virtual and physical machines. It is important to understand the cost components associated with using Site Recovery to manage expenses effectively. Following is a detailed breakdown of the charges you may incur when using this service. You can also use[ this calculator sheet](https://microsoftapc-my.sharepoint.com/:x:/g/personal/rohansahini_microsoft_com/EfNUBuXinZ9MsuUvGXPm8TMBCnc114dG901FLWaT_LctZw?e=Q4LH1e&clickparams=eyAiWC1BcHBOYW1lIiA6ICJNaWNyb3NvZnQgT3V0bG9vayIsICJYLUFwcFZlcnNpb24iIDogIjE2LjAuMTg0MjkuMjAwNjYiLCAiT1MiIDogIldpbmRvd3MiIH0%3D&CID=FEFAAD05-4C01-4E2D-B712-149D4953A316&wdLOR=c53781AD1-7E3D-4522-B146-E619C1C15B6E) to simulate the costs.


## Protected Instance License fee

The Protected Instance License fee is a fundamental charge for using Azure Site Recovery. This license is billed per protected instance, where an instance refers to either a virtual machine or a physical server. The fee is a fixed cost and applies uniformly across different types of instances.


## Storage cost

Storage cost is a significant part of the overall expense when using Azure Site Recovery. This cost includes:

- **Replica Storage**: The replica storage in the target location mirrors source storage. This storage is used during replication, and its size and type depend on the source storage configuration. Applicable for A2A, V2A, and H2A.
- **Cache Storage Account Cost**:
  - **Azure Virtual Machines**: The cache storage account is in the source region. High churn is priced at Premium Block Blob pricing, and Normal Churn is charged at Gpv2 or Gpv1 pricing. There are minimal egress costs only in A2A for Delta Replication.
  - **VMware/Physical Machines/Hyper-V Machines**: The cache storage account is in the target region, charged at Gpv2 or Gpv1 pricing as per the customer’s selection.


## Storage Transactional cost

Storage transactions incur charges during the replication process and regular virtual machine operations after a failover or test failover. These costs are associated with the read and write operations performed on the cache storage account. The higher the number of disks attached to a VM, the higher the transactional costs.


## Network Egress cost

Network egress costs, also known as outbound data transfer charges, occur when replication traffic leaves an Azure region. This charge applies only when replicating an Azure virtual machine from one region to another. Azure Site Recovery compresses data before transmission, reducing the volume of egress data and subsequently lowering the cost. For estimation purposes, a compression factor of up to 50% can be assumed when the entire data is differential.


## Snapshot cost

This cost includes:

- **Source (Applicable for A2A)**:
  - For Pv1 disks, incremental snapshots are charged.
  - For Pv2 disks, one full snapshot followed by incremental snapshots is charged. A total of 12 snapshots are retained.
- **Target (Applicable for A2A, V2A, and H2A)**:
  - Snapshot costs are associated with the recovery points created by Azure Site Recovery. These snapshots capture the replica storage at a point in time and are charged based on the consumed capacity. Pricing details align with Page Blob Snapshots. [Learn more](https://azure.microsoft.com/pricing/details/storage/page-blobs/#:~:text=Note%3A%20Snapshots%20are%20charged,at%20%240.12%20%2FGB%20per%20month.?msockid=3816c7206e2268e7035dd3316f7069f4).


## Temporary Source Disk cost

This cost is applicable only during the initial replication. The duration for replicating 1 TB of data can be approximately assumed to be 6 hours. For example, if your data is 12 TB, the initial replication takes about 12 hours. The temporary source disk size and SKU type would be the same as the source data disk SKU and would be charged for the time it takes for the initial replication to complete. 


## Optional cost

### Capacity Reservation

Customers are advised to have capacity reservations in the target region. After deployment, capacity is reserved for your use and is always available within the scope of applicable service-level agreements (SLAs). This is not an Azure Site Recovery cost but an auxiliary cost for better infrastructure availability. After creating the capacity reservation, you can use the resources immediately. Capacity is reserved until the user deletes the reservation. [Learn more](https://learn.microsoft.com/azure/virtual-machines/capacity-reservation-overview#pricing-and-billing).


## Conclusion

Understanding the various cost components of Azure Site Recovery is essential for effective budgeting and cost management. Each of these charges contributes to the overall expense of maintaining a reliable disaster recovery solution. By carefully planning and monitoring the frequency of disaster recovery drills, the type of storage used, and the regions involved, you can optimize the costs associated with Azure Site Recovery.

> [!NOTE]
> - **Disaster Recovery Drills**: Each disaster recovery drill, such as test failovers, involves creating a snapshot of the replica storage. These snapshots are stored as new target storage disks, contributing to the overall storage cost until the customer decides to clean up the test failover. The frequency and number of drills conducted throughout the year directly impact this minimal cost.
>
> - **Compute Capacity Cost**: The Compute Capacity Cost is relevant only during active disaster recovery drills or an actual disaster. This cost is associated with the virtual machine compute capacity used during a test failover or failover event. Under normal conditions, with no ongoing drills or disaster events, this cost is typically zero.


## Next steps

- Get started with [Azure VM replication between regions](azure-to-azure-quickstart.md).
- Get started with [VMware VM replication](vmware-azure-enable-replication.md).
- Get started with [Disaster recovery for VMs on Azure Extended Zones](disaster-recovery-for-edge-zone-vm-tutorial.md).
