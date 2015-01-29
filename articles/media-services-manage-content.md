<properties 
	pageTitle="How to manage media content - Azure Media Services" 
	description="Learn how to manage your media content in Azure Media Services." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="10/30/2014" 
	ms.author="juliako"/>





# How to Manage Content in Media Services #

This topic shows how to use Azure Management Portal to manage media content in your Media Services account.

Currently you can perform the following content operations directly from the portal:

- View content information like published state, published URL, size, datetime of last update, and whether or not the asset is encrypted.
- Upload new content
- Index content
- Encode content
- Play content
- Publish/Unpublish content


## How to: Upload content 


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

## How to: Index content

Azure Media Indexer enables you to make content of your media files searchable and to generate a full-text transcript for closed captioning and keywords. You can index your content using the Management Portal following the steps demonstrated below. However, if you would like more control over what files and how the indexing job is done, you can use the Media Services SDK for .NET or REST APIs. For more information, see [Indexing Media Files with Azure Media Indexer](https://msdn.microsoft.com/en-us/library/azure/dn783455.aspx).

To following steps demonstrate how to use the Management Portal to index your content.

1. Select the file that you would like to index.
	If indexing is supported for this file type, the PROCESS button will be enabled on the bottom of the CONTENT page.
1. Press the PROCESS button.
2. In the **Process** dialog choose the **Azure Media Indexer** processor.
3. Then, fill out the Process dialog the detailed **title** and **description** information of the input media file.
	
	![Process][process]

## How to: Encode content

In order to deliver digital video over the internet you must compress the media. Media Services provides a media encoder that allows you to specify how you want for your content to be encoded (for example, the codecs to use, file format, resolution, and bitrate.) 

When working with Azure Media Services one of the most common scenarios is delivering adaptive bitrate streaming to your clients. With adaptive bitrate streaming, the client can switch to a higher or lower bitrate stream as the video is displayed based on the current network bandwidth, CPU utilization, and other factors. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH, and HDS (for Adobe PrimeTime/Access licensees only). 

Media Services provides dynamic packaging which allows you to deliver your adaptive bitrate MP4 or Smooth Streaming encoded content in streaming formats supported by Media Services (MPEG DASH, HLS, Smooth Streaming, HDS) without you having to re-package into these streaming formats. 

To take advantage of dynamic packaging, you need to do the following:

- encode or transcode your mezzanine (source) file into a set of adaptive bitrate MP4 files or adaptive bitrate Smooth Streaming files (the encoding steps are demonstrated later in this tutorial),  
- get at least one On-Demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale On-Demand Streaming Reserved Units](http://azure.microsoft.com/en-us/documentation/articles/media-services-how-to-scale/).

With dynamic packaging you only need to store and pay for the files in single storage format and Media Services will build and serve the appropriate response based on requests from a client. 

Note that in addition to being able to use the dynamic packaging capabilities, On-Demand Streaming reserved units provide you with dedicated egress capacity that can be purchased in increments of 200 Mbps. By default, on-demand streaming is configured in a shared-instance model for which server resources (for example, compute, egress capacity, etc.) are shared with all other users. To improve an on-demand streaming throughput, it is recommended to purchase On-Demand Streaming reserved units.


This section describes the steps you can take to encode your content with Azure Media Encoder using the Management Portal.

1.  Select the file that you would like to encode.
	If encoding is supported for this file type, the PROCESS button will be enabled on the bottom of the CONTENT page.
4. In the **Process** dialog, select the** Azure Media Encoder **processor.
5. Choose from one of the **encoding configurations**.

	![Process2][process2]

		
	The [Task Preset Strings for Azure Media Encoder](https://msdn.microsoft.com/en-us/library/azure/dn619392.aspx) topic explains what each preset in **Presets for Adaptive Streaming (dynamic packaging)**, **Presets for Progressive Download**, **Legacy Prests for Adaptive Streaming**  categories means.  


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

## How to: Publish content

When you publish the content, you will be provided with a streaming or progressive download URL. You client would be able to playback your videos using this URL.

1. Click an asset which you want to be published. 
2. Then, click the publish button. 
	
	Once the content is published to a URL, the URL can be opened by a client player capable of rendering the encoded content.

 ![PublishedContent][publishedcontent]

## How to: Play content from the portal

The Management Portal provides a Media Services Content Player that you can use to test your video.

Click on the desired video content and click the **Play** button at the bottom of the portal. 
 
Only content that has been published is playable from the portal. Also, the encoding must be supported by your browser.


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
