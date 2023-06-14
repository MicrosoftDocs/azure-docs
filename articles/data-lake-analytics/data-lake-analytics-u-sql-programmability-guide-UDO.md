---
title: U-SQL UDO programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability Azure Data Lake Analytics to enable you to create good USQL scripts.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# U-SQL user-defined objects overview

## U-SQL: user-defined objects: UDO

U-SQL enables you to define custom programmability objects, which are called user-defined objects or UDO.

The following is a list of UDO in U-SQL:

* User-defined extractors
	* Extract row by row
	* Used to implement data extraction from custom structured files

* User-defined outputters
	* Output row by row
	* Used to output custom data types or custom file formats

* User-defined processors
	* Take one row and produce one row
	* Used to reduce the number of columns or produce new columns with values that are derived from an existing column set

* User-defined appliers
	* Take one row and produce 0 to n rows
	* Used with OUTER/CROSS APPLY

* User-defined combiners
	* Combines rowsets--user-defined JOINs

* User-defined reducers
	* Take n rows and produce one row
	* Used to reduce the number of rows

UDO is typically called explicitly in U-SQL script as part of the following U-SQL statements:

* EXTRACT
* OUTPUT
* PROCESS
* COMBINE
* REDUCE

> [!NOTE]  
> UDO’s are limited to consume 0.5Gb memory.  This memory limitation does not apply to local executions.

## Next steps

* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)