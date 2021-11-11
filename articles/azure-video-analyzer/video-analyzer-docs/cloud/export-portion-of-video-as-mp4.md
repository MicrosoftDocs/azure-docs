---
title: Export a portion of an Azure Video Analyzer recorded video to an MP4 file
description: In this tutorial, you'll learn how to export a portion of a Video Analyzer recorded video as an MP4 which is stored as a Video Analyzer video which can be downloaded and consumed outside of the Video Analyzer account ecosystem.
ms.topic: tutorial
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---
# Tutorial: Export portion of recorded video as an MP4 file

[!INCLUDE [header](includes/cloud-env.md)]

In this tutorial, you'll learn how to export a portion of video that has been recorded in Azure Video Analyzer account.  This exported portion of video is saved as a MP4 file which can be downloaded and consumed outside of the Video Analyzer account.

## Suggested pre-reading  

Read these articles before you begin:

* [Azure Video Analyzer overview](../overview.md)
* [Azure Video Analyzer terminology](../terminology.md)
* [Video Analyzer Pipeline concepts](../pipeline.md)
* [Event-based video recording](../event-based-video-recording-concept.md)

## Prerequisites

Prerequisites for this tutorial are:

* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.
* [Video Analyzer account](../create-video-analyzer-account.md).
* Have completed [Quickstart: Detect motion, record video to Video Analyzer](../edge/detect-motion-record-video-clips-cloud.md) or any Video Analyzer pipeline that records to a video sink.

## Overview

Video Analyzer can record videos from an RTSP source and in the Video Analyzer account these videos are recorded in a segmented archive.  The segmented archive format allows unbounded duration of video recording, however, in some cases it is necessary to save a portion of video as an MP4 so that it can be individually archived, downloaded, or played outside of the Video Analyzer ecosystem.

In this tutorial, you will learn:

* About batch pipeline topologies and batch pipeline jobs
* How to create a batch topology.
* How to create a batch pipeline job from a Video Analyzer video archive that will create a MP4 file that contains a specified value of time (up to 24 hours).

## Pipeline topology of **batch** kind

A pipeline topology of batch kind enables you to describe how recorded video should be processed for export based on your custom needs through three interconnected nodes.  A pipeline topology of batch kind is the base that is used for pipeline jobs.  A pipeline job is the individual instance of a pipeline topology of batch kind.  The pipeline job imports the recorded Video Analyzer video and saves it to the Video Analyzer's storage account, as a downloadable MP4 file.  The pipeline topology of batch kind uses a [video source node](../pipeline.md#video-source) that connects to an [encoder processor node](../pipeline.md#encoder-processor) and then connects to a [video sink node](../pipeline.md#video-sink).

