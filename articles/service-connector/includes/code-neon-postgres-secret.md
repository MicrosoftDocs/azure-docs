---
author: wchigit
ms.service: service-connector
ms.topic: include
ms.date: 02/21/2025
ms.author: wchi
---

### [.NET](#tab/dotnet)

1. Install dependencies following [the Npgsql guidance](https://www.npgsql.org/doc/installation.html)
1. In code, get the PostgreSQL connection string from environment variables added by Service Connector.
    ```csharp
    using System;
    using Npgsql;
   
    string connectionString = Environment.GetEnvironmentVariable("NEON_POSTGRESQL_CONNECTIONSTRING");
    using (NpgsqlConnection connection = new NpgsqlConnection(connectionString))
    {
        connection.Open();
    }
    ```

### [Java](#tab/java)

1. Install dependencies following [the pgJDBC guidance](https://jdbc.postgresql.org/documentation/).
1. In code, get the PostgreSQL connection string from environment variables added by Service Connector.
    ```java
    import java.sql.Connection;
    import java.sql.DriverManager;
    import java.sql.SQLException;

    String connectionString = System.getenv("NEON_POSTGRESQL_CONNECTIONSTRING");
    Connection connection = null;
    try {
        connection = DriverManager.getConnection(connectionString);
        System.out.println("Connection successful!");
    } catch (SQLException e){
        System.out.println(e.getMessage());
    }
   ```

### [SpringBoot](#tab/springBoot)

1. Install the Spring Cloud Azure Starter JDBC PostgreSQL module by adding the following dependencies to your `pom.xml` file. Find the version of Spring Cloud Azure [here](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).
    ```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.azure.spring</groupId>
                <artifactId>spring-cloud-azure-dependencies</artifactId>
                <version>4.11.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>com.azure.spring</groupId>
                <artifactId>spring-cloud-azure-starter-jdbc-postgresql</artifactId>
            </dependency>
        </dependencies>
    </dependencyManagement>
    ```
1. Set up a Spring Boot application, more details in this [section](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-postgresql?tabs=password%2Cservice-connector).

### [Python](#tab/python)

1. Install dependencies following [the psycopg2 guidance](https://pypi.org/project/psycopg2/).
1. In code, get the PostgreSQL connection information from environment variables added by Service Connector.
   ```python
   import os
   import psycopg2
   
   connection_string = os.getenv('NEON_POSTGRESQL_CONNECTIONSTRING')
   connection = psycopg2.connect(connection_string)
   print("Connection established")
   
   connection.close()
   ```

### [Django](#tab/django)

1. Install dependencies following [the Django guidance](https://docs.djangoproject.com/en/4.2/topics/install/) and [psycopg2 guidance](https://pypi.org/project/psycopg2/).
   ```bash
   pip install django
   pip install psycopg2
   ```
1. In the setting file, get the PostgreSQL database information from environment variables added by Service Connector.
   ```python
   # in your setting file, eg. settings.py
   host = os.getenv('NEON_POSTGRESQL_HOST')
   user = os.getenv('NEON_POSTGRESQL_USER')
   password = os.getenv('NEON_POSTGRESQL_PASSWORD')
   database = os.getenv('NEON_POSTGRESQL_NAME')
   
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql_psycopg2',
           'NAME': database,
           'USER': user,
           'PASSWORD': password,
           'HOST': host,
           'PORT': '5432',  # Port is 5432 by default 
           'OPTIONS': {'sslmode': 'require'},
       }
   }
   ```

### [Go](#tab/go)

1. Install dependencies.
    ```bash
    go get github.com/lib/pq
    ```
1. In code, get the PostgreSQL connection string from environment variables added by Service Connector.
    ```go
    import (
    "database/sql"
    "fmt"
    "os"

	_ "github.com/lib/pq"
    )

    connectionString := os.Getenv("NEON_POSTGRESQL_CONNECTIONSTRING")
    conn, err := sql.Open("postgres", connectionString)
	if err != nil {
		panic(err)
	}

	conn.Close()
    ```

### [NodeJS](#tab/nodejs)

1. Install dependencies.
    ```bash
    npm install pg dotenv
    ```
1. In code, get the PostgreSQL connection information from environment variables added by Service Connector.
   ```javascript
   const { Client } = require('pg');
   
   (async () => {
    const client = new Client({
        host: process.env.NEON_POSTGRESQL_HOST,
        user: process.env.NEON_POSTGRESQL_USER,
        password: process.env.NEON_POSTGRESQL_PASSWORD,
        database: process.env.NEON_POSTGRESQL_DATABASE,
        port: Number(process.env.NEON_POSTGRESQL_PORT) ,
        ssl: process.env.NEON_POSTGRESQL_SSL
    });
    await client.connect();

    await client.end();
   })();
   ```

### [PHP](#tab/php)

1. In code, get the PostgreSQL connection information from environment variables added by Service Connector.
    ```php
    <?php
    $conn_string = getenv('NEON_POSTGRESQL_CONNECTIONSTRING');
    $dbconn = pg_connect($conn_string);
    ?>
    ```

### [Ruby](#tab/ruby)

1. Install dependencies.
   ```bash
   gem install pg
   ```
2. In code, get the PostgreSQL connection information from environment variables added by Service Connector.
    ```ruby
    require 'pg'
    require 'dotenv/load'

    begin
        conn = PG::Connection.new(
            connection_string: ENV['NEON_POSTGRESQL_CONNECTIONSTRING'],
        )
    rescue PG::Error => e
        puts e.message

    ensure
        connection.close if connection
    end
    ```

### [Other](#tab/none)
For other languages, use the connection properties that Service Connector sets to the environment variables to connect the database. For environment variable details, see [Integrate Neon Serverless Postgres with Service Connector](../how-to-integrate-neon-postgres.md).
