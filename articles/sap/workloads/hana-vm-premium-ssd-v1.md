---
title: SAP HANA Azure virtual machine premium storage configurations | Microsoft Docs
description: Storage recommendations HANA using premium storage.
author: msjuergent
manager: bburns
tags: azure-resource-manager
keywords: 'SAP, Azure HANA, Storage Ultra disk, Premium storage'
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 08/30/2023
ms.author: juergent
ms.custom: H1Hack27Feb2017
---

# SAP HANA Azure virtual machine Premium SSD storage configurations
This document is about HANA storage configurations for Azure premium storage or premium ssd as it was introduced years back as low latency storage for DBMS and other applications that need low latency storage. For general considerations around stripe sizes when using LVM, HANA data volume partitioning or other considerations that are independent of the particular storage type, check these two documents:

- [SAP HANA Azure virtual machine storage configurations](./hana-vm-operations-storage.md)
- [Azure Storage types for SAP workload](./planning-guide-storage.md)


> [!IMPORTANT]
> The suggestions for the storage configurations in this document are meant as directions to start with. Running workload and analyzing storage utilization patterns, you might realize that you aren't utilizing all the storage bandwidth or IOPS provided. You might consider downsizing on storage then. Or in contrary, your workload might need more storage throughput than suggested with these configurations. As a result, you might need to deploy more capacity, IOPS or throughput. In the field of tension between storage capacity required, storage latency needed, storage throughput and IOPS required and least expensive configuration, Azure offers enough different storage types with different capabilities and different price points to find and adjust to the right compromise for you and your HANA workload.

## Solutions with premium storage and Azure Write Accelerator for Azure M-Series virtual machines
Azure Write Accelerator is a functionality that is available for Azure M-Series VMs exclusively in combination with Azure premium storage. As the name states, the purpose of the functionality is to improve I/O latency of writes against the Azure premium storage. For SAP HANA, Write Accelerator is supposed to be used against the **/hana/log** volume only. Therefore,  the **/hana/data** and **/hana/log** are separate volumes with Azure Write Accelerator supporting the **/hana/log** volume only. 

> [!IMPORTANT]
> When using Azure premium storage, the usage of Azure [Write Accelerator](../../virtual-machines/how-to-enable-write-accelerator.md) for the **/hana/log** volume is mandatory. Write Accelerator is available for premium storage and M-Series and Mv2-Series VMs only. Write Accelerator is not working in combination with other Azure VM families, like Esv3 or Edsv4.

The caching recommendations for Azure premium disks below are assuming the I/O characteristics for SAP HANA that list like:

- There hardly is any read workload against the HANA data files. Exceptions are large sized I/Os after restart of the HANA instance or when data is loaded into HANA. Another case of larger read I/Os against data files can be HANA database backups. As a result read caching mostly doesn't make sense since in most of the cases, all data file volumes need to be read completely. 
- Writing against the data files is experienced in bursts based by HANA savepoints and HANA crash recovery. Writing savepoints is asynchronous and aren't holding up any user transactions. Writing data during crash recovery is performance critical in order to get the system responding fast again. However, crash recovery should be rather exceptional situations
- There are hardly any reads from the HANA redo files. Exceptions are large I/Os when performing transaction log backups, crash recovery, or in the restart phase of a HANA instance.  
- Main load against the SAP HANA redo log file is writes. Dependent on the nature of workload, you can have I/Os as small as 4 KB or in other cases I/O sizes of 1 MB or more. Write latency against the SAP HANA redo log is performance critical.
- All writes need to be persisted on disk in a reliable fashion

**Recommendation: As a result of these observed I/O patterns by SAP HANA, the caching for the different volumes using Azure premium storage should be set like:**

- **/hana/data** - None or read caching
- **/hana/log** - None. Enable Write Accelerator for M- and Mv2-Series VMs, the option in the Azure portal is "None + Write Accelerator."
- **/hana/shared** - read caching
- **OS disk** - don't change default caching that is set by Azure at creation time of the VM


### Azure burst functionality for premium storage
For Azure premium storage disks smaller or equal to 512 GiB in capacity, burst functionality is offered. The exact way how disk bursting works is described in the article [Disk bursting](../../virtual-machines/disk-bursting.md). When you read the article, you understand the concept of accruing IOPS and throughput in the times when your I/O workload is below the nominal IOPS and throughput of the disks (for details on the nominal throughput see [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/)). You're going to accrue the delta of IOPS and throughput between your current usage and the nominal values of the disk. The bursts  are limited to a maximum of 30 minutes.

