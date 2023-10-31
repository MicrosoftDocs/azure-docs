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
    dotnet add package CassandraCSharpDriver --version 3.19.3
    dotnet add package Azure.Identity
    ```

2. Get an access token for the managed identity or service principal using client library [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Use the access token and `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Cassandra. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```csharp
    using System;
    using System.Security.Authentication;
    using System.Net.Security;
    using System.Net.Http;
    using System.Security.Authentication;
    using System.Security.Cryptography.X509Certificates;
    using System.Threading.Tasks;
    using Cassandra;
    using Azure.Identity;
    
    public class Program
    {
    	public static async Task Main()
    	{
            var cassandraContactPoint = Environment.GetEnvironmentVariable("AZURE_COSMOS_CONTACTPOINT");
            var userName = Environment.GetEnvironmentVariable("AZURE_COSMOS_USERNAME");
            var cassandraPort = Int32.Parse(Environment.GetEnvironmentVariable("AZURE_COSMOS_PORT"));
            var cassandraKeyspace = Environment.GetEnvironmentVariable("AZURE_COSMOS_KEYSPACE");
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
            
            // Connect to Azure Cosmos DB for Cassandra
            var options = new Cassandra.SSLOptions(SslProtocols.Tls12, true, ValidateServerCertificate);
            options.SetHostNameResolver((ipAddress) => cassandraContactPoint);
            Cluster cluster = Cluster
                .Builder()
                .WithCredentials(userName, password)
                .WithPort(cassandraPort)
                .AddContactPoint(cassandraContactPoint).WithSSL(options).Build();
            ISession session = await cluster.ConnectAsync();
        }
    
        public static bool ValidateServerCertificate
    	(
            object sender,
            X509Certificate certificate,
            X509Chain chain,
            SslPolicyErrors sslPolicyErrors
        )
        {
            if (sslPolicyErrors == SslPolicyErrors.None)
                return true;
    
            Console.WriteLine("Certificate error: {0}", sslPolicyErrors);
            // Do not allow this client to communicate with unauthenticated servers.
            return false;
        }
    }
    
    ```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:
    ```xml
    <dependency>
        <groupId>com.datastax.oss</groupId>
        <artifactId>java-driver-core</artifactId>
        <version>4.5.1</version>
    </dependency>  
    <dependency>
        <groupId>com.datastax.oss</groupId>
        <artifactId>java-driver-query-builder</artifactId>
        <version>4.0.0</version>
    </dependency>       
    <dependency>
        <groupId>com.datastax.cassandra</groupId>
        <artifactId>cassandra-driver-extras</artifactId>
        <version>3.1.4</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```

1. Get an access token for the managed identity or service principal using `azure-identity`. Use the access token and `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Cassandra. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```java
    import com.datastax.oss.driver.api.core.CqlSession;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;
    import com.azure.identity.*;
    import com.azure.core.credentital.*;
    import java.net.http.*;
    import java.net.URI;

    int cassandraPort = Integer.parseInt(System.getenv("AZURE_COSMOS_PORT"));
    String cassandraUsername = System.getenv("AZURE_COSMOS_USERNAME");
    String cassandraHost = System.getenv("AZURE_COSMOS_CONTACTPOINT");
    String cassandraKeyspace = System.getenv("AZURE_COSMOS_KEYSPACE");
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
    //   .clientId(System.getenv("<AZURE_COSMOS_CLIENTID>"))
    //   .clientSecret(System.getenv("<AZURE_COSMOS_CLIENTSECRET>"))
    //   .tenantId(System.getenv("<AZURE_COSMOS_TENANTID>"))
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
    String cassandraPassword = responseBody.get("primaryMasterKey");
    
    // Connect to Azure Cosmos DB for Cassandra
    final SSLContext sc = SSLContext.getInstance("TLSv1.2");
    CqlSession session = CqlSession.builder().withSslContext(sc)
        .addContactPoint(new InetSocketAddress(cassandraHost, cassandraPort)).withLocalDatacenter('datacenter1')
        .withAuthCredentials(cassandraUsername, cassandraPassword).build();
    ```

### [SpringBoot](#tab/spring)
Authentication type is not supported for Spring Boot.

### [Python](#tab/python)
1. Install dependencies
    ```bash
    pip install Cassandra-driver 
    pip install pyopenssl
    pip install azure-identity
    ```

1. Use `azure-identity` to authenticate with the managed identity or service principal and send request to `AZURE_COSMOS_LISTKEYURL` to get the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Cassandra. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    from cassandra.cluster import Cluster
    from ssl import PROTOCOL_TLSv1_2, SSLContext, CERT_NONE
    from cassandra.auth import PlainTextAuthProvider
    import requests
    from azure.core.pipeline.policies import BearerTokenCredentialPolicy
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential

    username = os.getenv('AZURE_COSMOS_USERNAME')
    contactPoint = os.getenv('AZURE_COSMOS_CONTACTPOINT')
    port = os.getenv('AZURE_COSMOS_PORT')
    keyspace = os.getenv('AZURE_COSMOS_KEYSPACE')
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
    session = BearerTokenCredentialPolicy(cred, scope).on_request(session)
    response = session.post(listKeyUrl)
    keys_dict = response.json()
    password = keys_dict['primaryMasterKey']
    
    # Connect to Azure Cosmos DB for Cassandra.
    ssl_context = SSLContext(PROTOCOL_TLSv1_2)
    ssl_context.verify_mode = CERT_NONE
    auth_provider = PlainTextAuthProvider(username, password)
    cluster = Cluster([contanctPoint], port = port, auth_provider=auth_provider,ssl_context=ssl_context)
    session = cluster.connect()
    ```

