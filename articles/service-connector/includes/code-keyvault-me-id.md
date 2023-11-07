---
author: wchigit
description: managed identity, code sample
ms.service: service-connector
ms.topic: include
ms.date: 11/02/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Identity
    dotnet add package Azure.Security.KeyVault.Secrets
    ```
1. Authenticate using `Azure.Identity` and get the Azure Key Vault endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```csharp
    using Azure.Identity;
    using Azure.Security.KeyVault.Secrets;
    using Azure.Core;
    
    // Uncomment the following lines according to the authentication type.
    // system-assigned managed identity
    // var credential = new DefaultAzureCredential();
    
    // user-assigned managed identity
    // var credential = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_KEYVAULT_CLIENTID");
    //     });
    
    // service principal 
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_KEYVAULT_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_KEYVAULT_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_KEYVAULT_CLIENTSECRET");
    // var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    string endpoint = Environment.GetEnvironmentVariable("AZURE_KEYVAULT_RESOURCEENDPOINT");
    SecretClientOptions options = new SecretClientOptions()
    {
        Retry =
        {
            Delay= TimeSpan.FromSeconds(2),
            MaxDelay = TimeSpan.FromSeconds(16),
            MaxRetries = 5,
            Mode = RetryMode.Exponential
         }
    };
    var client = new SecretClient(new Uri(endpoint), credential, options);
    
    KeyVaultSecret secret = client.GetSecret("<mySecret>");
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-security-keyvault-keys</artifactId>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Authenticate using `azure-identity` and get the Azure Key Vault endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```java
    // Uncomment the following lines according to the authentication type.
    // for system-managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();

    // for user-assigned managed identity
    // DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_KEYVAULT_CLIENTID"))
    //     .build();

    // for service principal
    // ClientSecretCredential credential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("AZURE_KEYVAULT_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_KEYVAULT_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_KEYVAULT_TENANTID"))
    //   .build();

    String url = System.getenv("AZURE_KEYVAULT_RESOURCEENDPOINT");
    KeyClient keyClient = new KeyClientBuilder()
        .vaultUrl(url)
        .credential(credential)
        .buildClient();
    ```

### [SpringBoot](#tab/spring)

Refer to [Tutorial: Connect Azure Spring Apps to Key Vault using managed identities](/azure/spring-apps/tutorial-managed-identities-key-vault?tabs=system-assigned-managed-identity) to set up your Spring application. Two sets of configuration properties are added to Spring Apps by Service Connector, according to Spring Cloud Azure version below 4.0 and above 4.0. For more information, check [Migration Guide for 4.0](https://microsoft.github.io/spring-cloud-azure/current/reference/html/appendix.html#configuration-spring-cloud-azure-starter-keyvault-secrets)

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-keyvault-keys azure-identity
    ```
1. Authenticate using `azure-identity` and get the Azure Key Vault endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    from azure.keyvault.keys import KeyClient

    # Uncomment the following lines according to the authentication type.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_KEYVAULT_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_KEYVAULT_TENANTID')
    # client_id = os.getenv('AZURE_KEYVAULT_CLIENTID')
    # client_secret = os.getenv('AZURE_KEYVAULT_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    VAULT_URL = os.environ["AZURE_KEYVAULT_RESOURCEENDPOINT"]
    client = KeyClient(vault_url=VAULT_URL, credential=cred)
    ```


### [NodeJS](#tab/nodejs)
1. Install dependencies.
    ```bash
    npm install @azure/identity
    npm install @azure/keyvault-secrets
    ```
1. Authenticate using `@azure/identity` and get the Azure Key Vault endpoint from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { SecretClient } = require("@azure/keyvault-secrets");
    
    // Uncomment the following lines according to the authentication type.
    // for system-assigned managed identity
    // const credential = new DefaultAzureCredential();
    
    // for user-assigned managed identity
    // const clientId = process.env.AZURE_KEYVAULT_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });
    
    // for service principal
    // const tenantId = process.env.AZURE_KEYVAULT_TENANTID;
    // const clientId = process.env.AZURE_KEYVAULT_CLIENTID;
    // const clientSecret = process.env.AZURE_KEYVAULT_CLIENTSECRET;
    // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const url = process.env.AZURE_KEYVAULT_RESOURCEENDPOINT;

    const client = new SecretClient(url, credential);
    ```

### [Other](#tab/other)
For other languages, you can use the connection information that Service Connector sets to the environment variables to connect Azure Key Vault. For environment variable details, see [Integrate Azure Key Vault with Service Connector](../how-to-integrate-key-vault.md).