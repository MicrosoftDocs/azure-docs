---
title: Integrate Azure Database for MySQL with Service Connector
description: Integrate Azure Database for MySQL into your application with Service Connector
author: mcleanbyron
ms.author: mcleans
ms.service: service-connector
ms.topic: how-to
ms.date: 11/29/2022
ms.custom: event-tier1-build-2022, engagement-fy23
---

# Integrate Azure Database for MySQL with Service Connector

This page shows the supported authentication types, client types and sample codes of Azure Database for MySQL - Flexible Server using Service Connector.  This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. Also detail steps with sample codes about how to make connection to the database. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).


[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](../mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported compute service

- Azure App Service. You can get the configurations from Azure App Service configurations.
- Azure Container Apps. You can get the configurations from Azure Container Apps environment variables.
- Azure Spring Apps. You can get the configurations from Azure Spring Apps runtime.

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps, and Azure Spring Apps:

| Client type                     | System-assigned managed identity     | User-assigned managed identity      | Secret/connection string             | Service principal                    |
|---------------------------------|:------------------------------------:|:-----------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET                            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Go (go-sql-driver for mysql)    | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java (JDBC)                     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java - Spring Boot (JDBC)       | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js (mysql)                 | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python (mysql-connector-python) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python-Django                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| PHP (MySQLi)                    | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Ruby (mysql2)                   | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None                            | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png)| ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

> [!NOTE]
> System-assigned managed identity, User-assigned managed identity and Service principal are only supported on Azure CLI. 

## Default environment variable names or application properties and Sample codes

Reference the connection details and sample codes in following tables to connect compute services to Azure Database for MySQL. 

### [Connection String](#secret)

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>;SSL Mode=Required` |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies. Follow the guidance to [install connector/NET MySQL](https://dev.mysql.com/doc/connector-net/en/connector-net-installation.html)
1. In code, get MySQL connection string from environment variables added by Service Connector service.
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

#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                                                                              |
|-----------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies. Follow the guidance to [install Connector/J](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-installing.html).
1. In code, get MySQL connection string from environment variables added by Service Connector service.
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

#### [SpringBoot](#tab/spring)

| Application properties       | Description                   | Example value                                                                                 |
|------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.url`      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username` | Database username             | `<MySQL-DB-username>`  |
| `spring.datasource.password` | Database password             | `MySQL-DB-password`    |

After created a springboot client type connection, Service Connector service will automatically add properties `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. So Spring boot application could add beans automatically.

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
1. Setup normal Spring App application, more detail in this [section](/azure/developers/java/spring-framework/configure-spring-data-jpa-with-azure-mysql/#tabs=password).

#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies. Follow the guidance to [install Connector/Python](https://dev.mysql.com/doc/connector-python/en/connector-python-installation.html) by following the guidance.
1. In code, get MySQL connection information from environment variables added by Service Connector service.
   ```python
   import os
   import mysql.connector
   
   host = os.getenv('AZURE_MYSQL_HOST')
   user = os.getenv('AZURE_MYSQL_USER')
   password = os.getenv('AZURE_MYSQL_PASSWORD')
   database = os.getenv('Azure_MYSQL_NAME')
   port = os.getenv('AZURE_MYSQL_PORT')
   
   cnx = mysql.connector.connect(user=user, password=password,
                                 host=host,
                                 database=database,
                                 port=port)
   
   cnx.close()
   ```


#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies.
   ```bash
   pip install django==3.2
   ```
1. In setting file, get MySQL database information from environment variables added by Service Connector service.
   ```python
   # in your setting file, eg. settings.py
   host = os.getenv('AZURE_MYSQL_HOST')
   user = os.getenv('AZURE_MYSQL_USER')
   password = os.getenv('AZURE_MYSQL_PASSWORD')
   database = os.getenv('AZURE_MYSQL_NAME')
   port = os.getenv('AZURE_MYSQL_PORT')
   
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

#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies.
    ```bash
    go get -u github.com/go-sql-driver/mysql
    ```
1. In code, get MySQL connection string from environment variables added by Service Connector service.
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

#### [NodeJS](#tab/node)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies.
   ```bash
   npm install mysql
   ```
1. In code, get MySQL connection information from environment variables added by Service Connector service.
   ```javascript
   const mysql = require('mysql')
   
   const connection = mysql.createConnection({
     host: process.env.AZURE_MYSQL_HOST,
     user: process.env.AZURE_MYSQL_USER,
     password: process.env.AZURE_MYSQL_PASSWORD,
     database: process.env.AZURE_MYSQL_DATABASE,
     port: process.env.AZURE_MYSQL_PORT,
     ssl: process.env.AZURE_MYSQL_SSL
   });
   
   connection.connect((err) => {
     if (err) {
       console.error('Error connecting to MySQL database: ' + err.stack);
       return;
     }
     console.log('Connected to MySQL database.');
   });
   ```


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`                      |
| `AZURE_MYSQL_PASSWORD`              | Database password  | `<MySQL-DB-password>`                      |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies. Follow the guide to [install MySQLi](https://www.php.net/manual/en/mysqli.installation.php).
1. In code, get MySQL connection information from environment variables added by Service Connector service.
   ```php
   <?php
   $host = getenv('AZURE_MYSQL_HOST');
   $username = getenv('AZURE_MYSQL_USER');
   $password = getenv('AZURE_MYSQL_PASSWORD');
   $database = getenv('Azure_MYSQL_DBNAME');
   $port = getenv('AZURE_MYSQL_PORT');
   $flag = getenv('AZURE_MYSQL_FLAG');
   
   $conn = mysqli_init();
   mysqli_ssl_set($conn,NULL,NULL,NULL,NULL,NULL);
   mysqli_real_connect($conn, $host, $username, $password, $database, $port, NULL, $flag);
   
   if (mysqli_connect_errno($conn)) {
       die('Failed to connect to MySQL: ' . mysqli_connect_error());
   }
   
   echo 'Connected successfully to MySQL database!';
   mysqli_close($conn);
   ?>
   ```


#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `<MySQL-DB-password>`                      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

Follow these steps to connect to Azure Database for MySQL.
1. Install dependencies.
   ```bash
   gem install mysql2
   ```
1. In code, get MySQL connection information from environment variables added by Service Connector service.
   ```ruby
   require 'mysql2'
   require 'dotenv/load'
   
   client = Mysql2::Client.new(
     host: ENV['AZURE_MYSQL_HOST'],
     username: ENV['AZURE_MYSQL_USER'],
     password: ENV['AZURE_MYSQL_PASSWORD'],
     database: ENV['AZURE_MYSQL_DATABASE'],
     sslca: ENV['AZURE_MYSQL_SSLMODE']
   )
   
   client.close
   ```

---

### [System assigned Managed Identity](#systemmi)
#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING `     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |



#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |



#### [SpringBoot](#tab/spring)

| Application properties                   | Description                           | Example value                                                                                 |
|------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication    | `true` |
| `spring.datasource.url`                  | Spring Boot JDBC database URL         | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`             | Database username        | `<MySQL-DB-username>`  |


#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST `                 | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |


#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### [NodeJS](#tab/node)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`                      |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |


---
Follow these steps and sample codes to connect to Azure Database for MySQL.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]

---

### [User assigned Managed Identity](#usermi)
#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |


#### [Java](#tab/java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |



#### [SpringBoot](#tab/spring)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                        | Enable passwordless authentication| `true` |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<identity-client-ID>` |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity    | `true` |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username` |


#### [Python](#tab/python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `identity-client-ID`                       |

#### [Django](#tab/django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |



#### [NodeJS](#tab/node)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<identity-client-ID>`                     |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

---

Follow these steps and sample codes to connect to Azure Database for MySQL.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]

