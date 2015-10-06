<properties 
   pageTitle="Use Azure Data Lake Analytics U-SQL catalog | Azure" 
   description="" 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="09/29/2015"
   ms.author="jgao"/>

# Use Azure Data Lake Analytics U-SQL catalog


https://microsoft.sharepoint.com/teams/ProjectKona/Documents/USQL/Introduction_to_the_USQL_Catalog.pptx

The purpose of U-SQL catalog

- Share common U-SQL code
- Share .NET Assemblies for use in your U-SQL Scripts
- Optimize your Data for fast query execution


Each ADL Analtyics account has a U-SQL catalog


The SQL Catalog will always exist.
It cannot be deleted.
You don’t have to use it.
But it’s a really good idea if you do

Inside the Catalog you create U-SQL Databases

Contents of a U-SQL Database: 
- assemblies: .net coce
- table valued functions: u-sql code
- table: structured data







