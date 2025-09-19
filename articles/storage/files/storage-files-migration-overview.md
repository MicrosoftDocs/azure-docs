---
title: Migration Overview for SMB Azure File Shares
description: Learn how to migrate to SMB Azure file shares and choose from a table of migration guides using Azure Storage Mover, Robocopy, Azure File Sync, and other tools.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 08/28/2025
ms.author: kendownie
# Customer intent: "As a system administrator, I want to understand the migration process to SMB Azure file shares, so that I can efficiently move our data with full fidelity and select the appropriate tools for a seamless transition to cloud storage."
---

# Migrate to SMB Azure file shares

This article covers the basic aspects of a migration to SMB Azure file shares and contains a table of migration guides. These guides help you move your files into Azure file shares. The guides are organized based on where your data is and what deployment model (cloud-only or hybrid) you're moving to.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Migration basics

The goal is to move the data from existing file share locations to Azure. In Azure, you'll store your data in native Azure file shares you can use without a need for a Windows Server. This migration needs to be done in a way that guarantees the integrity of the production data and availability during the migration. The latter requires keeping downtime to a minimum, so that it can fit into or only slightly exceed regular maintenance windows.

Azure offers different types of cloud storage. A fundamental aspect of file migrations to Azure is determining which Azure storage option is right for your data.

[Azure file shares](storage-files-introduction.md) are suitable for general-purpose file data. This data includes anything you use an on-premises SMB share for. With [Azure File Sync](../file-sync/file-sync-planning.md), you can cache the contents of several Azure file shares on Windows Servers, either on-premises or in Azure.

For an app that currently runs on an on-premises server, storing files in an Azure file share might be a good choice. You can move the app to Azure and use Azure file shares as shared storage. You can also consider [Azure Disks](/azure/virtual-machines/managed-disks-overview) for this scenario.

Some cloud apps don't depend on SMB or on machine-local data access or shared access. For those apps, object storage like [Azure blobs](../blobs/storage-blobs-overview.md) is often the best choice.

## Preserving file fidelity

A key aspect in any file share migration is capturing as much file fidelity as possible when moving your files from their current storage location to Azure.

Here are the two basic components of a file:

