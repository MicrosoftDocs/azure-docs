---
title: Using Azure Synapse Analytics studio  SQL Scripts
description: Introduction of how to use Azure Synapse Analytics studio SQL Scripts   
services: sql-data-warehouse 
author: pimorano 
ms.service: sql-data-warehouse 
ms.topic: conceptual 
ms.subservice: development
ms.date: 12/23/2019
ms.author: pimorano 
ms.reviewer: omafnan
---

# Using Azure Synapse Analytics studio SQL Script
Azure Synapse Analytics studio SQL script is a web interface for you to author SQL pool and SQL On-demand. 

## Create a SQL Script and author its content
There are few ways to start the authoring experience in SQL script. You can create a new SQL script: 

>1. Add new resource by clicking on the "+" icon and choose "SQL script"  
><img src=".\media\authoring-sql-script\NewSQLScript.PNG" alt="Create SQL Script" width="700"/>

>> 1.1 Choose a name for your SQL script by clicking on the "Property" button   and replace the default name assigned to the SQL script

>>   <img src=".\media\authoring-sql-script\NewSQLScriptRename.PNG" alt="Create SQL Script" width="700"/>

>> 1.2 Choose the specific SQL Pool or the SQL On-Demand from the "Connect to" drop-down menu and if necessary from "Use database"

>>   <img src=".\media\authoring-sql-script\NewSQLChoosePool.PNG" alt="Create SQL Script" width="700"/>

>> 1.3 Start authoring your SQL script and leverage the intellisense feature

>>   <img src=".\media\authoring-sql-script\NewSQLIntellisense.PNG" alt="Create SQL Script" width="350"/>

>> 1.4 Run your SQL script
>> Click the "Run" button to execute your SQL script. The results are displayed by default in a table  

>>   <img src=".\media\authoring-sql-script\NewSQLScriptResultsTable.PNG" alt="Create SQL Script" width="700"/>

>> You can export the results to your local storage in different formats (including CSV, Excel, JSON, XML) by clicking "Export results" and choose the extension. 
>> You can also visualize the SQL script results in a chart by clicking on the "Chart" button. Select the "Chart type" and "Category column". You can finally export the chart into a picture by clicking on "Save as image".  

>>   <img src=".\media\authoring-sql-script\NewSQLScriptResultsChart.PNG" alt="Create SQL Script" width="700"/>

>2. Other methods to create a new SQL Script

>> 2.1 Choose "New SQL script" from the "Actions" menu under Develop SQL scripts. Then continue the authoring process following the instructions from step 1.1   
>> <img src=".\media\authoring-sql-script\NewSQLScript2Actions.PNG" alt="Create SQL Script" width="700"/>
>> 2.2 Choose "Import" from the "Actions" menu under Develop SQL scripts and select an existing SQL script from your local storage. Then continue the authoring process following the instructions from step 1.1   
>> <img src=".\media\authoring-sql-script\NewSQLScript3Actions.PNG" alt="Create SQL Script" width="700"/>