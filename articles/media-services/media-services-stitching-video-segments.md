<properties 
	pageTitle="Stitching Video Segments with Azure Media Encoder" 
	description="Videos can be stitched together end-to-end or you can specify portions of one or both videos to be stitched together. Learn how to use the Azure Media Encoder to stitch video segments." 
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
	ms.date="06/28/2015" 
	ms.author="juliako"/>




#Stitching Video Segments

The media services encoder provides support for stitching together a set of videos. Videos can be stitched together end-to-end or you can specify portions of one or both videos to be stitched together. The result of the stitching is a single output asset that contains the specified video from the input assets. The videos to be stitched can be contained in multiple assets or a single asset. Stitching is controlled by the preset XML passed to the encoder. For a complete description of the preset schema, see [Azure Media Encoder Schema](https://msdn.microsoft.com/library/azure/dn584702.aspx). 

##Stitching with Media Services Encoder

Stitching is controlled within the <MediaFile> element as shown in the following preset:
	
	<MediaFile
	    DeinterlaceMode="AutoPixelAdaptive"
	    ResizeQuality="Super"
	    AudioGainLevel="1"
	    VideoResizeMode="Stretch">
	    <Sources>
	      <Source
	        AudioStreamIndex="0">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	      <Source
	        ResizeMode="Letterbox"
	        ApplyCrop="False"
	        AudioStreamIndex="0"
	        MediaFile="%1%">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	      <Source
	        ResizeMode="Letterbox"
	        ApplyCrop="False"
	        AudioStreamIndex="0"
	        MediaFile="%2%">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	     </Sources>
	</MediaFile>

For each video to be stitched, a <Source> element is added to the <Sources> element. Each <Source> element contains a <Clips> element. Each <Clips> element contains one or more <Clip> element that specifies how much of the video will be stitched into the output asset, by specifying a start and end time. The <Source> element references the asset on which it acts. The format of the reference depends on whether the videos to be stitched are in separate assets or in a single asset. If you want to stitch an entire video, simply omit the <Clips> element. 

##Stitching Videos from Multiple Assets

When stitching videos from multiple assets, a zero-based index is used for the MediaFile attribute of the <Source> element to identify which asset the <Source> element corresponds to. The zero index is not specified, the <Source> element that does not specify a MediaFile attribute references the first input asset. All other <Source> elements must specify the zero-based index of the input asset to which it refers by using %n% syntax where n is the zero-based index of the input asset. In the preceding example the first <Source> element specifies the first input asset, the second <Source> element specifies the second input asset, and so on. There is no requirement that the input assets be referenced in order, for example:
	
	<MediaFile
	    DeinterlaceMode="AutoPixelAdaptive"
	    ResizeQuality="Super"
	    AudioGainLevel="1"
	    VideoResizeMode="Stretch">
	    <Sources>
	      <Source
	        AudioStreamIndex="0"
	        MediaFile="%1%">
	        <Clips>
	          <Clip EndTime="00:00:05" 
	                StartTime="00:00:00" />
	        </Clips>
	                  
	        </Source>
	      <Source
	       AudioStreamIndex="0">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	      <Source
	          AudioStreamIndex="0"
	         MediaFile="%2%">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	     </Sources>
	</MediaFile>

This example stitches together portions of the second, the first, and the third input assets. Note that since each video is referenced by a zero-based index it is possible to stitch two videos together that have the same name. Once you have created a preset file you must do the following:
 
- Upload your assets
- Load the preset configuration
- Create a job
- Get a reference to the Media Services Encoder
- Create a task specifying the input assets, the preset configuration, the media encoder, and the output asset
- Submit the job

The following code snippet shows how to do these steps:
	
	static public void StitchWithMultipleAssets()
	{
    		_context = new CloudMediaContext(_accountName, _accountKey);
	
	       // Upload assets to stitch
	       IAsset inputAsset1 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video1.mp4);
	       IAsset inputAsset2 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video2.wmv);
	       IAsset inputAsset3 = CreateAssetAndUploadSingleFile(AssetCreationOptions.None, video3.wmv);
	
	       // Load the preset configuration
	       string presetFileName = "StitchingWithMultipleAssets.xml";
	       string configuration = File.ReadAllText(presetFileName);
	
	       // Create a job
	       IJob job = _context.Jobs.Create("A WAME stitching job, using " + presetFileName);
	                 
	// Get a reference to the media services encoder   
	       IMediaProcessor processor = GetLatestMediaProcessorByName("Azure Media Encoder");
	            
	        // Create a task    
	       ITask task = job.Tasks.AddNew("Encode Task for stitching, using " + presetFileName, processor, configuration, TaskOptions.None);
	
			// Add the input assets
	       task.InputAssets.Add(inputAsset1);
	       task.InputAssets.Add(inputAsset2);
	       task.InputAssets.Add(inputAsset3);
	
	       // Add the output asset
	        task.OutputAssets.AddNew("Result of a stitching job, using " + presetFileName, AssetCreationOptions.None);
	
	       // Submit the job
	        job.Submit();
	} 


This snippet loads each asset sequentially for simplicity. In production environments assets would be loaded in bulk. For more information on uploading multiple assets in bulk see [Ingesting Assets in Bulk with the Media Services SDK for .NET](media-services-dotnet-upload-files.md#ingest_in_bulk). For complete sample code see [Stitching with Media Services Encoder](https://code.msdn.microsoft.com/Stitching-with-Media-8fd5f203).

##Stitching Videos from a Single Asset

When stitching videos within a single asset, each video must have a unique name. The videos are specified using the MediaFile attribute using the filename as the attribute’s value. For example:
	
	<MediaFile
	    DeinterlaceMode="AutoPixelAdaptive"
	    ResizeQuality="Super"
	    AudioGainLevel="1"
	    VideoResizeMode="Stretch">
	    <Sources>
	      <Source
	        AudioStreamIndex="0"
	        MediaFile="video1.mp4">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	      <Source
	       AudioStreamIndex="0"
	       MediaFile="video2.wmv">
	
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	      <Source
	          AudioStreamIndex="0"
	         MediaFile="video3.wmv">
	        <Clips>
	          <Clip
	            StartTime="00:00:00"
	            EndTime="00:00:05" />
	        </Clips>
	      </Source>
	     </Sources>
	</MediaFile>

This preset stitches parts of video1.mp4, video2.wmv, and video3.wmv into the output asset.
The creation of the job and tasks is the same as stitching videos from multiple assets, you only need to upload a single asset as shown in the following code:

	// Creates a stitching job that uses a single asset
    static public void StitchWithASingleAsset()
    {
        string presetFileName = "StitchingWithASingleAsset.xml";
        string configuration = File.ReadAllText(presetFileName);
        _context = new CloudMediaContext(_accountName, _accountKey);

        IMediaProcessor processor = GetLatestMediaProcessorByName("Azure Media Encoder");
        IJob job = _context.Jobs.Create("A WAME stitching job, using " + presetFileName);
        IAsset asset = CreateAssetAndUploadMultipleFiles(AssetCreationOptions.None, _stitchingFiles);

        ITask task = job.Tasks.AddNew("Encode Task for stitching, using " + presetFileName, processor, configuration, TaskOptions.None);
        task.InputAssets.Add(asset);
        task.OutputAssets.AddNew("Result of a stitching job, using " + presetFileName, AssetCreationOptions.None);

        job.Submit();
    }