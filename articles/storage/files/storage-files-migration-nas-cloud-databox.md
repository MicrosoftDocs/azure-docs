---
title: On-premises NAS migration to Azure file shares
description: Learn how to migrate files from an on-premises Network Attached Storage (NAS) location to Azure file shares with Azure DataBox.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/21/2023
ms.author: kendownie
recommendations: false
---

# Use DataBox to migrate from Network Attached Storage (NAS) to Azure file shares

This migration article is one of several involving the keywords NAS and Azure DataBox. Check if this article applies to your scenario:

> [!div class="checklist"]
> * Data source: Network Attached Storage (NAS)
> * Migration route: NAS &rArr; DataBox &rArr; Azure file share
> * No caching files on-premises: Because the final goal is to use the Azure file shares directly in the cloud, there's no plan to use Azure File Sync.

If your scenario is different, look through the [table of migration guides](storage-files-migration-overview.md#migration-guides).

This article guides you end-to-end through the planning, deployment, and networking configurations needed to migrate from your NAS appliance to functional Azure file shares. This guide uses Azure DataBox for bulk data transport (offline data transport).

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Migration goals

The goal is to move the shares on your NAS appliance to Azure and have them become native Azure file shares. You can use native Azure file shares without a need for a Windows Server. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

## Migration overview

The migration process consists of several phases. You'll need to deploy Azure storage accounts and file shares and configure networking. Then you'll migrate your files using Azure DataBox, and RoboCopy to catch-up with changes. Finally, you'll cut-over your users and apps to the newly created Azure file shares. The following sections describe the phases of the migration process in detail.

> [!TIP]
> If you are returning to this article, use the navigation on the right side to jump to the migration phase where you left off.

## Phase 1: Identify how many Azure file shares you need

In this step, you'll determine how many Azure file shares you need. You might have more folders on your volumes that you currently share out locally as SMB shares to your users and apps. Depending on the number of file shares you want to migrate to the cloud, you can choose to either use a 1:1 mapping or share grouping.

### Use a 1:1 mapping

If you have a small enough number of shares, we recommend a 1:1 mapping. The easiest way to picture this scenario is to envision an on-premises share that maps 1:1 to an Azure file share.

### Use share grouping

If you have a large number of file shares, consider share grouping. For example, if your human resources (HR) department has 15 shares, you might consider storing all the HR data in a single Azure file share. That way, only a single Azure file share in the cloud is needed for this group of on-premises shares.

## Phase 2: Deploy Azure storage resources

In this phase, you'll provision the Azure storage accounts and the file shares within them.

Remember that an Azure file share is deployed in the cloud in an Azure storage account. For standard file shares, that arrangement makes the storage account a scale target for performance numbers like IOPS and throughput. If you place multiple file shares in a single storage account, you're creating a shared pool of IOPS and throughput for these shares. 

As a general rule, you can pool multiple Azure file shares into the same storage account if you have archival shares or you expect low day-to-day activity in them. However, if you have highly active shares (shares used by many users and/or applications), you'll want to deploy storage accounts with one file share each. These limitations don't apply to FileStorage (premium) storage accounts, where performance is explicitly provisioned and guaranteed for each share.

> [!NOTE]
> There's a limit of 250 storage accounts per subscription per Azure region. With a quota increase, you can create up to 500 storage accounts per region. For more information, see [Increase Azure Storage account quotas](../../quotas/storage-account-quota-requests.md).

Another consideration when you're deploying a storage account is redundancy. See [Azure Files redundancy](files-redundancy.md).

Azure file shares are created with a 5 TiB limit by default. If you need more capacity, you can create a large file share (up to 100 TiB). However, that share can use only locally redundant storage or zone-redundant storage redundancy options. Consider your storage redundancy needs before using 100 TiB file shares.

If you've made a list of your shares, you should map each share to the storage account it will be created in.

The names of your resources are also important. For example, if you group multiple shares for the HR department into an Azure storage account, you should name the storage account appropriately. Similarly, when you name your Azure file shares, you should use names similar to the ones used for their on-premises counterparts.

Now deploy the appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them, following the instructions in [Create an SMB file share](storage-how-to-create-file-share.md). In most cases, you'll want to make sure the region of each of your storage accounts is the same.

## Phase 3: Determine how many Azure DataBox appliances you need

Start this step only, when you have completed the previous phase. Your Azure storage resources (storage accounts and file shares) should be created at this time. During your DataBox order, you need to specify into which storage accounts the DataBox is moving data.

In this phase, you need to map the results of the migration plan from the previous phase to the limits of the available DataBox options. These considerations will help you make a plan for which DataBox options you should choose and how many of them you will need to move your NAS shares to Azure file shares.

To determine how many devices of which type you need, consider these important limits:

* Any Azure DataBox can move data into up to 10 storage accounts. 
* Each DataBox option comes at their own usable capacity. See [DataBox options](#databox-options).

Consult your migration plan for the number of storage accounts you have decided to create and the shares in each one. Then look at the size of each of the shares on your NAS. Combining this information will allow you to optimize and decide which appliance should be sending data to which storage accounts. You can have two DataBox devices move files into the same storage account, but don't split content of a single file share across 2 DataBoxes.

### DataBox options

For a standard migration, one or a combination of these two DataBox options should be chosen: 

* DataBox
  This is the most common option. A ruggedized DataBox appliance, that works similar to a NAS, will be shipped to you. It has a usable capacity of 80 TiB. For more information, see [DataBox documentation](../../databox/data-box-overview.md).
* DataBox Heavy
  This option features a ruggedized DataBox appliance on wheels, that works similar to a NAS, with a capacity of 1 PiB. The usable capacity is about 20% less, due to encryption and file system overhead. For more information, see [DataBox Heavy documentation](../../databox/data-box-heavy-overview.md).

> [!WARNING]
> Data Box Disks is not recommended for migrations into Azure file shares. Data Box Disks does not preserve file metadata, such as access permissions (ACLs) and other attributes.

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
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
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
* [Configure DFS-N](files-manage-namespaces.md)
   :::column-end:::
:::row-end:::

## Phase 6: Copy files onto your DataBox

When your DataBox arrives, you need to set up your DataBox with unimpeded network connectivity to your NAS appliance. Follow the setup documentation for the DataBox type you ordered.

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

```console
Robocopy /MT:32 /NP /NFL /NDL /B /MIR /IT /COPY:DATSO /DCOPY:DAT /UNILOG:<FilePathAndName> <SourcePath> <Dest.Path> 
```
* To learn more about the details of the individual RoboCopy flags, check out the table in the upcoming [RoboCopy section](#robocopy).
* To learn more about how to appropriately size the thread count `/MT:n`, optimize RoboCopy speed, and make RoboCopy a good neighbor in your data center, take a look at the [RoboCopy troubleshooting section](#troubleshoot).

> [!TIP]
> As an alternative to Robocopy, Data Box has created a data copy service. You can use this service to load files onto your Data Box with full fidelity. [Follow this data copy service tutorial](../../databox/data-box-deploy-copy-data-via-copy-service.md) and make sure to set the correct Azure file share target.

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

```console
robocopy <SourcePath> <Dest.Path> /MT:20 /R:2 /W:1 /B /MIR /IT /COPY:DATSO /DCOPY:DAT /NP /NFL /NDL /XD "System Volume Information" /UNILOG:<FilePathAndName> 
```

| Switch                | Meaning |
|-----------------------|---------|
| `/MT:n`               | Allows Robocopy to run multithreaded. Default for `n` is 8. The maximum is 128 threads. While a high thread count helps saturate the available bandwidth, it doesn't mean your migration will always be faster with more threads. Tests with Azure Files indicate between 8 and 20 shows balanced performance for an initial copy run. Subsequent `/MIR` runs are progressively affected by available compute vs available network bandwidth. For subsequent runs, match your thread count value more closely to your processor core count and thread count per core. Consider whether cores need to be reserved for other tasks that a production server might have. Tests with Azure Files have shown that up to 64 threads produce a good performance, but only if your processors can keep them alive at the same time. |
| `/R:n`                | Maximum retry count for a file that fails to copy on first attempt. Robocopy will try `n` times before the file permanently fails to copy in the run. You can optimize the performance of your run: Choose a value of two or three if you believe timeout issues caused failures in the past. This may be more common over WAN links. Choose no retry or a value of one if you believe the file failed to copy because it was actively in use. Trying again a few seconds later may not be enough time for the in-use state of the file to change. Users or apps holding the file open may need hours more time. In this case, accepting the file wasn't copied and catching it in one of your planned, subsequent Robocopy runs, may succeed in eventually copying the file successfully. That helps the current run to finish faster without being prolonged by many retries that ultimately end up in a majority of copy failures due to files still open past the retry timeout. |
| `/W:n`                | Specifies the time Robocopy waits before attempting to copy a file that didn't successfully copy during a previous attempt. `n` is the number of seconds to wait between retries. `/W:n` is often used together with `/R:n`. |
| `/B`                  | Runs Robocopy in the same mode that a backup application would use. This switch allows Robocopy to move files that the current user doesn't have permissions for. The backup switch depends on running the Robocopy command in an administrator elevated console or PowerShell window. If you use Robocopy for Azure Files, make sure you mount the Azure file share using the storage account access key vs. a domain identity. If you don't, the error messages might not intuitively lead you to a resolution of the problem. |
| `/MIR`                | (Mirror source to target.) Allows Robocopy to copy only deltas between source and target. Empty subdirectories will be copied. Items (files or folders) that have changed or don't exist on the target will be copied. Items that exist on the target but not on the source will be purged (deleted) from the target. When you use this switch, match the source and target folder structures exactly. *Matching* means copying from the correct source and folder level to the matching folder level on the target. Only then can a "catch up" copy be successful. When source and target are mismatched, using `/MIR` will lead to large-scale deletions and recopies. |
| `/IT`                 | Ensures fidelity is preserved in certain mirror scenarios. </br>For example, if a file experiences an ACL change and an attribute update between two Robocopy runs, it's marked hidden. Without `/IT`, the ACL change might be missed by Robocopy and not transferred to the target location. |
|`/COPY:[copyflags]`    | The fidelity of the file copy. Default: `/COPY:DAT`. Copy flags: `D`= Data, `A`= Attributes, `T`= Timestamps, `S`= Security = NTFS ACLs, `O`= Owner information, `U`= A<u>u</u>diting information. Auditing information can't be stored in an Azure file share. |
| `/DCOPY:[copyflags]`  | Fidelity for the copy of directories. Default: `/DCOPY:DA`. Copy flags: `D`= Data, `A`= Attributes, `T`= Timestamps. |
| `/NP`                 | Specifies that the progress of the copy for each file and folder won't be displayed. Displaying the progress significantly lowers copy performance. |
| `/NFL`                | Specifies that file names aren't logged. Improves copy performance. |
| `/NDL`                | Specifies that directory names aren't logged. Improves copy performance. |
| `/XD`                 | Specifies directories to be excluded. When running Robocopy on the root of a volume, consider excluding the hidden `System Volume Information` folder. If used as designed, all information in there is specific to the exact volume on this exact system and can be rebuilt on-demand. Copying this information won't be helpful in the cloud or when the data is ever copied back to another Windows volume. Leaving this content behind should not be considered data loss. |
| `/UNILOG:<file name>` | Writes status to the log file as Unicode. (Overwrites the existing log.) |
| `/L`                  | **Only for a test run** </br> Files are to be listed only. They won't be copied, not deleted, and not time stamped. Often used with `/TEE` for console output. Flags from the sample script, like `/NP`, `/NFL`, and `/NDL`, might need to be removed to achieve you properly documented test results. |
| `/Z`                  | **Use cautiously** </br>Copies files in restart mode. This switch is recommended only in an unstable network environment. It significantly reduces copy performance because of extra logging. |
| `/ZB`                 | **Use cautiously** </br>Uses restart mode. If access is denied, this option uses backup mode. This option significantly reduces copy performance because of checkpointing. |

> [!IMPORTANT]
> We recommend using a Windows Server 2022. When using a Windows Server 2019, ensure at the latest patch level or at least [OS update KB5005103](https://support.microsoft.com/topic/august-26-2021-kb5005103-os-build-18363-1766-preview-4e23362c-5e43-4d8f-95e5-9fdade60605f) is installed. It contains important fixes for certain Robocopy scenarios.

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

You have finished migrating a share / group of shares into a common root or volume.

You can try to run a few of these copies in parallel. We recommend processing the scope of one Azure file share at a time.

## Troubleshoot

Speed and success rate of a given RoboCopy run will depend on several factors:

* IOPS on the source and target storage
* the available network bandwidth between source and target
* the ability to quickly process files and folders in a namespace
* the number of changes between RoboCopy runs
* the size and number of files you need to copy

### IOPS and bandwidth considerations

In this category, you need to consider abilities of the **source storage**, the **target storage**, and the **network** connecting them. The maximum possible throughput is determined by the slowest of these three components. Make sure your network infrastructure is configured to support optimal transfer speeds to its best abilities.

> [!CAUTION]
> While copying as fast as possible is often most desireable, consider the utilization of your local network and NAS appliance for other, often business-critical tasks.

Copying as fast as possible might not be desirable when there's a risk that the migration could monopolize available resources.

* Consider when it's best in your environment to run migrations: during the day, off-hours, or during weekends.
* Also consider networking QoS on a Windows Server to throttle the RoboCopy speed.
* Avoid unnecessary work for the migration tools.

RoboCopy can insert inter-packet delays by specifying the `/IPG:n` switch where `n` is measured in milliseconds between RoboCopy packets. Using this switch can help avoid monopolization of resources on both IO constrained devices, and crowded network links.

`/IPG:n` can't be used for precise network throttling to a certain Mbps. Use Windows Server Network QoS instead. RoboCopy entirely relies on the SMB protocol for all networking needs. Using SMB is the reason why RoboCopy can't influence the network throughput itself, but it can slow down its use.

A similar line of thought applies to the IOPS observed on the NAS. The cluster size on the NAS volume, packet sizes, and an array of other factors influence the observed IOPS. Introducing inter-packet delay is often the easiest way to control the load on the NAS. Test multiple values, for instance from about 20 milliseconds (n=20) to multiples of that number. Once you introduce a delay, you can evaluate if your other apps can now work as expected. This optimization strategy will allow you to find the optimal RoboCopy speed in your environment.

### Processing speed

RoboCopy will traverse the namespace it's pointed to and evaluate each file and folder for copy. Every file will be evaluated during an initial copy and during catch-up copies. For example, repeated runs of RoboCopy /MIR against the same source and target storage locations. These repeated runs are useful to minimize downtime for users and apps, and to improve the overall success rate of files migrated.

We often default to considering bandwidth as the most limiting factor in a migration - and that can be true. But the ability to enumerate a namespace can influence the total time to copy even more for larger namespaces with smaller files. Consider that copying 1 TiB of small files will take considerably longer than copying 1 TiB of fewer but larger files, assuming that all other variables remain the same. Therefore, you may experience slow transfer if you're migrating a large number of small files. This is an expected behavior.

The cause for this difference is the processing power needed to walk through a namespace. RoboCopy supports multi-threaded copies through the `/MT:n` parameter where **n** stands for the number of threads to be used. So when provisioning a machine specifically for RoboCopy, consider the number of processor cores and their relationship to the thread count they provide. Most common are two threads per core. The core and thread count of a machine is an important data point to decide what multi-thread values `/MT:n` you should specify. Also consider how many RoboCopy jobs you plan to run in parallel on a given machine.

More threads will copy our 1-TiB example of small files considerably faster than fewer threads. At the same time, the extra resource investment on our 1 TiB of larger files may not yield proportional benefits. A high thread count will attempt to copy more of the large files over the network simultaneously. This extra network activity increases the probability of getting constrained by throughput or storage IOPS.

During a first RoboCopy into an empty target or a differential run with lots of changed files, you are likely constrained by your network throughput. Start with a high thread count for an initial run. A high thread count, even beyond your currently available threads on the machine, helps saturate the available network bandwidth. Subsequent /MIR runs are progressively impacted by processing items. Fewer changes in a differential run mean less transport of data over the network. Your speed is now more dependent on your ability to process namespace items than to move them over the network link. For subsequent runs, match your thread count value to your processor core count and thread count per core. Consider if cores need to be reserved for other tasks a production server may have.

> [!TIP]
> Rule of thumb: The first RoboCopy run, that will move a lot of data of a higher-latency network, benefits from over-provisioning the thread count (`/MT:n`). Subsequent runs will copy fewer differences and you are more likely to shift from network throughput constrained to compute constrained. Under these circumstances, it is often better to match the RoboCopy thread count to the actually available threads on the machine. Over-provisioning in that scenario can lead to more context shifts in the processor, possibly slowing down your copy.

### Avoid unnecessary work

Avoid large-scale changes in your namespace. For example, moving files between directories, changing properties at a large scale, or changing permissions (NTFS ACLs). Especially ACL changes can have a high impact because they often have a cascading change effect on files lower in the folder hierarchy. Consequences can be:

* extended RoboCopy job run time because each file and folder affected by an ACL change needing to be updated
* reusing data moved earlier may need to be recopied. For instance, more data will need to be copied when folder structures change after files had already been copied earlier. A RoboCopy job can't "play back" a namespace change. The next job must purge the files previously transported to the old folder structure and upload the files in the new folder structure again.

Another important aspect is to use the RoboCopy tool effectively. With the recommended RoboCopy script, you'll create and save a log file for errors. Copy errors can occur - that is normal. These errors often make it necessary to run multiple rounds of a copy tool like RoboCopy. An initial run, say from a NAS to DataBox or a server to an Azure file share. And one or more extra runs with the /MIR switch to catch and retry files that didn't get copied.

You should be prepared to run multiple rounds of RoboCopy against a given namespace scope. Successive runs will finish faster as they have less to copy but are constrained increasingly by the speed of processing the namespace. When you run multiple rounds, you can speed up each round by not having RoboCopy try unreasonably hard to copy everything in a given run. These RoboCopy switches can make a significant difference:

* `/R:n` n = how often you retry to copy a failed file and 
* `/W:n` n = how many seconds to wait between retries

`/R:5 /W:5` is a reasonable setting that you can adjust to your liking. In this example, a failed file will be retried five times, with five-second wait time between retries. If the file still fails to copy, the next RoboCopy job will try again. Often files that failed because they are in use or because of timeout issues might eventually be copied successfully this way.

## Next steps

There is more to discover about Azure file shares. The following articles help understand advanced options, best practices, and also contain troubleshooting help. These articles link to [Azure file share documentation](storage-files-introduction.md) as appropriate.

* [Migration overview](storage-files-migration-overview.md)
* [Monitor, diagnose, and troubleshoot Microsoft Azure Storage](../common/storage-monitoring-diagnosing-troubleshooting.md)
* [Networking considerations for direct access](storage-files-networking-overview.md)
* [Backup: Azure file share snapshots](storage-snapshots-files.md)
