---
title: 'Incrementally copy multiple tables by using Azure Data Factory | Microsoft Docs'
description: 'In this tutorial, you create an Azure Data Factory pipeline that copies delta data incrementally from multiple tables in an on-premises SQL Server database to an Azure SQL database.'
services: data-factory
documentationcenter: ''
author: dearandyxu
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: tutorial
ms.date: 01/22/2018
ms.author: yexu
---
# Incrementally load data from multiple tables in SQL Server to an Azure SQL database
In this tutorial, you create an Azure data factory with a pipeline that loads delta data from multiple tables in on-premises SQL Server to an Azure SQL database.    

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Prepare source and destination data stores.
> * Create a data factory.
> * Create a self-hosted integration runtime.
> * Install the integration runtime. 
> * Create linked services. 
> * Create source, sink, and watermark datasets.
> * Create, run, and monitor a pipeline.
> * Review the results.
> * Add or update data in source tables.
> * Rerun and monitor the pipeline.
> * Review the final results.

## Overview
Here are the important steps to create this solution: 

1. **Select the watermark column**.
	Select one column for each table in the source data store, which can be used to identify the new or updated records for every run. Normally, the data in this selected column (for example, last_modify_time or ID) keeps increasing when rows are created or updated. The maximum value in this column is used as a watermark.

1. **Prepare a data store to store the watermark value**.   
	In this tutorial, you store the watermark value in a SQL database.

1. **Create a pipeline with the following activities**: 
	
	a. Create a ForEach activity that iterates through a list of source table names that is passed as a parameter to the pipeline. For each source table, it invokes the following activities to perform delta loading for that table.

    b. Create two lookup activities. Use the first Lookup activity to retrieve the last watermark value. Use the second Lookup activity to retrieve the new watermark value. These watermark values are passed to the Copy activity.

	c. Create a Copy activity that copies rows from the source data store with the value of the watermark column greater than the old watermark value and less than the new watermark value. Then, it copies the delta data from the source data store to Azure Blob storage as a new file.

	d. Create a StoredProcedure activity that updates the watermark value for the pipeline that runs next time. 

    Here is the high-level solution diagram: 

    ![Incrementally load data](media/tutorial-incremental-copy-multiple-tables-powershell/high-level-solution-diagram.png)


If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites
* **SQL Server**. You use an on-premises SQL Server database as the source data store in this tutorial. 
* **Azure SQL Database**. You use a SQL database as the sink data store. If you don't have a SQL database, see [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) for steps to create one. 

### Create source tables in your SQL Server database

1. Open SQL Server Management Studio, and connect to your on-premises SQL Server database.

1. In **Server Explorer**, right-click the database and choose **New Query**.

1. Run the following SQL command against your database to create tables named `customer_table` and `project_table`:

    ```sql
    create table customer_table
    (
        PersonID int,
        Name varchar(255),
        LastModifytime datetime
    );
    
    create table project_table
    (
        Project varchar(255),
        Creationtime datetime
    );
        
    INSERT INTO customer_table
    (PersonID, Name, LastModifytime)
    VALUES
    (1, 'John','9/1/2017 12:56:00 AM'),
    (2, 'Mike','9/2/2017 5:23:00 AM'),
    (3, 'Alice','9/3/2017 2:36:00 AM'),
    (4, 'Andy','9/4/2017 3:21:00 AM'),
    (5, 'Anny','9/5/2017 8:06:00 AM');
    
    INSERT INTO project_table
    (Project, Creationtime)
    VALUES
    ('project1','1/1/2015 0:00:00 AM'),
    ('project2','2/2/2016 1:23:00 AM'),
    ('project3','3/4/2017 5:16:00 AM');
    
    ```

### Create destination tables in your Azure SQL database
1. Open SQL Server Management Studio, and connect to your SQL Server database.

1. In **Server Explorer**, right-click the database and choose **New Query**.

1. Run the following SQL command against your SQL database to create tables named `customer_table` and `project_table`:  
    
    ```sql
    create table customer_table
    (
        PersonID int,
        Name varchar(255),
        LastModifytime datetime
    );
    
    create table project_table
    (
        Project varchar(255),
        Creationtime datetime
    );

	```

