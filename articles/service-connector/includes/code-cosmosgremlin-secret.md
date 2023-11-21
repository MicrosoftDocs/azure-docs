---
author: wchigit
description: code sample
ms.service: service-connector
ms.topic: include
ms.date: 10/31/2023
ms.author: wchi
---


### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Gremlin.Net
    ```

1. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin.
    ```csharp
    using System;
    using Gremlin.Net.Driver;
    
    var gremlinEndpoint = Environment.GetEnvironmentVariable("AZURE_COSMOS_RESOURCEENDPOINT");
    var userName = Environment.GetEnvironmentVariable("AZURE_COSMOS_USERNAME");
    var password = Environment.GetEnvironmentVariable("AZURE_COSMOS_PASSWORD");
    var gremlinPort = Int32.Parse(Environment.GetEnvironmentVariable("AZURE_COSMOS_PORT"));
            
    var server = new GremlinServer(
        hostname: gremlinEndpoint,
        port: gremlinPort,
        username: userName,
        password: password,
        enableSsl: true
    );

    using var client = new GremlinClient(
        gremlinServer: server,
        messageSerializer: new Gremlin.Net.Structure.IO.GraphSON.GraphSON2MessageSerializer()
    );
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
      <groupId>org.apache.tinkerpop</groupId>
      <artifactId>gremlin-driver</artifactId>
      <version>3.4.13</version>
    </dependency>
    ```

1. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin.

    ```java
    import org.apache.tinkerpop.gremlin.driver.Client;
    import org.apache.tinkerpop.gremlin.driver.Cluster;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;

    int gremlinPort = Integer.parseInt(System.getenv("AZURE_COSMOS_PORT"));
    String username = System.getenv("AZURE_COSMOS_USERNAME");
    String gremlinEndpoint = System.getenv("AZURE_COSMOS_RESOURCEENDPOINT");
    String password = System.getenv("AZURE_COSMOS_PASSWORD");
    
    Cluster cluster;
    Client client;

    cluster = Cluster.addContactPoint​(gremlinEndpoint).port(gremlinPort).credentials(username, password).create();
    ```

### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install gremlinpython
    ```

1. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin.
    ```python
    import os
    from gremlin_python.driver import client, serializer

    username = os.getenv('AZURE_COSMOS_USERNAME')
    password = os.getenv('AZURE_COSMOS_PASSWORD')
    endpoint = os.getenv('AZURE_COSMOS_RESOURCEENDPOINT')
    port = os.getenv('AZURE_COSMOS_PORT')
    
    client = client.Client(
        url=endpoint,
        traversal_source="g",
        username=username,
        password=password,
        message_serializer=serializer.GraphSONSerializersV2d0(),
    )
    ```

### [NodeJS](#tab/node)
1. Install dependencies
   ```bash
   npm install gremlin
   ```
2. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin.
   ```javascript
   import gremlin from 'gremlin'

   const username = process.env.AZURE_COSMOS_USERNAME;
   const password = process.env.AZURE_COSMOS_PASSWORD;
   const endpoint = process.env.AZURE_COSMOS_RESOURCEENDPOINT;
   const port = process.env.AZURE_COSMOS_PORT;

   const credentials = new gremlin.driver.auth.PlainTextSaslAuthenticator(
      username,
      password
    )

   const client = new gremlin.driver.Client(
      endpoint,
      {
        credentials,
        traversalsource: 'g',
        rejectUnauthorized: true,
        mimeType: 'application/vnd.gremlin-v2.0+json'
      }
    )
    
    client.open()
   ```

### [PHP](#tab/php)

Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin.

```php
$endpoint = getenv('AZURE_COSMOS_RESOURCEENDPOINT');
$username = getenv('AZURE_COSMOS_USERNAME');
$password = getenv('AZURE_COSMOS_PASSWORD');
$port = getenv('AZURE_COSMOS_PORT');

$db = new Connection([
    'host' => $endpoint,
    'username' => $username,
    'password' => $password,
    'port' => $port,
    'ssl' => TRUE
]);
```


### [Other](#tab/none)
For other languages, you can use the Apache Gremlin endpoint and other properties that Service Connector sets to the environment variables to connect to Azure Cosmos DB for Apache Gremlin resource. For environment variable details, see [Integrate Azure Cosmos DB for Apache Gremlin with Service Connector](../how-to-integrate-cosmos-gremlin.md).
