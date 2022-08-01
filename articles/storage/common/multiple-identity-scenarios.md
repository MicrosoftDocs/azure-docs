---
title: Configure credential-free connections between multiple services
titleSuffix: Azure Storage
description: Learn to work with user-assigned managed identities to configure credential-free connections between multiple Azure services.
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: how-to
ms.date: 08/01/2022
ms.author: alexwolf
ms.subservice: common
ms.custom: devx-track-csharp
---

# Configure credential-free connections between multiple Azure apps and services

Applications often require secure connections between multiple Azure services simultaneously. For example, an enterprise Azure App Service instance might connect to several different blob storage accounts, an Azure SQL database instance, a Key Vault service, and more. 

Managed identities are the recommended authentication option for secure connections between Azure resources. A managed identity can connect to any resource that supports Azure Active Directory authentication. Managed identities provide credential-free connections between services, meaning developers do not have to manually track and manage many different secrets or access keys. Most of these tasks are handled internally by Azure. You can read more about managed identities in the [overview of managed identities](/azure/active-directory/managed-identities-azure-resources/overview).

The Azure Identity client library allows you to configure credential-free service connections between multiple Azure resources using managed identities. The library also enables this scenario to work while developing locally. This tutorial explores how to manage connections between multiple services using managed identities and the Azure Identity client library.

## Compare the types of managed identities

Azure provides two types of managed identities for you to work with. Note that managed identities only exist within the context of services hosted in Azure. Local development requires a separate approach, as you'll explore in a moment. 

* **System-assigned managed identities** are directly tied to a single Azure resource. When you enable a system-assigned managed identity on a service, Azure will create a linked identity and handle administrative tasks for that identity internally. When the Azure resource is deleted, the identity is also deleted. System-assigned identities are a great option for simple connections where the identity should be tied to the application life cycle of a single service instance.
* **User-assigned managed identities** are created by an administrator and can be associated with one or more Azure resources. The lifecycle of the identity is independent of those resources. If multiple services require the same level of access control, you can associate the same user-assigned managed identity with each of them, and then grant a specific role to that identity.