### Create another table in the Azure SQL database to store the high watermark value
1. Run the following SQL command against your SQL database to create a table named `watermarktable` to store the watermark value: 
    
    ```sql
    create table watermarktable
    (
    
        TableName varchar(255),
        WatermarkValue datetime,
    );
    ```
1. Insert initial watermark values for both source tables into the watermark table.

    ```sql

    INSERT INTO watermarktable
    VALUES 
    ('customer_table','1/1/2010 12:00:00 AM'),
    ('project_table','1/1/2010 12:00:00 AM');
    
    ```

### Create a stored procedure in the Azure SQL database 

Run the following command to create a stored procedure in your SQL database. This stored procedure updates the watermark value after every pipeline run. 

```sql
CREATE PROCEDURE usp_write_watermark @LastModifiedtime datetime, @TableName varchar(50)
AS

BEGIN

    UPDATE watermarktable
    SET [WatermarkValue] = @LastModifiedtime 
WHERE [TableName] = @TableName

END

```

### Create data types and additional stored procedures in the Azure SQL database
Run the following query to create two stored procedures and two data types in your SQL database. 
They're used to merge the data from source tables into destination tables. 

In order to make the journey easy to start with, we directly use these Stored Procedures passing the delta data in via a table variable and then merge the them into destination store. Be cautious that it is not expecting a "large" number of delta rows (more than 100) to be stored in the table variable.  

If you do need to merge a large number of delta rows into the destination store, we suggest you to use copy activity to copy all the delta data into a temporary "staging" table in the destination store first, and then built your own stored procedure without using table variable to merge  them from the “staging” table to the “final” table. 


```sql
CREATE TYPE DataTypeforCustomerTable AS TABLE(
    PersonID int,
    Name varchar(255),
    LastModifytime datetime
);

GO

CREATE PROCEDURE usp_upsert_customer_table @customer_table DataTypeforCustomerTable READONLY
AS

BEGIN
  MERGE customer_table AS target
  USING @customer_table AS source
  ON (target.PersonID = source.PersonID)
  WHEN MATCHED THEN
      UPDATE SET Name = source.Name,LastModifytime = source.LastModifytime
  WHEN NOT MATCHED THEN
      INSERT (PersonID, Name, LastModifytime)
      VALUES (source.PersonID, source.Name, source.LastModifytime);
END

GO

CREATE TYPE DataTypeforProjectTable AS TABLE(
    Project varchar(255),
    Creationtime datetime
);

GO

CREATE PROCEDURE usp_upsert_project_table @project_table DataTypeforProjectTable READONLY
AS

BEGIN
  MERGE project_table AS target
  USING @project_table AS source
  ON (target.Project = source.Project)
  WHEN MATCHED THEN
      UPDATE SET Creationtime = source.Creationtime
  WHEN NOT MATCHED THEN
      INSERT (Project, Creationtime)
      VALUES (source.Project, source.Creationtime);
END

```

### Azure PowerShell
Install the latest Azure PowerShell modules by following the instructions in [Install and configure Azure PowerShell](/powershell/azure/azurerm/install-azurerm-ps).

## Create a data factory
1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) in double quotation marks, and then run the command. An example is `"adfrg"`. 
   
     ```powershell
    $resourceGroupName = "ADFTutorialResourceGroup";
    ```

    If the resource group already exists, you might not want to overwrite it. Assign a different value to the `$resourceGroupName` variable, and run the command again.

1. Define a variable for the location of the data factory. 

    ```powershell
    $location = "East US"
    ```
1. To create the Azure resource group, run the following command: 

    ```powershell
    New-AzureRmResourceGroup $resourceGroupName $location
    ``` 
    If the resource group already exists, you might not want to overwrite it. Assign a different value to the `$resourceGroupName` variable, and run the command again.

