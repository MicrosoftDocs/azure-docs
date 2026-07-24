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
    dotnet add package Azure.Storage.Queues
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```csharp
    using Azure.Storage.Queues;

    var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGEQUEUE_CONNECTIONSTRING");
    QueueServiceClient service = new QueueServiceClient(connectionString);
    ```

### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-storage-queue</artifactId>
    </dependency>
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    ```java
    String connectionString = System.getenv("AZURE_STORAGEQUEUE_CONNECTIONSTRING");
    QueueClient client = new QueueClientBuilder()
        .connectionString(connectionString)
        .buildClient();
    ```

### [SpringBoot](#tab/springBoot)

To set up your Spring application, see [Spring Cloud Azure Storage Queue Operation Code Sample](/samples/azure-samples/azure-spring-boot-samples/sending-and-receiving-message-by-azure-storage-queue-and-sdk-client-in-spring-boot-application). Service Connector provides two sets of configuration properties, depending on whether the Spring Cloud Azure version is below 4.0 or above 4.0. For more information, see [Azure Storage Queue SDK Configuration Changes](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-integration-storage-queue).

### [Python](#tab/python)

1. Install dependency.

    ```bash
    pip install azure-storage-queue
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.
    ```python
    from azure.storage.queue import QueueServiceClient
    connection_string = os.getenv('AZURE_STORAGEQUEUE_CONNECTIONSTRING')
    queue_service = QueueServiceClient.from_connection_string(conn_str=connection_string)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependency.

    ```bash
    npm install @azure/storage-queue
    ```

1. Run the following code, getting the connection string from the Service Connector environment variables.

    
    ```javascript
    const { QueueServiceClient } = require("@azure/storage-queue");

    const connection_string = process.env.AZURE_STORAGEQUEUE_CONNECTIONSTRING;
    const queueServiceClient = QueueServiceClient.fromConnectionString(connection_string);
    ```

---

