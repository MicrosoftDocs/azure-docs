---
title: Known issues with Project Acoustics plugin
titlesuffix: Azure Cognitive Services
description: You might encounter the following known issues when using the Designer Preview for Project Acoustics.
services: cognitive-services
author: kylestorck
manager: nitinme

ms.service: cognitive-services
ms.subservice: acoustics
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: kylesto
---
# Project Acoustics Known Issues
You might encounter the following known issues when using the Designer Preview for Project Acoustics.

## Acoustic parameters are lost when you rename a scene

If you rename a scene, all the acoustic parameters that belong to that scene won't automatically transfer to the new scene. They'll still exist in the old asset file however. Look for the **SceneName_AcousticParameters.asset** file inside the **Editor** directory next to your scene file. Rename your file to reflect the new scene name.

## Unity crashes when closing project

On the latest versions of Unity (2018.2+), there is a known bug where Unity will crash when you close your project. This is tracked by [this Unity issue](https://issuetracker.unity3d.com/issues/crash-on-assetdatabase-getassetimporterversions-when-closing-a-specific-unity-project).

## Deploying to Android from some Unity versions

Some versions of Unity have a bug with deploying audio plugins to Android. Make sure you aren't using a version affected by [this bug](https://issuetracker.unity3d.com/issues/android-ios-audiosource-playing-through-google-resonance-audio-sdk-with-spatializer-enabled-does-not-play-on-built-player).

## I get an error that 'could not find metadata file System.Security.dll'

Ensure the Scripting Runtime Version in Player settings is set to **.NET 4.x Equivalent**, and restart Unity.

## I'm having authentication problems when connecting to Azure

Double-check you've used the correct credentials for your Azure account, that your account supports the type of node requested in the bake, and that your system clock is accurate.

## Canceling a bake leaves the Bake tab in "deleting" state
Project Acoustics will clean up all Azure resources for a job on successful completion or cancellation. This can take up to 5 minutes.

## Next steps
* Try the [Unity](unity-quickstart.md) or [Unreal](unreal-quickstart.md) sample content

