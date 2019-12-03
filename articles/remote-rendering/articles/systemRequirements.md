---
title: system requirements
description: System requirements for ARR.
author: FlorianBorn71
manager: jlyons
services: RemoteRendering
ms.author: flborn
ms.date: 12/03/2019
ms.topic: overview
ms.service: RemoteRendering
---

# System Requirements

## Development PC

* Windows 10, version 1903 or newer
* Newest graphics drivers (Windows update doesn't always deliver the newest drivers, check your GPU manufacturers website for up to date drivers)
* For local preview of remotely rendered content (e.g. in Unity or Unreal) or ARRT usage your GPU needs to support H265 hardware video decode.

| GPU manufacturer | Supported models |
|-----------|:-----------:|
| nVidia | Check https://developer.nvidia.com/video-encode-decode-gpu-support-matrix - your GPU needs a YES in the H.265 4:2:0 8 bit column in the NVDEC matrix |
| AMD | Cards with at least version 6 of their Unified Video Decoder, see https://en.wikipedia.org/wiki/Unified_Video_Decoder#UVD_6 |
| Intel | Skylake and newer CPUs |

## Supported runtime devices

Azure Remote Rendering currently only supports HoloLens 2 as a target device for the runtime. Other targets are planned for the future but are currently not available.

When using HoloLens 2 we recommend to check that your device has the newest HEVC codec installed as this improves remote rendering latency significantly. To check the version of your installed HEVC codec you can follow these steps:

1. On the HoloLens, start the Microsoft Store.
2. Click the "..." button in the top Right
3. Select **Downloads and Updates**
4. In the list, look for **HEVC Video Extensions from Device Manufacturer**
	* If it says **1.0.13209.0**, you have the old codec with the bug.  Follow step 5 to update
    * If it says **1.0.21821.0**, you have the new fixed codec.  No action necessary
5. To get the update, click the **Get Updates** button and wait for it to install.
