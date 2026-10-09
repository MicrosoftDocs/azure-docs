---
title: Azure Files management concepts
description: Understand the two resource providers for Azure Files — classic file shares (Microsoft.Storage) and file shares (Microsoft.FileShares) — and choose the right management model for your deployment.
author: khdownie
ms.service: azure-file-storage
ms.topic: concept-article
ms.date: 10/03/2026
ms.author: kendownie
ms.custom: references_regions
# Customer intent: As a system architect, I want to understand the Azure Files resource providers and management models so that I can choose the right approach for deploying file shares.
---

# Azure Files management concepts

In Azure, a *resource* is a manageable item that you create and configure within your Azure subscriptions and resource groups. *Resource providers* are management services that deliver specific types of resources. While you might work with many resources to deploy a workload in Azure, Azure Files centers on two key resources:

- **Storage accounts**, offered by the `Microsoft.Storage` resource provider. Storage accounts are top-level resources that represent a shared pool of storage, IOPS, and throughput in which you can deploy **classic file shares** or other storage resources, depending on the storage account kind. All storage resources that you deploy into a storage account share the limits that apply to that storage account. Classic file shares support both the SMB and NFS file sharing protocols.

- **File shares**, offered by the `Microsoft.FileShares` resource provider. File shares are a new top-level resource that simplifies the deployment of Azure Files by eliminating the need for a storage account. Unlike classic file shares, which you must deploy into a storage account, you deploy file shares directly into the resource group like storage accounts themselves, or other Azure resources such as virtual machines, disks, or virtual networks. Currently, `Microsoft.FileShares` only supports the NFS file sharing protocol. If you require SMB, choose classic file shares.

:::image type="content" source="./media/storage-files-planning/file-share-comparison.png" alt-text="Diagram comparing file shares and classic Azure file shares." lightbox="./media/storage-files-planning/file-share-comparison.png":::

This video provides a comprehensive overview of the differences between the storage account and file share management models:

