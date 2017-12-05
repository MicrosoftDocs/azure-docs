---
title: Video Moderation in Azure Content Moderator | Microsoft Docs
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

# Video moderation

Today, online viewers generate billions of video views across popular and regional social media web sites and increasing. By applying machine-learning based services to predict potential adult and racy content, you lower the cost of your moderation efforts.

## Create a free Azure account

[Start here](https://azure.microsoft.com/free/) to create a free Azure account if you don't have one already.

## Create an Azure Media Services account

The Content Moderator's video capability is available as a private preview **media processor** in Azure Media Services (AMS) at no charge.

[Create an Azure Media Services account](https://docs.microsoft.com/azure/media-services/media-services-portal-create-account) in your Azure subscription.

## Request access to Content Moderator

[Submit](https://cognitive.uservoice.com/ "Contact Us") the following information to request access to the private preview:

   1. Your Azure subscription ID
   1. Your Azure Media Services account name
   1. Your region

## Get Azure Active Directory credentials

   1. Read the [Azure Media Services portal article](https://docs.microsoft.com/en-us/azure/media-services/media-services-portal-get-started-with-aad) to learn how to use the Azure portal to get your Azure AD authentication credentials.
   1. Read the [Azure Media Services .NET article](https://docs.microsoft.com/en-us/azure/media-services/media-services-dotnet-get-started-with-aad) to learn how to use your Azure Active Directory credentials with the .NET SDK.

   > [!NOTE]
   > The sample code in this quick start uses the **service principal authentication** method described in both the articles.


## Scan your videos for possible adult and racy content

After getting access to the Content Moderator media processor, use the following sample C# code to run a Content Moderator job. This code requires the **windowsazure.mediaservices** and **windowsazure.mediaservices.extensions** NuGet packages available on [NuGet](https://www.nuget.org/).


	using System;
	using System.Linq;
	using System.Threading.Tasks;
	using Microsoft.WindowsAzure.MediaServices.Client;
	using System.IO;
	using System.Threading;

	namespace VideoModeratorQuickStart
	{
    class Program
    {
        // declare constants and globals
        private static CloudMediaContext _context = null;
    
        // Azure Media Services authentication assuming Service Principal Authentication
        private const string AZURE_AD_TENANT_NAME = "Your Azure AD Tenant Name";
        private const string CLIENT_ID = "Your Client ID";
        private const string CLIENT_SECRET = "Your Client Secret";

        // REST API endpoint, example shown.      
        private const string REST_API_ENDPOINT = "https://accountname.restv2.westcentralus.media.azure.net/API";

        // Content Moderator Media Processor Name
        private const string MEDIA_PROCESSOR = "Azure Media Content Moderator";

        // Input (for example, test.mp4) and output files in the current directory of the executable
        private const string INPUT_FILE = "INPUT VIDEO FILE";
        private const string OUTPUT_FOLDER = "";

        // A preset file with the version number, also in the current directory
        private static readonly string CONTENT_MODERATOR_PRESET_FILE = "preset.json";
        //Example file content:
        //        {
        //             "version": "2.0"
        //        }

        static void Main(string[] args)
        {
           
            // Read the preset settings
            string configuration = File.ReadAllText(CONTENT_MODERATOR_PRESET_FILE);

            // Get Azure AD credentials
            var tokenCredentials = new AzureAdTokenCredentials(AZURE_AD_TENANT_NAME,
                       new AzureAdClientSymmetricKey(CLIENT_ID, CLIENT_SECRET),
                       AzureEnvironments.AzureCloudEnvironment);

            // Initialize an Azure AD token
            var tokenProvider = new AzureAdTokenProvider(tokenCredentials);

            // Create a media context
            _context = new CloudMediaContext(new Uri(REST_API_ENDPOINT), tokenProvider);

            RunContentModeratorJob(INPUT_FILE, OUTPUT_FOLDER, configuration);
        }

        static void RunContentModeratorJob(string inputFilePath, string output, string configuration)
        {
            // create asset with input file
            IAsset asset = _context.Assets.CreateFromFile(inputFilePath, AssetCreationOptions.None);

            // grab instance of Azure Media Content Moderator MP
            IMediaProcessor mp = _context.MediaProcessors.GetLatestMediaProcessorByName(MEDIA_PROCESSOR);

            // create Job with Content Moderator task
            IJob job = _context.Jobs.Create(String.Format("Content Moderator {0}",
                Path.GetFileName(inputFilePath) + "_" + Guid.NewGuid()));

            ITask contentModeratorTask = job.Tasks.AddNew("Adult classifier task",
                mp, configuration,
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

## Analyze the JSON response

After the Content Moderation job is completed, analyze the JSON response. It consists of these elements:

1. Video summary
1. **Shots** as "**fragments**", each including
1. **Clips** as "**events**" with
1. **Key frames** that include a **reviewRecommended" (= true or false)"** flag based on **Adult** and **Racy** scores (between 0 and 1).
 
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
