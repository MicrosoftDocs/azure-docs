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
	ms.date="08/03/2015" 
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


## Recommendation: Authentication


- Use SQL Database authentication, not Windows authentication.
- Specify a particular database, instead of defaulting to the *master* database.
- Sometimes the user name must be given with the suffix of *@yourservername*, but other times the suffix must be omitted. It depends on how your tool or API was written.
 - Check the details on each individual technology.
- Connect by specifying a user in a [contained database](http://msdn.microsoft.com/library/ff929071.aspx).
 - This approach provides better performance and scalability by avoiding the need for a login in the master database.
 - You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database.


## Recommendations: Connection


- In your client connection logic, override the default timeout to be 30 seconds.
 - The default of 15 seconds is too short for connections that depend on the internet.
- Ensure that your [Azure SQL Database firewall](http://msdn.microsoft.com/library/ee621782.aspx) allows outgoing TCP communication on port 1433.
 - You can configure the [firewall](http://msdn.microsoft.com/library/azure/ee621782.aspx) settings on an SQL Database server or to an individual database.
- If you are using a [connection pool](http://msdn.microsoft.com/library/8xx3tyca.aspx), close the connection the instant your program is not actively using it, and is not just preparing to reuse it.
 - Unless your program will reuse the connection for another operation immediately, without pause, we recommend the following pattern:
<br/><br/>Open a connection.
<br/>Do one operation through the connection.
<br/>Close the connection.<br/><br/>
- Use retry logic with your connection logic, but only for transient errors. When using SQL Database, your attempts to open a connection or issue a query can fail for various reasons.
 - One persistent reason for failure could be that your connection string is malformed.
 - One transient reason for failure could be that the Azure SQL Database system needs to balance the overall load. The transient reason goes away by itself, which means your program should retry.
 - When retrying a query, first close the connection, and then open another connection.


The next section has more to say about retry logic and transient fault handling.


## Transient errors and retry logic


Cloud services such as Azure and its SQL Database service have the endless challenge of balancing workloads and managing resources. If two databases that are being served from the same computer are involved in exceptionally heavy processing at overlapping times, the management system might detect the necessary of shifting the workload of one database to another resource which has excess capacity.


During the shift, the database might be temporarily unavailable. This might block new connections, or it might cause your client program to lose its connection. But the resource shift is transient, and it might resolve itself in a couple of minutes or in several seconds. After the shift is completed, your client program can reestablish its connection and resume its work. The pause in processing is better than an avoidable failure of your client program.


When any error occurs with SQL Database, an [SqlException](https://msdn.microsoft.com/library/system.data.sqlclient.sqlexception.aspx) is thrown. The `SqlException` contains a numeric error code in its **Number** property. If the error code identifies a transient error, your program should retry the call.


- [Error messages for SQL Database client programs](sql-database-develop-error-messages.md)
 - Its **Transient Errors, Connection-Loss Errors** section is a list of the transient errors that warrant an automatic retry.
 - For example, retry if the error number 40613 occurs, which says something similar to<br/>*Database 'mydatabase' on server 'theserver' is not currently available.*


Transient *errors* are sometimes called transient *faults*. This topic considers these two terms to be synonyms.


For further assistance when you encounter a connection error, whether transient or not, see:


- [Troubleshoot connection problems to Azure SQL Database](http://support.microsoft.com/kb/2980233/)


For links to code sample topics that demonstrate retry logic, see:


- [Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)


<a id="gatewaynoretry" name="gatewaynoretry">&nbsp;</a>


## Middleware proxy no longer provides retry logic in V12


In a production environment, clients that connect to Azure SQL Database V11 or V12 are advised to implement retry logic in their code. This can be custom code, or can be code that leverages an API such as the Enterprise Library.


The middleware proxy that mediates between V11 and your ADO.NET 4.5 client handles a small subset of transient faults gracefully with retry logic. In cases where the proxy successfully connects on its second attempt, your client program is blissfully unaware that the first attempt failed.


In contrast, the V12 proxy does not provide any retry functionality. Further, in other V12 cases the the proxy is bypassed for the superior speed of connecting to SQL Database directly. Therefore the recommendation for retry logic is more pressing after upgrade from V11 to V12.


To a client ADO.NET 4.5 program, these changes make Azure SQL Database V12 look more like Microsoft SQL Server.


For code samples that demonstrate retry logic, see:<br/>[Client quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md).


## Technologies


The following topics contains links to code samples for several languages and driver technologies that you can use to connect to Azure SQL Database from your client program.


Various code samples are given for clients that run on both Windows, Linux, and Mac OS X.


**General samples:** There are code samples for a variety of programming languages, including PHP, Python, Node.js, and .NET CSharp. Also, samples are given for clients that run on Windows, Linux, and Mac OS X.


- [Client development and quick-start code samples to SQL Database](sql-database-develop-quick-start-client-code-samples.md)
- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)


**Elastic scale:** For information about connectivity to Elastic Scale databases, see:


- [Get Started with Azure SQL Database Elastic Scale Preview](sql-database-elastic-scale-get-started.md)
- [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)


**Driver libraries:** For information about connection driver libraries, including recommended versions, see:


- [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md)


## See Also


- [Create your first Azure SQL Database](sql-database-get-started.md)

 