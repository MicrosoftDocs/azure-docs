---
title: Authorize access to blob data with Azure CLI
titleSuffix: Azure Storage
description: Specify how to authorize data operations against blob data with the Azure CLI. You can authorize data operations using Azure AD credentials, with the account access key, or with a shared access signature (SAS) token.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 07/12/2021
ms.author: akashdubey
ms.reviewer: nachakra
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Choose how to authorize access to blob data with Azure CLI

Azure Storage provides extensions for Azure CLI that enable you to specify how you want to authorize operations on blob data. You can authorize data operations in the following ways:

- With an Azure Active Directory (Azure AD) security principal. Microsoft recommends using Azure AD credentials for superior security and ease of use.
- With the account access key or a shared access signature (SAS) token.

## Specify how data operations are authorized

Azure CLI commands for reading and writing blob data include the optional `--auth-mode` parameter. Specify this parameter to indicate how a data operation is to be authorized:

- Set the `--auth-mode` parameter to `login` to sign in using an Azure AD security principal (recommended).
- Set the `--auth-mode` parameter to the legacy `key` value to attempt to retrieve the account access key to use for authorization. If you omit the `--auth-mode` parameter, then the Azure CLI also attempts to retrieve the access key.

To use the `--auth-mode` parameter, make sure that you have installed Azure CLI version 2.0.46 or later. Run `az --version` to check your installed version.

> [!NOTE]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is not permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users who do not already possess the account keys must use Azure AD credentials to access blob data.

> [!IMPORTANT]
> If you omit the `--auth-mode` parameter or set it to `key`, then the Azure CLI attempts to use the account access key for authorization. In this case, Microsoft recommends that you provide the access key either on the command or in the **AZURE_STORAGE_KEY** environment variable. For more information about environment variables, see the section titled [Set environment variables for authorization parameters](#set-environment-variables-for-authorization-parameters).
>
> If you do not provide the access key, then the Azure CLI attempts to call the Azure Storage resource provider to retrieve it for each operation. Performing many data operations that require a call to the resource provider may result in throttling. For more information about resource provider limits, see [Scalability and performance targets for the Azure Storage resource provider](../common/scalability-targets-resource-provider.md).

## Authorize with Azure AD credentials

When you sign in to Azure CLI with Azure AD credentials, an OAuth 2.0 access token is returned. That token is automatically used by Azure CLI to authorize subsequent data operations against Blob or Queue storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

You can assign permissions to blob data to an Azure AD security principal via Azure role-based access control (Azure RBAC). For more information about Azure roles in Azure Storage, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

### Permissions for calling data operations

The Azure Storage extensions are supported for operations on blob data. Which operations you may call depends on the permissions granted to the Azure AD security principal with which you sign in to Azure CLI. Permissions to Azure Storage containers are assigned via Azure RBAC. For example, if you are assigned the **Storage Blob Data Reader** role, then you can run scripting commands that read data from a container. If you are assigned the **Storage Blob Data Contributor** role, then you can run scripting commands that read, write, or delete a container or the data it contains.

For details about the permissions required for each Azure Storage operation on a container, see [Call storage operations with OAuth tokens](/rest/api/storageservices/authorize-with-azure-active-directory#call-storage-operations-with-oauth-tokens).

### Example: Authorize an operation to create a container with Azure AD credentials

The following example shows how to create a container from Azure CLI using your Azure AD credentials. To create the container, you'll need to sign in to the Azure CLI, and you'll need a resource group and a storage account. To learn how to create these resources, see [Quickstart: Create, download, and list blobs with Azure CLI](../blobs/storage-quickstart-blobs-cli.md).

1. Before you create the container, assign the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) role to yourself. Even though you are the account owner, you need explicit permissions to perform data operations against the storage account. For more information about assigning Azure roles, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

    > [!IMPORTANT]
    > Azure role assignments may take a few minutes to propagate.

1. Call the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command with the `--auth-mode` parameter set to `login` to create the container using your Azure AD credentials. Remember to replace placeholder values in angle brackets with your own values:

    ```azurecli
    az storage container create \
        --account-name <storage-account> \
        --name sample-container \
        --auth-mode login
    ```

## Authorize with the account access key

If you possess the account key, you can call any Azure Storage data operation. In general, using the account key is less secure. If the account key is compromised, all data in your account may be compromised.

The following example shows how to create a container using the account access key. Specify the account key, and provide the `--auth-mode` parameter with the `key` value:

```azurecli
az storage container create \
    --account-name <storage-account> \
    --name sample-container \
    --account-key <key>
    --auth-mode key
```

> [!IMPORTANT]
> When a storage account is locked with an Azure Resource Manager **ReadOnly** lock, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is not permitted for that storage account. **List Keys** is a POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. For this reason, when the account is locked with a **ReadOnly** lock, users must access data with Azure AD credentials.

## Authorize with a SAS token

If you possess a SAS token, you can call data operations that are permitted by the SAS. The following example shows how to create a container using a SAS token:

```azurecli
az storage container create \
    --account-name <storage-account> \
    --name sample-container \
    --sas-token <token>
```

## Set environment variables for authorization parameters

You can specify authorization parameters in environment variables to avoid including them on every call to an Azure Storage data operation. The following table describes the available environment variables.

| Environment variable | Description |
|---|---|
| AZURE_STORAGE_ACCOUNT | The storage account name. This variable should be used in conjunction with either the storage account key or a SAS token. If neither are present, the Azure CLI attempts to retrieve the storage account access key by using the authenticated Azure AD account. If a large number of commands are executed at one time, the Azure Storage resource provider throttling limit may be reached. For more information about resource provider limits, see [Scalability and performance targets for the Azure Storage resource provider](../common/scalability-targets-resource-provider.md). |
| AZURE_STORAGE_KEY | The storage account key. This variable must be used in conjunction with the storage account name. |
| AZURE_STORAGE_CONNECTION_STRING | A connection string that includes the storage account key or a SAS token. This variable must be used in conjunction with the storage account name. |
| AZURE_STORAGE_SAS_TOKEN | A shared access signature (SAS) token. This variable must be used in conjunction with the storage account name. |
| AZURE_STORAGE_AUTH_MODE | The authorization mode with which to run the command. Permitted values are `login` (recommended) or `key`. If you specify `login`, the Azure CLI uses your Azure AD credentials to authorize the data operation. If you specify the legacy `key` mode, the Azure CLI attempts to query for the account access key and to authorize the command with the key. |

## Next steps

- [Assign an Azure role for access to blob data](assign-azure-role-data-access.md)
- [Authorize access to data in Azure Storage](../common/authorize-data-access.md)