<properties 
	pageTitle="Managing Media Services Assets across Multiple Storage Accounts" 
	description="This articles give you guidance on how to manage media services assets across multiple storage accounts." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016"    
	ms.author="juliako"/>


#Managing Media Services Assets across Multiple Storage Accounts

Starting with Microsoft Azure Media Services 2.2, you can attach multiple storage accounts to a single Media Services account. Ability to attach multiple storage accounts to a Media Services account provides the following benefits:

- Load balancing your assets across multiple storage accounts.
- Scaling Media Services for large amounts of content processing (as currently a single storage account has a max limit of 500 TB). 

This topic demonstrates how to attach multiple storage accounts to a Media Services account using Azure Service Management REST API. It also shows how to specify different storage accounts when creating assets using the Media Services SDK. 

##Considerations

When attaching multiple storage accounts to your Media Services account, the following considerations apply:

- All storage accounts attached to a Media Services account must be in the same data center as the Media Services account.
- Currently, once a storage account is attached to the specified Media Services account, it cannot be detached.
- Primary storage account is the one indicated during Media Services account creation time. Currently, you cannot change the default storage account. 

Other considerations:

Media Services uses the value of the **IAssetFile.Name** property when building URLs for the streaming content (for example, http://{WAMSAccount}.origin.mediaservices.windows.net/{GUID}/{IAssetFile.Name}/streamingParameters.) For this reason, percent-encoding is not allowed. The value of the Name property cannot have any of the following [percent-encoding-reserved characters](http://en.wikipedia.org/wiki/Percent-encoding#Percent-encoding_reserved_characters): !*'();:@&=+$,/?%#[]". Also, there can only be one ‘.’ for the file name extension.

##To attach a Storage Account with Azure Service Management REST API

Currently, the only way to attach multiple storage accounts is by using [Azure Service Management REST API](http://msdn.microsoft.com/library/azure/dn167014.aspx). The code sample in the [How to: Use Media Services Management REST API](https://msdn.microsoft.com/library/azure/dn167656.aspx) topic defines the **AttachStorageAccountToMediaServiceAccount** method that attaches a storage account to the specified Media Services account. The code in the same topic defines the **ListStorageAccountDetails** method that lists all the storage accounts attached to the specified Media Services account.


##To manage Media Services assets across multiple Storage Accounts

The following code uses the latest Media Services SDK to perform the following tasks:

1. Display all the storage accounts associated with the specified Media Services account.
1. Retrieve the name of the default storage account.
1. Create a new asset in the default storage account.
1. Create an output asset of the encoding job in the specified storage account.
	
		using Microsoft.WindowsAzure.MediaServices.Client;
		using System;
		using System.Collections.Generic;
		using System.Configuration;
		using System.IO;
		using System.Linq;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		
		namespace MultipleStorageAccounts
		{
		    class Program
		    {
		        // Location of the media file that you want to encode. 
		        private static readonly string _singleInputFilePath =
		            Path.GetFullPath(@"../..\supportFiles\multifile\interview2.wmv");
		
		        private static readonly string MediaServicesAccountName = 
		            ConfigurationManager.AppSettings["MediaServicesAccountName"];
		        private static readonly string MediaServicesAccountKey = 
		            ConfigurationManager.AppSettings["MediaServicesAccountKey"];
		
		        private static CloudMediaContext _context;
		        private static MediaServicesCredentials _cachedCredentials = null;
	
		        static void Main(string[] args)
		        {
	
		            // Create and cache the Media Services credentials in a static class variable.
		            _cachedCredentials = new MediaServicesCredentials(
		                            MediaServicesAccountName,
		                            MediaServicesAccountKey);
		            // Used the cached credentials to create CloudMediaContext.
		            _context = new CloudMediaContext(_cachedCredentials);
	
		
		            // Display the storage accounts associated with 
		            // the specified Media Services account:
		            foreach (var sa in _context.StorageAccounts)
		                Console.WriteLine(sa.Name);
		
		            // Retrieve the name of the default storage account.
		            var defaultStorageName = _context.StorageAccounts.Where(s => s.IsDefault == true).FirstOrDefault();
		            Console.WriteLine("Name: {0}", defaultStorageName.Name);
		            Console.WriteLine("IsDefault: {0}", defaultStorageName.IsDefault);
		
		            // Retrieve the name of a storage account that is not the default one.
		            var notDefaultStroageName = _context.StorageAccounts.Where(s => s.IsDefault == false).FirstOrDefault();
		            Console.WriteLine("Name: {0}", notDefaultStroageName.Name);
		            Console.WriteLine("IsDefault: {0}", notDefaultStroageName.IsDefault);
		            
		            // Create the original asset in the default storage account.
		            IAsset asset = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, 
		                defaultStorageName.Name, _singleInputFilePath);
		            Console.WriteLine("Created the asset in the {0} storage account", asset.StorageAccountName);
		            
		            // Create an output asset of the encoding job in the other storage account.
		            IAsset outputAsset = CreateEncodingJob(asset, notDefaultStroageName.Name, _singleInputFilePath);
		            if(outputAsset!=null)
		                Console.WriteLine("Created the output asset in the {0} storage account", outputAsset.StorageAccountName);
		
		        }
		
		        static public IAsset CreateAssetAndUploadSingleFile(AssetCreationOptions assetCreationOptions, string storageName, string singleFilePath)
		        {
		            var assetName = "UploadSingleFile_" + DateTime.UtcNow.ToString();
		            
		            // If you are creating an asset in the default storage account, you can omit the StorageName parameter.
		            var asset = _context.Assets.Create(assetName, storageName, assetCreationOptions);
		
		            var fileName = Path.GetFileName(singleFilePath);
		
		            var assetFile = asset.AssetFiles.Create(fileName);
		
		            Console.WriteLine("Created assetFile {0}", assetFile.Name);
		
		            assetFile.Upload(singleFilePath);
		            
		            Console.WriteLine("Done uploading {0}", assetFile.Name);
		
		            return asset;
		        }
		
		        static IAsset CreateEncodingJob(IAsset asset, string storageName, string inputMediaFilePath)
		        {
		            // Declare a new job.
		            IJob job = _context.Jobs.Create("My encoding job");
		            // Get a media processor reference, and pass to it the name of the 
		            // processor to use for the specific task.
		            IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");
		
		            // Create a task with the encoding details, using a string preset.
		            ITask task = job.Tasks.AddNew("My encoding task",
		                processor,
		                "H264 Multiple Bitrate 720p",
		                Microsoft.WindowsAzure.MediaServices.Client.TaskOptions.ProtectedConfiguration);
		
		            // Specify the input asset to be encoded.
		            task.InputAssets.Add(asset);
		            // Add an output asset to contain the results of the job. 
		            // This output is specified as AssetCreationOptions.None, which 
		            // means the output asset is not encrypted. 
		            task.OutputAssets.AddNew("Output asset", storageName,
		                AssetCreationOptions.None);
		
		            // Use the following event handler to check job progress.  
		            job.StateChanged += new
		                    EventHandler<JobStateChangedEventArgs>(StateChanged);
		
		            // Launch the job.
		            job.Submit();
		
		            // Check job execution and wait for job to finish. 
		            Task progressJobTask = job.GetExecutionProgressTask(CancellationToken.None);
		            progressJobTask.Wait();
		
		            // Get an updated job reference.
		            job = GetJob(job.Id);
		
		            // If job state is Error the event handling 
		            // method for job progress should log errors.  Here we check 
		            // for error state and exit if needed.
		            if (job.State == JobState.Error)
		            {
		                Console.WriteLine("\nExiting method due to job error.");
		                return null;
		            }
		
		            // Get a reference to the output asset from the job.
		            IAsset outputAsset = job.OutputMediaAssets[0];
		
		            return outputAsset;
		        }
		
		
		        private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
		        {
		            var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
		                ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();
		
		            if (processor == null)
		                throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));
		
		            return processor;
		        }
		
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
		                    Console.WriteLine("An error occurred in {0}", job.Id);
		                    break;
		                default:
		                    break;
		            }
		        }
		
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
		    }
		}
 

##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
