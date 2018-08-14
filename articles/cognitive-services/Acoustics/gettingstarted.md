---
title: Getting started with acoustics | Microsoft Docs
description: Use advanced acoustics and spatialization in your Unity title
services: cognitive-services
author: kegodin
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/03/2018
ms.author: kegodin
---

# Getting Started With Acoustics in Unity
This quickstart guide will show you how to integrate the plugin in your title, bake your scene, and apply the acoustics to sound sources. For this quickstart, you'll need to first create an [Azure batch account](createazureaccount.md). 

## Supported platforms for quickstart
* Unity 2018+ for bakes, using .NET 4.x scripting runtime version
* Windows 64-bit Unity Editor

## Import the plugin
Import the acoustics UnityPackage to your project. 
* In Unity, go to Assets > Import Package > Custom Package... 
![Import Package](media/ImportPackage.png)  
* Choose MicrosoftAcoustics.unitypackage

## Enable the plugin
The bake portion of the acoustics toolkit requires the .NET 4.x scripting runtime version. Package import will update your Unity player settings, then Unity will need to restart.
![Player Settings](media/PlayerSettings.png) ![.NET 4.5](media/Net45.png)

## Create a navigation mesh
Use the standard [Unity workflow](https://docs.unity3d.com/Manual/nav-BuildingNavMesh.html) to create a navigation mesh for your project.

## Mark static meshes for acoustics
Bring up the acoustics window using Window > Acoustics in Unity.
![Open Acoustics Window](media/WindowAcoustics.png)

In Unity's hierarchy window, de-select any selected items. In the acoustics Object tab click the "Acoustics Geometry" checkbox to mark all meshes and terrains in your scene as acoustics geometry.

On the Materials tab, assign the acoustic materials to materials used in your scene. The 'Default' material has absorption equivalent to concrete.

![Materials Tab](media/MaterialsTab.png)

## Preview the probes
On the Probes tab, click Calculate. When calculation is complete, you'll see floating spheres in the scene view, which denote the locations for acoustics simulation. If you get close enough to an object in the scene window, you can also see the voxelization of the scene that will be used during the bake. The green voxels should line up with the objects you marked as geometry. The probe points and voxel displays can be toggled in the Gizmos menu.

![GizmosPreview](media/BakePreviewWithGizmos.png)

## Bake the scene
In the Bake tab, enter your Azure credentials and click Bake. If you don't have an Azure Batch account, see [this walkthrough for our recommended account setup](CreateAzureAccount.md).
When the bake is finished, the data file will automatically be downloaded to your AcousticsData directory.

## Set up the spatializer plugin
In Unity, go to Edit > Project Settings > Audio, and select "Microsoft Acoustics" as the Spatializer Plugin for your project. Also make sure the DSP Buffer Size is set to Best Performance, as this changes the buffer size used in Unity's audio engine. Only the largest buffer size is currently supported.

![Project Settings](media/ProjectSettings.png)  

![Microsoft Acoustics Spatializer](media/ChooseSpatializer.png)

Open the Audio Mixer (Window > Audio Mixer). Make sure you have at least one Mixer, with one group. If you don't, Click the '+' button to the right of "Mixers". Right-click the bottom of the channel strip in the effects section, and add the "Microsoft Acoustics Mixer" effect. Note that only one Microsoft Acoustics Mixer is supported at a time.

![Audio Mixer](media/AudioMixer.png)

## Set up the acoustics lookup table
Drag and drop the Microsoft Acoustics prefab from the project panel into your scene
![Acoustics Prefab](media/AcousticsPrefab.png)

Click on the MicrosoftAcoustics Game Object and go to its inspector panel. Specify the location of your bake result (the .ACE file, in Assets/AcousticsData) by drag-and-dropping it into the Acoustics Manager script, or by clicking on the circle button next to the text box.

![Acoustics Manager](media/AcousticsManager.png)  

## Apply acoustics to sound sources
Create an audio source. Click the checkbox at the bottom of the AudioSource's inspector panel that says "Spatialize." Make sure the Spatial Blend is set to full 3D.  
![Audio Source](media/AudioSource.png)
