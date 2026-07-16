---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 04/08/2026
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.

    ```bash
    dotnet add package Azure.Messaging.WebPubSub
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

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

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```java
    String connectionString = System.getenv("AZURE_WEBPUBSUB_CONNECTIONSTRING");

    // Replace "<hub>" with your hub name.
    WebPubSubServiceClient webPubSubServiceClient = new WebPubSubServiceClientBuilder()
        .connectionString(connectionString)
        .hub("<hub>")
        .buildClient();
    ```

### [Python](#tab/python)

1. Install dependency.

    ```bash
    python -m pip install azure-messaging-webpubsubservice
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```python
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    connection_string = os.getenv('AZURE_WEBPUBSUB_CONNECTIONSTRING')
    
    # Replace "<hub>" with your hub name.
    service = WebPubSubServiceClient.from_connection_string(connection_string=connection_string, hub='<hub>')
    ```

### [NodeJS](#tab/nodejs)

1. Install dependency.

    ```bash
    npm install @azure/web-pubsub
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```javascript
    const { WebPubSubServiceClient } = require("@azure/web-pubsub");
    
    const ConnectionString = process.env.AZURE_WEBPUBSUB_CONNECTIONSTRING;
    
    // Replace "<hub>" with your hub name.
    const serviceClient = new WebPubSubServiceClient(ConnectionString, "<hubName>");
    ```

### [Other](#tab/none)
For other languages, you can use the connection configuration properties that Service Connector sets to the environment variables to connect to Azure Web PubSub.

---

