---
title: VM sizes
description: Describes the distinct VM sizes that can be allocated
author: florianborn71
ms.author: flborn
ms.date: 05/28/2020
ms.topic: reference
---

# VM sizes

The rendering service can operate on two different types of machines in Azure, called `Standard` and `Premium`.

## Allocating the VM

The desired type of VM has to be specified at rendering session initialization time. It cannot be changed within a running session. This is the place where the VM size must be specified:

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


## Supported VM sizes


## Polygon limits

## Pricing

[Remote Rendering pricing](https://azure.microsoft.com/pricing/details/remote-rendering)
