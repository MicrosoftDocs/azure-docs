<properties title="Use custom activities in an Azure Data Factory pipeline" pageTitle="Use custom activities in an Azure Data Factory pipeline" description="Learn how to create custom activities and use them in an Azure Data Factory pipeline." metaKeywords=""  services="data-factory" solutions=""  documentationCenter="" authors="spelluru" manager="jhubbard" editor="monicar" />

<tags ms.service="data-factory" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="spelluru" />

# Use custom activities in an Azure Data Factory pipeline
Azure Data Factory supports built-in activities such as Copy Activity and HDInsight Activity to be used in pipelines to move and process data. You can also create a custom activity with your own transformation/processing logic and use the activity in a pipeline. The custom activity runs as a map-only job on an HDInsight cluster, so you will need to link an HDInsight cluster for the custom activity in your pipeline.
 
This article describes how to create a custom activity and use it in an Azure Data Factory pipeline. It also provides a detailed walkthrough with step-by-step instructions for creating and using a custom activity.

## Creating a custom activity

To create a custom activity:
 
1.	Create a **Class Library** project in Visual Studio 2013.
2.	Download [NuGet package for Azure Data Factory][nuget-package] and Install it. Instructions for installing are in the walkthrough.
3. Add the following using statements at the top of the source file in the class library.
	
		using Microsoft.Azure.Management.DataFactories.Models;
		using Microsoft.DataFactories.ActivitySdk; 

4. Update the class to implement the **ICustomActivity** interface.
	<ol type='a'>
		<li>
			Derive the class from <b>ICustomActivity</b>.
			<br/>
			Example: <br/>
			public class MyCustomActivity : ICustomActivity
		</li>

		<li>
			Implement the <b>Execute</b> method of <b>ICustomActivity</b> interface
		</li>

	</ol>
5. Compile the project.


## Use the custom activity in a pipeline
To use the custom activity in a pipeline:

