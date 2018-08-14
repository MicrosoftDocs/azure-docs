---
title: Design Process Overview for Acoustics | Microsoft Docs
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

# Design Process Overview
## Why acoustics?
Humans use audio-visual cues to understand the world around them. In virtual worlds, combining spatial audio with acoustics increases user immersion. The acoustics tool described here analyzes virtual worlds to create a realistic acoustic simulation, and supports a post-simulation design process. The analysis includes both the geometry and the materials for each surface in the world. The simulation includes parameters such as arrival direction (portaling), reverb power and decay times, and occlusion and obstruction effects.

## How does this approach to acoustics work?
The system relies on an offline compute of the virtual world, allowing it to perform a more complex simulation than if the analysis was done in real-time. The offline compute produces a lookup table of acoustical parameters. The query result is processed through designer-specified rules before being applied to the audio engine at run-time. Tweaking these rules can achieve hyper-realistic effects for high emotional intensity or hypo-realistic scenes for more background audio sounds.

## What is the workflow like?
The acoustics system relies on a large offline compute. Compute is hosted in Azure and requires an Azure Batch subscription. The workflow is broken up into three parts: [Design](#design), [Bake](#bake), and [Runtime](#runtime).

### Design
First mark up the scene with materials properties and a player navigation mesh. Then the Unity editor extension places simulation probe points throughout the player region, and your scene is packaged as a voxel map, probe points, and materials properties, and sent to Azure. 
![Design View](media/TritonDebugView.png)  

### Bake
The scene data file is uploaded to Azure and the analysis runs on a compute cluster. Depending on scene complexity and simulation parameter configuration, these bakes can take anywhere from a few minutes to many hours.

### Post-Bake Design
Once the bake has completed, a file is downloaded to your project, known as an ACE file. This is the lookup table that is used at runtime to drive the acoustic parameters for each sound source. If something doesn't sound quite right, you can either go back and redesign the origin of the acoustics simulation by changing scene materials and other simulation parameters, or you can tweak individual acoustic parameters without needing to do another bake.

### Runtime
After bake completion, the simulation results are downloaded into your scene as a lookup table. This table is used at runtime to drive the acoustic parameters for each sound source.