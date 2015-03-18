<properties 
	pageTitle="Connections to Azure SQL Database: Central recommendations" 
	description="A central topic that provides links to more specific topics about various drivers, such as ADO.NET and PHP, for connecting to Azure SQL Database." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/17/2015" 
	ms.author="genemi"/>


#Connections to SQL Database: Central recommendations


<!--
GeneMi , 2015-March-17 Monday 12:28pm
sql-database-connect-central-recommendations.md
sql-database-connect-*.md

Applying tech review feedback from Young Gah Kim.
Also, testing the new suffix ".md" in the 'routing' link near bottom.
-->


This topic provides links to code samples for various technologies that you can use to connect to and interact with Azure SQL Database. The technologies include Enterprise Library, JDBC, and PHP. Recommendations are given that apply generally regardless of the specific connection technology.


##Technology-independent recommendations


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


###Quick recommendations


####Connection


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


####Authentication


- Use SQL Database authentication, not Windows authentication.
- Specify a particular database, instead of defaulting to the *master* database.
- Sometimes the user name must be given with the suffix of *@yourservername*, but other times the suffix must be omitted. It depends on how your tool or API was written.
 - Check the details on each individual technology.
- Connect by specifying a user in a [contained database](http://msdn.microsoft.com/library/ff929071.aspx).
 - This approach provides better performance and scalability by avoiding the need for a login in the master database.
 - You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database.


###Transient errors


Some SQL Database connection errors are persistent and there is no reason to immediately retry connecting. Other errors are transient, and a few automated retry attempts by your program are recommended. Examples:


- *Persistent:* If you misspell the name of your SQL Database server when you try to connect, there is no sense in retrying.
- *Transient:* If your working connection to SQL Database is later forcibly terminated by Azure throttling or load balancing systems, trying to reconnect is recommended.


The [SqlException](https://msdn.microsoft.com/library/system.data.sqlclient.sqlexception.aspx) thrown by the call to SQL Database contains a numeric error code in its HResult property. If the error code is one that is listed as a transient error, your program should retry the call.


- [Error Messages (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff394106.aspx) - its **Connection-Loss Errors** section is a list of the transient errors that warrant a retry.
 - For example, retry if the error number 40613 occurs, which says something similar to<br/>*Database 'mydatabase' on server 'theserver' is not currently available.*


For further assistance when you encounter a connection error, either persistent or transient, see:


- [Troubleshoot connection problems to Azure SQL Database](http://support.microsoft.com/en-us/kb/2980233/en-us)


##Technologies


The following topic contains links to code samples for several connection technologies:


- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)


For ADO.NET with Enterprise Library and the Transient Fault Handling classes, see:


- [How to: Reliably connect to Azure SQL Database](http://msdn.microsoft.com/library/azure/dn864744.aspx)


For Elastic Scale, see:


- [Get Started with Azure SQL Database Elastic Scale Preview](../sql-database-elastic-scale-get-started/)
- [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md)


##Incomplete or outdated posts


The links in this section are to blog posts or similar sources, so they might be incomplete or be outdated. Yet they might have some background value.


- [Retry Logic for Transient Failures in Microsoft Azure SQL Database](http://social.technet.microsoft.com/wiki/contents/articles/4235.retry-logic-for-transient-failures-in-windows-azure-sql-database.aspx)

<!-- -->

