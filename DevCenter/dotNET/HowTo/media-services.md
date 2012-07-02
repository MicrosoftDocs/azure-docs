

#How to Use Media Services

This guide shows you how to start programming with Windows Azure Media Services. The guide includes a technical overview of Media Services, steps to configure your Windows Azure account for Media Services, a setup guide for development, and topics that show how to accomplish typical programming tasks. The scenarios demonstrated include: uploading assets, encrypting or encoding assets, and delivering assets by downloading or by generating URLs for streaming content. The samples are written in C# and use the Media Services SDK for .NET. For more information on Windows Azure Media Services, refer to the [Next Steps][] section.

You can also program Media Services using the OData-based REST APIs. You can build an application making REST API calls to Media Services from .NET languages or other programming languages. For a full documentation series on programming with the Media Services REST API, see [Building Applications with the Windows Azure Media Services REST API](http://go.microsoft.com/fwlink/?linkid=252967). To start programming with REST, first enable your Windows Azure account for Media Services as described in the section [Setting Up a Windows Azure Account for Media Services][].

## Table of Contents

-   [What Are Media Services?][]
-   [Setting Up a Windows Azure Account for Media Services][]
-   [Setting up for Media Services Development][]
-   [How to: Connect to Media Services Programmatically][]
-   [How to: Create an Encrypted Asset and Upload to Storage][]
-   [How to: Get a Media Processor Instance][]
-   [How to: Encode an Asset][]
-   [How to: Protect an Asset with PlayReady Protection][]
-   [How to: Manage Assets in Storage][]
-   [How to: Deliver an Asset by Download][]
-   [How to: Deliver Streaming Content][]
-   [How to: Deliver Apple HLS Streaming Content][]
-   [How to: Enable Windows Azure CDN][]
-   [Next Steps][]


## <a name="what-are"> </a>What Are Media Services?
Windows Azure Media Services form an extensible media platform that integrates the best of the Microsoft Media Platform and third-party media components in Windows Azure. Media Services provide a media pipeline in the cloud that enables industry partners to extend or replace component technologies. ISVs and media providers can use Media Services to build end-to-end media solutions. This overview describes the general architecture and common development scenarios for Media Services.

The following diagram illustrates the basic Media Services architecture.

![Media Services Architecture][]

###Development Scenarios
Media Services support several common media development scenarios as described in the following table:
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

<br />

###Building Media Services Applications

When you build Media Services applications, there are several architectural details to understand concerning what kind of application you plan to build, how you will access Media Services programmatically, and what is the basic programming model of a Media Services application.

####Media Services Developers
Media Services developers typically fit into two groups. 

* **Independent Software Vendors** (ISVs).  ISVs build end-to-end media management services. These services may be used by media production companies, large content delivery providers, or consumers who directly access media applications. ISVs can programmatically connect to Media Services by using [Open Data Protocol][] (OData) 3.0 to call the REST API layer directly, or by using the Media Services SDK for .NET (the SDK simplifies the process of making calls to the REST API layer). OData is installed with [WCF Data Services 5.0 for OData v3][]. 
* **Partners**. Partners build Media Services add-on components that run as part of the Media Services platform. Partners can also use the [Windows Azure Marketplace][] to market their components. These add-ons can be used by ISVs as they develop their end-to-end services. A special Media Services Platform SDK is available for building add-on components.

####The Media Services REST API
The REST API is the public, programmatic interface for accessing Media Services. REST (for Representational State Transfer) is an architectural strategy for building networked client-server applications. Machines in a REST application use HTTP requests to carry out typical data operations such as reading (equivalent to a GET), writing (equivalent to a POST), or deleting data over the network. As a Media Services developer, your application calls into Media Services by using the REST API. As described earlier, ISVs will call into the REST API by using OData 3.0, or by using the Media Services SDK.

####Workflow of a Media Management Application
In a typical media management application, there are four basic types of operations for working with media assets, and these operations make up the application workflow. Media Services provide full support for each operation in this workflow.  

* **Ingest**. Ingest operations bring assets into the system, for example by uploading them and encrypting them before they are placed into Windows Azure Storage. By the RTM release, Media Services will offer integration with partner components to provide fast UDP (User Datagram Protocol) upload solutions.
* **Process**. Processing operations involve various types of encoding, transforming, and converting tasks that you perform on media assets. 
* **Manage**. Management operations involve working with assets that are already in Media Services. This includes listing and tagging media assets, deleting assets, editing assets, managing asset keys, DRM key management, analytics, and more. 
* **Deliver**. Delivery operations transfer media content out of Media Services. This includes streaming content live or on demand to clients, retrieving or downloading specific media files from the cloud, or deploying media assets to other servers, such as a CDN caching location in Windows Azure. 


####Entities in Media Services
When you access Media Services programmatically through the REST API (using OData or using the Media Services SDK), you can see several fundamental entities for working with media content. The following table summarizes the main Media Services entities.

<table border="2" cellspacing="0" cellpadding="5" style="border: 2px solid #000000;">
  <thead>
    <tr>
       <th>Entity</th>
       <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>Asset</td>
        <td>An asset is a virtual entity that holds metadata about media. An asset may contain one or many files.</td>
    </tr>
    <tr>
        <td>File</td>
        <td>A file is an actual video or audio blob object on the file system or on a remote server. A file is always associated with an asset, and an asset may contain one or many files.</td>
    </tr>
    <tr>
        <td>Job</td>
        <td>A job is an entity that holds metadata about tasks. The tasks perform work on assets and files, and a job can create new assets or files. A job always has one or more associated tasks.</td>
    </tr>
    <tr>
        <td>Task</td>
        <td>A task is an individual operation of work on an asset or file. A task is associated with a job.</td>
    </tr>
    <tr>
        <td>Access policy</td>
        <td>An access policy defines the permissions to a file or an asset (what type of access, and the duration).</td>
    </tr>
    <tr>
        <td>Locator</td>
        <td>A locator is a URI that provides time-based access to a specific asset. A locator gives you direct access to files stored in the Windows Azure Blobs service, an origin streaming server locator, or a CDN locator.</td>
    </tr>
    <tr>
        <td>Job template</td>
        <td>A job template provides reusable settings for jobs that need to be run repeatedly.</td>
    </tr>
    <tr>
        <td>Task template</td>
        <td>A task template provides reusable settings for tasks that you want to run repeatedly. Each job template has a collection of task templates.</td>
    </tr>
    <tr>
        <td>Content key</td>
        <td>A content key provides secure access to an asset. It also provides encryption keys used for storage encryption, MPEG Common Encryption, or PlayReady encryption.</td>
    </tr>
  </tbody>
</table>

<br />

###Additional Media Services Development Information

For more information about Media Services features and development scenarios, see the following pages in the Media Services forum:

-   [Media Services Client Development][]
-   [Media Services Preview:  Supported Features][]
-   [Media Services Upcoming Releases:  Planned Feature Support][]


## <a name="setup-account"> </a>Setting Up a Windows Azure Account for Media Services

To set up your Media Services account, you can use one of the following options:

-   Use the Windows Azure Management Portal (recommended). See the topic [How to Create a Media Services Account][]. After creating your account in the Management Portal, you are ready to set up your computer for Media Services development. 

-   Use a manual setup process with Powershell scripts. This option is also helpful for users who want to automate the account setup process. For more information see [Media Services Preview Account Setup][].


## <a name="setup-dev"> </a>Setting up for Media Services Development
This section contains general prerequisites for Media Services development using the Media Services SDK for .NET. It also shows developers how to create a Visual Studio application for Media Services SDK development. 

###Prerequisites

-   Operating Systems: Windows 7 or Windows 2008 R2. You can also use Windows 8, but this requires special setup steps. See the Windows Azure SDK prerequisite.
-   .NET Framework 3.5 SP1, and .NET Framework 4. In the current release both versions need to be present on your machine for compatibility with all required SDK packages.
-   VS 2010 SP1 (Professional, Premium, or Ultimate). You can develop Media Services client applications by using the Media Services SDK with Windows 8, Visual Studio 2010, and .NET 4.  To do this, see the Windows Azure SDK prerequisite. 
-   A Windows Azure account with Media Services enabled. See the section [Setting Up a Windows Azure Account for Media Services][].
-   Windows Azure SDK 1.6 (November 2011)
    - To install, open the [Web Platform Installer][]. On the **Products** tab select **All**, then find and install the **Windows Azure SDK 1.6 for Visual Studio 2010 (November 2011)**.
    - You can optionally install Windows Azure SDK 1.7 (June 2012) on the same machine as Windows Azure SDK 1.6 (November 2011). 
    - For Windows 8 development, see [Installing the Windows Azure SDK on Windows 8][].
-   [Windows Azure Media Services SDK for .NET][]
    - Remove any previous versions of the Media Services SDK before installing the current release.
-   [WCF Data Services 5.0 for OData v3][]


###Creating an Application in Visual Studio

This section shows you how to create a project in Visual Studio and set it up for Media Services development.  In this case the project is a C# Windows console application, but the same setup steps shown here apply to other types of projects you can create for Media Services applications (for example, a Windows Forms application or an ASP.NET Web application).

   1. In Visual Studio, create a new C# Windows console application based on .NET Framework 4.0. Enter the **Name**, **Location**, and **Solution name**, and then click **OK**.

   ![Visual Studio Project Setup][]

   2. In **Solution Explorer**, right-click on the project node, select **Properties**, and then in the **Application** properties, set the **Target Framework** setting to *.NET Framework 4*.
   3. Add a project reference to the following Windows Azure SDK storage client assembly. To add an assembly, in **Solution Explorer** right-click the **References** node for your project. Select **Add Reference**, then browse to the desired assembly (or assemblies), select, and click **OK**.
   <br />
   Default installation path:  C:\Program Files\Windows Azure SDK\v1.6\bin\
   - Microsoft.WindowsAzure.StorageClient.dll
   4. Add references to the following assemblies from WCF Data Services.
   <br />
   Default installation path:  C:\Program Files (x86)\Microsoft WCF Data
   - Microsoft.Data.Edm.dll
   - Microsoft.Data.OData.dll
   - Microsoft.Data.Services.Client.dll
   - Microsoft.Data.Services.dll
   - System.Spatial.dll
   5. Add a reference to the following assembly from the Media Services SDK.
   <br />
   Default installation path:  C:\Program Files (x86)\Microsoft SDKs\Windows Azure Media Services\Services SDK\v1.0\
   - Microsoft.WindowsAzure.MediaServices.Client.dll
   6. Add a reference to the .NET Framework 4 assembly named System.Configuration. You can find this assembly on the **.NET** tab of the **Add References** dialog.
   7. Add the following using statement to the top of any code modules (before the namespace declaration) to reference the required namespaces for the Media Services SDK.

   using Microsoft.WindowsAzure.MediaServices.Client;

At this point, you are ready to start developing a Media Services application.    
   

## <a name="connect"> </a>How to: Connect to Media Services Programmatically

Nearly everything you do in Media Services programming requires you to have a reference to the server context object. The server context gives you programmatic access to all Media Services programming objects.

To get a reference to the server context, return a new instance of the context type as in the following code example. Pass your Media Services account name and account key (which you obtained during the account setup process) to the constructor. 

	static CloudMediaContext GetContext()
	{
	    // Gets the service context. 
	    return new CloudMediaContext(_accountName, _accountKey);
	} 

It is often useful to define a module-level variable of type **CloudMediaContext** to hold a reference to the server context returned by a method such as **GetContext**. The rest of the code examples in this topic use a variable called **_context** to refer to the server context. 


## <a name="create-asset"> </a>How to: Create an Encrypted Asset and Upload to Storage

To get media content into Media Services, first create an asset and add files to it, and then upload the asset. This process is also called ingesting content. You can create an asset, add files, and upload it with a single line of code as in the following example. To encrypt an asset for transport and storage to protect its contents, pass the parameter **AssetCreationOptions.StorageEncrypted** to the method. To keep the asset unencrypted, pass the parameter **AssetCreationOptions.None** to the method.

The following line of code creates an asset with a single file, encrypts the asset for storage and transport, and uploads the asset to the server.

	IAsset theAsset = _context.Assets.Create(inputMediaFilePath,
	    AssetCreationOptions.StorageEncrypted);


## <a name="get-mediaproc"> </a>How to: Get a Media Processor Instance

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
        <td>PlayReady Protection Task</td>
        <td>Lets you encrypt media assets using PlayReady Protection.</td>
    </tr>
    <tr>
        <td>MP4 to Smooth Streams Task</td>
        <td>Lets you convert media assets from .mp4 to smooth streaming format.</td>
    </tr>
    <tr>
        <td>Smooth Streams to HLS Task</td>
        <td>Lets you convert media assets from smooth streaming to the Apple HTTP Live Streaming (HLS) format.</td>
    </tr>
    <tr>
        <td>Storage Decryption</td>
        <td>Lets you decrypt media assets that were encrypted using storage encryption.</td>
    </tr>
  </tbody>
</table>

<br />

To create a media processor instance, create a method like the following example, and pass to it the string name of one of the listed media processors. The code example assumes the use of a module-level variable named **_context** to reference the server context as described in the section [How to: Connect to Media Services Programmatically][].

	private static IMediaProcessor GetMediaProcessor(string mediaProcessor)
	{
	    // Query for a media processor to get a reference.
	    var theProcessor =
	                        from p in _context.MediaProcessors
	                        where p.Name == mediaProcessor
	                        select p;
	    // Cast the reference to an IMediaprocessor.
	    IMediaProcessor processor = theProcessor.First();
	
	    if (processor == null)
	    {
	        throw new ArgumentException(string.Format(System.Globalization.CultureInfo.CurrentCulture,
	            "Unknown processor",
	            mediaProcessor));
	    }
	    return processor;
	}

## <a name="encode-asset"> </a>How to: Encode an Asset

For media content on the server, you can encode the content with a number of media encodings and formats using Windows Azure Media Encoder. You can also use an encoder provided by a Media Services partner; third-party encoders are available through the [Windows Azure Marketplace][]. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. 

The following steps are required to encode media content using the Media Encoder:

   1. Create an asset (or reference an existing asset).
   2. Declare a new job, using the **Jobs.Create** method.
   3. Declare a media processor to process the job. To do this, implement a method such as the **GetMediaProcessor** method shown in the section [How to: Get a Media Processor Instance][]. In this example, the code uses the Windows Azure Media Encoder to encode the input media file.
   4. Declare a task. To declare a task, you must give the task a friendly name, and then pass to it a media processor instance, a configuration string for handling the processing job, and a **TaskCreationOptions** setting (which specifies whether to encrypt the configuration data).  In this example, the code uses a preset configuration string to tell Media Encoder how to encode the asset. Also in this task example, the code sets **TaskCreationOptions.None** meaning that the configuration data is not encrypted.
   5. Specify an input asset for the task. In this example, the input asset is the one that the code creates in the first step.
   6. Specify an output asset for the task. By default, all assets are created as encrypted for transport and storage in Media Services. To output a clear, unencrypted asset for playback, the code specifies **AssetCreationOptions.None**.
   7. Submit the job. To access the output of a job, reference the job.OutputMediaAssets collection. See the section [How to: Deliver an Asset by Download][].

The following method combines the previous steps to encode a media file:

    static void CreateEncodingJob(string inputMediaFilePath) 
	{ 
	    //Create an encrypted asset and upload to storage. 
	    IAsset asset = _context.Assets.Create(inputMediaFilePath,
	        AssetCreationOptions.StorageEncrypted);
	
	    // Declare a new job.
	    IJob job = _context.Jobs.Create("My encoding job");
	    // Get a media processor reference, and pass to it the name of the 
	    // processor to use for the specific task. Use a method like the 
	    // GetMediaProcessor method shown in this document.
	    IMediaProcessor processor = GetMediaProcessor("Windows Azure Media Encoder");
	    // Create a task with the encoding details, using a string preset.
	    ITask task = job.Tasks.AddNew("My encoding task", 
	        processor, 
	        "H.264 256k DSL CBR", 
	        TaskCreationOptions.None);
	    // Specify the input asset to be encoded.
	    task.InputMediaAssets.Add(asset);
	    // Add an output asset to contain the results of the job. 
	    // This output is specified as AssetCreationOptions.None, which 
	    // means the output asset is in the clear (unencrypted). 
	    task.OutputMediaAssets.AddNew("Output asset",
	        true,
	        AssetCreationOptions.None);

	    // Launch the job. 
	    job.Submit();
	}


## <a name="playready"> </a>How to: Protect an Asset with PlayReady Protection

In Media Services you can submit a job that integrates with Microsoft PlayReady Protection to encrypt a set of media files. The code in this section takes several streaming files from an input folder, creates a task and encrypts them with PlayReady Protection. 

There are several required steps to create a simple job to provide PlayReady Protection.

   1. It shows how to retrieve configuration data. You can get example configuration files from the task preset reference material in the [Windows Azure Media Services Documentation][].
   2. It creates an asset. The  **_context.Assets.CreateFromDirectory** method used in the example requires you to specify a primary file from a directory of files that you want to encrypt. A primary file is required for media file types that use a manifest (for example, streaming files), or for media files that have external linked resources (for example, QuickTime files).
   3. The code gets a media processor for PlayReady Protection processing, as described in the section [How to: Get a Media Processor Instance][].
   4. The code creates a job, and then creates a task that specifies the use of protected configuration (**TaskCreationOptions.ProtectedConfiguration**). This protects the data in the configuration file by encrypting it.

The following code example shows how to implement the steps:

	static void CreatePlayReadyProtectionJob(string configFilePath,
	    string inputFolder,
	    string primaryFilePath)
	{
	    // Read the encryption configuration data into a string. 
	    string configuration = File.ReadAllText(Path.GetFullPath(configFilePath + @"\PlayReady Protection.xml"));
	
	    // Create an asset from a directory of streaming input files, 
	    // and encrypt the asset.
	    IAsset asset = _context.Assets.CreateFromDirectory(inputFolder,
	        primaryFilePath,
	        AssetCreationOptions.StorageEncrypted);
	
	    // Declare a new job.
	    IJob job = _context.Jobs.Create("My first PlayReady Protection Job");
	    // Get a media processor reference, and pass to it the name of the 
	    // processor to use for the specific task.
	    IMediaProcessor processor = GetMediaProcessor("PlayReady Protection Task");
	
	    // Create a task and run a job using PlayReady Protection to encrypt the asset.
	    // The TaskCreationOptions parameter lets you specify encryption options for
	    // the task configuration data. 
	    //      None:  no encryption.
	    //      ProtectedConfiguration: encrypts the task configuration data before 
	    //        upload. 
	    ITask task = job.Tasks.AddNew("My PlayReady Protection Task",
	        processor, 
	        configuration,
	        TaskCreationOptions.ProtectedConfiguration);
	
	    // Specify the input asset to be encoded.
	    task.InputMediaAssets.Add(asset);
	    // Add an output asset to contain the results of the job. Since the
	    // asset is already protected with PlayReady, we won't encrypt. 
	    task.OutputMediaAssets.AddNew("Output asset", 
	        true, 
	        AssetCreationOptions.None);
	
	    // Launch the job. 
	    job.Submit();
	}



## <a name="manage-asset"> </a>How to: Manage Assets in Storage

After you create media assets and upload them to Media Services, you can access and manage the assets on the server. You can also manage other objects on the server that are part of Media Services, including jobs, tasks, access policies, locators, and more.

The following example shows how to query for and return a reference to an asset , when you have an Id for the asset. 

	static IAsset GetAsset(string assetId)
	{
	    // Use a LINQ Select query to get the asset 
	    // from the context assets collection.
	    var asset =
	        from a in _context.Assets
	        where a.Id == assetId
	        select a;
	    // Reference the asset as an IAsset.
	    IAsset theAsset = asset.FirstOrDefault();
	}


To delete an asset, call the **Delete** method on the collection of assets. You can also call **Delete** methods on objects in other collections, such as jobs.

	_context.Assets.Delete(asset);

To list all assets that you have available on the server, you can use code similar to the following example. Iterate through the assets collection, and optionally, you can display details about each asset.

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
	        foreach (IFileInfo fileItem in asset.Files)
	        {
	            builder.AppendLine("Name: " + fileItem.Name);
	            builder.AppendLine("Size: " + fileItem.ContentFileSize);
	            builder.AppendLine("==============");
	        }
	    }
	
	    // Display output in console.
	    Console.Write(builder.ToString());
	}