1. Define a variable for the data factory name. 

    > [!IMPORTANT]
    >  Update the data factory name to make it globally unique. An example is ADFIncMultiCopyTutorialFactorySP1127. 

    ```powershell
    $dataFactoryName = "ADFIncMultiCopyTutorialFactory";
    ```
1. To create the data factory, run the following **Set-AzureRmDataFactoryV2** cmdlet: 
    
    ```powershell       
    Set-AzureRmDataFactoryV2 -ResourceGroupName $resourceGroupName -Location $location -Name $dataFactoryName 
    ```

Note the following points:

* The name of the data factory must be globally unique. If you receive the following error, change the name and try again:

    ```
    The specified Data Factory name 'ADFIncMultiCopyTutorialFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to sign in to Azure must be a member of contributor or owner roles, or an administrator of the Azure subscription.
* For a list of Azure regions in which Data Factory is currently available, select the regions that interest you on the following page, and then expand **Analytics** to locate **Data Factory**: [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). The data stores (Azure Storage, SQL Database, etc.) and computes (Azure HDInsight, etc.) used by the data factory can be in other regions.

[!INCLUDE [data-factory-create-install-integration-runtime](../../includes/data-factory-create-install-integration-runtime.md)]



## Create linked services
You create linked services in a data factory to link your data stores and compute services to the data factory. In this section, you create linked services to your on-premises SQL Server database and SQL database. 

### Create the SQL Server linked service
In this step, you link your on-premises SQL Server database to the data factory.

1. Create a JSON file named SqlServerLinkedService.json in the C:\ADFTutorials\IncCopyMultiTableTutorial folder with the following content. Select the right section based on the authentication you use to connect to SQL Server. Create the local folders if they don't already exist. 

    > [!IMPORTANT]
    > Select the right section based on the authentication you use to connect to SQL Server.

    If you use SQL authentication, copy the following JSON definition:

	```json
	{
		"properties": {
			"type": "SqlServer",
			"typeProperties": {
				"connectionString": {
					"type": "SecureString",
					"value": "Server=<servername>;Database=<databasename>;User ID=<username>;Password=<password>;Timeout=60"
				}
			},
			"connectVia": {
				"type": "integrationRuntimeReference",
				"referenceName": "<integration runtime name>"
			}
		},
		"name": "SqlServerLinkedService"
	}
   ```    
    If you use Windows authentication, copy the following JSON definition:

    ```json
    {
        "properties": {
            "type": "SqlServer",
            "typeProperties": {
                "connectionString": {
                    "type": "SecureString",
                    "value": "Server=<server>;Database=<database>;Integrated Security=True"
                },
                "userName": "<user> or <domain>\\<user>",
                "password": {
                    "type": "SecureString",
                    "value": "<password>"
                }
            },
            "connectVia": {
                "type": "integrationRuntimeReference",
                "referenceName": "<integration runtime name>"
            }
        },
        "name": "SqlServerLinkedService"
    }    
    ```
    > [!IMPORTANT]
    > - Select the right section based on the authentication you use to connect to SQL Server.
    > - Replace &lt;integration runtime name> with the name of your integration runtime.
    > - Replace &lt;servername>, &lt;databasename>, &lt;username>, and &lt;password> with values of your SQL Server database before you save the file.
    > - If you need to use a slash character (`\`) in your user account or server name, use the escape character (`\`). An example is `mydomain\\myuser`.

1. In PowerShell, switch to the C:\ADFTutorials\IncCopyMultiTableTutorial folder.

1. Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service AzureStorageLinkedService. In the following example, you pass values for the *ResourceGroupName* and *DataFactoryName* parameters: 

    ```powershell
    Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "SqlServerLinkedService" -File ".\SqlServerLinkedService.json"
    ```

    Here is the sample output:

    ```json
    LinkedServiceName : SqlServerLinkedService
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ADFIncMultiCopyTutorialFactory1201
    Properties        : Microsoft.Azure.Management.DataFactory.Models.SqlServerLinkedService
    ```

### Create the SQL database linked service
1. Create a JSON file named AzureSQLDatabaseLinkedService.json in C:\ADFTutorials\IncCopyMultiTableTutorial folder with the following content. (Create the folder ADF if it doesn't already exist.) Replace &lt;server&gt;, &lt;database name&gt;, &lt;user id&gt;, and &lt;password&gt; with the name of your SQL Server database, name of your database, user ID, and password before you save the file. 

    ```json
    {
    	"name": "AzureSQLDatabaseLinkedService",
    	"properties": {
    		"type": "AzureSqlDatabase",
    		"typeProperties": {
    			"connectionString": {
    				"value": "Server = tcp:<server>.database.windows.net,1433;Initial Catalog=<database name>; Persist Security Info=False; User ID=<user name>; Password=<password>; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30;",
    				"type": "SecureString"
    			}
    		}
    	}
    }
    ```
1. In PowerShell, run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service AzureSQLDatabaseLinkedService. 

    ```powershell
    Set-AzureRmDataFactoryV2LinkedService -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "AzureSQLDatabaseLinkedService" -File ".\AzureSQLDatabaseLinkedService.json"
    ```

    Here is the sample output:

    ```json
    LinkedServiceName : AzureSQLDatabaseLinkedService
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ADFIncMultiCopyTutorialFactory1201
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlDatabaseLinkedService
    ```

## Create datasets
In this step, you create datasets to represent the data source, the data destination, and the place to store the watermark.

### Create a source dataset

1. Create a JSON file named SourceDataset.json in the same folder with the following content: 

    ```json
    {
        "name": "SourceDataset",
		"properties": {
			"type": "SqlServerTable",
			"typeProperties": {
				"tableName": "dummyName"
			},
			"linkedServiceName": {
				"referenceName": "SqlServerLinkedService",
				"type": "LinkedServiceReference"
			}
		}
    }
   
    ```

    The table name is a dummy name. The Copy activity in the pipeline uses a SQL query to load the data rather than load the entire table.

1. Run the **Set-AzureRmDataFactoryV2Dataset** cmdlet to create the dataset SourceDataset.
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "SourceDataset" -File ".\SourceDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : SourceDataset
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ADFIncMultiCopyTutorialFactory1201
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.SqlServerTableDataset
    ```

