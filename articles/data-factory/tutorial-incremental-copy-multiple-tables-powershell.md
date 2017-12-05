---
title: 'Incrementally copy multiple tables using Azure Data Factory | Microsoft Docs'
description: 'In this tutorial, you create an Azure Data Factory pipeline that copies delta data incrementally from multiple tables in an on-premises SQL Server database to an Azure SQL database. '
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 12/01/2017
ms.author: jingwang
---
# Incrementally load data from multiple tables in SQL Server to Azure SQL Database
In this tutorial, you create an Azure data factory with a pipeline that loads delta data from multiple tables in on-premises SQL server to an Azure SQL database.    

You perform the following steps in this tutorial:

> [!div class="checklist"]
> * Prepare source and destination data stores.
> * Create a data factory.
> * Create a self-hosted integration runtime (IR)
> * Install integration runtime 
> * Create linked services. 
> * Create source, sink, watermark datasets.
> * Create, run, and monitor a pipeline.
> * Review results
> * Add or update data in source tables
> * Rerun, and monitor the pipeline
> * Review final results 

> [!NOTE]
> This article applies to version 2 of Data Factory, which is currently in preview. If you are using version 1 of the Data Factory service, which is generally available (GA), see [documentation for Data Factory version 1](v1/data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).

## Overview
Here are the important steps in creating this solution: 

1. **Select the watermark column**.
	Select one column for each table in the source data store, which can be used to identify the new or updated records for every run. Normally, the data in this selected column (for example, last_modify_time or ID) keeps increasing when rows are created or updated. The maximum value in this column is used as a watermark.
2. **Prepare a data store to store the watermark value**.   
	In this tutorial, you store the watermark value in an Azure SQL database.
3. **Create a pipeline with the following activities:** 
	
	1. Create a **ForEach** activity that iterates through a list of source table names that is passed as a parameter to the pipeline. For each source table, it invokes the following activities to perform delta loading for that table. 
    2. Create two **lookup** activities. Use the first lookup activity to retrieve the last watermark value. Use the second lookup activity to retrieve the new watermark value. These watermark values are passed to the copy activity. 
	3. Create a **copy activity** that copies rows from the source data store with the value of watermark column greater than the old watermark value and less than the new watermark value. Then, it copies the delta data from the source data store to a blob storage as a new file. 
	4. Create a **stored procedure activity** that updates the watermark value for the pipeline running next time. 

        Here is the high-level solution diagram of the solution: 

        ![Incrementally load data](media\tutorial-incremental-copy-multiple-tables-powershell\high-level-solution-diagram.png)


If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites
* **SQL Server**. You use an on-premises SQL Server database as the **source** data store in this tutorial. 
* **Azure SQL Database**. You use an Azure SQL database as the **sink** data store. If you don't have an Azure SQL Database, see the [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article for steps to create one. 

### Create source tables in your SQL Server database

1. Launch **SQL Server Management Studio**, and connect to your on-premises SQL Server. 
2. In **Server Explorer**, right-click the database and choose the **New Query**.
3. Run the following SQL command against your database to create tables named `customer_table` and `project_table`.

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

### Create destination tables in your Azure SQL  database
1. Launch **SQL Server Management Studio**, and connect to your Azure SQL server. 
2. In **Server Explorer**, right-click the **database** and choose the **New Query**.
3. Run the following SQL command against your Azure SQL database to create tables named `customer_table` and `project_table`.  
    
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

### Create another table in Azure SQL database to store the high watermark value
1. Run the following SQL command against your Azure SQL database to create a table named `watermarktable` to store the watermark value.  
    
    ```sql
    create table watermarktable
    (
    
        TableName varchar(255),
        WatermarkValue datetime,
    );
    ```
3. Insert initial watermark values for both source tables into the watermark table.

    ```sql

    INSERT INTO watermarktable
    VALUES 
    ('customer_table','1/1/2010 12:00:00 AM'),
    ('project_table','1/1/2010 12:00:00 AM');
    
    ```

### Create a stored procedure in Azure SQL database 

Run the following command to create a stored procedure in your Azure SQL database. This stored procedure updates the value of watermark after every pipeline run. 

```sql
CREATE PROCEDURE sp_write_watermark @LastModifiedtime datetime, @TableName varchar(50)
AS

BEGIN

    UPDATE watermarktable
    SET [WatermarkValue] = @LastModifiedtime 
WHERE [TableName] = @TableName

END

```

### Create data types and additional stored procedures
Create two stored procedures and two data types in your Azure SQL database by running the following query: 
These are used to merge the data from source tables into destination tables.

```sql
CREATE TYPE DataTypeforCustomerTable AS TABLE(
    PersonID int,
    Name varchar(255),
    LastModifytime datetime
);

GO

CREATE PROCEDURE sp_upsert_customer_table @customer_table DataTypeforCustomerTable READONLY
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

CREATE PROCEDURE sp_upsert_project_table @project_table DataTypeforProjectTable READONLY
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

[!INCLUDE [data-factory-quickstart-prerequisites-2](../../includes/data-factory-quickstart-prerequisites-2.md)]

## Create a data factory
1. Define a variable for the resource group name that you use in PowerShell commands later. Copy the following command text to PowerShell, specify a name for the [Azure resource group](../azure-resource-manager/resource-group-overview.md) in double quotes, and then run the command. For example: `"adfrg"`. 
   
     ```powershell
    $resourceGroupName = "ADFTutorialResourceGroup";
    ```

    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$resourceGroupName` variable and run the command again
