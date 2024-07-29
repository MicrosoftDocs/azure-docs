---
title: FAQs About Azure NetApp Files application volume groups | Microsoft Docs
description: answers frequently asked questions (FAQs) about Azure NetApp Files application volume groups.
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 05/19/2022
---
# Azure NetApp Files application volume group FAQs

This article answers frequently asked questions (FAQs) about Azure NetApp Files application volume group. 

## Generic FAQs

This section answers generic questions about Azure NetApp Files application volume groups.

### Why should I use a manual QoS capacity pool for all of my database volumes?

Manual QoS capacity pool provides the best balance between capacity and throughput to fit the database needs. It avoids over-provisioning to reach the performance of, for example, the log volume or data volume. It can also reserve larger space for log-backups while keeping the performance to a value that suits your needs. Overall, using manual QoS capacity pool results in a cost advantage.

> [!NOTE]
> During application volume group creation only manual QoS capacity pools will be displayed in the list to select from.

### Can I clone a volume created with application volume group? 

Yes, you can clone a volume created by the application volume group. You can do so by selecting a snapshot and [restoring it to a new volume](snapshots-restore-new-volume.md). Cloning is a process outside of the application volume group workflow. As such, consider the following restrictions:

* When you clone a single volume, none of the dependencies specific to the volume group are checked.
* The cloned volume isn't part of the volume group.
* The cloned volume is always placed on the same storage endpoint as the source volume.
* To achieve the lowest latency for the cloned volume, you need to mount with the same IP address as the source volume.

### How long does it take to create a volume group?

Creating a volume group involves many different steps, and not all of them can be done in parallel. Especially when you create the first volume group for a given location, it might take 9-12 minutes for completion. Subsequent volume groups should take less time to create.

### The deployment failed and not even a single volume was created. Why is that?

This is normal behavior. Application volume group will provision the volumes in an atomic fashion and roll back the deployment in case one of the components fails to deploy. Deployment typically fails because the given location doesn’t have enough available resources to accommodate your requirements. Check the deployment log for details and correct the capacity pool configuration where needed.

### Why can’t I edit the volume group description?

In the current implementation, the application volume group has a focus on the initial creation and deletion of a volume group only. 

### What snapshot policy should I use for my database volumes? 

You can use products such as [AzAcSnap](azacsnap-introduction.md) or Commvault for an application-consistent backup for your database environment. You can't use the standard snapshots scheduled by the Azure NetApp Files built-in snapshot policy for consistent data protection.

General recommendations for snapshots in a database environment are as follows:

* Closely monitor the data volume snapshots. Keeping snapshots for a long period might increase your capacity needs. Be sure to monitor the used capacity vs. allocated capacity.
* If you automatically create snapshots for primary data protection, be sure to monitor their retention to avoid unpredicted volume capacity consumption.

## FAQs about application volume group for SAP HANA

This section answers questions about Azure NetApp Files application volume group for SAP HANA. 

### The mount instructions of a volume include a list of IP addresses. Which IP address should I use?

Application volume group ensures that data and log volumes for one host always have separate storage endpoints with different IP addresses to achieve best performance. To host your data, log and shared volumes across the Azure NetApp Files storage resources, up to six storage endpoints can be created per used Azure NetApp Files storage resource. For this reason, it's recommended to size the delegated subnet accordingly. See [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md). Although all listed IP addresses can be used for mounting, the first listed IP address is the one that provides the lowest latency. It's recommended to always use the first IP address.

### Can I use `nconnect` as a mount option?

Azure NetApp Files does support `nconnect` for NFSv4.1 but requires the following Linux OS versions:

* SLES 15SP2 and higher
* RHEL 8.3 and higher

When you use the `nconnect` mount option, the read limit is up to 4500 MiB/s (see [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)), and the proposed throughput limits for the data volume might need to be adapted accordingly.

### Why is the `hostid` (for example, 00001) added to my names even when I've removed the `{Hostid}` placeholder?  

Application volume group requires the placeholder `{Hostid}` to be part of the names. If removed, the `hostid` is automatically added back to the provided string.

You can see the final names for each of the volumes after selecting **Review + Create**.

### Why is 1500 MiB/s the maximum throughput value that application volume group for SAP HANA proposes for the data volume?

