---
title: Kinect for Windows Comparison
description: HW/SW differences between Azure Kinect DK and Kinect for Windows v2
author: joylital
ms.author: joylital
ms.date: 10/0/2/2018
keywords: Kinect, Windows, v2, Azure Kinect, comparison, SDK, differences
---

# Azure Kinect and Kinect for Windows Comparison

Azure Kinect DK hardware and Software Development Kits have differences to Kinect for Windows V2 HW/SW. This page highlights main differences between these to devices.

## Hardware

High level difference between Azure Kinect development kit and Kinect for Windows v2 in table below

|               |                 | Azure Kinect DK                                                              | Kinect for Windows V2                               |
|---------------|-----------------|--------------------------------------------------------------------------------------------|-----------------------------------------------------|
| **Audio**         | Details         | 7-mic circular array                                                                       | 4-mic linear phased array                           |
| **Motion sensor** | Details         | 3-axis accelerometer + 3-axis gyro                                                         | 3-axis accelerometer                                |
| **RGB Camera**    | Details         | 3840 x 2160 px @30 fps                                                          | 1920 x 1080 px @30 fps                   |
| **Depth Camera**  | Method          | Time-of-Flight                                                                             | Time-of-Flight                                      |
|               | Resolution/FOV  | 640 x 576 px @30 fps                                                              | 512 x 424 px, 70 x 60 @ 30 fps                     |
|               |                 | 512 x 512 px @30 fps                                                             |                   |
|               |                 | 1024x1024 px @15 fps                                                              |                    |
| **Connectivity**  | Data            | USB-C                                                                                      | USB 3.1 gen 1                                       |
|               | Power           | External PSU or USB-C only                                                                 | External PSU                                        |
|               | Synchronization | RGB & Depth internal, external device-to-device       | RGB & Depth internal only |
| **Mechanical**    | Dimensions      | 103 x 39 x 126 mm                                                                          | 249 x 66 x 67 mm                                    |
|               | Mass            | 440 g                                                                                      | 970 g                                               |
|               | Mounting        | One ¼-20 UNC. Four internal screw points.                                                   | One ¼-20 UNC.                                       |


More information about [Azure Kinect DK hardware](azure-kinect-devkit.md)


## Sensor access

Low level device sensor access capability comparison 

|    Functionality                                   |    K4A                |    K4W     |    Notes                                                                 |
|----------------------------------------------------|------------------------|--------------|--------------------------------------------------------------------------|
|    **Depth**                                           |    ✔️                 |    ✔️       |                                                                          |
|    **IR**                                              |    ✔️                 |    ✔️       |                                                                          |
|    **Color**                                           |    ✔️                 |    ✔️       |   Color format support differences                                      |
|    **Audio**                                           |    ✔️                 |    ✔️       |   K4A is throught Windows native API, not part of sensor SDK                   |
|    **IMU**                                             |    ✔️                |    Partial (1-axis)       |                                                                          |
|    **Depth-RGB internal sync**    |    ✔️                 |    ✔️       |                                                                          |
|    **External Sync**              |    ✔️                |          | K4A allow programmable delay for external sync                                                                       |


## Algorithm

Skeletal/Body tracking was the most requested algorithm per feedback and will be provided as separate SDK. Feature requests should be made at [GitHub issues](https://github.com/microsoft/azure-kinect-sensor-sdk/issues)

|    Functionality                                   |    K4A                |    K4W     |    Notes                                                                 |
|----------------------------------------------------|------------------------|--------------|--------------------------------------------------------------------------|
|    **Hand state**                                      |                     |    ✔️    |                                             |
|    **Face (feature) tracking**                         |                     |    ✔️        |                                                                          |
|    **Face capture (Face HD)**                        |                       |    ✔️        |                                                                          |
|    **Fully articulated skeletal tracking**           |    ✔️                 |    ✔️       |                                               |
|    **Hand cursor**                                     |                     |    ✔️        |                                                 |
|    **Custom gesture builder**                          |                     |    ✔️       |                                                             |
|    **Body index**                                      |                     |    ✔️   |                                                       |
|    **Kinect Fusion**                                   |                     |    ✔️        |                                                                          |
|    **Stream record / playback tool**                   |    ✔️                 |    ✔️       |       |

## See also

* [Body Tracking SDK ](https://review.docs.microsoft.com/en-us/skeletal-tracking/sdkusage?branch=master)
* [Kinect for Windows developer pages](https://developer.microsoft.com/en-us/windows/kinect)