---
title: Stream video files with Azure Media Services and the Azure CLI | Microsoft Docs
description: Follow the steps of this quickstart to create a new Azure Media Services account, encode a file, and stream it to Azure Media Player.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
keywords: azure media services, stream

ms.service: media-services
ms.workload: media
ms.topic: quickstart
ms.custom: 
ms.date: 02/19/2019
ms.author: juliako
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Quickstart: Stream video files - CLI

This quickstart shows you how easy it is to encode and start streaming videos on a wide variety of browsers and devices by using Azure Media Services. You can specify input content by using HTTPS URLs, SAS URLs, or paths to files in Azure Blob storage.

The sample in this article encodes content that you make accessible via an HTTPS URL. Media Services doesn't currently support chunked transfer encoding over HTTPS URLs.

By the end of this quickstart, you'll be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create a Media Services account

Before you can encrypt, encode, analyze, manage, and stream media content in Azure, you need to create a Media Services account. The Media Services account must be associated with one or more storage accounts.

Your Media Services account and all associated storage accounts must be in the same Azure subscription. We strongly recommend that you use storage accounts that are in the same place as the Media Services account. This helps limit latency and data egress costs.

### Create a resource group

```azurecli
az group create -n amsResourceGroup -l westus2
```

### Create an Azure storage account

In this example, we create a general-purpose v2 Standard LRS account.

If you want to experiment with storage accounts, use `--sku Standard_LRS`. However, when picking a SKU for production, consider using `--sku Standard_RAGRS`, which provides geographic replication for business continuity. For more information, see [storage accounts](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest).
 
```azurecli
az storage account create -n amsstorageaccount --kind StorageV2 --sku Standard_LRS -l westus2 -g amsResourceGroup
```

### Create an Azure Media Service account

```azurecli
az ams account create --n amsaccount -g amsResourceGroup --storage-account amsstorageaccount -l westus2
```

You get a response similar to this:

```
{
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount",
  "location": "West US 2",
  "mediaServiceId": "8b569c2e-d648-4fcb-9035-c7fcc3aa7ddf",
  "name": "amsaccount",
  "resourceGroup": "amsResourceGroupTest",
  "storageAccounts": [
    {
      "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Storage/storageAccounts/amsstorageaccount",
      "resourceGroup": "amsResourceGroupTest",
      "type": "Primary"
    }
  ],
  "tags": null,
  "type": "Microsoft.Media/mediaservices"
}
```

## Start streaming endpoint

The following CLI starts the default **Streaming Endpoint**.

```azurecli
az ams streaming-endpoint start  -n default -a amsaccount -g amsResourceGroup
```

You get a response similar to this:

```
az ams streaming-endpoint start  -n default -a amsaccount -g amsResourceGroup
{
  "accessControl": null,
  "availabilitySetName": null,
  "cdnEnabled": true,
  "cdnProfile": "AzureMediaStreamingPlatformCdnProfile-StandardVerizon",
  "cdnProvider": "StandardVerizon",
  "created": "2019-02-06T21:58:03.604954+00:00",
  "crossSiteAccessPolicies": null,
  "customHostNames": [],
  "description": "",
  "freeTrialEndTime": "2019-02-21T22:05:31.277936+00:00",
  "hostName": "amsaccount-usw22.streaming.media.azure.net",
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/streamingendpoints/default",
  "lastModified": "2019-02-06T21:58:03.604954+00:00",
  "location": "West US 2",
  "maxCacheAge": null,
  "name": "default",
  "provisioningState": "Succeeded",
  "resourceGroup": "amsResourceGroup",
  "resourceState": "Running",
  "scaleUnits": 0,
  "tags": {},
  "type": "Microsoft.Media/mediaservices/streamingEndpoints"
}
```

If the streaming endpoint is already running, you get this message:

```
(InvalidOperation) The server cannot execute the operation in its current state.
```

## Create a transform for Adaptive Bitrate Encoding

