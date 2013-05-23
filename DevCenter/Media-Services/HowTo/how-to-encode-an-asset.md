<properties linkid="develop-media-services-how-to-guides-encode-an-asset" urlDisplayName="How to Encode an Asset" pageTitle="How to Encode an Asset for  Media Services - Windows Azure" metaKeywords="" metaDescription="Learn how to use the Windows Azure Media Encoder to encode media content on Media Services. Code samples are written in C# and use the Media Services SDK for .NET." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="migree" />

<div chunk="../chunks/article-left-menu.md" />

<h1><a name="encode-asset"> </a><span class="short header">How to: Encode an Asset</span></h1>
This article is one in a series introducing Windows Azure Media Services programming. The previous topic was [How to:Get a Media Processor](http://go.microsoft.com/fwlink/?LinkID=301732&clcid=0x409).

For media content on the server, you can encode the content with a number of media encodings and formats using Windows Azure Media Encoder. You can also use an encoder provided by a Media Services partner; third-party encoders are available through the [Windows Azure Marketplace][]. You can specify the details of encoding tasks by using [Encoder Preset][] strings, or by using configuration files. 

The following steps are required to encode media content using the Media Encoder:

   1. Create an asset (or reference an existing asset).
   2. Declare a new job, using the **Jobs.Create** method.
   3. Declare a media processor to process the job. To do this, implement a method such as the **GetLatestMediaProcessorByName** method shown in the [How to: Get a Media Processor Instance][]. In this example, the code uses the Windows Azure Media Encoder to encode the input media file.
   4. Declare a task. To declare a task, you must give the task a friendly name, and then pass to it a media processor instance, a configuration string for handling the processing job, and a **TaskCreationOptions** setting (which specifies whether to encrypt the configuration data).  In this example, the code uses an encoder preset string to specify the encoding to use. 
   5. Specify an input asset for the task. This example uses the **CreateAssetAndUploadSingleFile** method defined in the [How to: Upload an Encrypted Asset] topic to upload an unencrypted asset. 
   6. Specify an output asset for the task. By default, all assets are created as encrypted for transport and storage in Media Services. To output an unencrypted asset for playback, the code specifies **AssetCreationOptions.None**.
   7. Submit the job. The sample code creates an event handler for the **JobStateChanged** event to track the job's progress. The event handler code is described in the [How to Check Job Progress][] topic.

The following method uploads a single asset and creates a job to encode the asset:

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
For more information about processing assets, see:
<ul>
<li> <a href="http://msdn.microsoft.com/en-us/library/jj129580.aspx"> Process Assets with the Media Services SDK for .NET</a></li>
<li> <a href="http://msdn.microsoft.com/en-us/library/jj129574.aspx">Process Assets with the Media Services REST API</a></li>
</ul>

<h2>Next Steps</h2>
Now that you know how to create a job to encode an assset, go to the [How To Check Job Progress with Media Services](http://go.microsoft.com/fwlink/?LinkID=301737&clcid=0x409) topic.

[Windows Azure Marketplace]: https://datamarket.azure.com/
[Encoder Preset]: http://msdn.microsoft.com/en-us/library/hh973610.aspx
[How to: Get a Media Processor Instance]:http://go.microsoft.com/fwlink/?LinkId=301732
[How to: Upload an Encrypted Asset]:http://go.microsoft.com/fwlink/?LinkId=301733
[How to: Deliver an Asset by Download]:http://go.microsoft.com/fwlink/?LinkId=301734
[How to Check Job Progress]:http://go.microsoft.com/fwlink/?LinkId=301737