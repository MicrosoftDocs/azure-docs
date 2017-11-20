---
title: Video Moderation API in Azure Content Moderator | Microsoft Docs
description: Use video moderation to scan for possible adult and racy content.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 11/20/2017
ms.author: sajagtap
---

# Video Moderation API

Today, online viewers generate billions of video views across popular and regional social media web sites and increasing. By applying machine-learning based services to predict potential adult and racy content, you significantly lower the cost of your moderation efforts.

## How it works

The Content Moderator video capability is powered by the adult and racy classifier (media processor) in the **Azure Media Services (AMS)**. The capability is currently in private preview and available at no charge. Here are the steps to try the service:

1. [Create an **Azure Media Services** account](https://ms.portal.azure.com/#create/Microsoft.MediaService) in your Azure subscription.
1. [Contact us](https://cognitive.uservoice.com/ "Contact Us") with this information for enabling the Content Moderator in your region.
   1. Your Azure subscription ID
   1. Your Azure Media Services account name
   1. Your region

## Code Sample

The sample C# program listed below demonstrates the use of the AMS ADK to run a Content Moderator job. This code requires both the [Azure Media Services C# SDK](https://github.com/Azure/azure-sdk-for-media-services "Azure Media Services SDK") and [SDK Extensions packages](https://github.com/Azure/azure-sdk-for-media-services-extensions "SDK Extensions") (available on [NuGet](http://www.nuget.org/packages?q=Azure+Media+Services+.NET+SDK "Nuget")).


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

        //a json file with the configuration and version the supported Modes are Speed, Balance, Quality, 
	//which provide Moderator readings over a 16-/32-/48-frame granularity.
        //Example file:
       //        {
        //             "version": "2.0",
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

The response consists of:

 1. A Video summary
 2. **Shots** as "**fragments**", each including
 3. **Clips** as "**events**" with
 4. **Key frames** that include a review recommendation (true or false) based on Adult and Racy scores
 
> [!NOTE]
> Location of a keyframe in seconds = timestamp/timescale

    {
    "version": 2,
    "timescale": 90000,
    "offset": 0,
    "framerate": 50,
    "width": 1280,
    "height": 720,
    "totalDuration": 18696321,
    "fragments": [
    {
      "start": 0,
      "duration": 18000
    },
    {
      "start": 18000,
      "duration": 3600,
      "interval": 3600,
      "events": [
        [
          {
            "reviewRecommended": false,
            "adultScore": 0.00001,
            "racyScore": 0.03077,
            "index": 5,
            "timestamp": 18000,
            "shotIndex": 0
          }
        ]
      ]
    },
    {
      "start": 18386372,
      "duration": 119149,
      "interval": 119149,
      "events": [
        [
          {
            "reviewRecommended": true,
            "adultScore": 0.00000,
            "racyScore": 0.91902,
            "index": 5085,
            "timestamp": 18386372,
            "shotIndex": 62
          }
        ]
      ]
    }
    ]
    }
