---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 07/28/2025
ms.author: wchi
---

You can use the Azure client library to access various cognitive APIs that an Azure AI multi-service resource supports. This sample uses Azure AI Text Analytics as an example. To call the cognitive APIs directly, see [Authenticate with Microsoft Entra ID](/azure/ai-services/authentication#authenticate-with-azure-active-directory).

### [.NET](#tab/dotnet)

1. Install the following dependencies. This example uses `Azure.AI.TextAnalytics`.

    ```bash
    dotnet add package Azure.AI.TextAnalytics
    dotnet add package Azure.Identity
    ```

1. Authenticate using Azure Identity library and get the Azure AI multi-service resource endpoint from the environment variables added by Service Connector. When you use the following code, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```csharp
    using Azure.AI.TextAnalytics;
    using Azure.Identity;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_ENDPOINT");
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_COGNITIVESERVICES_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    TextAnalyticsClient languageServiceClient = new(
      new Uri(endpoint),
      credential);
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file. This example uses`azure-ai-textanalytics`.

    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-textanalytics</artifactId>
        <version>5.1.12</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.11.4</version>
    </dependency>
    ```

1. Authenticate using `azure-identity` and get the Azure AI multi-service resource endpoint from the environment variables added by Service Connector. When you use the following code, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_COGNITIVESERVICES_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_COGNITIVESERVICES_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_COGNITIVESERVICES_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_COGNITIVESERVICES_TENANTID"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_COGNITIVESERVICES_ENDPOINT");
    
    TextAnalyticsClient languageClient = new TextAnalyticsClientBuilder()
        .credential(credential)
        .endpoint(endpoint)
        .buildClient();
    ```

### [Python](#tab/python)

1. Install the following dependencies. This example uses `azure-ai-textanalytics`.

    ```bash
    pip install azure-ai-textanalytics==5.1.0
    pip install azure-identity
    ```

1. Authenticate using `azure-identity` and get the Azure AI multi-service resource endpoint from the environment variables added by Service Connector. When you use the following code, uncomment the part of the code snippet for the authentication type you want to use.

    ```python
    import os
    from azure.ai.textanalytics import TextAnalyticsClient
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    
    # Uncomment the following lines corresponding to the authentication type you want to use.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_COGNITIVESERVICES_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_COGNITIVESERVICES_TENANTID')
    # client_id = os.getenv('AZURE_COGNITIVESERVICES_CLIENTID')
    # client_secret = os.getenv('AZURE_COGNITIVESERVICES_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
    endpoint = os.getenv('AZURE_COGNITIVESERVICES_ENDPOINT')

    language_service_client = TextAnalyticsClient(
      endpoint=endpoint, 
      credential=cred)
    ```

### [NodeJS](#tab/nodejs)

1. Install the following dependencies. This example uses`ai-text-analytics`.

    ```bash
    npm install @azure/ai-text-analytics@5.1.0
    npm install @azure/identity
    ```

1. Authenticate using `@azure/identity` and get the Azure AI multi-service resource endpoint from the environment variables added by Service Connector. When you use the following code, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { TextAnalyticsClient } = require("@azure/ai-text-analytics");
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_COGNITIVESERVICES_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_COGNITIVESERVICES_TENANTID;
    // const clientId = process.env.AZURE_COGNITIVESERVICES_CLIENTID;
    // const clientSecret = process.env.AZURE_COGNITIVESERVICES_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    const endpoint = process.env.AZURE_COGNITIVESERVICES_ENDPOINT;
    const languageClient = new TextAnalyticsClient(endpoint, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to an Azure AI multi-service resource. For environment variable details, see [Integrate an Azure AI multi-service resource with Service Connector](../how-to-integrate-cognitive-services.md).