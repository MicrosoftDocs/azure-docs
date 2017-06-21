---
title: 'Connect to Azure Database for PostgreSQL using Java | Microsoft Docs'
description: This quickstart provides a Java code sample you can use to connect and query data from Azure Database for PostgreSQL.
services: postgresql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.custom: mvc
ms.devlang: java
ms.topic: article
ms.date: 06/20/2017
---

# Azure Database for PostgreSQL: Use Java to connect and query data
This quickstart demonstrates how to connect to an Azure Database for PostgreSQL using a Java application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Java, and that you are new to working with Azure Database for PostgreSQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create DB - Portal](quickstart-create-server-database-portal.md)
- [Create DB - CLI](quickstart-create-server-database-azure-cli.md)

You also need to:
- Download  the [PostgreSQL JDBC Driver ](https://jdbc.postgresql.org/download.html) matching your version of Java and the Java Development Kit.
- Include the PostgreSQL JDBC jar file (for example postgresql-42.1.1.jar) in your application classpath. For more information, see [classpath details](https://jdbc.postgresql.org/documentation/head/classpath.html).

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have created, such as **mypgserver-20170401**.
3. Click the server name **mypgserver-20170401**.
4. Select the server's **Overview** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for PostgreSQL - Server Admin Login](./media/connect-java/1-connection-string.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name and, if necessary, reset the password.

## Connect, create table, and insert data
Use the following code to connect and load the data using the function with an **INSERT** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [createStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeQuery()](https://jdbc.postgresql.org/documentation/head/query.html) are used to connect, drop, and create the table. The prepareStatement object is used to build the insert commands, with setString() and setInt() to bind the parameter values. Method [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) runs the command for each set of parameters. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class CreateTableInsertRows {

	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mypgserver-20170401.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mypgserver-20170401";
		String password = "<server_admin_password>";

		// check that the driver is installed
		try
		{
			Class.forName("org.postgresql.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new ClassNotFoundException("PostgreSQL JDBC driver NOT detected in library path.", e);
		}

		System.out.println("PostgreSQL JDBC driver detected in library path.");

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:postgresql://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("ssl", "true");

			// get connection
			connection = DriverManager.getConnection(url, properties);
		}
		catch (SQLException e)
		{
			throw new SQLException("Failed to create connection to database", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
				// Drop previous table of same name if one exists.
				Statement statement = connection.createStatement();
				statement.execute("DROP TABLE IF EXISTS inventory;");
				System.out.println("Finished dropping table (if existed).");
	
				// Create table.
				statement.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);");
				System.out.println("Created table.");
	
				int rowcount=0;
				
				// Insert some data into table.
				PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO inventory (name, quantity) VALUES (?, ?);");
				preparedStatement.setString(1, "banana");
				preparedStatement.setInt(2, 150);
				rowcount = preparedStatement.executeUpdate();
				System.out.printf("Inserted %d row(s) of data. \n", rowcount);
				
				preparedStatement.setString(1, "orange");
				preparedStatement.setInt(2, 154);
				rowcount = preparedStatement.executeUpdate();
				System.out.printf("Inserted %d row(s) of data. \n", rowcount);
				
				preparedStatement.setString(1, "apple");
				preparedStatement.setInt(2, 100);
				rowcount = preparedStatement.executeUpdate();
				System.out.printf("Inserted %d row(s) of data. \n", rowcount);
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
	
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement", e);
			}		
		}
		else {
			System.out.println("Failed to create connection to database.");
		}
		System.out.println("Execution finished.");
	}
}
```

## Read data
Use the following code to read the data with a **SELECT** SQL statement.  The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [createStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeQuery()](https://jdbc.postgresql.org/documentation/head/query.html) are used to connect, create, and run the select statement. The results are processed using a [ResultSet](https://www.postgresql.org/docs/7.4/static/jdbc-query.html) object. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class ReadTable {

	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mypgserver-20170401.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mypgserver-20170401";
		String password = "<server_admin_password>";

		// check that the driver is installed
		try
		{
			Class.forName("org.postgresql.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new ClassNotFoundException("PostgreSQL JDBC driver NOT detected in library path.", e);
		}

		System.out.println("PostgreSQL JDBC driver detected in library path.");

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:postgresql://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("ssl", "true");

			// get connection
			connection = DriverManager.getConnection(url, properties);
		}
		catch (SQLException e)
		{
			throw new SQLException("Failed to create connection to database", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
	
				Statement statement = connection.createStatement();
				ResultSet results = statement.executeQuery("SELECT * from inventory;");
				while (results.next())
				{
					String outputString = 
						String.format(
							"Data row = (%s, %s, %s)",
							results.getString(1),
							results.getString(2),
							results.getString(3));
					System.out.println(outputString);
				}
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement", e);
			}		
		}
		else {
			System.out.println("Failed to create connection to database.");
		}
		System.out.println("Execution finished.");
	}
}

```

## Update data
Use the following code to change the data with an **UPDATE** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), prepareStatement(), and [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) are used to connect, prepare, and run the update statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class UpdateTable {
	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mypgserver-20170401.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mypgserver-20170401";
		String password = "<server_admin_password>";

		// check that the driver is installed
		try
		{
			Class.forName("org.postgresql.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new ClassNotFoundException("PostgreSQL JDBC driver NOT detected in library path.", e);
		}

		System.out.println("PostgreSQL JDBC driver detected in library path.");

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:postgresql://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("ssl", "true");

			// get connection
			connection = DriverManager.getConnection(url, properties);
		}
		catch (SQLException e)
		{
			throw new SQLException("Failed to create connection to database", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
				// Modify some data in table.
				PreparedStatement preparedStatement = connection.prepareStatement("UPDATE inventory SET quantity = ? WHERE name = ?;");
				preparedStatement.setInt(1, 200);
				preparedStatement.setString(2, "banana");
				int rowcount = preparedStatement.executeUpdate();
				System.out.printf("Updated %d row(s) of data. \n", rowcount);
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement", e);
			}		
		}
		else {
			System.out.println("Failed to create connection to database.");
		}
		System.out.println("Execution finished.");
	}
}
```
## Delete data
Use the following code to remove data with a **DELETE** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), prepareStatement(), and [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) are used to connect, prepare, and run the delete statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class DeleteTable {
	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mypgserver-20170401.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mypgserver-20170401";
		String password = "<server_admin_password>";

		// check that the driver is installed
		try
		{
			Class.forName("org.postgresql.Driver");
		}
		catch (ClassNotFoundException e)
		{
			throw new ClassNotFoundException("PostgreSQL JDBC driver NOT detected in library path.", e);
		}

		System.out.println("PostgreSQL JDBC driver detected in library path.");

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:postgresql://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("ssl", "true");

			// get connection
			connection = DriverManager.getConnection(url, properties);
		}
		catch (SQLException e)
		{
			throw new SQLException("Failed to create connection to database", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
				// Delete some data from table.
				PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM inventory WHERE name = ?;");
				preparedStatement.setString(1, "orange");
				int rowcount = preparedStatement.executeUpdate();
				System.out.printf("Deleted %d row(s) of data. \n", rowcount);
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement", e);
			}		
		}
		else {
			System.out.println("Failed to create connection to database.");
		}
		System.out.println("Execution finished.");
	}
}
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your database using Export and Import](./howto-migrate-using-export-and-import.md)