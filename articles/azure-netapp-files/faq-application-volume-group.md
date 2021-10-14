---
title: FAQs About Azure NetApp Files application volume group | Microsoft Docs
description: answers frequently asked questions (FAQs) about Azure NetApp Files application volume group.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-juche
ms.author: b-juche
ms.date: 10/04/2021
---
# Application volume group FAQs

This article answers frequently asked questions (FAQs) about Azure NetApp Files application volume group. 

## Why do I have to use a manual QoS capacity pool for all of my volumes?

Manual QoS capacity pool provides the best way to define capacity and throughput individually to fit the SAP HANA needs. It avoids over-provisioning to reach the performance of, for example, the log volume or data volume. It can also reserve larger space for log-backups while keeping the performance to a value that suits your needs. Overall, using manual QoS capacity pool results in a price reduction.

## Will all the volumes be provisioned in close proximity to my HANA servers?

No. Using the proximity placement group (PPG) that you created for your HANA servers ensures that the data, log, and shared volumes are created close to the HANA servers to achieve the best latency and throughput. However, log-backup and data-backup volumes do not require low latency. From a protection perspective, it makes sense to not store these backup volumes on the same location as the data, log, and shared volumes. Instead, the backup volumes are placed on a different storage location inside the region that has sufficient space and throughput available.

## For a multi-host SAP HANA system, will the shared volume be resized when I add additional HANA hosts?

No.  This scenario is currently one of the very few cases where you need to manually adjust the size.  SAP recommends that you size the shared volume as 1 TB for every four HANA hosts. Because you create the shared volume as part of the first SAP HANA host, it’s already sized as 1 TB. There are two options to size the share volume for SAP HANA properly.

* If you know upfront that you need, for example, six hosts, you can modify the 1-TB proposal during the initial creation with the application volume group for SAP HANA. At that point, you can also increase the throughput (that is, the QoS) to accommodate six hosts.
* You can always edit the shared volume and change the size and throughput individually after the volume creation. You can do so within the volume placement group or directly in the volume using the Azure resource provider or GUI.

## I want to create the data-backup volume for not only a single instance but for more than one SAP HANA database. How can I do this?

Log-back and data-backup volumes are optional, and they do not require close proximity. The best way to achieve the intended outcome is to remove the data-backup or log-backup volume when you create the first volume from the application volume group for SAP HANA. Then you can create your own volume as a single, independent volume using the standard volume provisioning and selecting the proper capacity and throughput that meet your needs. You should use a naming convention that indicates a data-backup volume and that it's used for multiple SIDs.

## What snapshot policy should I use for my HANA volumes?  

This question isn’t directly related to application volume group for SAP HANA. As a short answer, you can use products such as [AzAcSnap](azacsnap-introduction.md) or Commvault for an application-consistent backup for your HANA environment. You cannot use the standard snapshots scheduled by the Azure NetApp Files built-in snapshot policy for a consistent backup of your HANA database.

General recommendations for snapshots in an SAP HANA environment are as follows:

* Closely monitor the data volume snapshots. HANA tends to have a high change rate. Keeping snapshots for a long period might increase your capacity needs. Be sure to monitor the used capacity vs. allocated capacity.
* If you automatically create snapshots for your (log and file) backups, be sure to monitor their retention to avoid unpredicted volume growth.

## The deployment failed and not even a single volume was created. Why is that?

This is the normal behavior. Application volume group for SAP HANA will provision the volumes in an atomic fashion. Deployment fails typically because the given PPG doesn’t have enough available resources to accommodate your requirements. Azure NetApp Files team will investigate this situation to provide sufficient resources.

## Can I use the new SAP HANA feature of multiple partitions?

Application volume group for SAP HANA was not built with a dedicated focus on multiple partitions, but you can use application volume group for SAP HANA while adapting your input.

The basics for multiple partitions are as follows:  

* Multiple partitions mean that a single SAP HANA host is using more than one volume to store its persistence. 
* Multiple partitions need to mount on a different path. For example, the first volume is on `/hana/data/SID/mnt00001`, and the second volume needs a different path (`/hana/data2/SID/mnt00001`). To achieve this outcome, you should adapt the naming convention manually. That is, `SID_DATA_MNT00001; SID_DATA2_MNT00001,...`.
* Memory is the key for application volume group for SAP HANA to size for capacity and throughput. As such, you need to adapt the size to accommodate the number of partitions. For two partitions, you should only use 50% of the memory. For three partitions, you should use 1/3 of the memory, and so on. 

For each host and each partition you want to create, you need to rerun application volume group for SAP HANA. And you should adapt the naming proposal to meet the above recommendation.

## Why is 1500 MiB/s the maximum throughput value that application volume group for SAP HANA proposes for the data volume?

NFSv4.1 is the supported protocol for SAP HANA.  As such, one TCP/IP session is supported when you mount a single volume. For running a single TCP session (that is, from a single host) against a single volume, 1500 MiB/s is the typical I/O limit identified. That's why application volume group for SAP HANA avoids allocating more throughput than you can realistically achieve. If you need more throughput, especially for larger HANA databases (for example, 12 TB), you should use multiple partitions.

## Can I use `nconnect` as a mount option?

Azure NetApp Files currently does support `nconnect` for NFSv4.1 but requires the following Linux OS versions:

* SLES 15SP2 and higher
* RHEL 8.3 and higher

## How can I understand how to size my system or my overall system landscape?

Contact an SAP Azure NetApp Files sizing expert to help you plan the overall SAP system sizing. 

Important information you need to provide for each of the systems include the following: SID, role (production, Dev, pre-prod/QA), HANA memory, Snapshot reserve in percentage, number of days for local snapshot retention, number of file-based backups, single-host/multiple-host with the number of hosts, and HSR (primary, secondary).

In General, we assume a typical load contribution of 100% for production, 75% pre-production, 50% QA, 25% development, 30% daily change rate of the data volume for production, 20% daily change rate for QA, 10% daily change rate for development. 
Data-backups are written with 250 MiB/s. 

If you know your systems (from running HANA before), you can provide your data instead of these generic assumptions. 

## Next steps  

* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
