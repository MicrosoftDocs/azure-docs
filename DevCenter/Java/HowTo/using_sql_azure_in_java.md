<properties linkid="dev-java-how-to-sql-azure" urldisplayname="SQL Azure Database" headerexpose="" pagetitle="SQL Azure Database - How To - Java - Develop" metakeywords="" footerexpose="" metadescription="The following steps show you how to use SQL Azure Database with Java." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Windows Azure SQL Database in Java

The following steps show you how to use Windows Azure SQL Database with Java. Command line examples are shown for simplicity, but highly similar steps would be appropriate for web applications, either hosted on-premise, within Windows Azure, or in other environments. This guide covered creating a server and creating a database from the [Windows Azure Management Portal](https://windows.azure.com). For information about performing these tasks from the production portal, see [Using SQL Azure with Java](http://msdn.microsoft.com/en-us/library/windowsazure/hh749029.aspx).

## What is Windows Azure SQL Database

Windows Azure SQL Database provides a relational database management system for the Windows Azure platform, and is based on SQL Server technology. With a SQL Database instance, you can easily provision and deploy relational database solutions to the cloud, and take advantage of a distributed data center that provides enterprise-class availability, scalability, and security with the benefits of built-in data protection and self-healing.

## Table of Contents

-   [Concepts][]
-   [Prerequisites][]
-   [Creating a Windows Azure SQL Server and Database][]
-   [Determining the SQL Azure connection string][]
-   [To allow access to a range of IP addresses][]
-   [To use Windows Azure SQL Database in Java][]
-   [Communicating with Windows Azure SQL Database from your code][]
-   [To create a table][]
-   [To create an index on a table][]
-   [To insert rows][]
-   [To retrieve rows][]
-   [To retrieve rows using a WHERE clause][]
-   [To retrieve a count of rows][]
-   [To update rows][]
-   [To delete rows][]
-   [To check whether a table exists][]
-   [To drop an index][]
-   [To drop a table][]
-   [Using SQL Azure in Java within a Windows Azure Deployment][]
-   [Next Steps][]

<h2 id="concepts">Concepts</h2>
Because Windows Azure SQL Database is built on SQL Server technologies, accessing SQL Azure Database from Java is very similar to accessing SQL Server from Java. You can develop an application locally (using SQL Server) and then connect to SQL Database by changing only the connection string. You can use a SQL Server JDBC driver for your application. However, there are some differences between SQL Database and SQL Server that could affect your application. For more information, see [Guidelines and Limitations (SQL Database)](http://msdn.microsoft.com/en-us/library/windowsazure/ff394102.aspx).

For additional resources for SQL Azure Database, see the [Next Steps][] section.

<h2 id="prerequisites">Prerequisites</h2>

The following are prerequisites if you intend to use SQL Azure with Java.

* A Java Developer Kit (JDK), v 1.6 or later.
* A Windows Azure subscription, which can be acquired from <http://www.microsoft.com/windowsazure/offers/>.
* If you are using Eclipse:

    * Eclipse IDE for Java EE Developers, Helios or later. This can be downloaded from <http://www.eclipse.org/downloads/>.

    * The Windows Azure Plugin for Eclipse with Java. During installation of this plugin, ensure that Microsoft SQL Server JDBC Driver 3.0 is included. For more information, see Installing the Windows Azure Plugin for Eclipse with Java.

* If you are not using Eclipse:

    * Microsoft SQL Server JDBC Driver 3.0, which you can download from <http://www.microsoft.com/download/en/details.aspx?id=19847>.

<h2 id="create_db">Creating a Windows Azure SQL Database</h2>

Before using Windows Azure SQL Database in Java code, you will need to create a Windows Azure SQL Database server.

1. Login to the [Windows Azure Preview Management Portal](https://manage.windowsazure.com).
2. Click **New**.

    ![Create new SQL database][create_new]

3. Click **SQL database**, and then click **Custom create**.

    ![Create custom SQL database][create_new_sql_db]

4. In the **Database settings** dialog, specify your database name. For purposes of this guide, use **gettingstarted** as the database name.
5. For **Server**, select **New SQL Database Server**. Use the default values for the other fields.

    ![SQL database settings][create_database_settings]

6. Click the next arrow.	
7. In the **Server settings** dialog, specify a SQL Server login name. For purposes of this guide, **MySQLAdmin** was used. Specify and confirm a password. Specify a region, and ensure that **Allow Windows Azure Services to access the server** is checked.

    ![SQL server settings][create_server_settings]

8. Click the completion button.

<h2 id="determine_connection_string">Determining the SQL Azure connection string</h2>

1. Login to the [Windows Azure Preview Management Portal](https://manage.windowsazure.com).
2. Click **SQL Databases**.
3. Click the database that you want to use.
4. Click **Show connection strings**.
5. Highlight the contents for the **JDBC** connection string.

    ![Determine JDBC connection string][get_jdbc_connection_string]

6. Right-click the highlighted contents of the **JDBC** connection string and click **Copy**.
7. You can now paste this value into your code file to create a connection string of the following form. Replace *your_server* (in two places) with the text you copied in the previous step, and replace *your_password* with the password value you specified when you created your SQL Azure account. (Also replace the values assigned to **database=** and **user=** if you did not use **gettingstarted** and **MySQLAdmin**, respectively.) 

	jdbc:sqlserver://*your_server*;database=gettingstarted;user=MySQLAdmin@*your_server*;password=*your_password*;encrypt=true;hostNameInCertificate=*.int.mscds.com;loginTimeout=30;

We'll actually use this string later in this guide, for now you know the steps to determine the connection string. Also, depending on your application needs, you may not need to use the **encrypt** and **hostNameInCertificate** settings, and you may need to modify the **loginTimeout** setting.

<h2 id="specify_allowed_ips">To allow access to a range of IP addresses</h2>
1. Login to the [Preview Management Portal](https://manage.windowsazure.com).
2. Click **SQL Databases**.
3. Click **Servers**.
4. Click the server that you want to use.
5. Click **Manage**.
6. Click **Configure**.
7. Under **Allowed IP addresses**, enter the name of a new IP rule. Specify the beginning and ending range of the IP addresses. For your convenience, the current client IP address is shown. The following example allows in a single client IP address (your IP address will be different).

    ![Allowed IP addresses dialog][allowed_ips_dialog]

8. Click the completion button. The IP addresses that you specify will now be allowed access to your database server.

<h2 id="use_sql_azure_in_java">To use Windows Azure SQL Database in Java</h2>

1. Create a Java project. For purposes of this tutorial, call it **HelloSQLAzure**.
2. Add a Java class file named **HelloSQLAzure.java** to the project.
3. Add the **Microsoft JDBC Driver for SQL Server** to your build path.
<p/>If you are using Eclipse
    1. Within Eclipse's Project Explorer, right-click the **HelloSQLAzure** project and click **Properties**.
    2. In the left-hand pane of the **Properties** dialog, click **Java Build Path**.
    3. Click the **Libraries** tab, and then click **Add Library**.
    4. In the **Add Library** dialog, select **Microsoft JDBC Driver 3.0 for SQL Server**, click **Next**, and then click **Finish**.
    5. Click **OK** to close the **Properties** dialog.

    <p/>If you are not using Eclipse
    1. Add the Microsoft JDBC Driver 3.0 for SQL Server JAR to your class path. For related information, see [Using the JDBC Driver](http://msdn.microsoft.com/en-us/library/ms378526.aspx).
4. Within your **HelloSQLAzure.java** code, add in `import` statements as shown in the following:

        import java.sql.*;
        import com.microsoft.sqlserver.jdbc.*;

5. Specify your connection string. Following is an example. As above, replace *your_server* (in two places), *your_user* and *your_password* with the values appropriate for your SQL Azure server.

        String connectionString =
        "jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
        "database=master" + ";" + 
        "user=your_user@your_server" + ";" +  
        "password=your_password";

You're now ready to add in code that will communicate with your SQL Azure server.

<h2 id="communicate_from_code">Communicating with Windows Azure SQL Database from your code</h2>

The remainder of this topic shows examples that do the following:

1. Connect to the SQL Azure server.
2. Define a SQL statement, for example, to create or drop a table, insert/select/delete rows, etc.
3. Execute the SQL statement, either through a call to **executeUpdate** or **executeQuery**.
4. Display query results, if appropriate.

The following sections are intended to be read (sampled) in order. The first snippet is a complete sample; the others would rely on part of the framework in the complete sample, such as the **import** statements, **class** and **main** declarations, error handling and resource closing.

<h2 id="to_create_table">To create a table</h2>

The following code shows you how to create a table named **Person**.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "CREATE TABLE Person (" + 
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
	

## <h2 id="to_create_index"></h2>To create an index on a table

The following code shows you how to create an index named **index1** on the **Person** table, using the **PersonID** column.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "CREATE CLUSTERED INDEX index1 " + 
	                       "ON Person (PersonID)";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...



<h2 id="to_insert_rows">To insert rows</h2>

The following code shows you how to add rows to the **Person** table.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "SET IDENTITY_INSERT Person ON " + 
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

 
<h2 id="to_retrieve_rows">To retrieve rows</h2>

The following code shows you how to retrieve rows from the **Person** table.

	// Connection string for your SQL Azure server.
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

 
<h2 id="to_retrieve_rows_using_where">To retrieve rows using a WHERE clause</h2>

To retrieve rows using a clause, use the code as shown above, except change the SQL statement to include a clause. The following SQL statement includes a clause for rows whose **FirstName** value equals **Jim**.

	// Define the SQL string.
	String sqlString = "SELECT * FROM Person WHERE FirstName='Jim'";
	
WHERE clauses can also be used when retrieving counts, updating rows, or deleting rows.

<h2 id="to_retrieve_row_count">To retrieve a count of rows</h2>

The following code shows you how to retrieve a count of rows from the **Person** table.
 
	// Connection string for your SQL Azure server.
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

<h2 id="to_update_rows">To update rows</h2>

The following code shows you how to update rows. In this example, the **LastName** value is changed to **Kim** for any rows where the **FirstName** value is **Jim**.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "UPDATE Person " + 
	                    "SET LastName = 'Kim' " + 
	                    "WHERE FirstName='Jim'";
	
	    // Use the connection to create the SQL statement.
	                statement = connection.createStatement();
	    
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}// Exception handling and resource closing not shown...

 
<h2 id="to_delete_rows">To delete rows</h2>

The following code shows you how to delete rows. In this example, any rows where the **FirstName** value is **Jim** are deleted.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "DELETE from Person " + 
	                     "WHERE FirstName='Jim'";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...
	
 
<h2 id="to_check_table_existence">To check whether a table exists</h2>

The following code shows you how to determine whether a table exists.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "IF EXISTS (SELECT 1 " +
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

<h2 id="to_drop_index">To drop an index</h2>

The following code shows you how to drop an index named **index1** on the **Person** table.

	// Connection string for your SQL Azure server.
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
	    String sqlString = "DROP INDEX index1 " + 
	                        "ON Person";
	
	    // Use the connection to create the SQL statement.
	    statement = connection.createStatement();
	
	    // Execute the statement.
	    statement.executeUpdate(sqlString);
	
	    // Provide a message when processing is complete.
	    System.out.println("Processing complete.");
	
	}
	// Exception handling and resource closing not shown...

 
<h2 id="to_drop_table">To drop a table</h2>

The following code shows you how to drop a table named **Person**.

	// Connection string for your SQL Azure server.
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

<h2 id="using_in_azure">Using SQL Azure in Java within a Windows Azure Deployment</h2>

To use SQL Azure in Java within a Windows Azure deployment, in addition to having Microsoft SQL Server JDBC Driver 3.0 as a library in your class path as shown above, you’ll need to package it with your deployment.


**Packaging the Microsoft SQL Server JDBC Driver 3.0 if you are using Eclipse**

1. Within Eclipse’s Project Explorer, right-click your project and click **Properties**.
2. In the left-hand pane of the **Properties** dialog, click **Deployment Assembly**, and then click **Add**.
3. In the **New Assembly Directive** dialog, click **Java Build Path Entries** and then click **Next**.
4. Select **Microsoft SQL Server JDBC Driver 3.0** and then click **Finish**.
5. Click **OK** to close the **Properties** dialog.
6. Export your project’s WAR file to your approot folder, and rebuild your Azure project, per the steps documented at [Creating a Hello World Application Using the Windows Azure Plugin for Eclipse with Java](http://msdn.microsoft.com/en-us/library/windowsazure/hh690944.aspx). That topic also describes how to run your application in the compute emulator, and in Windows Azure.

**Packaging the Microsoft SQL Server JDBC Driver 3.0 if you are not using Eclipse**

* Ensure the Microsoft SQL Server JDBC Driver 3.0 library is included within the same Azure role as your Java application, and added to the class path of your application.

<h2 id="nextsteps">Next Steps</h2>

To learn more about Microsoft JDBC Driver for SQL Server, see [Overview of the JDBC Driver](http://msdn.microsoft.com/en-us/library/ms378749.aspx). To learn more about SQL Azure, see [SQL Azure Overview](http://msdn.microsoft.com/en-us/library/windowsazure/ee336241.aspx).

[Concepts]:#concepts
[Prerequisites]:#prerequisites
[Creating a Windows Azure SQL Server and Database]:#create_db
[Determining the SQL Azure connection string]:#determine_connection_string
[To allow access to a range of IP addresses]:#specify_allowed_ips
[To use Windows Azure SQL Database in Java]:#use_sql_azure_in_java
[Communicating with Windows Azure SQL Database from your code]:#communicate_from_code
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
[Using SQL Azure in Java within a Windows Azure Deployment]:#using_in_azure
[Next Steps]:#nextsteps
[create_new]: ../media/WA_New.png
[create_new_sql_db]: ../media/WA_SQL_DB_Create.png
[create_database_settings]: ../media/WA_CustomCreate_1.png
[create_server_settings]: ../media/WA_CustomCreate_2.png
[get_jdbc_connection_string]: ../media/WA_SQL_JDBC_ConnectionString.png
[allowed_ips_dialog]: ../media/WA_Allowed_IPs.png
