<properties title="Enable your pipelines to work with on-premises data" pageTitle="Enable your pipelines to work with on-premises data | Azure Data Factory" description="Learn how to register an on-premises data source with an Azure data factory and copy data to/from the data source." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/13/2014" ms.author="spelluru" />

# Enable your pipelines to work with on-premises data

To enable your pipelines in an Azure data factory to work with an on-premises data source, you need to add the on-premises data source as a linked service to the data factory by using either Azure Management Portal or Azure PowerShell.
 
To be able to add an on-premises data source as a linked service to a data factory, you first need to download and install Microsoft Data Management Gateway on an on-premises computer and configure linked service for the on-premises data source to use the gateway .
 
> [AZURE.NOTE] Only SQL Server is the supported on-premises data source at this moment.

## <a href="DMG"></a> Data Management Gateway

**Data Management Gateway** is a software that connects on-premises data sources to cloud services in a secure and managed way. With Data Management Gateway, you can

- **Connect to on-premises data for Hybrid data access** – You can connect on-premises data to cloud services to benefit from cloud services while keeping the business running with on-premises data.
- **Define a secure data proxy** – You can define which on-premises data sources are exposed with Data Management Gateway so that gateway authenticates the data request from cloud services and safeguards the on-premises data sources.
- **Manage your gateway for complete governance** – You are provided with full monitoring and logging of all the activities inside the Data Management Gateway for management and governance.
- **Move data efficiently** – Data is transferred in parallel, resilient to intermittent network issues with auto retry logic.


Data Management Gateway has a full range of on-premises data connection capabilities that include the following:

- **Non-intrusive to corporate firewall** – Data Management Gateway just works after installation, without having to open up a firewall connection or requiring intrusive changes to your corporate network infrastructure.
- **Encrypt credentials with your certificate** – Credentials used to connect to data sources are encrypted with a certificate fully owned by a user. Without the certificate, no one can decrypt the credentials into plain text, including Microsoft.

### Gateway installation - best practices

1.	If the host machine hibernates, the gateway won’t be able to respond to the data request. Therefore, configure an appropriate **power plan** on the computer before installing the gateway. 
2.	Data Management Gateway should be able to connect to the on-premises data sources that will be registered with the Azure Data Factory service. It does not need to be on the same machine as the data source, but **staying closer to the data source** reduces the time for the gateway to connect to the data source.

### Considerations for using Data Management Gateway
1.	A single instance of Data Management Gateway can be used for multiple on-premises data sources, but keep in mind that a **gateway is tied to an Azure data factory** and can not be shared with another data factory.
2.	You can have **only one instance of Data Management Gateway** installed on your machine. Suppose, you have two data factories that need to access on-premises data sources, you need to install gateways on two on-premises computers where each gateway tied to a separate data factory.
3.	If you already have a gateway installed on your computer serving a **Power BI** scenario, please install a **separate gateway for Azure Data Factory** on another machine. 
 

## Walkthrough

In this walkthrough, you create a data factory with a pipeline that moves data from an on-premises SQL Server database to an Azure blob. 

### Step 1: Create an Azure data factory
In this step, you use the Azure Management Portal to create an Azure Data Factory instance named **ADFTutorialOnPremDF**. You can also create a data factory by using Azure Data Factory cmdlets. 

1.	After logging into the [Azure Preview Portal][
2.	azure-preview-portal], click **NEW** from the bottom-left corner, and click **Data Factory** on the **New** blade.

	![New->DataFactory][image-data-factory-new-datafactory-menu] 
	
	If you do not see **Data Factory** on the **New** blade, scroll down.  
