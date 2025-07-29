---
title: Network Security Perimeter for Azure Storage (Preview)
description: Network security perimeter enables you to define a logical network isolation boundary for PaaS resources that are deployed outside your virtual networks. 
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Network security perimeter for Azure Storage (preview)

[Network security perimeter](../../private-link/network-security-perimeter-concepts.md) (preview) allows organizations to define a logical network isolation boundary for PaaS resources (for example, Azure Blob Storage and SQL Database) that are deployed outside their virtual networks. The feature restricts public network access to PaaS resources outside the perimeter. However, you can exempt access by using explicit access rules for public inbound and outbound traffic. By design, access to a storage account from within a network security perimeter takes the highest precedence over other network access restrictions.

Currently, network security perimeter is in public preview for Azure Blob Storage, Azure Files (REST), Azure Tables, and Azure Queues. See [Transition to a network security perimeter](../../private-link/network-security-perimeter-transition.md). 

The list of services that have been onboarded to network security perimeter can be found [here](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources). 

For services that are not on this list, as they have not yet been onboarded to network security perimeter, if you would like to allow access you can use a subscription-based rule on the network security perimeter. All resources within that subscription will then be given access to that network security perimeter. For more information on adding subscription-based access rule, refer [here](/rest/api/networkmanager/nsp-access-rules/create-or-update).

> [!IMPORTANT]
> Private endpoint traffic is considered highly secure and therefore isn't subject to network security perimeter rules. All other traffic, including trusted services, will be subject to network security perimeter rules if the storage account is associated with a perimeter.

## Limitations

This preview doesn't support the following services, operations, and protocols on a storage account:

- [Object replication](../blobs/object-replication-overview.md) for Azure Blob Storage
- [Lifecycle management](../blobs/lifecycle-management-overview.md) for Azure Blob Storage
- [SSH File transfer protocol (SFTP)](../blobs/secure-file-transfer-protocol-support.md) over Azure Blob Storage
- Network file system (NFS) protocol with [Azure Blob Storage](../blobs/network-file-system-protocol-support.md) and [Azure Files](../files/files-nfs-protocol.md).
- Server message block (SMB) protocol with Azure Files can only be achieved through IP allowlisting at this time.
- [Azure Blob Inventory](../blobs/blob-inventory.md)
- [Unmanaged disks](/azure/virtual-machines/unmanaged-disks-deprecation) do not honor network security perimeter rules. 

- Vaulted backups for Azure Blob Storage

We recommend you don't enable network security perimeter if you need to use any of these services, operations, or protocols. This is to prevent any potential data loss or data exfiltration risk.

> [!WARNING]
> For storage accounts that are associated with a network security perimeter, in order for customer managed keys (CMK) scenarios to work, ensure that the Azure Key Vault is accessible from within the perimeter to which the storage account has been associated.

## Associate a network security perimeter with a storage account

To associate a network security perimeter with a storage account, follow these [common instructions](../../private-link/network-security-perimeter-concepts.md) for all PaaS resources.

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
