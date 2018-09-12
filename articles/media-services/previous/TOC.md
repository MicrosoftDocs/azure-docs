# [Media Services Documentation](index.md)

# [Overview](media-services-overview.md)
## [Scenarios and availability](scenarios-and-availability.md)
## [Concepts](media-services-concepts.md)

# Get started
## [Create and manage account](media-services-portal-create-account.md)
## [Set up your dev environment](media-services-set-up-computer.md)
### [.NET](media-services-dotnet-how-to-use.md)
### [REST](media-services-rest-how-to-use.md)  
## [Use AAD auth to access API](media-services-use-aad-auth-to-access-ams-api.md)
### [Use portal to manage AAD auth](media-services-portal-get-started-with-aad.md)
### [Access API with .NET](media-services-dotnet-get-started-with-aad.md)
### [Access API with REST](media-services-rest-connect-with-aad.md)
### [Use Azure CLI to create and configure AAD app](media-services-cli-create-and-configure-aad-app.md)
### [Use Azure PowerShell to create and configure AAD app](media-services-powershell-create-and-configure-aad-app.md)

## Deliver video on demand
### [Azure portal](media-services-portal-vod-get-started.md)
### [.NET SDK](media-services-dotnet-get-started.md)
### [Java](media-services-java-how-to-use.md)
### [REST](media-services-rest-get-started.md)
## Perform live streaming
### [Azure portal](media-services-portal-live-passthrough-get-started.md)
### [.NET](media-services-dotnet-live-encode-with-onpremises-encoders.md)

# How To
## Manage
### Entities
#### [.NET](media-services-dotnet-manage-entities.md)
#### [REST](media-services-rest-manage-entities.md)
### [Streaming endpoints](media-services-streaming-endpoints-overview.md)
#### [Azure portal](media-services-portal-manage-streaming-endpoints.md)
#### [.NET](media-services-dotnet-manage-streaming-endpoints.md)
### Storage
#### [Update Media Services after rolling storage access keys](media-services-roll-storage-access-keys.md)
#### [Manage assets across multiple storage accounts](meda-services-managing-multiple-storage-accounts.md)
### [Quotas and limitations](media-services-quotas-and-limitations.md)
## [Configure Postman](media-rest-apis-with-postman.md)
### [On-demand streaming collection](postman-collection.md)
### [Live streaming collection](postman-live-streaming-collection.md)
### [Environment](postman-environment.md)
## Upload content
### Upload files into an account
#### [Azure portal](media-services-portal-upload-files.md)
#### [.NET](media-services-dotnet-upload-files.md)
#### [REST](media-services-rest-upload-files.md)
### [Upload large files with Aspera](media-services-upload-files-with-aspera.md)
### [Upload files with StorSimple](media-services-upload-files-from-storsimple.md)
### [Copy existing blobs](media-services-copying-existing-blob.md)

