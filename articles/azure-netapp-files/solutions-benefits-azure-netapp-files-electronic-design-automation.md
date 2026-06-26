---
title: Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)
description: Explains the solution Azure NetApp Files provides for meeting the needs of the semiconductor and chip design industry. Presents test scenarios running a standard industry benchmark for electronic design automation (EDA) using Azure NetApp Files.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: concept-article
ms.date: 10/13/2025
ms.author: anfdocs
# Customer intent: As an EDA engineer, I want to utilize Azure NetApp Files for scalable storage solutions, so that I can improve workload performance and reduce time to market for semiconductor designs.
---
# Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)

Innovation is an identifying hallmark of the semiconductor industry. Such innovation allowed Gordon Moore's 1965 tenet known as Moore's Law to hold true for more than fifty years, namely that one can expect processing speeds to double approximately every year or two. For instance, innovation in the semiconductor industry has helped evolve Moore’s Law by stacking chips into smaller form factors to scale performance to once-unimaginable levels through parallelism.

Semiconductor (or Electronic Design Automation [EDA]) firms are most interested in time to market (TTM). TTM is often predicated upon the time it takes for workloads, such as chip design validation and pre-foundry work like tape-out to complete. TTM concerns also help keep EDA licensing costs down: less time spent on work means more time available for the licenses. That said, the more bandwidth and capacity available to the server farm, the better.

Azure NetApp Files helps reduce the time EDA jobs take with a highly performant, parallelized file system solution: [Azure NetApp Files large volumes](large-volumes-requirements-considerations.md). Recent EDA benchmark tests show that a single large volume is 19 times more performant than previously achievable with a single Azure NetApp Files regular volume. Also, when multiple large volumes are added and sufficient compute and storage resources are available in co-located setup, the architecture can scale seamlessly.  

For the most demanding EDA workloads, Azure NetApp Files also supports large volume Breakthrough mode, which extends the performance characteristics of large volumes by enabling significantly higher throughput and operations per second from a single volume.

Breakthrough mode is designed for large scale, metadata intensive EDA workloads that exceed the performance limits of regular and standard large volumes, while maintaining predictable, low latency access.

The Azure NetApp Files large volumes feature is ideal for the storage needs of this most demanding industry, namely:

* **Large capacity single namespace:** Each volume offers up to 1 PiB of usable capacity under a single mount point. You can [request a 2 PiB large volume](large-volumes-requirements-considerations.md).

* **High I/O rate, low latency:** In testing using an EDA simulation benchmark, a single large volume delivered over 740K storage IOPS with less than 2 milliseconds of application latency. In a typical EDA workload, IOPS consists of a mixture of file creates, reads, writes, and a significant amount of other metadata operations. This result is considered to be enterprise-grade performance for many customers. This performance improvement is made possible by the way large volumes are able to parallelize incoming write operations across storage resources in Azure NetApp Files. Though many firms require 2ms or better response time, chip design tools can tolerate higher latency than this without impact on business. 

* **At 792,046 operations per second:** the performance edge of a single large volume - the application layer peaked at 2.4ms of latency in our tests, which shows that more operations are possible in a single large volume at a slight cost of latency. 

Tests conducted using an EDA benchmark found that with a single regular Azure NetApp Files volume, workload as high as 40,000 IOPS could be achieved at the 2ms mark, and 50,000 at the edge. See the following table and chart for regular and one large volume configuration side-by-side overview.


| Scenario | I/O Rate at 2ms latency | I/O Rate at performance edge (~3 ms) | MiB/s at 2ms latency | MiB/s performance edge (~7 ms) | 
| - | - | - | - | - |
| One regular volume | 39,601  | 49,502 | 692 | 866  |
| One large volume  | 742,541 | 742,541  | 11,699 | 12,480  |

The following chart illustrates the test results. 

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph-single-volume.png" alt-text="Chart comparing latency and throughput between large and regular volumes." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph-single-volume.png":::

A single Large Volume outperforms the scenario with six regular volumes by 249%. With six large volumes, the performance scaling was linear when compared to a single large volume. The following table and chart illustrate the results for six regular volumes, one large volume, and six large volumes: 


