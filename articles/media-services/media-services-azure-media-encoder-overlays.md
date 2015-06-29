<properties 
	pageTitle="Creating Overlays" 
	description="The Azure Media Services Encoder allows you to overlay an image (jpg, bmp, gif, tif), a video, or an audio track (*.wma, *.mp3, *.wav) onto an existing video. This topic shows how to create overlays." 
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
	ms.date="06/29/2015" 
	ms.author="juliako"/>

#Creating Overlays

The Azure Media Services Encoder allows you to overlay an image (jpg, bmp, gif, tif), a video, or an audio track (*.wma, *.mp3, *.wav) onto an existing video. This functionality is similar to that of Expression Encoder 4 (Service Pack 2).

##Overlays with the Media Services Encoder

You can specify when the overlay will be presented, the duration the overlay will presented, and for image/video overlays where on the screen the overlay will appear. You can also have the overlays fade in and/or fade out. The audio/video files to overlay can be contained in multiple assets or a single asset. Overlays are controlled by the preset XML that is passed to the encoder. For a complete description of the preset schema, see Azure Media Encoder Schemas. Overlays are specified in the <MediaFile> element as shown in the following preset snippet:

	<MediaFile
	    ...
	    OverlayFileName="%1%"
	    OverlayRect="257, 144, 255, 144"
	    OverlayOpacity="0.9"
	    OverlayFadeInDuration="00:00:02"
	    OverlayFadeOutDuration="00:00:02"
	    OverlayLayoutMode="Custom"
	    OverlayStartTime="00:00:05"
	    OverlayEndTime="00:00:10.2120000"
	
	    AudioOverlayFileName="%2%"
	    AudioOverlayLoop="True"
	    AudioOverlayLoopingGap="00:00:00"
	    AudioOverlayLayoutMode="WholeSequence"
	    AudioOverlayGainLevel="2.2"
	    AudioOverlayFadeInDuration="00:00:00"
	    AudioOverlayFadeOutDuration="00:00:00">
	    ...
	</MediaFile>

##Presets for Video or Image Overlays

Overlays can be from a single or multiple assets. When creating video overlays using multiple assets, the overlay filename is specified in the OverlayFileName attribute using %n% syntax where n is the zero-based index of the input assets for the encoding task. When creating video overlays with a single asset, the overlay file name is specified directly into the OverlayFileName attribute, as shown in the following preset snippets:

Example 1:

	<!-- Multiple Assets -->
	<MediaFile
		...
		OverlayFileName="%1%"
		OverlayRect="257, 144, 255, 144"
		OverlayOpacity="0.9"
		OverlayFadeInDuration="00:00:02"
		OverlayFadeOutDuration="00:00:02"
		OverlayLayoutMode="Custom"
		OverlayStartTime="00:00:05"
		OverlayEndTime="00:00:10.2120000">

Example 2:

	<!-- Single Asset -->
	<MediaFile
		...
		OverlayFileName="videoOverlay.mp4"
		OverlayRect="257, 144, 255, 144"
		OverlayOpacity="0.9"
		OverlayFadeInDuration="00:00:02"
		OverlayFadeOutDuration="00:00:02"
		OverlayLayoutMode="Custom"
		OverlayStartTime="00:00:05"
		OverlayEndTime="00:00:10.2120000">

The location and size of the video overlay is controlled by the OverlayRect attribute. The content that is to be overlaid will be re-sized to fit this rectangle. Opacity is controlled by the OverlayOpacity attribute. Valid values are 0.0 – 1.0, where 1.0 is 100% opaque. The overlay will be displayed at the time specified by the OverlayStartTime attribute and will end at the time specified by the OverlayEndTime attribute. Both OverlayStartTime and OverlayEndTime should fall within the timeline of the source video. For more information about each overlay-specific attribute, please see Azure Media Encoder Schemas.

##Presets for Audio Overlays

Audio overlays can be any supported audio file format, for example. For a complete list of supported audio file formats, see Formats Supported by the Media Services Encoder. Audio overlays are also specified in the <MediaFile> element as shown in the following preset snippet:

	<MediaFile
		...
		AudioOverlayFileName="%1%" <!-- or AudioOverlayFileName=”audioOverlay.mp3” for overlays from a single asset -->
		AudioOverlayLoop="True"
		AudioOverlayLoopingGap="00:00:00"
		AudioOverlayLayoutMode="Custom"
		AudioOverlayStartTime="00:05:00"
		AudioOverlayEndTime="00:10:00"
		AudioOverlayGainLevel="2.2"
		AudioOverlayFadeInDuration="00:00:00"
		AudioOverlayFadeOutDuration="00:00:00">