## [Encode content](media-services-encode-asset.md)
### [Compare encoders](media-services-compare-encoders.md)
### [Manage speed and concurrency of your encoding](media-services-manage-encoding-speed.md)
### Media Encoder Standard (MES)
#### [Media Encoder Standard Formats and Codecs](media-services-media-encoder-standard-formats.md)
#### [Use MES to auto-generate a bitrate ladder](media-services-autogen-bitrate-ladder-with-mes.md)
#### Encode with Media Encoder Standard
##### [Azure portal](media-services-portal-encode.md)
##### [.NET](media-services-dotnet-encode-with-media-encoder-standard.md)
##### [REST](media-services-rest-encode-asset.md)
#### [Advanced encoding with MES](media-services-advanced-encoding-with-mes.md)
##### [Customize Media Encoder Standard presets](media-services-custom-mes-presets-with-dotnet.md)
##### [How to generate thumbnails using Media Encoder Standard with .NET](media-services-dotnet-generate-thumbnail-with-mes.md)
##### [Crop videos with Media Encoder Standard](media-services-crop-video.md)
#### MES Schemas
##### [Media Encoder Standard schema](media-services-mes-schema.md)
##### [Input metadata](media-services-input-metadata-schema.md)
##### [Output metadata](media-services-output-metadata-schema.md)
#### [MES Presets](media-services-mes-presets-overview.md) 
##### [H264 Multiple Bitrate 1080p Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-1080p-Audio-5.1.md)
##### [H264 Multiple Bitrate 1080p](media-services-mes-preset-H264-Multiple-Bitrate-1080p.md)
##### [H264 Multiple Bitrate 16x9 SD Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-16x9-SD-Audio-5.1.md)
##### [H264 Multiple Bitrate 16x9 SD](media-services-mes-preset-H264-Multiple-Bitrate-16x9-SD.md)
##### [H264 Multiple Bitrate 16x9 for iOS](media-services-mes-preset-H264-Multiple-Bitrate-16x9-for-iOS.md)
##### [H264 Multiple Bitrate 4K Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-4K-Audio-5.1.md)
##### [H264 Multiple Bitrate 4K](media-services-mes-preset-H264-Multiple-Bitrate-4K.md)
##### [H264 Multiple Bitrate 4x3 SD Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-4x3-SD-Audio-5.1.md)
##### [H264 Multiple Bitrate 4x3 SD](media-services-mes-preset-H264-Multiple-Bitrate-4x3-SD.md)
##### [H264 Multiple Bitrate 4x3 for iOS](media-services-mes-preset-H264-Multiple-Bitrate-4x3-for-iOS.md)
##### [H264 Multiple Bitrate 720p Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-720p-Audio-5.1.md)
##### [H264 Multiple Bitrate 720p](media-services-mes-preset-H264-Multiple-Bitrate-720p.md)
##### [H264 Single Bitrate 1080p Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-1080p-Audio-5.1.md)
##### [H264 Single Bitrate 1080p](media-services-mes-preset-H264-Single-Bitrate-1080p.md)
##### [H264 Single Bitrate 16x9 SD Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-16x9-SD-Audio-5.1.md)
##### [H264 Single Bitrate 16x9 SD](media-services-mes-preset-H264-Single-Bitrate-16x9-SD.md)
##### [H264 Single Bitrate 4K Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-4K-Audio-5.1.md)
##### [H264 Single Bitrate 4K](media-services-mes-preset-H264-Single-Bitrate-4K.md)
##### [H264 Single Bitrate 4x3 SD Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-4x3-SD-Audio-5.1.md)
##### [H264 Single Bitrate 4x3 SD](media-services-mes-preset-H264-Single-Bitrate-4x3-SD.md)
##### [H264 Single Bitrate 720p Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-720p-Audio-5.1.md)
##### [H264 Single Bitrate 720p](media-services-mes-preset-H264-Single-Bitrate-720p.md)
##### [H264 Single Bitrate 720p for Android](media-services-mes-preset-H264-Single-Bitrate-720p-for-Android.md)
##### [H264 Single Bitrate High Quality SD for Android](media-services-mes-preset-H264-Single-Bitrate-High-Quality-SD-for-Android.md)
##### [H264 Single Bitrate Low Quality SD for Android](media-services-mes-preset-H264-Single-Bitrate-Low-Quality-SD-for-Android.md)
### Media Encoder Premium Workflow
#### [Media Encoder Premium Workflow Formats and Codecs](media-services-premium-workflow-encoder-formats.md)
#### Encode with Media Encoder Premium Workflow
##### [Media Encoder Premium Workflow](media-services-encode-with-premium-workflow.md)
##### [Media Encoder Premium Workflow tutorials](media-services-media-encoder-premium-workflow-tutorials.md)
##### [Create Advanced Encoding Workflows with Workflow Designer](media-services-workflow-designer.md)
##### [Premium workflow with multiple input](media-services-media-encoder-premium-workflow-multiplefilesinput.md)
### [Create a task that generates fMP4 chunks](media-services-generate-fmp4-chunks.md)
### Media processors
#### [.NET](media-services-get-media-processor.md)
#### [REST](media-services-rest-get-media-processor.md)
### [Error codes](media-services-encoding-error-codes.md)
### Deprecated
#### [Static packaging and encryption](media-services-static-packaging.md)

