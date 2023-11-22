---
title: Write-Through Cache
description: Write-Through Cache in Azure Managed Instance for Apache Cassandra
author: IriaOsara
ms.author: iriaosara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/17/2023


---

# Write-Through Cache in Azure Managed Instance for Apache Cassandra
Azure Managed Instance for Apache Cassandra now has write-through caching (Public Preview) through the utilization of L-series VM SKUs. This implementation aims to minimize tail latencies and enhance read performance, particularly for read intensive workloads. These [specific SKUs](best-practice-performance.md#cpu-performance)  are equipped with locally attached disks, ensuring increased IOPS for read operations and reduced tail latency.

> [!IMPORTANT]
> Write-through caching, is in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Benefits of using Write-Through Cache

1. **Tail Latency Minimization Focus**: This implementation focuses on minimizing tail latencies to enhance user experience, particularly in time-sensitive applications, by reducing delays in read operations.

1. **Read-Intensive Workload Optimization**: It's for scenarios with heavy read workloads, the design specifically targets and improves read performance, acknowledging the demands of applications where frequent read operations are the norm.

1. **Localized Disk Empowerment**: The designated SKUs feature locally attached disks, a key element that empowers architecture with increased IOPS for read operations. This design choice aims to optimize data retrieval efficiency and responsiveness. 

1. **IOPS Increase and Tail Latency Reduction**: Locally attached NVMe disks  to boost IOPS for reads and tail latency reduction, this implementation seeks to provide a comprehensive solution that addresses performance bottlenecks for read-intensive workloads.

## How to access L-series VM SKUs

For already existing Azure Managed Instance for Apache Cassandra clusters, you can access L-series SKUs by adding a new datacenter.

- Select the add button in the **Data Center** pane

 :::image type="content" source="./media/write-through-cache/add-datacenter-page1.png" alt-text="Add new datacenter." lightbox="./media/write-through-cache/add-datacenter-page1.png" border="true":::

- From the `SKU Size` dropdown, select your preferred L-series SKUs

 :::image type="content" source="./media/write-through-cache/add-datacenter-page2.png" alt-text="Fill in the requirements for new datacenter." lightbox="./media/write-through-cache/add-datacenter-page2.png" border="true":::

> [!NOTE]
> You can access new features of Auto replication when adding a new data center. [Learn more](create-cluster-portal.md#turnkey-replication)

- Once the new datacenter is created, you should be able to see it along other existing datacenter(s).

 :::image type="content" source="./media/write-through-cache/new-datacenter-page.png" alt-text="The newly created datacenter." lightbox="./media/write-through-cache/new-datacenter-page.png" border="true":::

### Read Intensive Scenario with Write-Through Cache

In this analysis, we explore a sample test designed to compare the IOPs and latency between NVMe and premium managed disks. Through a detailed examination of performance metrics in this comparison, we derive valuable insights into the effectiveness of write-through cache for locally attached NVMe disks.

#### IOPS local NVMe disks and Premium managed disk

The screenshot shows IOPS of Raid 0 array with four premium managed disks(present day configuration)

:::image type="content" source="./media/write-through-cache/premium-disk-iops.png" alt-text="IOPS test screenshot using premium disks." lightbox="./media/write-through-cache/premium-disk-iops.png" border="true":::

IOPS with RAID 1 array of local NVMe disks and Premium managed disks

:::image type="content" source="./media/write-through-cache/nvme-disk-iops.png" alt-text="IOPS test screenshot using locally NVMe disks." lightbox="./media/write-through-cache/nvme-disk-iops.png" border="true":::

We see a better read performance of 248 K IOPS using locally attached NVMe disk.

#### Latency local NVMe disks and Premium managed disk
Throughput of Raid 0 array with four premium managed disks (present day configuration)

:::image type="content" source="./media/write-through-cache/premium-disk-throughput.png" alt-text="latency test screenshot using premium disks." lightbox="./media/write-through-cache/premium-disk-throughput.png" border="true":::

Throughput with RAID 1 array of local NVMe disks and Premium managed disks

:::image type="content" source="./media/write-through-cache/nvme-disk-throughput.png" alt-text="throughput test screenshot using NVMe disks." lightbox="./media/write-through-cache/nvme-disk-throughput.png" border="true":::

We see a higher through put capacity performance of 14.9 GB/s using locally attached NVMe disk.

> [!NOTE]
> Local disks are ephemeral and may be lost. But data will still be intact in the network attached premium managed disks, as we mirror data between them using RAID technology. Customers can monitor the health of the RAID array through [Azure Monitor Metrics](monitor-clusters.md) of RaidArrayDegradedMetric and RaidArrayRebuildMetric.

## Next steps
- [Configure a hybrid cluster with Azure Managed Instance for Apache Cassandra using Client Configurator](configure-hybrid-cluster.md)