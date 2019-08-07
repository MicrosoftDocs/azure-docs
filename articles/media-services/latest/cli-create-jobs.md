---
title: Azure CLI Script Example - Create and submit a job | Microsoft Docs
description: The Azure CLI script in this topic shows how to submit a Job to a simple encoding Transform using HTTPs URL.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: 

ms.assetid:
ms.service: media-services
ms.devlang: azurecli
ms.topic: sample
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 05/01/2019
ms.author: juliako
---

# CLI example: Create and submit a job

In Media Services v3, when you submit Jobs to process your videos, you have to tell Media Services where to find the input video. One of the options is to specify an HTTPS URL as a job input (as shown in this article). 

## Prerequisites 

[Create a Media Services account](create-account-cli-how-to.md).

[!INCLUDE [media-services-cli-instructions.md](../../../includes/media-services-cli-instructions.md)]

## Example script

When you run `az ams job start`, you can set a label on the job's output. The label can later be used to identify what this output asset is for. 

- If you assign a value to the label, set ‘--output-assets’ to “assetname=label”
- If you do not assign a value to the label, set ‘--output-assets’ to “assetname=”.
  Notice that you add "=" to the `output-assets`. 

```azurecli
az ams job start \
  --name testJob001 \
  --transform-name testEncodingTransform \
  --base-uri 'https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/' \
  --files 'Ignite-short.mp4' \
  --output-assets testOutputAssetName= \
  -a amsaccount \
  -g amsResourceGroup 
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

## Next steps

[Media Services overview](media-services-overview.md)