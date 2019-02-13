---
title: Download the SDK
description: Download links for the SDK
author: brenta
ms.author: brenta
ms.date: 01/18/YYYY
ms.topic: article
keywords: visual studio,sdk, update, latest, available, install
---


# Download the SDK

Download the SDK to develop for Azure Kinect.

>[!IMPORTANT]
>By downloading the Sensor SDK on this page, you acknowledge Depth Engine license. See [Depth Engine License](sdk-depthengine-license.md) agreement.

## Download Links

### Windows

Version       | Date | Documentation | Download | Source
--------------|------|---------------|----------|----------
 0.7.1 | 2019-01-18 | [0.7.1](~/api/current/index.md)  | [zip](https://microsoft.visualstudio.com/_apis/resources/Containers/16767721?itemPath=k4asdk-windows%2Fk4asdk-windows-0.7.1.zip) | [source](https://microsoft.visualstudio.com/Analog/_git/analog.ai.depthcamera?version=GTv0.7.1) 
 0.6.0 | 2019-01-09 | [0.6.0](~/api/0.6.0/index.md)  | [zip](https://microsoft.visualstudio.com/_apis/resources/Containers/16428159?itemPath=k4asdk-windows%2Fk4asdk-windows-0.6.0.zip) | [source](https://microsoft.visualstudio.com/Analog/_git/analog.ai.depthcamera?version=GTv0.6.0) 
 0.5.2 | 2018-12-14 | [0.5.2](~/api/0.5.2/index.md)  | [zip](https://microsoft.visualstudio.com/_apis/resources/Containers/15813375?itemPath=k4asdk-windows%2Fk4asdk-windows-0.5.2.zip) | [source](https://microsoft.visualstudio.com/Analog/_git/analog.ai.depthcamera?version=GTv0.5.2) 
 0.3.0 | 2018-12-05 | [0.3.0](~/api/0.3.0/index.md)  | [zip](https://microsoft.visualstudio.com/_apis/resources/Containers/15506533?itemPath=k4asdk-windows%2Fk4asdk-windows-0.3.0.zip) | [source](https://microsoft.visualstudio.com/Analog/_git/analog.ai.depthcamera?version=GTv0.3.0) 
 0.2.0 | 2018-11-20 | [0.2.0](~/api/0.2.0/index.md)  | [zip](https://microsoft.visualstudio.com/_apis/resources/Containers/14896132?itemPath=k4asdk-windows%2Fk4asdk-windows-0.2.0.zip) | [source](https://microsoft.visualstudio.com/Analog/_git/analog.ai.depthcamera?version=GTv0.2.0) 


## Change Log

### v0.7.1

* Added file based record and playback headers to SDK
* Swapped tangential distortion parameters p1 and p2 in intrinsic calibration to align with OpenCV.

### v0.7.0

* Removed deprecated API's and structures
* Drop depth captures if they arrive successfully over USB but are too small.
* Drop IMU captures when the timestamp is reported is not valid.
* On k4a_device_open, stop depth and IMU sensors from streaming in the event the previous session didn't clean up.
* Renamed k4a_camera_calibration_t to k4a_calibration_camera_t for naming consistency in k4atypes.h.
* Renamed k4a_intrinsic_parameters_t to k4a_calibration_intrinsic_parameters_t for naming consistency in k4atypes.h.
* OpenCV compatibility
    * Added support for Brown-Conrady lens model.
    * Modified parameters of intrinsic calibration to be pixelized and 0-centered instead of unitized and 0-cornered.

### v0.6.0

* Added support for k4a_image_t and family of API's to support access.
* Removed direction image access via k4a_capture_ API's
* Deprecated most k4a_capture_get_* API's

### v0.5.2

* Switched firmware file to manufacturing version to address bugs

### v0.5.1

* Add firmware binary blob to SDK

### v0.5.0

* destub_depth_engine_process_frame error was converted to a warning and message softened.
* Added synchronized_images_only to k4a_device_configuration_t
* USB depth transfer request size more closely matches expected image size.
* k4aviewer now can save default settings
* Bug fixes

### v0.3.0

* Additional color camera controls
* Bug fixes
* Support native RGB
* Support for external sync connections
* Point cloud viewer
* Updated K4AViewer to support High DPI displays
* Removed k4a image format K4A\_IMAGE\_FORMAT\_UNKNOWN
* Rmoved k4a FPS value K4A\_FRAMES\_PER\_SECOND\_OFF
* Added tool to run firmware update
* IMU recording and device selection was added to k4arecorder
* Removed x86 builds from the SDK
* Removed DepthEngine.pdb from the SDK
* Minor breaking change to k4a_device_configuration_t; color_fps & depth_fps consolidated to camera_fps

### v0.2.0

Sensor SDK v0.2.0 includes major refactoring to API

* API refactoring (**breaking change**)
* Depth-RGB correlation API
* ***Note!*** When using both Depth-RGB cameras same time they will be syncronized and can only run with the same framerate. Option to have separate frame rates have been disabled.
* Additional frame-meta data support (e.g. resolution, laser temperature)
* Coordinate space helpers (Project 3D to 2D, Unproject 2D to 3D, Extrinsic transformation (3D to 3D)
* Sensor recording API refactoring and improvements
* Sensor recorder and Kinect for Azure viewer updated to new API

### v0.1.0

This is the very first internal sensor SDK release

* Depth camera access
* RGB camera access
* RGB camera exposure control
* IMU access
* Device calibration blob access
* Frame meta-data for Depth and RGB device timestamp
* Kinect for Azure Viewer, samples (streaming, enumeration,..)
* Recording tool (Depth and RGB streams)

