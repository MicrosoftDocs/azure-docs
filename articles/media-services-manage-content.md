<properties 
	pageTitle="How to manage media content with Azure Media Services using Azure Management Portal" 
	description="Learn how to manage your media content in Azure Media Services. This includes: uploading, indexing, encoding, encrypting, and publishing." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/08/2015" 
	ms.author="juliako"/>


# Manage Content with Azure Media Services using Azure Management Portal

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) series. 

This topic shows how to use Azure Management Portal to manage media content in your Media Services account.

This topic shows how to perform the following content operations directly from the portal:

- View content information like published state, published URL, size, datetime of last update, and whether or not the asset is encrypted.
- Upload new content
- Index content
- Encode content
- Encrypt
- Publish/Unpublish content
- Play content


##<a id="upload"></a>How to: Upload content 


1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Select the CONTENT page. 
3. Click the **Upload** button on the page or at the bottom of the portal. 
4. In the **Upload content** dialog, browse to the desired asset file. Click the file and then click **Open** or press **Enter**.

	![UploadContentDialog][uploadcontent]

5. In the Upload Content dialog, click the check button to accept the File and Content Name.
6. The upload will start and you can track progress from the bottom of the portal.  

	![JobStatus][status]

Once the upload has completed, you will see the new asset listed in the Content list. By convention the name will have "**-Source**" appended at the end to help track new content as source content for encoding tasks.

![ContentPage][contentpage]

If the file size value does not get updated after the uploading process stops, press the **Sync Metadata** button. This synchronizes the asset file size with the actual file size in storage and refreshes the value on the Content page.	

##<a id="index"></a>How to: Index content

Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. You can index your content using the Management Portal following the steps demonstrated below. However, if you would like more control over what files and how the indexing job is done, you can use the Media Services SDK for .NET or REST APIs. For more information, see [Indexing Media Files with Azure Media Indexer](media-services-index-content.md).

To following steps demonstrate how to use the Management Portal to index your content.

1. Select the file that you would like to index.
	If indexing is supported for this file type, the PROCESS button will be enabled on the bottom of the CONTENT page.
1. Press the PROCESS button.
2. In the **Process** dialog choose the **Azure Media Indexer** processor.
3. Then, fill out the Process dialog the detailed **title** and **description** information of the input media file.
	
	![Process][process]

##<a id="encode"></a>How to: Encode content

In order to deliver digital video over the internet you must compress the media. Media Services provides a media encoder that allows you to specify how you want for your content to be encoded (for example, the codecs to use, file format, resolution, and bitrate.) 

When working with Azure Media Services one of the most common scenarios is delivering adaptive bitrate streaming to your clients. With adaptive bitrate streaming, the client can switch to a higher or lower bitrate stream as the video is displayed based on the current network bandwidth, CPU utilization, and other factors. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only). 

Media Services provides dynamic packaging which allows you to deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming, HDS) without you having to re-package into these streaming formats. 

To take advantage of dynamic packaging, you need to do the following:

