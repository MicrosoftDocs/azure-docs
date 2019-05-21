---
title: Record Azure Kinect sensor streams to a file
description: Quickstart instructions how to use Azure Kinect recording tool
author: joylital
ms.author: jawirth, joylital
ms.prod: kinect-dk
ms.date: 06/05/2019
ms.topic: quickstart
keywords: azure, kinect, record, play back, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio, sensor
---

# Quickstart: Record sensor streams to file

This page provides information about how you can use the `k4arecorder` command prompt to record data streams from the Sensor SDK to a file.

## Prerequisites

This quickstart assumes:

* You have the Azure Kinect DK connected to your host PC and powered properly.
* You have finished [setting up](set-up-azure-kinect-dk.md) the hardware.

## Create recording

1. Open a command prompt, and navigate to the recorder location or path, such as `C:\Program Files\Azure Kinect SDK\tools\amd64\release\k4arecorder.exe`.
2. Record 5 seconds using these default settings (*Depth NFOV unbinned and RGB 1080p at 30 fps with IMU*).

    `k4arecorder.exe -l 5 %TEMP%\output.mkv`

3. For a complete overview of recording options and tips, refer to [Azure Kinect recorder](azure-kinect-dk-recorder.md).

## Play back recording

You can use the k4a-viewer to play back a recording.

1. Launch k4a-viewer
2. Unfold the **Open Recording** tab and open your recording.

## Next steps

You may also review the following:
> [!div class="nextstepaction"]
>[Azure Kinect recorder](azure-kinect-dk-recorder.md)
>[Azure Kinect viewer](azure-kinect-sensor-viewer.md)
>[Azure Kinect SDK record playback](record-playback-api.md)