### Create a sink dataset

1. Create a JSON file named SinkDataset.json in the same folder with the following content. The tableName element is set by the pipeline dynamically at runtime. The ForEach activity in the pipeline iterates through a list of table names and passes the table name to this dataset in each iteration. 

    ```json
    {
    	"name": "SinkDataset",
    	"properties": {
    		"type": "AzureSqlTable",
    		"typeProperties": {
    			"tableName": {
    				"value": "@{dataset().SinkTableName}",
    				"type": "Expression"
    			}
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureSQLDatabaseLinkedService",
    			"type": "LinkedServiceReference"
    		},
    		"parameters": {
    			"SinkTableName": {
    				"type": "String"
    			}
    		}
    	}
    }
    ```

1. Run the **Set-AzureRmDataFactoryV2Dataset** cmdlet to create the dataset SinkDataset.
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "SinkDataset" -File ".\SinkDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : SinkDataset
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ADFIncMultiCopyTutorialFactory1201
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlTableDataset
    ```

### Create a dataset for a watermark
In this step, you create a dataset for storing a high watermark value. 

1. Create a JSON file named WatermarkDataset.json in the same folder with the following content: 

    ```json
    {
    	"name": " WatermarkDataset ",
    	"properties": {
    		"type": "AzureSqlTable",
    		"typeProperties": {
    			"tableName": "watermarktable"
    		},
    		"linkedServiceName": {
    			"referenceName": "AzureSQLDatabaseLinkedService",
    			"type": "LinkedServiceReference"
    		}
    	}
    }    
    ```
1. Run the **Set-AzureRmDataFactoryV2Dataset** cmdlet to create the dataset WatermarkDataset.
    
    ```powershell
    Set-AzureRmDataFactoryV2Dataset -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "WatermarkDataset" -File ".\WatermarkDataset.json"
    ```

    Here is the sample output of the cmdlet:
    
    ```json
    DatasetName       : WatermarkDataset
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : <data factory name>
    Structure         :
    Properties        : Microsoft.Azure.Management.DataFactory.Models.AzureSqlTableDataset    
    ```

## Create a pipeline
The pipeline takes a list of table names as a parameter. The ForEach activity iterates through the list of table names and performs the following operations: 

1. Use the Lookup activity to retrieve the old watermark value (the initial value or the one that was used in the last iteration).

1. Use the Lookup activity to retrieve the new watermark value (the maximum value of the watermark column in the source table).

1. Use the Copy activity to copy data between these two watermark values from the source database to the destination database.

1. Use the StoredProcedure activity to update the old watermark value to be used in the first step of the next iteration. 

### Create the pipeline
1. Create a JSON file named IncrementalCopyPipeline.json in the same folder with the following content: 

    ```json
    {
    	"name": "IncrementalCopyPipeline",
    	"properties": {
    		"activities": [{
    
    			"name": "IterateSQLTables",
    			"type": "ForEach",
    			"typeProperties": {
    				"isSequential": "false",
    				"items": {
    					"value": "@pipeline().parameters.tableList",
    					"type": "Expression"
    				},
    
    				"activities": [
    					{
    						"name": "LookupOldWaterMarkActivity",
    						"type": "Lookup",
    						"typeProperties": {
    							"source": {
    								"type": "SqlSource",
    								"sqlReaderQuery": "select * from watermarktable where TableName  =  '@{item().TABLE_NAME}'"
    							},
    
    							"dataset": {
    								"referenceName": "WatermarkDataset",
    								"type": "DatasetReference"
    							}
    						}
    					},
    					{
    						"name": "LookupNewWaterMarkActivity",
    						"type": "Lookup",
    						"typeProperties": {
    							"source": {
    								"type": "SqlSource",
    								"sqlReaderQuery": "select MAX(@{item().WaterMark_Column}) as NewWatermarkvalue from @{item().TABLE_NAME}"
    							},
    
    							"dataset": {
    								"referenceName": "SourceDataset",
    								"type": "DatasetReference"
    							}
    						}
    					},
    
    					{
    						"name": "IncrementalCopyActivity",
    						"type": "Copy",
    						"typeProperties": {
    							"source": {
    								"type": "SqlSource",
    								"sqlReaderQuery": "select * from @{item().TABLE_NAME} where @{item().WaterMark_Column} > '@{activity('LookupOldWaterMarkActivity').output.firstRow.WatermarkValue}' and @{item().WaterMark_Column} <= '@{activity('LookupNewWaterMarkActivity').output.firstRow.NewWatermarkvalue}'"
    							},
    							"sink": {
    								"type": "SqlSink",
    								"SqlWriterTableType": "@{item().TableType}",
    								"SqlWriterStoredProcedureName": "@{item().StoredProcedureNameForMergeOperation}"
    							}
    						},
    						"dependsOn": [{
    								"activity": "LookupNewWaterMarkActivity",
    								"dependencyConditions": [
    									"Succeeded"
    								]
    							},
    							{
    								"activity": "LookupOldWaterMarkActivity",
    								"dependencyConditions": [
    									"Succeeded"
    								]
    							}
    						],
    
    						"inputs": [{
    							"referenceName": "SourceDataset",
    							"type": "DatasetReference"
    						}],
    						"outputs": [{
    							"referenceName": "SinkDataset",
    							"type": "DatasetReference",
    							"parameters": {
    								"SinkTableName": "@{item().TableType}"
    							}
    						}]
    					},
    
    					{
    						"name": "StoredProceduretoWriteWatermarkActivity",
    						"type": "SqlServerStoredProcedure",
    						"typeProperties": {
    
    							"storedProcedureName": "usp_write_watermark",
    							"storedProcedureParameters": {
    								"LastModifiedtime": {
    									"value": "@{activity('LookupNewWaterMarkActivity').output.firstRow.NewWatermarkvalue}",
    									"type": "datetime"
    								},
    								"TableName": {
    									"value": "@{activity('LookupOldWaterMarkActivity').output.firstRow.TableName}",
    									"type": "String"
    								}
    							}
    						},
    
    						"linkedServiceName": {
    							"referenceName": "AzureSQLDatabaseLinkedService",
    							"type": "LinkedServiceReference"
    						},
    
    						"dependsOn": [{
    							"activity": "IncrementalCopyActivity",
    							"dependencyConditions": [
    								"Succeeded"
    							]
    						}]
    					}
    
    				]
    
    			}
    		}],
    
    		"parameters": {
    			"tableList": {
    				"type": "Object"
    			}
    		}
    	}
    }
    ```
1. Run the **Set-AzureRmDataFactoryV2Pipeline** cmdlet to create the pipeline IncrementalCopyPipeline.
    
   ```powershell
   Set-AzureRmDataFactoryV2Pipeline -DataFactoryName $dataFactoryName -ResourceGroupName $resourceGroupName -Name "IncrementalCopyPipeline" -File ".\IncrementalCopyPipeline.json"
   ``` 

   Here is the sample output: 

   ```json
    PipelineName      : IncrementalCopyPipeline
    ResourceGroupName : ADFTutorialResourceGroup
    DataFactoryName   : ADFIncMultiCopyTutorialFactory1201
    Activities        : {IterateSQLTables}
    Parameters        : {[tableList, Microsoft.Azure.Management.DataFactory.Models.ParameterSpecification]}
   ```
 
## Run the pipeline

1. Create a parameter file named Parameters.json in the same folder with the following content:

    ```json
    {
    	"tableList": 
        [
            {
    			"TABLE_NAME": "customer_table",
    			"WaterMark_Column": "LastModifytime",
    			"TableType": "DataTypeforCustomerTable",
    			"StoredProcedureNameForMergeOperation": "usp_upsert_customer_table"
    		},
    		{
    			"TABLE_NAME": "project_table",
    			"WaterMark_Column": "Creationtime",
    			"TableType": "DataTypeforProjectTable",
    			"StoredProcedureNameForMergeOperation": "usp_upsert_project_table"
    		}
    	]
    }
    ```
1. Run the pipeline IncrementalCopyPipeline by using the **Invoke-AzureRmDataFactoryV2Pipeline** cmdlet. Replace placeholders with your own resource group and data factory name.

	```powershell
    $RunId = Invoke-AzureRmDataFactoryV2Pipeline -PipelineName "IncrementalCopyPipeline" -ResourceGroup $resourceGroupName -dataFactoryName $dataFactoryName -ParameterFile ".\Parameters.json"        
	``` 

## Monitor the pipeline

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **All services**, search with the keyword *Data factories*, and select **Data factories**. 

    ![Data factories menu](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-data-factories-menu-1.png)

1. Search for your data factory in the list of data factories, and select it to open the **Data factory** page. 

    ![Search for your data factory](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-search-data-factory-2.png)

1. On the **Data factory** page, select **Monitor & Manage**. 

    ![Monitor & Manage tile](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-monitor-manage-tile-3.png)

1. The **Data Integration Application** opens in a separate tab. You can see all the pipeline runs and their status. Notice that in the following example, the status of the pipeline run is **Succeeded**. To check parameters passed to the pipeline, select the link in the **Parameters** column. If an error occurred, you see a link in the **Error** column. Select the link in the **Actions** column. 

    ![Pipeline Runs](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-pipeline-runs-4.png)    
1. When you select the link in the **Actions** column, you see the following page that shows all the activity runs for the pipeline: 

    ![Activity Runs](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-activity-runs-5.png)

1. To go back to the **Pipeline Runs** view, select **Pipelines** as shown in the image. 

## Review the results
In SQL Server Management Studio, run the following queries against the target SQL database to verify that the data was copied from source tables to destination tables: 

**Query** 
```sql
select * from customer_table
```

**Output**
```
===========================================
PersonID	Name	LastModifytime
===========================================
1	        John	2017-09-01 00:56:00.000
2	        Mike	2017-09-02 05:23:00.000
3	        Alice	2017-09-03 02:36:00.000
4	        Andy	2017-09-04 03:21:00.000
5	        Anny	2017-09-05 08:06:00.000
```

**Query**

```sql
select * from project_table
```

**Output**

```
===================================
Project	    Creationtime
===================================
project1	2015-01-01 00:00:00.000
project2	2016-02-02 01:23:00.000
project3	2017-03-04 05:16:00.000
```

**Query**

```sql
select * from watermarktable
```

**Output**

```
======================================
TableName	    WatermarkValue
======================================
customer_table	2017-09-05 08:06:00.000
project_table	2017-03-04 05:16:00.000
```

Notice that the watermark values for both tables were updated. 

## Add more data to the source tables

Run the following query against the source SQL Server database to update an existing row in customer_table. Insert a new row into project_table. 

```sql
UPDATE customer_table
SET [LastModifytime] = '2017-09-08T00:00:00Z', [name]='NewName' where [PersonID] = 3

