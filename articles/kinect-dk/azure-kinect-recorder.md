---
title: Azure Kinect DK recorder
description: Understand how to record data streams from the sensor SDK to a file using the Azure Kinect recorder.
author: tesych
ms.author: tesych
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: conceptual
keywords: kinect, record, playback, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio
---

# Azure Kinect DK recorder

This article covers how you can use the `k4arecorder` command-line utility to record data streams from the sensor SDK to a file.

>[!NOTE]
>Azure Kinect recorder doesn't record audio.

## Recorder options

The `k4arecorder` has various command-line arguments to specify the output file and recording modes.

Recordings are stored in the [Matroska .mkv format](record-file-format.md). The recording uses multiple video tracks for color and depth, and also additional information such as camera calibration and metadata.

```console
k4arecorder [options] output.mkv

 Options:
  -h, --help              Prints this help
  --list                  List the currently connected K4A devices
  --device                Specify the device index to use (default: 0)
  -l, --record-length     Limit the recording to N seconds (default: infinite)
  -c, --color-mode        Set the color sensor mode (default: 1080p), Available options:
                            3072p, 2160p, 1536p, 1440p, 1080p, 720p, 720p_NV12, 720p_YUY2, OFF
  -d, --depth-mode        Set the depth sensor mode (default: NFOV_UNBINNED), Available options:
                            NFOV_2X2BINNED, NFOV_UNBINNED, WFOV_2X2BINNED, WFOV_UNBINNED, PASSIVE_IR, OFF
  --depth-delay           Set the time offset between color and depth frames in microseconds (default: 0)
                            A negative value means depth frames will arrive before color frames.
                            The delay must be less than 1 frame period.
  -r, --rate              Set the camera frame rate in Frames per Second
                            Default is the maximum rate supported by the camera modes.
                            Available options: 30, 15, 5
  --imu                   Set the IMU recording mode (ON, OFF, default: ON)
  --external-sync         Set the external sync mode (Master, Subordinate, Standalone default: Standalone)
  --sync-delay            Set the external sync delay off the master camera in microseconds (default: 0)
                            This setting is only valid if the camera is in Subordinate mode.
  -e, --exposure-control  Set manual exposure value (-11 to 1) for the RGB camera (default: auto exposure)
```

## Record files

Example 1. Record Depth NFOV unbinned (640x576) mode, RGB 1080p at 30 fps with IMU.
Press the **CTRL-C** keys to stop recording.

```
k4arecorder.exe output.mkv
```

Example 2. Record WFOV non-binned (1MP), RGB 3072p at 15 fps without IMU, for 10 seconds.

```
k4arecorder.exe -d WFOV_UNBINNED -c 3072p -r 15 -l 10 --imu OFF output.mkv
```

Example 3. Record WFOV 2x2 binned at 30 fps for 5 seconds, and save to output.mkv.

```
k4arecorder.exe -d WFOV_2X2BINNED -c OFF --imu OFF -l 5 output.mkv
```

>[!TIP]
>You can use [Azure Kinect Viewer](azure-kinect-viewer.md) to configure RGB camera controls before recording (e.g. to set manual white balance).

## Verify recording

You can open the output .mkv file with [Azure Kinect Viewer](azure-kinect-viewer.md).

To extract tracks or view file info, tools such as `mkvinfo` are available as part of the [MKVToolNix](https://mkvtoolnix.download/) toolkit.

## Next steps

[Using recorder with external synchronized units](record-external-synchronized-units.md)