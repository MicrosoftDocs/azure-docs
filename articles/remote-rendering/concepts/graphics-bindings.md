---
title: Graphics binding
description: Setup of graphics bindings and use cases
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Graphics binding

To be able to use Azure Remote Rendering in a custom application, it needs to be integrated into the application's rendering pipeline. This integration is the responsibility of the graphics binding.

Once set up, the graphics binding gives access to various functions that affect the rendered image. These functions can be separated into two categories: general functions that are always available and specific functions that are only relevant for the selected `Microsoft.Azure.RemoteRendering.GraphicsApiType`.

## Graphics binding in Unity

In Unity, the entire binding is handled by the `RemoteUnityClientInit` struct passed into the construction of `RemoteManagerUnity`. To set the graphics mode, the `GraphicsApiType` field has to be set to the chosen binding. The field will be automatically populated depending on an XRDevice is present, but may be manually overridden with the following behaviors:

* **HoloLens 2**: the [Windows Mixed Reality](#windows-mixed-reality) graphics binding is always used.
* **Flat UWP desktop app**: [Simulation](#simulation) is always used. To use this mode, make sure to follow the steps in [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md).
* **Unity editor**: [Simulation](#simulation) is always used unless a WMR VR headset is connected in which case ARR will be disabled to allow to debug the non-ARR related parts of the application.

The only other relevant part for Unity is accessing the [basic binding](#access), all the other sections below can be skipped.

## Graphics binding setup in custom applications

To select a graphics binding, take the following two steps: First, the graphics binding has to be statically initialized when the program is initialized:

``` cs
RemoteRenderingInitialization managerInit = new RemoteRenderingInitialization;
managerInit.graphicsApi = GraphicsApiType.WmrD3D11;
managerInit.connectionType = ConnectionType.General;
managerInit.right = ///...
RemoteManagerStatic.StartupRemoteRendering(managerInit);
```

The call above is necessary to initialize Azure Remote Rendering into the holographic APIs and must be called before any holographic API is called and before any other Remote Rendering APIs are accessed. Similarly, the corresponding de-init functions should be called after no holographic APIs are being called anymore.

## <span id="access">Accessing graphics binding

Once a client is set up, the basic graphics binding can be accessed with the `AzureSession.GraphicsBinding` getter. As an example, the focus point mode can be set with:

``` cs
AzureSession currentSesson = getRenderingSession();
if (currentSesson.GraphicsBinding)
    currentSesson.GraphicsBinding.FocusPointReprojectionMode = FocusPointMode.UseLocalFocusPoint;
```

## Graphic APIs

There are currently two graphics APIs that can be selected, `SimD3D11` and `WmrD3D11`. A third one `Headless` exists but is not yet supported on the client side.

### Simulation

`GraphicsApiType.SimD3D11` is the simulation binding and if selected it creates the `GraphicsBindingSimD3d11` graphics binding. This interface is used to simulate head movement, for example in a desktop application and renders a monoscopic image.

### Windows Mixed Reality

`GraphicsApiType.WmrD3D11` is the default binding to run on HoloLens 2. It will create the `GraphicsBindingWmrD3d11` binding. In this mode Azure Remote Rendering hooks directly into the holographic APIs.

To access the derived graphics binding for each of these, the base `GraphicsBinding` has to be cast.

``` cs
GraphicsBindingSimD3d11 simBinding = (currentSession.GraphicsBinding as GraphicsBindingSimD3d11);
if (simBinding)
    simBinding.DeinitSimulation();
```

## Next steps

* [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md)
