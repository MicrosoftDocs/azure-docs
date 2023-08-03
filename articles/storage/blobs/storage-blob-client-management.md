---
title: Create and manage clients that interact with data resources
titleSuffix: Azure Storage 
description: Learn how to create and manage clients that interact with data resources in Blob Storage.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.topic: how-to
ms.date: 02/08/2023
ms.author: pauljewell
ms.devlang: csharp, java, javascript, python
ms.custom: devguide-csharp, devguide-java, devguide-javascript, devguide-python
---

# Create and manage client objects that interact with data resources

The Azure SDKs are collections of libraries built to make it easier to use Azure services from different languages. The SDKs are designed to simplify interactions between your application and Azure resources. Working with Azure resources using the SDK begins with creating a client instance. This article shows how to create client objects to interact with data resources in Azure Blob Storage, and offers best practices on how to manage clients in your application.

## About client objects

The Azure Blob Storage client libraries allow you to interact with three types of resources in the storage service:

- Storage accounts
- Blob containers
- Blobs

Depending on the needs of your application, you can create client objects at any of these three levels. 

For blobs, there's a general blob client that covers common blob operations across all types, and there are specialized blob clients for each type (block blob, append blob, and page blob).

The following table lists the different client classes for each language:

| Language | Packages | Service client class | Container client class | Blob client classes |
| --- | --- | --- | --- | --- |
| .NET | [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs)<br>[Azure.Storage.Blobs.Models](/dotnet/api/azure.storage.blobs.models)<br>[Azure.Storage.Blobs.Specialized](/dotnet/api/azure.storage.blobs.specialized) | [BlobServiceClient](/dotnet/api/azure.storage.blobs.blobserviceclient) | [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) | [BlobClient](/dotnet/api/azure.storage.blobs.blobclient)<br>[BlockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient)<br>[AppendBlobClient](/dotnet/api/azure.storage.blobs.specialized.appendblobclient)<br>[PageBlobClient](/dotnet/api/azure.storage.blobs.specialized.pageblobclient) |
| Java | [com.azure.storage.blob](/java/api/com.azure.storage.blob)<br>[com.azure.storage.blob.models](/java/api/com.azure.storage.blob.models)<br>[com.azure.storage.blob.specialized](/java/api/com.azure.storage.blob.specialized) | [BlobServiceClient](/java/api/com.azure.storage.blob.blobserviceclient)<br>[BlobServiceAsyncClient](/java/api/com.azure.storage.blob.blobserviceasyncclient)<br>[BlobServiceClientBuilder](/java/api/com.azure.storage.blob.blobserviceclientbuilder) | [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient)<br>[BlobContainerAsyncClient](/java/api/com.azure.storage.blob.blobcontainerasyncclient)<br>[BlobContainerClientBuilder](/java/api/com.azure.storage.blob.blobcontainerclientbuilder) | [BlobClient](/java/api/com.azure.storage.blob.blobclient)<br>[BlobAsyncClient](/java/api/com.azure.storage.blob.blobasyncclient)<br>[BlobClientBuilder](/java/api/com.azure.storage.blob.blobclientbuilder)<br>[BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient)<br>[AppendBlobClient](/java/api/com.azure.storage.blob.specialized.appendblobclient)<br>[PageBlobClient](/java/api/com.azure.storage.blob.specialized.pageblobclient) |
| JavaScript | [@azure/storage-blob](/javascript/api/overview/azure/storage-blob-readme) | [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) | [ContainerClient](/javascript/api/@azure/storage-blob/containerclient) | [BlobClient](/javascript/api/@azure/storage-blob/blobclient)<br>[BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient)<br>[AppendBlobClient](/javascript/api/@azure/storage-blob/appendblobclient)<br>[PageBlobClient](/javascript/api/@azure/storage-blob/pageblobclient) |
| Python | [azure.storage.blob](/python/api/azure-storage-blob/azure.storage.blob) | [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) | [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) | [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient)<sup>1 |

<sup>1</sup> For Python, `BlobClient` includes methods for specialized blob types.

Each client type can be instantiated by calling a simple constructor, or an overload that takes various configuration options. For Java, each client type has a separate class which provides a builder API to help with configuration and instantiation. Depending on the language SDK, these client configuration options are passed to the constructor in different ways. See the class reference from the table for details.

## Authorize a client object

For an app to access blob resources and interact with them, a client object must be authorized. The code samples in this article use [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) to authenticate to Azure via an Azure Active Directory (Azure AD) security principal. The authentication process includes obtaining an access token for authorization. This access token is passed as a credential when the client is instantiated, and the credential persists throughout the client lifetime. The Azure AD security principal requesting the token must be assigned an appropriate Azure RBAC role that grants access to blob data. To learn more, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

