---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with the Azure CLI (preview) - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using the Azure CLI.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/16/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with the Azure CLI (preview)

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with Azure CLI (preview).

To use the Azure CLI to secure a SAS with Azure AD credentials, first make sure that you have installed the latest version of Azure CLI. For more information about installing the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Sign in with Azure AD credentials

First, sign in to the Azure CLI with your Azure AD credentials. For more information, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

## Get a user delegation SAS for a container

To create a user delegation SAS for a container with Azure CLI, call the [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas) command. Specify *login* for the `--auth-mode` parameter so that requests made to Azure Storage are authorized with your Azure AD credentials. Specify the `--as-user` parameter to indicate that the SAS returned should be a user delegation SAS. Finally, specify an expiry value for the user delegation SAS that is within 7 days of the current time.

Supported permissions for a user delegation SAS on a container include Add, Create, Delete, List, Read, and Write. Permissions can be combined. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas).

The following example returns a user delegation SAS token for a container. When creating a user delegation SAS, the `--auth-mode login` and `--as-user parameters` are required. The optional `--full-uri` parameter returns the full blob URI with the SAS token appended. Permissions can be specified singly or combined. Remember to replace the placeholder values in brackets with your own values:

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

## Get a user delegation SAS for a blob

To create a user delegation SAS for a blob with Azure CLI, call the [az storage blob generate-sas](/cli/azure/storage/blob#az-storage-blob-generate-sas) command. Specify *login* for the `--auth-mode` parameter so that requests made to Azure Storage are authorized with your Azure AD credentials. Specify the `--as-user` parameter to indicate that the SAS returned should be a user delegation SAS. Finally, specify an expiry value for the user delegation SAS that is within 7 days of the current time.

Supported permissions for a user delegation SAS on a blob include Add, Create, Delete, Read, and Write. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas).

The following syntax returns a user delegation SAS for a blob. When creating a user delegation SAS, the `--auth-mode login` and `--as-user parameters` are required. The optional `--full-uri` parameter returns the full blob URI with the SAS token appended. Permissions can be specified singly or combined. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage blob generate-sas \
    --account-name <storage-account> \
    --container-name <container> \
    --name <blob> \
    --permissions acdrw \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
    --full-uri
```

The user delegation SAS returned will be similar to:

```
https://storagesamples.blob.core.windows.net/sample-container/blob1.txt?se=2019-08-03&sp=rw&sv=2018-11-09&sr=b&skoid=<skoid>&sktid=<sktid>&skt=2019-08-02T2
2%3A32%3A01Z&ske=2019-08-03T00%3A00%3A00Z&sks=b&skv=2018-11-09&sig=<signature>
```

> [!NOTE]
> A user delegation SAS does not support defining permissions with a stored access policy.

## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas)
