---
title: Disaster recovery guidance for Avere vFXT for Azure
description: How to protect data in Avere vFXT for Azure from accidental deletion or outages
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: rohogue
---

# Disaster recovery guidance for Avere vFXT for Azure

This article outlines strategies to protect your Avere vFXT for Azure workflow and gives guidance for backing up data so that you can recover from accidents or outages.

Avere vFXT for Azure temporarily stores data in its cache. Data is stored long-term in back-end storage systems - on-premises hardware systems, Azure Blob storage containers, or both.

To guard against outages and possible data loss, consider these four areas:

* Protection against downtime if an Avere vFXT for Azure system becomes unavailable
* Protecting data in the cluster cache
* Protecting data in back-end NAS hardware storage
* Protecting data in back-end Azure Blob cloud storage

Every Avere vFXT for Azure customer must create their own comprehensive disaster recovery plan that includes plans for these items. You can also build resiliency into applications you use with the vFXT cluster. Read the links in [Next steps](#next-steps) for help.

## Protect against downtime

Redundancy is built in to the Avere vFXT for Azure product:

* The cluster is highly available, and individual cluster nodes can fail over with minimal interruption.
* Data changed in the cache is written regularly to back-end core filers (hardware NAS or Azure Blob) for long-term storage.

Each Avere vFXT for Azure cluster must be located in a single availability zone, but you can use redundant clusters located in different zones or different regions to provide access quickly in the event of a regional outage.

You also can position storage containers in multiple regions if you are concerned about losing access to data. However, keep in mind that transactions between regions have higher latency and higher cost than transactions that stay within a region.

## Protect data in the cluster cache

Cached data is always written to the core filers before a regular shutdown, but in an uncontrolled shutdown, changed data in the cache can be lost.

If you use the cluster to optimize file reads only, there are no changes to lose. If you also use the cluster to cache file changes (writes), consider whether or not to adjust the core filers' [cache policies](https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_manage_cache_policies.html)<!-- link to legacy doc --> to customize how frequently data is written to long-term storage.

In general, your recovery plan should focus on backing up the back-end storage systems, which hold more data and typically are more important for re-establishing your workflow after a failure.

## Protect data in NAS core filers

Use accepted methods to protect data stored in an on-premises NAS hardware core filer, including snapshots and full backups as recommended by the NAS provider. Disaster recovery for these core filers is beyond the scope of this article.

## Protect data in Azure Blob storage

Avere vFXT for Azure uses locally-redundant storage (LRS) for Azure Blob core filers. This means that the data in your Blob containers is automatically copied for protection against transient hardware failures within a data center.

This section gives tips on how to further protect your data in Blob storage from rare region-wide outages or accidental deletions.

Best practices for protecting data in Azure Blob storage include:

* Copy your critical data to another storage account in another region frequently (as often as determined by your disaster recovery plan).
* Control access to data on all target systems to prevent accidental deletion or corruption. Consider using [resource locks](../azure-resource-manager/management/lock-resources.md) on data storage.
* Enable the Avere vFXT for Azure [cloud snapshot](<https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_cloud_snapshot_policies.html>) feature for your Blob core filers.

### Copy Avere vFXT core filer data to a backup account

Follow these steps to establish a data backup in another account.

1. If needed, generate a new encryption key and store it safely outside the affected systems.

   If your data is encrypted by the Avere vFXT for Azure cluster, you should generate a new encryption key before copying the data to another storage account. Store that key and password securely in a facility that is safe and that will not be impacted by a regional failure.

   You must supply this key when adding the container to a cluster - even if you are re-adding it to its original cluster.

   Read [Cloud encryption settings](<https://azure.github.io/Avere/legacy/ops_guide/4_7/html/gui_cloud_encryption_settings.html>)<!-- link to legacy doc site --> for detailed information.

   If your container uses Azure's built-in encryption only, you can skip this step.

1. Remove the core filer from the system. This forces the cluster to write all changed data to the back-end storage.

   Although you will have to re-add the core filer after the backup, removing it is the best way to guarantee that all data is completely written to the back end. (The "suspend" option can sometimes leave changed data in the cache.) <!-- xxx true? or just metadata? -->

   Make a note of the core filer's name and junction information (listed on the **Namespace** page in the control panel) so that you can replicate it when you re-add the container after the backup.

   Use the cluster control panel to remove the core filer. [Open the cluster control panel](avere-vfxt-cluster-gui.md) and choose **Core filer** > **Manage core filers**. Find the storage system that you want to back up and use the **Remove** button to delete it from the cluster.

1. Create a new, empty Blob storage container in another storage account in another region.

1. Use any convenient copy tool to copy the data on the core filer to the new container. The copy must replicate the data without changes, and without disrupting the proprietary cloud filesystem format used by Avere vFXT for Azure. Azure-based tools include [AzCopy](../storage/common/storage-use-azcopy-v10.md), [Azure PowerShell](../data-lake-store/data-lake-store-get-started-powershell.md), and [Azure Data Factory](../data-factory/connector-azure-data-lake-store.md).

1. After copying the data to the backup container, add the original container back to the cluster as described in [Configure storage](avere-vfxt-add-storage.md).

   * Use the same core filer name and junction information so that client workflows do not need to change.
   * Set the **Bucket contents** value to the existing data option.
   * If the container was encrypted by the cluster, you must enter the current encryption key for its contents. (This is the key you updated in step one.)

For backups after the first one, you don't need to create a new storage container. However, consider generating a new encryption key every time you do a backup to make sure that you have the current key stored in a place you remember.

### Access a backup data source during an outage

To access the backup container from an Avere vFXT for Azure cluster, follow this process:

1. If needed, create a new Avere vFXT for Azure cluster in an unaffected region.

   > [!TIP]
   > When you create an Avere vFXT for Azure cluster, you can save a copy of its creation template and parameters. If you save this information when creating your primary cluster, you can use it to create a replacement cluster with the same properties. On the [summary](avere-vfxt-deploy.md#validation-and-purchase) page, click the **Download template and parameters** link. Save the information to a file before you create the cluster.

1. Add a new cloud core filer that points to the duplicate Blob container.

   Make sure to specify that the target container already contains data in the **Bucket contents** setting of the core filer creation wizard. (The system should alert you if you accidentally leave this set to **Empty**.)  <!-- you can't add a populated volume at cluster creation time via template, only create a fresh one -->

1. If necessary, update clients so that they mount the new cluster or new core filer instead of the original. (If you add the replacement core filer with the same name and junction path as the original container, you will not need to update client processes unless you need to mount the new cluster at a new IP address.)

## Next steps

* For more information about customizing settings for Avere vFXT for Azure, read [Cluster tuning](avere-vfxt-tuning.md).
* Learn more about disaster recovery and building resilient applications in Azure:

  * [Azure resiliency technical guidance](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview)
  * [Recover from a region-wide service disruption](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region)
  * [Disaster recovery and high availability for Azure applications](<https://docs.microsoft.com/azure/resiliency/resiliency-disaster-recovery-high-availability-azure-applications>)
  <!-- can't find these in the source tree to use relative links -->