### [Go](#tab/go)
1. Install dependencies.
   ```bash
   go get github.com/gocql/gocql
   go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
   go get "github.com/Azure/azure-sdk-for-go/sdk/azcore"
   ```
2. In code, get an access token via `azidentity`, then use it to acquire the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Cassandra. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```go
    import (
        "fmt"
        "os"
        "context"
        "log"
        "io/ioutil"
        "encoding/json"
    
        "github.com/gocql/gocql"
        "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    )
    
    func GetSession() *gocql.Session {
        cosmosCassandraContactPoint = os.Getenv("AAZURE_COSMOS_CONTACTPOINT")
        cosmosCassandraPort = os.Getenv("AZURE_COSMOS_PORT")
        cosmosCassandraUser = os.Getenv("AZURE_COSMOS_USERNAME")
        cosmosCassandraKeyspace = os.Getenv("AZURE_COSMOS_KEYSPACE")
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
        
        // Acquire the password.
        client := &http.Client{}
    	req, err := http.NewRequest("POST", listKeyUrl, nil)
    	req.Header.Add("Authorization", "Bearer " + token.Token)
    	resp, err := client.Do(req)
        body, err := ioutil.ReadAll(resp.Body)
        var result map[string]interface{}
	    json.Unmarshal(body, &result)
        cosmosCassandraPassword, err := result["primaryMasterKey"]
        
        // Connect to Azure Cosmos DB for Cassandra
        clusterConfig := gocql.NewCluster(cosmosCassandraContactPoint)
        port, err := strconv.Atoi(cosmosCassandraPort)
        clusterConfig.Port = port
	    clusterConfig.ProtoVersion = 4
        clusterConfig.Authenticator = gocql.PasswordAuthenticator{Username: cosmosCassandraUser, Password: cosmosCassandraPassword}
        clusterConfig.SslOpts = &gocql.SslOptions{Config: &tls.Config{MinVersion: tls.VersionTLS12}}
        
        session, err := clusterConfig.CreateSession()
        return session
    }
    
    func main() {
        session := utils.GetSession(cosmosCassandraContactPoint, cosmosCassandraPort, cosmosCassandraUser, cosmosCassandraPassword)
        defer session.Close()
        ...
    }
    ```

### [NodeJS](#tab/node)
1. Install dependencies
   ```bash
   npm install cassandra-driver
   npm install --save @azure/identity
   ```
2. In code, get the access token via `@azure/identity`, then use it to acquire the password. Get the connection information from the environment variables added by Service Connector and connect to Azure Cosmos DB for Cassandra. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```javascript
    import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
    const cassandra = require("cassandra-driver");
    const axios = require('axios');
    
    let username = process.env.AZURE_COSMOS_USERNAME;
    let contactPoint = process.env.AZURE_COSMOS_CONTACTPOINT;
    let port = process.env.AZURE_COSMOS_PORT;
    let keyspace = process.env.AZURE_COSMOS_KEYSPACE;
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
    
    let authProvider = new cassandra.auth.PlainTextAuthProvider(
        username,
        password
    );
    
    let client = new cassandra.Client({
        contactPoints: [`${contactPoint}:${port}`],
        authProvider: authProvider,
        localDataCenter: 'datacenter1',
        sslOptions: {
            secureProtocol: "TLSv1_2_method"
        },
    });
    
    client.connect();
    ```


### [Other](#tab/other)
For other languages, you can use the Cassandra contact point and other properties that Service Connector sets to the environment variables to connect the Azure Cosmos DB for Cassandra resource. For environment variable details, see [Integrate Azure Cosmos DB for Cassandra with Service Connector](../how-to-integrate-cosmos-cassandra.md).
