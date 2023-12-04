---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 10/20/2023
ms.author: xiaofanzhou
---


### [.NET](#tab/dotnet)
For .NET, there's not a plugin or library to support passwordless connections. You can get an access token for the managed identity or service principal using client library like [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/). Then you can use the access token as the password to connect to the database. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

```csharp
using Azure.Core;
using Azure.Identity;
using MySqlConnector;

// Uncomment the following lines according to the authentication type.
// For system-assigned managed identity.
// var credential = new DefaultAzureCredential();

// For user-assigned managed identity.
// var credential = new DefaultAzureCredential(
//     new DefaultAzureCredentialOptions
//     {
//         ManagedIdentityClientId = Environment.GetEnvironmentVariable("AZURE_MYSQL_CLIENTID");
//     });

// For service principal.
// var tenantId = Environment.GetEnvironmentVariable("AZURE_MYSQL_TENANTID");
// var clientId = Environment.GetEnvironmentVariable("AZURE_MYSQL_CLIENTID");
// var clientSecret = Environment.GetEnvironmentVariable("AZURE_MYSQL_CLIENTSECRET");
// var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

var tokenRequestContext = new TokenRequestContext(
    new[] { "https://ossrdbms-aad.database.windows.net/.default" });
AccessToken accessToken = await credential.GetTokenAsync(tokenRequestContext);
// Open a connection to the MySQL server using the access token.
string connectionString =
    $"{Environment.GetEnvironmentVariable("AZURE_MYSQL_CONNECTIONSTRING")};Password={accessToken.Token}";

using var connection = new MySqlConnection(connectionString);
Console.WriteLine("Opening connection using access token...");
await connection.OpenAsync();

// do something
```

