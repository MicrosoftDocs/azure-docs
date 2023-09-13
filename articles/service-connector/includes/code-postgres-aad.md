---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 07/17/2023
ms.author: xiaofanzhou
zone_pivot_group_filename: service-connector/zone-pivot-groups.json
zone_pivot_groups: howto-postgresql-authtype
---


#### [.NET](#tab/dotnet)

For .NET, there's not a plugin or library for passwordless connections. You can get an access token for the managed identity or service principal and use it as the password to connect to the database using client library like [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/).

First, import the required Azure packages and the .NET data provider for PostgreSQL.

:::zone pivot="user-identity"

```csharp
using Azure.Identity;
using Azure.Core;
using Npgsql;

// Initialize a token provider with the client ID of the user-assigned identity from the environment variables added by Service Connector.

var sqlServerTokenProvider = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTID");
    }
);

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

:::zone-end


:::zone pivot="system-identity"

```csharp
using Azure.Identity;
using Azure.Core;
using Npgsql;

// Initialize a default token provider for the system-assigned identity.
var sqlServerTokenProvider = new DefaultAzureCredential();

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

:::zone-end


:::zone pivot="service-principal"

```csharp
using Azure.Identity;
using Azure.Core;
using Npgsql;

// Initialize a token provider with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.
var tenantId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_TENANTID");
var clientId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTID");
var clientSecret = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTSECRET");
var sqlServerTokenProvider = new ClientSecretCredential(tenantId, clientId, clientSecret);

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

:::zone-end

#### [Java](#tab/java)

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
1. Get the connection string from environment variables and add the plugin name to connect to the database:

```java
import java.sql.*;

String url = System.getenv("AZURE_POSTGRESQL_CONNECTIONSTRING");
String pluginName = "com.Azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin";  
Connection connection = DriverManager.getConnection(url + "&authenticationPluginClassName=" + pluginName);
```

For more information, see the following resources:

* [Tutorial: Connect to PostgreSQL Database from a Java Quarkus Container App without secrets using a managed identity](../../container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database.md)
* [Tutorial: Connect to a PostgreSQL Database from Java Tomcat App Service without secrets using a managed identity](../../app-service/tutorial-java-tomcat-connect-managed-identity-postgresql-database.md)
* [Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server](../../postgresql/flexible-server/connect-java.md?tabs=passwordless#connect-to-the-database)
* [Migrate an application to use passwordless connections with Azure Database for PostgreSQL](/azure/developer/java/spring-framework/migrate-postgresql-to-passwordless-connection?tabs=sign-in-azure-cli%2Cjava%2Cservice-connector%2Cassign-role-service-connector)

#### [SpringBoot](#tab/spring)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector sets the properties `spring.datasource.azure.passwordless-enabled`, `spring.datasource.url`, and `spring.datasource.username` to Azure Spring Apps.

Update your application following the tutorial [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](../../spring-apps/how-to-bind-postgres.md#prepare-your-project). Remember to remove the `spring.datasource.password` configuration property if it was set before and add the correct dependencies to your Spring application.

For more tutorials, see [Use Spring Data JDBC with Azure Database for PostgreSQL](/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql?tabs=passwordless%2Cservice-connector&pivots=postgresql-passwordless-flexible-server#store-data-from-azure-database-for-postgresql) and [Tutorial: Deploy a Spring application to Azure Spring Apps with a passwordless connection to an Azure database](/azure/developer/java/spring-framework/deploy-passwordless-spring-database-app?tabs=postgresq).

#### [Python](#tab/python)

1. Install dependencies.
    ```bash
    pip install azure-identity
    pip install psycopg2-binary
    ```
1. Authenticate with access token get via `azure-identity` library and use the token as password. Get connection information from the environment variables added by Service Connector.
    :::zone pivot="user-identity"
    
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
    
    # Initialize a token provider with the client ID of the user-assigned identity from the environment variables added by Service Connector.
    managed_identity_client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    cred = ManagedIdentityCredential(client_id=managed_identity_client_id)   

    # Acquire the access token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    conn_string = os.getenv('AZURE_POSTGRESQL_CONNECTIONSTRING')
    conn = psycopg2.connect(conn_string + ' password=' + accessToken.token) 
    ```
    :::zone-end
    

    :::zone pivot="system-identity"
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
    
    # Initialize a default token provider for the system-assigned identity.
    credential = DefaultAzureCredential()

    # Acquire the access token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    conn_string = os.getenv('AZURE_POSTGRESQL_CONNECTIONSTRING')
    conn = psycopg2.connect(conn_string + ' password=' + accessToken.token)
    ```    

    :::zone-end
    

    :::zone pivot="service-principal"
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2    
    
    # Initialize a token provider with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.
    tenant_id = os.getenv('AZURE_POSTGRESQL_TENANTID')
    client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    client_secret = os.getenv('AZURE_POSTGRESQL_CLIENTSECRET')
    cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    # Acquire the access token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    conn_string = os.getenv('AZURE_POSTGRESQL_CONNECTIONSTRING')
    conn = psycopg2.connect(conn_string + ' password=' + accessToken.token)
    ```
    
    :::zone-end

