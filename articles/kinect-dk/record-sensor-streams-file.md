---
title: Quickstart- Record Azure Kinect sensor streams to a file
description: In this quickstart, you will learn how to record data streams from the Sensor SDK to a file.
author: tesych
ms.author: tesych
ms.service: azure-kinect-developer-kit
ms.date: 06/26/2019
ms.topic: quickstart
keywords: azure, kinect, record, play back, reader, matroska, mkv, streams, depth, rgb, camera, color, imu, audio, sensor
ms.custom: mode-other
#Customer intent: As an Azure Kinect DK developer, I want to record Azure Kinect sensor streams to a file.
---

# Quickstart: Record Azure Kinect sensor streams to a file

This quickstart provides information about how you can use the [Azure Kinect recorder](azure-kinect-recorder.md) tool to record data streams from the Sensor SDK to a file.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

This quickstart assumes:

- You have the Azure Kinect DK connected to your host PC and powered properly.
- You have finished [setting up](set-up-azure-kinect-dk.md) the hardware.

## Create recording

1. Open a command prompt, and provide the path to the [Azure Kinect recorder](azure-kinect-recorder.md), located in the installed tools directory as `k4arecorder.exe`. For example: `C:\Program Files\Azure Kinect SDK\tools\k4arecorder.exe`.
2. Record 5 seconds.

    `k4arecorder.exe -l 5 %TEMP%\output.mkv`

3. By default, the recorder uses the NFOV Unbinned depth mode and outputs 1080p RGB at 30 fps including IMU data. For a complete overview of recording options and tips, refer to [Azure Kinect recorder](azure-kinect-recorder.md).

## Play back recording

You can use the [Azure Kinect Viewer](azure-kinect-viewer.md) to play back a recording.

1. Launch [`k4aviewer.exe`](azure-kinect-viewer.md)
2. Unfold the **Open Recording** tab and open your recording.

## Next steps

Now that you've learned how to record sensor streams to a file, it's time to

> [!div class="nextstepaction"]
> [Build your first Azure Kinect application](build-first-app.md)
