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

Managed identities are the recommended authentication option for secure, credential-free connections between Azure resources. A managed identity can connect to any resource that supports Azure Active Directory authentication. Developers do not have to manually track and manage many different secrets for managed identities, since most of these tasks are handled internally by Azure. This approach is recommended over other solutions, such as connection strings. You can read more about managed identities in the [overview of managed identities](/azure/active-directory/managed-identities-azure-resources/overview).

The Azure Identity client library allows you to configure credential-free service connections between multiple Azure resources using managed identities. The library also enables this scenario to work while developing locally. This tutorial explores how to manage connections between multiple services using managed identities and the Azure Identity client library.

## Compare the types of managed identities

Azure provides two types of managed identities, which include the following:

* **System-assigned managed identities** are directly tied to a single Azure resource. When you enable a system-assigned managed identity on a service, Azure will create a linked identity and handle administrative tasks for that identity internally. When the Azure resource is deleted, the identity is also deleted. System-assigned identities are a great option for simple connections where the identity should be tied to the application life cycle of a single service instance.
* **User-assigned managed identities** are created by an administrator and can be associated with one or more Azure resources. The lifecycle of the identity is independent of those resources. If multiple services require the same level of access control, you can associate the same user-assigned managed identity with each of them, and then grant a specific role to that identity.

