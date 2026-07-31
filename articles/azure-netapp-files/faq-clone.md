---
title: Cloning FAQs for Azure NetApp Files
description: Answers frequently asked questions (FAQs) about Azure NetApp Files cloning.
ms.service: azure-netapp-files
ms.topic: concept-article
author: netapp-manishc
ms.author: anfdocs
ms.date: 05/13/2026
# Customer intent: As a network administrator, I want to understand the cloning requirements and limitations of Azure NetApp Files.
---
# Cloning FAQs for Azure NetApp Files

Cloning is based on snapshot technology: volume snapshots can be cloned to new volumes. Volume clones are writable copies of a source volume.   

This article answers frequently asked questions (FAQs) about Azure NetApp Files cloning. 

>[!NOTE]
>If you're creating a clone of a volume with application data in it, such as a database, ensure that the snapshot was taken with the application in a consistent state. You can achieve this by using [AzAcSnap](azacsnap-introduction.md), [SnapCenter](https://docs.netapp.com/us-en/snapcenter/get-started/concept_snapcenter_overview.html), [Commvault](https://documentation.commvault.com/11.42/software/getting_started_with_azure_netapp_files.html?view=saas), or other application aware snapshot management software. 


## Can the service level of a volume clone differ from the source volume? 

A volume clone can exist in a different [service level](azure-netapp-files-service-levels.md#supported-service-levels) from that of the source volume. When creating the volume clone, you decide what service level the clone should have by selecting the desired capacity pool. You can change the capacity of a clone volume after creation if desired. 

**Auto QoS** 

For Auto QoS capacity pools the clone volume throughput limit is defined by the size of the clone volume.  

**Manual QoS**

For Manual QoS capacity pools you can manually assign a throughput limit to the clone volume independent of the capacity but within the capacity pool allocated limits. You can change the volume throughput limit after short-term volume clone creation if needed. 

## What are the options available for for volume cloning?

Two cloning options are provided: 

* [Regular volume clones](snapshots-restore-new-volume.md) are independent writable full volume copies 
* [Short-term clones](create-short-term-clone.md) are writable thin copies designed for short-term existence (up to 32 days)  

## What are regular volume clones?

Regular clones occupy the same capacity pool space as the source volume. They can exist for as long as they're needed. To create a volume clone, select the volume and open the snapshots view under **Storage** Service. Using the Actions (three dots) click **Restore to new volume**. 

:::image type="content" source="media/faq-clone/restore-volume-clone.png" alt-text="Diagram of restoring to a new volume." lightbox="media/faq-clone/restore-volume-clone.png":::

## What are short-term clones?

Short-term clones are designed to quickly create volume copies for test, development, and consistency checking and other temporary copy requirements of live volume data without fully supplicating the volume. Short-term clones occupy a smaller capacity pool space, depending on the changes (at the block level) you intend to write to the short-term clones. Short-term clones are therefore more cost-effective, but their lifespan is limited to 32 days. After 32 days, you either delete the short-term clone, or it will be converted to a full volume clone automatically, and the capacity pool space may be grown automatically to accommodate this growth. You need to approve this autogrowth upon short-term clone volume creation. 

To create a short-term clone volume, browse to the volume and select the snapshots view under **Storage** service. Select a snapshot and under Actions select **Create a short-term clone from snapshot**. 

:::image type="content" source="media/faq-clone/create-short-term-clone.png" alt-text="Diagram of creating a short term clone." lightbox="media/faq-clone/create-short-term-clone.png":::


## Next steps  

- [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
- [Performance FAQs](faq-performance.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)