<properties 
	pageTitle="SQL Server Stored Procedure Activity" 
	description="Learn how you can use the SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database or Azure SQL Data Warehouse from a Data Factory pipeline." 
	services="data-factory" 
	documentationCenter="" 
	authors="spelluru" 
	manager="jhubbard" 
	editor="monicar"/>

<tags 
	ms.service="data-factory" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/30/2015" 
	ms.author="spelluru"/>

# SQL Server Stored Procedure Activity

You can use the SQL Server Stored Procedure activity in a Data Factory [pipeline](data-factory-create-pipelines.md) to invoke a stored procedure in an **Azure SQL Database** or an **Azure SQL Data Warehouse** . This article builds on the [data transformation activities](data-factory-data-transformation-activities.md) article which presents a general overview of data transformation and the supported transformation activities.

## Syntax
	{
    	"name": "SQLSPROCActivity",
    	"description": "description", 
    	"type": "SqlServerStoredProcedure",
    	"inputs":  [ { "name": "inputtable"  } ],
    	"outputs":  [ { "name": "outputtable" } ],
    	"typeProperties":
    	{
        	"storedProcedureName": "<name of the stored procedure>",
        	"storedProcedureParameters":  
        	{
				"param1": "param1Value"
				…
        	}
    	}
	}

## Syntax details

Property | Description | Required
-------- | ----------- | --------
name | Name of the activity | Yes
description | Text describing what the activity is used for | No
type | SqlServerStoredProcedure | Yes
inputs | Input dataset(s) that must be available (in ‘Ready’ status) for the stored procedure activity to execute. The input(s) to the stored procedure activity only serve as dependency management when chaining this activity with others. The input dataset(s) cannot be consumed in the stored procedure as a parameter | No
outputs | Output dataset(s) produced by the stored procedure activity. Ensure that the output table uses a linked service that links an Azure SQL Database or an Azure SQL Data Warehouse to the data factory. The output(s) in the stored procedure activity can serve as a way to pass the result of the stored procedure activity for subsquent processing and/or it can serve as dependency management when chaining this activity with others | Yes
storedProcedureName | Specify the name of the stored procedure in the Azure SQL database or Azure SQL Data Warehouse that is represented by the  linked service that the output table uses. | Yes
storedProcedureParameters | Specify values for stored procedure parameters | No

## Example

Let’s consider an example where you want to create a table in Azure SQL database that has two columns: 

Column | Type
------ | ----
ID | An uniqueidentifier
Datetime | Date & time when the corresponding ID was generated

![Sample data](./media/data-factory-stored-proc-activity/sample-data.png)

	CREATE PROCEDURE sp_sample @DateTime nvarchar(127)
	AS
	
	BEGIN
	    INSERT INTO [sampletable]
	    VALUES (newid(), @DateTime)
	END

> [AZURE.NOTE] **Name** and **casing** of the parameter (DateTime in this example) must match that of parameter specified in the activity JSON below. In the stored procedure definition, ensure that **@** is used as a prefix for the parameter.   

To execute this stored procedure in a Data Factory pipeline, you need to the do the following:

1.	Create a [linked service](data-factory-azure-sql-connector.md/#azure-sql-linked-service-properties)  to register the connection string of the Azure SQL database where the stored procedure should be executed.
2.	Create a [dataset](data-factory-azure-sql-connector.md/#azure-sql-dataset-type-properties)  pointing to the output table in the Azure SQL database. Let’s call this dataset sprocsampleout. This dataset should reference the linked service in step #1. 
3.	Create the stored procedure in the Azure SQL Database.
4.	Create the below [pipeline](data-factory-azure-sql-connector.md/#azure-sql-copy-activity-type-properties)  with the SqlServerStoredProcedure activity to invoke the stored procedure in Azure SQL Database.

		{
		    "name": "SprocActivitySamplePipeline",
		    "properties":
		    {
		        "activities":
		        [
		            {
		            	"name": "SprocActivitySample",
		             	"type": " SqlServerStoredProcedure",
		             	"outputs": [ {"name": "sprocsampleout"} ],
		             	"typeProperties":
		              	{
		                	"storedProcedureName": "sp_sample",
			        		"storedProcedureParameters": 
		        			{
		            			"DateTime": "$$Text.Format('{0:yyyy-MM-dd HH:mm:ss}', SliceStart)"
		        			}
						}
	            	}
		        ]
		     }
		}
5.	Deploy the [pipeline](data-factory-create-pipelines.md).
6.	[Monitor the pipeline](data-factory-monitor-manage-pipelines.md) using the data factory monitoring and management views.

> [AZURE.NOTE] In the above example, the SprocActivitySample has no inputs. If you want to chain this with an activity upstream (i.e. prior processing), the output(s) of the upstream activity can be used as input(s) in this activity.  In such a  case, this activity will not execute until the upstream activity is completed and the output(s) of the upstream activities are available (in Ready status). The input(s) cannot be used directly as a parameter to the stored procedure activity
> 
> The names and casing (upper/lower) of stored procedure parameters in the JSON file must match the names of stored procedure parameters in the target database.

Now, let’s consider adding another column named ‘Scenario’ in the table containing a static value called ‘Document sample’.

![Sample data 2](./media/data-factory-stored-proc-activity/sample-data-2.png)

	CREATE PROCEDURE sp_sample @DateTime nvarchar(127) , @Scenario nvarchar(127)
	
	AS
	
	BEGIN
	    INSERT INTO [sampletable]
	    VALUES (newid(), @DateTime, @Scenario)
	END

To accomplish this, pass the Scenario parameter and the value from the stored procedure activity. The typeProperties section in the above sample looks like this:

	"typeProperties":
	{
		"storedProcedureName": "sp_sample",
	    "storedProcedureParameters": 
	    {
	    	"DateTime": "$$Text.Format('{0:yyyy-MM-dd HH:mm:ss}', SliceStart)",
			"Scenario": "Document sample"
		}
	}
