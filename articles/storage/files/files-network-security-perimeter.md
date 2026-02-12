---
title: Network Security Perimeter for Azure Files
description: Network security perimeter enables you to define a logical network isolation boundary for Azure file shares and other PaaS resources that are deployed outside your virtual networks. 
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/11/2026
ms.author: kendownie
# Customer intent: "As a network admin, I want to improve network security by defining a logical network isolation boundary for Azure file shares and other PaaS resources that are deployed outside my organization's virtual networks."
---

# Use network security perimeter for Azure Files

[Network security perimeter](/azure/private-link/network-security-perimeter-concepts) allows organizations to define a logical network isolation boundary for PaaS resources such as Azure Files that are deployed outside their virtual networks. This feature restricts public network access to PaaS resources outside the perimeter. However, you can exempt access by using explicit access rules for public inbound and outbound traffic. This helps prevent unwanted data exfiltration from your storage resources. Within a network security perimeter, member resources can freely communicate with each other. Network security perimeter rules override the storage account's own firewall settings. Access from within the perimeter takes highest precedence over other network restrictions.

You can find the list of services that are onboarded to the network security perimeter [here](/azure/private-link/network-security-perimeter-concepts#onboarded-private-link-resources). If a service isn't listed, it isn't onboarded yet. To allow access to a specific resource from a non-onboarded service, you can create a subscription-based rule for the network security perimeter. A subscription-based rule grants access to all resources within that subscription. For details on how to add a subscription-based access rule, see [this documentation](/rest/api/network-security-perimeter/network-security-perimeter-access-rules/create-or-update).

## Access modes

When onboarding storage accounts to a network security perimeter, you can either start in **Transition** mode (formerly Learning mode) or go straight to **Enforced** mode. Transition mode (the default access mode) allows the storage account to fall back to its existing firewall rules or [trusted services](/azure/storage/common/storage-network-security#exceptions-for-trusted-azure-services) settings if a perimeter rule doesn't yet permit a connection. Enforced mode strictly blocks all public inbound and outbound traffic unless explicitly allowed by a network security perimeter rule, ensuring maximum protection for your storage account. In Enforced mode, Azure's trusted service exceptions aren't honored. Relevant Azure resources or specific subscriptions must be explicitly allowed via perimeter rules. For more information, see [Transition to a network security perimeter in Azure](/azure/private-link/network-security-perimeter-transition#access-mode-configuration-point-on-resource-associations).

> [!IMPORTANT]
> Operating storage accounts in **Transition** mode should serve only as a transitional step. Malicious actors might exploit unsecured resources to exfiltrate data. Therefore, it's crucial to transition to a fully secure configuration as soon as possible with the access mode set to **Enforced**.

## Network priority

When a storage account is part of a network security perimeter, the relevant profile's access rules override the account's own firewall settings, becoming the top-level network gatekeeper. Access allowed or denied by the perimeter takes precedence, and the storage account's **Allowed networks** settings are bypassed when the storage account is associated in enforced mode. Removing the storage account from a network security perimeter reverts control back to its regular firewall. Network security perimeters don't affect private endpoint traffic. Connections via private link always succeed. For internal Azure services (trusted services), only services explicitly onboarded to network security perimeter are allowed through perimeter access rules. Otherwise, their traffic is blocked by default, even if trusted on the storage account firewall rules. For services not yet onboarded, alternatives include subscription-level rules for inbound and Fully Qualified Domain Names (FQDN) for outbound access or via private links.

> [!IMPORTANT]
> Private endpoint traffic is considered highly secure and therefore isn't subject to network security perimeter rules. All other traffic, including trusted services, is subject to network security perimeter rules if the storage account is associated with a perimeter.

## Feature coverage under network security perimeter

When a storage account is associated with a network security perimeter, all standard data-plane operations for blobs, files, tables, and queues are supported unless specified under the known [limitations](/azure/storage/common/storage-network-security-perimeter#limitations). You can restrict HTTPS-based operations for Azure Files, Azure Blob Storage, Azure Data Lake Storage Gen2, Azure Table Storage, and Azure Queue Storage using network security perimeter.

The following tables describe network security perimeter and protocol support for Azure Files only. If you're looking for feature coverage for Azure Blob Storage and other Azure storage services, see [this article](/azure/storage/common/storage-network-security-perimeter#feature-coverage-under-network-security-perimeter).

The following table describes support for inbound network security perimeter enforcement for Azure Files.

| **Feature** | **Support status** | **Recommendations** |
|---|---|---|
| **Private Link** | Supported across all protocols (REST, SMB, NFS) | Private Link rules take precedence over network security perimeter. Inbound Private Link traffic will always be accepted, regardless of network security perimeter configuration. |
| **Azure Files REST with OAuth** | Supported | Full support |
| **Azure Files REST with Shared Key or SAS auth** | Only supports inbound IP rules | Shared Key and SAS aren't OAuth-based protocols, so they can't carry information about source perimeter or subscription. Therefore, inbound perimeter and subscription rules won't be honored. IP rules are supported (up to 200 rules). |
| **Azure Files SMB with NTLM or Kerberos** | Only supports inbound IP rules | NTLM or Kerberos are not OAuth-based protocols, so they can't carry information about source perimeter or subscription. Therefore, inbound perimeter and subscription rules won't be honored. IP rules are supported (up to 200 rules). |
| **Azure Files NFS** | All inbound traffic denied | All inbound traffic except Private Link will be denied if you place your storage account in a network security perimeter in Enforced mode. Outbound traffic for customer managed keys (CMK) is supported. |

The following table describes integration support for network security perimeter for Azure Files.

| **Feature** | **Support status** | **Recommendations** |
|---|---|---|
| [**Customer-Managed Keys**](/azure/storage/common/customer-managed-keys-overview) | Supported across all protocols (REST, SMB, NFS) | If you place the Key Vault hosting the CMK in a network security perimeter, you should place the storage account in the same perimeter, or otherwise configure the network security perimeter profile of the Key Vault to allow the storage account to communicate with it. |
| **Azure Backup** | Not supported. Azure Backup isn't yet onboarded to network security perimeter | Avoid using network security perimeter for storage accounts using Azure Backup until onboarding is complete. |
| **Azure File Sync** | Not fully supported. Azure File Sync isn't yet onboarded to network security perimeter. | To connect a Storage Sync Service resource to your storage account, you must first [configure the Storage Sync Service to use Managed Identities](../file-sync/file-sync-managed-identities.md). Then, configure a network security perimeter inbound profile rule to allowlist the subscription of the Storage Sync Service. Storage Sync Services can't be associated with perimeters. |

> [!WARNING]
> For storage accounts that are associated with a network security perimeter, in order for customer managed keys (CMK) scenarios to work, ensure that the Azure Key Vault is accessible from within the perimeter to which the storage account is associated.

## Associate a network security perimeter with a storage account

To associate a network security perimeter with a storage account, follow these [common instructions](/azure/private-link/network-security-perimeter-transition) for all PaaS resources.

## Next steps

- Learn more about [Azure network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).
- Enable [Diagnostic logs for network security perimeter](/azure/private-link/network-security-perimeter-diagnostic-logs?source=recommendations).
