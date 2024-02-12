---
author: yungezz
ms.service: service-connector
ms.topic: include
ms.date: 10/25/2023
ms.author: yungezz
---


### [.NET](#tab/dotnet)

You can use [`azure-identity`](https://www.nuget.org/packages/Azure.Identity/) to authenticate via managed identity or service principal. Get the Azure Blob Storage endpoint url from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

Install dependencies
```bash
dotnet add package Azure.Identity
```

Here's sample code to connect to Blob storage using managed identity or service principal.

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// get Blob endpoint
var blobEndpoint = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_RESOURCEENDPOINT");

// Uncomment the following lines according to the authentication type.
// system-assigned managed identity
// var credential = new DefaultAzureCredential();

// user-assigned managed identity
// var credential = new DefaultAzureCredential(
//     new DefaultAzureCredentialOptions
//     {
//         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTID");
//     });

// service principal 
// var tenantId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_TENANTID");
// var clientId = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTID");
// var clientSecret = Environment.GetEnvironmentVariable("AZURE_STORAGEBLOB_CLIENTSECRET");
// var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

var blobServiceClient = new BlobServiceClient(
        new Uri(blobEndpoint),
        credential);
```

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
1. Authenticate using `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    String url = System.getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT");  

    // Uncomment the following lines according to the authentication type.
    // for system managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    // for user assigned managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_STORAGEBLOB_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_STORAGEBLOB_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_STORAGEBLOB_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_STORAGEBLOB_TENANTID>"))
    //   .build();

    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(url)
        .credential(defaultCredential)
        .buildClient();
    ```

### [springBoot](#tab/springBoot)
Authentication type is not supported for Spring Boot.

### [Python](#tab/python)
1. Install dependencies
   ```bash
   pip install azure-identity
   pip install azure-storage-blob
   ```
1. Authenticate using `azure-identity` library and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   from azure.storage.blob import BlobServiceClient
   import os
   
   account_url = os.getenv('AZURE_STORAGEBLOB_RESOURCEENDPOINT')
    
   # Uncomment the following lines according to the authentication type.
   # system assigned managed identity
   # cred = ManagedIdentityCredential()

   # user assigned managed identity
   # managed_identity_client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)

   # service principal
   # tenant_id = os.getenv('AZURE_STORAGEBLOB_TENANTID')
   # client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   # client_secret = os.getenv('AZURE_STORAGEBLOB_CLIENTSECRET')
   # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret) 
   
   blob_service_client = BlobServiceClient(account_url, credential=cred)
   ```

### [Django](#tab/django)
1. Install dependencies.
   ```bash
   pip install azure-identity
   pip install django-storages[azure]
   ```
1. Authenticate via `azure-identity` library. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
   

   ```python
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   import os
    
   # Uncomment the following lines according to the authentication type.
   # system assigned managed identity
   # cred = ManagedIdentityCredential()

   # user assigned managed identity
   # managed_identity_client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
   # service principal
   # tenant_id = os.getenv('AZURE_STORAGEBLOB_TENANTID')
   # client_id = os.getenv('AZURE_STORAGEBLOB_CLIENTID')
   # client_secret = os.getenv('AZURE_STORAGEBLOB_CLIENTSECRET')
   # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
   ```

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
2. In code, authenticate via `azidentity` library. Get the Azure Blob Storage endpoint url from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

      ```go
      import (
        "context"
        
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
        "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
      )
      
      
      func main() {
    
        account_endpoint = os.Getenv("AZURE_STORAGEBLOB_RESOURCEENDPOINT")
        
        // Uncomment the following lines according to the authentication type.
        // for system-assigned managed identity
        // cred, err := azidentity.NewDefaultAzureCredential(nil)
    
        // for user-assigned managed identity
        // clientid := os.Getenv("AZURE_STORAGEBLOB_CLIENTID")
        // azidentity.ManagedIdentityCredentialOptions.ID := clientid
        // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
        // cred, err := azidentity.NewManagedIdentityCredential(options)
      
        // for service principal
        // clientid := os.Getenv("AZURE_STORAGEBLOB_CLIENTID")
        // tenantid := os.Getenv("AZURE_STORAGEBLOB_TENANTID")
        // clientsecret := os.Getenv("AZURE_STORAGEBLOB_CLIENTSECRET")
        // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
    
        if err != nil {
          // error handling
        }
      
        client, err := azblob.NewBlobServiceClient(account_endpoint, cred, nil)
      }
      ```

### [NodeJS](#tab/nodejs)
1. Install dependencies
   ```bash
   npm install --save @azure/identity
   npm install @azure/storage-blob
   ```
2. Get the Azure Blob Storage endpoint url from the environment variable added by Service Connector. Authenticate via `@azure/identity` library. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

   ```javascript
   import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
   
   const { BlobServiceClient } = require("@azure/storage-blob");
   
   const account_url = process.env.AZURE_STORAGEBLOB_RESOURCEENDPOINT;

   // Uncomment the following lines according to the authentication type.
   // for system assigned managed identity
   // const credential = new DefaultAzureCredential();

   // for user assigned managed identity
   // const clientId = process.env.AZURE_STORAGEBLOB_CLIENTID;
   // const credential = new DefaultAzureCredential({
   //     managedIdentityClientId: clientId
   // });

   // for service principal
   // const tenantId = process.env.AZURE_STORAGEBLOB_TENANTID;
   // const clientId = process.env.AZURE_STORAGEBLOB_CLIENTID;
   // const clientSecret = process.env.AZURE_STORAGEBLOB_CLIENTSECRET;
   // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
   
   const blobServiceClient = new BlobServiceClient(account_url, credential);
   ```

### [Other](#tab/none)
For other languages, you can use the Azure Blob Storage account url and other properties that Service Connector sets to the environment variables to connect to Azure Blob storage. For environment variable details, see [Integrate Azure Blob Storage with Service Connector](../how-to-integrate-storage-blob.md).
