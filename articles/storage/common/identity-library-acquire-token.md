---
title: Use the Azure Identity library to get an access token for authorization 
titleSuffix: Azure Storage
description: Learn to use the Azure Identity client library to get an access token that your applications can use to authorize access to data in Azure Storage. With the Azure Identity library, you can use the same code to get the access token in the development environment or in Azure. 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2021
ms.author: tamram
ms.reviewer: santoshc
ms.subservice: common
ms.custom: devx-track-csharp
---

# Use the Azure Identity library to get an access token for authorization

The Azure Identity client library simplifies the process of getting an OAuth 2.0 access token for authorization with Azure Active Directory (Azure AD) via the [Azure SDK](https://github.com/Azure/azure-sdk). The latest versions of the Azure Storage client libraries for .NET, Java, Python, JavaScript, and Go integrate with the Azure Identity libraries for each of those languages to provide a simple and secure means to acquire an access token for authorization of Azure Storage requests.

An advantage of the Azure Identity client library is that it enables you to use the same code to acquire the access token whether your application is running in the development environment or in Azure. The Azure Identity client library returns an access token for a security principal. When your code is running in Azure, the security principal may be a managed identity for Azure resources, a service principal, or a user or group. In the development environment, the client library provides an access token for either a user or a service principal for testing purposes.

The access token returned by the Azure Identity client library is encapsulated in a token credential. You can then use the token credential to get a service client object to use in performing authorized operations against Azure Storage. A simple way to get the access token and token credential is to use the **DefaultAzureCredential** class that is provided by the Azure Identity client library. An instance of this class attempts to get the token credential in a variety of common ways, and it works in both the development environment and in Azure.

For more information about the Azure Identity client library for your language, see one of the following articles:

- [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme)
- [Azure Identity client library for Java](/java/api/overview/azure/identity-readme)
- [Azure Identity client library for Python](/python/api/overview/azure/identity-readme)
- [Azure Identity client library for JavaScript](/javascript/api/overview/azure/identity-readme)
- [Azure Identity client library for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity)

## Assign Azure roles for access to data

When an Azure AD security principal attempts to access data in an Azure Storage account, that security principal must have permissions to the data resource. Whether the security principal is a managed identity in Azure or an Azure AD user account running code in the development environment, the security principal must be assigned an Azure role that grants access to data in Azure Storage. For information about assigning permissions for data access via Azure RBAC, see one of the following articles:

- [Assign an Azure role for access to blob data](../blobs/assign-azure-role-data-access.md)
- [Assign an Azure role for access to queue data](../queues/assign-azure-role-data-access.md)
- [Assign an Azure role for access to table data](../tables/assign-azure-role-data-access.md)

> [!NOTE]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container, queue, or table.

## Authenticate the user in the development environment

When your code is running in the development environment, authentication may be handled automatically, or it may require a browser login, depending on which tools you're using. For example, Microsoft Visual Studio and Microsoft Visual Studio Code support single sign-on (SSO), so that the active Azure AD user account is automatically used for authentication. For more information about SSO, see [Single sign-on to applications](../../active-directory/manage-apps/what-is-single-sign-on.md).

You can also create a service principal and set environment variables that the development environment can read at runtime.

## Authenticate a service principal in the development environment

If your development environment does not support single sign-on or login via a web browser, then you can use a service principal to authenticate from the development environment. After you create the service principal, add the values returned for the service principal to environment variables.

### Create the service principal

To create a service principal with Azure CLI and assign an Azure role, call the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command. Provide an Azure Storage data access role to assign to the new service principal. Additionally, provide the scope for the role assignment. For more information about the built-in roles provided for Azure Storage, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you do not have sufficient permissions to assign a role to the service principal, you may need to ask the account owner or administrator to perform the role assignment.

The following example uses the Azure CLI to create a new service principal and assign the **Storage Blob Data Contributor** role to it, scoped to the storage account:

```azurecli-interactive
az ad sp create-for-rbac \
    --name <service-principal> \
    --role "Storage Blob Data Contributor" \
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

For more information about how to create a service principal, see one of the following articles:

- [Create an Azure AD app and service principal in the portal](../../active-directory/develop/howto-create-service-principal-portal.md)
- [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps)
- [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli)

> [!IMPORTANT]
> Azure role assignments may take several minutes to propagate.

### Set environment variables

The Azure Identity client library reads values from three environment variables at runtime to authenticate the service principal. The following table describes the value to set for each environment variable.

|Environment variable|Value
|-|-
|`AZURE_CLIENT_ID`|The app ID for the service principal
|`AZURE_TENANT_ID`|The service principal's Azure AD tenant ID
|`AZURE_CLIENT_SECRET`|The password generated for the service principal

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you are using Visual Studio or another development environment, you may need to restart the development environment in order for it to register the new environment variables.

For more information, see [Create identity for Azure app in portal](../../active-directory/develop/howto-create-service-principal-portal.md).

## Get an access token for authorization

The Azure Identity client library provides classes that you can use to get an access token for authorizing requests with Azure AD. The Azure Storage client libraries include constructors for service client objects that take a token credential as a parameter. You can use the two together to easily authorize Azure Storage requests with Azure AD credentials.

Using the **DefaultAzureCredential** class is recommended for most simple scenarios where your application needs to get an access token in both the development environment and in Azure. A variety of types of token credentials are also available for other scenarios.

The following example shows how to use DefaultAzureCredential to get a token in .NET. The application then uses the token to create a new service client, which is then used to create a blob container. Although this example uses .NET and the Blob Storage service, the **DefaultAzureCredential** class behaves similarly with other languages and with other Azure services.

```csharp
static void CreateBlobContainer(string accountName, string containerName)
{
    // Construct the blob container endpoint from the arguments.
    string containerEndpoint = string.Format("https://{0}.blob.core.windows.net/{1}",
                                                accountName,
                                                containerName);

    // Get a token credential and create a service client object for the blob container.
    BlobContainerClient containerClient = new BlobContainerClient(new Uri(containerEndpoint),
                                                                  new DefaultAzureCredential());

    // Create the container if it does not exist.
    containerClient.CreateIfNotExists();
}
```  

For more information about using the DefaultAzureCredential class to authorize a managed identity to access Azure Storage, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

## See also

- [Apps & service principals in Azure AD](../../active-directory/develop/app-objects-and-service-principals.md)
- [Microsoft identity platform authentication libraries](../../active-directory/develop/reference-v2-libraries.md)