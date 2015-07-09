<properties
   pageTitle="Management tools for SQL Data Warehouse | Microsoft Azure"
   description="Introduction to management tools for SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="HappyNicolle"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/24/2015"
   ms.author="mausher;nicw;barbkess;JRJ@BigBangData.co.uk;"/>

# Management Tools for SQL Data Warehouse
This topic explores and compares tools and options for managing SQL Data Warehouse, so you can pick the right tool for your needs. Choosing the right tool depends on how many databases you manage, the task, and how often a task is performed.

## Azure Portal
The [Azure portal][] is a web-based management portal where you can create, update, and delete databases and monitor database resources. This tool is great is if you're just getting started with Azure, managing a small number of data warehouse databases, or need to quickly do something. 

The portal includes metrics covering the current and historical performance DWU settings, the amount of storage being used, successful and failed SQL connections, and a set of visualizations and data that allow you to understand the queries running on your instance and the details of those queries.  

## SQL Server Data Tools in Visual Studio	
[SQL Server Data Tools][] (SSDT) in Visual Studio is a client tool that runs on your computer and allows you to connect to, manage, and develop your database in the Cloud. If you're an application developer familiar with Visual Studio or other integrated development environments (IDEs), try using SSDT in Visual Studio. 

SSDT includes the SQL Server Explorer which enables you to visualize, connect, and execute scripts against SQL Data Warehouse databases. To quickly connect to SQL Data Warehouse, you can simply click the **Open in Visual Studio** button in the command bar when viewing the database details in the Azure Portal.  

You can download the latest version of [SQL Server Data Tools][] (SSDT) that includes support for SQL Data Warehouse.

## Command-line tools
One option is to use PowerShell or sqlcmd command-line tools to manage SQL Data Warehouse and to automate Azure resource deployments. We recommend these tools for managing a large number of logical servers and deploying resource changes in a production environment as the tasks necessary can be scripted and then automated.

## Next steps
To start using these tools, head over to the [connection][] topic.

<!--Image references-->

<!--Article references-->
[connection]: sql-data-warehouse-develop-connections.md

<!--MSDN references-->
[SQL Server Data Tools]: https://msdn.microsoft.com/en-us/library/mt204009.aspx

<!--Other web references-->
[Azure portal]: http://portal.azure.com/