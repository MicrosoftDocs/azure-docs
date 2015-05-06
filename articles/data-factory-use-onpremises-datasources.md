<properties 
	pageTitle="Enable your pipelines to work with on-premises data | Azure Data Factory" 
	description="Learn how to register an on-premises data source with an Azure data factory and copy data to/from the data source." 
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
	ms.date="05/06/2015" 
	ms.author="spelluru"/>

# Enable your pipelines to work with on-premises data

To enable your pipelines in an Azure data factory to work with an on-premises data source, you need to add the on-premises data source as a linked service to the data factory by using either Azure Management Portal or Azure PowerShell.
 
To be able to add an on-premises data source as a linked service to a data factory, you first need to download and install Microsoft Data Management Gateway on an on-premises computer and configure linked service for the on-premises data source to use the gateway .


## <a href="DMG"></a> Data Management Gateway

**Data Management Gateway** is a software that connects on-premises data sources to cloud services in a secure and managed way. With Data Management Gateway, you can

- **Connect to on-premises data for Hybrid data access** – You can connect on-premises data to cloud services to benefit from cloud services while keeping the business running with on-premises data.
- **Define a secure data proxy** – You can define which on-premises data sources are exposed with Data Management Gateway so that gateway authenticates the data request from cloud services and safeguards the on-premises data sources.
- **Manage your gateway for complete governance** – You are provided with full monitoring and logging of all the activities inside the Data Management Gateway for management and governance.
- **Move data efficiently** – Data is transferred in parallel, resilient to intermittent network issues with auto retry logic.


Data Management Gateway has a full range of on-premises data connection capabilities that include the following:

- **Non-intrusive to corporate firewall** – Data Management Gateway just works after installation, without having to open up a firewall connection or requiring intrusive changes to your corporate network infrastructure. 
- **Encrypt credentials with your certificate** – Credentials used to connect to data sources are encrypted with a certificate fully owned by a user. Without the certificate, no one can decrypt the credentials into plain text, including Microsoft.

### Considerations for using Data Management Gateway
1.	A single instance of Data Management Gateway can be used for multiple on-premises data sources, but keep in mind that a **gateway is tied to an Azure data factory** and can not be shared with another data factory.
2.	You can have **only one instance of Data Management Gateway** installed on your machine. Suppose, you have two data factories that need to access on-premises data sources, you need to install gateways on two on-premises computers where each gateway tied to a separate data factory.
3.	The **gateway does not need to be on the same machine as the data source**, but staying closer to the data source reduces the time for the gateway to connect to the data source. We recommend that you install the gateway on a machine that is different from the one that hosts on-premises data source so that the gateway does not compete for resources with data source.
4.	You can have **multiple gateways on different machines connecting to the same on-premises data source**. For example, you may have two gateways serving two data factories but the same on-premises data source is registered with both the data factories. 
5.	If you already have a gateway installed on your computer serving a **Power BI** scenario, please install a **separate gateway for Azure Data Factory** on another machine.

