---
title: Manipulating models
description: Manipulate remotely rendered models by moving, rotating scaling and more
author: michael-house
ms.author: v-mihous
ms.date: 04/09/2020
ms.topic: tutorial
---

# Tutorial: Manipulating models

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Add Mixed Reality Toolkit (MRTK) to the project.
> * Add visual and manipulation bounds around remotely rendered models.
> * Move, Rotate and Scale.
> * Raycast with spatial queries.
> * Simple animations for remotely rendered objects

## Prerequisites

* This tutorial builds on top of [Tutorial: Refining materials, lighting, and effects](..\materials-lighting-effects\materials-lighting-effects.md).

## Getting Started with Mixed Reality Toolkit (MRTK)

The Mixed Reality Toolkit (MRTK) is a cross-platform toolkit for building Mixed Reality experiences for Virtual Reality (VR) and Augmented Reality (AR). We'll utilize MRTK for it's input and interaction scripts.

To add MRTK, follow the the [Required steps](https://microsoft.github.io/MixedRealityToolkit-Unity/Documentation/GettingStartedWithTheMRTK.html#required) defined in [Getting started with MRTK](https://microsoft.github.io/MixedRealityToolkit-Unity/Documentation/GettingStartedWithTheMRTK.html).

## Include the View Controller used by this tutorial

This tutorial provides a few scripts, assets and Unity prefabs to get you started with interactive objects. These are bundled into a [Unity Asset Package](https://docs.unity3d.com/Manual/AssetPackages.html), which can be downloaded \[here](todo\path\to\asset-package)

1. Download the package \[here](todo\path\to\asset-package)
1. In your Unity project, choose **Assets** > **Import Package** > **Custom Package**.
1. In the file explorer, select the asset package you downloaded in step 1.
1. Select the **Import** button to import the contents of the package into your project.

If using the Universal Render Pipeline:

5. In the Unity Editor, select **Mixed Reality Toolkit** > **Utilities** > **Upgrade MRTK Standard Shader for Lightweight Render Pipeline** from the top menu bar, and follow the prompts to upgrade the shader.

## Getting remote object bounds and adding a local bounding box

The objects bounds are useful for quick manipulation of a remote object. We can query the bounds of a remotely rendered model from the current session, using the entity object created when loading a remotely rendered model.

/## Move, rotate, and scale  

/## Introduce need to sync server & client

/## Ray cast and spatial queries of remote models

/## Synchronizing and filtering the remote object graph into the Unity hierarchy

/## Animating remote content

## Next steps

You can manipulate and interact with your remotely rendered models. In the next tutorial we'll cover modifying materials, altering the lighting and applying certain effects to remotely rendered models.

> [!div class="nextstepaction"]
> [Next: Refining materials, lighting, and effects](../materials-lighting-effects/materials-lighting-effects.md)
