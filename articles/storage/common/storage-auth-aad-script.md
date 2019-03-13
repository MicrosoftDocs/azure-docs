---
title: Run Azure CLI or PowerShell commands under an Azure AD identity to access Azure Storage | Microsoft Docs
description: Azure CLI and PowerShell support logging in with an Azure AD identity to run commands on Azure Storage containers and queues and their data. An access token is provided for the session and used to authorize calling operations. Permissions depend on the role assigned to the Azure AD identity.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/12/2019
ms.author: tamram
ms.subservice: common
---

# Use an Azure AD identity to access Azure Storage with CLI or PowerShell

Azure Storage provides extensions for Azure CLI and PowerShell that enable you to log in and run scripting commands under an Azure Active Directory (Azure AD) identity. The Azure AD identity can be a user, group, or application service principal, or it can be a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). You can assign permissions to access storage resources to the Azure AD identity via role-based access control (RBAC). For more information about RBAC roles in Azure Storage, see [Manage access rights to Azure Storage data with RBAC (Preview)](storage-auth-aad-rbac.md).

When you log in to Azure CLI or PowerShell with an Azure AD identity, an access token is returned for accessing Azure Storage under that identity. That token is then automatically used by CLI or PowerShell to authorize operations against Azure Storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

[!INCLUDE [storage-auth-aad-note-include](../../../includes/storage-auth-aad-note-include.md)]

## Supported operations

The extensions are supported for operations on containers and queues. Which operations you may call depends on the permissions granted to the Azure AD identity with which you log in to Azure CLI or PowerShell. Permissions to Azure Storage containers or queues are assigned via role-based access control (RBAC). For example, if a Data Reader role is assigned to the identity, then you can run scripting commands that read data from a container or queue. If a Data Contributor role is assigned to the identity, then you can run scripting commands that read, write, or delete a container or queue or the data they contain. 

For details about the permissions required for each Azure Storage operation on a container or queue, see [Permissions for calling REST operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-rest-operations).  

## Call CLI commands with an Azure AD identity

To install the extension for Azure CLI, make sure that you have installed Azure CLI version 2.0.46 or later. Run `az --version` to check your installed version.

Azure CLI supports the `--auth-mode` parameter for data operations against Azure Storage:

- Set the `--auth-mode` parameter to `login` to sign in using an Azure AD security principal.
- Set the `--auth-mode` parameter to the legacy `key` value to attempt to query for an account key if no authentication parameters for the account are provided. 

The following example shows how to create a container in a new storage account from Azure CLI using your Azure AD credentials.

1. First, run `az login` and authenticate in the browser window: 

    ```azurecli
    az login
    ```
    
1. Next, set your subscription, then create a resource group and a storage account within that resource group. Make sure to replace placeholder values in angle brackets with your own values: 

    ```azurecli
    az account set --subscription <subscription-id>
    az group create \
        --name sample-resource-group \
        --location eastus
    az storage account create \
        --name <storage-account> \
        --resource-group sample-resource-group \
        --location eastus \
        --sku Standard_LRS \
        --encryption-services blob
    ```
    
1. Before you create the container, assign RBAC permissions to the new storage account for yourself. Assign these two roles:

    - Owner
    - Storage Blob Data Contributor (preview)

    For more information about assigning RBAC roles, see [Grant access to Azure containers and queues with RBAC in the Azure portal (preview)](storage-auth-aad-rbac.md).
    
1. Call the [az storage container create](https://docs.microsoft.com/cli/azure/storage/container?view=azure-cli-latest#az-storage-container-create) command with the `--auth-mode` parameter set to `login` to create the container using your Azure AD credentials:

    ```azurecli
    az storage container create \ 
        --account-name <storage-account> \ 
        --name sample-container \
        --auth-mode login
    ```

The environment variable associated with the `--auth-mode` parameter is `AZURE_STORAGE_AUTH_MODE`. You can specify the appropriate value in the environment variable to avoid including it on every call to an Azure Storage operation.

## Call PowerShell commands with an Azure AD identity

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To use Azure PowerShell to sign in with an Azure AD identity:

1. Uninstall any previous installations of Azure PowerShell:

    - Remove any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.
    - Remove all **Azure*** modules from `%Program Files%\WindowsPowerShell\Modules`.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:
 
    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```
1. Close and reopen the PowerShell window after installing PowerShellGet. 

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az –Repository PSGallery –AllowClobber
    ```

1. Install the latest Azure Storage module:
   
   ```powershell
   Install-Module Az.Storage -Repository PSGallery -AllowClobber -Force
   ```
1. Close and reopen the PowerShell window.
1. Call the [New-AzStorageContext](https://docs.microsoft.com/powershell/module/az.storage/new-azstoragecontext) cmdlet to create a context, and include the `-UseConnectedAccount` parameter. 
1. To call a cmdlet with an Azure AD identity, pass the newly created context to the cmdlet.

The following example shows how to list the blobs in a container from Azure PowerShell using an Azure AD identity. Be sure to replace the placeholder account and container names with your own values: 

```powershell
$ctx = New-AzStorageContext -StorageAccountName storagesamples -UseConnectedAccount 
Get-AzStorageBlob -Container sample-container -Context $ctx 
```

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md).
- To learn about using managed identities for Azure resources with Azure Storage, see [Authenticate access to blobs and queues with Azure managed identities for Azure Resources (Preview)](storage-auth-aad-msi.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- For additional information about Azure AD integration for Azure Blobs and Queues, see the Azure Storage team blog post, [Announcing the Preview of Azure AD Authentication for Azure Storage](https://azure.microsoft.com/blog/announcing-the-preview-of-aad-authentication-for-storage/).
