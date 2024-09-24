---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 06/12/2024
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install the following dependencies.
    ```bash
    dotnet add package Azure.AI.OpenAI --prerelease
    dotnet add package Azure.Core --version 1.40.0
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
        <artifactId>azure-core</artifactId>
        <version>1.49.1</version>
    </dependency>
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

1. Install the following dependencies.
    ```bash
    pip install openai
    pip install azure-core
    ```
1. Get the Azure OpenAI endpoint and API key from the environment variables added by Service Connector.
    ```python
    import os
    from openai import AzureOpenAI
    from azure.core.credentials import AzureKeyCredential
    
    key = os.environ['AZURE_OPENAI_KEY']
    endpoint = os.environ['AZURE_OPENAI_BASE']
    client = AzureOpenAI(
        api_version="2024-02-15-preview",
        azure_endpoint=endpoint,
        api_key=key
    )
    ```

### [NodeJS](#tab/nodejs)

1. Install the following dependencies.
    ```bash
    npm install @azure/openai
    npm install @azure/core-auth
    ```
1. Get the Azure OpenAI endpoint and API key from the environment variables added by Service Connector.
    
    ```javascript
    import { OpenAIClient } from "@azure/openai";
    import { AzureKeyCredential } from "@azure/core-auth";

    const endpoint = process.env.AZURE_OPENAI_BASE;
    const credential = new AzureKeyCredential(process.env.AZURE_OPENAI_KEY);

    const client = new OpenAIClient(endpoint, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to Azure OpenAI. For environment variable details, see [Integrate Azure OpenAI with Service Connector](../how-to-integrate-openai.md).