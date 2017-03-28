---
title: Azure SQL Database: Connect to Azure SQL Database by using Java | Microsoft Docs
description: Presents a Python code sample you can use to connect to Azure SQL Database.
services: sql-database
documentationcenter: ''
author: stevestein
manager: jhubbard
editor: ''

ms.assetid: 08fc49b1-cd48-4dcc-a293-ff22a4d2d62c
ms.service: sql-database
ms.custom: development
ms.workload: drivers
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/24/2017
ms.author: sstein;carlrab

---
# Azure SQL Database: Use Java to connect and query data

Use [Java](https://docs.microsoft.com/sql/connect/jdbc/microsoft-jdbc-driver-for-sql-server) to connect to and query an Azure SQL database. This guide details using Java to connect to an Azure SQL database, and then execute query, insert, update, and delete statements.

This quick start uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

## Configure Development Environment

// please review this entire section

### **Mac OS**
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install **brew** and **Microsoft ODBC Driver for Mac** .

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew tap microsoft/msodbcsql https://github.com/Microsoft/homebrew-msodbcsql-preview
brew update
brew install msodbcsql 
#for silent install ACCEPT_EULA=y brew install msodbcsql
```

### **Linux (Ubuntu)**
Open your terminal and navigate to a directory where you plan on creating your python script. Enter the following commands to install the **Microsoft ODBC Driver for Linux** and **pyodbc**. pyodbc uses the Microsoft ODBC Driver on Linux to connect to SQL Databases.

```
sudo su
curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
curl https://packages.microsoft.com/config/ubuntu/16.04/prod.list > /etc/apt/sources.list.d/mssql.list
exit
sudo apt-get update
sudo apt-get install msodbcsql mssql-tools unixodbc-dev
```

### **Windows**
Install the [Microsoft ODBC Driver 13.1](https://www.microsoft.com/en-us/download/details.aspx?id=53339).  

Then install ?

```
?
```

Instructions to enable the use ?

## Get connection information

Get the connection string in the Azure portal. You use the connection string to connect to the Azure SQL database.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane for your database, review the fully qualified server name. 

    <img src="./media/sql-database-connect-query-dotnet/connection-strings.png" alt="connection strings" style="width: 780px;" />

4. Click **Show database connection strings**.

5. Review the complete **JDBC** connection string.

    <img src="./media/sql-database-connect-query-jdbc/jdbc-connection-string.png" alt="ODBC connection string" style="width: 780px;" />
    
## Select data

Use a [connection]( https://docs.microsoft.com/sql/connect/jdbc/working-with-a-connection) with a [SELECT](https://msdn.microsoft.com/library/ms189499.aspx) Transact-SQL statement, to query data in your Azure SQL database using Java.

```java
import java.sql.Connection;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.DriverManager;

public class App {

	public static void main(String[] args) {

		System.out.println("Connect to SQL Server and demo Create, Read, Update and Delete operations.");

        //Update the username and password below
		String connectionUrl = "jdbc:sqlserver://localhost:1433;databaseName=master;user=sa;password=your_password";

		try {
			// Load SQL Server JDBC driver and establish connection.
			System.out.print("Connecting to SQL Server ... ");
			try (Connection connection = DriverManager.getConnection(connectionUrl)) {
				System.out.println("Done.");



```java

    // Connect to database and query data
// Connect to database
String hostName = "{your_Server}";
String dbName = "{your_Database}";
String user = "{your_Username}@{your_Server}";
String password = "{your_Password}";
String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
Connection connection = null;

// global vars
Scanner scanner = new Scanner(System.in);

try {

	connection = DriverManager.getConnection(url);
	String schema = connection.getSchema();
	System.out.println("\nSuccessful connection - Schema: " + schema);

}
catch (Exception e) {
	e.printStackTrace();
}


// Query data
System.out.println("\nQuery data example:");
System.out.println("=========================================\n");

Statement statement;
ResultSet resultSet;

try {

	// Create and execute a SELECT SQL statement.
	String selectSql = "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid";
	statement = connection.createStatement();
	resultSet = statement.executeQuery(selectSql);

	// Print results from select statement
	System.out.println("\nTop 20 categories:");
	while (resultSet.next())
	{
		System.out.println(resultSet.getString(2) + " "
				+ resultSet.getString(3));
	}
}
catch (Exception e) {
	e.printStackTrace();
}

System.out.println("\nPress any key to continue ...");
scanner.nextLine();

```

## Insert data

Use [SqlCommand.ExecuteNonQuery](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.executenonquery.aspx) with an [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transcat-SQL statement to insert data into your Azure SQL database.

```java
    System.out.println("\nInsert data example:");
System.out.println("=========================================\n");

try {
	String insertSql = "INSERT INTO SalesLT.Product 
    (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) VALUES "(?,?,?,?,?,?);";

    
	PreparedStatement prep = connection.prepareStatement(insertSql);

	java.sql.Date sellDate = new java.sql.Date(Calendar.getInstance().getTime().getTime());


	prep.setString(1, "BrandNewProduct");
	prep.setInt(2, 200989);
	prep.setString(3, "Blue");
	prep.setDouble(4,75);
	prep.setDouble(5, 80);
	prep.setDate(6,sellDate);

	int count = prep.executeUpdate();
	System.out.println("Inserted: " + count + " row(s)");
}
catch (Exception e) {
	e.printStackTrace();
}
System.out.println("\nPress any key to continue ...");
scanner.nextLine();

```
## Update data

Use [SqlCommand.ExecuteNonQuery](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.executenonquery.aspx) with an [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to update data in your Azure SQL database.

```java
System.out.println("\nUpdate data example:");
System.out.println("=========================================\n");

try {
	// Create and execute an INSERT SQL prepared statement.

	String updateSql = "UPDATE SalesLT.Product SET ListPrice = ? WHERE Name = ?";

	PreparedStatement prep = connection.prepareStatement(updateSql);


	prep.setString(1, "BrandNewThing");
	prep.setString(2, "500");

	int count = prep.executeUpdate();

	System.out.println("Updated: " + count + " row(s)");
}
catch (Exception e) {
	e.printStackTrace();
}
System.out.println("\nPress any key to continue ...");
scanner.nextLine();


```



## Delete data

Use [SqlCommand.ExecuteNonQuery](https://msdn.microsoft.com/library/system.data.sqlclient.sqlcommand.executenonquery.aspx) with a [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL statement to delete data in your Azure SQL database.

```java
System.out.println("\nUpdate data example:");
System.out.println("=========================================\n");

try {
	// Create and execute an INSERT SQL prepared statement.

	String deleteSql = "DELETE SalesLT.Product WHERE Name = ?";

	PreparedStatement prep = connection.prepareStatement(deleteSql);


	prep.setString(1, "BrandNewThing");

	int count = prep.executeUpdate();

	System.out.println("Deleted: " + count + " row(s)");


	// Demo completed
	connection.close();
}
catch (Exception e) {
	e.printStackTrace();
        }


```



## Complete script

The following script contains all of the previous steps in a single code block.

```java
    import java.sql.*;
import java.util.*;
import java.text.*;


public class Main {

    public static void main(String[] args) {

        // Connect to database
		String hostName = "{your_Server}";
		String dbName = "{your_Database}";
		String user = "{your_Username}@{your_Server}";
		String password = "{your_Password}";
        String url = String.format("jdbc:sqlserver://%s.database.windows.net:1433;database=%s;user=%s;password=%s;encrypt=true;hostNameInCertificate=*.database.windows.net;loginTimeout=30;", hostName, dbName, user, password);
        Connection connection = null;

        // global vars
        Scanner scanner = new Scanner(System.in);

        try {

            connection = DriverManager.getConnection(url);
            String schema = connection.getSchema();
            System.out.println("\nSuccessful connection - Schema: " + schema);

        }
        catch (Exception e) {
            e.printStackTrace();
        }


        // Query data
        System.out.println("\nQuery data example:");
        System.out.println("=========================================\n");

        Statement statement;
        ResultSet resultSet;

        try {

            // Create and execute a SELECT SQL statement.
            String selectSql = "SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName FROM [SalesLT].[ProductCategory] pc JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(selectSql);

            // Print results from select statement
            System.out.println("\nTop 20 categories:");
            while (resultSet.next())
            {
                System.out.println(resultSet.getString(2) + " "
                        + resultSet.getString(3));
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("\nPress any key to continue ...");
        scanner.nextLine();

        // Insert data

        System.out.println("\nInsert data example:");
        System.out.println("=========================================\n");

        try {
            String insertSql = "INSERT INTO SalesLT.Product (Name, ProductNumber, Color, StandardCost, ListPrice, SellStartDate) VALUES "
                    + "(?,?,?,?,?,?);";

            PreparedStatement prep = connection.prepareStatement(insertSql);

             java.sql.Date sellDate = new java.sql.Date(Calendar.getInstance().getTime().getTime());


            prep.setString(1, "BrandNewProduct");
            prep.setInt(2, 200989);
            prep.setString(3, "Blue");
            prep.setDouble(4,75);
            prep.setDouble(5, 80);
            prep.setDate(6,sellDate);

            int count = prep.executeUpdate();
            System.out.println("Inserted: " + count + " row(s)");
        }
        catch (Exception e) {
            e.printStackTrace();
        }


        // Update data
        System.out.println("\nPress any key to continue ...");
        scanner.nextLine();
        System.out.println("\nUpdate data example:");
        System.out.println("=========================================\n");

        try {
            // Create and execute an INSERT SQL prepared statement.

            String updateSql = "UPDATE SalesLT.Product SET ListPrice = ? WHERE Name = ?";

            PreparedStatement prep = connection.prepareStatement(updateSql);


            prep.setString(1, "BandNewThing");
            prep.setString(2, "500");

            int count = prep.executeUpdate();
            // MY UPDATE SHOWED 0 ROWS - please check!!
            System.out.println("Updated: " + count + " row(s)");
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        // Delete data
        System.out.println("\nPress any key to continue ...");
        scanner.nextLine();
        System.out.println("\nUpdate data example:");
        System.out.println("=========================================\n");

        try {
            // Create and execute an INSERT SQL prepared statement.

            String deleteSql = "DELETE SalesLT.Product WHERE Name = ?";

            PreparedStatement prep = connection.prepareStatement(deleteSql);


            prep.setString(1, "BandNewThing");

            int count = prep.executeUpdate();
            // MY DELETES WHERE NOT SUCCESSFUL - please check!!
            System.out.println("Deleted: " + count + " row(s)");


            // Demo completed
            connection.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }

    }
}


```


## Next steps










