<properties 
	pageTitle="Delivering Content to Customers Overview" 
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


#Delivering Content to Customers Overview

##Overview

When delivering your content to customers (streaming live events or video-on-demand) your goal is to deliver a high quality video to various devices under different network conditions. 

To achieve this goal:

- encode your stream to multi-bitrate (adaptive bitrate) video stream (this will take care of quality and network conditions) and 
- use Media Services [Dynamic Packaging](media-services-dynamic-packaging-overview.md) to dynamically re-package your stream into different protocols (this will take care of streaming on different devices). Media Services supports delivery of the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only).

This topic gives an overview of important content delivery concepts.

To check known issues, see [this](media-services-deliver-content-overview.md#known-issues) section.

##Dynamic packaging


Media Services provides dynamic packaging which allows you to deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming, HDS) without you having to re-package into these streaming formats. It is recommended to use dynamic packaging to deliver your content. 

To take advantage of dynamic packaging, you need to do the following:

- Encode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files.
- Get at least one On-Demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale On-Demand Streaming Reserved Units](media-services-manage-origins.md#scale_streaming_endpoints). 

With dynamic packaging you only need to store and pay for the files in single storage format and Media Services will build and serve the appropriate response based on requests from a client. 

Note that in addition to being able to use the dynamic packaging capabilities, On-Demand Streaming reserved units provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. By default, on-demand streaming is configured in a shared-instance model for which server resources (for example, compute, egress capacity, etc.) are shared with all other users. To improve an on-demand streaming throughput, it is recommended to purchase On-Demand Streaming reserved units.

For more information see [Dynamic Packaging](media-services-dynamic-packaging-overview.md).  

##Filters and dynamic manifests

Media Services enables you to define filters for your assets. These filters are server side rules that will allow your customers to choose to do things like: playback only a section of a video (instead of playing the whole video), or specify only a subset of audio and video renditions that your customer's device can handle (instead of all the renditions that are associated with the asset). This filtering of your assets is achieved through **Dynamic Manifest**s that are created upon your customer's request to stream a video based on specified filter(s).

For more information, see [Filters and dynamic manifests](media-services-dynamic-manifest-overview.md).

##Locators

To provide your user with a URL that can be used to stream or download your content, you first need to "publish" your asset by creating a locator.  Locators provide an entry point to access the files contained in an asset. Media Services supports two types of locators: 

- **OnDemandOrigin** locators, used to stream media (for example, MPEG DASH, HLS, or Smooth Streaming) or progressively download files.
-  **SAS** (access signature) URL locators, used to download media files to your local computer. 

An **Access Policy** is used to define the permissions (such as read, write, and list) and duration that a client has access to a given asset. Note, that the list permission (AccessPermissions.List) should not be used when creating an OrDemandOrigin locator.

Locators have an expiration date. When using Portal to publish your assets, locators with a 100 years expiration date are created. 

>[AZURE.NOTE] If you used Portal to create locators before March 2015, locators with a two years expiration date were created.  

To update expiration date on a locator, use [REST](http://msdn.microsoft.com/library/azure/hh974308.aspx#update_a_locator ) or [.NET](http://go.microsoft.com/fwlink/?LinkID=533259) APIs. Note that when you update the expiration date of a SAS locator, the URL changes. 
 
Locators are not designed to manage per-user access control. To give different access rights to individual users, use Digital Rights Management (DRM) solutions. For more information, see [Securing Media](http://msdn.microsoft.com/library/azure/dn282272.aspx).

Note that when you create a locator, there may be a 30-second delay due to required storage and propagation processes in Azure Storage.


##Adaptive streaming 

Adaptive bitrate technologies allow video player applications to determine network conditions and select from among several bitrates. When network communication degrades, the client can select a lower bitrate allowing the player to continue to play the video at a lower video quality. As network conditions improve the client can switch to a higher bitrate with improved video quality. Azure Media Services supports the following adaptive bitrate technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS.

To provide users with streaming URLs, you first must create an OnDemandOrigin locator. Creating the locator, gives you the base Path to the asset that contains the content you want to stream. However, to be able to stream this content you need to modify this path further. To construct a full URL to the streaming manifest file, you must concatenate the locator’s Path value and the manifest (filename.ism) file name. Then, append /Manifest and an appropriate format (if needed) to the locator path. 

>[AZURE.NOTE]You can also stream your content over an SSL connection. To do this, make sure your streaming URLs start with HTTPS. 

Note that you can only stream over SSL if the streaming endpoint from which you deliver your content was created after September 10th, 2014. If your streaming URLs are based on the streaming endpoints created after September 10th, the URL contains “streaming.mediaservices.windows.net” (the new format). Streaming URLs that contain “origin.mediaservices.windows.net” (the old format) do not support SSL. If your URL is in the old format and you want to be able to stream over SSL, create a new streaming endpoint. Use URLs created based on the new streaming endpoint to stream your content over SSL. 


##Streaming URL formats

###MPEG DASH format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf) 

Example

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=mpd-time-csf)



###Apple HTTP Live Streaming (HLS) V4 format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl)

###Apple HTTP Live Streaming (HLS) V3 format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl-v3)
	
	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3)

###Apple HTTP Live Streaming (HLS) format with audio-only filter

By default audio only tracks are included in the HLS manifest. This is required for Apple store certification for cellular networks. In this case, if a client doesn’t have sufficient bandwidth or connected over a 2G connection it switches to audio only playback. This helps to keep ongoing streaming without buffering but with a drawback of no video. However, in some scenarios, player buffering might be preferred over audio-only. If you want to remove audio-only track you can add (audio-only=false) to the URL and remove it.

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=m3u8-aapl-v3,audio-only=false)

