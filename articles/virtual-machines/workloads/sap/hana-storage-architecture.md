---
title: Storage architecture of SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Storage architecture of how to deploy SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: jeconnoc
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/04/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# SAP HANA (Large Instances) storage architecture

The storage layout for SAP HANA on Azure (Large Instances) is configured by SAP HANA on the classic deployment model through SAP recommended guidelines. The guidelines are documented in the [SAP HANA storage requirements](http://go.sap.com/documents/2015/03/74cdb554-5a7c-0010-82c7-eda71af511fa.html) white paper.

The HANA Large Instance of the Type I class comes with four times the memory volume as storage volume. For the Type II class of HANA Large Instance units, the storage isn't four times more. The units come with a volume that is intended for storing HANA transaction log backups. For more information, see [Install and configure SAP HANA (Large Instances) on Azure](hana-installation.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

See the following table in terms of storage allocation. The table lists the rough capacity for the different volumes provided with the different HANA Large Instance units.

| HANA Large Instance SKU | hana/data | hana/log | hana/shared | hana/logbackups |
| --- | --- | --- | --- | --- |
| S72 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| S72m | 3,328 GB | 768 GB |1,280 GB | 768 GB |
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


Actual deployed volumes might vary based on deployment and the tool that is used to show the volume sizes.

If you subdivide a HANA Large Instance SKU, a few examples of possible division pieces might look like:

| Memory partition in GB | hana/data | hana/log | hana/shared | hana/log/backup |
| --- | --- | --- | --- | --- |
| 256 | 400 GB | 160 GB | 304 GB | 160 GB |
| 512 | 768 GB | 384 GB | 512 GB | 384 GB |
| 768 | 1,280 GB | 512 GB | 768 GB | 512 GB |
| 1,024 | 1,792 GB | 640 GB | 1,024 GB | 640 GB |
| 1,536 | 3,328 GB | 768 GB | 1,280 GB | 768 GB |


These sizes are rough volume numbers that can vary slightly based on deployment and the tools used to look at the volumes. There also are other partition sizes, such as 2.5 TB. These storage sizes are calculated with a formula similar to the one used for the previous partitions. The term "partitions" doesn't mean that the operating system, memory, or CPU resources are in any way partitioned. It indicates storage partitions for the different HANA instances you might want to deploy on one single HANA Large Instance unit. 

You might need more storage. You can add storage by purchasing additional storage in 1-TB units. This additional storage can be added as additional volume. It also can be used to extend one or more of the existing volumes. It isn't possible to decrease the sizes of the volumes as originally deployed and mostly documented by the previous tables. It also isn't possible to change the names of the volumes or mount names. The storage volumes previously described are attached to the HANA Large Instance units as NFS4 volumes.

You can use storage snapshots for backup and restore and disaster recovery purposes. For more information, see [SAP HANA (Large Instances) high availability and disaster recovery on Azure](hana-overview-high-availability-disaster-recovery.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Refer [HLI supported scenarios](hana-supported-scenario.md) for storage layout details for your scenario.

## Run multiple SAP HANA instances on one HANA Large Instance unit

It's possible to host more than one active SAP HANA instance on HANA Large Instance units. To provide the capabilities of storage snapshots and disaster recovery, such a configuration requires a volume set per instance. Currently, HANA Large Instance units can be subdivided as follows:

- **S72, S72m, S144, S192**: In increments of 256 GB, with 256 GB the smallest starting unit. Different increments such as 256 GB and 512 GB can be combined to the maximum of the memory of the unit.
- **S144m and S192m**: In increments of 256 GB, with 512 GB the smallest unit. Different increments such as 512 GB and 768 GB can be combined to the maximum of the memory of the unit.
- **Type II class**: In increments of 512 GB, with the smallest starting unit of 2 TB. Different increments such as 512 GB, 1 TB, and 1.5 TB can be combined to the maximum of the memory of the unit.

Some examples of running multiple SAP HANA instances might look like the following.

| SKU | Memory size | Storage size | Sizes with multiple databases |
| --- | --- | --- | --- |
| S72 | 768 GB | 3 TB | 1x768 GB HANA instance<br /> or 1x512 GB instance + 1x256 GB instance<br /> or 3x256 GB instances | 
| S72m | 1.5 TB | 6 TB | 3x512GB HANA instances<br />or 1x512 GB instance + 1x1 TB instance<br />or 6x256 GB instances<br />or 1x1.5 TB instance | 
| S192m | 4 TB | 16 TB | 8x512 GB instances<br />or 4x1 TB instances<br />or 4x512 GB instances + 2x1 TB instances<br />or 4x768 GB instances + 2x512 GB instances<br />or 1x4 TB instance |
| S384xm | 8 TB | 22 TB | 4x2 TB instances<br />or 2x4 TB instances<br />or 2x3 TB instances + 1x2 TB instances<br />or 2x2.5 TB instances + 1x3 TB instances<br />or 1x8 TB instance |


There are other variations as well. 

## Encryption of data at rest
The storage used for HANA Large Instance allows a transparent encryption of the data as it's stored on the disks. When a HANA Large Instance unit is deployed, you can enable this kind of encryption. You also can change to encrypted volumes after the deployment takes place. The move from non-encrypted to encrypted volumes is transparent and doesn't require downtime. 

With the Type I class of SKUs, the volume the boot LUN is stored on is encrypted. For the Type II class of SKUs of HANA Large Instance, you need to encrypt the boot LUN with OS methods. For more information, contact the Microsoft Service Management team.

**Next steps**
- Refer [Supported scenarios for HANA Large Instances](hana-supported-scenario.md)