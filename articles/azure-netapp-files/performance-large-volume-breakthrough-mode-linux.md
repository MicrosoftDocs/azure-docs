---
title: Azure NetApp Files large volume breakthrough mode performance benchmarks for Linux
description: Describes the tested performance capabilities of a single Azure NetApp Files large volume breakthrough mode as it pertains to Linux use cases.
services: azure-netapp-files
author: netapp-manishc
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.custom: linux-related-content
ms.topic: concept-article
ms.date: 11/05/2025
ms.author: anfdocs
# Customer intent: As a cloud architect, I want to understand the performance benchmarks of Azure NetApp Files large volumes breakthrough mode for Linux use cases, so that I can optimize volume sizing and workload configurations for our applications.
---
# Azure NetApp Files large volume breakthrough mode performance benchmarks for Linux

This article describes the tested performance capabilities of a single Azure NetApp Files large volume breakthrough mode as it pertains to Linux use cases. The tests explored scenarios for both scale-out read and write workloads. Knowing the performance envelope of large volumes breakthrough mode helps you facilitate volume sizing. 

## Testing summary

* The Azure NetApp Files large volumes feature offers four service levels each with throughput limits. The service levels can be scaled up or down non disruptively as your performance needs change. 

    * Standard, Premium, and Ultra service levels. 
    * [Flexible service](azure-netapp-files-service-levels.md#Flexible): The Flexible service level enables you to adjust throughput and size limits independently for capacity pools using manual QoS. 

    Flexible Service Level was used in these tests.

* Metadata-heavy workloads are advantageous for Azure NetApp File large volumes breakthrough mode due to the large volume breakthrough modes’ increased parallelism. Performance benefits are noticeable in workloads heavy in file creation, unlink, and file renames which are typical of EDA workloads with high file counts. For more information on performance of high metadata workloads, see [Benefits of using Azure NetApp Files for electronic design automation](solutions-benefits-azure-netapp-files-electronic-design-automation.md).

* [FIO](https://fio.readthedocs.io/en/latest/fio_doc.html), a synthetic workload generator designed as a storage stress test, was used to drive these test results. There are fundamentally two models of storage performance testing: 

    * **Scale-out compute**, which refers to using multiple VMs to generate the maximum load possible on a single Azure NetApp Files volume. 

    * **Scale-up compute**, which refers to using a large VM to test the upper boundaries of a single client on a single Azure NetApp Files volume. 

For Large volume breakthrough mode, only the scale-out tests were performed to ascertain the performance of a single large volume in break through mode. 


##  Linux scale-out tests on large volume breakthrough mode 

Tests were conducted with the following configuration: 

| Component | Configuration |  
|- | - |
| Azure VM size | E32s_v5 |
| Azure VM egress bandwidth limit | 2000MiB/s (2GiB/s) |
| Operating system | RHEL 9.4 |
| Large volume size | 50 TiB FSL (50,560 MiB/s throughput)  |
| Mount options | `hard, rsize=262144, wsize=262144, vers=3, tcp, nconnect=8` |

### 256-KiB sequential workloads (MiB/s) 

The graph represents a 256-KiB sequential workload using twelve virtual machines reading and writing to a single large volume in breakthrough mode using a 1-TiB working set. The graph shows that a single Azure NetApp Files large volume in breakthrough mode can handle between approximately 50,000 MiB/s pure sequential reads and 21,202 MiB/s pure sequential writes. 

:::image type="content" source="./media/performance-large-volumes-linux/sequential-reads-breakthrough-mode.png" alt-text="Bar chart of a 256-KiB sequential workload on a large volume breakthrough mode." lightbox="./media/performance-large-volumes-linux/sequential-reads-breakthrough-mode.png":::

### 8-KiB random workload (IOPS)

The graph represents an 8-KiB random workload and a 1 TiB working set. The graph shows that an Azure NetApp Files large volume in breakthrough mode can handle between approximately 1,800,000 pure random read IOs and 994,384 pure random writes IOs approximately. 

:::image type="content" source="./media/performance-large-volumes-linux/random-workload-chart-breakthrough-mode.png" alt-text="Bar chart of a random workload on a large volume breakthrough mode." lightbox="./media/performance-large-volumes-linux/random-workload-chart-breakthrough-mode.png":::

## Summary 

The FIO scale-out test results demonstrate that Azure NetApp Files large volume breakthrough mode is exceptionally well-suited for EDA workloads, which demand file storage, capable of handling high file counts, substantial capacity, and extensive parallel operations across thousands of client workstations. 

## Next steps

* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Benefits of using Azure NetApp Files for electronic design automation](solutions-benefits-azure-netapp-files-electronic-design-automation.md)