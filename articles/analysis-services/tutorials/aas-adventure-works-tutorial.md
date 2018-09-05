---
title: "Azure Analysis Services Adventure Works Tutorial | Microsoft Docs"
description: Introduces the Adventure Works tutorial for Azure Analysis Services
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Azure Analysis Services - Adventure Works tutorial

This tutorial provides lessons on how to create and deploy a tabular model at the 1400 compatibility level by using Visual Studio [Analysis Services projects](https://marketplace.visualstudio.com/items?itemName=ProBITools.MicrosoftAnalysisServicesModelingProjects) or [SQL Server Data Tools (SSDT)](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt).  
If you're new to Analysis Services and tabular modeling, completing this tutorial is the quickest way to learn how to create and deploy a basic tabular model by using Visual Studio. Once you have the prerequisites in-place, it should take between two to three hours to complete.  
  
## What you learn   
  
-   How to create a new tabular model project at the **1400 compatibility level** in Visual Studio.
  
-   How to import data from a relational database into a tabular model project workspace database.  
  
-   How to create and manage relationships between tables in the model.  
  
-   How to create calculated columns, measures, and Key Performance Indicators that help users analyze critical business metrics.  
  
-   How to create and manage perspectives and hierarchies that help users more easily browse model data by providing business and application-specific viewpoints.  
  
-   How to create partitions that divide table data into smaller logical parts that can be processed independent from other partitions.  
  
-   How to secure model objects and data by creating roles with user members.  
  
-   How to deploy a tabular model to an **Azure Analysis Services** server or **SQL Server 2017 Analysis Services** server by using Visual Studio.  
  
## Prerequisites  
To complete this tutorial, you need:  
  
-   An Azure Analysis Services server. Sign up for a free [Azure Analysis Services trial](https://azure.microsoft.com/services/analysis-services/) and [create a server](../analysis-services-create-server.md). 

-   An [Azure SQL Data Warehouse](../../sql-data-warehouse/create-data-warehouse-portal.md) with the **sample AdventureWorksDW database**, or a SQL Server Data Warehouse with the [Adventure Works sample database](https://github.com/Microsoft/sql-server-samples/releases/tag/adventureworks).

    **Important:** If you install the sample database to an on-premises SQL Server Data Warehouse, and deploy your model to an Azure Analysis Services server, an [On-premises data gateway](../analysis-services-gateway.md) is required.

-   The latest version of [SQL Server Data Tools (SSDT)](https://msdn.microsoft.com/library/mt204009.aspx) for Visual Studio.

-   The latest version of [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms).    

-   A client application such as [Power BI Desktop](https://powerbi.microsoft.com/desktop/) or Excel. 

## Scenario  
This tutorial is based on Adventure Works Cycles, a fictitious company. Adventure Works is a large, multinational manufacturing company that produces and distributes bicycles, parts, and accessories to commercial markets in North America, Europe, and Asia. The company employs 500 workers. Additionally, Adventure Works employs several regional sales teams throughout its market base. Your project is to create a tabular model for sales and marketing users to analyze Internet sales data in the AdventureWorksDW database.  
  
To complete the tutorial, you must complete various lessons. In each lesson, there are tasks. Completing each task in order is necessary for completing the lesson. While in a particular lesson there may be several tasks that accomplish a similar outcome, but how you complete each task is slightly different. This method shows there is often more than one way to complete a task, and to challenge you by using skills you've learned in previous lessons and tasks.  
  
The purpose of the lessons is to guide you through authoring a basic tabular model by using many of the features included in SSDT. Because each lesson builds upon the previous lesson, you should complete the lessons in order.
  
This tutorial does not provide lessons about managing a server in Azure portal, managing a server or database by using SSMS, or using a client application to browse model data. 


## Lessons  
This tutorial includes the following lessons:  
  
|Lesson|Estimated time to complete|  
|----------|------------------------------|  
|[1 - Create a new tabular model project](../tutorials/aas-lesson-1-create-a-new-tabular-model-project.md)|10 minutes|  
|[2 - Get data](../tutorials/aas-lesson-2-get-data.md)|10 minutes|  
|[3 - Mark as Date Table](../tutorials/aas-lesson-3-mark-as-date-table.md)|3 minutes|  
|[4 - Create relationships](../tutorials/aas-lesson-4-create-relationships.md)|10 minutes|  
|[5 - Create calculated columns](../tutorials/aas-lesson-5-create-calculated-columns.md)|15 minutes|
|[6 - Create measures](../tutorials/aas-lesson-6-create-measures.md)|30 minutes|  
|[7 - Create Key Performance Indicators (KPI)](../tutorials/aas-lesson-7-create-key-performance-indicators.md)|15 minutes|  
|[8 - Create perspectives](../tutorials/aas-lesson-8-create-perspectives.md)|5 minutes|  
|[9 - Create hierarchies](../tutorials/aas-lesson-9-create-hierarchies.md)|20 minutes|  
|[10 - Create partitions](../tutorials/aas-lesson-10-create-partitions.md)|15 minutes|  
|[11 - Create roles](../tutorials/aas-lesson-11-create-roles.md)|15 minutes|  
|[12 - Analyze in Excel](../tutorials/aas-lesson-12-analyze-in-excel.md)|5 minutes| 
|[13 - Deploy](../tutorials/aas-lesson-13-deploy.md)|5 minutes|  
  
## Supplemental lessons  
These lessons are not required to complete the tutorial, but can be helpful in better understanding advanced tabular model authoring features.  
  
|Lesson|Estimated time to complete|  
|----------|------------------------------|  
|[Detail Rows](../tutorials/aas-supplemental-lesson-detail-rows.md)|10 minutes|
|[Dynamic security](../tutorials/aas-supplemental-lesson-dynamic-security.md)|30 minutes|
|[Ragged hierarchies](../tutorials/aas-supplemental-lesson-ragged-hierarchies.md)|20 minutes| 

  
## Next steps  
To get started, see [Lesson 1: Create a New Tabular Model Project](../tutorials/aas-lesson-1-create-a-new-tabular-model-project.md).  
  
  
  

