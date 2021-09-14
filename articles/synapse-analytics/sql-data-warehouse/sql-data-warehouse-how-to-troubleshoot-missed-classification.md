---
title: Troubleshoot missed classification Scenarios for dedicated SQL Pool
description: Identify and troubleshoot scenarios where workloads are mis-classified to unintended workload groups.   
author: SudhirRaparla
ms.author: nvraparl
manager: craigg
ms.service: synapse-analytics
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.subservice: sql-dw 
ms.date: 09/13/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---


# Troubleshooting a missed classification

Guidance on how to troubleshoot a missed workload classification how to identify reason behind the classification.

Azure Synapse Analytics provides capabilities to perform workload management by [Classifying workloads to appropriate workload groups](sql-data-warehouse-workload-classification.md), [Assigning importance](sql-data-warehouse-workload-importance.md) and then [isolating resources](sql-data-warehouse-workload-isolation.md)  to achieve desired SLAs. Combination of these capabilities offer a potent solution that lets users manage workloads with high precision to achieve desired performance objectives. However, in some scenarios this combination can lead to workload classification that do not reflect user intent. This article lists such common scenarios and how to troubleshoot them. Before we get into the scenarios, let us see how to get basic information for troubleshooting missed classification scenarios.

## Gather basic troubleshooting information

To troubleshoot a missed classification scenario following information is needed:
1)	List of all workload groups
2)	List of all workload classifiers and associated workload groups
3)	List of users and mapped workload groups (system and user defined) 
4)  Workload Group and Classifier details of a Request


### Workload Groups
To get a list of all workload groups(including system workload groups) and associated details in Azure Portal  
1)	Go to Azure Synapse workspace under which the Dedicated SQL Pool of interest is created
2)	On the left side pane select **SQL Pools** under Analytical Pools section. All SQL Pools created under the workspace are listed.
3)	Select Dedicated SQL Pool of interest.
4)	In the left side pane select **Workload Management** under **Settings**
5)	Under **Workload Groups** section list of all workloads are listed. Please note by default only **User Defined Workload groups** are listed. To view list of all Workload groups edit filter and **Select All**.

![query results](./media/sql-data-warehouse-how-to-troubleshoot-missed-classification/filter-all-workload-groups.png)

To view the list of all Workload groups by querying Catalog views using T-SQL [connect to  Dedicated SQL Pool using SSMS](././sql/get-started-ssms.md) and issue following query:
 
```sql
select * FROM sys.workload_management_workload_groups
```

### Workload Classifiers

To get a list of Workload classifiers(including inbuilt classifiers) by workload group and associated details in Azure Portal click on the numbers listed in Classifiers column in the Workload Group list 
![query results](./media/sql-data-warehouse-how-to-troubleshoot-missed-classification/view-workload-classifiers.png)

To get a list of all Workload Classifiers(including System defined) using T-SQL, you can use following query:

```sql
select * FROM sys.workload_management_workload_classifiers 
```

### Users and mapped Resource Classes

To get a list of system defined Resource classes and mapped users, please use following query:

```sql
SELECT  r.name AS [Resource Class]
,       m.name AS membername
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r ON rm.role_principal_id = r.principal_id
JOIN    sys.database_principals AS m ON rm.member_principal_id = m.principal_id
WHERE   r.name IN ('mediumrc','largerc','xlargerc','staticrc10','staticrc20','staticrc30','staticrc40','staticrc50','staticrc60','staticrc70','staticrc80');
```

### Workload Group and Classifier details of a Request

First step in troubleshooting a missed classification problem is to identify which Workload group executed and which workload classifier routed a query. [Sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) DMV gives information on workload group and classifier at a request level in addition to other request statistics. To get a list of all requests and associated workload group and classifier, use this SQL:

```sql
SELECT * from sys.dm_pdw_exec_requests;
```

## List of Common scenarios of missed Classifications
Here is a list of common scenarios where unintended missed classification of workloads can happen:

### Mixed usage of Resource Classes and user defined Workload Management

In scenarios where Resource classes are used along with user defined workload groups user role to resource class mappings can conflict with workload classifiers precedence that can lead to mis classification. Consider following scenario:
* A database user say DBAUser is assigned to the largerc resource class role. The resource class assignment was done using sp_addrolemember.
* DBAUser has created new workload groups and classifiers using workload management.
* One of the created workload classifier maps database role DBARole (DBAUser is a member of this role) to mediumrc resource class with high importance.  
* When DBAUser runs a query, the query is expected to be assigned to mediumrc based on workload classifier. Instead it will be assigned to largerc, as **user** mapping takes precedence over **role membership** mapping to a classifier.

