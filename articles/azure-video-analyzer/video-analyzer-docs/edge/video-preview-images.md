---
title: Enable video preview images
description: This article explains how to enable video preview images when recording to a video sink using Azure Video Analyzer
ms.topic: how-to
ms.date: 11/01/2021

---

# Enable video preview images while recording video

While video is ingested and recording to a video sink node, a set of video preview images of different sizes can be periodically uploaded to an Azure Video Analyzer account's associated storage account.
These images will be a set of one frame resized to 3 different resolutions:

  * 320 x 180 = small
  * 640 x 360 = medium
  * 1280 x 720 = large

These preview images are generated using Preservce Aspect Ratio mode meaning  
Images are only generated and updated while a live pipeline is active and video is being recorded.
If an event-based video recording pipeline is being used, the images will only be generated when there is an event that has triggered recording.

