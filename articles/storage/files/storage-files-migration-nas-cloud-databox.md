---
title: On-premises NAS migration to Azure file shares
description: Learn how to migrate files from an on-premises Network Attached Storage (NAS) location to Azure file shares with Azure DataBox.
author: fauhse
ms.service: storage
ms.topic: how-to
ms.date: 04/02/2020
ms.author: fauhse
ms.subservice: files
---

# Use DataBox to migrate from Network Attached Storage (NAS) to Azure file shares

This migration article is one of several involving the keywords NAS and Azure DataBox. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; DataBox &rArr; Azure file share
> * Caching files on-premises: No, the final goal is to use the Azure file shares directly in the cloud. There is no plan to use Azure File Sync.

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

This article guides you end-to-end through the planning, deployment, and networking configurations needed to migrate from your NAS appliance to functional Azure file shares. This guide uses Azure DataBox for bulk data transport (offline data transport).

## Migration goals

The goal is to move the shares that you have on your NAS appliance to Azure and have them become native Azure file shares you can use without a need for a Windows Server. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

The migration process consists of several phases. You'll need to deploy Azure storage accounts and file shares, configure networking, migrate using Azure DataBox, catch-up with changes via RoboCopy, and finally, cut-over your users to the newly created Azure file shares. The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you are returning to this article, use the navigation on the right side to jump to the migration phase where you left off.

## Phase 1: Identify how many Azure file shares you need

[!INCLUDE [storage-files-migration-namespace-mapping](../../../includes/storage-files-migration-namespace-mapping.md)]

## Phase 2: Deploy Azure storage resources

In this phase, consult the mapping table from Phase 1 and use it to provision the correct number of Azure storage accounts and file shares within them.

[!INCLUDE [storage-files-migration-provision-azfs](../../../includes/storage-files-migration-provision-azure-file-share.md)]

## Phase 3: Determine how many Azure DataBox appliances you need

Start this step only, when you have completed the previous phase. Your Azure storage resources (storage accounts and file shares) should be created at this time. During your DataBox order, you need to specify into which storage accounts the DataBox is moving data.

In this phase, you need to map the results of the migration plan from the previous phase to the limits of the available DataBox options. These considerations will help you make a plan for which DataBox options you should choose and how many of them you will need to move your NAS shares to Azure file shares.

To determine how many devices of which type you need, consider these important limits:

