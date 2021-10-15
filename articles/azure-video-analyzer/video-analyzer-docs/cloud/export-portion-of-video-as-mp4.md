---
title: Export a portion of an Video Analyzer recorded video to an MP4 file - Azure
description: In this tutorial, you'll learn how to export a portion of an Video Analyzer recorded video as an MP4 which is stored as a Video Analyzer video which can be downloaded and consumed outside of the Video Analyzer account ecosystem.
ms.topic: tutorial
ms.date: 10/06/2021

---
# Tutorial: Event-based video recording and playback

In this tutorial, you'll learn how to export a portion of video that has been recorded in Azure Video Analyzer account.  This exported portion of video is saved as a MP4 file which can be downloaded and consumed outside of the Video Analyzer account.

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer overview](overview.md)
* [Azure Video Analyzer terminology](terminology.md)
* [Video Analyzer Pipeline concepts](pipeline.md) 
* [Event-based video recording](event-based-video-recording-concept.md)

## Prerequisites

Prerequisites for this tutorial are:
* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

* [Video Analyzer account](create-video-analyzer-account.md).
* Have completed [Quickstart: Detect motion, record video to Video Analyzer](detect-motion-record-video-clips-cloud.md) or any Video Analyzer pipeline that records video to the Video Analyzer account.

## Overview

Video Analyzer can record videos from an RTSP source and in the Video Analyzer account these videos are recorded in a segmented archive.  The segmented archive format allows unbounded duration of video recording, however, in some cases it is necessary to save a portion of video as an MP4 so that it can be individually archived, downloaded, or played outside of the Video Analyzer ecosystem.   

In this tutorial, you will learn:

* About batch pipeline topologies and batch pipeline jobs
* How to create a batch topology.
* How to create a batch pipeline job from a Video Analyzer video archive that will create a MP4 file that contains a specified value of time (up to 24 hours).
* How to create a batch pipeline job from the Video Analyzer account blade that will create a MP4 file that contains video for a specific value of time (up to 24 hours).

## Pipeline topologies of batch kind

A pipeline topology of batch kind enables you to describe how recorded video should be processed for export based on your custom needs through three interconnected nodes.  These nodes are connected with parameters as placeholders for values.  A pipeline topology of batch kind is the base used for pipeline jobs.  A pipeline job is the individual instance of a pipeline topology of batch kind and the pipeline job imports the recorded Video Analyzer video and saves it to the Video Analyzer's storage account.

## Sources, Processors and sinks