Create a **transform** to configure common tasks for encoding or analyzing videos. In this example, we do an adaptive bitrate encoding. Then, we submit a **job** under the transform that we created. The job is the actual request to Media Services to apply the transform to a given video or audio content input.

```azurecli
az ams transform create --name testEncodingTransform --preset AdaptiveStreaming --description 'a simple Transform for Adaptive Bitrate Encoding' -g amsResourceGroup -a amsaccount
```

You get a response similar to this:

```
{
  "created": "2019-02-15T00:11:18.506019+00:00",
  "description": "a simple Transform for Adaptive Bitrate Encoding",
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/transforms/testEncodingTransform",
  "lastModified": "2019-02-15T00:11:18.506019+00:00",
  "name": "testEncodingTransform",
  "outputs": [
    {
      "onError": "StopProcessingJob",
      "preset": {
        "odatatype": "#Microsoft.Media.BuiltInStandardEncoderPreset",
        "presetName": "AdaptiveStreaming"
      },
      "relativePriority": "Normal"
    }
  ],
  "resourceGroup": "amsResourceGroup",
  "type": "Microsoft.Media/mediaservices/transforms"
}
```

## Create an output asset

Create an output **asset** that's used as the encoding job's output.

```azurecli
az ams asset create -n testOutputAssetName -a amsaccount -g amsResourceGroup
```

You get a response that's similar to the following:

```
{
  "alternateId": null,
  "assetId": "96427438-bbce-4a74-ba91-e38179b72f36",
  "container": null,
  "created": "2019-02-14T23:58:19.127000+00:00",
  "description": null,
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/assets/testOutputAssetName",
  "lastModified": "2019-02-14T23:58:19.127000+00:00",
  "name": "testOutputAssetName",
  "resourceGroup": "amsResourceGroup",
  "storageAccountName": "amsstorageaccount",
  "storageEncryptionFormat": "None",
  "type": "Microsoft.Media/mediaservices/assets"
}
```

## Start a job by using HTTPS input

When you submit jobs to process your videos, you have to tell Media Services where to find the input video. One option is to specify an HTTPS URL as a job input (as shown in this example).

When you run `az ams job start`, you can set a label on the job's output. The label can later be used to identify what the output asset is for.

- If you assign a value to the label, set ‘--output-assets’ to “assetname=label”
- If you don't assign a value to the label, set ‘--output-assets’ to “assetname=”.
  Notice that we add "=" to the `output-assets`.

```azurecli
az ams job start --name testJob001 --transform-name testEncodingTransform --base-uri 'https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/' --files 'Ignite-short.mp4' --output-assets testOutputAssetName= -a amsaccount -g amsResourceGroup 
```

You get a response similar to this:

```
{
  "correlationData": {},
  "created": "2019-02-15T05:08:26.266104+00:00",
  "description": null,
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/transforms/testEncodingTransform/jobs/testJob001",
  "input": {
    "baseUri": "https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/",
    "files": [
      "Ignite-short.mp4"
    ],
    "label": null,
    "odatatype": "#Microsoft.Media.JobInputHttp"
  },
  "lastModified": "2019-02-15T05:08:26.266104+00:00",
  "name": "testJob001",
  "outputs": [
    {
      "assetName": "testOutputAssetName",
      "error": null,
      "label": "",
      "odatatype": "#Microsoft.Media.JobOutputAsset",
      "progress": 0,
      "state": "Queued"
    }
  ],
  "priority": "Normal",
  "resourceGroup": "amsResourceGroup",
  "state": "Queued",
  "type": "Microsoft.Media/mediaservices/transforms/jobs"
}
```

### Check status

In about five minutes, check the status of the job. It should be "Finished." It's not finished yet, check again in a few minutes. Once it is "Finished," go to the next step and create a **streaming locator**.

```azurecli
az ams job show -a amsaccount -g amsResourceGroup -t testEncodingTransform -n testJob001
```

