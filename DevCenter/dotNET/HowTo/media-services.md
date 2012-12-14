<properties linkid="develop-net-how-to-guides-media-services" urlDisplayName="Media Services" pageTitle="How to use Media Services (.NET) - Windows Azure feature guide" metaKeywords="Windows Azure Media Services, Windows Azure media, windows azure streaming, azure media, azure streaming, azure encoding" metaDescription="Describes how to use Windows Azure Media Services to perform common tasks including encoding, encrypting, and streaming resources." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />
#How to Use Media Services

This guide shows you how to start programming with Windows Azure Media Services. The guide includes a technical overview of Media Services, steps to configure your Windows Azure account for Media Services, a setup guide for development, and topics that show how to accomplish typical programming tasks. The scenarios demonstrated include: uploading assets, encrypting or encoding assets, and delivering assets by downloading or by generating URLs for streaming content. The samples are written in C# and use the Media Services SDK for .NET. For more information on Windows Azure Media Services, refer to the [Next Steps][] section.

You can also program Media Services using the OData-based REST APIs. You can build an application making REST API calls to Media Services from .NET languages or other programming languages. For a full documentation series on programming with the Media Services REST API, see [Building Applications with the Windows Azure Media Services REST API](http://go.microsoft.com/fwlink/?linkid=252967). To start programming with REST, first enable your Windows Azure account for Media Services as described in the section [Setting Up a Windows Azure Account for Media Services][].

The most up-to-date Media Services SDK documentation is located [here](http://msdn.microsoft.com/en-us/library/hh973613.aspx). 

## Table of Contents

-   [What Are Media Services?][]
-   [Setting Up a Windows Azure Account for Media Services][]
-   [Setting up for Media Services Development][]
-   [How to: Connect to Media Services Programmatically][]
-   [How to: Create an Encrypted Asset and Upload to Storage][]
-   [How to: Get a Media Processor Instance][]
-   [How to: Check Job Progress][]
-   [How to: Encode an Asset][]
-   [How to: Protect an Asset with PlayReady Protection][]
-   [How to: Manage Assets in Storage][]
-   [How to: Deliver an Asset by Download][]
-   [How to: Deliver Streaming Content][]
-   [How to: Deliver Apple HLS Streaming Content][]
-   [How to: Enable Windows Azure CDN][]
-   [Next Steps][]
 

<h2><a name="what-are"></a><span class="short header">What are Media Services?</span>What are Media Services?</h2> 
Windows Azure Media Services form an extensible media platform that integrates the best of the Microsoft Media Platform and third-party media components in Windows Azure. Media Services provide a media pipeline in the cloud that enables industry partners to extend or replace component technologies. ISVs and media providers can use Media Services to build end-to-end media solutions. This overview describes the general architecture and common development scenarios for Media Services.

The following diagram illustrates the basic Media Services architecture.

![Media Services Architecture][]

###Media Services Feature Support
The current release of Media Services provides the following feature set for developing media applications in the cloud. For information on future releases, see [Media Services Upcoming Releases:  Planned Feature Support][].

- **Ingest**. Ingest operations bring assets into the system, for example by uploading them and encrypting them before they are placed into Windows Azure Storage. By the RTM release, Media Services will offer integration with partner components to provide fast UDP (User Datagram Protocol) upload solutions.
- **Encode**. Encode operations include encoding, transforming and converting media assets. You can run encoding tasks in the cloud using the Media Encoder that is included in Media Services. Encoding options include the following:
   - Use the Windows Azure Media Encoder and work with a range of standard codecs and formats, including industry-leading IIS Smooth Streaming, MP4, and conversion to Apple HTTP Live Streaming.
   - Convert entire libraries or individual files with total control over input and output.
   - A large set of supported file types, formats, and codecs (see [Supported File Types for Media Services][]).
   - Supported format conversions. Media Services enable you to convert ISO MP4 (.mp4) to Smooth Streaming File Format (PIFF 1.3) (.ismv; .isma). You can also convert Smooth Streaming File Format (PIFF) to Apple HTTP Live Streaming (.msu8, .ts).
- **Protect**. Protecting content means encrypting live streaming or on demand content for secure transport, storage, and delivery. Media Services provide a DRM technology-agnostic solution for protecting content.  Currently supported DRM technologies are Microsoft PlayReady Protection and MPEG Common Encryption. Support for additional DRM technologies will be available. 
- **Stream**. Streaming content involves sending it live or on demand to clients, or you can retrieve or download specific media files from the cloud. Media Services provide a format-agnostic solution for streaming content.  Media Services provide  streaming origin support for Smooth Streaming, Apple HTTP Live Streaming, and MP4 formats. Support for additional formats will be available. You can also seamlessly deliver streaming content by using Windows Azure CDN or a third-party CDN, which enables the option  to scale to millions of users.   

###Media Services Development Scenarios
Media Services support several common media development scenarios as described in the following table. 
<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
  <thead>
    <tr>
       <th>Scenario</th>
       <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>Building end-to-end workflows</td>
        <td>Build comprehensive media workflows entirely in the cloud. From uploading media to distributing content, Media Services provide a range of components that can be combined to handle specific application workflows. Current capabilities include upload, storage, encoding, format conversion, content protection, and on-demand streaming delivery.</td>
    </tr>
    <tr>
        <td>Building hybrid workflows</td>
        <td>You can integrate Media Services with existing tools and processes. For example, encode content on-site then upload to Media Services for transcoding into multiple formats and deliver through Windows Azure CDN, or a third-party CDN. Media Services can be called individually via standard REST APIs for integration with external applications and services.</td>
    </tr>
    <tr>
        <td>Providing cloud support for media players</td>
        <td>You can create, manage, and deliver media across multiple devices (including iOS, Android, and Windows devices) and platforms.</td>
    </tr>
  </tbody>
</table>

###Media Services Client Development
Extend the reach of your Media Services solution by using SDKs and player frameworks to build media client applications. These clients are for developers who want to build Media Services applications that offer compelling user experiences across a range of devices and platforms. Depending on the devices that you want to build client applications for, there are options for SDKs and player frameworks available from Microsoft and other third-party partners.  

The following provides a list of available client SDKs and player frameworks.  For more information on these and other planned SDKs and player frameworks, and the functionality they can support, see [Media Services Client Development][]. 

####Mac and PC client support  
For PCs and Macs you can target a streaming experience using Microsoft Silverlight or Adobe Open Source Media Framework.

-	[Smooth Streaming Client for Silverlight](http://www.iis.net/download/smoothclient)
-	[Microsoft Media Platform: Player Framework for Silverlight](http://smf.codeplex.com/documentation)
-	[Smooth Streaming Plugin for OSMF 2.0](http://go.microsoft.com/fwlink/?LinkId=275022). For information on how to use this plug-in, see [How to Use Smooth Streaming Plugin for Adobe Open Source Media Framework](http://go.microsoft.com/fwlink/?LinkId=275034).

####Windows 8 applications
For Windows 8, you can build Windows Store applications using any of the supported development languages and constructs like HTML, Javascript, XAML, C# and C+.

-	[Smooth Streaming Client SDK for Windows 8](http://go.microsoft.com/fwlink/?LinkID=246146). For more information on how to create a Windows Store application using this SDK, see [How to Build a Smooth Streaming Windows Store Application](http://go.microsoft.com/fwlink/?LinkId=271647). For information on how to create a smooth streaming player in HTML5, see [Walkthrough: Building Your First HTML5 Smooth Streaming Player](http://msdn.microsoft.com/en-us/library/jj573656(v=vs.90).aspx).

-	[Microsoft Media Platform: Player Framework for Windows 8 Windows Store Applications](http://playerframework.codeplex.com/wikipage?title=Player%20Framework%20for%20Windows%208%20Metro%20Style%20Apps&referringTitle=Home)

####Xbox
Xbox supports Xbox LIVE applications that can consume Smooth Streaming content. The Xbox LIVE Application Development Kit (ADK) includes:

-	Smooth Streaming client for Xbox LIVE ADK
-	Microsoft Media Platform: Player Framework for Xbox LIVE ADK

####Embedded or dedicated devices
Devices such as connected TVs, set-top boxes, Blu-Ray players, OTT TV boxes, and mobile devices that have a custom application development framework and a custom media pipeline. Microsoft provides the following porting kits that can be licensed, and enables partners to port Smooth Streaming playback for the platform.

-	[Smooth Streaming Client Porting Kit](http://www.microsoft.com/en-us/mediaplatform/sspk.aspx)
-	[Microsoft PlayReady Device Porting Kit](http://www.microsoft.com/PlayReady/Licensing/device_technology.mspx)

####Windows Phone
Microsoft provides an SDK that can be used to build premium video applications for Windows Phone. 

-	[Smooth Streaming Client for Silverlight](http://www.iis.net/download/smoothclient)
-	[Microsoft Media Platform: Player Framework for Silverlight](http://smf.codeplex.com/documentation)

####iOS devices
For iOS devices including iPhone, iPod, and iPad, Microsoft ships an SDK that you can use to build applications for these platforms to deliver premium video content: Smooth Streaming SDK for iOS Devices with PlayReady.  The SDK is available only to licensees, so for more information, please [email Microsoft](mailto:askdrm@microsoft.com). For information on iOS development, see the [iOS Developer Center](https://developer.apple.com/devcenter/ios/index.action).

####Android devices
Several Microsoft partners ship SDKs for the Android platform that add the capability to play back Smooth Streaming on an Android device. Please [email Microsoft](mailto:sspkinfo@microsoft.com?subject=Partner%20SDKs%20for%20Android%20Devices) for more details on the partners.

<h2><a name="setup-account"></a><span class="short header">Setting up an account</span>Setting up a Windows Azure account for Media Services</h2>

To set up your Media Services account, use the Windows Azure Management Portal (recommended). See the topic [How to Create a Media Services Account][]. After creating your account in the Management Portal, you are ready to set up your computer for Media Services development. 

<h2><a name="setup-dev"> </a><span class="short header">Setting up for Media Services development</span></h2> 
This section contains general prerequisites for Media Services development using the Media Services SDK for .NET. It also shows developers how to create a Visual Studio application for Media Services SDK development. 

###Prerequisites

-   A Media Services account in a new or existing Windows Azure subscription. See the topic [How to Create a Media Services Account](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-create-a-media-services-account/).
-   Operating Systems: Windows 7, Windows 2008 R2, or Windows 8.
-   .NET Framework 4.5 or .NET Framework 4.
-   Visual Studio 2012 or Visual Studio 2010 SP1 (Professional, Premium, or Ultimate). 
-   Use the [windowsazure.mediaservices Nuget](http://nuget.org/packages/windowsazure.mediaservices) package to install Windows Azure SDK for .NET. The following section shows how to use **Nuget** to install the Windows Azure SDK.   


###Creating an Application in Visual Studio

This section shows you how to create a project in Visual Studio and set it up for Media Services development.  In this case the project is a C# Windows console application, but the same setup steps shown here apply to other types of projects you can create for Media Services applications (for example, a Windows Forms application or an ASP.NET Web application).

   1. Create a new C# **Console Application** in Visual Studio 2012 or Visual Studio 2010 SP1. Enter the **Name**, **Location**, and **Solution name**, and then click **OK**.
   2. Add a reference to **System.Configuration** assembly. To add a reference to **System.Configuration**, in **Solution Explorer**, right-click the **References** node and select **Add Reference…**. In the **Manage References** dialog, select **System.Configuration** and click **OK**.
   3. Add references to **Windows Azure SDK for .NET.** (Microsoft.WindowsAzure.StorageClient.dll), **Windows Azure Media Services SDK for .NET** (Microsoft.WindowsAzure.MediaServices.Client.dll), and **WCF Data Services 5.0 for OData V3** (Microsoft.Data.OData.dll) libraries using the [windowsazure.mediaservices Nuget](http://nuget.org/packages/windowsazure.mediaservices) package. 

	To add references using Nuget, do the following. In Visual Studio **Main Menu**, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. In the console window type **Install-Package windowsazure.mediaservices** and press **Enter**.
   4. Overwrite the existing using statements at the beginning of the Program.cs file with the following code.

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

At this point, you are ready to start developing a Media Services application.    
   
<h2><a name="connect"> </a><span class="short header">Connect to Media Services</span>How to: Connect to Media Services programmatically</h2> 

Nearly everything you do in Media Services programming requires you to have a reference to the server context object. The server context gives you programmatic access to all Media Services programming objects.

To get a reference to the server context, return a new instance of the context type as in the following code example. Pass your Media Services account name and account key (which you obtained during the account setup process) to the constructor. 

	static CloudMediaContext GetContext()
	{
	    // Gets the service context. 
	    return new CloudMediaContext(_accountName, _accountKey);
	} 

It is often useful to define a module-level variable of type **CloudMediaContext** to hold a reference to the server context returned by a method such as **GetContext**. The rest of the code examples in this topic use a variable called **_context** to refer to the server context. 

<h2><a name="create-asset"> </a><span class="short header">Create an encrypted Asset and upload to storage</span>How to: Create an encrypted Asset and upload to storage</h2>

To get media content into Media Services, first create an asset and add files to it, and then upload the asset. This process is also called ingesting content.  

When you create assets, you can specify three different options for encrypting them. 

- **AssetCreationOptions.None**: no encryption. If you want to create an unencrypted asset, you must set this option.
- **AssetCreationOptions.CommonEncryptionProtected**: for Common Encryption Protected (CENC) files. An example is a set of files that are already PlayReady encrypted. 
- **AssetCreationOptions.StorageEncrypted**: storage encryption. Encrypts a clear input file before it is uploaded to Azure storage.

**NOTE**: Note that Media Services provide on-disk storage encryption, not over the wire like Digital Rights Manager (DRM.)

The following does the following: 

- Creates an empty Asset.
- Creates an AssetFile instance that we want to associate with the asset.
- Creates an AccessPolicy instance that defines the permissions and duration of access to the asset.
- Creates a Locator instance that provides access to the asset.
- Uploads a single media file into Media Services. The process of creating and uploading is also called ingesting assets.

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

The following code shows how to upload multiple files.

<pre><code>
static public IAsset CreateAssetAndUploadMultipleFiles( AssetCreationOptions assetCreationOptions, string folderPath)
{
    var assetName = "UploadMultipleFiles_" + DateTime.UtcNow.ToString();

    var asset = CreateEmptyAsset(assetName, assetCreationOptions);

    var accessPolicy = _context.AccessPolicies.Create(assetName, TimeSpan.FromDays(30),
                                                        AccessPermissions.Write | AccessPermissions.List);
    var locator = _context.Locators.CreateLocator(LocatorType.Sas, asset, accessPolicy);

    var blobTransferClient = new BlobTransferClient();
	blobTransferClient.NumberOfConcurrentTransfers = 20;
    blobTransferClient.ParallelTransferThreadCount = 20;

    blobTransferClient.TransferProgressChanged += blobTransferClient_TransferProgressChanged;

    var filePaths = Directory.EnumerateFiles(folderPath);

    Console.WriteLine("There are {0} files in {1}", filePaths.Count(), folderPath);

    if (!filePaths.Any())
    {
        throw new FileNotFoundException(String.Format("No files in directory, check folderPath: {0}", folderPath));
    }

    var uploadTasks = new List&lt;Task&gt;();
    foreach (var filePath in filePaths)
    {
        var assetFile = asset.AssetFiles.Create(Path.GetFileName(filePath));
        Console.WriteLine("Created assetFile {0}", assetFile.Name);
                
        // It is recommended to validate AccestFiles before upload. 
        Console.WriteLine("Start uploading of {0}", assetFile.Name);
        uploadTasks.Add(assetFile.UploadAsync(filePath, blobTransferClient, locator, CancellationToken.None));
    }

    Task.WaitAll(uploadTasks.ToArray());
    Console.WriteLine("Done uploading the files");

    blobTransferClient.TransferProgressChanged -= blobTransferClient_TransferProgressChanged;

    locator.Delete();
    accessPolicy.Delete();

    return asset;
}

static void  blobTransferClient_TransferProgressChanged(object sender, BlobTransferProgressChangedEventArgs e)
{
    if (e.ProgressPercentage > 4) // Avoid startup jitter, as the upload tasks are added.
    {
        Console.WriteLine("{0}% upload competed for {1}.", e.ProgressPercentage, e.LocalFile);
    }
}

</code></pre>

<h2><a name="get-mediaproc"> </a><span class="short header">Get a Media Processor instance</span>How to: Get a Media Processor instance</h2>

In Media Services a media processor is a component that handles a specific processing task, such as encoding, format conversion, encrypting, or decrypting media content. You typically create a media processor when you are creating a task to encode, encrypt, or convert the format of media content.

The following table provides the name and description of each available media processor.

<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
  <thead>
    <tr>
       <th>Media Processor Name</th>
       <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
       <td>Windows Azure Media Encoder</td>
       <td>Lets you run encoding tasks using the Media Encoder.</td>
    </tr>
    <tr>
        <td>Windows Azure Media Packager</td>
        <td>Lets you convert media assets from .mp4 to smooth streaming format. Also, lets you convert media assets from smooth streaming to the Apple HTTP Live Streaming (HLS) format.</td>
    </tr>
    <tr>
        <td>Windows Azure Media Encryptor</td>
        <td>Lets you encrypt media assets using PlayReady Protection.</td>
    </tr>
    <tr>
        <td>Storage Decryption</td>
        <td>Lets you decrypt media assets that were encrypted using storage encryption.</td>
    </tr>
  </tbody>
</table>

<br />

To create a media processor instance, create a method like the following example, and pass to it the string name of one of the listed media processors. The code example assumes the use of a module-level variable named **_context** to reference the server context as described in the section [How to: Connect to Media Services Programmatically][].

<pre><code>
private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
{
     var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
        ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

    if (processor == null)
        throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

    return processor;
}
</code></pre>

<h2><a name="check-job-progress"> </a><span class="short header">Check Job Progress</span>How to: Check Job Progress</h2>

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
    builder.AppendLine("Media Services account location: " + _accountLocation);
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

private static string JobIdAsFileName(string jobID)
{
    return jobID.Replace(":", "_");
}
</code></pre>
<h2><a name="encode-asset"> </a><span class="short header">Encode an Asset</span>How to: Encode an Asset</h2>

For media content on the server, you can encode the content with a number of media encodings and formats using Windows Azure Media Encoder. You can also use an encoder provided by a Media Services partner; third-party encoders are available through the [Windows Azure Marketplace][]. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. 

The following steps are required to encode media content using the Media Encoder:

   1. Create an asset (or reference an existing asset).
   2. Declare a new job, using the **Jobs.Create** method.
   3. Declare a media processor to process the job. To do this, implement a method such as the **GetLatestMediaProcessorByName** method shown in the section [How to: Get a Media Processor Instance][]. In this example, the code uses the Windows Azure Media Encoder to encode the input media file.
   4. Declare a task. To declare a task, you must give the task a friendly name, and then pass to it a media processor instance, a configuration string for handling the processing job, and a **TaskCreationOptions** setting (which specifies whether to encrypt the configuration data).  In this example, the code uses a preset configuration string to tell Media Encoder how to encode the asset. 
   5. Specify an input asset for the task. In this example, the input asset is the one that the code creates in the first step.
   6. Specify an output asset for the task. By default, all assets are created as encrypted for transport and storage in Media Services. To output a clear, unencrypted asset for playback, the code specifies **AssetCreationOptions.None**.
   7. Submit the job. To access the output of a job, reference the job.OutputMediaAssets collection. See the section [How to: Deliver an Asset by Download][].

The following method combines the previous steps to encode a media file:

<pre><code>
static IJob CreateEncodingJob(string inputMediaFilePath, string outputFolder)
{
    //Create an encrypted asset and upload to storage. 
    IAsset asset = CreateAssetAndUploadSingleFile(AssetCreationOptions.StorageEncrypted, inputMediaFilePath);

    // Declare a new job.
    IJob job = _context.Jobs.Create("My encoding job");
    // Get a media processor reference, and pass to it the name of the 
    // processor to use for the specific task.
    IMediaProcessor processor = GetLatestMediaProcessorByName("Windows Azure Media Encoder");

    // Create a task with the encoding details, using a string preset.
    ITask task = job.Tasks.AddNew("My encoding task",
        processor,
        "H264 Broadband 720p",
        _protectedConfig);
    // Specify the input asset to be encoded.
    task.InputAssets.Add(asset);
    // Add an output asset to contain the results of the job. 
    // This output is specified as AssetCreationOptions.None, which 
    // means the output asset is in the clear (unencrypted). 
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


    // If job state is Error, the event handling 
    // method for job progress should log errors.  Here we check 
    // for error state and exit if needed.
    if (job.State == JobState.Error)
    {
        Console.WriteLine("\nExiting method due to job error.");
        return job;
    }
    // Perform other tasks. For example, access the assets that are the output of a job, 
    // either by creating URLs to the asset on the server, or by downloading. 
 
    return job;
}


</code></pre>

<h2><a name="playready"> </a><span class="short header">Protect an Asset</span>How to: Protect an Asset with PlayReady Protection</h2>

In Media Services you can submit a job that integrates with Microsoft PlayReady Protection to encrypt a set of media files. The code in this section takes several streaming files from an input folder, creates a task and encrypts them with PlayReady Protection. 

The following example shows several steps in creating a simple job to provide PlayReady Protection.

   1. Shows how to retrieve configuration data. You can get an example configuration file from the topic [Task Preset for Windows Azure Media Encryptor](http://msdn.microsoft.com/en-us/library/hh973610.aspx).
   2. Uploads an mp4 input file.
   3. Converts the file to smooth streaming.
   4. Encrypts the file with PlayReady.
   5. Generates an origin locator URL.
   6. Submits the job and generates the origin locator.

The following code example shows how to implement the steps:

<pre><code>
private static IJob CreatePlayReadyProtectionJob(string inputMediaFilePath, string primaryFilePath, string configFilePath)
{
    // Create a storage-encrypted asset and upload the mp4. 
    IAsset asset = CreateAssetAndUploadSingleFile(AssetCreationOptions.StorageEncrypted, inputMediaFilePath);

    // Declare a new job to contain the tasks.
    IJob job = _context.Jobs.Create("My PlayReady Protection job");

    // Set up the first task. 

    // Read the task configuration data into a string. 
    string configMp4ToSmooth = File.ReadAllText(Path.GetFullPath(configFilePath + @"\MediaPackager_MP4ToSmooth.xml"));

    // Get a media processor reference, and pass to it the name of the 
    // processor to use for the specific task.
    IMediaProcessor processor = GetLatestMediaProcessorByName("Windows Azure Media Packager");

    // Create a task with the conversion details, using the configuration data. 
    ITask task = job.Tasks.AddNew("My Mp4 to Smooth Task",
        processor,
        configMp4ToSmooth,
        _clearConfig);
    // Specify the input asset to be converted.
    task.InputAssets.Add(asset);
    // Add an output asset to contain the results of the job. We do not need 
    // to persist the output asset to storage, so set the shouldPersistOutputOnCompletion
    // param to false. 
    task.OutputAssets.AddNew("Streaming output asset",
        AssetCreationOptions.None);

    IAsset smoothOutputAsset = task.OutputAssets[0];

    // Set up the second task. 

    // Read the configuration data into a string. 
    string configPlayReady = File.ReadAllText(Path.GetFullPath(configFilePath + @"\MediaEncryptor_PlayReadyProtection.xml"));

    // Get a media processor reference, and pass to it the name of the 
    // processor to use for the specific task.
    IMediaProcessor playreadyProcessor = GetLatestMediaProcessorByName("Windows Azure Media Encryptor");

    // Create a second task. 
    ITask playreadyTask = job.Tasks.AddNew("My PlayReady Task",
        playreadyProcessor,
        configPlayReady,
        _protectedConfig);
    // Add the input asset, which is the smooth streaming output asset from the first task. 
    playreadyTask.InputAssets.Add(smoothOutputAsset);
    // Add an output asset to contain the results of the job. Persist the output by setting 
    // the shouldPersistOutputOnCompletion param to true.
    playreadyTask.OutputAssets.AddNew("PlayReady protected output asset",
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

    // If job state is Error, the event handling 
    // method for job progress should log errors.  Here we check 
    // for error state and exit if needed.
    if (job.State == JobState.Error)
    {
        Console.WriteLine("\nExiting method due to job error.");
        return job;
    }
    // Perform other tasks. For example, access the assets that are the output of a job, 
    // either by creating URLs to the asset on the server, or by downloading. 

    return job;
}

</code></pre>


<h2><a name="manage-asset"> </a><span class="short header">Manage Assets</span>How to: Manage Assets in storage</h2>

After you create media assets and upload them to Media Services, you can access and manage the assets on the server. You can also manage other objects on the server that are part of Media Services, including jobs, tasks, access policies, locators, and more.

The following example shows how to query for and return a reference to an asset , when you have an Id for the asset. 
<pre><code>
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

To list all assets that you have available on the server, you can use code similar to the following example. Iterate through the assets collection, and optionally, you can display details about each asset.
<pre><code> 
static void ListAssets()
{
    string waitMessage = "Building the list. This may take a few "
        + "seconds to a few minutes depending on how many assets "
        + "you have."
        + Environment.NewLine + Environment.NewLine
        + "Please wait..."
        + Environment.NewLine;
    Console.Write(waitMessage);

    // Create a Stringbuilder to store the list that we build. 
    StringBuilder builder = new StringBuilder();

    foreach (IAsset asset in _context.Assets)
    {
        // Display the collection of assets.
        builder.AppendLine("");
        builder.AppendLine("******ASSET******");
        builder.AppendLine("Asset ID: " + asset.Id);
        builder.AppendLine("Name: " + asset.Name);
        builder.AppendLine("==============");
        builder.AppendLine("******ASSET FILES******");

        // Display the files associated with each asset. 
        foreach (IAssetFile fileItem in asset.AssetFiles)
        {
            builder.AppendLine("Name: " + fileItem.Name);
            builder.AppendLine("Size: " + fileItem.ContentFileSize);
            builder.AppendLine("==============");
        }
    }

    // Display output in console.
    Console.Write(builder.ToString());
}
</code></pre>
The following example deletes all the assets from the collection.
<pre><code>
foreach (IAsset asset in _context.Assets)
{
    asset.Delete();
}
</code></pre>

For more information, see [Manage Assets](http://msdn.microsoft.com/en-us/library/jj129589.aspx).

<h2><a name="download-asset"> </a><span class="short header">Deliver an Asset by download</span>How to: Deliver an Asset by download</h2>

This section shows options for delivering media assets that you have previously added to Media Services. You can deliver Media Services content in numerous application scenarios. You can download media assets, or access them by using locator URLs (these are the delivery scenarios described in this topic). You can send media content to another application or to another content provider. For improved performance and scalability, you can also deliver content by using a Content Delivery Network (CDN), such as the Windows Azure CDN.

The code example in this section shows how to download media assets from Media Services. You can pass in an existing job reference, and then access its **OutputMediaAssets** collection (which is the set of one or more output media assets that results from running a job). This code example shows how to download output media assets from a job, but you can apply the same approach to download other assets.

<pre><code> 
static IAsset DownloadAssetToLocal( string jobId, string outputFolder)
{
    // This method illustrates how to download a single asset. 
    // However, you can iterate through the OutputAssets
    // collection, and download all assets if there are many. 

    // Get a reference to the job. 
    IJob job = GetJob(jobId);
    // Get a reference to the first output asset. If there were multiple 
    // output media assets you could iterate and handle each one.
    IAsset outputAsset = job.OutputMediaAssets[0];

    // Download all files in the output asset. 
    Console.WriteLine("Downloads are in progress, please wait.");
    Console.WriteLine();

    foreach (IAssetFile outputFile in outputAsset.AssetFiles)
    {
        // Use the following event handler to check download progress.
        outputFile.DownloadProgressChanged += DownloadProgress;

        string localDownloadPath = Path.Combine(outputFolder, outputFile.Name);

        Console.WriteLine("File download path:  " + localDownloadPath);

        outputFile.DownloadAsync(Path.GetFullPath(localDownloadPath), CancellationToken.None).Wait();

        outputFile.DownloadProgressChanged -= DownloadProgress;
    }

    return outputAsset;
}

static void DownloadProgress(object sender, DownloadProgressChangedEventArgs e)
{
    Console.WriteLine(string.Format("{0} % download progress. ", e.Progress));
}
</code></pre>
<h2><a name="stream-asset"> </a><span class="short header">Deliver smooth streaming content</span>How to: Deliver streaming content</h2>

In addition to downloading media content from Media Services, you can use adaptive bitrate streaming to deliver content. For example, you can create a direct URL, called a locator, to streaming content on a Media Services origin server. Client applications such as Microsoft Silverlight can play the streaming content directly if you provide the locator.

The following code example shows the necessary steps to create an origin locator for an output asset produced by a job. The example assumes that you have already obtained a reference to an asset that contains smooth streaming files, and the variable named **assetToStream** is referenced in the code. After you have run this code to generate an origin locator on the asset, you should be able to use the resulting locator URL to directly play back the streaming content in a streaming client player such as Silverlight.

To create an origin locator to streaming content, follow these steps:

   1. Get a reference to the streaming manifest file in the asset. This is the file with the .ism extension.
   2. Define an access policy. This is how you determine the type of permissions and the duration for accessing an asset.
   3. Create the origin locator by calling the CreateLocator method (var originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, assetToStream, policy, DateTime.UtcNow.AddMinutes(-5))). Pass to the method an existing asset with streaming media files, an access policy, and a start time.
   4. Build a URL to the manifest file. To do this, add the manifest file name, followed by the string **/manifest** to the locator **Path** property.

The following code shows how to implement the steps:
<pre><code>
private static ILocator GetStreamingOriginLocator( string targetAssetID)
{
    // Get a reference to the asset you want to stream.
    IAsset assetToStream = GetAsset(targetAssetID);

    // Get a reference to the streaming manifest file from the  
    // collection of files in the asset. 
    var theManifest =
                        from f in assetToStream.AssetFiles
                        where f.Name.EndsWith(".ism")
                        select f;
    // Cast the reference to a true IAssetFile type. 
    IAssetFile manifestFile = theManifest.First();
    IAccessPolicy policy = null;
    ILocator originLocator = null;
            
    // Create a 30-day readonly access policy. 
    policy = _context.AccessPolicies.Create("Streaming policy",
        TimeSpan.FromDays(30),
        AccessPermissions.Read);

    // Create a locator to the streaming content on an origin. 
    originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, assetToStream,
        policy,
        DateTime.UtcNow.AddMinutes(-5));
            
    // Display some useful values based on the locator.
    // Display the base path to the streaming asset on the origin server.
    Console.WriteLine("Streaming asset base path on origin: ");
    Console.WriteLine(originLocator.Path);
    Console.WriteLine();
    // Create a full URL to the manifest file. Use this for playback
    // in streaming media clients. 
    string urlForClientStreaming = originLocator.Path + manifestFile.Name + "/manifest";
    Console.WriteLine("URL to manifest for client streaming: ");
    Console.WriteLine(urlForClientStreaming);
    Console.WriteLine();
    // Display the ID of the origin locator, the access policy, and the asset.
    Console.WriteLine("Origin locator Id: " + originLocator.Id);
    Console.WriteLine("Access policy Id: " + policy.Id);
    Console.WriteLine("Streaming asset Id: " + assetToStream.Id);

    // Return the locator. 
    return originLocator;
}
</code></pre>

<h2><a name="stream-HLS"> </a><span class="short header">Deliver Apple HLS streaming content</span>How to: Deliver Apple HLS streaming content</h2>

A previous section shows how to create a locator to streaming media content on a Media Services origin server. This section shows how to create a locator to Apple HTTP Live Streaming (HLS) content on a Media Services origin server. Using this approach, you can build a URL to Apple HLS content, and provide it to Apple iOS devices for playback. The basic approach to building the locator URL is the same. Build a locator to the Apple HLS streaming asset path on an origin server, and then build a full URL that links to the manifest for the streaming content.

The following code example assumes that you have already obtained a reference to an HLS streaming asset, and the variable named **assetToStream** is referenced in the code. After you have run this code to generate an origin locator on the asset, you can use the resulting URL to play back the streaming content in an iOS device such as an IPAD or an IPhone.

To build a locator to Apple HLS streaming content, perform these steps as shown in the code example:

   1. Get a reference to the manifest file in the asset.
   2. Define an access policy.
   3. Create the origin locator by calling the CreateLocator method (var originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, assetToStream, policy, DateTime.UtcNow.AddMinutes(-5))). Pass to the method an existing HLS asset with streaming media files, an access policy, and a start time.
   4. Build a URL to the manifest file. To do this, add the manifest file name, followed by the string **/manifest(format=m3u8-aapl)** to the locator **Path** property.

The following code shows how to implement the steps:

<pre><code>
static ILocator GetStreamingHLSOriginLocator( string targetAssetID)
{
    // Get a reference to the asset you want to stream.
    IAsset assetToStream = GetAsset(targetAssetID);

    // Get a reference to the HLS streaming manifest file from the  
    // collection of files in the asset. 
    var theManifest =
                        from f in assetToStream.AssetFiles
                        where f.Name.EndsWith(".ism")
                        select f;
    // Cast the reference to a true IAssetFile type. 
    IAssetFile manifestFile = theManifest.First();
    IAccessPolicy policy = null;
    ILocator originLocator = null;

    // Create a 30-day readonly access policy. 
    policy = _context.AccessPolicies.Create("Streaming HLS Policy",
        TimeSpan.FromDays(30),
        AccessPermissions.Read);

    originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, assetToStream,
                policy,
                DateTime.UtcNow.AddMinutes(-5));

    // Create a URL to the HLS streaming manifest file. Use this for playback
    // in Apple iOS streaming clients.
    string urlForClientStreaming = originLocator.Path
        + manifestFile.Name + "/manifest(format=m3u8-aapl)";
    Console.WriteLine("URL to manifest for client streaming: ");
    Console.WriteLine(urlForClientStreaming);
    Console.WriteLine();

    // Return the locator. 
    return originLocator;
}
</code></pre>

For more information, see [Deliver Assets](http://msdn.microsoft.com/en-us/library/jj129575.aspx).

<h2><a name="enable-cdn"> </a><span class="short header">Enable Windows Azure CDN support</span>How to: Enable Windows Azure CDN support</h2>

You can use a Content Delivery Network (CDN) to improve performance, scalability, and availability of content provided over the Internet. This section describes how to enable a Windows Azure CDN with a Media Services origin server.

###Prerequisites

You must have a Windows Azure CDN configured for an existing Windows Azure Storage account.  See the following topic:  [Getting Started with the Windows Azure CDN][]. 


###Enabling a Windows Azure CDN for Media Services

*After you follow these setup steps, expect a two to three-week delay before your Windows Azure CDN endpoint is enabled.  You will receive a confirmation email when the endpoint is enabled.  For updates on the status of Media Services including the Windows Azure CDN capability, see the [Media Services Forum][].*

To enable your Windows Azure CDN endpoint with a Media Services origin, send email to [MediaServices@Microsoft.com][] and include the following information:

-   Your Media Services account name (you created this account when you followed the directions in the section [Setting Up a Windows Azure Account for Media Services][]).
-   Your Windows Azure CDN endpoint that has been configured against an existing Windows Azure Storage account.   You can get your endpoint by following these steps:
    1. Log into the [Windows Azure Management Portal][].
    2. In the navigation pane, click the option for **Hosted Services, Storage Accounts & CDN**. 
    3. In the upper part of the navigation pane, click **CDN** (you may have to scroll to find this option). 
    4. Select the CDN endpoint associated with the storage account.  
    5. In the **Properties** for the CDN endpoint, copy the value for the **Default HTTP endpoint**.  This is the value to supply in your email.  

<h2><a name="next-steps"> </a><span class="short header">Next steps</span>Next steps</h2>

Now that you have learned how to set up for Media Services development and perform some typical programming tasks, see the following resources to learn more about building Media Services applications.

-   [Windows Azure Media Services Documentation][]
-   [Getting Started with the Media Services SDK for .NET][]
-   [Building Applications with the Media Services SDK for .NET][]
-   [Building Applications with the Windows Azure Media Services REST API][]
-   [Media Services Forum][]
-	[How to Monitor a Media Services Account](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-monitor-a-media-services-account/)
-	[How to Manage Content in Media Services](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-manage-content-in-media-services/)


<!-- Reusable paths. -->

  <!-- Anchors. -->
  [What Are Media Services?]: #what-are
  [Setting Up a Windows Azure Account for Media Services]: #setup-account
  [Setting up for Media Services Development]: #setup-dev
  [How to: Connect to Media Services Programmatically]: #connect
  [How to: Create an Encrypted Asset and Upload to Storage]: #create-asset
  [How to: Get a Media Processor Instance]: #get-mediaproc
  [How to: Check Job Progress]: #check-job-progress
  [How to: Encode an Asset]: #encode-asset
  [How to: Protect an Asset with PlayReady Protection]: #playready
  [How to: Manage Assets in Storage]: #manage-asset
  [How to: Deliver an Asset by Download]: #download-asset
  [How to: Deliver Streaming Content]: #stream-asset
  [How to: Deliver Apple HLS Streaming Content]: #stream-HLS
  [How to: Enable Windows Azure CDN]: #enable-cdn
  [Next Steps]: #next-steps

  <!-- URLs. -->
  [Building Applications with the Windows Azure Media Services REST API]: http://go.microsoft.com/fwlink/?linkid=252967
  [Open Data Protocol]: http://odata.org/
  [WCF Data Services 5.0 for OData v3]: http://www.microsoft.com/download/en/details.aspx?id=29306
  [Windows Azure Marketplace]: https://datamarket.azure.com/
  [Media Services Client Development]: http://social.msdn.microsoft.com/Forums/en-US/MediaServices/thread/e9092ec6-2dfc-44cb-adce-1dc935309d2a
  [Media Services Preview:  Supported Features]: http://social.msdn.microsoft.com/Forums/en-US/MediaServices/thread/eb946433-16f2-4eac-834d-4057335233e0
  [Media Services Upcoming Releases:  Planned Feature Support]: http://social.msdn.microsoft.com/Forums/en-US/MediaServices/thread/431ef036-0939-4784-a939-0ecb31151ded
  [Media Services Preview Account Setup]: http://go.microsoft.com/fwlink/?linkid=247287
  [Windows Azure Media Services SDK for .NET]: http://go.microsoft.com/fwlink/?LinkID=256500
  [Web Platform Installer]: http://go.microsoft.com/fwlink/?linkid=255386
  [Installing the Windows Azure SDK on Windows 8]: http://www.windowsazure.com/en-us/develop/net/other-resources/windows-azure-on-windows-8/
  [Windows Azure Media Services Documentation]: http://go.microsoft.com/fwlink/?linkid=245437
  [Getting Started with the Windows Azure CDN]: http://msdn.microsoft.com/en-us/library/windowsazure/ff919705.aspx
  [Media Services Forum]: http://social.msdn.microsoft.com/Forums/en-US/MediaServices/threads
  [Getting Started with the Media Services SDK for .NET]: http://go.microsoft.com/fwlink/?linkid=252966
  [Building Applications with the Media Services SDK for .NET]: http://go.microsoft.com/fwlink/?linkid=247821
  [Windows Azure Management Portal]: https://manage.windowsazure.com/
  [How to Create a Media Services Account]: http://go.microsoft.com/fwlink/?linkid=256662
  [Supported File Types for Media Services]: http://msdn.microsoft.com/en-us/library/hh973634

  <!-- Email. -->
  [MediaServices@Microsoft.com]: mailto:MediaServices@Microsoft.com

  <!-- Images. -->
  [Media Services Architecture]: ../../../DevCenter/dotNet/Media/wams-01.png
  [Visual Studio Project Setup]: ../../../DevCenter/dotNet/Media/wams-02.png


