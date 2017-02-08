---

title: Manage streaming endpoints with .NET SDK. | Microsoft Docs
description: This topic shows how to manage streaming endpoints with the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
writer: juliako
manager: erikre
editor: ''

ms.assetid: 0da34a97-f36c-48d0-8ea2-ec12584a2215
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/05/2017
ms.author: juliako

---


# Manage streaming endpoints with .NET SDK

>[!NOTE]
>Make sure to review the [overview](media-services-streaming-endpoints-overview.md) topic. Also, review [StreamingEndpoint](https://docs.microsoft.com/rest/api/media/operations/streamingendpoint).

The code in this topic shows how to do the following tasks using the Azure Media Services .NET SDK:

- Examine the default streaming endpoint.
- Create/add new streaming endpoint.

	You might want to have multiple streaming endpoints if you plan to have different CDNs or a CDN and direct access.

	> [!NOTE]
	> You are only billed when your Streaming Endpoint is in running state.
	
- Update the streaming endpoint.
	
	Make sure to call the Update() function.

- Delete the streaming endpoint.

	>[!NOTE]
	>The default streaming endpoint cannot be deleted.

For information about how to scale the streaming endpoint, see [this](media-services-portal-scale-streaming-endpoints.md) topic.


###Set up the Visual Studio project

1. Create a new C# Console Application in Visual Studio 2015.  
2. Build the solution.
3. Use **NuGet** to install the [latest Azure Media Services .NET SDK package](https://www.nuget.org/packages/windowsazure.mediaservices/).   
4. Add the appSettings section to the .config file and update the Media Services name and key values. 
	
		<appSettings>
		  <add key="MediaServicesAccountName" value="Media-Services-Account-Name"/>
		  <add key="MediaServicesAccountKey" value="Media-Services-Account-Key"/>
		</appSettings>

###Add code that manages streaming endpoints
	
Replace the code in the Program.cs with the following code:

	using System;
	using System.Collections.Generic;
	using System.Configuration;
	using System.Linq;
	using Microsoft.WindowsAzure.MediaServices.Client;
	using Microsoft.WindowsAzure.MediaServices.Client.Live;
	
	namespace AMSStreamingEndpoint
	{
	    class Program
	    {
	        // Read values from the App.config file.
	        private static readonly string _mediaServicesAccountName =
	            ConfigurationManager.AppSettings["MediaServicesAccountName"];
	        private static readonly string _mediaServicesAccountKey =
	            ConfigurationManager.AppSettings["MediaServicesAccountKey"];
	
	        // Field for service context.
	        private static CloudMediaContext _context = null;
	        private static MediaServicesCredentials _cachedCredentials = null;
	
	        static void Main(string[] args)
	        {
	            // Create and cache the Media Services credentials in a static class variable.
	            _cachedCredentials = new MediaServicesCredentials(
	                            _mediaServicesAccountName,
	                            _mediaServicesAccountKey);
	            // Used the cached credentials to create CloudMediaContext.
	            _context = new CloudMediaContext(_cachedCredentials);
	
	            var defaultStreamingEndpoint = _context.StreamingEndpoints.Where(s=>s.Name.Contains("default")).FirstOrDefault();
	            ExamineStreamingEndpoint(defaultStreamingEndpoint);
	
	            IStreamingEndpoint newStreamingEndpoint = AddStreamingEndpoint();
	            UpdateStreamingEndpoint(newStreamingEndpoint);
	            DeleteStreamingEndpoint(newStreamingEndpoint);
	        }
	
	        static public void ExamineStreamingEndpoint(IStreamingEndpoint streamingEndpoint)
	        {
	            Console.WriteLine(streamingEndpoint.Name);
	            Console.WriteLine(streamingEndpoint.StreamingEndpointVersion);
	            Console.WriteLine(streamingEndpoint.FreeTrialEndTime);
	            Console.WriteLine(streamingEndpoint.ScaleUnits);
	            Console.WriteLine(streamingEndpoint.CdnProvider);
	            Console.WriteLine(streamingEndpoint.CdnProfile);
	            Console.WriteLine(streamingEndpoint.CdnEnabled);
	        }
	
	        static public IStreamingEndpoint AddStreamingEndpoint()
	        {
	            var name = "StreamingEndpoint" + DateTime.UtcNow.ToString("hhmmss");
	            var option = new StreamingEndpointCreationOptions(name, 1)
	            {
	                StreamingEndpointVersion = new Version("2.0"),
	                CdnEnabled = true,
	                CdnProfile = "CdnProfile",
	                CdnProvider = CdnProviderType.PremiumVerizon
	            };
	
	            var streamingEndpoint = _context.StreamingEndpoints.Create(option);
	
	            return streamingEndpoint;
	        }
	
	        static public void UpdateStreamingEndpoint(IStreamingEndpoint streamingEndpoint)
	        {
	            if(streamingEndpoint.StreamingEndpointVersion == "1.0")
	                streamingEndpoint.StreamingEndpointVersion = "2.0";
	
	            streamingEndpoint.CdnEnabled = false;
	            streamingEndpoint.Update();
	        }
	
	        static public void DeleteStreamingEndpoint(IStreamingEndpoint streamingEndpoint)
	        {
	            streamingEndpoint.Delete();
	        }
	    }
	}
	

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

