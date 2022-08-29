---
title: Introduction to Azure Storage Mover | Microsoft Docs
description: An overview of Azure Storage Mover, a fully-managed migration service for your files and folder migrations to Azure Storage.
author: stevenmatthew

ms.service: storage-mover
ms.topic: overview
ms.date: 08/29/2022
ms.author: shaas
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

<!-- 1. H1
##Docs Required##
 
Set expectations for what the content covers, so customers know the content meets their needs.-->
# What is Azure Storage Mover?

<!-- 2. Introductory paragraph 
##Docs Required##

A light intro that describes what the article covers. Answer the fundamental “why would I want to know this?” question. Keep it as short as possible.-->

Azure Storage Mover enables you to migrate your files and folders to Azure Storage. It's a fully-managed migration service that allows you to minimize downtime for your workload.

- You can use it for different migration scenarios, such as lift-and-shift as well as cloud migrations you'll have to repeat occasionally.
- Maintain oversight and manage the migration of all your globally distributed file shares from a single storage mover resource.

Azure Storage Mover is a new service, currently in public preview.

<!-- 3. H2s
##Docs Required##

Each H2 is used to set expectations for the content that follows. The last sentence of the paragraph should summarize how the individual section contributes to the whole.-->

## Supported sources and targets

:::row:::
  :::column:::
    :::image type="content" source="media/overview/nfs-to-flat-blob.png" alt-text="An image illustrating a source NFS share migrated through an Azure Storage Mover agent VM to an Azure Storage blob container." lightbox="media/overview/nfs-to-flat-blob-large.png":::
  :::column-end:::
  :::column:::
    At this time in the Azure Storage Mover release, the service supports migrations from NFS shares on a NAS or server device in your network to an Azure blob container. 

    > [!IMPORTANT]
    > Storage accounts with the [hierarchical namespace service (HNS)](../storage/blobs/data-lake-storage-namespace.md) feature enabled are not supported at this time.
    
    An Azure blob container without the hierarchical namespace service feature doesn’t have a traditional file system. A standard blob container supports “virtual” folders. Files in folders on the source will get their path prepended to their name and placed in a flat list in the target blob container.
    
    Empty folders will be represented by the Storage Mover service as an empty blob in the target. The metadata of the source folder will be persisted in the custom metadata field of this blob, just like files.        
  :::column-end:::
:::row-end:::

## Fully-managed migrations

Azure Storage Mover provides a set of management resources that allow you to express your migration plan and retain oversight about migration progress and results for every share you like to migrate. 

The [resource hierarchy article](resource-hierarchy.md) has more information about individual Storage Mover resources and how to best use them for your migration.

Create a migration project for every workload you like to migrate. Within a project, define the source, target, and migration settings for each source share your workload depends on. You can remain in full control about when to start the migration of a share, track it's progress, and see its results. 

A single storage mover resource, deployed to your subscription, can be used to manage migrations for source shares located in different parts of the world. The storage mover resource does not process your files and folders. Your data is sent directly from the migration agent to your selected targets in Azure. The [planning for an Azure Storage Mover deployment](deployment-planning.md) article has more details.

## A hybrid cloud service

[!INCLUDE [hybrid-service-explanation](includes/hybrid-service-explanation.md)]

<!-- 4. Next steps
##Docs Required##

We must provide at least one next step, but should provide no more than three. This should be relevant to the learning path and provide context so the customer can determine why they would click the link.-->

## Next steps
<!-- Add a context sentence for the following links -->
These articles can help you become more familiar with the Storage Mover service.
- [Planning for an Azure Storage Mover deployment](deployment-planning.md)
- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover agent](agent-deploy.md)
