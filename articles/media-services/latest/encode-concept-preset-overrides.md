---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Using preset overrides to change transform settings on job submission
description: This article how to use preset overrides to adjust transform settings on a per-job instance
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: conceptual
ms.date: 09/20/2021
ms.author: johnde
ms.custom: seodec18

---

# Using preset overrides to control encoind or analytics settings per job

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Transforms and jobs overview

To encode with Media Services v3, you need to create a [Transform](/rest/api/media/transforms) and a [Job](/rest/api/media/jobs). The transform defines a recipe for your encoding settings and outputs; the job is an instance of the recipe. For more information, see [Transforms and Jobs](transform-jobs-concept.md).

When encoding or using analytics with Media Services, you can define custom presets in a transform to tell the encoder how the input media files should be processed. Sometimes it is useful to override these settings on a transform on a per-job basis to avoid having to create a custom transform for every scenario. To override any setting on your transform preset, you can use the preset override property of the job output asset prior to submitting the job to the transform.

## Preset overrides

Preset overrides are provided on the job output asset when submitting the job to a transform. This allows you the ability to pass in a customized preset that will override the settings supplied to the transform object when it was first created.

For example, consider the case where you have created a custom transform that uses the audio analyzer built-in preset, but configures that preset to use the "en-us" English audio language setting.  This results in a transform object where all jobs submitted to it will be evaluated and processed by the speech-to-text transcription engine as US English only. Every job submitted to that transform would be locked to that language setting.
You could work around this scenario by having a transform defined for every language, but that would be more difficult to manage and it would be simpler to be able to just override the transform language on each job submitted to it.  That way you can define a single "Audio transcription" transform and pass in the required language settings per job.

The preset override provides you a way to pass in a new preset definition with each job submitted to the transform.
This property is available on the job output object in all SDK versions based off the 2021-06-01 version of the API.

For reference, see the [presetOverride](https://github.com/Azure/azure-rest-api-specs/blob/ce90f9b45945c73b8f38649ee6ead390ff6efe7b/specification/mediaservices/resource-manager/Microsoft.Media/stable/2021-06-01/Encoding.json#L1960) property on the job output entity in the REST API Swagger documentation.

### Example of preset override

A complete example using the .NET SDK for Media Services showing how to use preset override with a basic audio analyzer transform is available in github.
See the [Analyze a media file with a audio analyzer preset](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/AudioAnalytics/AudioAnalyzer) sample for details on how to use the preset override property of the job output. 

### Sample usage of preset override in .NET

[!code-csharp[Main](../../../media-services-v3-dotnet/AudioAnalytics/AudioAnalyzer/program.cs#PresetOverride)]

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* [Upload, encode, and stream using Media Services](stream-files-tutorial-with-api.md).
* [Encode from an HTTPS URL using built-in presets](job-input-from-http-how-to.md).
* [Encode a local file using built-in presets](job-input-from-local-file-how-to.md).
* [Build a custom preset to target your specific scenario or device requirements](transform-custom-presets-how-to.md).
