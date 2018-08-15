---
title: Known Issues With Acoustics Plugin | Microsoft Docs
description: Known issues with Acoustics Plugin and Unity
services: cognitive-services
author: kylsto
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/15/2018
ms.author: kylsto
---
# Known Issues

## Acoustic Parameters are lost when you rename a scene

If you rename a scene, all the Acoustic Parameters that belong to that scene will not automatically transfer to the new scene. They will still exist in the old asset file however. Look for the "SceneName_AcousticParameters.asset" file inside the "Editor" directory next to your scene file.

## Default path for Acoustics Data Folder in Probes tab is an absolute path

This should default to a relative path to make it easier to share projects between collaborators. As a workaround, the user can manually change the path to be relative.

## Runtime voxels are a different size than design-time voxels

If you do a "Calculate" on the Probes tab and view the voxels, then do a bake and view voxels at runtime for the same scene, the voxels are very different sizes. The voxels shown pre-bake are the actual simulation voxels. The voxels shown at runtime are the "refined" voxels used for interpolation. This may cause an inconsistency where portals will appear open at runtime that aren't actually open.

## UWP builds not working

There is an issue with the latest version of Unity where UWP builds are not succeeding. The run phase of the build will stall and you will get "Unity extensions are not yet initialized" errors. This is tracked by this Unity issue 1070491.

## Unity crashes when closing project

On the latest versions of Unity (2018.2+), there is a known bug where Unity will crash when you close your project. This is tracked by this Unity issue https://issuetracker.unity3d.com/issues/crash-on-assetdatabase-getassetimporterversions-when-closing-a-specific-unity-project