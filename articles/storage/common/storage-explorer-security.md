---
title: Azure Storage Explorer security guide
description: Security guidance for Azure Storage Explorer
services: storage
author: cralvord
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: best-practice
ms.date: 07/30/2020
ms.author: cralvord
---

# Azure Storage Explorer security guide

Microsoft Azure Storage Explorer enables you to easily work with Azure Storage data safely and securely on Windows, macOS, and Linux. By following these guidelines, you can ensure your data stays protected.

## General

- **Always use the latest version of Storage Explorer.** Storage Explorer releases may contain security updates. Staying up to date helps ensure general security.
- **Only connect to resources you trust.** Data that you download from untrusted sources could be malicious, and uploading data to an untrusted source may result in lost or stolen data.
- **Use HTTPS whenever possible.** Storage Explorer uses HTTPS by default. Some scenarios allow you to use HTTP, but HTTP should be used only as a last resort.
- **Ensure only the needed permissions are given to the people who need them.** Avoid being overly permissive when granting anyone access to your resources.
- **Use caution when executing critical operations.** Certain operations, such as delete and overwrite, are irreversible and may cause data loss. Make sure you're working with the correct resources before executing these operations.

## Choosing the right authentication method

Storage Explorer provides various ways to access your Azure Storage resources. Whatever method you choose, here are our recommendations.

<a name='azure-ad-authentication'></a>

### Microsoft Entra authentication

The easiest and most secure way to access your Azure Storage resources is to sign in with your Azure account. Signing in uses Microsoft Entra authentication, which allows you to:

- Give access to specific users and groups.
- Revoke access to specific users and groups at any time.
- Enforce access conditions, such as requiring multi-factor authentication.

We recommend using Microsoft Entra authentication whenever possible.

This section describes the two Microsoft Entra ID-based technologies that can be used to secure your storage resources.

#### Azure role-based access control (Azure RBAC)

[Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) give you fine-grained access control over your Azure resources. Azure roles and permissions can be managed from the Azure portal.

Storage Explorer supports Azure RBAC access to Storage Accounts, Blobs, and Queues. If you need access to File Shares or Tables, you'll need to assign Azure roles that grant permission to list storage account keys.

#### Access control lists (ACLs)

[Access control lists (ACLs)](../blobs/data-lake-storage-access-control.md) let you control file and folder level access in ADLS Gen2 blob containers. You can manage your ACLs using Storage Explorer.

### Shared access signatures (SAS)

If you can't use Microsoft Entra authentication, we recommend using shared access signatures. With shared access signatures, you can:

- Provide anonymous limited access to secure resources.
- Revoke a SAS immediately if generated from a shared access policy (SAP).

However, with shared access signatures, you can't:

- Restrict who can use a SAS. A valid SAS can be used by anyone who has it.
- Revoke a SAS if not generated from a shared access policy (SAP).

When using SAS in Storage Explorer, we recommend the following guidelines:

- **Limit the distribution of SAS tokens and URIs.** Only distribute SAS tokens and URIs to trusted individuals. Limiting SAS distribution reduces the chance a SAS could be misused.
- **Only use SAS tokens and URIs from entities you trust.**
- **Use shared access policies (SAP) when generating SAS tokens and URIs if possible.** A SAS based on a shared access policy is more secure than a bare SAS, because the SAS can be revoked by deleting the SAP.
- **Generate tokens with minimal resource access and permissions.** Minimal permissions limit the potential damage that could be done if a SAS is misused.
- **Generate tokens that are only valid for as long as necessary.** A short lifespan is especially important for bare SAS, because there's no way to revoke them once generated.

> [!IMPORTANT]
> When sharing SAS tokens and URIs for troubleshooting purposes, such as in service requests or bug reports, always redact at least the signature portion of the SAS.

### Storage account keys

Storage account keys grant unrestricted access to the services and resources within a storage account. For this reason, we recommend limiting the use of keys to access resources in Storage Explorer. Use Azure RBAC features or SAS to provide access instead.

Some Azure roles grant permission to retrieve storage account keys. Individuals with these roles can effectively circumvent permissions granted or denied by Azure RBAC. We recommend not granting this permission unless it's necessary.

Storage Explorer will attempt to use storage account keys, if available, to authenticate requests. You can disable this feature in Settings (**Services > Storage Accounts > Disable Usage of Keys**). Some features don't support Azure RBAC, such as working with Classic storage accounts. Such features still require keys and are not affected by this setting.

If you must use keys to access your storage resources, we recommend the following guidelines:

- **Don't share your account keys with anyone.**
- **Treat your storage account keys like passwords.** If you must make your keys accessible, use secure storage solutions such as [Azure Key Vault](https://azure.microsoft.com/services/key-vault/).

> [!NOTE]
> If you believe a storage account key has been shared or distributed by mistake, you can generate new keys for your storage account from the Azure portal.

### anonymous access to blob containers

Storage Explorer allows you to modify the access level of your Azure Blob Storage containers. Non-private blob containers allow anyone anonymous read access to data in those containers.

When enabling anonymous access for a blob container, we recommend the following guidelines:

- **Don't enable anonymous access to a blob container that may contain any potentially sensitive data.** Make sure your blob container is free of all private data.
- **Don't upload any potentially sensitive data to a blob container with Blob or Container access.**

## Next steps

- [Security recommendations](../blobs/security-recommendations.md)
