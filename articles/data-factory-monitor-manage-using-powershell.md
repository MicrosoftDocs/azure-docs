<properties 
	pageTitle="Tutorial: create and monitor an Azure data factory using Azure PowerShell" 
	description="Learn how to use Azure PowerShell to create and monitor Azure data factories." 
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

# Tutorial: Create and monitor a data factory using Azure PowerShell
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-get-started.md)
- [Using Data Factory Editor](data-factory-get-started-using-editor.md)
- [Using PowerShell](data-factory-monitor-manage-using-powershell.md)

The [Get started with Azure Data Factory][adf-get-started] tutorial shows you how to create and monitor an Azure data factory using the [Azure Preview Portal][azure-preview-portal]. 
In this tutorial, you will create and monitor an Azure data factory by using Azure PowerShell cmdlets. The pipeline in the data factory you create in this tutorial copies data from an Azure blob to an Azure SQL database.       

> [AZURE.NOTE] This article does not cover all the Data Factory cmdlets. See [Data Factory Cmdlet Reference][cmdlet-reference] for comprehensive documentation on Data Factory cmdlets. 

##Prerequisites
Apart from prerequisites listed in the Tutorial Overview topic, you need to have Azure PowerShell installed on your computer. If you do not have it already, download and install [Azure PowerShell][download-azure-powershell] on your computer.

##In This Tutorial
The following table lists the steps you will perform as part of the tutorial and their descriptions. 

