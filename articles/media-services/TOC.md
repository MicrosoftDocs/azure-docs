# [Overview](media-services-overview.md)
## [Concepts ](media-services-concepts.md)
## [Pricing](https://azure.microsoft.com/pricing/details/media-services/)
## [Release notes](media-services-release-notes.md)
# Get started
## [Create and manage account](media-services-portal-create-account.md)
## [Set up your dev environment](media-services-set-up-computer.md)
## Video on demand
### [Portal](media-services-portal-vod-get-started.md)
### [.NET SDK](media-services-dotnet-get-started.md)
### [Java](media-services-java-how-to-use.md)
### [REST](media-services-rest-get-started.md)
## Live streaming
### [Portal](media-services-portal-live-passthrough-get-started.md)
### [.NET](media-services-dotnet-live-encode-with-onpremises-encoders.md)

# How To
## Manage
### [Manage streaming endpoints in the portal](media-services-portal-manage-streaming-endpoints.md)
### Manage entities
#### [.NET](media-services-dotnet-manage-entities.md)
#### [REST](media-services-rest-manage-entities.md)
### [Manage accounts with PowerShell](media-services-manage-with-powershell.md)
### [Crop videos with Media Encoder Standard](media-services-crop-video.md)
### [How To: Update Media Services after Rolling Storage Access Keys](media-services-roll-storage-access-keys.md)
### [Quotas and limitations](media-services-quotas-and-limitations.md)
### Filters
#### [Creating Filters with Azure Media Services .NET SDK](media-services-dotnet-dynamic-manifest.md)
#### [How to encode an asset using Media Encoder Standard](media-services-rest-encode-asset.md)
### Connect programmatically
#### [.NET](media-services-dotnet-connect-programmatically.md)
#### [REST](media-services-rest-connect-programmatically.md)

## Upload content
### Upload files into an account
#### [Portal ](media-services-portal-upload-files.md)
#### [.NET](media-services-dotnet-upload-files.md)
#### [REST](media-services-rest-upload-files.md)
### [Copy existing blobs](media-services-copying-existing-blob.md)

## Encode
### [Content](media-services-encode-asset.md)
#### Encode an asset using Media Encoder Standard
##### [Portal](media-services-portal-encode.md)
##### [.NET](media-services-dotnet-encode-with-media-encoder-standard.md)
#### [How to generate thumbnails using Media Encoder Standard with .NET](media-services-dotnet-generate-thumbnail-with-mes.md)
#### [Advanced encoding](media-services-advanced-encoding-with-mes.md)
##### [Media Encoder Premium Workflow](media-services-encode-with-premium-workflow.md)
##### [Media Encoder Premium Workflow tutorials](media-services-media-encoder-premium-workflow-tutorials.md)
##### [Create Advanced Encoding Workflows with Workflow Designer](media-services-workflow-designer.md)
##### [Premium workflow with multiple input](media-services-media-encoder-premium-workflow-multiplefilesinput.md)

#### Schemas 
#####[Media Encoder Standard](media-services-mes-schema.md)
#####[Input metadata](media-services-input-metadata-schema.md)
#####[Output metadata](media-services-output-metadata-schema.md)

#### Legacy encoders
##### [Using the Azure Media Packager](media-services-static-packaging.md)

### [Live streams](media-services-manage-channels-overview.md)
#### [On-premise encoders](media-services-live-streaming-with-onprem-encoders.md)
#### On-premise encoder tutorials
##### [Portal](media-services-portal-live-passthrough-get-started.md)
##### [.NET](media-services-dotnet-live-encode-with-onpremises-encoders.md)
#### [Live streaming with cloud encoder](media-services-manage-live-encoder-enabled-channels.md)
#### Cloud encoder tutorials
##### [Portal](media-services-portal-creating-live-encoder-enabled-channel.md)
##### [.NET](media-services-dotnet-creating-live-encoder-enabled-channel.md)
#### [Configure on-premise encoders for use with cloud encoder](media-services-live-encoders-overview.md)
#### [Handle long-running operations](media-services-dotnet-long-operations.md)
#### [Fragmented MP4 live ingest specification](media-services-fmp4-live-ingest-overview.md)
#### [Dynamic packaging](media-services-dynamic-packaging-overview.md)

### Media Processing
#### [.NET](media-services-get-media-processor.md)
#### [REST](media-services-rest-get-media-processor.md)

### Configure encoders for a single bitrate live stream
#### [Elemental Live encoder](media-services-configure-elemental-live-encoder.md)
#### [FMLE encoder ](media-services-configure-fmle-live-encoder.md)
#### [NewTek TriCaster encoder](media-services-configure-tricaster-live-encoder.md)
#### [Wirecast encoder](media-services-configure-wirecast-live-encoder.md)