| Scenario	| I/O Rate at 2ms latency | I/O Rate at performance edge (~7ms) | MiB/s at 2ms latency | MiB/s performance edge (~7ms) |
| - | - | - | - | - | 
| Six regular volumes	| 255,613 | 317,000 | 4,577 | 5,688 |
| One large volume | 742,541 | 742,541 | 11,699 | 12,480 | 
| Six large volume | 4,435,382 | 4,745,453 | 69,892 | 74,694 |

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph-six-large-volumes.png" alt-text="Chart comparing latency and throughput between one large, one regular, and six large volumes." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph-six-large-volumes.png":::

## Large volume breakthrough mode – Extreme performance for EDA

Azure NetApp Files large volume breakthrough mode delivers industry-leading performance for the most demanding EDA environments by provisioning multiple dedicated storage endpoints on dedicated backend capacity for a single large volume.

This architecture parallelizes I/O operations across endpoints, enabling substantially higher throughput and IOPS compared to standard large volumes, while preserving low and consistent latency.

The key characteristics of large volume breakthrough mode

* Support for volumes up to 2 PiB of capacity
* Up to 50 GiB/s throughput from a single volume
* Up to ~2 million operations per second, ideal for metadata heavy EDA front end workloads
* Consistently sub millisecond latency maintained under load
* Near linear performance scaling when additional large volumes are added, provided sufficient compute and network resources are available

## When to use Breakthrough mode

Use large volume Breakthrough mode for:

* Large-scale regression testing with thousands of concurrent simulation jobs
* Workloads with very high file counts and metadata churn
* Single namespace deployments where distributing data across many volumes increases operational complexity
* High performance workloads requiring predictable throughput and latency at scale

> [!IMPORTANT]
> Availability of large volumes and large volume Breakthrough mode depends on backend storage capacity and regional availability.

While Azure NetApp Files supports large volumes up to published limits, it doesn't guarantee capacity availability for all volume sizes or regions. Customers planning volume sizes beyond 50 TiB or Breakthrough mode usage should engage their Microsoft account team or Azure NetApp Files support early to validate feasibility and deployment timelines.

Tests conducted using an EDA benchmark found that with a single Azure NetApp Files large volume in breakthrough mode, you can achieve a workload as high as 1,296,040 IOPS at the 2ms mark. 

The following table and chart illustrate the results for one large volume in breakthrough mode, and six large volumes in breakthrough mode.

| Scenario	| I/O Rate at 2ms latency | MiB/s at 2ms latency | 
| - | - | - | 
| One large volume in breakthrough mode	| 1,296,040| 20,910 | 
| Six large volumes in breakthrough mode | 7,776,697 | 125,474 | 

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/large-volumes-breakthrough-mode.png" alt-text="Diagram of large volumes in breakthrough mode." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/large-volumes-breakthrough-mode.png":::

## Simplicity at scale

With large volume, and especially with breakthrough mode, performance is only part of the story. Operation simplicity at scale is equally critical for EDA environments.

## Seamless scaling

The results demonstrate that Azure NetApp Files delivers horizontal scalability for both throughput and operations per second. Each large volume deploys a dedicated storage endpoint, which enables performance to scale linearly without sacrificing latency. Breakthrough mode extends this capability by enabling multiple dedicated endpoints per volume, simplifying network and mount management while delivering predictable performance for the largest EDA environments.

| Metric	| Large volume | Large volume scale | Factor | Large volume breakthrough | Large volume Breakthrough scale | Factor |
| - | - | - | - |  - | - | - | 
| Throughput (MB/s)	| 12,780 | 76,487 | 5.98 | 20,910 | 125,474 | 6.00 |
| Operations/second | 792,046 | 4,745,453 | 5.99 |  1,296,040 | 7,776,697 | 6.00 |

## Testing tool

The EDA workload in this test was generated using a standard industry benchmark tool. It simulates a mixture of EDA applications used to design semiconductor chips. The EDA workload distribution is as such:

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/pie-chart-large-volume.png" alt-text="Pie chart depicting frontend OP type." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/pie-chart-large-volume.png":::

| EDA Frontend OP Type	| Percentage of Total |
| - | - | 
| Stat | 39% |
| Access | 15% | 
| Random_write | 15% | 
| Write_file | 10% |
| Random_read |	8% | 
| Read_file | 7% |
| Create | 2% | 
| Chmod	| 1% |
| Mkdir | 1% |
| Ulink | 1% |
| Ulink2 | 1% |
| <ul><li>Append</li><li>Custom2</li><li>Lock</li><li>Mmap_read</li><li> Mmap_write</li><li> Neg_stat</li><li> Read_modify_write</li> Rmdir </li><li> Write	</li></ul> | 0% | 

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/pie-chart-backend.png" alt-text="Pie chart depicting backend OP type distribution." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/pie-chart-backend.png":::

