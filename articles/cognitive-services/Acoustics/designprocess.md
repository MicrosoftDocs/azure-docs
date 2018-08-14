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
The design process is in three parts: pre-bake design, sound source placement, and post-bake design.

## Pre-bake design
The pre-bake design process produces the scene and metadata that are used for the sound wave simulation. This includes selecting which scene elements will participate in the simulation so that they provide occlusions, reflections, and reverberation. It also includes selecting the materials properties of these scene elements. The materials properties control the amount of absorbed and reflected sound energy from each surface.

The default absorption coefficient for all surfaces is 0.02, which is highly reflective. The designer can achieve aesthetic and gameplay effects by tuning the absorption coefficients of different materials throughout the scene, which are especially prominent to listeners when they hear the transitions For example, transitioning from a dark reverberant room into a bright, non-reverberant outdoor scene can enhance the impact of the transition. This can be achieved by tuning the absorption coefficients on the outdoor scene materials higher.

Using the UI for pre-bake design is described in detail in [bake UI walk through](bakeuiwalkthrough.md).

## Sound source placement
Viewing voxels and probe points at runtime can help debug issues with sound sources being stuck inside the voxelized geometry. To toggle the voxel grid and probe points display, click the corresponding checkbox in the Gizmos menu.  

![Gizmos Menu](media/GizmosMenu.png)  

The voxel display can help determine if visual components in the game have a transform applied to them. If so, apply the same transform to the GameObject hosting the Acoustics Manager.

## Post-bake design
The bake results are stored as occlusion and reverberation parameters for source-listener location pairs throughout the scene. This physically-accurate result can be useful in some cases and is a good quickstart for acoustics in your title, and is also a good starting point for design. Post-bake design involves specifying rules for transforming the bake result parameters at runtime on a scene-level and per-source level.

### Distance-based attenuation
The acoustics spatializer plugin respects the per-source distance-based attenuation built into the Unity Editor. 

### Tuning scene parameters
To adjust parameters for all sources, click on the channel strip in the Audio Mixer, and adjust the parameters on the Microsoft Acoustics Mixer effect.

![Mixer Customization](media/MixerParameters.png)  

### Tuning source parameters
To adjust parameters for a single source, attach the AcousticsSourceCustomization script to the Audio Sources that need tuning. The script has three parameters 

![Source Customization](media/SourceCustomization.png)

* **Reverb Power Adjust** - This value adjusts the reverb power, in dB. Positive values make a sound more reverberant, negative values make a sound more dry.
* **Decay Time Scale** - This value adjusts the decay time in a multiplicative fashion. For example, if the acoustics table query results in a decay time of 750 milliseconds, but this value is set to 1.5, the resulting decay time is 1.125 seconds.
* **Enable Acoustics** - This checkbox controls whether this sound source uses the results of the acoustics table query or not. When checked, acoustic parameters from the lookup table will be applied. When unchecked, the source will still be spatialized, without acoustics. The result is through-the-wall directionality, with no obstruction/occlusion effects, and no dynamic change in reverb.  
