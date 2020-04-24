---
title: Connect with Java - Azure Database for PostgreSQL - Single Server
description: This quickstart provides a Java code sample you can use to connect and query data from Azure Database for PostgreSQL  - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.custom: ["mvc", "seo-java-august2019"]
ms.devlang: java
ms.topic: quickstart
ms.date: 05/06/2019
---

# Quickstart: Use Java to connect to and query data in Azure Database for PostgreSQL - Single Server

In this quickstart, you connect to an Azure Database for PostgreSQL using a Java application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Java, and are new to working with Azure Database for PostgreSQL.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- Completion of [Quickstart: Create an Azure Database for PostgreSQL server in the Azure portal](quickstart-create-server-database-portal.md) or [Quickstart: Create an Azure Database for PostgreSQL using the Azure CLI](quickstart-create-server-database-azure-cli.md).

- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/download.html) - match your version of Java and the Java Development Kit.
- [Classpath details](https://jdbc.postgresql.org/documentation/head/classpath.html) - Include the PostgreSQL JDBC jar file (for example postgresql-42.1.1.jar) in your application classpath.

## Get connection information
Get the connection information needed to connect to the Azure Database for PostgreSQL. You need the fully qualified server name and login credentials.

1. In the [Azure portal](https://portal.azure.com/), search for and select the server you have created (such as **mydemoserver**).

1. From the server's **Overview** panel, make a note of the **Server name** and **Admin username**. If you forget your password, you can also reset the password from this panel.

    ![Azure Database for PostgreSQL connection string](./media/connect-java/server-details-azure-database-postgresql.png)

## Connect, create table, and insert data
Use the following code to connect and load the data into the database using the function with an **INSERT** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [createStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeQuery()](https://jdbc.postgresql.org/documentation/head/query.html) are used to connect to the database, drop, and create the table. The [prepareStatement](https://jdbc.postgresql.org/documentation/head/query.html) object is used to build the insert commands, with setString() and setInt() to bind the parameter values. Method [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) runs the command for each set of parameters. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class CreateTableInsertRows {

	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mydemoserver.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mydemoserver";
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
			throw new SQLException("Failed to create connection to database.", e);
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
	
				// Insert some data into table.
				int nRowsInserted = 0;
				PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO inventory (name, quantity) VALUES (?, ?);");
				preparedStatement.setString(1, "banana");
				preparedStatement.setInt(2, 150);
				nRowsInserted += preparedStatement.executeUpdate();

				preparedStatement.setString(1, "orange");
				preparedStatement.setInt(2, 154);
				nRowsInserted += preparedStatement.executeUpdate();

				preparedStatement.setString(1, "apple");
				preparedStatement.setInt(2, 100);
				nRowsInserted += preparedStatement.executeUpdate();
				System.out.println(String.format("Inserted %d row(s) of data.", nRowsInserted));
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
	
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement.", e);
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
Use the following code to read the data with a **SELECT** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [createStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeQuery()](https://jdbc.postgresql.org/documentation/head/query.html) are used to connect to the database, create, and run the select statement. The results are processed using a [ResultSet](https://www.postgresql.org/docs/7.4/static/jdbc-query.html) object. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class ReadTable {

	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mydemoserver.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mydemoserver";
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
			throw new SQLException("Failed to create connection to database.", e);
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
				throw new SQLException("Encountered an error when executing given sql statement.", e);
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
Use the following code to change the data with an **UPDATE** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [prepareStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) are used to connect to the database, prepare, and run the update statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class UpdateTable {
	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mydemoserver.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mydemoserver";
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
			throw new SQLException("Failed to create connection to database.", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
				// Modify some data in table.
				int nRowsUpdated = 0;
				PreparedStatement preparedStatement = connection.prepareStatement("UPDATE inventory SET quantity = ? WHERE name = ?;");
				preparedStatement.setInt(1, 200);
				preparedStatement.setString(2, "banana");
				nRowsUpdated += preparedStatement.executeUpdate();
				System.out.println(String.format("Updated %d row(s) of data.", nRowsUpdated));
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement.", e);
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
Use the following code to remove data with a **DELETE** SQL statement. The methods [getConnection()](https://www.postgresql.org/docs/7.4/static/jdbc-use.html), [prepareStatement()](https://jdbc.postgresql.org/documentation/head/query.html), and [executeUpdate()](https://jdbc.postgresql.org/documentation/head/update.html) are used to connect to the database, prepare, and run the delete statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class DeleteTable {
	public static void main (String[] args)  throws Exception
	{

		// Initialize connection variables.
		String host = "mydemoserver.postgres.database.azure.com";
		String database = "mypgsqldb";
		String user = "mylogin@mydemoserver";
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
			throw new SQLException("Failed to create connection to database.", e);
		}
		if (connection != null) 
		{ 
			System.out.println("Successfully created connection to database.");
		
			// Perform some SQL queries over the connection.
			try
			{
				// Delete some data from table.
				int nRowsDeleted = 0;
				PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM inventory WHERE name = ?;");
				preparedStatement.setString(1, "orange");
				nRowsDeleted += preparedStatement.executeUpdate();
				System.out.println(String.format("Deleted %d row(s) of data.", nRowsDeleted));
	
				// NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			}
			catch (SQLException e)
			{
				throw new SQLException("Encountered an error when executing given sql statement.", e);
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
