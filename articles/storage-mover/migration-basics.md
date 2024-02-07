---
title: Cloud migration basics for file and folder storage
description: Understand the basic decisions and strategies for the cloud migration of files and folders.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: conceptual
ms.date: 08/07/2023
---

<!-- 
!########################################################
STATUS: IN REVIEW

CONTENT: final

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed
EDIT PASS: not started

Initial doc score: 83 (1761 words and 29 issues)
Current doc score: 100 (1749 words and 0 issues)

!########################################################
-->

# Cloud migration basics for file and folder storage

Every migration starts with a business need. A cloud migration transforms a workload by moving the files and folders on which it depends. A workload can be either an application or direct user access. In either case, the workload has a dependency on storage that you move to the cloud. The workload might also move to the cloud, or remain where in place but require a configuration change in order to point to the new cloud storage location. These details are recorded in your *cloud solution design* that has a storage section.

The purpose of this article is to provide insight into how you can achieve a storage migration to Azure, such that you can realize your cloud solution design for storage.

:::image type="content" source="media/migration-basics/migration-phases.png" alt-text="Summary illustration showing migration phases: Discover, Assess, Plan, Deploy, Migrate, Post-Migrate to illustrate the sections to come in this article." lightbox="media/migration-basics/migration-phases-large.png":::

Migrating files and folders to the cloud requires careful planning and many considerations along the way to achieve an optimal result. Azure Storage Mover provides a growing list of features and migration scenarios that support you on your journey. In this article, we break common tasks of a migration into phases that each have their own section.

## Phase 1: Discovery

In the discovery phase, you decide which source locations are part of your migration project. Azure Storage Mover handles source locations in form of file shares. These locations could reside on Network Attached Storage (NAS), a server, or even on a workstation. Common protocols for file shares are SMB (Server Message Block) and NFS (Network File System).

If your workload uses Direct Attached Storage (DAS), then most likely Azure Storage Mover can still assist with your cloud migration. You may be able to create a file share on the local folder path and then share out the location over the local network. With proper permissions and networking considerations, you're now able to migrate this location to Azure, even if your application uses the local path.

Start by making a list of all the shares on which your workload depends. Refer to your cloud solution design to see which shares remain on-premises are and which are in-scope for cloud migration. Narrow the scope of your migration project as much as possible. Ultimately, your workload needs to fail over to the cloud locations. The smaller the number of source locations, the easier the failover of your workload.

If you need to migrate storage for multiple workloads at roughly the same time, you should split them into individual migration projects.

> [!IMPORTANT]
> Including multiple workloads in a single migration project is not recommended. Each workload should have its own migration project. Structuring the project in this way will significantly simplify migration management and workload failover.

The result of the discovery phase is a list of file shares that you need to migrate to Azure. You should have distinct lists per workload.

