---
title: Azure Kinect Body Tracking SDK download
description: Understand how to download each version of the Azure Kinect Sensor SDK on Windows or Linux.
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
1.0.1 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100942) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/1.0.1)
1.0.0 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100848) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/1.0.0)
0.9.5 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100636) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.5)
0.9.4 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100415) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.4)
0.9.3 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100307) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.3)
0.9.2 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100128) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.2)
0.9.1 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=100063) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.1)
0.9.0 | [msi](https://www.microsoft.com/en-us/download/details.aspx?id=58402) [nuget](https://www.nuget.org/packages/Microsoft.Azure.Kinect.BodyTracking/0.9.0)

## Linux installation instructions

Currently, the only supported distribution is Ubuntu 18.04. To request support for other distributions, see [this page](https://aka.ms/azurekinectfeedback).

First, you'll need to configure [Microsoft's Package Repository](https://packages.microsoft.com/), following the instructions [here](https://docs.microsoft.com/windows-server/administration/linux-package-repository-for-microsoft-software).

The `libk4abt<major>.<minor>-dev` package contains the headers and CMake files to build against `libk4abt`.
The `libk4abt<major>.<minor>` package contains the shared objects needed to run executables that depend on `libk4abt` as well as the example viewer.

The basic tutorials require the `libk4abt<major>.<minor>-dev` package. To install it, run

`sudo apt install libk4abt1.0-dev`

If the command succeeds, the SDK is ready for use.

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect Body Tracking SDK 1.0.0". You will find the samples referenced in articles in this path.
> Body tracking samples are located in the [body-tracking-samples](https://github.com/microsoft/Azure-Kinect-Samples/tree/master/body-tracking-samples) folder in the Azure-Kinect-Samples repository. You will find the samples referenced in articles here.

## Change log

### v1.0.1
* [Bug Fix] Fix issue that the SDK crashes if loading onnxruntime.dll from path on Windows build 19025 or later: [Link](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/issues/932)

### v1.0.0
* [Feature] Add C# wrapper to the msi installer.
* [Bug Fix] Fix issue that the head rotation cannot be detected correctly: [Link](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/issues/997)
* [Bug Fix] Fix issue that the CPU usage goes up to 100% on Linux machine: [Link](https://github.com/microsoft/Azure-Kinect-Sensor-SDK/issues/1007)
* [Samples] Add two samples to the sample repo. Sample 1 demonstrates how to transform body tracking results from the depth space to color space [Link](https://github.com/microsoft/Azure-Kinect-Samples/tree/master/body-tracking-samples/camera_space_transform_sample); sample 2 demonstrates how to detect floor plane [Link](https://github.com/microsoft/Azure-Kinect-Samples/tree/master/body-tracking-samples/floor_detector_sample)

### v0.9.5
* [Feature] C# support. C# wrapper is packed in the nuget package.
* [Feature] Multi-tracker support. Creating multiple trackers is allowed. Now user can create multiple trackers to track bodies from different Azure Kinect devices.
* [Feature] Multi-thread processing support for CPU mode. When running on CPU mode, all cores will be used to maximize the speed.
* [Feature] Add `gpu_device_id` to `k4abt_tracker_configuration_t` struct. Allow users to specify GPU device that is other than the default one to run the body tracking algorithm.
* [Bug Fix/Breaking Change] Fix typo in a joint name. Change joint name from `K4ABT_JOINT_SPINE_NAVAL` to `K4ABT_JOINT_SPINE_NAVEL`.

### v0.9.4
* [Feature] Add hand joints support. The SDK will provide information for three additional joints for each hand: HAND, HANDTIP, THUMB.
* [Feature] Add prediction confidence level for each detected joints.
* [Feature] Add CPU mode support. By changing the `cpu_only_mode` value in `k4abt_tracker_configuration_t`, now the SDK can run on CPU mode which doesn't require the user to have a powerful graphics card.

### v0.9.3
* [Feature] Publish a new DNN model dnn_model_2_0.onnx, which largely improves the robustness of the body tracking.
* [Feature] Disable the temporal smoothing by default. The tracked joints will be more responsive.
* [Feature] Improve the accuracy of the body index map.
* [Bug Fix] Fix bug that the sensor orientation setting is not effective.
* [Bug Fix] Change the body_index_map type from K4A_IMAGE_FORMAT_CUSTOM to K4A_IMAGE_FORMAT_CUSTOM8.
* [Known Issue] Two close bodies may merge to single instance segment.

### v0.9.2
* [Breaking Change] Update to depend on the latest Azure Kinect Sensor SDK 1.2.0.
* [API Change] `k4abt_tracker_create` function will start to take a `k4abt_tracker_configuration_t` input. 
* [API Change] Change `k4abt_frame_get_timestamp_usec` API to `k4abt_frame_get_device_timestamp_usec` to be more specific and consistent with the Sensor SDK 1.2.0.
* [Feature] Allow users to specify the sensor mounting orientation when creating the tracker to achieve more accurate body tracking results when mounting at different angles.
* [Feature] Provide new API `k4abt_tracker_set_temporal_smoothing` to change the amount of temporal smoothing that the user wants to apply.
* [Feature] Add C++ wrapper k4abt.hpp.
* [Feature] Add version definition header k4abtversion.h.
* [Bug Fix] Fix bug that caused extremely high CPU usage.
* [Bug Fix] Fix logger crashing bug.

### v0.9.1
* [Bug Fix] Fix memory leak when destroying tracker
* [Bug Fix] Better error messages for missing dependencies
* [Bug Fix] Fail without crashing when creating a second tracker instance
* [Bug Fix] Logger environmental variables now work correctly
* Linux support

### v0.9.0

* [Breaking Change] Downgraded the SDK dependency to CUDA 10.0 (from CUDA 10.1). ONNX runtime officially only supports up to CUDA 10.0.
* [Breaking Change] Switched to ONNX runtime instead of Tensorflow runtime. Reduces the first frame launching time and memory usage. It also reduces the SDK binary size.
* [API Change] Renamed `k4abt_tracker_queue_capture()` to `k4abt_tracker_enqueue_capture()`
* [API Change] Broke `k4abt_frame_get_body()` into two separate functions: `k4abt_frame_get_body_skeleton()` and `k4abt_frame_get_body_id()`. Now you can query the body ID without always copying the whole skeleton structure.
* [API Change] Added  `k4abt_frame_get_timestamp_usec()` function to simplify the steps for the users to query body frame timestamp.
* Further improved the body tracking algorithm accuracy and tracking reliability

## Next steps

- [Azure Kinect DK overview](about-azure-kinect-dk.md)

- [Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

- [Set up Azure Kinect body tracking](body-sdk-setup.md)
