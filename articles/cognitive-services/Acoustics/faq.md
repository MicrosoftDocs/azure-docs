---
title: Frequently Asked Questions about Project Acoustics
titlesuffix: Azure Cognitive Services
description: This page provides answers to questions asked frequently about Project Acoustics, including download instructions and bake process.
services: cognitive-services
author: kegodin
manager: cgronlun

ms.service: cognitive-services
ms.component: acoustics
ms.topic: conceptual
ms.date: 08/17/2018
ms.author: kegodin
---
# Frequently asked questions

## What is Project Acoustics?

The Project Acoustics Unity plugin is an acoustics system that calculates sound wave behavior prior to runtime, akin to static lighting. The cloud does the heavy lifting of wave physics computations, so runtime CPU cost is low.  

## Where can I download the plugin?

If you're interested in evaluating the acoustics plugin, register [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRwMoAEhDCLJNqtVIPwQN6rpUOFRZREJRR0NIQllDOTQ1U0JMNVc4OFNFSy4u) to join the Designer Preview.

## Is Azure used at runtime?

No, cloud integration is used only during the precompute stage as part of the scene setup.
 
## What is simulation input? 

The simulation input is your 3D scene, virtual environment or game level. Project Acoustics performs 3D volumetric wave simulations that model the physics of sound closely, including smooth occlusion and scattering.
 
## What is the runtime cost?

Acoustics takes about 0.01% of CPU per source per frame. RAM usage depends on scene size and can range from 10 to 100 MB.
 
## Do I need to simplify the level geometry? Control triangle count? Make meshes watertight?

No. The system will ingest detailed level geometry directly. It will be voxelized for internal processing.
 
## What's in the runtime lookup table?

The ACE file is a table of acoustic parameters between numerous source and listener location pairs.
 
## Can it handle moving sources?

Yes, the **Microsoft Acoustics** Unity spatializer plugin consults the lookup table on each audio processing tick with the current source and listener locations. The spatializer's DSP smoothly updates the acoustic processing parameters on each tick.
 
## Can it handle dynamic geometry? Closing doors? Walls blown away?

No. The acoustic parameters are precomputed based on the static state of a game level. We suggest leaving door geometry out of acoustics, and then apply additional occlusion based on the state of destructible and movable game objects using established techniques.
 
## Does it handle materials?

Yes. Materials are picked from the physical material names in your level, driving absorptivity.
 
## What do the "probes" represent?

Probes are a sampling of possible player locations. Each probe represents a separate wave simulation of the scene originating at the probe location. At runtime, acoustic parameters for the listener location are interpolated from nearby probe locations.
 
## Why spend so much compute in the cloud? What does it buy me?

Project Acoustics provides accurate and reliable acoustic parameters even for ultra-complex virtual environments, taking every architectural aspect into account. It provides smooth occlusion/obstruction without all the manual work and dynamic reverb variation without drawing volumes. All while remaining light on CPU during runtime.

## What exactly happens during "baking"?

The system considers potential player locations to generate a set of uniformly spaced "probe" sample positions. A bake for a level consists of independent tasks for each probe: The system considers a cuboid "Simulation Region" centered at the probe and does a detailed wave simulation within that region at up to 25 cm resolution.

## Next Steps
* Explore the [sample scene](sample-walkthrough.md)

