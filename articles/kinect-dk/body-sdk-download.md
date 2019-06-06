---
title: Azure Kinect Body Tracking SDK download
description: Download links for the Body Tracking SDK
author: qm13
ms.author: quentinm
ms.prod: kinect-dk
ms.date: 06/06/2019
ms.topic: conceptual
keywords: azure, kinect, sdk, download update, latest, available, install, body, tracking
---

# Download Azure Kinect Body Tracking SDK

This document provides links to install each version of the Azure Kinect Body Tracking SDK. 

## Azure Kinect Body Tracking SDK contents

* Headers and libraries to build a body tracking application using the Azure Kinect DK.
* Redistributable DLLs needed by body tracking applications using the Azure Kinect DK.
* Sample body tracking applications.

## Windows download links

Version       | Download
--------------|----------
0.3.0 | [msi](https://microsoft.sharepoint.com/:u:/t/EdenUsers/Ed9Wm2hMZJNAqf-3TmKBa0gBULGbQLbQs_cZdKPy4lmFCQ?e=d9bbKo)

> [!NOTE]
> When installing the SDK, remember the path you install to. For example, "C:\Program Files\Azure Kinect Body Tracking SDK 0.3.0". You will find the samples referenced in articles in this path.

## Change log

Make sure you install the latest version referenced in the change log.

### v0.3.0
* [Breaking Change] Added support for NVIDIA RTX GPUs by replacing the CUDA 9.1 dependency with CUDA 10.1 
* [Bug Fix] Provide the joint output in millimeters to be consistent with the Kinect for Windows v2 SDK. 
* Further improve the body tracking algorithm accuracy and reliability

## Next steps

> [!div class="nextstepaction"]
>[Azure Kinect DK overview](what-is-azure-kinect-dk.md)

> [!div class="nextstepaction"]
>[Set up Azure Kinect DK](set-up-azure-kinect-dk.md)

> [!div class="nextstepaction"]
>[Set up Azure Kinect body tracking](body-sdk-setup.md)