## Create a Streaming Locator and get a path

After the encoding is complete, the next step is to make the video in the output asset available to clients for playback. To do this, first create a **Streaming Locator**. Then, build a streaming URLs that clients can use.

### Create a streaming locator

```azurecli
az ams streaming-locator create -n testStreamingLocator --asset-name testOutputAssetName --streaming-policy-name Predefined_ClearStreamingOnly  -g amsResourceGroup -a amsaccount 
```

You get a response similar to the following:

```
{
  "alternativeMediaId": null,
  "assetName": "output-3b6d7b1dffe9419fa104b952f7f6ab76",
  "contentKeys": [],
  "created": "2019-02-15T04:35:46.270750+00:00",
  "defaultContentKeyPolicyName": null,
  "endTime": "9999-12-31T23:59:59.999999+00:00",
  "id": "/subscriptions/<id>/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount/streamingLocators/testStreamingLocator",
  "name": "testStreamingLocator",
  "resourceGroup": "amsResourceGroup",
  "startTime": null,
  "streamingLocatorId": "e01b2be1-5ea4-42ca-ae5d-7fe704a5962f",
  "streamingPolicyName": "Predefined_ClearStreamingOnly",
  "type": "Microsoft.Media/mediaservices/streamingLocators"
}
```

### Get streaming locator paths

```azurecli
az ams streaming-locator get-paths -a amsaccount -g amsResourceGroup -n testStreamingLocator
```

You get a response similar to this:

```
{
  "downloadPaths": [],
  "streamingPaths": [
    {
      "encryptionScheme": "NoEncryption",
      "paths": [
        "/e01b2be1-5ea4-42ca-ae5d-7fe704a5962f/ignite.ism/manifest(format=m3u8-aapl)"
      ],
      "streamingProtocol": "Hls"
    },
    {
      "encryptionScheme": "NoEncryption",
      "paths": [
        "/e01b2be1-5ea4-42ca-ae5d-7fe704a5962f/ignite.ism/manifest(format=mpd-time-csf)"
      ],
      "streamingProtocol": "Dash"
    },
    {
      "encryptionScheme": "NoEncryption",
      "paths": [
        "/e01b2be1-5ea4-42ca-ae5d-7fe704a5962f/ignite.ism/manifest"
      ],
      "streamingProtocol": "SmoothStreaming"
    }
  ]
}
```

Copy the HTTP Live Streaming (HLS) path. In this case, it's `/e01b2be1-5ea4-42ca-ae5d-7fe704a5962f/ignite.ism/manifest(format=m3u8-aapl)`.

## Build the URL 

### Get the streaming endpoint host name

```azurecli
az ams streaming-endpoint list -a amsaccount -g amsResourceGroup -n default
```

Copy the `hostName` value. In this case: `amsaccount-usw22.streaming.media.azure.net`.

### Assemble the URL

"https:// " + &lt;hostName value&gt; + &lt;Hls path value&gt;

#### Example

`https://amsaccount-usw22.streaming.media.azure.net/7f19e783-927b-4e0a-a1c0-8a140c49856c/ignite.ism/manifest(format=m3u8-aapl)`

## Test playback by using Azure Media Player

To test the stream, this article uses Azure Media Player.

> [!NOTE]
> If a player is hosted on an https site, make sure to change the URL to "https".

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL** box, paste the URL that you built in the previous section.

  You can paste the URL in HLS, Dash, or Smooth format, and Azure Media Player will automatically use an appropriate streaming protocol for playback on your device.
3. Select **Update Player**.

>!NOTE
>Azure Media Player can be used for testing but should not be used in a production environment.

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts that you created for this Quickstart, delete the resource group.

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## See also

See [Job error codes](https://docs.microsoft.com/rest/api/media/jobs/get#joberrorcode).

## Next steps

> [!div class="nextstepaction"]
> [CLI samples](cli-samples.md)