You can read more about best practices and when to use system-assigned identities versus user-assigned identities in the [identities best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

The guidance in this tutorial focuses on applying a user-assigned managed identity to connect multiple Azure services together. A user-assigned identity can be shared across multiple services and lives independently of other resource life cycles.

## Explore DefaultAzureCredential

Managed identities are generally implemented in your application code through a class called `DefaultAzureCredential` from the `Azure.Identity` client library. `DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local dev vs. production) without implementing environment-specific code. Note that managed identities only exist in the context of Azure hosted services, so `DefaultAzureCrednetial` provides other options that work during local development. 

The order and locations in which DefaultAzureCredential searches for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential). 

For example, when working locally, `DefaultAzureCredential` will generally authenticate using the account the developer used to sign-in to Visual Studio, the Azure CLI, or other tools. When the app is deployed to Azure, `DefaultAzureCredential` will automatically discover and use an available managed identity that was assigned to the app environment. No code changes are required for this transition. 

## Connect Azure hosted apps to multiple Azure services using credential-free connections

You have been tasked with configuring two existing apps to use credential-free connections to different Azure services. The applications are two different ASP.NET Core Web APIs hosted on Azure App Service. Both APIs must connect to two different storage accounts and retrieve secrets from an instance of Azure Key Vault. 

You plan to share a user-assigned identity between both applications, since they have the same access requirements to the services. When the app is deployed to Azure it will use a user-assigned managed identity to achieve this configuration. During local development it will use your local sign-in credentials through the Azure CLI or Visual Studio. Both scenarios in this overall strategy can be accomplished using `DefaultAzureCredential`.

This tutorial assumes the following architecture, though it can be adapted to many other scenarios as well through minimal configuration changes.

:::image type="content" source="media/user-assigned-identity-multiple-services.png" alt-text="A diagram showing the user assigned identity relationships.":::

The following steps demonstrate how to create and configure a user-assigned managed identity and your local development account to connect to multiple Azure Services.

### 1) Create a user-assigned managed identity

1) In the Azure Portal search bar, enter *Managed Identities* and select the matching result.

2) On the managed identities overview page, select **+ Create**.

3) On the **Create User Assigned Managed Identity** page, select the subscription, resource group, and region that should contain your new managed identity. Enter a meaningful name for the identity as well. 

    :::image type="content" source="media/create-managed-identity.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-add-role.png":::

4) Select **Review + create** and then select **Create** after Azure has validated your inputs.

5) Once the resource has been created, select **Go to resource** to view the details of the user-assigned managed identity.

### 2) Assign roles to the managed identity for each connected service
    
1) Navigate to the overview page of the storage account you would like to grant access your identity access to.

3) Select **Access Control (IAM)** from the storage account navigation.

4) Choose **Add role assignment**

    :::image type="content" source="media/assign-identity-app-service.png" alt-text="A screenshot showing how to assign a system assigned managed identity."  lightbox="media/migration-add-role.png":::

5) In the **Role** search box, search for *Storage Blob Data Contributor*, which is a common role used to manage data operations for blobs. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

6) On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

7) In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

    :::image type="content" source="media/migration-select-identity.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/migration-select-identity-role.png":::

8) Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

9) Repeat the preceding role assignment steps for any additional storage accounts you would like to grant your identity access to.

#### Local development considerations

You can also enable access to Azure resources for local development by assigning roles to a user account the same way you assigned roles to your managed identity. 

1) After assigning the **Storage Blob Data Contributor** role to your managed identity,  under **Assign access to**, this time select **User, group or service principal**. Choose **+ Select members** to open the flyout menu again.

2) Search for the user account or Azure AD security group you would like to grant access to by email address or name, and then select it. This should be the same account you use to sign-in to your local development tooling with, such as Visual Studio or the Azure CLI.

    :::image type="content" source="media/migration-select-identity.png" alt-text="A screenshot showing how to create a system assigned managed identity."  lightbox="media/local-dev-assign-user.png":::

> [!NOTE]
> You can also assign these roles to an Azure Active Directory security group if you are working on a team with multiple developers. You can then place any developer inside that group who needs access to develop the app locally.

### 3) Associate the managed identity with the app services

Now that you have assigned roles to your managed identity, you must associate that identity with the app service hosting your app. The app will use the managed identity to authenticate to other services, such as a storage account.

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

## Additional multi-service managed identity scenarios

Although the apps in the previous example all shared the same service access requirements, real environments are often more nuanced. Consider a scenario where multiple apps share some of the same access goals, but also have individual or more granular requirements. Applications support multiple user-assigned managed identities to handle these requirements.

:::image type="content" source="media/multiple-managed-identities.png" alt-text="A diagram showing multiple user-assigned managed identities.":::

To configure this setup in your code, make sure your application registers separate services to connect to each storage account. Make sure to pull in the correct managed identity client ids when configuring `DefaultAzureCredential`. The following code example configures services that access two storage accounts for product receipts and sales contracts.

```csharp
// First blob storage client that manages receipts
var clientIDReceipts = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID_Receipts");
var receiptCreds = new DefaultAzureCredentialOptions()
{
    ManagedIdentityClientId = clientIDReceipts
};

BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri("https://<receipt-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential(receiptCreds));

// Second blob storage client that manages contracts
var clientIDContracts = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID_Contracts");
var contractCreds = new DefaultAzureCredentialOptions()
{
    ManagedIdentityClientId = clientIDContracts
};

BlobServiceClient blobServiceClient2 = new BlobServiceClient(
    new Uri("https://<contract-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential(contractCreds));
```

You can also associate both a user-assigned managed identity as well as a system-assigned managed identity to a resource. This can be useful in scenarios where all of the apps  require access to the same resources, but one of the apps has a very specific dependency on an additional service. Using a system-assigned identity also ensures that the identity tied to that specific app is deleted when the app is deleted, which can help keep your environment clean.

:::image type="content" source="media/user-and-system-assigned-identities.png" alt-text="A diagram showing multiple user-assigned managed identities.":::

These types of scenarios are explored in more depth in the [identities best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Next steps

In this tutorial, you learned how to migrate an application to credential-free connections. You can read the following resources to explore the concepts discussed in this article in more depth:

- For more information on authorizing access with managed identity, visit [Authorize access to blob data with managed identities for Azure resources](https://docs.microsoft.com/en-us/azure/storage/blobs/authorize-managed-identity).
-[Authorize with Azure roles](/azure/storage/blobs/authorize-access-azure-active-directory)
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
- To learn more about authorizing from a web application, visit [Authorize from a native or web application](/azure/storage/common/storage-auth-aad-app)