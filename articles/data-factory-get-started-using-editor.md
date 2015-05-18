<properties 
	pageTitle="Get started using Azure Data Factory" 
	description="This tutorial shows you how to create a sample data pipeline that copies data from a blob to an Azure SQL Database instance." 
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
	ms.date="05/04/2015" 
	ms.author="spelluru"/>

# Tutorial: Create and monitor a data factory using Data Factory Editor
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-get-started.md)
- [Using Data Factory Editor](data-factory-get-started-using-editor.md)
- [Using PowerShell](data-factory-monitor-manage-using-powershell.md)


##In This Tutorial
This tutorial contains the following steps:

Step | Description
-----| -----------
[Step 1: Create an Azure Data Factory](#CreateDataFactory) | In this step, you will create an Azure data factory named **ADFTutorialDataFactory**.  
[Step 2: Create linked services](#CreateLinkedServices) | In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. The StorageLinkedService links the Azure storage and AzureSqlLinkedService links the Azure SQL database to the ADFTutorialDataFactory. The input data for the pipeline resides in a blob container in the Azure blob storage and output data will be stored in a table in the Azure SQL database. Therefore, you add these two data stores as linked services to the data factory.      
[Step 3: Create input and output tables](#CreateInputAndOutputDataSets) | In the previous step, you created linked services that refer to data stores that contain input/output data. In this step, you will define two data factory tables -- **EmpTableFromBlob** and **EmpSQLTable** -- that represent the input/output data that is stored in the data stores. For the EmpTableFromBlob, you will specify the blob container that contains a blob with the source data and for the EmpSQLTable, you will specify the SQL table that will store the output data. You will also specify other properties such as structure of the data, availability of the data, etc... 
[Step 4: Create and run a pipeline](#CreateAndRunAPipeline) | In this step, you will create a pipeline named **ADFTutorialPipeline** in the ADFTutorialDataFactory. The pipeline will have a **Copy Activity** that copies input data from the Azure blob to the output Azure SQL table.
[Step 5: Monitor slices and pipeline](#MonitorDataSetsAndPipeline) | In this step, you will monitor slices of input and output tables by using Azure Preview Portal.
 

## <a name="CreateDataFactory"></a>Step 1: Create an Azure Data Factory
In this step, you use the Azure Preview Portal to create an Azure data factory named **ADFTutorialDataFactory**.

1.	After logging into the [Azure Preview Portal][azure-preview-portal], click **NEW** from the bottom-left corner, select **Data analytics** in the **Create** blade, and click **Data Factory** in the **Data analytics** blade. 

	![New->DataFactory][image-data-factory-new-datafactory-menu]	

6. In the **New data factory** blade:
	1. Enter **ADFTutorialDataFactory** for the **name**. 
	
  		![New data factory blade][image-data-factory-getstarted-new-data-factory-blade]
	2. Click **RESOURCE GROUP NAME** and do the following:
		1. Click **Create a new resource group**.
		2. In the **Create resource group** blade, enter **ADFTutorialResourceGroup** for the **name** of the resource group, and click **OK**. 

			![Create Resource Group][image-data-factory-create-resource-group]

		Some of the steps in this tutorial assume that you use the name: **ADFTutorialResourceGroup** for the resource group. To learn about resource groups, see [Using resource groups to manage your Azure resources](resource-group-overview.md).  
7. In the **New data factory** blade, notice that **Add to Startboard** is selected.
8. Click **Create** in the **New data factory** blade.

	> [AZURE.NOTE] The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “ADFTutorialDataFactory” is not available**, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. Use this name in place of ADFTutorialFactory while performing remaining steps in this tutorial. See [Data Factory - Naming Rules][data-factory-naming-rules] topic for naming rules for Data Factory artifacts.  
	 
	![Data Factory name not available][image-data-factory-name-not-available]

9. Click **NOTIFICATIONS** hub on the left and look for notifications from the creation process. Click **X** to close the **NOTIFICATIONS** blade if it is open. 
10. After the creation is complete, you will see the **DATA FACTORY** blade as shown below.

    ![Data factory home page][image-data-factory-get-stated-factory-home-page]

## <a name="CreateLinkedServices"></a>Step 2: Create linked services
Linked services link data stores or compute services to an Azure data factory. A data store can be an Azure Storage, Azure SQL Database or an on-premises SQL Server database.

In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. StorageLinkedService linked service links an Azure Storage Account and AzureSqlLinkedService links an Azure SQL database to the **ADFTutorialDataFactory**. You will create a pipeline later in this tutorial that copies data from a blob container in StorageLinkedService to a SQL table in AzureSqlLinkedService.

### Create a linked service for the Azure storage account
1.	In the **DATA FACTORY** blade, click **Author and deploy** tile to launch the **Editor** for the data factory.

	![Author and Deploy Tile][image-author-deploy-tile] 

	> [AZURE.NOTE] See [Data Factory Editor][data-factory-editor] topic for detailed overview of the Data Factory editor. 
	 
5. In the **Editor**, click **New data store** button on the toolbar and select **Azure storage** from the drop down menu. You should see the JSON template for creating an Azure storage linked service in the right pane. 

	![Editor New data store button][image-editor-newdatastore-button]
    
6. Replace **accountname** and **accountkey** with the account name and account key values for your Azure storage account. 

	![Editor Blob Storage JSON][image-editor-blob-storage-json]    
	
	> [AZURE.NOTE] See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

6. Click **Deploy** on the toolbar to deploy the StorageLinkedService. Confirm that you see the message **LINKED SERVICE CREATED SUCCESSFULLY** on the title bar.

	![Editor Blob Storage Deploy][image-editor-blob-storage-deploy]

### Create a linked service for the Azure SQL Database
1. In the **Data Factory Editor** , click **New data store** button on the toolbar and select **Azure SQL database** from the drop down menu. You should see the JSON template for creating the Azure SQL linked service in the right pane.

	![Editr Azure SQL Settings][image-editor-azure-sql-settings]

2. Replace **servername**, **databasename**, **username@servername**, and **password** with names of your Azure SQL server, database, user account, and  password. 
3. Click **Deploy** on the toolbar to create and deploy the AzureSqlLinkedService. 
   

## <a name="CreateInputAndOutputDataSets"></a>Step 3: Create input and output tables
In the previous step, you created linked services **StorageLinkedService** and **AzureSqlLinkedService** to link an Azure Storage account and Azure SQL database to the data factory: **ADFTutorialDataFactory**. In this step, you will define two data factory tables -- **EmpTableFromBlob** and **EmpSQLTable** -- that represent the input/output data that is stored in the data stores referred by StorageLinkedService and AzureSqlLinkedService respectively. For  EmpTableFromBlob, you will specify the blob container that contains a blob with the source data and for EmpSQLTable, you will specify the SQL table that will store the output data. 

### Create input table 
A table is a rectangular dataset and has a schema. In this step, you will create a table named **EmpBlobTable** that points to a blob container in the Azure Storage represented by the **StorageLinkedService** linked service.

1. In the **Editor** for the Data Factory, click **New dataset** button on the toolbar and click **Blob table** from the drop down menu. 
2. Replace JSON in the right pane with the following JSON snippet: 

        {
     	    "name": "EmpTableFromBlob",
		    "properties":
    		{
        		"structure":  
       			 [ 
            		{ "name": "FirstName", "type": "String"},
            		{ "name": "LastName", "type": "String"}
        		],
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
            		"waitOnExternal": {}
       		 	}
    		}
		}

		
     Note the following: 
	
	- location **type** is set to **AzureBlobLocation**.
	- **linkedServiceName** is set to **StorageLinkedService**. You had created this linked service in Step 2.
	- **folderPath** is set to the **adftutorial** container. You can also specify the name of a blob within the folder. Since you are not specifying the name of the blob, data from all blobs in the container is considered as an input data.  
	- format **type** is set to **TextFormat**
	- There are two fields in the text file – **FirstName** and **LastName** – separated by a comma character (**columnDelimiter**)	
	- The **availability** is set to **hourly** (**frequency** is set to **hour** and **interval** is set to **1** ), so the Data Factory service will look for input data every hour in the root folder in the blob container (**adftutorial**) you specified. 
	

	if you don't specify a **fileName** for an **input** **table**, all files/blobs from the input folder (**folderPath**) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input. See the sample files in the [tutorial][adf-tutorial] for examples.
 
	If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.&lt;Guid\&gt;.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

	To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the **partitionedBy** property. In the following example, folderPath uses Year, Month, and Day from from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2014-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2014/10/20 and the fileName is set to 08.csv. 

	  	"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
        "fileName": "{Hour}.csv",
        "partitionedBy": 
        [
        	{ "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
            { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
            { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
            { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
        ],

	> [AZURE.NOTE] See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

2. Click **Deploy** on the toolbar to create and deploy the **EmpTableFromBlob** table. Confirm that you see the **TABLE CREATED SUCCESSFULLY** message on the title bar of the Editor.

### Create output table
In this part of the step, you will create an output table named **EmpSQLTable** that points to a SQL table in the Azure SQL database that is represented by the **AzureSqlLinkedService** linked service. 

1. In the **Editor** for the Data Factory, click **New dataset** button on the toolbar and click **Azure SQL table** from the drop down menu. 
2. Replace JSON in the right pane with the following JSON snippet:

        {
    		"name": "EmpSQLTable",
    		"properties":
    		{
        		"structure":
        		[
                	{ "name": "FirstName", "type": "String"},
                	{ "name": "LastName", "type": "String"}
        		],
        		"location":
        		{
            		"type": "AzureSqlTableLocation",
            		"tableName": "emp",
            		"linkedServiceName": "AzureSqlLinkedService"
        		},
        		"availability": 
        		{
            		"frequency": "Hour",
            		"interval": 1            
        		}
    		}
		}


		
     Note the following: 
	
	* location **type** is set to **AzureSQLTableLocation**.
	* **linkedServiceName** is set to **AzureSqlLinkedService** (you had created this linked service in Step 2).
	* **tablename** is set to **emp**.
	* There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database, but ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
	* The **availability** is set to **hourly** (**frequency** set to **hour** and **interval** set to **1**).  The Data Factory service will generate an output data slice every hour in the **emp** table in the Azure SQL database.


3. Click **Deploy** on the toolbar to create and deploy the **EmpSQLTable** table.


## <a name="CreateAndRunAPipeline"></a>Step 4: Create and run a pipeline
In this step, you create a pipeline with a **Copy Activity** that uses **EmpTableFromBlob** as input and **EmpSQLTable** as output.

1. In the **Editor** for the Data Factory, click **New pipeline** button on the toolbar. Click **... (Ellipsis)** on the toolbar if you do not see the button. Alternatively, you can right-click **Pipelines** in the tree view and click **New pipeline**.

	![Editor New Pipeline Button][image-editor-newpipeline-button]
 
2. Replace JSON in the right pane with the following JSON snippet: 

         {
			"name": "ADFTutorialPipeline",
			"properties":
			{	
				"description" : "Copy data from a blob to Azure SQL table",
				"activities":	
				[
					{
						"name": "CopyFromBlobToSQL",
						"description": "Push Regional Effectiveness Campaign data to Azure SQL database",
						"type": "CopyActivity",
						"inputs": [ {"name": "EmpTableFromBlob"} ],
						"outputs": [ {"name": "EmpSQLTable"} ],		
						"transformation":
						{
							"source":
							{                               
								"type": "BlobSource"
							},
							"sink":
							{
								"type": "SqlSink"
							}	
						},
						"Policy":
						{
							"concurrency": 1,
							"executionPriorityOrder": "NewestFirst",
							"style": "StartOfInterval",
							"retry": 0,
							"timeout": "01:00:00"
						}		
					}
        		],

				"start": "2015-02-13T00:00:00Z",
        		"end": "2015-02-14T00:00:00Z",
        		"isPaused": false
      		}
		} 

	Note the following:

	- In the activities section, there is only one activity whose **type** is set to **CopyActivity**.
	- Input for the activity is set to **EmpTableFromBlob** and output for the activity is set to **EmpSQLTable**.
	- In the **transformation** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

	> [AZURE.NOTE] Replace the value of the **start** property with the current day and **end** value with the next day. You can specify only the date part and skip the time part of the date time. For example, "2015-02-03", which is equivalent to "2015-02-03T00:00:00Z"
	> Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional, but we will use it in this tutorial. 
	> If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9999-09-09** as the value for the **end** property.
	> In the example above, there will be 24 data slices as each data slice is produced hourly.
	
	> [AZURE.NOTE] See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

4. Click **Deploy** on the toolbar to create and deploy the **ADFTutorialPipeline**. Confirm that you see the **PIPELINE CREATED SUCCESSFULLY** message.
5. Now, close the **Editor** blade by clicking **X**. Click **X** again to close the ADFTutorialDataFactory blade with the toolbar and tree view. If you see **your unsaved edits will be discarded** message, click **OK**.
6. You should be back to the **DATA FACTORY** blade for the **ADFTutorialDataFactory**.

**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a pipeline and scheduled the pipeline.   
 
### View the data factory in a Diagram View 
4. In the **DATA FACTORY** blade, click **Diagram**.

	![Data Factory Blade - Diagram Tile][image-datafactoryblade-diagramtile]

5. You should see the diagram similar to the following: 

	![Diagram view][image-data-factory-get-started-diagram-blade]

	You can zoom in, zoom out, zoom to 100%, zoom to fit, automatically position pipelines and tables, and show lineage information (highlights upstream and downstream items of selected items).  You can double-blick on an object (input/output table or pipeline) to see properties for it. 

## <a name="MonitorDataSetsAndPipeline"></a>Step 5: Monitor the datasets and pipeline
In this step, you will use the Azure Portal to monitor what’s going on in an Azure data factory. You can also use PowerShell cmdlets to monitor datasets and pipelines. For details about using cmdlets for monitoring, see [Monitor and Manage Data Factory using PowerShell Cmdlets][monitor-manage-using-powershell].

1. Navigate to [Azure Portal (Preview)][azure-preview-portal] if you don't have it open. 
2. If the blade for **ADFTutorialDataFactory** is not open, open it by clicking **ADFTutorialDataFactory** on the **Startboard**. 
3. You should see the count and names of tables and pipeline you created on this blade.

	![home page with names][image-data-factory-get-started-home-page-pipeline-tables]

4. Now, click **Datasets** tile.
5. In the **Datasets** blade, click **EmpTableFromBlob**. This is the input table for the **ADFTutorialPipeline**.

	![Datasets with EmpTableFromBlob selected][image-data-factory-get-started-datasets-emptable-selected]   
5. Notice that the data slices up to the current time have already been produced and they are **Ready** because the **emp.txt** file exists all the time in the blob container: **adftutorial\input**. Confirm that no slices show up in the **Recently failed slices** section at the bottom.

	Both **Recently updated slices** and **Recently failed slices** lists are sorted by the **LAST UPDATE TIME**. The update time of a slice is changed in the following situations. 
    

	-  You update the status of the slice manually, for example, by using the **Set-AzureDataFactorySliceStatus** (or) by clicking **RUN** on the **SLICE** blade for the slice.
	-  The slice changes status due to an execution (e.g. a run started, a run ended and failed, a run ended and succeeded, etc).
 
	Click on the title of the lists or **... (ellipses)** to see the larger list of slices. Click **Filter** on the toolbar to filter the slices.  
	
	To view the data slices sorted by the slice start/end times instead, click **Data slices (by slice time)** tile.   

	![Data Slices by Slice Time][DataSlicesBySliceTime]   

6. Now, in the **Datasets** blade, click the **EmpSQLTable**. This is the output table for the **ADFTutorialPipeline**.

	![data sets blade][image-data-factory-get-started-datasets-blade]



	 
6. You should see the **EmpSQLTable** blade as shown below:

	![table blade][image-data-factory-get-started-table-blade]
 
7. Notice that the data slices up to the current time have already been produced and they are **Ready**. No slices show up in the **Problem slices** section at the bottom.
8. Click **… (Ellipsis)** to see all the slices.

	![data slices blade][image-data-factory-get-started-dataslices-blade]

9. Click on any data slice from the list and you should see the **DATA SLICE** blade.

	![data slice blade][image-data-factory-get-started-dataslice-blade]
  
	If the slice is not in the **Ready** state, you can see the upstream slices that are not Ready and are blocking the current slice from executing in the **Upstream slices that are not ready** list. 

11. In the **DATA SLICE** blade, you should see all activity runs in the list at the bottom. Click on an **activity run** to see the **ACTIVITY RUN DETAILS** blade. 

	![Activity Run Details][image-data-factory-get-started-activity-run-details]

	
12. Click **X** to close all the blades until you get back to the home blade for the **ADFTutorialDataFactory**.
14. (optional) Click **Pipelines** on the home page for **ADFTutorialDataFactory**, click **ADFTutorialPipeline** in the **Pipelines** blade, and drill through input tables (**Consumed**) or output tables (**Produced**).
15. Launch **SQL Server Management Studio**, connect to the Azure SQL Database, and verify that the rows are inserted into the **emp** table in the database.

	![sql query results][image-data-factory-get-started-sql-query-results]


## Summary 
In this tutorial, you created an Azure data factory to copy data from an Azure blob to an Azure SQL database. You used the Azure Preview Portal to create the data factory, linked services, tables, and a pipeline. Here are the high level steps you performed in this tutorial:  

1.	Create an Azure **data factory**.
2.	Create **linked services** that link data stores and computes (referred as **Linked Services**) to the data factory.
3.	Create **tables** which describe input data and output data for pipelines.
4.	Create **pipelines**. A pipeline consists of one or more activities and processes the inputs and produces outputs. Set the active period for the pipeline by specifying **Start** time and **End** time for the pipeline. The active period defines the time duration in which data slices will be produced. 


> [AZURE.NOTE] For a list of supported activities, see [Pipelines and Activities][msdn-activities] 
> topic and for a list of supported linked services, see [Linked Services][msdn-linkedservices] 
> topic on MSDN Library.
> 
> To do this tutorial using Azure PowerShell, see [Create and monitor a data factory using Azure PowerShell][monitor-manage-using-powershell].  

## Next steps

Article | Description
------ | ---------------
[Copy data with Azure Data Factory - Copy Activity][copy-activity] | This article provides detailed description of the **Copy Activity** you used in this tutorial. 
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an **on-premises SQL Server database** to an Azure blob. 
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an **end-to-end walkthrough** that shows how to implement a **real world scenario** using Azure Data Factory to transform data from log files into insights.
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to **troubleshoot** Azure Data Factory issues. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database). 
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 


<!--Link references-->
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[msdn-activities]: https://msdn.microsoft.com/library/dn834988.aspx
[msdn-linkedservices]: https://msdn.microsoft.com/library/dn834986.aspx
[data-factory-naming-rules]: https://msdn.microsoft.com/library/azure/dn835027.aspx

[azure-preview-portal]: https://portal.azure.com/
[download-azure-powershell]: http://azure.microsoft.com/documentation/articles/install-configure-powershell
[sql-management-studio]: http://azure.microsoft.com/documentation/articles/sql-database-manage-azure-ssms/#Step2
[sql-cmd-exe]: https://msdn.microsoft.com/library/azure/ee336280.aspx

[data-factory-editor]: data-factory-editor.md
[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[use-pig-and-hive-with-data-factory]: data-factory-pig-hive-activities.md
[copy-activity]: data-factory-copy-activity.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md
[data-factory-create-storage]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/#create-a-storage-account
[data-factory-create-sql-database]: sql-database-create-configure.md


[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

<!--Image references-->

[DataSlicesBySliceTime]: ./media/data-factory-get-started-using-editor/DataSlicesBySliceTime.png

[image-data-factory-getstarted-new-everything]: ./media/data-factory-get-started-using-editor/GetStarted-New-Everything.png

[image-data-factory-gallery-storagecachebackup]: ./media/data-factory-get-started-using-editor/getstarted-gallery-datastoragecachebackup.png

[image-data-factory-gallery-storagecachebackup-seeall]: ./media/data-factory-get-started-using-editor/getstarted-gallery-datastoragecachebackup-seeall.png

[image-data-factory-getstarted-data-services-data-factory-selected]: ./media/data-factory-get-started-using-editor/getstarted-data-services-data-factory-selected.png

[image-data-factory-getstarted-data-factory-create-button]: ./media/data-factory-get-started-using-editor/getstarted-data-factory-create-button.png

[image-data-factory-getstarted-new-data-factory-blade]: ./media/data-factory-get-started-using-editor/getstarted-new-data-factory.png

[image-data-factory-get-stated-factory-home-page]: ./media/data-factory-get-started-using-editor/getstarted-data-factory-home-page.png

[image-author-deploy-tile]: ./media/data-factory-get-started-using-editor/getstarted-author-deploy-tile.png

[image-editor-newdatastore-button]: ./media/data-factory-get-started-using-editor/getstarted-editor-newdatastore-button.png

[image-editor-blob-storage-json]: ./media/data-factory-get-started-using-editor/getstarted-editor-blob-storage-json.png

[image-editor-blob-storage-deploy]: ./media/data-factory-get-started-using-editor/getstarted-editor-blob-storage-deploy.png

[image-editor-azure-sql-settings]: ./media/data-factory-get-started-using-editor/getstarted-editor-azure-sql-settings.png

[image-editor-newpipeline-button]: ./media/data-factory-get-started-using-editor/getstarted-editor-newpipeline-button.png

[image-datafactoryblade-diagramtile]: ./media/data-factory-get-started-using-editor/getstarted-datafactoryblade-diagramtile.png


[image-data-factory-get-started-startboard]: ./media/data-factory-get-started-using-editor/getstarted-data-factory-startboard.png

[image-data-factory-get-started-linked-services-link]: ./media/data-factory-get-started-using-editor/getstarted-data-factory-linked-services-link.png

[image-data-factory-get-started-linked-services-add-store-button]: ./media/data-factory-get-started-using-editor/getstarted-linked-services-add-store-button.png

[image-data-factory-linked-services-get-started-new-data-store]: ./media/data-factory-get-started-using-editor/getstarted-linked-services-new-data-store.png

[image-data-factory-get-started-new-data-store-with-storage]: ./media/data-factory-get-started-using-editor/getstarted-linked-services-new-data-store-with-storage.png

[image-data-factory-get-started-storage-account-name-key]: ./media/data-factory-get-started-using-editor/getstarted-storage-account-name-key.png

[image-data-factory-get-started-linked-services-list-with-myblobstore]: ./media/data-factory-get-started-using-editor/getstarted-linked-services-list-with-myblobstore.png

[image-data-factory-get-started-linked-azure-sql-properties]: ./media/data-factory-get-started-using-editor/getstarted-linked-azure-sql-properties.png

[image-data-factory-get-started-azure-sql-connection-string]: ./media/data-factory-get-started-using-editor/getstarted-azure-sql-connection-string.png

[image-data-factory-get-started-linked-services-list-two-stores]: ./media/data-factory-get-started-using-editor/getstarted-linked-services-list-two-stores.png

[image-data-factory-get-started-storage-explorer]: ./media/data-factory-get-started-using-editor/getstarted-storage-explorer.png

[image-data-factory-get-started-diagram-link]: ./media/data-factory-get-started-using-editor/getstarted-diagram-link.png

[image-data-factory-get-started-diagram-blade]: ./media/data-factory-get-started-using-editor/getstarted-diagram-blade.png

[image-data-factory-get-started-home-page-pipeline-tables]: ./media/data-factory-get-started-using-editor/getstarted-datafactory-home-page-pipeline-tables.png

[image-data-factory-get-started-datasets-blade]: ./media/data-factory-get-started-using-editor/getstarted-datasets-blade.png

[image-data-factory-get-started-table-blade]: ./media/data-factory-get-started-using-editor/getstarted-table-blade.png

[image-data-factory-get-started-dataslices-blade]: ./media/data-factory-get-started-using-editor/getstarted-dataslices-blade.png

[image-data-factory-get-started-dataslice-blade]: ./media/data-factory-get-started-using-editor/getstarted-dataslice-blade.png

[image-data-factory-get-started-sql-query-results]: ./media/data-factory-get-started-using-editor/getstarted-sql-query-results.png

[image-data-factory-get-started-datasets-emptable-selected]: ./media/data-factory-get-started-using-editor/DataSetsWithEmpTableFromBlobSelected.png

[image-data-factory-get-started-activity-run-details]: ./media/data-factory-get-started-using-editor/ActivityRunDetails.png

[image-data-factory-create-resource-group]: ./media/data-factory-get-started-using-editor/CreateNewResourceGroup.png

[image-data-factory-preview-storage-key]: ./media/data-factory-get-started-using-editor/PreviewPortalStorageKey.png

[image-data-factory-database-connection-string]: ./media/data-factory-get-started-using-editor/DatabaseConnectionString.png

[image-data-factory-new-datafactory-menu]: ./media/data-factory-get-started-using-editor/NewDataFactoryMenu.png

[image-data-factory-sql-management-console]: ./media/data-factory-get-started-using-editor/getstarted-azure-sql-management-console.png

[image-data-factory-sql-management-console-2]: ./media/data-factory-get-started-using-editor/getstarted-azure-sql-management-console-2.png

[image-data-factory-name-not-available]: ./media/data-factory-get-started-using-editor/getstarted-data-factory-not-available.png
