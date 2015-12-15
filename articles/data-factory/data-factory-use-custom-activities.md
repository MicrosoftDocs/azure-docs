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
	ms.date="12/15/2015"
	ms.author="spelluru"/>

# Use custom activities in an Azure Data Factory pipeline
Azure Data Factory supports built-in activities such as **Copy Activity** and **HDInsight Activity** to be used in pipelines to move and process data. You can also create a custom .NET activity with your own transformation/processing logic and use the activity in a pipeline. You can configure the activity to run using either an **Azure HDInsight** cluster or an **Azure Batch** service.   

This article describes how to create a custom activity and use it in an Azure Data Factory pipeline. It also provides a detailed walkthrough with step-by-step instructions for creating and using a custom activity. The walkthrough uses the HDInsight linked service. To use the Azure Batch linked service instead, you create a linked service of type **AzureBatch** and use it in the activity section of the pipeline JSON (**linkedServiceName**). See the [Azure Batch Linked Service](#AzureBatch) section for details on using Azure Batch with the custom activity.


## <a name="walkthrough" /> Walkthrough
This Walkthrough provides you with step-by-step instructions for creating a custom activity and using the activity in an Azure Data Factory pipeline. This walkthrough extends the tutorial from the [Get started with Azure Data Factory][adfgetstarted]. If you want to see the custom activity working, you need to go through the Get started tutorial first and then do this walkthrough.

### Prerequisites


- Tutorial from [Get started with Azure Data Factory][adfgetstarted]. You must complete the tutorial from this article before doing this walkthrough.
- Visual Studio 2012 or 2013
- Download and install [Azure .NET SDK][azure-developer-center]
- Download the latest [NuGet package for Azure Data Factory](https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactories/) and Install it. Instructions are in the walkthrough.
- Download and install NuGet package for Azure Storage. Instructions are in the walkthrough, so you can skip this step.

### High-level steps 
1.	Create a custom activity to use in the Data Factory solution. The custom activity contains the data processing logic. 
	1.	In Visual Studio (or code editor of choice), create a .NET Class Library project, add the code to process input data, and compile the project.	
	2.	Zip all the binary files and the PDB (optional) file in the output folder.	
	3.	Upload the zip file to Azure blob storage. Detailed steps are in the Create the custom activity section. 
2. Create an Azure data factory that uses the custom activity:
	1. Create an Azure data factory.
	2. Create linked services.
		1. StorageLinkedService: Supplies storage credentials for accessing blobs.
		2. HDInsightLinkedService: specifies Azure HDInsight as compute.
	3. Create datasets.
		1. InputDataset: specifies storage container and folder for the input blobs.
		1. OuputDataset: specifies storage container and folder for the output blobs.
	2. Create a pipeline that uses the custom activity.
	3. Run and test the pipeline.
	4. Debug the pipeline.

## Create the custom activity
To create a .NET custom activity that you can use in an Azure Data Factory pipeline, you need to create a **.NET Class Library** project with a class that implements that **IDotNetActivity** interface. This interface has only one method: Execute. Here is the signature of the method:

	public IDictionary<string, string> Execute(
            IEnumerable<LinkedService> linkedServices, 
            IEnumerable<Dataset> datasets, 
            Activity activity, 
            IActivityLogger logger)
        
The method has a few key components that you need to understand. 

- The method takes four parameters:
	- **linkedServices**. This is an enumerable list of linked services that link input/output data sources (for example: Azure Blob Storage) to the data factory. In this sample, there is only one linked service of type Azure Storage used for both input and output. 
	- **datasets**. This is an enumerable list of datasets. You can use this parameter to get the locations and schemas defined by input and output datasets.
	- **activity**. This parameter represents the current compute entity - in this case, an Azure HDInsight.
	- **logger**. The logger lets you write debug comments that will surface as the “User” log for the pipeline. 

- The method returns a dictionary that can be used to chain custom activities together. We will not use this feature in this sample solution. 

### Procedure: 
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
		using System.Linq;

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

		/// <summary>
        /// Execute method is the only method of IDotNetActivity interface you must implement. 
        /// In this sample, the method invokes the Calculate method to perform the core logic.  
		/// </summary>

        public IDictionary<string, string> Execute(
            IEnumerable<LinkedService> linkedServices,
            IEnumerable<Dataset> datasets,
            Activity activity,
            IActivityLogger logger)
        {

            // declare types for input and output data stores
            AzureStorageLinkedService inputLinkedService;

            // declare dataset types
            CustomDataset inputLocation;
            AzureBlobDataset outputLocation;

            Dataset inputDataset = datasets.Single(dataset => dataset.Name == activity.Inputs.Single().Name);
            inputLocation = inputDataset.Properties.TypeProperties as CustomDataset;

            foreach (LinkedService ls in linkedServices)
                logger.Write("linkedService.Name {0}", ls.Name);

            // using First method instead of Single since we are using the same 
            // Azure Storage linked service for input and output. 
            inputLinkedService = linkedServices.First(
                linkedService =>
                linkedService.Name ==
                inputDataset.Properties.LinkedServiceName).Properties.TypeProperties
                as AzureStorageLinkedService;

            string connectionString = inputLinkedService.ConnectionString; // To create an input storage client.
            string folderPath = GetFolderPath(inputDataset);
            string output = string.Empty; // for use later.

            // create storage client for input. Pass the connection string.
            CloudStorageAccount inputStorageAccount = CloudStorageAccount.Parse(connectionString);
            CloudBlobClient inputClient = inputStorageAccount.CreateCloudBlobClient();

            // initialize the continuation token before using it in the do-while loop.
            BlobContinuationToken continuationToken = null;
            do
            {   // get the list of input blobs from the input storage client object.
                BlobResultSegment blobList = inputClient.ListBlobsSegmented(folderPath,
                                         true,
                                         BlobListingDetails.Metadata,
                                         null,
                                         continuationToken,
                                         null,
                                         null);
                
                // Calculate method returns the number of occurrences of 
                // the search term (“Microsoft”) in each blob associated
       			// with the data slice. 
        		// 
        	    // definition of the method is shown in the next step.
 
                output = Calculate(blobList, logger, folderPath, ref continuationToken, "Microsoft");

            } while (continuationToken != null);

            // get the output dataset using the name of the dataset matched to a name in the Activity output collection.
            Dataset outputDataset = datasets.Single(dataset => dataset.Name == activity.Outputs.Single().Name);
            // convert to blob location object.
            outputLocation = outputDataset.Properties.TypeProperties as AzureBlobDataset;

            folderPath = GetFolderPath(outputDataset);

            logger.Write("Writing blob to the folder: {0}", folderPath);

            // create a storage object for the output blob.
            CloudStorageAccount outputStorageAccount = CloudStorageAccount.Parse(connectionString);
            // write the name of the file. 
            Uri outputBlobUri = new Uri(outputStorageAccount.BlobEndpoint, folderPath + "/" + GetFileName(outputDataset));

            logger.Write("output blob URI: {0}", outputBlobUri.ToString());
            // create a new blob and upload the output text.
            CloudBlockBlob outputBlob = new CloudBlockBlob(outputBlobUri, outputStorageAccount.Credentials);
            logger.Write("Writing {0} to the output blob", output);
            outputBlob.UploadText(output);

            // return a new Dictionary object (unused in this code).
            return new Dictionary<string, string>();
        }

9. Add the following helper methods. The **Execute** method invokes these helper methods. The **GetConnectionString** method retrieves the Azure Storage connection string and the **GetFolderPath** method retrieves the blob location. Most importantly, the **Calculate** method isolates the code that iterates through each blob.

        /// <summary>
        /// Gets the folderPath value from the input/output dataset.   
		/// </summary>

		private static string GetFolderPath(Dataset dataArtifact)
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

        /// <summary>
        /// Gets the fileName value from the input/output dataset.   
        /// </summary>

        private static string GetFileName(Dataset dataArtifact)
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

            return blobDataset.FileName;
        }

        /// <summary>
        /// Iterates through each blob (file) in the folder, counts the number of instances of search term in the file, 
        /// and prepares the output text that will be written to the output blob. 
        /// </summary>

        public static string Calculate(BlobResultSegment Bresult, IActivityLogger logger, string folderPath, ref BlobContinuationToken token, string searchTerm)
        {
            string output = string.Empty;
            logger.Write("number of blobs found: {0}", Bresult.Results.Count<IListBlobItem>());
            foreach (IListBlobItem listBlobItem in Bresult.Results)
            {
                CloudBlockBlob inputBlob = listBlobItem as CloudBlockBlob;
                if ((inputBlob != null) && (inputBlob.Name.IndexOf("$$$.$$$") == -1))
                {
                    string blobText = inputBlob.DownloadText(Encoding.ASCII, null, null, null);
                    logger.Write("input blob text: {0}", blobText);
                    string[] source = blobText.Split(new char[] { '.', '?', '!', ' ', ';', ':', ',' }, StringSplitOptions.RemoveEmptyEntries);
                    var matchQuery = from word in source
                                     where word.ToLowerInvariant() == searchTerm.ToLowerInvariant()
                                     select word;
                    int wordCount = matchQuery.Count();
                    output += string.Format("{0} occurrences(s) of the search term \"{1}\" were found in the file {2}.\r\n", wordCount, searchTerm, inputBlob.Name);
                }
            }
            return output;
        }

	The GetFolderPath method returns the path to the folder that the dataset points to and the GetFileName method returns the name of the blob/file that the dataset points to. 
	
		    "name": "InputDataset",
		    "properties": {
		        "type": "AzureBlob",
		        "linkedServiceName": "StorageLinkedService",
		        "typeProperties": {
		            "fileName": "file.txt",
		            "folderPath": "mycontainer/inputfolder/",
	
	The Calculate method calculates the number of instances of keyword Microsoft in the input files (blobs in the folder). The search term (“Microsoft”) is hard coded in the code.

10. Compile the project. Click **Build** from the menu and click **Build Solution**.
11. Launch **Windows Explorer**, and navigate to **bin\debug** or **bin\release** folder depending type of build.
12. Create a zip file **MyDotNetActivity.zip** that contain all the binaries in the <project folder>\bin\Debug folder. You may want to include the **MyDotNetActivity.pdb** file so that you get additional details such as line number in the source code that caused the issue in case of a failure.

	![Binary output files](./media/data-factory-use-custom-activities/Binaries.png)
13. Upload **MyDotNetActivity.zip** as a blob to the blob container: **customactvitycontainer** in the Azure blob storage that the **StorageLinkedService** linked service in the **ADFTutorialDataFactory** uses.  Create the blob container **customactivitycontainer** if it does not already exist.

> [AZURE.NOTE] If you add this .NET activity project to a solution in Visual Studio that contains a Data Factory project, you do not need to perform the last two steps of creating the zip file and manually uploading it to the Azure blob storage. When you publish Data Factory entities using Visual Studio, these steps are automatically done by the publishing process. See [Build your first pipeline using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md) and [Copy data from Azure Blob to Azure SQL](data-factory-get-started-using-vs.md) articles to learn about creating and publishing Data Factory entities using Visual Studio.  

### Execute method

This section provides more details and notes about the code in the **Execute** method.
 
1. The members for iterating through the input collection are found in the [Microsoft.WindowsAzure.Storage.Blob](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.aspx) namespace. Iterating through the blob collection requires using the **BlobContinuationToken** class. In essence, you must use a do-while loop with the token as the mechanism for exiting the loop. For more information, see [How to use Blob storage from .NET](../storage/storage-dotnet-how-to-use-blobs.md). A basic loop is shown here:

		// Initialize the continuation token.
		BlobContinuationToken continuationToken = null;
		do
		{   
			// Get the list of input blobs from the input storage client object.
			BlobResultSegment blobList = inputClient.ListBlobsSegmented(folderPath,
    					              true,
    	                              BlobListingDetails.Metadata,
    	                              null,
    	                              continuationToken,
    	                              null,
    	                              null);
			// Return a string derived from parsing each blob.
    		output = Calculate(blobList, logger, folderPath, ref continuationToken, "Microsoft");
		} while (continuationToken != null);

	See the documentation for the [ListBlobsSegmented](https://msdn.microsoft.com/library/jj717596.aspx) method for details.

2.	The code for working through the set of blobs logically goes within the do-while loop. In the **Execute** method, the do-while loop passes the list of blobs to a method named **Calculate**. The method returns a string variable named **output** that is the result of having iterated through all the blobs in the segment. 

	It returns the number of occurrences of the search term (**Microsoft**) in the blob passed to the **Calculate** method. 

			output += string.Format("{0} occurrences of the search term \"{1}\" were found in the file {2}.\r\n", wordCount, searchTerm, inputBlob.Name);

3.	Once the **Calculate** method has done the work, it must be written to a new blob. So for every set of blobs processed, a new blob can be written with the results. To write to a new blob, first find the output dataset. 

			// Get the output dataset using the name of the dataset matched to a name in the Activity output collection.
			Dataset outputDataset = datasets.Single(dataset => dataset.Name == activity.Outputs.Single().Name);

			// Convert to blob location object.
			outputLocation = outputDataset.Properties.TypeProperties as AzureBlobDataset;

4.	The code also calls a helper method: **GetFolderPath** to retrieve the folder path (the storage container name).
 
			folderPath = GetFolderPath(outputDataset);

	The **GetFolderPath** casts the DataSet object to an AzureBlobDataSet, which has a property named FolderPath.
			
			AzureBlobDataset blobDataset = dataArtifact.Properties.TypeProperties as AzureBlobDataset;
			
			return blobDataset.FolderPath;

5.	The code calls the **GetFileName** method to retrieve the file name (blob name). The code is similar to the above code to get the folder path. 

			AzureBlobDataset blobDataset = dataArtifact.Properties.TypeProperties as AzureBlobDataset;

			return blobDataset.FileName;

6.	The name of the file is written by creating a new URI object. The URI constructor uses the **BlobEndpoint** property to return the container name. The folder path and file name are added to construct the output blob URI.  

			// Write the name of the file. 
			Uri outputBlobUri = new Uri(outputStorageAccount.BlobEndpoint, folderPath + "/" + GetFileName(outputDataset));

7.	The name of the file has been written and now you can write the output string from the Calculate method to a new blob:

			// Create a new blob and upload the output text.
			CloudBlockBlob outputBlob = new CloudBlockBlob(outputBlobUri, outputStorageAccount.Credentials);
			logger.Write("Writing {0} to the output blob", output);
			outputBlob.UploadText(output);

## Create the data factory

In the Create the custom activity section, you created a custom activity and uploaded the zip file with binaries and the PDB file to an Azure blob container. In this section, you will create an Azure **data factory** with a **pipeline** that uses the **custom activity**.
 
The input dataset for the custom activity represents the blobs (files) in the input folder (mycontainer\inputfolder) in blob storage. The output dataset for the activity represents the output blobs in the output folder (mycontainer\outputfolder) in blob storage. 

Create a file named file.txt with the following content and upload it to mycontainer\inputfolder (mycontainer is the name of the Azure blob container and inputfolder is the name of the folder in that container.)

	test custom activity Microsoft test custom activity Microsoft

The input folder corresponds to a slice in Azure Data Factory even if the folder has 2 or more files. When each slice is processed by the pipeline, the custom activity iterates through all the blobs in the input folder for that slice. 

You will see one output file with in the mycontainer\output folder with 1 or more lines (same as number of blobs in the input folder):
 
	2 occurrences(s) of the search term "Microsoft" were found in the file inputfolder/2015-11-16-00/file.txt.


Here are the steps you will be performing in this section:

1. Create a data factory.
2. Create linked services for the HDInsight cluster on which the custom activity will run as a map-only job and the Azure Storage that holds the input/output blobs. 
2. Create input and output datasets that represent input and output of the custom activity. 
3. Create and run a pipeline that uses the custom activity.

### Step 1: Create the data factory

1.	After logging into the Azure Portal, do the following:
	1.	Click **NEW** on the left menu.
	2.	Click **Data + Analytics** in the **New** blade.
	3.	Click **Data Factory** on the **Data analytics** blade.
2.	In the **New data factory** blade, enter **CustomActivityFactory** for the Name. The name of the Azure data factory must be globally unique. If you receive the error: **Data factory name “CustomActivityFactory” is not available**, change the name of the data factory (for example, **yournameCustomActivityFactory**) and try creating again.
3.	Click **RESOURCE GROUP NAME**, and select an existing resource group or create a new resource group. 
4.	Verify that you are using the correct **subscription** and **region** where you want the data factory to be created. 
5.	Click **Create** on the **New data factory** blade.
6.	You will see the data factory being created in the **Dashboard** of the Azure Portal.
7.	After the data factory has been created successfully, you will see the Data Factory blade, which shows you the contents of the data factory.

### Step 2: Create linked services

Linked services link data stores or compute services to an Azure data factory. In this step, you will link your Azure Storage account and Azure HDInsight cluster to your data factory.

#### Create Azure Storage linked service

1.	Click the **Author and deploy** tile on the **DATA FACTORY** blade for **CustomActivityFactory**. This launches the Data Factory Editor.
2.	Click **New data store** on the command bar and choose **Azure storage**. You should see the JSON script for creating an Azure Storage linked service in the editor.
3.	Replace **account name** with the name of your Azure storage account and **account key** with the access key of the Azure storage account. To learn how to get your storage access key, see [View, copy and regenerate storage access keys](../storage/storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).
4.	Click **Deploy** on the command bar to deploy the linked service.


#### Create Azure HDInsight linked service 
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, if you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster.

> [AZURE.NOTE] At runtime, an instance of a .NET activity runs only on one worker node in the HDInsight cluster; it cannot be scaled to run on multiple nodes. Multiple instances of .NET activity can run in parallel on different nodes of the HDInsight cluster.

If you have extended the [Get started with Azure Data Factory][adfgetstarted] tutorial with the walkthrough from [Use Pig and Hive with Azure Data Factory][hivewalkthrough], you can skip creation of this linked service and use the linked service you already have in the ADFTutorialDataFactory.


##### To use an on-demand HDInsight cluster

1. In the **Azure Portal**, click **Author and Deploy** in the Data Factory home page.
2. In the Data Factory Editor, click **New compute** from the command bar and select **On-demand HDInsight cluster** from the menu.
2. Do the following in the JSON script:
	1. For the **clusterSize** property, specify the size of the HDInsight cluster.
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
			      "version": "3.2",
			      "linkedServiceName": "StorageLinkedService"
			    }
			  }
			}