> [!VIDEO https://www.youtube.com/embed/GLVbQ1k5RmE?si=bkBqdTUJflY9CTPY]

## Classic file shares (Microsoft.Storage)

Classic file shares are file shares deployed in storage accounts. They support SMB and NFS, SSD and HDD media tiers, and multiple redundancy options. Supported combinations and regional availability depend on the protocol, media tier, and billing model. For example, NFS requires SSD storage. The storage account model has the following considerations:

- **Capacity planning**: Classic file shares share the limits of their storage account. Provisioned storage accounts contain only file shares. Pay-as-you-go storage accounts can also contain blob containers, queues, and tables. Consider the combined storage, IOPS, and throughput needs of the resources in each account.

- **Shared settings**: You apply many important settings, such as network and security rules, at the storage account level. As a result, you must carefully consider how you place classic file shares in the same storage account. Consider the storage account to be a trust boundary and only place classic file shares in the same storage account if you're okay with them having the same security settings.

- **Scaling complexity**: Large scale Azure Files deployments can require managing many Azure subscriptions due to the constraints on storage accounts from the `Microsoft.Storage` resource provider. See [storage account limits](./storage-files-scale-targets.md#storage-account-data-plane-limits) for more information.

Classic file share deployments use two kinds of storage accounts:

- **Provisioned storage accounts**: The `FileStorage` storage account kind identifies provisioned storage accounts. You can deploy provisioned classic file shares on either SSD or HDD based hardware by using provisioned storage accounts. You can only use provisioned storage accounts to store classic file shares. You can't use them for other storage resources such as blob containers, queues, and tables. Use provisioned storage accounts for all new classic file share deployments.

- **Pay-as-you-go storage accounts**: The `StorageV2` storage account kind identifies pay-as-you-go storage accounts. You can deploy pay-as-you-go file shares on HDD based hardware by using pay-as-you-go storage accounts. You can use pay-as-you-go storage accounts to store classic file shares and other storage resources such as blob containers, queues, or tables.

To learn more, see [Create a classic file share](./create-classic-file-share.md).

## File shares (Microsoft.FileShares)

The `Microsoft.FileShares` resource provider offers file shares as a new top-level Azure resource. These file shares provide the following advantages over classic file shares:

- **Simplified management**: Create file shares directly as top-level resources in the Azure portal or through management APIs. This approach removes the requirement to manage a storage account and streamlines the deployment experience.

- **Independent capacity and performance**: Each file share has its own provisioned storage, IOPS, and throughput. You can scale these quantities within the file share's limits without managing a shared storage account limit.

- **Granular configuration**: Apply networking and security settings at the file share level, so you have precise control of access boundaries and isolation. This configuration makes it easier to enforce security policies for specific apps, teams, or environments.

- **Predictable, flexible billing**: File shares use the provisioned v2 billing model, which enables you to independently provision storage, IOPS, and throughput per share. Because Azure bills per top-level Azure resource, you can easily track the costs of each individual share for cost attribution back to the project, team, or customer that is using the file share.

- **Resource limits**: File shares have per-share and subscription limits that differ from storage account limits. For the limits of both resource providers, see [Azure Files scalability and performance targets](./storage-files-scale-targets.md).

### Regional availability

Currently, you can create a file share with Microsoft.FileShares in the following regions. Private endpoint support for file share with Microsoft.FileShares is available in all Azure public cloud regions.

- Australia Central
- Australia East
- Australia Southeast
- Brazil South
- Brazil Southeast
- Canada Central
- Canada East
- Central India
- East Asia
- East US
- France Central
- France South
- Germany North
- Germany West Central
- Israel Central
- Italy North
- Japan East
- Japan West
- JIO India Central
- JIO India West
- Korea Central
- Korea South
- North Central US
- North Europe
- Norway East
- Norway West
- Poland Central
- South Africa North
- South Africa West
- South Central US
- South India
- Southeast Asia
- Sweden Central
- UAE Central
- UAE North
- UK South
- UK West
- West Europe
- West US

## Comparing resource providers: Microsoft.Storage versus Microsoft.FileShares

Evaluate the new file share experience with Microsoft.FileShares for all your new Azure Files NFS protocol deployments.

Use the following table to compare feature support for your workload. Classic file shares support SMB and NFS. Microsoft.FileShares currently supports NFS.

| Feature | Classic file shares ![fileshareclassicicon1](./media/storage-files-planning/icon-service-file-share.svg) | File shares (Microsoft.FileShares) ![mfsicon](./media/storage-files-planning/icon-service-Managed-File-Shares.svg) |
|-|-|-|
| Support guarantee | Generally available | Generally available |
| Top level resource for the service | Storage account ![fileshareclassicicon2](./media/storage-files-planning/icon-service-Storage-Accounts.svg) | File shares ![mfsicon](./media/storage-files-planning/icon-service-Managed-File-Shares.svg) |
| SMB protocol  | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| NFS protocol | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Azure File Sync support | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Require storage account | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Pay-as-you-go billing model | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Provisioned v1 billing model | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Provisioned v2 billing model | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| HDD supportability | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| SSD supportability | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| LRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| ZRS | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| GRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Independent top-level resource for each file share | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Network rules configured on each file share | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Network rules shared by file shares in a storage account | ![Yes](../media/icons/yes-icon.png) | Not applicable |
| [Service endpoint policies](storage-files-networking-overview.md#restrict-outbound-access-with-service-endpoint-policies) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| AKS CSI driver | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Data plane REST APIs | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Soft delete support | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Snapshots support | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| Encryption in transit | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Customer managed keys | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Zonal pinning | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Related content

- [Plan an Azure Files deployment](storage-files-planning.md)
- [Create a classic file share](create-classic-file-share.md)
- [Create a file share with Microsoft.FileShares](create-file-share.md)
