<properties 
	pageTitle="How to Deliver Streaming Content from Media Services – Azure" 
	description="Learn how to deliver streaming content from Media Services using a direct URL. Code samples are written in C# and use the Media Services SDK for .NET." 
	authors="juliako" 
	manager="dwrede" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/15/2015" 
	ms.author="juliako"/>


#How to: Deliver streaming content


This article is part of the [Media Services Video on Demand workflow](../media-services-video-on-demand-workflow) and [Media Services Live Streaming workflow](../media-services-live-streaming-workflow) series.  

##Overview

You can use adaptive bitrate streaming to deliver content by creating a streaming locator. Before you create a locator you should configure asset delivery policy as described in [this](../media-services-dotnet-configure-asset-delivery-policy) topic.  

The following example shows how to create an origin locator for an output asset produced by a job. The example assumes that you have already obtained a reference to an asset that contains smooth streaming files, and the variable named **assetToStream** is referenced in the code. 

To create an origin locator to streaming content:

   1. Get a reference to the streaming manifest file (.ism) in the asset 
   2. Define an access policy
   3. Create the origin locator by calling the CreateLocator method 
   4. Build a URL to the manifest file 

##Use Media Services .NET SDK 
 
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
	
	    // Create an OnDemandOrigin locator to the asset. 
	    originLocator = _context.Locators.CreateLocator(LocatorType.OnDemandOrigin, assetToStream,
	        policy,
	        DateTime.UtcNow.AddMinutes(-5));
	            
	    // Display some useful values based on the locator.
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

##Use Media Services .NET SDK Extensions

 The following code calls methods that generate the Smooth Streaming, HLS and MPEG-DASH URLs for adaptive streaming.

    // and the Progressive Download URL.
    Uri smoothStreamingUri = outputAsset.GetSmoothStreamingUri();
    Uri hlsUri = outputAsset.GetHlsUri();
    Uri mpegDashUri = outputAsset.GetMpegDashUri();

    Console.WriteLine(smoothStreamingUri);
    Console.WriteLine(hlsUri);
    Console.WriteLine(mpegDashUri);