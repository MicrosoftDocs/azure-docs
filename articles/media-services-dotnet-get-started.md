<properties urlDisplayName="Get Started with Media Services" pageTitle="Get Started with Media Services - Azure" metaKeywords="Azure media services" description="An introduction to using Media Services with Azure." metaCanonical="" services="media-services" documentationCenter="" title="Get started with Media Services" authors="juliako" solutions="" manager="dwrede" editor="" />

<tags ms.service="media-services" ms.workload="media" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="10/30/2014" ms.author="juliako" />





# <a name="getting-started"></a>Get started with Media Services

This tutorial shows you how to start developing with Azure Media Services. It introduces the basic Media Services workflow and the most common programming objects and tasks required for Media Services development. At the completion of the tutorial, you will be able to play back a sample media file that you uploaded, encoded, and downloaded. Or you can browse to the encoded asset and play it back on the server. 

A C# Visual Studio project that contains the code for this tutorial is available here: [Download](http://go.microsoft.com/fwlink/?linkid=253275).

This tutorial walks you through these basic steps:

* [Setting up your project](#Step1)
* [Getting the Media Services server context](#Step2)
* [Creating an asset and uploading files that are associated with the asset into Media Services](#Step3)
* [Encoding an asset and downloading an output asset](#Step4)

## Prerequisites
The following prerequisites are required for the walkthrough and for development based on the Azure Media Services SDK.

- A Media Services account in a new or existing Azure subscription. For details, see [How to Create a Media Services Account](http://go.microsoft.com/fwlink/?LinkId=256662).
- Operating Systems: Windows 7, Windows 2008 R2, Windows 8 or later.
- .NET Framework 4.5 or .NET Framework 4.
- Visual Studio 2012, Visual Studio 2010 SP1 (Professional, Premium, Ultimate, or Express), or later.
- Install **Azure SDK for .NET.**, **Azure Media Services SDK for .NET**, and **WCF Data Services 5.0 for OData V3 libraries** and add references to your project using the [windowsazure.mediaservices Nuget](http://nuget.org/packages/windowsazure.mediaservices) package. The following section demonstrates how to install and add these references.

>[AZURE.NOTE]
> To complete this tutorial, you need an Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see <a href="http://www.windowsazure.com/en-us/pricing/free-trial/?WT.mc_id=A8A8397B5" target="_blank">Azure Free Trial</a>.

<h2><a id="Step1"></a>Setting up your project</h2>

1. Create a new C# Console Application in Visual Studio 2012 or Visual Studio 2010 SP1. Enter the **Name**, **Location**, and **Solution name**, and then click OK. 

2. Add a reference to System.Configuration assembly.

	To add references using the **Manage References** dialog, do the following. Right-click on 	the **References** node in **Solution Explorer** and select **Add Reference**. In the 	**Manage References** dialog, select the appropriate assemblies (in this case 	System.Configuration.)

3. If you have not done so yet, add references to **Azure SDK for .NET**.(Microsoft.WindowsAzure.StorageClient.dll), **Azure Media Services SDK for .NET** (Microsoft.WindowsAzure.MediaServices.Client.dll), and **WCF Data Services 5.0 for OData V3** (Microsoft.Data.OData.dll) libraries using the <a href="http://nuget.org/packages/windowsazure.mediaservices">windowsazure.mediaservices Nuget</a> package. 

	To add references using Nuget, do the following. In Visual Studio Main Menu, select TOOLS -> Library Package Manager -> Package Manager Console. In the console window type <i>Install-Package [package name]</i> and press enter (in this case use the following command: <i>Install-Package windowsazure.mediaservices</i>.)

4. Add an *appSettings* section to the **app.config** file, and set the values for your Azure Media Services account name and account key. You obtained the Media Services account name and account key during the account setup process. Add these values to the value attribute for each setting in the app.config file in the Visual Studio project.

	> [AZURE.NOTE]
	> In Visual Studio 2012, the App.config file is added by default. In Visual Studio 2010, you have to manually add the Application Configuration file.

	<pre><code>
	&lt;configuration&gt;
  	. . . 
  	&lt;appSettings&gt;
    	&lt;add key="accountName" value="Add-Media-Services-Account-Name" /&gt;
    	&lt;add key="accountKey" value="Add-Media-Services-Account-Key" /&gt;
  	&lt;/appSettings&gt;
	&lt;/configuration&gt;
	</code></pre>

5. Create a new folder on your local machine and name it supportFiles (in this example supportFiles is located under the MediaServicesGettingStarted project directory.) The <a href="http://go.microsoft.com/fwlink/?linkid=253275">Project</a> that accompanies this walkthrough contains the supportFiles directory. You can copy the content of this directory into your supportFiles folder.

6. Overwrite the existing using statements at the beginning of the Program.cs file with the following code.

		using System;
		using System.Linq;
		using System.Configuration;
		using System.IO;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		using System.Collections.Generic;
		using Microsoft.WindowsAzure;
		using Microsoft.WindowsAzure.MediaServices.Client;


7. Add the following class-level path variables. The **_supportFiles** path should point to the folder you created in a previous step. 

		// Base support files path.  Update this field to point to the base path  
		// for the local support files folder that you create. 
		private static readonly string _supportFiles =
		            Path.GetFullPath(@"../..\supportFiles");
		
		// Paths to support files (within the above base path). You can use 
		// the provided sample media files from the "supportFiles" folder, or 
		// provide paths to your own media files below to run these samples.
		private static readonly string _singleInputFilePath =
		    Path.GetFullPath(_supportFiles + @"\multifile\interview2.wmv");
		private static readonly string _outputFilesFolder =
		    Path.GetFullPath(_supportFiles + @"\outputfiles");
		
8. Add the following class-level variables to retrieve authentication and connection settings.  These settings are pulled from the App.Config file and are required to connect to Media Services, authenticate, and get a token so that you can access the server context. The code in the project references these variables to create an instance of the server context.
	
		private static readonly string _accountKey = ConfigurationManager.AppSettings["accountKey"];
		private static readonly string _accountName = ConfigurationManager.AppSettings["accountName"];

9. Add the following class-level variable that is used as a static reference to the server context.

		// Field for service context.
		private static CloudMediaContext _context = null;
		
<h2><a id="Step2"></a>Getting the Media Services Context</h2>

The Media Services context object contains all the fundamental objects and collections to access for Media Services programming. The context includes references to important collections including jobs, assets, files, access policies, locators, and other objects. You must get the server context for most Media Services programming tasks.

In the Program.cs file, add the following code as the first item in your **Main** method. This code uses your Media Services account name and account key values from the app.config file to create an instance of the server context. The instance is assigned to the **_context** variable you created at the class level.

	// Get the service context.
	_context = new CloudMediaContext(_accountName, _accountKey);
	
<h2><a id="Step3"></a>Creating an Asset and Uploading a File</h2>

The code in this section does the following: 

1. Creates an empty Asset<br/>
When you create assets, you can specify three different options for encrypting them. 

	- **AssetCreationOptions.None**: no encryption. If you want to create an unencrypted asset, you must set this option.
	- **AssetCreationOptions.CommonEncryptionProtected**: for Common Encryption Protected (CENC) files. An example is a set of files that are already PlayReady encrypted. 
	- **AssetCreationOptions.StorageEncrypted**: storage encryption. Encrypts a clear input file before it is uploaded to Azure storage.

		<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>Media Services provide on-disk storage encryption, not over the wire like Digital Rights Manager (DRM.)</p> 
	</div>

2. Creates an AssetFile instance that we want to associate with the asset.
3. Creates an AccessPolicy instance that defines the permissions and duration of access to the asset.
4. Creates a Locator instance that provides access to the asset.
5. Uploads a single media file into Media Services. The process of creating and uploading is also called ingesting assets.

Add the following methods to the class.

<pre><code>
static private IAsset CreateEmptyAsset(string assetName, AssetCreationOptions assetCreationOptions)
{
    var asset = _context.Assets.Create(assetName, assetCreationOptions);

    Console.WriteLine("Asset name: " + asset.Name);
    Console.WriteLine("Time created: " + asset.Created.Date.ToString());

    return asset;
}

static public IAsset CreateAssetAndUploadSingleFile(AssetCreationOptions assetCreationOptions, string singleFilePath)
{
    var assetName = "UploadSingleFile_" + DateTime.UtcNow.ToString();
    var asset = CreateEmptyAsset(assetName, assetCreationOptions);

    var fileName = Path.GetFileName(singleFilePath);

    var assetFile = asset.AssetFiles.Create(fileName);

    Console.WriteLine("Created assetFile {0}", assetFile.Name);

    var accessPolicy = _context.AccessPolicies.Create(assetName, TimeSpan.FromDays(3),
                                                        AccessPermissions.Write | AccessPermissions.List);

    var locator = _context.Locators.CreateLocator(LocatorType.Sas, asset, accessPolicy);

    Console.WriteLine("Upload {0}", assetFile.Name);

    assetFile.Upload(singleFilePath);
    Console.WriteLine("Done uploading of {0} using Upload()", assetFile.Name);

    locator.Delete();
    accessPolicy.Delete();

    return asset;
}

</code></pre>

Add a call to the method after the **\_context = new CloudMediaContext(_accountName, _accountKey);** line in your Main method. 

	IAsset asset = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, _singleInputFilePath)

<h2><a id="Step4"></a>Encoding the Asset on the Server and Downloading an Output Asset</h2>

In Media Services, you can create jobs that process media content in several ways: encoding, encrypting, doing format conversions, and so on. A Media Services job always contains one or more tasks that specify the details of the processing work. In this section you create a basic encoding task, and then run a job that performs it using Azure Media Encoder. The task uses a preset string to specify the type of encoding to perform. To see the available preset encoding values, see [Task Preset Strings for Azure Media Encoder](http://msdn.microsoft.com/en-us/library/windowsazure/jj129582.aspx) . Media Services support the same media file input and output formats as Microsoft Expression Encoder. For a list of supported formats, see [Supported File Types for Media Services](http://msdn.microsoft.com/en-us/library/windowsazure/hh973634.aspx).

<ol>
<li>
Add the following <strong>CreateEncodingJob</strong> method definition to your class. This method demonstrates how to accomplish several required tasks for an encoding job:
<ul>
<li>
Declare a new job.
</li>
<li>
Declare a media processor to handle the job. A media processor is a component that handles encoding, encrypting, format conversion, and other related processing jobs. There are several types of available media processors (you can iterate through all of them using _context.MediaProcessors.) The GetLatestMediaProcessorByName method, shown later in this walkthrough, returns the Azure Media Encoder processor.
</li>
<li>
Declare a new task. Every job has one or more tasks. Notice that with the task, you pass to it a friendly name, a media processor instance, a task configuration string, and task creation options. The configuration string specifies encoding settings. This example uses the <strong>H264 Broadband 720p</strong> setting. This preset produces a single MP4 file. For more information about this and other presets, see <a href="http://msdn.microsoft.com/library/windowsazure/jj129582.aspx">Task Preset Strings for Azure Media Encoder</a>.
</li>
<li>
Add an input asset to the task. In this example, the input asset is the one you created in the previous section.
</li>
<li>
Add an output asset to the task. For an output asset, specify a friendly name, a Boolean value to indicate whether to save the output on the server after job completion, and an <strong>AssetCreationOptions.None</strong> value to indicate that the output is not encrypted for storage and transport. 
</li>
<li>
Submit the job.<br/>
Submitting a job is the last step that is required to do an encoding job.
</li>
</ul>
The method also demonstrates how to perform other useful (but optional) tasks such as tracking job progress and accessing the asset that your encoding job creates.
<pre><code>
static IJob CreateEncodingJob(IAsset asset, string inputMediaFilePath, string outputFolder)
{
    // Declare a new job.
    IJob job = _context.Jobs.Create("My encoding job");
    // Get a media processor reference, and pass to it the name of the 
    // processor to use for the specific task.
    IMediaProcessor processor = GetLatestMediaProcessorByName("Azure Media Encoder");

    // Create a task with the encoding details, using a string preset.
    ITask task = job.Tasks.AddNew("My encoding task",
        processor,
        "H264 Broadband 720p",
        Microsoft.WindowsAzure.MediaServices.Client.TaskOptions.ProtectedConfiguration);

    // Specify the input asset to be encoded.
    task.InputAssets.Add(asset);
    // Add an output asset to contain the results of the job. 
    // This output is specified as AssetCreationOptions.None, which 
    // means the output asset is not encrypted. 
    task.OutputAssets.AddNew("Output asset",
        AssetCreationOptions.None);
    // Use the following event handler to check job progress.  
    job.StateChanged += new
            EventHandler&lt;JobStateChangedEventArgs&gt;(StateChanged);

    // Launch the job.
    job.Submit();

    // Optionally log job details. This displays basic job details
    // to the console and saves them to a JobDetails-{JobId}.txt file 
    // in your output folder.
    LogJobDetails(job.Id);

    // Check job execution and wait for job to finish. 
    Task progressJobTask = job.GetExecutionProgressTask(CancellationToken.None);
    progressJobTask.Wait();

    // **********
    // Optional code.  Code after this point is not required for 
    // an encoding job, but shows how to access the assets that 
    // are the output of a job, either by creating URLs to the 
    // asset on the server, or by downloading. 
    // **********

    // Get an updated job reference.
    job = GetJob(job.Id);

    // If job state is Error the event handling 
    // method for job progress should log errors.  Here we check 
    // for error state and exit if needed.
    if (job.State == JobState.Error)
    {
        Console.WriteLine("\nExiting method due to job error.");
        return job;
    }

    // Get a reference to the output asset from the job.
    IAsset outputAsset = job.OutputMediaAssets[0];
    IAccessPolicy policy = null;
    ILocator locator = null;

    // Declare an access policy for permissions on the asset. 
    // You can call an async or sync create method. 
    policy =
        _context.AccessPolicies.Create("My 30 days readonly policy",
            TimeSpan.FromDays(30),
            AccessPermissions.Read);

    // Create a SAS locator to enable direct access to the asset 
    // in blob storage. You can call a sync or async create method.  
    // You can set the optional startTime param as 5 minutes 
    // earlier than Now to compensate for differences in time  
    // between the client and server clocks. 

    locator = _context.Locators.CreateLocator(LocatorType.Sas, outputAsset,
        policy,
        DateTime.UtcNow.AddMinutes(-5));

    // Build a list of SAS URLs to each file in the asset. 
    List&lt;String&gt; sasUrlList = GetAssetSasUrlList(outputAsset, locator);

    // Write the URL list to a local file. You can use the saved 
    // SAS URLs to browse directly to the files in the asset.
    if (sasUrlList != null)
    {
        string outFilePath = Path.GetFullPath(outputFolder + @"\" + "FileSasUrlList.txt");
        StringBuilder fileList = new StringBuilder();
        foreach (string url in sasUrlList)
        {
            fileList.AppendLine(url);
            fileList.AppendLine();
        }
        WriteToFile(outFilePath, fileList.ToString());

        // Optionally download the output to the local machine.
        DownloadAssetToLocal(job.Id, outputFolder);
    }

    
    return job;
}

</code></pre>
</li>
<li>
Add a call to the <strong>CreateEncodingJob</strong> method in your <strong>Main</strong> method, after the lines you previously added.
<pre><code>
CreateEncodingJob(asset, _singleInputFilePath, _outputFilesFolder);
</code></pre>
</li>
<li>
Add the following helper methods to the class. These are required to support the <strong>CreateEncodingJob</strong> method. Following is a summary of the helper methods.
<ul>
<li>
The <strong>GetLatestMediaProcessorByName</strong> method returns an appropriate media processor to handle an encoding, encryption, or other related processing task. You create a media processor using the appropriate string name of the processor you want to create. The possible strings that can be passed into the method for the mediaProcessor parameter are: <strong>Azure Media Encoder</strong>, <strong>Windows Azure Media Packager</strong>, <strong>Windows Azure Media Encryptor</strong>, <strong>Storage Decryption</strong>.
<pre><code>
private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
{
    // The possible strings that can be passed into the 
    // method for the mediaProcessor parameter:
    //   Azure Media Encoder
    //   Windows Azure Media Packager
    //   Windows Azure Media Encryptor
    //   Storage Decryption

    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
        ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

    if (processor == null)
        throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

    return processor;
}

</code></pre>
</li>
<li>
When you run jobs, you often require a way to track job progress. The following code example defines the StateChanged event handler. This event handler tracks job progress and provides updated status, depending on the state. The code also defines the LogJobStop method. This helper method logs error details.

<pre><code>
private static void StateChanged(object sender, JobStateChangedEventArgs e)
{
    Console.WriteLine("Job state changed event:");
    Console.WriteLine("  Previous state: " + e.PreviousState);
    Console.WriteLine("  Current state: " + e.CurrentState);

    switch (e.CurrentState)
    {
        case JobState.Finished:
            Console.WriteLine();
            Console.WriteLine("********************");
            Console.WriteLine("Job is finished.");
            Console.WriteLine("Please wait while local tasks or downloads complete...");
            Console.WriteLine("********************");
            Console.WriteLine();
            Console.WriteLine();
            break;
        case JobState.Canceling:
        case JobState.Queued:
        case JobState.Scheduled:
        case JobState.Processing:
            Console.WriteLine("Please wait...\n");
            break;
        case JobState.Canceled:
        case JobState.Error:
            // Cast sender as a job.
            IJob job = (IJob)sender;
            // Display or log error details as needed.
            LogJobStop(job.Id);
            break;
        default:
            break;
    }
}

private static void LogJobStop(string jobId)
{
    StringBuilder builder = new StringBuilder();
    IJob job = GetJob(jobId);

    builder.AppendLine("\nThe job stopped due to cancellation or an error.");
    builder.AppendLine("***************************");
    builder.AppendLine("Job ID: " + job.Id);
    builder.AppendLine("Job Name: " + job.Name);
    builder.AppendLine("Job State: " + job.State.ToString());
    builder.AppendLine("Job started (server UTC time): " + job.StartTime.ToString());
    builder.AppendLine("Media Services account name: " + _accountName);
    // Log job errors if they exist.  
    if (job.State == JobState.Error)
    {
        builder.Append("Error Details: \n");
        foreach (ITask task in job.Tasks)
        {
            foreach (ErrorDetail detail in task.ErrorDetails)
            {
                builder.AppendLine("  Task Id: " + task.Id);
                builder.AppendLine("    Error Code: " + detail.Code);
                builder.AppendLine("    Error Message: " + detail.Message + "\n");
            }
        }
    }
    builder.AppendLine("***************************\n");
    // Write the output to a local file and to the console. The template 
    // for an error output file is:  JobStop-{JobId}.txt
    string outputFile = _outputFilesFolder + @"\JobStop-" + JobIdAsFileName(job.Id) + ".txt";
    WriteToFile(outputFile, builder.ToString());
    Console.Write(builder.ToString());
}

private static void LogJobDetails(string jobId)
{
    StringBuilder builder = new StringBuilder();
    IJob job = GetJob(jobId);

    builder.AppendLine("\nJob ID: " + job.Id);
    builder.AppendLine("Job Name: " + job.Name);
    builder.AppendLine("Job submitted (client UTC time): " + DateTime.UtcNow.ToString());
    builder.AppendLine("Media Services account name: " + _accountName);

    // Write the output to a local file and to the console. The template 
    // for an error output file is:  JobDetails-{JobId}.txt
    string outputFile = _outputFilesFolder + @"\JobDetails-" + JobIdAsFileName(job.Id) + ".txt";
    WriteToFile(outputFile, builder.ToString());
    Console.Write(builder.ToString());
}
        
private static string JobIdAsFileName(string jobID)
{
    return jobID.Replace(":", "_");
}
</code></pre>
</li>
<li>
The WriteToFile method writes a file to the specified output folder.
<pre><code>
static void WriteToFile(string outFilePath, string fileContent)
{
    StreamWriter sr = File.CreateText(outFilePath);
    sr.Write(fileContent);
    sr.Close();
}

</code></pre>
</li>
<li>
After you have encoded assets in Media Services, you can access the output assets that result from an encoding job. This walkthrough shows you two ways to access the output of an encoding job:
<ul>
<li>
Creating a SAS URL to an asset on the server. 
</li>
<li>
Downloading the output asset from the server.
</li>
</ul>
The GetAssetSasUrlList method creates a list of SAS URLs to all files in an asset. 
<pre><code>
static List&lt;String&gt; GetAssetSasUrlList(IAsset asset, ILocator locator)
{
    // Declare a list to contain all the SAS URLs.
    List&lt;String&gt; fileSasUrlList = new List&lt;String&gt;();

    // If the asset has files, build a list of URLs to 
    // each file in the asset and return. 
    foreach (IAssetFile file in asset.AssetFiles)
    {
        string sasUrl = BuildFileSasUrl(file, locator);
        fileSasUrlList.Add(sasUrl);
    }

    // Return the list of SAS URLs.
    return fileSasUrlList;
}

// Create and return a SAS URL to a single file in an asset. 
static string BuildFileSasUrl(IAssetFile file, ILocator locator)
{
    // Take the locator path, add the file name, and build 
    // a full SAS URL to access this file. This is the only 
    // code required to build the full URL.
    var uriBuilder = new UriBuilder(locator.Path);
    uriBuilder.Path += "/" + file.Name;

    // Optional:  print the locator.Path to the asset, and 
    // the full SAS URL to the file
    Console.WriteLine("Locator path: ");
    Console.WriteLine(locator.Path);
    Console.WriteLine();
    Console.WriteLine("Full URL to file: ");
    Console.WriteLine(uriBuilder.Uri.AbsoluteUri);
    Console.WriteLine();


    //Return the SAS URL.
    return uriBuilder.Uri.AbsoluteUri;
}

</code></pre>
</li>
<li>
The <strong>DownloadAssetToLocal</strong> method downloads each file in the asset to a local folder. In this example, because the asset was created with one input media file, the output asset files collection contains two files: the encoded media file (an .mp4 file), and an .xml file with metadata about the asset. The method downloads both files.
<pre><code>
static IAsset DownloadAssetToLocal(string jobId, string outputFolder)
{
    // This method illustrates how to download a single asset. 
    // However, you can iterate through the OutputAssets
    // collection, and download all assets if there are many. 

    // Get a reference to the job. 
    IJob job = GetJob(jobId);
    // Get a reference to the first output asset. If there were multiple 
    // output media assets you could iterate and handle each one.
    IAsset outputAsset = job.OutputMediaAssets[0];

    IAccessPolicy accessPolicy = _context.AccessPolicies.Create("File Download Policy", TimeSpan.FromDays(30), AccessPermissions.Read);
    ILocator locator = _context.Locators.CreateSasLocator(outputAsset, accessPolicy);
    BlobTransferClient blobTransfer = new BlobTransferClient
    {
        NumberOfConcurrentTransfers = 10,
        ParallelTransferThreadCount = 10
    };

    var downloadTasks = new List&lt;Task&gt;();
    foreach (IAssetFile outputFile in outputAsset.AssetFiles)
    {
        // Use the following event handler to check download progress.
        outputFile.DownloadProgressChanged += DownloadProgress;

        string localDownloadPath = Path.Combine(outputFolder, outputFile.Name);

        Console.WriteLine("File download path:  " + localDownloadPath);

        downloadTasks.Add(outputFile.DownloadAsync(Path.GetFullPath(localDownloadPath), blobTransfer, locator, CancellationToken.None));

        outputFile.DownloadProgressChanged -= DownloadProgress;
    }

    Task.WaitAll(downloadTasks.ToArray());

    return outputAsset;
}

static void DownloadProgress(object sender, DownloadProgressChangedEventArgs e)
{
    Console.WriteLine(string.Format("{0} % download progress. ", e.Progress));
}
</code></pre>
</li>
<li>
The GetJob and GetAsset helper methods query for and return a reference to a job object and an asset object with given IDs. You can use a similar type of LINQ query to return references to other Media Services objects on the server.
<pre><code>
static IJob GetJob(string jobId)
{
    // Use a Linq select query to get an updated 
    // reference by Id. 
    var jobInstance =
        from j in _context.Jobs
        where j.Id == jobId
        select j;
    // Return the job reference as an Ijob. 
    IJob job = jobInstance.FirstOrDefault();

    return job;
}
static IAsset GetAsset(string assetId)
{
    // Use a LINQ Select query to get an asset.
    var assetInstance =
        from a in _context.Assets
        where a.Id == assetId
        select a;
    // Reference the asset as an IAsset.
    IAsset asset = assetInstance.FirstOrDefault();

    return asset;
}
</code></pre>
</li>
</ul>
</li>
</ol>

## Testing the Code
Run the program (press F5). The console displays output similar to the following:

<pre><code>
Asset name: UploadSingleFile_11/14/2012 10:09:11 PM
Time created: 11/14/2012 12:00:00 AM
Created assetFile interview2.wmv
Upload interview2.wmv
Done uploading of interview2.wmv using Upload()

Job ID: nb:jid:UUID:ea8d5a66-86b8-9b4d-84bc-6d406259acb8
Job Name: My encoding job
Job submitted (client UTC time): 11/14/2012 10:09:39 PM
Media Services account name: Add-Media-Services-Account-Name
Media Services account location: Add-Media-Services-account-location-name

Job(My encoding job) state: Queued.
Please wait...

Job(My encoding job) state: Processing.
Please wait...

********************
Job(My encoding job) is finished.
Please wait while local tasks or downloads complete...
********************

Locator path:
https://mediasvcd08mtz29tcpws.blob.core.windows-int.net/asset-4f5b42f4-3ade-4c2c
-9d48-44900d4f6b62?st=2012-11-14T22%3A07%3A01Z&amp;se=2012-11-14T23%3A07%3A01Z&amp;sr=c&amp;
si=d07ec40c-02d7-4642-8e54-443b79f3ba3c&amp;sig=XKMo0qJI5w8Fod3NsV%2FBxERnav8Jb6hL7f
xylq3oESc%3D

Full URL to file:
https://mediasvcd08mtz29tcpws.blob.core.windows-int.net/asset-4f5b42f4-3ade-4c2c
-9d48-44900d4f6b62/interview2.mp4?st=2012-11-14T22%3A07%3A01Z&amp;se=2012-11-14T23%3
A07%3A01Z&amp;sr=c&amp;si=d07ec40c-02d7-4642-8e54-443b79f3ba3c&amp;sig=XKMo0qJI5w8Fod3NsV%2F
BxERnav8Jb6hL7fxylq3oESc%3D

Locator path:
https://mediasvcd08mtz29tcpws.blob.core.windows-int.net/asset-4f5b42f4-3ade-4c2c
-9d48-44900d4f6b62?st=2012-11-14T22%3A07%3A01Z&amp;se=2012-11-14T23%3A07%3A01Z&amp;sr=c&amp;
si=d07ec40c-02d7-4642-8e54-443b79f3ba3c&amp;sig=XKMo0qJI5w8Fod3NsV%2FBxERnav8Jb6hL7f
xylq3oESc%3D

Full URL to file:
https://mediasvcd08mtz29tcpws.blob.core.windows-int.net/asset-4f5b42f4-3ade-4c2c
-9d48-44900d4f6b62/interview2_metadata.xml?st=2012-11-14T22%3A07%3A01Z&amp;se=2012-1
1-14T23%3A07%3A01Z&amp;sr=c&amp;si=d07ec40c-02d7-4642-8e54-443b79f3ba3c&amp;sig=XKMo0qJI5w8F
od3NsV%2FBxERnav8Jb6hL7fxylq3oESc%3D

Downloads are in progress, please wait.

File download path:  C:\supportFiles\outputfiles\interview2.mp4
1.70952185308162 % download progress.
3.68508804454907 % download progress.
6.48870388360293 % download progress.
6.83808741232649 % download progress.
. . . 
99.0763740574049 % download progress.
99.1522674787341 % download progress.
100 % download progress.
File download path:  C:\supportFiles\outputfiles\interview2_metadata.xml
100 % download progress.

</code></pre>

1. As a result of running this application the following happens:

2. An .wmv file is uploaded into Media Services. 

3. The file is then encoded using the **H264 Broadband 720p** preset of the **Azure Media Encoder**.

4. The FileSasUrlList.txt file is created in the \supportFiles\outputFiles folder. The file contains the URL to the encoded asset. 

	To play back the media file, copy the URL to the asset from the text file and paste the URL into a browser. 

5. The .mp4 media file and the _metadata.xml file are downloaded into the outputFiles folder.

>[AZURE.NOTE]
> In the Media Services object model, an asset is a Media Services content collection object that represents one to many files. The locator path provides an Azure blob URL which is the base path to this asset in Azure Storage. To access specific files within the asset, add a file name to the base locator path.

<h2>Next Steps</h2>
This walkthrough has demonstrated a sequence of programming tasks to build a simple Media Services application. You learned the fundamental Media Services programming tasks including getting the server context, creating assets, encoding assets, and downloading or accessing assets on the server. For next steps and more advanced development tasks, see the following:

- <a href="http://azure.microsoft.com/en-us/develop/media-services/resources/">How to Use Media Services</a>
- <a href="http://msdn.microsoft.com/en-us/library/windowsazure/hh973618.aspx">Building Applications with the Media Services REST API</a>

<h2>Additional Resources</h2>
- <a href="http://channel9.msdn.com/Shows/Azure-Friday/Azure-Media-Services-101-Get-your-video-online-now-">Azure Media Services 101 - Get your video online now!</a>
- <a href="http://channel9.msdn.com/Shows/Azure-Friday/Azure-Media-Services-102-Dynamic-Packaging-and-Mobile-Devices">Azure Media Services 102 - Dynamic Packaging and Mobile Devices</a>

<!-- Anchors. -->
[Getting started with Mobile Services]:#getting-started
[Create a new mobile service]:#create-new-service
[Define the mobile service instance]:#define-mobile-service-instance
[Next Steps]:#next-steps