The following authorization mechanisms can be used to grant the appropriate level of access to a client object:
- [Azure AD](authorize-access-azure-active-directory.md): recommended for optimal security
- [Shared access signature (SAS)](../common/storage-sas-overview.md): supported, and most secure when using a user delegation SAS token
- [Account access key (Shared Key)](/rest/api/storageservices/authorize-with-shared-key): supported, but not recommended as it can be less secure

To learn more about authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

## Create a client object

Working with any Azure resource using the SDK begins with creating a client object. In this section, you learn how to create client objects to interact with the three types of resources in the storage service: storage accounts, containers, and blobs.

When your application creates a client object, you pass a URI referencing the endpoint to the client constructor. You can construct the endpoint string manually, as shown in the examples in this article, or you can query for the endpoint at runtime using the Azure Storage management library. To learn how to query for an endpoint, see [Query for a Blob Storage endpoint](storage-blob-query-endpoint-srp.md).

### Create a BlobServiceClient object

An authorized `BlobServiceClient` object allows your app to interact with resources at the storage account level. `BlobServiceClient` provides methods to retrieve and configure account properties, as well as list, create, and delete containers within the storage account. This client object is the starting point for interacting with resources in the storage account.

A common scenario is to instantiate a single service client, then create container clients and blob clients from the service client, as needed. To work with a specific container or blob, you can use the `BlobServiceClient` object to create a [container client](#create-a-blobcontainerclient-object) or [blob client](#create-a-blobclient-object). Clients created from a `BlobServiceClient` will inherit its client configuration, including client options and credentials.

The following examples show how to create a `BlobServiceClient` object:

## [.NET](#tab/dotnet)

Add the following `using` directives:

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;
```

Add the following code to create the client object:

```csharp
public BlobServiceClient GetBlobServiceClient(string accountName)
{
    BlobServiceClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net"),
        new DefaultAzureCredential());

    return client;
}
```

## [Java](#tab/java)

Add the following `import` directives:

```java
import com.azure.identity.*;
import com.azure.storage.blob.*;
```

Add the following code to create the client object:

```java
public BlobServiceClient GetBlobServiceClient(String accountName) {
    String endpointString = String.format("https://%s.blob.core.windows.net", accountName);
    BlobServiceClient client = new BlobServiceClientBuilder()
            .endpoint(endpointString)
            .credential(new DefaultAzureCredentialBuilder().build())
            .buildClient();

    return client;
}
```

## [JavaScript](#tab/javascript)

Add the following `require` statements:

```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
```

Add the following code to create the client object:

```javascript
const accountName = "<storage-account-name>";

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new DefaultAzureCredential()
);
```

## [Python](#tab/python)

Add the following `import` statements:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient
```

Add the following code to create the client object:

```python
def get_blob_service_client(self, account_name):
    account_url = f"https://{account_name}.blob.core.windows.net"
    credential = DefaultAzureCredential()

    # Create the BlobServiceClient object
    blob_service_client = BlobServiceClient(account_url, credential=credential)

    return blob_service_client
```

---

### Create a BlobContainerClient object

 You can use a `BlobServiceClient` object to create a new `BlobContainerClient` object (`ContainerClient` for JavaScript and Python). A `BlobContainerClient` object allows you to interact with a specific container resource. This resource doesn't need to exist in the storage account for you to create the client object. `BlobContainerClient` provides methods to create, delete, or configure a container, and includes methods to list, upload, and delete the blobs within it. To perform operations on a specific blob within the container, you can [create a blob client](#create-a-blobclient-object).

The following examples show how to create a container client from a `BlobServiceClient` object to interact with a specific container resource:

## [.NET](#tab/dotnet)

```csharp
public BlobContainerClient GetBlobContainerClient(
    BlobServiceClient blobServiceClient,
    string containerName)
{
    // Create the container client using the service client object
    BlobContainerClient client = blobServiceClient.GetBlobContainerClient(containerName);
    return client;
}
```

## [Java](#tab/java)

```java
public BlobContainerClient getBlobContainerClient(
        BlobServiceClient blobServiceClient,
        String containerName) {
    // Create the container client using the service client object
    BlobContainerClient client = blobServiceClient.getBlobContainerClient(containerName);
    return client;
}
```

## [JavaScript](#tab/javascript)

```javascript
const containerName = "sample-container";
let containerClient = blobServiceClient.getContainerClient(containerName);
```

## [Python](#tab/python)

```python
def get_blob_container_client(self, blob_service_client: BlobServiceClient, container_name):
    container_client = blob_service_client.get_container_client(container=container_name)
    return container_client
```

