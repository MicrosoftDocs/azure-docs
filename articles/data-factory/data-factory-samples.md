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
	ms.date="03/07/2016" 
	ms.author="spelluru"/>

# Azure Data Factory - Samples

## Samples on GitHub
The [GitHub Azure-DataFactory repository](https://github.com/azure/azure-datafactory) contains several samples that help you quickly ramp up with Azure Data Factory service (or) modify the scripts and use it in own application. The Samples\JSON folder contains JSON snippets for common scenarios.

## Samples in Azure Portal
You can use the **Sample pipelines** tile on the home page of your data factory to deploy sample pipelines and their associated entities (datasets and linked services) into your data factory. 

1. Create a new data factory or open an existing data factory. See [Getting started with Azure Data Factory](data-factory-get-started.md#CreateDataFactory) for steps to create a data factory.
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
   
## Samples in Visual Studio

### Prerequisites

You must have the following installed on your computer: 

- Visual Studio 2013 or Visual Studio 2015
- Download Azure SDK for Visual Studio 2013 or Visual Studio 2015. Navigate to [Azure Download Page](https://azure.microsoft.com/downloads/) and click **VS 2013** or **VS 2015** in the **.NET** section.
- Download the latest Azuer Data Factory plugin for Visual Studio : [VS 2013](https://visualstudiogallery.msdn.microsoft.com/754d998c-8f92-4aa7-835b-e89c8c954aa5) or [VS 2015](https://visualstudiogallery.msdn.microsoft.com/371a4cf9-0093-40fa-b7dd-be3c74f49005). If you are using Visual Studio 2013, you can also update the plugin by doing the following: On the menu, click **Tools** -> **Extensions and Updates** -> **Online** -> **Visual Studio Gallery** -> **Microsoft Azure Data Factory Tools for Visual Studio** -> **Update**.

### Use Data Factory Templates

1. Click **File** on the menu, point to **New**, and click **Project**. 
2. In the **New Project** dialog box, do the following: 
	1. Select **DataFactory** under **Templates**. 
	2. Select **Data Factory Templates** in the right pane. 
	3. Enter a **name** for the project. 
	4. Select a **location** for the project. 
	5. Click **OK**. 

	![New project dialog box](./media/data-factory-samples/vs-new-project-adf-templates.png)
6. In the **Data Factory Templates** dialog box, select the sample template from the **Use-Case Templates** section, and click **Next**. The following steps walk you through using the **Customer Profiling** template. Steps are similar for the other sample(s). 

	![Data Factory Templates dialog box](./media/data-factory-samples/vs-data-factory-templates-dialog.png) 
7. In the **Data Factory Configuration** dialog, click **Next** on the **Data Factory Basics** page.
8. On the **Configure data factory** page, do the following: 
	1. select **Create New Data Factory** for the purpose of this walkthrough. You can also select **Use existing data factory**.
	2. Enter a **name** for the data factory.
	3. Select the **Azure subscription** in which you want the data factory to be created. 
	4. Select the **resource group** for the data factory.
	5. Select the **West US** or **North Europe** for the **region**.
	6. Click **Next**. 
9. In the **Configure data stores** page, specify an existing **Azure SQL database** and **Azure storage account** (or) create new ones, and click Next. 
10. In the **Configure compute** page, select defaults, and click **Next**. 
11. In the **Summary** page, review all settings, and click **Next**. 
12. In the **Deployment Status** page, wait until the deployment is finished, and click **Finish**.
13. Right-click project in the Solution Explorer, and click **Publish**. 
19. If you see **Sign in to your Microsoft account** dialog box, enter your credentials for the account that has Azure subscription, and click **sign in**.
20. You should see the following dialog box:

	![Publish dialog box](./media/data-factory-build-your-first-pipeline-using-vs/publish.png)

21. In the **Configure data factory** page, do the following: 
	1. Confirm that **Use existing data factory** option.
	2. Select the **data factory** you had select when using the template above. 
	6. Click **Next** to switch to the **Publish Items** page. (Press **TAB** to move out of the Name field to if the **Next** button is disabled.) 
23. In the **Publish Items** page, ensure that all the Data Factories entities are selected, and click **Next** to switch to the **Summary** page.     
24. Review the summary and click **Next** to start the deployment process and view the **Deployment Status**.
25. In the **Deployment Status** page, you should see the status of the deployment process. Click Finish after the deployment is done. 

See [Build your first data factory (Visual Studio)](data-factory-build-your-first-pipeline-using-vs.md) for details about using Visual Studio to author Data Factory entities and publishing them to Azure.          