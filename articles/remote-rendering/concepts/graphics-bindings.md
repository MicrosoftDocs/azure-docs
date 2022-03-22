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
ms.custom: devx-track-csharp
---
# Graphics binding

To be able to use Azure Remote Rendering in a custom application, it needs to be integrated into the application's rendering pipeline. This integration is the responsibility of the graphics binding.

Once set up, the graphics binding gives access to various functions that affect the rendered image. These functions can be separated into two categories: general functions that are always available and specific functions that are only relevant for the selected `Microsoft.Azure.RemoteRendering.GraphicsApiType`.

## Graphics binding in Unity

In Unity, the entire binding is handled by the `RemoteUnityClientInit` struct passed into `RemoteManagerUnity.InitializeManager`. To set the graphics mode, the `GraphicsApiType` field has to be set to the chosen binding. The field will be automatically populated depending on whether an XRDevice is present. The behavior can be manually overridden with the following behaviors:

* **HoloLens 2**: the [OpenXR](#openxr) or the [Windows Mixed Reality](#windows-mixed-reality) graphics binding is used depending on the active Unity XR plugin.
* **Flat UWP desktop app**: [Simulation](#simulation) is always used.
* **Unity editor**: [Simulation](#simulation) is always used unless a WMR VR headset is connected in which case ARR will be disabled to allow to debug the non-ARR related parts of the application. See also [holographic remoting](../how-tos/unity/holographic-remoting.md).

The only other relevant part for Unity is accessing the [basic binding](#access), all the other sections below can be skipped.

## Graphics binding setup in custom applications

To select a graphics binding, take the following two steps: First, the graphics binding has to be statically initialized when the program is initialized:

```cs
RemoteRenderingInitialization managerInit = new RemoteRenderingInitialization();
managerInit.GraphicsApi = GraphicsApiType.OpenXrD3D11;
managerInit.ConnectionType = ConnectionType.General;
managerInit.Right = ///...
RemoteManagerStatic.StartupRemoteRendering(managerInit);
```

```cpp
RemoteRenderingInitialization managerInit;
managerInit.GraphicsApi = GraphicsApiType::OpenXrD3D11;
managerInit.ConnectionType = ConnectionType::General;
managerInit.Right = ///...
StartupRemoteRendering(managerInit); // static function in namespace Microsoft::Azure::RemoteRendering

```
The call above must be called before any other Remote Rendering APIs are accessed.
Similarly, the corresponding de-init function `RemoteManagerStatic.ShutdownRemoteRendering();` should be called after all other Remote Rendering objects are already destoyed.
For WMR `StartupRemoteRendering` also needs to be called before any holographic API is called. For OpenXR the same applies for any OpenXR related APIs.

## <span id="access">Accessing graphics binding

Once a client is set up, the basic graphics binding can be accessed with the `RenderingSession.GraphicsBinding` getter. As an example, the last frame statistics can be retrieved like this:

```cs
RenderingSession currentSession = ...;
if (currentSession.GraphicsBinding != null)
{
    FrameStatistics frameStatistics;
    if (currentSession.GraphicsBinding.GetLastFrameStatistics(out frameStatistics) == Result.Success)
    {
        ...
    }
}
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
if (ApiHandle<GraphicsBinding> binding = currentSession->GetGraphicsBinding())
{
    FrameStatistics frameStatistics;
    if (binding->GetLastFrameStatistics(&frameStatistics) == Result::Success)
    {
        ...
    }
}
```

## Graphic APIs

There are currently three graphics APIs that can be selected, `OpenXrD3D11`, `WmrD3D11` and `SimD3D11`. A fourth one `Headless` exists but is not yet supported on the client side.

### OpenXR

`GraphicsApiType.OpenXrD3D11` is the default binding to run on HoloLens 2. It will create the `GraphicsBindingOpenXrD3d11` binding. In this mode Azure Remote Rendering creates a OpenXR API layer to integrate itself into the OpenXR runtime.

To access the derived graphics bindings, the base `GraphicsBinding` has to be cast.
There are three things that need to be done to use the OpenXR binding:

#### Package custom OpenXR layer json

To use Remote Rendering with OpenXR the custom OpenXR API layer needs to be activated. This is done by calling `StartupRemoteRendering` mentioned in the previous section. However, as a prerequisite the `XrApiLayer_msft_holographic_remoting.json` needs to be packaged with the application so it can be loaded. This is done automatically if the **"Microsoft.Azure.RemoteRendering.Cpp"** NuGet package is added to a project.

#### Inform Remote Rendering of the used XR Space

This is needed to align remote and locally rendered content.

```cs
RenderingSession currentSession = ...;
ulong space = ...; // XrSpace cast to ulong
GraphicsBindingOpenXrD3d11 openXrBinding = (currentSession.GraphicsBinding as GraphicsBindingOpenXrD3d11);
if (openXrBinding.UpdateAppSpace(space) == Result.Success)
{
    ...
}
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
XrSpace space = ...;
ApiHandle<GraphicsBindingOpenXrD3d11> openXrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingOpenXrD3d11>();
#ifdef _M_ARM64
    if (openXrBinding->UpdateAppSpace(reinterpret_cast<uint64_t>(space)) == Result::Success)
#else
    if (openXrBinding->UpdateAppSpace(space) == Result::Success)
#endif
{
    ...
}
```

Where the above `XrSpace` is the one used by the application that defines the world space coordinate system in which coordinates in the API are expressed in.

#### Render remote image (OpenXR)

At the start of each frame, the remote frame needs to be rendered into the back buffer. This is done by calling `BlitRemoteFrame`, which will fill both color and depth information for both eyes into the currently bound render target. Thus it is important to do so after binding the full back buffer as a render target.

> [!WARNING]
> After the remote image was blit into the backbuffer, the local content should be rendered using a single-pass stereo rendering technique, e.g. using **SV_RenderTargetArrayIndex**. Using other stereo rendering techniques, such as rendering each eye in a separate pass, can result in major performance degradation or graphical artifacts and should be avoided.

```cs
RenderingSession currentSession = ...;
GraphicsBindingOpenXrD3d11 openXrBinding = (currentSession.GraphicsBinding as GraphicsBindingOpenXrD3d11);
openXrBinding.BlitRemoteFrame();
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
ApiHandle<GraphicsBindingOpenXrD3d11> openXrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingOpenXrD3d11>();
openXrBinding->BlitRemoteFrame();
```

### Windows Mixed Reality

`GraphicsApiType.WmrD3D11` is the previously used graphics binding to run on HoloLens 2. It will create the `GraphicsBindingWmrD3d11` binding. In this mode Azure Remote Rendering hooks directly into the holographic APIs.

To access the derived graphics bindings, the base `GraphicsBinding` has to be cast.
There are two things that need to be done to use the WMR binding:

#### Inform Remote Rendering of the used coordinate system

This is needed to align remote and locally rendered content.

```cs
RenderingSession currentSession = ...;
IntPtr ptr = ...; // native pointer to ISpatialCoordinateSystem
GraphicsBindingWmrD3d11 wmrBinding = (currentSession.GraphicsBinding as GraphicsBindingWmrD3d11);
if (wmrBinding.UpdateUserCoordinateSystem(ptr) == Result.Success)
{
    ...
}
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
void* ptr = ...; // native pointer to ISpatialCoordinateSystem
ApiHandle<GraphicsBindingWmrD3d11> wmrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingWmrD3d11>();
if (wmrBinding->UpdateUserCoordinateSystem(ptr) == Result::Success)
{
    ...
}
```

Where the above `ptr` must be a pointer to a native `ABI::Windows::Perception::Spatial::ISpatialCoordinateSystem` object that defines the world space coordinate system in which coordinates in the API are expressed in.

#### Render remote image (WMR)

The same considerations as in the OpenXR case above apply here. The API calls look like this:

```cs
RenderingSession currentSession = ...;
GraphicsBindingWmrD3d11 wmrBinding = (currentSession.GraphicsBinding as GraphicsBindingWmrD3d11);
wmrBinding.BlitRemoteFrame();
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
ApiHandle<GraphicsBindingWmrD3d11> wmrBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingWmrD3d11>();
wmrBinding->BlitRemoteFrame();
```

### Simulation

`GraphicsApiType.SimD3D11` is the simulation binding and if selected it creates the `GraphicsBindingSimD3d11` graphics binding. This interface is used to simulate head movement, for example in a desktop application and renders a monoscopic image.

To implement the simulation binding, it is important to understand the difference between the local camera and the remote frame as described on the [camera](../overview/features/camera.md) page.

Two cameras are needed:

* **Local camera**: This camera represents the current camera position that is driven by the application logic.
* **Proxy camera**: This camera matches the current *Remote Frame* that was sent by the server. As there is a time delay between the client requesting a frame and its arrival, the *Remote Frame* is always a bit behind the movement of the local camera.

The basic approach here is that both the remote image and the local content are rendered into an off-screen target using the proxy camera. The proxy image is then reprojected into the local camera space, which is further explained in [late stage reprojection](../overview/features/late-stage-reprojection.md).

`GraphicsApiType.SimD3D11` also supports stereoscopic rendering, which needs to be enabled during the `InitSimulation` setup call below. The setup is a bit more involved and works as follows:

#### Create proxy render target

Remote and local content needs to be rendered to an offscreen color / depth render target called 'proxy' using
the proxy camera data provided by the `GraphicsBindingSimD3d11.Update` function.

The proxy must match the resolution of the back buffer and should be int the *DXGI_FORMAT_R8G8B8A8_UNORM* or *DXGI_FORMAT_B8G8R8A8_UNORM* format. In the case of stereoscopic rendering, both the color proxy texture and, if depth is used, the depth proxy texture need to have two array layers instead of one. Once a session is ready, `GraphicsBindingSimD3d11.InitSimulation` needs to be called before connecting to it:

```cs
RenderingSession currentSession = ...;
IntPtr d3dDevice = ...; // native pointer to ID3D11Device
IntPtr color = ...; // native pointer to ID3D11Texture2D
IntPtr depth = ...; // native pointer to ID3D11Texture2D
float refreshRate = 60.0f; // Monitor refresh rate up to 60hz.
bool flipBlitRemoteFrameTextureVertically = false;
bool flipReprojectTextureVertically = false;
bool stereoscopicRendering = false;
GraphicsBindingSimD3d11 simBinding = (currentSession.GraphicsBinding as GraphicsBindingSimD3d11);
simBinding.InitSimulation(d3dDevice, depth, color, refreshRate, flipBlitRemoteFrameTextureVertically, flipReprojectTextureVertically, stereoscopicRendering);
```

```cpp
ApiHandle<RenderingSession> currentSession = ...;
void* d3dDevice = ...; // native pointer to ID3D11Device
void* color = ...; // native pointer to ID3D11Texture2D
void* depth = ...; // native pointer to ID3D11Texture2D
float refreshRate = 60.0f; // Monitor refresh rate up to 60hz.
bool flipBlitRemoteFrameTextureVertically = false;
bool flipReprojectTextureVertically = false;
bool stereoscopicRendering = false;
ApiHandle<GraphicsBindingSimD3d11> simBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingSimD3d11>();
simBinding->InitSimulation(d3dDevice, depth, color, refreshRate, flipBlitRemoteFrameTextureVertically, flipReprojectTextureVertically, stereoscopicRendering);
```

The init function needs to be provided with pointers to the native d3d-device as well as to the color and depth texture of the proxy render target. Once initialized, `RenderingSession.ConnectAsync` and `Disconnect` can be called multiple times but when switching to a different session, `GraphicsBindingSimD3d11.DeinitSimulation` needs to be called first on the old session before `GraphicsBindingSimD3d11.InitSimulation` can be called on another session.

#### Render loop update

The render loop update consists of multiple steps:

1. Each frame, before any rendering takes place, `GraphicsBindingSimD3d11.Update` is called with the current camera transform that is sent over to the server to be rendered. At the same time the returned proxy transform should be applied to the proxy camera to render into the proxy render target.
If the returned proxy update `SimulationUpdate.frameId` is null, there is no remote data yet. In this case, instead of rendering into the proxy render target, any local content should be rendered to the back buffer directly using the current camera data and the next two steps are skipped.
1. The application should now bind the proxy render target and call `GraphicsBindingSimD3d11.BlitRemoteFrameToProxy`. This will fill the remote color and depth information into the proxy render target. Any local content can now be rendered onto the proxy using the proxy camera transform.
1. Next, the back buffer needs to be bound as a render target and `GraphicsBindingSimD3d11.ReprojectProxy` called at which point the back buffer can be presented.

```cs
RenderingSession currentSession = ...;
GraphicsBindingSimD3d11 simBinding = (currentSession.GraphicsBinding as GraphicsBindingSimD3d11);
SimulationUpdateParameters updateParameters = new SimulationUpdateParameters();
// Fill out camera data with current camera data
// (see "Simulation Update structures" section below)
...
SimulationUpdateResult updateResult = new SimulationUpdateResult();
simBinding.Update(updateParameters, out updateResult);
// Is the frame data valid?
if (updateResult.FrameId != 0)
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
ApiHandle<RenderingSession> currentSession;
ApiHandle<GraphicsBindingSimD3d11> simBinding = currentSession->GetGraphicsBinding().as<GraphicsBindingSimD3d11>();

SimulationUpdateParameters updateParameters;
// Fill out camera data with current camera data
// (see "Simulation Update structures" section below)
...
SimulationUpdateResult updateResult;
simBinding->Update(updateParameters, &updateResult);
// Is the frame data valid?
if (updateResult.FrameId != 0)
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

#### Simulation Update structures

Each frame, the **Render loop update** from the previous section requires you to input a range of camera parameters corresponding to the local camera and returns a set of camera parameters that correspond to the next available frame's camera. These two sets are captured in the `SimulationUpdateParameters` and the `SimulationUpdateResult` structures respectively:

```cs
public struct SimulationUpdateParameters
{
    public int FrameId;
    public StereoMatrix4x4 ViewTransform;
    public StereoCameraFov FieldOfView;
};

public struct SimulationUpdateResult
{
    public int FrameId;
    public float NearPlaneDistance;
    public float FarPlaneDistance;
    public StereoMatrix4x4 ViewTransform;
    public StereoCameraFov FieldOfView;
};
```

The structure members have the following meaning:

| Member | Description |
|--------|-------------|
| FrameId | Continuous frame identifier. Necessary for SimulationUpdateParameters input and needs to be continuously incremented for each new frame. Will be 0 in SimulationUpdateResult if no frame data is available yet. |
| ViewTransform | Left-right-stereo pair of the frame's camera view transformation matrices. For monoscopic rendering, only the `Left` member is valid. |
| FieldOfView | Left-right-stereo pair of the frame camera's fields-of-view in [OpenXR field of view convention](https://www.khronos.org/registry/OpenXR/specs/1.0/html/xrspec.html#angles). For monoscopic rendering, only the `Left` member is valid. |
| NearPlaneDistance | near-plane distance used for the projection matrix of the current remote frame. |
| FarPlaneDistance | far-plane distance used for the projection matrix of the current remote frame. |

The stereo-pairs `ViewTransform` and `FieldOfView` allow setting both eye-camera values in case stereoscopic rendering is enabled. Otherwise, the `Right` members will be ignored. As you can see, only the camera's transformation is passed as plain 4x4 transformation matrices while no projection matrices are specified. The actual matrices are calculated by Azure Remote Rendering internally using the specified fields-of-view and the current near-plane and far-plane set on the [CameraSettings API](../overview/features/camera.md).

Since you can change the near-plane and far-plane on the [CameraSettings](../overview/features/camera.md) during runtime as desired and the service applies these settings asynchronously, each SimulationUpdateResult also carries the specific near-plane and far-plane used during rendering of the corresponding frame. You can use those plane values to adapt your projection matrices for rendering local objects to match the remote frame rendering.

Finally, while the **Simulation Update** call requires the field-of-view in OpenXR convention, for standardization and algorithmic safety reasons, you can make use of the conversion functions illustrated in the following structure population examples:

```cs
public SimulationUpdateParameters CreateSimulationUpdateParameters(int frameId, Matrix4x4 viewTransform, Matrix4x4 projectionMatrix)
{
    SimulationUpdateParameters parameters = default;
    parameters.FrameId = frameId;
    parameters.ViewTransform.Left = viewTransform;
    if (parameters.FieldOfView.Left.FromProjectionMatrix(projectionMatrix) != Result.Success)
    {
        // Invalid projection matrix
        throw new ArgumentException("Invalid projection settings");
    }
    return parameters;
}

public void GetCameraSettingsFromSimulationUpdateResult(SimulationUpdateResult result, out Matrix4x4 projectionMatrix, out Matrix4x4 viewTransform, out int frameId)
{
    projectionMatrix = default;
    viewTransform = default;
    frameId = 0;

    if (result.FrameId == 0)
    {
        // Invalid frame data
        return;
    }

    // Use the screenspace depth convention you expect for your projection matrix locally
    if (result.FieldOfView.Left.ToProjectionMatrix(result.NearPlaneDistance, result.FarPlaneDistance, DepthConvention.ZeroToOne, out projectionMatrix) != Result.Success)
    {
        // Invalid field-of-view
        return;
    }
    viewTransform = result.ViewTransform.Left;
    frameId = result.FrameId;
}
```

```cpp
SimulationUpdateParameters CreateSimulationUpdateParameters(uint32_t frameId, Matrix4x4 viewTransform, Matrix4x4 projectionMatrix)
{
    SimulationUpdateParameters parameters;
    parameters.FrameId = frameId;
    parameters.ViewTransform.Left = viewTransform;
    if (FovFromProjectionMatrix(projectionMatrix, parameters.FieldOfView.Left) != Result::Success)
    {
        // Invalid projection matrix
        return {};
    }
    return parameters;
}

void GetCameraSettingsFromSimulationUpdateResult(const SimulationUpdateResult& result, Matrix4x4& projectionMatrix, Matrix4x4& viewTransform, uint32_t& frameId)
{
    if (result.FrameId == 0)
    {
        // Invalid frame data
        return;
    }

    // Use the screenspace depth convention you expect for your projection matrix locally
    if (FovToProjectionMatrix(result.FieldOfView.Left, result.NearPlaneDistance, result.FarPlaneDistance, DepthConvention::ZeroToOne, projectionMatrix) != Result::Success)
    {
        // Invalid field-of-view
        return;
    }
    viewTransform = result.ViewTransform.Left;
    frameId = result.FrameId;
}
```

These conversion functions allow quick switching between the field-of-view specification and a plain 4x4 perspective projection matrix, depending on your needs for local rendering. These conversion functions contain verification logic and will return errors, without setting a valid result, in case the input projection matrices or input fields-of-view are invalid.

## API documentation

* [C# RemoteManagerStatic.StartupRemoteRendering()](/dotnet/api/microsoft.azure.remoterendering.remotemanagerstatic.startupremoterendering)
* [C# GraphicsBinding class](/dotnet/api/microsoft.azure.remoterendering.graphicsbinding)
* [C# GraphicsBindingWmrD3d11 class](/dotnet/api/microsoft.azure.remoterendering.graphicsbindingwmrd3d11)
* [C# GraphicsBindingSimD3d11 class](/dotnet/api/microsoft.azure.remoterendering.graphicsbindingsimd3d11)
* [C++ RemoteRenderingInitialization struct](/cpp/api/remote-rendering/remoterenderinginitialization)
* [C++ GraphicsBinding class](/cpp/api/remote-rendering/graphicsbinding)
* [C++ GraphicsBindingWmrD3d11 class](/cpp/api/remote-rendering/graphicsbindingwmrd3d11)
* [C++ GraphicsBindingSimD3d11 class](/cpp/api/remote-rendering/graphicsbindingsimd3d11)

## Next steps

* [Camera](../overview/features/camera.md)
* [Late stage reprojection](../overview/features/late-stage-reprojection.md)
* [Tutorial: Viewing remotely rendered models](../tutorials/unity/view-remote-models/view-remote-models.md)