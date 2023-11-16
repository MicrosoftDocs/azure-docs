---
author: wchigit
description: code sample
ms.service: service-connector
ms.topic: include
ms.date: 11/03/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.
    ```bash
    dotnet add package Azure.Messaging.EventHubs
    ```

2. Get the connection string from the environment variable added by Service Connector.
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
1. Get the connection string from the environment variable added by Service Connector.
    ```java
    String connectionStr = System.getenv("AZURE_EVENTHUB_CONNECTIONSTRING");

    // Example of sending events
    EventHubProducerAsyncClient producer = new EventHubClientBuilder()
        .connectionString(
            connStr,
            "<event-hub-name>")
        .buildAsyncProducerClient();
    ```

### [SpringBoot](#tab/springBoot)

Refer to [Spring Cloud Stream with Azure Event Hubs](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub?toc=%2Fazure%2Fevent-hubs%2FTOC.json) and [Using Spring Integration for Azure Event Hubs](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1/eventhubs/spring-cloud-azure-starter-integration-eventhubs/eventhubs-integration) to set up your Spring application. The configuration properties are added to Spring Apps by Service Connector. Two sets of configuration properties are provided depending on the version of Spring Cloud Azure (below 4.0 and above 4.0) used. For more information about Spring Cloud Azure library changes, refer to [Spring Cloud Azure Migration Guide](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-integration-eventhubs).


### [Kafka-SpringBoot](#tab/kafka-springBoot)

Refer to [Use Spring Kafka with Azure Event Hubs for Kafka API](/azure/developer/java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub?tabs=connection-string) to set up your Spring application. The configuration properties above are set to Spring Apps by Service Connector.

### [Python](#tab/python)
1. Install dependency.
    ```bash
    pip install azure-eventhub
    ```
1. Get the connection string from the environment variable added by Service Connector.
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
1. Get the connection string from the environment variable added by Service Connector.
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
1. Get the connection string from the environment variable added by Service Connector.
    ```javascript
    const { EventHubProducerClient } = require("@azure/event-hubs");

    const eventHubName = "EVENT HUB NAME";
    const connection_string = process.env.AZURE_EVENTHUB_CONNECTIONSTRING;
    
    // Example of sending events
    const producer = new EventHubProducerClient(connectionString, eventHubName);
    ```



### [None](#tab/none)
For other languages, you can use the connection configuration properties that Service Connector sets to the environment variables to connect to Azure Event Hubs. For environment variable details, see [Integrate Azure Event Hubs with Service Connector](../how-to-integrate-event-hubs.md).
