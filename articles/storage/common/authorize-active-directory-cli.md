---
title: Run Azure CLI commands with Azure AD credentials to access blob or queue data
titleSuffix: Azure Storage
description: Azure CLI support signing in with Azure AD credentials to run commands on Azure Storage blob and queues data. An access token is provided for the session and used to authorize calling operations. Permissions depend on the RBAC role assigned to the Azure AD security principal.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/30/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Run Azure CLI commands with Azure AD credentials to access blob or queue data

Azure Storage provides extensions for Azure CLI that enable you to sign in and run scripting commands with Azure Active Directory (Azure AD) credentials. When you sign in to Azure CLI with Azure AD credentials, an OAuth 2.0 access token is returned. That token is automatically used by Azure CLI to authorize subsequent data operations against Blob or Queue storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

You can assign permissions to blob and queue data to an Azure AD security principal via role-based access control (RBAC). For more information about RBAC roles in Azure Storage, see [Manage access rights to Azure Storage data with RBAC](storage-auth-aad-rbac.md).

## Supported operations

The Azure Storage extensions are supported for operations on blob and queue data. Which operations you may call depends on the permissions granted to the Azure AD security principal with which you sign in to Azure CLI. Permissions to Azure Storage containers or queues are assigned via RBAC. For example, if you are assigned the **Blob Data Reader** role, then you can run scripting commands that read data from a container or queue. If you are assigned the **Blob Data Contributor** role, then you can run scripting commands that read, write, or delete a container or queue or the data they contain.

For details about the permissions required for each Azure Storage operation on a container or queue, see [Call storage operations with OAuth tokens](/rest/api/storageservices/authorize-with-azure-active-directory#call-storage-operations-with-oauth-tokens).  

## Call Azure CLI commands using Azure AD credentials

Azure CLI supports the `--auth-mode` parameter for blob and queue data operations:

- Set the `--auth-mode` parameter to `login` to sign in using an Azure AD security principal.
- Set the `--auth-mode` parameter to the legacy `key` value to attempt to query for an account key if no authentication parameters for the account are provided.

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
        --sku Standard_LRS \
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

The environment variable associated with the `--auth-mode` parameter is `AZURE_STORAGE_AUTH_MODE`. You can specify the appropriate value in the environment variable to avoid including it on every call to an Azure Storage data operation.

## Next steps

- [Use Azure CLI to assign an RBAC role for access to blob and queue data](storage-auth-aad-rbac-cli.md)
- [Authorize access to blob and queue data with managed identities for Azure resources](storage-auth-aad-msi.md)
