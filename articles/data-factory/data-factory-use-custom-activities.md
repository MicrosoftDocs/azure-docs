<properties 
	pageTitle="Use custom activities in an Azure Data Factory pipeline" 
	description="Learn how to create custom activities and use them in an Azure Data Factory pipeline." 
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
	ms.date="09/22/2015" 
	ms.author="spelluru"/>

# Use custom activities in an Azure Data Factory pipeline
Azure Data Factory supports built-in activities such as **Copy Activity** and **HDInsight Activity** to be used in pipelines to move and process data. You can also create a custom .NET activity with your own transformation/processing logic and use the activity in a pipeline. You can configure the activity to run using either an **Azure HDInsight** cluster or an **Azure Batch** service.   

This article describes how to create a custom activity and use it in an Azure Data Factory pipeline. It also provides a detailed walkthrough with step-by-step instructions for creating and using a custom activity. The walkthrough uses the HDInsight linked service. To use the Azure Batch linked service instead, you create a linked service of type **AzureBatch** and use it in the activity section of the pipeline JSON (**linkedServiceName**). See the [Azure Batch Linked Service](#AzureBatch) section for details on using Azure Batch with the custom activity.


## <a name="walkthrough" /> Walkthrough
This Walkthrough provides you with step-by-step instructions for creating a custom activity and using the activity in an Azure Data Factory pipeline. This walkthrough extends the tutorial from the [Get started with Azure Data Factory][adfgetstarted]. If you want to see the custom activity working, you need to go through the Get started tutorial first and then do this walkthrough. 

**Prerequisites:**


- Tutorial from [Get started with Azure Data Factory][adfgetstarted]. You must complete the tutorial from this article before doing this walkthrough.
- Visual Studio 2012 or 2013
- Download and install [Azure .NET SDK][azure-developer-center]
- Download the latest [NuGet package for Azure Data Factory](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactories/) and Install it. Instructions are in the walkthrough.
- Download and install NuGet package for Azure Storage. Instructions are in the walkthrough, so you can skip this step.

## Step 1: Create a custom activity

1.	Create a .NET Class Library project.
	<ol type="a">
		<li>Launch <b>Visual Studio 2012</b> or <b>Visual Studio 2013</b>.</li>
		<li>Click <b>File</b>, point to <b>New</b>, and click <b>Project</b>.</li> 
		<li>Expand <b>Templates</b>, and select <b>Visual C#</b>. In this walkthrough, you use C#, but you can use any .NET language to develop the custom activity.</li> 
		<li>Select <b>Class Library</b> from the list of project types on the right.</li>
		<li>Enter <b>MyDotNetActivity</b> for the <b>Name</b>.</li> 
		<li>Select <b>C:\ADFGetStarted</b> for the <b>Location</b>.</li>
		<li>Click <b>OK</b> to create the project.</li>
	</ol>
2.  Click <b>Tools</b>, point to <b>NuGet Package Manager</b>, and click <b>Package Manager Console</b>.
3.	In the <b>Package Manager Console</b>, execute the following command to import <b>Microsoft.Azure.Management.DataFactories</b>. 

		Install-Package Microsoft.Azure.Management.DataFactories

4. Import the Azure Storage NuGet package in to the project.

		Install-Package Azure.Storage

5. Add the following **using** statements to the source file in the project.

		using System.IO;
		using System.Globalization;
		using System.Diagnostics;
	
		using Microsoft.Azure.Management.DataFactories.Models;
		using Microsoft.Azure.Management.DataFactories.Runtime;

		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
  
6. Change the name of the **namespace** to **MyDotNetActivityNS**.

		namespace MyDotNetActivityNS

7. Change the name of the class to **MyDotNetActivity** and derive it from the **IDotNetActivity** interface as shown below.

		public class MyDotNetActivity : IDotNetActivity

8. Implement (Add) the **Execute** method of the **IDotNetActivity** interface to the **MyDotNetActivity** class and copy the following sample code to the method. 


	The following sample code counts the number of lines in the input blob and produces the following content in the output blob: path to the blob, number of lines in the blob, the machine on which the activity ran, current date-time.

        public IDictionary<string, string> Execute(IEnumerable<LinkedService> linkedServices, IEnumerable<Table> tables, Activity activity, IActivityLogger logger)
        {
            IDictionary<string, string> extendedProperties = ((DotNetActivity)activity.TypeProperties).ExtendedProperties;

            AzureStorageLinkedService inputLinkedService, outputLinkedService;
            CustomDataset inputLocation;
            AzureBlobDataset outputLocation;

            Table inputTable = tables.Single(table => table.Name == activity.Inputs.Single().Name);
            inputLocation = inputTable.Properties.TypeProperties as CustomDataset;

			// using First method instead of Single since we are using the same 
			// Azure Storage linked service for input and output. 
            inputLinkedService = linkedServices.First(linkedService => linkedService.Name == inputTable.Properties.LinkedServiceName).Properties.TypeProperties as AzureStorageLinkedService;


            string output = string.Empty;

            logger.Write("Before anything...");

            logger.Write("Printing dictionary entities if any...");
            foreach (KeyValuePair<string, string> entry in extendedProperties)
            {
                logger.Write("<key:{0}> <value:{1}>", entry.Key, entry.Value);
            }

            string connectionString = GetConnectionString(inputLinkedService);
            string folderPath = GetFolderPath(inputTable);

            logger.Write("Reading blob from: {0}", folderPath);

            CloudStorageAccount inputStorageAccount = CloudStorageAccount.Parse(connectionString);
            CloudBlobClient inputClient = inputStorageAccount.CreateCloudBlobClient();

            BlobContinuationToken continuationToken = null;

            do
            {
                BlobResultSegment result = inputClient.ListBlobsSegmented(folderPath,
                                            true,
                                            BlobListingDetails.Metadata,
                                            null,
                                            continuationToken,
                                            null,
                                            null);
                foreach (IListBlobItem listBlobItem in result.Results)
                {
                    CloudBlockBlob inputBlob = listBlobItem as CloudBlockBlob;
                    int count = 0;
                    if (inputBlob != null)
                    {
                        using (StreamReader sr = new StreamReader(inputBlob.OpenRead()))
                        {
                            while (!sr.EndOfStream)
                            {
                                string line = sr.ReadLine();
                                if (count == 0)
                                {
                                    logger.Write("First line: [{0}]", line);
                                }
                                count++;
                            }

                        }

                    }
                    output += string.Format(CultureInfo.InvariantCulture,
                                    "{0},{1},{2},{3},{4}\n",
                                    folderPath,
                                    inputBlob.Name,
                                    count,
                                    Environment.MachineName,
                                    DateTime.UtcNow);

                }
                continuationToken = result.ContinuationToken;

            } while (continuationToken != null);

            Table outputTable = tables.Single(table => table.Name == activity.Outputs.Single().Name);
            outputLocation = outputTable.Properties.TypeProperties as AzureBlobDataset;
            outputLinkedService = linkedServices.First(linkedService => linkedService.Name == outputTable.Properties.LinkedServiceName).Properties.TypeProperties as AzureStorageLinkedService;

            connectionString = GetConnectionString(outputLinkedService);
            folderPath = GetFolderPath(outputTable);

            logger.Write("Writing blob to: {0}", folderPath);

            CloudStorageAccount outputStorageAccount = CloudStorageAccount.Parse(connectionString);
            Uri outputBlobUri = new Uri(outputStorageAccount.BlobEndpoint, folderPath + "/" + Guid.NewGuid() + ".csv");

            CloudBlockBlob outputBlob = new CloudBlockBlob(outputBlobUri, outputStorageAccount.Credentials);
            outputBlob.UploadText(output);

            return new Dictionary<string, string>();

        }

9. Add the following helper methods. The **Execute** method invokes these helper methods. The **GetConnectionString** method retrieves the Azure Storage connection string and the **GetFolderPath** method retrieves the blob location. 


        private static string GetConnectionString(AzureStorageLinkedService asset)
        {

            if (asset == null)
            {
                return null;
            }

            return asset.ConnectionString;
        }

        
        private static string GetFolderPath(Table dataArtifact)
        {
            if (dataArtifact == null || dataArtifact.Properties == null)
            {
                return null;
            }

            AzureBlobDataset blobDataset = dataArtifact.Properties.TypeProperties as AzureBlobDataset;
            if (blobDataset == null)
            {
                return null;
            }

            return blobDataset.FolderPath;
        }
   

10. Compile the project. Click **Build** from the menu and click **Build Solution**.
11. Launch **Windows Explorer**, and navigate to **bin\debug** or **bin\release** folder depending type of build.
12. Create a zip file **MyDotNetActivity.zip** that contain all the binaries in the <project folder>\bin\Debug folder. You may want to include the MyDotNetActivity.pdb file so that you get additional details such as line number in the source code that caused the issue in case of a failure. 
13. Upload **MyDotNetActivity.zip** as a blob to the blob container: **customactvitycontainer** in the Azure blob storage that the **StorageLinkedService** linked service in the **ADFTutorialDataFactory** uses.  Create the blob container **customactivitycontainer** if it does not already exist.

> [AZURE.NOTE] If you add this .NET activity project to a solution in Visual Studio that contains a Data Factory project, you do not need to perform the last two steps of creating the zip file and manually uploading it to the Azure blob storage. When you publish Data Factory entities using Visual Studio, these steps are automatically done by the publishing process. See [Build your first pipeline using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md) and [Copy data from Azure Blob to Azure SQL](data-factory-get-started-using-vs.md) articles to learn about creating and publishing Data Factory entities using Visual Studio.  


## Step 2: Use the custom activity in a pipeline
Here are the steps you will be performing in this step:

1. Create a linked service for the HDInsight cluster on which the custom activity will run as a map-only job. 
2. Create an output table that the pipeline in this sample will produce.
3. Create and run a pipeline that uses the custom activity you created in step 1. 
 
### Create a linked service for  HDInsight cluster that will be used to run the custom activity
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, if you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. 

> [AZURE.NOTE] At runtime, an instance of a .NET activity runs only on one worker node in the HDInsight cluster; it cannot be scaled to run on multiple nodes. Multiple instances of .NET activity can run in parallel on different nodes of the HDInsight cluster. 

If you have extended the [Get started with Azure Data Factory][adfgetstarted] tutorial with the walkthrough from [Use Pig and Hive with Azure Data Factory][hivewalkthrough], you can skip creation of this linked service and use the linked service you already have in the ADFTutorialDataFactory.


#### To use an on-demand HDInsight cluster

1. In the **Azure Portal**, click **Author and Deploy** in the Data Factory home page.
2. In the Data Factory Editor, click **New compute** from the command bar and select **On-demand HDInsight cluster** from the menu.
2. Do the following in the JSON script: 
	1. For the **clusterSize** property, specify the size of the HDInsight cluster.
	2. For the **jobsContainer** property, specify the name of the default container where the cluster logs will be stored. For the purpose of this tutorial, specify **adfjobscontainer**.
	3. For the **timeToLive** property, specify how long the customer can be idle before it is deleted. 
	4. For the **version** property, specify the HDInsight version you want to use. If you exclude this property, the latest version is used.  
	5. For the **linkedServiceName**, specify **StorageLinkedService** that you had created in the Get started tutorial. 

			{
			  "name": "HDInsightOnDemandLinkedService",
			  "properties": {
			    "type": "HDInsightOnDemand",
			    "typeProperties": {
			      "clusterSize": "1",
			      "timeToLive": "00:05:00",
			      "version": "3.1",
			      "linkedServiceName": "StorageLinkedService"
			    }
			  }
			}

2. Click **Deploy** on the command bar to deploy the linked service.
   
#### To use your own HDInsight cluster: 

1. In the **Azure Portal**, click **Author and Deploy** in the Data Factory home page.
2. In the **Data Factory Editor**, click **New compute** from the command bar and select **HDInsight cluster** from the menu.
2. Do the following in the JSON script: 
	1. For the **clusterUri** property, enter the URL for your HDInsight. For example: https://<clustername>.azurehdinsight.net/     
	2. For the **UserName** property, enter the user name who has access to the HDInsight cluster.
	3. For the **Password** property, enter the password for the user. 
	4. For the **LinkedServiceName** property, enter **StorageLinkedService**. This is the linked service you had created in the Get started tutorial. 

2. Click **Deploy** on the command bar to deploy the linked service.

### Create an output table

1. In the **Data Factory editor**, click **New dataset**, and then click **Azure Blob storage** from the command bar.
2. Replace the JSON script in the right pane with the following JSON script:

		{
		  "name": "OutputTableForCustom",
		  "properties": {
		    "type": "AzureBlob",
		    "linkedServiceName": "StorageLinkedService",
		    "typeProperties": {
		      "folderPath": "adftutorial/customactivityoutput/{Slice}",
		      "partitionedBy": [
		        {
		          "name": "Slice",
		          "value": {
		            "type": "DateTime",
		            "date": "SliceStart",
		            "format": "yyyyMMddHH"
		          }
		        }
		      ]
		    },
		    "availability": {
		      "frequency": "Hour",
		      "interval": 1
		    }
		  }
		}

 	Output location is **adftutorial/customactivityoutput/YYYYMMDDHH/** where YYYYMMDDHH is the year, month, date, and hour of the slice being produced. See [Developer Reference][adf-developer-reference] for details. 

2. Click **Deploy** on the command bar to deploy the table.


### Create and run a pipeline that uses the custom activity
   
1. In the Data Factory Editor, click **New pipeline** on the command bar. If you do not see the command, click **... (Ellipsis)** to see it. 
2. Replace the JSON in the right pane with the following JSON script. If you want to use your own cluster and followed the steps to create the **HDInsightLinkedService** linked service, replace **HDInsightOnDemandLinkedService** with **HDInsightLinkedService** in the following JSON. 
		
		{
		  "name": "ADFTutorialPipelineCustom",
		  "properties": {
		    "description": "Use custom activity",
		    "activities": [
		      {
		        "Name": "MyDotNetActivity",
		        "Type": "DotNetActivity",
		        "Inputs": [
		          {
		            "Name": "EmpTableFromBlob"
		          }
		        ],
		        "Outputs": [
		          {
		            "Name": "OutputTableForCustom"
		          }
		        ],
		        "LinkedServiceName": "HDInsightOnDemandLinkedService",
		        "typeProperties": {
		          "AssemblyName": "MyDotNetActivity.dll",
		          "EntryPoint": "MyDotNetActivityNS.MyDotNetActivity",
		          "PackageLinkedService": "StorageLinkedService",
		          "PackageFile": "customactivitycontainer/MyDotNetActivity.zip",
		          "extendedProperties": {
		            "SliceStart": "$$Text.Format('{0:yyyyMMddHH-mm}', Time.AddMinutes(SliceStart, 0))"
		          }
		        },
		        "Policy": {
		          "Concurrency": 1,
		          "ExecutionPriorityOrder": "OldestFirst",
		          "Retry": 3,
		          "Timeout": "00:30:00",
		          "Delay": "00:00:00"
		        }
		      }
		    ],
		    "start": "2015-02-13T00:00:00Z",
		    "end": "2015-02-14T00:00:00Z",
		    "isPaused": false
		  }
		}

	Replace **StartDateTime** value with the three days prior to current day and **EndDateTime** value with the current day. Both StartDateTime and EndDateTime must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The output table is scheduled to be produced every day, so there will be three slices produced.

	Note the following: 

	- There is one activity in the activities section and it is of type: **DotNetActivity**.
	- Use the same input table **EmpTableFromBlob** that you used in the Get started tutorial.
	- Use a new output table **OutputTableForCustom** that you will create in the next step.
	- **AssemblyName** is set to the name of the DLL: **MyActivities.dll**.
	- **EntryPoint** is set to **MyDotNetActivityNS.MyDotNetActivity**.
	- **PackageLinkedService** is set to **MyBlobStore** that was created as part of the tutorial from [Get started with Azure Data Factory][adfgetstarted]. This blob store contains the custom activity zip file.
	- **PackageFile** is set to **customactivitycontainer/MyDotNetActivity.zip**.
     
4. Click **Deploy** on the command bar to deploy the pipeline.
8. Verify that the output files are generated in the blob storage in the **adftutorial** container.

	![output from custom activity][image-data-factory-ouput-from-custom-activity]

9. If you open the output file, you should see the output similar to the following:
	
	adftutorial/,emp.txt,2,WORKERNODE0,03/27/2015 19:23:28 

	(blob location), (name of the blob), (number of lines in the blob), (node on which the activity ran), (date time stamp)

10.	Use the [Azure Portal][azure-preview-portal] or Azure PowerShell cmdlets to monitor your data factory, pipelines, and data sets. You can see messages from the **ActivityLogger** in the code for the custom activity in the logs (specifically user-0.log) that you can download from the portal or using cmdlets.

	![download logs from custom activity][image-data-factory-download-logs-from-custom-activity]
	
   
See [Monitor and Manage Pipelines](data-factory-monitor-manage-pipelines.md) for detailed steps for monitoring datasets and pipelines.      

## Updating a custom activity
If you update the code for the custom activity, build it, and upload the zip file that contains new binaries to the blob storage. 
    
## <a name="AzureBatch"></a> Using Azure Batch linked service 
> [AZURE.NOTE] See [Azure Batch Technical Overview][batch-technical-overview] for an overview of the Azure Batch service and see [Getting Started with the Azure Batch Library for .NET][batch-get-started] to quickly get started with the Azure Batch service.

You can run your custom .NET activities using Azure Batch as a compute resource. You will have to create your own Azure Batch pools and specify the number of VMs along with other configurations. Azure Batch pools provides the following features to customers:

1. Create pools containing a single core to thousands of cores.
2. Auto scale VM count based on a formula
3. Support VMs of any size
4. Configurable number of tasks per VM
5. Queue unlimited number of tasks


Here are the high-level steps for using the Azure Batch Linked Service in the walkthrough described in the previous section:

1. Create an Azure Batch account using the Azure Management Portal. See [Azure Batch Technical Overview][batch-create-account] article for instructions. Note down the Azure Batch account name and account key. 

	You can also use [New-AzureBatchAccount][new-azure-batch-account] cmdlet to create an Azure Batch account. See [Using Azure PowerShell to Manage Azure Batch Account][azure-batch-blog] for detailed instructions on using this cmdlet. 
2. Create an Azure Batch pool. You can download the source code for the [Azure Batch Explorer tool][batch-explorer], compile, and use it  (or) use [Azure Batch Library for .NET][batch-net-library] to create a Azure Batch pool. See [Azure Batch Explorer Sample Walkthrough][batch-explorer-walkthrough] for step-by-step instructions for using the Azure Batch Explorer.
	
	You can also use [New-AzureBatchPool][new-azure-batch-pool] cmdlet to create an Azure Batch pool. 

2. Create an Azure Batch Linked Service using the following JSON template. The Data Factory Editor displays a similar template for you to start with. Specify the Azure Batch account name, account key and pool name in the JSON snippet. 

		{
		  "name": "AzureBatchLinkedService",
		  "properties": {
		    "type": "AzureBatch",
		    "typeProperties": {
		      "accountName": "<Azure Batch account name>",
			  "batchUri": "https://<region>.batch.azure.com",
		      "accessKey": "<Azure Batch account key>",
		      "poolName": "<Azure Batch pool name>",
		      "linkedServiceName": "<Specify associated storage linked service reference here>"
		    }
		  }
		}

	> [AZURE.IMPORTANT] The **URL** from the **Azure Batch account blade** is in the following format: accountname.region.batch.azure.com. For the **batchUri** property in the JSON, you will need to **remove "accountname."** from the URL and use the **accountname** for the **accountName** JSON property. 
	  
	For the **poolName** property, you can also specify the ID of the pool instead of the name of the pool. 

	See [Azure Batch Linked Service MSDN topic](https://msdn.microsoft.com/library/mt163609.aspx) for descriptions of these properties. 

2.  In the Data Factory Editor, open JSON definition for the pipeline you created in the walkthrough and replace **HDInsightLinkedService** with **AzureBatchLinkedService**.
3.  You may want to change the start and end times for the pipeline so that you can test the scenario with the Azure Batch service. 
4.  You can see the Azure Batch tasks associated with processing the slices in the Azure Batch Explorer as shown in the following diagram.

	![Azure Batch tasks][image-data-factory-azure-batch-tasks]

> [AZURE.NOTE] The Data Factory service does not support an on-demand option for Azure Batch as it does for HDInsight. You can only use your own Azure Batch pool in an Azure data factory.    

## See Also

[Azure Data Factory Updates: Execute ADF Custom .NET activities using Azure Batch](http://azure.microsoft.com/blog/2015/05/01/azure-data-factory-updates-execute-adf-custom-net-activities-using-azure-batch/). 

[batch-net-library]: ../batch/batch-dotnet-get-started.md
[batch-explorer]: https://github.com/Azure/azure-batch-samples/tree/master/CSharp/BatchExplorer
[batch-explorer-walkthrough]: http://blogs.technet.com/b/windowshpc/archive/2015/01/20/azure-batch-explorer-sample-walkthrough.aspx
[batch-create-account]: ../batch/batch-technical-overview.md/#batch-concepts
[batch-technical-overview]: ../batch/batch-technical-overview.md
[batch-get-started]: ../batch/batch-dotnet-get-started.md
[monitor-manage-using-powershell]: data-factory-monitor-manage-using-powershell.md
[adf-tutorial]: data-factory-tutorial.md
[use-custom-activities]: data-factory-use-custom-activities.md
[troubleshoot]: data-factory-troubleshoot.md
[data-factory-introduction]: data-factory-introduction.md
[azure-powershell-install]: https://github.com/Azure/azure-sdk-tools/releases


[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456

[new-azure-batch-account]: https://msdn.microsoft.com/library/mt125880.aspx
[new-azure-batch-pool]: https://msdn.microsoft.com/library/mt125936.aspx
[azure-batch-blog]: http://blogs.technet.com/b/windowshpc/archive/2014/10/28/using-azure-powershell-to-manage-azure-batch-account.aspx

[nuget-package]: http://go.microsoft.com/fwlink/?LinkId=517478
[azure-developer-center]: http://azure.microsoft.com/develop/net/
[adf-developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[azure-preview-portal]: https://portal.azure.com/

[adfgetstarted]: data-factory-get-started.md
[hivewalkthrough]: data-factory-data-transformation-activities.md

[image-data-factory-ouput-from-custom-activity]: ./media/data-factory-use-custom-activities/OutputFilesFromCustomActivity.png

[image-data-factory-download-logs-from-custom-activity]: ./media/data-factory-use-custom-activities/DownloadLogsFromCustomActivity.png

[image-data-factory-azure-batch-tasks]: ./media/data-factory-use-custom-activities/AzureBatchTasks.png
 