<properties 
	pageTitle="Add Azure SQL DB Elastic Scale References to a Visual Studio Project" 
	description="How to add .NET references for Elastic Scale APIs to Visual Studio projects using Nuget." 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/24/2015" 
	ms.author="sidneyh"/>

# How to: add Elastic Database client library references to a Visual Studio project 

### Prerequisites: 

- Install [NuGet Visual Studio Extension Gallery](http://docs.nuget.org/docs/start-here/installing-nuget) for Visual Studio 

### To add an elastic database client library reference in Visual Studio 

1. Open an existing project, or create a new project using the New Project dialog box located at **File** --> **New** --> **Project** 
2. In the Solution Explorer, right-click on **References** and select **Manage NuGet Packages**
3. In the menu on the left-hand side of the Manage NuGet Packages window, select **Online** and then **nuget.org** or “All” 
4. In the **Search Online** dialog box, type **Elastic Database**, select the **Elastic Database client library** and click **Install**.

	![Search online][1]
4. Review the license, and click **I Accept**. 

The client library reference has now been added to your project. 

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-add-references-visual-studio/search-online.png
<!--anchors--> 