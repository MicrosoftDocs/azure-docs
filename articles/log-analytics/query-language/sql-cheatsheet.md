---
title: SQL to Azure Log Analytics query language cheat sheet | Microsoft Docs
description: Common functions to use for different scenarios in Log Analytics queries.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/21/2018
ms.author: bwren
ms.component: na
---

# SQL to Log Analytics query language cheat sheet 

The table below helps users who are familiar with SQL to learn the Log Analytics query language. Have a look at the T-SQL command for solving a common scenarios and the equivalent using Log Analytics.

## SQL to Log Analytics

Description								|SQL Query                           																|Azure Log Analytics Query
----------------------------------------|---------------------------------------------------------------------------------------------------|----------------------------------------
Select all data from a table	     	|`SELECT * FROM dependencies`          																|<code>dependencies</code>
Select specific columns from a table	|`SELECT name, resultCode FROM dependencies`  														|<code>dependencies <br>&#124; project name, resultCode</code>
Select 100 records from a table			|`SELECT TOP 100 * FROM dependencies`  																|<code>dependencies <br>&#124; take 100</code>
Null evaluation							|`SELECT * FROM dependencies WHERE resultCode IS NOT NULL`											|<code>dependencies <br>&#124; where isnotnull(resultCode)</code>
String comparison: equality				|`SELECT * FROM dependencies WHERE name = "abcde"`													|<code>dependencies <br>&#124; where name == "abcde"</code>
String comparison: substring			|`SELECT * FROM dependencies WHERE like "%bcd%"`													|<code>dependencies <br>&#124; where name contains "bcd"</code>
String comparison: wildcard				|`SELECT * FROM dependencies WHERE name like "abc%"`												|<code>dependencies <br>&#124; where name startswith "abc"</code>
Date comparison: last 1 day				|`SELECT * FROM dependencies WHERE timestamp > getdate()-1`											|<code>dependencies <br>&#124; where timestamp > ago(1d)</code>
Date comparison: date range				|`SELECT * FROM dependencies WHERE timestamp BETWEEN '2016-10-01' AND '2016-11-01'`					|<code>dependencies <br>&#124; where timestamp between (datetime(2016-10-01) .. datetime(2016-10-01))</code>
Boolean comparison						|`SELECT * FROM dependencies WHERE !(success)`														|<code>dependencies <br>&#124; where success == "False" </code>
Sort									|`SELECT name, timestamp FROM dependencies ORDER BY timestamp asc`									|<code>dependencies <br>&#124; order by timestamp asc </code>
Distinct								|`SELECT DISTINCT name, type  FROM dependencies`													|<code>dependencies <br>&#124; summarize by name, type </code>
Grouping, Aggregation					|`SELECT name, AVG(duration) FROM dependencies GROUP BY name`										|<code>dependencies <br>&#124; summarize avg(duration) by name </code>
Column aliases, Extend					|`SELECT operation_Name as Name, AVG(duration) as AvgD FROM dependencies GROUP BY name`				|<code>dependencies <br>&#124; summarize AvgD=avg(duration) by operation_Name <br>&#124; project Name=operation_Name, AvgD</code>
Top n recrods by measure				|`SELECT TOP 100 name, COUNT(*) as Count FROM dependencies GROUP BY name ORDER BY Count asc`		|<code>dependencies <br>&#124; summarize Count=count() by name <br>&#124; top 100 by Count asc</code>
Union									|`SELECT * FROM dependencies UNION SELECT * FROM exceptions`					 					|<code>union dependencies, exceptions</code>
Union: with conditions					|`SELECT * FROM dependencies WHERE value > 4 UNION SELECT * FROM exceptions value < 5`				|<code>dependencies <br>&#124; where value > 4 <br>&#124; union (exceptions <br>&#124; where value < 5)</code>
Join									|`SELECT * FROM dependencies JOIN exceptions ON dependencies.operation_Id = exceptions.operation_Id`|<code>dependencies <br>&#124; join (exceptions) on operation_Id == operation_Id</code>


## Next steps

- Go through a lesson on the [writing queries in Log Analytics](get-started-queries.md).