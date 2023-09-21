---
title: Use Azure Kinect Sensor SDK to record file format
description: Understand how to use the Azure Kinect Sensor SDK recorded file format.
author: martinekuan
ms.author: martinek
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: reference
keywords: kinect, azure, sensor, sdk, depth, rgb, record, playback, matroska, mkv
---
# Use Azure Kinect Sensor SDK to record file format

To record sensor data, the Matroska (.mkv) container format is used, which allows for multiple tracks to be stored using a wide range of codecs. The recording file contains tracks for storing Color, Depth, IR images, and IMU.

Low-level details of the .mkv container format can be found on the [Matroska Website](https://www.matroska.org/index.html).

| Track Name | Codec Format                          |
|------------|---------------------------------------|
| COLOR      | Mode-Dependent (MJPEG, NV12, or YUY2) |
| DEPTH      | b16g (16-bit Grayscale, Big-endian)   |
| IR         | b16g (16-bit Grayscale, Big-endian)   |
| IMU        | Custom structure, see [IMU sample structure](record-file-format.md#imu-sample-structure) below. |

## Using third-party tools

Tools such as `ffmpeg` or the `mkvinfo` command from the [MKVToolNix](https://mkvtoolnix.download/) toolkit can be used to view and extract information
from recording files.

For example, the following command will extract the depth track as a sequence of 16-bit PNGs to the same folder:

```
ffmpeg -i output.mkv -map 0:1 -vsync 0 depth%04d.png
```

The `-map 0:1` parameter will extract track index 1, which for most recordings will be depth. If the recording doesn't contain a color track, `-map 0:0` would be used.

The `-vsync 0` parameter forces ffmpeg to extract frames as-is instead of trying to match a framerate of 30 fps, 15 fps, or 5 fps.

## IMU sample structure

If IMU data is extracted from the file without using the playback API, the data will be in binary form.
The structure of the IMU data is below. All fields are little-endian.

| Field                        | Type     |
|------------------------------|----------|
| Accelerometer Timestamp (µs) | uint64   |
| Accelerometer Data (x, y, z) | float[3] |
| Gyroscope Timestamp (µs)     | uint64   |
| Gyroscope Data (x, y, z)     | float[3] |

## Identifying tracks

It may be necessary to identify which track contains Color, Depth, IR, and so on. Identifying the tracks is needed when working with third-party tools to read a Matroska file.
Track numbers vary based on the camera mode and set of enabled tracks. Tags are used to identify the meaning of each track.

The list of tags below are each attached to a specific Matroska element, and can be used to look up the corresponding track or attachment.

These tags are viewable with tools such as `ffmpeg` and `mkvinfo`.
The full list of tags is listed on the [Record and Playback](record-playback-api.md) page.

| Tag Name             | Tag Target             | Tag Value             |
|----------------------|------------------------|-----------------------|
| K4A_COLOR_TRACK      | Color Track            | Matroska Track UID    |
| K4A_DEPTH_TRACK      | Depth Track            | Matroska Track UID    |
| K4A_IR_TRACK         | IR Track               | Matroska Track UID    |
| K4A_IMU_TRACK        | IMU Track              | Matroska Track UID    |
| K4A_CALIBRATION_FILE | Calibration Attachment | Attachment filename   |

## Next steps

[Record and Playback](record-playback-api.md)
