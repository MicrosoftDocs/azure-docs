---
title: Graphics binding
description: Setup of graphics bindings and use cases
author: florianborn71
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

In Unity, the entire binding is handled by the `RemoteUnityClientInit` struct passed into `RemoteManagerUnity.InitializeManager`. To set the graphics mode, the `GraphicsApiType` field has to be set to the chosen binding. The field will be automatically populated depending on whether an XRDevice is present. The behavior can be manually overridden with the following behaviors:

* **HoloLens 2**: the [Windows Mixed Reality](#windows-mixed-reality) graphics binding is always used.
* **Flat UWP desktop app**: [Simulation](#simulation) is always used. To use this mode, make sure to follow the steps in [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md).
* **Unity editor**: [Simulation](#simulation) is always used unless a WMR VR headset is connected in which case ARR will be disabled to allow to debug the non-ARR related parts of the application. See also [holographic remoting](../how-tos/unity/holographic-remoting.md).

The only other relevant part for Unity is accessing the [basic binding](#access), all the other sections below can be skipped.

## Graphics binding setup in custom applications

To select a graphics binding, take the following two steps: First, the graphics binding has to be statically initialized when the program is initialized:

```cs
RemoteRenderingInitialization managerInit = new RemoteRenderingInitialization;
managerInit.graphicsApi = GraphicsApiType.WmrD3D11;
managerInit.connectionType = ConnectionType.General;
managerInit.right = ///...
RemoteManagerStatic.StartupRemoteRendering(managerInit);
```

```cpp
RemoteRenderingInitialization managerInit;
managerInit.graphicsApi = GraphicsApiType::WmrD3D11;
managerInit.connectionType = ConnectionType::General;
managerInit.right = ///...
StartupRemoteRendering(managerInit); // static function in namespace Microsoft::Azure::RemoteRendering
```

The call above is necessary to initialize Azure Remote Rendering into the holographic APIs. This function must be called before any holographic API is called and before any other Remote Rendering APIs are accessed. Similarly, the corresponding de-init function `RemoteManagerStatic.ShutdownRemoteRendering();` should be called after no holographic APIs are being called anymore.

## <span id="access">Accessing graphics binding

Once a client is set up, the basic graphics binding can be accessed with the `AzureSession.GraphicsBinding` getter. As an example, the last frame statistics can be retrieved like this:

```cs
AzureSession currentSession = ...;
if (currentSession.GraphicsBinding)
{
    FrameStatistics frameStatistics;
    if (currentSession.GraphicsBinding.GetLastFrameStatistics(out frameStatistics) == Result.Success)
    {
        ...
    }
}
```

```cpp
ApiHandle<AzureSession> currentSession = ...;
if (ApiHandle<GraphicsBinding> binding = currentSession->GetGraphicsBinding())
{
    FrameStatistics frameStatistics;
    if (*binding->GetLastFrameStatistics(&frameStatistics) == Result::Success)
    {
        ...
    }
}
```

## Graphic APIs

There are currently two graphics APIs that can be selected, `WmrD3D11` and `SimD3D11`. A third one `Headless` exists but is not yet supported on the client side.

### Windows Mixed Reality

`GraphicsApiType.WmrD3D11` is the default binding to run on HoloLens 2. It will create the `GraphicsBindingWmrD3d11` binding. In this mode Azure Remote Rendering hooks directly into the holographic APIs.

To access the derived graphics bindings, the base `GraphicsBinding` has to be cast.
There are two things that need to be done to use the WMR binding:

#### Inform Remote Rendering of the used coordinate system

```cs
AzureSession currentSession = ...;
IntPtr ptr = ...; // native pointer to ISpatialCoordinateSystem
GraphicsBindingWmrD3d11 wmrBinding = (currentSession.GraphicsBinding as GraphicsBindingWmrD3d11);
if (wmrBinding.UpdateUserCoordinateSystem(ptr) == Result.Success)
{
    ...
}
```

```cpp
ApiHandle<AzureSession> currentSession = ...;
void* ptr = ...; // native pointer to ISpatialCoordinateSystem
ApiHandle<GraphicsBindingWmrD3d11> wmrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingWmrD3d11>();
if (*wmrBinding->UpdateUserCoordinateSystem(ptr) == Result::Success)
{
    //...
}
```


Where the above `ptr` must be a pointer to a native `ABI::Windows::Perception::Spatial::ISpatialCoordinateSystem` object that defines the world space coordinate system in which coordinates in the API are expressed in.

#### Render remote image

At the start of each frame the remote frame needs to be rendered into the back buffer. This is done by calling `BlitRemoteFrame`, which will fill both color and depth information into the currently bound render target. Thus it is important that this is done after binding the back buffer as a render target.

```cs
AzureSession currentSession = ...;
GraphicsBindingWmrD3d11 wmrBinding = (currentSession.GraphicsBinding as GraphicsBindingWmrD3d11);
wmrBinding.BlitRemoteFrame();
```

```cpp
ApiHandle<AzureSession> currentSession = ...;
ApiHandle<GraphicsBindingWmrD3d11> wmrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingWmrD3d11>();
wmrBinding->BlitRemoteFrame();
```

### Simulation

`GraphicsApiType.SimD3D11` is the simulation binding and if selected it creates the `GraphicsBindingSimD3d11` graphics binding. This interface is used to simulate head movement, for example in a desktop application and renders a monoscopic image.
The setup is a bit more involved and works as follows:

#### Create proxy render target

Remote and local content needs to be rendered to an offscreen color / depth render target called 'proxy' using
the proxy camera data provided by the `GraphicsBindingSimD3d11.Update` function. The proxy must match the resolution of the back buffer. Once a session is ready, `GraphicsBindingSimD3d11.InitSimulation` needs to be called before connecting to it:

```cs
AzureSession currentSession = ...;
IntPtr d3dDevice = ...; // native pointer to ID3D11Device
IntPtr color = ...; // native pointer to ID3D11Texture2D
IntPtr depth = ...; // native pointer to ID3D11Texture2D
float refreshRate = 60.0f; // Monitor refresh rate up to 60hz.
bool flipBlitRemoteFrameTextureVertically = false;
bool flipReprojectTextureVertically = false;
GraphicsBindingSimD3d11 simBinding = (currentSession.GraphicsBinding as GraphicsBindingSimD3d11);
simBinding.InitSimulation(d3dDevice, depth, color, refreshRate, flipBlitRemoteFrameTextureVertically, flipReprojectTextureVertically);
```

```cpp
ApiHandle<AzureSession> currentSession = ...;
void* d3dDevice = ...; // native pointer to ID3D11Device
void* color = ...; // native pointer to ID3D11Texture2D
void* depth = ...; // native pointer to ID3D11Texture2D
float refreshRate = 60.0f; // Monitor refresh rate up to 60hz.
bool flipBlitRemoteFrameTextureVertically = false;
bool flipReprojectTextureVertically = false;
ApiHandle<GraphicsBindingSimD3d11> simBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingSimD3d11>();
simBinding->InitSimulation(d3dDevice, depth, color, refreshRate, flipBlitRemoteFrameTextureVertically, flipReprojectTextureVertically);
```

The init function needs to be provided with pointers to the native d3d-device as well as to the color and depth texture of the proxy render target. Once initialized, `AzureSession.ConnectToRuntime` and `DisconnectFromRuntime` can be called multiple times but when switching to a different session, `GraphicsBindingSimD3d11.DeinitSimulation` needs to be called first on the old session before `GraphicsBindingSimD3d11.InitSimulation` can be called on another session.

#### Render loop update

The render loop update consists of multiple steps:

1. Each frame, before any rendering takes place, `GraphicsBindingSimD3d11.Update` is called with the current camera transform that is sent over to the server to be rendered. At the same time the returned proxy transform should be applied to the proxy camera to render into the proxy render target.
If the returned proxy update `SimulationUpdate.frameId` is null, there is no remote data yet. In this case, instead of rendering into the proxy render target, any local content should be rendered to the back buffer directly using the current camera data and the next two steps are skipped.
1. The application should now bind the proxy render target and call `GraphicsBindingSimD3d11.BlitRemoteFrameToProxy`. This will fill the remote color and depth information into the proxy render target. Any local content can now be rendered onto the proxy using the proxy camera transform.
1. Next, the back buffer needs to be bound as a render target and `GraphicsBindingSimD3d11.ReprojectProxy` called at which point the back buffer can be presented.

```cs
AzureSession currentSession = ...;
GraphicsBindingSimD3d11 simBinding = (currentSession.GraphicsBinding as GraphicsBindingSimD3d11);
SimulationUpdate update = new SimulationUpdate();
// Fill out camera data with current camera data
...
SimulationUpdate proxyUpdate = new SimulationUpdate();
simBinding.Update(update, out proxyUpdate);
// Is the frame data valid?
if (proxyUpdate.frameId != 0)
{
    // Bind proxy render target
    simBinding.BlitRemoteFrameToProxy();
    // Use proxy camera data to render local content
    ...
    // Bind back buffer
    simBinding.ReprojectProxy();
}
else
{
    // Bind back buffer
    // Use current camera data to render local content
    ...
}
```

```cpp
ApiHandle<AzureSession> currentSession;
ApiHandle<GraphicsBindingSimD3d11> simBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingSimD3d11>();

SimulationUpdate update;
// Fill out camera data with current camera data
...
SimulationUpdate proxyUpdate;
simBinding->Update(update, &proxyUpdate);
// Is the frame data valid?
if (proxyUpdate.frameId != 0)
{
    // Bind proxy render target
    simBinding->BlitRemoteFrameToProxy();
    // Use proxy camera data to render local content
    ...
    // Bind back buffer
    simBinding->ReprojectProxy();
}
else
{
    // Bind back buffer
    // Use current camera data to render local content
    ...
}
```

## Next steps

* [Tutorial: Setting up a Unity project from scratch](../tutorials/unity/project-setup.md)
