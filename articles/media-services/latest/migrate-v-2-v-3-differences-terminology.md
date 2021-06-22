---
title: Media Services v3 terminology and entity changes
description: This article describes the terminology differences between Azure Media Services v2 to v3.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.devlang: multiple
ms.topic: conceptual
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 03/25/2021
ms.author: inhenkel
---

# Terminology and entity changes between Media Services V2 and V3

![migration guide logo](./media/migration-guide/azure-media-services-logo-migration-guide.svg)

<hr color="#5ea0ef" size="10">

![migration steps 2](./media/migration-guide/steps-2.svg)

This article describes the terminology differences between Azure Media Services v2 to v3.

## Naming conventions

Review the naming conventions that are applied to Media Services V3 resources. Also review [naming blobs](assets-concept.md#naming)

## Terminology changes

- A *Locator* is now called a *Streaming Locator*.
- A *Channel* is now called a *Live Event*.
- A *Program* is now called a *Live Output*.
- A *Task* is now called a *JobOutput*, which is part of a Job.

## Entity changes
| **V2 Entity**<!-- row --> | **V3 Entity** | **Guidance** | **Accessible to V3** | **Updated by V3** |
|--|--|--|--|--|
| `AccessPolicy`<!-- row --> | <!-- empty --> |  The entity `AccessPolicies` doesn't exist in V3. | No | No |
| `Asset`<!-- row --> | `Asset` | <!-- empty --> | Yes | Yes |
| `AssetDeliveryPolicy`<!-- row --> | `StreamingPolicy` | <!-- empty --> | Yes | No |
| `AssetFile`<!-- row --> | <!-- empty --> |The entity `AssetFiles` doesn't exist in V3. Although files (storage blobs) that you upload are still considered files.<br/><br/> Use the Azure Storage APIs to enumerate the blobs in a container instead. There are two ways to apply a transform to the files with a job:<br/><br/>Files already uploaded to storage: The URI would include the asset ID for jobs to be done on assets within a storage account.<br/><br/>Files to be uploaded during the transform and job process: The asset is created in storage, a SAS URL is returned, files are uploaded to storage, and then the transform is applied to the files. | No | No |
| `Channel`<!-- row --> | `LiveEvent` | Live Events replace Channels from the v2 API. They carry over most features, and have more new features like live transcriptions, stand-by mode, and support for RTMPS ingest. <br/><br/>See [live event in scenario based live streaming](migrate-v-2-v-3-migration-scenario-based-live-streaming.md) | No | No |
| `ContentKey`<!-- row --> | <!-- empty --> | `ContentKeys` is no longer an entity, it's now a property of a streaming locator.<br/><br/>  In v3, the content key data is either associated with the `StreamingLocator` (for output encryption) or the Asset itself (for client side storage encryption). | Yes | No |
| `ContentKeyAuthorizationPolicy`<!-- row --> | `ContentKeyPolicy` | <!-- empty --> | Yes | No |
| `ContentKeyAuthorizationPolicyOption` <!-- row --> | <!-- empty --> |  `ContentKeyPolicyOptions` are included in the `ContentKeyPolicy`. | Yes | No |
| `IngestManifest`<!-- row --> | <!-- empty --> | The entity `IngestManifests` doesn't exist in V3. Uploading files in V3 involves the Azure storage API. Assets are first created and then files are uploaded to the associated storage container. There are many ways to get data into an Azure Storage container that can be used instead. `JobInputHttp` also provides a way to download a job input from a given url if desired. | No | No |
| `IngestManifestAsset`<!-- row --> | <!-- empty --> | There are many ways to get data into an Azure Storage container that can be used instead. `JobInputHttp` also provides a way to download a job input from a given url if desired. | No | No |
| `IngestManifestFile`<!-- row --> | <!-- empty --> | There are many ways to get data into an Azure Storage container that can be used instead. `JobInputHttp` also provides a way to download a job input from a given url if desired. | No | No |
| `Job`<!-- row --> | `Job` | Create a `Transform` before creating a `Job`. | No | No |
| `JobTemplate`<!-- row --> | `Transform` | Use a `Transform` instead. A transform is a separate entity from a job and is reuseable. | No | No |
| `Locator`<!-- row --> | `StreamingLocator` | <!--empty --> | Yes | No |
| `MediaProcessor`<!-- row --> | <!-- empty --> | Instead of looking up the `MediaProcessor` to use by name, use the desired preset when defining a transform. The preset used will determine the media processor used by the job system. See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md). <!--Probably needs a link to its own article so customers know Indexerv1 maps to AudioAnalyzerPreset in basic mode, etc.--> | No | NA (readonly in V2) |
| `NotificationEndPoint`<!-- row --> | <!--empty --> | Notifications in v3 are handled via Azure Event Grid. The `NotificationEndpoint` is replaced by the Event Grid subscription registration which also encapsulates the configuration for the types of notifications to receive (which in v2 was handled by the `JobNotificationSubscription` of the Job, the `TaskNotificationSubscription` of the Task, and the Telemetry `ComponentMonitoringSetting`). The v2 Telemetry was split between Azure Event Grid and Azure Monitor to fit into the enhancements of the larger Azure ecosystem. | No | No |
| `Program`<!-- row --> | `LiveOutput` | Live Outputs now replace Programs in the v3 API.  | No | No |
| `StreamingEndpoint`<!-- row --> | `StreamingEndpoint` | Streaming Endpoints remain primarily the same. They're used for dynamic packaging, encryption, and delivery of HLS and DASH content for both live and on-demand streaming either direct from origin, or through the CDN. New features include support for better Azure Monitor integration and charting. |  Yes | Yes |
| `Task`<!-- row --> | `JobOutput` | Replaced by `JobOutput` (which is no longer a separate entity in the API).  See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md). | No | No |
| `TaskTemplate`<!-- row --> | `TransformOutput` | Replaced by `TransformOutput` (which is no longer a separate entity in the API). See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md). | No | No |
| `Inputs`<!-- row --> | `Inputs` | Inputs and outputs are now at the Job level. See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md) | No | No |
| `Outputs`<!-- row --> | `Outputs` | Inputs and outputs are now at the Job level.  In V3, the metadata format changed from XML to JSON.  Live Outputs start on creation and stop when deleted. See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md) | No | No |


