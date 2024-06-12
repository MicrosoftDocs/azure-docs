---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 06/12/2024
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install the following dependency.
    ```bash
    dotnet add package Azure.AI.OpenAI --prerelease
    ```
1. Get the Azure OpenAI endpoint and API key from the environment variables added by Service Connector.
    
    ```csharp
    using Azure.AI.OpenAI;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_BASE")
    string key = Environment.GetEnvironmentVariable("AZURE_OPENAI_KEY");

    AzureOpenAIClient openAIClient = new(
      new Uri(endpoint),
      new AzureKeyCredential(key));
    ```
    
### [Java](#tab/java)

1. Add the following dependency in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-openai</artifactId>
        <version>1.0.0-beta.6</version>
    </dependency>
    ```
1. Get the Azure OpenAI endpoint and API key from the environment variables added by Service Connector.
    ```java
    String endpoint = System.getenv("AZURE_OPENAI_BASE");
    String key = System.getenv("AZURE_OPENAI_KEY");
    OpenAIClient client = new OpenAIClientBuilder()
      .credential(new AzureKeyCredential(key))
      .endpoint(endpoint)
      .buildClient();
    ```

### [Python](#tab/python)

1. Install the following dependency.
    ```bash
    pip install openai
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    ```python
    import os
    import OpenAI
    from azure.core.credentials import AzureKeyCredential
    
    openai.api_key = os.environ['AZURE_OPENAI_KEY']
    openai.base_url = os.environ['AZURE_OPENAI_BASE']
    client = OpenAI()
    ```

### [NodeJS](#tab/nodejs)

1. Install the following dependency.
    ```bash
    npm install @azure/app-configuration
    ```
1. Get the App Configuration connection string from the environment variables added by Service Connector.
    
    ```javascript
    const appConfig = require("@azure/app-configuration");

    const connection_string = process.env.AZURE_APPCONFIGURATION_CONNECTIONSTRING;
    const client = new appConfig.AppConfigurationClient(connection_string);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to Azure OpenAI. For environment variable details, see [Integrate Azure OpenAI with Service Connector](../how-to-integrate-openai.md).