---
title: Migrate applications to use passwordless authentication with Azure Storage
titleSuffix: Azure Storage
description: Learn to migrate existing applications away from Shared Key authorization with the account key to instead use Azure AD and Azure RBAC for enhanced security.
services: storage
author: alexwolfmsft

ms.service: storage
ms.topic: how-to
ms.date: 07/28/2022
ms.author: alexwolf
ms.subservice: common
ms.custom: devx-track-csharp
---

# Migrate an application to use passwordless connections with Azure services

Application requests to Azure Storage must be authenticated using either account access keys or passwordless connections. However, you should prioritize passwordless connections in your applications when possible. This tutorial explores how to migrate from traditional authentication methods to more secure, passwordless connections.

## Security risks associated with Shared Key authorization

The following code example demonstrates how to connect to Azure Storage using a storage account key. When you create a storage account, Azure generates access keys for that account.  Many developers gravitate towards this solution because it feels familiar to options they have worked with in the past. For example, connection strings for storage accounts also use access keys as part of the string. If your application currently uses access keys, consider migrating to passwordless connections using the steps described later in this document.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<storage-account-name>.blob.core.windows.net"),
    new StorageSharedKeyCredential("<storage-account-name>", "<your-access-key>"));
```

Storage account keys should be used with caution. Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate. For example, if an account key is accidentally checked into source control, sent through an unsecure email, pasted into the wrong chat, or viewed by someone who shouldn't have permission, there's risk of a malicious user accessing the application. Instead, consider updating your application to use passwordless connections.

## Migrating to passwordless connections

Many Azure services support passwordless connections through Azure AD and Role Based Access control (RBAC). These techniques provide robust security features and can be implemented using `DefaultAzureCredential` from the Azure Identity client libraries.

> [!IMPORTANT]
> Some languages must implement `DefaultAzureCredential` explicitly in their code, while others utilize `DefaultAzureCredential` internally through underlying plugins or drivers.

`DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` searches for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential) and varies between languages. For example, when working locally with .NET, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio. When the app is deployed to Azure, `DefaultAzureCredential` will automatically switch to use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). No code changes are required for this transition.

:::image type="content" source="https://raw.githubusercontent.com/Azure/azure-sdk-for-net/main/sdk/identity/Azure.Identity/images/mermaidjs/DefaultAzureCredentialAuthFlow.svg" alt-text="Diagram of the credential flow.":::

> [!NOTE]
> A managed identity provides a security identity to represent an app or service. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. You can read more about managed identities in the [overview](../../active-directory/managed-identities-azure-resources/overview.md) documentation.

The following code example demonstrates how to connect to an Azure Storage account using passwordless connections. The next section describes how to migrate to this setup in more detail.

A .NET Core application can pass an instance of `DefaultAzureCredential` into the constructor of a service client class. `DefaultAzureCredential` will automatically discover the credentials that are available in that environment.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential());
```

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

The following steps demonstrate how to create a system-assigned managed identity for various web hosting services. The managed identity can securely connect to other Azure Services using the app configurations you set up previously.

### [Service Connector](#tab/service-connector)

Some app hosting environments support Service Connector, which helps you connect Azure compute services to other backing services. Service Connector automatically configures network settings and connection information.  You can learn more about Service Connector and which scenarios are supported on the [overview page](../../service-connector/overview.md).

The following compute services are currently supported:

* Azure App Service
* Azure Spring Cloud
* Azure Container Apps (preview)

For this migration guide you will use App Service, but the steps are similar on Azure Spring Apps and Azure Container Apps.

> [!NOTE]
> Azure Spring Apps currently only supports Service Connector using connection strings.

1. On the main overview page of your App Service, select **Service Connector** from the left navigation.

1. Select **+ Create** from the top menu and the **Create connection** panel will open.  Enter the following values:

   * **Service type**: Choose **Storage blob**.
   * **Subscription**: Select the subscription you would like to use.
   * **Connection Name**: Enter a name for your connection, such as *connector_appservice_blob*.
   * **Client type**: Leave the default value selected or choose the specific client you'd like to use.

   Select **Next: Authentication**.

   :::image type="content" source="media/migration-create-identity-small.png" alt-text="Screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-create-identity.png":::

1. Make sure **System assigned managed identity (Recommended)** is selected, and then choose **Next: Networking**.
1. Leave the default values selected, and then choose **Next: Review + Create**.
1. After Azure validates your settings, click **Create**.

The Service Connector will automatically create a system-assigned managed identity for the app service. The connector will also assign the managed identity a **Storage Blob Data Contributor** role for the storage account you selected.

### [Azure App Service](#tab/app-service)

1. On the main overview page of your Azure App Service instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/migration-create-identity-small.png" alt-text="Screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-create-identity.png":::

### [Azure Spring Apps](#tab/spring-apps)

1. On the main overview page of your Azure Spring Apps instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/storage-migrate-credentials/spring-apps-identity.png" alt-text="Screenshot showing how to enable managed identity for Azure Spring Apps.":::

### [Azure Container Apps](#tab/container-apps)

1. On the main overview page of your Azure Container Apps instance, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/storage-migrate-credentials/container-apps-identity.png" alt-text="Screenshot showing how to enable managed identity for Azure Container Apps.":::

### [Azure virtual machines](#tab/virtual-machines)

1. On the main overview page of your virtual machine, select **Identity** from the left navigation.

1. Under the **System assigned** tab, make sure to set the **Status** field to **on**. A system assigned identity is managed by Azure internally and handles administrative tasks for you. The details and IDs of the identity are never exposed in your code.

   :::image type="content" source="media/storage-migrate-credentials/virtual-machine-identity.png" alt-text="Screenshot showing how to enable managed identity for virtual machines.":::

---

You can also enable managed identity on an Azure hosting environment using the Azure CLI.

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

   :::image type="content" source="media/migration-add-role-small.png" alt-text="Screenshot showing how to add a role to a managed identity."  lightbox="media/migration-add-role.png":::

1. In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

1. On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

1. In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

   :::image type="content" source="media/migration-select-identity-small.png" alt-text="Screenshot showing how to select the assigned managed identity."  lightbox="media/migration-select-identity.png":::

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

* For more information on authorizing access with managed identity, visit [Authorize access to blob data with managed identities for Azure resources](../blobs/authorize-managed-identity.md).
* [Authorize with Azure roles](../blobs/authorize-access-azure-active-directory.md)
* To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
* To learn more about authorizing from a web application, visit [Authorize from a native or web application](./storage-auth-aad-app.md)