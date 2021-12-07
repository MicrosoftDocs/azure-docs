---
title: Optimize your Azure disk pools (preview) performance
description: Learn how to get the most performance out of an Azure disk pool.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 11/02/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: ignite-fall-2021
---

# Azure disk pools (preview) planning guide

It's important to understand the performance requirements of your workload before you deploy an Azure disk pool (preview). Determining your requirements in advance allows you to get the most performance out of your disk pool. The performance of a disk pool is determined by three main factors, adjusting any of them will tweak your disk pool's performance:

- The disk pool's scalability target
- The scalability targets of individual disks contained in the disk pool
- The networking connection between the client machines to the disk pool.

## Optimize for low latency

If you're prioritizing for low latency, add ultra disks to your disk pool. Ultra disks provide sub-millisecond disk latency. To get the lowest latency possible, you must also evaluate your network configuration and ensure it's using the most optimal path. Consider using [ExpressRoute FastPath](../expressroute/about-fastpath.md) to minimize network latency.

## Optimize for high throughput

If you're prioritizing throughput, begin by evaluating the performance targets of the different disk pool SKUs, as well as the number of disk pools required to deliver your throughput targets. If your performance needs exceed what a premium disk pool can provide, you can split your deployment across multiple disk pools. Then, you can decide how to best utilize the performance offered on a disk pool amongst each individual disk and their types. For a disk pool, you can either mix and match between premium and standard SSDs, or use ultra disks only. Ultra disks can't be used with premium or standard SSDs. Select the disk type that best fits your needs. Also, confirm the network connectivity from your clients to the disk pool is not a bottleneck, especially the throughput.


## Use cases

The following table lists some typical use cases for disk pools with Azure VMware Solution and a recommended configuration.


|Azure VMware Solution use cases  |Suggested disk type  |Suggested disk pool SKU  |Suggested network configuration  |
|---------|---------|---------|---------|
|Block storage for active working sets, like an extension of Azure VMware Solution vSAN.     |Ultra disks         |Premium         |Use ExpressRoute virtual network gateway: Ultra Performance or ErGw3AZ (10 Gbps) to connect the disk pool virtual network to the Azure VMware Solution cloud and enable FastPath to minimize network latency.         |
|Tiering - tier infrequently accessed data from the Azure VMware Solution vSAN to the disk pool.     |Premium SSD, standard SSD         |Standard         |Use ExpressRoute virtual network gateway: Standard (1 Gbps) or High Performance (2 Gbps) to connect the disk pool virtual network to the Azure VMware Solution cloud.         |
|Data storage for disaster recovery site on Azure VMware Solution: replicate data from on-premises or primary VMware environment to the disk pool as a secondary site.     |Premium SSD, standard SSD         |Standard, Basic         |Use ExpressRoute virtual network gateway: Standard (1 Gbps) or High Performance (2 Gbps) to connect the disk pool virtual network to the Azure VMware Solution cloud.         |


Refer to the [Networking planning checklist for Azure VMware Solution](../azure-vmware/tutorial-network-checklist.md) to plan for your networking setup, along with other Azure VMware Solution considerations.

## Disk pool scalability and performance targets

|Resource  |Basic disk pool  |Standard disk pool  |Premium disk pool  |
|---------|---------|---------|---------|
|Maximum number of disks per disk pool     |16         |32         |32         |
|Maximum IOPS per disk pool     |12,800         |25,600         |51,200         |
|Maximum MBps per disk pool     |192         |384         |768         |

The following example should give you an idea of how the different performance factors work together:

As an example, if you add two 1-TiB premium SSDs (P30, with a provisioned target of 5000 IOPS and 200 Mbps) into a standard disk pool, you can achieve 2 x 5000  = 10,000 IOPS. However, throughput would be capped at 384 MBps by the disk pool. To exceed this 384-MBps limit, you can deploy more disk pools to scale out for extra throughput. Your network throughput will limit the effectiveness of scaling out.

Disk pools created without specifying the SKU in the REST API are the standard disk pool, by default.

## Availability

Disk pools are currently in preview, and shouldn't be used for production workloads. By default, a disk pool only supports premium and standard SSDs. You can enable support for ultra disks on a disk pool instead but, a disk pool with ultra disks isn't compatible with premium or standard SSDs.

Disk pools with support for premium and standard SSDs are based on a highly available architecture, with multiples hosting the iSCSI endpoint. Disk pools with support for ultra disks are hosted on a single instance deployment.

If your disk pool becomes inaccessible to your Azure VMware Solution cloud for any reason, you will experience the following:

- All datastores associated to the disk pool will no longer be accessible.
- All VMware VMs hosted in the Azure VMware Solution cloud that is using the impacted datastores will be in an unhealthy state.
- The health of clusters in the Azure VMware Solution cloud won't be impacted, except for one operation: You won't be able to place a host into maintenance mode. Azure VMware Solution will handle this failure and attempt recovery by disconnecting the impacted datastores.

## Next steps

- [Deploy a disk pool](disks-pools-deploy.md).
- To learn about how Azure VMware Solutions integrates disk pools, see [Attach disk pools to Azure VMware Solution hosts (Preview)](../azure-vmware/attach-disk-pools-to-azure-vmware-solution-hosts.md).
