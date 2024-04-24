---
title: Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)
description: Explains the solution Azure NetApp Files provides for meeting the needs of the semiconductor and chip design industry. Presents test scenarios running a standard industry benchmark for electronic design automation (EDA) using Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 03/19/2024
ms.author: anfdocs
---
# Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)

Innovation is an identifying hallmark of the semiconductor industry. Such innovation allowed Gordon Moore's 1965 tenet known as Moore's Law to hold true for more than fifty years, namely that one can expect processing speeds to double approximately every year or two. For instance, innovation in the semiconductor industry has helped evolve Moore’s Law by stacking chips into smaller form factors to scale performance to once-unimaginable levels through parallelism. 

Semiconductor (or Electronic Design Automation [EDA]) firms are most interested in time to market (TTM). TTM is often predicated upon the time it takes for workloads, such as chip design validation and pre-foundry work like tape-out to complete. TTM concerns also help keeps EDA licensing costs down: less time spent on work means more time available for the licenses. That said, the more bandwidth and capacity available to the server farm, the better. 

Azure NetApp Files helps reduce the time EDA jobs take with a highly performant, parallelized file system solution: [Azure NetApp Files large volumes](large-volumes-requirements-considerations.md). Recent EDA benchmark tests show that a single large volume is 20 times more performant than previously achievable with a single Azure NetApp Files regular volume.  

The Azure NetApp Files large volumes feature is ideal for the storage needs of this most demanding industry, namely:  

* **Large capacity single namespace:** Each volume offers from up to 500TiB of usable capacity under a single mount point. 

* **High I/O rate, low latency:** In testing using an EDA simulation benchmark, a single large volume delivered over 650K storage IOPS with less than 2 milliseconds of application latency. In a typical EDA workload, IOPS consists of a mixture or file creates, reads, writes, and a significant amount of other metadata operation. This result is considered to be enterprise-grade performance for many customers. This performance improvement is made possible by the way large volumes are able to parallelize incoming write operations across storage resources in Azure NetApp Files. Though many firms require 2ms or better response time, chip design tools can tolerate higher latency than this without impact to business.  

* **At 826,000 operations per second:** the performance edge of a single large volume - the application layer peaked at 7ms of latency in our tests, which shows that more operations are possible in a single large volume at a slight cost of latency. 

Tests conducted internally using an EDA benchmark in 2020 found that with a single regular Azure NetApp Files volume, workload as high as 40,000 IOPS could be achieved at the 2ms mark, and 50,000 at the edge.   


| Scenario | I/O Rate at 2ms latency | I/O Rate at performance edge (~7 ms) | MiB/s at 2ms latency | MiB/s performance edge (~7 ms) | 
| - | - | - | - | - |
| One regular volume | 39,601  | 49,502 | 692 | 866  |
|  large volume  | 652,260 | 826,379  | 10,030 | 12,610  |

The following chart illustrates the test results. 

:::image type="content" source="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph.png" alt-text="Chart comparing latency and throughput between large and regular volumes." lightbox="./media/solutions-benefits-azure-netapp-files-electronic-design-automation/latency-throughput-graph.png":::

The 2020 internal testing also explored single endpoint limits, the limits were reached with six volumes. Large Volume outperforms the scenario with six regular volumes by 260%.

| Scenario	| I/O Rate at 2ms latency | I/O Rate at performance edge (~7ms) | MiB/s at 2ms latency | MiB/s performance edge (~7ms) |
| - | - | - | - | - | 
| Six regular volumes	| 255,613 | 317,000 | 4,577 | 5,688 |
| One large volume | 652,260 | 826,379 | 10,030 | 12,610 | 


## Simplicity at scale

With a large volume, performance isn't the entire story. Simple performance is the end goal. Customers prefer a single namespace/mount point as opposed to managing multiple volumes for ease of use and application management. 

## Testing tool

The EDA workload in this test was generated using a standard industry benchmark tool. It simulates a mixture of EDA applications used to design semiconductor chips.  The EDA workload distribution is as such:

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

The results were produced using the below configuration details:

| Component | Configuration |
| - | - | 
| Operating System	| RHEL 9.3 / RHEL 8.7 |
| Instance Type	| D16s_v5 |
| Instance  Count | 10 |
| Mount Options | nocto,actimeo=600,hard,rsize=262144,wsize=262144,vers=3,tcp,noatime,nconnect=8 |
| Client tunables | <code># Network parameters. In unit of bytes <br> net.core.wmem_max = 16777216 <br> net.core.wmem_default = 1048576 <br> net.core.rmem_max = 16777216 <br> net.core.rmem_default = 1048576 <br> net.ipv4.tcp_rmem = 1048576 8388608 16777216 <br> net.ipv4.tcp_wmem = 1048576 8388608 16777216 <br> net.core.optmem_max = 2048000 <br> net.core.somaxconn = 65535 <br> <br> # Settings in 4 KiB size chunks, in bytes they are <br> net.ipv4.tcp_mem = 4096 89600 4194304 <br><br> # Misc network options and flags <br>net.ipv4.tcp_window_scaling = 1 <br> net.ipv4.tcp_timestamps = 0 <br> net.ipv4. <br> tcp_no_metrics_save = 1 <br> net.ipv4.route.flush = 1 <br> net.ipv4.tcp_low_latency = 1 <br> net.ipv4.ip_local_port_range = 1024 65000 <br> net.ipv4.tcp_slow_start_after_idle = 0 <br> net.core.netdev_max_backlog = 300000 <br> net.ipv4.tcp_sack = 0 <br> net.ipv4.tcp_dsack = 0 <br> net.ipv4.tcp_fack = 0 <br><br># Various filesystem / pagecache options <br> vm.dirty_expire_centisecs = 100 <br> vm.dirty_writeback_centisecs = 100 <br> vm.dirty_ratio = 20 <br> vm.dirty_background_ratio = 5 <br><br> # ONTAP network exec tuning for client <br> sunrpc.tcp_max_slot_table_entries = 128 <br> sunrpc.tcp_slot_table_entries = 128 </code> |

Mount options `nocto`, `noatime`, and `actimeo=600` work together to alleviate the effect of some metadata operations for an EDA workload over the NFSv3 protocol. These mount options both reduce the number of metadata operations taking place and cache some metadata attributes on the client allowing EDA workloads to push further than it would otherwise. It's essential to consider individual workload requirements as these mount options aren't universally applicable. For more information, see [Linux NFS mount options best practices for Azure NetApp File](performance-linux-mount-options.md).

## Summary

EDA workloads require file storage that can handle high file counts, large capacity, and a large number of parallel operations across potentially thousands of client workstations. EDA workloads also need to perform at a level that reduces the time it takes for testing and validation to complete so to save money on licenses and to expedite time to market for the latest and greatest chipsets. Azure NetApp Files large volumes can handle the demands of an EDA workload with performance comparable to what would be seen in on-premises deployments.

## Next steps

* [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md)
* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Azure Modeling and Simulation Workbench (preview) documentation](../modeling-simulation-workbench/index.yml)