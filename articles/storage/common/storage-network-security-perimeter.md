---
title: Network Security Perimeter for Azure Storage
description: Network security perimeter enables you to define a logical network isolation boundary for PaaS resources that are deployed outside your virtual networks. 
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 07/27/2025
ms.author: normesta

---

# Network security perimeter for Azure Storage

[Network security perimeter](../../private-link/network-security-perimeter-concepts.md) allows organizations to define a logical network isolation boundary for PaaS resources (for example, Azure Blob Storage and SQL Database) that are deployed outside their virtual networks. The feature restricts public network access to PaaS resources outside the perimeter. However, you can exempt access by using explicit access rules for public inbound and outbound traffic. This helps prevent unwanted data exfiltration from your storage resources. Within a network security perimeter, member resources can freely communicate with each other. Network security perimeter rules override the storage account’s own firewall settings. Access from within the perimeter takes highest precedence over other network restrictions.

You can find the list of services that are onboarded to the network security perimeter [here](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources). If a service isn't listed, it is not onboarded yet. To allow access to a specific resource from a non-onboarded service, you can create a subscription-based rule for the network security perimeter. A subscription-based rule grants access to all resources within that subscription. For details on how to add a subscription-based access rule, see [this documentation](/rest/api/network-security-perimeter/network-security-perimeter-access-rules/create-or-update).

## Access Modes

When onboarding storage accounts to a network security perimeter, you can start in Transition mode (formerly Learning mode) or go straight to [Enforced mode](../../private-link/network-security-perimeter-transition.md#access-mode-configuration-point-on-resource-associations). Transition mode (the default) allows the storage account to fall back to its existing firewall rules or ["trusted services"](../../storage/common/storage-network-security.md#exceptions-for-trusted-azure-services) settings if a perimeter rule doesn’t yet permit a connection. Enforced mode strictly blocks all public inbound and outbound traffic unless explicitly allowed by a network security perimeter rule, ensuring maximum protection for your storage account. In enforced mode, even Azure’s "trusted service" exceptions aren't honored. Relevant Azure resources or specific subscriptions must be explicitly allowed via perimeter rules if needed.

> [!IMPORTANT]
> Operating Storage accounts in **Transition (formerly Learning)** mode should serve only as a transitional step. Malicious actors may exploit unsecured resources to exfiltrate data. Therefore, it's crucial to transition to a fully secure configuration as soon as possible with the access mode set to **Enforced**.
>

## Network priority
When a storage account is part of a network security perimeter, the relevant [profile's](../../private-link/network-security-perimeter-concepts.md#components-of-a-network-security-perimeter) access rules override the account’s own firewall settings, becoming the top-level network gatekeeper. Access allowed or denied by the perimeter takes precedence, and the account’s "Allowed networks" settings are bypassed when the storage account is associated in enforced mode. Removing the storage account from a network security perimeter reverts control back to its regular firewall. Network security perimeters don't affect private endpoint traffic. Connections via private link always succeed. For internal Azure services ("trusted services"), only services explicitly [onboarded to network security perimeter](../../private-link/network-security-perimeter-concepts.md#onboarded-private-link-resources) can be allowed through perimeter access rules. Otherwise, their traffic is blocked by default, even if trusted on the storage account firewall rules. For services not yet onboarded, alternatives include subscription-level rules for inbound and Fully Qualified Domain Names (FQDN) for outbound access or via private links.

> [!IMPORTANT]
> Private endpoint traffic is considered highly secure and therefore isn't subject to network security perimeter rules. All other traffic, including trusted services, is subject to network security perimeter rules if the storage account is associated with a perimeter.

## Feature coverage under network security perimeter
When a storage account is associated with a network security perimeter, all standard data-plane operations for blobs, files, tables, and queues are supported unless specified under the known [limitations](#limitations). All HTTPS-based operations for Azure Blob Storage, Azure Data Lake Storage Gen2, Azure Files, Azure Table Storage, and Azure Queue Storage can be restricted using network security perimeter. 

## Limitations

| Feature | Support status| Recommendations |
|----------|----------|----------|
| [Object replication](../blobs/object-replication-overview.md) for Azure Blob Storage | Not Supported. Object Replication between storage accounts fails if either the source or destination account is associated with a network security perimeter | Don't configure network security perimeter on storage accounts that need object replication. Similarly, don't enable object replication on accounts associated with network security perimeter until support is available. If object replication is already enabled, you cannot associate a network security perimeter. Similarly, if a network security perimeter is already associated, you cannot enable object replication. This restriction prevents you from configuring an unsupported scenario. |
| Network file system (NFS) access over [Azure Blobs](../blobs/network-file-system-protocol-support.md) and [Azure Files](../files/files-nfs-protocol.md), Server message block (SMB) access over Azure Files and [SSH File transfer protocol (SFTP)](../blobs/secure-file-transfer-protocol-support.md) over Azure Blobs | All protocols other than HTTPS based access are blocked when storage account is associated with a network security perimeter | If you need to use any of these protocols to access your storage account, don't associate the account with a network security perimeter |
| Azure Backup | Not supported. Azure Backup as a service is not onboarded to network security perimeter yet. | We recommend not associating an account with network security perimeter if you have backups enabled or if you plan to use Azure Backup. Once Azure Backup onboards to network security perimeter, you can start using both these features together |
| Unmanaged disks | [Unmanaged disks](/azure/virtual-machines/unmanaged-disks-deprecation) don't honor network security perimeter rules. | Avoid using unmanaged disks on storage accounts protected by network security perimeter |
| [Static Website](../blobs/storage-blob-static-website.md)| Not supported | Static website, being open in nature cannot be used with network security perimeter. If static website is already enabled, you cannot associate a network security perimeter. Similarly, if a network security perimeter is already associated, you cannot enable static website. This restriction prevents you from configuring an unsupported scenario. |


> [!WARNING]
> For storage accounts that are associated with a network security perimeter, in order for customer managed keys (CMK) scenarios to work, ensure that the Azure Key Vault is accessible from within the perimeter to which the storage account is associated.

## Associate a network security perimeter with a storage account

To associate a network security perimeter with a storage account, follow these [common instructions](../../private-link/network-security-perimeter-transition.md#moving-new-resources-into-network-security-perimeter) for all PaaS resources.

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
- Enable [Diagnostic logs for Network Security Perimeter](/azure/private-link/network-security-perimeter-diagnostic-logs?source=recommendations).
