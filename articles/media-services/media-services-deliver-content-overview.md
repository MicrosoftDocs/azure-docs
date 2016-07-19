<properties
	pageTitle="Delivering content to customers"
	description="This topic gives an overview of what is involved in delivering your content with Azure Media Services."
	services="media-services"
	documentationCenter=""
	authors="Juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/12/2016"
	ms.author="juliako"/>


# Deliver content to customers
When delivering your streaming or video-on-demand content to customers, your goal is to deliver high-quality video to various devices under different network conditions.

To achieve this goal, you can:

- Encode your stream to a multi-bitrate (adaptive bitrate) video stream. This will take care of quality and network conditions.
- Use Microsoft Azure Media Services [dynamic packaging](media-services-dynamic-packaging-overview.md) to dynamically re-package your stream into different protocols. This will take care of streaming on different devices. Media Services supports delivery of the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe Primetime/Access licensees only).

This article gives an overview of important content delivery concepts.

To check known issues, see [Known issues](media-services-deliver-content-overview.md#known-issues) .

## Dynamic packaging

With the dynamic packaging Media Services provides, you can deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming, HDS) without having to re-package into these streaming formats. We recommend delivering your content with dynamic packaging.

To take advantage of dynamic packaging, you need to do the following:

- Encode your mezzanine (source) file into a set of adaptive-bitrate MP4 files or adaptive bitrate Smooth Streaming files.
- Get at least one on-demand streaming unit for the streaming endpoint from which you plan to deliver your content. For more information, see [How to scale on-demand streaming reserved units](media-services-manage-origins.md#scale_streaming_endpoints).

With dynamic packaging, you store and pay for the files in single storage format. Media Services will build and serve the appropriate response based on your requests.

Note that in addition to being able to use the dynamic packaging capabilities, on-demand streaming reserved units provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. By default, on-demand streaming is configured in a shared-instance model for which server resources (for example, compute or egress capacity) are shared with all other users. You can improve an on-demand streaming throughput by purchasing on-demand streaming reserved units.

For more information see [Dynamic packaging](media-services-dynamic-packaging-overview.md).  

## Filters and dynamic manifests

Media Services enables you to define filters for your assets. These filters are server-side rules that help your customers do things like play a specific section of a video or specify a subset of audio and video renditions that your customer's device can handle (instead of all the renditions that are associated with the asset). This filtering is achieved through *dynamic manifests* that are created when your customer requests to stream a video based on one or more specified filters.

For more information, see [Filters and dynamic manifests](media-services-dynamic-manifest-overview.md).

## Locators

To provide your user with a URL that can be used to stream or download your content, you first need to publish your asset by creating a locator. A locator provides an entry point to access the files contained in an asset. Media Services supports two types of locators:

- OnDemandOrigin locators, used to stream media (for example, MPEG DASH, HLS, or Smooth Streaming) or progressively download files.
-  SAS (shared access signature) URL locators, used to download media files to your local computer.

An *access policy* is used to define the permissions (such as read, write, and list) and duration for which a client has access for a particular asset. Note that the list permission (AccessPermissions.List) should not be used when creating an OrDemandOrigin locator.

Locators have expiration dates. Azure Portal sets an expiration date 100 years in the future for locators.

>[AZURE.NOTE] If you used Azure Portal to create locators before March, 2015, those locators were set to expire after two years.  

To update an expiration date on a locator, use [REST](http://msdn.microsoft.com/library/azure/hh974308.aspx#update_a_locator ) or [.NET](http://go.microsoft.com/fwlink/?LinkID=533259) APIs. Note that when you update the expiration date of a SAS locator, the URL changes.

Locators are not designed to manage per-user access control. You can give different access rights to individual users by using Digital Rights Management (DRM) solutions. For more information, see [Securing Media](http://msdn.microsoft.com/library/azure/dn282272.aspx).

Note that when you create a locator, there may be a 30-second delay due to required storage and propagation processes in Azure Storage.


## Adaptive streaming

Adaptive bitrate technologies allow video player applications to determine network conditions and select from several bitrates. When network communication degrades, the client can select a lower bitrate so playback can continue with lower video quality. As network conditions improve, the client can switch to a higher bitrate with improved video quality. Azure Media Services supports the following adaptive bitrate technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS.

To provide users with streaming URLs, you first must create an OnDemandOrigin locator. Creating the locator gives you the base path to the asset that contains the content you want to stream. However, to be able to stream this content, you need to modify this path further. To construct a full URL to the streaming manifest file, you must concatenate the locator’s path value and the manifest (filename.ism) file name. Then append **/Manifest** and an appropriate format (if needed) to the locator path.

>[AZURE.NOTE]You can also stream your content over an SSL connection. To do this, make sure your streaming URLs start with HTTPS.

Note that you can only stream over SSL if the streaming endpoint from which you deliver your content was created after September 10th, 2014. If your streaming URLs are based on the streaming endpoints created after September 10th, 2014, the URL contains “streaming.mediaservices.windows.net.” Streaming URLs that contain “origin.mediaservices.windows.net” (the old format) do not support SSL. If your URL is in the old format and you want to be able to stream over SSL, create a new streaming endpoint. Use URLs based on the new streaming endpoint to stream your content over SSL.


## Streaming URL formats

### MPEG DASH format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=mpd-time-csf)



### Apple HTTP Live Streaming (HLS) V4 format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl)

### Apple HTTP Live Streaming (HLS) V3 format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl-v3)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3)

### Apple HTTP Live Streaming (HLS) format with audio-only filter

By default, audio-only tracks are included in the HLS manifest. This is required for Apple store certification for cellular networks. In this case, if a client doesn’t have sufficient bandwidth or is connected over a 2G connection, playback switches to audio-only. This helps to keep content streaming without buffering, but there is no video. In some scenarios, player buffering might be preferred over audio-only. If you want to remove the audio-only track, you can add **audio-only=false** to the URL.

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3,audio-only=false)

For more information see [this](https://azure.microsoft.com/blog/azure-media-services-release-dynamic-manifest-composition-remove-hls-audio-only-track-and-hls-i-frame-track-support/) blog.


### Smooth Streaming format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

Example:

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest

### <a id="fmp4_v20"></a>Smooth Streaming 2.0 manifest (legacy manifest)

By default, Smooth Streaming manifest format contains the repeat tag (r-tag). However, some players do not support the r-tag. Clients with these players can use a format that disables the r-tag:

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=fmp4-v20)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=fmp4-v20)

### HDS (for Adobe PrimeTime/Access licensees only)

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=f4m-f4f)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=f4m-f4f)

