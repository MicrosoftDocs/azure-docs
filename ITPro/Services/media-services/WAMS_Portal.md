# Working with Windows Azure Media Assets #

The Windows Azure Media Services content view allows you to manage Windows Azure Media content for your Media Services account.

Currently you can perform the following content operations directly from the portal:

- View content information like published state, published URL, Size, and datetime of last update.
- Upload new content
- Encode content
- Play content video
- Publish/Unpublish content
- Delete content


## How to: Upload New Assets ##


1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page. Your view should look similar to the screen shot below. 

 ![PortalView][portaloverview]

3. Click the **Upload** button at the bottom of the portal. 
4. In the Upload Content dialog, click **Browse Your Computer** and browse to the desired asset file. Click the file and then click **Open** or press **Enter**.

 ![UploadContentDialog][uploadcontent]

5. In the Upload Content dialog, click the check button to accept the File and Content Name.
6. The upload will start and you can track progress from the bottom of the portal.  

 ![JobStatus][status]


 ![JobStatusComplete][statuscomplete]

 Once the upload has completed, you will see the new asset listed in the Content list. By convention the name will have "**-Source**" appended at the end to help track new content as source content for encoding tasks.

 ![PortalViewUploadCompleted][portaluploadcomplete]



## How to: Encode New Assets ##

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page.
3. Click on the desired source video for the encoding job, and then click **Encode** at the bottom of the page.
4. In the Windows Azure Media Encoder dialog, choose from one of the available encoding presets.
- **Playback on PC/Mac (via Flash/Silverlight)**
- **Playback via HTML5 (IE/Chrome/Safari)**
- **Playback on iOS devices and PC/Mac**

	![EncoderDialog][encoder]

5. In the Windows Azure Media Encoder dialog, enter the desired friendly output content name or accept the default. Then click the check button to start the encoding operation and you can track progress from the bottom of the portal.


## Publishing Assets ##

1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page.
3. Click an asset which is not published. The click the publish button to publish to a public URL. Once the content is published to a URL, the URL can be opened by a client player capable of rendering the encoded content.


## How to: Play Videos from the Portal ##


1. In the [Management Portal](http://go.microsoft.com/fwlink/?LinkID=256666&clcid=0x409), click **Media Services** and then click on the Media Services account name.
2. Click the **Content** view at the top of the page.
3. Click on the desired video content and click the **Play** button at the bottom of the portal. Only content that has been published is playable from the portal. Also, the encoding must be supported by your browser.


<!-- Images -->
[portaloverview]: ../media/PortalView.png
[uploadcontent]: ../media/UploadContent.png
[status]: ../media/Status.png
[statuscomplete]: ../media/StatusComplete.png
[portaluploadcomplete]: ../media/PortalViewUploadComplete.png
[encoder]: ../media/EncoderDialog.png
