<properties 
	pageTitle="Connect to SQL Database by using Java with JDBC on Windows" 
	description="Presents a Java code sample you can use to connect to Azure SQL Database. The sample uses JDBC, and it runs on a Windows client computer."
	services="sql-database" 
	documentationCenter="" 
	authors="LuisBosquez" 
	manager="jeffreyg" 
	editor="genemi"/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="java" 
	ms.topic="article" 
	ms.date="06/25/2015" 
	ms.author="lbosq"/>


# Connect to SQL Database by using Java with JDBC on Windows


[AZURE.INCLUDE [sql-database-develop-includes-selector-language-platform-depth](../../includes/sql-database-develop-includes-selector-language-platform-depth.md)]


This topic presents a Java code sample that you can use to connect to Azure SQL Database. The Java sample relies on the Java Development Kit (JDK) version 1.8. The sample connects to an Azure SQL Database by using the JDBC driver.


## Requirements


- [Microsoft JDBC Driver for SQL Server - SQL JDBC 4](http://www.microsoft.com/download/details.aspx?displaylang=en&id=11774).
- Any operating system platform that runs [Java Development Kit 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).
- An existing database on SQL Azure. See the [Get Started topic](sql-database-get-started.md) to learn how to create a sample database and retrieve your connection string.


## Test environment


The Java code example in this topic assumes the following test table already exists in your Azure SQL Database database.


<!--
Could this instead be a #tempPerson table, so that the Java code sample could be fully self-sufficient and be runnable (with automatic cleanup)?
-->


	CREATE TABLE Person
	(
		id         INT    PRIMARY KEY    IDENTITY(1,1),
		firstName  VARCHAR(32),
		lastName   VARCHAR(32),
		age        INT
	);


## Connection string for your SQL Database


The code sample creates a `Connection` object by using a connection string. You can find the connection string by using the [Azure preview portal](http://portal.azure.com/). For details about finding the connection string, see [Create your first Azure SQL Database](sql-database-get-started.md).


## Java code sample


The section contains the bulk of the Java code sample. It has comments indicating where you would copy-and-paste the smaller Java segments that are presented in subsequent sections. The sample in this section could compile and run even without the copy-and-pastes near the comments, but it would only connect and then end. The comments you will find are the following:


1. `// INSERT two rows into the table.`
2. `// TRANSACTION and commit for an UPDATE.`
3. `// SELECT rows from the table.`


Here next is the bulk of the Java code sample. The sample includes the `main` function of the `SQLDatabaseTest` class.


	import java.sql.*;
	import com.microsoft.sqlserver.jdbc.*;
	
	public class SQLDatabaseTest {
	
		public static void main(String[] args) {
			String connectionString =
				"jdbc:sqlserver://your_server.database.windows.net:1433;" 
				+ "database=your_database;"
				+ "user=your_user@your_server;"
				+ "password={your_password};"
				+ "encrypt=true;"
				+ "trustServerCertificate=false;"
				+ "hostNameInCertificate=*.database.windows.net;"
				+ "loginTimeout=30;"; 
	
			// Declare the JDBC objects.
			Connection connection = null;
			Statement statement = null;
			ResultSet resultSet = null;
			PreparedStatement prepsInsertPerson = null;
			PreparedStatement prepsUpdateAge = null;
	
			try {
				connection = DriverManager.getConnection(connectionString);
	
				// INSERT two rows into the table.
				// ...
	
				// TRANSACTION and commit for an UPDATE.
				// ...
	
				// SELECT rows from the table.
				// ...
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			finally {
				// Close the connections after the data has been handled.
				if (prepsInsertPerson != null) try { prepsInsertPerson.close(); } catch(Exception e) {}
				if (prepsUpdateAge != null) try { prepsUpdateAge.close(); } catch(Exception e) {}
				if (resultSet != null) try { resultSet.close(); } catch(Exception e) {}
				if (statement != null) try { statement.close(); } catch(Exception e) {}
				if (connection != null) try { connection.close(); } catch(Exception e) {}
			}
		}
	}


Of course, to actually run the preceding Java code sample, you would have to put your real values into the connection string to replace the placeholders:


- your_server
- your_database
- your_user
- your_password


## INSERT two rows into the table


This Java segment issues a Transact-SQL INSERT statement to insert two rows into the Person table. The general sequence is as follows:


1. Generate a `PreparedStatement` object by using the `Connection` object.
 - We include the parameter `Statement.RETURN_GENERATED_KEYS` so that later we can obtain the value that was automatically generated for the **id** key value.
2. Call the `execute` method on the `PreparedStatement` object.
3. Obtain the numeric value that was automatically generated for the primary key, by using the `PreparedStatement` object.
 - This relates to the AUTO_INCREMENT specification on the **id** column in the Person table


Copy-and-paste this short Java segment into the primary code sample where you see the comment `// INSERT two rows into the table.`.


	// Create and execute an INSERT SQL prepared statement.
	String insertSql = "INSERT INTO Person (firstName, lastName, age) VALUES "
		+ "('Bill', 'Gates', 59), "
		+ "('Steve', 'Ballmer', 59);";
	
	prepsInsertPerson = connection.prepareStatement(
		insertSql,
		Statement.RETURN_GENERATED_KEYS);
	prepsInsertPerson.execute();
	// Retrieve the generated key from the insert.
	resultSet = prepsInsertPerson.getGeneratedKeys();
	// Iterate through the set of generated keys.
	while (resultSet.next()) {
		System.out.println("Generated: " + resultSet.getString(1));
	}


## TRANSACTION and commit for an UPDATE


The following segment of Java code issues a Transact-SQL UPDATE statement to increase the `age` value for every row in the person table. The general sequence is as follows:


1. The `setAutoCommit` method is called to prevent updates from being automatically committed in the database.
2. The `executeUpdate` method is called to execute the UPDATE in the context of transaction.
3. The `commit` method is called to explicitly commit the transaction.


Copy-and-paste this short Java segment into the primary code sample where you see the comment `// TRANSACTION and commit for an UPDATE.`.


	// Set AutoCommit value to false to execute a single transaction at a time.
	connection.setAutoCommit(false);
	
	// Write the SQL Update instruction and get the PreparedStatement object.
	String transactionSql = "UPDATE Person SET Person.age = Person.age + 1;";
	prepsUpdateAge = connection.prepareStatement(transactionSql);
	
	// Execute the statement.
	prepsUpdateAge.executeUpdate();
	
	//Commit the transaction.
	connection.commit();
	
	// Return the AutoCommit value to true.
	connection.setAutoCommit(true);


## SELECT rows from a table


This Java segment executes a Transact-SQL SELECT statement to see all the updated rows from the Person table. The general sequence is as follows:


1. Generate a `Statement` object by using the `Connection` object.
2. Generate a `ResultSet` object by using the `Statement` object.
3. Loop around a call to `resultSet.next` to iterate through all the returned rows.


Copy-and-paste this short Java segment into the primary code sample where you see the comment `// SELECT rows from a table.`.


	// Create and execute a SELECT SQL statement.
	String selectSql = "SELECT firstName, lastName, age FROM dbo.Person";
	statement = connection.createStatement();
	resultSet = statement.executeQuery(selectSql);
	
	// Iterate through the result set and print the attributes.
	while (resultSet.next()) {
		System.out.println(resultSet.getString(2) + " "
			+ resultSet.getString(3));
	}

 