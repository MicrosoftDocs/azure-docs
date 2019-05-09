---
title: Record sensor streams to a file
description: Instructions to use recording tool
author: jawirth
ms.author: jawirth, joylital
ms.date: 3/5/2019
ms.topic: quickstart
keywords: kinect, record, playback, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio, sensor
---

# Quickstart: Record Sensor Streams to a File

This page provides information about how you can use the `k4arecorder` command prompt to record data streams from the Sensor SDK to a file.

## Prerequisites

This quick start assumes:

* You have the Azure Kinect DK connected to your host PC and powered properly.
* You have completed the [Setup](set-up-hardware.md) process.

## Create a recording

1. Open a command prompt, and navigate to the recorder location or path, such as ```C:\Program Files\Azure Kinect SDK\tools\amd64\release\k4arecorder.exe```.
2. Record 5 seconds using these default settings (*Depth NFOV unbinned and RGB 1080p at 30fps with IMU*).

    `k4arecorder.exe -l 5 %TEMP%\output.mkv`

3. For a complete overview of recording options and tips, refer to [Azure Kinect Recorder](k4arecorder.md).

## Playback a recording

You can use the [Azure Kinect Viewer](k4a-viewer.md) to playback a recording.

1. Launch [Azure Kinect Viewer](k4a-viewer.md).
2. Unfold the **Open Recording** tab and open your recording.

## See also

* [Azure Kinect Recorder](k4arecorder.md)
* [Azure Kinect Viewer](k4a-viewer.md)
* [SDK Playback and Record](sdk-record-playback.md)