6. In the **New data factory** blade:
	1. Enter **ADFTutorialOnPremDF** for the **name**.
	2. Click **RESOURCE GROUP NAME** and select **ADFTutorialResourceGroup** (if you had done the tutorial from [Get started with Azure Data Factory][adfgetstarted]. You can select an existing resource group or create a new one. To create a new resource group:
		1. Click **Create a new resource group**.
		2. In the **Create resource group blade**, enter a **name** for the resource group, and click **OK**.

7. Note that **Add to Startboard** is checked on the **New data factory** blade.

	![Add to Startboard][image-data-factory-add-to-startboard]

8. In the **New data factory** blade, click **Create**.
9. Look for notifications from the creation process in the **NOTIFICATIONS** hub on the left.

	![NOTIFICATIONS hub][image-data-factory-notifications-hub]

11. After creation is complete, you will see the Data Factory blade as shown below:

	![Data Factory Home Page][image-data-factory-datafactory-homepage]

12. You should also see it on the **Startboard** as shown below. Click it to open the **Data Factory blade** if it is not already open.

	![Startboard][image-data-factory-startboard]

### Step 2: Create linked services 
In this step, you will create two linked services: **MyBlobStore** and **OnPremSqlLinkedService**. The **OnPremSqlLinkedService** links an on-premises SQL Server database and the **MyBlobStore** linked service links an Azure blob store to the **ADFTutorialDataFactory**. You will create a pipeline later in this walkthrough that copies data from the on-premises SQL Server database to the Azure blob store. 

### Add a linked service to an on-premises SQL Server database
1.	On the **Data Factory** blade for **ADFTutorialOnPremDF**, click **Linked Services**. 

	![Data Factory Home Page][image-data-factory-home-age]

2.	On the **Linked Services** blade, click **+ Data gateway**.

	![Linked Services - Add a Gateway button][image-data-factory-linkedservices-add-gateway-button]

2. In the **Create** blade, enter **adftutorialgateway** for the **name**, and click **OK**. 	

	![Create Gateway blade][image-data-factory-create-gateway-blade]

3. In the **Configure** blade, click **Install directly on this computer**. This will download the installation package for the gateway, install, configure, and register the gateway on the computer.

	![Gateway - Configure blade][image-data-factory-gateway-configure-blade]

	This is the easiest way (one-click) to download, install, configure, and register the gateway in one single step. You can see the **Microsoft Data Management Gateway Configuration Manager** application is installed on your computer. You can also find the executable **ConfigManager.exe** in the folder: **C:\Program Files\Microsoft Data Management Gateway\1.0\Shared**.

	You can also download and install gateway manually by using the links in this blade and register it using the key shown in the **REGISTER WITH KEY** text box.
	
	See [Data Management Gateway](#DMG) section for details about the gateway including best practices and important considerations. 

4. Click **OK** on the **New data gateway** blade.
5. Launch **Microsoft Data Management Gateway Configuration Manager** application  on your computer.

	![Gateway Configuration Manager][image-data-factory-gateway-configuration-manager]

6. Wait until the values are set as follows :
	1. If the Service **status** is not set to **Started**, click **Start service** to start the service and wait for a minute for the other fields to refresh.
	2. **Gateway name** is set to **adftutorialgateway**.
	3. **Instance name** is set to **adftutorialgateway**.
	4. **Gateway key status** is set to **Registered**.
	5. The status bar the bottom displays **Connected to Data Management Gateway Cloud Service** along with a **green check mark**.  

7. On the **Linked Services** blade, confirm that the **status** of the gateway is **Good** and click **+ Data store**. You may need to close and reopen the blade to refresh the blade. 

	![Add Data Store button][image-data-factory-add-datastore-SQL-button]

8. In the **New data store** blade, enter **OnPremSqlLinkedService** for the **name**.
9. Click **TYPE (Settings required)** and select **SQL Server**. 
10. In the **New data store** blade, click **DATA GATEWAY (Configure required settings)**.

	![Data Gateway Configure link][image-data-factory-gateway-configure-link]
  
11. Select **adftutorialgateway** you created earlier. 
12.	In the **New data store** blade, click **CREDENTIALS** to see the **Credentials** blade.

	![Data Source Credentials Blade][image-data-factory-credentials-blade]

13.	In the **Credentials** blade, click **Click here to set Credentials securely**. It will launch the following pop up dialog box.

	![One Click application install][image-data-factory-oneclick-install]

14. Click **Run** to install the **Credentials Manager** application and you see the Setting Credentials dialog box. 
15.	In the **Setting Credentials** dialog box, enter **user name** and **password** that the service can use to access the on-premises SQL Server database, and click **OK**. Only **SQL Authentication** is supported by this dialog box. Wait until the dialog box closes.
16.	Click **OK** on **Credentials** blade and click **OK** on **New data store** blade. You should see the **OnPremSqlLinkedService** linked service you added on the Linked Services blade.

	![Linked Services Blade with OnPrem Store][image-data-factory-linkedservices-blade-onprem]

	
   


#### Add a linked service for an Azure storage account

1.	In the **Data Factory** blade, click **Linked Services** tile to launch the **Linked Services** blade.
2. In the **Linked Services** blade, click **Add data store**.	
3. In the **New data store** blade:
	1. Enter a **name** for the data store. For the purpose of the tutorial, enter **MyBlobStore** for the **name**.
	2. Enter **description (optional)** for the data store.
	3. Click **Type**.
	4. Select **Azure storage account**, and click **OK**.
		
		![Azure Storage Account][image-data-factory-azure-storage-account]

4. Now, you are back to **New data store** blade that looks as below:

	![Azure Storage settings][image-data-factory-azure-storage-settings]

5. Enter the **Account Name** and **Account Key** for your Azure Storage Account, and click **OK**.

  
6. After you click **OK** on the **New data store** blade, you should see **MyBlobStore** in the list of **DATA STORES** on the **Linked Services** blade. Check **NOTIFICATIONS** Hub (on the left) for any messages.

	![Linked Services blade with MyBlobStore][image-data-factory-linkedservices-with-storage]

 
## Step 3: Create input and output datasets
In this step, you will create input and output datasets that represent input and output data for the copy operation (On-premises SQL Server database => Azure blob storage). Creating datasets and pipelines is not supported by the Azure Portal yet, so you will be using Azure PowerShell cmdlets to create tables and pipelines. Before creating datasets or tables (rectangular datasets), you need to do the following (detailed steps follows the list):

- Create a table named **emp** in the SQL Server Database you added as a linked service to the data factory and insert couple of sample entries into the table.
- - If you haven’t gone through the tutorial from [Get started with Azure Data Factory][adfgetstarted] article, create a blob container named **adftutorial** in the Azure blob storage account you added as a linked service to the data factory.

### Prepare On-premises SQL Server for the tutorial

1. In the database you specified for the on-premises SQL Server linked service (**OnPremSqlLinkedService**), use the following SQL script to create the **emp** table in the database.


        CREATE TABLE dbo.emp
		(
			ID int IDENTITY(1,1) NOT NULL, 
			FirstName varchar(50),
			LastName varchar(50),
    		CONSTRAINT PK_emp PRIMARY KEY (ID)
		)
		GO
 

2. Insert some sample into the table: 


        INSERT INTO emp VALUES ('John', 'Doe')
		INSERT INTO emp VALUES ('Jane', 'Doe')



### Create input table

1.	Create a JSON file for a Data Factory table that represents data from the **emp** table in the SQL Server database. Launch **Notepad**, copy the following JSON script, and save it as **EmpOnPremSQLTable.json** in the C:\ADFGetStarted\**OnPrem** folder. Create **OnPrem** subfolder in **C:\ADFGetStarted** folder if it doesn't exist. 


        {
    		"name": "EmpOnPremSQLTable",
    		"properties":
    		{
        		"location":
        		{
            		"type": "OnPremisesSqlServerTableLocation",
            		"tableName": "emp",
            		"linkedServiceName": "OnPremSqlLinkedService"
        		},
        		"availability": 
        		{
            		"frequency": "Hour",
            		"interval": 1,       
	    			"waitOnExternal":
	    			{
        				"retryInterval": "00:01:00",
	        			"retryTimeout": "00:10:00",
	        			"maximumRetry": 3
	    			}
		  
        		}
    		}
		}

	Note the following: 
	
	- location **type** is set to **OnPremisesSqlServerTableLocation**.
	- **tableName** is set to **emp**.
	- **linkedServiceName** is set to **OnPremSqlLinkedService** (you had created this linked service in Step 2).
	- For an input table that is not generated by another pipeline in Azure Data Factory, you must specify **waitOnExternal** section in the JSON. It denotes the input data is produced external to the Azure Data Factory service.   

	See [JSON Scripting Reference][json-script-reference] for details about JSON properties.

2. The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode. Launch **Azure PowerShell**, and execute the following command to switch to the **AzureResourceManager** mode.     

        switch-azuremode AzureResourceManager

	Download [Azure PowerShell][azure-powershell-install] if you don't have it installed on it your computer.
3. Use the **New-AzureDataFactoryTable** cmdlet to create the input table using the **EmpOnPremSQLTable.json** file.

		New-AzureDataFactoryTable -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialOnPremDF –File C:\ADFGetStarted\OnPrem\EmpOnPremSQLTable.json  
	
	Update the command if you are using a different resource group.

### Create output table

1.	Create a JSON file for a Data Factory table to be used as an output for the pipeline you will be creating in the next step. Launch Notepad, copy the following JSON script, and save it as **OutputBlobTable.json** in the **C:\ADFGetStarted\OnPrem** folder.

		{
    		"name": "OutputBlobTable",
    		"properties":
    		{
        		"location": 
        		{
            		"type": "AzureBlobLocation",
            		"folderPath": "adftutorial/outfromonpremdf",
            		"format":
            		{
                		"type": "TextFormat",
                		"columnDelimiter": ","
            		},
            		"linkedServiceName": "MyBlobStore"
        		},
        		"availability": 
        		{
            		"frequency": "Hour",
            		"interval": 1
        		}
    		}
		}
  
	Note the following: 
	
	- location **type** is set to **AzureBlobLocation**.
	- **linkedServiceName** is set to **MyBlobStore** (you had created this linked service in Step 2).
	- **folderPath** is set to **adftutorial/outfromonpremdf** where outfromonpremdf is the folder in the adftutorial container. You just need to create the **adftutorial** container.
	- The **availability** is set to **hourly** (**frequency** set to **hour** and **interval** set to **1**).  The Data Factory service will generate an output data slice every hour in the **emp** table in the Azure SQL Database. 

	if you don't specify a **fileName** for an **input table**, all files/blobs from the input folder (**folderPath**) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input. See the sample files in the [tutorial][adf-tutorial] for examples.
 
	If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.<Guid>.txt (for example: : Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

	To set **folderPath** and **fileName** dynamically based on the **SliceStart** time, use the partitionedBy property. In the following example, folderPath uses Year, Month, and Day from from the SliceStart (start time of the slice being processed) and fileName uses Hour from the SliceStart. For example, if a slice is being produced for 2014-10-20T08:00:00, the folderName is set to wikidatagateway/wikisampledataout/2014/10/20 and the fileName is set to 08.csv. 

	  	"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
        "fileName": "{Hour}.csv",
        "partitionedBy": 
        [
        	{ "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
            { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } }, 
            { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } }, 
            { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } } 
        ],

 

	See [JSON Scripting Reference][json-script-reference] for details about JSON properties.

2.	In the **Azure PowerShell**, execute the following command to create another Data Factory table to represent the table in the Azure SQL Database.

		New-AzureDataFactoryTable -DataFactoryName ADFTutorialOnPremDF -File C:\ADFGetStarted\OnPrem\OutputBlobTable.json -ResourceGroupName ADFTutorialResourceGroup  

## Step 4: Create and run a pipeline
In this step, you create a **pipeline** with one **Copy Activity** that uses **EmpOnPremSQLTable** as input and **OutputBlobTable** as output.

1.	Create a JSON file for the pipeline. Launch Notepad, copy the following JSON script, and save it as **ADFTutorialPipelineOnPrem.json** in the **C:\ADFGetStarted\OnPrem** folder.
	 

        {
			"name": "ADFTutorialPipelineOnPrem",
    		"properties":
    		{
        		"description" : "This pipeline has one Copy activity that copies data from an on-prem SQL to Azure blob",
	       		 "activities":
	        	[
			    	{
						"name": "CopyFromSQLtoBlob",
						"description": "Copy data from on-prem SQL server to blob",		
						"type": "CopyActivity",
						"inputs": [ {"name": "EmpOnPremSQLTable"} ],
						"outputs": [ {"name": "OutputBlobTable"} ],
						"transformation":
						{
							"source":
							{                               
								"type": "SqlSource",
								"sqlReaderQuery": "select * from emp"
							},
							"sink":
							{
								"type": "BlobSink"
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
			}
		}

	Note the following:
 
	- In the activities section, there is only activity whose **type** is set to **CopyActivity**.
	- **Input** for the activity is set to **EmpOnPremSQLTable** and **output** for the activity is set to **OutputBlobTable**.
	- In the **transformation** section, **SqlSource** is specified as the **source type** and **BlobSink **is specified as the **sink type**.
	- SQL query **select * from emp** is specified for the **sqlReaderQuery** property of **SqlSource**.

2. Use the **New-AzureDataFactoryPipeline** cmdlet to create a pipeline using the **ADFTutorialPipeline.json** file you created.

		New-AzureDataFactoryPipeline  -DataFactoryName ADFTutorialOnPremDF -File C:\ADFGetStarted\OnPrem\ADFTutorialPipelineOnPrem.json -ResourceGroupName ADFTutorialResourceGroup  

3. Once the pipeline is created, you can specify the duration in which data processing will occur. By specifying the active period for a pipeline, you are defining the time duration in which the data slices will be processed based on the **Availability** properties that were defined for each Azure Data Factory table.  Execute the following PowerShell command to set active period on pipeline and enter Y to confirm. 


		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialOnPremDF -StartDateTime 2014-09-29Z –EndDateTime 2014-09-30Z –Name ADFTutorialPipelineOnPrem  

	> [AZURE.NOTE] Replace **StartDateTime** value with the current day and **EndDateTime** value with the next day. Both StartDateTime and EndDateTime must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z.The EndDateTime is optional, but we will use in this tutorial.
	> If you do not specify **EndDateTime**, it is calculated as "**StartDateTime + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the **EndDateTime**.

	In the example above, there will be 24 data slices as each data slice is produced hourly.
4. In the **Azure Preview Portal**, click **Diagram** tile on the home page for the **ADFTutorialOnPremDF** data factory. :

	![Diagram Link][image-data-factory-diagram-link]

5. You should see the diagram similar to the following:

	![Diagram View][image-data-factory-diagram-view]

	**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a 	pipeline and started the workflow.

## Step 5: Monitor the datasets and pipelines
In this step, you will use the Azure Portal to monitor what’s going on in an Azure data factory. You can also use PowerShell cmdlets to monitor datasets and pipelines. For details about using cmdlets for monitoring, see [Monitor and Manage Azure Data Factory using PowerShell][monitor-manage-powershell].

1. Navigate to **Azure Preview Portal** (if you have closed it)
2. If the blade for **ADFTutorialOnPremDF** is not open, open it by clicking **ADFTutorialOnPremDF** on the **Startboard**.
3. You should see the **count** and **names** of tables and pipeline you created on this blade.

	![Data Factory Home Page][image-data-factory-homepage-2]
4. Now, click **Datasets** tile.
5. On the **Datasets** blade, click the **EmpOnPremSQLTable**.

	![EmpOnPremSQLTable slices][image-data-factory-onprem-sqltable-slices]

6. Notice that the data slices up to the current time have already been produced and they are **Ready**. It is because you have inserted the data in the SQL Server database and it is there all the time. Confirm that no slices show up in the **Problem slices** section at the bottom.
7. Now, In the **Datasets** blade, click **OutputBlobTable**.

	![OputputBlobTable slices][image-data-factory-output-blobtable-slices]
8. Confirm that slices up to the current time are produced and **Ready**.
9. Click on any data slice from the list and you should see the **DATA SLICE** blade.

	![Data Slice Blade][image-data-factory-dataslice-blade]
10. Click on the **activity run** from the list at the bottom to see **activity run details**.

	![Activity Run Details blade][image-data-factory-activity-run-details]

11. Click **X** to close all the blades until you get back to the home blade for the **ADFTutorialOnPremDF**.
14. (optional) Click **Pipelines**, click **ADFTutorialOnPremDF**, and drill through input tables (**Consumed**) or output tables (**Produced**).
15. Use tools such as **Azure Storage Explorer** to verify the output.

	![Azure Storage Explorer][image-data-factory-stroage-explorer]


## Creating and registering a gateway using Azure PowerShell cmdlets
This section describes how to create and register a gateway using Azure PowerShell cmdlets. 

1. Launch **Azure PowerShell** in administrator mode. 
2. The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode. Execute the following command to switch to the **AzureResourceManager** mode.     

        switch-azuremode AzureResourceManager


2. Use the **New-AzureDataFactoryGateway** cmdlet to create a logical gateway as follows:

		New-AzureDataFactoryGateway -Name <gatewayName> -DataFactoryName $df -Location “West US” -ResourceGroupName ADF –Description <desc>

	**Example command and output**:


		PS C:\> New-AzureDataFactoryGateway -Name MyGateway -DataFactoryName $df -Location "West US" -ResourceGroupName ADF –Description “gateway for walkthrough”

		Name            : MyGateway
		Location        : West US
		Description     : gateway for walkthrough
		Version         :
		Status          : NeedRegistration
		VersionStatus   : None
		CreateTime      : 9/28/2014 10:58:22
		RegisterTime    :
		LastConnectTime :
		ExpiryTime      :


3. Use the **New-AzureDataFactoryGatewayKey** cmdlet to generate a registration key for the newly created gateway, and store the key in a local variable **$Key**:

		New-AzureDataFactoryGatewayKey -GatewayName <gatewayname> -ResourceGroupName ADF -DataFactoryName $df 

	
	**Example command output:**


		PS C:\> $Key = New-AzureDataFactoryGatewayKey -GatewayName MyGateway -ResourceGroupName ADF -DataFactoryName $df 

	
4. In Azure PowerShell, switch to the folder: **C:\Program Files\Microsoft Data Management Gateway\1.0\PowerShellScript\** and Run **RegisterGateway.ps1** script associated with the local variable **$Key** as shown in the following command to register the client agent installed on your machine with the logical gateway you create earlier.

		PS C:\> .\RegisterGateway.ps1 $Key.GatewayKey
		
		Agent registration is successful!

5. You can use the **Get-AzureDataFactoryGateway** cmdlet to get the list of Gateways in your data factory. When the **Status** shows **online**, it means your gateway is ready to use.

		Get-AzureDataFactoryGateway -DataFactoryName $df -ResourceGroupName ADF

You can remove a gateway using the **Remove-AzureDataFactoryGateway** cmdlet and update description for a gateway using the **Set-AzureDataFactoryGateway** cmdlets. For syntax and other details about these cmdlets, see Data Factory Cmdlet Reference.  




## See Also

Article | Description
------ | ---------------
[Get started with Azure Data Factory][adf-getstarted] | This article provides an end-to-end tutorial that shows you how to create a sample Azure data factory that copies data from an Azure blob to an Azure SQL database.
[Use Pig and Hive with Data Factory][use-pig-and-hive-with-data-factory] | This article has a walkthrough that shows how to use HDInsight Activity to run a hive/pig script to process input data to produce output data. 
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issues.  
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 



[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[adf-getstarted]: ../data-factory-get-started
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[use-pig-and-hive-with-data-factory]: ../data-factory-pig-hive-activities
[troubleshoot]: ../data-factory-troubleshoot
[data-factory-introduction]: ../data-factory-introduction

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[64bit-download-link]: http://go.microsoft.com/fwlink/?LinkId=517623
[32bit-download-link]: http://go.microsoft.com/fwlink/?LinkId=517624

[azure-preview-portal]: http://portal.azure.com
[adfgetstarted]: ../data-factory-get-started
[monitor-manage-powershell]: ../data-factory-monitor-manage-using-powershell





[json-script-reference]: http://go.microsoft.com/fwlink/?LinkId=516971
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456



[azure-powershell-install]: http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/


[image-data-factory-onprem-new-everything]: ./media/data-factory-use-onpremises-datasources/OnPremNewEverything.png

[image-data-factory-onprem-datastorage-cache-backup]: ./media/data-factory-use-onpremises-datasources/OnPremDataStorageCacheBackup.png

[image-data-factory-onprem-datastorage-see-all]: ./media/data-factory-use-onpremises-datasources/OnPremDataStorageSeeAll.png

[image-data-factory-onprem-dataservices-blade]: ./media/data-factory-use-onpremises-datasources/OnPremDataServicesBlade.png

[image-data-factory-onprem-datafactory-preview-blade]: ./media/data-factory-use-onpremises-datasources/DataFactoryPreviewBlade.png

[image-data-factory-onprem-create-resource-group]: ./media/data-factory-use-onpremises-datasources/OnPremCreateResourceGroup.png

[image-data-factory-add-to-startboard]: ./media/data-factory-use-onpremises-datasources/OnPremNewDataFactoryAddToStartboard.png

[image-data-factory-notifications-hub]: ./media/data-factory-use-onpremises-datasources/OnPremNotificationsHub.png

[image-data-factory-datafactory-homepage]: ./media/data-factory-use-onpremises-datasources/OnPremDataFactoryHomePage.png

[image-data-factory-startboard]: ./media/data-factory-use-onpremises-datasources/OnPremStartboard.png

[image-data-factory-linkedservices-blade]: ./media/data-factory-use-onpremises-datasources/OnPremLinkedServicesBlade.png

[image-data-factory-linkedservices-add-datastore-button]: ./media/data-factory-use-onpremises-datasources/ONPremLinkedServicesAddDataStoreButton.png

[image-data-factory-new-datastore-blade]: ./media/data-factory-use-onpremises-datasources/OnPremNewDataStoreBlade.png

[image-data-factory-azure-storage-account]: ./media/data-factory-use-onpremises-datasources/OnPremAzureStorageAccount.png

[image-data-factory-azure-storage-settings]: ./media/data-factory-use-onpremises-datasources/OnPremAzureStorageSettings.png

[image-data-factory-get-storage-key]: ./media/data-factory-use-onpremises-datasources/OnPremGetStorageKey.png

[image-data-factory-linkedservices-with-storage]: ./media/data-factory-use-onpremises-datasources/OnPremLinkedServicesWithMyBlobStore.png

[image-data-factory-linkedservices-add-gateway-button]: ./media/data-factory-use-onpremises-datasources/OnPremLinkedServicesAddGaewayButton.png

[image-data-factory-create-gateway-blade]: ./media/data-factory-use-onpremises-datasources/OnPremCreateGatewayBlade.png

[image-data-factory-gateway-configure-blade]: ./media/data-factory-use-onpremises-datasources/OnPremGatewayConfigureBlade.png

[image-data-factory-gateway-configuration-manager]: ./media/data-factory-use-onpremises-datasources/OnPremDMGConfigurationManager.png

[image-data-factory-add-datastore-SQL-button]: ./media/data-factory-use-onpremises-datasources/OnPremLinkedServicesAddSQLDataStoreButton.png

[image-data-factory-gateway-configure-link]: ./media/data-factory-use-onpremises-datasources/OnPremNewDataStoreDataGatewayConfigureLink.png

[image-data-factory-credentials-blade]: ./media/data-factory-use-onpremises-datasources/OnPremCredentionlsBlade.png

[image-data-factory-oneclick-install]: ./media/data-factory-use-onpremises-datasources/OnPremOneClickInstall.png

[image-data-factory-diagram-link]: ./media/data-factory-use-onpremises-datasources/OnPremDiagramLink.png

[image-data-factory-diagram-view]: ./media/data-factory-use-onpremises-datasources/OnPremDiagramView.png

[image-data-factory-homepage-2]: ./media/data-factory-use-onpremises-datasources/OnPremDataFactoryHomePage2.png

[image-data-factory-stroage-explorer]: ./media/data-factory-use-onpremises-datasources/OnPremAzureStorageExplorer.png

[image-data-factory-home-age]: ./media/data-factory-use-onpremises-datasources/DataFactoryHomePage.png

[image-data-factory-linkedservices-blade-onprem]: ./media/data-factory-use-onpremises-datasources/LinkedServiceBladeWithOnPremSql.png

[image-data-factory-onprem-sqltable-slices]: ./media/data-factory-use-onpremises-datasources/OnPremSQLTableSlicesBlade.png

[image-data-factory-output-blobtable-slices]: ./media/data-factory-use-onpremises-datasources/OutputBlobTableSlicesBlade.png

[image-data-factory-dataslice-blade]: ./media/data-factory-use-onpremises-datasources/DataSlice.png

[image-data-factory-activity-run-details]: ./media/data-factory-use-onpremises-datasources/ActivityRunDetailsBlade.png

[image-data-factory-new-datafactory-menu]: ./media/data-factory-use-onpremises-datasources/NewDataFactoryMenu.png

[image-data-factory-preview-portal-storage-key]: ./media/data-factory-get-started/PreviewPortalStorageKey.png