## [Stream live](media-services-manage-channels-overview.md)
### [On-premises encoders](media-services-live-streaming-with-onprem-encoders.md)
#### [Recommended on-premises encoders](media-services-recommended-encoders.md)
#### [Azure portal](media-services-portal-live-passthrough-get-started.md)
#### [.NET](media-services-dotnet-live-encode-with-onpremises-encoders.md)
### [Live streaming with cloud encoder](media-services-manage-live-encoder-enabled-channels.md)
#### [Azure portal](media-services-portal-creating-live-encoder-enabled-channel.md)
#### [.NET](media-services-dotnet-creating-live-encoder-enabled-channel.md)
### [Configure on-premises encoders for use with cloud encoder](media-services-live-encoders-overview.md)
#### [FMLE encoder](media-services-configure-fmle-live-encoder.md)
#### [Haivision KB encoder](media-services-configure-kb-live-encoder.md)
#### [NewTek TriCaster encoder](media-services-configure-tricaster-live-encoder.md)
#### [Wirecast encoder](media-services-configure-wirecast-live-encoder.md)
### [Handle long-running operations](media-services-dotnet-long-operations.md)
### [Fragmented MP4 live ingest specification](media-services-fmp4-live-ingest-overview.md)

## [Clip content](media-services-azure-media-clipper-overview.md)
### [Getting started](media-services-azure-media-clipper-getting-started.md)
### [Load videos](media-services-azure-media-clipper-load-assets.md)
### [Configure keyboard shortcuts](media-services-azure-media-clipper-keyboard-shortcuts.md)
### [Configure localization](media-services-azure-media-clipper-localization.md)
### [Submit clipping jobs](media-services-azure-media-clipper-submit-job.md)
### [Azure portal](media-services-azure-media-clipper-portal.md)

## [Protect content](media-services-content-protection-overview.md)
### [Storage encryption](media-services-rest-storage-encryption.md)
### [AES-128 encryption](media-services-protect-with-aes128.md)
### [PlayReady/Widevine for Streaming](media-services-protect-with-playready-widevine.md)
### [FairPlay for Streaming](media-services-protect-hls-with-fairplay.md)
### [Offline PlayReady for Windows 10](https://blogs.msdn.microsoft.com/playready4/2016/10/26/does-azure-media-services-support-offline-mode/)
### [Offline Fairplay for iOS](media-services-protect-hls-with-offline-fairplay.md)
### [Offline Widevine for Android](offline-widevine-for-android.md)
### [Configure in Azure portal](media-services-portal-protect-content.md)
### [Deliver DRM licenses](media-services-deliver-keys-and-licenses.md)
### Create ContentKeys
#### [.NET](media-services-dotnet-create-contentkey.md)
#### [REST](media-services-rest-create-contentkey.md)
### License template overviews
#### [PlayReady license template](media-services-playready-license-template-overview.md)
#### [Widevine license template](media-services-widevine-license-template-overview.md)
### Configure asset delivery policies
#### [.NET](media-services-dotnet-configure-asset-delivery-policy.md)
#### [REST](media-services-rest-configure-asset-delivery-policy.md)
### Configure content key authorization policy
#### [Azure portal](media-services-portal-configure-content-key-auth-policy.md)
#### [.NET](media-services-dotnet-configure-content-key-auth-policy.md)
#### [REST](media-services-rest-configure-content-key-auth-policy.md)
### [Pass authentication tokens to AMS](media-services-pass-authentication-tokens.md)
### Reference designs
#### [Hybrid DRM system design](hybrid-design-drm-sybsystem.md)
#### [Reference multi-DRM design](media-services-cenc-with-multidrm-access-control.md)

## [Analyze](media-services-analytics-overview.md)
### [Analyze media using Azure portal](media-services-portal-analyze.md)
### [Process with Indexer 2](media-services-process-content-with-indexer2.md)
### [Process with Indexer](media-services-index-content.md)
#### [Task preset](indexer-task-preset.md)
### [Process with Hyperlapse](media-services-hyperlapse-content.md)
### [Process with Face Detector](media-services-face-and-emotion-detection.md)
### [Process with Motion Detector](media-services-motion-detection.md)
### [Process with Face Redactor](media-services-face-redaction.md)
#### [Face Redactor walkthrough](media-services-redactor-walkthrough.md)
### [Process with video thumbnails](media-services-video-summarization.md)
### [Process with OCR](media-services-video-optical-character-recognition.md)
### [Process with Content Moderator](media-services-content-moderation.md)