## [Protect](media-services-content-protection-overview.md)
### [Configure content protection in the portal](media-services-portal-protect-content.md)
### [Configure AES-128 clear key for your stream](media-services-protect-with-aes128.md)
### [Encrypting your Content with Storage Encryption using AMS REST API](media-services-rest-storage-encryption.md)
### [Media Services PlayReady License Template Overview](media-services-playready-license-template-overview.md)
### [DRM license delivery](media-services-deliver-keys-and-licenses.md)
### [Using partners to deliver Widevine licenses to Azure Media Services](media-services-licenses-partner-integration.md)
### [Using PlayReady and/or Widevine dynamic common encryption](media-services-protect-with-drm.md)
### [Use Azure Media Services to Stream your HLS content Protected with Apple FairPlay ](media-services-protect-hls-with-fairplay.md)
### [CENC with Multi-DRM and Access Control: A Reference Design and Implementation on Azure and Azure Media Services](media-services-cenc-with-multidrm-access-control.md)

### Asset delivery
#### Configure asset delivery policies
##### [.NET](media-services-dotnet-configure-asset-delivery-policy.md)
##### [REST](media-services-rest-configure-asset-delivery-policy.md)
### Create ContentKeys
#### [.NET](media-services-dotnet-create-contentkey.md)
#### [REST](media-services-rest-create-contentkey.md)
### Configure content key authorization policy
#### [Portal](media-services-portal-configure-content-key-auth-policy.md)
#### [.NET](media-services-dotnet-configure-content-key-auth-policy.md)
#### [REST](media-services-rest-configure-content-key-auth-policy.md)

## [Analyze](media-services-analytics-overview.md)
### [Process with Indexer 2](media-services-process-content-with-indexer2.md)
### [Process with Indexer](media-services-index-content.md)
### [Process with Hyperlapse](media-services-hyperlapse-content.md)
### [Process with Face Detector](media-services-face-and-emotion-detection.md)
### [Process with Motion Detector](media-services-motion-detection.md)
### [Process with Face redaction](media-services-face-redaction.md)
### [Process with video thumbnails](media-services-video-summarization.md)
### [Process with OCR](media-services-video-optical-character-recognition.md)

## Scale
### [Media Processing](media-services-scale-media-processing-overview.md)
#### [Portal](media-services-portal-scale-media-processing.md)
#### [.NET](media-services-dotnet-encoding-units.md)
#### [REST](https://msdn.microsoft.com/library/azure/dn859236.aspx)
### Streaming Endpoints
#### [Portal](media-services-portal-scale-streaming-endpoints.md)

## [Deliver content](media-services-deliver-content-overview.md)
### [Filters and dynamic manifests overview](media-services-dynamic-manifest-overview.md)
### Create filters
#### [.NET](media-services-dotnet-dynamic-manifest.md)
#### [REST](media-services-rest-dynamic-manifest.md)
### Publish content
#### [Portal](media-services-portal-publish.md)
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

## Integrate
### [CDN Caching Policy in Media Services Extension](../cdn/cdn-caching-policy.md?toc=%2fazure%2fmedia-services%2ftoc.json)
### [Licensing Microsoft†" Smooth Streaming Client Porting Kit](media-services-sspk.md)
### [Manage assets across multiple Storage accounts](meda-services-managing-multiple-storage-accounts.md)
### [Using Axinom to deliver Widevine licenses to Azure Media Services  ](media-services-axinom-integration.md)
### [Using castLabs to deliver Widevine licenses to Azure Media Services](media-services-castlabs-integration.md)
### [Widevine License Template Overview](media-services-widevine-license-template-overview.md)

## Monitor
### Check job progress
#### [REST](media-services-rest-check-job-progress.md)
#### [Portal](media-services-portal-check-job-progress.md)
#### [.NET](media-services-check-job-progress.md)
### [Queue storage to monitor job notifications](media-services-dotnet-check-job-progress-with-queues.md)

## Troubleshoot
### [Frequently asked questions](media-services-frequently-asked-questions.md)
### [Troubleshooting guide for live streaming](media-services-troubleshooting-live-streaming.md)
###[Error codes](media-services-error-codes.md)
###[Retry logic](media-services-retry-logic-in-dotnet-sdk.md)

# Reference
## [Media Services .NET SDK](media-services-dotnet-how-to-use.md)
## [Media Services REST API](media-services-rest-how-to-use.md)
## [Media Encoder Premium Workflow Formats and Codecs](media-services-premium-workflow-encoder-formats.md)
## [Media Encoder Standard Formats and Codecs](media-services-media-encoder-standard-formats.md)

# Related
## [Azure Media Services Community](media-services-community.md)









