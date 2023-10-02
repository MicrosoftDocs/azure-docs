---
title: Synapse SQL Distribution Advisor
description: This article describes how a user can receive advice on the best distribution strategy to utilize on tables based on user queries.
author: mariyaali
ms.author: mariyaali
ms.reviewer: wiassaf
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 07/16/2023
---

# Distribution Advisor in Azure Synapse SQL
**Applies to:** Azure Synapse Analytics dedicated SQL pools (formerly SQL DW)

In Azure Synapse SQL, each table is distributed using the strategy chosen by the customer (Round Robin, Hash Distributed, Replicated). The chosen distribution strategy can affect query performance substantially.

The Distribution Advisor (DA) feature of Azure Synapse SQL analyzes customer queries and recommends the best distribution strategies for tables to improve query performance. Queries to be considered by the advisor can be provided by the customer or pulled from historic queries available in DMV. 

> [!NOTE]
> Distribution Advisor is currently in preview for Azure Synapse Analytics. Preview features are meant for testing only and should not be used on production instances or production data. As a preview feature, Distribution Advisor is subject to undergo changes in behavior or functionality. Please also keep a copy of your test data if the data is important.  Distribution Advisor does not support Multi-Column distributed tables.

## Prerequisites

- Execute the T-SQL statement `SELECT @@version` to ensure that your Azure Synapse Analytics dedicated SQL pool is version 10.0.15669 or higher. If your version is lower, a new version should automatically reach your provisioned dedicated SQL pools during their maintenance cycle.

- Ensure that statistics are available and up-to-date before running the advisor. For more details, [Manage table statistics](develop-tables-statistics.md), [CREATE STATISTICS](/sql/t-sql/statements/create-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true), and [UPDATE STATISTICS](/sql/t-sql/statements/update-statistics-transact-sql?view=azure-sqldw-latest&preserve-view=true) articles for more details on statistics.

- Enable the Azure Synapse distribution advisor for the current session with the [SET RECOMMENDATIONS](/sql/t-sql/statements/set-recommendations-sql?view=azure-sqldw-latest&preserve-view=true) T-SQL command.

## Analyze workload and generate distribution recommendations

The follow tutorial explains the sample use case for using the Distribution Advisor feature to analyze customer queries and recommend the best distribution strategies.

Distribution Advisor only analyzes queries run on user tables.

### 1. Create Distribution Advisor stored procedures

To run the advisor easily, create two new stored procedures in the database. Run [the CreateDistributionAdvisor_PublicPreview script available for download from GitHub](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/CreateDistributionAdvisor_PublicPreview.sql):

| Command                       | Description                                                                                           |
|-------------------------------|-------------------------------------------------------------------------------------------------------|
| `dbo.write_dist_recommendation` | Defines queries that DA will analyze on. You can provide queries manually, or read from up to 100 past queries from the actual workloads in [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql). |   
| `dbo.read_dist_recommendation`  | Runs the advisor and generates recommendations.                                                       |  

Here is an example of how you could [run the advisor](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/RunDistributionAdvisor.sql).

### 2a. Run the advisor on past workload in DMV

Run the following commands to read up to the last 100 queries in the workload for analysis and distribution recommendations: 

```sql
EXEC dbo.write_dist_recommendation <Number of Queries max 100>, NULL
go
EXEC dbo.read_dist_recommendation;
go
```

To see which queries were analyzed by DA, run [the e2e_queries_used_for_recommendations.sql script available for download from GitHub](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/e2e_queries_used_for_recommendations.sql).

### 2b. Run the advisor on selected queries

The first parameter in `dbo.write_dist_recommendation` should be set to `0`, and the second parameter is a semi-colon separated list of up to 100 queries that DA will analyze. In the below example, we want to see the distribution recommendation for two statements separated by semicolons, `select count (*) from t1;` and `select * from t1 join t2 on t1.a1 = t2.a1;`.

```sql
EXEC dbo.write_dist_recommendation 0, 'select count (*) from t1; select * from t1 join t2 on t1.a1 = t2.a1;'
go
EXEC dbo.read_dist_recommendation;
go
```

### 3. View recommendations

The `dbo.read_dist_recommendation` system stored procedure will return recommendations in the following format when execution is completed:

| **Column name** |    **Description** |
|--------------- | --------------- |
|Table_name    |    The table that DA analyzed. One line per table regardless of change in recommendation.|
|Current_Distribution    |    Current table distribution strategy.|
|Recommended_Distribution    |    Recommended distribution. This can be the same as `Current_Distribution` if there is no change recommended.|
|Distribution_Change_Command    |   A CTAS T-SQL command to implement the recommendation.|