NFSv4.1 is the supported protocol for SAP HANA and Oracle. As such, one TCP/IP session is supported when you mount a single volume. For running a single TCP session (that is, from a single host) against a single volume, 1500 MiB/s is the typical I/O limit identified. That's why application volume group for SAP HANA avoids allocating more throughput than you can realistically achieve. If you need more throughput, especially for larger HANA databases (for example, 12 TiB), you should use multiple partitions or use the `nconnect` mount option.

### How do I size Azure NetApp Files volumes for use with SAP HANA for optimal performance and cost-effectiveness? 

For optimal sizing, it's important to size for the complete landscape including snapshots and backup. Decide your volume layout for production, HA, and data protection, and perform your sizing using the [Azure NetApp Files sizing calculator for SAP HANA deployments](https://aka.ms/anfsapcalc).

### I received a warning message `"Not enough pool capacity"`. What can I do? 

Application volume group calculates the capacity and throughput demand of all volumes based on your input of the HANA memory. When you select the capacity pool, it immediately checks if there's enough capacity and throughput available in the capacity pool. 

At the initial **SAP HANA** screen, you can ignore this message and continue with the workflow by clicking the **Next** button. And you can later adapt the proposed values for each volume individually so that all volumes fit into the capacity pool. This error message reappears when you change each individual volume until all volumes fit into the capacity pool.

You may want to increase the size of the pool to avoid this warning message.

### How can I understand how to size my system or my overall system landscape?

Contact an SAP Azure NetApp Files sizing expert to help you plan the overall SAP system sizing. 

Important information you need to provide for each of the systems include the following items: SID, role (production, dev, pre-prod/QA), HANA memory, Snapshot reserve in percentage, number of days for local snapshot retention, number of file-based backups, single-host/multiple-host with the number of hosts, and HSR (primary, secondary).

