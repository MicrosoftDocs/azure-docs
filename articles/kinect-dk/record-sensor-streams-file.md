---
title: Quickstart- Record Azure Kinect sensor streams to a file
description: Quickstart how to record data streams from the Sensor SDK to a file
author: tesych
ms.author: tesych
ms.prod: kinect-dk
ms.date: 06/05/2019
ms.topic: quickstart
keywords: azure, kinect, record, play back, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio, sensor

#Customer intent: As an Azure Kinect DK developer, I want to record Azure Kinect sensor streams to a file.

---

# Quickstart: Record sensor streams to file

This quickstart provides information about how you can use the `k4arecorder` command prompt tool to record data streams from the Sensor SDK to a file.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This quickstart assumes:

- You have the Azure Kinect DK connected to your host PC and powered properly.
- You have finished [setting up](set-up-azure-kinect-dk.md) the hardware.

## Create recording

1. Open a command prompt, and provide the path to `k4arecorder.exe`. For example: `C:\Program Files\Azure Kinect SDK vX.Y.Z\tools\k4arecorder.exe`, where `X.Y.Z` is the installed version of the SDK.
2. Record 5 seconds.

    `k4arecorder.exe -l 5 %TEMP%\output.mkv`

3. The recorder uses the following default settings *Depth NFOV unbinned and RGB 1080p at 30 fps with IMU*. For a complete overview of recording options and tips, refer to [Azure Kinect recorder](azure-kinect-dk-recorder.md).

## Play back recording

You can use the [Azure Kinect viewer](azure-kinect-sensor-viewer.md) to play back a recording.

1. Launch [`k4aviewer.exe`](azure-kinect-sensor-viewer.md)
2. Unfold the **Open Recording** tab and open your recording.

## Next steps

You may also review the following articles:

> [!div class="nextstepaction"]
>[Azure Kinect recorder](azure-kinect-dk-recorder.md)

> [!div class="nextstepaction"]
>[Azure Kinect viewer](azure-kinect-sensor-viewer.md)

> [!div class="nextstepaction"]
>[Azure Kinect SDK record playback](record-playback-api.md)
