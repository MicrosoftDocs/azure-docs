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

<iframe scrolling="yes">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique sollicitudin erat, et vulputate lectus cursus quis. Nulla turpis ante, suscipit et ante facilisis, pellentesque faucibus justo. Phasellus in viverra eros. Ut hendrerit urna arcu, vel sodales dui hendrerit non. Donec dolor metus, commodo in efficitur nec, mollis quis quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam in purus tellus. Quisque nulla leo, congue in erat sed, placerat aliquet sapien. Etiam nisi purus, mattis vitae nisl nec, sodales suscipit nunc. Donec blandit tellus urna, eleifend hendrerit tortor finibus quis. Sed sed pretium ante. Nunc laoreet tellus orci, nec viverra mauris pulvinar quis. Integer semper felis eget ornare faucibus. Ut vehicula ipsum vel augue facilisis sodales.

In eu felis erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla posuere porttitor risus vitae commodo. Integer fringilla rhoncus leo. Nunc dictum tristique egestas. Vivamus nibh justo, ultricies sit amet porttitor a, efficitur et tortor. Nunc tempor nibh at sem volutpat, quis luctus turpis lacinia. Proin commodo urna sem, non imperdiet magna scelerisque a. Curabitur luctus eu nunc id consectetur. In accumsan ante non neque aliquet, nec mattis risus facilisis. In risus dui, convallis at rutrum et, vestibulum in quam.

Mauris condimentum enim non felis pretium, lacinia imperdiet lorem vulputate. Vivamus quis pretium mauris. Nunc vitae elementum eros. Quisque semper efficitur eros, id maximus arcu tincidunt non. Integer ut scelerisque ante. Etiam vestibulum tortor vel magna sollicitudin hendrerit. Sed faucibus nisl id imperdiet aliquam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus fringilla felis in magna dictum, et ullamcorper lectus dignissim. Fusce vel ligula eu nibh lacinia malesuada non sodales odio. Duis auctor malesuada dolor nec aliquet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent varius elit dui, a consectetur dolor tincidunt non. Vivamus fringilla, sapien id cursus congue, risus urna varius eros, id auctor dolor elit ut magna. Aliquam ac pulvinar sapien. Nam ut porttitor turpis.</iframe>

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

[Create and submit the job](cli-create-jobs.md). The output asset will contain all .mp4 files, .ism, and .ismc files of the job.

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
