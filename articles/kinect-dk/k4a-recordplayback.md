---
title: Recording sensors streams to a file
description: Instructions to use recording tool
author: jawirth
ms.author: jawirth
ms.date: 10/16/2018
ms.topic: article
keywords: kinect, record, playback, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio
---

# Recording Sensor Streams to a File

You can use the `k4arecorder` command line utility to record data streams from the sensor SDK to a file.

## Prerequisites

This quickstart assumes that 
* You have Azure Kinect DK connected to your host PC and powered properly
* You have completed [setup](set-up-hardware.md)

You should have following binaries in your directory to run recorder:
```
- k4arecorder.exe
- DepthEngine.dll
- k4a.dll
- k4arecord.dll
- libusb-1.0.dll
```
## Recording

The `k4arecorder` has various command line arguments to specify the output file and recording modes.

Recordings are stored in the Matroska .mkv format using multiple video tracks for color and depth.
Additional information such as camera calibration and metadata will also be stored in the mkv as well.

```
k4arecorder [options] output.mkv

 Options:
  -h, --help           Prints this help
  --list               List the currently connected K4A devices
  --device             Specify the device index to use (default: 0)
  -l, --record-length  Limit the recording to N seconds (default: infinite)
  -c, --color-mode     Set the color sensor mode (default: 1080p), Available options:
                         3072p, 2160p, 1536p, 1440p, 1080p, 720p, 720p_NV12, 720p_YUY2, OFF
  -d, --depth-mode     Set the depth sensor mode (default: NFOV_UNBINNED), Available options:
                         NFOV_2X2BINNED, NFOV_UNBINNED, WFOV_2X2BINNED, WFOV_UNBINNED, PASSIVE_IR, OFF
  -r, --rate           Set the camera frame rate in Frames per Second
                         Default is the maximum rate supported by the camera modes.
                         Available options: 30, 15, 5
  --imu                Set the IMU recording mode (ON, OFF, default: ON)
```
Example 1. Recording Depth NFOV unbinned (640x576) mode, RGB 1080p at 30fps with IMU. Use CTRL-C to stop recording.

```
k4arecorder.exe output.mkv
```

Example 2. Recording WFOV non-binned (1MP), RGB 3072p at 15fps without IMU

```
k4arecorder.exe -d WFOV_UNBINNED -c 3072p -r 15 -l 10 --imu OFF output.mkv
```

Example 3. Record WFOV 2x2 binned 30fps 5 seconds to output.mkv file

```
k4arecorder.exe -d WFOV_2X2BINNED -c OFF --imu OFF -l 5 output.mkv
```

Note that options are case sensitive.

>[!TIP]
>You can use [Azure Kinect Viewer](k4a-viewer.md) to configure RGB camera controls before recording (for parameters that are persisted on device firmware)


## Verifying recording

The output mkv file should be playable in most media players, including Windows Movies & TV app.

By default, only the first track will be displayed (usually color, unless the recording is depth-only).
In order to view the depth track, players such as [Media Player Classic](https://mpc-hc.org/) or [VLC](https://www.videolan.org/)
support viewing alternate video tracks. in VLC player you can select alternative video track under video->video track options. Depth images are expected to look very green.

To extract tracks or view file info, tools such as `mkvinfo` are available as part of the [MKVToolNix](https://mkvtoolnix.download/) toolkit.

For any issues with recording, check [troubleshooting](troubleshooting.md)

## Next steps
* Develop your first application
