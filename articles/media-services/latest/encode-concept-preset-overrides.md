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
ms.devlang: csharp
ms.topic: conceptual
ms.date: 09/20/2021
ms.author: johndeu
ms.custom: seodec18

---

# Using preset overrides to control per-job settings

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Transforms and jobs overview

To encode with Media Services v3, you need to create a [Transform](/rest/api/media/transforms) and a [Job](/rest/api/media/jobs). The transform defines a recipe for your encoding settings and outputs; the job is an instance of the recipe. For more information, see [Transforms and Jobs](transform-jobs-concept.md).

When encoding or using analytics with Media Services you can define custom presets in a transform to define what settings to use. Sometimes it is required to override the settings on a transform on a per-job basis to avoid having to create a custom transform for every scenario. To override any setting on your transform preset, you can use the preset override property of the [job output asset](/dotnet/api/microsoft.azure.management.media.models.joboutputasset) prior to submitting the job to the transform.

## Preset overrides

Preset overrides allow you the ability to pass in a customized preset that will override the settings supplied to a transform object after it was first created.  This property is available on the [job output asset](/dotnet/api/microsoft.azure.management.media.models.joboutputasset) when submitting a new job to a transform.

This can be useful for situations where you need to override some properties of your custom defined transforms, or a property on a built-in preset. For example, consider the scenario where you have created a custom transform that uses the [audio analyzer built-in preset](/rest/api/media/transforms/create-or-update#audioanalyzerpreset), but you initially set up that preset to use the audio language setting of "en-us" for English.  This would result in a transform where each job submitted would be sent to the speech-to-text transcription engine as US English only. Every job submitted to that transform would be locked to the "en-us" language setting. You could work around this scenario by having a transform defined for every language, but that would be much more difficult to manage and you could hit transform quota limitations in your account.
To best solve for this scenario, you use a preset override on the job output asset prior to submitting the job to the transform.  You can then define a single "Audio transcription" transform and pass in the required language settings per-job.

The preset override provides you a way to pass in a new custom preset definition with each job submitted to the transform. This property is available on the [job output](/dotnet/api/microsoft.azure.management.media.models.joboutput) entity in all SDK versions based off the 2021-06-01 version of the API.

For reference, see the [presetOverride](https://github.com/Azure/azure-rest-api-specs/blob/ce90f9b45945c73b8f38649ee6ead390ff6efe7b/specification/mediaservices/resource-manager/Microsoft.Media/stable/2021-06-01/Encoding.json#L1960) property on the job output entity in the REST documentation.

> [!NOTE]
> You can only use preset overrides to override the settings on a defined preset in the transform.  You cannot switch from one specific preset to another type. For example, attempting to override a transform created with the built-in content-aware encoding preset to use another preset like the audio analyzer would result in an error message.


## Example of preset override in .NET

A complete example using the .NET SDK for Media Services showing how to use preset override with a basic audio analyzer transform is available in GitHub.
See the [Analyze a media file with a audio analyzer preset](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/AudioAnalytics/AudioAnalyzer) sample for details on how to use the preset override property of the job output.

## Sample code of preset override in .NET

[!code-csharp[Main](../../../media-services-v3-dotnet/AudioAnalytics/AudioAnalyzer/program.cs#PresetOverride)]

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* [Upload, encode, and stream using Media Services](stream-files-tutorial-with-api.md).
* [Encode from an HTTPS URL using built-in presets](job-input-from-http-how-to.md).
* [Encode a local file using built-in presets](job-input-from-local-file-how-to.md).
* [Build a custom preset to target your specific scenario or device requirements](transform-custom-transform-how-to.md).
