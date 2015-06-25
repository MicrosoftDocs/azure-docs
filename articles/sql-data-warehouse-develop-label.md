<properties
   pageTitle="Use labels to instrument queries in SQL Data Warehouse | Microsoft Azure"
   description="Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/22/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Use labels to instrument queries in SQL Data Warehouse
SQL Data Warehouse supports a concept called query labels. Before going into any depth let's look at an example of one:

	```
	SELECT *
	FROM sys.tables
	OPTION (LABEL = 'My Query Label')
	;
	```
This last line tags the string 'My Query Label' to the query. This is particularly helpful as the label is query-able through the DMVs. This provides us with a mechanism to track down problem queries and also to help identify progress through an ETL run. 

A good naming convention really helps here. For example something like ' PROJECT : PROCEDURE : STATEMENT : COMMENT' would help to uniquely identify the query in amongst all the code in source control.

To search by label you can use the following query that uses the dynamic management views:

	```
	SELECT  *
	FROM    sys.dm_pdw_exec_requests r
	WHERE   r.[label] = 'My Query Label'
	;
	``` 

> [AZURE.NOTE] It is essential that you wrap square brackets or double quotes around the word label when querying. Label is a reserved word and will caused an error if it has not been delimited.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

## Next steps
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->


<!--Article references-->
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/

<!--MSDN references-->

<!--Other Web references-->



