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

## What is this?
A pre-baked acoustics system, akin to static lighting. Azure does heavy lifting of wave physics, so runtime CPU is light.
 
## What is the input? How does it work? 
The input is your 3D scene. It performs thousands of 3D volumetric wave simulations that model physics closely, like smooth occlusion and scattering.
 
## Runtime Cost?
Acoustics takes a 100microseconds of CPU per call. RAM usage is about 100MB on a scene of dimensions XxYxZ meters.
 
## Do I need to simplify the level geometry? Control triangle count? Make meshes watertight?
No. The system will ingest detailed level geometry directly. It will be voxelized for internal processing.
 
## What's in the data?
The ACE file is massive table of possible acoustics between a numerous possible source locations for thousands of possible player "probe" locations.
 
## Can it handle dynamic sources?
Yes.
 
## Can it handle dynamic geometry? Closing doors? Walls blown away?
No. It is precomputed. We suggest leaving door geometry out of acoustics, and then apply additional occlusion from doors based on game logic.
 
## Does it handle materials?
Yes. Materials are picked from the physical material names in your level driving absorptivity.
 
## Why is the voxel data kept around at runtime? 
<TODO: Expand> Wall aware interpolation
 
## What do the "probes" represent?
These sample possible player locations. For each probe, there is volumetric 3D data for possible source locations.
 
## Why spend so much compute in the cloud? What does it buy me?
Accurate and reliable results on complex scenes. Smooth occlusion/obstruction without manual work. Dynamic reverb variation without drawing volumes. While still remaining light on CPU during runtime. 
 
## In our game, we sometimes dynamically change the position/orientation of a level when it's loaded.  Can it be handled. How?
 <TODO Explain>

## What exactly happens during "baking"?
The system considers potential player locations to generate a set of uniformly spaced “probe” sample positions. A job for a level consists of independent tasks for probe: The system considers a cylindrical “Simulation Region” centered at the probe and does a detailed wave simulation within that region at 25cm resolution. Each simulation takes about 15mins, for a region of radius 45 meter and 10-20 meters total height. Intuitively, only geometry in the simulation region around the player causes occlusion/reverb.
