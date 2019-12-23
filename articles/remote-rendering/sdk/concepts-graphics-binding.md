---
title: Graphics binding
description: Setup of graphics bindings and use cases
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Graphics binding

> [!WARNING]
> Graphics bindings are experimental. It is highly encouraged not to touch them until the samples are added in a later release.

To be able to use Azure Remote Rendering in a custom application, it needs to be integrated into the application's rendering pipeline. This integration is the responsibility of the graphics binding.

Once set up, the graphics binding gives access to various functions that affect the rendered image. These functions can be separated into two categories: general functions that are always available and specific functions that are only relevant for the selected `Microsoft.Azure.RemoteRendering.GraphicsApi`.

## Unity

In Unity the entire binding is handled by the `RemoteUnityClientInit` struct passed into the construction of `RemoteManagerUnity`. To set the graphics mode, the `graphicsApi` field has to be set to the chosen binding. When in doubt, the field should be initialized with  that will have the following behavior in Unity:

* **Hololens 2**: the [Windows Mixed Reality](#windows-mixed-reality) graphics binding is always used.
* **Flat UWP desktop app**: [Simulation](#simulation) is always used. To use this mode, make sure to follow the steps in [create new Unity project](../quickstarts/create-new-unity-project.md#player-settings).
* **Unity editor**: [Simulation](#simulation) is always used unless a WMR VR headset is connected in which case ARR will be disabled to allow to debug the non-ARR related parts of the application.

The only other relevant part for Unity is accessing the [basic binding](#access), all the other sections below can be skipped.

## Setup

To select a graphics binding two steps have to be taken: First, the graphics binding has to be statically initialized using the following function in C++:

``` cpp
GraphicsBinding::GraphicsBindingStaticInitialization(ARRConnectionType::General, GraphicsApi::WmrD3D11);
```
In C# the equivalent:
``` cs
RRInterface.RemoteManager_GraphicsBindingStaticInitialization(ARRConnectionType.General, GraphicsApi.WmrD3D11);
```
The call above is necessary to integrate Azure Remote Rendering into the holographic APIs and must be called before any holographic API is called and before a client is created. Similarly, the corresponding de-init functions should be called after the client connection is destroyed and no holographic APIs are being called anymore. 

Note that the static init function has two arguments of type `ARRConnectionType` and `GraphicsApi`. These parameters must match the same parameters in the `ClientInit` struct that is passed into the `RemoteRenderingClient` in C++ or the `RemoteManager` in C# respectively. If this is not the case, the client initialization will fail.

## <span id="access">Accessing Graphics Binding

Once a client is set up, the basic graphics binding can be accessed with the GraphicsBinding getter. As an example, the focus point mode can be set with:
In C++:
``` c++
RemoteRenderingClient& rrc = ...;
GraphicsBinding* binding = rrc.GetBaseGraphicsBinding();
if (binding)
    binding->SetFocusPointMode(FocusPointMode::UseLocalFocusPoint);
```
In C#:
``` cs
IGraphicsBinding binding = RemoteManager.GraphicsBinding;
if (binding)
    binding.FocusPointReprojectionMode = FocusPointMode.UseLocalFocusPoint;
```

## Graphic APIs

There are currently two graphics APIs that can be selected, `SimD3D11` and `WmrD3D11`. A third one `Headless` exists but is not yet supported on the client side.

### Simulation
`GraphicsApi::SimD3D11` is the simulation binding and if selected it creates the `GraphicsBindingSimD3d11` graphics binding (`IGraphicsBindingSimD3d11` in C#). This interface is used to simulate head movement, for example in a desktop application and renders a monoscopic image.

### Windows Mixed Reality
`GraphicsApi::WmrD3D11` is the default binding to run on Hololens 2. It will create the `GraphicsBindingWmrD3d11` (`IGraphicsBindingWmrD3d11` in C#) binding. In this mode Azure Remote Rendering hooks directly into the holographic APIs.

To access the derived graphics binding for each of these the base `GraphicsBinding` (`IGraphicsBinding` in C#) has to be casted. For C++ a convenient type safe accessor exists:
``` c++
RemoteRenderingClient& rrc = ...;
GraphicsBindingSimD3d11* simBinding = rrc.GetGraphicsBinding<GraphicsBindingSimD3d11>();
if (simBinding)
    simBinding->DeinitSimulation();
```
In C#:
``` cs
IGraphicsBindingSimD3d11 simBinding = (RemoteManager.GraphicsBinding as IGraphicsBindingSimD3d11);
if (simBinding)
    simBinding.DeinitSimulation();
```