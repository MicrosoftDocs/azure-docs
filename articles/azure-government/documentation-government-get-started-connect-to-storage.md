---
title: Develop with Storage API on Azure Government
description: Guidance for getting started with Storage on Azure Government
ms.service: azure-government
ms.topic: article
author: yujhongmicrosoft
ms.author: eliotgra
ms.date: 10/16/2024
---

# Develop with Storage API on Azure Government

Azure Government uses the same underlying technologies as commercial Azure, enabling you to use the development tools you're already familiar with. If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.

## Prerequisites

- Review [Guidance for developers](./documentation-government-developer-guide.md). This article discusses Azure Government's unique URLs and endpoints for managing your environment. You must know about these endpoints to connect to Azure Government.
- Review [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md) and click on a service of interest to see variations between Azure Government and global Azure.
- Download and install the latest version of [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). 

## Connecting Storage Explorer to Azure Government
The [Microsoft Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) is a cross-platform tool for working with Azure Storage. Government customers can now take advantage of all the latest features of the Azure Storage Explorer such as creating and managing blobs, queues, tables, and file shares.

### Getting Started with Storage Explorer
1. Open the Azure Storage Explorer desktop application.

2. You'll be prompted to add an Azure account; in the dropdown choose the "Azure US Government" option:

    ![storage1](./media/documentation-government-get-started-connect-with-storage-img1.png)
3. Sign in to your Azure Government account and you can see all of your resources. The Storage Explorer should look similar to the screenshot below. Click on your Storage Account to see the blob containers, file shares, Queues, and Tables. 

    ![storage2](./media/documentation-government-get-started-connect-with-storage-img2.png)

For more information about Azure Storage Explorer, see [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md).

## Connecting to the Storage API 

### Prerequisites

- Have an active Azure Government subscription. If you don't have an Azure Government subscription, create a [free account](https://azure.microsoft.com/global-infrastructure/government/request/) before you begin.
- Download Visual Studio 2019.

### Getting Started with Storage API

One important difference to remember when connecting with the Storage API is that the URL for storage in Azure Government is different than the URL for storage in commercial Azure. Specifically, the domain ends with `core.usgovcloudapi.net`, rather than `core.windows.net`. These endpoint differences must be taken into account when you connect to storage in Azure Government with a client library.

Application requests to Azure Storage must be authorized. Using the `DefaultAzureCredential` class provided by the Azure Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code.

You can also authorize requests to Azure Storage by using the account access key. However, this approach should be used with caution. Developers must be diligent to never expose the access key in an unsecure location. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication. Both options are demonstrated in the following examples.

#### C#/.NET

Open Visual Studio and create a new project. Add a reference to the [Azure Tables client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/tables/Azure.Data.Tables). This package contains classes for connecting to your Storage Table account.

#### [Passwordless (recommended)](#tab/passwordless)

An easy and secure way to authorize access and connect to Azure Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) instance. You can then use that credential to create a `TableServiceClient` object, as shown in the following code example:

```csharp
var credentialOptions = new DefaultAzureCredentialOptions()
{
    AuthorityHost = AzureAuthorityHosts.AzureGovernment,
};

var credential = new DefaultAzureCredential(credentialOptions);
var storageTableUri = Environment.GetEnvironmentVariable("STORAGE_TABLE_URI");
var tableServiceClient = new TableServiceClient(
    new Uri(storageTableUri)
    credential);   
```

