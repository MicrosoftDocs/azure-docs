---
title: Use Azure WebHooks to monitor Media Services job notifications with .NET | Microsoft Docs
description: Learn how to use Azure WebHooks to monitor Media Services job notifications. The code sample is written in C# and uses the Media Services SDK for .NET.
services: media-services
documentationcenter: ''
author: juliako
manager: erikre
editor: ''

ms.assetid: a61fe157-81b1-45c1-89f2-224b7ef55869
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 02/19/2017
ms.author: juliako

---
# Use Azure WebHooks to monitor Media Services job notifications with .NET
When you run jobs, you often require a way to track job progress. You can monitor Media Services job notifications by using Azure Webhooks or [Azure Queue storage](media-services-dotnet-check-job-progress-with-queues.md). This topic shows how to work with Webhooks.


## Prerequisites

The following are required to complete the tutorial:

* An Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/).
* A Media Services account. To create a Media Services account, see [How to Create a Media Services Account](media-services-portal-create-account.md).
* .NET Framework 4.0 or later
* Visual Studio 2010 SP1 (Professional, Premium, Ultimate, or Express) or later versions.
* Understanding of [Azure Functions HTTP and webhook bindings](../azure-functions/functions-bindings-http-webhook.md).

This topic shows how to

*  Define an Azure Function that is customized to respond to webhooks. 
	
	In this case the webhook is triggered by Media Services when your encoding job changes status. In the example shown here, all the webhook does is logs the notification message. In your case you might want to trigger publishing or send an email to a customer.
	
	>[!NOTE]
	>Before continuing, make sure you understand how [Azure Functions HTTP and webhook bindings](../azure-functions/functions-bindings-http-webhook.md) work.
	>
	
* Add a webhook to your encoding task and specify the webhook URL and secret key that this webhook responds to. You could have this code defined as part of another Azure function, but in this case, the code is part of a console app.

## Getting Webhook notifications

The code in this section shows an implementation of an Azure function that is a webhook. In this sample, the function just listens for the webhook call back from Media Services notifications and logs the results out to the Functions console. In your case you might want to trigger publishing or send an email to a customer.

The webhook expects a signing key (credential) to match the one you pass when you configure the notification endpoint. The signing key is the 64-byte Base64 encoded value that is used to protect and secure your WebHooks callbacks from Azure Media Services. 

In the following code, the VerifyWebHookRequestSignature method does the verification.

