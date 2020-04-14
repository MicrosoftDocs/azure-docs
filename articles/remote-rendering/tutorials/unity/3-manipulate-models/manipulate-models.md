---
title: Manipulating Models
description: Manipulate remotely rendered models by moving, rotating scaling and more
author: michael-house
ms.author: v-mihous
ms.date: 04/09/2020
ms.topic: tutorial
---

# Tutorial: Manipulating Models

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Add MRTK to the project.
> * Add visual and manipulation bounds around remotely rendered models.
> * Move, Rotate and Scale.
> * Raycast with spatial queries.
> * Simple animations for remotely rendered objects

## Prerequisites

* This tutorial builds on top of [Tutorial: Refining Materials, Lighting, and Effects](..\4-materials-lighting-effects\materials-lighting-effects.md).

## Getting Started with MRTK

The Mixed Reality Toolkit (MRTK) is a cross-platform toolkit for building Mixed Reality experiences for Virtual Reality (VR) and Augmented Reality (AR). We'll utilize MRTK for it's input and interaction scripts.

To add MRTK, follow the steps defined in [Getting started with MRTK](https://microsoft.github.io/MixedRealityToolkit-Unity/Documentation/GettingStartedWithTheMRTK.html), specifically the [Required steps](https://microsoft.github.io/MixedRealityToolkit-Unity/Documentation/GettingStartedWithTheMRTK.html#required).

## Include the View Controller used by this tutorial

This tutorial provides a few scripts, assets and Unity prefabs to get you started with interactive objects. These are bundled into a [Unity Asset Package](https://docs.unity3d.com/Manual/AssetPackages.html), which can be downloaded [here](todo\path\to\asset-package)

1. Download the package [here](todo\path\to\asset-package)
1. In your Unity project, choose **Assets** > **Import Package** > **Custom Package**.
1. In the file explorer, select the asset package you downloaded in step 1.
1. Select the **Import** button to import the contents of the package into your project.

## Getting remote object bounds and adding a local bounding box

## Move, rotate, and scale  

## Introduce need to sync server & client

## Ray cast / spatial queries

## Synchronizing and filtering the remote object graph into the Unity hierarchy

## Animating remote content

## Next steps

You can manipulate and interact with your remotely rendered models. In the next tutorial we'll cover modifying materials, altering the lighting and applying certain effects to remotely rendered models.

> [!div class="nextstepaction"]
> [Next: Manipulating models](../3-manipulate-models/manipulate-models.md)