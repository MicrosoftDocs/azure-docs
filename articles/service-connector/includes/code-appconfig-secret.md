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
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    
    ```csharp
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    
    var connectionString = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_CONNECTIONSTRING");
    var builder = new ConfigurationBuilder();
    builder.AddAzureAppConfiguration(connectionString);

    var config = builder.Build();
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-data-appconfiguration</artifactId>
        <version>1.4.9</version>
    </dependency>
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    ```java
    String connectionString = System.getenv("AZURE_APPCONFIGURATION_CONNECTIONSTRING");
    ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .connectionString(connectionString)
        .buildClient();
    ```

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-appconfiguration
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    ```python
    import os
    from azure.appconfiguration import AzureAppConfigurationClient
    
    connection_string = os.getenv('AZURE_APPCONFIGURATION_CONNECTIONSTRING')
    app_config_client = AzureAppConfigurationClient.from_connection_string(connection_string)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install @azure/app-configuration
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    
    ```javascript
    const appConfig = require("@azure/app-configuration");

    const connection_string = process.env.AZURE_APPCONFIGURATION_CONNECTIONSTRING;
    const client = new appConfig.AppConfigurationClient(connection_string);
    ```

### [Other](#tab/other)
For other languages, you can use the connection information that Service Connector set to the environment variables to connect Azure App Configuration. For environment variable details, see [Integrate Azure App Configuration with Service Connector](../how-to-integrate-app-configuration.md).