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
    dotnet add package Microsoft.Extensions.Configuration.AzureAppConfiguration
    dotnet add package Azure.Identity
    ```
1. Authenticate using `Azure.Identity` and get the Azure App Configuration endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```csharp
    using Azure.Identity;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Configuration.AzureAppConfiguration;
    
    string endpoint = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_ENDPOINT");
    
    // Uncomment the following lines according to the authentication type.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_APPCONFIGURATION_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    var client = new ConfigurationClient(new Uri(endpoint), credential);
    ```
    
### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-data-appconfiguration</artifactId>
        <version>1.4.9</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the Azure App Configuration endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    // Uncomment the following lines according to the authentication type.
    // for system-managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_APPCONFIGURATION_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_APPCONFIGURATION_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_APPCONFIGURATION_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_APPCONFIGURATION_TENANTID"))
    //   .build();
    
    String endpoint = System.getenv("AZURE_APPCONFIGURATION_ENDPOINT");

    ConfigurationClient configurationClient = new ConfigurationClientBuilder()
        .credential(credential)
        .endpoint(endpoint)
        .buildClient();
    ```

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-appconfiguration
    pip install azure-identity
    ```
1. Authenticate using `azure-identity` and get the Azure App Configuration endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    from azure.appconfiguration import AzureAppConfigurationClient
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    
    # Uncomment the following lines according to the authentication type.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_APPCONFIGURATION_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_APPCONFIGURATION_TENANTID')
    # client_id = os.getenv('AZURE_APPCONFIGURATION_CLIENTID')
    # client_secret = os.getenv('AZURE_APPCONFIGURATION_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    endpoint_url = os.getenv('AZURE_APPCONFIGURATION_ENDPOINT')

    client = AzureAppConfigurationClient(base_url="your_endpoint_url", credential=credential)
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install --save @azure/identity
    npm install @azure/app-configuration
    ```
1. Authenticate using `@azure/identity` and get the Azure App Configuration endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const appConfig = require("@azure/app-configuration");
    
    // Uncomment the following lines according to the authentication type.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_APPCONFIGURATION_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_APPCONFIGURATION_TENANTID;
    // const clientId = process.env.AZURE_APPCONFIGURATION_CLIENTID;
    // const clientSecret = process.env.AZURE_APPCONFIGURATION_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    
    const endpoint = process.env.AZURE_APPCONFIGURATION_ENDPOINT;

    const client = new appConfig.AppConfigurationClient(
        endpoint,
        credential
    );
    ```

### [None](#tab/none)
For other languages, you can use the connection information that Service Connector set to the environment variables to connect Azure App Configuration. For environment variable details, see [Integrate Azure App Configuration with Service Connector](../how-to-integrate-app-configuration.md).