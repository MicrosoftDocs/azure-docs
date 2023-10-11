---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 07/17/2023
ms.author: xiaofanzhou
---


### [.NET](#tab/dotnet)

For managed identity authentication, see [Using Active Directory Managed Identity authentication](/sql/connect/ado-net/sql/azure-active-directory-authentication#using-active-directory-managed-identity-authentication).

```csharp
using Microsoft.Data.SqlClient;

// The connection string should've been set in environment variable AZURE_SQL_CONNECTIONSTRING by Service Connector.
string connectionString = 
    Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING")!;

using var connection = new SqlConnection(connectionString);
connection.Open();
```


### [Java](#tab/java)

For managed identity authentication, see [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication).

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

public class Main {
    public static void main(String[] args) {
        // AZURE_SQL_CONNECTIONSTRING should be one of the following:
        // For system-assigned managed identity: "jdbc:sqlserver://{SQLName}.database.windows.net:1433;databaseName={SQLDbName};authentication=ActiveDirectoryMSI;"
        // For user-assigned managed identity: "jdbc:sqlserver://{SQLName}.database.windows.net:1433;databaseName={SQLDbName};msiClientId={UserAssignedMiClientId};authentication=ActiveDirectoryMSI;"
        // For service principal: "jdbc:sqlserver://{SQLName}.database.windows.net:1433;databaseName={SQLDbName};user={ServicePrincipalClientId};password={spSecret};authentication=ActiveDirectoryServicePrincipal;"
        String connectionString = System.getenv("AZURE_SQL_CONNECTIONSTRING");
        SQLServerDataSource ds = new SQLServerDataSource();
        ds.setURL(connectionString);
        try (Connection connection = ds.getConnection()) {
            System.out.println("Connected successfully.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### [SpringBoot](#tab/spring)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector will set the properties `spring.datasource.url` with value format `jdbc:sqlserver://<sql-server>.database.windows.net:1433;databaseName=<sql-db>;authentication=ActiveDirectoryMSI;` to Azure Spring Apps.

Update your application following the tutorial [Migrate a Java application to use passwordless connections with Azure SQL Database](/azure/developer/java/spring-framework/migrate-sql-database-to-passwordless-connection?tabs=spring%2Capp-service%2Cassign-role-service-connector#2-migrate-the-app-code-to-use-passwordless-connections). Remember to remove the `spring.datasource.password` configuration property if it was set before and add the correct dependencies.


### [Python](#tab/python)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

### [Django](#tab/django)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

### [Go](#tab/go)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

### [NodeJS](#tab/nodejs)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

### [PHP](#tab/php)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

### [Ruby](#tab/ruby)

For other languages, you can use the connection string and username that Service Connector set to the environment variables to connect to the database. For environment variable details, see [Integrate Azure SQL Database with Service Connector](../how-to-integrate-sql-database.md).

For more code samples, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase#3-modify-your-code).

---

For more information, see [Homepage for client programming to Microsoft SQL Server](/sql/connect/homepage-sql-connection-programming).
