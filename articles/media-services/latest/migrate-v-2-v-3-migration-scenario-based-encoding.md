---
title: Encoding migration guidance
description: This article gives you encoding scenario based guidance that will assist you in migrating from Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.workload: media
ms.date: 03/17/2021
ms.author: inhenkel
---

# Encoding scenario-based migration guidance

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-4.svg)

This article gives you encoding scenario based guidance that will assist you in migrating from Azure Media Services v2 to v3.

## Prerequisites

Before you get into changing your encoding workflow, it's recommended that you understand the differences in the way storage is managed.  In AMS V3, the Azure Storage API is used to manage the storage account(s) associated with your Media Services account.

> [!NOTE]
> Jobs and tasks created in v2 do not show up in v3 as they are not associated with a transform. The recommendation is to switch to v3 transforms and jobs.

## Encoding workflow comparison

Take a few minutes to look at the flowcharts below for a visual comparison of the encoding workflows for V2 and V3.

### V2 encoding workflow

Click on the image below to see a larger version.

[![Encoding workflow for V2](./media/migration-guide/V2-pretty.svg) ](./media/migration-guide/V2-pretty.svg#lightbox)

1. Setup
    1. Create an asset or use and existing asset. If using a new asset, upload content to that asset. If using an existing asset, you should be encoding files that already exist in the asset.
    2. Get the values of the following  items:
        - Media processor ID or object
        - Encoder string (name) of the encoder you want to use
        - Asset ID of new asset OR the asset ID of the existing asset
    3. For monitoring, create either a job or task level notification subscription or an SDK event handler
2. Create the job that contains the task or tasks. Each task should include the above items and:
    - A directive that an output asset needs to be created.  The output asset is created by the system.
    - Optional name for the output asset
3. Submit the job.
4. Monitor the job.

### V3 encoding workflow

[![Encoding workflow for V3](./media/migration-guide/V3-pretty.svg)](./media/migration-guide/V3-pretty.svg#lightbox)

1. Set up
    1. Create an asset or use an existing asset. If using a new asset, upload content to that asset. If using an existing asset, you should be encoding files that already exist in the asset. You *shouldn't upload more content to that asset.*
    1. Create an output asset.  The output asset is where the encoded files and input and output metadata will be stored.
    1. Get values for the transform:
        - Standard Encoder preset
        - AMS resource group
        - AMS account name
    1. Create the transform or use an existing transform.  Transforms are reusable. It isn't necessary to create a new transform each time you want to submit a job.
1. Create a job
    1. For the job, get the values for the following items:
        - Transform name
        - Base-URI for the SAS URL for your asset, the HTTPs source path of your file share, or the local path of the files. The `JobInputAsset` can also use an asset name as an input.
        - File name(s)
        - Output asset(s)
        - A resource group
        - AMS account name  
1. Use [Event Grid](monitoring/monitor-events-portal-how-to.md) for monitoring your job.
1. Submit the job.

## Custom presets from V2 to V3 encoding

If your V2 code called the Standard Encoder with a custom preset, you first need to create a new transform with the custom Standard Encoder preset before submitting a job.

Custom presets are now JSON and no longer XML based. Recreate your preset in JSON following the custom preset schema as defined in the [Transform Open API (Swagger)](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2020-05-01/examples/transforms-create.json) documentation.

## Input and output metadata files from an encoding job

In v2, XML input and output metadata files get generated as the result of an encoding job. In v3, the metadata format changed from XML to JSON. For more information about metadata, see [Input metadata](input-metadata-schema.md) and [Output metadata](output-metadata-schema.md).

## Premium Encoder to v3 Standard Encoder or partner-based solutions

The v2 API no longer supports the Premium Encoder. If you previously used the workflow-based Premium Encoder for HEVC encoding should migrate to the new v3 [Standard Encoder](media-encoder-standard-formats.md) with HEVC encoding support.

If you require the advanced workflow features of the Premium Encoder, you're encouraged to start using an Azure advanced encoding partner solution from [Imagine Communications](https://imaginecommunications.com), [Telestream](https://www.telestream.net)or [Bitmovin](https://bitmovin.com).

## Jobs with inputs that are on HTTPS hosted URLs

You can now submit jobs in V3 from files stored either in Azure storage, stored locally, or external web servers using the [HTTP(S) job input support](job-input-from-http-how-to.md).

If you previously used workflows to copy files from Azure blob files into empty assets before submitting jobs, you may be able to simplify your workflow by passing a SAS URL for the file in Azure blob storage directly into the job.

## Indexer v1 audio transcription to the new AudioAnalyzer “basic mode”

For customers using the Indexer v1 processor in the v2 API, you need to create a transform that invokes the new `AudioAnalyzer` in [basic mode](how-to-create-basic-audio-transform.md) prior to submitting a Job.

## Encoding, transforms and jobs concepts, tutorials and how to guides

### Concepts

- [Encoding video and audio with Media Services](encoding-concept.md)
- [Standard Encoder formats and codecs](media-encoder-standard-formats.md)
- [Encode with an autogenerated bitrate ladder](autogen-bitrate-ladder.md)
- [Use the content-aware encoding preset to find the optimal bitrate value for a given resolution](content-aware-encoding.md)
- [Media Reserved Units](concept-media-reserved-units.md)
- [Input metadata](input-metadata-schema.md)
- [Output metadata](output-metadata-schema.md)
- [Dynamic packaging in Media Services v3: audio codecs](dynamic-packaging-overview.md#audio-codecs-supported-by-dynamic-packaging)

### Tutorials

- [Tutorial: Encode a remote file based on URL and stream the video - .NET](stream-files-dotnet-quickstart.md)
- [Tutorial: Upload, encode, and stream videos with Media Services v3](stream-files-tutorial-with-api.md)

### How to guides

- [Create a job input from an HTTPS URL](job-input-from-http-how-to.md)
- [Create a job input from a local file](job-input-from-local-file-how-to.md)
- [Create a basic audio transform](how-to-create-basic-audio-transform.md)
- With .NET
  - [How to encode with a custom transform - .NET](customize-encoder-presets-how-to.md)
  - [How to create an overlay with Media Encoder Standard](how-to-create-overlay.md)
  - [How to generate thumbnails using Encoder Standard with .NET](media-services-generate-thumbnails-dotnet.md)
- With Azure CLI
  - [How to encode with a custom transform - Azure CLI](custom-preset-cli-howto.md)
- With REST
  - [How to encode with a custom transform - REST](custom-preset-rest-howto.md)
  - [How to generate thumbnails using Encoder Standard with REST](media-services-generate-thumbnails-rest.md)
- [Subclip a video when encoding with Media Services - .NET](subclip-video-dotnet-howto.md)
- [Subclip a video when encoding with Media Services - REST](subclip-video-rest-howto.md)

## Samples

You can also [compare the V2 and V3 code in the code samples](migrate-v-2-v-3-migration-samples.md).

## Next steps

[!INCLUDE [migration guide next steps](./includes/migration-guide-next-steps.md)]
