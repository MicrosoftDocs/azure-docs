---
title: Design your first Azure SQL database - C# | Microsoft Docs
description: Learn to design your first Azure SQL database and connect to it with a C# program using ADO.NET.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: tutorial
author: MightyPen
ms.author: genemi
ms.reviewer: carlrab
manager: craigg-msft
ms.date: 06/07/2018
---
# Design an Azure SQL database and connect with C&#x23; and ADO.NET

Azure SQL Database is a relational database-as-a service (DBaaS) in the Microsoft Cloud (Azure). In this tutorial, you learn how to use the Azure portal and ADO.NET with Visual Studio to: 

> [!div class="checklist"]
> * Create a database in the Azure portal
> * Set up a server-level firewall rule in the Azure portal
> * Connect to the database with ADO.NET and Visual Studio
> * Create tables with ADO.NET
> * Insert, update, and delete data with ADO.NET 
> * Query data ADO.NET

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

An installation of [Visual Studio Community 2017, Visual Studio Professional 2017, or Visual Studio Enterprise 2017](https://www.visualstudio.com/downloads/).

<!-- The following included .md, sql-database-tutorial-portal-create-firewall-connection-1.md, is long.
And it starts with a ## H2.
-->

[!INCLUDE [sql-database-tutorial-portal-create-firewall-connection-1](../../includes/sql-database-tutorial-portal-create-firewall-connection-1.md)]


<!-- The following included .md, sql-database-csharp-adonet-create-query-2.md, is long.
And it starts with a ## H2.
-->

[!INCLUDE [sql-database-csharp-adonet-create-query-2](../../includes/sql-database-csharp-adonet-create-query-2.md)]


## Next steps

In this tutorial, you learned basic database tasks such as create a database and tables, load and query data, and restore the database to a previous point in time. You learned how to:
> [!div class="checklist"]
> * Create a database
> * Set up a firewall rule
> * Connect to the database with [Visual Studio and C#](sql-database-connect-query-dotnet-visual-studio.md)
> * Create tables
> * Insert, update, and delete data
> * Query data

Advance to the next tutorial to learn about migrating your data.

> [!div class="nextstepaction"]
> [Migrate your SQL Server database to Azure SQL Database](sql-database-migrate-your-sql-server-database.md)