You can read more about best practices and when to use system-assigned identities versus user-assigned identities in the [identities best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

The guidance in this tutorial focuses on applying a user-assigned managed identity to connect multiple Azure services together. A user-assigned identity can be shared across multiple services and lives independently of other resource life cycles.

## Explore DefaultAzureCredential

Managed identities are generally implemented in your application code through a class called `DefaultAzureCredential` from the `Azure.Identity` client library. `DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code.

The order and locations in which DefaultAzureCredential searches for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential). 

For example, when working locally, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio or Visual Studio code. When the app is deployed to Azure, `DefaultAzureCredential` will automatically discover and use an available managed identity for the service. No code changes are required for this transition. 

## Connect Azure hosted apps to multiple Azure services using credential-free connections

You have been tasked with configuring two existing apps to use credential-free connections to different Azure sources. The applications are two different ASP.NET Core Web APIs hosted on Azure App Service. Both APIs must connect to two different storage accounts and retrieve secrets from an instance of Azure Key Vault. 

You plan to share a user-assigned identity between both applications, since they have the same access requirements to the services. When the app is deployed to Azure it will use user-assigned managed identities to achieve this configuration. During local development it will use your local sign-in credentials through the Azure CLI or Visual Studio. Both scenarios in this overall strategy can be accomplished using `DefaultAzureCredential`.

This tutorial assumes the following architecture, though it can be adapted to many other scenarios as well through minimal configuration changes.

:::image type="content" source="media/user-assigned-identity-multiple-services.png" alt-text="A diagram showing the user assigned identity relationships.":::

The following steps demonstrate how to create and configure a user-assigned managed identity and your local development account to connect to multiple Azure Services.

### 1) Create a user-assigned managed identity

1) In the Azure Portal search bar, enter *Managed Identities* and select the matching result.

2) On the managed identities overview page, select **+ Create**.

3) On the **Create User Assigned Managed Identity** page, select the subscription, resource group, and region that should contain your new managed identity. Enter a meaningful name for the identity as well. Select **Review + create** and then select **Create** after Azure has validated your inputs.

    :::image type="content" source="media/create-managed-identity.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-add-role.png":::

4) Once the resource has been created, select **Go to resource** to view the details of the user-assigned managed identity.

### 2) Assign roles to the managed identity for each connected service
    
1) Navigate to the overview page of the storage account you would like to grant access your identity access to.

3) Select **Access Control (IAM)** from the storage account navigation.

4) Choose **Add role assignment**

    :::image type="content" source="media/assign-identity-app-service.png" alt-text="A screenshot showing how to assign a system assigned managed identity."  lightbox="media/migration-add-role.png":::

5) In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

6) On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

7) In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

    :::image type="content" source="media/migration-select-identity-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-select-identity-role.png":::

8) Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

9) Repeat steps the preceding steps for any additional storage accounts you would like to grant your identity access to.

#### Local development considerations

The preceding setup can also be used to enable access to Azure resources during local development. 

1) After assigning the **Storage Blob Data Contributor** role to your managed identity,  under **Assign access to**, this time select **User, group or service principal**. Choose **+ Select members** to open the flyout menu again.

2) Search for the user account or Azure AD security group you would like to grant access to by email address or name, and then select it. This should be the same account you use to sign-in to your local development tooling with, such as Visual Studio or the Azure CLI.

    :::image type="content" source="media/migration-select-identity-small.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/local-dev-assign-user.png":::

### 3) Associate the managed identity with the app services

1) Navigate to the main overview page for the app service you would like to associate your managed identity with.

2) On the left navigation, select **Identity**, and then select the **User-assigned** tab.

3) Choose **+ Add** to open the flyout menu.

    :::image type="content" source="media/assign-identity-app-service.png" alt-text="A screenshot showing how to assign a managed identity."  lightbox="media/migration-select-identity-role.png":::

4) Search for the managed identity you created by its name. Select the managed identity from the search results, and then choose **Add**.

5) Repeat these steps for any additional app services you would like to grant permission to using the managed identity.

### 4) Add the client libraries to your app

Inside of your project, add a reference to the `Azure.Identity` NuGet package. This library contains all of the necessary entities to implement `DefaultAzureCredential`. You can also add any other Azure libraries that are relevant to your app. For this example, the `Azure.Storage.Blobs` and `Azure.KeyVault.Keys` packages are added in order to connect to Blob Storage and Key Vault.

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.Storage.Blobs
dotnet add package Azure.KeyVault.Keys
```

### 5) Implement DefaultAzureCredential in your code

At the top of your `Program.cs` file, add the following using statements:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Security.KeyVault.Keys;
```

In the `Program.cs` file of your project code, retrieve the `Managed_Identity_Client_ID` environment variable. Create an instance of `DefaultAzureCredentialOptions` and assign the `clientID` to the `ManagedIdentityClientId` property. 

```csharp
var clientID = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID");
var credOptions = new DefaultAzureCredentialOptions()
{
    ManagedIdentityClientId = clientID
};
```

Next, create instances of the necessary services your app will connect to. The following examples connect to blob storage and key vault using the corresponding SDK classes.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential(credOptions));

var keyVaultClient = new KeyClient(
    new Uri("https://<your-keyvault-name>.vault.azure.net"),
    new DefaultAzureCredential(credOptions));
```

When this application code runs locally, `DefaultAzureCredential` will search down a credential chain to retrieve credentials. If the `Managed_Identity_Client_ID` is null locally, it will automatically use the credentials from your local Azure CLI or Visual Studio sign-in. You can read more about this process in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential).

When the application is deployed to Azure, `DefaultAzureCredential` will automatically retrieve the `Managed_Identity_Client_ID` variable from the app service environment. That value becomes available when a managed identity is associated with your app.

This overall process ensures that your app can run securely locally and in Azure without the need for any code changes.

## Next steps

In this tutorial, you learned how to migrate an application to credential-free connections. You can read the following resources to explore the concepts discussed in this article in more depth:

- For more information on authorizing access with managed identity, visit [Authorize access to blob data with managed identities for Azure resources](https://docs.microsoft.com/en-us/azure/storage/blobs/authorize-managed-identity).
-[Authorize with Azure roles](/azure/storage/blobs/authorize-access-azure-active-directory)
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
- To learn more about authorizing from a web application, visit [Authorize from a native or web application](/azure/storage/common/storage-auth-aad-app)