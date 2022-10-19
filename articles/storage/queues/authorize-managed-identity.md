---
title: Authorize access to queue data with a managed identity
titleSuffix: Azure Storage
description: Use managed identities for Azure resources to authorize queue data access from applications running in Azure VMs, function apps, and others.
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: how-to
ms.date: 10/11/2021
ms.author: jammart
ms.reviewer: santoshc
ms.subservice: common
ms.custom: devx-track-csharp
---

# Authorize access to queue data with managed identities for Azure resources

Azure Queue Storage supports Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.

This article shows how to authorize access to queue data from an Azure VM using managed identities for Azure Resources.

## Enable managed identities on a VM

Before you can use managed identities for Azure Resources to authorize access to queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

## Assign an RBAC role to a managed identity

When an Azure AD security principal attempts to access data in an Azure Storage account, that security principal must have permissions to the data resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to data in Azure Storage. For information about assigning permissions for data access via Azure RBAC, see [Assign an Azure role for access to queue data](assign-azure-role-data-access.md).

> [!NOTE]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or queue.

## Use a managed identity to create a queue in .NET

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Azure Active Directory (Azure AD) via the [Azure SDK](https://github.com/Azure/azure-sdk). When you use the Azure Identity client library to get an access token, you can use the same code to acquire the token whether your application is running in the development environment or in Azure. For more information, see [Use the Azure Identity library to get an access token for authorization](../common/identity-library-acquire-token.md).

To get a token that your code can use to authorize requests to Azure Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. You can then use the token to create a service client object that is authorized to perform data operations in Azure Storage. For more information about using the **DefaultAzureCredential** class to authorize a managed identity to access Azure Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

The following code example shows how to get the authenticated token credential and use it to create a service client object, then use the service client to create a queue:

```csharp
public static void CreateQueue(string accountName, string queueName)
{
    // Construct the blob container endpoint from the arguments.
    string queueEndpoint = $"https://{accountName}.queue.core.windows.net/{queueName}";

    // Get a token credential and create a service client object for the queue.
    QueueClient queueClient = new QueueClient(
        new Uri(queueEndpoint), 
        new DefaultAzureCredential());

    try
    {
        // Create the queue.
        queueClient.CreateIfNotExists();
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine("Exception: {0}", e.Message);
    }
}
```

> [!NOTE]
> To authorize requests against queue data with Azure AD, you must use HTTPS for those requests.

## Next steps

- [Assign an Azure role for access to queue data](assign-azure-role-data-access.md)
- [Authorize access to blob or queue data from a native or web application](../common/storage-auth-aad-app.md)