## <a name="download-asset"> </a>How to: Deliver an Asset by Download

This section shows options for delivering media assets that you have previously added to Media Services. You can deliver Media Services content in numerous application scenarios. You can download media assets, or access them by using locator URLs (these are the delivery scenarios described in this topic). You can send media content to another application or to another content provider. For improved performance and scalability, you can also deliver content by using a Content Delivery Network (CDN), such as the Windows Azure CDN.

The code example in this section shows how to download media assets from Media Services. You can pass in an existing job reference, and then access its **OutputMediaAssets** collection (which is the set of one or more output media assets that results from running a job). This code example shows how to download output media assets from a job, but you can apply the same approach to download other assets.

	static void DownloadAssetToLocal(IJob job, string outputFolder)
	{
	    // Get a reference to the first output asset.  You could also 
	    // iterate through the OutputMediaAssets here and handle each one.
	    IAsset outputAsset = job.OutputMediaAssets[0];
	
	    // There will be a wait time while your files download.
	    Console.WriteLine();
	    Console.WriteLine("Files are downloading...please wait.");
	    Console.WriteLine();
	
	    // Download all files in the output asset, and display the 
	    // output path for each file.
	    foreach (IFileInfo outputFile in outputAsset.Files)
	    {
	        // Download the output file, which contains encoded contents. 
	        string localDownloadPath = Path.GetFullPath(outputFolder + @"\" + outputFile.Name);
	        Console.WriteLine("File is downloading to:  " + localDownloadPath);
	        outputFile.DownloadToFile(Path.GetFullPath(outputFolder + @"\" + outputFile.Name));
	        Console.WriteLine();
	    }
	}


## <a name="stream-asset"> </a>How to: Deliver Streaming Content

In addition to downloading media content from Media Services, you can use adaptive streaming to deliver content. For example, you can create a direct URL, called a locator, to streaming content on a Media Services origin server. Client applications such as Microsoft Silverlight can play the streaming content directly if you provide the locator.

The following code example shows the necessary steps to create an origin locator for an output asset produced by a job. The example assumes that you have already obtained a reference to an asset that contains smooth streaming files, and the variable named **assetToStream** is referenced in the code. After you have run this code to generate an origin locator on the asset, you should be able to use the resulting locator URL to directly play back the streaming content in a streaming client player such as Silverlight.

To create an origin locator to streaming content, follow these steps:

   1. Get a reference to the streaming manifest file in the asset. This is the file with the .ism extension.
   2. Define an access policy. This is how you determine the type of permissions and the duration for accessing an asset.
   3. Create the origin locator by calling the **CreateOriginLocator** method. Pass to the method an existing asset with streaming media files, an access policy, and a start time. The URL returned by the **CreateOriginLocator** method is only the base path to the asset. To construct a full URL to the streaming manifest file, you must complete the following step.
   4. Build a URL to the manifest file. To do this, add the manifest file name, followed by the string **/manifest** to the locator **Path** property.

The following code shows how to implement the steps:

	static void GetStreamingOriginLocator(IAsset assetToStream)
	{
	    // Get a reference to the manifest file from the collection 
	    // of streaming files in the asset. 
	    var theManifest  =
	                        from f in assetToStream.Files 
	                        where f.Name.EndsWith(".ism")
	                        select f;
	    // Cast the reference to a true IFileInfo type. 
	    IFileInfo manifestFile = theManifest.First();
	
	    // Create an 1-day readonly access policy. 
	    IAccessPolicy streamingPolicy = _context.AccessPolicies.Create("Streaming policy", 
	        TimeSpan.FromDays(1), 
	        AccessPermissions.Read);
	        
	    // Create the origin locator. Set the start time as 5 minutes 
	    // before the present so that the locator can be accessed immediately 
	    // if there is clock skew between the client and server.
	    ILocator originLocator = _context.Locators.CreateOriginLocator(assetToStream, 
	        streamingPolicy, 
	        DateTime.UtcNow.AddMinutes(-5));
	    
	    // Create a full URL to the manifest file. Use this for playback
	    // in streaming media clients. 
	    string urlForClientStreaming = originLocator.Path + manifestFile.Name + "/manifest";
	    
	    // Display the full URL to the streaming manifest file.
	    Console.WriteLine("URL to manifest for client streaming: ");
	    Console.WriteLine(urlForClientStreaming);
	}


## <a name="stream-HLS"> </a>How to: Deliver Apple HLS Streaming Content

A previous section shows how to create a locator to streaming media content on a Media Services origin server. This section shows how to create a locator to Apple HTTP Live Streaming (HLS) content on a Media Services origin server. Using this approach, you can build a URL to Apple HLS content, and provide it to Apple iOS devices for playback. The basic approach to building the locator URL is the same. Build a locator to the Apple HLS streaming asset path on an origin server, and then build a full URL that links to the manifest for the streaming content.

The following code example assumes that you have already obtained a reference to an HLS streaming asset, and the variable named **assetToStream** is referenced in the code. After you have run this code to generate an origin locator on the asset, you can use the resulting URL to play back the streaming content in an iOS device such as an IPAD or an IPhone.

To build a locator to Apple HLS streaming content, perform these steps as shown in the code example:

   1. Get a reference to the manifest file in the asset.
   2. Define an access policy.
   3. Create the locator by calling the **CreateOriginLocator** method. Pass to the method an existing HLS asset with streaming media files, an access policy, and a start time. The URL returned by the **CreateOriginLocator** method is only the base path to the asset. To construct a full URL to the streaming manifest file, complete the following step.
   4. Build a URL to the manifest file. To do this, add the manifest file name, followed by the string **/manifest(format=m3u8-aapl)** to the locator **Path** property.

The following code shows how to implement the steps:

	static void GetStreamingHLSOriginLocator(IAsset assetToStream)
	{
	    // Get a reference to the manifest file from the collection 
	    // of files in the asset. 
	    var theManifest =
	                        from f in assetToStream.Files
	                        where f.Name.EndsWith(".ism")
	                        select f;
	    // Cast the reference to a true IFileInfo type. 
	    IFileInfo manifestFile = theManifest.First();
	
	    // Create an 1-day readonly access policy. 
	    IAccessPolicy streamingPolicy = _context.AccessPolicies.Create("Streaming policy",
	        TimeSpan.FromDays(1),
	        AccessPermissions.Read);
	    ILocator originLocator = _context.Locators.CreateOriginLocator(assetToStream,
	        streamingPolicy,
	        DateTime.UtcNow.AddMinutes(-5));
	
	    // Create a full URL to the manifest file. Use this for playback
	    // in iOS streaming media clients. 
	    string urlForClientStreaming = originLocator.Path
	        + manifestFile.Name + "/manifest(format=m3u8-aapl)";
	    Console.WriteLine("URL to manifest for client streaming: ");
	    Console.WriteLine(urlForClientStreaming);
	    Console.WriteLine();
	}


## <a name="enable-cdn"> </a>How to: Enable Windows Azure CDN

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


## <a name="next-steps"> </a>Next Steps

Now that you have learned how to set up for Media Services development and perform some typical programming tasks, see the following resources to learn more about building Media Services applications.

-   [Windows Azure Media Services Documentation][]
-   [Getting Started with the Media Services SDK for .NET][]
-   [Building Applications with the Media Services SDK for .NET][]
-   [Building Applications with the Windows Azure Media Services REST API][]
-   [Media Services Forum][]


<!-- Reusable paths. -->

  <!-- Anchors. -->
  [What Are Media Services?]: #what-are
  [Setting Up a Windows Azure Account for Media Services]: #setup-account
  [Setting up for Media Services Development]: #setup-dev
  [How to: Connect to Media Services Programmatically]: #connect
  [How to: Create an Encrypted Asset and Upload to Storage]: #create-asset
  [How to: Get a Media Processor Instance]: #get-mediaproc
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
  [Windows Azure Management Portal]: https://manage.windowsazure.com
  [How to Create a Media Services Account]: http://go.microsoft.com/fwlink/?linkid=256662

  <!-- Email. -->
  [MediaServices@Microsoft.com]: mailto:MediaServices@Microsoft.com

  <!-- Images. -->
  [Media Services Architecture]: ../../../DevCenter/dotNet/Media/wams-01.png
  [Visual Studio Project Setup]: ../../../DevCenter/dotNet/Media/wams-02.png