The ideal cases where this burst functionality can be planned in is likely going to be the volumes or disks that contain data files for the different DBMS. The I/O workload expected against those volumes, especially with small to mid-ranged systems is expected to look like:

- Low to moderate read workload since data ideally is cached in memory, or like with SAP HANA should be completely in memory
- Bursts of write triggered by database checkpoints or savepoints that are issued on a regular basis
- Backup workload that reads in a continuous stream in cases where backups aren't executed via storage snapshots
- For SAP HANA, load of the data into memory after an instance restart

Especially on smaller DBMS systems where your workload is handling a few hundred transactions per seconds only, such a burst functionality can make sense as well for the disks or volumes that store the transaction or redo log. Expected workload against such a disk or volumes looks like:

- Regular writes to the disk that are dependent on the workload and the nature of workload since every commit issued by the application is likely to trigger an I/O operation
- Higher workload in throughput for cases of operational tasks, like creating or rebuilding indexes
- Read bursts when performing transaction log or redo log backups


### Production recommended storage solution based on Azure premium storage

> [!IMPORTANT]
> SAP HANA certification for Azure M-Series virtual machines is exclusively with Azure Write Accelerator for the **/hana/log** volume. As a result, production scenario SAP HANA deployments on Azure M-Series virtual machines are expected to be configured with Azure Write Accelerator for the **/hana/log** volume.  

> [!NOTE]
> In scenarios that involve Azure premium storage, we are implementing burst capabilities into the configuration. As you're using storage test tools of whatever shape or form, keep the way [Azure premium disk bursting works](../../virtual-machines/disk-bursting.md) in mind. Running the storage tests delivered through the SAP HWCCT or HCMT tool, we aren't expecting that all tests will pass the criteria since some of the tests will exceed the bursting credits you can accumulate. Especially when all the tests run sequentially without break.

> [!NOTE]
> With M32ts and M32ls VMs it can happen that disk throughput could be lower than expected using HCMT/HWCCT disk tests. Even with disk bursting or with sufficiently provisioned I/O throughput of the underlying disks. Root cause of the observed behavior was that the HCMT/HWCCT storage test files were completely cached in the read cache of the Premium storage data disks. This cache is located on the compute host that hosts the virtual machine and can cache the test files of HCMT/HWCCT completely. In such a case the quotas listed in the column **Max cached and temp storage throughput: IOPS/MBps (cache size in GiB)** in  the article [M-series](../../virtual-machines/m-series.md) are relevant. Specifically for M32ts and M32ls, the throughput quota against the read cache is only 400MB/sec. As a result of the tests files being completely cached, it is possible that despite disk bursting or higher provisioned I/O throughput, the tests can fall slightly short of 400MB/sec maximum throughput. As an alternative, you can test without read cache enabled on the Azure Premium storage data disks.


> [!NOTE]
> For production scenarios, check whether a certain VM type is supported for SAP HANA by SAP in the [SAP documentation for IAAS](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html).

**Recommendation: The recommended configurations with Azure premium storage for production scenarios look like:**

Configuration for SAP **/hana/data** volume:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- | 
| M32ts | 192 GiB | 500 MBps | 4 x P6 | 200 MBps | 680 MBps | 960 | 14,000 |
| M32ls | 256 GiB | 500 MBps | 4 x P6 | 200 MBps | 680 MBps | 960 | 14,000 |
| M64ls | 512 GiB | 1,000 MBps | 4 x P10 | 400 MBps | 680 MBps | 2,000 | 14,000 |
| M32dms_v2, M32ms_v2 | 875 GiB  | 500 MBps | 4 x P15 | 500 MBps | 680 MBps | 4,400 | 14,000 |
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps | 4 x P15 | 500 MBps | 680 MBps | 4,400 | 14,000 |
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 4 x P20 | 600 MBps | 680 MBps | 9,200 | 14,000 |  
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps | 4 x P20 | 600 MBps | 680 MBps | 9,200| 14,000 | 
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MBps | 4 x P20 | 600 MBps | 680 MBps | 9,200| 14,000 | 
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 4 x P30 | 800 MBps | no bursting | 20,000 | no bursting | 
| M192ims, M192idms_v2 | 4,096 GiB | 2,000 MBps | 4 x P30 | 800 MBps | no bursting | 20,000 | no bursting | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 4 x P30 | 800 MBps | no bursting | 20,000| no bursting | 
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 4 x P40 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M416s_v2 | 5,700 GiB | 2,000 MBps | 4 x P40 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M416s_8_v2 | 7,600 | 2,000 MBps | 4 x P40 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 4 x P50 | 1,000 MBps | no bursting | 30,000 | no bursting |
| M832ixs<sup>1</sup> | 14,902 GiB | larger than 2,000 Mbps | 4 x P60<sup>1</sup> | 2,000 MBps | no bursting | 64,000 | no bursting |
| M832ixs_v2<sup>1</sup> | 23,088 GiB | larger than 2,000 Mbps | 4 x P60<sup>1</sup> | 2,000 MBps | no bursting | 64,000 | no bursting |