| EDA Backend OP Type | Percentage of Total |
| - | - | 
| Read | 50% | 
| Write | 50% | 
|  <ul><li>Custom2</li><li>Mmap_read</li><li>Random_read</li><li>Read_file</li><li>Read_modify_file</li></ul> | 0% | 

## Test configuration 

The results were produced using the following configuration details:

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/single-large-volume-setup.png" alt-text="Architecture diagram for single large volume." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/single-large-volume-setup.png":::

| Component | Configuration |
| - | - | 
| Operating System	| Red Hat Enterprise Linux |
| Instance Type	| D16s_v5/D32s_v5 |
| Instance  Count | 10 |
| Mount Options | nocto,actimeo=600, hard, rsize=262144,  wsize=262144, vers=3, tcp, noatime, nconnect=8 |
| Client tunables | <code># Network parameters. In unit of bytes <br> net.core.wmem_max = 16777216 <br> net.core.wmem_default = 1048576 <br> net.core.rmem_max = 16777216 <br> net.core.rmem_default = 1048576 <br> net.ipv4.tcp_rmem = 1048576 8388608 16777216 <br> net.ipv4.tcp_wmem = 1048576 8388608 16777216 <br> net.core.optmem_max = 4194304 <br> net.core.somaxconn = 65535 <br> <br> # Settings in 4 KiB size chunks, in bytes they are <br> net.ipv4.tcp_mem = 4096 89600 8388608 <br><br> # Misc network options and flags <br>net.ipv4.tcp_window_scaling = 1 <br> net.ipv4.tcp_timestamps = 0 <br> net.ipv4. <br> tcp_no_metrics_save = 1 <br> net.ipv4.route.flush = 1 <br> net.ipv4.tcp_low_latency = 1 <br> net.ipv4.ip_local_port_range = 1024 65000 <br> net.ipv4.tcp_slow_start_after_idle = 0 <br> net.core.netdev_max_backlog = 300000 <br> net.ipv4.tcp_sack = 0 <br> net.ipv4.tcp_dsack = 0 <br> net.ipv4.tcp_fack = 0 <br><br># Various filesystem / pagecache options <br> vm.dirty_expire_centisecs = 30000 <br> vm.dirty_writeback_centisecs = 30000 |

Mount options `nocto`, `noatime`, and `actimeo=600` work together to alleviate the effect of some metadata operations for an EDA workload over the NFSv3 protocol. These mount options both reduce the number of metadata operations taking place and cache some metadata attributes on the client allowing EDA workloads to push further than it would otherwise. It's essential to consider individual workload requirements as these mount options aren't universally applicable. For more information, see [Linux NFS mount options best practices for Azure NetApp File](performance-linux-mount-options.md).

For the six large volume tests, the same configuration was replicated in six Azure availability zones, spread across four Azure regions. Each zone was identically configured with ten virtual machines and one large volume each co-located in one availability zone. Azure’s Virtual Network peering connected the virtual networks across the regions/zones so we could execute a single benchmark run that spanned all the clients simultaneously.

For the large volume breakthrough mode tests, VM scale sets deployed the VMs and workload generators mount one of the six storage endpoints in each of the VMs.

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/benchmark-configuration-single-large-volume.png" alt-text="Architecture diagram for benchmark configuration of a single large volume." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/benchmark-configuration-single-large-volume.png":::

For the six large volume breakthrough tests, the same configuration was replicated in six Azure availability zones, spread across different Azure regions.

## Summary

EDA workloads require file storage that can handle high file counts, large capacity, and a large number of parallel operations across potentially thousands of client workstations. EDA workloads also need to perform at a level that reduces the time it takes for testing and validation to complete, which leads to saving money on licenses and expediting time to market the latest and greatest chipsets. Azure NetApp Files large volumes and large volume Breakthrough mode for extreme performance can handle the demands of an EDA workload with performance comparable to what you'd see in on-premises deployments.

## Next steps

* [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md)
* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Azure Modeling and Simulation Workbench (preview) documentation](../modeling-simulation-workbench/index.yml)