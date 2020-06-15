---
title: Limitations
description: Code limitations for SDK features
author: erscorms
ms.author: erscor
ms.date: 02/11/2020
ms.topic: reference
---

# Limitations

A number of features have size, count, or other limitations.

## Azure Frontend

* Total AzureFrontend instances per process: 16.
* Total AzureSession instances per AzureFrontend: 16.

## Objects

* Total allowable objects of a single type (Entity, CutPlaneComponent, etc.): 16,777,215.
* Total allowable active cut planes: 8.

## Materials

* Total allowable materials in an asset: 65,535.

## Overall number of polygons

The allowable number of polygons for all loaded models depends on the size of the VM as passed to [the session management REST API](../how-tos/session-rest-api.md#create-a-session):

| VM size | Maximum number of polygons |
|:--------|:------------------|
|standard| 20 million |
|premium| no limit |


## Platform limitations

**Windows 10 desktop**

* UWP/x86 is the only supported UWP platform. UWP/x64 is not supported.
* Win32/x64 is the only supported Win32 platform. Win32/x86 is not supported.

**Hololens 2**

* The [render from PV camera](https://docs.microsoft.com/windows/mixed-reality/mixed-reality-capture-for-developers#render-from-the-pv-camera-opt-in) feature is not supported.
