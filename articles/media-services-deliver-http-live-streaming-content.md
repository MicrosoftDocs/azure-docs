<properties 
	pageTitle="How to Deliver Apple HTTP Live Streaming (HLS) - Azure" 
	description="Learn how to create a locator to Apple HTTP Live Stream (HLS) content on Media Services origin server. Code samples are written in C# and use the Media Services SDK for .NET." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/30/2014" 
	ms.author="juliako"/>





<h1>How to: Deliver Apple HLS streaming content</h1>

This article is one in a series introducing Azure Media Services programming. The previous topic was [How to: Deliver Streaming Content](../media-services-deliver-streaming-content/).

This topic shows how to create a locator to Apple HTTP Live Streaming (HLS) content on a Media Services origin server. Using this approach, you can build a URL to Apple HLS content, and provide it to Apple iOS devices for playback. The basic approach to building the locator URL is the same. Build a locator to the Apple HLS streaming asset path on an origin server, and then build a full URL that links to the manifest for the streaming content.

The following code example assumes that you have already obtained a reference to an HLS streaming asset, and the variable named **assetToStream** is referenced in the code. After you have run this code to generate an origin locator on the asset, you can use the resulting URL to play back the streaming content in an iOS device such as an iPad or an iPhone.

To build a locator to Apple HLS streaming content:

   1. Get a reference to the manifest file in the asset
   2. Define an access policy
   3. Create the origin locator by calling the CreateLocator
   4. Build a URL to the manifest file

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

For more information about delivering assets, see:
<ul>
<li><a href="http://msdn.microsoft.com/library/jj129575.aspx">Deliver Assets with the Media Services for .NET</a></li>
<li><a href="http://msdn.microsoft.com/library/jj129578.aspx">Deliver Assets with the Media Services REST API</a></li>
</ul>

<h2>Next steps</h2>

This topic concludes the Using Azure Media Services topics. We have covered setting up your machine for Media Services development and performing typical programming tasks. For more information about programming Media Services, see the following resources :

-   [Azure Media Services Documentation][]
-   [Getting Started with the Media Services SDK for .NET][]
-   [Building Applications with the Media Services SDK for .NET][]
-   [Building Applications with the Azure Media Services REST API][]
-   [Media Services Forum][]
-	[How to Monitor a Media Services Account](media-services-monitor-services-account.md)
-	[How to Manage Content in Media Services](media-services-manage-content.md)

[Azure Media Services Documentation]: http://go.microsoft.com/fwlink/?linkid=245437
[Getting Started with the Media Services SDK for .NET]: http://go.microsoft.com/fwlink/?linkid=252966
[Building Applications with the Azure Media Services REST API]: http://go.microsoft.com/fwlink/?linkid=252967
[Building Applications with the Media Services SDK for .NET]: http://go.microsoft.com/fwlink/?linkid=247821
[Media Services Forum]: http://social.msdn.microsoft.com/Forums/MediaServices/threads