For audio overlays stored in multiple assets, the audio overlay filename is specified in the AudioOverlayFileName attribute using %n% syntax, where n is the zero-based index of the collection of input assets to the encoding Task. For audio overlays stored in a single asset the overlay filename is specified directly in the AudioOverlayFileName attribute. The AudioOverlayLayoutMode determines when the audio overlay will be presented. When set to “WholeSequence” the audio track will be presented during the entire duration of the video. When set to “Custom” the AudioOverlayStartTime and AudioOverlayEndTime attributes determine when the audio overlay begins and ends. Both OverlayStartTime and OverlayEndTime should fall within the timeline of the source video. For more information on all of the audio overlay attributes, see the Azure Media Encoder Schemas. Audio overlays can be combined with video overlays as shown in the following preset snippet:
	
	<MediaFile
	    DeinterlaceMode="AutoPixelAdaptive"
	    ResizeQuality="Super"
	    AudioGainLevel="1"
	    VideoResizeMode="Stretch"
	    OverlayFileName="%1%"
	    OverlayRect="257, 144, 255, 144"
	    OverlayOpacity="0.9"
	    OverlayFadeInDuration="00:00:02"
	    OverlayFadeOutDuration="00:00:02"
	    OverlayLayoutMode="Custom"
	    OverlayStartTime="00:00:05"
	    OverlayEndTime="00:00:10.2120000"
	    AudioOverlayFileName="%2%"
	    AudioOverlayLoop="True"
	    AudioOverlayLoopingGap="00:00:00"
	    AudioOverlayLayoutMode="Custom"
	    AudioOverlayStartTime="00:05:00"
	    AudioOverlayEndTime="00:10:00"
	    AudioOverlayGainLevel="2.2"
	    AudioOverlayFadeInDuration="00:00:00"
	    AudioOverlayFadeOutDuration="00:00:00">


##Submitting Tasks with Overlays

Once you have created a preset file you must do the following:

- Upload your asset(s)
- Load the preset configuration (Note: the code below assumes the Preset above.
- Create a job
- Get a reference to the Media Services Encoder
- Create a task specifying the collection of input assets, the preset configuration, the media encoder, and the output asset
- Submit the job

The following code snippet shows how to do these steps:

	static public void CreateOverlayJob()
	{
	_context = new CloudMediaContext(_accountName, _accountKey);
	
	       // Upload assets to overlay
	       IAsset inputAsset1 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video1.mp4); // this is the input mezzanine
	       IAsset inputAsset2 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video2.wmv);// this will be used as a video overlay
	       IAsset inputAsset3 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video3.wmv); // this will be used as an audio overlay
	
	       // Load the preset configuration
	       string presetFileName = "OverlayPreset.xml";
	       string configuration = File.ReadAllText(presetFileName);
	
	       // Create a job
	       IJob job = _context.Jobs.Create("A WAME overlay job, using " + presetFileName);
	                 
	// Get a reference to the media services encoder   
	       IMediaProcessor processor = GetLatestMediaProcessorByName("Azure Media Encoder");
	            
	        // Create a task    
	       ITask task = job.Tasks.AddNew("Encode Task for overlay, using " + presetFileName, processor, configuration, TaskOptions.None);
	
	    // Add the input assets
	           task.InputAssets.Add(inputAsset1);
	           task.InputAssets.Add(inputAsset2);
	           task.InputAssets.Add(inputAsset3);
	
	     // Add the output asset
	            task.OutputAssets.AddNew("Result of an overlay job, using " + presetFileName, AssetCreationOptions.None);
	
	     // Submit the job
	            job.Submit();
	}



>[AZURE.NOTE]This snippet loads each asset sequentially for simplicity. In production environments assets would be loaded in bulk. For more information on uploading multiple assets in bulk see [Ingesting Assets in Bulk with the Media Services SDK for .NET](media-services-dotnet-upload-files.md#ingest_in_bulk).

For complete sample code see [Creating Overlays with Media Services Encoder](https://code.msdn.microsoft.com/Creating-Audio-and-Video-c2942c47).  

##Error Conditions

When editing the Preset string, you must ensure the following:

- For video/image overlays, the overlay rectangle must fit entirely within the dimensions of the source video
- The start and end time of the overlays should be within the timeline of the source video
- If the preset XML contains a reference to ?OverlayFileName=”%n%”, then the InputAssets collection for the Tasks should contain at least n+1 Assets