<sup>1</sup> VM type not available by default. Please contact your Microsoft account team

<sup>2</sup> Maximum throughput provided by the VM and throughput requirement by SAP HANA workload, especially savepoint activity,  can force you to deploy significant more premium storage v1 capacity. 


For the **/hana/log** volume. the configuration would look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | **/hana/log** volume | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- | 
| M32ts | 192 GiB | 500 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M32ls | 256 GiB | 500 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M64ls | 512 GiB | 1,000 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 | 
| M32dms_v2, M32ms_v2 | 875 GiB | 500 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500| 
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500| 
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |
| M192idms_v2, M192ims_v2 | 4,096 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M208s_v2 | 2,850 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 |  
| M416s_v2 | 5,700 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M416s_8_v2 | 7,600 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 3 x P15 | 375 MBps | 510 MBps | 3,300 | 10,500 | 
| M832ixs<sup>1</sup> | 14,902 GiB | larger than 2,000 Mbps | 4 x P20 | 600 MBps | 680 MBps | 9,200 | 14,000 | 
| M832ixs_v2<sup>1</sup> | 23,088 GiB | larger than 2,000 Mbps | 4 x P20 | 600 MBps | 680 MBps | 9,200 | 14,000 | 

<sup>1</sup> VM type not available by default. Please contact your Microsoft account team


For the other volumes, the configuration would look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/shared | /root volume | /usr/sap |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| M32ts | 192 GiB | 500 MBps | 1 x P15 | 1 x P6 | 1 x P6 |
| M32ls | 256 GiB | 500 MBps |  1 x P15 | 1 x P6 | 1 x P6 |
| M64ls | 512 GiB | 1000 MBps | 1 x P20 | 1 x P6 | 1 x P6 |
| M32dms_v2, M32ms_v2 | 875 GiB | 500 MBps | 1 x P30 | 1 x P6 | 1 x P6 |
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MBps | 1 x P30 | 1 x P6 | 1 x P6 |
| M64ms, M64dms_v2, M64ms_v2 | 1,792 GiB | 1,000 MBps | 1 x P30 | 1 x P6 | 1 x P6 | 
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M192ids_v2, M192is_v2  | 2,048 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M128ms, M128dms_v2, M128ms_v2 | 3,892 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 |
| M192idms_v2, M192ims_v2  | 4,096 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 |
| M208s_v2 | 2,850 GiB | 1,000 MBps |  1 x P30 | 1 x P10 | 1 x P6 |
| M208ms_v2 | 5,700 GiB | 1,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M416s_v2 | 5,700 GiB | 2,000 MBps |  1 x P30 | 1 x P10 | 1 x P6 | 
| M416s_8_v2 | 7,600 GiB | 2,000 MBps |  1 x P30 | 1 x P10 | 1 x P6 | 
| M416ms_v2 | 11,400 GiB | 2,000 MBps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M832ixs<sup>1</sup> | 14,902 GiB | larger than 2,000 Mbps | 1 x P30 | 1 x P10 | 1 x P6 | 
| M832ixs_v2<sup>1</sup> | 23,088 GiB | larger than 2,000 Mbps |1 x P30 | 1 x P10 | 1 x P6 | 

<sup>1</sup> VM type not available by default. Please contact your Microsoft account team


