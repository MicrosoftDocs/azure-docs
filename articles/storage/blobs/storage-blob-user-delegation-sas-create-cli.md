---
title: Use Azure CLI to create a user delegation SAS for a container or blob
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS with Azure Active Directory credentials by using Azure CLI.
services: storage
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 12/18/2019
ms.author: akashdubey
ms.reviewer: dineshm
ms.custom: devx-track-azurecli
---

# Create a user delegation SAS for a container or blob with the Azure CLI

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Azure Active Directory (Azure AD) credentials to create a user delegation SAS for a container or blob with the Azure CLI.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Install the latest version of the Azure CLI

To use the Azure CLI to secure a SAS with Azure AD credentials, first make sure that you have installed the latest version of Azure CLI. For more information about installing the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

To create a user delegation SAS using the Azure CLI, make sure that you have installed version 2.0.78 or later. To check your installed version, use the `az --version` command.

## Sign in with Azure AD credentials

Sign in to the Azure CLI with your Azure AD credentials. For more information, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

## Assign permissions with Azure RBAC

To create a user delegation SAS from Azure PowerShell, the Azure AD account used to sign into Azure CLI must be assigned a role that includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. This permission enables that Azure AD account to request the *user delegation key*. The user delegation key is used to sign the user delegation SAS. The role providing the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action must be assigned at the level of the storage account, the resource group, or the subscription.

If you do not have sufficient permissions to assign Azure roles to an Azure AD security principal, you may need to ask the account owner or administrator to assign the necessary permissions.

The following example assigns the **Storage Blob Data Contributor** role, which includes the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. The role is scoped at the level of the storage account.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <email> \
    --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

For more information about the built-in roles that include the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

## Use Azure AD credentials to secure a SAS

When you create a user delegation SAS with the Azure CLI, the user delegation key that is used to sign the SAS is created for you implicitly. The start time and expiry time that you specify for the SAS are also used as the start time and expiry time for the user delegation key.

Because the maximum interval over which the user delegation key is valid is 7 days from the start date, you should specify an expiry time for the SAS that is within 7 days of the start time. The SAS is invalid after the user delegation key expires, so a SAS with an expiry time of greater than 7 days will still only be valid for 7 days.

When creating a user delegation SAS, the `--auth-mode login` and `--as-user parameters` are required. Specify *login* for the `--auth-mode` parameter so that requests made to Azure Storage are authorized with your Azure AD credentials. Specify the `--as-user` parameter to indicate that the SAS returned should be a user delegation SAS.

### Create a user delegation SAS for a container

To create a user delegation SAS for a container with the Azure CLI, call the [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas) command.

Supported permissions for a user delegation SAS on a container include Add, Create, Delete, List, Read, and Write. Permissions can be specified singly or combined. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

The following example returns a user delegation SAS token for a container. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container generate-sas \
    --account-name <storage-account> \
    --name <container> \
    --permissions acdlrw \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
```

The user delegation SAS token returned will be similar to:

```
se=2019-07-27&sp=r&sv=2018-11-09&sr=c&skoid=<skoid>&sktid=<sktid>&skt=2019-07-26T18%3A01%3A22Z&ske=2019-07-27T00%3A00%3A00Z&sks=b&skv=2018-11-09&sig=<signature>
```

> [!NOTE]
> The SAS token returned by Blob Storage does not include the delimiter character ('?') for the URL query string. If you are appending the SAS token to a resource URL, remember to also append the delimiter character.

### Create a user delegation SAS for a blob

To create a user delegation SAS for a blob with the Azure CLI, call the [az storage blob generate-sas](/cli/azure/storage/blob#az-storage-blob-generate-sas) command.

Supported permissions for a user delegation SAS on a blob include Add, Create, Delete, Read, and Write. Permissions can be specified singly or combined. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas).

The following syntax returns a user delegation SAS for a blob. The example specifies the `--full-uri` parameter, which returns the blob URI with the SAS token appended. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage blob generate-sas \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --permissions acdrw \
    --expiry <date-time> \
    --auth-mode login \
    --as-user \
    --full-uri
```

The user delegation SAS URI returned will be similar to:

```
https://storagesamples.blob.core.windows.net/sample-container/blob1.txt?se=2019-08-03&sp=rw&sv=2018-11-09&sr=b&skoid=<skoid>&sktid=<sktid>&skt=2019-08-02T2
2%3A32%3A01Z&ske=2019-08-03T00%3A00%3A00Z&sks=b&skv=2018-11-09&sig=<signature>
```

> [!NOTE]
> The SAS token returned by Azure CLI does not include the delimiter character ('?') for the URL query string. If you are appending the SAS token to a resource URL, remember to append the delimiter character to the resource URL before appending the SAS token.
>
> A user delegation SAS does not support defining permissions with a stored access policy.

## Revoke a user delegation SAS

To revoke a user delegation SAS from the Azure CLI, call the [az storage account revoke-delegation-keys](/cli/azure/storage/account#az-storage-account-revoke-delegation-keys) command. This command revokes all of the user delegation keys associated with the specified storage account. Any shared access signatures associated with those keys are invalidated.

Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az storage account revoke-delegation-keys \
    --name <storage-account> \
    --resource-group <resource-group>
```

> [!IMPORTANT]
> Both the user delegation key and Azure role assignments are cached by Azure Storage, so there may be a delay between when you initiate the process of revocation and when an existing user delegation SAS becomes invalid.

## Next steps

- [Create a user delegation SAS (REST API)](/rest/api/storageservices/create-user-delegation-sas)
- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
