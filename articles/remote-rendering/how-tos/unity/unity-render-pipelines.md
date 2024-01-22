---
title: Unity Render Pipelines
description: How to set up the Universal Render Pipeline for Remote Rendering
author: jloehr
ms.author: julianlohr
ms.date: 01/12/2022
ms.topic: how-to
---

# Unity Render Pipelines

Remote Rendering works with both the **:::no-loc text="Standard render pipeline":::** ("built-in render pipeline") and the **:::no-loc text="Universal render pipeline":::** ("URP"). For performance reasons, it's recommended to use the built-in render pipeline, unless there are strong reasons that require URP.

## Setup Universal Render Pipeline

To use the **:::no-loc text="Universal render pipeline":::**, its package has to be installed in Unity, and the *HybridRenderingPipeline* asset must be added to the Graphics settings.

1. Install the **Universal RP** package (version 7.3.1 or newer) using Unity's **Package Manager** UI, as described in the [Unity - Manual:  Installing from a registry](https://docs.unity3d.com/Manual/upm-ui-install.html).
1. Open *Edit > Project Settings...*
1. Select **Graphics** from the left list menu
    1. Change the **Scriptable Rendering Pipeline** setting to *HybridRenderingPipeline*.\
        ![Screenshot of the Unity Project Settings dialog. The Graphics entry is selected in the list on the left. The button to select a Universal Render Pipeline asset is highlighted.](./media/settings-graphics-render-pipeline.png)\
        Sometimes the UI doesn't populate the list of available pipeline types from the packages. If this issue occurs, the *HybridRenderingPipeline* asset must be dragged onto the field manually:\
        ![Screenshot of the Unity asset browser and Project Settings dialog. The HybridRenderingPipeline asset is highlighted in the asset browser. An arrow points from the asset to the UniversalRenderPipelineAsset field in project settings.](./media/hybrid-rendering-pipeline.png)

        > [!NOTE]
        > If you're unable to drag and drop the *HybridRenderingPipeline* asset into the Render Pipeline Asset field (possibly because the field doesn't exist!), ensure your package configuration contains the `com.unity.render-pipelines.universal` package.

## Setup Standard Render Pipeline

Unlike for the **:::no-loc text="Universal render pipeline":::**, there are no extra setup steps required for the  **:::no-loc text="Standard render pipeline":::** to work with ARR. Instead, the ARR runtime sets the required render hooks automatically.

## Next steps

* [Install the Remote Rendering package for Unity](install-remote-rendering-unity-package.md)
* [Set up Remote Rendering for Unity](unity-setup.md)
* [Unity game objects and components](objects-components.md)
* [Tutorial: View Remote Models](../../tutorials/unity/view-remote-models/view-remote-models.md)
