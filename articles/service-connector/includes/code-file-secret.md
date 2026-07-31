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
    dotnet add package Azure.Storage.Files.Shares --version 12.16.0
    ```

1. Run the following code, getting the connection string from the Service Connector environment variable.
    
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

1. Run the following code, getting the connection string from the environment variable added by Service Connector.

    ```java
    import com.azure.storage.file.share.*;
    
    String connectionString = System.getenv("AZURE_STORAGEFILE_CONNECTIONSTRING");
    ShareServiceClient fileServiceClient = new ShareServiceClientBuilder()
        .connectionString(CONNECTION_STRING).buildClient();
    ```

### [Spring Boot](#tab/springBoot)

To set up your Spring application, see [Using Spring Cloud Azure Storage File Share Starter](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.4.1/storage/spring-cloud-azure-starter-storage-file-share/storage-file-sample). The sample provides two sets of configuration properties according to the version of Spring Cloud Azure, below 4.0 or above 4.0. For more information, see [Azure Storage File Share Properties](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#azure_storage_file_share_proeprties).

### [Python](#tab/python)

1. Install dependency.

    ```bash
    pip install azure-storage-file-share
    ```

1. Run the following code, getting the connection string from the Service Connector environment variable.

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

1. Run the following code, getting the connection string from the Service Connector environment variable.
    
    ```javascript
    const { ShareServiceClient } = require("@azure/storage-file-share");

    const connection_string = process.env.AZURE_STORAGEFILE_CONNECTIONSTRING;
    const shareServiceClient = ShareServiceClient.fromConnectionString(connection_string);
    ```

### [Others](#tab/none)

For other languages, you can use the connection information that Service Connector adds to the environment variables to connect to Azure Files.