* Any Azure DataBox can move data into up to 10 storage accounts. 
* Each DataBox option comes at their own usable capacity. See [DataBox options](#databox-options).

Consult your migration plan for the number of storage accounts you have decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information will allow you to optimize and decide which appliance should be sending data to which storage accounts. You can have two DataBox devices move files into the same storage account, but don't split content of a single file share across 2 DataBoxes.

### DataBox options

For a standard migration, one or a combination of these three DataBox options should be chosen: 

* DataBox Disks
  Microsoft will send you one and up to five SSD disks with a capacity of 8 TiB each, for a maximum total of 40 TiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [DataBox Disks documentation](../../databox/data-box-disk-overview.md).
* DataBox
  This is the most common option. A ruggedized DataBox appliance, that works similar to a NAS, will be shipped to you. It has a usable capacity of 80 TiB. For more information, see [DataBox documentation](../../databox/data-box-overview.md).
* DataBox Heavy
  This option features a ruggedized DataBox appliance on wheels, that works similar to a NAS, with a capacity of 1 PiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [DataBox Heavy documentation](../../databox/data-box-heavy-overview.md).

## Phase 4: Provision a temporary Windows Server

While you wait for your Azure DataBox(es) to arrive, you can already deploy one or more Windows Servers you will need for running RoboCopy jobs. 

- The first use of these servers will be to copy files onto the DataBox.
- The second use of these servers will be to catch-up with changes that have occurred on the NAS appliance while DataBox was in transport. This approach keeps downtime on the source side to a minimum.

The speed in which your RoboCopy jobs work depend on mainly these factors:

* IOPS on the source and target storage
* the available network bandwidth between them </br> Find more details in the Troubleshooting section: [IOPS and Bandwidth considerations](#iops-and-bandwidth-considerations)
* the ability to quickly process files and folders in a namespace </br> Find more details in the Troubleshooting section: [Processing speed](#processing-speed)
* the number of changes between RoboCopy runs </br> Find more details in the Troubleshooting section: [Avoid unnecessary work](#avoid-unnecessary-work)

It is important to keep the referenced details in mind when deciding on the RAM and thread count you will provide to your temporary Windows Server(s).

## Phase 5: Preparing to use Azure file shares

To save time, you should proceed with this phase while you wait for your DataBox to arrive. With the information in this phase, you will be able to decide how your servers and users in Azure and outside of Azure will be enabled to utilize your Azure file shares. The most critical decisions are:

- **Networking:** Enable your networks to route SMB traffic.
- **Authentication:** Configure Azure storage accounts for Kerberos authentication. AdConnect and Domain joining your storage account will allow your apps and users to use their AD identity to for authentication
- **Authorization:** Share-level ACLs for each Azure file share will allow AD users and groups to access a given share and within an Azure file share, native NTFS ACLs will take over. Authorization based on file and folder ACLs then works like it does for on-premises SMB shares.
- **Business continuity:** Integration of Azure file shares into an existing environment often entails to preserve existing share addresses. If you are not already using DFS-Namespaces, consider establishing that in your environment. You'd be able to keep share addresses your users and scripts use, unchanged. You would use DFS-N as a namespace routing service for SMB, by redirecting DFS-Namespace targets to Azure file shares after their migration.

:::row:::
    :::column:::
        <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/jd49W33DxkQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps.</br>
        The video references dedicated documentation for some topics:

* [Identity overview](storage-files-active-directory-overview.md)
* [How to domain join a storage account](storage-files-identity-auth-active-directory-enable.md)
* [Networking overview for Azure file shares](storage-files-networking-overview.md)
* [How to configure public and private endpoints](storage-files-networking-endpoints.md)
* [How to configure a S2S VPN](storage-files-configure-s2s-vpn.md)
* [How to configure a Windows P2S VPN](storage-files-configure-p2s-vpn-windows.md)
* [How to configure a Linux P2S VPN](storage-files-configure-p2s-vpn-linux.md)
* [How to configure DNS forwarding](storage-files-networking-dns.md)
* [Configure DFS-N](/windows-server/storage/dfs-namespaces/dfs-overview)
   :::column-end:::
:::row-end:::

## Phase 6: Copy files onto your DataBox

When your DataBox arrives, you need to set up your DataBox in a line of sight to your NAS appliance. Follow the setup documentation for the DataBox type you ordered.

* [Set up Data Box](../../databox/data-box-quickstart-portal.md)
* [Set up Data Box Disk](../../databox/data-box-disk-quickstart-portal.md)
* [Set up Data Box Heavy](../../databox/data-box-heavy-quickstart-portal.md)

Depending on the DataBox type, there maybe DataBox copy tools available to you. At this point, they are not recommended for migrations to Azure file shares as they do not copy your files with full fidelity to the DataBox. Use RoboCopy instead.

When your DataBox arrives, it will have pre-provisioned SMB shares available for each storage account you specified at the time of ordering it.

* If your files go into a premium Azure file share, there will be one SMB share per premium "File storage" storage account.
* If your files go into a standard storage account, there will be three SMB shares per standard (GPv1 and GPv2) storage account. Only the file shares ending with `_AzFiles` are relevant for your migration. Ignore any block and page blob shares.

Follow the steps in the Azure DataBox documentation:

1. [Connect to Data Box](../../databox/data-box-deploy-copy-data.md)
1. Copy data to Data Box
1. [Prepare your DataBox for departure to Azure](../../databox/data-box-deploy-picked-up.md)

The linked DataBox documentation specifies a RoboCopy command. However, the command is not suitable to preserve the full file and folder fidelity. Use this command instead:

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

## Phase 7: Catch-up RoboCopy from your NAS

Once your DataBox reports that all files and folders have been placed into the planned Azure file shares, you can continue with this phase.
A catch-up RoboCopy is only needed if the data on the NAS may have changed since the DataBox copy was started. In certain scenarios where you use a share for archiving purposes, you might be able to stop changes to the share on your NAS until the migration is complete. You might also have the ability to serve your business requirements by setting NAS shares to read-only during the migration.

In cases where you need a share to be read-write during the migration and can only absorb a small downtime window, this catch-up RoboCopy step will be important to complete before the fail-over of user access directly to the Azure file share.

In this step, you will run RoboCopy jobs to catch up your cloud shares with the latest changes on your NAS since the time you forked your shares onto the DataBox.
This catch-up RoboCopy may finish quickly or take a while, depending on the amount of churn that happened on your NAS shares.

Run the first local copy to your Windows Server target folder:

1. Identify the first location on your NAS appliance.
1. Identify the matching Azure file share.
1. Mount the Azure file share as a local network drive on your temporary Windows Server
1. Start the copy using RoboCopy as described

### Mounting an Azure file share

Before you can use RoboCopy, you need to make the Azure file share accessible over SMB. The easiest way is to mount the share as a local network drive to the Windows Server you are planning on using for RoboCopy. 

> [!IMPORTANT]
> Before you can successfully mount an Azure file share to a local Windows Server, you need to have completed Phase : Preparing to use Azure file shares!

Once you are ready, review the [Use an Azure file share with Windows how-to article](storage-how-to-use-files-windows.md) and mount the Azure file share you want to start the NAS catch-up RoboCopy for.

### RoboCopy

The following RoboCopy command will copy only the differences (updated files and folders) from your NAS storage to your Azure file share. 

[!INCLUDE [storage-files-migration-robocopy](../../../includes/storage-files-migration-robocopy.md)]

> [!TIP]
> [Check out the Troubleshooting section](#troubleshoot) if RoboCopy is impacting your production environment, reports lots of errors or is not progressing as fast as expected.

### User cut-over

When you run the RoboCopy command for the first time, your users and applications are still accessing files on the NAS and potentially change them. It is possible, that RoboCopy has processed a directory, moves on to the next and then a user on the source location (NAS) adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. This behavior is expected.

The first run is about moving the bulk of the churned data to your Azure file share. This first copy can take a while. Check out the [Troubleshooting section](#troubleshoot) for more insight into what can affect RoboCopy speeds.

Once the initial run is complete, run the command again.

A second time you run RoboCopy for the same share, it will finish faster, because it only needs to transport changes that happened since the last run. You can run repeated jobs for the same share.

When you consider the downtime acceptable, then you need to remove user access to your NAS-based shares. You can do that by any steps that prevent users from changing the file and folder structure and content. An example is to point your DFS-Namespace to a non-existing location or change the root ACLs on the share.

Run one last RoboCopy round. It will pick up any changes, that might have been missed.
How long this final step takes, is dependent on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions as on your NAS SMB share. If you had an enterprise-class domain-joined NAS, then the user SIDs will automatically match as the users exist in Active Directory and RoboCopy copies files and metadata at full fidelity. If you have used local users on your NAS, you need to re-create these users as Windows Server local users and map the existing SIDs RoboCopy moved over to your Windows Server to the SIDs of your new, Windows Server local users.

You have finished migrating a share / group of shares into a common root or volume. (Depending on your mapping from Phase 1)

You can try to run a few of these copies in parallel. We recommend processing the scope of one Azure file share at a time.

## Troubleshoot

Speed and success rate of a given RoboCopy run will depend on several factors:

* IOPS on the source and target storage
* the available network bandwidth between them
* the ability to quickly process files and folders in a namespace
* the number of changes between RoboCopy runs


### IOPS and Bandwidth considerations

In this category you need to consider abilities of the **source** (your NAS), the **target** (Azure DataBox and later Azure file share), and the **network** connecting them. The maximum possible throughput is determined by the slowest of these three components. A standard DataBox comes with dual 10-Gbps network interfaces. Depending on your NAS, you may be able to match that. Make sure your network infrastructure is configured to support optimal transfer speeds to its best abilities.

> [!CAUTION]
> While copying as fast as possible is often most desireable, consider the utilization of your local network and NAS appliance for other, often business critical tasks.

Copying as fast as possible might not be desirable when there is a risk that the migration could monopolize available resources.

* Consider when it's best in your environment to run migrations: during the day, off-hours, or during weekends.
* Also consider networking QoS on a Windows Server to throttle the RoboCopy speed and thus the impact on NAS and network.
* Avoid unnecessary work for the migration tools.

RobCopy itself also has the ability to insert inter-packet delays by specifying the `/IPG:n` switch where `n` is measured in milliseconds between RoboCopy packets. Using this switch can help avoid monopolization of resources on both IO constrained NAS devices, and highly utilized network links. 

`/IPG:n` cannot be used for precise network throttling to a certain Mbps. Use Windows Server Network QoS instead. RoboCopy entirely relies on the SMB protocol for all networking and thus doesn't have the ability to influence the network throughput itself, but it can slow down its utilization. 

A similar line of thought applies to the IOPS observed on the NAS. The cluster size on the NAS volume, packet sizes, and an array of other factors influence the observed IOPS. Introducing inter-packet delay is often the easiest way to control the load on the NAS. Test multiple values, for instance from about 20 milliseconds (n=20) to multiples of that to see how much delay allows your other requirements to be serviced while keeping the RoboCopy speed at it's maximum for your constraints.

### Processing speed

RoboCopy will traverse the namespace it is pointed to and evaluate each file and folder for copy. Every file will be evaluated during an initial copy, such as a copy over the local network to a DataBox, and even during catch-up copies over the WAN link to an Azure file share.

We often default to considering bandwidth as the most limiting factor in a migration - and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files will take considerably longer than copying 1 TiB of fewer but larger files - granted that all other variables are the same.

The cause for this difference is the processing power needed to walk through a namespace. RoboCopy supports multi-threaded copies through the `/MT:n` parameter where n stands for the number of processor threads. So when provisioning a machine specifically for RoboCopy, consider the number of processor cores and their relationship to the thread count they provide. Most common are two threads per core. The core and thread count of a machine is an important data point to decide what multi-thread values `/MT:n` you should specify. Also consider how many RoboCopy jobs you plan to run in parallel on a given machine.

More threads will copy our 1Tib example of small files considerably faster than fewer threads. At the same time, there is a decreasing return on investment on our 1Tib of larger files. They will still copy faster the more threads you assign but you are getting more likely to be network bandwidth or IO constrained.

### Avoid unnecessary work

Avoid large-scale changes in your namespace. That includes moving files between directories, changing properties at a large scale, or changing permissions (NTFS ACLs) because they often have a cascading change effect when folder ACLs closer to the root of a share are changed. Consequences can be:

* extended RoboCopy job run time due to each file and folder affected by an ACL change needing to be updated
* effectiveness of using DataBox in the first place can decrease when folder structures change after files had been copied to a DataBox. A RoboCopy job will not be able to "play back" a namespace change and rather will need to purge the files transported to an Azure file share and upload the files in the new folder structure again to Azure.

Another important aspect is to use the RoboCopy tool effectively. With the recommended RoboCopy script, you will create and save a log file for errors. Copy errors can occur - that is normal. These errors often make it necessary to run multiple rounds of a copy tool like RoboCopy. An initial run, say from NAS to DataBox, and one or more extra ones with the /MIR switch to catch and retry files that didn't get copied.

You should be prepared to run multiple rounds of RoboCopy against a given namespace scope. Successive runs will finish faster as they have less to copy but are constrained increasingly by the speed of processing the namespace. When you run multiple rounds, you can speed up each round by not having RoboCopy try unreasonably hard to copy everything at first attempt. These RoboCopy switches can make a significant difference:

* `/R:n` n = how often you retry to copy a failed file and 
* `/W:n` n = how many seconds to wait between retries

`/R:5 /W:5` is a reasonable setting that you can adjust to your liking. In this example, a failed file will be retried five times, with five-second wait time between retries. If the file still fails to copy, the next RoboCopy job will try again and often files that failed because they are in use or because of timeout issues might eventually be copied successfully this way.


## Next steps

There is more to discover about Azure file shares. The following articles help understand advanced options, best practices, and also contain troubleshooting help. These articles link to [Azure file share documentation](storage-files-introduction.md) as appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../common/storage-monitoring-diagnosing-troubleshooting.md)
* [Networking considerations for direct access](storage-files-networking-overview.md)
* [Backup: Azure file share snapshots](storage-snapshots-files.md)
