---
title: Connect to Azure SQL Database by using Java | Microsoft Docs
description: Presents a Java code sample you can use to connect to and query Azure SQL Database.
services: sql-database
documentationcenter: ''
author: ajlam
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: quick start connect
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 04/05/2017
ms.author: andrela;carlrab;sstein

---
# Azure SQL Database: Use Java to connect and query data

Use [Java](https://docs.microsoft.com/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server) to connect to and query an Azure SQL database. This guide details using Java to connect to an Azure SQL database, and then execute query, insert, update, and delete statements.

This quick start uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

## Configure development environment

The following sections detail configuring your existing Mac OS, Linux (Ubuntu), and Windows development environments for working with Azure SQL Database.

### **Mac OS**
Open your terminal and navigate to a directory where you plan on creating your Java project. Enter the following commands to install **brew** and **Maven**. 

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install maven
```

### **Linux (Ubuntu)**
Open your terminal and navigate to a directory where you plan on creating your Java project. Enter the following commands to install **Maven**. 

```bash
sudo apt-get install maven
```

### **Windows**
Install [Maven](https://maven.apache.org/download.cgi) using the official installer.  

## Get connection information

Get the connection string in the Azure portal. You use the connection string to connect to the Azure SQL database.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane for your database, review the fully qualified server name. 

    <img src="./media/sql-database-connect-query-dotnet/server-name.png" alt="server name" style="width: 780px;" />

4. Click **Show database connection strings**.

5. Review the complete **JDBC** connection string.

    <img src="./media/sql-database-connect-query-jdbc/jdbc-connection-string.png" alt="JDBC connection string" style="width: 780px;" />

### **Create Maven project**
From the terminal, create a new Maven project. 
```bash
mvn archetype:generate "-DgroupId=com.sqldbsamples" "-DartifactId=SqlDbSample" "-DarchetypeArtifactId=maven-archetype-quickstart" "-Dversion=1.0.0"
```

Add the **Microsoft JDBC Driver for SQL Server** to the dependencies in ***pom.xml***. 

```xml
<dependency>
	<groupId>com.microsoft.sqlserver</groupId>
	<artifactId>mssql-jdbc</artifactId>
	<version>6.1.0.jre8</version>
</dependency>
```

## Select data

Use a [connection](https://docs.microsoft.com/sql/connect/jdbc/working-with-a-connection) with a [SELECT](https://msdn.microsoft.com/library/ms189499.aspx) Transact-SQL statement, to query data in your Azure SQL database using Java.

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
		String hostName = "yourserver";
		String dbName = "yourdatabase";
		String user = "yourusername";
		String password = "yourpassword";
		String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
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
				}
        	}
		catch (Exception e) {
		    	e.printStackTrace();
		}
	}
}
```

## Insert data

Use [Prepared Statements](https://docs.microsoft.com/sql/connect/jdbc/using-statements-with-sql) with an [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transcat-SQL statement to insert data into your Azure SQL database.

```java
package com.sqldbsamples;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.DriverManager;

public class App {

	public static void main(String[] args) {
	
		// Connect to database
		String hostName = "yourserver";
		String dbName = "yourdatabase";
		String user = "yourusername";
		String password = "yourpassword";
		String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
		Connection connection = null;

		try {
				connection = DriverManager.getConnection(url);
				String schema = connection.getSchema();
				System.out.println("Successful connection - Schema: " + schema);

				System.out.println("Insert data example:");
				System.out.println("=========================================");

				// Prepared statement to insert data
				String insertSql = "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, )" 
					+ " StandardCost, ListPrice, SellStartDate) VALUES (?,?,?,?,?,?);";

				java.util.Date date = new java.util.Date();
				java.sql.Timestamp sqlTimeStamp = new java.sql.Timestamp(date.getTime());

				try (PreparedStatement prep = connection.prepareStatement(insertSql)) {
						prep.setString(1, "BrandNewProduct");
						prep.setInt(2, 200989);
						prep.setString(3, "Blue");
						prep.setDouble(4, 75);
						prep.setDouble(5, 80);
						prep.setTimestamp(6, sqlTimeStamp);

						int count = prep.executeUpdate();
						System.out.println("Inserted: " + count + " row(s)");
				}
		}
		catch (Exception e) {
		    	e.printStackTrace();
		}
	}
}
```
## Update data

Use [Prepared Statements](https://docs.microsoft.com/sql/connect/jdbc/using-statements-with-sql) with an [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to update data in your Azure SQL database.

```java
package com.sqldbsamples;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.DriverManager;

public class App {

	public static void main(String[] args) {
	
		// Connect to database
		String hostName = "yourserver";
		String dbName = "yourdatabase";
		String user = "yourusername";
		String password = "yourpassword";
		String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
		Connection connection = null;

		try {
				connection = DriverManager.getConnection(url);
				String schema = connection.getSchema();
				System.out.println("Successful connection - Schema: " + schema);

				System.out.println("Update data example:");
				System.out.println("=========================================");

				// Prepared statement to update data
				String updateSql = "UPDATE SalesLT.Product SET ListPrice = ? WHERE Name = ?";

				try (PreparedStatement prep = connection.prepareStatement(updateSql)) {
						prep.setString(1, "500");
						prep.setString(2, "BrandNewProduct");

						int count = prep.executeUpdate();
						System.out.println("Updated: " + count + " row(s)")
				}
		}
		catch (Exception e) {
		    	e.printStackTrace();
		}
	}
}
```



## Delete data

Use [Prepared Statements](https://docs.microsoft.com/sql/connect/jdbc/using-statements-with-sql) with a [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL statement to delete data in your Azure SQL database.

```java
package com.sqldbsamples;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.DriverManager;

public class App {

	public static void main(String[] args) {
	
		// Connect to database
		String hostName = "yourserver";
		String dbName = "yourdatabase";
		String user = "yourusername";
		String password = "yourpassword";
		String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
		Connection connection = null;

		try {
				connection = DriverManager.getConnection(url);
				String schema = connection.getSchema();
				System.out.println("Successful connection - Schema: " + schema);

				System.out.println("Delete data example:");
				System.out.println("=========================================");

				// Prepared statement to delete data
				String deleteSql = "DELETE SalesLT.Product WHERE Name = ?";

				try (PreparedStatement prep = connection.prepareStatement(deleteSql)) {
						prep.setString(1, "BrandNewProduct");

						int count = prep.executeUpdate();
						System.out.println("Deleted: " + count + " row(s)");
				}
        	}		
		catch (Exception e) {
		    	e.printStackTrace();
		}
	}
}
```

## Next steps
* Review the [SQL Database Development Overview](sql-database-develop-overview.md).
* GitHub repository for [Microsoft JDBC Driver for SQL Server](https://github.com/microsoft/mssql-jdbc).
* [File issues/ask questions](https://github.com/microsoft/mssql-jdbc/issues).
* Explore all the [capabilities of SQL Database](https://azure.microsoft.com/services/sql-database/).

