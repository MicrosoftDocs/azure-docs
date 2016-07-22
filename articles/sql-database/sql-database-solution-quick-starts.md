<properties
   pageTitle="Azure SQL Database Solution Quick Starts | Microsoft Azure"
   description="Learn about Azure SQL Database Solutions"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-quickstart"
   ms.date="06/22/2016"
   ms.author="carlrab"/>

# Explore Azure SQL Database Solution Quick Starts

This article contains an overview of the Azure SQL Database Solution Quick Starts. These Quick Starts demonstrate the use of SQL Database in a complete solution based on real-world scenarios. For simple step-by-step tutorials that demonstrate the use of a particular SQL Database feature, see [Explore Azure SQL Database tutorials](sql-database-explore-tutorials.md).

## Try the WingTipTickets demo and hands-on lab

The [Azure SQL Database WingTipTickets](https://github.com/microsoft/wingtiptickets) demo and hands-on lab demonstrate an Azure SQL Database and Azure Search-based sample application that's used to sell concert tickets.

## Collect and monitor resource usage data across multiple pools

This [Solution Quick Start: Elastic Pool telemetry using PowerShell](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools) provides a solution for collecting and monitoring SQL Database resource usage across multiple pools in a subscription. When you have a large number of databases in a subscription, it's cumbersome to monitor each elastic pool separately.

To resolve this issue, you can combine SQL Database PowerShell cmdlets and T-SQL queries to collect resource usage data from multiple pools and their databases for monitoring and analysis of resource usage.

This Quick Start in the GitHub SQL Server samples repository provides a set of PowerShell scripts and T-SQL queries along with documentation on what the solution does and how to implement  it.

## Get started with Elastic Database in an SaaS scenario

This [Solution Quick Start: Elastic Pool custom dashboard for SaaS](https://github.com/Microsoft/sql-server-samples/tree/master/samples/manage/azure-sql-db-elastic-pools-custom-dashboard) provides a solution for a Software-as-a-Solution (SaaS) scenario that leverages the Elastic Database feature of SQL Database to provide a cost-effective, scalable database backend of an SaaS application.

In this solution, you will walk through the implementation of a web app. This web app lets you visualize the load that's created on an elastic database by a load generator that uses a custom dashboard that supplements the Azure portal.

This Quick Start in the GitHub SQL Server samples repository provides a load generator and monitoring web app along with the documentation on what the app does and how to use it.

## Create an Azure SQL Database by the Entity Framework and Code First Development

The video and sample in [Code First to a New Database](https://msdn.microsoft.com/data/jj193542.aspx) provides an introduction to Code First development that targets a new database. This scenario targets a database that doesn’t exist, but which will be created by Code First. Alternately, it will create an empty database to which Code First will add new tables.

Code First enables you to define your model by using by C# or Visual Basic .NET  classes. You can perform optional additional configuration by using attributes on your classes and properties or by using a fluent API. See [Code First to a New Database](https://msdn.microsoft.com/data/jj193542.aspx).

## Integrate Elastic Database tools into an Entity Framework application

This sample shows the changes that you need to make to an Entity Framework application to integrate it with [Elastic Database tools](sql-database-elastic-scale-get-started.md). The focus is on composing [shard map management](sql-database-elastic-scale-shard-map-management.md) and [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md) with the Entity Framework Code First approach.

The [Code First to a new database sample for EF](http://msdn.microsoft.com/data/jj193542.aspx) serves as our running example throughout this sample. The sample code that accompanies this document is part of the Elastic Database tools set of samples in the Visual Studio code samples. See [Elastic Database client library with Entity Framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md).

## Integrate Elastic Database tools with row-level security

This sample shows that you need to make to an Entity Framework application to integrate [Elastic Database tools](sql-database-elastic-scale-get-started.md) with [row-level security](https://msdn.microsoft.com/library/dn765131). This sample illustrates how to use these technologies together to build an application with a highly scalable data tier that supports multi-tenant shards.

You do this by using ADO.NET SqlClient or Entity Framework. This sample extends the [Elastic Database client library with Entity Framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) by adding support for multitenant shard databases.
It builds a simple console application for creating blogs and posts, with four tenants and two multitenant shard databases. For more information, see [Multi-tenant applications with Elastic Database tools and row-level security](sql-database-elastic-tools-multi-tenant-row-level-security.md).

## Create online surveys with the Tailspin Surveys application

This [Tailspin Surveys sample application](https://github.com/Azure-Samples/guidance-identity-management-for-multitenant-apps/blob/master/docs/running-the-app.md) is a multitenant web application, called Surveys, that enables users to create online surveys. The sample addresses some key concerns about how to manage user identities in a multitenant application, including sign-up, authentication, authorization, and app roles.

## Contoso Clinic Demo Application

This [Contoso Clinic Demo application](https://github.com/Microsoft/azure-sql-security-sample) showcases security features of the latest Azure SQL Database.

## Next steps

[Explore Azure SQL Database tutorials](sql-database-explore-tutorials.md)
