---
title: k4a_device_t handle
description: Handle to a k4a device. 
author: brenta
ms.author: brenta
ms.date: 01/18/2019
ms.topic: article
keywords: kinect, kinect for azure, k4a, api, sdk, handle
---
# k4a_device_t handle

Handle to a k4a device. 

## Syntax

```C
typedef struct { } k4a_device_t;
```
Handles are created with 
[k4a_device_open()](~/api/0.2.0/k4a-device-open.md)
 and closed with 
[k4a_device_close()](~/api/0.2.0/k4a-device-close.md)
. Invalid handles are set to 0.

## Requirements

Requirement | Value
------------|--------------------------------
 Header | k4atypes.h (include k4a/k4a.h) 


## Functions

|  Title | Description |
|--------|-------------|
| [k4a_device_close](~/api/0.2.0/k4a-device-close.md) | Closes a k4a device.  |
| [k4a_device_get_capture](~/api/0.2.0/k4a-device-get-capture.md) | Reads a sensor capture.  |
| [k4a_device_get_color_control](~/api/0.2.0/k4a-device-get-color-control.md) | Get the K4A color sensor control value.  |
| [k4a_device_get_imu_sample](~/api/0.2.0/k4a-device-get-imu-sample.md) | Reads a imu sample.  |
| [k4a_device_get_serialnum](~/api/0.2.0/k4a-device-get-serialnum.md) | Get the K4A device serial number.  |
| [k4a_device_get_version](~/api/0.2.0/k4a-device-get-version.md) | Get the version numbers of the K4A sub systems.  |
| [k4a_device_set_color_control](~/api/0.2.0/k4a-device-set-color-control.md) | Set the K4A color sensor control value.  |
| [k4a_device_start_cameras](~/api/0.2.0/k4a-device-start-cameras.md) | Starts the K4A device.  |
| [k4a_device_start_imu](~/api/0.2.0/k4a-device-start-imu.md) | Starts the K4A IMU.  |
| [k4a_device_stop_cameras](~/api/0.2.0/k4a-device-stop-cameras.md) | Stops the K4A device.  |
| [k4a_device_stop_imu](~/api/0.2.0/k4a-device-stop-imu.md) | Stops the K4A IMU.  |

