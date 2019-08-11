---
title: Create a user delegation SAS for a container or blob with .NET (preview) - Azure Storage
description: Learn how to create a user delegation SAS using Azure Active Directory credentials in Azure Storage using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/07/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: blobs
---

# Create a user delegation SAS for a container or blob with .NET (preview)

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Azure Active Directory (Azure AD) credentials to create a user delegation SAS for a container or blob with the [Azure Storage client library for .NET](https://www.nuget.org/packages/Azure.Storage.Blobs). The examples in this article use the latest preview version of the client library for Blob storage.

The examples in this article also use the latest preview version of the [Azure Identity client library for .NET](https://www.nuget.org/packages/Azure.Identity/) to authenticate with Azure AD credentials. The Azure Identity client library authenticates a security principal. The authenticated security principal can then create the user delegation SAS. For more information about the Azure Identity client library, see [Azure Identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity).

To authenticate with Azure AD credentials via the Azure Identity client library, use either a service principal or a managed identity as the security principal, depending on where your code is running. If your code is running in a development environment, use a service principal for testing purposes. If your code is running in Azure, use a managed identity. This article assumes that you are running code from the development environment, and shows how to use a service principal to create the user delegation SAS.

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Create a service principal

To create a service principal with Azure CLI and assign an RBAC role, call the [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command. Provide an Azure Storage data access role to assign to the new service principal. The role must include the **Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey** action. For more information about the built-in roles provided for Azure Storage, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

Additionally, provide the scope for the role assignment. The service principal will create the user delegation key, which is an operation performed at the level of the storage account, so the role assignment should be scoped at the level of the storage account, resource group, or subscription. For more information about RBAC permissions for creating a user delegation SAS, see the **Assign permissions with RBAC** section in [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas).  

The following example creates a new service principal and assigns the **Storage Blob Data Reader** role to it with account scope. Remember to replace placeholder values in angle brackets with your own values:

```azurecli-interactive
az ad sp create-for-rbac -n <service-principal> --role "Storage Blob Data Reader" --scopes /subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
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

## Set environment variables

The Azure Identity client library reads values from three environment variables at runtime to authenticate the service principal. The following table describes the value to set for each environment variable.

|Environment variable|Value
|-|-
|`AZURE_CLIENT_ID`|The app ID for the service principal
|`AZURE_TENANT_ID`|The service principal's Azure AD tenant ID
|`AZURE_CLIENT_SECRET`|The password generated for the service principal

> [!IMPORTANT]
> After you set the environment variables, close and re-open your console window. If you are using Visual Studio or another development environment, you may need to restart the development environment in order for it to register the new environment variables.

## Authenticate the service principal

To authenticate the service principal, create an instance the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) class. The `DefaultAzureCredential` constructor reads the environment variables that you created previously.

The following code snippet shows how to get the authenticated credential and use it to create a service client for Blob storage. Remember to replace placeholder values in angle brackets with your own values:

```dotnet
// Specify the Blob service endpoint for your storage account.
Uri accountUri = new Uri("https://<storage-account>.blob.core.windows.net/");

// Authenticate the service principal.
DefaultAzureCredential credential = new DefaultAzureCredential();

// Create a service client object.
BlobServiceClient blobClient = new BlobServiceClient(accountUri, credential);
```

## Get the user delegation key

Every SAS is signed with a key. To create a user delegation SAS, you must first request a user delegation key, which is then used to sign the SAS. The user delegation key is analogous to the account key used to sign a service SAS or an account SAS, except that it relies on your Azure AD credentials. When a client requests a user delegation key using an OAuth 2.0 token, Azure Storage returns the user delegation key on behalf of the user.

Once you have the user delegation key, you can use that key to create any number of user delegation shared access signatures, over the lifetime of the key. The user delegation key is independent of the OAuth 2.0 token used to acquire it, so the token does not need to be renewed so long as the key is still valid. You can specify that the key is valid for a period of up to 7 days.

Use one of the following methods to request the user delegation key:

- [GetUserDelegationKey](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkey)
- [GetUserDelegationKeyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobclient.getuserdelegationkeyasync)

The following code snippet gets the user delegation key and writes out its properties:

```dotnet
// Get a user delegation key for the Blob service that's valid for seven days.
var key = await blobClient.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(7)).Value;

// Read the key's properties.
Console.WriteLine("User delegation key properties:");
Console.WriteLine("Key signed start: {0}", key.SignedStart);
Console.WriteLine("Key signed expiry: {0}", key.SignedExpiry);
Console.WriteLine("Key signed object ID: {0}", key.SignedOid);
Console.WriteLine("Key signed tenant ID: {0}", key.SignedTid);
Console.WriteLine("Key signed service: {0}", key.SignedService);
Console.WriteLine("Key signed version: {0}", key.SignedVersion);
```

## Create the SAS token

The following code snippet shows create a new [BlobSasBuilder](/dotnet/api/azure.storage.sas.blobsasbuilder) and provide the parameters for the user delegation SAS. The snippet then calls the [ToSasQueryParameters](/dotnet/api/azure.storage.sas.blobsasbuilder.tosasqueryparameters) to return the SAS token string. Remember to replace placeholder values in angle brackets with your own values:

```dotnet
// Create a SAS token with the minimum required lifetime.
BlobSasBuilder builder = new BlobSasBuilder()
{
    ContainerName = "sample-container",
    BlobName = "blob1.txt",
    Permissions = "r",
    Resource = "b",
    StartTime = DateTimeOffset.UtcNow,
    ExpiryTime = DateTimeOffset.UtcNow.AddMinutes(5)
};
var sas = builder.ToSasQueryParameters(delegationKey, "<storage-account>");
```

## Example: Get a delegation SAS token for a blob

The following example shows the complete code for authenticating the security principal and creating the user delegation SAS. Remember to replace placeholder values in angle brackets with your own values:

```dotnet
// Specify the blob endpoint for your storage account.
Uri accountUri = new Uri("https://<storage-account>.blob.core.windows.net/");

// Create a new Azure AD credential.  
DefaultAzureCredential credential = new DefaultAzureCredential();
BlobServiceClient blobClient = new BlobServiceClient(accountUri, credential);

// You can reuse the user delegation key over its valid lifetime.
var key = blobClient.GetUserDelegationKey(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddDays(7)).Value;

Console.WriteLine("UDK: {0}", key.Value);

// Create a SAS token with the minimum required lifetime.
BlobSasBuilder builder = new BlobSasBuilder()
{
    ContainerName = "sample-container",
    BlobName = "blob1.txt",
    Permissions = "r",
    Resource = "b",
    StartTime = DateTimeOffset.UtcNow,
    ExpiryTime = DateTimeOffset.UtcNow.AddMinutes(5)
};
var sas = builder.ToSasQueryParameters(key, "<storage-account>");
```

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## See also

- [Get User Delegation Key operation](/rest/api/storageservices/get-user-delegation-key)
- [Create a user delegation SAS](/rest/api/storageservices/create-a-user-delegation-sas)
