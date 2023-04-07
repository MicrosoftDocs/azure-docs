---
title: Storage architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Learn about the storage architecture for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: lauradolan
manager: bburns
editor: ''
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/22/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# SAP HANA (Large Instances) storage architecture

In this article, we'll look at the storage architecture for deploying SAP HANA on Azure Large Instances (also known as BareMetal Infrastructure). 

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on the classic deployment model per SAP recommended guidelines.

Type I class of HANA Large Instances come with four times the memory volume as storage volume. Whereas Type II class of HANA Large Instances come with a volume intended for storing HANA transaction log backups. For more information, see [Install and configure SAP HANA (Large Instances) on Azure](hana-installation.md).

See the following table for storage allocation. The table lists the rough capacity for volumes provided with the different HANA Large Instance units.

| HANA Large Instance SKU | hana/data | hana/log | hana/shared | hana/logbackups |
| --- | --- | --- | --- | --- |
| S72 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| S72m | 3,328 GB | 768 GB |1,280 GB | 768 GB |
| S96 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| S192 | 4,608 GB | 1,024 GB | 1,536 GB | 1,024 GB |
| S192m | 11,520 GB | 1,536 GB | 1,792 GB | 1,536 GB |
| S192xm |  11,520 GB |  1,536 GB |  1,792 GB |  1,536 GB |
| S384 | 11,520 GB | 1,536 GB | 1,792 GB | 1,536 GB |
| S384m | 12,000 GB | 2,050 GB | 2,050 GB | 2,040 GB |
| S384xm | 16,000 GB | 2,050 GB | 2,050 GB | 2,040 GB |
| S384xxm |  20,000 GB | 3,100 GB | 2,050 GB | 3,100 GB |
| S576m | 20,000 GB | 3,100 GB | 2,050 GB | 3,100 GB |
| S576xm | 31,744 GB | 4,096 GB | 2,048 GB | 4,096 GB |
| S768m | 28,000 GB | 3,100 GB | 2,050 GB | 3,100 GB |
| S768xm | 40,960 GB | 6,144 GB | 4,096 GB | 6,144 GB |
| S960m | 36,000 GB | 4,100 GB | 2,050 GB | 4,100 GB |
| S896m | 33,792 GB | 512 GB | 1,024 GB | 512 GB |

More recent SKUs of HANA Large Instances are delivered with the following storage configurations.

| HANA Large Instance SKU | hana/data | hana/log | hana/shared | hana/logbackups |
| --- | --- | --- | --- | --- |
| S224 | 4,224 GB | 512 GB | 1,024 GB | 512 GB |
| S224oo | 6,336 GB | 512 GB | 1,024 GB | 512 GB |
| S224m | 8,448 GB | 512 GB | 1,024 GB | 512 GB |
| S224om | 8,448 GB | 512 GB | 1,024 GB | 512 GB |
| S224ooo | 10,560 GB | 512 GB | 1,024 GB | 512 GB |
| S224oom | 12,672 GB | 512 GB | 1,024 GB | 512 GB |
| S448 | 8,448 GB | 512 GB | 1,024 GB | 512 GB |
| S448oo | 12,672 GB | 512 GB | 1,024 GB | 512 GB |
| S448m | 16,896 GB | 512 GB | 1,024 GB | 512 GB |
| S448om | 16,896 GB | 512 GB | 1,024 GB | 512 GB |
| S448ooo | 21,120 GB | 512 GB | 1,024 GB | 512 GB |
| S448oom | 25,344 GB | 512 GB | 1,024 GB | 512 GB |
| S672 | 12,672 GB | 512 GB | 1,024 GB | 512 GB |
| S672oo | 19,008 GB | 512 GB | 1,024 GB | 512 GB |
| S672m | 25,344 GB | 512 GB | 1,024 GB | 512 GB |
| S672om | 25,344 GB | 512 GB | 1,024 GB | 512 GB |
| S672ooo | 31,680 GB | 512 GB | 1,024 GB | 512 GB |
| S672oom | 38,016 GB | 512 GB | 1,024 GB | 512 GB |
| S896 | 16,896 GB | 512 GB | 1,024 GB | 512 GB |
| S896oo | 25,344 GB | 512 GB | 1,024 GB | 512 GB |
| S896om | 33,792 GB | 512 GB | 1,024 GB | 512 GB |
| S896ooo | 42,240 GB | 512 GB | 1,024 GB | 512 GB |
| S896oom | 50,688 GB | 512 GB | 1,024 GB | 512 GB |


Actual deployed volumes might vary based on deployment and the tool used to show the volume sizes.

If you subdivide a HANA Large Instance SKU, a few examples of possible division pieces might look like:

| Memory partition in GB | hana/data | hana/log | hana/shared | hana/log/backup |
| --- | --- | --- | --- | --- |
| 256 | 400 GB | 160 GB | 304 GB | 160 GB |
| 512 | 768 GB | 384 GB | 512 GB | 384 GB |
| 768 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| 1,024 | 1,792 GB | 640 GB | 1,024 GB | 640 GB |
| 1,536 | 3,328 GB | 768 GB | 1,280 GB | 768 GB |


