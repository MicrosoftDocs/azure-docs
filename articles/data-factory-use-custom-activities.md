<properties title="Use custom activities in an Azure Data Factory pipeline" pageTitle="Use custom activities in an Azure Data Factory pipeline" description="Learn how to create custom activities and use them in an Azure Data Factory pipeline." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/04/2014" ms.author="spelluru" />

# Use custom activities in an Azure Data Factory pipeline
Azure Data Factory supports built-in activities such as **Copy Activity** and **HDInsight Activity** to be used in pipelines to move and process data. You can also create a custom activity with your own transformation/processing logic and use the activity in a pipeline. The custom activity runs as a map-only job on an HDInsight cluster, so you will need to link an HDInsight cluster for the custom activity in your pipeline.
 
This article describes how to create a custom activity and use it in an Azure Data Factory pipeline. It also provides a detailed walkthrough with step-by-step instructions for creating and using a custom activity.

## Creating a custom activity

To create a custom activity:
 
1.	Create a **Class Library** project in Visual Studio 2013.
2.	Download [NuGet package for Azure Data Factory][nuget-package] and Install it. Instructions for installing are in the walkthrough.
3. Add the following using statements at the top of the source file in the class library.
	
		using Microsoft.Azure.Management.DataFactories.Models;
		using Microsoft.DataFactories.Runtime; 

4. Update the class to implement the **IDotNetActivity** interface.
	<ol type='a'>
		<li>
			Derive the class from <b>IDotNetActivity</b>.
			<br/>
			Example: <br/>
			public class <b>MyDotNetActivity : IDotNetActivity</b>
		</li>

		<li>
			Implement the <b>Execute</b> method of <b>IDotNetActivity</b> interface
		</li>

	</ol>
5. Compile the project.


## Use the custom activity in a pipeline
To use the custom activity in a pipeline:

