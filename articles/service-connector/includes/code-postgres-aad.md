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

### [Spring](#tab/spring)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector will set the properties `spring.datasource.azure.passwordless-enabled`, `spring.datasource.url`, and `spring.datasource.username` to Azure Spring Apps. 

Update your application following the tutorial [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](../../spring-apps/how-to-bind-postgres.md#prepare-your-java-project). Remember to remove the `spring.datasource.password` configuration property if it was set before and add the correct dependencies,

For more tutorials, see [Use Spring Data JDBC with Azure Database for PostgreSQL](/azure/developer/java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql?tabs=passwordless%2Cservice-connector&pivots=postgresql-passwordless-flexible-server#store-data-from-azure-database-for-postgresql)

### [.NET](#tab/dotnet)

For .NET, there's not a plugin or library for passwordless connections. You can get an access token for the managed identity or service principal and use it as the password to connect to the database. For example, you can use [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) to get an access token for the managed identity or service principal:

```csharp
using Npgsql;
using Azure.Identity;
using Azure.Core;

// user-assigned managed identity
var sqlServerTokenProvider = new DefaultAzureCredential(
    new DefaultAzureCredentialOptions
    {
        ManagedIdentityClientId = userAssignedClientId
    });

// system-assigned managed identity
//var sqlServerTokenProvider = new DefaultAzureCredential();

// service principal: tenantId, clientId, clientSecret can be retrieved from environment variables
//var sqlServerTokenProvider = new ClientSecretCredential(tenantId, clientId, clientSecret);

AccessToken accessToken = await sqlServerTokenProvider.GetTokenAsync(
    new TokenRequestContext(scopes: new string[]
    {
        "https://ossrdbms-aad.database.windows.net/.default"
    }));
string connectionString =
    $"{Environment.GetEnvironmentVariable("AZURE_POSTGRESQL_CONNECTIONSTRING")};Password={accessToken.Token}";

using (var connection = new NpgsqlConnection(connectionString))
{
    Console.WriteLine("Opening connection using access token...");
    connection.Open();
    using var command = new NpgsqlCommand("SELECT version()", connection);
    using NpgsqlDataReader reader = await command.ExecuteReaderAsync();

    while (reader.Read())
    {
        Console.WriteLine("\nConnected!\n\nPostgreSQL version: {0}", reader.GetString(0));
    }
}
```

### [Others](#tab/others)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect the database. For environment variable details, see [Integrate Azure Database for PostgreSQL with Service Connector](../how-to-integrate-postgres.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=postgresql#3-modify-your-code).