It is best to avoid mixing usage of Resource Classes and Workload Management groups to perform Workload management. Steps to convert Resource classes to Workloads are documented [here](sql-data-how-to-warehouse-convert-resource-classes-workload-groups.md). However, there can be situations where both Resource classes and Workload Management need to be used together. In such scenarios to simplify troubleshooting misclassification, recommendation is to remove resource class role mappings as you create workload classifiers. The code below returns existing resource class role memberships. Run [sp_droprolemember](/sql/relational-databases/system-stored-procedures/sp-droprolemember-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for each member name returned from the corresponding resource class.

```sql
SELECT  r.name AS [Resource Class]
, m.name AS membername
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r ON rm.role_principal_id = r.principal_id
JOIN    sys.database_principals AS m ON rm.member_principal_id = m.principal_id
WHERE   r.name IN ('mediumrc','largerc','xlargerc','staticrc10','staticrc20','staticrc30','staticrc40','staticrc50','staticrc60','staticrc70','staticrc80');

--for each row returned run
sp_droprolemember '[Resource Class]', membername
```

### System Administrators and DBOs are always mapped to smallrc Workload Group
Let us consider a scenario where System Administrator or dbo has either created a workload classifier or got added to a resource class role other than smallrc to run queries against a workload group other than default smallrc. Using query mentioned in **Users and Mapped Resource Classes** section above Service Admin verified the role/member and it shows the updated workload group. But all queries executed by the user are running under smallrc workload group, irrespective of workload classifier or resource class role assignment. 

**Recommendation**: Service Administrators cannot change their default workload group as documented [here](resource-classes-for-workload-management.md#default-resource-class). Service administrator is the user or role specified during provisioning process and it can either be a Server Admin Login or Active Directory admin. To identify service administrator go to properties blade of the dedicated SQL Pool. Here is a snapshot:

![query results](./media/sql-data-warehouse-how-to-troubleshoot-missed-classification/identify-sql-admin.png)

Similarly dbo and db_owner roles cannot change their default workload group i.e., If a user is either dbo or added under db_owner role owner all workloads executed by them go to smallrc by default. These roles themselves cannot be added to a different resource classes, but if a user who is added to this role would like to classify their workload to a different workload group they can do so using membername option available in [workload classifier definition](sql-data-warehouse-workload-classification.md).

### Use Workload Group Precedence for accurate and precise classification

In scenarios where there are multiple workload classifiers that are either mapped to a multiple workload groups or to multiple roles/users, precedence order of classifiers determine which classifiers are used. There are multiple options to influence precedence order. 

 
**Recommendation:** As mentioned in mixing Resource Classes and user defined Workload Management section, it is not recommended to combine usage of Resource classes and user defined Workload Management groups/classes.

**If Resource Classes are being used:**
In Scenarios where Resource Classes are being used it is best to create a dedicated user for each type of workload being run. However if a user is a member of multiple resource classes then as documented in [Resource Class Precedence](resource-classes-for-workload-management.md#resource-class-precedence) 
1)	Dynamic resource class takes precedence over static resource class. For example if a user is member of mediumrc(dynamic) and staticrc80(static) user queries run with mediumrc
2)	Bigger resource classes are preferred over Smaller resource classes. For example if a user is member of staticrc20 and staticrc80 then user queries will run with staticrc80.

**If Workload Management Capabilities are used:**
WLM has provision to create multiple workload classifiers against same user or workload group which help in classifying workloads with higher precision by providing multiple parameters which have a defined order of precedence. Here is the full list of the precedence of parameters along with weightage:
1.	User - 64
2.	Role - 32
3.	WLM_Label - 16
4.	WLM_Context - 8
5.	Start_Time/End_Time - 4

Let us see this precedence in action using an example.

**Example**
If a user creates two Workload Classifiers as follows:

```sql
CREATE WORKLOAD CLASSIFIER CLASSIFIER-1 WITH  
( WORKLOAD_GROUP = 'wgDataLoad'
 ,MEMBERNAME     = 'USER-1'  
 ,WLM_LABEL      = 'dimension_loads' 
 ,IMPORTANCE     = 'High');

CREATE WORKLOAD CLASSIFIER CLASSIFIER-2 WITH  
( WORKLOAD_GROUP = 'wgUserqueries'
 ,MEMBERNAME     = 'USER-1'  
 ,START_TIME     = '18:00' 
 ,END_TIME       = '07:30'
 ,IMPORTANCE     = 'Low')
```

Queries submitted by User-1 can be submitted via both classifiers. If User-1 runs a query with a label equal to dimension_loads between 6PM and 7AM UTC, the request will be classified to the wgDashboards workload group with HIGH importance. The expectation may be to classify the request to wgUserQueries with LOW importance for off-hours reporting, but the weighting of WLM_LABEL is higher than START_TIME/END_TIME. The weighting of classifier-1 is 80 (64 for user, plus 16 for WLM_LABEL). The weighting of classifier-2 is 68 (64 for user, 4 for START_TIME/END_TIME). More details on [Classification weighting](resource-classes-for-workload-management.md#classification-weighting).

### What happens if Precedence in Workload Classification leads to a tie

Even after workload classifier precedence is applied, there is a possibility that a request could still classify to multiple workload groups. For example consider following classifiers:

```sql
CREATE WORKLOAD CLASSIFIER CLASSIFIER-1 WITH  
( WORKLOAD_GROUP = 'wgDataLoad'
 ,MEMBERNAME     = 'USER-1'  
 ,WLM_LABEL      = 'dimension_loads' 
 ,IMPORTANCE     = 'High');

CREATE WORKLOAD CLASSIFIER CLASSIFIER-2 WITH  
( WORKLOAD_GROUP = 'wgUserqueries'
 ,MEMBERNAME     = 'USER-1'  
 ,WLM_LABEL      = 'dimension_loads' 
 ,IMPORTANCE     = 'Low');
```

If a user runs a query with Option set to Label = 'dimension_loads'. Based on Workload Classifier precedence above the request can be classified to either wgDataLoad or wgUserqueries. But which workload group is actually chosen?

**Resolution:** 
In scenarios where there is a tie in workload groups, following precedence applies to choosing the workload classifier and group:
1.	The workload group with the highest resource allocation is chosen.  The behavior optimizes for performance and is backward compatible to the behavior of choosing resource classes when logins are members of multiple resource classes.  

**Example:** Let us consider following two Workload Groups and Workload Classifiers

```sql
-- Workload Groups
CREATE WORKLOAD GROUP wgDataLoad
WITH
( MIN_PERCENTAGE_RESOURCE = 26 
,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 2              
,CAP_PERCENTAGE_RESOURCE = 100 )

CREATE WORKLOAD GROUP wgUserqueries
WITH
( MIN_PERCENTAGE_RESOURCE = 15
,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 5               
,CAP_PERCENTAGE_RESOURCE = 50 );

--Workload Classifiers
CREATE WORKLOAD CLASSIFIER CLASSIFIER-1 WITH  
( WORKLOAD_GROUP = 'wgDataLoad'
,MEMBERNAME     = 'USER-1'  
,WLM_LABEL      = 'dimension_loads' 
,IMPORTANCE     = 'High');

CREATE WORKLOAD CLASSIFIER CLASSIFIER-2 WITH  
( WORKLOAD_GROUP = 'wgUserqueries'
,MEMBERNAME     = 'USER-1'  
,WLM_LABEL      = 'dimension_loads' 
,IMPORTANCE     = 'High');
```
              
If a user runs a query with Option set to Label = 'dimension_loads', both the classifiers have a tie as the query meets criteria for both the classifiers. However request will be routed to wgUserQueries workload group as it has higher minimum resource allocation per request.

2.	Concurrency setting and Available Concurrency for respective workload groups. Workload group with the highest available concurrency at a time when request arrived will give the query best chance of executing. 
**Example:** Let us consider following two Workload Groups and Workload Classifiers
```sql
--Workload Groups
CREATE WORKLOAD GROUP wgDataLoad
WITH
( MIN_PERCENTAGE_RESOURCE = 30              
 ,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 2 (concurrency of 15)
 ,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 2
 ,CAP_PERCENTAGE_RESOURCE = 100 );

CREATE WORKLOAD GROUP wgUserqueries
WITH
( MIN_PERCENTAGE_RESOURCE = 30
 ,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 2 (concurrency of 15)
 ,REQUEST_MIN_RESOURCE_GRANT_PERCENT = 2
 ,CAP_PERCENTAGE_RESOURCE = 100 );

-- Workload Classifiers
CREATE WORKLOAD CLASSIFIER CLASSIFIER-1 WITH  
( WORKLOAD_GROUP = 'wgDataLoad'
 ,MEMBERNAME     = 'USER-1'  
 ,WLM_LABEL      = 'dimension_loads' 
 ,IMPORTANCE     = 'High');

CREATE WORKLOAD CLASSIFIER CLASSIFIER-2 WITH  
( WORKLOAD_GROUP = 'wgUserqueries'
 ,MEMBERNAME     = 'USER-1'  
 ,WLM_LABEL      = 'dimension_loads' 
 ,IMPORTANCE     = 'High');
```
              
If a user runs a query with Option set to Label = 'dimension_loads', both the classifiers have a tie as the query meets criteria for both the classifiers. Let us assume by the time user runs the query, 5 concurrent queries are getting executed in wgUserqueries workload group and 10 queries are getting executed wgDataLoad. Request will be routed to wgUserqueries workload group using CLASSIFIER-2 as wgUserqueries workload group has higher available concurrency at the time user submitted query.

3.	Importance setting of the classified request. Request will be routed to Workload group that has highest importance if there is a tie in Workload Classification using precedence rules mentioned above. 
4.	Creation time of the workload group. Request will be routed to the workload group that is created latest. 


## Next steps
- For more information on Classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).
- For more information on Importance, see [Workload Importance](sql-data-warehouse-workload-importance.md)

> [!div class="nextstepaction"]
> [Go to Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md)
 