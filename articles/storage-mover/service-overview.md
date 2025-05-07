---
title: Introduction to Azure Storage Mover | Microsoft Docs
description: An overview of Azure Storage Mover, a fully managed migration service for your files and folder migrations to Azure Storage.
author: stevenmatthew

ms.service: azure-storage-mover
ms.topic: overview
ms.date: 10/30/2023
ms.author: shaas
---

<!-- 
!########################################################
STATUS: EDIT PASS

CONTENT: final

REVIEW Stephen/Fabian: COMPLETE
EDIT PASS: not started

Document score: 100 (520 words and 0 issues)

!########################################################
-->

# What is Azure Storage Mover?

:::row:::
    :::column:::
        [![2-Minute demonstration video introducing Azure Storage Mover - click to play!](./media/overview/storage-mover-overview-demo-video-still.png)](https://youtu.be/hFjo-tuJWL0)
    :::column-end:::
    :::column:::
        Azure Storage Mover is a relatively new, fully managed migration service that enables you to migrate your files and folders to Azure Storage while minimizing downtime for your workload.         
    :::column-end:::
:::row-end:::

You can use Storage Mover for different migration scenarios such as *lift-and-shift*, and for migrations that you have to repeat regularly. Azure Storage Mover also helps maintain oversight and manage the migration of all your globally distributed file shares from a single storage mover resource.

## Supported sources and targets

[!INCLUDE [protocol-endpoint-agent](includes/protocol-endpoint-agent.md)]

An Azure blob container without the hierarchical namespace service feature doesn’t have a traditional file system. A standard blob container uses “virtual” folders to mimic this functionality. When this approach is used, files in folders on the source get their path prepended to their name and placed in a flat list in the target blob container.

When migrating data from a source endpoint using the SMB protocol, Storage Mover supports the same level of file fidelity as the underlying Azure file share. Folder structure and metadata values such as file and folder timestamps, ACLs, and file attributes are maintained. When migrating data from an NFS source, the Storage Mover service represents empty folders as an empty blob in the target. The metadata of the source folder is persisted in the custom metadata field of this blob, just as they are with files.

However, migrating data from a source endpoint using the NFS protocol might require “virtual” folders during the migration. Because Azure blob containers without HNS support don’t have a traditional file system, Storage Mover uses these folders to mimic a local file system. When files are found within folders on a source endpoint, Storage Mover prepends their paths to their names and places the file in a flat list within in the target blob container.

:::image type="content" source="media/overview/source-to-target.png" alt-text="A screenshot illustrating a source NFS share migrated through an Azure Storage Mover agent VM to an Azure Storage blob container." lightbox="media/overview/source-to-target-lrg.png" :::

## Fully managed migrations

A single storage mover resource deployed to your subscription can be used to manage migrations for your source shares located in different parts of the world. The storage mover resource itself doesn't process your files and folders. Rather, you deploy a migration agent near your source share to send your data directly to the selected targets in Azure.

Azure Storage Mover provides a set of management resources that can be used across every share you intend to migrate. For example, you can express your migration plan and retain oversight about migration progress and results on a per-share basis. To take advantage of this capability, create a migration project for every workload you migrate. Within the project, define the source, target, and migration settings for each source share on which your workload depends. You can remain in full control about when to start the migration of a share, track it's progress, and see its results.

The [resource hierarchy article](resource-hierarchy.md) has more information about individual Storage Mover resources and how best to use them for your migration. You can also get more deployment planning details in the [planning for an Azure Storage Mover deployment](deployment-planning.md) article.

## A hybrid cloud service

[!INCLUDE [hybrid-service-explanation](includes/hybrid-service-explanation.md)]

## Using Azure Storage Mover and Azure Data Box

When transitioning on-premises workloads to Azure Storage, reducing downtime and ensuring predictable periods of unavailability is crucial for users and business operations. For the initial bulk migration, you can use [Azure Data Box](/azure/databox/) and combine it with Azure Storage Mover for online catch-up.

Using Azure Data Box conserves significant network bandwidth. However, active workloads on your source storage might undergo changes while the Data Box is in transit to an Azure Data Center. The "online catch-up" phase involves updating your cloud storage with these changes before fully cutting over the workload to use the cloud data. This typically requires minimal bandwidth since most data already resides in Azure, and only the delta needs to be transferred. Azure Storage Mover excels in this task.

Azure Storage Mover detects differences between your on-premises storage and cloud storage, transferring updates and new files not captured by the Data Box transfer. Additionally, if only a file's metadata (such as permissions) has changed, Azure Storage Mover uploads just the new metadata instead of the entire file content.

Read more details on how to use Azure Storage Mover with Azure Data Box [here](https://techcommunity.microsoft.com/t5/azure-storage-blog/storage-migration-combine-azure-storage-mover-and-azure-data-box/ba-p/4143354).

## Next steps

The following articles can help you become more familiar with the Storage Mover service.

- [Planning for an Azure Storage Mover deployment](deployment-planning.md)
- [Understanding the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Deploying a Storage Mover agent](agent-deploy.md)
