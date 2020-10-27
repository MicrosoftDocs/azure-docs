---
title: Server sizes
description: Describes the distinct server sizes that can be allocated
author: florianborn71
ms.author: flborn
ms.date: 05/28/2020
ms.topic: reference
ms.custom: devx-track-csharp
---

# Server sizes

Azure Remote Rendering is available in two server configurations: `Standard` and `Premium`.

## Polygon limits

Remote Rendering with `Standard` size server has a maximum scene size of 20 million polygons. Remote Rendering with `Premium` size does not enforce a hard maximum, but performance may be degraded if your content exceeds the rendering capabilities of the service.

When the renderer on on a 'Standard' server size hits this limitation, it switches rendering to a checkerboard background:

![Screenshot shows a grid of black and white squares with a Tools menu.](media/checkerboard.png)

## Specify the server size

The desired type of server configuration has to be specified at rendering session initialization time. It cannot be changed within a running session. The following code examples show the place where the server size must be specified:

```cs
async void CreateRenderingSession(AzureFrontend frontend)
{
    RenderingSessionCreationParams sessionCreationParams = new RenderingSessionCreationParams();
    sessionCreationParams.Size = RenderingSessionVmSize.Standard; // or  RenderingSessionVmSize.Premium

    AzureSession session = await frontend.CreateNewRenderingSessionAsync(sessionCreationParams).AsTask();
}
```

```cpp
void CreateRenderingSession(ApiHandle<AzureFrontend> frontend)
{
    RenderingSessionCreationParams sessionCreationParams;
    sessionCreationParams.Size = RenderingSessionVmSize::Standard; // or  RenderingSessionVmSize::Premium

    if (auto createSessionAsync = frontend->CreateNewRenderingSessionAsync(sessionCreationParams))
    {
        // ...
    }
}
```

For the [example PowerShell scripts](../samples/powershell-example-scripts.md), the desired server size has to be specified inside the `arrconfig.json` file:

```json
{
  "accountSettings": {
    ...
  },
  "renderingSessionSettings": {
    "vmSize": "<standard or premium>",
    ...
  },
```

### How the renderer evaluates the number of polygons

The number of polygons that are considered for the limitation test are the number of polygons that are actually passed to the renderer. This geometry is typically the sum of all instantiated models, but there are also exceptions. The following geometry is **not included**:
* Loaded model instances that are fully outside the view frustum.
* Models or model parts that are switched to invisible, using the [hierarchical state override component](../overview/features/override-hierarchical-state.md).

Accordingly, it is possible to write an application that targets the `standard` size that loads multiple models with a polygon count close to the limit for every single model. When the application only shows a single model at a time, the checkerboard is not triggered.

### How to determine the number of polygons

There are two ways to determine the number of polygons of a model or scene that contribute to the budget limit of the `standard` configuration size:
* On the model conversion side, retrieve the [conversion output json file](../how-tos/conversion/get-information.md), and check the `numFaces` entry in the [*inputStatistics* section](../how-tos/conversion/get-information.md#the-inputstatistics-section)
* If your application is dealing with dynamic content, the number of rendered polygons can be queried dynamically during runtime. Use a [performance assessment query](../overview/features/performance-queries.md#performance-assessment-queries) and check for the `polygonsRendered` member in the `FrameStatistics` struct. The `polygonsRendered` field will be set to `bad` when the renderer hits the polygon limitation. The checkerboard background is always faded in with some delay to ensure user action can be taken after this asynchronous query. User action can for instance be hiding or deleting model instances.

## Pricing

For a detailed breakdown of the pricing for each type of configuration, refer to the [Remote Rendering pricing](https://azure.microsoft.com/pricing/details/remote-rendering) page.

## Next steps
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
* [Model conversion](../how-tos/conversion/model-conversion.md)