#### [Django](#tab/django)

1. Install dependencies.
    ```bash
   pip install azure-identity
   ```
1. Get access token via `azure-identity` library.
    :::zone pivot="user-identity"
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2

    # Initialize a token provider with the client ID of the user-assigned identity from the environment variables added by Service Connector.
    managed_identity_client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    cred = ManagedIdentityCredential(client_id=managed_identity_client_id)    

    # Acquire the access token.
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    ```
    :::zone-end
    
    :::zone pivot="system-identity"
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2

    # Initialize a default token provider for the system-assigned identity.
    credential = DefaultAzureCredential()

    # Acquire the access token.
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    ```    

    :::zone-end
    
    :::zone pivot="service-principal"
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2

    # Initialize a token provider with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.
    tenant_id = os.getenv('AZURE_POSTGRESQL_TENANTID')
    client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    client_secret = os.getenv('AZURE_POSTGRESQL_CLIENTSECRET')
    cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    # Acquire the access token.
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    ```
    
    :::zone-end
    

1. In setting file, get Azure PostgreSQL database information from environment variables added by Service Connector service. Use `accessToken` acquired in previous step to access the database.
    ```python
    # In your setting file, eg. settings.py
    host = os.getenv('AZURE_POSTGRESQL_HOST')
    user = os.getenv('AZURE_POSTGRESQL_USER')
    password = accessToken.token # this is accessToken acquired from above step.
    database = os.getenv('AZURE_POSTGRESQL_NAME')
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': database,
            'USER': user,
            'PASSWORD': password,
            'HOST': host,
            'PORT': ''  # Port is 5432 by default 
        }
    }
    ```

#### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get github.com/lib/pq
    go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    go get "github.com/Azure/azure-sdk-for-go/sdk/azcore"
    ```
1. In code, get access token via `azidentity`, then use it as password to connect to Azure PostgreSQL along with connection information provided by Service Connector.
    :::zone pivot="user-identity"
    
    ```go
    import (
    "database/sql"
    "fmt"
    "os"
    
    "context"
     
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"

	_ "github.com/lib/pq"
    )    

    // Initialize a token provider with the client ID of the user-assigned identity from the environment variables added by Service Connector.
    clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    azidentity.ManagedIdentityCredentialOptions.ID := clientid

    options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
    cred, err := azidentity.NewManagedIdentityCredential(options)
    if err != nil {
        // error handling
    }

    // Acquire the access token
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    token, err := cred.GetToken(ctx, policy.TokenRequestOptions{
        Scopes: []string("https://ossrdbms-aad.database.windows.net/.default"),
    })

    // Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    connectionString := os.Getenv("AZURE_POSTGRESQL_CONNECTIONSTRING") + " password=" + token.Token
    
    conn, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	conn.Close()
    ```    

    :::zone-end
    
    :::zone pivot="system-identity"
    
    ```go
    import (
    "database/sql"
    "fmt"
    "os"
    
    "context"
     
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"

	_ "github.com/lib/pq"
    )

    // Initialize a default token provider for the system-assigned identity.
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        // error handling
    }

    // Acquire the access token
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    token, err := cred.GetToken(ctx, policy.TokenRequestOptions{
        Scopes: []string("https://ossrdbms-aad.database.windows.net/.default"),
    })

    // Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    connectionString := os.Getenv("AZURE_POSTGRESQL_CONNECTIONSTRING") + " password=" + token.Token
    
    conn, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	conn.Close()
    ```
    :::zone-end
    
    :::zone pivot="service-principal"
    
    ```go
    import (
    "database/sql"
    "fmt"
    "os"
    
    "context"
     
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"

	_ "github.com/lib/pq"
    )

    // Initialize a token provider with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.
    clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    tenantid := os.Getenv("AZURE_POSTGRESQL_TENANTID")
    clientsecret := os.Getenv("AZURE_POSTGRESQL_CLIENTSECRET")
    
    cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
    if err != nil {
        // error handling 
    }
    
    // Acquire the access token
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    token, err := cred.GetToken(ctx, policy.TokenRequestOptions{
        Scopes: []string("https://ossrdbms-aad.database.windows.net/.default"),
    })

    // Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    connectionString := os.Getenv("AZURE_POSTGRESQL_CONNECTIONSTRING") + " password=" + token.Token
    
    conn, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	conn.Close()
    ```
    :::zone-end

