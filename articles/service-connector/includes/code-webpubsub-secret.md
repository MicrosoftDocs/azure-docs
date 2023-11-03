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
    dotnet add package Azure.Messaging.WebPubSub
    ```

1. Get the connection string from the environment variable added by Service Connector.
    ```csharp
    using Azure.Messaging.WebPubSub;

    string connectionString = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_CONNECTIONSTRING");

    // Replace "<hub>" with your hub name.
    var serviceClient = new WebPubSubServiceClient(connectionString, "<hub>");
    ```

### [Java](#tab/java)
1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```java
    String connectionString = System.getenv("AZURE_WEBPUBSUB_CONNECTIONSTRING");

    // Replace "<hub>" with your hub name.
    WebPubSubServiceClient webPubSubServiceClient = new WebPubSubServiceClientBuilder()
        .connectionString(connectionString)
        .hub("<hub>")
        .buildClient();
    ```
### [Python](#tab/python)
1. Install dependencies.
    ```bash
    python -m pip install azure-messaging-webpubsubservice
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```python
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    connection_string = os.getenv('AZURE_WEBPUBSUB_CONNECTIONSTRING')
    
    # Replace "<hub>" with your hub name.
    service = WebPubSubServiceClient.from_connection_string(connection_string=connection_string, hub='<hub>')
    ```
### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/web-pubsub
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```javascript
    const { WebPubSubServiceClient } = require("@azure/web-pubsub");
    
    const ConnectionString = process.env.AZURE_WEBPUBSUB_CONNECTIONSTRING;
    
    // Replace "<hub>" with your hub name.
    const serviceClient = new WebPubSubServiceClient(ConnectionString, "<hubName>");
    ```

### [Other](#tab/other)
For other languages, you can use the connection configuration properties that Service Connector set to the environment variables to connect Azure Web PubSub. For environment variable details, see [Integrate Azure Web PubSub with Service Connector](../how-to-integrate-web-pubsub.md).