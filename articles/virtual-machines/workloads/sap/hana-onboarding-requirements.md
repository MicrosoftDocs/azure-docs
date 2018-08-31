---
title: Onboarding requirements for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: Onboarding requirements for SAP HANA on Azure (Large Instances).
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
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Onboarding requirements

This list assembles requirements for running SAP HANA on Azure (Larger Instances).

**Microsoft Azure**

- An Azure subscription that can be linked to SAP HANA on Azure (Large Instances).
- Microsoft Premier support contract. For specific information related to running SAP in Azure, see [SAP Support Note #2015553 – SAP on Microsoft Azure: Support prerequisites](https://launchpad.support.sap.com/#/notes/2015553). If you use HANA Large Instance units with 384 and more CPUs, you also need to extend the Premier support contract to include Azure Rapid Response.
- Awareness of the HANA Large Instance SKUs you need after you perform a sizing exercise with SAP.

**Network connectivity**

- ExpressRoute between on-premises to Azure: To connect your on-premises data center to Azure, make sure to order at least a 1-Gbps connection from your ISP. 

**Operating system**

- Licenses for SUSE Linux Enterprise Server 12 for SAP Applications.

   > [!NOTE] 
   > The operating system delivered by Microsoft isn't registered with SUSE. It isn't connected to a Subscription Management Tool instance.

- SUSE Linux Subscription Management Tool deployed in Azure on a VM. This tool provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by SUSE. (There is no internet access within the HANA Large Instance data center.) 
- Licenses for Red Hat Enterprise Linux 6.7 or 7.x for SAP HANA.

   > [!NOTE]
   > The operating system delivered by Microsoft isn't registered with Red Hat. It isn't connected to a Red Hat Subscription Manager instance.

- Red Hat Subscription Manager deployed in Azure on a VM. The Red Hat Subscription Manager provides the capability for SAP HANA on Azure (Large Instances) to be registered and respectively updated by Red Hat. (There is no direct internet access from within the tenant deployed on the Azure Large Instance stamp.)
- SAP requires you to have a support contract with your Linux provider as well. This requirement isn't removed by the solution of HANA Large Instance or the fact that you run Linux in Azure. Unlike with some of the Linux Azure gallery images, the service fee is *not* included in the solution offer of HANA Large Instance. It's your responsibility to fulfill the requirements of SAP regarding support contracts with the Linux distributor. 
   - For SUSE Linux, look up the requirements of support contracts in [SAP Note #1984787 - SUSE Linux Enterprise Server 12: Installation notes](https://launchpad.support.sap.com/#/notes/1984787) and [SAP Note #1056161 - SUSE priority support for SAP applications](https://launchpad.support.sap.com/#/notes/1056161).
   - For Red Hat Linux, you need to have the correct subscription levels that include support and service updates to the operating systems of HANA Large Instance. Red Hat recommends the Red Hat Enterprise Linux for [SAP Solutions](https://access.redhat.com/solutions/3082481 subscription. 

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).

For the compatibility matrix of the operating system and HLI firmware/driver versions, refer [OS Upgrade for HLI](os-upgrade-hana-large-instance.md).


> [!IMPORTANT] 
> For Type II units only the SLES 12 SP2 OS version is supported at this point. 


**Database**

- Licenses and software installation components for SAP HANA (platform or enterprise edition).

**Applications**

- Licenses and software installation components for any SAP applications that connect to SAP HANA and related SAP support contracts.
- Licenses and software installation components for any non-SAP applications used in relation to SAP HANA on Azure (Large Instances) environments and related support contracts.

**Skills**

- Experience with and knowledge of Azure IaaS and its components.
- Experience with and knowledge of how to deploy an SAP workload in Azure.
- SAP HANA installation certified personnel.
- SAP architect skills to design high availability and disaster recovery around SAP HANA.

**SAP**

- Expectation is that you're an SAP customer and have a support contract with SAP.
- Especially for implementations of the Type II class of HANA Large Instance SKUs, consult with SAP on versions of SAP HANA and the eventual configurations on large-sized scale-up hardware.


## Storage

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