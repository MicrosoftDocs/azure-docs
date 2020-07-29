---
title: System requirements
description: Lists the system requirements for Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: article
---

# System requirements

> [!IMPORTANT]
> **Azure Remote Rendering** is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This chapter lists the minimum system requirements to work with *Azure Remote Rendering* (ARR).

## Development PC

* Windows 10 version 1903 or higher.
* Up-to-date graphics drivers.
* Optional: H265 hardware video decoder, if you want to use local preview of remotely rendered content (for example in Unity).

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

Even though the correct H265 codec might be installed, security properties on the codec DLLs may cause codec initialization failures. The [troubleshooting guide](../resources/troubleshoot.md#h265-codec-not-available) describes steps how to solve this problem. The DLL issue can only occur when using the service in a desktop application, for instance in Unity.

## Devices

Azure Remote Rendering currently only supports **HoloLens 2** and Windows desktop as a target device. See the [platform limitations](../reference/limits.md#platform-limitations) section.

It's important to use the latest HEVC codec, as newer versions have significant improvements in latency. To check which version is installed on your device:

1. Start the **Microsoft Store**.
1. Click the **"..."** button in the top right.
1. Select **Downloads and Updates**.
1. Search the list for **HEVC Video Extensions from Device Manufacturer**.
1. Make sure the listed codec has at least version **1.0.21821.0**.
1. Click the **Get Updates** button and wait for it to install.

## Network

A stable, low-latency network connection is critical for a good user experience.

See dedicated chapter for [network requirements](../reference/network-requirements.md).

For troubleshooting network issues, refer to the [Troubleshooting Guide](../resources/troubleshoot.md#unstable-holograms).

## Software

The following software must be installed:

* The latest version of **Visual Studio 2019** [(download)](https://visualstudio.microsoft.com/vs/older-downloads/)
* [Visual Studio tools for Mixed Reality](https://docs.microsoft.com/windows/mixed-reality/install-the-tools). Specifically, the following *Workload* installations are mandatory:
  * **Desktop development with C++**
  * **Universal Windows Platform (UWP) development**
* **Windows SDK 10.0.18362.0** [(download)](https://developer.microsoft.com/windows/downloads/windows-10-sdk)
* **GIT** [(download)](https://git-scm.com/downloads)
* Optional: To view the video stream from the server on a desktop PC, you need the **HEVC Video Extensions** [(Microsoft Store link)](https://www.microsoft.com/p/hevc-video-extensions/9nmzlz57r3t7).

## Unity

For development with Unity, install

* Unity 2019.3.1 [(download)](https://unity3d.com/get-unity/download)
* Install these modules in Unity:
  * **UWP** - Universal Windows Platform Build Support
  * **IL2CPP** - Windows Build Support (IL2CPP)

## Next steps

* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