#### [NodeJS](#tab/node)

1. Install dependencies.
    ```bash
    npm install --save @azure/identity
    npm install --save pg
    ```
1. In code, get the access token via `@azure/identity` and PostgreSQL connection information from environment variables added by Service Connector service. Combine them to establish the connection.
    :::zone pivot="user-identity"
    
    ```javascript
    import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
    const { Client } = require('pg');
    
    // Initialize a token provider with the client ID of the user-assigned identity from the environment variables added by Service Connector.
    const clientId = process.env.AZURE_POSTGRESQL_CLIENTID;
    const credential = new DefaultAzureCredential({
        managedIdentityClientId: clientId
    });

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
        // ssl: process.env.AZURE_POSTGRESQL_SSL
    });
    await client.connect();
    
    await client.end();
    })();
    ```

    :::zone-end
    
    :::zone pivot="system-identity"
    
    ```javascript
    import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
    const { Client } = require('pg');

    // Initialize a default token provider for the system-assigned identity.
    const credential = new DefaultAzureCredential();

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
        // ssl: process.env.AZURE_POSTGRESQL_SSL
    });
    await client.connect();
    
    await client.end();
    })();
    ```

    :::zone-end
    
    :::zone pivot="service-principal"
    
    ```javascript
    import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
    const { Client } = require('pg');

    // Initialize a token provider with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.
    const tenantId = process.env.AZURE_POSTGRESQL_TENANTID;
    const clientId = process.env.AZURE_POSTGRESQL_CLIENTID;
    const clientSecret = process.env.AZURE_POSTGRESQL_CLIENTSECRET;
       
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

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
        // ssl: process.env.AZURE_POSTGRESQL_SSL
    });
    await client.connect();
    
    await client.end();
    })();
    ```

    :::zone-end
#### [PHP](#tab/php)

For PHP, you can use the connection information that Service Connector sets to the environment variables, as shown in the table above, to connect to the database. 

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=postgresql#3-modify-your-code). -->

#### [Ruby](#tab/ruby)

For Ruby, you can use the connection information that Service Connector sets to the environment variables, as shown in the table above, to connect to the database. 

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=postgresql#3-modify-your-code). -->


---

### Grant Permission to Database User

If you have created tables and sequences in PostgreSQL flexible server, you need to connect as database owner and grant permission to `aad username` created by Service Connector. The user name from connection string or configuration set by Service Connector should look like `aad_<connection name>`. If you use Portal, click the expand button next to `Service Type` column and get the value. If you use Azure CLI, check `configurations` in output of CLI command.

Then, execute the query to grant permission

```azure-cli
az extension add --name rdbms-connect

az postgres flexible-server execute -n <postgres server name> -u <owner username> -p "<owner password>" -d <database> --querytext "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"<aad username>\";GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"<aad username>\";"
```
The `<owner username>` and `<owner password>` is the owner of existing table that can grant permission to others. `<aad username>` is the user created by Service Connector. Replace them with the actual value.

You can validate the result with the command:
```azure-cli
az postgres flexible-server execute -n <postgres server name> -u <owner username> -p "<owner password>" -d <database> --querytext "SELECT distinct(table_name) FROM information_schema.table_privileges WHERE grantee='<aad username>' AND table_schema='public';" --output table
```
