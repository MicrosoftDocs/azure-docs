---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/31/2023
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies
    ```bash
    dotnet add package MongoDb.Driver
    dotnet add package Azure.Identity
    ```

2. Get an access token for the managed identity or service principal using client library [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Use the access token and `AZURE_COSMOS_LISTCONNECTIONSTRINGURL` to get the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for MongoDB. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```csharp
    using System;
    using System.Security.Authentication;
    using System.Net.Security;
    using System.Net.Http;
    using System.Security.Authentication;
    using System.Security.Cryptography.X509Certificates;
    using System.Threading.Tasks;
    using MongoDB.Driver;
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
    var connectionString = connectionStrings["Primary MongoDB Connection String"];
    
    // Connect to Azure Cosmos DB for MongoDB
    var client = new MongoClient(connectionString);
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
	    <groupId>org.mongodb</groupId>
	    <artifactId>mongo-java-driver</artifactId>
	    <version>3.4.2</version>
	</dependency> 
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```

1. Get an access token for the managed identity or service principal using `azure-identity`. Use the access token and `AZURE_COSMOS_LISTCONNECTIONSTRINGURL` to get the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for MongoDB. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    import com.mongodb.MongoClient;
    import com.mongodb.MongoClientURI;
    import com.mongodb.client.MongoCollection;
    import com.mongodb.client.MongoDatabase;
    import com.mongodb.client.model.Filters;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;
    import com.azure.identity.*;
    import com.azure.core.credentital.*;
    import java.net.http.*;
    import java.net.URI;

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
    String connectionString = responseBody.get("Primary MongoDB Connection String");
    
    // Connect to Azure Cosmos DB for MongoDB
    MongoClientURI uri = new MongoClientURI(connectionString);
    MongoClient mongoClient = new MongoClient(uri);
    ```

### [SpringBoot](#tab/springBoot)
The authentication type is not supported for Spring Boot.


### [Go](#tab/go)
1. Install dependencies.
   ```bash
   go get go.mongodb.org/mongo-driver/mongo
   go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
   go get "github.com/Azure/azure-sdk-for-go/sdk/azcore"
   ```
2. In code, get access token via `azidentity`, then use it to acquire the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for MongoDB. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```go
    import (
        "fmt"
        "os"
        "context"
        "log"
        "io/ioutil"
        "encoding/json"
    
        "go.mongodb.org/mongo-driver/bson"
    	"go.mongodb.org/mongo-driver/mongo"
    	"go.mongodb.org/mongo-driver/mongo/options"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )
    
    endpoint = os.Getenv("AAZURE_COSMOS_RESOURCEENDPOINT")
    listConnectionStringUrl = os.Getenv("AZURE_COSMOS_LISTCONNECTIONSTRINGURL")
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
    req, err := http.NewRequest("POST", listConnectionStringUrl, nil)
    req.Header.Add("Authorization", "Bearer " + token.Token)
    resp, err := client.Do(req)
    body, err := ioutil.ReadAll(resp.Body)
    var result map[string]interface{}
    json.Unmarshal(body, &result)
    connectionString, err := result["Primary MongoDB Connection String"]
    
    // Connect to Azure Cosmos DB for MongoDB
    ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
    clientOptions := options.Client().ApplyURI(connectionString).SetDirect(true)
    
    c, err := mongo.Connect(ctx, clientOptions)
    ```

### [NodeJS](#tab/node)
1. Install dependencies
   ```bash
   npm install mongodb
   npm install --save @azure/identity
   ```
2. In code, get the access token via `@azure/identity`, then use it to acquire the connection string. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for MongoDB. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const { MongoClient, ObjectId } = require('mongodb');
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
    const connectionString = keysDict['Primary MongoDB Connection String'];
    
    const client = new MongoClient(connectionString);
    ```


### [None](#tab/none)
For other languages, you can use the MongoDB resource endpoint and other properties that Service Connector sets to the environment variables to connect the Azure Cosmos DB for MongoDB. For environment variable details, see [Integrate Azure Cosmos DB for MongoDB with Service Connector](../how-to-integrate-cosmos-db.md).