1.	Zip up all the binary files from the **bin\debug** or **bin\release** output folders for the project. 
2.	Upload the zip file as a blob to your Azure blob storage. 
3.	Update the pipeline JSON file to refer to the zip file, custom activity DLL, the activity class, and the blob that contains the zip file in the pipeline JSON. In the JSON file:
	<ol type ="a">
		<li><b>Activity type</b> should be set to <b>CustomActivity</b>.</li>
		<li><b>AssemblyName</b> is the name of the output DLL from the Visual Studio project.</li>
		<li><b>EntryPoint</b> specifies the <b>namespace</b> and <b>name</b> of the <b>class</b> that implements the ICustomActivity interface. In the above example, MyCustomActivityNS is the namespace and MyCustomActivity is the class name.</li>
		<li><b>PackageLinkedService</b> is the linked service that refers to the blob that contains the zip file. <b>PackageFile</b> is the name and location of the zip file. In the above example MyCustomActivity.zip is in the blob container customactivitycontainer.</li>
		<li>The custom activity runs as a map-only job on your HDInsight cluster so the <b>LinkedServiceName</b> property for the custom activity is required to know where to schedule the job.</li>
	</ol>

	

	**Partial JSON example**

		"Name": "MyCustomActivity",
    	"Type": "CustomActivity",
    	"Inputs": [{"Name": "EmpTableFromBlob"}],
    	"Outputs": [{"Name": "OutputTableForCustom"}],
		"LinkedServiceName": "myhdinsightcluster",
    	"Transformation":
    	{
	    	"AssemblyName": "MyCustomActivity.dll",
    	    "EntryPoint": "MyCustomActivityNS.MyCustomActivity",
    	    "PackageLinkedService": "myblobstore",
    	    "PackageFile": "customactivitycontainer/MyCustomActivity.zip",

## To update custom activity
If you update the code for the custom activity, build it, and upload the zip file that contains new binaries to the blob storage, you need to override the existing pipeline that uses the custom activity by running the New-AzureDataFactoryPipeline. When you create a pipeline that uses the custom activity, the zip file is copied from the blob storage you specified to an Azure Data Factory container on the blob storage attached to the HDInsight cluster. This is done only at the creation of the pipeline. Therefore, you need to recreate the pipeline when you update the custom activity. 

The following Walkthrough provides you with step-by-step instructions for creating a custom activity and using the activity in an Azure Data Factory pipeline. This walkthrough extends the tutorial from the [Get started with Azure Data Factory][adfgetstarted]. If you want to see the custom activity working, you need to go through the Get started tutorial first and then do this walkthrough. 

## Walkthrough
**Prerequisites:**


- Tutorial from [Get started with Azure Data Factory][adfgetstarted]
- Visual Studio 2012 or 2013
- Download and install [Windows Azure .NET SDK][azure-developer-center]
- Download [NuGet package for Azure Data Factory][nuget-package].
- Download and install NuGet package for Azure Storage. Instructions are in the walkthrough, so you can skip this step.

### Step 1: Create a custom activity

1.	Create a .NET Class Library project.
	<ol type="a">
		<li>Launch <b>Visual Studio 2012</b> or <b>Visual Studio 2013</b>.</li>
		<li>Click <b>File</b>, point to <b>New</b>, and click <b>Project</b>.</li> 
		<li>Expand <b>Templates</b>, and select <b>Visual C#</b>. In this walkthrough, you use C#, but you can use any .NET language to develop the custom activity.</li> 
		<li>Select <b>Class Library</b> from the list of project types on the right.</li>
		<li>Enter <b>MyCustomActivity</b> for the <b>Name</b>.</li> 
		<li>Select <b>C:\ADFGetStarted</b> for the <b>Location</b>.</li>
		<li>Click <b>OK</b> to create the project.</li>
	</ol>
2.  Click <b>Tools</b>, point to <b>NuGet Package Manager</b>, and click <b>Package Manager Console</b>.
3.	In the <b>Package Manager Console</b>, execute the following command to import the <b>Azure Data Factory NuGet package</b> you downloaded earlier. Replace the folder to the location that contains the downloaded Data Factory NuGet package.

		Install-Package Microsoft.Azure.Management.DataFactories -Source d:\packages –Pre

4. Import the Windows Azure Storage NuGet package in to the project.

		Install-Package WindowsAzure.Storage

5. Add the following **using** statements to the source file in the project.

		using System.IO;
		using System.Globalization;
	
		using Microsoft.Azure.Management.DataFactories.Models;
		using Microsoft.DataFactories.ActivitySdk; 
	
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
  
6. Change the name of the **namespace** to **MyCustomActivityNS**.

		namespace MyCustomActivityNS

7. Change the name of the class to **MyCustomActivity** and derive it from the **ICustomActivity** interface as shown below.

		public class MyCustomActivity : ICustomActivity

8. Implement (Add) the **Execute** method of the **ICustomActivity** interface to the **MyCustomActivity** class and copy the following sample code to the method. 

	The inputTables and outputTables parameters represent input and output tables for the activity as the name suggests. You can see messages you log using the logger object in the log file that you can download from the Azure portal or using cmdlets. The extendedproperties dictionary contains list of extended properties you specify in the JSON file for the activity and their values. 

	The following sample code counts the number of lines in the input blob and produces the following content in the output blob: “<path to the blob>, <number of lines in the blob>, <the machine on which the activity ran>, current date-time”.
 
        public IDictionary<string, string> Execute(
                    IEnumerable<ResolvedTable> inputTables, 
                    IEnumerable<ResolvedTable> outputTables, 
                    IDictionary<string, string> extendedproperties, 
                    IActivityLogger logger)
        {
            string output = string.Empty;

            logger.Write(TraceEventType.Information, "Before anything...");

            logger.Write(TraceEventType.Information, "Printing dictionary entities if any...");
            foreach (KeyValuePair<string, string> entry in extendedproperties)
            {
                logger.Write(TraceEventType.Information, "<key:{0}> <value:{1}>", entry.Key, entry.Value);
            }

            foreach (ResolvedTable inputTable in inputTables)
            {
                string connectionString = GetConnectionString(inputTable.LinkedService);
                string blobPath = GetBlobPath(inputTable.Table);

                if (String.IsNullOrEmpty(connectionString) ||
                    String.IsNullOrEmpty(blobPath))
                {
                    continue;
                }

                logger.Write(TraceEventType.Information, "Reading blob from: {0}", blobPath);

                CloudStorageAccount inputStorageAccount = CloudStorageAccount.Parse(connectionString);
                CloudBlobClient inputClient = inputStorageAccount.CreateCloudBlobClient();

                BlobContinuationToken continuationToken = null;

                do
                {
                    BlobResultSegment result = inputClient.ListBlobsSegmented(blobPath, 
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
										blobPath, 
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
                string blobPath = GetBlobPath(outputTable.Table);

                if (String.IsNullOrEmpty(connectionString) ||
                    String.IsNullOrEmpty(blobPath))
                {
                    continue;
                }

                logger.Write(TraceEventType.Information, "Writing blob to: {0}", blobPath);

                CloudStorageAccount outputStorageAccount = CloudStorageAccount.Parse(connectionString);
                Uri outputBlobUri = new Uri(outputStorageAccount.BlobEndpoint, blobPath + "/" + Guid.NewGuid() + ".csv");

                CloudBlockBlob outputBlob = new CloudBlockBlob(outputBlobUri, outputStorageAccount.Credentials);
                outputBlob.UploadText(output);

            }
            return new Dictionary<string, string>();

        }

9. Add the following helper methods. The **Execute** method invokes these helper methods. The **GetConnectionString** method retrieves the Azure Storage connection string and the **GetBlobPath** method retrieves the blob location. 


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

        private static string GetBlobPath(Table dataArtifact)
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

            return blobLocation.BlobPath;
        }
   


10. Compile the project. Click **Build** from the menu and click **Build Solution**.
11. Launch **Windows Explorer**, and navigate to **bin\debug** or **bin\release** folder depending type of build.
12. Create a zip file **MyCustomActivity.zip** that contain all the binaries in the <project folder>\bin\Debug folder.
	![zip output binaries][image-data-factory-zip-output-binaries]
13. Upload **MyCustomActivity.zip** as a blob to your blob storage. In the following example, the zip file is uploaded as a blob to the blob container: blobcustomactivitycontainer.
    ![upload zip to blob][image-data-factory-upload-zip-to-blob]


### Step 2: Use the custom activity in a pipeline
Let’s extend the tutorial from [Get started with Azure Data Factory][adfgetstarted] to create another pipeline to test this custom activity.

1.	Create a JSON for the pipeline as shown in the following example and save it as C:\ADFGetStarted\ADFTutorialPipelineCustom.json.


		{
    		"name": "ADFTutorialPipelineCustom",
    		"properties":
    		{
        		"description" : "Use custom activity",
        		"activities":
        		[
					{
                		"Name": "MyCustomActivity",
                     	"Type": "CustomActivity",
                     	"Inputs": [{"Name": "EmpTableFromBlob"}],
                     	"Outputs": [{"Name": "OutputTableForCustom"}],
						"LinkedServiceName": "myhdinsightcluster",
                     	"Transformation":
                     	{
                        	"AssemblyName": "MyCustomActivity.dll",
                            "EntryPoint": "MyCustomActivityNS.MyCustomActivity",
                            "PackageLinkedService": "myblobstore",
                            "PackageFile": "customactivitycontainer/MyCustomActivity.zip",
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
					},
				]
			}
		}

	Note the following: 

	- There is one activity in the activities section and it is of type: **CustomActivity**.
	- Use the same input table **EmpTableFromBlob** that you used in the Get started tutorial.
	- Use a new output table **OutputTableForCustom** that you will create in the next step.
	- **AssemblyName** is set to the name of the DLL: **MyActivities.dll**.
	- **EntryPoint** is set to **MyCustomActivityNS.MyCustomActivity**.
	- **PackageLinkedService** is set to **myblobstore** that was created as part of the tutorial from [Get started with Azure Data Factory][adfgetstarted].
	- **PackageFile** is set to **customactivitycontainer/MyCustomActivity.zip**.
     
2. The custom activity runs as a map-only job on your HDI cluster so the **LinkedServiceName** property is required for us to know where to schedule the job. Create a linked service to your HDI cluster if you haven’t created already: Create a JSON file with the following content and save it as **c:\ADFGetStarted\myhdinsightcluster.json**.

		
		{
    		Name: "myhdinsightcluster",
			Properties: 
			{
				"Type": "HDInsightBYOCLinkedService",
				"ClusterUri": "https://<HDIClusterName.azurehdinsight.net/",
				"UserName": "username",
				"Password": "Password",
				"LinkedServiceName": "myblobstore"
    		}
		} 

3. Run the following command to **create the HDInsight linked service**.

		
		New-AzureDataFactoryLinkedService -ResourceGroupName ADFTutorialResourceGroup -Name myhdinsightcluster -DataFactoryName ADFTutorialDataFactory -File c:\ADFGetStarted\myhdinsightcluster.json

4. Create a JSON file for the output table (**OutputTableForCustom** referred by the pipeline JSON) and save it as C:\ADFGetStarted\OutputTableForCustom.json.

		

		{
			"name": "OutputTableForCustom",
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
          			"blobPath": "$$Text.Format('adftutorial/output/{0:yyyyMMdd-HH}', SliceStart)",
            		"format":
            		{
              			"type": "TextFormat",
                     	"columnDelimiter": ",",
					},
 					"linkedServiceName": "myblobstore"
				},
				"availability": 
				{
					"frequency": "hour",
					"interval": 1,
				}	
			}
		}

 	Output location is **adftutorial/output/<start-time-of-the-slice>**. See [Developer Reference][adf-developer-reference] for details. 

5. Run the following command to **create the output table** in the **ADFTutorialDataFactory**.
		
		

		New-AzureDataFactoryTable  -DataFactoryName ADFTutorialDataFactory –File C:\ADFGetStarted\OutputTableForCustom.json -ResourceGroupName ADFTutorialResourceGroup


6. Now, run the following command to **create the pipeline**. You had created the pipeline JSON file in an earlier step.

		New-AzureDataFactoryPipeline  -DataFactoryName ADFTutorialDataFactory -File C:\ADFGetStarted\CustomActivity\ADFTutorialPipelineCustom.json -ResourceGroupName ADFTutorialResourceGroup



7. Execute the following PowerShell command to **set active period** on the pipeline you created.

		Set-AzureDataFactoryPipelineActivePeriod -ResourceGroupName ADFTutorialResourceGroup -DataFactoryName ADFTutorialDataFactory -StartDateTime 2014-09-29 –EndDateTime 2014-09-30 –Name ADFTutorialPipelineCustom

	[WACOM.NOTE] Replace StartDateTime value with the current day and EndDateTime value with the next day. The EndDateTime is optional

8. Verify that the output files are generated in the blob storage in the **adftutorial** container.

	![output from custom activity][image-data-factory-ouput-from-custom-activity]

9. If you open the output file, you should see the output similar to the following:
	
	adftutorial/input,2,WORKERNODE0,10/07/2014 18:34:33 

	(blob location), (number of lines in the blob), (node on which the activity ran), (date time stamp)

10.	Use the [Azure Portal][azure-preview-portal] or Azure PowerShell cmdlets to monitor your data factory, pipelines, and data sets. You can see messages from the **ActivityLogger** in the code for the custom activity in the logs you can download from the portal or using cmdlets.

	![download logs from custom activity][image-data-factory-download-logs-from-custom-activity]
   
See [Get started with Azure Data Factory][adfgetstarted] for detailed steps for monitoring datasets and pipelines.      
    






[nuget-package]: http://go.microsoft.com/fwlink/?LinkId=517478
[azure-developer-center]: http://azure.microsoft.com/en-us/develop/net/
[adf-developer-reference]: http://go.microsoft.com/fwlink/?LinkId=516908
[azure-preview-portal]: https://portal.azure.com/

[adfgetstarted]: ../data-factory-get-started

[image-data-factory-zip-output-binaries]: ./media/data-factory-use-custom-activities/ZipOuputBinaries.png

[image-data-factory-upload-zip-to-blob]: ./media/data-factory-use-custom-activities/UploadZipToBlob.png

[image-data-factory-ouput-from-custom-activity]: ./media/data-factory-use-custom-activities/OutputFilesFromCustomActivity.png

[image-data-factory-download-logs-from-custom-activity]: ./media/data-factory-use-custom-activities/DownloadLogsFromCustomActivity.png
