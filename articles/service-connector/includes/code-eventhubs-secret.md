---
author: wchigit
description: Code sample
ms.service: service-connector
ms.topic: include
ms.date: 04/08/2026
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.
    ```bash
    dotnet add package Azure.Messaging.EventHubs
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```csharp
    using System; 
    using Azure.Messaging.EventHubs;
    
    string connectionString = Environment.GetEnvironmentVariable("AZURE_EVENTHUB_CONNECTIONSTRING");
    var eventHubName = "<NAME OF THE EVENT HUB>";
    var consumerGroup = EventHubConsumerClient.DefaultConsumerGroupName;
    
    var producer = new EventHubProducerClient(connectionString, eventHubName);
    var consumer = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
    ```

### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-eventhubs</artifactId>
        <version>5.15.0</version>
    </dependency>
    ```
    
1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```java
    String connectionStr = System.getenv("AZURE_EVENTHUB_CONNECTIONSTRING");

    // Example of sending events
    EventHubProducerAsyncClient producer = new EventHubClientBuilder()
        .connectionString(
            connStr,
            "<event-hub-name>")
        .buildAsyncProducerClient();
    ```

### [Spring Boot](#tab/springBoot)

To set up your Spring application, see [Spring Cloud Stream with Azure Event Hubs](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub?toc=%2Fazure%2Fevent-hubs%2FTOC.json) and [Using Spring Integration for Azure Event Hubs](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1/eventhubs/spring-cloud-azure-starter-integration-eventhubs/eventhubs-integration).

Service Connector adds the configuration properties to Spring Apps. Service Connector provides two sets of configuration properties, depending on whether the Spring Cloud Azure version is below 4.0 or above 4.0. For more information about Spring Cloud Azure library changes, see the [Spring Cloud Azure Migration Guide](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-integration-eventhubs).

### [Kafka Spring Boot](#tab/kafka-springBoot)

To set up your Spring application, see [Use Spring Kafka with Azure Event Hubs for Kafka API](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub?tabs=connection-string). Service Connector sets the preceding configuration properties to Spring Apps.

### [Python](#tab/python)

1. Install dependency.

    ```bash
    pip install azure-eventhub
    ```
    
1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```python
    import os
    from azure.eventhub import EventData
    from azure.eventhub.aio import EventHubProducerClient

    CONN_STR = os.environ["AZURE_EVENTHUB_CONNECTIONSTRING"]
    EVENT_HUB_NAME = "EVENT_HUB_NAME"

    # Example of sending events
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENT_HUB_CONNECTION_STR, eventhub_name=EVENT_HUB_NAME
    )
    ```

### [Go](#tab/go)

1. Install dependency.

    ```bash
    
    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs
    ```
    
1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```go
    import (
        "context"

        "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
    )

    connectionString := os.Getenv("AZURE_EVENTHUB_CONNECTIONSTRING")
    
    // Example of sending events
    producerClient, err := azeventhubs.NewProducerClientFromConnectionString(connectionString, "EVENT HUB NAME", nil)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependency.

    ```bash
    npm install @azure/event-hubs
    ```
    
1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```javascript
    const { EventHubProducerClient } = require("@azure/event-hubs");

    const eventHubName = "EVENT HUB NAME";
    const connection_string = process.env.AZURE_EVENTHUB_CONNECTIONSTRING;
    
    // Example of sending events
    const producer = new EventHubProducerClient(connectionString, eventHubName);
    ```

### [Other](#tab/none)

For other languages, you can use the environment variables Service Connector adds as configuration properties to connect to Event Hubs.

---
