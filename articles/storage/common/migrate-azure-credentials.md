---
title: Migrate applications to use passwordless authentication with Azure Storage
titleSuffix: Azure Storage
description: Learn to migrate existing applications away from Shared Key authorization with the account key to instead use Azure AD and Azure RBAC for enhanced security.
author: alexwolfmsft
ms.author: alexwolf
ms.reviewer: randolphwest
ms.date: 12/07/2022
ms.service: storage
ms.subservice: common
ms.topic: how-to
ms.custom: devx-track-csharp, passwordless-java, passwordless-js, passwordless-python, passwordless-dotnet, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: csharp
---

# Migrate an application to use passwordless connections with Azure Storage

Application requests to Azure Storage must be authenticated using either account access keys or passwordless connections. However, you should prioritize passwordless connections in your applications when possible. This tutorial explores how to migrate from traditional authentication methods to more secure, passwordless connections.

## Security risks associated with Shared Key authorization

The following code example demonstrates how to connect to Azure Storage using a storage account key. When you create a storage account, Azure generates access keys for that account. Many developers gravitate towards this solution because it feels familiar to options they've worked with in the past. For example, connection strings for storage accounts also use access keys as part of the string. If your application currently uses access keys, consider migrating to passwordless connections using the steps described later in this document.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

Storage account keys should be used with caution. Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate. For example, if an account key is accidentally checked into source control, sent through an unsecure email, or viewed by someone who shouldn't have permission, there's risk of a malicious user accessing the application. Instead, consider updating your application to use passwordless connections.

## Migrate to passwordless connections

[!INCLUDE [migrate-to-passwordless-overview](../../../includes/passwordless/migration-guide/migrate-to-passwordless-overview.md)]

## Steps to migrate an app to use passwordless authentication

The following steps explain how to migrate an existing application to use passwordless connections instead of a key-based solution. These same migration steps should apply whether you're using access keys directly, or through connection strings.

### Configure roles and users for local development authentication

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### Sign-in and migrate the app code to use passwordless connections

For local development, make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, Azure PowerShell, or other tools such as IntelliJ.

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

Next you need to update your code to use passwordless connections.

1. To use `DefaultAzureCredential` in a .NET application, add the **Azure.Identity** NuGet package to your application.

   ```dotnetcli
   dotnet add package Azure.Identity
   ```

1. At the top of your `Program.cs` file, add the following `using` statement:

   ```csharp
   using Azure.Identity;
   ```

1. Identify the locations in your code that currently create a `BlobServiceClient` to connect to Azure Storage. This task is often handled in `Program.cs`, potentially as part of your service registration with the .NET dependency injection container. Update your code to match the following example:

   ```csharp
   // TODO: Update <storage-account-name> placeholder to your account name
   var blobServiceClient = new BlobServiceClient(
       new Uri("https://<storage-account-name>.blob.core.windows.net"),
       new DefaultAzureCredential());
   ```

1. Make sure to update the storage account name in the URI of your `BlobServiceClient`. You can find the storage account name on the overview page of the Azure portal.

   :::image type="content" source="../blobs/media/storage-quickstart-blobs-dotnet/storage-account-name.png" alt-text="Screenshot showing how to find the storage account name.":::

#### Run the app locally

After making these code changes, run your application locally. The new configuration should pick up your local credentials, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your local dev user in Azure allows your app to connect to the Azure service locally.

### Configure the Azure hosting environment

Once your application is configured to use passwordless connections and runs locally, the same code can authenticate to Azure services after it's deployed to Azure. The sections that follow explain how to configure a deployed application to connect to Azure Blob Storage using a managed identity.

#### Create the managed identity

[!INCLUDE [create-managed-identity](../../../includes/passwordless/migration-guide/create-user-assigned-managed-identity.md)]

#### Associate the managed identity with your web app

You need to configure your web app to use the managed identity you created. Assign the identity to your app using either the Azure portal or the Azure CLI.

# [Azure Portal](#tab/azure-portal-associate)

