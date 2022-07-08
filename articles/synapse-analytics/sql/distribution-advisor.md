---
title: Synapse Analytics Distribution Advisor
description: This article describes how a user can receive advice on the best distribution strategy to utilize on tables based on user queries.
author: mariyaali
ms.author: mariyaali
ms.reviewer: wiassaf
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 07/08/2022
---

# Distribution Advisor in Azure Synapse Analytics

In Azure Synapse Analytics, each table is distributed as chosen by the customer. Chosen distribution strategy affects query performance substantially.

Distribution Advisor (DA)  in Synapse SQL analyzes customer queries and recommends the best distribution strategies for tables to improve query performance. Queries to be considered by the advisor can be provided by the customer or pulled from historic queries available in DMV. 

> [!NOTE]
>Distribution Advisor is in Public Preview. To sign up for this feature, reach out to [Distribution Advisor Team](distribution-advisor@microsoft.com).


## Prerequisites

- Run the following to ensure that you are on version 10.0.15665 or higher.
```sql 
SELECT @@version 
``` 
- DA recommendations depend on table statistics being up to date. Please ensure statistics are created/updated before running the advisor. Review [Manage table statistics](develop-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true) articles.

## Create Distribution Advisor Stored Procedures

To run the advisor easily, please run [this script](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/DistributionAdvisor/CreateDistributionAdvisor_T62.sql) to create 2 stored procedures:
| **Command** | **Description** |
|------------- | --- |
|dbo.write_dist_recommendation |	Picks up queries that DA will recommend on either from user input on DMV.|
|dbo.read_dist_recommendation	| Runs the advisor and emits recommendations.|


## Running the advisor on past workload data from DMV

Run the following commands: 
```sql
EXEC dbo.write_dist_recommendation 100, NULL
go
EXEC dbo.read_dist_recommendation;
go
```

You can enter any number less than 100 as the first parameter in dbo.write_dist_recommendation and the second parameter as NULL when you are picking past run workloads from DMV for advice.

## Running the advisor on selected queries

Run the following command after placing queries of interest in single quotes: 
```sql
EXEC dbo.write_dist_recommendation 0, 'select count (*) from t1; select * from t1 join t2 on t1.a1 = t2.a1;'
go
EXEC dbo.read_dist_recommendation;
go
```
The first parameter in dbo.write_dist_recommendation is set to 0 since DA is only generating advice on your selected queries and the second parameter is a semi-colon separated list of queries that DA will analyze.

## Reading the advice

Recommendations will be returned in the following format when the DA procedure finishes execution:

| **Column name**|	**Description**|
|--------------- | ----------------- |
|Table_name	|	The table that DA analyzed.|
|Current_Distribution	|	Current table distribution strategy.|
|Recommended_Distribution	|	Recommended distribution. This can be the same as Current_Distribution if there is no change recommended.|
|Distribution_Change_Command	|	CTAS command to implement the recommendation.|

## Implementing the advice

- Run the CTAS command provided by Distribution Advisor to create new tables with the recommended distribution strategy.
- If you received advice on queries in the DMV, run [this script](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/DistributionAdvisor/e2e_queries_used_for_recommendations.sql) to note which queries where considered for advice. 
- Run the queries (from the previous step or selected queries for advice) on newly created tables to check for performance improvements.

## Next steps
Also see the [Troubleshooting](../sql-data-warehouse/sql-data-warehouse-troubleshoot.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) article for common issues and solutions.

If you need information not provided in this article, search the [Microsoft Q&A question page for Azure Synapse](/answers/topics/azure-synapse-analytics.html) is a place for you to pose questions to other users and to the Azure Synapse Analytics Product Group.  

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure Synapse Analytics Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-synapse).

For feature requests, use the [Azure Synapse Analytics Feedback](https://feedback.azure.com/forums/307516-sql-data-warehouse) page.  Adding your requests or up-voting other requests helps us to focus on the most in-demand features.