### [Java](#tab/java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.30</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity-extensions</artifactId>
        <version>1.1.5</version>
    </dependency>
    ```
1. Get the connection string from the environment variable, and add the plugin name to connect to the database:

    ```java
    String url = System.getenv("AZURE_MYSQL_CONNECTIONSTRING");  
    String pluginName = "com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin";
    Connection connection = DriverManager.getConnection(url + "&defaultAuthenticationPlugin=" +
        pluginName + "&authenticationPlugins=" + pluginName);
    ```

For more information, see [Use Java and JDBC with Azure Database for MySQL - Flexible Server](../../mysql/flexible-server/connect-java.md?tabs=passwordless).

### [SpringBoot](#tab/springBoot)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector sets the properties `spring.datasource.azure.passwordless-enabled`, `spring.datasource.url`, and `spring.datasource.username` to Azure Spring Apps. 

Update your application following the tutorial [Connect an Azure Database for MySQL instance to your application in Azure Spring Apps](../../spring-apps/how-to-bind-mysql.md#prepare-your-project). Remember to remove the `spring.datasource.password` configuration property if it was set before and add the correct dependencies to your Spring application.

For more tutorials, see [Use Spring Data JDBC with Azure Database for MySQL](/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-mysql?tabs=passwordless%2Cservice-connector&pivots=mysql-passwordless-flexible-server#store-data-from-azure-database-for-mysql)


### [Python](#tab/python)
1. Install dependencies
   ```bash
   pip install azure-identity
   # install Connector/Python https://dev.mysql.com/doc/connector-python/en/connector-python-installation.html
   pip install mysql-connector-python
   ```
1. Authenticate with access token get via `azure-identity` library and get connection information from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.

    ```python
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    import mysql.connector
    import os
    
    # Uncomment the following lines according to the authentication type.
    # For system-assigned managed identity.
    # cred = ManagedIdentityCredential()    

    # For user-assigned managed identity.
    # managed_identity_client_id = os.getenv('AZURE_MYSQL_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)

    # For service principal
    # tenant_id = os.getenv('AZURE_MYSQL_TENANTID')
    # client_id = os.getenv('AZURE_MYSQL_CLIENTID')
    # client_secret = os.getenv('AZURE_MYSQL_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
    
    # acquire token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    
    # open connect to Azure MySQL with the access token.
    host = os.getenv('AZURE_MYSQL_HOST')
    database = os.getenv('AZURE_MYSQL_NAME')
    user = os.getenv('AZURE_MYSQL_USER')
    password = accessToken.token
      
    cnx = mysql.connector.connect(user=user,
                                  password=password,
                                  host=host,
                                  database=database)
    cnx.close()
    
    ```

### [Django](#tab/django)
1. Install dependencies.
   ```bash
   pip install azure-identity
   ```
1. Get access token via `azure-identity` library with the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


    ```python
    from azure.identity import ManagedIdentityCredential, ClientSecretCredential
    import os

    # Uncomment the following lines according to the authentication type.
    # system-assigned managed identity
    # cred = ManagedIdentityCredential()
    
    # user-assigned managed identity
    # managed_identity_client_id = os.getenv('AZURE_MYSQL_CLIENTID')
    # cred = ManagedIdentityCredential(client_id=managed_identity_client_id)
    
    # service principal
    # tenant_id = os.getenv('AZURE_MYSQL_TENANTID')
    # client_id = os.getenv('AZURE_MYSQL_CLIENTID')
    # client_secret = os.getenv('AZURE_MYSQL_CLIENTSECRET')
    # cred = ClientSecretCredential(tenant_id=tenant_id, client_id=client_id, client_secret=client_secret)
    
    # acquire token
    accessToken = cred.get_token('https://ossrdbms-aad.database.windows.net/.default')
    ```

1. In setting file, get Azure MySQL database information from environment variables added by Service Connector service. Use `accessToken` acquired in previous step to access the database.
    ```python
    # in your setting file, eg. settings.py
    host = os.getenv('AZURE_MYSQL_HOST')
    database = os.getenv('AZURE_MYSQL_NAME')
    user = os.getenv('AZURE_MYSQL_USER')
    password = accessToken.token # this is accessToken acquired from above step.
    
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': database,
            'USER': user,
            'PASSWORD': password,
            'HOST': host
        }
    }
    ```

### [Go](#tab/go)

1. Install dependencies.
   ```bash
   go get "github.com/go-sql-driver/mysql"
   go get "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
   go get "github.com/Azure/azure-sdk-for-go/sdk/azcore"
   ```
1. In code, get access token via `azidentity`, then connect to Azure MySQL with the token. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


   ```go
   import (
     "context"
     
     "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
     "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
     "github.com/go-sql-driver/mysql"
   )
   
   
   func main() {
       
     // Uncomment the following lines according to the authentication type.
     // for system-assigned managed identity
     // cred, err := azidentity.NewDefaultAzureCredential(nil)

     // for user-assigned managed identity
     // clientid := os.Getenv("AZURE_MYSQL_CLIENTID")
     // azidentity.ManagedIdentityCredentialOptions.ID := clientid
     // options := &azidentity.ManagedIdentityCredentialOptions{ID: clientid}
     // cred, err := azidentity.NewManagedIdentityCredential(options)

     // for service principal
     // clientid := os.Getenv("AZURE_MYSQL_CLIENTID")
     // tenantid := os.Getenv("AZURE_MYSQL_TENANTID")
     // clientsecret := os.Getenv("AZURE_MYSQL_CLIENTSECRET")
     // cred, err := azidentity.NewClientSecretCredential(tenantid, clientid, clientsecret, &azidentity.ClientSecretCredentialOptions{})
    
     if err != nil {
     }
   
     ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
     token, err := cred.GetToken(ctx, policy.TokenRequestOptions{
       Scopes: []string("https://ossrdbms-aad.database.windows.net/.default"),
     })
     
     connectionString := os.Getenv("AZURE_MYSQL_CONNECTIONSTRING") + ";Password=" + token.Token
     db, err := sql.Open("mysql", connectionString)
   }
   ```

### [NodeJS](#tab/nodejs)
1. Install dependencies
   ```bash
   npm install --save @azure/identity
   npm install --save mysql2
   ```
2. Get access token using `@azure/identity` and Azure MySQL database information from environment variables added by Service Connector service. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.


   ```javascript
   import { DefaultAzureCredential,ClientSecretCredential } from "@azure/identity";
   
   const mysql = require('mysql2');

   // Uncomment the following lines according to the authentication type.
   // for system-assigned managed identity
   // const credential = new DefaultAzureCredential();

   // for user-assigned managed identity
   // const clientId = process.env.AZURE_MYSQL_CLIENTID;
   // const credential = new DefaultAzureCredential({
   //    managedIdentityClientId: clientId
   // });

   // for service principal
   // const tenantId = process.env.AZURE_MYSQL_TENANTID;
   // const clientId = process.env.AZURE_MYSQL_CLIENTID;
   // const clientSecret = process.env.AZURE_MYSQL_CLIENTSECRET;
   // const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
   
   // acquire token
   var accessToken = await credential.getToken('https://ossrdbms-aad.database.windows.net/.default');
   
   const connection = mysql.createConnection({
     host: process.env.AZURE_MYSQL_HOST,
     user: process.env.AZURE_MYSQL_USER,
     password: accessToken.token,
     database: process.env.AZURE_MYSQL_DATABASE,
     port: process.env.AZURE_MYSQL_PORT,
     ssl: process.env.AZURE_MYSQL_SSL
   });
   
   connection.connect((err) => {
     if (err) {
       console.error('Error connecting to MySQL database: ' + err.stack);
       return;
     }
     console.log('Connected to MySQL database');
   });
   ```

### [PHP](#tab/php)
For other languages, you can use the connection string and username that Service Connector sets to the environment variables to connect the database. For environment variable details, see [Integrate Azure Database for MySQL with Service Connector](../how-to-integrate-mysql.md).

### [Ruby](#tab/ruby)
For other languages, you can use the connection string and username that Service Connector sets to the environment variables to connect the database. For environment variable details, see [Integrate Azure Database for MySQL with Service Connector](../how-to-integrate-mysql.md).

---

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=mysql#3-modify-your-code).



