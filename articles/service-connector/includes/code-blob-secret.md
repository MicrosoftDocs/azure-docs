---
author: yungezz
ms.service: service-connector
ms.topic: include
ms.date: 10/20/2023
ms.author: yungezz
---


### [.NET](#tab/dotnet)

Get blob storage connection string from the environment variable added by Service Connector.

Install dependencies
```bash
dotnet add package Azure.Storage.Blob
```

```csharp
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using System; 

// get blob connection string
var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CONNECTIONSTRING");

// Create a BlobServiceClient object 
var blobServiceClient = new BlobServiceClient(connectionString);
```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-storage-blob</artifactId>
    </dependency>
    ```
1. Get the connection string from the environment variable to connect to the blob storage:

    ```java
    String connectionStr = System.getenv("AZURE_STORAGEBLOB_CONNECTIONSTRING");
    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .connectionString(connectionStr)
        .buildClient();
    ```


### [Python](#tab/python)
1. Install dependencies
   ```bash
   pip install azure-storage-blob
   ```
1. Get blob storage connection string from the environment variable added by Service Connector.
   ```python
   from azure.storage.blob import BlobServiceClient
   import os
   
   connection_str = os.getenv('AZURE_STORAGEBLOB_CONNECTIONSTRING')

   blob_service_client = BlobServiceClient.from_connection_string(connection_str)
   ```

### [Django](#tab/django)
1. Install dependencies.
   ```bash
   pip install django-storages[azure]
   ```

1. Configure and set up the Azure Blob Storage backend in your Django settings file accordingly to your django version. For more information, see [django-storages[azure]](https://django-storages.readthedocs.io/en/latest/backends/azure.html#configuration-settings).

1. In setting file, add following lines.
   ```python
   # in your setting file, eg. settings.py
   AZURE_CONNECTION_STRING = os.getenv('AZURE_STORAGEBLOB_CONNECTIONSTRING')
   
   ```

### [Go](#tab/go)

1. Install dependencies.
   ```bash
   go get "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   ```
2. Get blob storage connection string from the environment variable added by Service Connector.
   ```go
   import (
     "context"

     "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   )
   
   
   func main() {

     connection_str = os.LookupEnv("AZURE_STORAGEBLOB_CONNECTIONSTRING")     
     client, err := azblob.NewClientFromConnectionString(connection_str, nil);
   }
   ```

### [NodeJS](#tab/nodejs)
1. Install dependencies
   ```bash
   npm install @azure/storage-blob
   ```
2. Get blob storage connection string from the environment variable added by Service Connector.
   ```javascript
   const { BlobServiceClient } = require("@azure/storage-blob");
   
   const connection_str = process.env.AZURE_STORAGEBLOB_CONNECTIONSTRING;
   const blobServiceClient = BlobServiceClient.fromConnectionString(connection_str);
   ```

### [Other](#tab/other)
For other languages, you can use the blob storage account url and other properties that Service Connector set to the environment variables to connect the blob storage. For environment variable details, see [Integrate Azure Blob Storage with Service Connector](../how-to-integrate-storage-blob.md).
