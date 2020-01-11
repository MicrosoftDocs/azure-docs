---
title: Project Acoustics plug-in known issues
titlesuffix: Azure Cognitive Services
description: You might experience the following known issues in Project Acoustics.
services: cognitive-services
author: NoelCross
manager: nitinme

ms.service: cognitive-services
ms.subservice: acoustics
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: noelc
ROBOTS: NOINDEX
---
# Project Acoustics known issues
This article describes issues that you might experience when you use Project Acoustics.

## Acoustic parameters are lost when you rename a scene

If you rename a scene, all the acoustic parameters that belong to that scene don't automatically transfer to the new scene. But they do still exist in the old asset file. Look for the *[SceneName]_AcousticParameters.asset* file in the *Editor* directory next to your scene file. Rename the file to reflect the new scene name.

## Deploy-to-Android bug from some Unity versions

Some versions of Unity have a [bug](https://issuetracker.unity3d.com/issues/android-ios-audiosource-playing-through-google-resonance-audio-sdk-with-spatializer-enabled-does-not-play-on-built-player) in how they deploy audio plug-ins to Android. Make sure that you aren't using a version that's affected by this bug.

## "Could not find metadata file System.Security.dll" error

Make sure that the **Scripting Runtime Version** in the **Player** settings is *.NET 4.x Equivalent*, and restart Unity.

## Authentication problems when connecting to Azure

Check that:
- You used the correct credentials for your Azure account.
- Your account supports the type of node that you requested in the bake.
- Your system clock is set correctly.

## The Bake tab still shows "deleting" after you cancel
Project Acoustics cleans up all Azure resources for a job after successful completion or cancellation. This process can take up to 5 minutes.

## Next steps
* Try the [Unity](unity-quickstart.md) or [Unreal](unreal-quickstart.md) sample content.
