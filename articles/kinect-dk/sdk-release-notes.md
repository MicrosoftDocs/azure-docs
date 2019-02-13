---
title: Sensor SDK release notes
description: Sensor SDK Release notes
author: joylital    
ms.author: joylital, cedmonds
ms.date: 01/10/2019
ms.topic: article
keywords: sensor, sdk, tools, download, release, notes, features, new, update
---

# Release notes

For detailed history see commits in [repository](https://microsoft.visualstudio.com/DefaultCollection/Analog/_git/analog.ai.depthcamera/commits?itemPath=%2F&itemVersion=GBdevelop)

### v0.6.0

* Added support for k4a_image_t and family of API's to support access.
* Removed direction image access via k4a_capture_ API's
    * Deprecated most k4a_capture_get_* API's

### v0.5.2

* Switched firmware file to manufacturing version to address bugs

### v0.5.1

* Add firmware binary blob to SDK

### v0.5.0

* DepthEngine_ProcessFrame error was converted to a warning and message softened.
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
