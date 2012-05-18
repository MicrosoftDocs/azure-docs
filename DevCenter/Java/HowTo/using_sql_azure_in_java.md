<properties linkid="dev-java-how-to-sql-azure" urldisplayname="SQL Azure Database" headerexpose="" pagetitle="SQL Azure Database - How To - Java - Develop" metakeywords="" footerexpose="" metadescription="The following steps show you how to use SQL Azure Database within Java." umbraconavihide="0" disquscomments="1"></properties>

# How to Use Windows Azure SQL Database in Java

The following steps show you how to use Windows Azure SQL Database. Command line examples are shown for simplicity, but highly similar steps would be appropriate for web applications, either hosted on-premise, within Windows Azure, or in other environments.

## Prerequisites

The following are prerequisites if you intend to use SQL Azure with Java.

* A Java Developer Kit (JDK), v 1.6 or later.
* A Windows Azure subscription, which can be acquired from <http://www.microsoft.com/windowsazure/offers/>.
* If you are using Eclipse:

    * Eclipse IDE for Java EE Developers, Helios or later. This can be downloaded from <http://www.eclipse.org/downloads/>.

    * The Windows Azure Plugin for Eclipse with Java. During installation of this plugin, ensure that Microsoft SQL Server JDBC Driver 3.0 is included. For more information, see Installing the Windows Azure Plugin for Eclipse with Java.

* If you are not using Eclipse:

    * Microsoft SQL Server JDBC Driver 3.0, which you can download from <http://www.microsoft.com/download/en/details.aspx?id=19847>.

## Creating a Windows Azure SQL Database

Before using Windows Azure SQL Database in Java code, you will need to create a Windows Azure SQL Database server.

