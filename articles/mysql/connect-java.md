---
title: 'Connect using Java - Azure Database for MySQL'
description: This quickstart provides a Java code sample you can use to connect and query data from an Azure Database for MySQL database.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.custom: mvc, devcenter, seo-java-july2019, seo-java-august2019
ms.topic: quickstart
ms.devlang: java
ms.date: 5/26/2020
---

# Quickstart: Use Java to connect to and query data in Azure Database for MySQL

In this quickstart, you connect to an Azure Database for MySQL by using a Java application and the JDBC driver MariaDB Connector/J. You then use SQL statements to query, insert, update, and delete data in the database from Mac, Ubuntu Linux, and Windows platforms. 

This topic assumes that you're familiar with developing using Java, but you're new to working with Azure Database for MySQL.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Database for MySQL server. [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) or [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md).
- Azure Database for MySQL connection security is configured with the firewall opened and SSL connection settings configured for your application.

> [!IMPORTANT] 
> Ensure the IP address you're connecting from has been added the server's firewall rules using the [Azure portal](./howto-manage-firewall-using-portal.md) or [Azure CLI](./howto-manage-firewall-using-cli.md)

## Obtain the MariaDB connector

Obtain the [MariaDB Connector/J](https://mariadb.com/kb/en/library/mariadb-connector-j/) connector using one of the following approaches:
   - Use the Maven package [mariadb-java-client](https://search.maven.org/search?q=a:mariadb-java-client) to include the [mariadb-java-client dependency](https://mvnrepository.com/artifact/org.mariadb.jdbc/mariadb-java-client) in the POM file for your project.
   - Download the JDBC driver [MariaDB Connector/J](https://downloads.mariadb.org/connector-java/) and include the JDBC jar file (for example mariadb-java-client-2.4.3.jar) into your application class path. Consult your environment's documentation for class path specifics, such as [Apache Tomcat](https://tomcat.apache.org/tomcat-7.0-doc/class-loader-howto.html) or [Java SE](https://docs.oracle.com/javase/7/docs/technotes/tools/windows/classpath.html)

## Get connection information

Get the connection information needed to connect to the Azure Database for MySQL. You need the fully qualified server name and login credentials.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. From the left-hand menu in Azure portal, select **All resources**, and then search for the server you have created (such as **mydemoserver**).
3. Select the server name.
4. From the server's **Overview** panel, make a note of the **Server name** and **Server admin login name**. If you forget your password, you can also reset the password from this panel.
 ![Azure Database for MySQL server name](./media/connect-java/azure-database-mysql-server-name.png)

## Connect, create table, and insert data

Use the following code to connect and load the data using the function with an **INSERT** SQL statement. The [getConnection()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#using-drivermanager) method is used to connect to MySQL. Methods [createStatement()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#creating-a-table-on-a-mariadb-or-mysql-server) and execute() are used to drop and create the table. The prepareStatement object is used to build the insert commands, with setString() and setInt() to bind the parameter values. Method executeUpdate() runs the command for each set of parameters to insert the values. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class CreateTableInsertRows {

	public static void main (String[] args)  throws Exception
	{
		// Initialize connection variables.	
		String host = "mydemoserver.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@mydemoserver";
		String password = "<server_admin_password>";

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:mariadb://%s/%s", host, database);

			// Set connection properties.
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");

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

Use the following code to read the data with a **SELECT** SQL statement. The [getConnection()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#using-drivermanager) method is used to connect to MySQL. Methods [createStatement()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#creating-a-table-on-a-mariadb-or-mysql-server) and executeQuery() are used to connect and run the select statement. The results are processed using a ResultSet object. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class ReadTable {

	public static void main (String[] args)  throws Exception
	{
		// Initialize connection variables.
		String host = "mydemoserver.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@mydemoserver";
		String password = "<server_admin_password>";

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:mariadb://%s/%s", host, database);

			// Set connection properties.
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
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

Use the following code to change the data with an **UPDATE** SQL statement. The [getConnection()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#using-drivermanager) method is used to connect to MySQL. The methods [prepareStatement()](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html) and executeUpdate() are used to prepare and run the update statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class UpdateTable {
	public static void main (String[] args)  throws Exception
	{
		// Initialize connection variables.	
		String host = "mydemoserver.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@mydemoserver";
		String password = "<server_admin_password>";

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:mariadb://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");

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

Use the following code to remove data with a **DELETE** SQL statement. The [getConnection()](https://mariadb.com/kb/en/library/about-mariadb-connector-j/#using-drivermanager) method is used to connect to MySQL.  The methods [prepareStatement()](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html) and executeUpdate() are used to prepare and run the delete statement. 

Replace the host, database, user, and password parameters with the values that you specified when you created your own server and database.

```java
import java.sql.*;
import java.util.Properties;

public class DeleteTable {
	public static void main (String[] args)  throws Exception
	{
		// Initialize connection variables.
		String host = "mydemoserver.mysql.database.azure.com";
		String database = "quickstartdb";
		String user = "myadmin@mydemoserver";
		String password = "<server_admin_password>";

		Connection connection = null;

		// Initialize connection object
		try
		{
			String url = String.format("jdbc:mariadb://%s/%s", host, database);
			
			// set up the connection properties
			Properties properties = new Properties();
			properties.setProperty("user", user);
			properties.setProperty("password", password);
			properties.setProperty("useSSL", "true");
			properties.setProperty("verifyServerCertificate", "true");
			properties.setProperty("requireSSL", "false");
			
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
> [Migrate your MySQL database to Azure Database for MySQL using dump and restore](concepts-migrate-dump-restore.md)
