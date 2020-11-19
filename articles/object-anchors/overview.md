---
title: Azure Object Anchors overview
description: Learn how Azure Object Anchors helps you detect objects in the physical world.
author: craigktreasure
manager: vriveras

ms.author: crtreasu
ms.date: 04/01/2020
ms.topic: overview
ms.service: azure-object-understanding
# ms.reviewer: MSFT-alias-of-reviewer
---
# Azure Object Anchors overview

Welcome to Azure Object Anchors. Azure Object Anchors enables an application to detect an object in the physical world using a 3D model and estimate its 6-DoF pose. The SDK enables a HoloLens application to load an object model, detect, and track instance(s) of that model in the physical world.

## Examples

Some example use cases enabled by Object Anchors include:

- **Training**. Create mixed reality training experiences for your workers, without the need to place markers or spend time manually adjusting hologram alignment. If you want to augment your mixed reality training experiences with automated detection and tracking, ingest your model into the Object Anchors service and you'll be one step closer to a markerless experience.

- **Task Guidance**. Walking employees through a set of tasks can be greatly simplified when using Mixed Reality. Overlaying digital instructions and best practices, on top of the physical object – be it a piece of machinery on a factory floor, or a coffee maker in the team kitchen – can greatly reduce difficulty of completing the set of tasks. Triggering these experiences typically requires some form of marker or manual alignment, but with Object Anchors, you can create an experience that automatically detects the object related to the task at hand. Then, seamlessly flow through Mixed Reality guidance without markers or manual alignment.

- **Asset Finding**. If you already have a 3D model of some object in your physical space, Object Anchors can enable you to locate and track instances of that object in your physical environment.

Azure Object Anchors is composed of a managed service and a client SDK for HoloLens. The following
sections provide information about getting started with building apps using Azure Object Anchors.

## Next steps

Get started with Object Anchors.

> [!div class="nextstepaction"]
> [Model Ingestion](quickstarts/get-started-model-ingestion.md)

> [!div class="nextstepaction"]
> [Unity HoloLens](quickstarts/get-started-unity-hololens.md)

> [!div class="nextstepaction"]
> [Unity HoloLens with MRTK](quickstarts/get-started-unity-hololens-mrtk.md)

> [!div class="nextstepaction"]
> [HoloLens DirectX](quickstarts/get-started-hololens-directx.md)