1. Sign in at the [Windows Azure Management Portal](https://windows.azure.com).
2. Click **New Database Server**.
3. Click **Create a New SQL Azure** server.
4. In the **Create Server** dialog, select the subscription for which the SQL Azure charges will be billed, and click **Next**.
5. Select the region where the SQL Azure server will be hosted and click **Next**.
6. Specify the login ID and password for the SQL Azure account. Confirm the password and click **Next**.<p/>Make a note of the login ID and the password, you will need them when you create your connection string later in this topic.
7. If you intend to use your SQL Azure server with other Windows Azure services, check **Allow other Windows Azure services to access this server**. If you only want to access your SQL Server through non-Windows Azure services, you can leave this option unchecked.
8. Click **Add** to add a new firewall rule.
9. In the **Add Firewall Rule** dialog, enter a name for the fire wall rule, and specify the IP range start and IP range end values for the rule. To help you determine the IP range, the current IP address is displayed in the **Add Firewall Rule** dialog. Click **OK** when you have specified the values for your firewall rule.
10. Click **Finish** to close the **Create Server** dialog, and the SQL Azure server will be created.

## Determining the SQL Azure connection string

1. Within the Windows Azure Management Portal, in the left-hand pane, click Database.
2. Under Subscriptions, expand the subscription that owns the SQL Azure server.
3. Click the SQL Azure server that you want to use.
4. In the Properties pane, select the text for the Name field, right-click the text, and choose Copy.
5. Use the value to create a connection string of the following form. Replace your_server (in two places) with the text you copied in the previous step, and replace your_user and your_password with the login ID and password values you specified when you created your SQL Azure account.

        "jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
        "database=master" + ";" + 
        "user=your_user@your_server" + ";" +  
        "password=your_password";

## To Use Windows Azure SQL Database in Java

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

5. Specify your connection string. Following is an example. As above, replace *your\_server* (in two places), *your\_user* and *your\_password* with the values appropriate for your SQL Azure server.

        String connectionString =
        "jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
        "database=master" + ";" + 
        "user=your_user@your_server" + ";" +  
        "password=your_password";

You're now ready to add in code that will communicate with your SQL Azure server.

## Communicating with Windows Azure SQL Database from your code

The remainder of this topic shows examples that do the following:

1. Connect to the SQL Azure server.
2. Define a SQL statement, for example, to create or drop a database, create or drop a table, insert/select/delete rows, etc.
3. Execute the SQL statement, either through a call to executeUpdate or executeQuery.
4. Display query results, if appropriate.

The following sections are intended to be read (sampled) in order. The first snippet is a complete sample; the others would rely on part of the framework in the complete sample, such as the import statements, class and main declaration, error handling and resource closing.

## To create a database
The following code shows you how to create a database. For purposes of this example, the name of the database is **gettingstarted**. Modify the placeholders to use your values. Note that this code example uses the **master** database in the connection string, since we need to use the **master** database to create another database.

	import java.sql.*;
	import com.microsoft.sqlserver.jdbc.*;
	
	public class HelloSQLAzure {
	
	    public static void main(String[] args) 
	    {
	       
	        // Connection string for your SQL Azure server.
	        // Change the values assigned to your_server, 
	        // your_user@your_server,
	        // and your_password.
	        String connectionString = 
	        "jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
	        "database=master" + ";" + 
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
	            String sqlString = "CREATE DATABASE gettingstarted";
	
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

<div class="dev-callout"> 
<b>Note</b> 
<p>Most of the remaining steps in this tutorial use the <b>gettingstarted</b> database, which is reflected in the database value used in the connection string. Additionally, to keep the snippets brief, the exception handling and closing of resources is not shown; use the exception handling and closing of resources shown above to make the snippets complete.</p> 
</div>

## To create a table
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
	// Exception handling and resource closing not shown...
	

## To create an index on a table

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



## To insert rows

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

 
## To retrieve rows


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

 
## To retrieve rows using a WHERE clause

To retrieve rows using a clause, use the code as shown above, except change the SQL statement to include a clause. The following SQL statement includes a clause for rows whose **FirstName** value equals **Jim**.

	// Define the SQL string.
	String sqlString = "SELECT * FROM Person WHERE FirstName='Jim'";
	
WHERE clauses can also be used when retrieving counts, updating rows, or deleting rows.

## To retrieve a count of rows

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

## To update rows

The following code shows you how to update rows. In this example, the LastName value is changed to Kim for any rows where the FirstName value is Jim.

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

 
## To delete rows

The following code shows you how to delete rows. In this example, any rows where the FirstName value is Jim are deleted.

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
	
 
## To check whether a table exists

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

## To drop an index

The following code shows you how to drop an index named index1 on the Person table.

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

 
## To drop a table

The following code shows you how to drop a table named Person.

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

 
## To drop a database

The following code shows you how to drop the database named gettingstarted. Note that this code example uses the master database, since we need to use the master database to drop the gettingstarted database.
 
	// Connection string for your SQL Azure server.
	// Change the values assigned to your_server, 
	// your_user@your_server,
	// and your_password.
	String connectionString = 
	"jdbc:sqlserver://your_server.database.windows.net:1433" + ";" +  
	"database=master" + ";" + 
	"user=your_user@your_server" + ";" +  
	"password=your_password";
	
	// The types for the following variables are
	// defined in the java.sql library.
	Connection connection = null;  // For making the connection
	Statement statement = null;    // For the SQL statement 
	ResultSet resultSet = null;    // For the result set, if applicable 
	
	try
	{
	    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	    
	    connection = DriverManager.getConnection(connectionString);
	
	    String sqlString = "DROP DATABASE gettingstarted";
	    statement = connection.createStatement();
	    statement.executeUpdate(sqlString);
	    System.out.println("Processing complete.");
	   
	}
	// Exception handling and resource closing not shown...

## Using SQL Azure in Java within a Windows Azure Deployment

To use SQL Azure in Java within a Windows Azure deployment, in addition to having Microsoft SQL Server JDBC Driver 3.0 as a library in your class path as shown above, you’ll need to package it with your deployment.


**Packaging the Microsoft SQL Server JDBC Driver 3.0 if you are using Eclipse**

1. Within Eclipse’s Project Explorer, right-click your project and click Properties.
2. In the left-hand pane of the Properties dialog, click Deployment Assembly, and then click Add.
3. In the New Assembly Directive dialog, click Java Build Path Entries and then click Next.
4. Select Microsoft SQL Server JDBC Driver 3.0 and then click Finish.
5. Click OK to close the Properties dialog.
6. Export your project’s WAR file to your approot folder, and rebuild your Azure project, per the steps documented at Creating a Hello World Application Using the Windows Azure Plugin for Eclipse with Java. That topic also describes how to run your application in the compute emulator, and in Windows Azure.

**Packaging the Microsoft SQL Server JDBC Driver 3.0 if you are not using Eclipse**

* Ensure the Microsoft SQL Server JDBC Driver 3.0 library is included within the same Azure role as your Java application, and added to the class path of your application.

## Additional resources

For more information about Microsoft JDBC Driver for SQL Server, see [Overview of the JDBC Driver](http://msdn.microsoft.com/en-us/library/ms378749.aspx). For more information about SQL Azure, see [SQL Azure Overview](http://msdn.microsoft.com/en-us/library/windowsazure/ee336241.aspx).


