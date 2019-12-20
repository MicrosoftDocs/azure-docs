---
title: Remote rendering modes
description: Configuring server side rendering modes
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Remote rendering modes

Remote Rendering offers two main modes of operation, the `Balanced` mode and the `Quality` mode. These modes fundamentally govern how assets are rendered on the service VMs and thus cannot be changed during the runtime of a rendering process. They present trade-offs between resource usage, performance and rendering quality and are built to accommodate different use cases and rendering needs. Most of the supported use cases are a product of technical realities when it comes to rendering scenes containing massive amounts of data. Still, the two modes allow the user to choose a suitable approach for their needs and thus provide a base amount of versatility and adaptability.

As best practices to quickly decide which mode is most appropriate, the following two rules generally apply:

* If it proves to be running well, prefer `Quality` mode for your scene to avoid inaccuracies
* For everything else, especially complex scenes, use `Balanced`
* If in doubt use the special `Default` enum value, which is set to the recommended mode

## Usage

The render mode used on a Remote Rendering VM is switchable during its lease time, but only during the connection operation. Subsequent switches require the user to orderly disconnect from the VM and specify the desired mode during the following connect operation.

C++ sample code:

```cpp
bool exampleConnect(RemoteRenderingClient& client)
{
    if (client.Connect("IpOrHostname", 50051, ServiceRenderMode::Quality) == ARRResult::Success)
    {
        return true;
    }

    return false;
}
```

C# sample code:

```cs
public void ExampleConnect()
{
    var result = RemoteManager.Connect("IpOrHostname", null, true, 50051, ServiceRenderMode.Quality);
    if(result != ARRResult.Success)
    {
        throw RRException.CreateFromReturnedError("Failed to connect to given host!", result);
    }
```

> ![NOTE]
> To switch the render mode the service runs with, call `RemoteRenderingClient::Disconnect` or `RemoteManager.Disconnect` respectively, wait until the disconnect event has been triggered and reconnect with the desired mode.

## Modes

### Balanced

The `Balanced` mode is optimized for general usage and conservative resource utilization on the VMs. The `Balanced` mode maximizes the utilization of the VM's CPU, GPU, main memory, and graphics memory. It is well suited for very complex scenes in terms of both mesh and texture data.

The trade-off of `Balanced` mode is that it cannot deliver the best possible rendering quality in all situations, as exemplified by the following image:

![BalancedMode](./media/service-render-mode-balanced.png)

Notice the multi-sampling quality between objects, where it mostly looks correct (see contrast between sculpture and green curtain) but can also degrade or show inaccuracies (border between green curtain and wall). These sporadic occurrences are usually difficult to perceive for most users.

In terms of performance, this mode is better than Quality mode for opaque geometry and should be used in this case if the artifacts mentioned above are not an issue. There is one instance where it can actually perform worse, which is scenes consisting mostly or exclusively of transparent objects. In this case, it is recommended to use Quality mode.

### Quality

The second available render mode `Quality` offers a gain in rendering quality at the cost of resource consumption. Especially in terms of memory usage this mode will consume vastly more of the VMs resources, which makes this mode unsuitable for huge scenes (many objects/triangles, a large amount of large textures). The main advantage of `Quality` mode is the fact that artifacts mentioned for the `Balanced` mode will be reduced significantly, which can be seen in the following illustration [in comparison](#Balanced).

![QualityMode](./media/service-render-mode-quality.png)

Besides this, this mode actually allows the rendering of transparencies to be done more efficiently.

Due to the substantially higher resource consumption, this mode is only recommended for small to medium sized models, and only if the absolute best rendering quality is needed. The Remote Rendering service may even reject this mode for some models.

## See also

[Sdk concepts](../concepts/sdk-concepts.md)
