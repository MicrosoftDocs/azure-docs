---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/25/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Identity
    dotnet add package Azure.Messaging.WebPubSub
    ```
1. Authenticate using `Azure.Identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```csharp
    using Azure.Identity;
    using Azure.Messaging.WebPubSub;

    // Uncomment the following lines according to the authentication type.
    // For system-assigned identity.
    // var sqlServerTokenProvider = new DefaultAzureCredential();
    
    // For user-assigned identity.
    // var sqlServerTokenProvider = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_CLIENTID");
    //     }
    // );
    
    // For service principal.
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_CLIENTSECRET");
    // var sqlServerTokenProvider = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    var endpoint = Environment.GetEnvironmentVariable("AZURE_WEBPUBSUB_HOST");

    // Replace "<hub>" with your hub name.
    var client = new WebPubSubServiceClient(new Uri(endpoint), "<hub>", credential);
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
      <groupId>com.azure</groupId>
      <artifactId>azure-identity</artifactId>
      <version>1.4.1</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-messaging-webpubsub</artifactId>
        <version>1.0.0</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```java
    // Uncomment the following lines according to the authentication type.
    // For system-assigned managed identity.
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // For user-assigned managed identity.
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_WEBPUBSUB_CLIENTID"))
    //     .build();

    // For service principal.
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_WEBPUBSUB_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_WEBPUBSUB_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_WEBPUBSUB_TENANTID>"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_WEBPUBSUB_HOST");
    
    // Replace "<hub>" with your hub name.
    WebPubSubServiceClient client = new WebPubSubServiceClientBuilder()
                .endpoint(endpoint)
                .credential(credential)
                .hub("<hub>")
                .buildClient();
    
    ```

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    python -m pip install azure-identity
    python -m pip install azure-messaging-webpubsubservice
    ```
1. Authenticate using `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    from azure.messaging.webpubsubservice import WebPubSubServiceClient
    
    # Uncomment the following lines according to the authentication type.
    # For system-assigned managed identity.
    # cred = ManagedIdentityCredential()

    # For user-assigned managed identity.
    # managed_identity_client_id = os.getenv('AZURE_WEBPUBSUB_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)

    # For service principal.
    # tenant_id = os.getenv('AZURE_WEBPUBSUB_TENANTID')
    # client_id = os.getenv('AZURE_WEBPUBSUB_CLIENTID')
    # client_secret = os.getenv('AZURE_WEBPUBSUB_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
    
    endpoint = os.getenv("AZURE_WEBPUBSUB_HOST")
    
    # Replace "<hub>" with your hub name.
    client = WebPubSubServiceClient(hub="<hub>", endpoint=endpoint, credential=cred)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install @azure/web-pubsub
    npm install --save @azure/identity
    ```
1. Authenticate using `azure-identity` and get the endpoint URL from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```javascript
    const { DefaultAzureCredential,ClientSecretCredential } = require("@azure/identity");
    const { WebPubSubServiceClient } = require("@azure/web-pubsub");

    // Uncomment the following lines according to the authentication type.  
    // For system-assigned identity.
    // const credential = new DefaultAzureCredential();
    
    // For user-assigned identity.
    // const clientId = process.env.AZURE_WEBPUBSUB_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // For service principal.
    // const tenantId = process.env.AZURE_WEBPUBSUB_TENANTID;
    // const clientId = process.env.AZURE_WEBPUBSUB_CLIENTID;
    // const clientSecret = process.env.AZURE_WEBPUBSUB_CLIENTSECRET;
    
    const endpoint = process.env.AZURE_WEBPUBSUB_HOST;
    
    // Replace "<hub>" with your hub name.
    let serviceClient = new WebPubSubServiceClient(
        endpoint,
        credential,
        "<hub>"
    );
    ```


### [Other](#tab/other)
For other languages, you can use the connection configuration properties that Service Connector set to the environment variables to connect Azure Web PubSub. For environment variable details, see [Integrate Azure Web PubSub with Service Connector](../how-to-integrate-web-pubsub.md).