### 4. Implement the advice

- Run the CTAS command provided by Distribution Advisor to create new tables with the recommended distribution strategy.
- Modify queries to run on new tables.
- Execute queries on old and new tables to compare for performance improvements.

> [!NOTE]
> To help us improve Distribution Advisor, please fill out this [quick survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7MrzmOZCYJNjGsSytTeg4VUM1AwTlYyRVdFWFpPV0M1UERKRzU0TlJGUy4u).

## Troubleshooting

This section contains common troubleshooting scenarios and common mistakes that you may encounter.

### 1. Stale state from a previous run of the advisor

##### 1a. Symptom:

You see this error message upon running the advisor:

```output
Msg 110813, Level 16, State 1, Line 1
Calling GetLastScalarResult() before executing scalar subquery.
```

##### 1b. Mitigation:

- Verify that you are using single quotes '' to run the advisor on select queries.
- Start a new session in SSMS and run the advisor.

### 2. Errors during running the advisor
    
##### 2a. Symptom:
    
The 'result' pane shows `CommandToInvokeAdvisorString` below but does not show the `RecommendationOutput` below.

For example, you see only the `Command_to_Invoke_Distribution_Advisor` resultset.

:::image type="content" source="./media/distribution-advisor/troubleshooting-2.png" alt-text="Screenshot of the output of a T-SQL result showing the Command_to_Invoke_Distribution_Advisor.":::
    
But not the second resultset containing the table change T-SQL commands:  

:::image type="content" source="media/distribution-advisor/troubleshooting-3.png" alt-text="Screenshot of the output of a T-SQL result showing the Command_to_Invoke_Distribution_Advisor with a second resultset containing table change T-SQL commands.":::


##### 2b. Mitigation:

 - Check the output of `CommandToInvokeAdvisorString` above. 

 - Remove queries that may not be valid anymore which may have been added here from either the hand-selected queries or from the DMV by editing `WHERE` clause in: [Queries Considered by DA](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/e2e_queries_used_for_recommendations.sql).

### 3. Error during post-processing of recommendation output
    
##### 3a. Symptom:

You see the following error message.

```output
Invalid length parameter passed to the LEFT or SUBSTRING function.
```
    
##### 3b. Mitigation:
Ensure that you have the most up to date version of the stored procedure from GitHub:

 - [e2e_queries_used_for_recommendations.sql script available for download from GitHub](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/e2e_queries_used_for_recommendations.sql)

 - [CreateDistributionAdvisor_PublicPreview.sql script available for download from GitHub](https://github.com/microsoft/Azure_Synapse_Toolbox/blob/master/Distribution_Advisor/CreateDistributionAdvisor_PublicPreview.sql)


## Azure Synapse product group feedback

To help us improve Distribution Advisor, please fill out this [quick survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7MrzmOZCYJNjGsSytTeg4VUM1AwTlYyRVdFWFpPV0M1UERKRzU0TlJGUy4u).

If you need information not provided in this article, search the [Microsoft Q&A question page for Azure Synapse](/answers/topics/azure-synapse-analytics.html) is a place for you to pose questions to other users and to the Azure Synapse Analytics Product Group.  

We actively monitor this forum to ensure that your questions are answered either by another user or one of us.  If you prefer to ask your questions on Stack Overflow, we also have an [Azure Synapse Analytics Stack Overflow Forum](https://stackoverflow.com/questions/tagged/azure-synapse).

For feature requests, use the [Azure Synapse Analytics Feedback](https://feedback.azure.com/forums/307516-sql-data-warehouse) page.  Adding your requests or up-voting other requests helps us to focus on the most in-demand features.

## Next steps

- [SET RECOMMENDATIONS (Transact-SQL)](/sql/t-sql/statements/set-recommendations-sql?view=azure-sqldw-latest&preserve-view=true)
- [Loading data to dedicated SQL pool](../sql-data-warehouse/load-data-wideworldimportersdw.md) 
- [Data loading strategies for dedicated SQL pool in Azure Synapse Analytics](../sql-data-warehouse/design-elt-data-loading.md).
- [Dedicated SQL pool (formerly SQL DW) architecture in Azure Synapse Analytics](../sql-data-warehouse/massively-parallel-processing-mpp-architecture.md)
- [Cheat sheet for dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics](../sql-data-warehouse/cheat-sheet.md)
