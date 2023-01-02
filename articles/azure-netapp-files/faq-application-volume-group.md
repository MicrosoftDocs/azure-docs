---
title: FAQs About Azure NetApp Files application volume group | Microsoft Docs
description: answers frequently asked questions (FAQs) about Azure NetApp Files application volume group.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 05/19/2022
---
# Application volume group FAQs

This article answers frequently asked questions (FAQs) about Azure NetApp Files application volume group. 

## Why do I have to use a manual QoS capacity pool for all of my volumes?

Manual QoS capacity pool provides the best way to define capacity and throughput individually to fit the SAP HANA needs. It avoids over-provisioning to reach the performance of, for example, the log volume or data volume. It can also reserve larger space for log-backups while keeping the performance to a value that suits your needs. Overall, using manual QoS capacity pool results in a price reduction.

> [!NOTE]
> Only manual QoS capacity pools will be displayed in the list to select from.

## Will all the volumes be provisioned in close proximity to my HANA servers?

No. Using the proximity placement group (PPG) that you created for your HANA servers ensures that the data, log, and shared volumes are created close to the HANA servers to achieve the best latency and throughput. However, log-backup and data-backup volumes do not require low latency. From a protection perspective, it makes sense to not store these backup volumes on the same location as the data, log, and shared volumes. Instead, the backup volumes are placed on a different storage location inside the region that has sufficient space and throughput available.

## For a multi-host SAP HANA system, will the shared volume be resized when I add additional HANA hosts?

No.  This scenario is currently one of the very few cases where you need to manually adjust the size. SAP recommends that you size the shared volume as 1 x RAM for every four HANA hosts. Because you create the shared volume as part of the first SAP HANA host, it’s already sized as 1 TB. There are two options to size the share volume for SAP HANA properly.

* If you know upfront that you need, for example, six hosts, you can modify the 1-TB proposal during the initial creation with the application volume group for SAP HANA. At that point, you can also increase the throughput (that is, the QoS) to accommodate six hosts.
* You can always edit the shared volume and change the size and throughput individually after the volume creation. You can do so within the volume placement group or directly in the volume using the Azure resource provider or GUI.

## I want to create the data-backup volume for not only a single instance but for more than one SAP HANA database. How can I do this?

Log-back and data-backup volumes are optional, and they do not require close proximity. The best way to achieve the intended outcome is to remove the data-backup or log-backup volume when you create the first volume from the application volume group for SAP HANA. Then you can create your own volume as a single, independent volume using the standard volume provisioning and selecting the proper capacity and throughput that meet your needs. You should use a naming convention that indicates a data-backup volume and that it's used for multiple SIDs.

## What snapshot policy should I use for my HANA volumes?  

This question isn’t directly related to application volume group for SAP HANA. As a short answer, you can use products such as [AzAcSnap](azacsnap-introduction.md) or Commvault for an application-consistent backup for your HANA environment. You cannot use the standard snapshots scheduled by the Azure NetApp Files built-in snapshot policy for a consistent backup of your HANA database.

General recommendations for snapshots in an SAP HANA environment are as follows:

* Closely monitor the data volume snapshots. HANA tends to have a high change rate. Keeping snapshots for a long period might increase your capacity needs. Be sure to monitor the used capacity vs. allocated capacity.
* If you automatically create snapshots for your (log and file) backups, be sure to monitor their retention to avoid unpredicted volume growth.

## The mount instructions of a volume include a list of IP addresses. Which IP address should I use?

Application volume group ensures that SAP HANA data and log volumes for one HANA host will always have separate storage endpoints with different IP addresses to achieve best performance. To host your data, log and shared volumes across the Azure NetApp Files storage resource(s) up to six storage endpoints can be created per used Azure NetApp Files storage resource. For this reason, it is recommended to size the delegated subnet accordingly. See [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md). Although all listed IP addresses can be used for mounting, the first listed IP address is the one that provides the lowest latency. It is recommended to always use the first IP address.

## What is the optimal mount option for SAP HANA?

