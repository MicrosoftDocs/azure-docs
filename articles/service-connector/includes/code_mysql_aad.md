---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 07/17/2023
ms.author: xiaofanzhou
---


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
    Connection connection = DriverManager.getConnection(url + "&defaultAuthenticationPlugin=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin&authenticationPlugins=com.azure.identity.extensions.jdbc.mysql.AzureMysqlAuthenticationPlugin");
    ```

### [Spring](#tab/spring)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector will set the properties `spring.datasource.passwordless_enabled`, `spring.datasource.url`, and `spring.datasource.username` to Azure Spring Apps. Remove the `spring.datasource.password` configuration property if it was set before. Then add the dependencies to your Spring application, as explained in the tutorial [Connect an Azure Database for MySQL instance to your application in Azure Spring Apps](../spring-apps/how-to-bind-mysql.md#prepare-your-java-project).


### [.NET](#tab/dotnet)

For other languages, there's not a plugin or library to support passwordless connections. You can get access token for the managed identity or service principal and use it as the password to connect to the database. For example, in .NET, you can use [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) to get an access token for the managed identity or service principal.

```csharp
using Azure.Core;
using Azure.Identity;
using MySqlConnector;

// user-assigned managed identity
var credential = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = userAssignedClientId
    });

// system-assigned managed identity
//var credential = new DefaultAzureCredential();

// service principal 
//var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

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


### [Others](#tab/others)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect the database. For environment variable details, see [Integrate Azure Database for MySQL with Service Connector](./how-to-integrate-mysql.md).

For a tutorial, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=mysql#3-modify-your-code).

---

For more information, see [Use Java and JDBC with Azure Database for MySQL - Flexible Server](../mysql/flexible-server/connect-java.md?tabs=passwordless).
