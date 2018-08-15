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
The pre-bake design process produces the scene and metadata that are used for the sound wave simulation, which includes selecting which scene elements will participate in the simulation so that they provide occlusions, reflections, and reverberation. This process also includes selecting the materials properties of these scene elements. The materials properties control the amount of sound energy reflected back from each surface.

The default absorption coefficient for all surfaces is 0.02, which is highly reflective. You can achieve aesthetic and gameplay effects by tuning the absorption coefficients of different materials throughout the scene, which are especially prominent to listeners when they hear the transitions. For example, transitioning from a dark reverberant room to a bright, non-reverberant outdoor scene enhances the impact of the transition. To achieve this effect, tune the absorption coefficients on the outdoor scene materials higher.

The reverberation time of a given material in a room is inversely related to its absorption coefficient, with most materials having absorption values in the 0.01 to 0.20 range. Materials with absorption coefficients outside this range are very absorbent. 

The [bake UI walk through](bakeuiwalkthrough.md) describes the pre-bake controls in detail.

## Sound source placement
Viewing voxels and probe points at runtime can help debug issues with sound sources being stuck inside the vowelized geometry. To toggle the voxel grid and probe points display, click the corresponding checkbox in the Gizmos menu.  

![Gizmos Menu](media/GizmosMenu.png)  

The voxel display can help determine if visual components in the game have a transform applied to them. If so, apply the same transform to the GameObject hosting the Acoustics Manager.

## Post-bake design
Bake results are stored as occlusion and reverberation parameters for all source-listener location pairs throughout the scene. This physically accurate result can be great acoustics for your title as-is, and is also a great starting point for design. The post-bake design process specifies rules for transforming the bake result parameters at runtime.

### Distance-based attenuation
The acoustics spatializer plugin respects the per-source distance-based attenuation built into the Unity Editor. 

### Tuning scene parameters
To adjust parameters for all sources, click on the channel strip in the Audio Mixer, and adjust the parameters on the Microsoft Acoustics Mixer effect.

![Mixer Customization](media/MixerParameters.png)  

### Tuning source parameters
To adjust parameters for a single source, attach the AcousticsSourceCustomization script to the Audio Sources that need tuning. The script has three parameters:

![Source Customization](media/SourceCustomization.png)

* **Reverb Power Adjust** - Adjusts the reverb power, in dB. Positive values make a sound more reverberant, while negative values make a sound more dry.
* **Decay Time Scale** - Adjusts a multiplier for the decay time. For example, if the bake result specifies a decay time of 750 milliseconds, but this value is set to 1.5, the decay time applied to the source is 1,125 milliseconds.
* **Enable Acoustics** - Controls whether acoustics is applied to this source. When unchecked, the source will be spatialized but without acoustics. The result is through-the-wall directionality, with no obstruction/occlusion effects, and no dynamic change in reverb. Reverb is still applied.

Different sources may require different settings to achieve certain aesthetic or gameplay effects. Dialog is one possible example. The human ear is more attuned to reverberation in speech, while dialog often needs to be intelligible for gameplay. You can account for this without making the dialog non-diegetic by adjusting the reverb power downwards.