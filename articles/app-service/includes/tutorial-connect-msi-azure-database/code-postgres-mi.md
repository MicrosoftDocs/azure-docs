---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 10/20/2023
ms.author: xiaofanzhou
---

# [.NET](#tab/dotnet-postgres-mi)
For .NET, get an access token for the managed identity using a client library such as [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Then use the access token as a password to connect to the database. When using the code below, make sure you uncomment the part of the code snippet that corresponds to the authentication type you want to use.

```csharp
using Azure.Identity;
using Azure.Core;
using Npgsql;

// Uncomment the following lines according to the authentication type.
// For system-assigned identity.
// var sqlServerTokenProvider = new DefaultAzureCredential();

// For user-assigned identity.
// var sqlServerTokenProvider = new DefaultAzureCredential(
//     new DefaultAzureCredentialOptions
//     {
//         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTID");
//     }
// );

// Acquire the access token. 
AccessToken accessToken = await sqlServerTokenProvider.GetTokenAsync(
    new TokenRequestContext(scopes: new string[]
    {
        "https://ossrdbms-aad.database.windows.net/.default"
    }));

// Combine the token with the connection string from the environment variables provided by Service Connector.
string connectionString =
    $"{Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CONNECTIONSTRING")};Password={accessToken.Token}";

// Establish the connection.
using (var connection = new NpgsqlConnection(connectionString))
{
    Console.WriteLine("Opening connection using access token...");
    connection.Open();
}
```

# [Java](#tab/java-postgres-mi)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.3.6</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity-extensions</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```

1. Get the connection string from the environment variables and add the plugin name to connect to the database:

    ```java
    import java.sql.*;
    
    String url = System.getenv("AZURE_POSTGRESQL_CONNECTIONSTRING");
    String pluginName = "com.Azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin";  
    Connection connection = DriverManager.getConnection(url + "&authenticationPluginClassName=" + pluginName);
    ```

For more information, see the following resources:

* [Tutorial: Connect to a PostgreSQL Database from Java Tomcat App Service without secrets using a managed identity](../../tutorial-java-tomcat-connect-managed-identity-postgresql-database.md)
* [Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server](../../../postgresql/flexible-server/connect-java.md?tabs=passwordless#connect-to-the-database)


# [Python](#tab/python-postgres-mi)

1. Install dependencies.

    ```bash
    pip install azure-identity
    pip install psycopg2-binary
    ```

1. Authenticate with an access token from the `azure-identity` library and use the token as password. Get the connection information from the environment variables added by Service Connector. When using the code below, make sure you uncomment the part of the code snippet that corresponds to the authentication type you want to use.

    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
     
    # Uncomment the following lines according to the authentication type.
    # For system-assigned identity.
    # credential = DefaultAzureCredential()

    # For user-assigned identity.
    # managed_identity_client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)   
    
    # Acquire the access token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    conn_string = os.getenv('AZURE_POSTGRESQL_CONNECTIONSTRING')
    conn = psycopg2.connect(conn_string + ' password=' + accessToken.token) 
    ```

# [NodeJS](#tab/nodejs-postgres-mi)

1. Install dependencies.

    ```bash
    npm install --save @azure/identity
    npm install --save pg
    ```

1. In code, get the access token via `@azure/identity` and PostgreSQL connection information from environment variables added by Service Connector service. Combine them to establish the connection. When using the code below, make sure you uncomment the part of the code snippet that corresponds to the authentication type you want to use.

    ```javascript
    import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
    const { Client } = require('pg');

    // Uncomment the following lines according to the authentication type.  
    // For system-assigned identity.
    // const credential = new DefaultAzureCredential();

    // For user-assigned identity.
    // const clientId = process.env.AZURE_POSTGRESQL_CLIENTID;
    // const credential = new DefaultAzureCredential({
    //     managedIdentityClientId: clientId
    // });

    // Acquire the access token.
    var accessToken = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
    
    // Use the token and the connection information from the environment variables added by Service Connector to establish the connection.
    (async () => {
    const client = new Client({
        host: process.env.AZURE_POSTGRESQL_HOST,
        user: process.env.AZURE_POSTGRESQL_USER,
        password: accesstoken.token,
        database: process.env.AZURE_POSTGRESQL_DATABASE,
        port: Number(process.env.AZURE_POSTGRESQL_PORT) ,
        ssl: process.env.AZURE_POSTGRESQL_SSL
    });
    await client.connect();
    
    await client.end();
    })();
    ```

-----

For more code samples, see [Create a passwordless connection to a database service via Service Connector](/azure/service-connector/tutorial-passwordless?tabs=user%2Cappservice&pivots=postgresql#connect-to-a-database-with-microsoft-entra-authentication).