---
title: Security FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files security.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 02/21/2023
ms.custom: references_regions
---
# Security FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files security.

## Can the network traffic between the Azure VM and the storage be encrypted?

Azure NetApp Files data traffic is inherently secure by design, as it doesn't provide a public endpoint, and data traffic stays within customer-owned VNet. Data-in-flight isn't encrypted by default. However, data traffic from an Azure VM (running an NFS or SMB client) to Azure NetApp Files is as secure as any other Azure-VM-to-VM traffic. 

NFSv3 protocol doesn't provide support for encryption, so this data-in-flight can't be encrypted. However, NFSv4.1 and SMB3 data-in-flight encryption can optionally be enabled. Data traffic between NFSv4.1 clients and Azure NetApp Files volumes can be encrypted using Kerberos with AES-256 encryption. See [Configure NFSv4.1 Kerberos encryption for Azure NetApp Files](configure-kerberos-encryption.md) for details. Data traffic between SMB3 clients and Azure NetApp Files volumes can be encrypted using the AES-CCM algorithm on SMB 3.0, and the AES-GCM algorithm on SMB 3.1.1 connections. See [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md) for details. 

## Can the storage be encrypted at rest?

All Azure NetApp Files volumes are encrypted using the FIPS 140-2 standard. Learn [how encryption keys managed](#how-are-encryption-keys-managed).

## Is Azure NetApp Files cross-region replication traffic encrypted?

Azure NetApp Files cross-region replication uses TLS 1.2 AES-256 GCM encryption to encrypt all data transferred between the source volume and destination volume. This encryption is in addition to the [Azure MACSec encryption](../security/fundamentals/encryption-overview.md) that is on by default for all Azure traffic, including Azure NetApp Files cross-region replication. 

## How are encryption keys managed? 

By default key management for Azure NetApp Files is handled by the service, using [platform-managed keys](../security/fundamentals/key-management.md). A unique XTS-AES-256 data encryption key is generated for each volume. An encryption key hierarchy is used to encrypt and protect all volume keys. These encryption keys are never displayed or reported in an unencrypted format. When you delete a volume, Azure NetApp Files immediately deletes the volume's encryption keys.

Alternatively, [customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md) can be used where keys are stored in [Azure Key Vault](../key-vault/general/basic-concepts.md). With customer-managed keys, you can fully manage the relationship between a key's life cycle, key usage permissions, and auditing operations on keys.

Lastly, customer-managed keys using Azure Dedicated HSM is supported on a controlled basis. Support is currently available in the East US, South Central US, West US 2, and US Gov Virginia regions. You can request access at [anffeedback@microsoft.com](mailto:anffeedback@microsoft.com). As capacity becomes available, requests will be approved.

## Can I configure the NFS export policy rules to control access to the Azure NetApp Files service mount target?

Yes, you can configure up to five rules in a single NFS export policy.

## Can I use Azure role-based access control (RBAC) with Azure NetApp Files?

Yes, Azure NetApp Files supports Azure RBAC features. Along with the built-in Azure roles, you can [create custom roles](../role-based-access-control/custom-roles.md) for Azure NetApp Files. 

For the complete list of Azure NetApp Files permissions, see Azure resource provider operations for [`Microsoft.NetApp`](../role-based-access-control/resource-provider-operations.md#microsoftnetapp).

## Are Azure Activity Logs supported on Azure NetApp Files?

Azure NetApp Files is an Azure native service. All PUT, POST, and DELETE APIs against Azure NetApp Files are logged. For example, the logs show activities such as who created the snapshot, who modified the volume, and so on.

For the complete list of API operations, see [Azure NetApp Files REST API](/rest/api/netapp/).

## Can I use Azure policies with Azure NetApp Files?

Yes, you can create [custom Azure policies](../governance/policy/tutorials/create-custom-policy-definition.md). 

However, you can't create Azure policies (custom naming policies) on the Azure NetApp Files interface. See [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md#considerations).

## When I delete an Azure NetApp Files volume, is the data deleted safely? 

Deletion of an Azure NetApp Files volume is performed programmatically with immediate effect. The delete operation includes deleting keys used for encrypting data at rest. There is no option for any scenario to recover a deleted volume once the delete operation is executed successfully (via interfaces such as the Azure portal and the API.)

## How are the Active Directory Connector credentials stored on the Azure NetApp Files service?

The AD Connector credentials are stored in the Azure NetApp Files control plane database in an encrypted format. The encryption algorithm used is AES-256 (one-way).

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)