1.	**Zip up** all the binary files from the **bin\debug** or **bin\release** output folders for the project. 
2.	**Upload the zip** file as a blob to your **Azure blob storage**. 
3.	Update the **pipeline JSON** file to refer to the zip file, custom activity DLL, the activity class, and the blob that contains the zip file in the pipeline JSON. In the JSON file:
	<ol type ="a">
		<li><b>Activity type</b> should be set to <b>DotNetActivity</b>.</li>
		<li><b>AssemblyName</b> is the name of the output DLL from the Visual Studio project.</li>
		<li><b>EntryPoint</b> specifies the <b>namespace</b> and <b>name</b> of the <b>class</b> that implements the <b>IDotNetActivity</b> interface.</li>
		<li><b>PackageLinkedService</b> is the linked service that refers to the blob that contains the zip file. </li>
		<li><b>PackageFile</b> specifies the location and name of the zip file that was uploaded to the Azure blob storage.</li>
		<li><b>LinkedServiceName</b> is the name of the linked service that links an HDInsight cluster (on-demand or your own) to a data factory. The custom activity runs as a map-only job the specified HDInsight cluster.</li>
	</ol>

	

	**Partial JSON example**

		"Name": "MyDotNetActivity",
    	"Type": "DotNetActivity",
    	"Inputs": [{"Name": "EmpTableFromBlob"}],
    	"Outputs": [{"Name": "OutputTableForCustom"}],
		"LinkedServiceName": "myhdinsightcluster",
    	"Transformation":
    	{
	    	"AssemblyName": "MyDotNetActivity.dll",
    	    "EntryPoint": "MyDotNetActivityNS.MyDotNetActivity",
    	    "PackageLinkedService": "MyBlobStore",
    	    "PackageFile": "customactivitycontainer/MyDotNetActivity.zip",

## To update custom activity
If you update the code for the custom activity, build it, and upload the zip file that contains new binaries to the blob storage. 

## Walkthrough
This Walkthrough provides you with step-by-step instructions for creating a custom activity and using the activity in an Azure Data Factory pipeline. This walkthrough extends the tutorial from the [Get started with Azure Data Factory][adfgetstarted]. If you want to see the custom activity working, you need to go through the Get started tutorial first and then do this walkthrough. 

**Prerequisites:**


- Tutorial from [Get started with Azure Data Factory][adfgetstarted]. You must complete the tutorial from this article before continuing further with this walkthrough.
- Visual Studio 2012 or 2013
- Download and install [Windows Azure .NET SDK][azure-developer-center]
- Download [NuGet packages for Azure Data Factory][nuget-package].
- Download and install NuGet package for Azure Storage. Instructions are in the walkthrough, so you can skip this step.

### Step 1: Create a custom activity

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

		Install-Package Microsoft.Azure.Management.DataFactories –Pre

3.	In the <b>Package Manager Console</b>, execute the following command to import  <b>Microsoft.DataFactories.Runtime</b>. Replace the folder with the location that contains the downloaded Data Factory NuGet package.

		Install-Package Microsoft.DataFactories.Runtime –Pre

4. Import the Windows Azure Storage NuGet package in to the project.

		Install-Package WindowsAzure.Storage

5. Add the following **using** statements to the source file in the project.

		using System.IO;
		using System.Globalization;
		using System.Diagnostics;
	
		using Microsoft.Azure.Management.DataFactories.Models;
		using Microsoft.DataFactories.Runtime; 
	
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
  
6. Change the name of the **namespace** to **MyDotNetActivityNS**.

		namespace MyDotNetActivityNS

7. Change the name of the class to **MyDotNetActivity** and derive it from the **IDotNetActivity** interface as shown below.

		public class MyDotNetActivity : IDotNetActivity

8. Implement (Add) the **Execute** method of the **IDotNetActivity** interface to the **MyDotNetActivity** class and copy the following sample code to the method. 

	The **inputTables** and **outputTables** parameters represent input and output tables for the activity as the names suggest. You can see messages you log using the **logger** object in the log file that you can download from the Azure portal or using cmdlets. The **extendedProperties** dictionary contains list of extended properties you specify in the JSON file for the activity and their values. 

	The following sample code counts the number of lines in the input blob and produces the following content in the output blob: path to the blob, number of lines in the blob, the machine on which the activity ran, current date-time.

        public IDictionary<string, string> Execute(
                    IEnumerable<ResolvedTable> inputTables, 
                    IEnumerable<ResolvedTable> outputTables, 
                    IDictionary<string, string> extendedProperties, 
                    IActivityLogger logger)
        {
            string output = string.Empty;

            logger.Write(TraceEventType.Information, "Before anything...");

            logger.Write(TraceEventType.Information, "Printing dictionary entities if any...");
            foreach (KeyValuePair<string, string> entry in extendedProperties)
            {
                logger.Write(TraceEventType.Information, "<key:{0}> <value:{1}>", entry.Key, entry.Value);
            }

            foreach (ResolvedTable inputTable in inputTables)
            {
                string connectionString = GetConnectionString(inputTable.LinkedService);
                string folderPath = GetFolderPath(inputTable.Table);

                if (String.IsNullOrEmpty(connectionString) ||
                    String.IsNullOrEmpty(folderPath))
                {
                    continue;
                }

                logger.Write(TraceEventType.Information, "Reading blob from: {0}", folderPath);

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
                                        logger.Write(TraceEventType.Information, "First line: [{0}]", line);
                                    }
                                    count++;
                                }

                            }

                        }
                        output += string.Format(CultureInfo.InvariantCulture, 
										"{0},{1},{2},{3}\n", 
										folderPath, 
										count, 
										Environment.MachineName, 
										DateTime.UtcNow);
                    }
                    continuationToken = result.ContinuationToken;

                } while (continuationToken != null);
            }

            foreach (ResolvedTable outputTable in outputTables)
            {
                string connectionString = GetConnectionString(outputTable.LinkedService);
                string folderPath = GetFolderPath(outputTable.Table);

                if (String.IsNullOrEmpty(connectionString) ||
                    String.IsNullOrEmpty(folderPath))
                {
                    continue;
                }

                logger.Write(TraceEventType.Information, "Writing blob to: {0}", folderPath);

                CloudStorageAccount outputStorageAccount = CloudStorageAccount.Parse(connectionString);
                Uri outputBlobUri = new Uri(outputStorageAccount.BlobEndpoint, folderPath + "/" + Guid.NewGuid() + ".csv");

                CloudBlockBlob outputBlob = new CloudBlockBlob(outputBlobUri, outputStorageAccount.Credentials);
                outputBlob.UploadText(output);

            }
            return new Dictionary<string, string>();

        }