- **Data stream**: The data stream of a file stores the file content.
- **File metadata**: Unlike object storage in Azure blobs, an Azure file share can natively store [supported file metadata](#supported-metadata). General-purpose file data traditionally depends on file metadata. App data might not. The file metadata has these subcomponents:
  - File attributes like read-only
  - File permissions, which are often referred to as *NTFS permissions* or *file and folder ACLs*
  - Timestamps, most notably the creation and last-modified timestamps
  - An [alternative data stream](storage-files-faq.md#alternate-data-streams), which is a space to store larger amounts of nonstandard properties. This alternative data stream can't be stored on a file in an Azure file share. It's preserved on-premises when Azure File Sync is used.

File fidelity in a migration can be defined as the ability to:

- Store all applicable file information on the source.
- Transfer files with the migration tool.
- Store files in the target storage of the migration. </br> The target for migration guides in this article is one or more Azure file shares. Consider this [list of features that SMB Azure file shares don't support](files-smb-protocol.md#limitations).

To ensure your migration proceeds smoothly, identify [the best copy tool for your needs](#migration-guides) and match a storage target to your source.

> [!IMPORTANT]
> If you're migrating on-premises file servers to Azure Files, set the ACLs for the root directory of the file share **before** copying a large number of files, as changes to permissions for root ACLs can take a long time to propagate if done after a large file migration.

Users that leverage Active Directory Domain Services (AD DS) as their on-premises domain controller can natively access an Azure file share. So can users of Microsoft Entra Domain Services. Each uses their current identity to get access based on share permissions and on file and folder ACLs. This behavior is similar to a user connecting to an on-premises file share.

Learn more about [identity-based authentication for Azure Files over SMB](storage-files-active-directory-overview.md).

### Supported metadata

The following table lists supported metadata for Azure Files.

> [!IMPORTANT]
> The *LastAccessTime* timestamp isn't currently supported for files or directories on the target share. However, Azure Files will return the *LastAccessTime* value for a file when requested. Because the *LastModifiedTime* timestamp isn't updated on read operations, it will always be equal to the *CreationTime*.

| **Source** | **Target** |
|------------|------------|
| Directory structure | The original directory structure of the source can be preserved on the target share. |
| Access permissions | Azure Files supports Windows ACLs, and they must be set on the target share even if no AD integration is configured at migration time. The following ACLs must be preserved: owner security identifier (SID), group SID, discretionary access lists (DACLs), system access control lists (SACLs). |
| Create timestamp | The original create timestamp of the source file can be preserved on the target share. |
| Change timestamp | The original change timestamp of the source file can be preserved on the target share. |
| Modified timestamp | The original modified timestamp of the source file can be preserved on the target share. |
| File attributes | Common attributes such as read-only, hidden, and archive flags can be preserved on the target share. |

## Discovery phase

The first phase of a migration is the discovery phase, in which you determine all the existing SMB file shares that need to be migrated, including their size, number, and any dependencies. This can be a difficult and time consuming task, especially for organizations with large, distributed environments. For customers with more than 100 TiB of file data, we recommend using Komprise, a third-party tool that can help you discover and analyze your file shares. For more information, see [Komprise File Migration](https://www.komprise.com/azure-file-migration/).

Keep in mind that your existing SMB file shares might not be limited to on-premises Windows Servers. They could be on Linux servers, in the cloud, or on external NAS devices.

## Assessment phase

After discovery comes the assessment phase, which involves understanding available options for file storage, deploying the Azure resources you'll need, and preparing to use Azure file shares.

### Deploy Azure storage resources

As part of the assessment phase, you'll provision the Azure storage accounts and the SMB Azure file shares within them.

An Azure file share is deployed in the cloud in an Azure storage account. For standard file shares, that arrangement makes the storage account a scale target for performance numbers like IOPS and throughput. If you place multiple file shares in a single storage account, you're creating a shared pool of IOPS and throughput for these shares.

As a general rule, you can pool multiple Azure file shares into the same storage account if you have archival shares or you expect low day-to-day activity in them. However, if you have highly active shares (shares used by many users and/or applications), you'll want to deploy storage accounts with one file share each. These limitations don't apply to FileStorage (premium) storage accounts, where performance is explicitly provisioned and guaranteed for each share.

For more information about performance and cost, see [Understand performance](understand-performance.md) and [Understand billing](understanding-billing.md).

> [!NOTE]
> There's a limit of 250 storage accounts per subscription per Azure region. With a quota increase, you can create up to 500 storage accounts per region. For more information, see [Increase Azure Storage account quotas](/azure/quotas/storage-account-quota-requests).

Another consideration when you're deploying a storage account is redundancy. See [Azure Files redundancy](files-redundancy.md).

If you've made a list of your shares, you should map each share to the storage account it will be created in.

The names of your resources are also important. For example, if you group multiple shares for the HR department into an Azure storage account, you should name the storage account appropriately. Similarly, when you name your Azure file shares, you should use names similar to the ones used for their on-premises counterparts.

Now deploy the appropriate number of Azure storage accounts with the appropriate number of Azure file shares in them, following the instructions in [Create an SMB file share](storage-how-to-create-file-share.md). In most cases, you'll want to make sure the region of each of your storage accounts is the same.

### Prepare to use Azure file shares

You'll also need to decide how your servers and users in Azure and outside of Azure will be enabled to utilize your Azure file shares. The most critical decisions are:

- **Networking:** Enable your networks to route SMB traffic. See [Networking overview for Azure file shares](storage-files-networking-overview.md) for more information. You can use public endpoints, private endpoints, or a combination of both.
- **Authentication:** Configure the Azure storage account for identity-based authentication and join the storage account to your AD domain. This will allow your apps and users to use their AD identity for authentication.
- **Authorization:** Share-level ACLs for each Azure file share will allow AD users and groups to access a given share. Within an Azure file share, native NTFS ACLs will take over. Authorization based on file and folder ACLs then works like it does for on-premises SMB shares.
- **Business continuity:** Integrating Azure file shares into an existing environment often entails preserving existing share addresses. If you aren't already using [DFS-Namespaces](files-manage-namespaces.md), consider establishing that in your environment. You'll be able to keep share addresses your users and scripts use, unchanged. DFS-N provides a namespace routing service for SMB by redirecting clients to Azure file shares.

:::row:::
    :::column:::
        > [!VIDEO https://www.youtube-nocookie.com/embed/jd49W33DxkQ]
    :::column-end:::
    :::column:::
        This video is a guide and demo for how to securely expose Azure file shares directly to information workers and apps in five simple steps.</br>
        The video references dedicated documentation for the following topics. Note that Azure Active Directory is now Microsoft Entra ID. For more information, see [New name for Azure AD](https://aka.ms/azureadnewname).

* [Identity-based authentication overview](storage-files-active-directory-overview.md)
* [Networking overview for Azure file shares](storage-files-networking-overview.md)
* [How to configure public and private endpoints](storage-files-networking-endpoints.md)
* [How to configure a S2S VPN](storage-files-configure-s2s-vpn.md)
* [How to configure a Windows P2S VPN](storage-files-configure-p2s-vpn-windows.md)
* [How to configure a Linux P2S VPN](storage-files-configure-p2s-vpn-linux.md)
* [How to configure DNS forwarding](storage-files-networking-dns.md)
* [Configure DFS-N](files-manage-namespaces.md)
   :::column-end:::
:::row-end:::

## Migration guides

Selecting the right tools for your migration scenario is crucial. The following diagram shows what migration tool or tool combination you should use based on your SMB data source and whether or not you want to use Azure File Sync.

:::image type="content" source="media/storage-files-migration-overview/smb-migration-flowchart.png" alt-text="Decision flowchart showing which migration tool you should choose based on your SMB data source." lightbox="media/storage-files-migration-overview/smb-migration-flowchart.png" border="false":::

The following table lists the suggested migration tool combinations and includes links to tool-specific migration guides.

How to use the table:

1. Locate the row for the source system your files are currently stored on.

1. Choose one of these targets:

   - **Hybrid deployment:** Use [Azure File Sync](../file-sync/file-sync-introduction.md) to cache the content of Azure file shares on-premises and tier less frequently used files to the cloud.
   - **Cloud-only deployment:** Azure file shares in the cloud, with no on-premises caching.

   Select the target column that matches your choice.

1. Within the intersection of source and target, a table cell lists available migration scenarios. Select one to view the migration guide.

A scenario without a link doesn't yet have a published migration guide. Check this table occasionally for updates.

| Source | Target: </br>Hybrid deployment </br>(Azure Files + Azure File Sync) | Target: </br>Cloud-only deployment </br>(Azure Files)|
|:---|:--|:--|
| | Recommended tool combination:| Recommended tool combination: |
| Windows Server 2012 R2 and later | <ul><li>[Azure File Sync](../file-sync/file-sync-deployment-guide.md)</li><li>[Azure File Sync and Azure DataBox](storage-files-migration-server-hybrid-databox.md)</li></ul> | <ul><li>Via Azure File Sync: Follow same steps as [Azure File Sync hybrid deployment](../file-sync/file-sync-deployment-guide.md) and [decommission server endpoint](../file-sync/file-sync-server-endpoint-delete.md) at the end.</li><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li><li>Via [Azure Storage Mover](migrate-files-storage-mover.md)</li></ul> |
| Windows Server 2012 and earlier | <ul><li>Via [DataBox](../../databox/data-box-overview.md)</li><li>Via [Storage Migration Service](/windows-server/storage/storage-migration-service/overview) to recent server with [Azure File Sync](../file-sync/file-sync-deployment-guide.md), then upload</li></ul> | <ul><li>Via [Azure Storage Mover](migrate-files-storage-mover.md)</li><li>Via [Storage Migration Service](/windows-server/storage/storage-migration-service/overview) to recent server with [Azure File Sync](../file-sync/file-sync-deployment-guide.md)</li><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li></ul> |
| Linux (SMB) | <ul><li>NA</li></ul> | <ul><li>Via [Azure Storage Mover](migrate-files-storage-mover.md)</li></ul> |
| Network-attached storage (NAS) | <ul><li>Via [Storage Mover upload](migrate-files-storage-mover.md) + [Azure File Sync](../file-sync/file-sync-deployment-guide.md)</li><li>[Via Azure File Sync upload](storage-files-migration-nas-hybrid.md)</li><li>[Via DataBox + Azure File Sync](storage-files-migration-nas-hybrid-databox.md)</li></ul> | <ul><li>Via [Azure Storage Mover](migrate-files-storage-mover.md)</li><li>[Via DataBox](storage-files-migration-nas-cloud-databox.md)</li><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li></ul> |

### File-copy tools

To select the right tool for your migration scenario, consider these fundamental questions:

- Does the tool support the source and target locations for your file copy?

- Does the tool support your network path or available protocols (such as REST or SMB) between the source and target storage locations?

- Does the tool preserve the necessary file fidelity supported by your source and target locations?

    In some cases, your target storage doesn't support the same fidelity as your source. If the target storage is sufficient for your needs, the tool must match only the target's file-fidelity capabilities.

- Does the tool have features that let it fit into your migration strategy?

    For example, consider whether the tool lets you minimize your downtime.

    When a tool supports an option to mirror a source to a target, you can often run it multiple times on the same source and target while the source stays accessible.

    The first time you run the tool, it copies the bulk of the data. This initial run might last a while. It often lasts longer than you want for taking the data source offline for your business processes.

    By mirroring a source to a target (as with **robocopy /MIR**), you can run the tool again on that same source and target. This second run is much faster because it needs to transport only source changes that happened after the previous run. Rerunning a copy tool this way can reduce downtime significantly.

The following table classifies Microsoft tools and their current suitability for SMB Azure file shares:

| Recommended | Tool | Support for Azure file shares | Preservation of file fidelity |
| :-: | :-- | :---- | :---- |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| [Azure Storage Mover](../../storage-mover/service-overview.md) | Supported. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| [Azure Data Box](../../databox/data-box-overview.md?pivots=dbx-ng) | Supported. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| RoboCopy | Supported. Azure file shares can be mounted as network drives. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| [Azure File Sync](../file-sync/file-sync-introduction.md) | Natively integrated into Azure file shares. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| [Azure Storage Migration Program](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md) | Supported. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| Storage Migration Service | Indirectly supported. Azure file shares can be mounted as network drives on SMS target servers. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| Data Box (including the [data copy service](../../databox/data-box-deploy-copy-data-via-copy-service.md) to load files onto the device)| Supported. </br>(Data Box Disks doesn't support large file shares) | Data Box and Data Box Heavy fully support metadata. </br>Data Box Disks does not preserve file metadata. |
|![Not fully recommended](media/storage-files-migration-overview/triangle-yellow-exclamation.png)| AzCopy </br>latest version | Supported but not fully recommended. | AzCopy sync supports up to 10 million files per AzCopy job and some file fidelity might be lost as AzCopy uses the Azure Files REST APIs for copying content to your Azure Files share. </br>[Learn how to use AzCopy with Azure file shares](../common/storage-use-azcopy-files.md) |
|![Not fully recommended](media/storage-files-migration-overview/triangle-yellow-exclamation.png)| Azure Storage Explorer </br>latest version | Supported but not recommended. | Loses most file fidelity, like ACLs. Supports timestamps. |
|![Not recommended](media/storage-files-migration-overview/circle-red-x.png)| Azure Data Factory | Supported. | Doesn't copy metadata. |
|||||

*\* Full fidelity: meets or exceeds Azure file share capabilities.*

### Migration helper tools

This section describes tools that help you plan and run migrations.

#### Azure Storage Mover

Azure Storage Mover is a relatively new, fully managed migration service that enables you to migrate files and folders to SMB Azure file shares with the same level of file fidelity as the underlying Azure file share. Folder structure and metadata values such as file and folder timestamps, ACLs, and file attributes are maintained. To learn how to use Azure Storage Mover with Azure Files, see [Migrate to SMB Azure file shares using Azure Storage Mover](migrate-files-storage-mover.md).

#### RoboCopy

Included in Windows, RoboCopy is very useful for SMB file migrations. The [RoboCopy documentation](/windows-server/administration/windows-commands/robocopy) is a helpful resource for this tool's many options.

#### Azure Storage Migration Program

Understanding your data is the first step in selecting the appropriate Azure storage service and migration strategy. Azure Storage Migration Program provides different tools that can analyze your data and storage infrastructure to provide valuable insights. These tools can help you understand the size and type of data, file and folder count, and access patterns. They provide a consolidated view of your data and enable the creation of various customized reports.

This information can help:

- Identify duplicate and redundant data sets
- Identify colder data that can be moved to less expensive storage

To learn more, see [Comparison Matrix for Azure Storage Migration Program participants](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md).

#### TreeSize from JAM Software GmbH

Azure File Sync scales primarily with the number of items (files and folders) and not with the total storage amount. The TreeSize tool lets you determine the number of items on your Windows Server volumes.

You can use the tool to create a perspective before an [Azure File Sync deployment](../file-sync/file-sync-deployment-guide.md). You can also use it when cloud tiering is engaged after deployment. In that scenario, you see the number of items and which directories use your server cache the most.

The tested version of the tool is version 4.4.1. It's compatible with cloud-tiered files. The tool won't cause recall of tiered files during its normal operation.

## See also

- [Azure file share overview](storage-files-introduction.md)
- [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
- [Azure File Sync: Cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md)
