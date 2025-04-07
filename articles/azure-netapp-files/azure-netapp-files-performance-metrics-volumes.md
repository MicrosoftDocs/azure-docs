---
title: Recommended performance benchmark tests - Azure NetApp Files
description: Learn about benchmark testing recommendations for volume performance and metrics using Azure NetApp Files.
author: b-hchen
ms.author: anfdocs
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/31/2024
---
# Performance benchmark test recommendations for Azure NetApp Files

This article provides benchmark testing recommendations for volume performance and metrics using Azure NetApp Files.

## Overview

To understand the performance characteristics of an Azure NetApp Files volume, you can use the open-source tool [FIO](https://github.com/axboe/fio) to run a series of benchmarks to simulate various workloads. FIO can be installed on both Linux and Windows-based operating systems.  It is an excellent tool to get a quick snapshot of both IOPS and throughput for a volume.

> [!IMPORTANT]
> Azure NetApp Files does *not* recommend using the `dd` utility as a baseline benchmarking tool. You should use an actual application workload, workload simulation, and benchmarking and analyzing tools (for example, Oracle AWR with Oracle, or the IBM equivalent for Db2) to establish and analyze optimal infrastructure performance. Tools such as FIO, vdbench, and iometer have their places in determining virtual machines to storage limits, matching the parameters of the test to the actual application workload mixtures for most useful results. However, it is always best to test with the real-world application. 
 
### Virtual machine (VM) instance sizing

For best results, ensure that you are using a virtual machine (VM) instance that is appropriately sized to perform the tests. The following examples use a Standard_D32s_v3 instance. For more information about VM instance sizes, see [Sizes for Windows virtual machines in Azure](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-network%2ftoc.json) for Windows-based VMs, and [Sizes for Linux virtual machines in Azure](/azure/virtual-machines/sizes?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) for Linux-based VMs.

### Azure NetApp Files volume sizing

Ensure that you choose the correct service level and volume quota size for the expected performance level. For more information, see [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md).

### Virtual network (VNet) recommendations

You should perform the benchmark testing in the same VNet as Azure NetApp Files. The example below demonstrates the recommendation:

![VNet recommendations](./media/azure-netapp-files-performance-metrics-volumes/azure-netapp-files-benchmark-testing-vnet.png)

## Performance benchmarking tools

This section provides details about a few benchmarking tools. 

### SSB

SQL Storage Benchmark (SSB) is an open-source benchmark tool written in Python. It is designed to generate a "real-world" workload that emulates database interaction in such a way to measure the performance of the storage subsystem. 

The intent of SSB is to allow organizations and individuals to measure the performance of their storage subsystem under the stress of a SQL database workload.

#### Installation of SSB 

Follow the Getting started section in the SSB README file to install for the platform of your choice.

### FIO 

Flexible I/O Tester (FIO) is a free and open-source disk I/O tool used both for benchmark and stress/hardware verification. FIO is available in binary format for both Linux and Windows. 

For more information, see [Understand Azure NetApp Files testing methodology](testing-methodology.md).

## Volume metrics

Azure NetApp Files performance data is available through Azure Monitor counters. The counters are available via the Azure portal and REST API GET requests. 

You can view historical data for the following information:
* Average read latency 
* Average write latency 
* Read IOPS (average)
* Write IOPS (average)
* Volume logical size (average)
* Volume snapshot size (average)

### Using Azure Monitor 

You can access Azure NetApp Files counters on a per-volume basis from the Metrics page, as shown below:

![Azure Monitor metrics](./media/azure-netapp-files-performance-metrics-volumes/azure-netapp-files-benchmark-monitor-metrics.png)

You can also create a dashboard in Azure Monitor for Azure NetApp Files by going to the Metrics page, filtering for NetApp, and specifying the volume counters of interest: 

![Azure Monitor dashboard](./media/azure-netapp-files-performance-metrics-volumes/azure-netapp-files-benchmark-monitor-dashboard.png)

### Azure Monitor API access

You can access Azure NetApp Files counters by using REST API calls. See [Supported metrics with Azure Monitor: Microsoft.NetApp/netAppAccounts/capacityPools/Volumes](/azure/azure-monitor/essentials/metrics-supported#microsoftnetappnetappaccountscapacitypoolsvolumes) for counters for capacity pools and volumes.

The following example shows a GET URL for viewing logical volume size:

`#get ANF volume usage`  
`curl -X GET -H "Authorization: Bearer TOKENGOESHERE" -H "Content-Type: application/json" https://management.azure.com/subscriptions/<subscritionID>/resourceGroups/<resourceGroup>/providers/Microsoft.NetApp/netAppAccounts/<AzureNetAppFilesAccount>/capacityPools/<CapacityPool>/Volumes/<volume>/providers/microsoft.insights/metrics?api-version=2018-01-01&metricnames=VolumeLogicalSize`


## Next steps

- [Service levels for Azure NetApp Files](azure-netapp-files-service-levels.md)
- [Performance benchmarks for Linux](performance-benchmarks-linux.md)
- [Understand Azure NetApp Files testing methodology](testing-methodology.md)