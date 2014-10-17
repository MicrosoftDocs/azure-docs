<properties title="Get started using Azure Data Factory" pageTitle="Get started using Azure Data Factory" description="This tutorial shows you how to create a sample data pipeline that copies data from a blob to an Azure SQL Database instance." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Get started with Azure Data Factory
This article helps you get started with using Azure Data Factory. The tutorial in this article shows you how to create an Azure Data Factory instance and create a pipeline to copy sample data from an Azure blob storage to Azure SQL Database.

Azure Data Factory (ADF) developers author JSON files to describe data stores and computes (linked services), tables (rectangular datasets), and pipelines. The following list provides typical steps that developers need to perform: 

1.	Create an **Azure data factory**.
2.	Link one or more data stores and computes (referred as **Linked Services**) to the data factory.
3.	Create **tables** that describe input data and output data for pipelines.
4.	Create **pipelines**. A pipeline consists of one or more activities and processes the inputs and produces outputs. 
5.	Specify the **active period** for pipelines (for data processing). The active period defines the time duration in which data slices will be produced.

##Prerequisites
Before you begin this tutorial, you must have the following:

- An Azure subscription. For more information about obtaining a subscription, see [Purchase Options] [azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- Azure PowerShell installed.
- Azure Storage Account. You will use the blob storage for the purpose of this tutorial.
- Azure SQL Database. You need to create a sample database for the purpose of this tutorial.
- Review “Introduction to Azure Data Factory” and “Azure Data Factory Concepts” topics.

##In This Tutorial

1. [Step 1: Create an Azure Data Factory](#CreateDataFactory). In this step, you will create a Azure data factory named **ADFTutorialDataFactory**.
2. [Step 2: Create linked services](#CreateLinkedServices). In this step, you will create two linked services: **myblobstore** and **myazuresqlstore**. The myblobstore linked service refers to the input blob that contains sample data to be copied to the Azure SQL Database instance that the myazuresqltable linked service point to.
3. [Step 3: Create input and output datasets](#CreateInputAndOutputDataSets). In this step, you will define input and output data sets (**EmpTableFromBlob** and **EmpSQLTable**) for the Copy Activity in the ADFTutorialPipeline that you will create in the next step.
4. [Step 4: Create and run a pipeline](#CreateAndRunAPipeline). In this step, you will create the 

Step | Description
[Step 1: Create an Azure Data Factory](#CreateDataFactory) | In this step, you will create a Azure data factory named **ADFTutorialDataFactory**.
[Step 2: Create linked services](#CreateLinkedServices) | In this step, you will create two linked services: **myblobstore** and **myazuresqlstore**. The myblobstore linked service refers to the input blob that contains sample data to be copied to the Azure SQL Database instance that the myazuresqltable linked service point to.
[Step 3: Create input and output datasets](#CreateInputAndOutputDataSets) | In this step, you will define input and output data sets (**EmpTableFromBlob** and **EmpSQLTable**) for the Copy Activity in the ADFTutorialPipeline that you will create in the next step.
[Step 4: Create and run a pipeline](#CreateAndRunAPipeline) | In this step, you will create the **ADFTutorialPipeline**. The pipeline will have a Copy Activity with input and output datasets defined in the previous step.
[Step 5: Monitor datasets and pipeline](#MonitorDataSetsAndPipeline) | In this step, you will monitor the datasets and the pipeline using Azure Management Studio in this step.

## <a name="CreateDataFactory"></a>Step 1: Create an Azure Data Factory
In this step, you use the Azure Management Portal to create an Azure Data Factory instance named **ADFTutorialDataFactory**.

1. After logging into the [Azure Preview Portal][azure-preview-portal], click **NEW** from the bottom-left corner, and click **Everything** at the top. 

     ![image-data-factory-getstarted-new-everything]

2. Click **Data, storage, cache, + backup** in **Gallery**.
    
     ![image-data-factory-gallery-storagecachebackup]

3. In the **Data, storage, cache, + backup** blade, click **See All** as shown in the following image  

    ![image-data-factory-gallery-storagecachebackup-seeall]
4. In the **Data Services** blade, click **Data Factory (preview)**.

    ![image-data-factory-getstarted-data-services-data-factory-selected]

5. In the **Data Factory (preview)** blade, click **Create**.

    ![image-data-factory-getstarted-data-factory-create-button]

6. In the **New data factory** blade:
	1. Enter **ADFTutorialDataFactory** for the **name**.
	
	      ![image-data-factory-getstarted-new-data-factory-blade]
	2. Click **RESOURCE GROUP NAME** if you want to change from the default resource group. Chose an existing resource group from the list of available resource groups or create a new resource group. To create a new resource group:
		1. Click **Create a new resource group**.
		2. In the **Create resource group** blade, enter a **name** for the resource group, and click **OK**. 
7. In the **New data factory** blade, notice that **Add to Startboard** is selected.
8. Click **Create** in the **New data factory** blade.
9. Click **NOTIFICATIONS** hub on the left and look for notifications from the creation process.
10. After creation is complete, you will see the Data Factory blade as shown below
    ![image-data-factory-get-stated-factory-home-page]

11. You can also open it from the **Startboard** as shown below by clicking on **ADFTutorialFactory** tile.
    ![image-data-factory-get-started-startboard]    

## <a name="CreateLinkedServices"></a>Step 2: Create linked services
In this step, you will create two linked services: **myblobstore** and **myazuresqlstore**. The myblobstore linked service refers to the input blob that contains sample data to be copied to the Azure SQL Database instance that the **myazuresqltable** linked service point to. 
### Create a linked service for an Azure storage account
1.	In the **DATA FACTORY** blade, click **Linked Services** tile to launch the **Linked Services** blade.

    ![image-data-factory-get-started-linked-services-link]

2. In the **Linked Services** blade, click **Add data store**.

    ![image-data-factory-get-started-linked-services-add-store-button]

3. In the **New data store** blade:  
	1. Enter a **name** for the data store. For the purpose of the tutorial, enter **MyBlobStore** for the **name**.
	2. Enter **description** (optional) for the data store.
	3. Click **Type**.
	4. Select **Azure storage account**, and click **OK**.
	
    ![image-data-factory-linked-services-get-started-new-data-store]
  
4.  Now, you are back to **New data store** blade that looks as below:

    ![image-data-factory-get-started-new-data-store-with-storage]

5. Enter the **ACCOUNT NAME** and **ACCOUNT KEY** for your Azure Storage Account, and click **OK**. In the **Azure Management Portal**, click **Manage Access Keys** to get the **name** and **key** for your storage account.

    ![image-data-factory-get-started-storage-account-name-key]

6. After you click **OK** on the **New data store** blade, you should see **myblobstore** in the list of **DATA STORES** on the **Linked Services** blade. Check **NOTIFICATIONS** Hub (on the left) for any messages.

    ![image-data-factory-get-started-linked-services-list-with-myblobstore]

### Create a linked service for an Azure SQL Database
1. In the **Linked Services** blade, Click **Add data store** on the toolbar to add another data source (Azure SQL Database).
2. In the New data store blade:
	1. Enter a **name** for the data store. For the purpose of the tutorial, enter **MyAzureSQLStore** for the **NAME**. 
	2. Enter **DESCRIPTION (optional)** for the store.
	3. Click **Type** and select **Azure SQL Database**.
3. Enter **Server**, **Database**, **User Name**, and **Password** for the Azure SQL Database, and click **OK**.

    ![image-data-factory-get-started-linked-azure-sql-properties]

    **To get the connection string information for your Azure SQL Database:**
	

	1. In the **Azure Management Portal**, click **SQL Databases**.
	2. Click the **database**.
	3. Click **View SQL Database Connection Strings**.
	
       ![image-data-factory-get-started-azure-sql-connection-string]

4. After you click **OK** on the **New data store** blade, You should see both the stores in the **Linked Services** blade
    ![image-data-factory-get-started-linked-services-list-two-stores]

### Create a linked service for an on-demand HDInsight cluster 
You need to create a linked service to an on-demand HDInsight cluster and specify it in the Copy Activity JSON (linkedServiceName property). The copy activity runs as a map-only job on the HDInsight cluster. The Azure Management Portal does not support creating an HDInsight linked service, so you will have use Azure PowerShell to create it.

1. Create a JSON file named **OnDemandHDInsightCluster.json** with the following content and save it in the **C:\ADFGetStarted** folder. Note that the **type** is set to **HDInsightOnDemandLinkedService**. 

         {
            "name": "OnDemandHDInsightCluster",
			"properties": 
    		{
        		"type": "HDInsightOnDemandLinkedService",
				"clusterSize": 4,
        		"jobsContainer": "adftutorialjobscontainer",
        		"timeToLive": "00:05:00",
        		"version": "3.1",
        		"linkedServiceName": "MyBlobStore"
			}
		}

2. Launch **Azure PowerShell** and execute the following command to switch the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the AzureResourceManager mode.

         switch-azuremode AzureResourceManager
		
3. Execute the following command to create a linked service for the on-demand HDInsight cluster. Update the command if you are using a different resource group.

         New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File c:\ADFGetStarted\OnDemandHDInsightCluster.json

4. You should see the linked service **OnDemandHDInisightCluster** in the **linked services** blade of the **Azure Portal**.       

## <a name="CreateInputAndOutputDataSets"></a>Step 3: Create input and output datasets
Now, let’s go ahead and create input and output datasets that represent input and output data for the copy operation (Azure Storage blob => Azure SQL Database table). Creating datasets and pipelines is not supported by the Azure Portal yet, so you will be using Azure PowerShell cmdlets to create tables and pipelines. Before creating datasets or tables (rectangular datasets), you need to do the following (detailed steps follows the list).

* Create a blob container named **adftutorial** in the Azure blob storage account you added as a linked service to the data factory.
* Create and upload a text file, **emp.txt**, as a blob to the **adftutorial** container.
* Create a table named **emp** in the Azure SQL Database you added as a linked service to the data factory.

### Prepare Azure Blob Storage and Azure SQL Database for the tutorial
1. Launch Notepad, paste the following text, and save it as **emp.txt** to **C:\ADFGetStarted** folder on your hard drive.

        John, Doe
		Jane, Doe
				
2. Use tools such as [Azure Storage Explorer](https://azurestorageexplorer.codeplex.com/) to create the **adftutorial** container and to upload the **emp.txt** file.
    ![image-data-factory-get-started-storage-explorer]
3. Use the following SQL script to create the **emp** table in your Azure SQL Database. You can use SQL Server Management Studio to connect to an Azure SQL Database and to run SQL script.

        CREATE TABLE dbo.emp 
		(
			ID int IDENTITY(1,1) NOT NULL,
			FirstName varchar(50),
			LastName varchar(50),
		)
		GO

		CREATE CLUSTERED INDEX IX_emp_ID ON dbo.emp (ID); 
		GO
				

### Create input table 
A table is a rectangular dataset and has a schema. In this part of the step, you will create a table named **EmpBlobTable* in the data factory: **ADFTutorialDataFactory**.


1. Create a JSON file for a Data Factory table that represents data in the emp.txt in the blob.Launch Notepad, copy the following JSON script, and save it as EmpBlobTable.json in the C:\ADFGetStarted folder.


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
            		"blobPath": "adftutorial/input",
            		"format":
            		{
                		"type": "TextFormat",
                		"columnDelimiter": ",",
            		},
            		"linkedServiceName": "MyBlobStore"
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
	- **linkedServiceName** is set to **MyBlobStore** (you had created this linked service in Step 2).
	- **blobPath** is set to **adftutorial** container (all blobs in the container).
	- There are two fields in the text file – first name and last name – separated by a comma (columDelimiter)
	- format **type** is set to **TextFormat**
	- The **availability** is set to **hourly** (**frequency** set to **hour** and **interval** set to **1**). The Data Factory service will look for input data every hour in the blob container (**adftutorial**) you specified.

	See [JSON Scripting Reference](http://go.microsoft.com/fwlink/?LinkId=516971) for details about JSON properties.

2. Use the **New-AzureDataFactoryTable** cmdlet to create the input table using the **EmpBlobTable.json** file.


         New-AzureDataFactoryTable  -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory –File C:\ADFGetStarted\EmpBlobTable.json 

### Create output table
In this part of the step, you will create an output table named EmpSQLTable in the data factory: ADFTutorialDataFactory. 

1. Create a JSON file for a Data Factory table that represents data in the Azure SQL Database. Launch Notepad, copy the following JSON script, and save it as **EmpSQLTable.json** in the **C:\ADFGetStarted** folder.



        {
    		"name": "EmpSQLTable",
    		"properties":
    		{
        		"structure":
        		[
                	{ "name": "FirstName", "position": 0, "type": "String"},
                	{ "name": "LastName", "position": 1, "type": "String"}
        		],
        		"location":
        		{
            		"type": "AzureSQLTableLocation",
            		"tableName": "emp",
            		"linkedServiceName": "MyAzureSQLStore"
        		},
        		"availability": 
        		{
            		"frequency": "Hour",
            		"interval": 1            
        		},
    		}
		}


		
     Note the following: 
	
	* location **type **is set to **AzureSQLTableLocation**.
	* **linkedServiceName** is set to **myazuresqlstore** (you had created this linked service in Step 2).
	* **tablename** is set to **emp**.
	* There are three columns – ID, FirstName, and LastName – in the emp table in the database, but ID is an identity column, so you need to specify only **FirstName** and **LastName** here.
	* The **availability** is set to **hourly** (frequency set to hour and interval set to 1).  The Data Factory service will generate an output data slice every hour in the **emp** table in the Azure SQL Database.


2. In the Azure PowerShell, execute the following command to create another Data Factory table to represent the table in the Azure SQL Database.



         New-AzureDataFactoryTable -DataFactoryName ADFTutorialDataFactory -File C:\ADFGetStarted\EmpSQLTable.json -ResourceGroupName ADFTutorialResourceGroup 



## <a name="CreateAndRunAPipeline"></a>Step 4: Create and run a pipeline
In this step, you create a pipeline with one **Copy Activity** that uses **EmpTableFromBlob** as input and **EmpSQLTable** as output.

1. Create a JSON file for the pipeline. Launch Notepad, copy the following JSON script, and save it as **ADFTutorialPipeline.json** in the **C:\ADFGetStarted** folder.



         {
			"name": "ADFTutorialPipeline",
			"properties":
			{	
				"description" : "Copy data from a blob to Azure SQL table",
				"activities":	
				[
					{
						"name": "CopyFromBlobToSQL",
						"description": "Push Regional Effectiveness Campaign data to Sql Azure",
						"type": "CopyActivity",
						"inputs": [ {"name": "EmpTableFromBlob"} ],
						"outputs": [ {"name": "EmpSQLTable"} ],		
						"LinkedServiceName": "OnDemandHDInsightCluster",
						"transformation":
						{
							"source":
							{                               
								"type": "BlobSource",
								"blobColumnSeparators": ",",
								"NullValues": "\\N"
							},
							"sink":
							{
								"type": "SqlSink",
								"writeBatchSize": 1000000,
								"writeBatchTimeout": "01:00:00",
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
					},
        		]
      		}
		} 

	Note the following:

	- In the activities section, there is only activity whose **type** is set to **CopyActivity**.
	- Input for the activity is set to **EmpTableFromBlob** and output for the activity is set to **EmpSQLTable**.
	- **LinkedSeviceName** property for the **Copy Activity** is set to the **OnDemandHDInsightCluster** linked service you created earlier. 
	- In the **transformation** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type.

2. Use the **New-AzureDataFactoryPipeline** cmdlet to create a pipeline using the **ADFTutorialPipeline.json** file you created.



         New-AzureDataFactoryPipeline  -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File C:\ADFGetStarted\ADFTutorialPipeline.json  

3. Once the pipelines are created, you can specify the duration in which data processing will occur. By specifying the active period for a pipeline, you are defining the time duration in which the data slices will be processed based on the Availability properties that were defined for each Azure Data Factory table.  Execute the following PowerShell command to set active period on pipeline and enter Y to confirm. 



         Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-09-29 –EndDateTime 2014-09-30 –Name ADFTutorialPipeline  

	> [WACOM.NOTE] Replace **StartDateTime** value with the current day and **EndDateTime** value with the next day. Both StartDateTime and EndDateTime are UTC times and must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **EndDateTime** is optional, but we will use it in this tutorial. 
	
	In the example above, there will be 24 data slices as each data slice is produced hourly.

4. In the **Azure Portal**, in the **DATA FACTORY** blade for **ADFTutorialDataFactory** click **Diagram**.

	![image-data-factory-get-started-diagram-link]
  
5. You should see the diagram similar to the following:

	![image-data-factory-get-started-diagram-blade]

**Congratulations!** You have successfully created an Azure data factory, linked services, tables, and a pipeline and started the workflow.

## <a name="MonitorDataSetsAndPipeline"></a>Step 5: Monitor the datasets and pipeline
In this step, you will use the Azure Portal to monitor what’s going on in an Azure data factory. You can also use PowerShell cmdlets to monitor datasets and pipelines. For details about using cmdlets for monitoring, see [Monitor and Manage Data Factory using PowerShell Cmdlets].

1. Navigate to **Azure Portal (Preview)** if you don't have it open. 
2. If the blade for **ADFTutorialDataFactory** is not open, open it by clicking **ADFTutorialDataFactory** on the **Startboard**. 
3. You should see the count and names of tables and pipeline you created on this blade.

	![image-data-factory-get-started-home-page-pipeline-tables]

4. Now, click **Tables** tile.
5. On the **Tables** blade, click the **EmpSQLTable**.

	![image-data-factory-get-started-datasets-blade]

6. You should see the **EmpSQLTable** blade as shown below:

	![image-data-factory-get-started-table-blade]
 
7. Notice that the data slices up to the current time have already been produced and they are **Ready**. No slices show up in the **Problem slices** section at the bottom.
8. Click **… (Ellipsis)** to see all the slices.

	![image-data-factory-get-started-dataslices-blade]

9. Click on any data slice from the list and you should see the **DATA SLICE** blade.

	![image-data-factory-get-started-dataslice-blade]
  
11. Click **X** to close all the blades until you get back to the home blade for the **ADFTutorialDataFactory**.
12. (optional) Click **Events in the past week** tile in the Operations lens to see all the events for the data factory in the past week.
13. (optional) Click **Alert rules** tile to setup alerts to be notification when a certain event occurs.
14. (optional) Click **Pipelines**, click **ADFTutorialPipeline**, and drill through input tables (**Consumed**) or output tables (**Produced**).
15. Launch **SQL Server Management Studio**, connect to the Azure SQL Database, and verify that the rows are inserted into the **emp** table in the database.

	![image-data-factory-get-started-sql-query-results]


## Summary 
Azure Data Factory (ADF) developers author JSON files to describe stores/computes (linked services), tables and pipelines. Microsoft Azure PowerShell cmdlets enable ADF developers to perform CRUD (Create, Retrieve, Update, and Delete) and management operations for the Azure Data Factory. 

1.	Create an Azure **data factory**.
2.	Link one or more stores and computes (referred as **Linked Services**) to the data factory.
3.	Create **tables** which describe input data and output data for pipelines.
4.	Create **pipelines**. A pipeline consists of one or more activities and processes the inputs and produces outputs. 
5.	Specify the **active period** for pipelines (for data processing). The active period defines the time duration in which data slices will be produced.

## Next steps

Article | Description
------ | ---------------
[Enable your pipelines to work with on-premises data][use-onpremises-datasources]| This article has a walkthrough that you can try to expand this scenario to copy data from the input blob to an on-premises SQL Server database
[Monitor and Manage Azure Data Factory using PowerShell][monitor-manage-using-powershell] | This article describes how to monitor an Azure Data Factory using Azure PowerShell cmdlets. You can try out the examples in the article on the ADFTutorialDataFactory.
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issue. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database). 
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 

<table border="1">	<tr><th>Article</th><th>Descritpion</th></tr>	

<tr><td>
	[Enable your pipelines to work with on-premises data][use-onpremises-datasources]
</td><td>This article has a walkthrough that you can try to expand this scenario to copy data from the input blob to an on-premises SQL Server database.</td></tr>	

<tr><td>Monitor and Manage Azure Data Factory using PowerShell</td><td>This article describes how to monitor an Azure Data Factory using Azure PowerShell cmdlets. You can try out the examples in the article on the ADFTutorialDataFactory.</td></tr>	

<tr><td>Troubleshoot Azure Data Factory issues</td><td>This article describes how to troubleshoot Azure Data Factory issue. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database).</td></tr>	

<tr><td>Azure Data Factory Developer Reference</td><td>The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc…</td></tr>	</table>
     


<!--Link references-->
[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/

[azure-preview-portal]: https://portal.azure.com/

[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[troubleshoot]: ../data-factory-troubleshoot
[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908

<!--Image references-->

[image-data-factory-getstarted-new-everything]: ./media/data-factory-get-started/GetStarted-New-Everything.png

[image-data-factory-gallery-storagecachebackup]: ./media/data-factory-get-started/getstarted-gallery-datastoragecachebackup.png

[image-data-factory-gallery-storagecachebackup-seeall]: ./media/data-factory-get-started/getstarted-gallery-datastoragecachebackup-seeall.png

[image-data-factory-getstarted-data-services-data-factory-selected]: ./media/data-factory-get-started/getstarted-data-services-data-factory-selected.png

[image-data-factory-getstarted-data-factory-create-button]: ./media/data-factory-get-started/getstarted-data-factory-create-button.png

[image-data-factory-getstarted-new-data-factory-blade]: ./media/data-factory-get-started/getstarted-new-data-factory.png

[image-data-factory-get-stated-factory-home-page]: ./media/data-factory-get-started/getstarted-data-factory-home-page.png

[image-data-factory-get-started-startboard]: ./media/data-factory-get-started/getstarted-data-factory-startboard.png

[image-data-factory-get-started-linked-services-link]: ./media/data-factory-get-started/getstarted-data-factory-linked-services-link.png

[image-data-factory-get-started-linked-services-add-store-button]: ./media/data-factory-get-started/getstarted-linked-services-add-store-button.png

[image-data-factory-linked-services-get-started-new-data-store]: ./media/data-factory-get-started/getstarted-linked-services-new-data-store.png

[image-data-factory-get-started-new-data-store-with-storage]: ./media/data-factory-get-started/getstarted-linked-services-new-data-store-with-storage.png

[image-data-factory-get-started-storage-account-name-key]: ./media/data-factory-get-started/getstarted-storage-account-name-key.png

[image-data-factory-get-started-linked-services-list-with-myblobstore]: ./media/data-factory-get-started/getstarted-linked-services-list-with-myblobstore.png

[image-data-factory-get-started-linked-azure-sql-properties]: ./media/data-factory-get-started/getstarted-linked-azure-sql-properties.png

[image-data-factory-get-started-azure-sql-connection-string]: ./media/data-factory-get-started/getstarted-azure-sql-connection-string.png

[image-data-factory-get-started-linked-services-list-two-stores]: ./media/data-factory-get-started/getstarted-linked-services-list-two-stores.png

[image-data-factory-get-started-storage-explorer]: ./media/data-factory-get-started/getstarted-storage-explorer.png

[image-data-factory-get-started-diagram-link]: ./media/data-factory-get-started/getstarted-diagram-link.png

[image-data-factory-get-started-diagram-blade]: ./media/data-factory-get-started/getstarted-diagram-blade.png

[image-data-factory-get-started-home-page-pipeline-tables]: ./media/data-factory-get-started/getstarted-datafactory-home-page-pipeline-tables.png

[image-data-factory-get-started-datasets-blade]: ./media/data-factory-get-started/getstarted-datasets-blade.png

[image-data-factory-get-started-table-blade]: ./media/data-factory-get-started/getstarted-table-blade.png

[image-data-factory-get-started-dataslices-blade]: ./media/data-factory-get-started/getstarted-dataslices-blade.png

[image-data-factory-get-started-dataslice-blade]: ./media/data-factory-get-started/getstarted-dataslice-blade.png

[image-data-factory-get-started-sql-query-results]: ./media/data-factory-get-started/getstarted-sql-query-results.png