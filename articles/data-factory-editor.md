<properties 
	pageTitle="Azure Data Factory Editor" 
	description="Describes the Azure Data Factory Editor, which allows you to create, edit, and deploy JSON definitions of linked services, tables, and pipelines using a light-weight web-based UI." 
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
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

# Azure Data Factory Editor
The Azure Data Factory Editor is a light weight Web editor that is part of the Azure Preview Portal, which allows you to create, edit, and deploy JSON files of all Azure Data Factory entities. This enables you to create linked services, data sets, and pipelines by using the JSON templates that ship with the Data Factory service. If you are new PowerShell, this removes the need for installing and ramping up on Azure PowerShell to create Azure data factories.

## Launching Data Factory Editor
To launch Data Factory Editor, click **Author & Deploy** tile on the **Data Factory** blade for your Azure data factory. 

![Author and Deploy Tile][author-and-deploy-tile]

You will see the Data Factory Editor as shown in the following image:
 
![Data Factory Editor][data=factory-editor]
 
## Creating new linked services, data sets, and pipelines
There are four buttons on the toolbar that you can use to create Azure Data Factory entities.
 
- **New data store** for creating a data store linked service. When you click this button, you will see a menu with the following options: Azure storage, Azure SQL database, On-premises SQL server database.
- **New compute** for creating a compute linked service. When you click this button, you will see a menu with the following options: On-demand HDInsight cluster, HDInsight cluster, AzureML linked service.      
- **New dataset** for creating a dataset. When you click this button, you will see the following options: Blob table, Azure SQL table, On-premises table.  
- **New pipeline** for creating a pipeline. Click **... (ellipsis)** on the toolbar if you do not see this button on the toolbar.
 
### To create a storage linked service
1. Click **New data store**, and click one of the options in the menu.
 
	![New data store menu][new-data-store-menu] 
2. You will see the JSON template for creating a storage linked service in the **Editor canvas** to the right. You will also see that a draft node appears under **Drafts**. Do the following:
	1. For **Azure storage**: replace **<accountname\>** and **<accountkey\>** with name and key of your Azure storage account.
	2. For **Azure SQL database**: replace **<servername\>** with name of your Azure SQL server, **<databasename\>** with the name of the database, **<username\>@<servername\>** with the name of the user, and **<password\>** with the password for the user account. 
	3. For **On-premises SQL server database**: replace **<servername\>** with name of your on-premises SQL server, **<databasename\>** with the name of the database, **<username\>** with the name of the user, and **<password\>** with the password for the user account.
4. Click **Deploy** on the toolbar to deploy the linked service. You can click **Discard** to discoard the JSON draft you created.
 
	![Deploy button][deploy-button]

1. You should see the status of the Deploy operation on the title bar.

	![Deploy success message][deploy-success-message]
2. If the deploy operation is successful, you should see the created linked service in the tree view to the left.
  
	![StorageLinkedService in tree view][storagelinkedservice-in-treview]

### To create a compute linked service
1. Click **New compute** and click one of the options in the menu.
 
	![New compute menu][new-compute-menu] 
2. You will see the JSON template for creating a compute linked service in the Editor canvas to the right. Do the following:
	1. For **On-demand HDInsight cluster**, specify values for the following properties: 
		1. For the **clusterSize** property, specify the size of the HDInsight cluster you want the Data Factory service to create at runtime. 
		2. For the **jobsContainer** property, specify the name of the default blob container where you want the cluster logs will be stored.
		3. For the **timeToLive** property, specify the allowed idle time before the HDInsight cluster is deleted. For example: 00:05:00 indicates that the cluster should be be deleted after 5 minutes of idle time.
		4. For the **version** property, specify HDInsight version for the cluster (default: version 3.1).
		5. For the **linkedServiceName** property, specify the Azure storage linked service to be associated with the HDInsight cluster. 
	6. For **HDInsight cluster** (Bring-your-own), specify values for the following properties:
		1. For the **clusterUri** property, specify the URL for your own HDInsight cluster. 
		2. For the **userName** property, specify the user account that the Data Factory service should use to connect to your HDInsight cluster. 
		3. For the **password** property, specify the password for the user account. 
		4. For the **linkedServiceName** property, specify the Azure storage linked service that is associated with yhour HDInsight cluster.
	5. For **AzureML linked service**, specify the following properties:
		1. for the **mlEndPoint** property, specify the Azure Machine Learning batch scoring URL.
		2. for the **apiKey** property, specify the API key for the published workspace model.
3. Click **Deploy** on the toolbar to deploy the linked service.

> [AZURE.NOTE] See the [Linked Services][msdn-linkedservices-reference] topic in MSDN Library for descriptions of JSON elements that are used to define an Azure Data Factory linked service..  

### To create a new dataset
1. Click **New dataset** and click one of the options in the menu.
2. You will see the JSON template for creating a dataset in the Editor canvas to the right. Do the following: 
	1. For **Blob table**, specify values for the following properties:
	2. For **Azure SQL table** or **On-premises table**, specify values for the following properties: 
		1. In the **location** section: 
			2. For the **linkedServiceName** property, specify the name of the linked service that referes to your Azure SQL/On-premises SQL Server database.
			2. For the **tableName** property, specify the name of the table in the Azure SQL Database instance/On-premises SQL server that the linked service referes to.
		3. In the **availability** section:
			1. For the **frequency** property, specify the time unit for data slice production. The supported frequency values:Minute, Hour, Day, Week, Month.
			2. For the **interval** property, specify the interval within the defined frequency. **frequency** set to **Hour** and **interval** set to **1** indicates that new data slices should be produced hourly. 
		3. In the **structure** section: 
			1. specify names and types of columns as shown in the following example:
				
				    "structure":
	        		[
	                	{ "name": "FirstName", "type": "String"},
	                	{ "name": "LastName", "type": "String"}
	        		],
	     
