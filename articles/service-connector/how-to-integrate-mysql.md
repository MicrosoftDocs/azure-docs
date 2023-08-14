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

This page shows the supported authentication types and client types of Azure Database for MySQL - Flexible Server using Service Connector. You might still be able to connect to Azure Database for MySQL in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).


[!INCLUDE [Azure-database-for-mysql-single-server-deprecation](../mysql/includes/azure-database-for-mysql-single-server-deprecation.md)]

## Supported compute service

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

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

## Default environment variable names or application properties and sample codes

Use the connection details below to connect compute services to Azure Database for MySQL. For each example below, replace the placeholder texts `<MySQL-DB-name>`, `<MySQL-DB-username>`, `<MySQL-DB-password>`, `<server-host>`, and `<port>` with your Azure Database for MySQL name, Azure Database for MySQL username, Azure Database for MySQL password, server host, and port.

### [Connection String](#secret)

### [java](#tab/java)
java env var tables.

### [spring](#tab/spring)
spring env var tables.

### [.NET](#tab/dotnet)
.NET env var tables.

### [Go](#tab/go)
.NET env var tables.

### [Others](#tab/others)
others.

---

here're sample codes for each client type.
[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]

---

#### [.NET(MySqlConnector)](#tab/secret-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;Password=<MySQL-DB-password>;SSL Mode=Required` |

The following is sample codes to connect to Azure Database for MySQL.
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

#### [Java(JDBC)](#tab/secret-java)

| Default environment variable name | Description                  | Example value                                                                                                                                                              |
|-----------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>&password=<Uri.EscapeDataString(<MySQL-DB-password>)` |

1. Install dependencies. Follow the guidance to [install Connector/J](https://dev.mysql.com/doc/connector-j/8.0/en/connector-j-installing.html).
2. In code, get MySQL connection string from environment variables added by Service Connector service.
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

#### [Spring Boot(JDBC)](#tab/secret-spring)

| Application properties       | Description                   | Example value                                                                                 |
|------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.url`      | Spring Boot JDBC database URL | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username` | Database username             | `<MySQL-DB-username>`  |
| `spring.datasource.password` | Database password             | `MySQL-DB-password`    |



#### [Go(go-sql-driver)](#tab/secret-go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>:<MySQL-DB-password>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

1. Install dependencies.
```bash
go get -u github.com/go-sql-driver/mysql
```

2. In code, get MySQL connection string from environment variables added by Service Connector service.
```go
import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/go-sql-driver/mysql"
)

connectionString := os.Getenv("AZURE_MYSQL_CONNECTIONSTRING")
db, err := sql.Open("mysql", connectionString)
```

#### [Node.js](#tab/secret-nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |


#### [Python(mysql-connector-python)](#tab/secret-python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |


#### [Python-Django](#tab/secret-django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `MySQL-DB-password`                        |


#### [PHP(MySQLi)](#tab/secret-php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`                      |
| `AZURE_MYSQL_PASSWORD`              | Database password  | `<MySQL-DB-password>`                      |


#### [Ruby(mysql2)](#tab/secret-ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_PASSWORD`              | Database password | `<MySQL-DB-password>`                      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

---

### [System assigned Managed Identity](#systemmi)
#### [.NET](#tab/systemmi-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING `     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]


#### [Java](#tab/systemmi-java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md)]


#### [Spring Boot](#tab/systemmi-spring)

| Application properties                   | Description                           | Example value                                                                                 |
|------------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled` | Enable passwordless authentication    | `true` |
| `spring.datasource.url`                  | Spring Boot JDBC database URL         | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required` |
| `spring.datasource.username`             | Database username        | `<MySQL-DB-username>`  |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md?tab=spring)]

#### [Go](#tab/systemmi-go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md#go)]

#### [Node.js](#tab/systemmi-nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |

#### [Python](#tab/systemmi-python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST `                 | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |


#### [Python-Django](#tab/systemmi-django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |

#### [PHP](#tab/systemmi-php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>`                      |

#### [Ruby](#tab/systemmi-ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |

---

### [User assigned Managed Identity](#usermi)
#### [.NET](#tab/usermi-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`     | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required;` |

