---
title: Video Moderation API in Content Moderator | Microsoft Docs
description: Sign up for the video moderation in Content Moderator to use the adult content classifier running within Azure Media Services.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 02/09/2017
ms.author: sajagtap
---

# Video Moderation API

Today, online viewers are generating billions of video views across popular and regional social media web sites and increasing. With proactive detection of adult content in your video files, you can significantly lower the cost of your moderation efforts. Furthermore, gaining this type of early insight can enable you to make better decisions and create safer experiences for your customers.

## How it works

The Content Moderator video moderation capability is powered by the adult content classifier running within the **Azure Media Services**. The capability is currently in private preview and available at no charge. Here are the steps you need to follow to try the service:

1. [Sign up](https://azure.microsoft.com/en-us/free/) for a free Microsoft Azure subscription if you don't have one already.
1. [Submit a support request](https://ms.portal.azure.com/#create/Microsoft.Support) for enabling the East US 2 region for your Azure Subscription ID.
1. [Contact us](https://cognitive.uservoice.com/ "Contact Us") with your Azure Subscription ID for enabling the Video Content Moderator in the East US 2 region.
1. [Create a **Media Services** account](https://ms.portal.azure.com/#create/Microsoft.MediaService) in the East US 2 region on the Azure portal.

The free tiers can help you in evaluating the video moderation with your content. Depending on your volumes and purchase options, your expenses will include just the media storage and compute costs.

## Code Sample

The following is a sample C# program set that will get you started with your first Content Moderator job. This code requires both the [Azure Media Services C# SDK](https://github.com/Azure/azure-sdk-for-media-services "Azure Media Services SDK") and [SDK Extensions packages](https://github.com/Azure/azure-sdk-for-media-services-extensions "SDK Extensions") (available on [NuGet](http://www.nuget.org/packages?q=Azure+Media+Services+.NET+SDK "Nuget")).


	using System;
	using System.Linq;
	using System.Threading.Tasks;
	using Microsoft.WindowsAzure.MediaServices.Client;
	using System.IO;
	using System.Threading;

	namespace ContentModeratorAmsSample
	{

	class Program
    {
        // declare constants and globals
        private static CloudMediaContext _context = null;
        private static readonly string _accountName = { ACCOUNT_NAME };
        private static readonly string _accountKey = { ACCOUNT_KEY };
        private const string _mpName = "Azure Media Content Moderator";
        private static readonly string _inputFile = { INPUT_FILE_PATH };
        private static readonly string _outputFolder = { OUTPUT_FOLDER_PATH };

        //a json file with the configuration and version the supported Modes are Speed, Balance, Quality, which provide Moderator readings over a 16-/32-/48-frame granularity.
        //Example file:
       //        {
        //             "version": "1.0",
        //             "Options": { "Mode": "Quality" }
        //        }

        private static readonly string _moderatorConfiguration = { CONFIGURATION_FILE_PATH };

        static void Main(string[] args)
        {
            _context = new CloudMediaContext(_accountName, _accountKey);
            string configuration = File.ReadAllText(_moderatorConfiguration);
            RunContentModeratorJob(_inputFile, _outputFolder, configuration);
        }

        static void RunContentModeratorJob(string inputFilePath, string output, string configuration)
        {
            // create asset with input file
            IAsset asset = _context.Assets.CreateFromFile(inputFilePath, AssetCreationOptions.None);

            // grab instance of Azure Media Content Moderator MP
            IMediaProcessor mp = _context.MediaProcessors.GetLatestMediaProcessorByName(_mpName);

            // create Job with Content Moderator task
            IJob job = _context.Jobs.Create(String.Format("Content Moderator {0}",
                Path.GetFileName(inputFilePath) + "_" + Guid.NewGuid()));

            ITask contentModeratorTask = job.Tasks.AddNew("Adult classifier task",
                mp,configuration,
                TaskOptions.None);
            contentModeratorTask.InputAssets.Add(asset);
            contentModeratorTask.OutputAssets.AddNew("Adult classifier output",
            AssetCreationOptions.None);

            job.Submit();

            // Create progress printing and querying tasks
            Task progressPrintTask = new Task(() =>
            {
                IJob jobQuery = null;
                do
                {
                    var progressContext = _context;
                    jobQuery = progressContext.Jobs
                    .Where(j => j.Id == job.Id)
                    .First();
                    Console.WriteLine(string.Format("{0}\t{1}",
                    DateTime.Now,
                    jobQuery.State));
                    Thread.Sleep(10000);
                }
                while (jobQuery.State != JobState.Finished &&
                jobQuery.State != JobState.Error &&
                jobQuery.State != JobState.Canceled);
            });
            progressPrintTask.Start();

            Task progressJobTask = job.GetExecutionProgressTask(
            CancellationToken.None);
            progressJobTask.Wait();

            // If job state is Error, the event handling
            // method for job progress should log errors.  Here we check
            // for error state and exit if needed.
            if (job.State == JobState.Error)
            {
                ErrorDetail error = job.Tasks.First().ErrorDetails.First();
                Console.WriteLine(string.Format("Error: {0}. {1}",
                error.Code,
                error.Message));
            }

            DownloadAsset(job.OutputMediaAssets.First(), output);
        }

        static void DownloadAsset(IAsset asset, string outputDirectory)
        {
            foreach (IAssetFile file in asset.AssetFiles)
            {
                file.Download(Path.Combine(outputDirectory, file.Name));
            }
        }

        // event handler for Job State
        static void StateChanged(object sender, JobStateChangedEventArgs e)
        {
            Console.WriteLine("Job state changed event:");
            Console.WriteLine("  Previous state: " + e.PreviousState);
            Console.WriteLine("  Current state: " + e.CurrentState);
            switch (e.CurrentState)
            {
                case JobState.Finished:
                    Console.WriteLine();
                    Console.WriteLine("Job finished.");
                    break;
                case JobState.Canceling:
                case JobState.Queued:
                case JobState.Scheduled:
                case JobState.Processing:
                    Console.WriteLine("Please wait...\n");
                    break;
                case JobState.Canceled:
                    Console.WriteLine("Job is canceled.\n");
                    break;
                case JobState.Error:
                    Console.WriteLine("Job failed.\n");
                    break;
                default:
                    break;
            }
        }
    }

	}

## Sample Response (JSON)

    {
	  	"version": 1,
	  	"timescale": 1000,
	  	"offset": 0,
      	"framerate": 29.97,
      	"width": 1440,
		"height": 1080,
		"fragments": [
    	{
      		"start": 0,
      		"duration": 1067,
      		"interval": 1067,
      		"events": [
        	  [
          		{
            		"isAdultContent": false,
            		"adultConfidence": 0.05699,
            		"index": 0,
            		"timestamp": 0
          		}
        	 ]
      		]
    	},
    	{
      		"start": 7474,
      		"duration": 1067,
      		"interval": 1067,
      		"events": [
        	[
          	  {
            		"isAdultContent": true,
            		"adultConfidence": 0.51886,
            		"index": 224,
            		"timestamp": 7474
          	  }
        	]
      	   ]
    	}
	  ]
	}
