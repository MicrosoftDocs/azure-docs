---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/30/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Messaging.ServiceBus
    ```
1. Get the Service Bus connection string from the environment variables added by Service Connector.
    
    ```csharp
    using Azure.Messaging.ServiceBus;
    
    var connectionString = Environment.GetEnvironmentVariable("AZURE_SERVICEBUS_CONNECTIONSTRING");
    var client = client = new ServiceBusClient(connectionString);
    ```
    
### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-servicebus</artifactId>
        <version>7.13.3</version>
    </dependency>
    ```
1. Get the Service Bus connection string from the environment variables added by Service Connector.

    ```java
    import com.azure.messaging.servicebus.*;
    
    String connectionString = System.getenv("AZURE_SERVICEBUS_CONNECTIONSTRING");

    // For example, create a Service Bus Sender client for a queue using the connection string.
    ServiceBusSenderClient senderClient = new ServiceBusClientBuilder()
            .connectionString(connectionString)
            .sender()
            .queueName("<queueName>")
            .buildClient();
    ```

### [SpringBoot](#tab/spring)

1. Add the following dependencies to your pom.xml file:
    ```xml
    <dependencyManagement>
      <dependencies>
        <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>spring-cloud-azure-dependencies</artifactId>
          <version>4.12.0</version>
          <type>pom</type>
          <scope>import</scope>
        </dependency>
      </dependencies>
    </dependencyManagement>
    ```
1. Set up a Spring application. The Service Bus connection string `spring.cloud.azure.servicebus.connection-string` is set to Spring Apps by Service Connector. For more information, check [Use Azure Service Bus in Spring applications](/azure/developer/java/spring-framework/using-service-bus-in-spring-applications).

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-servicebus
    ```
1. Get the Service Bus connection string from the environment variables added by Service Connector.
    ```python
    import os
    from azure.servicebus.aio import ServiceBusClient
    from azure.servicebus import ServiceBusMessage    

    connection_str = os.getenv('AZURE_SERVICEBUS_CONNECTIONSTRING')
    client = ServiceBusClient.from_connection_string(connection_str)
    ```

### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus
    ```
1. Get the Service Bus connection string from the environment variables added by Service Connector.
    
    ```go
    import (
    	"context"
    	"errors"
    	"fmt"
    	"os"
    
    	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    	"github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    )

    connectionString, ok := os.LookupEnv("AZURE_SERVICEBUS_CONNECTIONSTRING")
	if !ok {
		panic("AZURE_SERVICEBUS_CONNECTIONSTRING environment variable not found")
	}

	client, err := azservicebus.NewClientFromConnectionString(connectionString, nil)
	if err != nil {
		panic(err)
	}
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install @azure/service-bus
    ```
1. Get the Service Bus connection string from the environment variables added by Service Connector.
    
    ```javascript
    const { ServiceBusClient } = require("@azure/service-bus");

    const connectionString = process.env.AZURE_SERVICEBUS_CONNECTIONSTRING;
    
    const client = new ServiceBusClient(connectionString);
    ```

### [Other](#tab/other)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect compute services to the Service Bus. For environment variable details, see [Integrate Service Bus with Service Connector](../how-to-integrate-service-bus.md).