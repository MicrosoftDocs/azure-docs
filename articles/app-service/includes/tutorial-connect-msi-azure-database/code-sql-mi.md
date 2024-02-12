---
author: xiaofanzhou
ms.service: service-connector
ms.topic: include
ms.date: 10/26/2023
ms.author: xiaofanzhou
---


### [.NET](#tab/dotnet)

1. Install dependencies.
    ```bash
    dotnet add package Microsoft.Data.SqlClient
    ```
    
1. Get the Azure SQL Database connection string from the environment variable added by Service Connector.

    ```csharp
    using Microsoft.Data.SqlClient;
    
    string connectionString = 
        Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING")!;
    
    using var connection = new SqlConnection(connectionString);
    connection.Open();
    ```
    For more information, see [Using Active Directory Managed Identity authentication](/sql/connect/ado-net/sql/azure-active-directory-authentication#using-active-directory-managed-identity-authentication).

### [Java](#tab/java)
1. Add the following dependencies in your *pom.xml* file:

    ```java
    <dependency>
        <groupId>com.azure</groupId>
        <artifactId>azure-identity</artifactId>
        <version>1.4.6</version>
    </dependency>
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>10.2.0.jre11</version>
    </dependency>
    ```

1. Get the Azure SQL Database connection string from the environment variable added by Service Connector.

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
For more information, see [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication).

### [Python](#tab/python)

1. Install dependencies.
    ```bash
    python -m pip install pyodbc
    ```

1. Get the Azure SQL Database connection configurations from the environment variable added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```python
    import os;
    import pyodbc
    
    server = os.getenv('AZURE_SQL_SERVER')
    port = os.getenv('AZURE_SQL_PORT')
    database = os.getenv('AZURE_SQL_DATABASE')
    authentication = os.getenv('AZURE_SQL_AUTHENTICATION')
    
    # Uncomment the following lines according to the authentication type.
    # For system-assigned managed identity.
    # connString = f'Driver={{ODBC Driver 18 for SQL Server}};Server={server},{port};Database={database};Authentication={authentication};Encrypt=yes;'
    
    # For user-assigned managed identity.
    # user = os.getenv('AZURE_SQL_USER')
    # connString = f'Driver={{ODBC Driver 18 for SQL Server}};Server={server},{port};Database={database};UID={user};Authentication={authentication};Encrypt=yes;'
    
    conn = pyodbc.connect(connString)
    ```


### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install mssql
    ```
1. Get the Azure SQL Database connection configurations from the environment variables added by Service Connector. When using the code below, uncomment the part of the code snippet for the authentication type you want to use.
    ```javascript
    import sql from 'mssql';
    
    const server = process.env.AZURE_SQL_SERVER;
    const database = process.env.AZURE_SQL_DATABASE;
    const port = parseInt(process.env.AZURE_SQL_PORT);
    const authenticationType = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
    
    // Uncomment the following lines according to the authentication type.
    // For system-assigned managed identity.
    // const config = {
    //     server,
    //     port,
    //     database,
    //     authentication: {
    //         authenticationType
    //     },
    //     options: {
    //        encrypt: true
    //     }
    // };  

    // For user-assigned managed identity.
    // const clientId = process.env.AZURE_SQL_CLIENTID;
    // const config = {
    //     server,
    //     port,
    //     database,
    //     authentication: {
    //         type: authenticationType,
    //         options: {
    //             clientId: clientId
    //         }
    //     },
    //     options: {
    //         encrypt: true
    //     }
    // };  

    this.poolconnection = await sql.connect(config);
    ```


---

For more information, see [Homepage for client programming to Microsoft SQL Server](/sql/connect/homepage-sql-connection-programming).
For more code samples, see [Create a passwordless connection to a database service via Service Connector](/azure/service-connector/tutorial-passwordless?tabs=user%2Cappservice&pivots=sql#connect-to-a-database-with-microsoft-entra-authentication).