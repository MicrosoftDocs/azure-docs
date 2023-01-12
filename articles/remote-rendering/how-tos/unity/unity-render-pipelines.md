---
title: Unity Render Pipelines
description: How to set up the Universal Render Pipeline for Remote Rendering
author: jloehr
ms.author: julianlohr
ms.date: 01/12/2022
ms.topic: how-to
---

# Unity render pipelines

Remote Rendering works with both the **:::no-loc text="Standard render pipeline":::** ("built-in render pipeline") and the **:::no-loc text="Universal render pipeline":::** ("URP"). For performance reasons, it's recommended to use the built-in render pipeline, unless there are strong reasons that require URP.

## Setup Universal Render Pipeline

To use the **:::no-loc text="Universal render pipeline":::**, its package has to be installed in Unity. The installation can either be done in Unity's **Package Manager** UI (package name **Universal RP**, version 7.3.1 or newer), or through the `Packages/manifest.json` file, as described in the [Unity project setup tutorial](../../tutorials/unity/view-remote-models/view-remote-models.md#include-the-azure-remote-rendering-and-openxr-packages).

## Next steps

* [Install the Remote Rendering package for Unity](install-remote-rendering-unity-package.md)
* [Unity game objects and components](objects-components.md)
* [Tutorial: View Remote Models](../../tutorials/unity/view-remote-models/view-remote-models.md)
