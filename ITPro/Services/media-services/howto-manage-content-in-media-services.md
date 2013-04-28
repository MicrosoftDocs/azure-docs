<properties linkid="manage-services-mediaservices-manage-media-services-content" urlDisplayName="How to manage media content" pageTitle="How to manage media content - Windows Azure Media Services" metaKeywords="" metaDescription="Learn how to manage your media content in Windows Azure Media Services." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />








# How to Manage Content in Media Services #
The Windows Azure Media Services content view allows you to manage media content for your Media Services account.

Currently you can perform the following content operations directly from the portal:

- View content information like published state, published URL, size, and datetime of last update.
- Upload new content
- Encode content
- Play content video
- Publish/Unpublish content
- Delete content


## How to: Upload content ##


1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page. Your view should look similar to the screen shot below. 

 ![PortalViewUploadCompleted][portaluploadcomplete]

3. Click the **Upload** button at the bottom of the portal. 
4. In the Upload Content dialog, click **Browse Your Computer** and browse to the desired asset file. Click the file and then click **Open** or press **Enter**.

 ![UploadContentDialog][uploadcontent]

5. In the Upload Content dialog, click the check button to accept the File and Content Name.
6. The upload will start and you can track progress from the bottom of the portal.  

 ![JobStatus][status]


 Once the upload has completed, you will see the new asset listed in the Content list. By convention the name will have "**-Source**" appended at the end to help track new content as source content for encoding tasks.

	If the file size value does not get updated after the uploading process stops, press the Sync Metadata button. This synchronizes the asset file size with the actual file size in storage and refreshes the value on the Content page.	

## How to: Encode content ##

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name. 
2. Click the **Content** view at the top of the page.
3. Click on the desired source video for the encoding job, and then click **Encode** at the bottom of the page.
4. In the Windows Azure Media Encoder dialog, choose from one of the common or advanced encoding presets.

	**Common Presets**

- **Playback on PC/Mac (via Flash/Silverlight)**. This preset produces a Smooth Streaming asset with the following characteristics: 44.1 kHz 16 bits/sample stereo audio CBR encoded at 96 kbps using AAC, and 720p video CBR encoded at 6 bitrates ranging from 3400 kbps to 400 kbps using H.264 Main Profile, and two second GOPs.
- **Playback via HTML5 (IE/Chrome/Safari)**. This preset produces a single MP4 file with the following characteristics: 44.1 kHz 16 bits/sample stereo audio CBR encoded at 128 kbps using AAC, and 720p video CBR encoded at 4500 kbps using H.264 Main Profile.
- **Playback on iOS devices and PC/Mac**. This preset produces an asset with the same characteristics as the Smooth Streaming asset (described above), but in a format that can be used to deliver Apple HLS streams to iOS devices. 

	**Advanced Presets**
	
- The [Task Preset Strings for Windows Azure Media Encoder](http://go.microsoft.com/fwlink/?LinkId=270865) topic explains what each prest in the Advanced Presets list means. 


	![EncoderDialog][encoder]

	Currently, the portal does not support all the encoding formats that are supported by the Media Encoder. It also does not support media asset encryption\decryption. You can perform these tasks programmatically, for more information see [Building Applications with the Media Services SDK for .NET](http://go.microsoft.com/fwlink/?LinkId=270866) and [Task Preset Strings for Windows Azure Media Encoder](http://go.microsoft.com/fwlink/?LinkId=270865).


5. In the Windows Azure Media Encoder dialog, enter the desired friendly output content name or accept the default. Then click the check button to start the encoding operation and you can track progress from the bottom of the portal.


## How to: Publish content ##

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page.
3. Click an asset which is not published. The click the publish button to publish to a public URL. Once the content is published to a URL, the URL can be opened by a client player capable of rendering the encoded content.


## How to: Play content from the portal ##


1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page.
3. Click on the desired video content and click the **Play** button at the bottom of the portal. Only content that has been published is playable from the portal. Also, the encoding must be supported by your browser.


<!-- Images -->
[portaloverview]: ../media/PortalView.png
[uploadcontent]: ../media/UploadContent.png
[status]: ../media/Status.png
[statuscomplete]: ../media/StatusComplete.png
[portaluploadcomplete]: ../media/PortalViewUploadComplete.png
[encoder]: ../media/EncoderDialog2.png
