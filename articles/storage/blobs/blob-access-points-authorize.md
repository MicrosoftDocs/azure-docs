---
title: Authorize access to blob access points
titleSuffix: Azure Blob Storage
description: Learn which Azure roles and permissions you need to allow, create, manage, and read blob access points, and how Azure Storage handles data source credentials.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 11/06/2026
# Customer intent: As a security administrator, I want to know which permissions control blob access points, so that I can grant least-privilege access to administrators and readers.
---

# Authorize access to blob access points

Blob access points use two kinds of authorization:

- **Management operations** on blob access point configurations use Azure role-based access control (Azure RBAC) on the storage account.
- **Data operations** on a blob access point use the same authorization methods as any other container.

Separately, Azure Storage uses the data source credentials that you store in the configuration to read from your data source.

## Permission to allow blob access point creation

To allow or block blob access point creation on a storage account, you need permission to update the storage account (`Microsoft.Storage/storageAccounts/write`). The [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor), [Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor), and [Owner](/azure/role-based-access-control/built-in-roles/privileged#owner) roles include this permission.

## Permissions to manage configurations

The following actions control blob access point configurations.

| Action | Lets you |
|---|---|
| `Microsoft.Storage/storageAccounts/blobAccessPointConfigurations/read` | Get and list configurations |
| `Microsoft.Storage/storageAccounts/blobAccessPointConfigurations/write` | Create and update configurations |
| `Microsoft.Storage/storageAccounts/blobAccessPointConfigurations/delete` | Delete configurations |
| `Microsoft.Storage/storageAccounts/blobAccessPointConfigurations/testExistingConnection/action` | Test the connection to the data source |
| `Microsoft.Storage/storageAccounts/testBlobAccessPointConfigurationProposedConnection/action` | Test new connection settings before you apply them |

The following built-in roles include these actions:

- **[Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor)**. This role is enough to allow blob access point creation and to create and manage configurations, in the Azure portal or with the REST API.
- **[Contributor](/azure/role-based-access-control/built-in-roles/privileged#contributor)** and **[Owner](/azure/role-based-access-control/built-in-roles/privileged#owner)**. These roles also include the actions, but they grant broader access than you need.
- **Storage Blob Access Point Contributor (preview)**. This role lets you manage configurations, test connections, create blob access points, and read data. It doesn't include permission to update the storage account, so it can't allow or block blob access point creation.

To create a custom role, include `Microsoft.Storage/storageAccounts/read` and the `blobAccessPointConfigurations` and `testBlobAccessPointConfigurationProposedConnection` actions that you need. For more information, see [Azure custom roles](/azure/role-based-access-control/custom-roles).

## Permissions to create a blob access point

A blob access point is a container. To create it, you need permission to create a container in the storage account (`Microsoft.Storage/storageAccounts/blobServices/containers/write`):

- **In the Azure portal**, [Storage Account Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-account-contributor) is enough.
- **By using the REST API and Microsoft Entra ID**, use Storage Blob Access Point Contributor (preview) or [Storage Blob Data Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-contributor).

## Permissions to read data

Every authorization method that works for a container also works for a blob access point:

- **Microsoft Entra ID with Azure RBAC.** Assign [Storage Blob Data Reader](/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-reader), or a role with more permissions, to the user, group, or managed identity that reads the data. A new role assignment can take a few minutes to take effect. For steps, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md). To browse data in the Azure portal, users also need the Azure Resource Manager Reader role, or a role with more permissions, on the storage account. For more information, see [Choose how to authorize access to blob data in the Azure portal](authorize-data-operations-portal.md).
- **Shared Key.** If the storage account allows Shared Key authorization, callers can use the account access keys. For more information, see [Manage storage account access keys](../common/storage-account-keys-manage.md).
- **Shared access signatures (SAS).** You can use a user delegation SAS, a service SAS, or an account SAS. For more information, see [Grant limited access to data with shared access signatures (SAS)](../common/storage-sas-overview.md).

For the best security, use Microsoft Entra ID instead of Shared Key. For more information, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## How Azure Storage uses data source credentials

When you create a configuration, you provide an access key ID and a secret access key for your data source. Azure Storage uses these credentials to read from the data source on behalf of every caller that you authorize on the blob access point.

- The credentials are separate from your Azure identity. Azure RBAC controls who can read through the blob access point, and the credentials control what Azure Storage can read from the data source.
- After you save the secret access key, you can't retrieve it from Azure. To change any credential setting, enter the secret access key again.
- Use credentials that have read-only permissions on the bucket. Blob access points only read data, so they don't need write permissions.
- Rotate the credentials regularly. For steps, see [Update credentials](blob-access-points-manage.md#update-credentials).

## Govern blob access points with Azure Policy

No built-in Azure Policy definition exists for blob access points. To audit or block blob access point creation across your organization, create a custom policy definition that checks the `allowBlobAccessPoints` property of storage accounts. For more information, see [What is Azure Policy?](/azure/governance/policy/overview)

## Related content

- [Create a blob access point](blob-access-points-create.md)
- [Access data in a blob access point](blob-access-points-access-data.md)
- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)