9. Add the following helper methods. The **Execute** method invokes these helper methods. The **GetConnectionString** method retrieves the Azure Storage connection string and the **GetFolderPath** method retrieves the blob location. 


        private static string GetConnectionString(LinkedService asset)
        {
            AzureStorageLinkedService storageAsset;
            if (asset == null)
            {
                return null;
            }

            storageAsset = asset.Properties as AzureStorageLinkedService;
            if (storageAsset == null)
            {
                return null;
            }

            return storageAsset.ConnectionString;
        }

        private static string GetFolderPath(Table dataArtifact)
        {
            AzureBlobLocation blobLocation;
            if (dataArtifact == null || dataArtifact.Properties == null)
            {
                return null;
            }

            blobLocation = dataArtifact.Properties.Location as AzureBlobLocation;
            if (blobLocation == null)
            {
                return null;
            }

            return blobLocation.FolderPath;
        }
   


10. Compile the project. Click **Build** from the menu and click **Build Solution**.
11. Launch **Windows Explorer**, and navigate to **bin\debug** or **bin\release** folder depending type of build.
12. Create a zip file **MyDotNetActivity.zip** that contain all the binaries in the <project folder>\bin\Debug folder.
13. Upload **MyDotNetActivity.zip** as a blob to the blob container: **customactvitycontainer** in the Azure blob storage that the **MyBlobStore** linked service in the **ADFTutorialDataFactory** uses.  Create the blob container **blobcustomactivitycontainer** if it does not already exist. 

### Create a linked service for  HDInsight cluster that will be used to run the custom activity
The Azure Data Factory service supports creation of an on-demand cluster and use it to process input to produce output data. You can also use your own cluster to perform the same. When you use on-demand HDInsight cluster, a cluster gets created for each slice. Whereas, if you use your own HDInsight cluster, the cluster is ready to process the slice immediately. Therefore, when you use on-demand cluster, you may not see the output data as quickly as when you use your own cluster. For the purpose of the sample, let's use an on-demand cluster. 

> [AZURE.NOTE] If you have extended the [Get started with Azure Data Factory][adfgetstarted] tutorial with the walkthrough from [Use Pig and Hive with Azure Data Factory][hivewalkthrough], you can skip creation of this linked service and use the linked service you already have in the ADFTutorialDataFactory. 

#### To use an on-demand HDInsight cluster

1. Create a JSON file named **HDInsightOnDemandCluster.json** with the following content and save it to **C:\ADFGetStarted\Custom** folder.


		{
    		"name": "HDInsightOnDemandCluster",
    		"properties": 
    		{
        		"type": "HDInsightOnDemandLinkedService",
				"clusterSize": 4,
        		"timeToLive": "00:05:00",
        		"linkedServiceName": "MyBlobStore"
    		}
		}

2. Launch **Azure PowerShell** and execute the following command to switch to the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode.

         switch-azuremode AzureResourceManager
		

3. Switch to **C:\ADFGetstarted\Custom** folder.
4. Execute the following command to create the linked service for the on-demand HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\HDInsightOnDemandCluster.json
  
   
#### To use your own HDInsight cluster: 

1. Create a JSON file named **MyHDInsightCluster.json** with the following content and save it to **C:\ADFGetStarted\Custom** folder. Replace clustername, username, and password with appropriate values before saving the JSON file.  

		{
   			"Name": "MyHDInsightCluster",
    		"Properties": 
			{
        		"Type": "HDInsightBYOCLinkedService",
	        	"ClusterUri": "https://<clustername>.azurehdinsight.net/",
    	    	"UserName": "<username>",
    	    	"Password": "<password>",
    	    	"LinkedServiceName": "MyBlobStore"
    		}
		}

2. Launch **Azure PowerShell** and execute the following command to switch to the **AzureResourceManager** mode.The Azure Data Factory cmdlets are available in the **AzureResourceManager** mode.

         switch-azuremode AzureResourceManager
		

