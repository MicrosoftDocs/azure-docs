---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 07/28/2025
ms.author: wchi
---

You can use the Azure client library to access various cognitive APIs that an Azure AI multi-service resource supports. This sample uses Azure AI Text Analytics as an example. To call the cognitive APIs directly, see [Authenticate with an AI Foundry resource key](/azure/ai-services/authentication#authenticate-with-an-ai-foundry-resource-key).

### [.NET](#tab/dotnet)

1. Install the following dependencies. This example uses `Azure.AI.TextAnalytics`.

    ```bash
    dotnet add package Azure.AI.TextAnalytics
    dotnet add package Azure.Core --version 1.40.0
    ```

1. Get the Azure AI multi-service resource endpoint and key from the environment variables added by Service Connector.
    
    ```csharp
    using Azure.AI.TextAnalytics;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_ENDPOINT")
    string key = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_KEY");

    TextAnalyticsClient languageServiceClient = new(
      new Uri(endpoint),
      new AzureKeyCredential(key));
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file. This example uses `azure-ai-textanalytics`.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-core</artifactId>
        <version>1.49.1</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.1.12</version>
    </dependency>
    ```

1. Get the Azure AI multi-service resource endpoint and key from the environment variables added by Service Connector.

    ```java
    String endpoint = System.getenv("AZURE_COGNITIVESERVICES_ENDPOINT");
    String key = System.getenv("AZURE_COGNITIVESERVICES_KEY");
    TextAnalyticsClient languageClient = new TextAnalyticsClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();
    ```

### [Python](#tab/python)

1. Install the following dependencies. This example uses `azure-ai-textanalytics`.

    ```bash
    pip install azure-ai-textanalytics==5.1.0
    pip install azure-core
    ```

1. Get the Azure AI multi-service resource endpoint and key from the environment variables added by Service Connector.

    ```python
    import os
    from azure.ai.textanalytics import TextAnalyticsClient
    from azure.core.credentials import AzureKeyCredential
    
    key = os.environ['AZURE_COGNITIVESERVICES_KEY']
    endpoint = os.environ['AZURE_COGNITIVESERVICES_ENDPOINT']
    language_service_client = TextAnalyticsClient(
      endpoint=retrieved_endpoint, 
      credential=AzureKeyCredential(key))
    ```

### [NodeJS](#tab/nodejs)

1. Install the following dependency. This example uses `ai-text-analytics`.

    ```bash
    npm install @azure/ai-text-analytics@5.1.0
    ```

1. Get the Azure AI multi-service resource endpoint and key from the environment variables added by Service Connector.
    
    ```javascript
    const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

    const endpoint = process.env.AZURE_COGNITIVESERVICES_ENDPOINT;
    const credential = new AzureKeyCredential(process.env.AZURE_COGNITIVESERVICES_KEY);

    const languageClient = new TextAnalyticsClient(endpoint, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to an Azure AI multi-service resource. For environment variable details, see [Integrate an Azure AI multi-service resource with Service Connector](../how-to-integrate-cognitive-services.md).