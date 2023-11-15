---
author: wchigit
description: managed identity, code sample
ms.service: service-connector
ms.topic: include
ms.date: 11/02/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.
    ```bash
    dotnet add package Azure.Storage.Queues
    dotnet add package Azure.Identity
    ```

1. Authenticate using `Azure.Identity` and get the Azure Queue Storage endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```csharp
    using Azure.Storage.Queues;
    using Azure.Identity;    
    
    // Uncomment the following lines according to the authentication type.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    Uri queueUri = new Uri(Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_RESOURCEENDPOINT"));
    QueueClient queue = new QueueClient(queueUri, credential);
    ```

### [Java](#tab/java)
1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-storage-queue</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the Azure Queue Storage endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```java
    import com.azure.identity.*;
    import com.azure.storage.queue.*;
    import com.azure.storage.queue.models.*;
    
    // Uncomment the following lines according to the authentication type.
    // for system-managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_STORAGEQUEUE_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_STORAGEQUEUE_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_STORAGEQUEUE_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_STORAGEQUEUE_TENANTID"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_STORAGEQUEUE_RESOURCEENDPOINT");
    QueueClient queueClient = new QueueClientBuilder()
        .endpoint(endpoint)
        .queueName("<queueName>")
        .credential(credential)
        .buildClient();
    ```

### [SpringBoot](#tab/spring)
The authentication type is not supported by Spring Boot client type.

### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install azure-identity
    pip install azure-storage-queue
    ```
1. Authenticate using `azure-identity` and get the Azure Queue Storage endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    from azure.storage.queue import QueueServiceClient, QueueClient
    
    # Uncomment the following lines according to the authentication type.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_STORAGEQUEUE_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_STORAGEQUEUE_TENANTID')
    # client_id = os.getenv('AZURE_STORAGEQUEUE_CLIENTID')
    # client_secret = os.getenv('AZURE_STORAGEQUEUE_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    account_url = os.getenv('AZURE_STORAGEQUEUE_RESOURCEENDPOINT')
    queue_client = QueueClient(account_url, queue_name='<queue_name>' ,credential=cred)
    ```

### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/identity
    npm install @azure/storage-queue
    ```
1. Authenticate using `@azure/identity` and get the Azure Queue Storage endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```javascript
    const { QueueServiceClient } = require("@azure/storage-queue");
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    
    // Uncomment the following lines according to the authentication type.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_STORAGEQUEUE_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_STORAGEQUEUE_TENANTID;
    // const clientId = process.env.AZURE_STORAGEQUEUE_CLIENTID;
    // const clientSecret = process.env.AZURE_STORAGEQUEUE_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const queueServiceClient = new QueueServiceClient(
        process.env.AZURE_STORAGEQUEUE_RESOURCEENDPOINT,
        credential
      );
    ```