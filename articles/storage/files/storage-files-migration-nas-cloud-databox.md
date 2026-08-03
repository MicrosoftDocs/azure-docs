---
title: On-premises NAS migration to Azure Files
description: Learn how to migrate files from an on-premises Network Attached Storage (NAS) location to Azure file shares with Azure Data Box.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 07/31/2026
ms.author: kendownie
recommendations: false
# Customer intent: "As an IT administrator managing on-premises NAS solutions, I want to migrate our file storage to Azure file shares using Data Box, so that I can ensure data integrity, maintain accessibility during the transition, and eliminate reliance on local storage infrastructure."
---

# Use Data Box to migrate from Network Attached Storage (NAS) to Azure file shares

:heavy_check_mark: **Applies to:** Classic SMB file shares created with the Microsoft.Storage resource provider

:heavy_multiplication_x: **Doesn't apply to:** All NFS file shares including file shares created with the Microsoft.FileShares resource provider or classic file shares created with the Microsoft.Storage resource provider

This migration article is one of several involving the keywords NAS and Azure Data Box. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; Data Box &rArr; Azure file share
> * No caching files on-premises: Because the final goal is to use the Azure file shares directly in the cloud, there's no plan to use Azure File Sync.

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

> [!NOTE]
> Data Box supports NFS as a copy protocol, so you can use it to copy data from a NAS that serves NFS. However, Data Box doesn't support importing data directly into NFS Azure file shares. This guide covers SMB file share targets only.

This article guides you end-to-end through the planning, deployment, and networking configurations needed to migrate from your NAS appliance to functional Azure file shares. This guide uses Azure Data Box for bulk data transport (offline data transport).

## Migration goals

The goal is to move the shares on your NAS appliance to Azure and have them become native Azure file shares. You can use native Azure file shares without a need for a Windows Server. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

The migration process consists of several phases. First, deploy Azure storage accounts and file shares and configure networking. Then, migrate your files by using Azure Data Box and RoboCopy to catch up with changes. Finally, cut over your users and apps to the newly created Azure file shares. The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you're returning to this article, use the navigation on the right side to jump to the migration phase where you left off.

## Phase 1: Identify how many Azure file shares you need

Determine how many Azure file shares you need. You might have more folders on your volumes that you currently share out locally as SMB shares to your users and apps. Depending on the number of file shares you want to migrate to the cloud, choose either a one-to-one mapping or share grouping.

### Use a 1:1 mapping

If you have a small number of shares, use a one-to-one mapping. The easiest way to picture this scenario is to envision an on-premises share that maps one-to-one to an Azure file share.

### Use share grouping

If you have a large number of file shares, consider share grouping. For example, if your human resources (HR) department has 15 shares, you might consider storing all the HR data in a single Azure file share. That way, only a single Azure file share in the cloud is needed for this group of on-premises shares.

## Phase 2: Deploy Azure storage resources

In this phase, provision the Azure storage accounts and the file shares within them.

Remember that an Azure file share is deployed in the cloud in an Azure storage account. For HDD (standard) file shares, that arrangement makes the storage account a scale target for performance numbers like IOPS and throughput. If you place multiple file shares in a single storage account, you're creating a shared pool of IOPS and throughput for these shares. 

As a general rule, you can pool multiple Azure file shares into the same storage account if you have archival shares or you expect low day-to-day activity in them. However, if you have highly active shares (shares used by many users and applications), deploy storage accounts with one file share each. These limitations don't apply to FileStorage (SSD) storage accounts, where performance is explicitly provisioned and guaranteed for each share.

> [!NOTE]
> There's a limit of 250 storage accounts per subscription per Azure region. With a quota increase, you can create up to 500 storage accounts per region. For more information, see [Increase Azure Storage account quotas](/azure/quotas/storage-account-quota-requests).

Another consideration when you're deploying a storage account is redundancy. See [Azure Files redundancy](files-redundancy.md).

If you make a list of your shares, map each share to the storage account where you create it.

The names of your resources are also important. For example, if you group multiple shares for the HR department into an Azure storage account, name the storage account appropriately. Similarly, when you name your Azure file shares, use names similar to the ones used for their on-premises counterparts.

Now deploy the appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them, following the instructions in [Create an SMB file share](storage-how-to-create-file-share.md). In most cases, make sure the region of each of your storage accounts is the same.

## Phase 3: Determine how many Azure Data Box appliances you need

