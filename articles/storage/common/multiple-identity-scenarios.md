---
title: Configure passwordless connections between multiple services
titleSuffix: Azure Storage
description: Learn to work with user-assigned managed identities to configure passwordless connections between multiple Azure services.
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: how-to
ms.date: 08/01/2022
ms.author: alexwolf
ms.subservice: common
ms.custom: devx-track-csharp
---

# Configure passwordless connections between multiple Azure apps and services

Applications often require secure connections between multiple Azure services simultaneously. For example, an enterprise Azure App Service instance might connect to several different storage accounts, an Azure SQL database instance, a service bus, and more. 

[Managed identities](/azure/active-directory/managed-identities-azure-resources/overview) are the recommended authentication option for secure, passwordless connections between Azure resources. Developers do not have to manually track and manage many different secrets for managed identities, since most of these tasks are handled internally by Azure. This tutorial explores how to manage connections between multiple services using managed identities and the Azure Identity client library.

## Compare the types of managed identities

Azure provides the following types of managed identities:

* **System-assigned managed identities** are directly tied to a single Azure resource. When you enable a system-assigned managed identity on a service, Azure will create a linked identity and handle administrative tasks for that identity internally. When the Azure resource is deleted, the identity is also deleted. 
* **User-assigned managed identities** are independent identities that are created by an administrator and can be associated with one or more Azure resources. The lifecycle of the identity is independent of those resources. 

You can read more about best practices and when to use system-assigned identities versus user-assigned identities in the [identities best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Explore DefaultAzureCredential

Managed identities are generally implemented in your application code through a class called `DefaultAzureCredential` from the `Azure.Identity` client library. `DefaultAzureCredential` supports multiple authentication methods and automatically determines which should be used at runtime. You can read more about this approach in the [DefaultAzureCredential overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential). 

## Connect an Azure hosted app to multiple Azure services

You have been tasked with connecting an existing app to multiple Azure services and databases using passwordless connections. The application is an ASP.NET Core Web API hosted on Azure App Service, though the steps below apply to other Azure hosting environments as well, such as Azure Spring Apps, Virtual Machines, Container Apps and AKS.

This tutorial applies to the following architectures, though it can be adapted to many other scenarios as well through minimal configuration changes.

:::image type="content" source="media/architecture-diagram-multiple-services-small.png" alt-text="A diagram showing the user assigned identity relationships." lightbox="media/architecture-diagram-multiple-services.png":::

The following steps demonstrate how to configure an app to use a system-assigned managed identity and your local development account to connect to multiple Azure Services. 

### Create a system-assigned managed identity

1) In the Azure portal, navigate to the hosted application that you would like to connect to other services.

2) On the service overview page, select **Identity**.

3) Toggle the **Status** setting to **On** to enable a system assigned managed identity for the service.

    :::image type="content" source="media/enable-system-assigned-identity.png" alt-text="A screenshot showing how to assign a system assigned managed identity."  :::

### Assign roles to the managed identity for each connected service
    
1) Navigate to the overview page of the storage account you would like to grant access your identity access to.

3) Select **Access Control (IAM)** from the storage account navigation.

4) Choose **+ Add** and then **Add role assignment**.

    :::image type="content" source="media/assign-role-system-identity.png" alt-text="A screenshot showing how to assign a system-assigned identity."  :::

5) In the **Role** search box, search for *Storage Blob Data Contributor*,  which grants permissions to perform read and write operations on blob data. You can assign whatever role is appropriate for your use case. Select the *Storage Blob Data Contributor* from the list and choose **Next**.

6) On the **Add role assignment** screen, for the **Assign access to** option, select **Managed identity**. Then choose **+Select members**.

7) In the flyout, search for the managed identity you created by entering the name of your app service. Select the system assigned identity, and then choose **Select** to close the flyout menu.

    :::image type="content" source="media/migration-select-identity.png" alt-text="A screenshot showing how to select a system-assigned identity."  :::

8) Select **Next** a couple times until you're able to select **Review + assign** to finish the role assignment.

9) Repeat this process for the other services you would like to connect to.

#### Local development considerations

You can also enable access to Azure resources for local development by assigning roles to a user account the same way you assigned roles to your managed identity. 

1) After assigning the **Storage Blob Data Contributor** role to your managed identity,  under **Assign access to**, this time select **User, group or service principal**. Choose **+ Select members** to open the flyout menu again.

2) Search for the *user@domain* account or Azure AD security group you would like to grant access to by email address or name, and then select it. This should be the same account you use to sign-in to your local development tooling with, such as Visual Studio or the Azure CLI.

> [!NOTE]
> You can also assign these roles to an Azure Active Directory security group if you are working on a team with multiple developers. You can then place any developer inside that group who needs access to develop the app locally.

### Implement the application code

