---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 07/17/2023
ms.author: xiaofanzhou
---


#### [.NET](#tab/dotnet)
For .NET, there's not a plugin or library to support passwordless connections. You can get an access token for the managed identity or service principal using client library like [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Then you can use the access token as the password to connect to the database. **Uncomment the corresponding part of the code snippet according to the authentication type.**

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

// For service principal.
// var tenantId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_TENANTID");
// var clientId = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTID");
// var clientSecret = Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CLIENTSECRET");
// var sqlServerTokenProvider = new ClientSecretCredential(tenantId, clientId, clientSecret);

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
1. Authenticate with access token get via `azure-identity` library and use the token as password. Get connection information from the environment variables added by Service Connector. **Uncomment the corresponding part of the code snippet according to the authentication type.**
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2
     
    # Uncomment the following lines according to the authentication type.
    # For system-assigned identity.
    # credential = DefaultAzureCredential()

    # For user-assigned identity.
    # managed_identity_client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)   
    
    # For service principal.
    # tenant_id = os.getenv('AZURE_POSTGRESQL_TENANTID')
    # client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    # client_secret = os.getenv('AZURE_POSTGRESQL_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    # Acquire the access token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # Combine the token with the connection string from the environment variables added by Service Connector to establish the connection.
    conn_string = os.getenv('AZURE_POSTGRESQL_CONNECTIONSTRING')
    conn = psycopg2.connect(conn_string + ' password=' + accessToken.token) 
    ```

#### [Django](#tab/django)

1. Install dependencies.
    ```bash
   pip install azure-identity
   ```
1. Get access token via `azure-identity` library using environment variables added by Service Connector. **Uncomment the corresponding part of the code snippet according to the authentication type.**
    
    ```python
    from azure.identity import DefaultAzureCredential
    import psycopg2

    # Uncomment the following lines according to the authentication type.
    # For system-assigned identity.
    # credential = DefaultAzureCredential()

    # For user-assigned identity.
    # managed_identity_client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)    
    
    # For service principal.
    # tenant_id = os.getenv('AZURE_POSTGRESQL_TENANTID')
    # client_id = os.getenv('AZURE_POSTGRESQL_CLIENTID')
    # client_secret = os.getenv('AZURE_POSTGRESQL_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)

    # Acquire the access token.
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    ```

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
            'PORT': '5432',  # Port is 5432 by default 
            'OPTIONS': {'sslmode': 'require'},
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
1. In code, get access token via `azidentity`, then use it as password to connect to Azure PostgreSQL along with connection information provided by Service Connector. **Uncomment the corresponding part of the code snippet according to the authentication type.**
    
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
    
    // Uncomment the following lines according to the authentication type.
    // For system-assigned identity.
    // cred, err := azidentity.NewDefaultAzureCredential(nil)
    
    // For user-assigned identity.
    // clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    // azidentity.ManagedIdentityCredentialOptions.ID := clientid
    // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
    // cred, err := azidentity.NewManagedIdentityCredential(options)
    
    // For service principal.
    // clientid := os.Getenv("AZURE_POSTGRESQL_CLIENTID")
    // tenantid := os.Getenv("AZURE_POSTGRESQL_TENANTID")
    // clientsecret := os.Getenv("AZURE_POSTGRESQL_CLIENTSECRET")
    // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
    
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

#### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install --save @azure/identity
    npm install --save pg
    ```
1. In code, get the access token via `@azure/identity` and PostgreSQL connection information from environment variables added by Service Connector service. Combine them to establish the connection. **Uncomment the corresponding part of the code snippet according to the authentication type.**
    
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
    
    // For service principal.
    // const tenantId = process.env.AZURE_POSTGRESQL_TENANTID;
    // const clientId = process.env.AZURE_POSTGRESQL_CLIENTID;
    // const clientSecret = process.env.AZURE_POSTGRESQL_CLIENTSECRET;

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

#### [PHP](#tab/php)

For PHP, there's not a plugin or library for passwordless connections. You can get an access token for the managed identity or service principal and use it as the password to connect to the database. The access token can be acquired using Azure REST API.

