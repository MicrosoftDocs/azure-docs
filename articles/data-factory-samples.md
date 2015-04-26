<properties 	
	pageTitle="Azure Data Factory - Samples" 
	description="Provides details about samples that ship with the Azure Data Factory service." 
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
	ms.date="04/25/2015" 
	ms.author="spelluru"/>

# Azure Data Factory - Samples

## Samples in Azure Portal
You can quickly deploy, review, and test an Azure Data Factory sample using the **Sample pipelines** blade in the Azure Portal. 

1. Create a new data factory or open an existing data factory. See [Getting started with Azure Data Factory][data-factory-get-started] for steps to create a data factory.
2. In the **DATA FACTORY** blade for the data factory, click the **Sample pipelines** tile.

	![Sample pipelines tile](./media/data-factory-samples/SamplePipelinesTile.png)

2. In the **Sample pipelines** blade, click the **sample** that you want to deploy. 
	
	![Sample pipelines blade](./media/data-factory-samples/SampleTile.png)

3. Specify configuration settings for the sample. For example, your Azure storage account name and account key, Azure SQL server name, database, User ID, and password, etc... 

	![Sample blade](./media/data-factory-samples/SampleBlade.png)

4. After you are done with specifying the configuration settings, click **Create** to create/deploy the sample pipelines and linked services/tables used by the pipelines.
5. You will see the status of deployment on the sample tile you clicked earlier on the **Sample pipelines** blade.

	![Deployment status](./media/data-factory-samples/DeploymentStatus.png)

6. When you see the **Deployment succeeded** message on the tile for the sample, close the **Sample pipelines** blade.  
5. On **DATA FACTORY** blade, you will see that linked services, data sets, and pipelines are added to your data factory.  

	![Data Factory blade](./media/data-factory-samples/DataFactoryBladeAfter.png)
   

The following table provides brief description of the samples available in the **Sample pipelines** tile. 

Sample name | description
----------- | -----------
Gaming customer profiling | Contoso is a gaming company that creates games for multiple platforms: game consoles, hand held devices, and personal computers (PCs). Each of these games produces tons of logs. Contoso’s goal is to collect and analyze the logs produced by these games to get usage information, identify up-sell and cross-sell opportunities, develop new compelling features etc... to improve business and provide better experience to customers. This sample collects sample logs, processes and enriches them with reference data, and transforms the data to evaluate the effectiveness of a marketing campaign that Contoso has recently launched.
 
## Samples on GitHub
The [GitHub Azure-DataFactory repository](https://github.com/azure/azure-datafactory) contains several samples that help you quickly ramp up with Azure Data Factory service (or) modify the scripts and use it in own application. The Samples\JSON folder contains JSON snippets for common scenarios.   

[data-factory-get-started]: data-factory-get-started.md#CreateDataFactory