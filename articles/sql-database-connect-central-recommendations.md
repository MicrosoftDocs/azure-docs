<properties 
	pageTitle="Connections to SQL Database: Central recommendations" 
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
	ms.date="03/16/2015" 
	ms.author="genemi"/>


#Connections to SQL Database: Central recommendations


<!--
GeneMi , 2015-March-16 Monday 15:50pm
sql-database-connect-central-recommendations.md
sql-database-connect-*.md

Reiterating the initial draft. Intention is to publish this topic immediately, even though the needed improvements to the technology-specific topics (that this topic points to) will not yet be written and published. The goal is to address the "fragmentation" problem among our sql-database-* "Connectivity" topics. Working with PM Luiz Fernando Santos (LFSantos).
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
- Use retry logic with your connection logic. For several good reasons which include load balancing, Azure SQL Database occasionally:
 - Forces the termination of an idle connection.
 - Forces the termination of a connection that is running a resource intensive query.
 - Rejects a request for a new connection.
- Set the [Azure SQL Database firewall](http://msdn.microsoft.com/library/ee621782.aspx) rules to open port 1433 on the SQL Database server.
 - You can configure the [firewall](http://msdn.microsoft.com/library/azure/ee621782.aspx) settings on an SQL Database server or to an individual database.
 - Azure services other than SQL Database use their own different port numbers.
- Set the firewall rules to enable the TCP/IP protocol.


####Authentication


- Use SQL Database authentication, not Windows authentication.
- Specify a particular database, instead of defaulting to the master database.
 - Use contained database users, and avoid the need for a login user in the master database. You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database.
- Sometimes the user name must be given with the suffix of "@yourservername", but other times the suffix must be omitted. It depends on how your tool or API was written.
 - Check the details on each individual technology.


###Transient errors


Some SQL Database connection errors are persistent and there is no reason to immediately retry connecting. Other errors are transient, and a few automated retry attempts by your program are sensible. Examples:


- *Persistent:* If you misspell the name of your SQL Database server when you try to connect, there is no sense in retrying. The error is persistent until you fix the spelling.
- *Transient:* If your working connection to SQL Database is later forcibly terminated by the Azure throttling or load balancing systems, trying to reconnect is recommended.


The exception thrown by the call to SQL Database contains a numeric error code. If the error code is one that is listed as signifying a transient error, your program code should retry the call.


- [Error Messages (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff394106.aspx) - its **Connection-Loss Errors** section is a list of the transient errors that warrant a retry.


For further assistance when you encounter a connection error, either persistent or transient, see:


- [Troubleshoot connection problems to Azure SQL Database](http://support.microsoft.com/en-us/kb/2980233/en-us)


##Technologies


The following topic contains links to code samples for several connection technologies:


- [Azure SQL Database Development: How-to Topics](http://msdn.microsoft.com/library/azure/ee621787.aspx)


For ADO.NET with Enterprise Library and the Transient Fault Handling classes, see:


- [How to: Reliably connect to Azure SQL Database](http://msdn.microsoft.com/library/azure/dn864744.aspx)


For Elastic Scale, see:


- [Get Started with Azure SQL Database Elastic Scale Preview](../sql-database-elastic-scale-get-started/)
- [Data dependent routing](../sql-database-elastic-scale-data-dependent-routing/)


##Incomplete or outdated posts


The links in this section are to blog posts or similar sources, so they might be incomplete or be outdated. Yet they might have some background value.


- [Retry Logic for Transient Failures in Microsoft Azure SQL Database](http://social.technet.microsoft.com/wiki/contents/articles/4235.retry-logic-for-transient-failures-in-windows-azure-sql-database.aspx)

<!-- -->

