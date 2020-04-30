---
title: Authorize access to data with a managed identity
titleSuffix: Azure Storage
description: Learn how to use managed identities for Azure resources to authorize access to blob and queue data from applications running in Azure virtual machines, function apps, virtual machine scale sets, and others.  
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/04/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorize access to blob and queue data with managed identities for Azure resources

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

## Authenticate with the Azure Identity library

The Azure Identity client library provides Azure Azure AD token authentication support for the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, and JavaScript integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Azure Storage requests.

An advantage of the Azure Identity client library is that it enables you to use the same code to authenticate whether your application is running in the development environment or in Azure. The Azure Identity client library for .NET authenticates a security principal. When your code is running in Azure, the security principal is a managed identity for Azure resources. In the development environment, the managed identity does not exist, so the client library authenticates either the user or a service principal for testing purposes.

After authenticating, the Azure Identity client library gets a token credential. This token credential is then encapsulated in the service client object that you create to perform operations against Azure Storage. The library handles this for you seamlessly by getting the appropriate token credential.

For more information about the Azure Identity client library for .NET, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity). For reference documentation for the Azure Identity client library, see [Azure.Identity Namespace](/dotnet/api/azure.identity).

### Assign role-based access control (RBAC) roles for access to data

When an Azure AD security principal attempts to access blob or queue data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an RBAC role that grants access to blob or queue data in Azure Storage. For information about assigning permissions via RBAC, see the section titled **Assign RBAC roles for access rights** in [Authorize access to Azure blobs and queues using Azure Active Directory](../common/storage-auth-aad.md#assign-rbac-roles-for-access-rights).

### Authenticate the user in the development environment

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. For example, Microsoft Visual Studio supports single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

Other development tools may prompt you to login via a web browser.

### Authenticate a service principal in the development environment

If your development environment does not support single sign-on or login via a web browser, then you can use a service principal to authenticate from the development environment.

#### Create the service principal

To create a service principal with Azure CLI and assign an RBAC role, call the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command. Provide an Azure Storage data access role to assign to the new service principal. Additionally, provide the scope for the role assignment. For more information about the built-in roles provided for Azure Storage, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

If you do not have sufficient permissions to assign a role to the service principal, you may need to ask the account owner or administrator to perform the role assignment.

The following example uses the Azure CLI to create a new service principal and assign the **Storage Blob Data Reader** role to it with account scope

```azurecli-interactive
az ad sp create-for-rbac \
    --name <service-principal> \
    --role "Storage Blob Data Reader" \
    --scopes /subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

The `az ad sp create-for-rbac` command returns a list of service principal properties in JSON format. Copy these values so that you can use them to create the necessary environment variables in the next step.

```json
{
    "appId": "generated-app-ID",
    "displayName": "service-principal-name",
    "name": "http://service-principal-uri",
    "password": "generated-password",
    "tenant": "tenant-ID"
}
```

> [!IMPORTANT]
> RBAC role assignments may take a few minutes to propagate.

#### Set environment variables

The Azure Identity client library reads values from three environment variables at runtime to authenticate the service principal. The following table describes the value to set for each environment variable.

|Environment variable|Value
|-|-
|`AZURE_CLIENT_ID`|The app ID for the service principal
|`AZURE_TENANT_ID`|The service principal's Azure AD tenant ID
|`AZURE_CLIENT_SECRET`|The password generated for the service principal

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you are using Visual Studio or another development environment, you may need to restart the development environment in order for it to register the new environment variables.

For more information, see [Create identity for Azure app in portal](../../active-directory/develop/howto-create-service-principal-portal.md).

[!INCLUDE [storage-install-packages-blob-and-identity-include](../../../includes/storage-install-packages-blob-and-identity-include.md)]

## .NET code example: Create a block blob

Add the following `using` directives to your code to use the Azure Identity and Azure Storage client libraries.

```csharp
using Azure;
using Azure.Identity;
using Azure.Storage.Blobs;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
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
    catch (RequestFailedException e)
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

- [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- [Use Azure AD with storage applications](storage-auth-aad-app.md).
- [Run Azure CLI or PowerShell commands with Azure AD credentials to access blob or queue data](authorize-active-directory-powershell.md).