Start this step only when you complete the previous phase. At this point, you should have created your Azure storage resources, including storage accounts and file shares. During your Data Box order, you need to specify which storage accounts the Data Box moves data into.

In this phase, map the results of the migration plan from the previous phase to the limits of the available Data Box options. These considerations help you make a plan for which Data Box options to choose and how many you need to move your NAS shares to Azure file shares.

To determine how many devices of which type you need, consider these important limits:

* Any Azure Data Box can move data into up to 10 storage accounts. 
* Each Data Box option has its own usable capacity. See [Data Box options](#data-box-options).

Consult your migration plan for the number of storage accounts you decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information lets you decide which appliance should send data to which storage accounts. You can have two Data Box devices move files into the same storage account, but don't split content of a single file share across two Data Box appliances.

### Data Box options

For a standard migration, choose one or a combination of these two Data Box options:

* Data Box
  This option is the most common choice. It's a ruggedized Data Box appliance that works similar to a NAS. It ships to you with a usable capacity of 80 TiB. For more information, see [Data Box documentation](../../databox/data-box-overview.md).
* Data Box Heavy
  This option features a ruggedized Data Box appliance on wheels that works similar to a NAS, with a capacity of 1 PiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [Data Box Heavy documentation](../../databox/data-box-heavy-overview.md).

> [!WARNING]
> Data Box Disks isn't recommended for migrations into Azure file shares. Data Box Disks doesn't preserve file metadata, such as access permissions (ACLs) and other attributes.

## Phase 4: Provision a temporary Windows Server

While you wait for your Azure Data Box appliances to arrive, you can already deploy one or more Windows Servers you need for running RoboCopy jobs. For OS version requirements, see the [important note in the RoboCopy section](#robocopy).

- Use these servers to copy files onto the Data Box.
- Use these servers to catch up with changes that occur on the NAS appliance while the Data Box is in transport. This approach keeps downtime on the source side to a minimum.

The speed at which your RoboCopy jobs work depends mainly on these factors:

* IOPS on the source and target storage
* the available network bandwidth between them </br> Find more details: [IOPS and Bandwidth considerations](#iops-and-bandwidth-considerations)
* the ability to quickly process files and folders in a namespace </br> Find more details: [Processing speed](#processing-speed)
* the number of changes between RoboCopy runs </br> Find more details: [Avoid unnecessary work](#avoid-unnecessary-work)

Keep the referenced details in mind when deciding on the RAM and thread count you provide to your temporary Windows Server(s).

## Phase 5: Preparing to use Azure file shares

To save time, proceed with this phase while you wait for your Data Box to arrive. With the information in this phase, you can decide how your servers and users can use your Azure file shares. The most critical decisions are:

- **Networking:** Enable your networks to route SMB traffic.
- **Authentication:** Configure Azure storage accounts for Kerberos authentication. Microsoft Entra Connect and domain-joining your storage account lets your apps and users use their AD identity for authentication.
- **Authorization:** Share-level ACLs for each Azure file share let AD users and groups access a given share, and within an Azure file share, native NTFS ACLs take over. Authorization based on file and folder ACLs then works like it does for on-premises SMB shares.
- **Business continuity:** Integration of Azure file shares into an existing environment often involves preserving existing share addresses. If you aren't already using DFS-Namespaces, consider establishing that in your environment. You can keep share addresses your users and scripts use, unchanged. You would use DFS-N as a namespace routing service for SMB, by redirecting DFS-Namespace targets to Azure file shares after their migration.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps.</br>
        The video references dedicated documentation for the following topics. Note that Azure Active Directory is now Microsoft Entra ID. For more information, see [New name for Azure AD](https://aka.ms/azureadnewname).

* [Identity-based authentication for SMB overview](storage-files-active-directory-overview.md)
* [Networking overview for Azure file shares](storage-files-networking-overview.md)
* [How to configure public and private endpoints](storage-files-networking-endpoints.md)
* [How to configure a S2S VPN](storage-files-configure-s2s-vpn.md)
* [How to configure a Windows P2S VPN](storage-files-configure-p2s-vpn-windows.md)
* [How to configure a Linux P2S VPN](storage-files-configure-p2s-vpn-linux.md)
* [How to configure DNS forwarding](storage-files-networking-dns.md)
* [Configure DFS-N](files-manage-namespaces.md)
   :::column-end:::
:::row-end:::

## Phase 6: Copy files onto your Data Box

When your Data Box arrives, set up your Data Box with unimpeded network connectivity to your NAS appliance. Follow the setup documentation for the Data Box type you ordered.

* [Set up Data Box](../../databox/data-box-quickstart-portal.md)
* [Set up Data Box Disk](../../databox/data-box-disk-quickstart-portal.md)
* [Set up Data Box Heavy](../../databox/data-box-heavy-quickstart-portal.md)

Depending on the Data Box type, you might have access to Data Box copy tools. At this point, don't use them for migrations to Azure file shares as they don't copy your files with full fidelity to the Data Box. Use RoboCopy instead.

When your Data Box arrives, it has pre-provisioned SMB shares available for each storage account you specified at the time of ordering it.

* If your files go into an SSD Azure file share, there's one SMB share per SSD "File storage" storage account.
* If your files go into an HDD storage account, there are three SMB shares per HDD pay-as-you-go storage account. Only the file shares ending with `_AzFiles` are relevant for your migration. Ignore any block and page blob shares.

Follow the steps in the Azure Data Box documentation:

1. [Connect to Data Box](../../databox/data-box-deploy-copy-data.md)
1. Copy data to Data Box
1. Review the RoboCopy log file for errors to confirm all files copied successfully.
1. [Prepare your Data Box for departure to Azure](../../databox/data-box-deploy-picked-up.md)

The linked Data Box documentation specifies a RoboCopy command. However, the command isn't suitable to preserve the full file and folder fidelity. This command uses `/MT:32` because it's a local LAN copy to the Data Box with negligible latency, so a higher thread count is appropriate here than for the WAN-based catch-up copy in Phase 7:

```console
Robocopy /MT:32 /NP /NFL /NDL /B /MIR /IT /COPY:DATSO /DCOPY:DAT /UNILOG:<FilePathAndName> <SourcePath> <Dest.Path> 
```
* To learn more about the details of the individual RoboCopy flags, check out the table in the upcoming [RoboCopy section](#robocopy).
* To learn more about how to appropriately size the thread count `/MT:n`, optimize RoboCopy speed, and make RoboCopy a good neighbor in your data center, take a look at the [RoboCopy troubleshooting section](#troubleshoot).

> [!TIP]
> As an alternative to RoboCopy, Data Box provides a data copy service. You can use this service to load files onto your Data Box with full fidelity. [Follow this data copy service tutorial](../../databox/data-box-deploy-copy-data-via-copy-service.md) and make sure to set the correct Azure file share target.

## Phase 7: Catch-up RoboCopy from your NAS

After your Data Box reports that it placed all files and folders into the planned Azure file shares, continue with this phase.
You only need a catch-up RoboCopy if the data on the NAS might have changed since the Data Box copy started. In certain scenarios where you use a share for archiving purposes, you might be able to stop changes to the share on your NAS until the migration is complete. You might also have the ability to serve your business requirements by setting NAS shares to read-only during the migration.

In cases where you need a share to be read-write during the migration and can only absorb a small downtime window, this catch-up RoboCopy step is important to complete before the failover of user access directly to the Azure file share.

In this step, run RoboCopy jobs to catch up your cloud shares with the latest changes on your NAS since the time you forked your shares onto the Data Box.
This catch-up RoboCopy might finish quickly or take a while, depending on the amount of churn that happened on your NAS shares.

Run the first local copy to your Windows Server target folder:

1. Identify the first location on your NAS appliance.
1. Identify the matching Azure file share.
1. Mount the Azure file share as a local network drive on your temporary Windows Server.
1. Start the copy using RoboCopy as described.

### Mounting an Azure file share

Before you can use RoboCopy, you need to make the Azure file share accessible over SMB. The easiest way is to mount the share as a local network drive to the Windows Server you are planning on using for RoboCopy. 

> [!IMPORTANT]
> Before you can successfully mount an Azure file share to a local Windows Server, you must complete [Phase 5: Preparing to use Azure file shares](#phase-5-preparing-to-use-azure-file-shares).

When you're ready, review the [Use an Azure file share with Windows how-to article](storage-how-to-use-files-windows.md) and mount the Azure file share you want to start the NAS catch-up RoboCopy for.

### RoboCopy

The following RoboCopy command copies only the differences (updated files and folders) from your NAS storage to your Azure file share. 

```console
robocopy <SourcePath> <Dest.Path> /MT:20 /R:2 /W:1 /B /MIR /IT /COPY:DATSO /DCOPY:DAT /NP /NFL /NDL /XD "System Volume Information" /UNILOG:<FilePathAndName> 
```

| Switch                | Meaning |
|-----------------------|---------|
| `/MT:n`               | Allows Robocopy to run multithreaded. Default for `n` is 8. The maximum is 128 threads. While a high thread count helps saturate the available bandwidth, it doesn't mean your migration will always be faster with more threads. Tests with Azure Files indicate between 8 and 20 shows balanced performance for an initial copy run. Subsequent `/MIR` runs are progressively affected by available compute vs available network bandwidth. For subsequent runs, match your thread count value more closely to your processor core count and thread count per core. Consider whether cores need to be reserved for other tasks that a production server might have. Tests with Azure Files have shown that up to 64 threads produce a good performance, but only if your processors can keep them alive at the same time. |
| `/R:n`                | Maximum retry count for a file that fails to copy on first attempt. Robocopy will try `n` times before the file permanently fails to copy in the run. You can optimize the performance of your run: Choose a value of two or three if you believe timeout issues caused failures in the past. This may be more common over WAN links. Choose no retry or a value of one if you believe the file failed to copy because it was actively in use. Trying again a few seconds later may not be enough time for the in-use state of the file to change. Users or apps holding the file open may need hours more time. In this case, accepting the file wasn't copied and catching it in one of your planned, subsequent Robocopy runs, may succeed in eventually copying the file successfully. That helps the current run to finish faster without being prolonged by many retries that ultimately end up in a majority of copy failures due to files still open past the retry timeout. |
| `/W:n`                | Specifies the time Robocopy waits before attempting to copy a file that didn't successfully copy during a previous attempt. `n` is the number of seconds to wait between retries. `/W:n` is often used together with `/R:n`. |
| `/B`                  | Runs Robocopy in the same mode that a backup application would use. This switch allows Robocopy to move files that the current user doesn't have permissions for. The backup switch depends on running the Robocopy command in an administrator elevated console or PowerShell window. If you use Robocopy for Azure Files, make sure you mount the Azure file share using the storage account access key versus a domain identity. If you don't, the error messages might not intuitively lead you to a resolution of the problem. |
| `/MIR`                | (Mirror source to target.) Allows Robocopy to copy only deltas between source and target. Empty subdirectories will be copied. Items (files or folders) that have changed or don't exist on the target will be copied. Items that exist on the target but not on the source will be purged (deleted) from the target. When you use this switch, match the source and target folder structures exactly. *Matching* means copying from the correct source and folder level to the matching folder level on the target. Only then can a "catch up" copy be successful. When source and target are mismatched, using `/MIR` will lead to large-scale deletions and recopies. |
| `/IT`                 | Ensures fidelity is preserved in certain mirror scenarios. </br>For example, if a file experiences an ACL change and an attribute update between two Robocopy runs, it's marked hidden. Without `/IT`, the ACL change might be missed by Robocopy and not transferred to the target location. |
|`/COPY:[copyflags]`    | The fidelity of the file copy. Default: `/COPY:DAT`. Copy flags: `D`= Data, `A`= Attributes, `T`= Timestamps, `S`= Security = NTFS ACLs, `O`= Owner information, `U`= A<u>u</u>diting information. Auditing information can't be stored in an Azure file share. |
| `/DCOPY:[copyflags]`  | Fidelity for the copy of directories. Default: `/DCOPY:DA`. Copy flags: `D`= Data, `A`= Attributes, `T`= Timestamps. |
| `/NP`                 | Specifies that the progress of the copy for each file and folder won't be displayed. Displaying the progress significantly lowers copy performance. |
| `/NFL`                | Specifies that file names aren't logged. Improves copy performance. |
| `/NDL`                | Specifies that directory names aren't logged. Improves copy performance. |
| `/XD`                 | Specifies directories to be excluded. When running Robocopy on the root of a volume, consider excluding the hidden `System Volume Information` folder. If used as designed, all information in there is specific to the exact volume on this exact system and can be rebuilt on-demand. Copying this information isn't helpful in the cloud or when the data is ever copied back to another Windows volume. Leaving this content behind isn't data loss. |
| `/UNILOG:<file name>` | Writes status to the log file as Unicode. (Overwrites the existing log.) |
| `/L`                  | **Only for a test run** </br> Files are to be listed only. They won't be copied, not deleted, and not time stamped. Often used with `/TEE` for console output. Flags from the sample script, like `/NP`, `/NFL`, and `/NDL`, might need to be removed to achieve you properly documented test results. |
| `/Z`                  | **Use cautiously** </br>Copies files in restart mode. This switch is recommended only in an unstable network environment. It significantly reduces copy performance because of extra logging. |
| `/ZB`                 | **Use cautiously** </br>Uses restart mode. If access is denied, this option uses backup mode. This option significantly reduces copy performance because of checkpointing. |

> [!IMPORTANT]
> If possible, use Windows Server 2022 or later. When using Windows Server 2019, ensure that the latest patch level or at least [OS update KB5005103](https://support.microsoft.com/topic/august-26-2021-kb5005103-os-build-18363-1766-preview-4e23362c-5e43-4d8f-95e5-9fdade60605f) is installed. It contains important fixes for certain Robocopy scenarios.

> [!TIP]
> [Check out the Troubleshooting section](#troubleshoot) if RoboCopy is impacting your production environment, reports lots of errors or is not progressing as fast as expected.

### User cut-over

When you run the RoboCopy command for the first time, your users and applications are still accessing files on the NAS and potentially change them. It's possible that RoboCopy has processed a directory, moves on to the next, and then a user on the source location (NAS) adds, changes, or deletes a file that will now not be processed in this current RoboCopy run. This behavior is expected.

The first run is about moving the bulk of the churned data to your Azure file share. This first copy can take a while. Check out the [Troubleshooting section](#troubleshoot) for more insight into what can affect RoboCopy speeds.

After the initial run completes, run the command again.

The second time you run RoboCopy for the same share, it finishes faster, because it only needs to transport changes that happened since the last run. You can run repeated jobs for the same share.

When you consider the downtime acceptable, then you need to remove user access to your NAS-based shares. You can do that by any steps that prevent users from changing the file and folder structure and content. An example is to point your DFS-Namespace to a non-existing location or change the root ACLs on the share.

Run one last RoboCopy round. It picks up any changes that might have been missed.
How long this final step takes depends on the speed of the RoboCopy scan. You can estimate the time (which is equal to your downtime) by measuring how long the previous run took.

Create a share on the Windows Server folder and possibly adjust your DFS-N deployment to point to it. Be sure to set the same share-level permissions as on your NAS SMB share. If you had an enterprise-class domain-joined NAS, then the user SIDs will automatically match as the users exist in Active Directory and RoboCopy copies files and metadata at full fidelity. If you have used local users on your NAS, you need to re-create these users as Windows Server local users and map the existing SIDs RoboCopy moved over to your Windows Server to the SIDs of your new, Windows Server local users.

You've finished migrating a share or group of shares into a common root or volume.

You can try to run a few of these copies in parallel. Process the scope of one Azure file share at a time.

## Troubleshoot

The speed and success rate of a RoboCopy run depend on several factors:

* IOPS on the source and target storage
* the available network bandwidth between source and target
* the ability to quickly process files and folders in a namespace
* the number of changes between RoboCopy runs
* the size and number of files you need to copy

### IOPS and bandwidth considerations

In this category, you need to consider abilities of the **source storage**, the **target storage**, and the **network** connecting them. The maximum possible throughput is determined by the slowest of these three components. Make sure your network infrastructure is configured to support optimal transfer speeds to its best abilities.

> [!CAUTION]
> While copying as fast as possible is often most desirable, consider the utilization of your local network and NAS appliance for other, often business-critical tasks.

Copying as fast as possible might not be desirable when there's a risk that the migration could monopolize available resources.

* Consider when it's best in your environment to run migrations: during the day, off-hours, or during weekends.
* Also consider networking QoS on a Windows Server to throttle the RoboCopy speed.
* Avoid unnecessary work for the migration tools.

RoboCopy can insert inter-packet delays by specifying the `/IPG:n` switch where `n` is measured in milliseconds between RoboCopy packets. Using this switch can help avoid monopolization of resources on both I/O constrained devices and crowded network links.

`/IPG:n` can't be used for precise network throttling to a certain Mbps. Use Windows Server Network QoS instead. RoboCopy entirely relies on the SMB protocol for all networking needs. Using SMB is the reason why RoboCopy can't influence the network throughput itself, but it can slow down its use.

A similar line of thought applies to the IOPS observed on the NAS. The cluster size on the NAS volume, packet sizes, and an array of other factors influence the observed IOPS. Introducing inter-packet delay is often the easiest way to control the load on the NAS. Test multiple values, such as from about 20 milliseconds (n=20) to multiples of that number. After you introduce a delay, you can evaluate if your other apps can now work as expected. This optimization strategy helps you find the optimal RoboCopy speed in your environment.

### Processing speed

RoboCopy traverses the namespace you specify and evaluates each file and folder for copying. It evaluates every file during an initial copy and during catch-up copies. For example, repeated runs of `RoboCopy /MIR` against the same source and target storage locations. These repeated runs minimize downtime for users and apps, and improve the overall success rate of files migrated.

Bandwidth is often considered the most limiting factor in a migration, and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files takes considerably longer than copying 1 TiB of fewer but larger files, assuming that all other variables remain the same. Therefore, you might experience slow transfer if you're migrating a large number of small files. This difference is expected.

The cause for this difference is the processing power needed to walk through a namespace. RoboCopy supports multi-threaded copies through the `/MT:n` parameter where **n** stands for the number of threads to be used. So when provisioning a machine specifically for RoboCopy, consider the number of processor cores and their relationship to the thread count they provide. Most common are two threads per core. The core and thread count of a machine is an important data point to decide what multi-thread values `/MT:n` you should specify. Also consider how many RoboCopy jobs you plan to run in parallel on a given machine.

More threads copy the 1 TiB example of small files considerably faster than fewer threads. At the same time, the extra resource investment on the 1 TiB of larger files might not yield proportional benefits. A high thread count attempts to copy more of the large files over the network simultaneously. This extra network activity increases the probability of getting constrained by throughput or storage IOPS.

During a first RoboCopy into an empty target or a differential run with lots of changed files, you're likely constrained by your network throughput. Start with a high thread count for an initial run. A high thread count, even beyond your currently available threads on the machine, helps saturate the available network bandwidth. Subsequent /MIR runs are progressively impacted by processing items. Fewer changes in a differential run mean less transport of data over the network. Your speed is now more dependent on your ability to process namespace items than to move them over the network link. For subsequent runs, match your thread count value to your processor core count and thread count per core. Consider if cores need to be reserved for other tasks a production server may have.

> [!TIP]
> Rule of thumb: The first RoboCopy run, that will move a lot of data of a higher-latency network, benefits from over-provisioning the thread count (`/MT:n`). Subsequent runs will copy fewer differences and you are more likely to shift from network throughput constrained to compute constrained. Under these circumstances, it's often better to match the RoboCopy thread count to the actually available threads on the machine. Over-provisioning in that scenario can lead to more context shifts in the processor, possibly slowing down your copy.

### Avoid unnecessary work

Avoid large-scale changes in your namespace. For example, moving files between directories, changing properties at a large scale, or changing permissions (NTFS ACLs). Especially ACL changes can have a high impact because they often have a cascading change effect on files lower in the folder hierarchy. Consequences can be:

* extended RoboCopy job run time because each file and folder affected by an ACL change needing to be updated
* reusing data moved earlier might need to be recopied. For instance, more data needs to be copied when folder structures change after files are already copied. A RoboCopy job can't "play back" a namespace change. The next job must purge the files previously transported to the old folder structure and upload the files in the new folder structure again.

Another important aspect is to use the RoboCopy tool effectively. By using the recommended RoboCopy script, you create and save a log file for errors. Copy errors can occur, and that's normal. These errors often make it necessary to run multiple rounds of a copy tool like RoboCopy. For example, an initial run, say from a NAS to Data Box or a server to an Azure file share, and one or more extra runs with the `/MIR` switch to catch and retry files that didn't get copied.

Be prepared to run multiple rounds of RoboCopy against a given namespace scope. Successive runs finish faster as they have less to copy but are constrained increasingly by the speed of processing the namespace. When you run multiple rounds, you can speed up each round by not having RoboCopy try unreasonably hard to copy everything in a given run. These RoboCopy switches can make a significant difference:

* `/R:n` n = how often you retry to copy a failed file and 
* `/W:n` n = how many seconds to wait between retries

`/R:5 /W:5` is a reasonable setting that you can adjust to your liking. In this example, a failed file will be retried five times, with five-second wait time between retries. If the file still fails to copy, the next RoboCopy job will try again. Often, files that failed because they are in use or because of timeout issues can eventually be copied successfully this way.

## See also

* [Migration overview](storage-files-migration-overview.md)
* [Networking considerations for direct access](storage-files-networking-overview.md)
* [Azure file share snapshots](storage-snapshots-files.md)
