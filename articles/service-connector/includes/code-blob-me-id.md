---
author: yungezz
ms.service: service-connector
ms.topic: include
ms.date: 09/11/2023
ms.author: yungezz
zone_pivot_group_filename: service-connector/zone-pivot-groups.json
zone_pivot_groups: howto-authtype
---


### [.NET](#tab/dotnet)

You can use [`azure-identity`](https://www.nuget.org/packages/Azure.Identity/) to authenticate via managed identity or service principal. Get blob storage endpoint url from the environment variable added by Service Connector.

Install dependencies
```bash
dotnet add package Azure.Identity
```

Here's sample codes to connect to Blob storage using managed identity or service principal.


:::zone pivot="system-identity"

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// get blob endpoint
var blobEndpoint = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_RESOURCEENDPOINT");

// system-assigned managed identity
var credential = new DefaultAzureCredential();

var blobServiceClient = new BlobServiceClient(
        new Uri(blobEndpoint),
        credential);
```

:::zone-end


:::zone pivot="user-identity"

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// get blob endpoint
var blobEndpoint = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_RESOURCEENDPOINT");

// user-assigned managed identity
var credential = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTID");
    });

var blobServiceClient = new BlobServiceClient(
        new Uri(blobEndpoint),
        credential);
```

:::zone-end

:::zone pivot="service-principal"

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// get blob endpoint
var blobEndpoint = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_RESOURCEENDPOINT");

// service principal 
var tenantId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_TENANTID");
var clientId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTID");
var clientSecret = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTSECRET");
var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

var blobServiceClient = new BlobServiceClient(
        new Uri(blobEndpoint),
        credential);
```

:::zone-end

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-storage-blob</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Get the connection string from the environment variable, and add the plugin name to connect to the blob storage:

    :::zone pivot="system-identity"

    ```java
    String url = System.getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT");  

    // system managed identity
    DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(url)
        .credential(defaultCredential)
        .buildClient();
    ```

    :::zone-end

    :::zone pivot="user-identity"

    ```java
    String url = System.getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT");  

    // for user assigned managed identity
    DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId(System.getenv("AZURE_STORAGEBLOB_CLIENTID"))
        .build();

    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(url)
        .credential(defaultCredential)
        .buildClient();
    ```

    :::zone-end

    :::zone pivot="service-principal"

    ```java
    String url = System.getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT");  

    // for service principal
    ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
      .clientId(System.getenv("<AZURE_STORAGEBLOB_CLIENTID>"))
      .clientSecret(System.getenv("<AZURE_STORAGEBLOB_CLIENTSECRET>"))
      .tenantId(System.getenv("<AZURE_STORAGEBLOB_TENANTID>"))
      .build();

    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(url)
        .credential(defaultCredential)
        .buildClient();
    ```

    :::zone-end


### [Python](#tab/python)
1. Install dependencies
   ```bash
   pip install azure-identity
   pip install azure-storage-blob
   ```
1. Authenticate via `azure-identity` library. Get blob storage endpoint url from the environment variable added by Service Connector.

   :::zone pivot="system-identity"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   from azure.storage.blob import BlobServiceClient
   import os
   
   account_url = os.getenv('AZURE_STORAGEBLOB_RESOURCEENDPOINT')

   # system assigned managed identity
   cred = ManagedIdentityCredential()
   
   blob_service_client = BlobServiceClient(account_url, credential=cred)
   ```
   
   :::zone-end
   
   :::zone pivot="user-identity"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   from azure.storage.blob import BlobServiceClient
   import os
   
   account_url = os.getenv('AZURE_STORAGEBLOB_RESOURCEENDPOINT')

   # user assigned managed identity
   managed_identity_client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
   
   blob_service_client = BlobServiceClient(account_url, credential=cred)
   ```

   :::zone-end

   :::zone pivot="service-principal"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   from azure.storage.blob import BlobServiceClient
   import os
   
   account_url = os.getenv('AZURE_STORAGEBLOB_RESOURCEENDPOINT')
   
   # service principal
   tenant_id = os.getenv('AZURE_STORAGEBLOB_TENANTID')
   client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   client_secret = os.getenv('AZURE_STORAGEBLOB_CLIENTSECRET')
   cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)   

   blob_service_client = BlobServiceClient(account_url, credential=cred)
   ```

   :::zone-end


### [Django](#tab/django)
1. Install dependencies.
   ```bash
   pip install azure-identity
   pip install django-storages[azure]
   ```
1. Authenticate via `azure-identity` library.
   
   :::zone pivot="system-identity"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   import os

   # system assigned managed identity
   cred = ManagedIdentityCredential()

   ```

   :::zone-end

   :::zone pivot="user-identity"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   import os
   
   # user assigned managed identity
   managed_identity_client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
   ```

   :::zone-end

   :::zone pivot="service-principal"

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   import os

   # service principal
   tenant_id = os.getenv('AZURE_STORAGEBLOB_TENANTID')
   client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   client_secret = os.getenv('AZURE_STORAGEBLOB_CLIENTSECRET')
   cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

   ```

   :::zone-end


1. In setting file, add following lines. For more information, see [django-storages[azure]](https://django-storages.readthedocs.io/en/latest/backends/azure.html).
   ```python
   # in your setting file, eg. settings.py
   AZURE_CUSTOM_DOMAIN = os.getenv('AZURE_STORAGEBLOB_RESOURCEENDPOINT')
   AZURE_ACCOUNT_NAME = AZURE_CUSTOM_DOMAIN.split('.')[0].removeprefix('https://')    
   AZURE_TOKEN_CREDENTIAL = cred # this is the cred acquired from above step.
   
   ```

### [Go](#tab/go)

1. Install dependencies.
   ```bash
   go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
   go get "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   ```
2. In code, authenticate via `azidentity` library. Get blob storage endpoint url from the environment variable added by Service Connector.
   
   :::zone pivot="system-identity"

   ```go
   import (
     "context"
     
     "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
     "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   )
   
   
   func main() {

     account_endpoint = os.Getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT")
     
     // for system-assigned managed identity
     cred, err := azidentity.NewDefaultAzureCredential(nil)
     if err != nil {
       // error handling
     }
   
     client, err := azblob.NewBlobServiceClient(account_endpoint, cred, nil)
   }
   ```

   :::zone-end

   :::zone pivot="user-identity"

   ```go
   import (
     "context"
     
     "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
     "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   )
   
   
   func main() {

     account_endpoint = os.Getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT")

     // for user-assigned managed identity
     clientid := os.Getenv("AZURE_STORAGEBLOB_CLIENTID")
     azidentity.ManagedIdentityCredentialOptions.ID := clientid
   
     options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
     cred, err := azidentity.NewManagedIdentityCredential(options)
     if err != nil {
     }
     
     client, err := azblob.NewBlobServiceClient(account_endpoint, cred, nil)
   }
   ```

   :::zone-end

   :::zone pivot="service-principal"
   
   ```go
   import (
     "context"
     
     "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
     "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
   )
   
   
   func main() {

     account_endpoint = os.Getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT")
     
     // for service principal
     clientid := os.Getenv("AZURE_STORAGEBLOB_CLIENTID")
     tenantid := os.Getenv("AZURE_STORAGEBLOB_TENANTID")
     clientsecret := os.Getenv("AZURE_STORAGEBLOB_CLIENTSECRET")
     
     cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
     if err != nil {
     }
   
     client, err := azblob.NewBlobServiceClient(account_endpoint, cred, nil)
   }
   ```

   :::zone-end
   

### [NodeJS](#tab/nodejs)
1. Install dependencies
   ```bash
   npm install --save @azure/identity
   npm install @azure/storage-blob
   ```
2. Get blob storage endpoint url from the environment variable added by Service Connector. Authenticate via `@azure/identity` library.
   :::zone pivot="system-identity"

   ```javascript
   import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
   
   const { BlobServiceClient } = require("@azure/storage-blob");
   
   const account_url = process.env.AZURE_STORAGEBLOB_RESOURCEENDPOINT;

   // for system assigned managed identity
   const credential = new DefaultAzureCredential();
   
   const blobServiceClient = new BlobServiceClient(account_url, credential);
   ```

   :::zone-end

   :::zone pivot="user-identity"

   ```javascript
   import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
   
   const { BlobServiceClient } = require("@azure/storage-blob");
   
   const account_url = process.env.AZURE_STORAGEBLOB_RESOURCEENDPOINT;

   // for user assigned managed identity
   const clientId = process.env.AZURE_STORAGEBLOB_CLIENTID;
   const credential = new DefaultAzureCredential({
       managedIdentityClientId: clientId
   });
      
   const blobServiceClient = new BlobServiceClient(account_url, credential);
   ```

   :::zone-end

   :::zone pivot="service-principal"

   ```javascript
   import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
   
   const { BlobServiceClient } = require("@azure/storage-blob");
   
   const account_url = process.env.AZURE_STORAGEBLOB_RESOURCEENDPOINT;

   // for service principal
   const tenantId = process.env.AZURE_STORAGEBLOB_TENANTID;
   const clientId = process.env.AZURE_STORAGEBLOB_CLIENTID;
   const clientSecret = process.env.AZURE_STORAGEBLOB_CLIENTSECRET;
   const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
   
   const blobServiceClient = new BlobServiceClient(account_url, credential);
   ```

   :::zone-end
   




### [Others](#tab/others)
For other languages, you can use the blob storage account url and other properties that Service Connector set to the environment variables to connect the blob storage. For environment variable details, see [Integrate Azure Blob Storage with Service Connector](../how-to-integrate-storage-blob.md).
