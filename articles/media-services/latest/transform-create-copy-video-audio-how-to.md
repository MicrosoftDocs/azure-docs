---
title: Create a CopyVideo CopyAudio transform
description: Create a CopyVideo CopyAudio transform using Media Services API.
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/09/2022
ms.author: inhenkel
---

# Create a CopyVideo CopyAudio transform

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows how to create a `CopyVideo/CopyAudio` transform.

This transform allows you to have input video/input audio streams copied from the input asset to the output asset without any changes. This can be of value with multi bitrate encoding output where the input video and/or audio would be part of the output. It simply writes the manifest and other files needed to stream content.

## Prerequisites

Follow the steps in [Create a Media Services account](./account-create-how-to.md) to create the needed Media Services account and resource group to create an asset.

## Methods

## [REST](#tab/rest/)

### Using the REST API

[!INCLUDE [task-create-copy-video-audio-rest.md](./includes/task-create-copy-video-audio-rest.md)]

---
