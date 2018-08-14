---
title: Introduction to acoustics | Microsoft Docs
description: Use advanced acoustics and spatialization in your Unity title
services: cognitive-services
author: kegodin
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: overview
ms.date: 08/20/2018
ms.author: kegodin
---

# What is acoustics?
The Unity plugin developed as part of Project Acoustics provides occlusion, obstruction, reverberation, and spatialization for VR and traditional titles on Windows and Android. It provides a way to design game acoustics by layering designer intentions over a physics-based wave simulation. Experience smooth wave effects, occlusion, and portaling without drawing reverb zones or run-time ray tracing.

## Today's approach to acoustics
Let's revisit today's most common approach to acoustics. In the existing approach, you draw reverb volumes:

![Design View](media/reverbvols.png)

Then you tweak parameters for each zone:

![Design View](media/TooManyReverbParameters.png)

Finally, you engage the developer team to add ray-tracing logic to get the right occlusion/obstruction filtering throughout the scene. The resulting logic has a run-time cost, in addition to problems with smoothness around corners. Adding a path search for portaling can also be expensive and have problems with edge cases.

## Physics-based design
With our approach, you provide a static scene’s shape and materials. Because the scene is voxelized and the process doesn't use ray-tracing, it's not necessary to provide a simplified or watertight acoustics mesh. The plugin uploads the scene to Azure, where it analyzes the scene’s acoustics using wave simulations. The result is integrated into the title as a lookup table, and can be tweaked for aesthetic or gameplay effects.

This plugin and the associated Azure integration and design process helps you scale faster to large scenes, respond quickly to level-design changes, and achieve greater player immersion through more detailed designs.

![Design View](media/GearsWithVoxels.jpg)

## Next steps
* Learn more about the [design process](designprocess.md)
* Get started [integrating acoustics in your Unity title](gettingstarted.md)