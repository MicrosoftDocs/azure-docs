---
title: Using Azure Kinect Sensor SDK - Recording File Format
description: Recording file format details
author: joylital
ms.author: joylital
ms.prod: kinect-depth_track_enabled
ms.date: 06/06/2019
ms.topic: reference
keywords: kinect, azure, sensor, sdk, depth, rgb, record, playback, matroska, mkv
---
# Recording File Format

To record sensor data, the Matroska (.mkv) container format is used, which allows for multiple tracks to be stored.
using a wide range of codecs. The recording file contains tracks for storing Color, Depth, IR images, and IMU.

Low-level details of the .mkv container format can be found on the [Matroska Website](https://www.matroska.org/index.html).

| Track Name | Codec Format                          |
|:-----------|---------------------------------------|
| COLOR      | Mode Dependent (MJPEG, NV12, or YUY2) |
| DEPTH      | b16g (16-bit Grayscale, Big-endian)   |
| IR         | b16g (16-bit Grayscale, Big-endian)   |
| IMU        | Custom structure, see IMU sample structure] below. |

Tools such as `ffmpeg` or the `mkvinfo` command from the [MKVToolNix](https://mkvtoolnix.download/) toolkit can be used to view and extract information
from recording files. For example, the following command will extract the depth track as a sequence of 16-bit PNGs to the same folder:

```
ffmpeg -i output.mkv -map 0:1 -vsync 0 depth%04d.png
```

The `-map 0:1` parameter will extract track index 1, which for most recordings will be depth. If the recording does not contain a color track, `-map 0:0` would be used.

The `-vsync 0` parameter forces ffmpeg to extract frames as-is instead of trying to match a framerate of 30 fps, 15 fps or 5 fps.

## IMU sample structure

If IMU data is extracted from the file without using the playback API, the data will be in binary form.
The structure of the IMU data is below. All fields are little-endian.

| Field                        | Type     |
|:-----------------------------|----------|
| Accelerometer Timestamp (µs) | uint64   |
| Accelerometer Data (x, y, z) | float[3] |
| Gyroscope Timestamp (µs)     | uint64   |
| Gyroscope Data (x, y, z)     | float[3] |

## Identifying tracks

When using third-party tools to read a Matroska file, it may be necessary to identify which track contains Color, Depth, IR, etc.
Since the track numbers in a recording file may change based on the camera mode and which tracks are enabled,
tags can be used to identify which track is which.

The list of tags below are each attached to a specific Matroska element, and can be used to look up the corresponding track or attachment.

These tags are viewable with tools such as `ffmpeg` and `mkvinfo`.
The full list of tags is listed on the [Record and Playback](record-playback-api.md) page.

| Tag Name             | Tag Target                       |
|----------------------|----------------------------------|
| K4A_COLOR_MODE       | Color Track                      |
| K4A_DEPTH_MODE       | Depth Track, unless "PASSIVE_IR" |
| K4A_IR_MODE          | IR Track                         |
| K4A_IMU_MODE         | IMU Track                        |
| K4A_CALIBRATION_FILE | Calibration Attachment           |

## Next steps

> [!div class="nextstepaction"]
>[Record and Playback](record-playback-api.md)