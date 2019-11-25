---
title: Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources - Azure Storage
description: Azure Blob and Queue storage support authorizing access to resources with Azure Active Directory and managed identities for Azure resources. You can use managed identities for Azure resources to authorize access to blobs and queues from applications running in Azure virtual machines, function apps, virtual machine scale sets, and others.  
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/17/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources

Azure Blob and Queue storage support Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to blob and queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.  

This article shows how to authorize access to blob or queue data from an Azure VM using managed identities for Azure Resources. It also describes how to test your code in the development environment.

## Enable managed identities on a VM

Before you can use managed identities for Azure Resources to authorize access to blobs and queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](https://docs.microsoft.com/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

## Authenticate with the Azure Identity library (preview)

The Azure Identity client library for .NET (preview) authenticates a security principal. When your code is running in Azure, the security principal is a managed identity for Azure resources.

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. Microsoft Visual Studio supports single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

Other development tools may prompt you to login via a web browser. You can also use a service principal to authenticate from the development environment. For more information, see [Create identity for Azure app in portal](../../active-directory/develop/howto-create-service-principal-portal.md).

After authenticating, the Azure Identity client library gets a token credential. This token credential is then encapsulated in the service client object that you create to perform operations against Azure Storage. The library handles this for you seamlessly by getting the appropriate token credential.

For more information about the Azure Identity client library, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity).

## Assign RBAC roles for access to data

When an Azure AD security principal attempts to access blob or queue data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an RBAC role that grants access to blob or queue data in Azure Storage. For information about assigning permissions via RBAC, see the section titled **Assign RBAC roles for access rights** in [Authorize access to Azure blobs and queues using Azure Active Directory](../common/storage-auth-aad.md#assign-rbac-roles-for-access-rights).

## Install the preview packages

The examples in this article use the latest preview version of the Azure Storage client library for Blob storage. To install the preview package, run the following command from the NuGet package manager console:

```powershell
Install-Package Azure.Storage.Blobs -IncludePrerelease
```

The examples in this article also use the latest preview version of the [Azure Identity client library for .NET](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials. To install the preview package, run the following command from the NuGet package manager console:

```powershell
Install-Package Azure.Identity -IncludePrerelease
```

## .NET code example: Create a block blob

Add the following `using` directives to your code to use the preview versions of the Azure Identity and Azure Storage client libraries.

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Storage;
using Azure.Storage.Sas;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
```

To get a token credential that your code can use to authorize requests to Azure Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. The following code example shows how to get the authenticated token credential and use it to create a service client object, then use the service client to upload a new blob:

```csharp
async static Task CreateBlockBlobAsync(string accountName, string containerName, string blobName)
{
    // Construct the blob container endpoint from the arguments.
    string containerEndpoint = string.Format("https://{0}.blob.core.windows.net/{1}",
                                                accountName,
                                                containerName);

    // Get a credential and create a client object for the blob container.
    BlobContainerClient containerClient = new BlobContainerClient(new Uri(containerEndpoint),
                                                                    new DefaultAzureCredential());

    try
    {
        // Create the container if it does not exist.
        await containerClient.CreateIfNotExistsAsync();

        // Upload text to a new block blob.
        string blobContents = "This is a block blob.";
        byte[] byteArray = Encoding.ASCII.GetBytes(blobContents);

        using (MemoryStream stream = new MemoryStream(byteArray))
        {
            await containerClient.UploadBlobAsync(blobName, stream);
        }
    }
    catch (StorageRequestFailedException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
}
```

> [!NOTE]
> To authorize requests against blob or queue data with Azure AD, you must use HTTPS for those requests.

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn how to authorize access to containers and queues from within your storage applications, see [Use Azure AD with storage applications](storage-auth-aad-app.md).
- To learn how to run Azure CLI and PowerShell commands with Azure AD credentials, see [Run Azure CLI or PowerShell commands with Azure AD credentials to access blob or queue data](storage-auth-aad-script.md).
