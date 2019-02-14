---
title: Stream video files with Azure Media Services - CLI | Microsoft Docs
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
ms.custom: mvc
ms.date: 02/13/2019
ms.author: juliako
#Customer intent: As a developer, I want to create a Media Services account so that I can store, encrypt, encode, manage, and stream media content in Azure.
---

# Quickstart: Stream video files - CLI

This quickstart shows you how easy it is to encode and start streaming videos on a wide variety of browsers and devices using Azure Media Services. An input content can be specified using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage.
The sample in this topic encodes content that you make accessible via an HTTPS URL. Note that currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

By the end of the quickstart you will be able to stream a video.  

![Play the video](./media/stream-files-dotnet-quickstart/final-video.png)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create a Media Services account

To start encrypting, encoding, analyzing, managing, and streaming media content in Azure, you need to create a Media Services account. At the time, you create a Media Services account, you also create an associated storage account (or use an existing one).  

> [!NOTE]
> The Media Services account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Media Services account to avoid additional latency and data egress costs.

[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]
 
[!INCLUDE [media-services-cli-create-v3-account-include](../../../includes/media-services-cli-create-v3-account-include.md)]

## Encode

```json
#!/bin/bash

# Update the following variables for your own settings:
resourceGroup=amsResourceGroup
amsAccountName=amsmediaaccountname
outputAssetName=myOutputAsset
transformName=audioAnalyzerTransform

# NOTE: First create the Transforms in the Create-Transform.sh for these jobs to work!

# Create a Media Services Asset to output the job results to.
az ams asset create \
    -n $outputAssetName \
    -a $amsAccountName \
    -g $resourceGroup \

# Submit a Job to a simple encoding Transform using HTTPs URL
az ams job start \
    --name myFirstJob_007 \
    --transform-name $transformName \
    --base-uri 'https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/00000000-b215-4409-80af-529c3e853622/' \
    --files 'Ignite-short.mp4' \
    --output-asset $outputAssetName \
    -a $amsAccountName \
    -g $resourceGroup \

echo "press  [ENTER]  to continue."
read continue
```

## Publish

```json
#!/bin/bash

# WARNING:  This shell script requires Python 3 to be installed to parse JSON. 

# Update the following variables for your own settings:
resourceGroup=amsResourceGroup
amsAccountName=amsmediaaccountname
assetName="myAsset-uniqueID"
locatorName="myStreamingLocator"
streamingPolicyName="Predefined_DownloadAndClearStreaming"
#contentPolicyName=""

# Delete the locator if it already exists
az ams streaming locator delete \
    -a $amsAccountName \
    -g $resourceGroup \
    -n $locatorName \

# Create a new Streaming Locator. Modify the assetName variable to point to the Asset you want to publish
# This uses the predefined Clear Streaming Only policy, which allows for unencypted deliver over HLS, Smooth and DASH protocols. 
az ams streaming locator create \
    -a $amsAccountName \
    -g $resourceGroup \
    --asset-name $assetName \
    -n $locatorName \
    --streaming-policy-name $streamingPolicyName \
    #--end-time 2100-10-10T00:00:00Z \
    #--start-time 2018-04-28T00:00:00Z \
    #--content-policy-name $contentPolicyName \

# List the Streaming Endpoints on the account. If this is a new account it only has a 'default' endpoint, which may be stopped.
# To stream, you must first Start a Streaming Endpoint on your account. 
# This next commmand lists the Streaming Endpoints, and gets the value of the "hostname" property for the 'default' endpoint to be used when building
# the complete Streaming or download URL from the locator get-paths method following this.
# NOTE: This command requires Python 3.5 to be installed. 
hostName=$(az ams streaming endpoint list \
    -a $amsAccountName \
    -g $resourceGroup  | \
    python -c "import sys, json; print(json.load(sys.stdin)[0]['hostName'])")

echo -e "\n"
echo -e "Default hostname: https://"$hostName
   
# List the Streming URLs relative paths for the new locator.  You must append your Streaming Endpoint "hostname" path to these to resolve the full URL. 
# Note that the asset must have an .ismc and be encoded for Adaptive streaming in order to get Streaming URLs back. You can get download paths for any content type.
paths=$(az ams streaming locator get-paths \
    -a $amsAccountName \
    -g $resourceGroup \
    -n $locatorName )

downloadPaths=$(echo $paths | \
                python -c "import sys, json; print(json.load(sys.stdin)['downloadPaths'])" )

streamingPaths=$(echo $paths |\
                python -c "import sys, json; print(json.load(sys.stdin)['streamingPaths'])" )

echo -e "\n"
echo "DownloadPaths:" 
echo $downloadPaths
echo -e "\n"
echo "StreamingPaths:"
echo $streamingPaths

echo "press  [ENTER]  to continue."
read continue
```

## Test with Azure Media Player

To test the stream, this article uses Azure Media Player. 

> [!NOTE]
> If a player is hosted on an https site, make sure to update the URL to "https".

1. Open a web browser and navigate to [https://aka.ms/azuremediaplayer/](https://aka.ms/azuremediaplayer/).
2. In the **URL:** box, paste one of the streaming URL values you got when you ran the application. 
3. Press **Update Player**.

Azure Media Player can be used for testing but should not be used in a production environment. 

## Clean up resources

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this Quickstart, delete the resource group.

Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Next steps

> [!div class="nextstepaction"]
> [CLI samples](cli-samples.md)
