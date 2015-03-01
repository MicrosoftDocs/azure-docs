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
	ms.date="02/28/2015" 
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
2. You will see the JSON template in the **Editor canvas** to the right. You will also see that a draft node appears under **Drafts**. Do the following:
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
2. You will see the JSON template in the Editor canvas to the right. Do the following:
	1. For **On-demand HDInsight cluster**, specify the following properties: 
		1. For the **clusterSize** property, specify the size of the HDInsight cluster you want the Data Factory service to create at runtime. 
		2. For the **jobsContainer** property, specify the name of the default blob container where you want the cluster logs will be stored.
		3. For the **timeToLive** property, specify the allowed idle time before the HDInsight cluster is deleted. For example: 00:05:00 indicates that the cluster should be be deleted after 5 minutes of idle time.
		4. For the **version** property, specify HDInsight version for the cluster (default: version 3.1).
		5. For the **linkedServiceName** property, specify the Azure storage linked service to be associated with the HDInsight cluster. 
	6. For **HDInsight cluster** (Bring-your-own), specify the following properties:
		1. For the **clusterUri** property, specify the URL for your own HDInsight cluster. 
		2. For the **userName** property, specify the user account that the Data Factory service should use to connect to your HDInsight cluster. 
		3. For the **password** property, specify the password for the user account. 
		4. For the **linkedServiceName** property, specify the Azure storage linked service that is associated with yhour HDInsight cluster.
	5. For **AzureML linked service**, specify the following properties:
		1. for the **mlEndPoint** property, specify the Azure Machine Learning batch scoring URL.
		2. for the **apiKey** property, specify the API key for the published workspace model.
3. Click **Deploy** on the toolbar to deploy the linked service.

### To create a new dataset

   
		
		           
   




         

[author-and-deploy-tile]: ../media/data-factory-editor/author-and-deploy-tile.png
[data=factory-editor]: ../media/data-factory-editor/data-factory-editor.png
[new-data-store-menu]: ../media/data-factory-editor/new-data-store-menu.png
[new-compute-menu]: ../media/data-factory-editor/new-compute-menu.png
[deploy-button]: ../media/data-factory-editor/deploy-button.png
[deploy-success-message]: ../media/data-factory-editor/deploy-success-message.png
[storagelinkedservice-in-treview]: ../media/data-factory-editor/storagelinkedservice-in-treeview.png