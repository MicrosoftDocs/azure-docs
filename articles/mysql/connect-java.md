---
title: 'Connect to Azure Database for MySQL using Java | Microsoft Docs'
description: This quickstart provides a Java code sample you can use to connect and query data from a Azure Database for MySQL database.
services: mysql
author: jasonwhowell
ms.author: jasonh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.custom: mvc
ms.topic: article
ms.devlang: java
ms.date: 06/19/2017
---

# Azure Database for MySQL: Use Java to connect and query data
This quickstart demonstrates how to connect to an Azure Database for MySQL using a Java application. It shows how to use SQL statements to query, insert, update, and delete data in the database. The steps in this article assume that you are familiar with developing using Java, and that you are new to working with Azure Database for MySQL.

## Prerequisites
This quickstart uses the resources created in either of these guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](./quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](./quickstart-create-mysql-server-database-using-azure-cli.md)

You also need to:
- Download the JDBC driver [MySQL Connector/J](https://dev.mysql.com/downloads/connector/j/)
- Put the JDBC jar file (for example mysql-connector-java-5.1.42-bin.jar) into your application classpath.
- Ensure connection security is configured with the firewall opened and SSL settings adjusted for your application to connect successfully.

## Get connection information
Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, click **All resources** and search for the server you have created, such as **myserver4demo**.
3. Click the server name.
4. Select the server's **Properties** page. Make a note of the **Server name** and **Server admin login name**.
 ![Azure Database for MySQL server name](./media/connect-java/1_server-properties-name-login.png)
5. If you forget your server login information, navigate to the **Overview** page to view the Server admin login name and, if necessary, reset the password.

## Connect, create table, and insert data
Use the following code to connect and load the data using the function with an **INSERT** SQL statement. The [getConnection()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html) method is used to connect to MySQL. Methods [createStatement()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-statements.html) and execute() are used to drop and create the table. The prepareStatement object is used to build the insert commands, with setString() and setInt() to bind the parameter values. Method executeUpdate() runs the command for each set of parameters to insert the values. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class CreateTableInsertRows {

	
	static Connection connect (String host, String database, String user, String password)
	{
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
		}
		catch (ClassNotFoundException e)
		{
			System.out.println("JDBC driver NOT detected in library path");
			
			e.printStackTrace();
			return null;
		}

		System.out.println("JDBC driver detected in library path");

		Connection connection = null;
		
		try
		{
			String url = "jdbc:mysql://" + host + "/" + database;
			
			/*
			 * Set connection properties.
			 */
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
			 /*
			 * Obtain connection object.
			 */
			connection = DriverManager.getConnection(url, properties);

		}
		catch (SQLException e)
		{
			System.out.println("Failed to create connection to database");
			System.out.println("SQLException: " + e.getMessage());
		    System.out.println("SQLState: " + e.getSQLState());
		    System.out.println("VendorError: " + e.getErrorCode());
		    
			return null;
		}
		
		if (connection != null)
		{
			System.out.println("Successfully created connection to database");
		}
		else
		{
			System.out.println("Failed to create connection to database");
		}
		
		return connection;
	}
		
	
	public static void main (String[] args)
	{
	
		/*
		 * Initialize connection variables.
		 */
		String host = "myserver4demo.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@myserver4demo";
		String password = "<server_admin_password>";
		
		/*
		 * Initialize connection object.
		 */
		Connection connection = connect(host, database, user, password);
		
		try
		{
			/*
			 * Drop previous table of same name if one exists.
			 */
			Statement statement = connection.createStatement();
			statement.execute("DROP TABLE IF EXISTS inventory;");
			System.out.println("Finished dropping table (if existed)");

			/*
			 * Create table.
			 */
			statement.execute("CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);");
			System.out.println("Finished creating table");

			/*
			 * Insert some data into table.
			 */
			PreparedStatement preparedStatement = connection.prepareStatement("INSERT INTO inventory (name, quantity) VALUES (?, ?);");
			preparedStatement.setString(1, "banana");
			preparedStatement.setInt(2, 150);
			preparedStatement.executeUpdate();

			preparedStatement.setString(1, "orange");
			preparedStatement.setInt(2, 154);
			preparedStatement.executeUpdate();

			preparedStatement.setString(1, "apple");
			preparedStatement.setInt(2, 100);
			preparedStatement.executeUpdate();
			System.out.println("Inserted 3 rows of data");

			/*
			 * NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			 */
		} catch (SQLException ex) {
	    
		// handle any errors
	    System.out.println("SQLException: " + ex.getMessage());
	    System.out.println("SQLState: " + ex.getSQLState());
	    System.out.println("VendorError: " + ex.getErrorCode());
		}
	}
}
```

## Read data
Use the following code to read the data with a **SELECT** SQL statement. The [getConnection()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html) method is used to connect to MySQL. The methods [createStatement()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-statements.html) and executeQuery() are used to connect and run the select statement. The results are processed using a [ResultSet](https://docs.oracle.com/javase/tutorial/jdbc/basics/retrieving.html) object. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class ReadRows {

	
	static Connection connect (String host, String database, String user, String password)
	{
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
		}
		catch (ClassNotFoundException e)
		{
			System.out.println("JDBC driver NOT detected in library path");
			
			e.printStackTrace();
			return null;
		}

		System.out.println("JDBC driver detected in library path");

		Connection connection = null;
		
		try
		{
			String url = "jdbc:mysql://" + host + "/" + database;
			
			/*
			 * Set connection properties.
			 */
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
			 /*
			 * Obtain connection object.
			 */
			connection = DriverManager.getConnection(url, properties);

		}
		catch (SQLException e)
		{
			System.out.println("Failed to create connection to database");
			System.out.println("SQLException: " + e.getMessage());
		    System.out.println("SQLState: " + e.getSQLState());
		    System.out.println("VendorError: " + e.getErrorCode());
		    
			return null;
		}
		
		if (connection != null)
		{
			System.out.println("Successfully created connection to database");
		}
		else
		{
			System.out.println("Failed to create connection to database");
		}
		
		return connection;
	}
		
	
	public static void main (String[] args)
	{
		/*
		 * Initialize connection variables.
		 */
		String host = "myserver4demo.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@myserver4demo";
		String password = "<server_admin_password>";
			
		/*
		 * Initialize connection object.
		 */
		Connection connection = connect(host, database, user, password);
		
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

			/*
			 * NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			 */
		} catch (SQLException ex) {
	    
		// handle any errors
	    System.out.println("SQLException: " + ex.getMessage());
	    System.out.println("SQLState: " + ex.getSQLState());
	    System.out.println("VendorError: " + ex.getErrorCode());
		}
	}
}
```

