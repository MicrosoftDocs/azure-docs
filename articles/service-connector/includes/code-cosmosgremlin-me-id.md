---
author: wchigit
description: managed identity, code sample
ms.service: service-connector
ms.topic: include
ms.date: 12/04/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Gremlin.Net
    dotnet add package Azure.Identity
    ```

1. Get an access token for the managed identity or service principal using client library [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Use the access token and `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```csharp
    using System;
    using System.Security.Authentication;
    using System.Net.Security;
    using System.Net.Http;
    using System.Security.Authentication;
    using System.Threading.Tasks;
    using System;
    using Gremlin.Net.Driver;
    using Azure.Identity;
    
    var gremlinEndpoint = Environment.GetEnvironmentVariable("AZURE_COSMOS_RESOURCEENDPOINT");
    var userName = Environment.GetEnvironmentVariable("AZURE_COSMOS_USERNAME");
    var gremlinPort = Int32.Parse(Environment.GetEnvironmentVariable("AZURE_COSMOS_PORT"));
    var listKeyUrl = Environment.GetEnvironmentVariable("AZURE_COSMOS_LISTKEYURL");
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
    
    // Get the password.
    var httpClient = new HttpClient();
    httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken.Token}");
    var response = await httpClient.POSTAsync(listKeyUrl);
    var responseBody = await response.Content.ReadAsStringAsync();
    var keys = JsonConvert.DeserializeObject<Dictionary<string, string>>(responseBody);
    var password = keys["primaryMasterKey"];
    
    // Connect to Azure Cosmos DB for Apache Gremlin
    var server = new GremlinServer(
        hostname: gremlinEndpoint,
        port: gremlinPort,
        username: userName,
        password: password,
        enableSsl: true
    );

    using var client = new GremlinClient(
        gremlinServer: server,
        messageSerializer: new Gremlin.Net.Structure.IO.GraphSON.GraphSON2MessageSerializer()
    );        
    
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
      <groupId>org.apache.tinkerpop</groupId>
      <artifactId>gremlin-driver</artifactId>
      <version>3.4.13</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```

1. Get an access token for the managed identity or service principal using `azure-identity`. Use the access token and `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    import org.apache.tinkerpop.gremlin.driver.Client;
    import org.apache.tinkerpop.gremlin.driver.Cluster;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;
    import com.azure.identity.*;
    import com.azure.core.credentital.*;
    import java.net.http.*;
    import java.net.URI;

    int gremlinPort = Integer.parseInt(System.getenv("AZURE_COSMOS_PORT"));
    String username = System.getenv("AZURE_COSMOS_USERNAME");
    String gremlinEndpoint = System.getenv("AZURE_COSMOS_RESOURCEENDPOINT");
    String listKeyUrl = System.getenv("AZURE_COSMOS_LISTKEYURL");
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
    //   .clientId(System.getenv("AZURE_COSMOS_CLIENTID"))
    //   .clientSecret(System.getenv("AZURE_COSMOS_CLIENTSECRET"))
    //   .tenantId(System.getenv("AZURE_COSMOS_TENANTID"))
    //   .build();
    
    // Get the access token.
    AccessToken accessToken = defaultCredential.getToken(new TokenRequestContext().addScopes(new String[]{ scope })).block();
    String token = accessToken.getToken();

    // Get the password.
    HttpClient client = HttpClient.newBuilder().build();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(listKeyUrl))
        .header("Authorization", "Bearer " + token)
        .POST()
        .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    JSONParser parser = new JSONParser();
    JSONObject responseBody = parser.parse(response.body());
    String gremlinPassword = responseBody.get("primaryMasterKey");
    
    // Connect to Azure Cosmos DB for Apache Gremlin
    Cluster cluster;
    Client client;

    cluster = Cluster.addContactPoint​(gremlinEndpoint).port(gremlinPort).credentials(username, password).create();
    ```

### [Python](#tab/python)
1. Install dependencies.
    ```bash
    pip install gremlinpython
    ```

1. Use `azure-identity` to authenticate with the managed identity or service principal and send request to `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```python
    from gremlin_python.driver import client, serializer
    import requests
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential

    username = os.getenv('AZURE_COSMOS_USERNAME')
    endpoint = os.getenv('AZURE_COSMOS_RESOURCEENDPOINT')
    port = os.getenv('AZURE_COSMOS_PORT')
    listKeyUrl = os.getenv('AZURE_COSMOS_LISTKEYURL')
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
    
    # Get the password 
    session = requests.Session()
    token = cred.get_token(scope)
    response = session.post(listKeyUrl, headers={"Authorization": "Bearer {}".format(token.token)})
    keys_dict = response.json()
    password = keys_dict['primaryMasterKey']
    
    # Connect to Azure Cosmos DB for Apache Gremlin.
    client = client.Client(
        url=endpoint,
        traversal_source="g",
        username=username,
        password=password,
        message_serializer=serializer.GraphSONSerializersV2d0(),
    )
    ```

### [Go](#tab/go)
1. Install dependencies.
    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/go-gremlin/gremlin
    ```

