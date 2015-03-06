<properties 
	pageTitle="How to use SQL Azure (Java) - Azure feature guide" 
	description="Learn how to use the Azure SQL Database from Java code." 
	services="sql-database" 
	documentationCenter="java" 
	authors="rmcmurray" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="robmcm"/>

# How to Use Azure SQL Database in Java

The following steps show you how to use Azure SQL Database with Java. Command line examples are shown for simplicity, but highly similar steps would be appropriate for web applications, either hosted on-premise, within Azure, or in other environments. This guide covers creating a server and creating a database from the [Azure Management Portal](https://windows.azure.com).

## What is Azure SQL Database

Azure SQL Database provides a relational database management system for Azure, and is based on SQL Server technology. With a SQL Database instance, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.



## Concepts
Because Azure SQL Database is built on SQL Server technologies, accessing SQL Database from Java is very similar to accessing SQL Server from Java. You can develop an application locally (using SQL Server) and then connect to SQL Database by changing only the connection string. You can use a SQL Server JDBC driver for your application. However, there are some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)](http://msdn.microsoft.com/library/windowsazure/ff394102.aspx).

For additional resources for SQL Database, see the [Next steps][] section.

## Prerequisites

The following are prerequisites if you intend to use SQL Database with Java.

* A Java Developer Kit (JDK), v 1.6 or later.
* An Azure subscription, which can be acquired from <http://www.microsoft.com/windowsazure/offers/>.
* If you are using Eclipse, you'll need Eclipse IDE for Java EE Developers, Indigo or later. This can be downloaded from <http://www.eclipse.org/downloads/>. You will also need the Azure Plugin for Eclipse with Java (by Microsoft Open Technologies). During installation of this plugin, ensure that Microsoft JDBC Driver 4.0 for SQL Server is included. For more information, see [Installing the Azure Plugin for Eclipse with Java (by Microsoft Open Technologies)](http://msdn.microsoft.com/library/windowsazure/hh690946.aspx).
* If you are not using Eclipse, you will need the Microsoft JDBC Driver 4.0 for SQL Server, which you can download from <http://www.microsoft.com/download/details.aspx?id=11774>.

## Creating an Azure SQL Database

Before using Azure SQL Database in Java code, you will need to create an Azure SQL Database server.

1. Login to the [Azure Management Portal](https://manage.windowsazure.com).
2. Click **New**.

    ![Create new SQL database][create_new]

3. Click **SQL database**, and then click **Custom create**.

    ![Create custom SQL database][create_new_sql_db]

4. In the **Database settings** dialog, specify your database name. For purposes of this guide, use **gettingstarted** as the database name.
5. For **Server**, select **New SQL Database Server**. Use the default values for the other fields.

    ![SQL database settings][create_database_settings]

6. Click the next arrow.	
7. In the **Server settings** dialog, specify a SQL Server login name. For purposes of this guide, **MySQLAdmin** was used. Specify and confirm a password. Specify a region, and ensure that **Allow Azure Services to access the server** is checked.

    ![SQL server settings][create_server_settings]

8. Click the completion button.

## Determining the SQL Database connection string

1. Login to the [Azure Management Portal](https://manage.windowsazure.com).
2. Click **SQL Databases**.
3. Click the database that you want to use.
4. Click **Show connection strings**.
5. Highlight the contents for the **JDBC** connection string.

    ![Determine JDBC connection string][get_jdbc_connection_string]

6. Right-click the highlighted contents of the **JDBC** connection string and click **Copy**.
7. You can now paste this value into your code file to create a connection string of the following form. Replace *your_server* (in two places) with the text you copied in the previous step, and replace *your_password* with the password value you specified when you created your SQL Database account. (Also replace the values assigned to **database=** and **user=** if you did not use **gettingstarted** and **MySQLAdmin**, respectively.) 

    String connectionString =
		"jdbc:sqlserver://*your_server*.database.windows.net:1433" + ";" +  
    	"database=gettingstarted" + ";" + 
    	"user=MySQLAdmin@*your_server*" + ";" +  
    	"password=*your_password*" + ";" +  
        "encrypt=true" + ";" +
        "hostNameInCertificate=*.int.mscds.com" + ";" +  
        "loginTimeout=30";

We'll actually use this string later in this guide, for now you know the steps to determine the connection string. Also, depending on your application needs, you may not need to use the **encrypt** and **hostNameInCertificate** settings, and you may need to modify the **loginTimeout** setting.

## To allow access to a range of IP addresses

1. Login to the [Management Portal](https://manage.windowsazure.com).
2. Click **SQL Databases**.
3. Click **Servers**.
4. Click the server that you want to use.
5. Click **Manage**.
6. Click **Configure**.
7. Under **Allowed IP addresses**, enter the name of a new IP rule. Specify the beginning and ending range of the IP addresses. For your convenience, the current client IP address is shown. The following example allows in a single client IP address (your IP address will be different).

    ![Allowed IP addresses dialog][allowed_ips_dialog]

8. Click the completion button. The IP addresses that you specify will now be allowed access to your database server.

## To use Azure SQL Database in Java

1. Create a Java project. For purposes of this tutorial, call it **HelloSQLAzure**.
2. Add a Java class file named **HelloSQLAzure.java** to the project.
3. Add the **Microsoft JDBC Driver for SQL Server** to your build path.

   If you are using Eclipse:

    1. Within Eclipse's Project Explorer, right-click the **HelloSQLAzure** project and click **Properties**.
    2. In the left-hand pane of the **Properties** dialog, click **Java Build Path**.
    3. Click the **Libraries** tab, and then click **Add Library**.
    4. In the **Add Library** dialog, select **Microsoft JDBC Driver 4.0 for SQL Server**, click **Next**, and then click **Finish**.
    5. Click **OK** to close the **Properties** dialog.

    If you are not using Eclipse, add the Microsoft JDBC Driver 4.0 for SQL Server JAR to your class path. For related information, see [Using the JDBC Driver](http://msdn.microsoft.com/library/ms378526.aspx).

4. Within your **HelloSQLAzure.java** code, add in `import` statements as shown in the following:

        import java.sql.*;
        import com.microsoft.sqlserver.jdbc.*;

5. Specify your connection string. Following is an example. As above, replace *your_server* (in two places), *your_user* and *your_password* with the values appropriate for your SQL Database server.

        String connectionString =
        	"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
        		"database=master" + ";" + 
        		"user=your_user@your_server" + ";" +  
        		"password=your_password";

You're now ready to add in code that will communicate with your SQL Database server.

## Communicating with Azure SQL Database from your code

The remainder of this topic shows examples that do the following:

1. Connect to the SQL Database server.
2. Define a SQL statement, for example, to create or drop a table, insert/select/delete rows, etc.
3. Execute the SQL statement, either through a call to **executeUpdate** or **executeQuery**.
4. Display query results, if appropriate.

The following sections are intended to be read (sampled) in order. The first snippet is a complete sample; the others would rely on part of the framework in the complete sample, such as the **import** statements, **class** and **main** declarations, error handling and resource closing.

## To create a table

The following code shows you how to create a table named **Person**.

	import java.sql.*;
	import com.microsoft.sqlserver.jdbc.*;
	
	public class HelloSQLAzure {
	
	    public static void main(String[] args) 
	    {
	
			// Connection string for your SQL Database server.
			// Change the values assigned to your_server, 
			// your_user@your_server,
			// and your_password.
			String connectionString = 
				"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
					"database=gettingstarted" + ";" + 
					"user=your_user@your_server" + ";" +  
					"password=your_password";
			
			// The types for the following variables are
			// defined in the java.sql library.
			Connection connection = null;  // For making the connection
			Statement statement = null;    // For the SQL statement
			ResultSet resultSet = null;    // For the result set, if applicable
			
			try
			{
			    // Ensure the SQL Server driver class is available.
			    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			
			    // Establish the connection.
			    connection = DriverManager.getConnection(connectionString);
			
			    // Define the SQL string.
			    String sqlString = 
					"CREATE TABLE Person (" + 
			        	"[PersonID] [int] IDENTITY(1,1) NOT NULL," +
			            "[LastName] [nvarchar](50) NOT NULL," + 
			            "[FirstName] [nvarchar](50) NOT NULL)";
			
			    // Use the connection to create the SQL statement.
			    statement = connection.createStatement();
			
			    // Execute the statement.
			    statement.executeUpdate(sqlString);
			
			    // Provide a message when processing is complete.
			    System.out.println("Processing complete.");
			
			}
			// Exception handling
	        catch (ClassNotFoundException cnfe)  
	        {
	            
	            System.out.println("ClassNotFoundException " +
	                               cnfe.getMessage());
	        }
	        catch (Exception e)
	        {
	            System.out.println("Exception " + e.getMessage());
	            e.printStackTrace();
	        }
	        finally
	        {
	            try
	            {
	                // Close resources.
	                if (null != connection) connection.close();
	                if (null != statement) statement.close();
	                if (null != resultSet) resultSet.close();
	            }
	            catch (SQLException sqlException)
	            {
	                // No additional action if close() statements fail.
	            }
	        }
	        
	    }
	
	}
	

## To create an index on a table

The following code shows you how to create an index named **index1** on the **Person** table, using the **PersonID** column.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"CREATE CLUSTERED INDEX index1 " + "ON Person (PersonID)";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...



## To insert rows

The following code shows you how to add rows to the **Person** table.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"SET IDENTITY_INSERT Person ON " + 
	        	"INSERT INTO Person " + 
	            "(PersonID, LastName, FirstName) " + 
	            "VALUES(1, 'Abercrombie', 'Kim')," + 
	            	  "(2, 'Goeschl', 'Gerhard')," + 
	                  "(3, 'Grachev', 'Nikolay')," + 
	                  "(4, 'Yee', 'Tai')," + 
	                  "(5, 'Wilson', 'Jim')";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

 
## To retrieve rows

The following code shows you how to retrieve rows from the **Person** table.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = "SELECT TOP 10 * FROM Person";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    resultSet = statement.executeQuery(sqlString);
	
	    // Loop through the results
	    while (resultSet.next())
	    {
	        // Print out the row data
	        System.out.println(
	        	"Person with ID " + 
	        	resultSet.getString("PersonID") + 
	        	" has name " +
	        	resultSet.getString("FirstName") + " " +
	       		resultSet.getString("LastName"));
	        }
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

 The code above selected the top 10 rows from the **Person** table. If you want to return all rows, modify the SQL statement to the following:

	String sqlString = "SELECT * FROM Person";

 
## To retrieve rows using a WHERE clause

To retrieve rows using a clause, use the code as shown above, except change the SQL statement to include a clause. The following SQL statement includes a clause for rows whose **FirstName** value equals **Jim**.

	// Define the SQL string.
	String sqlString = "SELECT * FROM Person WHERE FirstName='Jim'";
	
WHERE clauses can also be used when retrieving counts, updating rows, or deleting rows.

<h2><a id="to_retrieve_row_count"></a>To retrieve a count of rows</h2>

The following code shows you how to retrieve a count of rows from the **Person** table.
 
	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	// Define the SQL string.
	    String sqlString = "SELECT COUNT (PersonID) FROM Person";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    resultSet = statement.executeQuery(sqlString);
	
	    // Print out the returned number of rows.
	    while (resultSet.next())
	    {
	        System.out.println("There were " + 
	                         resultSet.getInt(1) +
	                         " rows returned.");
	    }
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

## To update rows

The following code shows you how to update rows. In this example, the **LastName** value is changed to **Kim** for any rows where the **FirstName** value is **Jim**.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"UPDATE Person " + "SET LastName = 'Kim' " + "WHERE FirstName='Jim'";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	    
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}// Exception handling and resource closing not shown...

 

## To delete rows

The following code shows you how to delete rows. In this example, any rows where the **FirstName** value is **Jim** are deleted.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"DELETE from Person " + 
				"WHERE FirstName='Jim'";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...
	
 
## To check whether a table exists

The following code shows you how to determine whether a table exists.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"IF EXISTS (SELECT 1 " +
	        	"FROM sysobjects " + 
	            "WHERE xtype='u' AND name='Person') " +
	            "SELECT 'Person table exists.'" +
	            "ELSE  " +
	            "SELECT 'Person table does not exist.'";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    resultSet = statement.executeQuery(sqlString);
	
	    // Display the result.
	    while (resultSet.next())
	    {
	        System.out.println(resultSet.getString(1));
	    }
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

## To drop an index

The following code shows you how to drop an index named **index1** on the **Person** table.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +
			"database=gettingstarted" + ";" +
			"user=your_user@your_server" + ";" +
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = 
			"DROP INDEX index1 " + 
	        	"ON Person";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

 
## To drop a table

The following code shows you how to drop a table named **Person**.

	// Connection string for your SQL Database server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
		"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
			"database=gettingstarted" + ";" + 
			"user=your_user@your_server" + ";" +  
			"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement
	ResultSet resultSet = null;    // For the result set, if applicable
	
	try
	{
	    // Ensure the SQL Server driver class is available.
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	
	    // Establish the connection.
	    connection = DriverManager.getConnection(connectionString);
	
	    // Define the SQL string.
	    String sqlString = "DROP TABLE Person";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

## Using SQL Database in Java within an Azure Deployment

To use SQL Database in Java within an Azure deployment, in addition to having Microsoft JDBC Driver 4.0 for SQL Server as a library in your class path as shown above, you'll need to package it with your deployment.


**Packaging the Microsoft JDBC Driver 4.0 SQL Server if you are using Eclipse**

1. Within Eclipse's Project Explorer, right-click your project and click **Properties**.
2. In the left-hand pane of the **Properties** dialog, click **Deployment Assembly**, and then click **Add**.
3. In the **New Assembly Directive** dialog, click **Java Build Path Entries** and then click **Next**.
4. Select **Microsoft JDBC Driver 4.0 SQL Server** and then click **Finish**.
5. Click **OK** to close the **Properties** dialog.
6. Export your project's WAR file to your approot folder, and rebuild your Azure project, per the steps documented at [Creating a Hello World Application Using the Azure Plugin for Eclipse with Java (by Microsoft Open Technologies)](http://msdn.microsoft.com/library/windowsazure/hh690944.aspx). That topic also describes how to run your application in the compute emulator, and in Azure.

**Packaging the Microsoft JDBC Driver 4.0 SQL Server if you are not using Eclipse**

* Ensure the Microsoft JDBC Driver 4.0 SQL Server library is included within the same Azure role as your Java application, and added to the class path of your application.

## Next steps

To learn more about Microsoft JDBC Driver for SQL Server, see [Overview of the JDBC Driver](http://msdn.microsoft.com/library/ms378749.aspx). To learn more about SQL Database, see [SQL Database Overview](http://msdn.microsoft.com/library/windowsazure/ee336241.aspx).

[Concepts]:#concepts
[Prerequisites]:#prerequisites
[Creating an Azure SQL Database]:#create_db
[Determining the SQL Database connection string]:#determine_connection_string
[To allow access to a range of IP addresses]:#specify_allowed_ips
[To use Azure SQL Database in Java]:#use_sql_azure_in_java
[Communicating with Azure SQL Database from your code]:#communicate_from_code
[To create a table]:#to_create_table
[To create an index on a table]:#to_create_index
[To insert rows]:#to_insert_rows
[To retrieve rows]:#to_retrieve_rows
[To retrieve rows using a WHERE clause]:#to_retrieve_rows_using_where
[To retrieve a count of rows]:#to_retrieve_row_count
[To update rows]:#to_update_rows
[To delete rows]:#to_delete_rows
[To check whether a table exists]:#to_check_table_existence
[To drop an index]:#to_drop_index
[To drop a table]:#to_drop_table
[Using SQL Database in Java within an Azure Deployment]:#using_in_azure
[Next steps]:#nextsteps
[create_new]: ./media/sql-data-java-how-to-use-sql-database/WA_New.png
[create_new_sql_db]: ./media/sql-data-java-how-to-use-sql-database/WA_SQL_DB_Create.png
[create_database_settings]: ./media/sql-data-java-how-to-use-sql-database/WA_CustomCreate_1.png
[create_server_settings]: ./media/sql-data-java-how-to-use-sql-database/WA_CustomCreate_2.png
[get_jdbc_connection_string]: ./media/sql-data-java-how-to-use-sql-database/WA_SQL_JDBC_ConnectionString.png
[allowed_ips_dialog]: ./media/sql-data-java-how-to-use-sql-database/WA_Allowed_IPs.png