INSERT INTO project_table
(Project, Creationtime)
VALUES
('NewProject','10/1/2017 0:00:00 AM');
``` 

## Rerun the pipeline

1. Now, rerun the pipeline by executing the following PowerShell command:

    ```powershell
    $RunId = Invoke-AzureRmDataFactoryV2Pipeline -PipelineName "IncrementalCopyPipeline" -ResourceGroup $resourceGroupname -dataFactoryName $dataFactoryName -ParameterFile ".\Parameters.json"
    ```
1. Monitor the pipeline runs by following the instructions in the [Monitor the pipeline](#monitor-the-pipeline) section. Because the pipeline status is **In Progress**, you see another action link under **Actions** to cancel the pipeline run. 

    ![In Progress pipeline runs](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-pipeline-runs-6.png)

1. Select **Refresh** to refresh the list until the pipeline run succeeds. 

    ![Refresh pipeline runs](media/tutorial-incremental-copy-multiple-tables-powershell/monitor-pipeline-runs-succeded-7.png)

1. Optionally, select the **View Activity Runs** link under **Actions** to see all the activity runs associated with this pipeline run. 

## Review the final results
In SQL Server Management Studio, run the following queries against the target database to verify that the updated/new data was copied from source tables to destination tables. 

**Query** 
```sql
select * from customer_table
```

**Output**
```
===========================================
PersonID	Name	LastModifytime
===========================================
1	        John	2017-09-01 00:56:00.000
2	        Mike	2017-09-02 05:23:00.000
3	        NewName	2017-09-08 00:00:00.000
4	        Andy	2017-09-04 03:21:00.000
5	        Anny	2017-09-05 08:06:00.000
```

Notice the new values of **Name** and **LastModifytime** for the **PersonID** for number 3. 

**Query**

```sql
select * from project_table
```

**Output**

```
===================================
Project	    Creationtime
===================================
project1	2015-01-01 00:00:00.000
project2	2016-02-02 01:23:00.000
project3	2017-03-04 05:16:00.000
NewProject	2017-10-01 00:00:00.000
```

Notice that the **NewProject** entry was added to project_table. 

**Query**

```sql
select * from watermarktable
```

**Output**

```
======================================
TableName	    WatermarkValue
======================================
customer_table	2017-09-08 00:00:00.000
project_table	2017-10-01 00:00:00.000
```

Notice that the watermark values for both tables were updated.
     
## Next steps
You performed the following steps in this tutorial: 

> [!div class="checklist"]
> * Prepare source and destination data stores.
> * Create a data factory.
> * Create a self-hosted integration runtime (IR).
> * Install the integration runtime.
> * Create linked services. 
> * Create source, sink, and watermark datasets.
> * Create, run, and monitor a pipeline.
> * Review the results.
> * Add or update data in source tables.
> * Rerun and monitor the pipeline.
> * Review the final results.

Advance to the following tutorial to learn about transforming data by using a Spark cluster on Azure:

> [!div class="nextstepaction"]
>[Incrementally load data from Azure SQL Database to Azure Blob storage by using Change Tracking technology](tutorial-incremental-copy-change-tracking-feature-powershell.md)


