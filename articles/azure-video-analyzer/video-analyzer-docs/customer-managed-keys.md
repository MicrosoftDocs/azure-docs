---
title: Customer managed keys
description: You can use a customer managed key (that is, bring your own key) with Azure Video Analyzer.
author: anilmur
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
---

# Customer managed keys with Azure Video Analyzer

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Bring Your Own Key (BYOK) is an Azure wide initiative to help customers move their workloads to the cloud. Customer managed keys allow customers to adhere to industry compliance regulations and improves tenant isolation of a service. Giving customers control of encryption keys is a way to minimize unnecessary access and control and build confidence in Microsoft services.

## Keys and key management

An account key is created for all Video Analyzer accounts. By default this account key is encrypted by a system key owned by Video Analyzer (i.e. system-managed key). Instead, you can use your own key with Azure Video Analyzer. In that case, your account key is encrypted with your key. Access policies and video resource metadata get encrypted using the account key.

Video Analyzer uses a User Assigned Managed Identity to read your key from a Key Vault owned by you. You must provide the User Assigned Managed Identity when creating or updating the Video Analyzer account and assign appropriate [Azure role-based access control](../../role-based-access-control/overview.md) to the Key Vault. Video Analyzer requires that the Key Vault is in the same region as the account, and that it has soft-delete and purge protection enabled.

Your key can be a 2048, 3072, or a 4096 RSA key, and both HSM and software keys are supported.

> [!NOTE]
> EC keys are not supported.

You can specify a key name and key version, or just a key name. When you use only a key name, Video Analyzer will use the latest key version. New versions of customer keys are automatically detected, and the account key is re-encrypted.

> [!WARNING]
> Video Analyzer monitors access to the customer key. If the customer key becomes inaccessible (for example, the key has been deleted or the Key Vault has been deleted or the access grant has been removed), Video Analyzer will transition the account to the Customer Key Inaccessible State (effectively disabling the account). You can either delete the account, or restore the account key to resume access.

## Double encryption

Video Analyzer protects your sensitive data using double encryption as per Azure standard practice - see [Azure double encryption](../../security/fundamentals/double-encryption.md). For data at rest, the first layer of encryption uses a customer managed key or a Microsoft managed key depending on the `encryption` setting on the account. The second layer of encryption for data at rest is provided automatically using a separate Microsoft managed key.

> [!NOTE]
> Double encryption is enabled automatically on the Video Analyzer account. However, you need to configure the customer managed key and double encryption on your storage account separately. See [Storage encryption](../../storage/common/storage-service-encryption.md).


## Next steps

Review [Managed identity](managed-identity.md)