---

If your work is narrowly scoped to a single container, you might choose to create a `BlobContainerClient` object directly without using `BlobServiceClient`. You can still set client options on a container client just like you would on a service client.

The following examples show how to create a container client directly *without* using `BlobServiceClient`:

## [.NET](#tab/dotnet)

```csharp
public BlobContainerClient GetBlobContainerClient(
    string accountName,
    string containerName,
    BlobClientOptions clientOptions)
{
    // Append the container name to the end of the URI
    BlobContainerClient client = new(
        new Uri($"https://{accountName}.blob.core.windows.net/{containerName}"),
        new DefaultAzureCredential(),
        clientOptions);

    return client;
}
```

## [Java](#tab/java)

```java
public BlobContainerClient getBlobContainerClient(
        String accountName,
        String containerName) {
    // Append the container name to the URI
    String endpointString = String.format("https://%s.blob.core.windows.net/%s",
            accountName, containerName);

    BlobContainerClient client = new BlobContainerClientBuilder()
            .endpoint(endpointString)
            .credential(new DefaultAzureCredentialBuilder().build())
            .buildClient();

    return client;
}
```

## [JavaScript](#tab/javascript)

```javascript
const accountName = "<storage-account-name>";
const containerName = "sample-container";

// Append the container name to the URI
const containerClient = new ContainerClient(
    `https://${accountName}.blob.core.windows.net/${containerName}`,
    new DefaultAzureCredential()
```

## [Python](#tab/python)

```python
def get_blob_container_client(self, account_name, container_name):
    # Append the container name to the URI
    account_url = f"https://{account_name}.blob.core.windows.net/{container_name}"
    credential = DefaultAzureCredential()

    # Create the client object
    container_client = ContainerClient(account_url, credential=credential)

    return container_client
```

---

### Create a BlobClient object

To interact with a specific blob resource, create a `BlobClient` object from a service client or container client. A `BlobClient` object allows you to interact with a specific blob resource. This resource doesn't need to exist in the storage account for you to create the client object. `BlobClient` provides methods to upload, download, delete, and create snapshots of a blob.

The following examples show how to create a blob client to interact with a specific blob resource:

## [.NET](#tab/dotnet)

```csharp
public BlobClient GetBlobClient(
    BlobServiceClient blobServiceClient,
    string containerName,
    string blobName)
{
    BlobClient client =
        blobServiceClient.GetBlobContainerClient(containerName).GetBlobClient(blobName);
    return client;
}
```

## [Java](#tab/java)

```java
public BlobClient getBlobClient(
        BlobServiceClient blobServiceClient,
        String containerName,
        String blobName) {
    // Create a blob client using the service client object
    BlobClient client = blobServiceClient.getBlobContainerClient(containerName).getBlobClient(blobName);
    return client;
}
```

## [JavaScript](#tab/javascript)

```javascript
const containerName = "sample-container";
const blobName = "sample-blob";
let blobClient = blobServiceClient.getContainerClient(containerName).getBlobClient(blobName);
```

## [Python](#tab/python)

```python
def get_blob_client(self, blob_service_client: BlobServiceClient, container_name, blob_name):
    # Create a blob client using the service client object
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    return blob_client
```

---

## Manage client objects

A best practice for Azure SDK client management is to treat a client as a singleton, meaning that a class will only have one object at a time. There's no need to keep more than one instance of a client for a given set of constructor parameters or client options. This concept can be implemented in many ways, including:

- Creating a single client object and passing it as a parameter throughout the application. This approach is shown in the code examples in this article.
- Storing a client instance in a field. To learn more about C# fields, see [Fields (C# Programming Guide)](/dotnet/csharp/programming-guide/classes-and-structs/fields).
- Registering the client object as a singleton in a dependency injection container of your choice. For more information on dependency injection in ASP.NET Core apps, see [Dependency injection with the Azure SDK for .NET](/dotnet/azure/sdk/dependency-injection).

This approach is far more efficient at scale than calling a constructor for each client that you need.

### Client immutability and thread safety

Azure SDK clients are immutable after they're created, which means that you can't change the endpoint it connects to, the credential used for authorization, or other values passed in as client options. Client immutability also means that clients are safe to share and reuse throughout the application.

If your app needs to use different configurations or credentials for clients of the same type, you can instantiate a client for each set of configuration options.

The Azure SDK guarantees that all client instance methods are thread-safe and independent of each other. This design ensures that sharing and reusing client instances is always safe, even across threads.

## Next steps

To learn more about using the Azure Storage client libraries to work with data resources, see the following articles:
- [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)
- [Get started with Azure Blob Storage and Java](storage-blob-java-get-started.md)
- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md)