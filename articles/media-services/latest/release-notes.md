---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: na
ms.topic: article
ms.date: 06/07/2019
ms.author: juliako
---

# Azure Media Services v3 release notes

To stay up-to-date with the most recent developments, this article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality

## Known issues

> [!NOTE]
> Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-sdk), CLI, or one of the supported SDKs.

For more information, see [Migration guidance for moving from Media Services v2 to v3](migrate-from-v2-to-v3.md#known-issues).

## June 2019

### Video subclipping

You can now trim or subclip a video when encoding it using a [Job](https://docs.microsoft.com/rest/api/media/jobs). 

This functionality works with any [Transform](https://docs.microsoft.com/rest/api/media/transforms) that is built using either the [BuiltInStandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#builtinstandardencoderpreset) presets, or the [StandardEncoderPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#standardencoderpreset) presets. 

See examples:

* [Subclip a video with .NET](subclip-video-dotnet-howto.md)
* [Subclip a video with REST](subclip-video-rest-howto.md)

## May 2019

### Azure Monitor support for Media Services diagnostic logs and metrics

You can now use Azure Monitor to view telemetry data emmited by Media Services.

* Use the Azure Monitor diagnostic logs to monitor requests sent by the Media Services Key Delivery endpoint. 
* Monitor metrics emitted by Media Services [Streaming Endpoints](streaming-endpoint-concept.md).   

For details, see [Monitor Media Services metrics and diagnostic logs](media-services-metrics-diagnostic-logs.md).

### Multi audio tracks support in Dynamic Packaging 

When streaming Assets that have multiple audio tracks with multiple codecs and languages, [Dynamic Packaging](dynamic-packaging-overview.md) now supports multi audio tracks for the HLS output (version 4 or above).

### Korea regional pair is open for Media Services 

Media Services is now available in Korea Central and Korea South regions. 

For more information, see [Clouds and regions in which Media Services v3 exists](azure-clouds-regions.md).

### Performance improvements

Added updates that include Media Services performance improvements.

* The maximum file size supported for processing was updated. See, [Quotas and limitations](limits-quotas-constraints.md).
* [Encoding speeds improvements](media-reserved-units-cli-how-to.md#choosing-between-different-reserved-unit-types).

## April 2019

### New presets

* [FaceDetectorPreset](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#facedetectorpreset) was added to the built-in analyzer presets.
* [ContentAwareEncodingExperimental](https://docs.microsoft.com/rest/api/media/transforms/createorupdate#encodernamedpreset) was added to the built-in encoder presets. For more information, see [Content-aware encoding](cae-experimental.md). 

## March 2019

Dynamic Packaging now supports Dolby Atmos. For more information, see [Audio codecs supported by dynamic packaging](dynamic-packaging-overview.md#audio-codecs).

You can now specify a list of asset or account filters, which would apply to your Streaming Locator. For more information, see [Associate filters with Streaming Locator](filters-concept.md#associating-filters-with-streaming-locator).

## February 2019

Media Services v3 is now supported in Azure national clouds. Not all features are available in all clouds yet. For details, see [Clouds and regions in which Azure Media Services v3 exists](azure-clouds-regions.md).

[Microsoft.Media.JobOutputProgress](media-services-event-schemas.md#monitoring-job-output-progress) event was added to the Azure Event Grid schemas for Media Services.

## January 2019

### Media Encoder Standard and MPI files 

When encoding with Media Encoder Standard to produce MP4 file(s), a new .mpi file is generated and added to the output Asset. This MPI file is intended to improve performance for [dynamic packaging](dynamic-packaging-overview.md) and streaming scenarios.

You should not modify or remove the MPI file, or take any dependency in your service on the existence (or not) of such a file.

## December 2018

Updates from the GA release of the V3 API include:
       
* The **PresentationTimeRange** properties are no longer 'required' for **Asset Filters** and **Account Filters**. 
* The $top and $skip query options for **Jobs** and **Transforms** have been removed and $orderby was added. As part of adding the new ordering functionality, it was discovered that the $top and $skip options had accidentally been exposed previously even though they are not implemented.
* Enumeration extensibility was re-enabled. This feature was enabled in the preview versions of the SDK and got accidentally disabled in the GA version.
* Two predefined streaming policies have been renamed. **SecureStreaming** is now **MultiDrmCencStreaming**. **SecureStreamingWithFairPlay** is now **Predefined_MultiDrmStreaming**.

## November 2018

The CLI 2.0 module is now available for [Azure Media Services v3 GA](https://docs.microsoft.com/cli/azure/ams?view=azure-cli-latest) – v 2.0.50.

### New commands

- [az ams account](https://docs.microsoft.com/cli/azure/ams/account?view=azure-cli-latest)
- [az ams account-filter](https://docs.microsoft.com/cli/azure/ams/account-filter?view=azure-cli-latest)
- [az ams asset](https://docs.microsoft.com/cli/azure/ams/asset?view=azure-cli-latest)
- [az ams asset-filter](https://docs.microsoft.com/cli/azure/ams/asset-filter?view=azure-cli-latest)
- [az ams content-key-policy](https://docs.microsoft.com/cli/azure/ams/content-key-policy?view=azure-cli-latest)
- [az ams job](https://docs.microsoft.com/cli/azure/ams/job?view=azure-cli-latest)
- [az ams live-event](https://docs.microsoft.com/cli/azure/ams/live-event?view=azure-cli-latest)
- [az ams live-output](https://docs.microsoft.com/cli/azure/ams/live-output?view=azure-cli-latest)
- [az ams streaming-endpoint](https://docs.microsoft.com/cli/azure/ams/streaming-endpoint?view=azure-cli-latest)
- [az ams streaming-locator](https://docs.microsoft.com/cli/azure/ams/streaming-locator?view=azure-cli-latest)
- [az ams account mru](https://docs.microsoft.com/cli/azure/ams/account/mru?view=azure-cli-latest) - enables you to manage Media Reserved Units. For more information, see [Scale Media Reserved Units](media-reserved-units-cli-how-to.md).

### New features and breaking changes

#### Asset commands

- ```--storage-account``` and ```--container``` arguments added.
- Default values for expiry time (Now+23h) and permissions (Read) in ```az ams asset get-sas-url``` command added.

#### Job commands

- ```--correlation-data``` and ```--label``` arguments added
- ```--output-asset-names``` renamed to ```--output-assets```. Now it accepts a space-separated list of assets in 'assetName=label' format. An asset without label can be sent like this: 'assetName='.

#### Streaming Locator commands

- ```az ams streaming locator``` base command replaced with ```az ams streaming-locator```.
- ```--streaming-locator-id``` and ```--alternative-media-id support``` arguments added.
- ```--content-keys argument``` argument updated.
- ```--content-policy-name``` renamed to ```--content-key-policy-name```.

#### Streaming Policy commands

- ```az ams streaming policy``` base command replaced with ```az ams streaming-policy```.
- Encryption parameters support in ```az ams streaming-policy create``` added.

#### Transform commands

- ```--preset-names``` argument replaced with ```--preset```. Now you can only set 1 output/preset at a time (to add more you have to run ```az ams transform output add```). Also, you can set custom StandardEncoderPreset by passing the path to your custom JSON.
- ```az ams transform output remove``` can be performed by passing the output index to remove.
- ```--relative-priority, --on-error, --audio-language and --insights-to-extract``` arguments added in ```az ams transform create``` and ```az ams transform output add``` commands.

## October 2018 - GA

This section describes Azure Media Services (AMS) October updates.

### REST v3 GA release

The [REST v3 GA release](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01) includes more APIs for Live, Account/Asset level manifest filters, and DRM support.

#### Azure Resource Management 

Support for Azure Resource Management enables unified management and operations API (now everything in one place).

Starting with this release, you can use Resource Manager templates to create Live Events.

#### Improvement of Asset operations 

The following improvements were introduced:

- Ingest from HTTP(s) URLs or Azure Blob Storage SAS URLs.
- Specify you own container names for Assets. 
- Easier output support to create custom workflows with Azure Functions.

#### New Transform object

The new **Transform** object simplifies the Encoding model. The new object makes it easy to create and share encoding Resource Manager templates and presets. 

#### Azure Active Directory authentication and RBAC

Azure AD Authentication and Role-Based Access Control (RBAC) enable secure Transforms, LiveEvents, Content Key Policies, or Assets by Role or Users in Azure AD.

#### Client SDKs  

Languages supported in Media Services v3: .NET Core, Java, Node.js, Ruby, Typescript, Python, Go.

#### Live encoding updates

The following live encoding updates are introduced:

- New low latency mode for live (10 seconds end-to-end).
- Improved RTMP support (increased stability and more source encoder support).
- RTMPS secure ingest.

    When you create a Live Event, you now get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token (AppId), only the port number part is different. Two of the URLs are primary and backup for RTMPS. 
- 24-hour transcoding support. 
- Improved ad-signaling support in RTMP via SCTE35.

#### Improved Event Grid support

You can see the following Event Grid support improvements:

- Azure Event Grid integration for easier development with Logic Apps and Azure Functions. 
- Subscribe for events on Encoding, Live Channels, and more.

### CMAF support

CMAF and 'cbcs' encryption support for Apple HLS (iOS 11+) and MPEG-DASH players that support CMAF.

### Video Indexer

Video Indexer GA release was announced in August. For new information about currently supported features, see [What is Video Indexer](../../cognitive-services/video-indexer/video-indexer-overview.md?toc=/azure/media-services/video-indexer/toc.json&bc=/azure/media-services/video-indexer/breadcrumb/toc.json). 

### Plans for changes

#### Azure CLI 2.0
 
The Azure CLI 2.0 module that includes operations on all features (including Live, Content Key Policies, Account/Asset Filters, Streaming Policies) is coming soon. 

### Known issues

Only customers that used the preview API for Asset or AccountFilters are impacted by the following issue.

If you created Assets or Account Filters between 09/28 and 10/12 with Media Services v3 CLI or APIs, you need to remove all Asset and AccountFilters and re-create them due to a version conflict. 

## May 2018 - Preview

### .NET SDK

The following features are present in the .NET SDK:

* **Transforms** and **Jobs** to encode or analyze media content. For examples, see [Stream files](stream-files-tutorial-with-api.md) and [Analyze](analyze-videos-tutorial-with-api.md).
* **Streaming Locators** for publishing and streaming content to end-user devices
* **Streaming Policies** and **Content Key Policies** to configure key delivery and content protection (DRM) when delivering content.
* **Live Events** and **Live Outputs** to configure the ingest and archiving of live streaming content.
* **Assets** to store and publish media content in Azure Storage. 
* **Streaming Endpoints** to configure and scale dynamic packaging, encryption, and streaming for both live and on-demand media content.

### Known issues

* When submitting a job, you can specify to ingest your source video using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage. Currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Overview](media-services-overview.md)