Azure Storage Mover offers [migration projects](resource-hierarchy.md#migration-project) for creating and storing individual lists. A common practice is to name the migration project after the workload you're migrating. This practice simplifies oversight of your planning steps and your migration progress.

## Phase 2: Assessment

Azure offers various types of cloud storage. A fundamental aspect of file migrations to Azure is determining which Azure storage option is right for your data. The number of files and folders, their directory structure, access protocol, file fidelity and other aspects are important inputs into a complete cloud solution design.

In the assessment phase, you investigate your discovered and short-listed shares to ensure you've picked the right Azure target storage for your cloud solution design.

A key part of any migration is to capture the required file fidelity when moving your files from their current storage location to Azure. Different file systems and storage devices record an array of file fidelity information, and fully preserving or keeping that information in Azure isn't always necessary. The file fidelity required by your scenario, and the degree of fidelity supported by the storage offering in Azure, also helps you to pick the right storage solution in Azure. General-purpose file data traditionally depends on at least some file metadata. App data might not.

Here are the two basic components of a file:

- **Data stream:** The data stream of a file stores the file content.
- **File metadata:** The file metadata has these subcomponents:
  - file attributes, such as *read-only*
  - file permissions, such as NTFS permissions or file and folder access control lists (ACLs)
  - timestamps, most notably the *creation* and *last-modified* timestamps
  - an alternate data stream, which is a space to store larger amounts of nonstandard properties

File fidelity in a migration can be defined as the ability to:

- Read all required file information from the source.
- Transfer files with the migration service or tool.
- Store files in the target storage of the migration.

The output of the assessment phase is a list of aspects found in the source share. These aspects may include data such as:

- Share size.
- The number of namespace items, or the combined count of files and folders.
- The level of fidelity that needs to be preserved in the Azure storage target.
- The level of fidelity that must remain natively working in the Azure storage target.

This insight is an important input into your cloud solutions design for storage.

## Phase 3: Planning

In the planning phase, you combine your discovered source shares with your target locations in Azure.

The planning phase maps each source share to a specific destination, such as an Azure blob container or an Azure file share. To do that, you must plan and record which Azure subscription and storage accounts contain your target resources.

In the Azure Storage Mover service, you can record each source/target pair as a [job definition](resource-hierarchy.md#job-definition). A job definition is nested in the migration project you've previously created. You need a new, distinct job definition for each source/target pair.

> [!NOTE]
> In this release of Azure Storage Mover, your target storage must exist before you can create a job definition. For example, if your target is an Azure blob container, you need to deploy it before you create a new job definition.

The outcome of the planning phase is a mapping of source shares to Azure target locations. If your targets don't already exist, you'll have to complete the next phase "Deploy" before you can record your migration plan in the Azure Storage Mover service.

## Phase 4: Deployment

After you complete a migration plan, you need to ensure that the target Azure Storage resources such as storage accounts and containers are deployed. You need to complete this deployment before you can record your migration plan as a job definition for each source/target pair within Azure Storage Mover.

Azure Storage Mover currently can't help with the target resource deployment. To deploy Azure storage, you can use the Azure portal, Azure PowerShell, Azure CLI, or a [Bicep template](../azure-resource-manager/bicep/overview.md).

> [!IMPORTANT]
> When deploying Azure Storage, [review the support source/target pair combinations](service-overview.md#supported-sources-and-targets) for Azure Storage Mover and ensure that you don't configure unsupported scenarios.

## Phase 5: Migration

The work of copying of your files and folders to an Azure target location occurs within the migration phase.

There are two main considerations for the migration phase:

- Minimize the downtime of your workload.
- Determine the correct migration mode.

### Minimize downtime

During a migration, there may be periods of time during which a workload is unable to access the storage on which it depends. Minimizing these periods of time is often a requirement. This section discusses a common strategy to minimize workload downtime.

#### Convergent, n-pass migration

In this strategy, you copy data from source to target several times. During these copy iterations, the source remains available for read and write to the workload. Just before the final copy iteration, you take the source offline. It's expected that the final copy finishes faster than the initial copy. After the final copy, the workload is failed over to use the new target storage in Azure.

Azure Storage Mover supports copying from source to target as often as you require. A job definition stores your source, target, and migration settings. You can instruct a migration agent to execute your job definition, which results in a job run. In this linked article, you can learn more about the [Storage Mover resource hierarchy](resource-hierarchy.md).

<!-- Needs a video in the future
<!!!!!!!!!    VIDEO     !!!!!!!!!!!!> -->

### Migration modes

*How* your files are copied from source to target is equally important as *where* the files are copied to and from. Different migration scenarios require different settings. During a migration, you're likely to copy from source to target several times in order to [minimize downtime](#minimize-downtime). When files or folders change between copy iterations, the *copy mode* determines the behavior of the migration engine. Carefully select the correct mode, based on the expected changes to your namespace during the migration.

There are two copy modes:

| Copy mode                                           | Migration behavior |
|-----------------------------------------------------|--------------------|
|**Mirror**<br/>The target looks like the source. | - *Files in the target are deleted if they don’t exist in the source.*<br/>- *Files and folders in the target are updated to match the source.* |
|**Merge**<br/>The target has more content than the source, and you keep adding to it.    | - *Files are kept in the target, even if they don’t exist in the source.*<br/>- *Files with matching names and paths are updated to match the source.*<br/>- *Folder renames between copies may lead to duplicate content in the target.*|

## Phase 6: Post-migration tasks

In this phase of the migration, you need to think about other configurations and services that enable you to fail over your workload and to safeguard your data.

For instance, failing-over your workload requires a network path to safely access Azure storage. If you used the public endpoint of an Azure storage account during migration, consider configuring [private endpoints for your storage account](../storage/common/storage-private-endpoints.md) and [enable firewall rules to disable data requests over the public endpoint](../storage/common/storage-network-security.md).

Here are a few more recommendations:
- [Data protection](../storage/blobs/security-recommendations.md#data-protection)
- [Identity and access management](../storage/blobs/security-recommendations.md#identity-and-access-management)
- [Networking](../storage/blobs/security-recommendations.md#networking)

## Next steps

These articles can help you utilize Azure Storage Mover for your cloud migration:

- [Become familiar with the Storage Mover resource hierarchy](resource-hierarchy.md)
- [Learn how to deploy a Storage Mover in your Azure subscription](storage-mover-create.md)
- [Learn how to deploy a Storage Mover agent in your environment](agent-deploy.md)