[!INCLUDE [code sample for mysql aad connection](./includes/code-mysql-aad.md#dotnet)]

#### [Java(JDBC)](#tab/usermi-java)

| Default environment variable name | Description                  | Example value                                                                                                          |
|-----------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md#java)]

#### [Spring Boot(JDBC)](#tab/usermi-spring)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                        | Enable passwordless authentication| `true` |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<identity-client-ID>` |
| `spring.cloud.azure.credential.client-managed-identity-enabled` | Enable client managed identity    | `true` |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md#spring)]

#### [Go(go-sql-driver for mysql)](#tab/usermi-go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<identity-client-ID>` |
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md#go)]

#### [Node.js](#tab/usermi-nodejs)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `MySQL-DB-username`                        |
| `AZURE_MYSQL_DATABASE`              | Database name     | `<database-name>`                          |
| `AZURE_MYSQL_PORT`                  | Port number       | `3306`                                     |
| `AZURE_MYSQL_SSL`                   | SSL option        | `true`                                     |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

#### [Python(mysql-connector-python)](#tab/usermi-python)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `identity-client-ID`                       |

#### [Python-Django](#tab/usermi-django)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name     | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

#### [PHP(MySQLi)](#tab/usermi-php)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_DBNAME`                | Database name      | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_PORT`                  | Port number        | `3306`                                     |
| `AZURE_MYSQL_FLAG`                  | SSL or other flags | `MySQL_CLIENT_SSL`                         |
| `AZURE_MYSQL_USERNAME`              | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<identity-client-ID>`                     |

#### [Ruby(mysql2)](#tab/usermi-ruby)

| Default environment variable name   | Description       | Example value                              |
|-------------------------------------|-------------------|--------------------------------------------|
| `AZURE_MYSQL_DATABASE`              | Database name     | `<MySQL-DB-name>`                          |
| `AZURE_MYSQL_HOST`                  | Database Host URL | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USERNAME`              | Database Username | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_SSLMODE`               | SSL option        | `required`                                 |
| `AZURE_MYSQL_CLIENTID`              | Your client ID    | `<identity-client-ID>`                     |

---

### [Service Principal](#sp)

#### [.NET(MySqlConnector)](#tab/sp-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                                                  |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  | `<client-ID>`     |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>`     |
| `AZURE_MYSQL_CONNECTIONSTRING`      | ADO.NET MySQL connection string | `Server=<MySQL-DB-name>.mysql.database.azure.com;Database=<MySQL-DB-name>;Port=3306;User Id=<MySQL-DBusername>;SSL Mode=Required` |

[!INCLUDE [code sample for mysql aad connection](./includes/code-mysql-aad.md#dotnet)]

#### [Java(JDBC)](#tab/sp-java)

| Default environment variable name   | Description                  | Example value                                           |
|-------------------------------------|------------------------------|---------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID               | `<client-ID>`                                           |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret           | `<client-secret>`                                       |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID               | `<tenant-ID>`                                           |
| `AZURE_MYSQL_CONNECTIONSTRING`      | JDBC MySQL connection string | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required&user=<MySQL-DB-username>` |

[!INCLUDE [code sample for mysql aad connection](./includes/code-mysql-aad.md#java)]

#### [Spring Boot(JDBC)](#sp-spring)

| Application properties                                          | Description                       | Example value                                                                                                 |
|-----------------------------------------------------------------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `spring.datasource.azure.passwordless-enabled`                  | Enable passwordless authentication| `true`            |
| `spring.cloud.azure.credential.client-id`                       | Your client ID                    | `<client-ID>`     |
| `spring.cloud.azure.credential.client-secret`                   | Your client secret                | `<client-secret>` |
| `spring.cloud.azure.credential.tenant-id`                       | Your tenant ID                    | `<tenant-ID>`     |
| `spring.datasource.url`                                         | Database URL                      | `jdbc:mysql://<MySQL-DB-name>.mysql.database.azure.com:3306/<MySQL-DB-name>?sslmode=required`                 |
| `spring.datasource.username`                                    | Database username                 | `username`        |

[!INCLUDE [code sample for mysql aad connection](./includes/code-mysql-aad.md#spring)]

#### [Go(go-sql-driver for mysql)](#tab/sp-go)

| Default environment variable name | Description                     | Example value                                                                                                |
|-----------------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------------|
| `AZURE_MYSQL_CLIENTID`              | Your client ID                  |`<client-ID>`      |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret              | `<client-secret>` |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID                  | `<tenant-ID>` 
| `AZURE_MYSQL_CONNECTIONSTRING`      | Go-sql-driver connection string | `<MySQL-DB-username>@tcp(<server-host>:<port>)/<MySQL-DB-name>?tls=true` |

[!INCLUDE [code sample for mysql system mi](./includes/code-mysql-aad.md#go)]

#### [Node.js](#tab/sp-nodejs)

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

#### [Python(mysql-connector-python)](#tab/sp-python)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER`                  | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [Python-Django](#tab/sp-django)

| Default environment variable name   | Description        | Example value                              |
|-------------------------------------|--------------------|--------------------------------------------|
| `AZURE_MYSQL_NAME`                  | Database name      | `MySQL-DB-name`                            |
| `AZURE_MYSQL_HOST`                  | Database Host URL  | `<MySQL-DB-name>.mysql.database.azure.com` |
| `AZURE_MYSQL_USER `                 | Database Username  | `<MySQL-DB-username>@<MySQL-DB-name>`      |
| `AZURE_MYSQL_CLIENTID`              | Your client ID     | `<client-ID>`                              |
| `AZURE_MYSQL_CLIENTSECRET`          | Your client secret | `<client-secret>`                          |
| `AZURE_MYSQL_TENANTID`              | Your tenant ID     | `<tenant-ID>`                              |


#### [PHP(MySQLi)](#tab/sp-php)

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

#### [Ruby(mysql2)](#tab/sp-ruby)

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

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)