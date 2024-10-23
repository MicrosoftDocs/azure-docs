---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/20/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.AI.OpenAI --prerelease
    dotnet add package Azure.Identity
    ```
1. Authenticate using Azure Identity library and get the Azure OpenAI endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```csharp
    using Azure.AI.OpenAI;
    using Azure.Identity;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_BASE");
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_OPENAI_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_OPENAI_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_OPENAI_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_OPENAI_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    AzureOpenAIClient openAIClient = new(
      new Uri(endpoint),
      credential
    );
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-ai-openai</artifactId>
        <version>1.0.0-beta.6</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.11.4</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the Azure OpenAI endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_OPENAI_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_OPENAI_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_OPENAI_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_OPENAI_TENANTID"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_OPENAI_BASE");
    
    OpenAIClient client = new OpenAIClientBuilder()
      .credential(credential)
      .endpoint(endpoint)
      .buildClient();
    ```

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install openai
    pip install azure-identity
    ```
1. Authenticate using `azure-identity` and get the Azure OpenAI endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    import OpenAI
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential, get_bearer_token_provider
    
    # Uncomment the following lines corresponding to the authentication type you want to use.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_OPENAI_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_OPENAI_TENANTID')
    # client_id = os.getenv('AZURE_OPENAI_CLIENTID')
    # client_secret = os.getenv('AZURE_OPENAI_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    token_provider = get_bearer_token_provider(
        cred, "https://cognitiveservices.azure.com/.default"
    )

    endpoint = os.getenv('AZURE_OPENAI_BASE')

    client = AzureOpenAI(
        api_version="2024-02-15-preview",
        azure_endpoint=endpoint,
        azure_ad_token_provider=token_provider
    )
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install --save @azure/identity
    npm install @azure/openai
    ```
1. Authenticate using `@azure/identity` and get the Azure OpenAI endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    
    // Uncomment the following lines corresponding to the authentication type you want to use.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_OPENAI_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_OPENAI_TENANTID;
    // const clientId = process.env.AZURE_OPENAI_CLIENTID;
    // const clientSecret = process.env.AZURE_OPENAI_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    const endpoint = process.env.AZURE_OPENAI_BASE;
    const client = new OpenAIClient(endpoint, credential);
    ```

### [Other](#tab/none)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect to Azure OpenAI. For environment variable details, see [Integrate Azure OpenAI with Service Connector](../how-to-integrate-openai.md).