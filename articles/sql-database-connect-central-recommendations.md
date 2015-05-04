<properties 
	pageTitle="Connecting to SQL Database: Links, Best Practices and Design Guidelines" 
	description="A starting point topic that gathers together links and recommendations for client programs that connect to Azure SQL Database from technologies such as ADO.NET and PHP." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/01/2015" 
	ms.author="genemi"/>


# Connecting to SQL Database: Links, Best Practices and Design Guidelines


This topic is a good place to get started with client connectivity to Azure SQL Database. It provides links to code samples for various technologies that you can use to connect to and interact with SQL Database. The technologies include Enterprise Library, JDBC, PHP, and several more. Recommendations are given that apply generally regardless of the specific connection technology or programming language.


## Technology-independent recommendations


The information in this section applies regardless of which specific technology you use to connect to SQL Database.


- [Guidelines for Connecting to Azure SQL Database Programmatically](http://msdn.microsoft.com/library/azure/ee336282.aspx) - discussions include the following:
 - Ports
 - Firewalls
 - Connection strings
- [Azure SQL Database Resource Management](https://msdn.microsoft.com/library/azure/dn338083.aspx) - discussions include the following:
 - Resource governance
 - Enforcement of limits
 - Throttling


Regardless of which connection technology you use, certain firewall settings for SQL Database server, and even individual databases, matter:


- [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx)


## Recommendations: Connection


- In your client connection logic, override the default timeout to be 30 seconds.
 - The default of 15 seconds is too short for connections that depend on the internet.
- If you are using a [connection pool](http://msdn.microsoft.com/library/8xx3tyca.aspx), close the connection the instant your program is not actively using it, and is not just preparing to reuse it.
 - Unless your program will reuse the connection for another operation immediately, without pause, we recommend the following pattern:
<br/><br/>Open a connection.
<br/>Do one operation through the connection.
<br/>Close the connection.<br/><br/>
- Use retry logic with your connection logic, but only for transient errors. When using SQL Database, your attempts to open a connection or issue a query can fail for various reasons.
 - One persistent reason for failure could be that your connection string is malformed.
 - One transient reason for failure could be that the Azure SQL Database system needs to balance the overall load. The transient reason goes away by itself, which means your program should retry.
 - When retrying a query, first close the connection, and then open another connection.
- Ensure that your [Azure SQL Database firewall](http://msdn.microsoft.com/library/ee621782.aspx) allows outgoing TCP communication on port 1433.
 - You can configure the [firewall](http://msdn.microsoft.com/library/azure/ee621782.aspx) settings on an SQL Database server or to an individual database.


## Recommendation: Authentication


- Use SQL Database authentication, not Windows authentication.
- Specify a particular database, instead of defaulting to the *master* database.
- Sometimes the user name must be given with the suffix of *@yourservername*, but other times the suffix must be omitted. It depends on how your tool or API was written.
 - Check the details on each individual technology.
- Connect by specifying a user in a [contained database](http://msdn.microsoft.com/library/ff929071.aspx).
 - This approach provides better performance and scalability by avoiding the need for a login in the master database.
 - You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database.


## Transient errors


Cloud services such as Azure and its SQL Database service have the endless challenge of balancing workloads and managing resources. If two databases that are being served from the same computer are involved in exceptionally heavy processing at overlapping times, the management system might detect the necessary of shifting the workload of one database to another resource which has excess capacity.


During the shift, the database might be temporarily unavailable. This might block new connections, or it might cause your client program to lose its connection. But the resource shift is transient, and it might resolve itself in a couple of minutes or in several seconds. After the shift is completed, your client program can reestablish its connection and resume its work. The pause in processing is better than an avoidable failure of your client program.


When any error occurs with SQL Database, an [SqlException](https://msdn.microsoft.com/library/system.data.sqlclient.sqlexception.aspx) is thrown. The SqlException contains a numeric error code in its **Number** property. If the error code identifies a transient error, your program should retry the call.


- [Error Messages (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff394106.aspx) - its **Connection-Loss Errors** section is a list of the transient errors that warrant an automatic retry.
 - For example, retry if the error number 40613 occurs, which says something similar to<br/>*Database 'mydatabase' on server 'theserver' is not currently available.*


Transient *errors* are sometimes called transient *faults*. This topic considers these two terms to be synonyms.


For further assistance when you encounter a connection error, whether transient or not, see:


- [Troubleshoot connection problems to Azure SQL Database](http://support.microsoft.com/kb/2980233/)


## Technologies


The following topics contains links to code samples for several languages and driver technologies that you can use to connect to Azure SQL Database from your client program.


Various code samples are given for clients that run on both Windows and Linux.


**General samples:** There are code samples for a variety of programming languages, including PHP, Python, Node.js, and .NET CSharp. Also, samples are given for clients that run on Windows or Linux.


- [Client development and quick start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)
- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)


**Retry logic:** There are code samples designed with the sophistication necessary to handle transient errors with automatic retry logic.


- [How to: Reliably connect to Azure SQL Database](http://msdn.microsoft.com/library/azure/dn864744.aspx)
- [How to: Connect to Azure SQL Database by using ADO.NET with Enterprise Library](http://msdn.microsoft.com/library/azure/dn961167.aspx)
- [How to: Connect to Azure SQL Database by using ADO.NET](http://msdn.microsoft.com/library/azure/ee336243.aspx)


**Elastic scale:** For information about connectivity to Elastic Scale databases, see:


- [Get Started with Azure SQL Database Elastic Scale Preview](sql-database-elastic-scale-get-started.md)
- [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)


**Driver libraries:** For information about connection driver libraries, including recommended versions, see:


- [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md)


## See Also


- [Create your first Azure SQL Database](sql-database-get-started.md)