You can find the definition of the following Media Services .NET Azure function [here](https://github.com/Azure-Samples/media-services-dotnet-functions-integration/tree/master/Notification_Webhook_Function).

### Run.csx

The following C# code shows how to get notification messages when your Webhook is triggered by Media Services. 

	///////////////////////////////////////////////////
	#r "Newtonsoft.Json"
	
	using System.Net;
	using System.Security.Cryptography;
	using System.Text;
	using System.Collections.Generic;
	using System.Linq;
	using System.Globalization;
	using Newtonsoft.Json;
	
	internal const string SignatureHeaderKey = "sha256";
	internal const string SignatureHeaderValueTemplate = SignatureHeaderKey + "={0}";
	static string _webHookEndpoint = Environment.GetEnvironmentVariable("WebHookEndpoint");
	static string _signingKey = Environment.GetEnvironmentVariable("SigningKey");
	
	public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
	{
	    log.Info($"C# HTTP trigger function processed a request. RequestUri={req.RequestUri}");
	
	    Task<byte[]> taskForRequestBody = req.Content.ReadAsByteArrayAsync();
	    byte[] requestBody = await taskForRequestBody;
	
	    string jsonContent = await req.Content.ReadAsStringAsync();
	    log.Info($"Request Body = {jsonContent}");
	
	    IEnumerable<string> values = null;
	    if (req.Headers.TryGetValues("ms-signature", out values))
	    {
	        byte[] signingKey = Convert.FromBase64String(_signingKey);
	        string signatureFromHeader = values.FirstOrDefault();
	        if (VerifyWebHookRequestSignature(requestBody, signatureFromHeader, signingKey))
	        {
	            string requestMessageContents = Encoding.UTF8.GetString(requestBody);
	
	            NotificationMessage msg = JsonConvert.DeserializeObject<NotificationMessage>(requestMessageContents);
	
	            if (VerifyHeaders(req, msg, log))
	            {
	                // do something useful here.  For now just log out the message properties
	                foreach (string key in msg.Properties.Keys)
	                {
	                    log.Info($"{key}={msg.Properties[key]}");
	                }
	
	                return req.CreateResponse(HttpStatusCode.OK, string.Empty);
	            }
	            else
	            {
	                log.Info($"VerifyHeaders failed.");
	                return req.CreateResponse(HttpStatusCode.BadRequest, "VerifyHeaders failed.");
	            }
	        }
	        else
	        {
	            log.Info($"VerifyWebHookRequestSignature failed.");
	            return req.CreateResponse(HttpStatusCode.BadRequest, "VerifyWebHookRequestSignature failed.");
	        }
	    }
	
	    return req.CreateResponse(HttpStatusCode.BadRequest, "Generic Error.");
	}
	
	private static bool VerifyWebHookRequestSignature(byte[] data, string actualValue, byte[] verificationKey)
	{
	    using (var hasher = new HMACSHA256(verificationKey))
	    {
	        byte[] sha256 = hasher.ComputeHash(data);
	        string expectedValue = string.Format(CultureInfo.InvariantCulture, SignatureHeaderValueTemplate, ToHex(sha256));
	
	        return (0 == String.Compare(actualValue, expectedValue, System.StringComparison.Ordinal));
	    }
	}
	
	private static bool VerifyHeaders(HttpRequestMessage req, NotificationMessage msg, TraceWriter log)
	{
	    bool headersVerified = false;
	
	    try
	    {
	        IEnumerable<string> values = null;
	        if (req.Headers.TryGetValues("ms-mediaservices-accountid", out values))
	        {
	            string accountIdHeader = values.FirstOrDefault();
	            string accountIdFromMessage = msg.Properties["AccountId"];
	
	            if (0 == string.Compare(accountIdHeader, accountIdFromMessage, StringComparison.OrdinalIgnoreCase))
	            {
	                headersVerified = true;
	            }
	            else
	            {
	                log.Info($"accountIdHeader={accountIdHeader} does not match accountIdFromMessage={accountIdFromMessage}");
	            }
	        }
	        else
	        {
	            log.Info($"Header ms-mediaservices-accountid not found.");
	        }
	    }
	    catch (Exception e)
	    {
	        log.Info($"VerifyHeaders hit exception {e}");
	        headersVerified = false;
	    }
	
	    return headersVerified;
	}
	
	private static readonly char[] HexLookup = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
	
	/// <summary>
	/// Converts a <see cref="T:byte[]"/> to a hex-encoded string.
	/// </summary>
	private static string ToHex(byte[] data)
	{
	    if (data == null)
	    {
	        return string.Empty;
	    }
	
	    char[] content = new char[data.Length * 2];
	    int output = 0;
	    byte d;
	    for (int input = 0; input < data.Length; input++)
	    {
	        d = data[input];
	        content[output++] = HexLookup[d / 0x10];
	        content[output++] = HexLookup[d % 0x10];
	    }
	    return new string(content);
	}
	
	internal enum NotificationEventType
	{
	    None = 0,
	    JobStateChange = 1,
	    NotificationEndPointRegistration = 2,
	    NotificationEndPointUnregistration = 3,
	    TaskStateChange = 4,
	    TaskProgress = 5
	}
	internal sealed class NotificationMessage
	{
	    public string MessageVersion { get; set; }
	    public string ETag { get; set; }
	    public NotificationEventType EventType { get; set; }
	    public DateTime TimeStamp { get; set; }
	    public IDictionary<string, string> Properties { get; set; }
	}
	
	internal static string[] SplitAndTrim(string input, params char[] separator)
	{
	    if (input == null)
	    {
	        return new string[0];
	    }
	
	    return input.Split(separator).Select(x => x.Trim()).Where(x => !string.IsNullOrWhiteSpace(x)).ToArray();
	}
	

The example above produced the following output. You values will vary.
	
	C# HTTP trigger function processed a request. RequestUri=https://juliakofunc001-functions.azurewebsites.net/api/Notification_Webhook_Function?code=0jzz5t2BJEKMVq6BjmKqQ5TogaCNqDq5FPd71VCF/LQvE5ujBxpYKw==
	Request Body = {
	  "MessageVersion": "1.1",
	  "ETag": "5a1fdb400812f1f0e8c4d64290a91ef2299d90d312e49cf25fc3dd34b3a45473",
	  "EventType": 4,
	  "TimeStamp": "2017-02-14T07:45:44.7375048Z",
	  "Properties": {
	    "JobId": "nb:jid:UUID:26956239-eb0b-4a07-bab3-d07acfc73167",
	    "TaskId": "nb:tid:UUID:54f3f505-9264-49b2-8100-0e63afa76f1a",
	    "NewState": "Finished",
	    "OldState": "Processing",
	    "AccountName": "mediapkeewmg5c3peq",
	    "AccountId": "301912b0-659e-47e0-9bc4-6973f2be3424",
	    "NotificationEndPointId": "nb:nepid:UUID:3a128bef-2b66-47cb-a519-4a040e502fb6"
	  }
	}
	JobId=nb:jid:UUID:26956239-eb0b-4a07-bab3-d07acfc73167
	TaskId=nb:tid:UUID:54f3f505-9264-49b2-8100-0e63afa76f1a
	NewState=Finished
	OldState=Processing
	AccountName=mediapkeewmg5c3peq
	AccountId=301912b0-659e-47e0-9bc4-6973f2be3424
	NotificationEndPointId=nb:nepid:UUID:3a128bef-2b66-47cb-a519-4a040e502fb6



## Adding Webhook to your encoding task

1. Create a new C# Console Application in Visual Studio. Enter the Name, Location, and Solution name, and then click OK.
2. Use [Nuget](https://www.nuget.org/packages/windowsazure.mediaservices) to install Azure Media Services.
3. Update App.config file with appropriate values: 
	
	* Azure Media Services name and key that will be sending the noifications, 
	* webhook URL that expects to get the notifications, 
	* the signing key that will match the key that your webhook expects. The signing key is the 64-byte Base64 encoded value that is used to protect and secure your WebHooks callbacks from Azure Media Services. 

			<appSettings>
			  <add key="MediaServicesAccountName" value="AMSAcctName" />
			  <add key="MediaServicesAccountKey" value="AMSAcctKey" />
			  <add key="WebhookURL" value="https://<yourapp>.azurewebsites.net/api/<function>?code=<ApiKey>" />
			  <add key="WebhookSigningKey" value="j0txf1f8msjytzvpe40nxbpxdcxtqcgxy0nt" />
			</appSettings>
4. Update your Program.cs file with the following code


		using System;
		using System.Configuration;
		using System.Linq;
		using Microsoft.WindowsAzure.MediaServices.Client;


		namespace NotificationWebHook
		{
		    class Program
		    {
			// Read values from the App.config file.
			private static readonly string _mediaServicesAccountName =
			    ConfigurationManager.AppSettings["MediaServicesAccountName"];
			private static readonly string _mediaServicesAccountKey =
			    ConfigurationManager.AppSettings["MediaServicesAccountKey"];
			private static readonly string _webHookEndpoint =
			    ConfigurationManager.AppSettings["WebhookURL"];
			private static readonly string _signingKey =
			     ConfigurationManager.AppSettings["WebhookSigningKey"];

			// Field for service context.
			private static CloudMediaContext _context = null;

			static void Main(string[] args)
			{

			    // Used the cached credentials to create CloudMediaContext.
			    _context = new CloudMediaContext(new MediaServicesCredentials(
					    _mediaServicesAccountName,
					    _mediaServicesAccountKey));

			    byte[] keyBytes = Convert.FromBase64String(_signingKey);

			    IAsset newAsset = _context.Assets.FirstOrDefault();

			    // Create an Encoding Job

			    // Check for existing Notification Endpoint with the name "FunctionWebHook"

			    var existingEndpoint = _context.NotificationEndPoints.Where(e => e.Name == "FunctionWebHook").FirstOrDefault();
			    INotificationEndPoint endpoint = null;

			    if (existingEndpoint != null)
			    {
				Console.WriteLine("webhook endpoint already exists");
				endpoint = (INotificationEndPoint)existingEndpoint;
			    }
			    else
			    {
				endpoint = _context.NotificationEndPoints.Create("FunctionWebHook",
					NotificationEndPointType.WebHook, _webHookEndpoint, keyBytes);
				Console.WriteLine("Notification Endpoint Created with Key : {0}", keyBytes.ToString());
			    }

			    // Declare a new encoding job with the Standard encoder
			    IJob job = _context.Jobs.Create("MES Job");


			    // Get a media processor reference, and pass to it the name of the 
			    // processor to use for the specific task.
			    IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard");


			    ITask task = job.Tasks.AddNew("My encoding task",
				processor,
				"H264 Multiple Bitrate 720p",
				TaskOptions.None);


			    // Specify the input asset to be encoded.
			    task.InputAssets.Add(newAsset);

			    // Add an output asset to contain the results of the job. 
			    // This output is specified as AssetCreationOptions.None, which 
			    // means the output asset is not encrypted. 
			    task.OutputAssets.AddNew(newAsset.Name, AssetCreationOptions.None);

			    // Add the WebHook notification to this Task and request all notification state changes
			    if (endpoint != null)
			    {
				task.TaskNotificationSubscriptions.AddNew(NotificationJobState.All, endpoint, true);
				Console.WriteLine("Created Notification Subscription for endpoint: {0}", _webHookEndpoint);
			    }
			    else
			    {
				Console.WriteLine("No Notification Endpoint is being used");
			    }

			    job.Submit();

			    Console.WriteLine("Expect WebHook to be triggered for the Job ID: {0}", job.Id);
			    Console.WriteLine("Expect WebHook to be triggered for the Task ID: {0}", task.Id);

			    Console.WriteLine("Job Submitted");

			}
			private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
			{
			    var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
			    ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

			    if (processor == null)
				throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

			    return processor;
			}

		    }
		}


## Next step
Review Media Services learning paths

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
