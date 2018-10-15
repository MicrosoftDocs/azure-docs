---
title: Run Azure CLI or PowerShell commands under an Azure AD identity to access Azure Storage (Preview) | Microsoft Docs
description: Azure CLI and PowerShell support logging in with an Azure AD identity to run commands on Azure Storage containers and queues and their data. An access token is provided for the session and used to authorize calling operations. Permissions depend on the role assigned to the Azure AD identity.
services: storage
author: tamram
ms.service: storage
ms.topic: article
ms.date: 09/20/2018
ms.author: tamram
ms.component: common
---

# Use an Azure AD identity to access Azure Storage with CLI or PowerShell (Preview)

Azure Storage provides preview extensions for Azure CLI and PowerShell that enable you to log in and run scripting commands under an Azure Active Directory (Azure AD) identity. The Azure AD identity can be a user, group, or application service principal, or it can be a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). You can assign permissions to access storage resources to the Azure AD identity via role-based access control (RBAC). For more information about RBAC roles in Azure Storage, see [Manage access rights to Azure Storage data with RBAC (Preview)](storage-auth-aad-rbac.md).

When you log in to Azure CLI or PowerShell with an Azure AD identity, an access token is returned for accessing Azure Storage under that identity. That token is then automatically used by CLI or PowerShell to authorize operations against Azure Storage. For supported operations, you no longer need to pass an account key or SAS token with the command.

[!INCLUDE [storage-auth-aad-note-include](../../../includes/storage-auth-aad-note-include.md)]

## Supported operations

The preview extensions are supported for operations on containers and queues. Which operations you may call depends on the permissions granted to the Azure AD identity with which you log in to Azure CLI or PowerShell. Permissions to Azure Storage containers or queues are assigned via role-based access control (RBAC). For example, if a Data Reader role is assigned to the identity, then you can run scripting commands that read data from a container or queue. If a Data Contributer role is assigned to the identity, then you can run scripting commands that read, write, or delete a container or queue or the data they contain. 

For details about the permissions required for each Azure Storage operation on a container or queue, see [Permissions for calling REST operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-rest-operations).  

## Call CLI commands with an Azure AD identity

To install the preview extension for Azure CLI:

1. Make sure that you have installed Azure CLI version 2.0.32 or later. Run `az --version` to check your installed version.
2. Run the following command to install the preview extension: 

    ```azurecli
    az extension add -n storage-preview
    ```

The preview extension adds a new `--auth-mode` parameter to supported commands:

- Set the `--auth-mode` parameter to `login` to sign in using an Azure AD identity.
- Set the `--auth-mode` parameter to the legacy `key` value to attempt to query for an account key if no authentication parameters for the account are provided. 

For example, to download a blob in Azure CLI using an Azure AD identity, first run `az login`, then call the command with `--auth-mode` set to `login`:

```azurecli
az login
az storage blob download --account-name storagesamples --container sample-container --name myblob.txt --file myfile.txt --auth-mode login 
```

The environment variable associated with the `--auth-mode` parameter is `AZURE_STORAGE_AUTH_MODE`.

## Call PowerShell commands with an Azure AD identity

Azure PowerShell supports signing in with an Azure AD identity with one of the following preview modules only: 

- 4.4.0-preview 
- 4.4.1-preview 

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
    Install-Module AzureRM –Repository PSGallery –AllowClobber
    ```

1. Install one of the Azure Storage preview modules that supports Azure AD:

    ```powershell
    Install-Module Azure.Storage –Repository PSGallery -RequiredVersion 4.4.1-preview  –AllowPrerelease –AllowClobber –Force 
    ```
1. Close and reopen the PowerShell window.
1. Call the [New-AzureStorageContext](https://docs.microsoft.com/powershell/module/azure.storage/new-azurestoragecontext) cmdlet to create a context, and include the `-UseConnectedAccount` parameter. 
1. To call a cmdlet with an Azure AD identity, pass the newly created context to the cmdlet.

The following example shows how to list the blobs in a container from Azure PowerShell using an Azure AD identity. Be sure to replace the placeholder account and container names with your own values: 

```powershell
$ctx = New-AzureStorageContext -StorageAccountName storagesamples -UseConnectedAccount 
Get-AzureStorageBlob -Container sample-container -Context $ctx 
```

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md).
- To learn about using managed identities for Azure resources with Azure Storage, see [Authenticate access to blobs and queues with Azure managed identities for Azure Resources (Preview)](storage-auth-aad-msi.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- For additional information about Azure AD integration for Azure Blobs and Queues, see the Azure Storage team blog post, [Announcing the Preview of Azure AD Authentication for Azure Storage](https://azure.microsoft.com/blog/announcing-the-preview-of-aad-authentication-for-storage/).
