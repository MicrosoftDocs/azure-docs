---
author: yungez
ms.service: service-connector
ms.topic: include
ms.date: 08/01/2023
ms.author: yungez
---

### [.NET](#tab/dotnet)

1. Install dependencies. Follow the guidance to [install connector/NET MySQL](https://dev.mysql.com/doc/connector-net/en/connector-net-installation.html)
1. In code, get MySQL connection string from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
   ```csharp
   using System;
   using System.Data;
   using MySql.Data.MySqlClient;
   
   string connectionString = Environment.GetEnvironmentVariable("AZURE_MYSQL_CONNECTIONSTRING");
   using (MySqlConnection connection = new MySqlConnection(connectionString))
   {
       connection.Open();
   }
   ```

### [Java](#tab/java)

1. Install dependencies. Follow the guidance to [install Connector/J](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-installing.html).
1. In code, get MySQL connection string from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
    ```java
    import java.sql.Connection;
    import java.sql.DriverManager;
    import java.sql.SQLException;

    String connectionString = System.getenv("AZURE_MYSQL_CONNECTIONSTRING");
    try (Connection connection = DriverManager.getConnection(connectionString)) {
        System.out.println("Connection successful!");
    } catch (SQLException e) {
        e.printStackTrace();
    }
    ```

### [SpringBoot](#tab/spring)

1. Install dependencies. Add following dependencies to your `pom.xml` file.
    ```xml
    <dependencyManagement>
      <dependencies>
        <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>spring-cloud-azure-dependencies</artifactId>
          <version>4.10.0</version>
          <type>pom</type>
          <scope>import</scope>
        </dependency>
        <dependency>
          <groupId>com.azure.spring</groupId>
          <artifactId>spring-cloud-azure-starter-jdbc-mysql</artifactId>
        </dependency>
      </dependencies>
    </dependencyManagement>
    ```
1. Setup normal Spring App application, more detail in this [section](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-mysql?tabs=password%2Cservice-connector). To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).

### [Python](#tab/python)

1. Install dependencies. Follow the guidance to [install Connector/Python](https://dev.mysql.com/doc/connector-python/en/connector-python-installation.html) by following the guidance.
1. In code, get MySQL connection information from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
   ```python
   import os
   import mysql.connector
   
   host = os.getenv('AZURE_MYSQL_HOST')
   user = os.getenv('AZURE_MYSQL_USER')
   password = os.getenv('AZURE_MYSQL_PASSWORD')
   database = os.getenv('Azure_MYSQL_NAME')
   port = int(os.getenv('AZURE_MYSQL_PORT'))
   
   cnx = mysql.connector.connect(user=user, password=password,
                                 host=host,
                                 database=database,
                                 port=port)
   
   cnx.close()
   ```

### [Django](#tab/django)

1. Install dependencies.
   ```bash
   pip install django
   ```
1. In setting file, get MySQL database information from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
   ```python
   # in your setting file, eg. settings.py
   host = os.getenv('AZURE_MYSQL_HOST')
   user = os.getenv('AZURE_MYSQL_USER')
   password = os.getenv('AZURE_MYSQL_PASSWORD')
   database = os.getenv('AZURE_MYSQL_NAME')
   port = int(os.getenv('AZURE_MYSQL_PORT'))
   
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': database,
           'USER': user,
           'PASSWORD': password,
           'HOST': host,
           'PORT': port
       }
   }
   ```

### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get -u github.com/go-sql-driver/mysql
    ```
1. In code, get MySQL connection string from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
    ```go
    import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/go-sql-driver/mysql"
    s)

    connectionString := os.Getenv("AZURE_MYSQL_CONNECTIONSTRING")
    db, err := sql.Open("mysql", connectionString)
    ```


### [NodeJS](#tab/node)

1. Install dependencies.
   ```bash
   npm install mysql2
   ```
1. In code, get MySQL connection information from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
   ```javascript
   const mysql = require('mysql2')
   
   const connection = mysql.createConnection({
     host: process.env.AZURE_MYSQL_HOST,
     user: process.env.AZURE_MYSQL_USER,
     password: process.env.AZURE_MYSQL_PASSWORD,
     database: process.env.AZURE_MYSQL_DATABASE,
     port: Number(process.env.AZURE_MYSQL_PORT) ,
     // ssl: process.env.AZURE_MYSQL_SSL
   });
   
   connection.connect((err) => {
     if (err) {
       console.error('Error connecting to MySQL database: ' + err.stack);
       return;
     }
     console.log('Connected to MySQL database.');
   });
   ```

### [PHP](#tab/php)

1. Install dependencies. Follow the guide to [install MySQLi](https://www.php.net/manual/en/mysqli.installation.php).
1. In code, get MySQL connection information from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/connect-php?tabs=windows#connecting-to-flexible-server-using-tlsssl-in-php).
   ```php
   <?php
   $host = getenv('AZURE_MYSQL_HOST');
   $username = getenv('AZURE_MYSQL_USER');
   $password = getenv('AZURE_MYSQL_PASSWORD');
   $database = getenv('Azure_MYSQL_DBNAME');
   $port = int(getenv('AZURE_MYSQL_PORT'));
   # $flag = getenv('AZURE_MYSQL_FLAG');
   
   $conn = mysqli_init();
   # mysqli_ssl_set($conn,NULL,NULL,NULL,NULL,NULL);
   mysqli_real_connect($conn, $host, $username, $password, $database, $port, NULL);
   
   if (mysqli_connect_errno($conn)) {
       die('Failed to connect to MySQL: ' . mysqli_connect_error());
   }
   
   echo 'Connected successfully to MySQL database!';
   mysqli_close($conn);
   ?>
   ```

### [Ruby](#tab/ruby)

1. Install dependencies.
   ```bash
   gem install mysql2
   ```
1. In code, get MySQL connection information from environment variables added by Service Connector service. To establish encrypted connection to MySQL server over SSL, refer to [these steps](/azure/mysql/flexible-server/how-to-connect-tls-ssl#connect-using-mysql-command-line-client-with-tlsssl).
   ```ruby
   require 'mysql2'
   require 'dotenv/load'
   
   client = Mysql2::Client.new(
     host: ENV['AZURE_MYSQL_HOST'],
     username: ENV['AZURE_MYSQL_USER'],
     password: ENV['AZURE_MYSQL_PASSWORD'],
     database: ENV['AZURE_MYSQL_DATABASE'],
     # sslca: ca_path
   )
   
   client.close
   ```