---
title: Create a shared access signature (SAS) using Azure Active Directory credentials with Azure CLI (preview) - Azure Storage
description: Learn how to create a shared access signature (SAS) using Azure Active Directory credentials in Azure Storage using Azure CLI.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 07/16/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a shared access signature (SAS) for a container or blob using Azure Active Directory credentials with Azure CLI (preview)

A shared access signature (SAS) enables you to grant limited access to containers and blobs in your storage account. When you create a SAS, you specify its constraints, including which object or objects a client is allowed to access, what permissions they have on those objects, and how long the SAS is valid. This article shows how to use Azure Active Directory (Azure AD) credentials to create a SAS for a container or blob with Azure CLI (preview).

To use the Azure CLI to secure a SAS with Azure AD credentials, first make sure that you have installed the latest version of Azure CLI. For more information about installing the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Get a user delegation SAS for a container

To create a user delegation SAS for a container with Azure CLI, call the [az storage container generate-sas](/cli/azure/storage/container#az-storage-container-generate-sas) command. Specify *login* for the `--auth-mode` parameter so that requests made to Azure Storage are authorized with your Azure AD credentials. Specify the `--as-user` parameter to indicate that the SAS returned should be a user delegation SAS. Finally, specify an expiry value for the user delegation SAS that is within 7 days of the current time.

Supported permissions for a user delegation SAS on a container include Add, Create, Delete, List, Read, and Write. Permissions can be combined. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas).

The following example returns a user delegation SAS token for a container. The **az storage container generate-sas** command returns the SAS token, which you can then append to the container resource URI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage container generate-sas \
    --account-name <storage-account> \
    --name sample-container \
    --permissions a|c|d|l|r|w \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
```

The user delegation SAS token returned is similar to the token shown in following example:

`se=2019-07-27&sp=r&sv=2018-11-09&sr=c&skoid=<skoid>&sktid=<sktid>&skt=2019-07-26T18%3A01%3A22Z&ske=2019-07-27T00%3A00%3A00Z&sks=b&skv=2018-11-09&sig=<signature>`

## Get a user delegation SAS for a blob

To create a user delegation SAS for a blob with Azure CLI, call the [az storage blob generate-sas](/cli/azure/storage/blob#az-storage-blob-generate-sas) command. Specify *login* for the `--auth-mode` parameter so that requests made to Azure Storage are authorized with your Azure AD credentials. Specify the `--as-user` parameter to indicate that the SAS returned should be a user delegation SAS. Finally, specify an expiry value for the user delegation SAS that is within 7 days of the current time.

Supported permissions for a user delegation SAS on a blob include Add, Create, Delete, Read, and Write. For more information about these permissions, see [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas).

The following example returns a user delegation SAS token for a blob. The **az storage blob generate-sas** command returns the SAS token, which you can then append to the blob resource URI. Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage blob generate-sas \
    --account-name <storage-account> \
    --container-name sample-container \
    --name blob1.txt \
    --permissions a|c|d|r|w \
    --expiry <date-time> \
    --auth-mode login \
    --as-user
```

> [!NOTE]
> A user delegation SAS does not support defining permissions with a stored access policy.

## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Delegating Access with a Shared Access Signature](/rest/api/storageservices/delegating-access-with-a-shared-access-signature)
