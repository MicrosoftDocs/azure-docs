---
title: Using Azure Synapse Analytics studio SQL Scripts
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
Azure Synapse Analytics studio SQL script is a web interface for you to author your SQL query connecting to SQL pool and SQL On-demand. 
## Create a SQL Script and author its content
There are few ways to start the authoring experience in SQL script. You can create a new SQL script: 
1. Add new resource by clicking on the "+" icon and choose "SQL script"  
<img src=".\media\authoring-sql-script\newsqlscript.png" alt="Create SQL Script" width="700"/>
a. Choose a name for your SQL script by clicking on the "Property" button   and replace the default name assigned to the SQL script
<img src=".\media\authoring-sql-script\newsqlscriptrename.png" alt="Create SQL Script" width="700"/>
b. Choose the specific SQL Pool or the SQL On-Demand from the "Connect to" drop-down menu and if necessary choose the database from "Use database"
<img src=".\media\authoring-sql-script\newsqlchoosepool.png" alt="Create SQL Script" width="700"/>
c. Start authoring your SQL script and leverage the intellisense feature
<img src=".\media\authoring-sql-script\newsqlintellisense.png" alt="Create SQL Script" width="350"/>
d. Run your SQL script
Click the "Run" button to execute your SQL script. The results are displayed by default in a table  
<img src=".\media\authoring-sql-script\newsqlscriptresultstable.png" alt="Create SQL Script" width="700"/>
You can export the results to your local storage in different formats (including CSV, Excel, JSON, XML) by clicking "Export results" and choose the extension. 
You can also visualize the SQL script results in a chart by clicking on the "Chart" button. Select the "Chart type" and "Category column". You can finally export the chart into a picture by clicking on "Save as image".  
<img src=".\media\authoring-sql-script\newsqlscriptresultschart.png" alt="Create SQL Script" width="700"/>
1. Other methods to create a new SQL Script
a. Choose "New SQL script" from the "Actions" menu under Develop SQL scripts. Then continue the authoring process following the instructions from step 1.a
<img src=".\media\authoring-sql-script\newsqlscript2actions.png" alt="Create SQL Script" width="700"/>
b. Choose "Import" from the "Actions" menu under Develop SQL scripts and select an existing SQL script from your local storage. Then continue the authoring process following the instructions from step 1.a   
<img src=".\media\authoring-sql-script\newsqlscript3actions.png" alt="Create SQL Script" width="700"/>
1. Exploring Data from Storage accounts and Database using "SQL script"
a. Parquet file using SQL analytics on-demand: You can explore Parquet files in a Storage Account using SQL script to preview the file content  
<img src=".\media\authoring-sql-script\newscriptsqlodparquet.png" alt="Create SQL Script" width="700"/>
1. SQL Tables, external tables, views: by clicking on the "Actions" menu under Data you can perform several actions like: "New SQL script" "Select TOP 1000 rows", "CREATE", "DROP and CREATE". Explore the available gesture by clicking on the right nodes of SQL Pool and SQL analytics on-demand   
<img src=".\media\authoring-sql-script\newscriptdatabase.png" alt="Create SQL Script" width="700"/>
## Next steps
For more information about authoring a SQL script, see:
[sql-analytics-on-demand-workspace-overview](sql-analytics-on-demand-workspace-overview.md)
[Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)