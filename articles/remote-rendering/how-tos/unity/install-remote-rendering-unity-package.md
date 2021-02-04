---
title: Install the Remote Rendering package for Unity
description: Explains how to install the Remote Rendering client DLLs for Unity
author: florianborn71
ms.author: flborn
ms.date: 02/26/2020
ms.topic: how-to
---

# Install the Remote Rendering package for Unity

Azure Remote Rendering uses the Mixed Reality Feature Tool to distribute packages for Unity.


## Install Remote Rendering Package using the Mixed Reality Feature Tool

[The Mixed Reality Feature Tool](https://aka.ms/MRFeatureToolDocs) ([download](https://aka.ms/mrfeaturetool)) is a tool used to integrate Mixed Reality feature packages into Unity projects. The Azure Remote Rendering package contains the entire C# API as well as all plugin binaries required to use Azure Remote Rendering with Unity.

The package is not part of the [ARR samples repository](https://github.com/Azure/azure-remote-rendering), and it is not available from Unity's internal package registry.

To add the package to a project you need to:
1. [Download the Mixed Reality Feature Tool](https://aka.ms/mrfeaturetool)
2. Follow the full instructions on how to use the tool [here](https://aka.ms/MRFeatureToolDocs)
3. On the **Discover Features** page tick the box for the **Microsoft Azure Remote Rendering** package and select the version of the package you wish to add to your project

![Mixed_Reality_feature_tool_package](media/mixed_reality_feature_tool_package.png)

To update your local package just select a newer version from the Mixed Reality Feature Tool and install it.

## Unity render pipelines

Remote Rendering works with both the **:::no-loc text="Universal render pipeline":::** and the **:::no-loc text="Standard render pipeline":::**. For performance reasons, the Universal render pipeline is recommended.

To use the **:::no-loc text="Universal render pipeline":::**, its package has to be installed in Unity. This can either be done in Unity's **Package Manager** UI (package name **Universal RP**, version 7.3.1 or newer), or through the `Packages/manifest.json` file, as described in the [Unity project setup tutorial](../../tutorials/unity/view-remote-models/view-remote-models.md#include-the-azure-remote-rendering-package).

## Next steps

* [Unity game objects and components](objects-components.md)
* [Tutorial: View Remote Models](../../tutorials/unity/view-remote-models/view-remote-models.md)
