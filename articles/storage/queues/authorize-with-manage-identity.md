---
title: Authorize access to data with a managed identity
titleSuffix: Azure Storage
description: Use managed identities for Azure resources to authorize queue data access from applications running in Azure VMs, function apps, and others.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 10/08/2021
ms.author: tamram
ms.reviewer: santoshc
ms.subservice: common
ms.custom: devx-track-csharp
---

# Authorize access to queue data with managed identities for Azure resources

Azure Queue Storage supports Azure Active Directory (Azure AD) authentication with [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities for Azure resources can authorize access to queue data using Azure AD credentials from applications running in Azure virtual machines (VMs), function apps, virtual machine scale sets, and other services. By using managed identities for Azure resources together with Azure AD authentication, you can avoid storing credentials with your applications that run in the cloud.

This article shows how to authorize access to queue data from an Azure VM using managed identities for Azure Resources. It also describes how to test your code in the development environment.

## Enable managed identities on a VM

Before you can use managed identities for Azure Resources to authorize access to queues from your VM, you must first enable managed identities for Azure Resources on the VM. To learn how to enable managed identities for Azure Resources, see one of these articles:

- [Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
- [Azure PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
- [Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
- [Azure Resource Manager template](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
- [Azure Resource Manager client libraries](../../active-directory/managed-identities-azure-resources/qs-configure-sdk-windows-vm.md)

For more information about managed identities, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

## Authenticate with the Azure Identity library

The Azure Identity client library provides Azure Azure AD token authentication support for the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, and JavaScript integrate with the Azure Identity library to provide a simple and secure means to acquire an OAuth 2.0 token for authorization of Azure Storage requests.

An advantage of the Azure Identity client library is that it enables you to use the same code to authenticate whether your application is running in the development environment or in Azure. The Azure Identity client library for .NET authenticates a security principal. When your code is running in Azure, the security principal is a managed identity for Azure resources. In the development environment, the managed identity does not exist, so the client library authenticates either the user or a service principal for testing purposes.

After authenticating, the Azure Identity client library gets a token credential. This token credential is then encapsulated in the service client object that you create to perform operations against Azure Storage. The library handles this for you seamlessly by getting the appropriate token credential.

For more information about the Azure Identity client library for .NET, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

### Assign Azure roles for access to data

When an Azure AD security principal attempts to access queue data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to queue data in Azure Storage. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to queue data](../queues/assign-azure-role-data-access.md).

> [!NOTE]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container or queue.
>
> Prior to assigning yourself a role for data access, you will be able to access data in your storage account via the Azure portal because the Azure portal can also use the account key for data access. For more information, see [Choose how to authorize access to queue data in the Azure portal](../queues/authorize-data-operations-portal.md).

### Authenticate the user in the development environment

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. For example, Microsoft Visual Studio and Microsoft Visual Studio Code support single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

You can also create a service principal and set environment variables that the development environment can read at runtime.

### Authenticate a service principal in the development environment

If your development environment does not support single sign-on or login via a web browser, then you can use a service principal to authenticate from the development environment. After you create the service principal, add the values returned for the service principal to environment variables.

#### Create the service principal

To create a service principal with Azure CLI and assign an Azure role, call the [az ad sp create-for-rbac](/cli/azure/ad/sp#az_ad_sp_create_for_rbac) command. Provide an Azure Storage data access role to assign to the new service principal. Additionally, provide the scope for the role assignment. For more information about the built-in roles provided for Azure Storage, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you do not have sufficient permissions to assign a role to the service principal, you may need to ask the account owner or administrator to perform the role assignment.

The following example uses the Azure CLI to create a new service principal and assign the **Storage Queue Data Contributor** role to it with account scope

```azurecli-interactive
az ad sp create-for-rbac \
    --name <service-principal> \
    --role "Storage Queue Data Contributor" \
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
> Azure role assignments may take a few minutes to propagate.

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

## .NET code example: Create a queue

Add the following `using` directives to your code to use the Azure Identity library and the .NET client library for queues.

```csharp
using Azure;
using Azure.Identity;
using Azure.Storage.Queues;
using System;
using System.Threading.Tasks;
```

To get a token credential that your code can use to authorize requests to Azure Storage, create an instance of the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. For more information about using the DefaultAzureCredential class to authorize a managed identity to access Azure Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

The following code example shows how to get the authenticated token credential and use it to create a service client object, then use the service client to create a queue:

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="Snippet_CreateQueueAsync":::

> [!NOTE]
> To authorize requests against queue data with Azure AD, you must use HTTPS for those requests.

## Next steps

- [Assign an Azure role for access to queue data](assign-azure-role-data-access.md)
- [Choose how to authorize access to queue data in the Azure portal](authorize-data-operations-portal.md)
- [Run PowerShell commands with Azure AD credentials to access queue data](authorize-data-operations-powershell.md)
- [Choose how to authorize access to queue data with Azure CLI](authorize-data-operations-cli.md)
- [Tutorial: Access storage from App Service using managed identities](../../app-service/scenario-secure-app-access-storage.md)
