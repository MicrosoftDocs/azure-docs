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
There are a few ways to start the authoring experience in SQL script. You can create a new SQL script: 

>1. Click on the "+" icon: Add new resource and choose "SQL script" 
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