## [Configure telemetry](media-services-telemetry-overview.md)
###[.NET](media-services-dotnet-telemetry.md)
###[REST](media-services-rest-telemetry.md)

## Scale
### [Media Processing](media-services-scale-media-processing-overview.md)
#### [Azure portal](media-services-portal-scale-media-processing.md)
#### [.NET](media-services-dotnet-encoding-units.md)
### Streaming Endpoints
#### [Azure portal](media-services-portal-scale-streaming-endpoints.md)

## [Deliver content](media-services-deliver-content-overview.md)
### [Dynamic packaging](media-services-dynamic-packaging-overview.md)
### [Filters and dynamic manifests overview](media-services-dynamic-manifest-overview.md)
#### [Create filters with .NET](media-services-dotnet-dynamic-manifest.md)
#### [Create filters with REST](media-services-rest-dynamic-manifest.md)
### [CDN Caching Policy in Media Services Extension](../../cdn/cdn-caching-policy.md?toc=%2fazure%2fmedia-services%2ftoc.json)
### Publish content
#### [Azure portal](media-services-portal-publish.md)
#### [.NET](media-services-deliver-streaming-content.md)
#### [REST](media-services-rest-deliver-streaming-content.md)
### [Deliver by Download](media-services-deliver-asset-download.md)
### [Failover streaming scenario](media-services-implement-failover.md)

## Consume
### [Playback media with existing players](media-services-playback-content-with-existing-players.md)
### [Playback media with Media Player](media-services-develop-video-players.md)
### Other playback options
#### [Smooth streaming Windows Store application](media-services-build-smooth-streaming-apps.md)
#### [HTML5 Application with DASH.js](media-services-embed-mpeg-dash-in-html5.md)
#### [Adobe Open Source Media Framework players](media-services-use-osmf-smooth-streaming-client-plugin.md)
### [Insert ads on the client side](media-services-inserting-ads-on-client-side.md)
### [Licensing Microsoft Smooth Streaming Client Porting Kit](media-services-sspk.md)

## Integrate
### [Use Azure Functions with Media Services](media-services-dotnet-how-to-use-azure-functions.md)
### [Azure Functions with Media Services examples](https://github.com/Azure-Samples/media-services-dotnet-functions-integration)

## Monitor
### Check job progress
#### [REST](media-services-rest-check-job-progress.md)
#### [Azure portal](media-services-portal-check-job-progress.md)
#### [.NET](media-services-check-job-progress.md)
### [Monitor job notifications with queue storage](media-services-dotnet-check-job-progress-with-queues.md)
### [Monitor job notifications with webhooks](media-services-dotnet-check-job-progress-with-webhooks.md)

## Troubleshoot
### [Frequently asked questions](media-services-frequently-asked-questions.md)
### [Troubleshooting guide for live streaming](media-services-troubleshooting-live-streaming.md)
### [Error codes](media-services-error-codes.md)
### [Retry logic](media-services-retry-logic-in-dotnet-sdk.md)

# Reference
## [Code samples](https://azure.microsoft.com/resources/samples/?service=media-services)
## [Azure PowerShell (Resource Manager)](/powershell/module/azurerm.media)
## [Azure PowerShell (Service Management)](/powershell/module/servicemanagement/azure/?view=azuresmps-3.7.0)
## [.NET](/dotnet/api/microsoft.windowsazure.mediaservices.client)
## [REST](/rest/api/media/mediaservice)
## Specifications
### [Live Ingest - Fragmented MP4 live ingest specification](media-services-fmp4-live-ingest-overview.md)
### [Live Ingest - Signaling Timed Metadata in Live Streaming](media-services-specifications-live-timed-metadata.md)
### [Smooth Streaming HEVC](media-services-specifications-ms-sstr-amendment-hevc.md)

# Resources
## [Azure Media Services community](media-services-community.md)
## [Azure roadmap](https://azure.microsoft.com/roadmap/?category=web-mobile)
## [Pricing](https://azure.microsoft.com/pricing/details/media-services/)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Release notes](media-services-release-notes.md)
## [Videos](https://azure.microsoft.com/resources/videos/index/?services=media-services)
