---
title: Stream live with Azure Media Services v3 using .NET Core | Microsoft Docs
description: This tutorial walks you through the steps of streaming live with Media Services v3 using .NET Core.
services: media-services
documentationcenter: ''
author: juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 06/06/2018
ms.author: juliako

---

# Stream live with Azure Media Services v3 using .NET Core

In Media Services, [LiveEvents](https://docs.microsoft.com/rest/api/media/liveevents) are responsible for processing live streaming content. A LiveEvent provides an input endpoint (ingest URL) that you then provide to a live encoder. The LiveEvent receives live input streams from the live encoder and makes it available for streaming through one or more [StreamingEndpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints). LiveEvents also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery. This tutorial shows how to use .NET Core to create a **pass-through** type of a live event. 

> [!NOTE]
> Make sure to review [Live streaming with Media Services v3](live-streaming-overview.md) before proceeding. 

The tutorial shows you how to:    

> [!div class="checklist"]
> * Create a Media Services account
> * Access the Media Services API
> * Configure the sample app
> * Examine the code that performs live streaming
> * Watch the event with [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html) at http://ampdemo.azureedge.net
> * Clean up resources

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following are required to complete the tutorial.

* Install Visual Studio Code or Visual Studio
* A camera or a device (like laptop) that is used to broadcast an event.
* An on-premises live encoder that converts signals from the camera to streams that are sent to the Media Services live streaming service. The stream has to be in **RTMP** or **Smooth Streaming** format.

## Download the sample

Clone a GitHub repository that contains the streaming .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```

The live streaming sample is located in the [Live](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/Live/MediaV3LiveApp) folder.

> [!IMPORTANT]
> This sample uses unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you will end up with multiple LiveEvents in your account. <br/>
> Make sure to stop the running LiveEvents. Otherwise, you will be **billed**!

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

[!INCLUDE [media-services-v3-cli-access-api-include](../../../includes/media-services-v3-cli-access-api-include.md)]

## Examine the code that performs live streaming

This section examines functions defined in the [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs) file of the *MediaV3LiveApp* project.

The sample creates a unique suffix for each resource so that we don't have name collisions if you run the sample multiple times without cleaning up.

> [!IMPORTANT]
> This sample uses unique suffix for each resource. If you cancel the debugging or terminate the app without running it through, you will end up with multiple LiveEvents in your account. <br/>
> Make sure to stop the running LiveEvents. Otherwise, you will be **billed**!
 
### Start using Media Services APIs with .NET SDK

To start using Media Services APIs with .NET, you need to create an **AzureMediaServicesClient** object. To create the object, you need to supply credentials needed for the client to connect to Azure using Azure AD. In the code you cloned at the beginning of the article, the **GetCredentialsAsync** function creates the ServiceClientCredentials object based on the credentials supplied in local configuration file.  

```csharp
private static async Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync(ConfigWrapper config)
{
    var credentials = await GetCredentialsAsync(config);

    return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
    {
        SubscriptionId = config.SubscriptionId,
    };
}
```

### Create a live event

This section shows how to create a **pass-through** type of LiveEvent (LiveEventEncodingType set to None). If you want to create a LiveEvent that is enabled for live encoding set LiveEventEncodingType to Basic. 

Some other things that you might want to specify when creating the live event are:

* Media Services location 
* The streaming protocol for the Live Event (currently, the RTMP and Smooth Streaming protocols are supported)
       
    You cannot change the protocol option while the LiveEvent or its associated LiveOutputs are running. If you require different protocols, you should create separate LiveEvent for each streaming protocol.  
* IP restrictions on the ingest and preview. You can define the IP addresses that are allowed to ingest a video to this LiveEvent. Allowed IP addresses can be specified as either a single IP address (for example '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, '10.0.0.1/22'), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').
    
    If no IP addresses are specified and there is no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.

When creating the event, you can specify to auto start it. 

```csharp
Console.WriteLine($"Creating a live event named {liveEventName}");
Console.WriteLine();

LiveEventPreview liveEventPreview = new LiveEventPreview
{
    AccessControl = new LiveEventPreviewAccessControl(
        ip: new IPAccessControl(
            allow: new IPRange[]
            {
                new IPRange (
                    name: "AllowAll",
                    address: "0.0.0.0",
                    subnetPrefixLength: 0
                )
            }
        )
    )
};

// This can sometimes take awhile. Be patient.
LiveEvent liveEvent = new LiveEvent(
    location: mediaService.Location, 
    description:"Sample LiveEvent for testing",
    vanityUrl:false,
    encoding: new LiveEventEncoding(
                // Set this to Basic to enable a transcoding LiveEvent, and None to enable a pass-through LiveEvent
                encodingType:LiveEventEncodingType.None, 
                presetName:null
            ),
    input: new LiveEventInput(LiveEventInputProtocol.RTMP), 
    preview: liveEventPreview,
    streamOptions: new List<StreamOptionsFlag?>()
    {
        // Set this to Default or Low Latency.
        // Low latency reduces the amount of buffering Media Services does.
        // Low latency can also reduce the stability of the live stream. 
        StreamOptionsFlag.Default
    }
);

Console.WriteLine($"Creating the LiveEvent, be patient this can take time...");
liveEvent = client.LiveEvents.Create(config.ResourceGroup, config.AccountName, liveEventName, liveEvent, autoStart:true);
```

### Get ingest URLs

Once the channel is created, you can get ingest URLs that you will provide to the live encoder. The encoder uses these URLs to input a live stream.


```csharp
// Get the input endpoint to configure the on-premises encoder with
string ingestUrl = liveEvent.Input.Endpoints.First().Url;
Console.WriteLine($"The ingest url to configure the on-premises encoder with is:");
Console.WriteLine($"\t{ingestUrl}");
Console.WriteLine();
```

### Get the preview URL

Use the previewEndpoint to preview and verify that the input from the encoder is actually being received.

> [!IMPORTANT]
> Make sure that the video is flowing to the Preview URL before continuing!

```sharp
string previewEndpoint = liveEvent.Preview.Endpoints.First().Url;
Console.WriteLine($"The preview url is:");
Console.WriteLine($"\t{previewEndpoint}");
Console.WriteLine();

Console.WriteLine($"Open the live preview in your browser and use the Azure Media Player to monitor the preview playback:");
Console.WriteLine($"\thttps://ampdemo.azureedge.net/?url={previewEndpoint}");
Console.WriteLine();
```

### Create and manage LiveEvents and LiveOutputs

Once you have the stream flowing into the LiveEvent, you can begin the streaming event by creating an Asset, LiveOutput, and StreamingLocator. This will archive the stream and make it available to viewers through the StreamingEndpoint. 

#### Create an Asset

Create an Asset for the LiveOutput to use.

```csharp
string assetName = "archiveAsset" + uniqueness;
Console.WriteLine($"Creating an asset named {assetName}");
Console.WriteLine();
Asset asset = client.Assets.CreateOrUpdate(config.ResourceGroup, config.AccountName, assetName, new Asset());
```

#### Create a LiveOutput

```csharp
string manifestName = "output";
string liveOutputName = "liveOutput" + uniqueness;
Console.WriteLine($"Creating a live output named {liveOutputName}");
Console.WriteLine();

LiveOutput liveOutput = new LiveOutput(assetName: asset.Name, manifestName: manifestName, archiveWindowLength: TimeSpan.FromMinutes(10));
liveOutput = client.LiveOutputs.Create(config.ResourceGroup, config.AccountName, liveEventName, liveOutputName, liveOutput);
```

#### Create a StreamingLocator

> [!NOTE]
> When your Media Services account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state. 


```csharp
StreamingLocator locator = new StreamingLocator(assetName: assetName, streamingPolicyName: PredefinedStreamingPolicy.ClearStreamingOnly);
locator = client.StreamingLocators.Create(config.ResourceGroup, config.AccountName, streamingLocatorName, locator);

// Get the default Streaming Endpoint on the account
StreamingEndpoint streamingEndpoint = client.StreamingEndpoints.Get(config.ResourceGroup, config.AccountName, "default");

// If it's not running, Start it. 
if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
{
    Console.WriteLine("Streaming Endpoint was Stopped, restarting now..");
    client.StreamingEndpoints.Start(config.ResourceGroup, config.AccountName, "default");
}

// Get the url to stream the output
ListPathsResponse paths = await client.StreamingLocators.ListPathsAsync(resourceGroupName, accountName, locatorName);

foreach (StreamingPath path in paths.StreamingPaths)
{
    UriBuilder uriBuilder = new UriBuilder();
    uriBuilder.Scheme = "https";
    uriBuilder.Host = streamingEndpoint.HostName;

    uriBuilder.Path = path.Paths[0];
    // Get the URL from the uriBuilder: uriBuilder.ToString()
}
```

### Cleaning up resources in your Media Services account

If you are done streaming events and want to clean up the resources provisioned earlier, follow the following procedure.

* Stop pushing the stream from the encoder.
* Stop the LiveEvent. Once the LiveEvent is stopped, it will not incur any charges. When you need to start it again, it will have the same ingest URL so you won't need to reconfigure your encoder.
* You can stop your StreamingEndpoint, unless you want to continue to provide the archive of your live event as an on-demand stream. If the LiveEvent is in stopped state, it will not incur any charges.

```csharp
private static void CleanupLiveEventAndOutput(IAzureMediaServicesClient client, string resourceGroup, string accountName, string liveEventName, string liveOutputName)
{
    // Delete the LiveOutput
    client.LiveOutputs.Delete(resourceGroup, accountName, liveEventName, liveOutputName);

    // Stop and delete the LiveEvent
    client.LiveEvents.Stop(resourceGroup, accountName, liveEventName);
    client.LiveEvents.Delete(resourceGroup, accountName, liveEventName);
}

private static void CleanupLocatorAssetAndStreamingEndpoint(IAzureMediaServicesClient client, string resourceGroup, string accountName, string streamingLocatorName, string assetName)
{
    // Delete the Streaming Locator
    client.StreamingLocators.Delete(resourceGroup, accountName, streamingLocatorName);

    // Delete the Archive Asset
    client.Assets.Delete(resourceGroup, accountName, assetName);
}

private static void CleanupAccount(IAzureMediaServicesClient client, string resourceGroup, string accountName)
{
    try{
        Console.WriteLine("Cleaning up the resources used, stopping the LiveEvent. This can take a few minutes to complete.");
        Console.WriteLine();

        var events = client.LiveEvents.List(resourceGroup, accountName);
        
        foreach (LiveEvent l in events)
        {
            if (l.Name == liveEventName){
                var outputs = client.LiveOutputs.List(resourceGroup, accountName, l.Name);

                foreach (LiveOutput o in outputs)
                {
                    client.LiveOutputs.Delete(resourceGroup, accountName, l.Name, o.Name);
                    Console.WriteLine($"LiveOutput: {o.Name} deleted from LiveEvent {l.Name}. The archived Asset and Streaming URLs are still retained for on-demand viewing.");
                }

                if (l.ResourceState == LiveEventResourceState.Running){
                    client.LiveEvents.Stop(resourceGroup, accountName, l.Name);
                    Console.WriteLine($"LiveEvent: {l.Name} Stopped.");
                    client.LiveEvents.Delete(resourceGroup, accountName, l.Name);
                    Console.WriteLine($"LiveEvent: {l.Name} Deleted.");
                    Console.WriteLine();
                }
            }
        }
    } 
    catch(ApiErrorException e)
    {
        Console.WriteLine("Hit ApiErrorException");
        Console.WriteLine($"\tCode: {e.Body.Error.Code}");
        Console.WriteLine($"\tCode: {e.Body.Error.Message}");
        Console.WriteLine();

    }
}
```        

## Watch the event

To watch the event, copy the streaming URL that you got when you ran code described in [Create a StreamingLocator](#create-a-streaminglocator) and use a player of your choice. You can use [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html) to test your stream at http://ampdemo.azureedge.net. 

Live event automatically converts events to on-demand content when stopped. Even after you stop and delete the event, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset. An asset cannot be deleted if it is used by an event; the event must be deleted first. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. You can use the **CloudShell** tool.

In the **CloudShell**, execute the following command:

```azurecli-interactive
az group delete --name amsResourceGroup
```

> [!IMPORTANT]
> Leaving the LiveEvent running incurs billing costs. Be aware, if the project/program crashes or is closed out for any reason, it could leave the LiveEvent running in a billing state.

## Next steps

[Stream files](stream-files-tutorial-with-api.md)