To have an optimal SAP HANA experience, there is more to do on the Linux client than just mounting the volumes. A complete setup and configuration guide is available for SAP HANA on Azure NetApp Files. It includes many recommended Linux settings and recommended mount options. See the SAP HANA solutions overview on [SAP HANA on Azure NetApp Files](azure-netapp-files-solution-architectures.md#sap-hana) to select the guide for your system architecture. 

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

NFSv4.1 is the supported protocol for SAP HANA.  As such, one TCP/IP session is supported when you mount a single volume. For running a single TCP session (that is, from a single host) against a single volume, 1500 MiB/s is the typical I/O limit identified. That's why application volume group for SAP HANA avoids allocating more throughput than you can realistically achieve. If you need more throughput, especially for larger HANA databases (for example, 12 TiB), you should use multiple partitions or use the `nconnect` mount option.

## Can I use `nconnect` as a mount option?

Azure NetApp Files does support `nconnect` for NFSv4.1 but requires the following Linux OS versions:

* SLES 15SP2 and higher
* RHEL 8.3 and higher

When you use the `nconnect` mount option, the read limit is up to 4500 MiB/s (see [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)), and the proposed throughput limits for the data volume might need to be adapted accordingly.

## How can I understand how to size my system or my overall system landscape?

Contact an SAP Azure NetApp Files sizing expert to help you plan the overall SAP system sizing. 

Important information you need to provide for each of the systems include the following: SID, role (production, Dev, pre-prod/QA), HANA memory, Snapshot reserve in percentage, number of days for local snapshot retention, number of file-based backups, single-host/multiple-host with the number of hosts, and HSR (primary, secondary).

In General, we assume a typical load contribution of 100% for production, 75% pre-production, 50% QA, 25% development, 30% daily change rate of the data volume for production, 20% daily change rate for QA, 10% daily change rate for development. 

Data-backups are written with 250 MiB/s. 

If you know your systems (from running HANA before), you can provide your data instead of these generic assumptions. 

## I’ve received a warning message `"Not enough pool capacity"`. What can I do?
Application volume group will calculate the capacity and throughput demand of all volumes based on your input of the HANA memory. When you select the capacity pool, it immediately checks if there is enough space or throughput left in the capacity pool. 

At the initial **SAP HANA** screen, you may ignore this message and continue with the workflow by clicking the **Next** button. And you can later adapt the proposed values for each volume individually so that all volumes will fit into the capacity pool. This error message will reappear when you change each individual volume until all volumes fit into the capacity pool.

You might also want to increase the size of the pool to avoid this warning message.

## Why is the `hostid` (for example, 00001) added to my names even when I’ve removed the `{Hostid}` placeholder?  

Application volume group requires the placeholder `{Hostid}` to be part of the names. If it’s removed, the `hostid` is automatically added to the provided string.

You can see the final names for each of the volumes after selecting **Review + Create**.

## How long does it take to create a volume group?

Creating a volume group involves many different steps, and not all of them can be done in parallel. Especially when you create the first volume group for a given location (PPG), it might take up to 9-12 minutes for completion. Subsequent volume groups will be created faster.

## Why can’t I edit the volume group description?

In the current implementation, the application volume group has a focus on the initial creation and deletion of a volume group only. 

## Can I clone a volume created with application volume group? 

Yes, you can clone a volume created by the application volume group. You can do so by selecting a snapshot and [restoring it to a new volume](snapshots-restore-new-volume.md). Cloning is a process outside of the application volume group workflow. As such, consider the following restrictions:

* When you clone a single volume, none of the dependencies specific to the volume group are checked.
* The cloned volume is not part of the volume group.
* The cloned volume is always placed on the same storage endpoint as the source volume.
* Currently, the listed IP addresses for the mount instructions might not display the optimal IP address as the recommended address for mounting the volume. To achieve the lowest latency for the cloned volume, you need to mount with the same IP address as the source volume.
 

## What are the rules behind the proposed throughput for my HANA data and log volumes?

SAP defines the Key Performance Indicators (KPIs) for the HANA data and log volume as 400 MiB/s for the data and 250 MiB/s for the log volume. This definition is independent of the size or the workload of the HANA database. Application volume group scales the throughput values in a way that even the smallest database meets the SAP HANA KPIs, and larger database will benefit from a higher throughput level, scaling the proposal based on the entered HANA database size.

The following table  describes the memory range and proposed throughput ***for the HANA data volume***:

<table><thead><tr><th colspan="2">Memory range (in TB)</th><th rowspan="2">Proposed throughput</th></tr><tr><th>Minimum</th><th>Maximum</th></tr></thead><tbody><tr><td>0</td><td>1</td><td>400</td></tr><tr><td>1</td><td>2</td><td>600</td></tr><tr><td>2</td><td>4</td><td>800</td></tr><tr><td>4</td><td>6</td><td>1000</td></tr><tr><td>6</td><td>8</td><td>1200</td></tr><tr><td>8</td><td>10</td><td>1400</td></tr><tr><td>10</td><td>unlimited</td><td>1500</td></tr></tbody></table>

The following table  describes the memory range and proposed throughput ***for the HANA log volume***:

<table><thead><tr><th colspan="2">Memory range (in TB)</th><th rowspan="2">Proposed throughput</th></tr><tr><th>Minimum</th><th>Maximum</th></tr></thead><tbody><tr><td>0</td><td>4</td><td>250</td></tr><tr><td>4</td><td>unlimited</td><td>500</td></tr></tbody></table>

Higher throughput for the database volume is most important for the database startup of larger databases when reading data into memory. At runtime, most of the I/O is write I/O, where even the KPIs show lower values. User experience shows that, for smaller databases, HANA KPI values may be higher than what’s required for most of the time. 

Azure NetApp Files performance of each volume can be adjusted at runtime.  As such, at any time, you can adjust the performance of your database by adjusting the data and log volume throughput to your specific requirements. For instance, you can fine-tune performance and reduce costs by allowing higher throughput at startup while reducing to KPIs for normal operation.  

## Next steps  

* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
