---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 12/04/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.
    ```bash
    dotnet add package MongoDb.Driver
    ```

2. Get the connection string from the environment variable added by Service Connector and connect to MongoDB Atlas.
    ```csharp
    using MongoDB.Driver;

    var connectionString = Environment.GetEnvironmentVariable("MONGODBATLAS_CLUSTER_CONNECTIONSTRING");
    var client = new MongoClient(connectionString);
    ```


### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
	    <groupId>org.mongodb</groupId>
	    <artifactId>mongo-java-driver</artifactId>
	    <version>3.4.2</version>
	</dependency>   
    ```

1. Get the connection string from the environment variable added by Service Connector and connect to MongoDB Atlas.

    ```java
    import com.mongodb.MongoClient;
    import com.mongodb.MongoClientURI;
    import com.mongodb.client.MongoCollection;
    import com.mongodb.client.MongoDatabase;
    import com.mongodb.client.model.Filters;
    
    String connectionString = System.getenv("MONGODBATLAS_CLUSTER_CONNECTIONSTRING");
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

### [Python](#tab/python)
1. Install dependency.
    ```bash
    pip install pymongo
    ```

2. Get the connection string from the environment variable added by Service Connector and connect to MongoDB Atlas.
    ```python
    import os
    import pymongo

    conn_str = os.environ.get("MONGODBATLAS_CLUSTER_CONNECTIONSTRING")
    client = pymongo.MongoClient(conn_str)
    ```

### [Go](#tab/go)
1. Install dependency.
   ```bash
   go get go.mongodb.org/mongo-driver/mongo
   ```
2. Get the connection string from the environment variable added by Service Connector and connect to MongoDB Atlas.
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
    
    mongoDBConnectionString = os.Getenv("MONGODBATLAS_CLUSTER_CONNECTIONSTRING")
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

### [NodeJS](#tab/nodejs)
1. Install dependency.
    ```bash
    npm install mongodb
    ```
2. Get the connection string from the environment variable added by Service Connector and connect to MongoDB Atlas.
    ```javascript
    const { MongoClient, ObjectId } = require('mongodb');
    
    const url = process.env.MONGODBATLAS_CLUSTER_CONNECTIONSTRING;
    const client = new MongoClient(url);
    ```


### [Other](#tab/none)
For other languages, you can use the MongoDB resource endpoint and other properties that Service Connector sets to the environment variables to connect to MongoDB Atlas. For environment variable details, see [Integrate MongoDB with Service Connector](../how-to-integrate-mongodb-atlas.md).
