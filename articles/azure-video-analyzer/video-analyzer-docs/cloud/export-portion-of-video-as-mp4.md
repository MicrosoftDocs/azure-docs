---
title: Export a portion of an Video Analyzer recorded video to an MP4 file - Azure
description: In this tutorial, you'll learn how to export a portion of an Video Analyzer recorded video as an MP4 which is stored as a Video Analyzer video which can be downloaded and consumed outside of the Video Analyzer account ecosystem.
ms.topic: tutorial
ms.date: 10/06/2021

---
# Tutorial: Event-based video recording and playback

In this tutorial, you'll learn how to export a portion of video that has been recorded in Azure Video Analyzer account.  This exported portion of video is saved as a MP4 file which can be downloaded and consumed outside of the Video Analyzer account.



[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer overview](overview.md)
* [Azure Video Analyzer terminology](terminology.md)
* [Video Analyzer Pipeline concepts](pipeline.md) 
* [Event-based video recording](event-based-video-recording-concept.md)

## Prerequisites

Prerequisites for this tutorial are:
* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

    [!INCLUDE [azure-subscription-permissions](./includes/common-includes/azure-subscription-permissions.md)]
* [Video Analyzer account](create-video-analyzer-account.md).
* Have completed [Quickstart: Detect motion, record video to Video Analyzer](detect-motion-record-video-clips-cloud.md) or any Video Analyzer pipeline that records video to the Video Analyzer account.

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)
[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

Video Analyzer can record videos from an RTSP source and in the Video Analyzer account these videos are recorded in a segmented archive.  The segmented archive format allows unbounded duration of video recording, however, in some cases it is necessary to save a portion of video as an MP4 so that it can be individually archived, downloaded, or played outside of the Video Analyzer ecosystem.   

In this tutorial, you will learn:

1. About batch pipeline topologies and batch pipeline jobs
2. How to create a batch topology.
3. How to create a batch pipeline job from a Video Analyzer video archive that will create a MP4 file that contains a specified value of time (up to 24 hours).
4. How to create a batch pipeline job from the Video Analyzer account blade that will create a MP4 file that contains video for a specific value of time (up to 24 hours).

## Pipeline topologies of batch kind

A pipeline topology of batch kind enables you to describe how recorded video should be processed for export based on your custom needs through three interconnected nodes.  These nodes are connected with parameters as placeholders for values.  A pipeline topology of batch kind is the base used for pipeline jobs.  A pipeline job is the individual instance of a pipeline topology of batch kind and the pipeline job imports the recorded Video Analyzer video and saves it to the Video Analyzer's storage account.

## Sources, Processors and sinks

### Source

#### Video Source

Allows a Video Analyzer video recording to be used as a source. The node requires you to specify the name of the video resource, as well as the start and end time of the portion(s) of the recorded video to be processed.

```json
// Video Source 
{ 
  "@type": "#Microsoft.VideoAnalyzer.VideoSource", 
  "name": "{nodeName}",// Node identifier within the topology 
  "videoName": "{videoName}", // Name of the source video 
  // Accuracy is implicit based on the presence of an encoder node 
  "sequences ":  
    { 
      "@type": "#Microsoft.VideoAnalyzer.VideoDateTimeSequencesString", 
      "dateTimeMarkers": "[[2020-10-05T03:30:00Z,2020-10-05T03:40:00Z],[..,..]]"    // [startTime,endTime] DateLiteral as per ISO8601 
    } 
} 
```



### Processor

#### Encoder processor

The encoder processor node allows user to specify encoding properties when converting the recorded video into the desired format for downstream processing. There are two presets, system and custom.  Below are the values for the system presets and custom presets.  

- System Preset - Pre-defined encoding settings:

  - maximumBitrate - same as source
  - Scale mode - Pad
  - width - same as source
  - height - same as souce
  - Audio encoder
    - same as source.

- Custom Preset - Allows for configuration of:

  - maximumBitrate - 200 - 16000000

  - Scale mode - Pad, PreserveAspectRatio, Stretch

  - width -  minimum value 1, maximum value 8192

  - height - minimum value 1, maximum value 4320

  - Audio Encoder

    - bitrate - must be one of the following formats:

      **96000, 112000, 128000, 160000, 192000, 224000, 256000**

  ```json
  // Encoder Processor 
  { 
    "@type": "#Microsoft.VideoAnalyzer.EncoderProcessor", 
    "name": "{nodeName}",           // Node identifier within the topology 
    // System presets 
    "preset": 
    { 
      "@type": "#Microsoft.VideoAnalyzer.Encoder.SystemPreset", 
      "name": "{H264SingleBitrateSD|H264SingleBitrate720p|H264SingleBitrate1080p}" 
    }, 
    // Alternatively, custom preset 
    "preset": 
    { 
      "@type": "#Microsoft.VideoAnalyzer.Encoder.CustomPreset", 
      "videoEncoder": { 
        "@type": "#Microsoft.VideoAnalyzer.VideoH264Encoder",   
        "maximumBitrate": "2000000", // Optional: automatically set if not defined.   
        "scale": {                  // Optional: same as source if not set. 
          "mode": "[Pad|PreserveAspectRatio|Stretch]", // default: Pad 
          "width": "1280",         // absent for keeping aspect ratio 
          "height": "720"          // absent for keeping aspect ratio 
        } 
      }, 
      "audioEncoder": { 
        "@type": "#Microsoft.VideoAnalyzer.AudioAacEncoder",  //"#Microsoft.VideoAnalyzer.AudioEncoderNone 
        "bitrate": "48000"          // Optional: same as source if not set. 
      }, 
    }, 
    "inputs": [] // Node Inputs 
  } 
  ```

  

For example video recorded from a camera configured for [4K resolution](https://en.wikipedia.org/wiki/4K_resolution) may need to be resized to [Full HD (1920x1080)](https://en.wikipedia.org/wiki/1080p) resolution before it is exported to a file.

### Sink

#### Video sink

A video sink node enables you to save video and associated metadata to your Video Analyzer cloud resource. Video can be recorded continuously or dis-continuously (based on events). Video sink node can cache video on the edge device if connectivity to cloud is lost and resume uploading when connectivity is restored. You can see the [continuous video recording](https://github.com/mayankchief/azure-docs-pr/blob/ff1773b3a774fac83aee160bc6dec1a1fd4bd022/articles/azure-video-analyzer/video-analyzer-docs/continuous-video-recording.md) article for details on how the properties of this node can be configured.

## Pipeline job

For information about pipeline jobs see [lifecycle of a pipeline](./pipeline.md#Batch_pipeline)

## Create a batch pipeline job through Video Analyzer videos

1. In the Azure portal navigate to your Video Analyzer account.

2. Select **Videos** under the Video Analyzer section and then select the required video.

3. Click on **Create Job** at the top.

4. In the **Create Job** fly out blade select either:
   1. **Use existing** 
      - Select the existing batch topology name from the drop down list.  
      
        [!NOTE]Select this option if you perfer to use a previously saved pipeline topology of batch kind.
   2. **Create from sample**
      
      - Select the sample topology in the list.
      
      - Enter a name to save the topology as.
      
        [!NOTE]The sample topology will be saved as the name entered above.  It will be available to re-use next time a video is to be exported.

5. Enter the **Job name** and **Description**

6. In the **Define parameters** section select the **sourceVideoName** from the drop down list.

7. in the **Define parameters** section supply a name for the **exportedVideoName** and enter the start and end date and time.

8. click **Create**.

The job will enter the processing state and when the pipeline job completes successfully it will transition to a completed state and present a link to the MP4 file in the top of the fly out blade.

# TODO:  Based on figma need to check!!!!!!!!!!!!

## Create a batch pipeline job through Video Analyzer account blade

1. In the Azure portal navigate to the Video Analyzer account blade.

2. Click on **Batch pipelines** under the Video Analyzer section.

3. In (1) **Create a batch topology** box click **Create**.

    The job will enter the processing state and when the pipeline job completes successfully it will transition to a completed state and present a link to the MP4 file in the top of the fly out blade.

## Cancel a pipeline job

Once a pipeline job has entered the processing state the job can be canceled.  To cancel a job:

	1.  Navigate to the Video Analyzer account and select **Batch pipelines** under **Video Analyzer** section.
	2.  In the Batch pipeline blade select the **Jobs** tab at the top.
	3.  Under the jobs tab you will find a list of jobs that are in different stated.  Find the job in processing state and select **Cancel** on the right hand side of the Batch pipeline Jobs tab.



# TODO:  Check in portal for accuracy

## Delete a pipeline topology of batch kind

In order to delete a pipeline topology of batch kind all pipeline jobs that are currently in the processing state must be canceled.  Once all pipeline jobs have been completed or canceled the pipeline topology of batch kind can be deleted.  To delete a pipeline topology of batch kind:

1. Navigate to the Video Analyzer account.
2. Click on  **Batch topology** under **Video Analyzer** section.
3. Under the topologies tab locate your pipeline topology of batch kind to delete and click on the `...` at the right hand side of the pipeline topology of batchkind.
4. Click on **Delete topology**.

# TODO:  Check in portal for accurarcy





## Clean up resources

[!INCLUDE [clean-up-resources](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then follow the instructions in the [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) quickstart to register the device with Azure IoT Hub.

