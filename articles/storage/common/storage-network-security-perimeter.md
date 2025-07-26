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

[Network security perimeter](../../private-link/network-security-perimeter-concepts.md) (preview) allows organizations to define a logical network isolation boundary for PaaS resources (for example, Azure Blob Storage and SQL Database) that are deployed outside their virtual networks. The feature restricts public network access to PaaS resources outside the perimeter. However, you can exempt access by using explicit access rules for public inbound and outbound traffic. This helps prevent unwanted data exfiltration from your storage resources. Within a Network Security Perimeter, member resources can freely communicate with each other. network security perimeter rules override the storage account’s own firewall settings. Access from within the perimeter takes highest precedence over other network restrictions.

The list of services that have been onboarded to network security perimeter can be found [here](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources). For services that are not on this list, as they have not yet been onboarded to network security perimeter, if you would like to allow access to a specific resource you can use a subscription-based rule on the network security perimeter. All resources within that subscription will then be given access to that network security perimeter. For more information on adding subscription-based access rule, refer [here](/rest/api/networkmanager/nsp-access-rules/create-or-update).

## Access Modes

When onboarding storage accounts to a network security perimeter, you can start in Transition mode (formerly Learning mode) or go straight to [Enforced mode](../../private-link/network-security-perimeter-transition.md#access-mode-configuration-point-on-resource-associations). Transition mode (the default) allows the storage account to fall back to its existing firewall rules or [“trusted services”](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security?tabs=azure-portal#exceptions-for-trusted-azure-services) settings if a perimeter rule doesn’t yet permit a connection. Enforced mode strictly blocks all public inbound and outbound traffic unless explicitly allowed by a network security perimeter rule, ensuring maximum protection for your storage account. In enforced mode, even Azure’s “trusted service” exceptions are not honored. Relevant Azure resources or specific subscriptions must be explicitly allowed via perimeter rules if needed.

> [!IMPORTANT]
> Operating Storage accounts in **Transition (formerly Learning)** mode should serve only as a transitional step. Malicious actors may exploit unsecured resources to exfiltrate data. Therefore, it's crucial to transition to a fully secure configuration as soon as possible with the access mode set to **Enforced**.
>

////
Currently, network security perimeter is in public preview for Azure Blob Storage, Azure Files (REST), Azure Tables, and Azure Queues. See [Transition to a network security perimeter](../../private-link/network-security-perimeter-transition.md). 
////

## Network priotiy
When a storage account is part of a network security perimeter, the relevant [profile's](../../private-link/network-security-perimeter-concepts#components-of-a-network-security-perimeter) access rules override the account’s own firewall settings, becoming the top-level network gatekeeper. Access allowed or denied by the perimeter takes precedence, and the account’s “Allowed networks” settings are bypassed when the storage account is associated in enforced mode. Removing the storage account from a network security perimeter reverts control back to its regular firewall. Network security perimeters do not affect private endpoint traffic. Connections via private link always succeed. For internal Azure services (“trusted Services”), only those explicitly [onboarded to Network Security Perimeter](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources) can be allowed through perimeter access rules. Otherwise, their traffic is blocked by default, even if trusted on the storage account firewall rules. For services not yet onboarded, alternatives include subscription-level rules for inbound and FQDNs for outbount access or via private links.

> [!IMPORTANT]
> Private endpoint traffic is considered highly secure and therefore isn't subject to network security perimeter rules. All other traffic, including trusted services, will be subject to network security perimeter rules if the storage account is associated with a perimeter.

## Feature coverage under network security perimeter
When a storage account is associated with a network security perimeter, all standard data-plane operations for blobs, files, tables, and queues are supported as long as they don’t fall under the known [limitations](#limitations). All HTTPS-based operations for Azure Blob Storage, Azure Data Lake Storage Gen2, Azure Files (via REST API or SDK), Azure Table Storage, and Azure Queue Storage are supported with network security perimeter enforcement, allowing you to restrict access by network. Access and data transfer via NFS for Azure Blobs and Azure Files, and via SMB for Azure files are not natively covered by network security perimeter and will be blocked when a storage account is associated with a perimeter. 

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
