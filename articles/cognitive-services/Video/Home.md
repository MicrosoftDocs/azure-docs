---
title: Video API documentation overview | Microsoft Docs
description: Explore the Video API, which provides advanced algorithms for tracking faces, detecting motion, stabilizing, and creating thumbnails from video.
services: cognitive-services
author: CYokel
manager: ytkuo

ms.service: cognitive-services
ms.technology: video
ms.topic: article
ms.date: 07/28/2016
ms.author: chbryant
---

# Video API

Welcome to Microsoft Video API. Video API is a cloud-based API that provides advanced algorithms for tracking faces, detecting motion, stabilizing and creating thumbnails from video. This API allows you to build more personalized and intelligent apps by understanding and automatically transforming your video content.

## Face Detection and Tracking
The Face Detection and Tracking video API provides high precision face location detection and tracking that can detect up to 64 human faces in a video. Frontal faces provide the best results, while side faces and small faces (smaller than or equal to 24x24 pixels) are challenging.

Face detection can be done by uploading an entire video file or by specifying the URL of an existing video on the web.

The detected and tracked faces are returned with coordinates (left, top, width, and height) indicating the location of faces in the image in pixels, as well as a face ID number indicating the tracking of that individual. Face ID numbers are prone to reset under circumstances when the frontal face is lost or overlapped in the frame.

For more details about how to use face detection and tracking, refer to the [Video API reference guide](https://westus.dev.cognitive.microsoft.com/docs/services/565d6516778daf15800928d5/operations/565d6517778daf0978c45e39).

## Motion Detection
The Motion Detection API provides indicators once there are objects in motion in a fixed background video (e.g. a surveillance video). The API allows you to input motion detection zones to define areas in the frame to detect the motion. Motion Detection is trained to reduce false alarms. Current limitations of the algorithms include semi-transparent objects and small objects. Developers have the ability to adjust sensitivity levels to detect smaller objects.

Motion detection can be done by uploading an entire video file or by specifying the URL of an existing video on the web.

The output of this API is in JSON format, consisting of both time and duration of motion detected in the video.

For more details about how to use motion detection, refer to the [Video API reference guide](https://westus.dev.cognitive.microsoft.com/docs/services/565d6516778daf15800928d5/operations/565d6517778daf0978c45e3a).

## Stabilization
The Stabilization API provides automatic video stabilization and smoothing for shaky videos. This API uses many of the same technologies found in [Microsoft Hyperlapse](http://research.microsoft.com/en-us/um/redmond/projects/hyperlapseapps/). Stabilization is optimized for small camera motions, with or without rolling shutter effects (e.g. holding a static camera, walking with a slow speed).

Stabilization can be done by uploading an entire video file or by specifying the URL of an existing video on the web.

The output of this API is in MP4 video format, consisting of the smoothed and stabilized version of the originally submitted video.

For more details about how to use stabilization, refer to the [Video API reference guide](https://westus.dev.cognitive.microsoft.com/docs/services/565d6516778daf15800928d5/operations/565d6517778daf0978c45e35).

## Video Thumbnail 
A video thumbnail lets people see a preview or snapshot of your video. When a viewer wants to get a quick glance of the video content, this API can be used to generate a motion thumbnail which consists of scenes from the original video. 

Microsoft Video API applies computer vision intelligence to identify the characteristics of your video’s content. It will select the most representative scenes from your video to create a thumbnail. Selection criteria is also based on video quality, diversity, and stability of the footage. Video API creates an index of the best video scenes and marks the duration in seconds. Based on this index, a user may opt to select a set of scenes to create the thumbnail. The other option is to let Video API generate the thumbnail based on its algorithms.

For more details about how to use video thumbnail, refer to the [Video API reference guide](https://westus.dev.cognitive.microsoft.com/docs/services/565d6516778daf15800928d5/operations/56f8acb0778daf23d8ec6738).




