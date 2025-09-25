---
author: chentony
ms.service: service-connector
ms.topic: include
ms.date: 02/27/2025
ms.author: chentony
---

### [.NET](#tab/fabricsql-me-id-dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Data.SqlClient
    ```
    
1. Retrieve the SQL database in Microsoft Fabric connection string from the environment variable added by Service Connector.

    ```csharp
    using Microsoft.Data.SqlClient;
    
    string connectionString = 
        Environment.GetEnvironmentVariable("FABRIC_SQL_CONNECTIONSTRING")!;
    
    using var connection = new SqlConnection(connectionString);
    connection.Open();
    ```
    For more information, see [Using Active Directory managed identity authentication](/sql/connect/ado-net/sql/azure-active-directory-authentication?view=fabric&preserve-view=true#using-managed-identity-authentication).

### [Java](#tab/fabricsql-me-id-java)

1. Add the following dependencies in your *pom.xml* file:

    ```xml
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>10.2.0.jre11</version>
    </dependency>
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.7.0</version>
    </dependency>
    ```

1. Retrieve the SQL database in Microsoft Fabric connection string from the environment variable added by Service Connector.

    ```java
    import java.sql.Connection;
    import java.sql.ResultSet;
    import java.sql.Statement;
    
    import com.microsoft.sqlserver.jdbc.SQLServerDataSource;
    
    public class Main {
        public static void main(String[] args) {
            // FABRIC_SQL_CONNECTIONSTRING should be one of the following:
            // For system-assigned managed identity: "jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;authentication=ActiveDirectoryMSI;"
            // For user-assigned managed identity: "jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;"
            String connectionString = System.getenv("FABRIC_SQL_CONNECTIONSTRING");
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
    For more information, see [Connect to Azure databases from App Service without secrets using a managed identity](/azure/app-service/tutorial-connect-msi-azure-database?tabs=sqldatabase%2Csystemassigned%2Cjava%2Cwindowsclient#3-modify-your-code).

### [SpringBoot](#tab/fabricsql-me-id-springBoot)

For a Spring application, if you create a connection with option `--client-type springboot`, Service Connector sets the environment variable `FABRIC_SQL_CONNECTIONSTRING` with value format `jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;authentication=ActiveDirectoryMSI;` to Azure Spring Apps.

For user-assigned managed identities, `msiClientId=<msiClientId>;` is added.

Update your application following the tutorial [Migrate a Java application to use passwordless connections with Azure SQL Database](/azure/developer/java/spring-framework/migrate-sql-database-to-passwordless-connection?tabs=spring%2Capp-service%2Cassign-role-service-connector#2-migrate-the-app-code-to-use-passwordless-connections). Remember to remove the `spring.datasource.password` configuration property if it was previously set and add the correct dependencies.

```yaml
spring:
  datasource:
    url: ${FABRIC_SQL_CONNECTIONSTRING}
```

### [Python](#tab/fabricsql-me-id-python)

1. Install dependencies.
    ```bash
    python -m pip install pyodbc
    ```

1. Retrieve the SQL database in Microsoft Fabric connection string from the environment variable added by Service Connector. If you are using Azure Container Apps as compute service or the connection string in the code snippet doesn't work, refer to [Migrate a Python application to use passwordless connections with Azure SQL Database](/azure/azure-sql/database/azure-sql-passwordless-migration-python#update-the-local-connection-configuration) to connect to SQL database in Microsoft Fabric using passwordless credentials. `Authentication=ActiveDirectoryMSI;` is required in the connection string when connecting using managed identities. `UID=<msiClientId>` is also required in the connection string when connecting using a user-assigned managed identity.

    ```python
    import os
    import pyodbc, struct
    from azure.identity import DefaultAzureCredential

    connStr = os.getenv('FABRIC_SQL_CONNECTIONSTRING')
    
    # System-assigned managed identity connection string format
    # `Driver={ODBC Driver 17 for SQL Server};Server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Database=<SQL-DB-name>-<Fabric-DB-Identifier>;Authentication=ActiveDirectoryMSI;`
    
    # User-assigned managed identity connection string format
    # `Driver={ODBC Driver 17 for SQL Server};Server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Database=<SQL-DB-name>-<Fabric-DB-Identifier>;UID=<msiClientId>;Authentication=ActiveDirectoryMSI;`
    
    conn = pyodbc.connect(connString)
    ```

### [Go](#tab/fabricsql-me-id-go)

1. Install dependencies.
    ```bash
    go mod init <YourProjectName>
    go mod tidy
    ```
1. Retrieve the SQL database in Microsoft Fabric connection string from the environment variable added by Service Connector.
    ```golang
    package main

    import (
        "github.com/microsoft/go-mssqldb/azuread"
        "database/sql"
        "context"
        "log"
        "fmt"
        "os"
    )

    var db *sql.DB

    var connectionString = os.Getenv("FABRIC_SQL_CONNECTIONSTRING")

    func main() {
        var err error

        // Create connection pool
        db, err = sql.Open(azuread.DriverName, connectionString)
        if err != nil {
            log.Fatal("Error creating connection pool: ", err.Error())
        }
        ctx := context.Background()
        err = db.PingContext(ctx)
        if err != nil {
            log.Fatal(err.Error())
        }
        fmt.Printf("Connected!\n")
    }
    ```

For more information, see [Use Golang to query a database in Azure SQL Database](/azure/azure-sql/database/connect-query-go).

### [Other](#tab/fabricsql-me-id-none)
For other languages, use the connection string that Service Connector sets to the environment variables to connect the database. For environment variable details, see [Integrate SQL database in Microsoft Fabric with Service Connector](../how-to-integrate-fabric-sql.md).

---

For more information, see [Connect to your SQL database in Microsoft Fabric](/fabric/database/sql/connect).
