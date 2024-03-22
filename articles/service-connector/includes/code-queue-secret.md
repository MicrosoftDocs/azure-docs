---
author: wchigit
description: code sample
ms.service: service-connector
ms.topic: include
ms.date: 11/02/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependency.
    ```bash
    dotnet add package Azure.Storage.Queues
    ```
1. Get the connection string from the environment variable added by Service Connector.
    
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
1. Get the connection string from the environment variable added by Service Connector.
    ```java
    String connectionString = System.getenv("AZURE_STORAGEQUEUE_CONNECTIONSTRING");
    QueueClient client = new QueueClientBuilder()
        .connectionString(connectionString)
        .buildClient();
    ```
### [SpringBoot](#tab/springBoot)
Refer to [Spring Cloud Azure Storage Queue Operation Code Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_v4.3.0/storage/spring-cloud-azure-starter-storage-queue/storage-queue-client) to set up your Spring application. Two sets of configuration properties are provided depending on the version of Spring Cloud Azure (below 4.0 and above 4.0). For more information, check [Azure Storage Queue SDK Configuration Changes](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-integration-storage-queue).

### [Python](#tab/python)
1. Install dependency.
    ```bash
    pip install azure-storage-queue
    ```
1. Get the connection string from the environment variable added by Service Connector.
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
1. Get the connection string from the environment variable added by Service Connector.
    
    ```javascript
    const { QueueServiceClient } = require("@azure/storage-queue");

    const connection_string = process.env.AZURE_STORAGEQUEUE_CONNECTIONSTRING;
    const queueServiceClient = QueueServiceClient.fromConnectionString(connection_string);
    ```