3. Switch to **C:\ADFGetstarted\Custom** folder.
4. Execute the following command to create the linked service for the on-demand HDInsight cluster.
 
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -File .\MyHDInsightCluster.json



### Step 2: Use the custom activity in a pipeline
Let’s extend the tutorial from [Get started with Azure Data Factory][adfgetstarted] to create another pipeline to test this custom activity.

#### Create a linked service for the HDInsight cluster to be used for running custom activity


1.	Create a JSON for the pipeline as shown in the following example and save it as **ADFTutorialPipelineCustom.json** in **C:\ADFGetStarted\Custom** folder. Change the name of **LinkedServiceName** to the name of the HDInsight cluster (**HDInsightOnDemandCluster** or **MyHDInsightCluster**)


		{
    		"name": "ADFTutorialPipelineCustom",
    		"properties":
    		{
        		"description" : "Use custom activity",
        		"activities":
        		[
					{
                		"Name": "MyDotNetActivity",
                     	"Type": "DotNetActivity",
                     	"Inputs": [{"Name": "EmpTableFromBlob"}],
                     	"Outputs": [{"Name": "OutputTableForCustom"}],
						"LinkedServiceName": "MyHDInsightCluster",
                     	"Transformation":
                     	{
                        	"AssemblyName": "MyDotNetActivity.dll",
                            "EntryPoint": "MyDotNetActivityNS.MyDotNetActivity",
                            "PackageLinkedService": "MyBlobStore",
                            "PackageFile": "customactivitycontainer/MyDotNetActivity.zip",
                            "ExtendedProperties":
							{
								"SliceStart": "$$Text.Format('{0:yyyyMMddHH-mm}', Time.AddMinutes(SliceStart, 0))"
							}
                      	},
                        "Policy":
                        {
                        	"Concurrency": 1,
                            "ExecutionPriorityOrder": "OldestFirst",
                            "Retry": 3,
                            "Timeout": "00:30:00",
                            "Delay": "00:00:00"		
						}
					}
				]
			}
		}

	Note the following: 

	- There is one activity in the activities section and it is of type: **DotNetActivity**.
	- Use the same input table **EmpTableFromBlob** that you used in the Get started tutorial.
	- Use a new output table **OutputTableForCustom** that you will create in the next step.
	- **AssemblyName** is set to the name of the DLL: **MyActivities.dll**.
	- **EntryPoint** is set to **MyDotNetActivityNS.MyDotNetActivity**.
	- **PackageLinkedService** is set to **MyBlobStore** that was created as part of the tutorial from [Get started with Azure Data Factory][adfgetstarted]. This blob store contains the custom activity zip file.
	- **PackageFile** is set to **customactivitycontainer/MyDotNetActivity.zip**.
     

