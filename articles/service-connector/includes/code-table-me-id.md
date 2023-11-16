---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/24/2023
ms.author: wchi
---


### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Identity
    dotnet add package Azure.Data.Tables
    ```
1. You can use [`azure-identity`](https://www.nuget.org/packages/Azure.Identity/) to authenticate using a managed identity or a service principal. Get the Azure Table Storage endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```csharp
    using Azure.Identity;
    using Azure.Data.Tables;
    
    // get Table endpoint
    var tableEndpoint = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_RESOURCEENDPOINT");
    
    // Uncomment the following lines according to the authentication type.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    var tableServiceClient = new TableServiceClient(
            new Uri(tableEndpoint),
            credential);
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-data-tables</artifactId>
      <version>12.3.15</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


    ```java
    String url = System.getenv("AZURE_STORAGETABLE_RESOURCEENDPOINT");  

    // Uncomment the following lines according to the authentication type.
    // for system-assigned managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_STORAGETABLE_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_STORAGETABLE_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_STORAGETABLE_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_STORAGETABLE_TENANTID>"))
    //   .build();

    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
        .endpoint(url)
        .credential(defaultCredential)
        .buildClient();
    ```

### [Python](#tab/python)
1. Install dependencies.
   ```bash
   pip install azure-identity
   pip install azure-data-tables
   ```
1. Authenticate using the `azure-identity` library and get the Azure Table Storage endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


    ```python
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    from azure.data.tables import TableServiceClient
    import os
    
    account_url = os.getenv('AZURE_STORAGETABLE_RESOURCEENDPOINT')
    
    # Uncomment the following lines according to the authentication type.
    # system assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_STORAGETABLE_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_STORAGETABLE_TENANTID')
    # client_id = os.getenv('AZURE_STORAGETABLE_CLIENTID')
    # client_secret = os.getenv('AZURE_STORAGETABLE_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret) 
    
    table_service_client = TableServiceClient(account_url, credential=cred)
    ```

### [NodeJS](#tab/nodejs)
1. Install dependencies.
   ```bash
   npm install --save @azure/identity
   npm install @azure/data-tables
   ```
2. Authenticate using the `@azure/identity` library and get the Azure Table Storage endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { TableClient } = require("@azure/data-tables");
    
    const account_url = process.env.AZURE_STORAGETABLE_RESOURCEENDPOINT;
    
    // Uncomment the following lines according to the authentication type.
    // for system assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user assigned managed identity
    // const clientId = process.env.AZURE_STORAGETABLE_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_STORAGETABLE_TENANTID;
    // const clientId = process.env.AZURE_STORAGETABLE_CLIENTID;
    // const clientSecret = process.env.AZURE_STORAGETABLE_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    const tableServiceClient = new TableServiceClient(account_url, credential);
    ```

### [None](#tab/none)
For other languages, you can use the Azure Table Storage account URL and other properties that Service Connector sets to the environment variables to connect to Azure Table Storage. For environment variable details, see [Integrate Azure Table Storage with Service Connector](../how-to-integrate-storage-table.md).