Complete the following steps in the Azure portal to associate an identity with your app. These same steps apply to the following Azure services:

* Azure Spring Apps
* Azure Container Apps
* Azure virtual machines
* Azure Kubernetes Service.

1. Navigate to the overview page of your web app.
1. Select **Identity** from the left navigation.
1. On the **Identity** page, switch to the **User assigned** tab.
1. Select **+ Add** to open the **Add user assigned managed identity** flyout.
1. Select the subscription you used previously to create the identity.
1. Search for the **MigrationIdentity** by name and select it from the search results.
1. Select **Add** to associate the identity with your app.

   :::image type="content" source="../../../articles/storage/common/media/create-user-assigned-identity-small.png" alt-text="Screenshot showing how to create a user assigned identity." lightbox="../../../articles/storage/common/media/create-user-assigned-identity.png":::

# [Azure CLI](#tab/azure-cli-associate)

[!INCLUDE [associate-managed-identity-cli](../../../includes/passwordless/migration-guide/associate-managed-identity-cli.md)]

# [Service Connector](#tab/service-connector-associate)

[!INCLUDE [service-connector-commands](../../../includes/passwordless/migration-guide/service-connector-commands.md)]

---

#### Assign roles to the managed identity

Next, you need to grant permissions to the managed identity you created to access your storage account. Grant permissions by assigning a role to the managed identity, just like you did with your local development user.

### [Azure portal](#tab/assign-role-azure-portal)

1. Navigate to your storage account overview page and select **Access Control (IAM)** from the left navigation.

1. Choose **Add role assignment**

   :::image type="content" source="media/migration-add-role-small.png" alt-text="Screenshot showing how to add a role to a managed identity." lightbox="media/migration-add-role.png":::

1. In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

1. On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

1. In the flyout, search for the managed identity you created by name and select it from the results. Choose **Select** to close the flyout menu.

   :::image type="content" source="media/migration-select-identity-small.png" alt-text="Screenshot showing how to select the assigned managed identity." lightbox="media/migration-select-identity.png":::

1. Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

### [Azure CLI](#tab/assign-role-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the [az storage account](/cli/azure/storage/account) show command. You can filter the output properties using the `--query` parameter.

```azurecli
az storage account show \
    --resource-group '<your-resource-group-name>' \
    --name '<your-storage-account-name>' \
    --query id
```

Copy the output ID from the preceding command. You can then assign roles using the [az role assignment](/cli/azure/role/assignment) command of the Azure CLI.

```azurecli
az role assignment create \
    --assignee "<your-username>" \
    --role "Storage Blob Data Contributor" \
    --scope "<your-resource-id>"
```

### [Service Connector](#tab/assign-role-service-connector)

If you connected your services using Service Connector you don't need to complete this step. The necessary role configurations were handled for you when you ran the Service Connector CLI commands.

---

#### Update the application code

You need to configure your application code to look for the specific managed identity you created when it is deployed to Azure. In some scenarios, explicitly setting the managed identity for the app also prevents other environment identities from accidentally being detected and used automatically.

1. On the managed identity overview page, copy the client ID value to your clipboard.
1. Update the `DefaultAzureCredential` object in the `Program.cs` file of your app to specify this managed identity client ID.

    ```csharp
    // TODO: Update the <your-storage-account-name> and <your-managed-identity-client-id> placeholders
    var blobServiceClient = new BlobServiceClient(
                        new Uri("https://<your-storage-account-name>.blob.core.windows.net"),
                        new DefaultAzureCredential(
                            new DefaultAzureCredentialOptions() 
                            { 
                                ManagedIdentityClientId = "<your-managed-identity-client-id>" 
                            }));
    ```

3. Redeploy your code to Azure after making this change in order for the configuration updates to be applied.

#### Test the app

After deploying the updated code, browse to your hosted application in the browser. Your app should be able to connect to the storage account successfully. Keep in mind that it may take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

* [Authorize access to blobs using Azure Active Directory](../blobs/authorize-access-azure-active-directory.md)
* To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