4. Create a JSON file for the output table (**OutputTableForCustom** referred by the pipeline JSON) and save it as C:\ADFGetStarted\Custom\OutputTableForCustom.json.

		

		{
    		"name": "OutputTableForCustom",
    		"properties":
    		{
        		"location": 
        		{
					"type": "AzureBlobLocation",
					"folderPath": "adftutorial/customactivityoutput/{Slice}",
					"partitionedBy": [ { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } }],

					"linkedServiceName": "MyBlobStore"
        		},
        		"availability": 
        		{
            		"frequency": "hour",
            		"interval": 1
        		}   
    		}
		}

 	Output location is **adftutorial/customactivityoutput/YYYYMMDDHH/** where YYYYMMDDHH is the year, month, date, and hour of the slice being produced. See [Developer Reference][adf-developer-reference] for details. 

5. Run the following command to **create the output table** in the **ADFTutorialDataFactory**.
		
		

		New-AzureDataFactoryTable  -DataFactoryName ADFTutorialDataFactory –File C:\ADFGetStarted\Custom\OutputTableForCustom.json -ResourceGroupName ADFTutorialResourceGroup


6. Now, run the following command to **create the pipeline**. You had created the pipeline JSON file in an earlier step.

		New-AzureDataFactoryPipeline  -DataFactoryName ADFTutorialDataFactory -File C:\ADFGetStarted\Custom\ADFTutorialPipelineCustom.json -ResourceGroupName ADFTutorialResourceGroup



7. Execute the following PowerShell command to **set active period** on the pipeline you created.

		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-09-29 –EndDateTime 2014-09-30 –Name ADFTutorialPipelineCustom

	> [AZURE.NOTE] Replace **StartDateTime** value with the current day and **EndDateTime** value with the next day. Both StartDateTime and EndDateTime are UTC times and must be in [ISO format](http://en.wikipedia.org/wiki/ISO_8601). For example: 2014-10-14T16:32:41Z. The **EndDateTime** is optional, but we will use it in this tutorial. 
	> If you do not specify **EndDateTime**, it is calculated as "**StartDateTime + 48 hours**". To run the pipeline indefinitely, specify **9/9/9999** as the **EndDateTime**.



8. Verify that the output files are generated in the blob storage in the **adftutorial** container.

	![output from custom activity][image-data-factory-ouput-from-custom-activity]

9. If you open the output file, you should see the output similar to the following:
	
	adftutorial/input,2,WORKERNODE0,10/07/2014 18:34:33 

	(blob location), (number of lines in the blob), (node on which the activity ran), (date time stamp)

10.	Use the [Azure Portal][azure-preview-portal] or Azure PowerShell cmdlets to monitor your data factory, pipelines, and data sets. You can see messages from the **ActivityLogger** in the code for the custom activity in the logs you can download from the portal or using cmdlets.

	![download logs from custom activity][image-data-factory-download-logs-from-custom-activity]
   
See [Get started with Azure Data Factory][adfgetstarted] for detailed steps for monitoring datasets and pipelines.      
    
## See Also

Article | Description
------ | ---------------
[Enable your pipelines to work with on-premises data][use-onpremises-datasources] | This article has a walkthrough that shows how to copy data from an on-premises SQL Server database to an Azure blob.
[Use Pig and Hive with Data Factory][use-pig-and-hive-with-data-factory] | This article has a walkthrough that shows how to use HDInsight Activity to run a hive/pig script to process input data to produce output data. 
[Tutorial: Move and process log files using Data Factory][adf-tutorial] | This article provides an end-to-end walkthrough that shows how to implement a near real world scenario using Azure Data Factory to transform data from log files into insights.
[Use custom activities in a Data Factory][use-custom-activities] | This article provides a walkthrough with step-by-step instructions for creating a custom activity and using it in a pipeline. 
[Monitor and Manage Azure Data Factory using PowerShell][monitor-manage-using-powershell] | This article describes how to monitor an Azure Data Factory using Azure PowerShell cmdlets. You can try out the examples in the article on the ADFTutorialDataFactory.
[Troubleshoot Data Factory issues][troubleshoot] | This article describes how to troubleshoot Azure Data Factory issue. You can try the walkthrough in this article on the ADFTutorialDataFactory by introducing an error (deleting table in the Azure SQL Database). 
[Azure Data Factory Developer Reference][developer-reference] | The Developer Reference has the comprehensive reference content for cmdlets, JSON script, functions, etc… 


[monitor-manage-using-powershell]: ../data-factory-monitor-manage-using-powershell
[use-onpremises-datasources]: ../data-factory-use-onpremises-datasources
[adf-tutorial]: ../data-factory-tutorial
[use-custom-activities]: ../data-factory-use-custom-activities
[use-pig-and-hive-with-data-factory]: ../data-factory-pig-hive-activities
[troubleshoot]: ../data-factory-troubleshoot
[data-factory-introduction]: ../data-factory-introduction


[developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[cmdlet-reference]: http://go.microsoft.com/fwlink/?LinkId=517456




[nuget-package]: http://go.microsoft.com/fwlink/?LinkId=517478
[azure-developer-center]: http://azure.microsoft.com/en-us/develop/net/
[adf-developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[azure-preview-portal]: https://portal.azure.com/

[adfgetstarted]: ../data-factory-get-started
[hivewalkthrough]: ../data-factory-pig-hive-activities

[image-data-factory-ouput-from-custom-activity]: ./media/data-factory-use-custom-activities/OutputFilesFromCustomActivity.png

[image-data-factory-download-logs-from-custom-activity]: ./media/data-factory-use-custom-activities/DownloadLogsFromCustomActivity.png
