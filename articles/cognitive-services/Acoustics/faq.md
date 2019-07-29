---
title: Project Acoustics Frequently Asked Questions
titlesuffix: Azure Cognitive Services
description: This page provides answers to questions asked frequently about Project Acoustics, including download instructions and bake process.
services: cognitive-services
author: kegodin
manager: nitinme

ms.service: cognitive-services
ms.subservice: acoustics
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: kegodin
---
# Project Acoustics Frequently Asked Questions

## What is Project Acoustics?

The Project Acoustics suite of plugins is an acoustics system that calculates sound wave behavior prior to runtime, akin to static lighting. The cloud does the heavy lifting of wave physics computations, so runtime CPU cost is low.  

## Where can I download the plugin?

You can download the [Project Acoustics Unity plugin](https://www.microsoft.com/download/details.aspx?id=57346) or the [Project Acoustics Unreal plugin](https://www.microsoft.com/download/details.aspx?id=58090).

## Does Project Acoustics support &lt;x&gt; platform?

Project Acoustics platform support evolves based on customer needs. Please contact us on the [Project Acoustics issue forum](https://github.com/microsoft/ProjectAcoustics/issues) to inquire about support for additional platforms.

## Is Azure used at runtime?

No, cloud integration is used only during the precompute stage as part of the scene setup.
 
## What is simulation input? 

The simulation input is your 3D scene, virtual environment or game level. Project Acoustics performs 3D volumetric wave simulations that model the physics of sound closely, including smooth occlusion and scattering.
 
## What is the runtime cost?

Acoustics takes about 0.01% of CPU per source per frame. RAM usage depends on scene size and can range from 10 to 100 MB.
 
## Do I need to simplify the level geometry? Control triangle count? Make meshes watertight?

No. The system will ingest detailed level geometry directly. It will be voxelized for internal processing.
 
## What's in the runtime lookup table?

The ACE file includes is a table of acoustic parameters between numerous source and listener location pairs, as well as voxelized scene geometry used for parameter interpolation.
 
## Can Project Acoustics handle moving sources?

Yes, Project Acoustics consults the lookup table and updates the audio DSP on each tick, so it can handle moving sources and listener.
 
## Can Project Acoustics handle dynamic geometry? Closing doors? Walls blown away?

No. The acoustic parameters are precomputed based on the static state of a game level. We suggest leaving door geometry out of acoustics, and then applying additional occlusion based on the state of destructible and movable game objects using established techniques.
 
## Does Project Acoustics use acoustic materials?

Yes. Materials are picked from the physical material names in your level, driving absorptivity.
 
## What do the "probes" represent?

Probes are a sampling of possible player locations. Each probe represents a separate wave simulation of the scene originating at the probe location. At runtime, acoustic parameters for the listener location are interpolated from nearby probe locations.
 
## Why spend so much compute in the cloud? What does it buy me?

Project Acoustics provides accurate and reliable acoustic parameters even for ultra-complex virtual environments, taking every architectural aspect into account. It provides smooth occlusion and obstruction and dynamic reverb variation without the manual work of drawing volumes. All while remaining light on CPU during runtime.

## What exactly happens during "baking"?

A bake consists of acoustic wave simulations of cuboid simulation regions centered at each listener probe.

## Next steps
* Try the [Project Acoustics Unity sample content](unity-quickstart.md) or [Unreal sample content](unreal-quickstart.md)

