---
title: Authorize access to blob or queue data with Azure CLI
titleSuffix: Azure Storage
description: Azure CLI supports signing in with Azure AD credentials to run commands on Azure Storage blob and queue data. An access token is provided for the session and used to authorize calling operations. Permissions depend on the RBAC role assigned to the Azure AD security principal.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/26/2020
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorize access to blob or queue data with Azure CLI

Azure Storage provides extensions for Azure CLI that enable you to specify how you want to authorize operations on blob or queue data. You can authorize data operations in the following ways:

- By specifying Azure Active Directory (Azure AD) credentials (recommended).
- By specifying the account access key or a shared access signature (SAS) token.

## Specify how data operations are authorized

Azure CLI commands for reading and writing blob and queue data include the optional `--auth-mode` parameter. Specify this parameter to indicate how a data operation is to be authorized:

- Set the `--auth-mode` parameter to `login` to sign in using an Azure AD security principal.
- Set the `--auth-mode` parameter to the legacy `key` value to attempt to query for an account key if no authentication parameters for the account are provided.

## Call Azure CLI commands using Azure AD credentials

When you sign in to Azure CLI with Azure AD credentials, an OAuth 2.0 access token is returned. That token is automatically used by Azure CLI to authorize subsequent data operations against Blob or Queue storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

You can assign permissions to blob and queue data to an Azure AD security principal via role-based access control (RBAC). For more information about RBAC roles in Azure Storage, see [Manage access rights to Azure Storage data with RBAC](storage-auth-aad-rbac.md).

### Supported operations

The Azure Storage extensions are supported for operations on blob and queue data. Which operations you may call depends on the permissions granted to the Azure AD security principal with which you sign in to Azure CLI. Permissions to Azure Storage containers or queues are assigned via RBAC. For example, if you are assigned the **Blob Data Reader** role, then you can run scripting commands that read data from a container or queue. If you are assigned the **Blob Data Contributor** role, then you can run scripting commands that read, write, or delete a container or queue or the data they contain.

For details about the permissions required for each Azure Storage operation on a container or queue, see [Call storage operations with OAuth tokens](/rest/api/storageservices/authorize-with-azure-active-directory#call-storage-operations-with-oauth-tokens).  

### Example: Authorize with Azure AD

The following example shows how to create a container in a new storage account from Azure CLI using your Azure AD credentials. Remember to replace placeholder values in angle brackets with your own values:

1. Make sure that you have installed Azure CLI version 2.0.46 or later. Run `az --version` to check your installed version.

1. Run `az login` and authenticate in the browser window:

    ```azurecli
    az login
    ```

1. Specify your desired subscription. Create a resource group using [az group create](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create). Create a storage account within that resource group using [az storage account create](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create):

    ```azurecli
    az account set --subscription <subscription-id>

    az group create \
        --name sample-resource-group-cli \
        --location eastus

    az storage account create \
        --name <storage-account> \
        --resource-group sample-resource-group-cli \
        --location eastus \
        --sku Standard_ZRS \
        --encryption-services blob
    ```

1. Before you create the container, assign the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) role to yourself. Even though you are the account owner, you need explicit permissions to perform data operations against the storage account. For more information about assigning RBAC roles, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac.md).

    > [!IMPORTANT]
    > RBAC role assignments may take a few minutes to propagate.

1. Call the [az storage container create](https://docs.microsoft.com/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-create) command with the `--auth-mode` parameter set to `login` to create the container using your Azure AD credentials:

    ```azurecli
    az storage container create \
        --account-name <storage-account> \
        --name sample-container \
        --auth-mode login
    ```

## Call Azure CLI commands using the account access key



## Set environment variables for authorization parameters

The environment variable associated with the `--auth-mode` parameter is `AZURE_STORAGE_AUTH_MODE`. You can specify the appropriate value in the environment variable to avoid including it on every call to an Azure Storage data operation.

## Next steps

- [Use Azure CLI to assign an RBAC role for access to blob and queue data](storage-auth-aad-rbac-cli.md)
- [Authorize access to blob and queue data with managed identities for Azure resources](storage-auth-aad-msi.md)
