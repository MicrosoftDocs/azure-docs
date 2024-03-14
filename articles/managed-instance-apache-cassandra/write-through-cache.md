---
title: Write-through cache in Azure Managed Instance for Apache Cassandra
description: Learn how to use the write-through cache feature in Azure Managed Instance for Apache Cassandra.
author: IriaOsara
ms.author: iriaosara
ms.service: managed-instance-apache-cassandra
ms.topic: how-to
ms.date: 11/17/2023


---

# Write-through cache in Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra now has a write-through cache (preview) feature through the use of L-series virtual machines (VMs). This implementation can help you minimize tail latency and enhance read performance, particularly for read-intensive workloads. [These specific VM types](best-practice-performance.md#cpu-performance) are equipped with locally attached disks to increase input/output operations per second (IOPS) for read operations and to reduce tail latency.

> [!IMPORTANT]
> Write-through cache is in public preview. This feature is provided without a service-level agreement, and we don't recommend it for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Benefits of using write-through cache

- **Reduced tail latency**: This implementation focuses on minimizing tail latency to enhance the user experience, particularly in time-sensitive applications, by reducing delays in read operations.

- **Optimization of read-intensive workloads**: This implementation is for scenarios with heavy read workloads. The design specifically targets and improves read performance. It acknowledges the demands of applications where frequent read operations are the norm.

- **Empowerment of localized disks**: The designated VM types feature locally attached disks, a key element that empowers architecture with increased IOPS for read operations. This design choice aims to optimize the efficiency and responsiveness of data retrieval.

- **Increased IOPS**: Locally attached nonvolatile memory express (NVMe) disks boost IOPS for reads and reduce tail latency. This implementation seeks to provide a comprehensive solution that addresses performance bottlenecks for read-intensive workloads.

## How to access L-series VMs

For existing Azure Managed Instance for Apache Cassandra clusters, you can access L-series VMs by adding a new datacenter:

1. On the **Data Center** pane, select the **Add** button.

    :::image type="content" source="./media/write-through-cache/add-datacenter-page-1.png" alt-text="Screenshot of selections for adding a new datacenter." lightbox="./media/write-through-cache/add-datacenter-page-1.png" border="true":::

1. In the **Sku Size** box, select your preferred L-series VM type.

    :::image type="content" source="./media/write-through-cache/add-datacenter-page-2.png" alt-text="Screenshot of the requirements for a new datacenter." lightbox="./media/write-through-cache/add-datacenter-page-2.png" border="true":::

    > [!NOTE]
    > You can access new features of automatic replication when you're adding a new datacenter. [Learn more](create-cluster-portal.md#turnkey-replication).

1. After you create the datacenter, confirm that it appears in your list of datacenters.

     :::image type="content" source="./media/write-through-cache/new-datacenter.png" alt-text="Screenshot of a newly created datacenter." lightbox="./media/write-through-cache/new-datacenter.png" border="true":::

## Read-intensive scenario with write-through cache

The following analysis explores a sample test that compares the IOPS and latency between premium managed disks and NVMe for reads. Through a detailed examination of performance metrics in this comparison, you can get valuable insights into the effectiveness of write-through cache for locally attached NVMe disks.

### IOPS for premium managed disks and local NVMe disks

The following example shows the IOPS of a RAID 0 array with four premium managed disks (present-day configuration).

:::image type="content" source="./media/write-through-cache/premium-disk-iops.png" alt-text="Screenshot of an IOPS test that uses premium disks." lightbox="./media/write-through-cache/premium-disk-iops.png" border="true":::

The following example shows the IOPS of a RAID 1 array with local NVMe disks and premium managed disks.

:::image type="content" source="./media/write-through-cache/nvme-disk-iops.png" alt-text="Screenshot of an IOPS test that uses local NVMe disks." lightbox="./media/write-through-cache/nvme-disk-iops.png" border="true":::

The example that uses locally attached NVMe disks has a better read performance of 248K IOPS.

### Latency for premium managed disks and local NVMe disks

The following example shows the throughput of a RAID 0 array with four premium managed disks (present-day configuration).

:::image type="content" source="./media/write-through-cache/premium-disk-throughput.png" alt-text="Screenshot of a latency test that uses premium disks." lightbox="./media/write-through-cache/premium-disk-throughput.png" border="true":::

The following example shows the throughput of a RAID 1 array with local NVMe disks and premium managed disks.

:::image type="content" source="./media/write-through-cache/nvme-disk-throughput.png" alt-text="Screenshot of a throughput test that uses NVMe disks." lightbox="./media/write-through-cache/nvme-disk-throughput.png" border="true":::

The example that uses locally attached NVMe disks has a higher throughput capacity performance of 14.9 Gbps.

> [!NOTE]
> Local disks are ephemeral and might be lost. But data stays intact in the network-attached premium managed disks, because we mirror data between them by using RAID technology. You can monitor the health of the RAID array through [Azure Monitor metrics](monitor-clusters.md) of `RaidArrayDegradedMetric` and `RaidArrayRebuildMetric`.

## Next steps

- [Configure a hybrid cluster with Azure Managed Instance for Apache Cassandra by using Client Configurator](configure-hybrid-cluster.md)
