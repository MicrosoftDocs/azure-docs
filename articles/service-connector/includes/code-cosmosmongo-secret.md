---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/30/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies
    ```bash
    dotnet add package MongoDb.Driver
    ```

2. Get the connection string from the environment variable added by Service Connector and connect to Azure Cosmos DB for MongoDB.
    ```csharp
    using MongoDB.Driver;

    var connectionString = Environment.GetEnvironmentVariable("AZURE_COSMOS_CONNECTIONSTRING");
    var client = new MongoClient(connectionString);
    ```


### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
	    <groupId>org.mongodb</groupId>
	    <artifactId>mongo-java-driver</artifactId>
	    <version>3.4.2</version>
	</dependency>   
    ```

1. Get the connection string from the environment variable added by Service Connector and connect to Azure Cosmos DB for MongoDB.

    ```java
    import com.mongodb.MongoClient;
    import com.mongodb.MongoClientURI;
    import com.mongodb.client.MongoCollection;
    import com.mongodb.client.MongoDatabase;
    import com.mongodb.client.model.Filters;
    
    String connectionString = System.getenv("AZURE_COSMOS_CONNECTIONSTRING");
    MongoClientURI uri = new MongoClientURI(connectionString);
		
    MongoClient mongoClient = null;
    try {
        mongoClient = new MongoClient(uri);        
    } finally {
        if (mongoClient != null) {
            mongoClient.close();
        }
    }
    ```

### [SpringBoot](#tab/springBoot)
Refer to [Use Spring Data with Azure Cosmos DB for MongoDB API](/azure/developer/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db) to set up your Spring application. The configuration properties `spring.data.mongodb.database` and `spring.data.mongodb.uri` are set to Spring Apps by Service Connector.


### [Go](#tab/go)
1. Install dependencies.
   ```bash
   go get go.mongodb.org/mongo-driver/mongo
   ```
2. Get the connection string from the environment variable added by Service Connector and connect to Azure Cosmos DB for MongoDB.
    ```go
    import (
    	"context"
    	"fmt"
    	"log"
    	"os"
        
        "go.mongodb.org/mongo-driver/bson"
    	"go.mongodb.org/mongo-driver/mongo"
    	"go.mongodb.org/mongo-driver/mongo/options"
    )

    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    defer cancel()
    
    mongoDBConnectionString = os.Getenv("AZURE_COSMOS_CONNECTIONSTRING")
    clientOptions := options.Client().ApplyURI(mongoDBConnectionString).SetDirect(true)
    
    c, err := mongo.Connect(ctx, clientOptions)
    if err != nil {
        log.Fatalf("unable to initialize connection %v", err)
    }

    err = c.Ping(ctx, nil)
    if err != nil {
        log.Fatalf("unable to connect %v", err)
    }
    ```

### [NodeJS](#tab/node)
1. Install dependencies
    ```bash
    npm install mongodb
    ```
2. Get the connection string from the environment variable added by Service Connector and connect to Azure Cosmos DB for MongoDB.
    ```javascript
    const { MongoClient, ObjectId } = require('mongodb');
    
    const url = process.env.AZURE_COSMOS_CONNECTIONSTRING;
    const client = new MongoClient(url);
    ```


### [Other](#tab/none)
For other languages, you can use the MongoDB resource endpoint and other properties that Service Connector sets to the environment variables to connect to Azure Cosmos DB for MongoDB. For environment variable details, see [Integrate Azure Cosmos DB for MongoDB with Service Connector](../how-to-integrate-cosmos-db.md).
