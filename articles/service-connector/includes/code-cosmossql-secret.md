---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/25/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Azure.Cosmos
    ```

2. Get the connection string from the environment variable added by Service Connector.
    ```csharp
    using Microsoft.Azure.Cosmos;
    using System; 
    
    // Create a new instance of CosmosClient using a connection string
    using CosmosClient client = new(
        connectionString: Environment.GetEnvironmentVariable("AZURE_COSMOS_CONNECTIONSTRING")!
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
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```java
    import com.azure.cosmos.CosmosClient;
    import com.azure.cosmos.CosmosClientBuilder;
    
    String connectionStr = System.getenv("AZURE_COSMOS_CONNECTIONSTRING");
    String[] connInfo = connectionStr.split(";");
    String endpoint = connInfo[0].split("=")[1];
    String accountKey = connInfo[1].split("=")[1];
    
    CosmosClient cosmosClient = new CosmosClientBuilder()
        .endpoint(endpoint)
        .key(accountKey)
        .buildClient();
    ```

### [SpringBoot](#tab/springBoot)

Refer to [Spring Data Azure Cosmos DB v3 examples](/azure/cosmos-db/nosql/samples-java-spring-data) and [Build a Spring Data Azure Cosmos DB v3 app to manage Azure Cosmos DB for NoSQL data](/azure/cosmos-db/nosql/quickstart-java-spring-data?tabs=password%2Csign-in-azure-cli) to set up your Spring application. The configuration properties are added to Spring Apps by Service Connector. Two sets of configuration properties are provided according to the version of Spring Cloud Azure (below 4.0 and above 4.0). For more information about library changes of Spring Cloud Azure, refer to [Spring Cloud Azure Migration Guide](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-data-cosmos). It is recommended to use Spring Cloud Azure version 4.0 and above. The configurations in the format of "azure.cosmos.*" from Spring Cloud Azure 3.x will no longer be supported after 1st July, 2024. 

### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install azure-cosmos
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```python
    import os
    from azure.cosmos import CosmosClient
    
    # Create a new instance of CosmosClient using a connection string
    CONN_STR = os.environ["AZURE_COSMOS_CONNECTIONSTRING"]
    client = CosmosClient.from_connection_string(conn_str=CONN_STR) 
    ```

### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/cosmos
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```javascript
    import { CosmosClient } from "@azure/cosmos";
    
    // Create a new instance of CosmosClient using a connection string
    const cosmosClient = new CosmosClient(process.env.AZURE_COSMOS_CONNECTIONSTRING);
    ```



### [Other](#tab/none)
For other languages, you can use the endpoint URL and other properties that Service Connector sets to the environment variables to connect to Azure Cosmos DB for NoSQL. For environment variable details, see [Integrate Azure Cosmos DB for NoSQL with Service Connector](../how-to-integrate-cosmos-sql.md).
