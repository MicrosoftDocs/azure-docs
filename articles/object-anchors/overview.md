---
title: Azure Object Anchors overview
description: Learn how Azure Object Anchors helps you detect objects in the physical world.
author: craigktreasure
manager: vriveras

ms.author: crtreasu
ms.date: 03/02/2021
ms.topic: overview
ms.service: azure-object-anchors
---

# Azure Object Anchors overview

Azure Object Anchors enables an application to detect an object in the physical world using a 3D model and estimate its 6DoF pose. The 6DoF (6 degrees of freedom) pose is defined as a rotation and translation between a 3D model and its physical counterpart, the real object.

Azure Object Anchors is composed of a service for model conversion and a runtime client SDK for HoloLens. The service accepts a 3D object model and outputs an Azure Object Anchors model. The Azure Object Anchors model is used along with the runtime SDK to enable a HoloLens application to load an object model, detect, and track instance(s) of that model in the physical world.

:::image type="content" source="./media/object-anchors-overview.jpg" alt-text="Azure Object Anchors in action":::

## Examples

Some example use cases enabled by Azure Object Anchors include:

- **Training**. Create Mixed Reality training experiences for your workers, without the need to place markers or spend time manually adjusting hologram alignment. If you want to augment your Mixed Reality training experiences with automated detection and tracking, ingest your model into the Azure Object Anchors service and you'll be one step closer to a markerless experience.

- **Task Guidance**. Walking employees through a set of tasks can be greatly simplified when using Mixed Reality. Overlaying digital instructions and best practices, on top of the physical object – be it a piece of machinery on a factory floor, or a coffee maker in the team kitchen – can greatly reduce difficulty of completing the set of tasks. Triggering these experiences typically requires some form of marker or manual alignment, but with Azure Object Anchors, you can create an experience that automatically detects the object related to the task at hand. Then, seamlessly flow through Mixed Reality guidance without markers or manual alignment.

- **Asset Finding**. If you already have a 3D model of some object in your physical space, Azure Object Anchors can enable you to locate and track instances of that object in your physical environment.

## Usage flow

First, upload your 3d asset to our Azure Object Anchors Conversion service. You can follow the steps in one of our Quickstarts:

  - [Unity HoloLens](quickstarts/get-started-unity-hololens.md)
  - [Unity HoloLens with MRTK](quickstarts/get-started-unity-hololens-mrtk.md)
  - [HoloLens DirectX](quickstarts/get-started-hololens-directx.md)

The service will then convert your asset into an Azure Object Anchors model. Download the converted model, so you can [visualize its mesh](visualize-converted-model.md) if you want. Finally, copy the model over to a HoloLens device that has the Runtime SDK for [Unity](/dotnet/api/Microsoft.Azure.ObjectAnchors) or [HoloLens C++/WinRT](/cpp/api/object-anchors/winrt): you can now detect physical objects that match your original model.

:::image type="content" source="./media/object-anchors-flow.png" alt-text="usage flow":::

## Asset requirements

Each dimension of an asset should be between 1 meter to 10 meters, and the file size should be less than 150 MB.

The asset formats currently supported are: `fbx`, `ply`, `obj`, and `glb`.

## Next steps

The following sections provide information about getting started with using and building apps with Azure Object Anchors.

> [!div class="nextstepaction"]
> [Model Ingestion](quickstarts/get-started-model-conversion.md)

> [!div class="nextstepaction"]
> [Unity HoloLens](quickstarts/get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity HoloLens with MRTK](quickstarts/get-started-unity-hololens-mrtk.md)

> [!div class="nextstepaction"]
> [HoloLens DirectX](quickstarts/get-started-hololens-directx.md)