## Progressive download

With progressive download, you can start playing media before the entire file has been downloaded. You cannot progressively download .ism* (ismv, isma, ismt, or ismc) files.

To progressively download content, use the OnDemandOrigin type of locator. The following example shows the URL that is based on the OnDemandOrigin type of locator:

	http://amstest1.streaming.mediaservices.windows.net/3c5fe676-199c-4620-9b03-ba014900f214/BigBuckBunny_H264_650kbps_AAC_und_ch2_96kbps.mp4

You must decrypt any storage-encrypted assets that you wish to stream from the origin service for progressive download.

## Download

To download your content to a client device, you must create a SAS Locator. The SAS locator gives you access to the Azure Storage container where your file is located. To build the download URL, you have to embed the file name between the host and SAS signature.

The following example shows the URL that is based on the SAS locator:

	https://test001.blob.core.windows.net/asset-ca7a4c3f-9eb5-4fd8-a898-459cb17761bd/BigBuckBunny.mp4?sv=2012-02-12&se=2014-05-03T01%3A23%3A50Z&sr=c&si=7c093e7c-7dab-45b4-beb4-2bfdff764bb5&sig=msEHP90c6JHXEOtTyIWqD7xio91GtVg0UIzjdpFscHk%3D

The following considerations apply:

- You must decrypt any storage-encrypted assets that you wish to stream from the origin service for progressive download.
- A download that has not completed within 12 hours will fail.

## Streaming endpoints

A streaming endpoint represents a streaming service that can deliver content directly to a client player application or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a streaming endpoint service can be a live stream or a video-on-demand asset in your Media Services account. You can also control the capacity of the Streaming Endpoint service to handle growing bandwidth needs by adjusting streaming reserved units. You should allocate at least one reserved unit for applications in a production environment. For more information, see [How to scale a media service](media-services-manage-origins.md#scale_streaming_endpoints).

## Known issues

### Changes to Smooth Streaming manifest version

Prior to the July, 2016 service release when assets produced by Media Encoder Standard, Media Encoder Premium Workflow, or the legacy Azure Media Encoder were streamed using dynamic packaging, the Smooth Streaming manifest returned would conform to version 2.0. In version 2.0, the fragment durations do not use the so-called repeat (‘r’) tags. For example:

	<?xml version="1.0" encoding="UTF-8"?>
	<SmoothStreamingMedia MajorVersion="2" MinorVersion="0" Duration="8000" TimeScale="1000">
		<StreamIndex Chunks="4" Type="video" Url="QualityLevels({bitrate})/Fragments(video={start time})" QualityLevels="3" Subtype="" Name="video" TimeScale="1000">
			<QualityLevel Index="0" Bitrate="1000000" FourCC="AVC1" MaxWidth="640" MaxHeight="360" CodecPrivateData="00000001674D4029965201405FF2E02A100000030010000003032E0A000F42400040167F18E3050007A12000200B3F8C70ED0B16890000000168EB7352" />
			<c t="0" d="2000" n="0" />
			<c d="2000" />
			<c d="2000" />
			<c d="2000" />
		</StreamIndex>
	</SmoothStreamingMedia>

In the July, 2016 service release, the generated Smooth Streaming manifest conforms to version 2.2, with fragment durations using repeat tags. For example:

	<?xml version="1.0" encoding="UTF-8"?>
	<SmoothStreamingMedia MajorVersion="2" MinorVersion="2" Duration="8000" TimeScale="1000">
		<StreamIndex Chunks="4" Type="video" Url="QualityLevels({bitrate})/Fragments(video={start time})" QualityLevels="3" Subtype="" Name="video" TimeScale="1000">
			<QualityLevel Index="0" Bitrate="1000000" FourCC="AVC1" MaxWidth="640" MaxHeight="360" CodecPrivateData="00000001674D4029965201405FF2E02A100000030010000003032E0A000F42400040167F18E3050007A12000200B3F8C70ED0B16890000000168EB7352" />
			<c t="0" d="2000" r="4" />
		</StreamIndex>
	</SmoothStreamingMedia>

Some of the legacy Smooth Streaming clients may not support the repeat tags and fail to load the manifest. To mitigate this issue you can use the legacy manifest format parameter **(format=fmp4-v20)**. For more information, see [Smooth Streaming 2.0](media-services-deliver-content-overview.md#fmp4_v20), or update your client to the latest version, which supports repeat tags.

## Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## Related topics

[Update Media Services locators after rolling storage keys](media-services-roll-storage-access-keys.md)