To learn more about authorizing access to data in Azure Storage, see [Authenticate to Azure and authorize access to data](../../articles/storage/blobs/storage-quickstart-blobs-dotnet.md#authenticate-to-azure-and-authorize-access-to-blob-data).

#### [Connection string](#tab/connectionstring)

Add these lines of C# code to connect using a connection string:

```csharp
var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");
var tableServiceClient = new TableServiceClient(connectionString);   
```

You can also connect using an account key, as shown in the following code example:

```csharp
var credentials = new TableSharedKeyCredential(
    storageAccountName, 
    Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_KEY"));
var storageTableUri = Environment.GetEnvironmentVariable("STORAGE_TABLE_URI");
var tableServiceClient = new TableServiceClient(new Uri(storageTableUri), credentials);   
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

At this point, we can interact with Storage as we normally would. The following example shows how to retrieve a specific entity from Table Storage:

```csharp
var tableClient = tableServiceClient.GetTableClient("Contacts");
ContactEntity contact = tableClient.GetEntity<ContactEntity>("gov-partition-test", "0abc123e-1111-1a2b-3c4d-fghi5678j9k0");
Console.WriteLine($"Contact: {contact.FirstName} {contact.LastName}");
```

#### Java

Download the [Azure Tables client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/tables/azure-data-tables) and configure your project correctly.

#### [Passwordless (recommended)](#tab/passwordless)

An easy and secure way to authorize access and connect to Azure Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/java/api/overview/azure/identity-readme#defaultazurecredential) instance. You can then use that credential to create a `TableServiceClient` object, as shown in the following code example:

```java
import com.azure.data.tables.implementation.ModelHelper;
import com.azure.data.tables.models.*;
import java.util.HashMap;
public class test {
    public static final String storageConnectionString = System.getEnv("AZURE_STORAGE_CONNECTION_STRING");
    public static void main(String[] args) {
    try
    {
        DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
            .authorityHost("https://management.usgovcloudapi.net/.default")
            .build();

        // Create the table service client.
        TableServiceClient tableServiceClient = new TableServiceClientBuilder()
            .endpoint("https://<storage-account-name>.table.core.usgovcloudapi.net/")
            .credential(credential)
            .buildClient();

        // Create the table if it doesn't exist.
        String tableName = "Contacts";
        TableClient tableClient = tableServiceClient.createTableIfNotExists(tableName);
        // Create a new customer entity.
        TableEntity customer1 = ModelHelper.createEntity(new HashMap<String, Object>() {{
            put("PartitionKey", "Brown");
            put("RowKey", "Walter");
            put("Email", "Walter@contoso.com");
        }});
        // Insert table entry into table
        tableClient.createEntity(customer1);
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }
    }
}
```

To learn more about authorizing access to data in Azure Storage, see [Authenticate to Azure and authorize access to data](../../articles/storage/blobs/storage-quickstart-blobs-java.md#authenticate-to-azure-and-authorize-access-to-blob-data).

#### [Connection string](#tab/connectionstring)

Create a "test" class where we'll access Azure Table Storage using the Azure Tables client library.

Copy and paste the code below, and **paste** your Storage Account connection string into the `AZURE_STORAGE_CONNECTION_STRING` environment variable. 

```java
import com.azure.data.tables.implementation.ModelHelper;
import com.azure.data.tables.models.*;
import java.util.HashMap;
public class test {
    public static final String storageConnectionString = System.getEnv("AZURE_STORAGE_CONNECTION_STRING");
    public static void main(String[] args) {
    try
    {
        // Create the table service client.
        TableServiceClient tableServiceClient = new TableServiceClientBuilder()
            .connectionString(storageConnectionString)
            .buildClient();
        // Create the table if it doesn't exist.
        String tableName = "Contacts";
        TableClient tableClient = tableServiceClient.createTableIfNotExists(tableName);
        // Create a new customer entity.
        TableEntity customer1 = ModelHelper.createEntity(new HashMap<String, Object>() {{
            put("PartitionKey", "Brown");
            put("RowKey", "Walter");
            put("Email", "Walter@contoso.com");
        }});
        // Insert table entry into table
        tableClient.createEntity(customer1);
    }
    catch (Exception e)
    {
        // Output the stack trace.
        e.printStackTrace();
    }
    }
}
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

#### Node.js

Download the [Azure Storage Blob client library for Node.js](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob) and configure your application correctly.

#### [Passwordless (recommended)](#tab/passwordless)

An easy and secure way to authorize access and connect to Azure Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/javascript/api/overview/azure/identity-readme#defaultazurecredential) instance. You can then use that credential to create a `BlobServiceClient` object, as shown in the following code example:

```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
const {
 DefaultAzureCredential,
 DefaultAzureCredentialOptions,
 AzureAuthorityHosts
} = require('@azure/identity');

const credentialOptions = new DefaultAzureCredentialOptions(
  { 
    authorityHost: AzureAuthorityHosts.AzureGovernment
  }
);

const blobServiceClient = new BlobServiceClient(
  `https://<storage-account-name>.blob.core.usgovcloudapi.net`,
  new DefaultAzureCredential(credentialOptions)
);

var containerClient = blobServiceClient.getContainerClient('testing');
containerClient.createIfNotExists();
```

To learn more about authorizing access to data in Azure Storage, see [Authenticate to Azure and authorize access to data](../../articles/storage/blobs/storage-quickstart-blobs-nodejs.md#authenticate-to-azure-and-authorize-access-to-blob-data).

#### [Connection string](#tab/connectionstring)

The following code below connects to Azure Blob Storage and creates a Container using the Azure Storage API. 
**Paste** your Azure Storage account connection string into the `AZURE_STORAGE_CONNECTION_STRING` environment variable. 

```javascript
var { BlobServiceClient } = require("@azure/storage-blob");
var storageConnectionString = process.env["AZURE_STORAGE_CONNECTION_STRING"];
var blobServiceClient = BlobServiceClient.fromConnectionString(storageConnectionString);
var containerClient = blobServiceClient.getContainerClient('testing');
containerClient.createIfNotExists();
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

#### Python

Download the [Azure Storage Blob client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/storage/azure-storage-blob).

#### [Passwordless (recommended)](#tab/passwordless)

An easy and secure way to authorize access and connect to Azure Storage is to obtain an OAuth token by creating a [DefaultAzureCredential](/python/api/overview/azure/identity-readme#defaultazurecredential) instance. You can then use that credential to create a `BlobServiceClient` object, as shown in the following code example:

```python
from azure.identity import DefaultAzureCredential, AzureAuthorityHosts
from azure.storage.blob import BlobServiceClient

credential = DefaultAzureCredential(authority=AzureAuthorityHosts.AZURE_GOVERNMENT)

blob_service_client = BlobServiceClient("https://<storage-account-name>.blob.core.usgovcloudapi.net", credential=credential)

container_name ="<container-name>"
container = blob_service_client.get_container_client(container=container_name)
generator = container.list_blobs()
for blob in generator:
    print("\t Blob name: " + blob.name)
```

To learn more about authorizing access to data in Azure Storage, see [Authenticate to Azure and authorize access to data](../../articles/storage/blobs/storage-quickstart-blobs-python.md#authenticate-to-azure-and-authorize-access-to-blob-data).

#### [Connection string](#tab/connectionstring)

When using the Storage library for Python to connect to Azure Government, paste your Azure storage connection string in the `AZURE_STORAGE_CONNECTION_STRING` environment variable.
    
```python
# Create the BlobServiceClient that is used to call the Blob service for the storage account
connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
blob_service_client = BlobServiceClient.from_connection_string(conn_str=connection_string)
container_name ="<container-name>"
container = blob_service_client.get_container_client(container=container_name)
generator = container.list_blobs()
for blob in generator:
    print("\t Blob name: " + blob.name)
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

## Next steps

- Read more about [Azure Storage](../storage/index.yml). 
- Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
- Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
