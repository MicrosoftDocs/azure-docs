<properties 
	pageTitle="Tutorial: Create a pipeline with Copy Activity using Code-free Authoring" 
	description="In this tutorial, you will create an Azure Data Factory pipeline with a Copy Activity by using the code-free authoring experience supported by Data Factory" 
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
	ms.topic="get-started-article" 
	ms.date="02/01/2016" 
	ms.author="spelluru"/>

# Tutorial: Create a pipeline with Copy Activity using Code-free Authoring
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-get-started.md)
- [Using Data Factory Editor](data-factory-get-started-using-editor.md)
- [Using Visual Studio](data-factory-get-started-using-vs.md)
- [Using PowerShell](data-factory-monitor-manage-using-powershell.md)
- [Using code-free authoring](data-factory-use-code-free-authoring.md)


> [AZURE.IMPORTANT] 
> Please go through the [Tutorial Overview](data-factory-get-started.md) article and complete the prerequisite steps before performing this tutorial.

## <a name="CreateDataFactory"></a>Step 1: Create an Azure data factory
In this step, you use the Azure Portal to create an Azure data factory named **ADFTutorialDataFactory**.

1.	After logging into the [Azure Portal][azure-portal], click **+ NEW** from the top-left corner, select **Data analytics** in the **Create** blade, and click **Data Factory** in the **Data analytics** blade. 

	![New->DataFactory](./media/data-factory-code-free-authoring/NewDataFactoryMenu.png)

6. In the **New data factory** blade:
	1. Enter **ADFTutorialDataFactory** for the **name**. 
	
  		![New data factory blade](./media/data-factory-code-free-authoring/getstarted-new-data-factory.png)
	2. Click **RESOURCE GROUP NAME** and do the following:
		1. Click **Create a new resource group**.
		2. In the **Create resource group** blade, enter **ADFTutorialResourceGroup** for the **name** of the resource group, and click **OK**. 

			![Create Resource Group](./media/data-factory-code-free-authoring/CreateNewResourceGroup.png)

		Some of the steps in this tutorial assume that you use the name: **ADFTutorialResourceGroup** for the resource group. To learn about resource groups, see [Using resource groups to manage your Azure resources](../resource-group-overview.md).  
7. In the **New data factory** blade, notice that **Add to Startboard** is selected.
8. Click **Create** in the **New data factory** blade.

	The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “ADFTutorialDataFactory” is not available**, change the name of the data factory (for example, yournameADFTutorialDataFactory) and try creating again. See [Data Factory - Naming Rules](data-factory-naming-rules.md) topic for naming rules for Data Factory artifacts.  
	 
	![Data Factory name not available](./media/data-factory-code-free-authoring/getstarted-data-factory-not-available.png)
	
	> [AZURE.NOTE] The name of the data factory may be registered as a DNS name in the future and hence become publically visible.  

9. Click **NOTIFICATIONS** hub on the left and look for notifications from the creation process. Click **X** to close the **NOTIFICATIONS** blade if it is open. 
10. After the creation is complete, you will see the **DATA FACTORY** blade as shown below.

    ![Data factory home page](/media/data-factory-code-free-authoring/getstarted-data-factory-home-page.png)

## Create a pipeline using code-free authoring experience

1. On the Data Factory home page, click the tool to launch **Code-free authoring** tile. 
2. In the **Properties** page, enter **CopyFromBlobToAzureSql** for **Task name**, enter description (optional), and click **Next**.  

	![Copy Tool - Properties page](/media/data-factory-code-free-authoring/CopyToolPropertiesPage.png) 
3. On the **Source data store** page, click **Azure Blob Storage** tile.

	![Copy Tool - Source data store page](/media/data-factory-code-free-authoring/CopyToolSourceDataStorePage.png)
5. On the **Specify the Azure Blob storage account**, enter **AzureStorageLinkedService** for **Linked service name**, select an **Azure subscription**, and then select an **Azure storage account** from the list of Azure storage accounts available in the subscription you selected. You can also choose to enter storage account settings manually by selecting **Enter manuall**y option for the **Account selection method**, and then click **Next**. 

	![Copy Tool - Specify the Azure Blob storage account](/media/data-factory-code-free-authoring/CopyToolSpecifyAzureBlobStorageAccount.png)
6. On **Choose the input file or folder** page, navigate to the **adftutorial** folder, select **emp.txt**, and click **Choose**, and then click **Next**. 

	![Copy Tool - Choose the input file or folder](/media/data-factory-code-free-authoring/CopyToolChooseInputFileOrFolder.png)
7. On the **File format settings** page, select **default** values and click **Next**.

	![Copy Tool - File format settings](/media/data-factory-code-free-authoring/CopyToolFileFormatSettings.png)  
8. On the Destination data store page, click **Azure SQL Database** tile, and click **Next**.
9. On **Specify the Azure SQL database** page, enter **AzureSqlLinkedService** for the Linked service name field. Confirm that the **Server/database selection method** is set to **From Azure subscriptions**. Select **Server name**, **Database**, enter **User name** and **Password**, and click **Next**.  
9. On the **Table mapping** page, select **emp** for the Destination field from the drop-down list, click down arrow (optional) to see the schema and to preview the data.

	![Copy Tool - Table mapping](/media/data-factory-code-free-authoring/copy-tool-table-mapping-page.png) 
10. On the **Schema mapping** page, click **Next**.
11. Review information in the **Summary** page, and click **Finish**. This will create two linked services, two datasets (input and output), and one pipeline in the data factory (from where you launched the code-free authoring experience). 
12. On the **Deployment succeeded** page, click **Click here to monitor copy pipeline**.

	![Copy Tool - Deployment succeeded](/media/data-factory-code-free-authoring/CopyToolDeploymentSucceeded.png)  
13. Use instructions from [Monitor and manage pipeline using Monitoring App](data-factory-monitor-manage-app.md) to learn about how to monitor the pipeline you just created.

	![Monitoring App](/media/data-factory-code-free-authoring/MonitoringApp.png) 
  