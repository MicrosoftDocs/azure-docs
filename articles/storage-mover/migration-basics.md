---
title: Cloud migration basics for file and folder storage
description: Understand the basic decisions and strategies for the cloud migration of files and folders.
author: stevenmatthew
ms.author: shaas
ms.service: storage-mover
ms.topic: conceptual
ms.date: 06/21/2022
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: incomplete
            - link missing for supported source/targets
            - consider adding a short video

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# Cloud migration basics for file and folder storage

Every migration starts with a business need. A certain workload will be transformed by a cloud migration of the files and folders it depends on. A workload can be either an application or direct user access. In either case, the workload has a dependency on storage that you'll move to the cloud. The workload might also move to the cloud, or remain where it is and will need to be instructed to point to the new cloud storage location. These details are recorded in your *cloud solution design* that has a storage section.

The purpose of this article is not a discussion about how to achieve the optimal cloud solution design for your workload. It'll rather provide insight into how you can achieve a storage migration to Azure, such that you can realize your cloud solution design for storage.

:::image type="content" source="media/migration-basics/migration-phases.png" alt-text="Summary illustration showing migration phases: Discover, Assess, Plan, Deploy, Migrate, Post-Migrate to illustrate the sections to come in this article." lightbox="media/migration-basics/migration-phases-large.png":::

Migrating files and folders (unstructured storage) to the cloud requires careful planning and many considerations along the way to achieve an optimal result. Azure Storage Mover provides a growing list of features and migration scenarios that support you on your journey. In this article we'll break common tasks of a migration into phases that each have their own section.

## Phase 1: Discovery

In the discovery phase, you decide which source locations are part of your migration project. This article and Azure Storage Mover, handle source locations in form of file shares. These could live on a NAS (Network Attached Storage), a server, or even on a workstation. Common protocols for file shares are SMB and NFS.

If your workload uses DAS (Direct Attached Storage), like a local folder path vs. a share path, then most likely Azure Storage Mover can still assist with your cloud migration. You may be able to create a file share on the local folder path and thus share out the location over the local network. With proper permissions and networking considerations, you'll now be able to migrate this location to Azure, even if your application uses the local path.

Start by making a list of all the shares your workload depends on. Refer to your cloud solution design to see which shares remain where they are and which are in scope of the cloud migration. Narrow the scope of your migration project as much as possible. Ultimately, your workload will need to fail over to the cloud locations. The smaller the number of source locations, the easier the fail-over of your workload will be.

If you require to migrate the storage for multiple workloads at roughly the same time, still split them into individual migration projects.

> [!IMPORTANT]
> *Workload A*, *Workload B*, etc. should have their individual migration projects, rather than "All 58 shares from the sales NAS.". This will significantly simply migration management and workload fail-over at the end.