2. Click **Deploy** on the command bar to deploy the linked service.

##### To use your own HDInsight cluster:

1. In the **Azure Portal**, click **Author and Deploy** in the Data Factory home page.
2. In the **Data Factory Editor**, click **New compute** from the command bar and select **HDInsight cluster** from the menu.
2. Do the following in the JSON script:
	1. For the **clusterUri** property, enter the URL for your HDInsight. For example: https://<clustername>.azurehdinsight.net/     
	2. For the **UserName** property, enter the user name who has access to the HDInsight cluster.
	3. For the **Password** property, enter the password for the user.
	4. For the **LinkedServiceName** property, enter **StorageLinkedService**. This is the linked service you had created in the Get started tutorial.

2. Click **Deploy** on the command bar to deploy the linked service.

### Step 3: Create datasets
In this step, you will create datasets to represent input and output data.

#### Create input dataset
1.	In the **Editor** for the Data Factory, click **New dataset** button on the toolbar and click **Azure Blob storage** from the drop down menu.
2.	Replace the JSON in the right pane with the following JSON snippet:

			{
			    "name": "InputDataset",
			    "properties": {
			        "type": "AzureBlob",
			        "linkedServiceName": "StorageLinkedService",
			        "typeProperties": {
			            "folderPath": "adftutorial/customactivityinput/",
			            "format": {
			                "type": "TextFormat"
			            }
			        },
			        "availability": {
			            "frequency": "Hour",
			            "interval": 1
			        },
			        "external": true,
			        "policy": {}
			    }
			}

	You will create a pipeline later in this walkthrough with start time: 2015-11-16T00:00:00Z and end time: 2015-11-16T05:00:00Z. It is scheduled to produce data hourly, so there will be 5 input/output slices (between **00**:00:00 -> **05**:00:00). 

	The **frequency** and **interval** for the input dataset is set to **Hour** and **1**, which means that the input slice is available hourly. In this sample, it is the same file (file.txt) in the intputfolder. 

	Here are the start times for each slice, which is represented by SliceStart system variable in the above JSON snippet. 

	
