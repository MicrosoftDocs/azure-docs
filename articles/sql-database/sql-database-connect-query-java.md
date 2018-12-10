---
title: Use Java to query Azure SQL Database | Microsoft Docs
description: Shows you how to use Java to create a program that connects to an Azure SQL database and query it using T-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.devlang: java
ms.topic: quickstart
author: ajlam
ms.author: andrela
ms.reviewer: v-masebo
manager: craigg
ms.date: 11/20/2018
---
# Quickstart: Use Java to query an Azure SQL database

This article demonstrates how to use [Java](/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server) to connect to an Azure SQL database. You can then use T-SQL statements to query data.

## Prerequisites

To complete this sample, make sure you have the following prerequisites:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you're using

- Java-related software installed for your operating system:

  - **MacOS**, install Homebrew and Java, then install Maven. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/java/mac/).

  - **Ubuntu**, install Java, the Java Development Kit, then install Maven. See [Step 1.2, 1.3, and 1.4](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu/).

  - **Windows**, install Java, then install Maven. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/java/windows/).

## Get database connection

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

## Create the project

1. From the command prompt, create a new Maven project called *sqltest*.

    ```bash
    mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=sqltest" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0" --batch-mode
    ```

1. Change the folder to *sqltest* and open *pom.xml* with your favorite text editor. Add the **Microsoft JDBC Driver for SQL Server** to your project's dependencies using the following code.

    ```xml
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <version>7.0.0.jre8</version>
    </dependency>
    ```

1. Also in *pom.xml*, add the following properties to your project. If you don't have a properties section, you can add it after the dependencies.

   ```xml
   <properties>
       <maven.compiler.source>1.8</maven.compiler.source>
       <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

1. Save and close *pom.xml*.

## Add code to query database

1. You should already have a file called *App.java* in your Maven project located at:

   *..\sqltest\src\main\java\com\sqldbsamples\App.java*

1. Open the file and replace its contents with the following code. Then add the appropriate values for your server, database, user, and password.

    ```java
    package com.sqldbsamples;

    import java.sql.Connection;
    import java.sql.Statement;
    import java.sql.PreparedStatement;
    import java.sql.ResultSet;
    import java.sql.DriverManager;

    public class App {

        public static void main(String[] args) {

            // Connect to database
            String hostName = "your_server.database.windows.net"; // update me
            String dbName = "your_database"; // update me
            String user = "your_username"; // update me
            String password = "your_password"; // update me
            String url = String.format("jdbc:sqlserver://%s:1433;database=%s;user=%s;password=%s;encrypt=true;"
                + "hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
            Connection connection = null;

            try {
                connection = DriverManager.getConnection(url);
                String schema = connection.getSchema();
                System.out.println("Successful connection - Schema: " + schema);

                System.out.println("Query data example:");
                System.out.println("=========================================");

                // Create and execute a SELECT SQL statement.
                String selectSql = "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName "
                    + "FROM [SalesLT].[ProductCategory] pc "  
                    + "JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid";

                try (Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(selectSql)) {

                    // Print results from select statement
                    System.out.println("Top 20 categories:");
                    while (resultSet.next())
                    {
                        System.out.println(resultSet.getString(1) + " "
                            + resultSet.getString(2));
                    }
                    connection.close();
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    ```

   > [!NOTE]
   > The code example uses the **AdventureWorksLT** sample database for Azure SQL.

## Run the code

1. At the command prompt, run the app.

    ```bash
    mvn package -DskipTests
    mvn -q exec:java "-Dexec.mainClass=com.sqldbsamples.App"
    ```

1. Verify the top 20 rows are returned and close the app window.

## Next steps

- [Design your first Azure SQL database](sql-database-design-first-database.md)  

- [Microsoft JDBC Driver for SQL Server](https://github.com/microsoft/mssql-jdbc)  

- [Report issues/ask questions](https://github.com/microsoft/mssql-jdbc/issues)  