2. Define a variable for the location of the data factory: 

    ```powershell
    $location = "East US"
    ```
3. To create the Azure resource group, run the following command: 

    ```powershell
    New-AzureRmResourceGroup $resourceGroupName $location
    ``` 
    If the resource group already exists, you may not want to overwrite it. Assign a different value to the `$resourceGroupName` variable and run the command again. 
3. Define a variable for the data factory name. 

    > [!IMPORTANT]
    >  Update the data factory name to be globally unique. For example, ADFIncMultiCopyTutorialFactorySP1127. 

    ```powershell
    $dataFactoryName = "ADFIncMultiCopyTutorialFactory";
    ```
5. To create the data factory, run the following **Set-AzureRmDataFactoryV2** cmdlet: 
    
    ```powershell       
    Set-AzureRmDataFactoryV2 -ResourceGroupName $resourceGroupName -Location $location -Name $dataFactoryName 
    ```

Note the following points:

* The name of the Azure data factory must be globally unique. If you receive the following error, change the name and try again.

    ```
    The specified Data Factory name 'ADFIncMultiCopyTutorialFactory' is already in use. Data Factory names must be globally unique.
    ```
* To create Data Factory instances, the user account you use to log in to Azure must be a member of **contributor** or **owner** roles, or an **administrator** of the Azure subscription.
* Currently, Data Factory version 2 allows you to create data factories only in the East US, East US2, and West Europe regions. The data stores (Azure Storage, Azure SQL Database, etc.) and computes (HDInsight, etc.) used by data factory can be in other regions.

[!INCLUDE [data-factory-create-install-integration-runtime](../../includes/data-factory-create-install-integration-runtime.md)]



## Create linked services
You create linked services in a data factory to link your data stores and compute services to the data factory. In this section, you create linked services to your on-premises SQL Server database and Azure SQL database. 

### Create SQL Server linked service.
In this step, you link your on-premises SQL Server to the data factory.

