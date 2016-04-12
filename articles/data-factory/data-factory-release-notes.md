<properties 
	pageTitle="Data Factory - Release Notes | Microsoft Azure" 
	description="Data Factory release notes" 
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
	ms.date="04/11/2016" 
	ms.author="spelluru"/>

# Azure Data Factory release notes
Please see the [Data Factory - .NET API Change Log](data-factory-api-change-log.md) article to learn about changes to Data Factory .NET SDK in a specific release.  

## Notes for 07/17/2015 release of Data Factory
The following JSON changes are introduced in the July 2015 release of Azure PowerShell. 

## Update to types of linked services, tables, and activities
Resource type | Current name in JSON | New name in JSON
------------- | -------------------- | ----------------
Linked Service (Data Source) | AzureSqlLinkedService | AzureSqlDatabase
Linked Service (Data Source) | AzureStorageLinkedService | AzureStorage
Linked Service (Data Source) | DocumentDbLinkedService | DocumentDb
Linked Service (Data Source) | OnPremisesFileSystemLinkedService | OnPremisesFileServer
Linked Service (Data Source) | OnPremisesOracleLinkedService | OnPremisesOracle
Linked Service (Data Source) | OnPremisesSqlLinkedService | OnPremisesSqlServer
Linked Service (Data Source) | OnPremisesMySqlLinkedService | OnPremisesMySql
Linked Service (Data Source) | OnPremisesDb2LinkedService | OnPremisesDb2
Linked Service (Data Source) | OnPremisesTeradataLinkedService | OnPremisesTeradata
Linked Service (Data Source) | OnPremisesSybaseLinkedService | OnPremisesSybase
Linked Service (Data Source) | OnPremisesPostgreSqlLinkedService | OnPremisesPostgreSql
Linked Service (Compute) | AzureMlLinkedService | AzureML
Linked Service (Compute) | HDInsightBYOCLinkedService | HDInsight
Linked Service (Compute) | HDInsightOnDemandLinkedService | HDInsightOnDemand
Linked Service (Compute) | AzureBatchLinkedService | AzureBatch
Dataset | AzureBlobLocation | AzureBlob
Dataset | AzureTableLocation | AzureTable
Dataset | AzureSqlTableLocation | AzureSqlTable
Dataset | DocumentDbCollectionLocation | DocumentDbCollection 
Dataset | OnPremisesFileSystemLocation | FileShare
Dataset | OnPremisesOracleTableLocation | OracleTable
Dataset | OnPremisesSqlServerTableLocation | SqlServerTable
Dataset | RelationTableLocation | RelationalTable
Activity | CopyActivity | Copy
Activity | HDInsightActivity (Hive transformation) | HDInsightHive
Activity | HDInsightActivity (Pig transformation) | HDInsightPig
Activity | HDInsightActivity (MapReduce transformation) | HDInsightMapReduce
Activity | HDInsightActivity (Streaming) | HDInsightHadoopStreaming
Activity | AzureMLBatchScoringActivity | AzureMLBatchScoring
Activity | StoredProcedureActivity | SqlServerStoredProcedure

## New typeProperties element
The new **typeProperties** element contains type specific properties for a linked service/table/activity. 

### Old linked service JSON
	{
	    "name": "StorageLinkedService",
	    "properties":
	    {
	        "type": "AzureStorageLinkedService",
	        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>" "
	    }
	}

### New linked service JSON
	{
	  "name": "StorageLinkedService",
	  "properties": {
	    "type": "AzureStorage",
	    "typeProperties": {
	      "connectionString": "DefaultEndpointsProtocol=https;AccountName=<account name>;AccountKey=<Account key>"
	    }
	  }
	}

Noice the following: 

- The **type** property is moved one level up and is set to **AzureStorage** (change from **AzureStorageLinkedService** to **AzureStorage**) 
- New **typeProperties** element that contains properties supported by the Azure Storage linked service (**connectionString** in this example).  

