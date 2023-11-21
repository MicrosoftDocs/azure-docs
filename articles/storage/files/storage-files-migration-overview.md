---
title: Migrate to Azure file shares
description: Learn how to migrate to Azure file shares and find your migration guide.
author: khdownie
ms.service: azure-file-storage
ms.topic: conceptual
ms.date: 10/30/2023
ms.author: kendownie
---

# Migrate to Azure file shares

This article covers the basic aspects of a migration to Azure file shares and contains a table of migration guides. These guides help you move your files into Azure file shares. The guides are organized based on where your data is and what deployment model (cloud-only or hybrid) you're moving to.

## Migration basics

Azure has multiple available types of cloud storage. A fundamental aspect of file migrations to Azure is determining which Azure storage option is right for your data.

[Azure file shares](storage-files-introduction.md) are suitable for general-purpose file data. This data includes anything you use an on-premises SMB or NFS share for. With [Azure File Sync](../file-sync/file-sync-planning.md), you can cache the contents of several Azure file shares on servers running Windows Server on-premises.

For an app that currently runs on an on-premises server, storing files in an Azure file share might be a good choice. You can move the app to Azure and use Azure file shares as shared storage. You can also consider [Azure Disks](../../virtual-machines/managed-disks-overview.md) for this scenario.

Some cloud apps don't depend on SMB or on machine-local data access or shared access. For those apps, object storage like [Azure blobs](../blobs/storage-blobs-overview.md) is often the best choice.

The key in any migration is to capture all the applicable file fidelity when moving your files from their current storage location to Azure. How much fidelity the Azure storage option supports and how much your scenario requires also helps you pick the right Azure storage. General-purpose file data traditionally depends on file metadata. App data might not.

Here are the two basic components of a file:

- **Data stream**: The data stream of a file stores the file content.
- **File metadata**: The file metadata has these subcomponents:
   * File attributes like read-only
   * File permissions, which can be referred to as *NTFS permissions* or *file and folder ACLs*
   * Timestamps, most notably the creation and last-modified timestamps
   * An alternative data stream, which is a space to store larger amounts of nonstandard properties

File fidelity in a migration can be defined as the ability to:

