<properties 
	pageTitle="Troubleshoot Azure Data Factory issues" 
	description="Learn how to troubleshoot issues with using Azure Data Factory." 
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
	ms.date="06/15/2016" 
	ms.author="spelluru"/>

# Troubleshoot Data Factory issues
This article provides troubleshooting tips for issues when using Azure Data Factory. This does not all the possible issues when using the service, but it covers some issues and general troubleshooting tips.   

## Troubleshooting tips

### Error: The subscription is not registered to use namespace 'Microsoft.DataFactory'
If you receive this error, the Azure Data Factory resource provider has not been registered on your machine. Please do the following: 

1. Launch Azure PowerShell. 
2. Login to your Azure account using the following command.
		Login-AzureRmAccount 
3. Run the following command to register the Azure Data Factory provider.
		Register-AzureRmResourceProvider -ProviderNamespace Microsoft.DataFactory

### Problem: Unauthorized error when running a Data Factory cmdlet
You are probably not using the right Azure account or subscription with the Azure PowerShell. Use the following cmdlets to select the right Azure account and subscription to use with the Azure PowerShell. 

1. Login-AzureRmAccount - Use the right user ID and password
2. Get-AzureRmSubscription - View all the subscriptions for the account. 
3. Select-AzureRmSubscription <subscription name> - Select the right subscription. Use the same one you use to create a data factory on the Azure Portal.

### Problem: Fail to launch Data Management Gateway Express Setup from Azure Portal
The Express setup for the Data Management Gateway requires Internet Explorer or a Microsoft ClickOnce compatible web browser. If the Express Setup fails to start, do one of the following: 

- Please use Internet Explorer or a Microsoft ClickOnce compatible web browser.

	If you are using Chrome, go to the [Chrome web store](https://chrome.google.com/webstore/), search with "ClickOnce" keyword, choose one of the ClickOnce extensions, and install it. 
	
	You need to do the same for Firefox (install add-in). Click Open Menu button on the toolbar (three horizontal lines in the top-right corner), click Add-ons, search with "ClickOnce" keyword, choose one of the ClickOnce extensions, and install it. 

- Use the **Manual Setup** link shown on the same blade in the portal to download installation file and run it manually. After the installation is successful, you will see the Data Management Gateway Configuration dialog box. Copy the **key** from the portal screen and use it in the configuration manager to manually register the gateway with the service.  

### Problem: Fail to connect to on-premises SQL Server 
Launch **Data Management Gateway Configuration Manager** on the gateway machine and use the **Troubleshooting** tab to test the connection to SQL Server from the gateway machine. See [Gateway troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for details.  
 

### Problem: Input slices are in Waiting state for ever

The slices could be in **Waiting** state due to a number of reasons and one of the common reasons is that the **external** property is not set to **true**. Any dataset that is produced outside the scope of Azure Data Factory should be marked with **external** property . This indicates that the data is external and not backed by any pipelines within the data factory. The data slices are marked as **Ready** once the data is available in the respective store. 

See the following example for the usage of the **external** property. You can optionally specify **externalData*** when you set external to true.. 

See [Datasets](data-factory-create-datasets.md) article for more details about this property.
	
	{
	  "name": "CustomerTable",
	  "properties": {
	    "type": "AzureBlob",
	    "linkedServiceName": "MyLinkedService",
	    "typeProperties": {
	      "folderPath": "MyContainer/MySubFolder/",
	      "format": {
	        "type": "TextFormat",
	        "columnDelimiter": ",",
	        "rowDelimiter": ";"
	      }
	    },
	    "external": true,
	    "availability": {
	      "frequency": "Hour",
	      "interval": 1
	    },
	    "policy": {
	      }
	    }
	  }
	}

To resolve the error, add the **external** property and the optional **externalData** section to the JSON definition of the input table and recreate the table. 

### Problem: Hybrid copy operation fails
See [Gateway troubleshooting](data-factory-move-data-between-onprem-and-cloud.md#gateway-troubleshooting) for steps to troubleshoot issues with copying to/from an on-premises data store using the Data Management Gateway. 

### Problem: On-demand HDInsight provisioning fails
When using a linked service of type HDInsightOnDemand, you need to specify a linkedServiceName that points to an Azure Blob Storage. Data Factory service uses this storage to store logs and supporting files for your on-demand HDInsight cluster.  Sometimes provisioning of an on-demand HDInsight cluster fails with the following error:

		Failed to create cluster. Exception: Unable to complete the cluster create operation. Operation failed with code '400'. Cluster left behind state: 'Error'. Message: 'StorageAccountNotColocated'.

This error usually indicates that the location of the storage account specified in the linkedServiceName is not in the same data center location where the HDInsight provisioning is happening. For example, if your Azure Data Factory location is West US, and the on-demand HDInsight provisioning happens in West US, but the Azure blob storage account location  is set to East US, the on-demand provisioning will fail.

Additionally, there is a second JSON property additionalLinkedServiceNames where additional storage accounts may be specified in on-demand HDInsight. Those additional linked storage accounts should be in the same location as the HDInsight cluster, or it will fail with the same error.

### Problem: Custom .NET activity fails
See [Debug a pipeline with custom activity](data-factory-use-custom-activities.md#debug-the-pipeline) for detailed steps. 

## Use Azure Portal to troubleshoot 

### Using portal blades
See [Monitor pipeline](data-factory-build-your-first-pipeline-using-editor.md#monitor-pipeline) for steps. 

### Using Monitor and Manage App
See [Monitor and manage data factory pipelines using Monitor and Manage App](data-factory-monitor-manage-app.md) for details. 

## Use Azure PowerShell to troubleshoot

### Use Azure PowerShell to troubleshoot an error  
See [Monitor Data Factory pipelines using Azure PowerShell](data-factory-build-your-first-pipeline-using-powershell.md#monitor-pipeline) for details. 


[adfgetstarted]: data-factory-copy-data-from-azure-blob-storage-to-sql-database.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456
[json-scripting-reference]: http://go.microsoft.com/fwlink/?LinkId=516971

[azure-portal]: https://portal.azure.com/

[image-data-factory-troubleshoot-with-error-link]: ./media/data-factory-troubleshoot/DataFactoryWithErrorLink.png

[image-data-factory-troubleshoot-datasets-with-errors-blade]: ./media/data-factory-troubleshoot/DatasetsWithErrorsBlade.png

[image-data-factory-troubleshoot-table-blade-with-problem-slices]: ./media/data-factory-troubleshoot/TableBladeWithProblemSlices.png

[image-data-factory-troubleshoot-activity-run-with-error]: ./media/data-factory-troubleshoot/ActivityRunDetailsWithError.png

[image-data-factory-troubleshoot-dataslice-blade-with-active-runs]: ./media/data-factory-troubleshoot/DataSliceBladeWithActivityRuns.png

[image-data-factory-troubleshoot-walkthrough2-with-errors-link]: ./media/data-factory-troubleshoot/Walkthrough2WithErrorsLink.png

[image-data-factory-troubleshoot-walkthrough2-datasets-with-errors]: ./media/data-factory-troubleshoot/Walkthrough2DataSetsWithErrors.png

[image-data-factory-troubleshoot-walkthrough2-table-with-problem-slices]: ./media/data-factory-troubleshoot/Walkthrough2TableProblemSlices.png

[image-data-factory-troubleshoot-walkthrough2-slice-activity-runs]: ./media/data-factory-troubleshoot/Walkthrough2DataSliceActivityRuns.png

[image-data-factory-troubleshoot-activity-run-details]: ./media/data-factory-troubleshoot/Walkthrough2ActivityRunDetails.png
 