---

### [Service Principal](#sp)

#### [.NET](#tab/dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<client-ID>`     |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>`     |
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required` |


#### [Java](#tab/java)

| Default environment variable name   | Description                  | Example value                                           |
|-------------------------------------|------------------------------|---------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<client-ID>`                                           |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret           | `<client-secret>`                                       |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID               | `<tenant-ID>`                                           |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |


#### [SpringBoot](#tab/spring)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                  | Enable passwordless authentication| `true`            |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<client-ID>`     |
| `spring.cloud.azure.credential.client-secret`                   | Your client secret                | `<client-secret>` |
| `spring.cloud.azure.credential.tenant-id`                       | Your tenant ID                    | `<tenant-ID>`     |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username`        |


#### [Python](#tab/python)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [Django](#tab/django)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [Go](#tab/go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  |`<client-ID>`      |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>` 
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |


#### [NodeJS](#tab/node)

| Default environment variable name   | Description           | Example value                                          |
|-------------------------------------|-----------------------|--------------------------------------------------------|
| `AZURE_MYSQL_HOST `                 | Database host URL     | `<MySQL-DB-name>.mysql.database.azure.com`             |
| `AZURE_MYSQL_USER`                  | Database username     | `MySQL-DB-username`                                    |
| `AZURE_MYSQL_DATABASE`              | Database name         | `<database-name>`                                      |
| `AZURE_MYSQL_PORT `                 | Port number           | `3306`                                                 |
| `AZURE_MYSQL_SSL`                   | SSL option            | `true`                                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID        | `<client-ID>`                                          |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret    | `<client-secret>`                                      |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID        | `<tenant-ID>`                                          |


#### [PHP](#tab/php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |

#### [Ruby](#tab/ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret| `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID    | `<tenant-ID>`                              |

---

Follow these steps and sample codes to connect to Azure Database for MySQL.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]

---

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)