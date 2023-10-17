---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/17/2023
ms.author: wchi
---


### [.NET](#tab/dotnet)

1. Install dependencies
```bash
dotnet add package CassandraCSharpDriver --version 3.19.3
```

2. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Cassandra.
```csharp
using System;
using System.Security.Authentication;
using System.Net.Security;
using System.Security.Authentication;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Cassandra;

public class Program
{
	public static async Task Main()
	{
        var cassandraContactPoint = Environment.GetEnvironmentVariable("AZURE_COSMOS_CONTACTPOINT");
        var userName = Environment.GetEnvironmentVariable("AZURE_COSMOS_USERNAME");
        var password = Environment.GetEnvironmentVariable("AZURE_COSMOS_PASSWORD");
        var cassandraPort = Int32.Parse(Environment.GetEnvironmentVariable("AZURE_COSMOS_PORT"));
        var cassandraKeyspace = Environment.GetEnvironmentVariable("AZURE_COSMOS_KEYSPACE");
        
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

For more information, see [Build an Apache Cassandra app with .NET SDK and Azure Cosmos DB](/azure/cosmos-db/cassandra/manage-data-dotnet).

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
    ```

1. Get the connection string from the environment variable, and add the plugin name to connect to Cosmos DB for Cassandra:

    ```java
    import com.datastax.oss.driver.api.core.CqlSession;
    import javax.net.ssl.*;
    import java.net.InetSocketAddress;

    int cassandraPort = Integer.parseInt(System.getenv("AZURE_COSMOS_PORT"));
    String cassandraUsername = System.getenv("AZURE_COSMOS_USERNAME");
    String cassandraHost = System.getenv("AZURE_COSMOS_CONTACTPOINT");
    String cassandraPassword = System.getenv("AZURE_COSMOS_PASSWORD");
    String cassandraKeyspace = System.getenv("AZURE_COSMOS_KEYSPACE");

    final SSLContext sc = SSLContext.getInstance("TLSv1.2");
    
    CqlSession session = CqlSession.builder().withSslContext(sc)
        .addContactPoint(new InetSocketAddress(cassandraHost, cassandraPort)).withLocalDatacenter('datacenter1')
        .withAuthCredentials(cassandraUsername, cassandraPassword).build();
    ```

For more information, see [Build a Java app to manage Azure Cosmos DB for Apache Cassandra data](/azure/cosmos-db/cassandra/manage-data-java-v4-sdk).

### [SpringBoot](#tab/spring)
Set up your Spring App application according to this [tutorial](/azure/developer/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db). The connection configurations are added to Spring Apps by Service Connector.


### [Python](#tab/python)
1. Install dependencies
    ```bash
    pip install Cassandra-driver 
    pip install pyopenssl
    ```

1. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Cassandra.
    ```python
    from cassandra.cluster import Cluster
    from ssl import PROTOCOL_TLSv1_2, SSLContext, CERT_NONE
    from cassandra.auth import PlainTextAuthProvider

    username = os.getenv('AZURE_COSMOS_USERNAME')
    password = os.getenv('AZURE_COSMOS_PASSWORD')
    contactPoint = os.getenv('AZURE_COSMOS_CONTACTPOINT')
    port = os.getenv('AZURE_COSMOS_PORT')
    keyspace = os.getenv('AZURE_COSMOS_KEYSPACE')
    
    ssl_context = SSLContext(PROTOCOL_TLSv1_2)
    ssl_context.verify_mode = CERT_NONE
    auth_provider = PlainTextAuthProvider(username, password)
    cluster = Cluster([contanctPoint], port = port, auth_provider=auth_provider,ssl_context=ssl_context)
    session = cluster.connect()
    ```

For more information, see [Build a Cassandra app with Python SDK and Azure Cosmos DB](/azure/cosmos-db/cassandra/manage-data-python)

### [Go](#tab/go)
1. Install dependencies.
   ```bash
   go get github.com/gocql/gocql
   ```
2. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Cassandra.
    ```go
    import (
        "fmt"
        "os"
        "context"
        "log"
    
        "github.com/gocql/gocql"
    )
    
    func GetSession() *gocql.Session {
        cosmosCassandraContactPoint = os.Getenv("AAZURE_COSMOS_CONTACTPOINT")
        cosmosCassandraPort = os.Getenv("AZURE_COSMOS_PORT")
        cosmosCassandraUser = os.Getenv("AZURE_COSMOS_USERNAME")
        cosmosCassandraPassword = os.Getenv("AZURE_COSMOS_PASSWORD")
        cosmosCassandraKeyspace = os.Getenv("AZURE_COSMOS_KEYSPACE")
    
        clusterConfig := gocql.NewCluster(cosmosCassandraContactPoint)
        port, err := strconv.Atoi(cosmosCassandraPort)
        if err != nil {
		    // error handling
	    }
        
        clusterConfig.Port = port
	    clusterConfig.ProtoVersion = 4
        clusterConfig.Authenticator = gocql.PasswordAuthenticator{Username: cosmosCassandraUser, Password: cosmosCassandraPassword}
        clusterConfig.SslOpts = &gocql.SslOptions{Config: &tls.Config{MinVersion: tls.VersionTLS12}}
        
        session, err := clusterConfig.CreateSession()
        if err != nil {
		    // error handling
	    }
        return session
    }
    
    func main() {
        session := utils.GetSession(cosmosCassandraContactPoint, cosmosCassandraPort, cosmosCassandraUser, cosmosCassandraPassword)
        defer session.Close()
        ...
    }
    ```

For more information, refer to [Build a Go app with the gocql client to manage Azure Cosmos DB for Apache Cassandra data](/azure/cosmos-db/cassandra/manage-data-go).

### [NodeJS](#tab/node)
1. Install dependencies
   ```bash
   npm install cassandra-driver
   ```
2. Get connection information from the environment variable added by Service Connector and connect to Azure Cosmos DB for Cassandra.
   ```javascript
   const cassandra = require("cassandra-driver");

   let username = process.env.AZURE_COSMOS_USERNAME;
   let password = process.env.AZURE_COSMOS_PASSWORD;
   let contactPoint = process.env.AZURE_COSMOS_CONTACTPOINT;
   let port = process.env.AZURE_COSMOS_PASSWORD;
   let keyspace = process.env.AZURE_COSMOS_KEYSPACE;

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

For more details, refer to [Build a Cassandra app with Node.js SDK and Azure Cosmos DB](/azure/cosmos-db/cassandra/manage-data-nodejs)


### [Others](#tab/others)
For other languages, you can use the blob storage account url and other properties that Service Connector set to the environment variables to connect the blob storage. For environment variable details, see [Integrate Azure Cosmos DB for Cassandra with Service Connector](../how-to-integrate-cosmos-cassandra.md).