1. In code, get the access token via REST API with your favorite library.

    For user-assigned identity and system-assigned identity, App Service and Container Apps provides an internally accessible REST endpoint to retrieve tokens for managed identities by defining two environment variables: `IDENTITY_ENDPOINT` and `IDENTITY_HEADER`. For more information, see [REST endpoint reference](/azure/container-apps/managed-identity?tabs=http#rest-endpoint-reference). 
    Get the access token by making an HTTP GET request to the identity endpoint, and use `https://ossrdbms-aad.database.windows.net` as `resource` in the query. For user-assigned identity, please include the client ID from the environment variables added by Service Connector in the query as well.

    For service principal, refer to [the Azure AD service-to-service access token request](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#get-a-token) to see the details of how to acquire access token. Make the POST request the scope of `https://ossrdbms-aad.database.windows.net/.default` and with the tenant ID, client ID and client secret of the service principal from the environment variables added by Service Connector.

1. Combine the access token and the PostgreSQL connection sting from environment variables added by Service Connector service to establish the connection.
    ```php
    <?php
    $conn_string = sprintf("%s password=", getenv('AZURE_POSTGRESQL_CONNECTIONSTRING'), $access_token);
    $dbconn = pg_connect($conn_string);
    ?>
    ```

#### [Ruby](#tab/ruby)

For Ruby, there's not a plugin or library for passwordless connections. You can get an access token for the managed identity or service principal and use it as the password to connect to the database. The access token can be acquired using Azure REST API.

1. Install dependencies.
    ```bash
    gem install pg
    ```
1. In code, get the access token via REST API and PostgreSQL connection information from environment variables added by Service Connector service. Combine them to establish the connection. **Uncomment the corresponding part of the code snippet according to the authentication type.**

    App service and container Apps provides an internally accessible REST endpoint to retrieve tokens for managed identities. For more information, see [REST endpoint reference](/azure/container-apps/managed-identity?tabs=http#rest-endpoint-reference).
    ```ruby
    require 'pg'
    require 'dotenv/load'
    require 'net/http'
    require 'json'
    
    # Uncomment the following lines according to the authentication type.
    # For system-assigned identity.
    # uri = URI(ENV['IDENTITY_ENDPOINT'] + '?resource=https://ossrdbms-aad.database.windows.net&api-version=2019-08-01')
    # res = Net::HTTP.get_response(uri, {'X-IDENTITY-HEADER' => ENV['IDENTITY_HEADER'], 'Metadata' => 'true'})  

    # For user-assigned identity.
    # uri = URI(ENV[IDENTITY_ENDPOINT] + '?resource=https://ossrdbms-aad.database.windows.net&api-version=2019-08-01&client-id=' + ENV['AZURE_POSTGRESQL_CLIENTID'])
    # res = Net::HTTP.get_response(uri, {'X-IDENTITY-HEADER' => ENV['IDENTITY_HEADER'], 'Metadata' => 'true'})  
    
    # For service principal
    # uri = URI('https://login.microsoftonline.com/' + ENV['AZURE_POSTGRESQL_TENANTID'] + '/oauth2/v2.0/token')
    # params = {
    #     :grant_type => 'client_credentials',
    #     :client_id: => ENV['AZURE_POSTGRESQL_CLIENTID'],
    #     :client_secret => ENV['AZURE_POSTGRESQL_CLIENTSECRET'],
    #     :scope => 'https://ossrdbms-aad.database.windows.net/.default'
    # }
    # req = Net::HTTP::POST.new(uri)
    # req.set_form_data(params)
    # req['Content-Type'] = 'application/x-www-form-urlencoded'
    # res = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
    #   http.request(req)

    parsed = JSON.parse(res.body)
    access_token = parsed["access_token"]
    
    # Use the token and the connection string from the environment variables added by Service Connector to establish the connection.
    conn = PG::Connection.new(
        connection_string: ENV['AZURE_POSTGRESQL_CONNECTIONSTRING'] + " password="  + access_token,
    )
    ```
    
    Refer to [the Azure AD service-to-service access token request](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#get-a-token) to see more details of how to acquire access token for service principal.

---

Next, if you have created tables and sequences in PostgreSQL flexible server, you need to connect as database owner and grant permission to `aad username` created by Service Connector. The user name from connection string or configuration set by Service Connector should look like `aad_<connection name>`. If you use Portal, click the expand button next to `Service Type` column and get the value. If you use Azure CLI, check `configurations` in output of CLI command.

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