1. Create a JSON file named **SqlServerLinkedService.json** in **C:\ADFTutorials\IncCopyMultiTableTutorial** folder with the following content: Select the right section based on the **authentication** you use to connect to SQL Server. Create the local folders if they do not already exist. 

    > [!IMPORTANT]
    > Select the right section based on the **authentication** you use to connect to SQL Server.

    **If you are using SQL authentication (sa), copy the following JSON definition:**

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
    **If you are using Windows authentication, copy the following JSON definition:**

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
    > - Select the right section based on the **authentication** you use to connect to SQL Server.
    > - Replace  **&lt;integration** **runtime** **name>** with the name of your integration runtime.
    > - Replace **&lt;servername>**, **&lt;databasename>**, **&lt;username>**, and **&lt;password>** with values of your SQL Server before saving the file.
    > - If you need to use a slash character (`\`) in your user account or server name, use the escape character (`\`). For example, `mydomain\\myuser`.

2. In **Azure PowerShell**, switch to the **C:\ADFTutorials\IncCopyMultiTableTutorial** folder.
3. Run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureStorageLinkedService**. In the following example, you pass values for the **ResourceGroupName** and **DataFactoryName** parameters. 

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

### Create Azure SQL Database linked service.
1. Create a JSON file named **AzureSQLDatabaseLinkedService.json** in **C:\ADFTutorials\IncCopyMultiTableTutorial** folder with the following content: (Create the folder ADF if it does not already exist.). Replace **&lt;server&gt; &lt;database name&gt;, &lt;user id&gt;, and &lt;password&gt;** with name of your Azure SQL server, name of your database, user ID, and password before saving the file. 

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
2. In **Azure PowerShell**, run the **Set-AzureRmDataFactoryV2LinkedService** cmdlet to create the linked service: **AzureSQLDatabaseLinkedService**. 

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
In this step, you create datasets to represent data source, data destination. and the place to store the watermark.

### Create a source dataset

1. Create a JSON file named **SourceDataset.json** in the same folder with the following content: 

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

    The table name is a dummy name. The copy activity in the pipeline uses a SQL query to load the data rather than load the entire table. 
1.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: SourceDataset
    
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

1. Create a JSON file named **SinkDataset.json** in the same folder with the following content: The tableName is set by the pipeline dynamically at runtime. The ForEach activity in the pipeline iterates through a list of table names, and passes the table name to this dataset in each iteration. 

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

2.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: SinkDataset
    
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

### Create a dataset for watermark
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
2.  Run the Set-AzureRmDataFactoryV2Dataset cmdlet to create the dataset: WatermarkDataset
    
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
The pipeline takes a list of table names as a parameter. The **ForEach activity** iterates through the list of table names, and performs the following operations: 

1. Use the **lookup activity** to retrieve the old watermark value (initial value or that was used in the last iteration).
2. Use the **lookup activity** to retrieve the new watermark value (maximum value of watermark column in the source table).
3. Use the **copy activity** to copy data between these two watermark values from the source database to the destination database. 
4. Use the **stored procedure activity** to update the old watermark value to be used in the first step of the next iteration. 

### Create the pipeline
1. Create a JSON file: IncrementalCopyPipeline.json in same folder with the following content: 

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
    								"SinkTableName": "@{item().TABLE_NAME}"
    							}
    						}]
    					},
    
    					{
    						"name": "StoredProceduretoWriteWatermarkActivity",
    						"type": "SqlServerStoredProcedure",
    						"typeProperties": {
    
    							"storedProcedureName": "sp_write_watermark",
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
2. Run the Set-AzureRmDataFactoryV2Pipeline cmdlet to create the pipeline: IncrementalCopyPipeline.
    
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

1. Create a parameter file: **Parameters.json** in same folder with the following content:

    ```json
    {
    	"tableList": 
        [
            {
    			"TABLE_NAME": "customer_table",
    			"WaterMark_Column": "LastModifytime",
    			"TableType": "DataTypeforCustomerTable",
    			"StoredProcedureNameForMergeOperation": "sp_upsert_customer_table"
    		},
    		{
    			"TABLE_NAME": "project_table",
    			"WaterMark_Column": "Creationtime",
    			"TableType": "DataTypeforProjectTable",
    			"StoredProcedureNameForMergeOperation": "sp_upsert_project_table"
    		}
    	]
    }
    ```
2. Run the pipeline: **IncrementalCopyPipeline** by using **Invoke-AzureRmDataFactoryV2Pipeline** cmdlet. Replace place-holders with your own resource group and data factory name.

	```powershell
    $RunId = Invoke-AzureRmDataFactoryV2Pipeline -PipelineName "IncrementalCopyPipeline" -ResourceGroup $resourceGroupName -dataFactoryName $dataFactoryName -ParameterFile ".\Parameters.json"        
	``` 

## Monitor the pipeline

1. Log in to [Azure portal](https://portal.azure.com).
2. Click **More services**, search with the keyword `data factories`, and select **Data factories**. 

    ![Data factories menu](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-data-factories-menu-1.png)
3. Search for **your data factory** in the list of data factories, and select it to launch the Data factory page. 

    ![Search for your data factory](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-search-data-factory-2.png)
4. In the Data factory page, click **Monitor & Manage** tile. 

    ![Monitor & Manage tile](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-monitor-manage-tile-3.png)    
5. The **Data Integration Application** launches in a separate tab. You can see all the **pipeline runs** and their statuses. Notice that in the following example, the status of the pipeline run is **Succeeded**. You can check parameters passed to the pipeline by clicking link in the **Parameters** column. If there was an error, you see a link in the **Error** column. Click the link in the **Actions** column. 

    ![Pipeline runs](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-pipeline-runs-4.png)    
6. When you click the link in the **Actions** column, you see the following page that shows all the **activity runs** for the pipeline. 

    ![Activity runs](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-activity-runs-5.png)
7. To switch back to the **Pipeline runs** view, click **Pipelines** as shown in the image. 

## Review the results
In SQL Server Management Studio, run the following queries against the target Azure SQL database to verify that the data was copied from source tables to destination tables. 

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

**Query:**

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

Notice that the watermark values for both the tables have been updated. 

## Add more data to the source tables

Run the following query against the source SQL Server database to update an existing row in the customer_table, and insert a new row into the project_table. 

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
2. Monitor the pipeline runs by following instructions in the [Monitor the pipeline](#monitor-the-pipeline) section. As the pipeline status is **In Progress**, you see another action link under **Actions** to cancel the pipeline run. 

    ![Pipeline runs](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-pipeline-runs-6.png)    
3. Click **Refresh** to refresh the list until the pipeline run succeeds. 

    ![Pipeline runs](media\tutorial-incremental-copy-multiple-tables-powershell\monitor-pipeline-runs-succeded-7.png)
4. (optional) click the **View Activity Runs** link (icon) under Actions to see all the activity runs associated with this pipeline run. 

## Review final results
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

Notice the new values of Name and LastModifytime for the PersonID: 3. 

**Query:**

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

Notice that the NewProject entry has been added to the project_table. 

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

Notice that the watermark values for both the tables have been updated.
     
## Next steps
You performed the following steps in this tutorial: 

> [!div class="checklist"]
> * Prepare source and destination data stores.
> * Create a data factory.
> * Create a self-hosted integration runtime (IR)
> * Install integration runtime 
> * Create linked services. 
> * Create source, sink, watermark datasets.
> * Create, run, and monitor a pipeline.
> * Review results
> * Add or update data in source tables
> * Rerun, and monitor the pipeline
> * Review final results 

Advance to the following tutorial to learn about transforming data by using a Spark cluster on Azure:

> [!div class="nextstepaction"]
>[Incrementally load data from Azure SQL Database to Azure Blob Storage using Change Tracking technology](tutorial-incremental-copy-multiple-tables-powershell.md)


