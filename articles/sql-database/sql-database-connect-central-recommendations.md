<properties 
	pageTitle="Connect to SQL Database: Best Practices | Microsoft Azure" 
	description="A starting point topic that gathers together links and best practice recommendations for client programs that connect to Azure SQL Database from technologies such as ADO.NET and PHP." 
	services="sql-database" 
	documentationCenter="" 
	authors="annemill" 
	manager="jhubbard" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="01/07/2016" 
	ms.author="annemill"/>


# Connecting to SQL Database: Best Practices and Design Guidelines


This topic is a good place to get started with client connectivity to Azure SQL Database. It provides links to code samples for various technologies that you can use to connect to and interact with SQL Database. The technologies include Enterprise Library, JDBC, PHP, and several more. The information provided applies regardless of which specific technology you use to connect to SQL Database.


<a id="a-tech-independent-recommend" name="a-tech-independent-recommend"></a>

## Technology-independent recommendations


- [Guidelines for Connecting to Azure SQL Database Programmatically](http://msdn.microsoft.com/library/azure/ee336282.aspx) - discussions include the following:
 - [Ports and Firewalls](sql-database-configure-firewall-settings.md)
 - Connection strings
- [Azure SQL Database Resource Management](http://msdn.microsoft.com/library/azure/dn338083.aspx) - discussions include the following:
 - Resource governance
 - Enforcement of limits
 - Throttling


<a id="b-authentication-recommend" name="b-authentication-recommend"></a>

## Authentication recommendations


- Use Azure SQL Database authentication, not Windows authentication which is not available in Azure SQL Database.
- Specify a particular database, instead of defaulting to the *master* database.
 - You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database to switch to another database.


### Contained users


You have choices when adding a person as a user to your SQL Database:

- Add a *login* with a password to the **master** database, and then add a corresponding *user* to one or more other databases on the same server.

- Add a *contained user* with a password to one or more databases, and no link to any *login* in **master**.


The contained user approach has advantages and disadvantages:

- Advantage is that a database can easily be moved from one Azure SQL Database server to another, when all users in the database are contained users.

- Disadvantage is the greater difficulty in routine administration. For example:
 - It is more challenging to drop several contained users than it is to drop one login.
 - A person who is a contained user in several databases might have more passwords to remember or update.


Further information is given in - [Contained Database Users - Making Your Database Portable](http://msdn.microsoft.com/library/ff929188.aspx).


<a id="c-connection-recommend" name="c-connection-recommend"></a>

## Connection recommendations


- In your client connection logic, override the default timeout to be 30 seconds.
 - The default of 15 seconds is too short for connections that depend on the internet.


- On the computer that hosts your client program, ensure the firewall allows outgoing TCP communication on port 1433.


- If your client program connects to SQL Database V12 while your client runs on an Azure virtual machine (VM), you must open the port ranges 11000-11999 and 14000-14999 on the VM. Click [here](sql-database-develop-direct-route-ports-adonet-v12.md) for details.


- To handle *transient faults*, add [*retry* logic](#TransientFaultsAndRetryLogicGm) to your client programs that interact with Azure SQL Database.


### Connection pool


If you are using a [connection pool](http://msdn.microsoft.com/library/8xx3tyca.aspx), close the connection the instant your program is not actively using it, and is not preparing to reuse it.

Unless your program will reuse the connection for another operation immediately and without pause, we recommend the following pattern:

- Open a connection.
- Do one operation through the connection.
- Close the connection.


### Ports other than just 1433 in V12


Client connections to Azure SQL Database V12 sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important. For details see:<br/>
[Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md)


The next section has more to say about retry logic and transient fault handling.



<a name="TransientFaultsAndRetryLogicGm" id="TransientFaultsAndRetryLogicGm"></a>

&nbsp;

## Transient faults and retry logic


The Azure system has the ability to dynamically reconfigure servers when heavy workloads arise in the SQL Database service.

However, a reconfiguration might cause your client program to lose its connection to SQL Database. This error is called a *transient fault*.

If your client program has retry logic, it can try to reestablish a connection after giving the transient fault time to correct itself.

We recommend that you delay for 5 seconds before your first retry. Retrying after a delay shorter than 5 seconds risks overwhelming the cloud service. For each subsequent retry the delay should grow exponentially, up to a maximum of 60 seconds.

A discussion of the *blocking period* for clients that use ADO.NET is available in [SQL Server Connection Pooling (ADO.NET)](http://msdn.microsoft.com/library/8xx3tyca.aspx).


For code samples that illustrate retry logic, see:

- Code samples at: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)

### Error numbers for transient faults


When any error occurs with SQL Database, an [SqlException](http://msdn.microsoft.com/library/system.data.sqlclient.sqlexception.aspx) is thrown. The **SqlException** contains a numeric error code in its **Number** property. If the error code identifies a transient error, your program should retry the call.


- [Error messages for SQL Database client programs](sql-database-develop-error-messages.md#bkmk_connection_errors)
 - Its **Transient Errors, Connection-Loss Errors** section is a list of the transient errors that warrant an automatic retry.
 - For example, retry if the error number 40613 occurs, which says something similar to<br/>*Database 'mydatabase' on server 'theserver' is not currently available.*


For further information see:

- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)

<!--  (per Penny Lee, 2016/01/07.  MightyPen==GeneMi)
- [Troubleshoot connection problems to Azure SQL Database](http://support.microsoft.com/kb/2980233/)
-->


<a id="e-technologies" name="e-technologies"></a>

## Technologies


The following topics contains links to code samples for several languages and driver technologies that you can use to connect to Azure SQL Database from your client program.


Various code samples are given for clients that run on Windows, Linux, and Mac platforms.


**General samples:** There are code samples available for a variety of programming languages, including PHP, Python, Java, Node.js, and .NET CSharp. You can find links to the code samples at: 

- [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md)


**Elastic scale:** For information about connectivity to Elastic Scale databases, see:

- [Get Started with Azure SQL Database Elastic Scale Preview](sql-database-elastic-scale-get-started.md)
- [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)


