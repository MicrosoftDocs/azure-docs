---
title: Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview) | Microsoft Docs
description: Authenticate with Azure AD from an Azure VM Managed Service Identity (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Authenticate with Azure AD from an Azure Managed Service Identity (Preview)

Azure Storage supports Azure Active Directory (Azure AD) authentication with [Managed Service Identity](../../active-directory/managed-service-identity/overview.md). Managed Service Identity (MSI) provides an automatically managed identity in Azure Active Directory (Azure AD). You can use MSI to authenticate to Azure Storage from applications running in Azure virtual machines, function apps, virtual machine scale sets, and others. By using MSI and leveraging the power of Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

To grant permissions to a managed service identity for storage containers or queues, you assign an RBAC role encompassing storage permissions to the MSI. For more information about RBAC roles in storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md). 

> [!IMPORTANT]
> This preview is intended for non-production use only. Production service-level agreements (SLAs) will not be available until Azure AD integration for Azure Storage is declared generally available. If Azure AD integration is not yet supported for your scenario, continue to use Shared Key authorization or SAS tokens in your applications. For additional information about the preview, see [Authenticate access to Azure Storage using Azure Active Directory (Preview)](storage-auth-aad.md).
>
> During the preview, RBAC role assignments may take up to five minutes to propagate.

This article shows how to authenticate to Azure Storage with MSI from an Azure VM.  

## Enable MSI on the VM

Before you can use MSI to authenticate to Azure Storage from your VM, you must first enable MSI on the VM. To learn how to enable MSI, see one of these articles:

- [Azure Portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm)
- [Azure PowerShell](../../active-directory/managed-service-identity/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-service-identity/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager Template](../../active-directory/managed-service-identity/qs-configure-template-windows-vm.md)
- [Azure SDKs](../../active-directory/managed-service-identity/qs-configure-sdk-windows-vm.md)

## Get an MSI access token

To authenticate with MSI, your application or script must acquire an MSI access token. To learn about how to acquire an access token, see [How to use an Azure VM Managed Service Identity (MSI) for token acquisition](../../active-directory/managed-service-identity/how-to-use-vm-token.md).

## .NET code example: Create a block blob

The code example assumes that you have an MSI access token. The access token is used to authorize the managed service identity to create a block blob.

### Add references and using statements  

In Visual Studio, install the preview version of the Azure Storage client library. From the **Tools** menu, select **Nuget Package Manager**, then **Package Manager Console**. Type the following command into the console:

```
Install-Package https://www.nuget.org/packages/WindowsAzure.Storage/9.2.0  
```

Add the following using statements to your code:

```dotnet
using Microsoft.WindowsAzure.Storage.Auth;
```

### Create credentials from the MSI access token

To create the block blob, use the **TokenCredentials** class provided by the preview package. Construct a new instance of **TokenCredentials**, passing in the MSI access token that you obtained previously:

```dotnet
// Create storage credentials from your MSI access token.
TokenCredential tokenCredential = new TokenCredential(msiAccessToken);
StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

// Create a block blob using the credentials.
CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://storagesamples.blob.core.windows.net/sample-container/Blob1.txt"), storageCredentials);
``` 

> [!NOTE]
> Azure AD integration with Azure Storage requires that you use HTTPS for Azure Storage operations.

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- To learn how to log into Azure CLI and PowerShell with an Azure AD identity, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell (Preview)](storage-auth-aad-script.md).
- For additional information about Azure AD integration for Azure Blobs and Queues, see the Azure Storage team blog post, [Announcing the Preview of Azure AD Authentication for Azure Storage](https://azure.microsoft.com/blog/announcing-the-preview-of-aad-authentication-for-storage/).
