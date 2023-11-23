---
title: Limitations
description: Code limitations for SDK features
author: erscorms
ms.author: erscor
ms.date: 02/11/2020
ms.topic: reference
---

# Limitations

Many features have size, count, or other limitations.

## Azure Frontend

The following limitations apply to the frontend API (C++ and C#):
* Total [RemoteRenderingClient](/dotnet/api/microsoft.azure.remoterendering.remoterenderingclient) instances per process: 16.
* Total [RenderingSession](/dotnet/api/microsoft.azure.remoterendering.renderingsession) instances per [RemoteRenderingClient](/dotnet/api/microsoft.azure.remoterendering.remoterenderingclient): 16.
* There can only be a single session per process that is connected to the server.

## Objects

* Total allowable objects of a single type ([Entity](../concepts/entities.md), [CutPlaneComponent](../overview/features/cut-planes.md), etc.): 16,777,215.
* Total allowable active cut planes: 8.

## Geometry

* **Animation:** Animations are limited to animating individual transforms of [game objects](../concepts/entities.md). Skeletal animations with skinning or vertex animations aren't supported. Animation tracks from the source asset file aren't preserved. Instead, object transform animations have to be driven by client code.
* **Custom shaders:** Authoring of custom shaders isn't supported. Only built-in [Color materials](../overview/features/color-materials.md) or [PBR materials](../overview/features/pbr-materials.md) can be used.
* **Maximum number of distinct materials** in a singular triangular mesh asset: 65,535. For more information about automatic material count reduction, see the [material de-duplication](../how-tos/conversion/configure-model-conversion.md#material-deduplication) chapter.
* **Maximum number of distinct textures**: There's no hard limit on the number of distinct textures. The only constraint is overall GPU memory and the number of distinct materials.
* **Maximum dimension of a single texture**: 16,384 x 16,384. Larger textures can't be used by the renderer. The conversion process can sometimes reduce larger textures in size, but in general it will fail to process textures larger than this limit.
* **Maximum number of points in a single point cloud asset**: 12.5 billion.

### Overall number of primitives

A primitive is either a single triangle (in triangular meshes) or a single point (in point cloud meshes).
The allowable number of primitives for all loaded models depends on the size of the VM as passed to [the session management REST API](../how-tos/session-rest-api.md):

| Server size | Maximum number of primitives |
|:--------|:------------------|
|standard| 20 million |
|premium| no limit |

For detailed information on this limitation, see the [server size](../reference/vm-sizes.md) chapter.