- Encode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files (the encoding steps are demonstrated later in this tutorial).
- Get at least one On-Demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale On-Demand Streaming Reserved Units](media-services-manage-origins.md#scale_streaming_endpoints/).

With dynamic packaging you only need to store and pay for the files in single storage format and Media Services will build and serve the appropriate response based on requests from a client. 

Note that in addition to being able to use the dynamic packaging capabilities, On-Demand Streaming reserved units provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. By default, on-demand streaming is configured in a shared-instance model for which server resources (for example, compute, egress capacity, etc.) are shared with all other users. To improve an on-demand streaming throughput, it is recommended to purchase On-Demand Streaming reserved units.

This section describes the steps you can take to encode your content with Azure Media Encoder using the Management Portal.

1.  Select the file that you would like to encode.
	If encoding is supported for this file type, the PROCESS button will be enabled on the bottom of the CONTENT page.
4. In the **Process** dialog, select the** Azure Media Encoder **processor.
5. Choose from one of the **encoding configurations**.

	![Process2][process2]

		
	The [Task Preset Strings for Azure Media Encoder](https://msdn.microsoft.com/library/azure/dn619392.aspx) topic explains what each preset in **Presets for Adaptive Streaming (dynamic packaging)**, **Presets for Progressive Download**, **Legacy Prests for Adaptive Streaming**  categories means.  


	The **Other** configurations are described below:

	+ **Encode with PlayReady content protection**. This preset produces an asset encoded with PlayReady content protection.  
	
	
		By default the Media Services PlayReady license service is used. To specify some other service from which clients can obtain a license to play the PlayReady encrypted content, use REST or Media Services .NET SDK APIs. For more information, see [Using Static Encryption to Protect your Content]() and set the **licenseAcquisitionUrl** property in the Media Encryptor preset. Alternatively, you can use dynamic encryption and set the **PlayReadyLicenseAcquisitionUrl** property as described in [Using PlayReady Dynamic Encryption and License Delivery Service](http://go.microsoft.com/fwlink/?LinkId=507720 ). 
	+ **Playback on PC/Mac (via Flash/Silverlight)**. This preset produces a Smooth Streaming asset with the following characteristics: 44.1 kHz 16 bits/sample stereo audio CBR encoded at 96 kbps using AAC, and 720p video CBR encoded at 6 bitrates ranging from 3400 kbps to 400 kbps using H.264 Main Profile, and two second GOPs.
	+ **Playback via HTML5 (IE/Chrome/Safari)**. This preset produces a single MP4 file with the following characteristics: 44.1 kHz 16 bits/sample stereo audio CBR encoded at 128 kbps using AAC, and 720p video CBR encoded at 4500 kbps using H.264 Main Profile.
	+ **Playback on iOS devices and PC/Mac**. This preset produces an asset with the same characteristics as the Smooth Streaming asset (described above), but in a format that can be used to deliver Apple HLS streams to iOS devices. 

5. Then, enter the desired friendly output content name or accept the default. Then click the check button to start the encoding operation and you can track progress from the bottom of the portal.
6. Press OK.

	After the encoding is done, the CONTENT page will contain the encoded file. 

	To view the progress of the encoding job, switch to the **JOBS** page.  

	If the file size value does not get updated after the encoding is done, press the **Sync Metadata** button. This synchronizes the output asset file size with the actual file size in storage and refreshes the value on the Content page.	

##<a id="encrypt"></a>How to: Encrypt content

If you want for Media Services to dynamically encrypt your asset with an AES key or PlayReady DRM make sure to do the following:

- Encode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files (the encoding steps are demonstrated in the [Encode](#encode) section).
- Get at least one On-Demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale On-Demand Streaming Reserved Units](media-services-manage-origins.md#scale_streaming_endpoints/).
- Configure "default aes clear key service policy" or "default playready license service policy". For more information, see [Configure Content Key Authorization Policy](media-services-portal-configure-content-key-auth-policy.md).  


	When you are ready to enable encryption, press the **ENCRYPTION** button on the bottom of the **CONTENT** page.

	![Encrypt][encrypt] 

	Once you enabled encryption, whenever a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content using AES or PlayReady encryption. To decrypt the stream, the player will request the key from the key delivery service. To decide whether or not the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

##<a id="publish"></a>How to: Publish content

###Overview

To provide your user with a  URL that can be used to stream or download your content, you first need to "publish" your asset by creating a locator. Locators provide access to files contained in the asset. Media Services supports two types of locators: OnDemandOrigin locators, used to stream media (for example, MPEG DASH, HLS, or Smooth Streaming) and Access Signature (SAS) locators, used to download media files.

When you use the Azure Management Portal to publish your assets, the locators are created for you and you are provided with an OnDemantOrigin based URL (if your asset contains an .ism file) or a SAS URL. 

A SAS URL has the following format:

	{blob container name}/{asset name}/{file name}/{SAS signature}

A streaming URL has the following format and you can use it to play Smooth Streaming assets:

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest

To build an HLS streaming URL, append (format=m3u8-aapl) to the URL.

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=m3u8-aapl)

To build an MPEG DASH streaming URL, append (format=mpd-time-csf) to the URL.

	{streaming endpoint name-media services account name}.streaming.mediaservices.windows.net/{locator ID}/{filename}.ism/Manifest(format=mpd-time-csf)


Locators have expiration date. When using Portal to publish your assets, locators with a 100 years expiration date are created. 

>[AZURE.NOTE] If you used Portal to create locators before March 2015, locators with a two year expiration date were created.  

To update expiration date on a locator, use [REST](http://msdn.microsoft.com/library/azure/hh974308.aspx#update_a_locator ) or [.NET](http://go.microsoft.com/fwlink/?LinkID=533259) APIs. Note that when you update the expiration date of a SAS locator, the URL changes. 

###Publish

To use Portal to publish an asset, do the following: 

1. Select the asset. 
2. Then, click the publish button. 
	
 ![PublishedContent][publishedcontent]


## How to: Play content from the portal

The **Azure Management Portal** provides a content player that you can use to test your video.

Click on the desired video and click the **Play** button at the bottom of the portal. 
 
Some considerations apply:

- Make sure the video has been published.
- The **MEDIA SERVICES CONTENT PLAYER** plays from the default streaming endpoint. If you want to play from a non-default streaming endpoint, use another player. For example, [Azure Media Services Player](http://amsplayer.azurewebsites.net/azuremediaplayer.html).
 

![AMSPlayer][AMSPlayer]

<!-- Images -->
[portaloverview]: ./media/media-services-manage-content/media-services-content-page.png
[publishedcontent]: ./media/media-services-manage-content/media-services-upload-content-published.png
[uploadcontent]: ./media/media-services-manage-content/UploadContent.png
[status]: ./media/media-services-manage-content/Status.png
[encoder]: ./media/media-services-manage-content/EncoderDialog2.png
[branding]: ./media/branding-reporting.png
[contentpage]: ./media/media-services-manage-content/media-services-content-page.png
[process]: ./media/media-services-manage-content/media-services-process-video.png
[process2]: ./media/media-services-manage-content/media-services-process-video2.png
[encrypt]: ./media/media-services-manage-content/media-services-encrypt-content.png
[AMSPlayer]: ./media/media-services-players/media-services-portal-player.png