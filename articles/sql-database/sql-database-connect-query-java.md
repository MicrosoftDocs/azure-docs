---
title: Use Java to query Azure SQL Database | Microsoft Docs
description: This topic shows you how to use Java to create a program that connects to an Azure SQL Database and query it using Transact-SQL statements.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: java
ms.topic: quickstart
author: ajlam
ms.author: andrela
ms.reviewer:
manager: craigg
ms.date: 04/01/2018
---
# Use Java to query an Azure SQL database

This quickstart demonstrates how to use [Java](https://docs.microsoft.com/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server) to connect to an Azure SQL database and then use Transact-SQL statements to query data.

## Prerequisites

To complete this quickstart, make sure you have the following prerequisites:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

- A [server-level firewall rule](sql-database-get-started-portal-firewall.md) for the public IP address of the computer you use for this quickstart.

- You have installed Java and related software for your operating system:

    - **MacOS**: Install Homebrew and Java, and then install Maven. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/java/mac/).
    - **Ubuntu**:  Install the Java Development Kit, and install Maven. See [Step 1.2, 1.3, and 1.4](https://www.microsoft.com/sql-server/developer-get-started/java/ubuntu/).
    - **Windows**: Install the Java Development Kit, and Maven. See [Step 1.2 and 1.3](https://www.microsoft.com/sql-server/developer-get-started/java/windows/).    

## SQL server connection information

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

## **Create Maven project and dependencies**
1. From the terminal, create a new Maven project called **sqltest**. 

   ```bash
   mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=sqltest" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"
   ```

2. Enter **Y** when prompted.
3. Change directory to **sqltest** and open ***pom.xml*** with your favorite text editor.  Add the **Microsoft JDBC Driver for SQL Server** to your project's dependencies using the following code:

   ```xml
   <dependency>
	   <groupId>com.microsoft.sqlserver</groupId>
	   <artifactId>mssql-jdbc</artifactId>
	   <version>6.4.0.jre8</version>
   </dependency>
   ```

4. Also in ***pom.xml***, add the following properties to your project.  If you don't have a properties section, you can add it after the dependencies.

   ```xml
   <properties>
	   <maven.compiler.source>1.8</maven.compiler.source>
	   <maven.compiler.target>1.8</maven.compiler.target>
   </properties>
   ```

5. Save and close ***pom.xml***.

## Insert code to query SQL database

1. You should already have a file called ***App.java*** in your Maven project located at:  ..\sqltest\src\main\java\com\sqlsamples\App.java

2. Open the file and replace its contents with the following code and add the appropriate values for your server, database, user, and password.

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
		   String hostName = "your_server.database.windows.net";
		   String dbName = "your_database";
		   String user = "your_username";
		   String password = "your_password";
		   String url = String.format("jdbc:sqlserver://%s:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
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

## Run the code

1. At the command prompt, run the following commands:

   ```bash
   mvn package
   mvn -q exec:java "-Dexec.mainClass=com.sqldbsamples.App"
   ```

2. Verify that the top 20 rows are returned and then close the application window.


## Next steps
- [Design your first Azure SQL database](sql-database-design-first-database.md)
- [Microsoft JDBC Driver for SQL Server](https://github.com/microsoft/mssql-jdbc)
- [Report issues/ask questions](https://github.com/microsoft/mssql-jdbc/issues)

