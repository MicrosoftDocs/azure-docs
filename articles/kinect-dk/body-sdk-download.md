---
title: Azure Kinect Body Tracking SDK download
description: Download links for the Body Tracking SDK
author: qm13
ms.author: quentinm
ms.prod: kinect-dk
ms.date: 06/06/2019
ms.topic: conceptual
keywords: azure, kinect, sdk, download update, latest, available, install, body, tracking
---

# Download Azure Kinect Body Tracking SDK

This document provides links to install each version of the Azure Kinect Body Tracking SDK. 

## Azure Kinect Body Tracking SDK contents

* Headers and libraries to build a body tracking application using the Azure Kinect DK.
* Redistributable DLLs needed by body tracking applications using the Azure Kinect DK.
* Sample body tracking applications.

## Windows download links

Version       | Download
--------------|----------
0.9.0 | [msi](https://microsoft.sharepoint.com/:u:/t/EdenUsers/EWImH07V9W5KvTOP0ybkBYUBldfGR9WAaKiiWRq5RDl0Fw?e=F6qjMk)

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect Body Tracking SDK 0.9.0". You will find the samples referenced in articles in this path.

## Change log

### v0.9.0
* [Breaking Change] Change the SDK dependencies to CUDA 10.0 instead of CUDA 10.1, as the official ONNX runtime only supports up to CUDA 10.0. 
* [Breaking Change] Switch to use ONNX runtime instead of Tensorflow. It largely reduces the first frame launching time. It also reduces the SDK binary size.
* [API Change] Rename API k4abt_tracker_queue_capture to k4abt_tracker_enqueue_capture
* [API Change] Break API k4abt_frame_get_body into two separate APIs: k4abt_frame_get_body_skeleton and k4abt_frame_get_body_id. Now user can query the body ID without always copying the whole skeleton struct. 
* [API Change] Add API k4abt_frame_get_timestamp_usec to simplify the steps for the users to query body frame timestamp.
* Further improve the Body Tracking algorithm accuracy and tracking reliability

### v0.3.0

* Added support for NVIDIA RTX GPUs by moving to CUDA 10.1 dependency
* Provide the joint output in millimeters to be consistent with the Kinect for Windows v2 SDK
* Further improve the body tracking algorithm accuracy and reliability.

## Next steps

> [!div class="nextstepaction"]
>[Azure Kinect DK overview](about-azure-kinect-dk.md)

> [!div class="nextstepaction"]
>[Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

> [!div class="nextstepaction"]
>[Set up Azure Kinect body tracking](body-sdk-setup.md)