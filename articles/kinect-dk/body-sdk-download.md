---
title: Azure Kinect Body Tracking SDK download
description: Download links for the Body Tracking SDK
author: qm13
ms.author: quentinm
ms.prod: kinect-dk
ms.date: 06/26/2019
ms.topic: conceptual
keywords: azure, kinect, sdk, download update, latest, available, install, body, tracking
---

# Download Azure Kinect Body Tracking SDK

This document provides links to install each version of the Azure Kinect Body Tracking SDK. 

## Azure Kinect Body Tracking SDK contents

- Headers and libraries to build a body tracking application using the Azure Kinect DK.
- Redistributable DLLs needed by body tracking applications using the Azure Kinect DK.
- Sample body tracking applications.

## Windows download links

Version       | Download
--------------|----------
0.9.0 | [msi](https://download.microsoft.com/download/F/D/E/FDE380A1-6E63-4571-94F3-F3744E9EE85A/Azure%20Kinect%20Body%20Tracking%20SDK%200.9.0.msi)

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect Body Tracking SDK 0.9.0". You will find the samples referenced in articles in this path.

## Change log

### v0.9.0

* [Breaking Change] Downgraded the SDK dependency to CUDA 10.0 (from CUDA 10.1). ONNX runtime officially only supports up to CUDA 10.0.
* [Breaking Change] Switched to ONNX runtime instead of Tensorflow runtime. Reduces the first frame launching time and memory usage. It also reduces the SDK binary size.
* [API Change] Renamed `k4abt_tracker_queue_capture()` to `k4abt_tracker_enqueue_capture()`
* [API Change] Broke `k4abt_frame_get_body()` into two separate functions: `k4abt_frame_get_body_skeleton()` and `k4abt_frame_get_body_id()`. Now you can query the body ID without always copying the whole skeleton structure.
* [API Change] Added  `k4abt_frame_get_timestamp_usec()` function to simplify the steps for the users to query body frame timestamp.
* Further improved the body tracking algorithm accuracy and tracking reliability

### v0.3.0

* [Breaking Change] Added support for NVIDIA RTX GPUs by moving to CUDA 10.1 dependency
* [API Change] Provide the joint output in millimeters to be consistent with the Kinect for Windows v2 SDK
* Further improved the body tracking algorithm accuracy and reliability.

## Next steps

- [Azure Kinect DK overview](about-azure-kinect-dk.md)

- [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

- [Set up Azure Kinect body tracking](body-sdk-setup.md)