3.	Click **Deploy** on the toolbar to create and deploy the **InputDataset**. Confirm that you see the **TABLE CREATED SUCCESSFULLY** message on the title bar of the Editor.


#### Create an output table

1. In the **Data Factory editor**, click **New dataset**, and then click **Azure Blob storage** from the command bar.
2. Replace the JSON script in the right pane with the following JSON script:

		{
		    "name": "OutputDataset",
		    "properties": {
		        "type": "AzureBlob",
		        "linkedServiceName": "StorageLinkedService",
		        "typeProperties": {
		            "fileName": "{slice}.txt",
		            "folderPath": "adftutorial/customactivityoutput",
		            "partitionedBy": [
		                {
		                    "name": "slice",
		                    "value": {
		                        "type": "DateTime",
		                        "date": "SliceStart",
		                        "format": "yyyy-MM-dd-HH"
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

	An output blob/file is generated for each input slice. Here is how an output file is named for each slice. All the output files are generated in one output folder: **adftutorial\customactivityoutput**.

	| Slice | Start time | Output file |
	| :---- | :--------- | :---------- | 
	| 1	| 2015-11-16T00:00:00 | 2015-11-16-00.txt |
	| 2	| 2015-11-16T01:00:00 | 2015-11-16-01.txt |
	| 3	| 2015-11-16T02:00:00 | 2015-11-16-02.txt |
	| 4	| 2015-11-16T03:00:00 | 2015-11-16-03.txt |
	| 5	| 2015-11-16T04:00:00 | 2015-11-16-04.txt |

	Remember that all the files in an input folder are part of a slice with the start times mentioned above. When this slice is processed, the custom activity scans through each file and produces a line in the output file with the number of occurrences of search term (“Microsoft”). If there are three files in the inputfolder, there will be three lines in the output file for each hourly slice: 2015-11-16-00.txt, 2015-11-16:01:00:00.txt, etc.... 


2. Click **Deploy** on the command bar to deploy the **OutputDataset**.


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
		            "Name": "InputDataset"
		          }
		        ],
		        "Outputs": [
		          {
		            "Name": "OutputDataset"
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
    		"start": "2015-11-16T00:00:00Z",
			"end": "2015-11-16T05:00:00Z",
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
	- **PackageLinkedService** is set to **StorageLinkedService** that points to the blob storage that contains the custom activity zip file. If you are using different Azure Storage accounts for input/output files and the custom activity zip file, you will have to create another Azure Storage linked service. This article assumes that you are using the same Azure Storage account..
	- **PackageFile** is set to **customactivitycontainer/MyDotNetActivity.zip**. It is in the format: <containerforthezip>/<nameofthezip.zip>.
	- The custom activity takes **InputDataset** as input and **OutputDataset** as output.
	- The linkedServiceName property of the custom activity points to the **HDInsightLinkedService**, which tells Azure Data Factory that the custom activity needs to run on an Azure HDInsight cluster.
	- **isPaused** property is set to **false** by default. The pipeline runs immediately in this example because the slices start in the past. You can set this property to true to pause the pipeline and set it back to false to restart. 
	- The **start** time and **end** times are **5** hours apart and slices are produced hourly, so 5 slices are produced by the pipeline. 


4. Click **Deploy** on the command bar to deploy the pipeline.

### Monitor the pipeline
 
8. In the Data Factory blade in the Azure Portal, click **Diagram**.
	
	![Diagram tile](./media/data-factory-use-custom-activities/DataFactoryBlade.png)
 
9. In the Diagram View, now click on the OutputDataset.
 
	![Diagram view](./media/data-factory-use-custom-activities/diagram.png)

10. You should see that the 5 output slices are in the Ready state if they have already been produced.

	![Output slices](./media/data-factory-use-custom-activities/OutputSlices.png)
	
12. Verify that the output files are generated in the blob storage in the **adftutorial** container.

	![output from custom activity][image-data-factory-ouput-from-custom-activity]

9. If you open the output file, you should see the output similar to the following:

	2 occurrences(s) of the search term "Microsoft" were found in the file inputfolder/2015-11-16-00/file.txt.

10.	Use the [Azure Portal][azure-preview-portal] or Azure PowerShell cmdlets to monitor your data factory, pipelines, and data sets. You can see messages from the **ActivityLogger** in the code for the custom activity in the logs (specifically user-0.log) that you can download from the portal or using cmdlets.

	![download logs from custom activity][image-data-factory-download-logs-from-custom-activity]


See [Monitor and Manage Pipelines](data-factory-monitor-manage-pipelines.md) for detailed steps for monitoring datasets and pipelines.      

### Debug the pipeline
Debugging consists of a few basic techniques:

1.	If the input slice is not set to **Ready**, confirm that the input folder structure is correct and file.txt exists in the input folders.
2.	In the **Execute** method of your custom activity, use the **IActivityLogger** object to log information that will help you troubleshoot issues. The logged messages will show up in the user_0.log file. 

	In the **OutputDataset** blade, click on the slice to see the **DATA SLICE** blade for that slice. You will see **activity runs** for that slice. You should see one activity run for the slice. If you click Run in the command bar, you can start another activity run for the same slice. 

	When you click the activity run, you will see the **ACTIVITY RUN DETAILS** blade with a list of log files. You will see logged messages in the user_0.log file. When an error occurs, you will see three activity runs because the retry count is set to 3 in the pipeline/activity JSON. When you click the activity run, you will see the log files that you can review to troubleshoot the error. 

	In the list of log files, click the **user-0.log**. In the right panel are the results of using the **IActivityLogger.Write** method.

	You should also check **system-0.log** for any system error messages and exceptions.

3.	Include the **PDB** file in the zip file so that the error details will have information such as **call stack** when an error occurs.
4.	All the files in the zip file for the custom activity must be at the **top level** with no subfolders.
5.	Ensure that the **assemblyName** (MyDotNetActivity.dll), **entryPoint**(MyDotNetActivityNS.MyDotNetActivity), **packageFile** (customactivitycontainer/MyDotNetActivity.zip), and **packageLinkedService** (should point to the Azure blob storage that contains the zip file) are set to correct values. 
6.	If you fixed an error and want to reprocess the slice, right-click the slice in the **OutputDataset** blade and click **Run**. 


## Update the custom activity
If you update the code for the custom activity, build it, and upload the zip file that contains new binaries to the blob storage.

## <a name="AzureBatch"></a> Use Azure Batch linked service
> [AZURE.NOTE] See [Azure Batch basics][batch-technical-overview] for an overview of the Azure Batch service and see [Getting Started with the Azure Batch Library for .NET][batch-get-started] to quickly get started with the Azure Batch service.

You can run your custom .NET activities using Azure Batch as a compute resource. You will have to create your own Azure Batch pools and specify the number of VMs along with other configurations. Azure Batch pools provides the following features to customers:

1. Create pools containing a single core to thousands of cores.
2. Auto scale VM count based on a formula
3. Support VMs of any size
4. Configurable number of tasks per VM
5. Queue unlimited number of tasks


Here are the high-level steps for using the Azure Batch Linked Service in the walkthrough described in the previous section:

1. Create an Azure Batch account using the [Azure Portal](http://manage.windowsazure.com). See [Create and manage an Azure Batch account][batch-create-account] article for instructions. Note down the Azure Batch account name and account key.

	You can also use [New-AzureBatchAccount][new-azure-batch-account] cmdlet to create an Azure Batch account. See [Using Azure PowerShell to Manage Azure Batch Account][azure-batch-blog] for detailed instructions on using this cmdlet.
2. Create an Azure Batch pool. You can download the source code for the [Azure Batch Explorer tool][batch-explorer], compile, and use it  (or) use [Azure Batch Library for .NET][batch-net-library] to create a Azure Batch pool. See [Azure Batch Explorer Sample Walkthrough][batch-explorer-walkthrough] for step-by-step instructions for using the Azure Batch Explorer.

	You can also use [New-AzureRmBatchPool](https://msdn.microsoft.com/library/mt628690.aspx) cmdlet to create an Azure Batch pool.

	You may want to create the Azure Batch pool with at least 2 compute nodes so that slices are processed in parallel. If you are using Batch Explorer:  

	- Enter an ID for the pool (**Pool ID**). Note the **ID of the pool**; you will need it when creating the Data Factory solution. 
	- Specify **Windows Server 2012 R2** for the Operating System Family setting.
	- Specify **2** as value for the **Max tasks per compute node** setting.
	- Specify **2** as value for the **Number of Target Dedicated** setting. 

	The Data Factory service creates a job in Azure Batch with the name: adf-<pool name>:job-xxx. A task is created for each activity run  of a slice. If there are 10 slices ready to be processed, 10 tasks are created in this job. You can have more than one slice running in parallel if you have multiple compute nodes in the pool. You can also have more than one slice running on the same compute if the maximum tasks per compute node is set to > 1. 
	
	![Batch Explorer tasks](./media/data-factory-use-custom-activities/BatchExplorerTasks.png)

	![Data Factory & Batch](./media/data-factory-use-custom-activities/DataFactoryAndBatch.png)

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
[batch-create-account]: ../batch/batch-account-create-portal.md
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