For information about Video Analyzer sources, processors, and sinks see [Sources, Processors and Sinks](../pipeline.md#sources-processors-and-sinks)

<details>
    <summary>Click to expand: Video source and Encoder processor details.</summary>
### Source

#### Video Source

Allows a Video Analyzer video recording to be used as a source. The node requires you to specify the name of the video resource, as well as the start and end time of the portion(s) of the recorded video to be processed.

```json
// Video Source
{ 
  "@type": "#Microsoft.VideoAnalyzer.VideoSource",
  "name": "{nodeName}", //Node identifier within the topology
  "videoName": "{videoName}", // Name of the source video
  // Accuracy is implicit based on the presence of an encoder node
  "sequences ":
   {
    "@type": "#Microsoft.VideoAnalyzer.VideoDateTimeSequencesString",
    "dateTimeMarkers": "[[2020-10-05T03:30:00Z,2020-10-05T03:40:00Z],[..,..]]"  // [startTime,endTime] DateLiteral as per ISO8601
   }
}
```


#### Encoder processor

The encoder processor node allows user to specify encoding properties when converting the recorded video into the desired format for downstream processing. There are two presets, system and custom.  Below are the values for the system presets and custom presets.  

- System Preset - Pre-defined encoding settings:

  - maximumBitrate - same as source
  - Scale mode - Pad
  - width - same as source
  - height - same as source
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

</details>


## Pipeline job

For information about pipeline jobs see [lifecycle of a pipeline](../pipeline.md#Batch_pipeline)

## Create a pipeline job through Video Analyzer videos

1. In the Azure portal navigate to your Video Analyzer account.

1. Select **Videos** under the Video Analyzer section and then select the required video.

1. Click on **Create Job** at the top.

1. In the `Create Job` fly out blade select:
   
   * **Create from sample**
      
      - Select the `Video export` sample topology in the list.
      
      - Enter a name in the ` Batch topology name` to save the topology as.
      
        >[!NOTE]The sample topology will be saved as the name entered above.  It will be available to re-use next time a video is to be exported.

1. In the `Name your job` section enter a **Job name** in the Job name filed and a **Description** for the job in the description field (the description is optional)

1. In the `Define parameters` section:
    - Enter the name of the Video Analyzer recorded video in the `sourceVideoName` field.
    - Enter a ISO 8601 date time value in the `videoSourceTimeSequenceParameter` field.  (Example: [["2021-10-12T18:37:00Z", "2021-10-12T18:39:00Z"]])
    - Enter a name for the exported MP4 file in the `exportedVideoName` field.

1. Click **Create**.

The job will enter the processing state and when the pipeline job completes successfully it will transition to a completed state and present a link to the MP4 file in the top of the fly out blade.

# TODO:  Based on figma need to check!!!!!!!!!!!!

## Create a batch pipeline job through Video Analyzer account blade

1. In the Azure portal navigate to the Video Analyzer account blade.

1. Click on **Batch** under the Video Analyzer section.

1. Ensure that the Topologies tab is selected and then click on **Create**.

1.  Click on `Try sample topologies` and select **Video export**

1. In the pop up box `Load sample topology` click **Proceed**

1. Enter a name for the topology in the `Topology name` field and (optional) enter a description of the topology in the `Description` field.

1. Click **Save**

Once the topology is saved select the `Jobs` tab

1. Click on **Create**, select the previously created topology from the `Batch pipeline topology` drop down and click **Create**

1.  Enter a name for the job in the `Pipeline job name` field and (optional) enter a description for the job in the `Description` field.

1. Specify the name of a Video Analyzer recorded video in the `videoSourceVideoNameParameter` field.

1. Enter a ISO 8601 date time value in the **videoSourceTimeSequenceParameter** field.  (Example: [["2021-10-12T18:37:00Z", "2021-10-12T18:39:00Z"]])

1. Enter a name for the exported MP4 file in the `videoSinkNameParameter` field.

1. Click **Create**

In the `Jobs` tab you will see the previously created job enter the processing state.  When the job finishes you will be presented with a link to download the exported video.

# TODO: CHECK THE JOBS STATUS PAGE

## Cancel a pipeline job

Once a pipeline job has entered the processing state the job can be canceled.  To cancel a job:

1.  Navigate to the Video Analyzer account and select **Batch** under **Video Analyzer** section.

1.  In the Batch blade select the **Jobs** tab at the top.

1.  Under the jobs tab you will find a list of jobs that are in different stated.  Find the job in processing state and select **Cancel** on the right hand side of the Batch pipeline Jobs tab and then click **Yes**. 

>[!NOTE]A failed pipeline job cannot be canceled.


# TODO:  Check in portal for accuracy

## Delete a pipeline topology of batch kind

In order to delete a pipeline topology of batch kind all pipeline jobs that are currently in the processing state must be canceled.  Once all pipeline jobs have been completed or canceled the pipeline topology of batch kind can be deleted.  To delete a pipeline topology of batch kind:

1. Navigate to the Video Analyzer account.

1. Click on  **Batch** under `Video Analyzer` section.

1. Under the topologies tab locate your pipeline topology of batch kind to delete and click on the '**...**' at the right hand side of the pipeline topology of batch kind.

1. Click on **Delete topology**.

>[!NOTE]All pipeline jobs must be deleted from a pipeline topology of batch kind before a pipeline topology of batch kind can be deleted.

# TODO:  Check in portal for accuracy





## Clean up resources

[!INCLUDE [clean-up-resources](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant products page](https://www.onvif.org/conformant-products/) by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. Follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then follow the instructions in the [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md) quickstart to register the device with Azure IoT Hub.