Inside of your project, add a reference to the `Azure.Identity` NuGet package. This library contains all of the necessary entities to implement `DefaultAzureCredential`. You can also add any other Azure libraries that are relevant to your app. For this example, the `Azure.Storage.Blobs` and `Azure.KeyVault.Keys` packages are added in order to connect to Blob Storage and Key Vault.

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Azure.Storage.Blobs
dotnet add package Azure.KeyVault.Keys
```

At the top of your `Program.cs` file, add the following using statements:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Security.KeyVault.Keys;
```

In the `Program.cs` file of your project code, create instances of the necessary services your app will connect to. The following examples connect to Blob Storage and service bus using the corresponding SDK classes.

```csharp
var blobServiceClient = new BlobServiceClient(
    new Uri("https://<your-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential(credOptions));

var serviceBusClient = new ServiceBusClient("<your-namespace>", new DefaultAzureCredential());
var sender = serviceBusClient.CreateSender("producttracking");
```

When this application code runs locally, `DefaultAzureCredential` will search down a credential chain for the first available credentials. If the `Managed_Identity_Client_ID` is null locally, it will automatically use the credentials from your local Azure CLI or Visual Studio sign-in. You can read more about this process in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential).

When the application is deployed to Azure, `DefaultAzureCredential` will automatically retrieve the `Managed_Identity_Client_ID` variable from the app service environment. That value becomes available when a managed identity is associated with your app.

This overall process ensures that your app can run securely locally and in Azure without the need for any code changes.

## Connect multiple apps using multiple managed identities

Although the apps in the previous example all shared the same service access requirements, real environments are often more nuanced. Consider a scenario where multiple apps all connect to the same storage accounts, but two of the apps also access different services or databases.

:::image type="content" source="media/multiple-managed-identities-small.png" lightbox="media/multiple-managed-identities.png" alt-text="A diagram showing multiple user-assigned managed identities.":::

To configure this setup in your code, make sure your application registers separate services to connect to each storage account or database. Make sure to pull in the correct managed identity client IDs for each service when configuring `DefaultAzureCredential`. The following code example configures the following service connections:
* Two connections to separate storage accounts using a shared user-assigned managed identity
* A connection to Azure Cosmos DB and Azure SQL services using a second shared user-assigned managed identity

```csharp
// Get the first user-assigned managed identity ID to connect to shared storage
var clientIDstorage = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID_Storage");

// First blob storage client that using a managed identity
BlobServiceClient blobServiceClient = new BlobServiceClient(
    new Uri("https://<receipt-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential()
    {
        ManagedIdentityClientId = clientIDstorage
    });

// Second blob storage client that using a managed identity
BlobServiceClient blobServiceClient2 = new BlobServiceClient(
    new Uri("https://<contract-storage-account>.blob.core.windows.net"),
    new DefaultAzureCredential()
{
        ManagedIdentityClientId = clientIDstorage
    });


// Get the second user-assigned managed identity ID to connect to shared databases
var clientIDdatabases = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID_Databases");

// Create a Cosmos DB client
CosmosClient client = new CosmosClient(
    accountEndpoint: Environment.GetEnvironmentVariable("COSMOS_ENDPOINT", EnvironmentVariableTarget.Process),
    new DefaultAzureCredential()
    {
        ManagedIdentityClientId = clientIDdatabases
    });

// Open a connection to Azure SQL using a managed identity
string ConnectionString1 = @"Server=<azure-sql-hostname>.database.windows.net; User Id=ObjectIdOfManagedIdentity; Authentication=Active Directory Default; Database=<database-name>";

using (SqlConnection conn = new SqlConnection(ConnectionString1))
{
    conn.Open();
}

```

You can also associate a user-assigned managed identity as well as a system-assigned managed identity to a resource simultaneously. This can be useful in scenarios where all of the apps require access to the same shared services, but one of the apps also has a very specific dependency on an additional service. Using a system-assigned identity also ensures that the identity tied to that specific app is deleted when the app is deleted, which can help keep your environment clean.

:::image type="content" lightbox="media/user-and-system-assigned-identities-small.png" source="media/user-and-system-assigned-identities.png" alt-text="A diagram showing user-assigned and system-assigned managed identities.":::

These types of scenarios are explored in more depth in the [identities best practice recommendations](/azure/active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections. You can read the following resources to explore the concepts discussed in this article in more depth:

- For more information on authorizing access with managed identity, visit [Authorize access to blob data with managed identities for Azure resources](/azure/storage/blobs/authorize-managed-identity).
-[Authorize with Azure roles](/azure/storage/blobs/authorize-access-azure-active-directory)
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
- To learn more about authorizing from a web application, visit [Authorize from a native or web application](/azure/storage/common/storage-auth-aad-app)