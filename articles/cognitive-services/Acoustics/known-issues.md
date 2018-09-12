---
title: Known issues with acoustics plugin - Cognitive Services
description: You might encounter the following known issues when using the Designer Preview for Project Acoustics.
services: cognitive-services
author: kylestorck
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/17/2018
ms.author: kylestorck
---
# Known Issues
You might encounter the following known issues when using the Designer Preview for Project Acoustics.

## Acoustic parameters are lost when you rename a scene

If you rename a scene, all the acoustic parameters that belong to that scene will not automatically transfer to the new scene. They will still exist in the old asset file however. Look for the **SceneName_AcousticParameters.asset** file inside the **Editor** directory next to your scene file. Rename your file to reflect the new scene name.

## The default path for the AcousticsData folder in Probes tab is an absolute path

This should default to a relative path to make it easier to share projects between collaborators. As a workaround, change the path to be relative to project directory.

## Runtime voxels are a different size than design-time voxels

If you do a **Calculate** on the **Probes** tab and view the voxels, then do a bake and view voxels at runtime for the same scene, the voxels are different sizes. The voxels shown pre-bake are the voxels used in simulation. The voxels shown at runtime are used for interpolation between probe points. This may cause an inconsistency where portals will appear open at runtime that aren't actually open.

## UWP builds not working

On the latest versions of Unity (2018.2+), UWP builds are not succeeding. The run phase of the build will stall and you will get "Unity extensions are not yet initialized" errors. This is tracked by [this Unity issue](https://fogbugz.unity3d.com/default.asp?1070491_1rgf14bakv5u779d).

## Unity crashes when closing project

On the latest versions of Unity (2018.2+), there is a known bug where Unity will crash when you close your project. This is tracked by [this Unity issue](https://issuetracker.unity3d.com/issues/crash-on-assetdatabase-getassetimporterversions-when-closing-a-specific-unity-project).

## Trouble deploying to Android
To use Project Acoustics on Android, change your build target to Android. Some versions of Unity have a bug with deploying audio plugins -- make sure you are not using a version affected by [this bug](https://issuetracker.unity3d.com/issues/android-ios-audiosource-playing-through-google-resonance-audio-sdk-with-spatializer-enabled-does-not-play-on-built-player).

## I get an error that 'could not find metadata file System.Security.dll'

Ensure the Scripting Runtime Version in Player settings is set to **.NET 4.x Equivalent**, and restart Unity.

## I'm having authentication problems when connecting to Azure

Double-check you've used the correct credentials for your Azure account, that your account supports the type of node requested in the bake, and that your system clock is accurate.

## Next steps
* Get started [integrating acoustics in your Unity project](getting-started.md)

