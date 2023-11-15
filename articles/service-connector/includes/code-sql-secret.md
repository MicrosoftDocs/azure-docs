---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 10/26/2023
ms.author: wchi
---

### [.NET](#tab/sql-secret-dotnet)
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

### [Java](#tab/sql-secret-java)

Get the Azure SQL Database connection string from the environment variable added by Service Connector.

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

public class Main {
    public static void main(String[] args) {
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

### [SpringBoot](#tab/sql-secret-spring)
1. Add dependency in your 'pom.xml' file:
    ```xml
    <dependencyManagement>
      <dependencies>
        <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>spring-cloud-azure-dependencies</artifactId>
          <version>4.12.0</version>
          <type>pom</type>
          <scope>import</scope>
        </dependency>
      </dependencies>
    </dependencyManagement>
    ```
1. Set up the Spring application. The connection configurations are added to Spring Apps by Service Connector.


### [Python](#tab/sql-secret-python)

1. Install dependencies.
    ```bash
    python -m pip install pyodbc
    ```

1. Get the Azure SQL Database connection configurations from the environment variable added by Service Connector.
    ```python
    import os;
    import pyodbc
    
    server = os.getenv('AZURE_SQL_SERVER')
    port = os.getenv('AZURE_SQL_PORT')
    database = os.getenv('AZURE_SQL_DATABASE')
    user = os.getenv('AZURE_SQL_USER')
    password = os.getenv('AZURE_SQL_PASSWORD')
    
    connString = f'Driver={{ODBC Driver 18 for SQL Server}};Server={server},{port};Database={database};UID={user};PWD={password};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'    

    conn = pyodbc.connect(connString)
    ```

### [Django](#tab/sql-secret-django)
1. Install dependencies.
   ```bash
   pip install django
   pip install pyodbc
   ```

1. In the setting file, get the Azure SQL Database connection configurations from the environment variable added by Service Connector.
    ```python
    # in your setting file, eg. settings.py
    
    server = os.getenv('AZURE_SQL_SERVER')
    port = os.getenv('AZURE_SQL_PORT')
    database = os.getenv('AZURE_SQL_DATABASE')
    user = os.getenv('AZURE_SQL_USER')
    password = os.getenv('AZURE_SQL_PASSWORD')

    DATABASES = {
        'default': {
            'ENGINE': 'sql_server.pyodbc',
            'NAME': databse,
            'USER': user,
            'PASSWORD': password,
            'HOST': server,
            'PORT': port,
            'OPTIONS': {
                'driver': 'ODBC Driver 13 for SQL Server',
            },
        },
    }
    ```

### [Go](#tab/sql-secret-go)

1. Install dependency.
    ```bash
    go install github.com/microsoft/go-mssqldb@latest
    ```

1. Get the Azure SQL Database connection string from the environment variable added by Service Connector.

    ```go
    import (
    	"context"
    	"database/sql"
    	"fmt"
    	"log"
    
        "github.com/microsoft/go-mssqldb/azuread"
    )
    connectionString := os.Getenv("AZURE_SQL_CONNECTIONSTRING")
    
    db, err = sql.Open(azuread.DriverName, connString)
    if err != nil {
        log.Fatal("Error creating connection pool: " + err.Error())
    }
    log.Printf("Connected!\n")
    ```

### [NodeJS](#tab/sql-secret-nodejs)

1. Install dependencies.
    ```bash
    npm install mssql
    ```
1. Get the Azure SQL Database connection configurations from the environment variables added by Service Connector.
    ```javascript
    import sql from 'mssql';
    
    const server = process.env.AZURE_SQL_SERVER;
    const database = process.env.AZURE_SQL_DATABASE;
    const port = parseInt(process.env.AZURE_SQL_PORT);
    const username = process.env.AZURE_SQL_USERNAME;
    const password = process.env.AZURE_SQL_PASSWORD;
    
    const config = {
        server,
        port,
        database,
        user,
        password,
        options: {
           encrypt: true
        }
    };  

    this.poolconnection = await sql.connect(config);
    ```

### [PHP](#tab/sql-secret-php)

1. Download the Microsoft Drivers for PHP for SQL Server. For more information, check [Getting Started with the Microsoft Drivers for PHP for SQL Server](/sql/connect/php/getting-started-with-the-php-sql-driver).

1. Get the Azure SQL Database connection configurations from the environment variables added by Service Connector.
    ```php
    <?php
    $server = getenv("AZURE_SQL_SERVERNAME");
    $database = getenv("AZURE_SQL_DATABASE");
    $user = getenv("AZURE_SQL_UID");
    $password = getenv("AZURE_SQL_PASSWORD");
    
    $connectionOptions = array(
        "Database" => database,
        "Uid" => user,
        "PWD" => password
    );

    $conn = sqlsrv_connect($serverName, $connectionOptions);
    ?>
    ```

### [Ruby](#tab/sql-secret-ruby)
1. Download Ruby Driver for SQL Server. For more information, check [Configure development environment for Ruby development](/sql/connect/ruby/step-1-configure-development-environment-for-ruby-development).

1. Get the Azure SQL Database connection configurations from the environment variables added by Service Connector.
    ```ruby
    client = TinyTds::Client.new username: ENV['AZURE_SQL_USERNAME'], password: ENV['AZURE_SQL_PASSWORD'],  
    host: ENV['AZURE_SQL_HOST'], port: ENV['AZURE_SQL_PORT'],  
    database: ENV['AZURE_SQL_DATABASE'], azure:true
    ```

---

For more information, see [Homepage for client programming to Microsoft SQL Server](/sql/connect/homepage-sql-connection-programming).
