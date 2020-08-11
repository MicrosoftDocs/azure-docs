---
title: Copy video and audio files with REST
titleSuffix: Azure Media Services
description: Learn how to copy videos and audio using Azure Media Services and REST.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.date: 08/11/2020
ms.author: inhenkel

---

# Tutorial: Copy video and audio files with REST

This tutorial shows you how to copy video and audio files using the `copyAllBitrateNonInterleaved` preset that is part of the `BuiltInStandardEncoderPreset`. It uses a combination of REST and JSON as well as the Azure Media Services CLI.  You can also use [Postman](media-rest-apis-with-postman.md).

This tutorial shows you how to:

> [!div class="checklist"]
> * Create a new asset
> * Upload MP4s to an asset container
> * Create a transform for copying audio and video files
> * Create and submit a job

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- [Create a Media Services account](./create-account-howto.md).<br/>Make sure to remember the values that you used for the resource group name and Media Services account name.
- Follow the steps in [Access Azure Media Services API with the Azure CLI](./access-api-howto.md) and save the credentials. You'll need to use them to access the API.

## Create a new asset
Use the CLI to create an [Asset](cli-create-asset.md).

## Upload all mp4s into the asset container
Use REST to [upload files](upload-files-rest-how-to.md) into the asset container.

## Create a new transform using BuiltInStandardEncoderPreset and copyAllBitrateNonInterleaved

When you create the transform, preset `copyAllBitrateNonInterleaved`.  It is one of the presets available to in the `BuiltInStandardEncoderPreset`. Try the JSON below:

```json
{
    "@odata.type": "#Microsoft.Media.BuiltInStandardEncoderPreset",
    "presetName": "copyAllBitrateNonInterleaved",
    "timelines": [[{
        "start": {
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
            "time":"PT5S"},
        "end":{
            "@odata.type": "#Microsoft.Media.AbsoluteClipTime",
        "time": "PT15S"}
        }
    ]]
}
```

## Create a job and submit the job

[Create and submit the job](cli-create-jobs.md). The putput asset will contain all .mp4 files, .ism, and .ismc files of the job.

### Clean up resource in your Media Services account

Generally, you should clean up everything except objects that you're planning to reuse. (Typically, you'll reuse Transforms and persist StreamingLocators). If you want your account to be clean after experimenting, delete the resources that you don't plan to reuse. Otherwise, you will be billed for the services.

If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. Execute the following CLI command:

```azurecli
az group delete --name amsResourceGroup
```

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

> [Tutorial: upload, encode, and stream files](stream-files-tutorial-with-api.md)