> [AZURE.NOTE] See the [Tables][msdn-tables-reference] topic in MSDN Library for descriptions of JSON elements that are used to define an Azure Data Factory table.  
 		           
### To create and activate a pipeline 
1. Click **New pipeline** on the toolbar. If you do not see the **New pipeline** button, click **...(ellipsis)** to see it.   
2. You will see the JSON template for creating a pipeline in the Editor canvas to the right. Do the following: 
	1. For the **description** property, specify description for the pipeline.
	2. For the **activities** section, add activities to the pipeline. Example:
	 
			"activities":	
			[
				{
					"name": "CopyFromBlobToSQL",
					"description": "Push Regional Effectiveness Campaign data to Azure SQL",
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
    		]
	3. For the **start** property, specify when data processing starts or the data slices will be processed. Example : 2014-05-01T00:00:00Z.
	4. For the **end** property, specify when data processing ends. Example : 2014-05-01T00:00:00Z.       

> [AZURE.NOTE] See the [Pipelines and Activities][msdn-pipelines-reference] topic in MSDN Library for descriptions of JSON elements that are used to define an Azure Data Factory pipeline.

## To add an activity definition to a pipeline JSON
You can add an activity definition to a pipeline JSON by clicking **Add Activity** on the toolbar. When you click this button, you choose the type of activity that you want to be added to the pipeline.  

![Add Activity options][add-activity-options]

If you want to copy data from an Azure SQL database to Azure blob storage and process the data in the blob storage by using Pig script on a HDInsight cluster, you first add a **Copy activity** and then add a **Pig activity** to the pipeline. This creates two sections with in the activities[] section of the pipeline JSON. Pig activity is nothing but the HDInsight Activity with Pig transformation. 

	"activities": [
    	{
    		"name": "CopyFromTabletoBlob",
	        "type": "CopyActivity",
			...
		}
		{
			"name": "ProcessBlobDataWithPigScript",
            "type": "HDInsightActivity",
			...
			"transformation": {
            	"type": "Pig",
				...
			}
		}
	]

## Starting a pipeline
You can specify the start date-time and end date-time for a pipeline by specifying values for the start and end properties in the JSON. 

 	{
	    "name": "ADFTutorialPipeline",
	    "properties":
	    {   
	        "description" : "Copy data from a blob to Azure SQL table",
	        "activities":   
	        [
				...
	        ],
	
	        "start": "2015-02-13T00:00:00Z",
	        "end": "2015-02-14T00:00:00Z",
	        "isPaused": false
	    }
	} 
  
## Drafts in the editor
Drafts allows you to temporarily save your work when you are context switching or navigating to a different entity in the Data Factory. The lifetime of the Drafts is associated with the browser session. If you close the browser or use another machine, the drafts are not going to be available.

## To discard a JSON draft of a Data Factory entity
You can discard the JSON definition of an Azure Data Factory entity by clicking **Discard** button on the toolbar.   

## To clone a Data Factory entity
You can clone an existing Azure Data Factory entity (linked service, table, or pipeline) by selecting the entity in the tree view and clicking the **Clone** button on the toolbar.

![Clone data factory entity][clone-datafactory-entity]

You will see a new draft created under **Drafts** node in the tree view. 

## To delete a Data Factory entity
You can delete an Azure Data Factory entity (linked service, table, or pipeline), select the entity in the tree view and click **Delete** on the toolbar (or) right-click the entity and click **Delete**.

![Delete data factory entity][delete-datafactory-entity] 

## See Also
See the [Get started with Azure Data Factory][data-factory-get-started] topic for step-by-step instructions to create an Azure data factory by using the Data Factory Editor. 

[msdn-tables-reference]: https://msdn.microsoft.com/library/dn835002.aspx
[msdn-linkedservices-reference]: https://msdn.microsoft.com/library/dn834986.aspx       
[msdn-pipelines-reference]: https://msdn.microsoft.com/library/dn834988.aspx  

[data-factory-get-started]: data-factory-get-started.md

[author-and-deploy-tile]: ./media/data-factory-editor/author-and-deploy-tile.png
[data=factory-editor]: ./media/data-factory-editor/data-factory-editor.png
[new-data-store-menu]: ./media/data-factory-editor/new-data-store-menu.png
[new-compute-menu]: ./media/data-factory-editor/new-compute-menu.png
[deploy-button]: ./media/data-factory-editor/deploy-button.png
[deploy-success-message]: ./media/data-factory-editor/deploy-success-message.png
[storagelinkedservice-in-treview]: ./media/data-factory-editor/storagelinkedservice-in-treeview.png
[delete-datafactory-entity]: ./media/data-factory-editor/delete-datafactory-entity.png
[clone-datafactory-entity]: ./media/data-factory-editor/clone-datafactory-entity.png
[add-activity-options]: ./media/data-factory-editor/add-activity-options.png