The result of the discovery phase is a list of file shares that you need to migrate to Azure. You should have distinct lists per workload.
Azure Storage Mover offers [migration projects](resource-hierarchy.md#migration-project) that you can create and store each individual list. A common practice is to name the migration project after the workload you are migrating. This practice simplifies oversight of your planning steps and your migration progress.

## Phase 2: Assessment

Azure has multiple available types of cloud storage. A fundamental aspect of file migrations to Azure is determining which Azure storage option is right for your data. The number of files and folders, their directory structure, file fidelity and other aspects are important inputs into a complete cloud solution design. 

In the assessment phase, you'll investigate your discovered and short-listed shares to ensure you have picked the right Azure target storage for your cloud solution design.

The key in any migration is to capture all the required file fidelity when moving your files from their current storage location to Azure. The focus is on "required fidelity by your workload" and not so much on the available fidelity. Different file systems and storage devices record an array of fidelity and fully preserving or keeping it working natively in Azure is not always required by the workload that uses the files. How much fidelity the Azure storage option supports and how much your scenario requires also helps you pick the right Azure storage. General-purpose file data traditionally depends on at least some file metadata. App data might not.

Here are the two basic components of a file:

- **Data stream:** The data stream of a file stores the file content.
- **File metadata:** The file metadata has these sub-components:
    - file attributes like read-only
    - file permissions, for instance NTFS permissions or file and folder ACLs
    - timestamps, most notably the creation, and last-modified timestamps
    - an alternate data stream, which is a space to store larger amounts of non-standard properties

File fidelity in a migration can be defined as the ability to:

- Read all required file information from the source.
- Transfer files with the migration service or tool.
- Store files in the target storage of the migration.

The output of the assessment phase is a list of aspects found in the source share. For example: share size, number of namespace items (combined count of files and folders), fidelity that needs to be preserved in the Azure storage target, fidelity that must remain natively working in the Azure storage target.

This insight is an important input into your cloud solutions design for storage.

## Phase 3: Planning

In the planning phase, you are combining your discovered source shares with your target locations in Azure.

The planning phase maps each source share to a concrete destination. For instance an Azure blob container. To do that, you must plan and record which Azure subscription and storage account will contain your target container.

In the Azure Storage Mover service, you can record each source/target pair as a [job definition](resource-hierarchy.md#job-definition). A job definition is nested in the migration project you've previously created. You'll need a new, distinct job definition for each source/target pair.

> [!NOTE]
> In this release of Azure Storage Mover, your target storage must exist, before you can create a job definition. For instance if your target is an Azure blob container, you'll need to deploy that first before making a new job definition. 

The outcome of the planning phase is a mapping of source shares to Azure target locations. If your targets don't already exist, you will have to complete the next phase "Deploy" before you can record your migration plan in the Azure Storage Mover service.

## Phase 4: Deployment

When you have a completed migration plan, you'll need to deploy the target Azure Storage resources, like storage accounts, containers, etc. before you can record your migration plan in Azure Storage Mover as a job definition for each source/target pair.

Azure Storage Mover currently can't help with the target resource deployment. To deploy Azure storage, you can use the Azure portal, Az PowerShell, Az CLI, or a [Bicep template](../azure-resource-manager/bicep/overview.md).

> [!IMPORTANT]
> When deploying Azure Storage, review the support source / target combinations <!!!!!!!!!    LINK NEEDED   !!!!!!!!!!> for Azure Storage Mover and ensure that you don't configure advanced storage settings like private links.

## Phase 5: Migration

The migration phase is where the actual copy of your files and folders to the Azure target location occurs.

There are two main considerations for the migration phase:
1. Minimize downtime of your workload.
1. Determine the correct migration mode. 

### Minimize downtime

When migrating workloads, its often a requirement to minimize the time the workload cannot access the storage it depends on. This section discusses a common strategy to minimize workload downtime:

**Convergent, n-pass migration**

In this strategy, you copy from source to target several times. During these copy iterations, the source remains available for read and write to the workload. Just before the final copy iteration, you take the source offline. It is expected that the final copy finishes faster than say the very first copy you've ever made. After the final copy, the workload is failed over to use the new target storage in Azure.

Azure Storage Mover supports copying from source to target as often as you require. A job definition stores your source, your target and migrations settings. You can instruct a migration agent to execute your job definition. That results in a job run. LearnIn this linked article, you can learn more about the [Storage Mover resource hierarchy](resource-hierarchy.md).

<!!!!!!!!!    VIDEO     !!!!!!!!!!!!>

### Migration modes

How your files are copied from source to target matters just as much as from where to where the copy occurs. Different migration scenarios need different settings. During a migration, you’ll likely copy from source to target several times - to [minimize downtime](#minimize-downtime). When files or folders change between copy iterations, the *copy mode* will determine the behavior of the migration engine. Carefully select the correct mode, based on the expected changes to your namespace during the migration.

There are two copy modes:

:::row:::
    :::column:::
        **Mirror** </br>
        *Make the target look like the source.*
    :::column-end:::
    :::column:::        
        - Files in the target will be deleted if they don’t exist in the source.
        - Files and folders in the target will be updated to match the source.        
    :::column-end:::
:::row-end:::

</br>

:::row:::
    :::column:::
        **Merge** </br>
        *The target has more content than the source, keep adding to it.*
    :::column-end:::
    :::column:::
        - Files will be kept in the target, even if they don’t exist in the source.
        - Files with matching names and paths will be updated to match the source.
        - Folder renames between copies may lead to duplicate content in the target.
    :::column-end:::
:::row-end:::

> [!NOTE]
> The current release of Azure Storage Mover only supports the **Merge** mode.

## Phase 6: Post-migration tasks

In this phase of the migration you need to think about additional configurations and services that enable you to fail-over your workload and to safeguard your data.

For instance, failing-over your workload requires a network path to safely access Azure storage. The public endpoint of an Azure storage account is currently required for migration, but now that your migration is complete, you may think about configuring [private endpoints for your storage account](../storage/common/storage-private-endpoints.md) and [enable firewall rules to disable data requests over the public endpoint](../storage/common/storage-network-security.md).

Here are a few more recommendations:
- [Data protection](../storage/blobs/security-recommendations.md#data-protection)
- [Identity and access management](../storage/blobs/security-recommendations.md#identity-and-access-management)
- [Networking](../storage/blobs/security-recommendations.md#networking) 

## Next steps

These articles can help you utilize Azure Storage Mover for your cloud migration:

- [Become familiar with the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Learn how to deploy a Storage Mover in your Azure subscription](resource-create.md)
- [Learn how to deploy a Storage Mover agent in your environment](agent-deploy.md)