These sizes are rough volume numbers that can vary slightly based on deployment and the tools used to look at the volumes. There are also other partition sizes, such as 2.5 TB. These storage sizes are calculated using a formula similar to the one used for the previous partitions. The term "partitions" doesn't mean the operating system, memory, or CPU resources are partitioned. It indicates storage partitions for the different HANA instances you might want to deploy on one single HANA Large Instance unit. 

If you need more storage, you can buy more in 1-TB units. The extra storage may be added as more volume or used to extend one or more of the existing volumes. You can't reduce the sizes of the volumes as originally deployed and as documented by the previous tables. You also aren't able to change the names of the volumes or mount names. The storage volumes previously described are attached to the HANA Large Instance units as NFS4 volumes.

You can use storage snapshots for backup and restore and disaster recovery purposes. For more information, see [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md).

For more information on the storage layout for your scenario, see [HLI supported scenarios](hana-supported-scenario.md).

## Run multiple SAP HANA instances on one HANA Large Instance unit

It's possible to host more than one active SAP HANA instance on HANA Large Instance units. To provide the capabilities of storage snapshots and disaster recovery, such a configuration requires a volume set per instance. Currently, HANA Large Instance units can be subdivided as follows:

- **S72, S72m, S96, S144, S192**: In increments of 256 GB, with 256 GB as the smallest starting unit. Different increments such as 256 GB and 512 GB can be combined to the maximum memory of the unit.
- **S144m and S192m**: In increments of 256 GB, with 512 GB as the smallest unit. Different increments such as 512 GB and 768 GB can be combined to the maximum memory of the unit.
- **Type II class**: In increments of 512 GB, with the smallest starting unit of 2 TB. Different increments such as 512 GB, 1 TB, and 1.5 TB can be combined to the maximum memory of the unit.

The following examples show what it might look like running multiple SAP HANA instances.

| SKU | Memory size | Storage size | Sizes with multiple databases |
| --- | --- | --- | --- |
| S72 | 768 GB | 3 TB | 1x768-GB HANA instance<br /> or 1x512-GB instance + 1x256-GB instance<br /> or 3x256-GB instances | 
| S72m | 1.5 TB | 6 TB | 3x512GB HANA instances<br />or 1x512-GB instance + 1x1-TB instance<br />or 6x256-GB instances<br />or 1x1.5-TB instance | 
| S192m | 4 TB | 16 TB | 8x512-GB instances<br />or 4x1-TB instances<br />or 4x512-GB instances + 2x1-TB instances<br />or 4x768-GB instances + 2x512-GB instances<br />or 1x4-TB instance |
| S384xm | 8 TB | 22 TB | 4x2-TB instances<br />or 2x4-TB instances<br />or 2x3-TB instances + 1x2-TB instances<br />or 2x2.5-TB instances + 1x3-TB instances<br />or 1x8-TB instance |


There are other variations as well. 

## Encryption of data at rest
The storage for HANA Large Instances uses transparent encryption for the data, as it's stored on the disks. In deployments before the end of 2018, you could have the volumes encrypted. If you decided against that option, you could have the volumes encrypted online. The move from non-encrypted to encrypted volumes is transparent and doesn't require downtime. 

With the Type I class of SKUs of HANA Large Instance, the volume storing the boot LUN is encrypted. In Revision 3 HANA Large Instance stamps using Type II class of SKUs, you need to encrypt the boot LUN with OS methods. In Revision 4 HANA Large Instance stamps using Type II class of SKUs, the volume storing the boot LUN is encrypted at rest by default. 

## Required settings for larger HANA instances on HANA Large Instances

The storage used in HANA Large Instances has a file size limitation. The [size limitation is 16 TB](https://docs.netapp.com/ontap-9/index.jsp?topic=%2Fcom.netapp.doc.dot-cm-vsmg%2FGUID-AA1419CF-50AB-41FF-A73C-C401741C847C.html) per file. Unlike file size limitations in the EXT3 file systems, HANA isn't implicitly aware of the storage limitation enforced by HANA Large Instances storage. As a result, HANA won't automatically create a new data file when the file size limit of 16 TB is reached. As HANA attempts to grow the file beyond 16 TB, HANA will report errors and the index server will finally crash.

> [!IMPORTANT]
> In order to prevent HANA from trying to grow data files beyond the 16 TB file size limit of HANA Large Instance storage, you need to set the following parameters in the global.ini configuration file of HANA:
> 
> - datavolume_striping=true
> - datavolume_striping_size_gb = 15000
> - See also SAP note [#2400005](https://launchpad.support.sap.com/#/notes/2400005)
> - Be aware of SAP note [#2631285](https://launchpad.support.sap.com/#/notes/2631285)

## Next steps

Learn about deploying SAP HANA (Large Instances).

> [!div class="nextstepaction"]
> [SAP HANA (Large Instances) deployment](hana-overview-infrastructure-connectivity.md)
