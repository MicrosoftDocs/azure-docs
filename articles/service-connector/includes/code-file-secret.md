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
    dotnet add package Azure.Storage.Files.Shares --version 12.16.0
    ```
1. Get the connection string from the environment variable added by Service Connector.
    
    ```csharp
    using System;
    using Azure.Storage.Files.Shares;
    using Azure.Storage.Files.Shares.Models;
    
    var connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGEFILE_CONNECTIONSTRING");
    ShareServiceClient service = new ShareServiceClient(connectionString)
    ```
    
### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-storage-file-share</artifactId>
        <version>12.20.1</version>
    </dependency>
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```java
    import com.azure.storage.file.share.*;
    
    String connectionString = System.getenv("AZURE_STORAGEFILE_CONNECTIONSTRING");
    ShareServiceClient fileServiceClient = new ShareServiceClientBuilder()
        .connectionString(CONNECTION_STRING).buildClient();
    ```

### [SpringBoot](#tab/springBoot)

 Refer to [Storage File Sample](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1/storage/spring-cloud-azure-starter-storage-file-share/storage-file-sample) to set up your Spring application. Two sets of configuration properties are provided according to the version of Spring Cloud Azure (below 4.0 and above 4.0). For more information, check [Azure Storage File Share Properties](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#azure_storage_file_share_proeprties).

### [Python](#tab/python)

1. Install dependency.
    ```bash
    pip install azure-storage-file-share
    ```
1. Get the connection string from the environment variable added by Service Connector.
    ```python
    from azure.storage.fileshare import ShareServiceClient
    
    connection_string = os.getenv('AZURE_STORAGEFILE_CONNECTIONSTRING')
    service_client = ShareServiceClient.from_connection_string(connection_string)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependency.
    ```bash
    npm install @azure/storage-file-share
    ```
1. Get the connection string from the environment variable added by Service Connector.
    
    ```javascript
    const { ShareServiceClient } = require("@azure/storage-file-share");

    const connection_string = process.env.AZURE_STORAGEFILE_CONNECTIONSTRING;
    const shareServiceClient = ShareServiceClient.fromConnectionString(connection_string);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to Azure File Storage. For environment variable details, see [Integrate Azure Files with Service Connector](../how-to-integrate-storage-file.md).