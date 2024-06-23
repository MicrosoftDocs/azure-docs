---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/24/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Data.Tables
    ```

1. Get the Azure Table Storage connection string from the environment variable added by Service Connector.

    ```csharp
    using Azure.Data.Tables;
    
    var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGETABLE_CONNECTIONSTRING");
    TableServiceClient tableServiceClient = new TableServiceClient(connectionString);
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-data-tables</artifactId>
        <version>12.2.1</version>
    </dependency>
    ```
1. Get the Azure Table Storage connection string from the environment variable added by service connector.

    ```java
    String connectionStr = System.getenv("AZURE_STORAGETABLE_CONNECTIONSTRING");
    TableServiceClient tableServiceClient = new TableServiceClientBuilder()
        .connectionString(connectionStr)
        .buildClient();
    ```


### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install azure-data-tables
    ```
1. Get the Azure Table Storage connection string from the environment variable added by Service Connector.
    ```python
    from azure.data.tables import TableServiceClient
    import os
    
    conn_str = os.getenv("AZURE_STORAGETABLE_CONNECTIONSTRING")
    table_service = TableServiceClient.from_connection_string(self.conn_str)
    ```


### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/data-tables
    ```
2. Get the Azure Table Storage connection string from the environment variable added by Service Connector.
    ```javascript
    const { TableClient } = require("@azure/data-tables");

    const connection_str = process.env.AZURE_STORAGETABLE_CONNECTIONSTRING;
    const serviceClient = TableServiceClient.fromConnectionString(connection_str);
    ```

### [Other](#tab/none)
For other languages, you can use the Azure Table Storage account URL and other properties that Service Connector sets to the environment variables to connect to Azure Table Storage. For environment variable details, see [Integrate Azure Table Storage with Service Connector](../how-to-integrate-storage-table.md).