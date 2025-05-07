---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 12/04/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    dotnet add package Azure.Identity
    ```

1. Authenticate using `Azure.Identity` NuGet package and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```csharp
    using Microsoft.Azure.Cosmos;
    using Azure.Core;
    using Azure.Identity;
    using System; 
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned identity.
    // TokenCredential credential = new DefaultAzureCredential();
    
    // For user-assigned identity.
    // TokenCredential credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTID");
    //     }
    // );
    
    // For service principal.
    // TokenCredential credential = new ClientSecretCredential(
    //     tenantId: Environment.GetEnvironmentVariable("AZURE_COSMOS_TENANTID")!,
    //     clientId: Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTID")!,
    //     clientSecret: Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTSECRET")!,
    //     options: new TokenCredentialOptions()
    // );

    // Create a new instance of CosmosClient using the credential above
    using CosmosClient client = new(
        accountEndpoint: Environment.GetEnvironmentVariable("AZURE_COSMOS_RESOURCEENDPOINT")!,
        tokenCredential: credential
    );
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
    	<groupId>com.azure</groupId>
    	<artifactId>azure-cosmos</artifactId>
    	<version>LATEST</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Authenticate via `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    import com.azure.cosmos.CosmosClient;
    import com.azure.cosmos.CosmosClientBuilder;
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
    
    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_COSMOS_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_COSMOS_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_COSMOS_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_COSMOS_TENANTID>"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_COSMOS_RESOURCEENDPOINT");
    
    CosmosClient cosmosClient = new CosmosClientBuilder()
        .endpoint(endpoint)
        .credential(credential)
        .buildClient();
    ```

### [SpringBoot](#tab/springBoot)

Refer to [Build a Spring Data Azure Cosmos DB v3 app to manage Azure Cosmos DB for NoSQL data](/azure/cosmos-db/nosql/quickstart-java-spring-data?tabs=passwordless%2Csign-in-azure-cli) to set up your Spring application. The configuration properties are added to Spring Apps by Service Connector. Managed identity support for Cosmos DB is only available for Spring Cloud Azure version 4.0 and above. For more information, refer to [Spring Cloud Azure - Reference Documentation](https://microsoft.github.io/spring-cloud-azure/current/reference/html/index.html#authentication).
 
### [Python](#tab/python)
1. Install dependencies.
   ```bash
   pip install azure-identity
   pip install azure-cosmos
   ```
1. Authenticate via `azure-identity` library and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
   ```python
   import os
   from azure.cosmos import CosmosClient
   from azure.identity import ManagedIdentityCredential, ClientSecretCredential
   
   # Uncomment the following lines corresponding to the authentication type you want to use.
   # system-assigned managed identity
   # cred = ManagedIdentityCredential()

   # user-assigned managed identity
   # managed_identity_client_id = os.getenv('AZURE_COSMOS_CLIENTID')
   # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)

   # service principal
   # tenant_id = os.getenv('AZURE_COSMOS_TENANTID')
   # client_id = os.getenv('AZURE_COSMOS_CLIENTID')
   # client_secret = os.getenv('AZURE_COSMOS_CLIENTSECRET')
   # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

   endpoint = os.environ["AZURE_COSMOS_RESOURCEENDPOINT"]
   client = CosmosClient(url=endpoint, credential=cred)
   
   ```

### [Go](#tab/go)
1. Install dependencies.
    ```bash
    go get t github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos
    ```
1. Authenticate using `azidentity` npm package and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```go
    import (
        "os"

        "github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )

    func main() {
        endpoint = os.Getenv("AZURE_COSMOS_RESOURCEENDPOINT")

        // Uncomment the following lines corresponding to the authentication type you want to use.
        // For system-assigned identity.
        // cred, err := azidentity.NewDefaultAzureCredential(nil)
        
        // For user-assigned identity.
        // clientid := os.Getenv("AZURE_COSMOS_CLIENTID")
        // azidentity.ManagedIdentityCredentialOptions.ID := clientid
        // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
        // cred, err := azidentity.NewManagedIdentityCredential(options)
        
        // For service principal.
        // clientid := os.Getenv("AZURE_COSMOS_CLIENTID")
        // tenantid := os.Getenv("AZURE_COSMOS_TENANTID")
        // clientsecret := os.Getenv("AZURE_COSMOS_CLIENTSECRET")
        // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})

        client, err := azcosmos.NewClient(endpoint, cred, nil)
    }
    ```

### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/identity
    npm install @azure/cosmos
    ```
1. Authenticate using `@azure/identity` npm package and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
   
    ```javascript
    import { CosmosClient } from "@azure/cosmos";
    const { DefaultAzureCredential } = require("@azure/identity");
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // For system-assigned managed identity.
    // const credential = new DefaultAzureCredential();

    // For user-assigned managed identity.
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: process.env.AZURE_COSMOS_CLIENTID
    // });
    
    // For service principal.
    // const credential = new ClientSecretCredential(
    //     tenantId: process.env.AZURE_COSMOS_TENANTID,
    //     clientId: process.env.AZURE_COSMOS_CLIENTID,
    //     clientSecret: process.env.AZURE_COSMOS_CLIENTSECRET
    // );
    
    // Create a new instance of CosmosClient using the credential above
    const cosmosClient = new CosmosClient({ 
        process.env.AZURE_COSMOS_RESOURCEENDPOINT, 
        aadCredentials: credential
    });
    ```



### [Other](#tab/none)
For other languages, you can use the endpoint URL and other properties that Service Connector sets to the environment variables to connect to Azure Cosmos DB for NoSQL. For environment variable details, see [Integrate Azure Cosmos DB for NoSQL with Service Connector](../how-to-integrate-cosmos-sql.md).