Check whether the storage throughput for the different suggested volumes meets the workload that you want to run. If the workload requires higher volumes for **/hana/data** and **/hana/log**, you need to increase the number of Azure premium storage VHDs. Sizing a volume with more VHDs than listed increases the IOPS and I/O throughput within the limits of the Azure virtual machine type.

Azure Write Accelerator only works with [Azure managed disks](https://azure.microsoft.com/services/managed-disks/). So at least the Azure premium storage disks forming the **/hana/log** volume need to be deployed as managed disks. More detailed instructions and restrictions of Azure Write Accelerator can be found in the article [Write Accelerator](../../virtual-machines/how-to-enable-write-accelerator.md).

You may want to use Azure Ultra disk storage instead of Azure premium storage only for the **/hana/log** volume to be compliant with the SAP HANA certification KPIs when using E-series VMs. Though, many customers are using premium storage SSD disks for the **/hana/log** volume for non-production purposes or even for smaller production workloads since the write latency experienced with premium storage for the critical redo log writes are meeting the workload requirements. The configurations for the **/hana/data** volume on Azure premium storage could look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data | Provisioned Throughput | Maximum burst throughput | IOPS | Burst IOPS |
| --- | --- | --- | --- | --- | --- | --- |
| E20ds_v4| 160 GiB | 480 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 |
| E20(d)s_v5| 160 GiB | 750 MBps | 3 x P10 | 300 MBps | 510 MBps | 1,500 | 10,500 |
| E32ds_v4 | 256 GiB | 768 MBps | 3 x P10 |  300 MBps | 510 MBps | 1,500 | 10,500|
| E32ds_v5 | 256 GiB | 865 MBps | 3 x P10 |  300 MBps | 510 MBps | 1,500 | 10,500|
| E48ds_v4 | 384 GiB | 1,152 MBps | 3 x P15 |  375 MBps |510 MBps | 3,300  | 10,500 | 
| E48ds_v4 | 384 GiB | 1,315 MBps | 3 x P15 |  375 MBps |510 MBps | 3,300  | 10,500 | 
| E64s_v3 | 432 GiB | 1,200 MB/s | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 
| E64ds_v4 | 504 GiB | 1,200 MBps | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 
| E64(d)s_v5 | 512 GiB | 1,735 MBps | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 
| E96(d)s_v5 | 672 GiB | 2,600 MBps | 3 x P15 |  375 MBps | 510 MBps | 3,300 | 10,500 | 


For the other volumes, including **/hana/log** on Ultra disk, the configuration could look like:

| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/log volume | /hana/log I/O throughput | /hana/log IOPS | /hana/shared | /root volume | /usr/sap |
| --- | --- | --- | --- | --- | --- | --- | --- | -- |
| E20ds_v4 | 160 GiB | 480 MBps | 80 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E20(d)s_v5 | 160 GiB | 750 MBps | 80 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E32ds_v4 | 256 GiB | 768 MBps | 128 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E32(d)s_v5 | 256 GiB | 865 MBps | 128 GB | 250 MBps | 1,800 | 1 x P15 | 1 x P6 | 1 x P6 |
| E48ds_v4 | 384 GiB | 1,152 MBps | 192 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E48(d)s_v5 | 384 GiB | 1,315 MBps | 192 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E64s_v3 | 432 GiB | 1,200 MBps | 220 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E64ds_v4 | 504 GiB | 1,200 MBps | 256 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E64(d)s_v5 | 512 GiB | 1,735 MBps | 256 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |
| E96(d)s_v5 | 672 GiB | 2,600 MBps | 256 GB | 250 MBps | 1,800 | 1 x P20 | 1 x P6 | 1 x P6 |


## Cost conscious solution with Azure premium storage
So far, the Azure premium storage solution described in this document in section [Solutions with premium storage and Azure Write Accelerator for Azure M-Series virtual machines](#solutions-with-premium-storage-and-azure-write-accelerator-for-azure-m-series-virtual-machines) were meant for SAP HANA production supported scenarios. One of the characteristics of production supportable configurations is the separation of the volumes for SAP HANA data and redo log into two different volumes. Reason for such a separation is that the workload characteristics on the volumes are different. And that with the suggested production configurations, different type of caching or even different types of Azure block storage could be necessary. For non-production scenarios, some of the considerations taken for production systems may not apply to more low end non-production systems. As a result the HANA data and log volume could be combined. Though eventually with some culprits, like eventually not meeting certain throughput or latency KPIs that are required for production systems. Another aspect to reduce costs in such environments can be the usage of [Azure Standard SSD storage](./planning-guide-storage.md#azure-standard-ssd-storage). Keep in mind that choosing Standard SSD or Standard HDD Azure storage has impact on your single VM SLAs as documented in the article  [SLA for Virtual Machines](https://azure.microsoft.com/support/legal/sla/virtual-machines).

A less costly alternative for such configurations could look like:


| VM SKU | RAM | Max. VM I/O<br /> Throughput | /hana/data and /hana/log<br /> striped with LVM or MDADM | /hana/shared | /root volume | /usr/sap | comments |
| --- | --- | --- | --- | --- | --- | --- | -- |
| DS14v2 | 112 GiB | 768 MB/s | 4 x P6 | 1 x E10 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| E16v3 | 128 GiB | 384 MB/s | 4 x P6 | 1 x E10 | 1 x E6 | 1 x E6 | VM type not HANA certified <br /> won't achieve less than 1ms storage latency<sup>1</sup> |
| M32ts | 192 GiB | 500 MB/s | 3 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 5,000<sup>2</sup> |
| E20ds_v4 | 160 GiB | 480 MB/s | 4 x P6 | 1 x E15 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| E32v3 | 256 GiB | 768 MB/s | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | VM type not HANA certified <br /> won't achieve less than 1ms storage latency<sup>1</sup> |
| E32ds_v4 | 256 GiB | 768 MBps | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| M32ls | 256 GiB | 500 MB/s | 4 x P10 | 1 x E15 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 5,000<sup>2</sup> |
| E48ds_v4 | 384 GiB | 1,152 MBps | 6 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| E64v3 | 432 GiB | 1,200 MB/s | 6 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| E64ds_v4 | 504 GiB | 1200 MB/s |  7 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | won't achieve less than 1ms storage latency<sup>1</sup> |
| M64ls | 512 GiB | 1,000 MB/s | 7 x P10 | 1 x E20 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M32dms_v2, M32ms_v2 | 875 GiB | 500 MB/s | 6 x P15 | 1 x E30 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 5,000<sup>2</sup> |
| M64s, M64ds_v2, M64s_v2 | 1,024 GiB | 1,000 MB/s | 7 x P15 | 1 x E30 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M64ms, M64dms_v2, M64ms_v2| 1,792 GiB | 1,000 MB/s | 6 x P20 | 1 x E30 | 1 x E6 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M128s, M128ds_v2, M128s_v2 | 2,048 GiB | 2,000 MB/s |6 x P20 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M192ids_v2, M192is_v2 | 2,048 GiB | 2,000 MB/s |6 x P20 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M128ms, M128dms_v2, M128ms_v2  | 3,800 GiB | 2,000 MB/s | 5 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M192idms_v2, M192ims_v2  | 4,096 GiB | 2,000 MB/s | 5 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M208s_v2 | 2,850 GiB | 1,000 MB/s | 4 x P30 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M208ms_v2 | 5,700 GiB | 1,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 10,000<sup>2</sup> |
| M416s_v2 | 5,700 GiB | 2,000 MB/s | 4 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M416s_8_v2 | 5,700 GiB | 2,000 MB/s | 5 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |
| M416ms_v2 | 11400 GiB | 2,000 MB/s | 7 x P40 | 1 x E30 | 1 x E10 | 1 x E6 | Using Write Accelerator for combined data and log volume will limit IOPS rate to 20,000<sup>2</sup> |


<sup>1</sup> [Azure Write Accelerator](../../virtual-machines/how-to-enable-write-accelerator.md) can't be used with the Ev4 and Ev4 VM families. As a result of using Azure premium storage the I/O latency won't be less than 1ms

<sup>2</sup> The VM family supports [Azure Write Accelerator](../../virtual-machines/how-to-enable-write-accelerator.md), but there's a potential that the IOPS limit of Write accelerator could limit the disk configurations IOPS capabilities

When combining the data and log volume for SAP HANA, the disks building the striped volume shouldn't have read cache or read/write cache enabled.

There are VM types listed that aren't certified with SAP and as such not listed in the so called [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure). Feedback of customers was that those non-listed VM types were used successfully for some non-production tasks.


## Next steps
For more information, see:

- [SAP HANA High Availability guide for Azure virtual machines](./sap-hana-availability-overview.md).