1. In code, get the access token using `azidentity`, then use it to acquire the password. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```go
    import (
        "fmt"
        "os"
        "context"
        "log"
        "io/ioutil"
        "encoding/json"

        "github.com/go-gremlin/gremlin"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )

    func main() {
        username = os.Getenv("AZURE_COSMOS_USERNAME")
        endpoint = os.getenv("AZURE_COSMOS_RESOURCEENDPOINT")
        port = os.getenv("AZURE_COSMOS_PORT")
        listKeyUrl = os.Getenv("AZURE_COSMOS_LISTKEYURL")
        scope = os.Getenv("AZUE_COSMOS_SCOPE")

        // Uncomment the following lines according to the authentication type.
        // For system-assigned identity.
        // cred, err := azidentity.NewDefaultAzureCredential(nil)
        
        // For user-assigned identity.
        // clientid := os.Getenv("AZURE_COSMOS_CLIENTID")
        // azidentity.ManagedIdentityCredentialOptions.ID := clientid
        // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
        // cred, err := azidentity.NewManagedIdentityCredential(options)
        
        // For service principal.
        // clientid := os.Getenv("AZURE_COSMOS_CLIENTID")
        // tenantid := os.Getenv("AZURE_COSMOS_TENANTID")
        // clientsecret := os.Getenv("AZURE_COSMOS_CLIENTSECRET")
        // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})

        // Acquire the access token.
        ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
        token, err := cred.GetToken(ctx, policy.TokenRequestOptions{
            Scopes: []string{scope},
        })
        
        // Acquire the connection string.
        client := &http.Client{}
        req, err := http.NewRequest("POST", listKeyUrl, nil)
        req.Header.Add("Authorization", "Bearer " + token.Token)
        resp, err := client.Do(req)
        body, err := ioutil.ReadAll(resp.Body)
        var result map[string]interface{}
        json.Unmarshal(body, &result)
        password, err := result["primaryMasterKey"];
    
        auth := gremlin.OptAuthUserPass(username, password)
	    client, err := gremlin.NewClient(endpoint, auth)
    }
    ```

### [NodeJS](#tab/nodejs)
1. Install dependencies.
   ```bash
   npm install gremlin
   npm install --save @azure/identity
   ```
1. In code, get the access token using `@azure/identity`, then use it to acquire the password. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Apache Gremlin. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    import gremlin from 'gremlin'
    const axios = require('axios');
    
    let username = process.env.AZURE_COSMOS_USERNAME;
    let endoint = process.env.AZURE_COSMOS_RESOURCEENDPOINT;
    let port = process.env.AZURE_COSMOS_PORT;
    let listKeyUrl = process.env.AZURE_COSMOS_LISTKEYURL;
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
    
    // Get the password.
    const config = {
        method: 'post',
        url: listKeyUrl,
        headers: { 
          'Authorization': `Bearer ${accessToken.token}`
        }
    };
    const response = await axios(config);
    const keysDict = response.data;
    const password = keysDict['primaryMasterKey'];
    
    const credentials = new gremlin.driver.auth.PlainTextSaslAuthenticator(
      username,
      password
    )

   const client = new gremlin.driver.Client(
      endpoint,
      {
        credentials,
        traversalsource: 'g',
        rejectUnauthorized: true,
        mimeType: 'application/vnd.gremlin-v2.0+json'
      }
    )
    
    client.open()
    ```

### [PHP](#tab/php)

Get an access token with a managed identity or a service principal to acquire the primary key of Azure Cosmos DB for Gremlin by calling REST API at `AZURE_COSMOS_LISTKEYURL`.

```php
$endpoint = getenv('AZURE_COSMOS_RESOURCEENDPOINT');
$username = getenv('AZURE_COSMOS_USERNAME');
$port = getenv('AZURE_COSMOS_PORT');

$db = new Connection([
    'host' => $endpoint,
    'username' => $username,
    'password' => $password,
    'port' => $port,
    'ssl' => TRUE
]);
```

### [Other](#tab/none)
For other languages, you can use the Apache Gremlin endpoint and other properties that Service Connector sets to the environment variables to connect to Azure Cosmos DB for Apache Gremlin resource. For environment variable details, see [Integrate Azure Cosmos DB for Apache Gremlin with Service Connector](../how-to-integrate-cosmos-gremlin.md).
