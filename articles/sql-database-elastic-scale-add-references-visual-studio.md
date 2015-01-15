<properties title="" pageTitle="Add Azure SQL DB Elastic Scale References to a Visual Studio Project" description="How to add .NET references for Elastic Scale APIs to Visual Studio projects using Nuget." metaKeywords="Azure SQL Database, elastic scale, Nuget references" services="sql-database" documentationCenter="" manager="jhubbard" authors="sidneyh" editor=""/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#How To: Add Azure SQL DB Elastic Scale References to a Visual Studio Project 

###Prerequisites: 

- Install [NuGet Visual Studio Extension Gallery](http://docs.nuget.org/docs/start-here/installing-nuget) for Visual Studio 

###To add an Elastic Scale reference in Visual Studio 

1. Create a new project via the New Project dialog box located at **File** --> **New** --> **Project** 
2. In the Solution Explorer, right-click on **References** and select **Manage NuGet Packages**
3. In the menu on the left-hand side of the Manage NuGet Packages window, select **Online** and then **nuget.org** or “All” 
4. In the **Search Online** dialog box, type **Elastic Scale**, select the **Elastic Scale client libraries** and click **Install**.
4. Review the license, and click **I Accept**. 

The Azure SQL Database Elastic Scale references have now been added to your project. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]