### Ports and security considerations 
- The Data Management Gateway installation program opens **8050** and **8051** ports on the gateway machine. These ports are used by the **Credentials Manager** (ClickOnce application), which allows you to set credentials for an on-premises linked service and to test connection to the data source. These ports cannot be reached from internet and you do not need have these opened in the corporate firewall.
- When copying data from/to an on-premises SQL Server database to/from an Azure SQL database, ensure the following:
 
	- Firewall on the gateway machine allows outgoing TCP communication on **TCP** port **1433**
	- Configure [Azure SQL firewall settings](https://msdn.microsoft.com/library/azure/jj553530.aspx) to add the **IP address of the gateway machine** to the **allowed IP addresses**.

- When copying data to/from on-premises SQL Server to any destination and the gateway and SQL Server machines are different, do the following: [configure Windows Firewall](https://msdn.microsoft.com/library/ms175043.aspx) on the SQL Server machine so that the gateway can access the database via ports that the SQL Server instance listens on. For the default instance, it is port 1433.  

- You must launch the **Credentials Manager** application on a computer that is able to connect to the Data Management Gateway to be able to set credentials for the data source and to test connection to the data source.

### Gateway installation - prerequisites 

1.	The supported **Operating System** versions are Windows 7, Windows 8/8.1, Windows Server 2008 R2, Windows Server 2012.
2.	The recommended **configuration** for the gateway machine is at least 2 GHz, 4 cores, 8 GB RAM and 80 GB disk.
3.	If the host machine hibernates, the gateway won’t be able to respond to data requests. Therefore, configure an appropriate **power plan** on the computer before installing the gateway. The gateway installation prompts a message if the machine is configured to hibernate.  


 

## Walkthrough

In this walkthrough, you create a data factory with a pipeline that moves data from an on-premises SQL Server database to an Azure blob. 

## Step 1: Create an Azure data factory
In this step, you use the Azure Management Portal to create an Azure Data Factory instance named **ADFTutorialOnPremDF**. You can also create a data factory by using Azure Data Factory cmdlets. 

1.	After logging into the [Azure Preview Portal][azure-preview-portal], click **NEW** from the bottom-left corner, select **Data analytics** in the **Create** blade, and click **Data Factory** on the **Data analytics** blade.

	![New->DataFactory][image-data-factory-new-datafactory-menu] 
  
6. In the **New data factory** blade:
	1. Enter **ADFTutorialOnPremDF** for the **name**.
	2. Click **RESOURCE GROUP NAME** and select **ADFTutorialResourceGroup** (if you had done the tutorial from [Get started with Azure Data Factory][adfgetstarted]. You can select an existing resource group or create a new one. To create a new resource group:
		1. Click **Create a new resource group**.
		2. In the **Create resource group blade**, enter a **name** for the resource group, and click **OK**.

7. Note that **Add to Startboard** is checked on the **New data factory** blade.

	![Add to Startboard][image-data-factory-add-to-startboard]

8. In the **New data factory** blade, click **Create**.

	> [AZURE.NOTE] The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “ADFTutorialOnPremDF” is not available**, change the name of the data factory (for example, yournameADFTutorialOnPremDF) and try creating again. Use this name in place of ADFTutorialOnPremDF while performing remaining steps in this tutorial.  
9. Look for notifications from the creation process in the **NOTIFICATIONS** hub on the left. Click **X** to close the **NOTIFCATIONS** blade if it is open.

	![NOTIFICATIONS hub][image-data-factory-notifications-hub]

11. After creation is complete, you will see the **Data Factory** blade as shown below:

	![Data Factory Home Page][image-data-factory-datafactory-homepage]

## Step 2: Create a data management gateway
5.	On the **Data Factory** blade for **ADFTutorialOnPremDF**, click **Linked Services**. 

	![Data Factory Home Page][image-data-factory-home-age]

2.	On the **Linked Services** blade, click **+ Data gateway**.

	![Linked Services - Add a Gateway button][image-data-factory-linkedservices-add-gateway-button]

2. In the **Create** blade, enter **adftutorialgateway** for the **name**, and click **OK**. 	

	![Create Gateway blade][image-data-factory-create-gateway-blade]

3. In the **Configure** blade, click **Install directly on this computer**. This will download the installation package for the gateway, install, configure, and register the gateway on the computer.  

	> [AzURE.NOTE] Please use Internet Explorer or a Microsoft ClickOnce compatible web browser.

	![Gateway - Configure blade][image-data-factory-gateway-configure-blade]

	This is the easiest way (one-click) to download, install, configure, and register the gateway in one single step. You can see the **Microsoft Data Management Gateway Configuration Manager** application is installed on your computer. You can also find the executable **ConfigManager.exe** in the folder: **C:\Program Files\Microsoft Data Management Gateway\1.0\Shared**.

	You can also download and install gateway manually by using the links in this blade and register it using the key shown in the **REGISTER WITH KEY** text box.
	
	See [Data Management Gateway](#DMG) section for details about the gateway including best practices and important considerations.

	>[AZURE.NOTE] You must be an administrator on the local computer to install and configure the Data Management Gateway successfully. You can add additional users to the Data Management Gateway Users local Windows group. The members of this group will be able to use the Data Management Gateway Configuration Manager tool to configure the gateway. 

4. Click the **NOTIFICATIONS** hub on the left. Wait until you see **Express setup for 'adftutorialgateway' succeeded** message in the **Notifications** blade.

	![Express setup succeeded][express-setup-succeeded]
5. Click **OK** on the **Create** blade and then on the **New data gateway** blade.
6. Close the **Linked Services** blade (by pressing **X** button in the top-right corner) and reopen the **Linked Services** blade to see the latest status of the gateway. 
7. Confirm that the **status** of the gateway is **Online**. 

	![Gateway status][gateway-status]
5. Launch **Microsoft Data Management Gateway Configuration Manager** application  on your computer.

	![Gateway Configuration Manager][image-data-factory-gateway-configuration-manager]

6. Wait until the values are set as follows :
	1. If the Service **status** is not set to **Started**, click **Start service** to start the service and wait for a minute for the other fields to refresh.
	2. **Gateway name** is set to **adftutorialgateway**.
	3. **Instance name** is set to **adftutorialgateway**.
	4. **Gateway key status** is set to **Registered**.
	5. The status bar the bottom displays **Connected to Data Management Gateway Cloud Service** along with a **green check mark**.
	
7. On the **Linked Services** blade, confirm that the **status** of the gateway is **Good**. 
8. Close all the blades until you get to the **Data Factory** home page. 

## Step 2: Create linked services 
In this step, you will create two linked services: **StorageLinkedService** and **SqlServerLinkedService**. The **SqlServerLinkedService** links an on-premises SQL Server database and the **StorageLinkedService** linked service links an Azure blob store to the **ADFTutorialDataFactory**. You will create a pipeline later in this walkthrough that copies data from the on-premises SQL Server database to the Azure blob store. 

### Add a linked service to an on-premises SQL Server database
1.	In the **DATA FACTORY** blade, clcik **Author and deploy** tile to launch the **Editor** for the data factory.

	![Author and Deploy Tile][image-author-deploy-tile] 

	> [AZURE.NOTE] See [Data Factory Editor][data-factory-editor] topic for detailed overview of the Data Factory editor.
2.	In the **Editor**, click **New data store** button on the toolbar and select **On-premises SQL server database** from the drop down menu. 

	![Editor New data store button][image-editor-newdatastore-onpremsql-button]
    
3.	You should see the JSON template for creating an on-premises SQL Server linked service in the right pane. 
	![On-prem SQL Linked Service - settings][image-editor-newdatastore-onpremsql-settings]

4.	do the following in the JSON pane: 
	1.	For the **gatewayName** property, enter **adftutorialgateway** to replace all the text inside the double quotes.  
	2.	If you are using **SQL Authentication**: 
		1.	For the **connectionString** property, replace **<servername\>**, **<databasename\>**, **<username\>**, and **<password\>** with names of your on-premises SQL server, database, user account, and  password.	
		2.	Remove last two properties (**username** and **password**) from the JSON file and remove the **comma (,)** character at the end of the last line from the remaining JSON script.
		
				{
	    			"name": "SqlServerLinkedService",
	    			"properties": {
		        		"type": "OnPremisesSqlLinkedService",
		        		"ConnectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=False;User ID=<username>;Password=<password>;",
		        		"gatewayName": "adftutorialgateway"
	    			}
				}
	3.	if you are using **Windows Authentication**:
		1. For the **connectionString** property, replace **<servername\>** and **<databasename\>** with names of your on-premises SQL server and database. Set **Integrated Security** to **True**. Remove **ID** and **Password** from the connection string.
			
				{
    				"name": "SqlServerLinkedService",
    				"properties": {
        				"type": "OnPremisesSqlLinkedService",
        				"ConnectionString": "Data Source=<servername>;Initial Catalog=<databasename>;Integrated Security=True;",
		   				"gatewayName": "adftutorialgateway",
				        "username": "<Specify user name if you are using Windows Authentication>",
				        "password": "<Specify password for the user account>"
    				}
				}		
		
6. Click **Deploy** on the toolbar to deploy the SqlServerLinkedService. Confirm that you see the message **LINKED SERVICE CREATED SUCCESSFULLY** on the title bar. You should also see the **SqlServerLinkedService** in the tree view on the left. 
		   
	![SqlServerLinkedService deployment successful][image-editor-sql-linked-service-successful]
	
  
> [AZURE.NOTE] You can also create a SQL Server linked service by clicking **New data store** toolbar button on the **Linked Services** blade. If you go this route, you set credentials for the data source by using the Credentials Manager ClickOnce application that runs on the computer accessing the portal. If you access the portal from a machine that is different from the gateway machine, you must make sure that the Credentials Manager application can connect to the gateway machine. If the application cannot reach the gateway machine, it will not allow you to set credentials for the data source and to test connection to the data source.

#### Add a linked service for an Azure storage account
 
1. In the **Editor**, click **New data store** button on the toolbar and select **Azure storage** from the drop down menu. You should see the JSON template for creating an Azure storage linked service in the right pane. 

	![Editor New data store button][image-editor-newdatastore-button]
    
6. Replace **<accountname\>** and **<accountkey\>** with the account name and account key values for your Azure storage account. 

	![Editor Blob Storage JSON][image-editor-blob-storage-json]    
	
	> [AZURE.NOTE] See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

6. Click **Deploy** on the toolbar to deploy the StorageLinkedService. Confirm that you see the message **LINKED SERVICE CREATED SUCCESSFULLY** on the title bar.

	![Editor Blob Storage Deploy][image-editor-blob-storage-deploy]

 
## Step 3: Create input and output datasets
In this step, you will create input and output datasets that represent input and output data for the copy operation (On-premises SQL Server database => Azure blob storage). Before creating datasets or tables (rectangular datasets), you need to do the following (detailed steps follows the list):

- Create a table named **emp** in the SQL Server Database you added as a linked service to the data factory and insert couple of sample entries into the table.
- - If you haven’t gone through the tutorial from [Get started with Azure Data Factory][adfgetstarted] article, create a blob container named **adftutorial** in the Azure blob storage account you added as a linked service to the data factory.

### Prepare On-premises SQL Server for the tutorial

1. In the database you specified for the on-premises SQL Server linked service (**SqlServerLinkedService**), use the following SQL script to create the **emp** table in the database.


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

1.	In the **Data Factory Editor**, click **New dataset** on the command bar, and click **On-premises SQL**. 
2.	Replace the JSON in the right pane with the following text:    

        {
    		"name": "EmpOnPremSQLTable",
    		"properties":
    		{
        		"location":
        		{
            		"type": "OnPremisesSqlServerTableLocation",
            		"tableName": "emp",
            		"linkedServiceName": "SqlServerLinkedService"
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
	- **linkedServiceName** is set to **SqlServerLinkedService** (you had created this linked service in Step 2).
	- For an input table that is not generated by another pipeline in Azure Data Factory, you must specify **waitOnExternal** section in the JSON. It denotes the input data is produced external to the Azure Data Factory service.   

	See [JSON Scripting Reference][json-script-reference] for details about JSON properties.

2. Click **Deploy** on the command bar to deploy the dataset (table is a rectangular dataset). Confirm that you see a message on the title bar that says **TABLE DEPLOYED SUCCESSFULLY**. 


### Create output table

1.	In the **Data Factory Editor**, click **New dataset** on the command bar, and click **Azure Blob storage**.
2.	Replace the JSON in the right pane with the following text: 

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
            		"linkedServiceName": "StorageLinkedService"
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
	- **linkedServiceName** is set to **StorageLinkedService** (you had created this linked service in Step 2).
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

2.	Click **Deploy** on the command bar to deploy the dataset (table is a rectangular dataset). Confirm that you see a message on the title bar that says **TABLE DEPLOYED SUCCESSFULLY**.
  

## Step 4: Create and run a pipeline
In this step, you create a **pipeline** with one **Copy Activity** that uses **EmpOnPremSQLTable** as input and **OutputBlobTable** as output.

1.	Click **New pipeline** on the command bar. If you do not see the button, click **... (ellipsis)** to expand the command bar.
2.	Replace the JSON in the right pane with the following text:   


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
	        	],
				"start": "2015-02-13T00:00:00Z",
        		"end": "2015-02-14T00:00:00Z",
        		"isPaused": false
			}
		}

	Note the following:
 
	- In the activities section, there is only activity whose **type** is set to **CopyActivity**.
	- **Input** for the activity is set to **EmpOnPremSQLTable** and **output** for the activity is set to **OutputBlobTable**.
	- In the **transformation** section, **SqlSource** is specified as the **source type** and **BlobSink **is specified as the **sink type**.
	- SQL query **select * from emp** is specified for the **sqlReaderQuery** property of **SqlSource**.

	> [AZURE.NOTE] Replace the value of the **start** property with the current day and **end** value with the next day. Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional, but we will use it in this tutorial. 
	> If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the value for the **end** property. 
	> You are defining the time duration in which the data slices will be processed based on the **Availability** properties that were defined for each Azure Data Factory table.
	> In the example above, there will be 24 data slices as each data slice is produced hourly.
	
2. Click **Deploy** on the command bar to deploy the dataset (table is a rectangular dataset). Confirm that you see a message on the title bar that says **PIPELINE DEPLOYED SUCCESSFULLY**.  
5. Now, close the **Editor** blade by clicking **X**. Click **X** again to close the ADFTutorialDataFactory blade with the toolbar and tree view. If you see **your unsaved edits will be discarded** message, click **OK**.
6. You should be back to the **DATA FACTORY** blade for the **ADFTutorialOnPremDF**.

**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a pipeline and scheduled the pipeline.

### View the data factory in a Diagram View 
1. In the **Azure Preview Portal**, click **Diagram** tile on the home page for the **ADFTutorialOnPremDF** data factory. :

	![Diagram Link][image-data-factory-diagram-link]

2. You should see the diagram similar to the following:

	![Diagram View][image-data-factory-diagram-view]

	You can zoom in, zoom out, zoom to 100%, zoom to fit, automatically position pipelines and tables, and show lineage information (highlights upstream and downstream items of selected items).  You can double-blick on an object (input/output table or pipeline) to see properties for it. 

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


	Both **Recently updated slices** and **Recently failed slices** lists are sorted by the **LAST UPDATE TIME**. The update time of a slice is changed in the following situations. 
    

	-  You update the status of the slice manually, for example, by using the **Set-AzureDataFactorySliceStatus** (or) by clicking **RUN** on the **SLICE** blade for the slice.
	-  The slice changes status due to an execution (e.g. a run started, a run ended and failed, a run ended and succeeded, etc).
 
	Click on the title of the lists or **... (ellipses)** to see the larger list of slices. Click **Filter** on the toolbar to filter the slices.  
	
	To view the data slices sorted by the slice start/end times instead, click **Data slices (by slice time)** tile.

7. Now, In the **Datasets** blade, click **OutputBlobTable**.

	![OputputBlobTable slices][image-data-factory-output-blobtable-slices]
8. Confirm that slices up to the current time are produced and **Ready**. Wait until the statuses of slices up to the current time are set to **Ready**.
9. Click on any data slice from the list and you should see the **DATA SLICE** blade.

	![Data Slice Blade][image-data-factory-dataslice-blade]

	If the slice is not in the **Ready** state, you can see the upstream slices that are not Ready and are blocking the current slice from executing in the **Upstream slices that are not ready** list.

10. Click on the **activity run** from the list at the bottom to see **activity run details**.

	![Activity Run Details blade][image-data-factory-activity-run-details]

11. Click **X** to close all the blades until you get back to the home blade for the **ADFTutorialOnPremDF**.
14. (optional) Click **Pipelines**, click **ADFTutorialOnPremDF**, and drill through input tables (**Consumed**) or output tables (**Produced**).
15. Use tools such as **Azure Storage Explorer** to verify the output.

	![Azure Storage Explorer][image-data-factory-stroage-explorer]


## Creating and registering a gateway using Azure PowerShell 
This section describes how to create and register a gateway using Azure PowerShell cmdlets. 

1. Launch **Azure PowerShell** in administrator mode. 
2. The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode. Execute the following command to switch to the **AzureResourceManager** mode.     

        switch-azuremode AzureResourceManager


2. Use the **New-AzureDataFactoryGateway** cmdlet to create a logical gateway as follows:

		New-AzureDataFactoryGateway -Name <gatewayName> -DataFactoryName <dataFactoryName> -ResourceGroupName ADF –Description <desc>

	**Example command and output**:


		PS C:\> New-AzureDataFactoryGateway -Name MyGateway -DataFactoryName $df -ResourceGroupName ADF –Description “gateway for walkthrough”

		Name              : MyGateway
		Description       : gateway for walkthrough
		Version           :
		Status            : NeedRegistration
		VersionStatus     : None
		CreateTime        : 9/28/2014 10:58:22
		RegisterTime      :
		LastConnectTime   :
		ExpiryTime        :
		ProvisioningState : Succeeded


3. Use the **New-AzureDataFactoryGatewayKey** cmdlet to generate a registration key for the newly created gateway, and store the key in a local variable **$Key**:

		New-AzureDataFactoryGatewayKey -GatewayName <gatewayname> -ResourceGroupName ADF -DataFactoryName <dataFactoryName>

	
	**Example command output:**


		PS C:\> $Key = New-AzureDataFactoryGatewayKey -GatewayName MyGateway -ResourceGroupName ADF -DataFactoryName $df 

	
4. In Azure PowerShell, switch to the folder: **C:\Program Files\Microsoft Data Management Gateway\1.0\PowerShellScript\** and Run **RegisterGateway.ps1** script associated with the local variable **$Key** as shown in the following command to register the client agent installed on your machine with the logical gateway you create earlier.

		PS C:\> .\RegisterGateway.ps1 $Key.GatewayKey
		
		Agent registration is successful!

5. You can use the **Get-AzureDataFactoryGateway** cmdlet to get the list of Gateways in your data factory. When the **Status** shows **online**, it means your gateway is ready to use.

		Get-AzureDataFactoryGateway -DataFactoryName <dataFactoryName> -ResourceGroupName ADF

You can remove a gateway using the **Remove-AzureDataFactoryGateway** cmdlet and update description for a gateway using the **Set-AzureDataFactoryGateway** cmdlets. For syntax and other details about these cmdlets, see Data Factory Cmdlet Reference.  



[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[adf-getstarted]: data-factory-get-started.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[use-pig-and-hive-with-data-factory]: data-factory-pig-hive-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md
[data-factory-editor]: data-factory-editor.md

[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456


[64bit-download-link]: http://go.microsoft.com/fwlink/?LinkId=517623
[32bit-download-link]: http://go.microsoft.com/fwlink/?LinkId=517624

[azure-preview-portal]: http://portal.azure.com
[adfgetstarted]: data-factory-get-started.md
[monitor-manage-powershell]: data-factory-monitor-manage-using-powershell.md





[json-script-reference]: http://go.microsoft.com/fwlink/?LinkId=516971
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456



[azure-powershell-install]: http://azure.microsoft.com/documentation/articles/install-configure-powershell/

[image-author-deploy-tile]: ./media/data-factory-use-onpremises-datasources/author-deploy-tile.png
[image-editor-newdatastore-button]: ./media/data-factory-use-onpremises-datasources/editor-newdatastore-button.png
[image-editor-blob-storage-json]: ./media/data-factory-use-onpremises-datasources/editor-blob-storage-settings.png
[image-editor-blob-storage-deploy]: ./media/data-factory-use-onpremises-datasources/editor-deploy-blob-linked-service.png
[image-editor-newdatastore-onpremsql-button]: ./media/data-factory-use-onpremises-datasources/editor-newdatastore-onpremsql-button.png
[image-editor-newdatastore-onpremsql-settings]: ./media/data-factory-use-onpremises-datasources/editor-onprem-sql-settings.png
[image-editor-sql-linked-service-successful]: ./media/data-factory-use-onpremises-datasources/editor-sql-linked-service-successful.png

[gateway-status]: ./media/data-factory-use-onpremises-datasources/gateway-status.png
[express-setup-succeeded]:./media/data-factory-use-onpremises-datasources/express-setup-succeeded.png
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

[image-data-factory-get-storage-key]: ./media/data-factory-use-onpremises-datasources/OnPremGetStorageKey.png

[image-data-factory-linkedservices-add-gateway-button]: ./media/data-factory-use-onpremises-datasources/OnPremLinkedServicesAddGaewayButton.png

[image-data-factory-create-gateway-blade]: ./media/data-factory-use-onpremises-datasources/OnPremCreateGatewayBlade.png

[image-data-factory-gateway-configure-blade]: ./media/data-factory-use-onpremises-datasources/OnPremGatewayConfigureBlade.png

[image-data-factory-gateway-configuration-manager]: ./media/data-factory-use-onpremises-datasources/OnPremDMGConfigurationManager.png

[image-data-factory-oneclick-install]: ./media/data-factory-use-onpremises-datasources/OnPremOneClickInstall.png

[image-data-factory-diagram-link]: ./media/data-factory-use-onpremises-datasources/OnPremDiagramLink.png

[image-data-factory-diagram-view]: ./media/data-factory-use-onpremises-datasources/OnPremDiagramView.png

[image-data-factory-homepage-2]: ./media/data-factory-use-onpremises-datasources/OnPremDataFactoryHomePage2.png

[image-data-factory-stroage-explorer]: ./media/data-factory-use-onpremises-datasources/OnPremAzureStorageExplorer.png

[image-data-factory-home-age]: ./media/data-factory-use-onpremises-datasources/DataFactoryHomePage.png

[image-data-factory-onprem-sqltable-slices]: ./media/data-factory-use-onpremises-datasources/OnPremSQLTableSlicesBlade.png

[image-data-factory-output-blobtable-slices]: ./media/data-factory-use-onpremises-datasources/OutputBlobTableSlicesBlade.png

[image-data-factory-dataslice-blade]: ./media/data-factory-use-onpremises-datasources/DataSlice.png

[image-data-factory-activity-run-details]: ./media/data-factory-use-onpremises-datasources/ActivityRunDetailsBlade.png

[image-data-factory-new-datafactory-menu]: ./media/data-factory-use-onpremises-datasources/NewDataFactoryMenu.png

[image-data-factory-preview-portal-storage-key]: ./media/data-factory-get-started/PreviewPortalStorageKey.png