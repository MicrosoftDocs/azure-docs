---
author: wchigit
description: managed identity, code sample
ms.service: service-connector
ms.topic: include
ms.date: 11/01/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Azure.Data.Tables
    dotnet add package Azure.Identity
    ```
2. Get an access token for the managed identity or service principal using client library [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Use the access token and `AZURE_COSMOS_LISTCONNECTIONSTRINGURL` to get the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Table. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```csharp
    using System;
    using System.Security.Authentication;
    using System.Net.Security;
    using System.Net.Http;
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using Azure.Data.Tables;
    using Azure.Identity;

    var endpoint = Environment.GetEnvironmentVariable("AZURE_COSMOS_RESOURCEENDPOINT");
    var listConnectionStringUrl = Environment.GetEnvironmentVariable("AZURE_COSMOS_LISTCONNECTIONSTRINGURL");
    var scope = Environment.GetEnvironmentVariable("AZURE_COSMOS_SCOPE");

    // Uncomment the following lines according to the authentication type.
    // For system-assigned identity.
    // var tokenProvider = new DefaultAzureCredential();

    // For user-assigned identity.
    // var tokenProvider = new DefaultAzureCredential(
    //     new DefaultAzureCredentialOptions
    //     {
    //         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTID");
    //     }
    // );

    // For service principal.
    // var tenantId = Environment.GetEnvironmentVariable("AZURE_COSMOS_TENANTID");
    // var clientId = Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTID");
    // var clientSecret = Environment.GetEnvironmentVariable("AZURE_COSMOS_CLIENTSECRET");
    // var tokenProvider = new ClientSecretCredential(tenantId, clientId, clientSecret);

    // Acquire the access token. 
    AccessToken accessToken = await tokenProvider.GetTokenAsync(
        new TokenRequestContext(scopes: new string[]{ scope }));

    // Get the connection string.
    var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken.Token}");
    var response = await httpClient.POSTAsync(listConnectionStringUrl);
    var responseBody = await response.Content.ReadAsStringAsync();
    var connectionStrings = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseBody);
    var connectionString = connectionStrings["Primary Table Connection String"];

    // Connect to Azure Cosmos DB for Table
    TableServiceClient tableServiceClient = new TableServiceClient(connectionString);
    ```
### [Java](#tab/java)
1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-data-tables</artifactId>
        <version>12.2.1</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Get an access token for the managed identity or service principal using `azure-identity`. Use the access token and `AZURE_COSMOS_LISTCONNECTIONSTRINGURL` to get the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Table. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```java
    import com.azure.data.tables.TableClient;
    import com.azure.data.tables.TableClientBuilder;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;
    import com.azure.identity.*;
    import com.azure.core.credentital.*;
    import java.net.http.*;

    String endpoint = System.getenv("AZURE_COSMOS_RESOURCEENDPOINT");
    String listConnectionStringUrl = System.getenv("AZURE_COSMOS_LISTCONNECTIONSTRINGURL");
    String scope = System.getenv("AZURE_COSMOS_SCOPE");

    // Uncomment the following lines according to the authentication type.
    // For system managed identity.
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

    // For user assigned managed identity.
    // DefaultAzureCredential defaultCredential = new DefaultAzureCredentialBuilder()
    //     .managedIdentityClientId(System.getenv("AZURE_COSMOS_CLIENTID"))
    //     .build();

    // For service principal.
    // ClientSecretCredential defaultCredential = new ClientSecretCredentialBuilder()
    //   .clientId(System.getenv("<AZURE_COSMOS_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_COSMOS_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_COSMOS_TENANTID>"))
    //   .build();

    // Get the access token.
    AccessToken accessToken = defaultCredential.getToken(new TokenRequestContext().addScopes(new String[]{ scope })).block();
    String token = accessToken.getToken();

    // Get the connection string.
    HttpClient client = HttpClient.newBuilder().build();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(listConnectionStringUrl))
        .header("Authorization", "Bearer " + token)
        .POST()
        .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    JSONParser parser = new JSONParser();
    JSONObject responseBody = parser.parse(response.body());
    String connectionString = responseBody.get("Primary Table Connection String");

    // Connect to Azure Cosmos DB for Table
    TableClient tableClient = new TableClientBuilder()
        .connectionString(connectionString)
        .buildClient();
    ```
### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install azure-data-tables
    pip install azure-identity
    ```
1. Get an access token for the managed identity or service principal using `azure-identity`. Use the access token and `AZURE_COSMOS_LISTCONNECTIONSTRINGURL` to get the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Table. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os
    from azure.data.tables import TableServiceClient
    import requests
    from azure.core.pipeline.policies import BearerTokenCredentialPolicy
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential

    endpoint = os.getenv('AZURE_COSMOS_RESOURCEENDPOINT')
    listKeyUrl = os.getenv('AZURE_COSMOS_LISTCONNECTIONSTRINGURL')
    scope = os.getenv('AZURE_COSMOS_SCOPE')

    # Uncomment the following lines according to the authentication type.
    # For system-assigned managed identity
    # cred = ManagedIdentityCredential()

    # For user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_COSMOS_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)

    # For service principal
    # tenant_id = os.getenv('AZURE_COSMOS_TENANTID')
    # client_id = os.getenv('AZURE_COSMOS_CLIENTID')
    # client_secret = os.getenv('AZURE_COSMOS_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    # Get the connection string
    session = requests.Session()
    session = BearerTokenCredentialPolicy(cred, scope).on_request(session)
    response = session.post(listKeyUrl)
    keys_dict = response.json()
    conn_str = keys_dict["Primary Table Connection String"]

    # Connect to Azure Cosmos DB for Table
    table_service = TableServiceClient.from_connection_string(conn_str) 
    ```
### [NodeJS](#tab/node)
1. Install dependencies
   ```bash
   npm install @azure/data-tables
   npm install --save @azure/identity
   ```
2. In code, get the access token using `@azure/identity`, then use it to acquire the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for MongoDB. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { TableClient } = require("@azure/data-tables");
    const axios = require('axios');

    let endpoint = process.env.AZURE_COSMOS_RESOURCEENDPOINT;
    let listConnectionStringUrl = process.env.AZURE_COSMOS_LISTCONNECTIONSTRINGURL;
    let scope = process.env.AZURE_COSMOS_SCOPE;

    // Uncomment the following lines according to the authentication type.  
    // For system-assigned identity.
    // const credential = new DefaultAzureCredential();

    // For user-assigned identity.
    // const clientId = process.env.AZURE_COSMOS_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });

    // For service principal.
    // const tenantId = process.env.AZURE_COSMOS_TENANTID;
    // const clientId = process.env.AZURE_COSMOS_CLIENTID;
    // const clientSecret = process.env.AZURE_COSMOS_CLIENTSECRET;

    // Acquire the access token.
    var accessToken = await credential.getToken(scope);

    // Get the connection string.
    const config = {
        method: 'post',
        url: listConnectionStringUrl,
        headers: { 
          'Authorization': `Bearer ${accessToken.token}`
        }
    };
    const response = await axios(config);
    const keysDict = response.data;
    const connectionString = keysDict['Primary Table Connection String'];

    // Connect to Azure Cosmos DB for Table
    const serviceClient = TableClient.fromConnectionString(connectionString);
    ```