## Update data
Use the following code to change the data with an **UPDATE** SQL statement. The [getConnection()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html) method is used to connect to MySQL. The methods [prepareStatement()](http://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html) and executeUpdate() are used to prepare and run the update statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class UpdateRows {

	
	static Connection connect (String host, String database, String user, String password)
	{
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
		}
		catch (ClassNotFoundException e)
		{
			System.out.println("JDBC driver NOT detected in library path");
			
			e.printStackTrace();
			return null;
		}

		System.out.println("JDBC driver detected in library path");

		Connection connection = null;
		
		try
		{
			String url = "jdbc:mysql://" + host + "/" + database;
			
			/*
			 * Set connection properties.
			 */
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
			 /*
			 * Obtain connection object.
			 */
			connection = DriverManager.getConnection(url, properties);

		}
		catch (SQLException e)
		{
			System.out.println("Failed to create connection to database");
			System.out.println("SQLException: " + e.getMessage());
		    System.out.println("SQLState: " + e.getSQLState());
		    System.out.println("VendorError: " + e.getErrorCode());
		    
			return null;
		}
		
		if (connection != null)
		{
			System.out.println("Successfully created connection to database");
		}
		else
		{
			System.out.println("Failed to create connection to database");
		}
		
		return connection;
	}
		
	
	public static void main (String[] args)
	{
	
		/*
		 * Initialize connection variables.
		 */
		String host = "myserver4demo.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@myserver4demo";
		String password = "<server_admin_password>";
		
		/*
		 * Initialize connection object.
		 */
		Connection connection = connect(host, database, user, password);
		
		try
		{
			/*
			 * Modify some data in table.
			 */
			PreparedStatement preparedStatement = connection.prepareStatement("UPDATE inventory SET quantity = ? WHERE name = ?;");
			preparedStatement.setInt(1, 200);
			preparedStatement.setString(2, "banana");
			preparedStatement.executeUpdate();

			System.out.println("Updated 1 row of data");

			/*
			 * NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			 */
		}
		catch (SQLException ex) {
	    
		// handle any errors
	    System.out.println("SQLException: " + ex.getMessage());
	    System.out.println("SQLState: " + ex.getSQLState());
	    System.out.println("VendorError: " + ex.getErrorCode());
		}
	}
}
```
## Delete data
Use the following code to remove data with a **DELETE** SQL statement. The [getConnection()](https://dev.mysql.com/doc/connector-j/5.1/en/connector-j-usagenotes-connect-drivermanager.html) method is used to connect to MySQL.  The methods [prepareStatement()](http://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html) and executeUpdate() are used to prepare and run the update statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DeleteRows {

	
	static Connection connect (String host, String database, String user, String password)
	{
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
		}
		catch (ClassNotFoundException e)
		{
			System.out.println("JDBC driver NOT detected in library path");
			
			e.printStackTrace();
			return null;
		}

		System.out.println("JDBC driver detected in library path");

		Connection connection = null;
		
		try
		{
			String url = "jdbc:mysql://" + host + "/" + database;
			
			/*
			 * Set connection properties.
			 */
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
			 /*
			 * Obtain connection object.
			 */
			connection = DriverManager.getConnection(url, properties);

		}
		catch (SQLException e)
		{
			System.out.println("Failed to create connection to database");
			System.out.println("SQLException: " + e.getMessage());
		    System.out.println("SQLState: " + e.getSQLState());
		    System.out.println("VendorError: " + e.getErrorCode());
		    
			return null;
		}
		
		if (connection != null)
		{
			System.out.println("Successfully created connection to database");
		}
		else
		{
			System.out.println("Failed to create connection to database");
		}
		
		return connection;
	}
		
	
	public static void main (String[] args)
	{
	
		/*
		 * Initialize connection variables.
		 */
		String host = "myserver4demo.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@myserver4demo";
		String password = "<server_admin_password>";
		
	
		/*
		 * Initialize connection object.
		 */
		Connection connection = connect(host, database, user, password);
		
		try
		{
			/*
			 * Delete some data from table.
			 */
			PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM inventory WHERE name = ?;");
			preparedStatement.setString(1, "orange");
			preparedStatement.executeUpdate();

			System.out.println("Deleted 1 row of data");

			/*
			 * NOTE No need to commit all changes to database, as auto-commit is enabled by default.
			 */
		}
		catch (SQLException ex) {
	    
		// handle any errors
	    System.out.println("SQLException: " + ex.getMessage());
	    System.out.println("SQLState: " + ex.getSQLState());
	    System.out.println("VendorError: " + ex.getErrorCode());
		}
	}
}
```

## Next steps
> [!div class="nextstepaction"]
> [Migrate your MySQL database to Azure Database for MySQL using dump and restore](concepts-migrate-dump-restore.md)