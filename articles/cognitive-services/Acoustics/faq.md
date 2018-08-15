---
title: Frequently Asked Questions about Acoustics | Microsoft Docs
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
# Acoustics Frequently Asked Questions

## What is Project Acoustics?
The Unity plugin provided with Project Acoustics is an acoustics system based on pre-bakes of scenes, akin to static lighting. Azure does the heavy lifting of wave physics at design time, so runtime CPU cost is low.

## Is Azure used at runtime?
No, cloud integration is used only during the precompute stage at design time.
 
## What is the input? How does it work? 
The input is your 3D scene. It performs thousands of 3D volumetric wave simulations that model physics closely, like smooth occlusion and scattering.
 
## What is the runtime cost?
Acoustics takes about 0.01% of CPU per source per frame. RAM usage depends on scene size and can range from 10 to 100 MB.
 
## Do I need to simplify the level geometry? Control triangle count? Make meshes watertight?
No. The system will ingest detailed level geometry directly. It will be voxelized for internal processing.
 
## What's in the data?
The ACE file is a table of possible acoustics between a numerous possible source locations for thousands of possible player "probe" locations.
 
## Can it handle moving sources?
Yes, the spatializer plugin consults the lookup table on each frame with the updated source and listener locations. The spatializer's DSP smoothly updates the acoustic processing parameters on each frame.
 
## Can it handle dynamic geometry? Closing doors? Walls blown away?
No. It is precomputed. We suggest leaving door geometry out of acoustics, and then apply additional occlusion from doors based on game logic.
 
## Does it handle materials?
Yes. Materials are picked from the physical material names in your level driving absorptivity.
 
## What do the "probes" represent?
These sample possible player locations. For each probe, there is volumetric 3D data for possible source locations.
 
## Why spend so much compute in the cloud? What does it buy me?
Accurate and reliable results on complex scenes. Smooth occlusion/obstruction without manual work. Dynamic reverb variation without drawing volumes. While still remaining light on CPU during runtime. 

## What exactly happens during "baking"?
The system considers potential player locations to generate a set of uniformly spaced “probe” sample positions. A job for a level consists of independent tasks for probe: The system considers a cylindrical “Simulation Region” centered at the probe and does a detailed wave simulation within that region at 25cm resolution. Each simulation takes about 15mins, for a region of radius 45 meter and 10-20 meters total height. Intuitively, only geometry in the simulation region around the player causes occlusion/reverb.

To use Microsoft Acoustics on Android, change your build target to Android. Some versions of Unity have a bug with deploying audio plugins -- make sure you are not using a version affected by [this bug](https://issuetracker.unity3d.com/issues/android-ios-audiosource-playing-through-google-resonance-audio-sdk-with-spatializer-enabled-does-not-play-on-built-player).

## I get an error that 'could not find metadata file System.Security.dll'
Ensure the Scripting Runtime Version in Player settings is set to '.NET 4.x Equivalent', and restart Unity.

## I'm having authentication problems when connecting to Azure
Double-check you've used the correct credentials for your Azure account, that your account supports the type of node requested in the bake, and that your system clock is accurate.