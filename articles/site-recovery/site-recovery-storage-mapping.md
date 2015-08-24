<properties
	pageTitle="Site Recovery storage mapping"
	description="Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers located on on-premises to Azure or to a secondary on-premises site."
	services="site-recovery"
	documentationCenter=""
	authors="rayne-wiselman"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="08/05/2015"
	ms.author="raynew"/>


# Site Recovery storage mapping


Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Read about possible deployment scenarios in the [Site Recovery Overview](site-recovery-overview.md).


## About this article

Storage mapping is an important element of your Site Recovery deployment. It ensures your making optimal use of storage. This article describes storage mapping and provides a couple of examples to help you understand how storage mapping works.


Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

The way in which you set up storage mapping depends on your Site Recovery deployment scenario.



- **On-premises to on-premises (replicate with Hyper-V Replica)**—Map storage classifications on a source and target VMM servers to do the following:

	- **Identify target storage for replica virtual machines**—Virtual machines will be replicated to a storage target (SMB share or cluster shared volumes (CSVs)) that you choose.
	- **Replica virtual machine placement**—Storage mapping is used to optimally place replica virtual machines on Hyper-V host servers. Replica virtual machines will be placed on hosts that can access the mapped storage classification.
	- **No storage mapping**—If you don’t configure storage mapping virtual machines will be replicated to the default storage location specified on the Hyper-V host server associated with the replica virtual machine.

- **On-premises to on-premises (replicate with SAN)**—Maps storage arrays pools on a source and target VMM servers to do the following:
	- **Identify target storage pools**—Storage mapping ensures that LUNs in a replication group are replicated the mapped target storage pool.



## Storage classifications

You map between storage classifications on source and target VMM servers, or on a single VMM server if two sites are managed by the same VMM server. When mapping is configured correctly and replication is enabled, a virtual machine’s virtual hard disk at the primary location will be replicated to storage in mapped target location. Note that:

- Storage classifications must be available to the host groups located in source and target clouds
- - Classifications don’t need to have the same type of storage. For example you can map a source classification that contains SMB shares to a target classification that contains CSVs
- Read more in [How to create storage classifications in VMM](https://technet.microsoft.com/library/gg610685.aspx).

## Example

If classifications are configured correctly in VMM when you select the source and target VMM server during storage mapping, the source and target classifications will be displayed. Here’s an example of storage files shares and classifications for an organization with two locations in New York and Chicago.

**Location** | **VMM server** | **File share (source)** | **Classification (source)** | **Mapped to** | **File share (target)**
---|---|--- |---|---|---
New York | VMM_Source| SourceShare1 | GOLD | GOLD_TARGET | TargetShare1
 |  | SourceShare2 | SILVER | SILVER_TARGET | TargetShare2
 | | SourceShare3 | BRONZE | BRONZE_TARGET | TargetShare3
Chicago | VMM_Target |  | GOLD_TARGET | Not mapped |
| | | SILVER_TARGET | Not mapped |
 | | | BRONZE_TARGET | Not mapped

You'd configure these on the **Server Storage** tab in the **Resources** page of the Site Recovery portal.

![Configure storage mapping](./media/site-recovery-storage-mapping/StorageMapping1.png)

With this example:
- When a a replica virtual machine is created for any virtual machine on GOLD storage (SourceShare1), it will be replicated to a GOLD_TARGET storage (TargetShare1).
- When a replica virtual machine is created for any virtual machine on SILVER storage (SourceShare2), it will be replicated to a SILVER_TARGET (TargetShare2) storage, and so on.

The actual file shares and their assigned classifications in VMM would be as shown below.

![Storage classifications in VMM](./media/site-recovery-storage-mapping/StorageMapping2.png)

## Multiple storage locations

If the target classification is assigned to multiple SMB shares or CSVs the optimal storage location will be selected automatically when the virtual machine is protected. If no suitable target storage is available with the specified classification, the default storage location specified on the Hyper-V host is used to place the replica virtual hard disks.

The following table show how storage classification and cluster shared volumes are set up in our example.

**Location** | **Classification** | **Associated storage**
---|---|---
New York | GOLD | <p>C:\ClusterStorage\SourceVolume1</p><p>\\FileServer\SourceShare1</p>
 | SILVER | <p>C:\ClusterStorage\SourceVolume2</p><p>\\FileServer\SourceShare2</p>
Chicago | GOLD_TARGET | <p>C:\ClusterStorage\TargetVolume1</p><p>\\FileServer\TargetShare1</p>
 | SILVER_TARGET| <p>C:\ClusterStorage\TargetVolume2</p><p>\\FileServer\TargetShare2</p>

This table summarizes the behavior when you enable protection for virtual machines (VM1 - VM5) in this example environment.

**Virtual machine** | **Source storage** | **Source classification** | **Mapped target storage**
---|---|---|---
VM1 | C:\ClusterStorage\SourceVolume1 | GOLD | <p>C:\ClusterStorage\SourceVolume1</p><p>\\\FileServer\SourceShare1</p><p>Both GOLD_TARGET</p>
VM2 | \\FileServer\SourceShare1 | GOLD | <p>C:\ClusterStorage\SourceVolume1</p><p>\\FileServer\SourceShare1</p> <p>Both GOLD_TARGET</p>
VM3 | C:\ClusterStorage\SourceVolume2 | SILVER | <p>C:\ClusterStorage\SourceVolume2</p><p>\FileServer\SourceShare2</p>
VM4 | \FileServer\SourceShare2 | SILVER |<p>C:\ClusterStorage\SourceVolume2</p><p>\\FileServer\SourceShare2</p><p>Both SILVER_TARGET</p>
VM5 | C:\ClusterStorage\SourceVolume3 | N/A | No mapping so default storage location of the Hyper-V host is used

## Next steps

Now that you have a better understanding of storage mapping start reading the [best practices](site-recovery-best-practices.md) to prepare for deployment.
 