> [!NOTE]
> For more information about sources, processors and sinks please see [sources, processors, and sinks](../pipeline.md#sources-processors-and-sinks). For more information on pipeline jobs please see [pipeline jobs](../pipeline.md#batch-pipeline)

## Create a pipeline job (from Videos)

1. In the Azure portal navigate to your Video Analyzer account.
1. Select **Videos** under the `Video Analyzer` section and then select the video stream that should be used to export a portion of video from.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/export-portion-of-video-as-mp4/video-analyzer-video.png" alt-text="Image of Azure Video Analyzer's Video Analyzer menu section highlighting the Videos selection.":::
1. On the Video widget player blade click on **Create Job** at the top.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/export-portion-of-video-as-mp4/create-job.png" alt-text="Image of Azure Video Analyzer's video widget blade highlighting the create a job selection.":::
1. In the `Create Job` fly out blade select:

   1. Select **Create from sample** for the `Batch topology`.
   1. Select the **Video export** sample topology in the `Batch topology name` drop down list.
   1. Enter a name in the `Batch topology name` to save the topology as.

        > [!NOTE]
        > The sample topology will be saved as the name entered above.  It will be available to re-use next time a video is to be exported.
1. In the `Name your job` section enter a **Job name** in the Job name filed and a **Description** for the job in the description field (the description is optional)
1. In the `Define parameters` section:
    1. Enter the name of the Video Analyzer recorded video in the `sourceVideoName` field.
    1. In the `videoSourceTimeSequenceParameter` field select the start and end dates by clicking on the calendar icon and selecting the dates for each value.  In the time fields, enter the start and end times for the pipeline job to use for creating the video clip with.
        > [!NOTE]
        > The time value for a given recorded video is displayed in the upper right hand side of the video widget player.  This time value is shown in the image below with a red box around it.  The calendar icon is also shown in the image below with a green box around it.

    1. Enter a name for the exported MP4 file in the `exportedVideoName` field.
  
      > [!div class="mx-imgBorder"]
      > :::image type="content" source="./media/export-portion-of-video-as-mp4/video-widget-job-creation.png" alt-text="Image of Azure Video Analyzer's video player widget and pipeline jobs fly-out blade highlighting the video time stamp in a red box and a green box around the calendar icon.":::
1. Click **Create** at the bottom of the `Create a job` fly-out blade.  
    
    To monitor the Pipeline Job, navigate to the `Batch Jobs tab`.
1. Under the `Video Analyzer` section select **Batch**.
1. Click on the `Jobs` tab at the top of the Batch Blade.
  
    The Batch Job will enter a processing state, then upon successful completion it will change state to `Completed`.  To view the associated MP4 video file:
1. Click on **Videos** under the `Video Analyzer` section.
1. Click on the video name that matches the Batch Jobs name used previously in step 5.  

The Video Widget player should start playing the MP4 file.  To download the MP4 file click on `Download video` at the top of the blade.  This will open the MP4 file in a new browser tab.  Right click on the video and click **save as**.

## Cancel a pipeline job

Once a pipeline job has entered the processing state the pipeline job can be canceled.  To cancel a pipeline job:

1. Navigate to the Video Analyzer account and select **Batch** under **Video Analyzer** section.
1. In the Batch blade select the **Jobs** tab at the top.
1. Under the jobs tab you will find a list of jobs that are in different states. Find the job you wish to cancel in the processing state and select **Cancel** on the right hand side of the Batch pipeline Jobs tab and then click **Yes**.

    > [!NOTE]
    > A failed pipeline job cannot be canceled.

## Delete a pipeline job

Once a pipeline job has entered the completed or failed state the pipeline job can be deleted.  To delete a pipeline job:

1. Navigate to the Video Analyzer account and select **Batch** under **Video Analyzer** section.
1. In the Batch blade select the **Jobs** tab at the top.
1. Under the jobs tab you will find a list of jobs that are in different states.  Find the job you wish to delete (in the canceled, completed or failed state) and select **Delete** on the right hand side pipeline Jobs and then click **Delete**.

## Delete a pipeline topology of batch kind

In order to delete a pipeline topology of batch kind all pipeline jobs that are associated with the pipeline topology must be deleted.  To delete a pipeline topology of batch kind:

1. Navigate to the Video Analyzer account.
2. Click on  **Batch** under `Video Analyzer` section.
3. Under the topologies tab locate your pipeline topology of batch kind to delete and click on the '**...**' at the right hand side of the pipeline topology of batch kind.
4. Click on **Delete topology**.

    > [!NOTE]
    > All pipeline jobs must be deleted from a pipeline topology of batch kind before a pipeline topology of batch kind can be deleted.

## Clean up resources

If you want to try other quickstarts or tutorials, keep the resources that you created. Otherwise, go to the Azure portal, go to your resource groups, select the resource group where you ran this quickstart, and delete all the resources.

## Next steps

* [Connect cameras directly to the cloud](./connect-cameras-to-cloud.md) in order capture and record video, using [cloud pipelines](../pipeline.md).
* [Connect cameras to Video Analyzer's service via the Video Analyzer edge module acting as a transparent gateway for video packets via RTSP protocol](./use-remote-device-adapter.md).
