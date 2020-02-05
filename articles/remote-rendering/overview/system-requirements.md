---
title: System requirements
description: Lists the system requirements for Azure Remote Rendering
author: FlorianBorn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: overview
---

# System requirements

This chapter lists the minimum system requirements to work with *Azure Remote Rendering* (ARR).

## Development PC

* Windows 10 version 1903 or higher.
* Up-to-date graphics drivers.
* Optional: H265 hardware video decoder, if you want to use local preview of remotely rendered content (for example in Unity or Unreal).

> [!IMPORTANT]
> Windows update doesn't always deliver the very latest GPU drivers, check your GPU manufacturer's website for latest drivers:
>
> * [AMD drivers](https://www.amd.com/en/support)
> * [Intel drivers](https://www.intel.com/content/www/us/en/support/detect.html)
> * [NVIDIA drivers](https://www.nvidia.com/Download/index.aspx)

The table below lists which GPUs support H265 hardware video decoding.

| GPU manufacturer | Supported models |
|-----------|:-----------|
| NVIDIA | Check the **NVDEC Support Matrix** [at the bottom of this page](https://developer.nvidia.com/video-encode-decode-gpu-support-matrix). Your GPU needs a YES in the **H.265 4:2:0 8-bit** column. |
| AMD | GPUs with at least version 6 of AMD's [Unified Video Decoder](https://en.wikipedia.org/wiki/Unified_Video_Decoder#UVD_6). |
| Intel | Skylake and newer CPUs |

## Devices

Azure Remote Rendering currently only supports **HoloLens 2** as a target device.

It's important to use the latest HEVC codec, as newer versions have significant improvements in latency. To check which version is installed on your device:

1. Start the **Microsoft Store**.
1. Click the **"..."** button in the top right.
1. Select **Downloads and Updates**.
1. Search the list for **HEVC Video Extensions from Device Manufacturer**.
1. Make sure the listed codec has at least version **1.0.21821.0**.
1. Click the **Get Updates** button and wait for it to install.

## Network

A stable, low-latency network connection is critical for a good user experience. Make sure that other devices in your network don't interfere too much while using Azure Remote Rendering. We tested remote rendering in various scenarios and made the following observations:

1. Using consumer-grade wifi and VDSL/cable connections is sufficient to run ARR.
1. Using the 5-GHz band for wifi often works better than 2.4 GHz.
1. Stay close to the wifi router, having line-of-sight is preferable.
1. Never use wifi repeaters or LAN-over-powerline forwarding.
1. Minimum bandwidth requirements are 50 Mbps downstream and 10 Mbps upstream.
1. For best hologram stability, we recommended 100 Mbps downstream and 40 Mbps upstream.

For troubleshooting network issues, check the performance statistics provided by the ARR API. In particular, *reused frames* indicate that a frame's data arrived too late to be picked up.

## Next steps

* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
