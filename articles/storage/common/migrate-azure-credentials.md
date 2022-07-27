---
title: Migrate existing applications to use credential-free authentication with the Azure Identity client library
titleSuffix: Azure Storage
description: Learn to migrate existing applications away from authentication patterns such as connection strings to more secure approaches like Managed Identity and DefaultAzureCredential.
services: storage
author: alexwolfmsft

ms.service: storage
ms.topic: how-to
ms.date: 11/16/2021
ms.author: alexwolf
ms.subservice: common
ms.custom: devx-track-csharp
---

# Migrate an application to use credential-free authentication with the Azure Identity client library

Application requests to Azure Storage must be authenticated. Azure Storage provides several different ways to securely connect with your app, each with its own features and implementation details. Some of these options rely on string-formatted keys to securely connect, such as connection strings or access keys. However, you should prioritize credential-free authentication in your applications when possible. Credential-free solutions such as Managed Identity or Role Based Access control (RBAC) can be safely implemented using DefaultAzureCredential. 

## Comparing authentication options

The following examples demonstrate how to connect to Azure Storage using different types of access keys. Many developers gravitate towards these options because they feel familiar to options they are traditionally used to working with.

### [Connection String](#tab/connection-string)

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient("<your-connection-string>");
```

### [Access Key](#tab/access-keys)

When you create a storage account, Azure generates two 512-bit storage account access keys for that account. These keys can be used to authorize access to data in your storage account via Shared Key authorization. These keys should be managed with Azure Key Vault and regularly rotated. 

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

### [Shared Access Signature](#tab/shared-access-signature)

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient(new Uri("https://identitymigrationstorage.blob.core.windows.net"),
    new AzureSasCredential("<shared-access-signature-token>"));

```
---

However, although it is possible to connect to Azure Storage with any of these options, they should be used with caution. Developers must be very diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate. For example, if a key is accidentally checked into source control, sent through an unsecure email, pasted into the wrong chat, or viewed by someone who shouldn't have permission, there is risk of a malicious user accessing the application. Instead, consider updating your application to use credential-free authentication with `DefaultAzureCredential`. 

### Introducing DefaultAzureCredential

`DefaultAzureCredential` is a class provided by the Azure Identity client library for .NET, which you can learn more about on the [DefaultAzureCredential](/dotnet/azure/sdk/authentication#defaultazurecredential) overview. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which DefaultAzureCredential looks for credentials can be found in the Azure Identity library overview.

In the following example, the app authenticates using your Visual Studio sign-in credentials with when developing locally. Your app can then use Managed Identity once it has been deployed to Azure. No code changes are required for this transition.

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

## Steps to migrate an existing application to use Azure Identity

The following steps explain how to migrate an existing application to use DefaultAzureCredential instead of a key based solution. These same migration steps should apply whether you are using connection strings, access keys, or shared access signatures. 

### 1) Add the Azure Identity libraries to your project

Inside of your project, add a reference to the `Azure.Identity` NuGet package. This library contains all of the necessary entities to implement `DefaultAzureCredential`.

```csharp
dotnet add package Azure.Identity
```

### 2) Implement DefaultAzureCredential in your code

At the top of your `Program.cs` file, add the following using statement:

```csharp
using Azure.Identity;
```

In your project code, locate the places you are currently creating a `BlobServiceClient` to connect to Azure Storage. This is often handled in `Program.cs`, potentially as part of your service registration with the .NET dependency injection container. Update your code to matching the following example:

```csharp
BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

### 3) Assign the necessary roles to users for local dev

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### 4) Assign a managed identity to your hosted app

Once your application is configured to use DefaultAzureCredential, the same code can be used to authenticate between services after it is deployed to Azure. For example, an application running in Azure App Service can connect to Azure Storage using a managed identity. A managed identity must be created and assigned to the app service for it to be discovered by the `DefaultAzureCredential` code. The following steps demonstrate how to create a managed identity for an app service, and then grant that identity the correct permissions to access an Azure Storage account.

### [Azure portal](#tab/assign-role-azure-portal)

1. On the main overview page of your App Service, select **Identity** from the left navigation. 

1. Under the **System assigned** tab, make sure to switch the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and ids of the identity are never exposed in your code.

:::image type="content" source="media/migration-create-identity-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-create-identity.png":::

1. Next, you need to grant permissions to the managed identity you just created to access your storage account. You can do this using Azure role-based access control (RBAC). Navigate to your storage account and select **Access Control (IAM)** from the left navigation.

1. Choose **Add role assignment**

1. In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

:::image type="content" source="media/migration-add-role-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-add-role.png":::

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