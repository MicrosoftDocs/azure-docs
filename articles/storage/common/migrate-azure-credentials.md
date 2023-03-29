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

The following code example demonstrates how to connect to Azure Storage using a storage account key. When you create a storage account, Azure generates access keys for that account. Many developers gravitate towards this solution because it feels familiar to options they have worked with in the past. For example, connection strings for storage accounts also use access keys as part of the string. If your application currently uses access keys, consider migrating to passwordless connections using the steps described later in this document.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

Storage account keys should be used with caution. Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate. For example, if an account key is accidentally checked into source control, sent through an unsecure email, pasted into the wrong chat, or viewed by someone who shouldn't have permission, there's risk of a malicious user accessing the application. Instead, consider updating your application to use passwordless connections.

## Migrate to passwordless connections

[!INCLUDE [migrate-to-passwordless-overview](../../../includes/passwordless/migration-guide/migrate-to-passwordless-overview.md)]

## Steps to migrate an app to use passwordless authentication

The following steps explain how to migrate an existing application to use passwordless connections instead of a key-based solution. These same migration steps should apply whether you are using access keys directly, or through connection strings.

### Configure roles and users for local development authentication

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

### Sign-in and migrate the app code to use passwordless connections

For local development, make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, Azure PowerShell, or other tools such as IntelliJ.

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

Next you will need to update your code to use passwordless connections.

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

After making these code changes, run your application locally. The new configuration should pick up your local credentials, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your local dev user in Azure will allow your app to connect to the Azure service locally.

### Configure the Azure hosting environment

Once your application is configured to use passwordless connections and runs locally, the same code can authenticate to Azure services after it is deployed to Azure. For example, an application deployed to an Azure App Service instance that has a managed identity enabled can connect to Azure Storage.

#### Create the managed identity using the Azure portal

[!INCLUDE [create-managed-identity-portal](../../../includes/passwordless/migration-guide/create-managed-identity-portal.md)]

Alternatively, you can also enable managed identity on an Azure hosting environment using the Azure CLI.

### [Service Connector](#tab/service-connector-identity)

You can use Service Connector to create a connection between an Azure compute hosting environment and a target service using the Azure CLI. The CLI automatically handles creating a managed identity and assigns the proper role, as explained in the [portal instructions](#create-the-managed-identity-using-the-azure-portal).

If you're using an Azure App Service, use the `az webapp connection` command:

```azurecli
az webapp connection create storage-blob \
    --resource-group <resource-group-name> \
    --name <webapp-name> \
    --target-resource-group <target-resource-group-name> \
    --account <target-storage-account-name> \
    --system-identity
```

If you're using Azure Spring Apps, use `the az spring-cloud connection` command:

```azurecli
az spring-cloud connection create storage-blob \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --app <app-name> \
    --deployment <deployment-name> \
    --target-resource-group <target-resource-group> \
    --account <target-storage-account-name> \
    --system-identity
```

If you're using Azure Container Apps, use the `az containerapp connection` command:

```azurecli
az containerapp connection create storage-blob \
    --resource-group <resource-group-name> \
    --name <containerapp-name> \
    --target-resource-group <target-resource-group-name> \
    --account <target-storage-account-name> \
    --system-identity
```

### [Azure App Service](#tab/app-service-identity)

You can assign a managed identity to an Azure App Service instance with the [az webapp identity assign](/cli/azure/webapp/identity) command.

```azurecli
az webapp identity assign \
    --resource-group <resource-group-name> \
    --name <webapp-name>
```

### [Azure Spring Apps](#tab/spring-apps-identity)

You can assign a managed identity to an Azure Spring Apps instance with the [az spring app identity assign](/cli/azure/spring/app/identity) command.

```azurecli
az spring app identity assign \
    --resource-group <resource-group-name> \
    --name <app-name> \
    --service <service-name>
```

### [Azure Container Apps](#tab/container-apps-identity)

You can assign a managed identity to an Azure Container Apps instance with the [az container app identity assign](/cli/azure/containerapp/identity) command.

```azurecli
az containerapp identity assign \
    --resource-group <resource-group-name> \
    --name <app-name>
```

### [Azure virtual machines](#tab/virtual-machines-identity)

You can assign a managed identity to a virtual machine with the [az vm identity assign](/cli/azure/vm/identity) command.

```azurecli
az vm identity assign \
    --resource-group <resource-group-name> \
    --name <virtual-machine-name>
```

### [Azure Kubernetes Service](#tab/aks-identity)

You can assign a managed identity to an Azure Kubernetes Service (AKS) instance with the [az aks update](/cli/azure/aks) command.

```azurecli
az vm identity assign \
    --resource-group <resource-group-name> \
    --name <virtual-machine-name>
```

---

#### Assign roles to the managed identity

Next, you need to grant permissions to the managed identity you created to access your storage account. You can do this by assigning a role to the managed identity, just like you did with your local development user.

### [Service Connector](#tab/assign-role-service-connector)

If you connected your services using the Service Connector you do not need to complete this step. The necessary configurations were handled for you:

* If you selected a managed identity while creating the connection, a system-assigned managed identity was created for your app and assigned the **Storage Blob Data Contributor** role on the storage account.

* If you selected connection string, the connection string was added as an app environment variable.

### [Azure portal](#tab/assign-role-azure-portal)

1. Navigate to your storage account overview page and select **Access Control (IAM)** from the left navigation.

1. Choose **Add role assignment**

   :::image type="content" source="media/migration-add-role-small.png" alt-text="Screenshot showing how to add a role to a managed identity." lightbox="media/migration-add-role.png":::

1. In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

1. On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

1. In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

   :::image type="content" source="media/migration-select-identity-small.png" alt-text="Screenshot showing how to select the assigned managed identity." lightbox="media/migration-select-identity.png":::

1. Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

### [Azure CLI](#tab/assign-role-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the az storage account show command. You can filter the output properties using the --query parameter.

```azurecli
az storage account show \
    --resource-group '<your-resource-group-name>' \
    --name '<your-storage-account-name>' \
    --query id
```

Copy the output ID from the preceding command. You can then assign roles using the az role command of the Azure CLI.

```azurecli
az role assignment create \
    --assignee "<your-username>" \
    --role "Storage Blob Data Contributor" \
    --scope "<your-resource-id>"
```

---

#### Test the app

After making these code changes, browse to your hosted application in the browser. Your app should be able to connect to the storage account successfully. Keep in mind that it may take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

* [Authorize access to blobs using Azure Active Directory](../blobs/authorize-access-azure-active-directory.md)
* To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
