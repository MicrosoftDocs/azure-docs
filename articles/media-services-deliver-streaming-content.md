<properties urlDisplayName="Deliver Streaming Content from Media Services" pageTitle="How to Deliver Streaming Content from Media Services – Azure" metaKeywords="" description="Learn how to deliver streaming content from Media Services using a direct URL. Code samples are written in C# and use the Media Services SDK for .NET." metaCanonical="" disqusComments="1" umbracoNaviHide="0" title="How to: Deliver streaming content" authors="juliako" manager="dwrede" />

<tags ms.service="media-services" ms.workload="media" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="juliako" />


#How to: Deliver streaming content

This article is one in a series introducing Azure Media Services programming. The previous topic was [How to: Deliver an Asset by Download](../media-services-deliver-asset-download/).

In addition to downloading media content from Media Services, you can use adaptive bitrate streaming to deliver content. For example, you can create a direct URL, called a locator, to streaming content on a Media Services origin server. Client applications such as Microsoft Silverlight can play the streaming content directly from the locator.

The following example shows how to create an origin locator for an output asset produced by a job. The example assumes that you have already obtained a reference to an asset that contains smooth streaming files, and the variable named **assetToStream** is referenced in the code. 

To create an origin locator to streaming content:

   1. Get a reference to the streaming manifest file (.ism) in the asset 
   2. Define an access policy
   3. Create the origin locator by calling the CreateLocator method 
   4. Build a URL to the manifest file 

The following code shows how to implement the steps:
<pre><code>
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
</code></pre>

For more information about delivering assets, see:
<ul>
<li><a href="http://msdn.microsoft.com/en-us/library/jj129575.aspx">Deliver Assets with the Media Services for .NET</a></li>
<li><a href="http://msdn.microsoft.com/en-us/library/jj129578.aspx">Deliver Assets with the Media Services REST API</a></li>
</ul>

<h2>Next Steps</h2>
So far we have covered delivering media by downloading from Azure Storage and using Smooth Streaming. The next topic [How to Deliver HLS content](../media-services-deliver-http-live-streaming-content/) discusses delivering streaming content using Apple HTTP Live Streaming (HLS).