### Old dataset JSON
	{
	    "name": "EmpTable",
	    "properties":
	    {
	        "location":
	        {
	            "type": "AzureTableLocation",
	            "tableName": "myazuretable",
	            "linkedServiceName": "MyLinkedService"
	        },
	        "availability":
	        {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}

### New dataset JSON

	{
	    "name": "EmpTable",
	    "properties": {
	        "type": "AzureTable",
	        "linkedServiceName": "MyLinkedServiceName",
	        "typeProperties": {
	            "tableName": "myazuretable"
	        },
	        "availability": {
	            "frequency": "Hour",
	            "interval": 1
	        }
	    }
	}

Notice the following:

- The **type** property is moved one level up and the type name **AzureTableLocation** has been changed to **AzureTable**.
- The **linkedServiceName** is moved one level up. 
- The **location** element is removed now and the type specific properties such as **tableName** that were specified in the **location** section are specified in the new **typeProperties** section.  

### Old activity JSON

	{
	    "name": "CopyFromSQLtoBlob   ",
	    "description": "description", 
	    "type": "CopyActivity",
	    "inputs":  [ { "name": "InputSqlDA"  } ],
	    "outputs":  [ { "name": "OutputBlobDA" } ],
	    "transformation":
	    {
	        "source":
	        {
	            "type": "SqlSource",
	            "sqlReaderQuery": "select * from MyTable"
	        },
	        "sink":
	        {
	            "type": "BlobSink"
	        }
	    }
	}   

### New activity JSON
	
	{
	    "name": "CopyFromSQLtoBlob   ",
	    "description": "description", 
	    "type": "Copy",
	    "inputs":  [ { "name": "InputSqlDA"  } ],
	    "outputs":  [ { "name": "OutputBlobDA" } ],
	    "typeProperties":
	    {
	        "source":
	        {
	            "type": "SqlSource",
	            "sqlReaderQuery": "select * from MyTable"
	        },
	        "sink":
	        {
	            "type": "BlobSink"
	        }
	    }
	}

Notice the following:

- Notice that the **transformation** element has been replaced with the new **typeProperties** element.

## waitOnExternal element is removed
The **waitOnExternal** element is replaced with the new **external** and **externalData** properties.        

### Old JSON
	{
	    "name": "EmpTableFromBlob",
	    "properties":
	    {
	        "location": 
	        {
	            "type": "AzureBlobLocation",
	            "folderPath": "adftutorial/",
	            "format":
	            {
	                "type": "TextFormat",
	                "columnDelimiter": ","
	            },
	            "linkedServiceName": "StorageLinkedService"
	        },
	        "availability": 
	        {
	            "frequency": "hour",
	            "interval": 1,
                "waitOnExternal": 
				{
			        "retryInterval": "00:01:00",
			        "retryTimeout": "00:10:00",
			        "maximumRetry": "3"			
				}
	        }
	    }
	} 

### New JSON
	{
	  "name": "EmpTableFromBlob",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "StorageLinkedService",
	    "typeProperties": {
	      "folderPath": "adftutorial/",
	      "format": {
	        "type": "TextFormat",
	        "columnDelimiter": ","
	      }
	    },
	    "external": true,
	    "availability": {
	      "frequency": "hour",
	      "interval": 1
	    },
	    "policy": {
	      "externalData": {
	        "retryInterval": "00:01:00",
	        "retryTimeout": "00:10:00",
	        "maximumRetry": "3"
	      }
	    }
	  }
	}

Notice the following:

- The **waitOnExternal** property is removed from the **availability** section 
- A new **external** property is added one level up and is set to **true** for an external table. 
- The properties of **waitOnExternal** element such as **retryInterval** are added to the new **externalData** section in the **Policy** element.
- The **externalData** element is an optional element. 
- When you use the **externalData** element, you must have the **external** property set to **true**. 
 

## New copyBehavior property for the BlobSink
The **BlobSink** supports new property named: **copyBehavior**. This property defines the copy behavior when the source is **BlobSource** or **FileSystem**. There are three possible values for the **copyBehavior** property. 

**PreserveHierarchy**:: preserves the file hierarchy in the target folder, i.e., the relative path of source file to source folder is identical to the relative path of target file to target folder. 


**FlattenHierarchy**: : all files from the source folder will be in the first level of target folder. The target files will have auto generated name. 


**MergeFiles**: merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name. 
 
## New getDebugInfo property for all HDInsight activities
The HDInsight activities (Hive, Pig, MapReduce, Hadoop Streaming) support the new property:  **getDebugInfo** property. The **getDebugInfo** property is an optional element. When it is set to **Failure**, the logs are downloaded only on execution failure. When it is set to **All**, logs are always downloaded irrespective of the execution status. When it is set to **None**, no logs are downloaded.

  
     

## Notes for 04/10/2015 release of Data Factory
You will see the **Recently updated slices** and **Recently failed slices** lists on the **TABLE** blade now. These lists are sorted by the update time of the slice. The update time of a slice is changed in the following situations.    

-  You update the status of the slice manually, for example, by using the **Set-AzureRmDataFactorySliceStatus** (or) by clicking **RUN** on the **SLICE** blade for the slice.
-  The slice changes status due to an execution (e.g. a run started, a run ended and failed, a run ended and succeeded, etc).

Click on the title of the lists or **... (ellipses)** to see the larger list of slices. Click **Filter** on the toolbar to filter the slices.
 
You can still view slices sorted by the slice times by clicking **Data slices (by slice time)** tile. The slices in those collections are ordered by slice time. For example, if it’s an hourly schedule, the slices would be:
- 4/4/2015 5pm In progress 
- 4/4/2015 4pm Succeeded
- 4/4/2015 3pm Failed

But, if an older slice is re-run, it would not show up on the top of this list, even though that’s probably what the user is more interested in.

## Notes for 3/31/2015 release of Data Factory
- Updated **Data Management Gateway** installation package has been posted to [Microsoft Download Center][adf-gateway-download].
- Copying from **on-premises file system to Azure blob** is supported now. See the following topics for more information.
	-  [On-premises File System Linked Service](https://msdn.microsoft.com/library/dn930836.aspx)
	-  [OnPremisesFileSystemLocation properties in a table JSON](https://msdn.microsoft.com/library/dn894089.aspx#OnPremFileSystem)
	-  [Supported Sources and Sinks](https://msdn.microsoft.com/library/dn894007.aspx). See the updated copy matrix and **FileSystemSource** properties. 
-  Copying from **on-premises Oracle database to Azure blob** is supported now. See the following topics for more informaiton. 
	-  [On-premises Oracle Linked Service](https://msdn.microsoft.com/library/dn948537.aspx)
	-  [OnPremisesOracleTableLocation properties in a table JSON](https://msdn.microsoft.com/library/dn894089.aspx#Oracle) 
	-  [Supported Sources and Sinks](https://msdn.microsoft.com/library/dn894007.aspx). See the updated copy matrix and **OracleSource** properties.
-  You can specify encoding for text files in an Azure Blob. See the new [encodingName property](https://msdn.microsoft.com/library/dn894089.aspx#AzureBlob). 
- You can invoke a stored procedure with additional parameters when copying into SQL Sink.    

See the blob post: [Azure Data Factory Update - New Data Stores](https://azure.microsoft.com/blog/2015/03/30/azure-data-factory-update-new-data-stores/) for additional information including examples.  

## Notes for 2/27/2015 release of Data Factory

### New improvements
- **Azure Data Factory Editor**. The Data Factory Editor, which is part of the Azure Portal, allows you to create, edit, and deploy JSON files that define linked services, data sets, and pipelines.The main goal of the editor is to provide you a fast and light-weight user-interface (UI) to create Azure Data Factory artifacts without requiring you to install Azure PowerShell and ramp up on using PowerShell cmdlets. See the [Azure Data Factory Editor - A Light Weight Web Editor][adf-editor-blog] blog post for a quick overview and a video on Data Factory Editor.  

### Changes

## Notes for 1/26/2015 release of Data Factory ##

### Changes
- Updated **Data Management Gateway** installation package has been posted to [Microsoft Download Center][adf-gateway-download]. Starting from this release, you can find the latest Data Management Gateway to use with Azure Data Factory at this download location. This installation package serves both Azure Data Factory and Power BI for Office 365 services. If you are using both the services, note that gateways for Data Factory and Power BI must be installed on different machines, and configured differently as per guidance from the Data Factory or Power BI documentation.
- The **Copy Activity** now supports copying data between on-premises SQL Server database and an Azure SQL database. 
- **SqlSink** supports a new property: **WriteBatchTimeout**. This property gives you the flexibility to configure how long to wait for the batch insert operation to complete before the operation times out. For a hybrid copy (copy operation that involves an on-premises data source and a cloud data source), you must have the gateway of version 1.4 or higher to use this property. 
- **SQL Server linked service** now supports **Windows Authentication**. 
	- When creating a SQL Server linked service using the portal, you can now choose to use Windows Authentication and set appropriate credentials. This requires you to have the gateway of version 1.4 or higher. 
	- When creating a SQL Server linked service using Azure PowerShell, you can specify connection information in plain text or encrypt the connection information using updated [New-AzureRmDataFactoryEncryptValue cmdlet](https://msdn.microsoft.com/library/mt603802.aspx) and then use the encrypted string for the Connection String property in the linked service JSON payload. The encryption feature is not supported by the New-AzureRmDataFactoryEncryptValue cmdlet yet. 

## Notes for 12/11/2014 release of Data Factory ##

### New improvements

- Azure Machine Learning integration
	- This release of Azure Data Factory service allows you to integrate Azure Data Factory with Azure Machine Learning (ML) by using **AzureMLLinkedService** and **AzureMLBatchScoringActivity**. See [Create predictive pipelines using Data Factory and Azure Machine Learning][adf-azure-ml] for details. 
- Gateway version status is provided
	- "NewVersionAvailable" status will be shown in the Azure Portal and in the output of Get-AzureRmDataFactoryGateway cmdlet, if there is a newer version of the gateway available than the one that is currently installed. You can then follow the portal journey  to download the new installation file (.msi) and run it to install the latest gateway. There is no additional configuration is  needed.

### Changes

- JobsContainer in HdInsightOnDemandLinkedService is removed.
	- In the JSON definition for a HDInsightOnDemandLinkedService, you do not need to specify **jobsContainer** property anymore. If you have the property specified for an on-demand linked service, the property is ignored. You can remove the property from the JSON definition for the linked service and update the linked service definition by using New-AzureRmDataFactoryLinkedService cmdlet.
- Optional configuration parameters for HDInsightOnDemandLinkedService
	- This release introduces support for a few optional configuration parameters for HDInsightOnDemandLinked (on-demand HDInsight cluster). See [ClusterCreateParameters Properties][on-demand-hdi-parameters] for details.
- Gateway location is removed
	- When creating an Azure Data Factory gateway via portal or PowerShell (New-AzureRmDataFactoryGateway), you no longer need to specifiy the location for the gateway. The data factory region will be inherited. Similarly, to configure a SQL Server linked Service using JSON, "gatewayLocation" property is not needed anymore. Data Factory .NET SDK is also updated to refelct these changes.
	- If you use an older version of SDK and Azure PowerShell, you are still required to provide the location setting.
 
     

#### Breaking changes
	
- CustomActivity to DotNetActivity
	- **ICustomActivity** interface is renamed to **IDotNetActivity**. You will need to update Data Factory NuGet packages and change ICustomActivity to IDotNetActivity in the source code for your custom activity.  
	- The type of custom activity in the JSON definition for you custom activity must be changed from **CustomActivity** to **DotNetActivity**. 
	- The **CustomActivity** and **CustomActivityProperties** classes have been renamed to **DotNetActivity** and **DotNetActivityProperties** with the same set of properties.

		If you use the older verion of SDK and Azure PowerShell, you can continue using CustomActivity instead of DotNetActivity.
    
  		See [Use custom activities in an Azure Data Factory pipeline][adf-custom-activities] for a walkthrough on how to create a custom activity and use it in an Azure Data Factory pipeline.  

[adf-azure-ml]: data-factory-azure-ml-batch-execution-activity.md
[adf-custom-activities]: data-factory-use-custom-activities.md

[adf-editor-video]: http://channel9.msdn.com/Blogs/Windows-Azure/New-Azure-Data-Factory-Editor-UI
[adf-editor-blog]: http://azure.microsoft.com/blog/2015/03/02/azure-data-factory-editor-a-light-weight-web-editor/
[on-demand-hdi-parameters]: http://msdn.microsoft.com/library/microsoft.windowsazure.management.hdinsight.clustercreateparameters_properties.aspx
[adf-gateway-download]: http://www.microsoft.com/download/details.aspx?id=39717
[adf-github-samples]: https://github.com/Azure/Azure-DataFactory/tree/master/Samples/JSON
[adf-msdn-linked-services]: https://msdn.microsoft.com/library/dn834986.aspx
[adf-encrypt-value-cmdlet]: https://msdn.microsoft.com/library/dn834940.aspx



 
