---
title: Rendering modes
description: Describes the different server side rendering modes
author: FlorianBorn71
ms.author: flborn
ms.date: 02/03/2020
ms.topic: conceptual
---

# Rendering modes

Remote Rendering offers two main modes of operation, the `Balanced` mode and the `Quality` mode. These modes fundamentally govern how assets are rendered on the service VMs and cannot be changed during the runtime of a rendering process. They present trade-offs between resource usage, performance, and rendering quality and are built to accommodate different use cases and rendering needs. Most of the supported use cases are a product of technical realities when it comes to rendering scenes containing massive amounts of data. Still, the two modes allow the user to choose a suitable approach for their needs and thus provide a base amount of versatility and adaptability.

As best practices to quickly decide which mode is most appropriate, the following two rules generally apply:

* If it proves to be running well, prefer `Quality` mode for your scene to avoid inaccuracies
* For everything else, especially complex scenes, use `Balanced`
* If in doubt use the special `Default` enum value, which is set to the recommended mode

## Usage

The render mode used on a Remote Rendering VM is specified during `AzureSession.ConnectToRuntime` via the `ConnectToRuntimeParams`. A single VM can have multiple rendering modes during different connections.

```cs
async void ExampleConnect(AzureSession session)
{
    ConnectToRuntimeParams parameters = new ConnectToRuntimeParams();

    // Connect with one rendering mode
    parameters.mode = ServiceRenderMode.Quality;
    await session.ConnectToRuntime(parameters).AsTask();

    session.DisconnectFromRuntime();

    // Wait until session.IsConnected == false

    // Reconnect with a different rendering mode
    parameters.mode = ServiceRenderMode.Default;
    await session.ConnectToRuntime(parameters).AsTask();
}
```

## Modes

### 'Balanced' mode

*Balanced* mode is optimized for general usage and conservative resource utilization on the VMs. It maximizes the utilization of the VM's CPU, GPU, main memory, and graphics memory. It is well suited for complex scenes in terms of both mesh and texture data.

The trade-off is that it cannot deliver the best possible rendering quality in all situations, as exemplified by the following image:

![BalancedMode](./media/service-render-mode-balanced.png)

Notice the multi-sampling quality between objects, where it mostly looks correct (see contrast between sculpture and green curtain) but can also degrade or show inaccuracies (border between green curtain and wall). These sporadic occurrences are usually difficult to perceive for most users.

In terms of performance, this mode is better than *Quality* mode for opaque geometry and should be used in this case if the artifacts mentioned above are not an issue. There is one instance where it can actually perform worse, which is scenes consisting mostly or exclusively of transparent objects. In this case, it is recommended to use *Quality* mode.

### 'Quality' mode

*Quality* mode offers a gain in rendering quality, at the cost of resource consumption. Especially in terms of memory usage this mode will consume vastly more of the VMs resources, which makes this mode unsuitable for huge scenes (many objects/triangles, a large amount of large textures). The main advantage of *Quality* mode is the fact that artifacts mentioned for *Balanced* mode will be reduced significantly, which can be seen in the following illustration [in comparison](#balanced).

![QualityMode](./media/service-render-mode-quality.png)

Besides this, this mode is actually more efficient when rendering transparencies.

Due to the substantially higher resource consumption, this mode is only recommended for small to medium-sized models, and only if the absolute best rendering quality is needed. The Remote Rendering service may even reject this mode for some models.

## See also

[SDK concepts](../concepts/sdk-concepts.md)