You can use the [SAP HANA sizing estimator](https://aka.ms/anfsapcalc) to optimize the sizing process. 

If you know your systems (from running HANA before), you can provide manually your data instead of these generic assumptions. 

### Can I use the new SAP HANA feature of multiple partitions?

Application volume group for SAP HANA wasn't built with a dedicated focus on multiple partitions, but you can use application volume group for SAP HANA while adapting your input.

The basics for multiple partitions are as follows:  

* Multiple partitions mean that a single SAP HANA host is using more than one volume to store its persistence. 
* Multiple partitions need to mount on different paths. For example, the first volume is on `/hana/<SID>/data1/mnt00001`, and the second volume needs a different path (`/hana/<SID>/data2/mnt00002`). To achieve this outcome, you should adapt the naming convention manually. That is, `<SID>-DATA1-MNT00001; <SID>-DATA2-MNT00002, ...`.
* Memory is the key for application volume group for SAP HANA to size for capacity and throughput. As such, you need to adapt the size to accommodate the number of partitions. For two partitions, you should use 50% of the memory. For three partitions, you should use 33% of the memory, and so on. 

For each host and each partition you want to create, you need to rerun application volume group for SAP HANA, and you should adapt the naming proposal to meet the above recommendations.

For more details about this topic, see [Using Azure NetApp Files AVG for SAP HANA to deploy HANA with multiple partitions](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/using-azure-netapp-files-avg-for-sap-hana-to-deploy-hana-with/ba-p/3742747). 

### What are the rules behind the proposed throughput for my HANA data and log volumes?

SAP defines the Key Performance Indicators (KPIs) for the HANA volumes as 400 MiB/s for the data and 250 MiB/s for the log volume. This definition is independent of the size or the workload of the HANA database. Application volume group scales the throughput values in a way that even the smallest database meets the SAP HANA KPIs, and larger database benefits from a higher throughput level, scaling the proposal based on the entered HANA database size.

The following table describes the memory range and proposed throughput ***for the HANA data volume***:

<table><thead><tr><th colspan="2">Memory range (TB)</th><th rowspan="2">Proposed throughput (MB/s)</th></tr><tr><th>Minimum</th><th>Maximum</th></tr></thead><tbody><tr><td>0</td><td>1</td><td>400</td></tr><tr><td>1</td><td>2</td><td>600</td></tr><tr><td>2</td><td>4</td><td>800</td></tr><tr><td>4</td><td>6</td><td>1000</td></tr><tr><td>6</td><td>8</td><td>1200</td></tr><tr><td>8</td><td>10</td><td>1400</td></tr><tr><td>10</td><td>unlimited</td><td>1500</td></tr></tbody></table>

The following table  describes the memory range and proposed throughput ***for the HANA log volume***:

<table><thead><tr><th colspan="2">Memory range (TB)</th><th rowspan="2">Proposed throughput (MB/s)</th></tr><tr><th>Minimum</th><th>Maximum</th></tr></thead><tbody><tr><td>0</td><td>4</td><td>250</td></tr><tr><td>4</td><td>unlimited</td><td>500</td></tr></tbody></table>

Database volume throughput mostly affects the time it takes to read data into memory upon database startup. At runtime however, most of the I/O is write I/O, where even the KPIs show lower values. User experience shows that, for smaller databases, HANA KPI values may be higher than required for most of the time. 

Azure NetApp Files performance of each volume can be adjusted at runtime.  As such, at any time, you can adjust the performance of your database by adjusting the data and log volume throughput to your specific requirements. For instance, you can fine-tune performance and reduce costs by allowing higher throughput at startup while reducing to KPIs during normal operation.  

### Will all the volumes be provisioned in close proximity to my SAP HANA servers?

Using the proximity placement group (PPG) that you created for your SAP HANA servers ensures that the data, log, and shared volumes are created close to the SAP HANA servers to achieve the best latency and throughput. However, log-backup and data-backup volumes don’t require low latency. From a protection perspective, it makes sense to store these backup volumes in a different location from the data, log, and shared volumes. Therefore, application volume group places the backup volumes on a different storage location inside the region that has sufficient capacity and throughput available.

### What is the relationship between AVset, VM, PPG, and Azure NetApp Files volumes? 

A proximity placement group (PPG) needs to have at least one VM assigned to it, either directly or via an AVset. The purpose of the PPG is to extract the exact location of a VM and pass this information to application volume group to search for Azure NetApp Files resources in the very same data center. This setting only works when at least ONE VM in the PPG is started. Typically, you can add your database servers to the PPG.

PPGs have the side effect that if all VMs are shut down, a following restart of VMs DOES NOT guarantee that they will start in the same data center as before. To prevent this situation from happening, it's strongly recommended to use an AVset where all VMs and the PPG are associated to and use the [HANA pinning workflow](https://aka.ms/HANAPINNING). The workflow not only ensures that the VMs aren't moving when restarted, it also ensures that locations are selected where enough compute and Azure NetApp Files resources are available. 

### For a multi-host SAP HANA system, will the shared volume be resized when I add additional HANA hosts?

No. This scenario is currently one of the very few cases where you need to manually adjust the size. SAP recommends that you size the shared volume as 1 x RAM for every four HANA hosts. Because you create the shared volume as part of the first SAP HANA host, it’s already sized as 1 TB. There are two options to size the share volume for SAP HANA properly.

* If you know upfront that you need, for example, six hosts, you can modify the 1 TB proposal during the initial creation with the application volume group for SAP HANA. At that point, you can also increase the throughput (that is, the QoS) to accommodate six hosts.
* You can always edit the shared volume and change the size and throughput individually after the volume creation. You can do so within the volume placement group or directly in the volume using the Azure resource provider or GUI.

### I want to create the data-backup volume for not only a single instance but for more than one SAP HANA database. How can I do this?

Log-back and data-backup volumes are optional, and they don't require close proximity. The best way to achieve the intended outcome is to remove the data-backup or log-backup volume when you create the first volume from the application volume group for SAP HANA. You can then create your own volume as a single, independent volume using standard volume provisioning and selecting the proper capacity and throughput to meet your needs. You should use a naming convention that indicates a data-backup volume and that it's used for multiple SIDs.


## FAQs about application volume group for Oracle

This section answers questions about Azure NetApp Files application volume group for Oracle.

### Will all the volumes be provisioned in the same availability zone as my database server for Oracle?  

The deployment workflow ensures that all volumes are placed in the availability zone you have selected at time of creation, which should match the availability zone of your Oracle virtual machines. For regions that don't support availability zones, the volumes are placed with a regional scope. 

### How do I size Azure NetApp Files volumes for use with Oracle for optimal performance and cost-effectiveness?

For optimal sizing, it's important to size for the complete database landscape including HA, snapshots, and backup. Decide your volume layout for production, HA and data protection, and perform your sizing according to [Run Your Most Demanding Oracle Workloads in Azure without Sacrificing Performance or Scalability](https://techcommunity.microsoft.com/t5/azure-architecture-blog/run-your-most-demanding-oracle-workloads-in-azure-without/ba-p/3264545) and [Estimate Tool for Sizing Oracle Workloads to Azure IaaS VMs](https://techcommunity.microsoft.com/t5/data-architecture-blog/estimate-tool-for-sizing-oracle-workloads-to-azure-iaas-vms/ba-p/1427183). You can also use the [SAP on Azure NetApp Files Sizing Estimator](https://aka.ms/anfsapcalc) by using the **Add Single Volume** input option.

Important information you need to provide for sizing each of the volumes includes: SID, role (production, Dev, pre-prod/QA), snapshot reserve in percentage, number of days for local snapshot retention, number of file-based backups, single-host/multiple-host with the number of hosts, and Data Guard requirements (primary, secondary). Contact an Oracle on Azure NetApp Files sizing expert to help you plan the overall Oracle system sizing. 

### The mount instructions of a volume include a list of IP addresses. Which IP address should I use for Oracle?

Application volume group ensures that data, redo log, archive log and backup volumes have separate storage endpoints with different IP addresses to achieve best performance. Although all listed IP addresses can be used for mounting, the first listed IP address is the one that provides the lowest latency. It's recommended to always use the first IP address.

### What version of NFS should I use for my Oracle volumes?

Use Oracle dNFS at the client to mount your volumes. While mounting with dNFS works with volumes created with NFSv3 and NFSv4.1, we recommend deploying the volumes using NFSv3. For more details and release dependencies, consult your client operating system and Oracle notes. You can also find more details in [Benefits of using Azure NetApp Files with Oracle Database](solutions-benefits-azure-netapp-files-oracle-database.md) and [Oracle database performance on Azure NetApp Files multiple volumes](performance-oracle-multiple-volumes.md).

To achieve best performance for large databases, we recommend using dNFS at the database server to mount the volume. To simplify dNFS configuration, we recommend creating the volumes with NFSv3.

### What snapshot policy should I use for my Oracle volumes?

This question isn't directly related to application volume group for Oracle. You can use products such as AzAcSnap or Commvault for an application-consistent backup for your Oracle databases. You **cannot** use the standard snapshots scheduled by the Azure NetApp Files built-in snapshot policy for consistent data protection of your Oracle database.

General recommendations for snapshots in an Oracle environment are as follows:

* Use database-aware snapshot tooling to ensure database-consistent snapshot creation.
* Closely monitor the data volume snapshots. Keeping snapshots for a long period might increase your capacity needs. Be sure to monitor the used capacity vs. allocated capacity.
* If you automatically create snapshots for your backup volume, be sure to monitor their retention to avoid unpredicted volume growth.

### Can Oracle ASM be used with AVG for Oracle created volumes?

The use of Oracle ASM in combination with Azure NetApp Files Application volume group for Oracle is supported, but without support for snapshot consistency across the volumes in an application volume group. Customers are advised to use other compatible data protection options when using ASM until further notice.

### Why can I optionally use a proximity placement group (PPG) for Oracle deployment? 

When deploying in regions with limited resource availability, it may not be possible to deploy volumes in the most optimal locations. In such cases, you can choose to deploy volumes using the Proximity placement group function to achieve a deployment with the best possible volume placement in the given conditions. As default setting the use of PPG is disabled. You need to request enabling the use of proximity placement groups via the support channel.

## Next steps  

* About application volume group for SAP HANA: 
    * [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
    * [Requirements and considerations for application volume group for SAP HANA](application-volume-group-considerations.md)
    * [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
    * [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
    * [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
    * [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
    * [Manage volumes in an application volume group](application-volume-group-manage-volumes.md)
* About application volume group for Oracle: 
    * [Understand Azure NetApp Files application volume group for Oracle](application-volume-group-oracle-introduction.md)
    * [Requirements and considerations for application volume group for Oracle](application-volume-group-oracle-considerations.md)
    * [Deploy application volume group for Oracle](application-volume-group-oracle-deploy-volumes.md)
    * [Manage volumes in an application volume group for Oracle](application-volume-group-manage-volumes-oracle.md)
    * [Configure application volume group for Oracle using REST API](configure-application-volume-oracle-api.md) 
    * [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Delete an application volume group](application-volume-group-delete.md)
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
