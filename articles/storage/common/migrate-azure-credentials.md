---
title: Migrate existing applications to use credential-free authentication
titleSuffix: Azure Storage
description: Learn to migrate existing applications away from authentication patterns such as connection strings to more secure approaches like Managed Identity.
services: storage
author: alexwolfmsft

ms.service: storage
ms.topic: how-to
ms.date: 07/28/2022
ms.author: alexwolf
ms.subservice: common
ms.custom: devx-track-csharp
---

# Migrate an application to use credential-free connections with Azure services

Application requests to Azure Storage must be authenticated. Azure Storage provides several different ways for apps to connect securely. Some of these options rely on string-formatted keys as credentials, such as connection strings, access keys, or shared access signatures. However, you should prioritize credential-free connections in your applications when possible. 

Credential-free solutions such as Azure's Managed Identity or Role Based Access control (RBAC) provide robust security features. They can be implemented using `DefaultAzureCredential` from the Azure Identity client library. In this tutorial, you'll learn how to update an existing application to use `DefaultAzureCredential` instead of alternatives such as connection strings.

## Compare authentication options

The following examples demonstrate how to connect to Azure Storage using key credentials. Many developers gravitate towards these solutions because they feel familiar to options have traditionally worked with in the past. If you currently use one of these approaches, consider migrating to credential-free connections with `DefaultAzureCredential` using the steps described later in this document.

### [Connection String](#tab/connection-string)

A connection string includes the authorization information required for your application to access data in an Azure Storage account. Your storage account access keys are similar to a root password for your storage account. Always be careful to protect your access keys.

```csharp
var blobServiceClient = new BlobServiceClient("<your-connection-string>");
```

### [Access Key](#tab/access-keys)

When you create a storage account, Azure generates storage account access keys for that account. These keys can be used to authorize access to data in your storage account via shared key authorization. These keys should be managed with Azure Key Vault and regularly rotated. 

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

### [Shared Access Signature](#tab/shared-access-signature)

A shared access signature (SAS) is a URI that grants restricted access rights to Azure Storage resources. You can provide a shared access signature to clients who should not be trusted with your storage account key but whom you wish to delegate access to certain storage account resources. By distributing a shared access signature URI to these clients, you grant them access to a resource for a specified period of time.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://identitymigrationstorage.blob.core.windows.net"),
    new AzureSasCredential("<shared-access-signature-token>"));

```
---

Although it's possible to connect to Azure Storage with any of these options, they should be used with caution. Developers must be very diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate. For example, if a key is accidentally checked into source control, sent through an unsecure email, pasted into the wrong chat, or viewed by someone who shouldn't have permission, there's risk of a malicious user accessing the application. Instead, consider updating your application to use credential-free connections with `DefaultAzureCredential`.

### Introducing credential-free connections

Many Azure services support credential-free connections through the use of a class called `DefaultAzureCredential` from the Azure Identity client library. `DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` searches for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential). For example, when working locally, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio. When the app is deployed to Azure, `DefaultAzureCredential` will automatically switch to use a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview). No code changes are required for this transition. 

> [!NOTE]
> A managed identity provides a security identity to represent an app or service. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. You can read more about managed identities in the [overview](/azure/active-directory/managed-identities-azure-resources/overview) documentation.

`DefaultAzureCredential` is generally implemented by passing an instance of the class to the service you're using from the SDK. The following example demonstrates how to create a `BlobServiceClient` that uses `DefaultAzureCredential` to authenticate to an Azure Storage account. The next section describes how to migrate to this setup in more detail.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

## Steps to migrate an existing application to use Azure Identity

The following steps explain how to migrate an existing application to use `DefaultAzureCredential` instead of a key-based solution. These same migration steps should apply whether you are using connection strings, access keys, or shared access signatures. 

### 1) Add the Azure Identity libraries to your project

Inside of your project, add a reference to the `Azure.Identity` NuGet package. This library contains all of the necessary entities to implement `DefaultAzureCredential`.

```dotnetcli
dotnet add package Azure.Identity
```

### 2) Implement DefaultAzureCredential in your code

At the top of your `Program.cs` file, add the following `using` statement:

```csharp
using Azure.Identity;
```

In your project code, locate the places you are currently creating a `BlobServiceClient` to connect to Azure Storage. This is often handled in `Program.cs`, potentially as part of your service registration with the .NET dependency injection container. Update your code to matching the following example:

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

### 3) Assign the necessary roles to users for local dev

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### 4) Create a managed identity for the hosted app

Once your application is configured to use `DefaultAzureCredential`, the same code can authenticate to Azure services after it is deployed to Azure. For example, an application deployed to an Azure App Service instance that has a managed identity enabled can connect to Azure Storage. The following steps demonstrate how to create a managed identity for an app service.

### [Azure Portal](#tab/create-managed-identity)

1. On the main overview page of your App Service, select **Identity** from the left navigation. 

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and ids of the identity are never exposed in your code.

    :::image type="content" source="media/migration-create-identity-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-create-identity.png":::


### [Azure CLI](#tab/create-managed-identity)

You can enable managed identity on an app service using the Azure CLI with the [az webapp identity assign](/cli/azure/webapp/identity) command.

```azurecli
az webapp identity assign --resource-group <resource-group-name> -name <app-service-name>
```
---

### 5) Assign roles to the managed identity

Next, you need to grant permissions to the managed identity you created to access your storage account. You can do this by assigning a role to the managed identity, just like you did with your local development user. 

### [Azure portal](#tab/assign-role-azure-portal)

1. Navigate to your storage account overview page and select **Access Control (IAM)** from the left navigation.

1. Choose **Add role assignment**

    :::image type="content" source="media/migration-add-role-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-add-role.png":::

1. In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

1. On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

1. In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

    :::image type="content" source="media/migration-select-identity-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-select-identity-role.png":::

2. Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment. 

### [Azure CLI](#tab/assign-role-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource id using the az storage account show command. You can filter the output properties using the --query parameter.

```azurecli
az storage account show --resource-group '<your-resource-group-name>' --name '<your-storage-account-name>' --query id
```

Copy the output id from the preceding command. You can then assign roles using the az role command of the Azure CLI.

```azurecli
az role assignment create --assignee "<your-username>" \
  --role "Storage Blob Data Contributor" \
  --scope "<your-resource-id>"
```

---

## Next steps

In this tutorial, you learned how to migrate an application to credential-free connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

- For more information on authorizing access with managed identity, visit [Authorize access to blob data with managed identities for Azure resources](/azure/storage/blobs/authorize-managed-identity).
-[Authorize with Azure roles](/azure/storage/blobs/authorize-access-azure-active-directory)
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
- To learn more about authorizing from a web application, visit [Authorize from a native or web application](/azure/storage/common/storage-auth-aad-app)