- Store all applicable file information on the source.
- Transfer files with the migration tool.
- Store files in the target storage of the migration. </br> Ultimately, the target for migration guides on this page is one or more Azure file shares. Consider this [list of features that SMB Azure file shares don't support](files-smb-protocol.md#limitations).

To ensure your migration proceeds smoothly, identify [the best copy tool for your needs](#migration-toolbox) and match a storage target to your source.

Taking the previous information into account, you can see that the target storage for general-purpose files in Azure is [Azure file shares](storage-files-introduction.md).

Unlike object storage in Azure blobs, an Azure file share can natively store file metadata. Azure file shares also preserve the file and folder hierarchy, attributes, and permissions. NTFS permissions can be stored on files and folders because they're on-premises.

> [!IMPORTANT]
> If you're migrating on-premises file servers to Azure File Sync, set the ACLs for the root directory of the file share **before** copying a large number of files, as changes to permissions for root ACLs can take up to a day to propagate if done after a large file migration.

Users that leverage Active Directory Domain Services (AD DS) as their on-premises domain controller can natively access an Azure file share. So can users of Microsoft Entra Domain Services. Each uses their current identity to get access based on share permissions and on file and folder ACLs. This behavior is similar to a user connecting to an on-premises file share.

The alternative data stream is the primary aspect of file fidelity that currently can't be stored on a file in an Azure file share. It's preserved on-premises when Azure File Sync is used.

Learn more about [on-premises Active Directory authentication](storage-files-identity-auth-active-directory-enable.md) and [Microsoft Entra Domain Services authentication](storage-files-identity-auth-domain-services-enable.md) for Azure file shares.

## Migration guides

The following table lists detailed migration guides.

How to use the table:

1. Locate the row for the source system your files are currently stored on.

1. Choose one of these targets:

   - A hybrid deployment using Azure File Sync to cache the content of Azure file shares on-premises
   - Azure file shares in the cloud

   Select the target column that matches your choice.

1. Within the intersection of source and target, a table cell lists available migration scenarios. Select one to directly link to the detailed migration guide.

A scenario without a link doesn't yet have a published migration guide. Check this table occasionally for updates. New guides will be published when they're available.

| Source | Target: </br>Hybrid deployment | Target: </br>Cloud-only deployment |
|:---|:--|:--|
| | Tool combination:| Tool combination: |
| Windows Server 2012 R2 and later | <ul><li>[Azure File Sync](../file-sync/file-sync-deployment-guide.md)</li><li>[Azure File Sync and Azure DataBox](storage-files-migration-server-hybrid-databox.md)</li></ul> | <ul><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li><li>via Azure File Sync: Follow same steps as [Azure File Sync hybrid deployment](../file-sync/file-sync-deployment-guide.md) and [decommission server endpoint](../file-sync/file-sync-server-endpoint-delete.md) at the end.</li></ul> |
| Windows Server 2012 and earlier | <ul><li>Via DataBox and Azure File Sync to recent server OS</li><li>Via Storage Migration Service to recent server with Azure File Sync, then upload</li></ul> | <ul><li>Via Storage Migration Service to recent server with Azure File Sync</li><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li></ul> |
| Network-attached storage (NAS) | <ul><li>[Via Azure File Sync upload](storage-files-migration-nas-hybrid.md)</li><li>[Via DataBox + Azure File Sync](storage-files-migration-nas-hybrid-databox.md)</li></ul> | <ul><li>[Via DataBox](storage-files-migration-nas-cloud-databox.md)</li><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li></ul> |
| Linux / Samba | <ul><li>[Azure File Sync and RoboCopy](storage-files-migration-linux-hybrid.md)</li></ul> | <ul><li>[Via RoboCopy to a mounted Azure file share](storage-files-migration-robocopy.md)</li></ul> |

## Migration toolbox

### File-copy tools

There are several file-copy tools available from Microsoft and others. To select the right tool for your migration scenario, consider these fundamental questions:

* Does the tool support the source and target locations for your file copy?

* Does the tool support your network path or available protocols (such as REST, SMB, or NFS) between the source and target storage locations?

* Does the tool preserve the necessary file fidelity supported by your source and target locations?

    In some cases, your target storage doesn't support the same fidelity as your source. If the target storage is sufficient for your needs, the tool must match only the target's file-fidelity capabilities.

* Does the tool have features that let it fit into your migration strategy?

    For example, consider whether the tool lets you minimize your downtime.
    
    When a tool supports an option to mirror a source to a target, you can often run it multiple times on the same source and target while the source stays accessible.

    The first time you run the tool, it copies the bulk of the data. This initial run might last a while. It often lasts longer than you want for taking the data source offline for your business processes.

    By mirroring a source to a target (as with **robocopy /MIR**), you can run the tool again on that same source and target. This second run is much faster because it needs to transport only source changes that happened after the previous run. Rerunning a copy tool this way can reduce downtime significantly.

The following table classifies Microsoft tools and their current suitability for Azure file shares:

| Recommended | Tool | Support for Azure file shares | Preservation of file fidelity |
| :-: | :-- | :---- | :---- |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| RoboCopy | Supported. Azure file shares can be mounted as network drives. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| Azure File Sync | Natively integrated into Azure file shares. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| [Azure Storage Migration Program](../solution-integration/validated-partners/data-management/azure-file-migration-program-solutions.md) | Supported. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| Storage Migration Service | Indirectly supported. Azure file shares can be mounted as network drives on SMS target servers. | Full fidelity.* |
|![Yes, recommended](media/storage-files-migration-overview/circle-green-checkmark.png)| Data Box (including the [data copy service](../../databox/data-box-deploy-copy-data-via-copy-service.md) to load files onto the device)| Supported. </br>(Data Box Disks doesn't support large file shares) | Data Box and Data Box Heavy fully support metadata. </br>Data Box Disks does not preserve file metadata. |
|![Not fully recommended](media/storage-files-migration-overview/triangle-yellow-exclamation.png)| AzCopy </br>latest version | Supported but not fully recommended. | Doesn't support differential copies at scale, and some file fidelity might be lost. </br>[Learn how to use AzCopy with Azure file shares](../common/storage-use-azcopy-files.md) |
|![Not fully recommended](media/storage-files-migration-overview/triangle-yellow-exclamation.png)| Azure Storage Explorer </br>latest version | Supported but not recommended. | Loses most file fidelity, like ACLs. Supports timestamps. |
|![Not recommended](media/storage-files-migration-overview/circle-red-x.png)| Azure Data Factory | Supported. | Doesn't copy metadata. |
|||||

*\* Full fidelity: meets or exceeds Azure file share capabilities.*

### Migration helper tools

This section describes tools that help you plan and run migrations.

#### RoboCopy

Included in Windows, RoboCopy is one of the tools most applicable to file migrations. The main [RoboCopy documentation](/windows-server/administration/windows-commands/robocopy) is a helpful resource for this tool's many options.

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

## Next steps

1. Create a plan for which deployment of Azure file shares (cloud-only or hybrid) you want.
1. Review the list of available migration guides to find the guide that matches your source and deployment of Azure file shares.

More information about the Azure Files technologies mentioned in this article:

- [Azure file share overview](storage-files-introduction.md)
- [Planning for an Azure File Sync deployment](../file-sync/file-sync-planning.md)
- [Azure File Sync: Cloud tiering](../file-sync/file-sync-cloud-tiering-overview.md)
