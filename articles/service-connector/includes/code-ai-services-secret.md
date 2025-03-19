---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 06/19/2024
ms.author: wchi
---

You can use the Azure client library to access various cognitive APIs that Azure AI Services support. We use Azure AI Text Analytics as an example in this sample. Refer to [Authenticate requests to Azure AI services](/azure/ai-services/authentication#authenticate-with-a-multi-service-resource-key) to call the cognitive APIs directly.

### [.NET](#tab/dotnet)

1. Install the following dependencies. We use `Azure.AI.TextAnalytics` as an example.
    ```bash
    dotnet add package Azure.AI.TextAnalytics
    dotnet add package Azure.Core --version 1.40.0
    ```
1. Get the Azure AI Services endpoint and key from the environment variables added by Service Connector.
    
    ```csharp
    using Azure.AI.TextAnalytics;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT")
    string key = Environment.GetEnvironmentVariable("AZURE_AISERVICES_KEY");

    TextAnalyticsClient languageServiceClient = new(
      new Uri(endpoint),
      new AzureKeyCredential(key));
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file. We use `azure-ai-textanalytics` as an example.
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
1. Get the Azure AI Services endpoint and key from the environment variables added by Service Connector.
    ```java
    String endpoint = System.getenv("AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT");
    String key = System.getenv("AZURE_AISERVICES_KEY");
    TextAnalyticsClient languageClient = new TextAnalyticsClientBuilder()
        .credential(new AzureKeyCredential(key))
        .endpoint(endpoint)
        .buildClient();
    ```

### [Python](#tab/python)

1. Install the following dependencies. We use `azure-ai-textanalytics` as an example.
    ```bash
    pip install azure-ai-textanalytics==5.1.0
    pip install azure-core
    ```
1. Get the Azure AI Services endpoint and key from the environment variables added by Service Connector.
    ```python
    import os
    from azure.ai.textanalytics import TextAnalyticsClient
    from azure.core.credentials import AzureKeyCredential
    
    key = os.environ['AZURE_AISERVICES_KEY']
    endpoint = os.environ['AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT']
    language_service_client = TextAnalyticsClient(
      endpoint=retrieved_endpoint, 
      credential=AzureKeyCredential(key))
    ```

### [NodeJS](#tab/nodejs)

1. Install the following dependency. We use `ai-text-analytics` as an example.
    ```bash
    npm install @azure/ai-text-analytics@5.1.0
    ```
1. Get the Azure AI Services endpoint and key from the environment variables added by Service Connector.
    
    ```javascript
    const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

    const endpoint = process.env.AZURE_AISERVICES_COGNITIVESERVICES_ENDPOINT;
    const credential = new AzureKeyCredential(process.env.AZURE_AISERVICES_KEY);

    const languageClient = new TextAnalyticsClient(endpoint, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to Azure AI Services. For environment variable details, see [Integrate Azure AI services with Service Connector](../how-to-integrate-ai-services.md).