| **Other changes** | **V2**  | **V3** |
|---|---|---|
| **Storage** <!--new row --> |||
| Storage <!--new row --> | | The V3 SDKs are now decoupled from the Storage SDK, which gives you more control over the version of Storage SDK you want to use and avoids versioning issues.                      |
| **Encoding** <!--new row --> |||
| Encoding bit rates <!--new row --> | bit rates measured in kbps ex: 128 (kbps)| bits per second  ex: 128000 (bits/second)|
| Encoding DRM FairPlay <!--new row --> | In Media Services V2, initialization vector (IV) can be specified. | In Media Services V3, the FairPlay IV cannot be specified.|
| Premium encoder <!--new row --> | Premium encoder and Legacy Indexer| The [Premium Encoder](../previous/media-services-encode-asset.md) and the legacy [media analytics processors](../previous/legacy-components.md) (Azure Media Services Indexer 2 Preview, Face Redactor, etc.) are not accessible via V3. We added support for audio channel mapping to the Standard encoder.  See [Audio in the Media Services Encoding Swagger documentation](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2020-05-01/Encoding.json).  <br/> See encoding topics in [scenario based encoding](migrate-v-2-v-3-migration-scenario-based-encoding.md) |
| **Transforms and jobs** <!--new row -->|||
| Job based processing HTTPS <!--new row --> |<!-- empty -->| For file-based Job processing, you can use a HTTPS URL as the input. You don't need to have content already stored in Azure, nor do you need to create Assets. |
| ARM templates for jobs <!--new row --> | ARM templates didn't exist in V2. | A transform can be used to build reusable configurations, to create Azure Resource Manager templates, and isolate processing settings between multiple customers or tenants. |
| **Live events** <!--new row --> |||
| Streaming endpoint <!--new row --> | A streaming endpoint represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. | Streaming Endpoints remain primarily the same. They're used for dynamic packaging, encryption, and delivery of HLS and DASH content for both live and on-demand streaming either direct from origin, or through the CDN.  New features include support for better Azure Monitor integration and charting. |
| Live event channels <!--new row --> | Channels are responsible for processing live streaming content. A Channel provides an input endpoint (ingest URL) that you then provide to a live transcoder. The channel receives live input streams from the live transcoder and makes it available for streaming through one or more streaming endpoints. Channels also provide a preview endpoint (preview URL) that you use to preview and validate your stream before further processing and delivery.| Live Events replace Channels from the v2 API. They carry over most features, and have more new features like live transcriptions, stand-by mode, and support for RTMPS ingest. |
| Live event programs <!--new row --> | A Program enables you to control the publishing and storage of segments in a live stream. Channels manage Programs. The Channel and Program relationship is similar to traditional media where a channel has a constant stream of content and a program is scoped to some timed event on that channel. You can specify the number of hours you want to keep the recorded content for the program by setting the `ArchiveWindowLength` property. This value can be set from a minimum of 5 minutes to a maximum of 25 hours.| Live Outputs now replace Programs in the v3 API. |
| Live event length <!--new row --> |<!-- empty -->| You can stream Live Events 24/7 when using Media Services for transcoding a single bitrate contribution feed into an output stream that has multiple bitrates.|
| Live event latency <!--new row --> |<!-- empty -->| New low latency live streaming support on live events. |
| Live Event Preview <!--new row --> |<!-- empty -->| Live Event Preview supports Dynamic Packaging and Dynamic Encryption. This enables content protection on Preview as well as DASH and HLS packaging. |
| Live event RTMPS <!--new row --> |<!-- empty-->| Improved RTMPS support with increased stability and more source encoder support. |
| Live event RTMPS secure ingest <!--new row --> | | When you create a live event, you get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token `AppId`, only the port number part is different. Two of the URLs are primary and backup for RTMPS.| 
| Live event transcription <!--new row --> |<!-- empty--> | Azure Media Service delivers video, audio, and text in different protocols. When you publish your live stream using MPEG-DASH or HLS/CMAF, then along with video and audio, our service delivers the transcribed text in IMSC1.1 compatible TTML.|
| Live event standby mode <!--new row --> | There was no standby mode for V2. | Stand-by mode is a new v3 feature that helps manage hot pools of Live Events. Customers can now start a Live Event in stand-by mode at lower cost before transitioning it to the running state. This improves channel start times and reduces costs of operating hot pools for faster start ups. |
| Live event billing <!--new row --> | <!-- empty-->| Live events billing is based on Live Channel meters. |
| Live outputs <!--new row --> | Programs had to be started after creation. | Live Outputs start on creation and stop when deleted. |
