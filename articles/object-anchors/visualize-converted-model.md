---
title: How to visualize an Object Anchors model
description: Describe how to visualize a converted model.
author: rgarcia
manager: vrivera

ms.author: rgarcia
ms.date: 05/28/2021
ms.topic: overview
ms.service: azure-object-anchors
#Customer Describe how to visualize a converted model.
---

# How to visualize an Object Anchors model

You don't need to visualize a converted model to use it. However, there's an easy way to view its mesh before using it if you want.

Follow the steps in our [Unity app Quickstart](quickstarts/get-started-unity-hololens.md), with one minor change. When building the sample scene, instead of opening **AOASampleScene**, open **VisualizeScene** and add it to the scene build list. Then, in **Build Settings**, ensure that *only* **VisualizeScene** has a checkmark next to it: all other scenes shouldn't be included.

:::image type="content" source="../../includes/media/object-anchors-quickstarts-unity/aoa-unity-build-settings-visualize.png" alt-text="build settings visualize":::

Close the **Build Settings** dialog *instead* of selecting the **Build** button.

In the **Hierarchy** panel, select the **Visualizer** GameObject.

:::image type="content" source="../../includes/media/object-anchors-quickstarts-unity/aoa-unity-hierarchy.png" alt-text="hierarchy":::

In the **Inspector** panel, locate the **Model path** property under the **Mesh Loader (Script)** section, and type the path to your Object Anchors model file, including the file extension.

:::image type="content" source="../../includes/media/object-anchors-quickstarts-unity/aoa-unity-inspector.png" alt-text="inspector":::

Select the **Play** button at the top of the Unity Editor, and then ensure the **Scene** view is selected.

:::image type="content" source="../../includes/media/object-anchors-quickstarts-unity/aoa-unity-editor.png" alt-text="play and scene view":::

Using [Unity's scene view navigation controls](https://docs.unity3d.com/Manual/SceneViewNavigation.html), you're now able to inspect your Object Anchors model.

:::image type="content" source="./media/object-anchors-visualize.png" alt-text="visualize model":::