Step | Description
-----| -----------
[Step 1: Create an Azure Data Factory](#CreateDataFactory) | In this step, you will create an Azure data factory named **ADFTutorialDataFactoryPSH**. 
[Step 2: Create linked services](#CreateLinkedServices) | In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. The StorageLinkedService links an Azure storage and AzureSqlLinkedService links an Azure SQL database to the ADFTutorialDataFactoryPSH.
[Step 3: Create input and output datasets](#CreateInputAndOutputDataSets) | In this step, you will define two data sets (**EmpTableFromBlob** and **EmpSQLTable**) that are used as input and output tables for the **Copy Activity** in the ADFTutorialPipeline that you will create in the next step.
[Step 4: Create and run a pipeline](#CreateAndRunAPipeline) | In this step, you will create a pipeline named **ADFTutorialPipeline** in the data factory: **ADFTutorialDataFactoryPSH**. . The pipeline will have a **Copy Activity** that copies data from an Azure blob to an output Azure database table.
[Step 5: Monitor data sets and pipeline](#MonitorDataSetsAndPipeline) | In this step, you will monitor the datasets and the pipeline using Azure PowerShell in this step.

## <a name="CreateDataFactory"></a>Step 1: Create an Azure Data Factory
In this step, you use the Azure PowerShell to create an Azure data factory named **ADFTutorialDataFactoryPSH**.

1. Launch **Azure PowerShell** and execute the following commands. Keep the Azure PowerShell open until the end of this tutorial. If you close and reopen, you need to run these commands again.
	- Run **Add-AzureAccount** and enter the  user name and password that you use to sign-in to the Azure Preview Portal.  
	- Run **Get-AzureSubscription** to view all the subscriptions for this account.
	- Run **Select-AzureSubscription** to select the subscription that you want to work with. This subscription should be the same as the one you used in the Azure Preview Portal. 
2. Switch to **AzureResourceManager** mode as the Azure Data Factory cmdlets are available in this mode.

		Switch-AzureMode AzureResourceManager 
3. Create an Azure resource group named: **ADFTutorialResourceGroup** by running the following command.
   
		New-AzureResourceGroup -Name ADFTutorialResourceGroup  -Location "West US"

	Some of the steps in this tutorial assume that you use the resource group named **ADFTutorialResourceGroup**. If you use a different resource group, you will need to use it in place of ADFTutorialResourceGroup in this tutorial. 
4. Run the **New-AzureDataFactory** cmdlet to create a data factory named: **ADFTutorialDataFactoryPSH**.  

		New-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH –Location "West US"


	> [AZURE.NOTE] The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “ADFTutorialDataFactoryPSH” is not available**, change the name (for example, yournameADFTutorialDataFactoryPSH). Use this name in place of ADFTutorialFactoryPSH while performing steps in this tutorial.

## <a name="CreateLinkedServices"></a>Step 2: Create linked services
Linked services link data stores or compute services to an Azure data factory. A data store can be an Azure Storage, Azure SQL Database or an on-premises SQL Server database that contains input data or stores output data for a Data Factory pipeline. A compute service is the service that processes  input data and produces output data. 

In this step, you will create two linked services: **StorageLinkedService** and **AzureSqlLinkedService**. StorageLinkedService linked service links an Azure Storage Account and AzureSqlLinkedService links an Azure SQL database to the data factory: **ADFTutorialDataFactoryPSH**. You will create a pipeline later in this tutorial that copies data from a blob container in StorageLinkedService to a SQL table in AzureSqlLinkedService.

### Create a linked service for an Azure storage account
1.	Create a JSON file named **StorageLinkedService.json** in the **C:\ADFGetStartedPSH** with the following content. Create the folder ADFGetStartedPSH if it does not already exist.

		{
		    "name": "StorageLinkedService",
		    "properties":
		    {
		        "type": "AzureStorageLinkedService",
		        "connectionString": "DefaultEndpointsProtocol=https;AccountName=<accountname>;AccountKey=<accountkey>"
		    }
		}
2.	In the **Azure PowerShell**, switch to the **ADFGetStartedPSH** folder. 
3.	You can use the **New-AzureDataFactoryLinkedService** cmdlet to create a linked service. This cmdlet and other Data Factory cmdlets you use in this tutorial require you to pass values for the **ResourceGroupName** and **DataFactoryName** parameters. Alternatively, you can use **Get-AzureDataFactory** to get a DataFactory object and pass the object without typing ResourceGroupName and DataFactoryName each time you run a cmdlet. Run the following command to assign the output of the **Get-AzureDataFactory** cmdlet to a variable: **$df**. 

		$df=Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoyPSH

4.	Now, run the **New-AzureDataFactoryLinkedService** cmdlet to create the linked service: **StorageLinkedService**. 

		New-AzureDataFactoryLinkedService $df -File .\StorageLinkedService.json

	If you hadn't run the **Get-AzureDataFactory** cmdlet and assigned the output to **$df** variable, you would have to specify values for the ResourceGroupName and DataFactoryName parameters as follows.   
		
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactoryPSH -File .\StorageLinkedService.json

	If you close the Azure PowerShell in the middle of the tutorial, you will have run the Get-AzureDataFactory cmdlet next time you launch Azure PowerShell to complete the tutorial.

### Create a linked service for an Azure SQL Database
1.	Create a JSON file named AzureSqlLinkedService.json with the following content.

		{
		    "name": "AzureSqlLinkedService",
		    "properties":
		    {
		        "type": "AzureSqlLinkedService",
		        "connectionString": "Server=tcp:<server>.database.windows.net,1433;Database=<databasename>;User ID=user@server;Password=<password>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30"
		    }
		}
2.	Run the following command to create a linked service. 
	
		New-AzureDataFactoryLinkedService $df -File .\AzureSqlLinkedService.json

	> [AZURE.NOTE] Confirm that the **Allow access to Azure services** setting is turned ON for your Azure SQL server. To verify and turn it on, do the following:
	>
	> <ol>
	> <li>Click <b>BROWSE</b> hub on the left and click <b>SQL servers</b>.</li>
	> <li>Select your server, and click <b>SETTINGS</b> on the <b>SQL SERVER</b> blade.</li>
	> <li>In the <b>SETTINGS</b> blade, click <b>Firewall</b>.</li>
	> <li>In the <b>Firewalll settings</b> blade, click <b>ON</b> for <b>Allow access to Azure services</b>.</li>
	> <li>Click <b>ACTIVE</b> hub on the left to switch to the <b>Data Factory</b> blade you were on.</li>
	> </ol>

## <a name="CreateInputAndOutputDataSets"></a>Step 3: Create input and output tables

In the previous step, you created linked services **StorageLinkedService** and **AzureSqlLinkedService** to link an Azure Storage account and Azure SQL database to the data factory: **ADFTutorialDataFactoryPSH**. In this step, you will create tables that represent the input and output data for the Copy Activity in the pipeline you will be creating in the next step. 

A table is a rectangular dataset and it is the only type of dataset that is supported at this time. The input table in this tutorial refers to a blob container in the Azure Storage that StorageLinkedService points to and the output table refers to a SQL table in the Azure SQL database that AzureSqlLinkedService points to.  

### Prepare Azure Blob Storage and Azure SQL Database for the tutorial
Skip this step if you have gone through the tutorial from [Get started with Azure Data Factory][adf-get-started] article. 

You need to perform the following steps to prepare the Azure blob storage and Azure SQL database for this tutorial. 
 
* Create a blob container named **adftutorial** in the Azure blob storage that **StorageLinkedService** points to. 
* Create and upload a text file, **emp.txt**, as a blob to the **adftutorial** container. 
* Create a table named **emp** in the Azure SQL Database in the Azure SQL database that **AzureSqlLinkedService** points to.


1. Launch Notepad, paste the following text, and save it as **emp.txt** to **C:\ADFGetStartedPSH** folder on your hard drive. 

        John, Doe
		Jane, Doe
				
2. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container and to upload the **emp.txt** file to the container.

    ![Azure Storage Explorer][image-data-factory-get-started-storage-explorer]
3. Use the following SQL script to create the **emp** table in your Azure SQL Database.  


        CREATE TABLE dbo.emp 
		(
			ID int IDENTITY(1,1) NOT NULL,
			FirstName varchar(50),
			LastName varchar(50),
		)
		GO

		CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID); 

	If you have SQL Server 2014 installed on your computer: follow instructions from [Step 2: Connect to SQL Database of the Managing Azure SQL Database using SQL Server Management Studio][sql-management-studio] article to connect to your Azure SQL server and run the SQL script.

	If you have Visual Studio 2013 installed on your computer: in the Azure Preview Portal ([http://portal.azure.com](http://portal.sazure.com)), click **BROWSE** hub on the left, click **SQL servers**, select your database, and click **Open in Visual Studio** button on toolbar to connect to your Azure SQL server and run the script. If your client is not allowed to access the Azure SQL server, you will need to configure firewall for your Azure SQL server to allow access from your machine (IP Address). See the article above for steps to configure the firewall for your Azure SQL server.
		
### Create input table 
A table is a rectangular dataset and has a schema. In this step, you will create a table named **EmpBlobTable** that points to a blob container in the Azure Storage represented by the **StorageLinkedService** linked service. This blob container (**adftutorial**) contains the input data in the file: **emp.txt**. 

1.	Create a JSON file named **EmpBlobTable.json** in the **C:\ADFGetStartedPSH** folder with the following content:

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
	                "waitonexternal": {}
	                }
	        }
		}
	
	Note the following: 
	
	- location **type** is set to **AzureBlobLocation**.
	- **linkedServiceName** is set to **StorageLinkedService**. 
	- **folderPath** is set to the **adftutorial** container. You can also specify the name of a blob within the folder. Since you are not specifying the name of the blob, data from all blobs in the container is considered as an input data.  
	- format **type** is set to **TextFormat**
	- There are two fields in the text file – **FirstName** and **LastName** – separated by a comma character (**columnDelimiter**)	
	- The **availability** is set to **hourly** (**frequency** is set to **hour** and **interval** is set to **1** ), so the Data Factory service will look for input data every hour in the root folder in the blob container (**adftutorial**) you specified.

	if you don't specify a **fileName** for an **input** **table**, all files/blobs from the input folder (**folderPath**) are considered as inputs. If you specify a fileName in the JSON, only the specified file/blob is considered asn input. See the sample files in the [tutorial][adf-tutorial] for examples.
 
	If you do not specify a **fileName** for an **output table**, the generated files in the **folderPath** are named in the following format: Data.<Guid\>.txt (example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt.).

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

2.	Run the following command to create the Data Factory table.

		New-AzureDataFactoryTable $df -File .\EmpBlobTable.json

### Create output table
In this part of the step, you will create an output table named **EmpSQLTable** that points to a SQL table (**emp**) in the Azure SQL database that is represented by the **AzureSqlLinkedService** linked service. The pipeline copies data from the input blob to the **emp** table. 

1.	Create a JSON file named **EmpSQLTable.json** in the **C:\ADFGetStartedPSH** folder with the following content.
		
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
		            "type": "AzureSQLTableLocation",
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
	* **linkedServiceName** is set to **AzureSqlLinkedService**.
	* **tablename** is set to **emp**.
	* There are three columns – **ID**, **FirstName**, and **LastName** – in the emp table in the database, but ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
	* The **availability** is set to **hourly** (**frequency** set to **hour** and **interval** set to **1**).  The Data Factory service will generate an output data slice every hour in the **emp** table in the Azure SQL database.

2.	Run the following command to create the Data Factory table. 
	
		New-AzureDataFactoryTable $df -File .\EmpSQLTable.json


## <a name="CreateAndRunAPipeline"></a>Step 4: Create and run a pipeline
In this step, you create a pipeline with a **Copy Activity** that uses **EmpTableFromBlob** as input and **EmpSQLTable** as output.

1.	Create a JSON file named **ADFTutorialPipeline.json** in the **C:\ADFGetStartedPSH** folder with the following content: 

		{
		    "name": "ADFTutorialPipeline",
		    "properties":
		    {   
		        "description" : "Copy data from an Azure blob to an Azure SQL table",
		        "activities":   
		        [
		            {
		                "name": "CopyFromBlobToSQL",
		                "description": "Copy data from the adftutorial blob container to emp SQL table",
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
		        "start": "2015-03-03T00:00:00Z",
		        "end": "2015-03-04T00:00:00Z"
		    }
		}  

	Note the following:

	- In the activities section, there is only one activity whose **type** is set to **CopyActivity**.
	- Input for the activity is set to **EmpTableFromBlob** and output for the activity is set to **EmpSQLTable**.
	- In the **transformation** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

	> [AZURE.NOTE] Replace the value of the **start** property with the current day and **end** value with the next day. Both start and end datetimes must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **end** time is optional, but we will use it in this tutorial. 
	> If you do not specify value for the **end** property, it is calculated as "**start + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the value for the **end** property.
	> In the example above, there will be 24 data slices as each data slice is produced hourly.
	
	> See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.
2.	Run the following command to create the Data Factory table. 
		
		New-AzureDataFactoryPipeline $df -File .\ADFTutorialPipeline.json

**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a pipeline and scheduled the pipeline.

## <a name="MonitorDataSetsAndPipeline"></a>Step 5: Monitor the datasets and pipeline
In this step, you will use the Azure PowerShell to monitor what’s going on in an Azure data factory.

1.	Run **Get-AzureDataFactory** and assign the output to a variable $df.

		$df=Get-AzureDataFactory -ResourceGroupName ADFTutorialResourceGroup -Name ADFTutorialDataFactoryPSH
 
2.	Run **Get-AzureDataFactorySlice** to get details about all slices of the **EmpSQLTable**, which is the output table of the pipeline.  

		Get-AzureDataFactorySlice $df -TableName EmpSQLTable -StartDateTime 2015-03-03T00:00:00

	> [AZURE.NOTE] Replace year, month, and date part of the **StartDateTime** parameter with the current year, month, and date. This should match the **Start** value in the pipeline JSON. 

	You should see 24 slices, one for each hour from 12 AM of the current day to 12 AM of the next day. 
	
	**First slice:**

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : ADFTutorialDataFactoryPSH
		TableName         : EmpSQLTable
		Start             : 3/3/2015 12:00:00 AM
		End               : 3/3/2015 1:00:00 AM
		RetryCount        : 0
		Status            : PendingExecution
		LatencyStatus     :
		LongRetryCount    : 0

	**Last slice:**

		ResourceGroupName : ADFTutorialResourceGroup
		DataFactoryName   : ADFTutorialDataFactoryPSH
		TableName         : EmpSQLTable
		Start             : 3/4/2015 11:00:00 PM
		End               : 3/4/2015 12:00:00 AM
		RetryCount        : 0
		Status            : PendingExecution
		LatencyStatus     : 
		LongRetryCount    : 0

3.	Run **Get-AzureDataFactoryRun** to get the details of activity runs for a **specific** slice. Change the value of the **StartDateTime** parameter to match the **Start** time of the slice from the output above. The value of the **StartDateTime** must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-03-03T22:00:00Z.

		Get-AzureDataFactoryRun $df -TableName EmpSQLTable -StartDateTime 2015-03-03T22:00:00

	You should see output similar to the following:

		Id                  : 3404c187-c889-4f88-933b-2a2f5cd84e90_635614488000000000_635614524000000000_EmpSQLTable
		ResourceGroupName   : ADFTutorialResourceGroup
		DataFactoryName     : ADFTutorialDataFactoryPSH
		TableName           : EmpSQLTable
		ProcessingStartTime : 3/3/2015 11:03:28 PM
		ProcessingEndTime   : 3/3/2015 11:04:36 PM
		PercentComplete     : 100
		DataSliceStart      : 3/8/2015 10:00:00 PM
		DataSliceEnd        : 3/8/2015 11:00:00 PM
		Status              : Succeeded
		Timestamp           : 3/8/2015 11:03:28 PM
		RetryAttempt        : 0
		Properties          : {}
		ErrorMessage        :
		ActivityName        : CopyFromBlobToSQL
		PipelineName        : ADFTutorialPipeline
		Type                : Copy

> [AZURE.NOTE] See [Data Factory Cmdlet Reference][cmdlet-reference] for comprehensive documentation on Data Factory cmdlets. 

## Next steps

Article | Description
------ | ---------------
[Copy data with Azure Data Factory - Copy Activity][copy-activity] | This article provides detailed description of the **Copy Activity** you used in this tutorial. 
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an **on-premises SQL Server database** to an Azure blob. 
[Use Pig and Hive with Data Factory][use-pig-and-hive-with-data-factory] | This article has a walkthrough that shows how to use **HDInsight Activity** to run a **hive/pig** script to process input data to produce output data.
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an **end-to-end walkthrough** that shows how to implement a **real world scenario** using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a **custom activity** and using it in a pipeline. 
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to **troubleshoot** Azure Data Factory issues. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database). 
[Azure Data Factory Cmdlet Reference][cmdlet-reference] | This reference content has details about all the **Data Factory cmdlets**.
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 

[copy-activity]: data-factory-copy-activity.md
[use-onpremises-datasources]: data-factory-use-onpremises-datasources.md
[use-pig-and-hive-with-data-factory]: data-factory-pig-hive-activities.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908

[cmdlet-reference]: https://msdn.microsoft.com/library/dn820234.aspx
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[data-factory-create-storage]: storage-create-storage-account.md

[adf-get-started]: data-factory-get-started.md
[azure-preview-portal]: http://portal.azure.com
[download-azure-powershell]: powershell-install-configure.md
[data-factory-create-sql-database]: sql-database-create-configure.md
[data-factory-introduction]: data-factory-introduction.md

[image-data-factory-get-started-storage-explorer]: ./media/data-factory-monitor-manage-using-powershell/getstarted-storage-explorer.png

[sql-management-studio]: sql-database-manage-azure-ssms.md#Step2