For more information see [this](https://azure.microsoft.com/blog/azure-media-services-release-dynamic-manifest-composition-remove-hls-audio-only-track-and-hls-i-frame-track-support/) blog.


###Smooth Streaming format

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

Example:

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest

###<a id="fmp4_v20"></a>Smooth Streaming 2.0 manifest (legacy manifest)

By default Smooth Streaming manifest format contains the repeat tag (r-tag). However, some players do not support the r-tag. Such clients can use format that disables the r-tag:

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=fmp4-v20)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=fmp4-v20)

###HDS (for Adobe PrimeTime/Access licensees only)

{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=f4m-f4f)

	http://testendpoint-testaccount.streaming.mediaservices.windows.net/fecebb23-46f6-490d-8b70-203e86b0df58/BigBuckBunny.ism/Manifest(format=f4m-f4f)

##Progressive download 

Progressive download allows you to start playing media before the entire file has been downloaded. You cannot progressively download .ism* (ismv, isma, ismt, ismc) files. 

To progressively download content, use the OnDemandOrigin type of locator. The following example shows the URL that is based on the OnDemandOrigin type of locator:

	http://amstest1.streaming.mediaservices.windows.net/3c5fe676-199c-4620-9b03-ba014900f214/BigBuckBunny_H264_650kbps_AAC_und_ch2_96kbps.mp4

The following consideration applies:

- You must decrypt any storage encrypted assets that you wish to stream from the origin service for progressive download.

##Download

To download your content onto a client device, you must create a SAS Locator. The SAS locator gives you access the Azure Storage container where your file is located. To build the download URL, you have to embed the file name between the host and SAS signature. 

The following example shows the URL that is based on the SAS locator:

	https://test001.blob.core.windows.net/asset-ca7a4c3f-9eb5-4fd8-a898-459cb17761bd/BigBuckBunny.mp4?sv=2012-02-12&se=2014-05-03T01%3A23%3A50Z&sr=c&si=7c093e7c-7dab-45b4-beb4-2bfdff764bb5&sig=msEHP90c6JHXEOtTyIWqD7xio91GtVg0UIzjdpFscHk%3D

The following considerations apply:

- You must decrypt any storage encrypted assets that you wish to stream from the origin service for progressive download.
- A download that has not completed within 12 hours will fail.

##Streaming Endpoints

A **Streaming Endpoint** represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a streaming endpoint service can be a live stream, or a video on demand asset in your Media Services account. In addition, you can control the capacity of the Streaming Endpoint service to handle growing bandwidth needs by adjusting streaming reserved units. You should allocate at least one reserved unit for applications in a production environment. For more information, see [How to Scale a Media Service](media-services-manage-origins.md#scale_streaming_endpoints).

##Known issues

### Changes to Smooth Streaming manifest version

Prior to July 2016 service release, when Assets produced by Media Encoder Standard, Media Encoder Premium Workflow or the legacy Azure Media Encoder were streamed using Dynamic Packaging, the Smooth Streaming manifest returned would conform to version 2.0, where the fragments durations do not use the so-called repeat (‘r’) tags. For example:

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

After the July 2016 service release, the generated Smooth Streaming manifest conforms to version 2.2, with fragment durations using repeat tags. For example:

	<?xml version="1.0" encoding="UTF-8"?>
	<SmoothStreamingMedia MajorVersion="2" MinorVersion="2" Duration="8000" TimeScale="1000">
		<StreamIndex Chunks="4" Type="video" Url="QualityLevels({bitrate})/Fragments(video={start time})" QualityLevels="3" Subtype="" Name="video" TimeScale="1000">
			<QualityLevel Index="0" Bitrate="1000000" FourCC="AVC1" MaxWidth="640" MaxHeight="360" CodecPrivateData="00000001674D4029965201405FF2E02A100000030010000003032E0A000F42400040167F18E3050007A12000200B3F8C70ED0B16890000000168EB7352" />
			<c t="0" d="2000" r="4" />
		</StreamIndex>
	</SmoothStreamingMedia>

Some of the legacy Smooth Streaming clients may not support the repeat tags and fail to load the manifest. To mitigate this issue you can use the legacy manifest format parameter **(format=fmp4-v20)** (for more information, see [this](media-services-deliver-content-overview.md#fmp4_v20) section), or update your client to the latest version which supports repeat tags.

##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

##Related topics

[Update Media Services locators after rolling storage keys](media-services-roll-storage-access-keys.md)
 
