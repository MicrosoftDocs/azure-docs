---
title: SDK concepts
description: Overview of the SDK concepts and links to sub-chapters
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# SDK concepts

This chapter explains some high-level concepts of the Remote Rendering API.

## System Initialization

Before any action can be performed in Azure Remote Rendering, the system must be initialized. ```RemoteManagerStatic.StartupRemoteRendering``` will start the system. When `StartupRemoteRendering` initializes Azure Remote Rendering, the rendering mode, the coordinate system for the host engine, and a string identifying the host engine must be provided via the `ClientInit` structure. Call `RemoteManagerStatic.StartupRemoteRendering` before any holographic APIs are called.

In its initialization, coordinate system conventions for the forward, right, and up vector must be set via ```ClientInit.up, forward, right```. The up/forward/right convention informs the Remote Rendering service of the host engine's expected 3d convention. Hosts should always work in their native coordinate space. Azure Remote Rendering converts user input to its internal convention inside the SDK.

When remote rendering is no longer needed by an application, ```RemoteManagerStatic.ShutdownRemoteRendering``` should be called to deinitialize the system. ```RemoteManagerStatic.ShutdownRemoteRendering``` will invalidate any outstanding RemoteRendering objects.

## Session management

A session is composed on an ```AzureFrontend``` class which contains the credential information required to perform ARR API calls, create new ARR runtimes in Azure  and open existing ARR runtimes.  Once an ```AzureFrontend``` class has been initialized with account credentials, an ```AzureSession``` can either be created or a previously created session can be opened.

```AzureFrontend.CreateRenderingSessionAsync``` will create a new VM on the Azure service.

This VM will transition from the ```Starting``` state to the ```Ready``` state over a number of minutes. Once the VM is in the ```Ready``` state,  ```AzureSession.ConnectToRuntime``` can be called to connect to the ARR runtime:

``` cs

    // Initialize the runtime
    ClientInit clientInit = new ClientInit();

    // fill out clientInit parameters...
    RemoteManager.StartupRemoteRendering(clientInit);


    AzureFrontendAccountInfo accountInfo = new AzureFrontendAccountInfo();
    // Fill out account details...

    AzureFrontend frontend = new AzureFrontend(accountInfo);
    AzureSession session = await frontend.CreateRenderingSessionAsync(sessionCreationParams).AsTask();

    RenderingSessionProperties sessionProperties = null;
    while (true)
    {
        sessionProperties = await session.GetPropertiesAsync().AsTask();
        if( sessionProperties.Status != RenderingSessionStatus.Starting &
            sessionProperties.Status != RenderingSessionStatus.Unknown)
        {
            break;
        }
    }

    if( sessionProperties.Status != RenderingSessionStatus.Ready)
    {
        // Do some error handling and either terminate or retry.
    }

    // Connect to server
    Result connectResult = session.ConnectToRuntime(new ConnectToRuntimeParams()).AsTask();

    // Connected!

    // Disconnect
    session.DisconnectFromRuntime();

    // Decommision VM
    await session.StopAsync().AsTask();

    // Close connection
    RemoteManager.ShutdownRemoteRendering();
```

The above code snippets creates a new session on Azure and, once the session is ready, connects to the runtime on the VM to stream images.

Multiple ```AzureFrontend``` and ```AzureSession``` instances can be maintained, manipulated, and queried from code. But, only a single ```AzureSession``` may be connected to a runtime at a time. If a second ```AzureSession.ConnectToRuntime``` is called by a different ```AzureSession``` instance, the call will fail.

> [!IMPORTANT]
> Only a single ```AzureSession``` may be connected to a runtime at a time.

The lifetime of a virtual machine is not tied to the ```AzureFrontend``` instance or the ```AzureSession``` instance. ```AzureSession.StopAsync``` must be called to decommission a virtual machine.

As a virtual machine may persist for multiple application runs, the persistent Session ID can be queried via `AzureSession.SessionUUID()` and cached locally. With the Session ID, an application can call `AzureFrontend.OpenSession` to bind to that session.

```AzureSession.Actions``` will return an instance of ```RemoteManager.``` ```RemoteManager``` contains the member functions to load content, manipulate content, and query information about the rendered scene. A ```RemoteManager```'s functionality is only available if ```AzureSession.IsConnected```.

After connecting, content can be loaded on the remote server via ```AzureSession.Actions.LoadModelAsync```. ```LoadModelAsync``` returns an asynchronous object which, if successful, contains an ```Entity``` representing the root of the loaded asset.

The remote server will never alter the state of client-side data. All mutations of data (transform updates, load requests, and other options available in the client-side API) must be performed by the client application. An action will immediately update the client state.

> [!NOTE]
> The remote server will never alter the state of data.

Messages to the server are buffered locally until  `AzureSession.Actions.Update` method is called. `Update` is responsible for pushing all pending messages to the server and for dispatching responses from the server back to the client.

Data does not persist on an `AzureSession` between connections. On disconnect, all existing data will be flushed from the local `AzureSession.Actions` and the remote server. For example, if you call `LoadModel` on a remote rendering instance, the model will exist in the Remote Rendering runtime. If the application then disconnects and then reconnects to the same session, the model will no longer be available and must be loaded again.

Any remote rendering objects that exist in the application after disconnect or from a previous connection are invalid.

The lifetime of a message from the host engine to the remote engine can be visualized as:

![Call Lifetime](./media/call-lifetime.png)

## Notes on Unity

Unity uses a special initialization function to bind to Unity's coordinate system which can be found in the [Unity docs](./sdk-unity-concepts.md).

## Asynchronous Operations and Loading Data

Data can be loaded through asynchronous APIs. Models that have been [converted](../conversion/conversion-rest-api.md) can be loaded through the following APIs:

```cs
    LoadModelAsync _pendingLoadTask = null;

    void SampleLoadModel(string modelId, Entity parent = null)
    {
        AzureSession session = GetConnectedSession();

        _pendingLoadTask = session.Actions.LoadModelAsync(new LoadModelParams(modelId, parent));
        _pendingLoadTask.Completed += (LoadModelAsync res) =>
        {
            if(async.IsRanToCompletion)
            {
                //Do things with async.Result
            }

            _pendingLoadTask = null;
        };
    }
```

A reference to an asynchronous operation must be held until the application is done with it. If the application uses the Completed event on the async, then the async must be held alive by the application until Completed has finished.

Asynchronous return an asynchronous object where Completed and ProgressChanged callbacks can be registered. Furthermore all asynchronous objects have an ```AsTask``` member function to allow the ```await``` pattern.

C# sample code using ```await``` keyword:

```cs
void async SampleLoadModel(string modelId)
{
    AzureSession session = GetConnectedSession();

    LoadModelResult result = await session.Actions.LoadModelAsync(new LoadModelParams(modelId, parent)).AsTask();

    Entity root = result.Root;
}

```

### Threading

All asynchronous calls from `Actions` and `Entity` are completed during the `AzureSession.Actions.Update`. [Azure Frontend APIs](../azure/authentication.md) are completed in a background thread.

### Built-in and external resources

Azure Remote Rendering contains some built-in resources, which can be loaded by prepending their respective identifier with `builtin://` during the call to `AzureSession.Actions.LoadXXXAsync()`. These resources are listed with feature related to them, for example see [Sky](../sdk/features-sky.md)

Besides these built-in resources, the user may also use resources from external storage by specifying their blob storage URI. URIs are most frequently represented as a SAS URI to a [converted model](../conversion/conversion-rest-api.md) in blob storage.

## Objects and Lifetime Management

[Components](../sdk/concepts-components.md) and [Entities](../sdk/concepts-entities.md) are unique objects with explicit lifetime management. Both objects have a `Destroy()` member function that will destroy the object when it can be freed from the remote rendering runtime. `Entity.Destroy()` will destroy the entity, its children, and all of its components.

The lifetime of these objects are not related to the lifetime of the user object representation such as the `Entity` class in C#. `Destroy` must be called to deallocate and remove the internal representation. The lifetimes are separate so that the user can work on smaller sections of large models in a less efficient user representation, while the compressed representation is stored inside the SDK.

## <span id="resources">Resources and Lifetime Management

[Meshes](../sdk/concepts-meshes.md), [Materials](../sdk/concepts-materials.md) and [Textures](../sdk/concepts-textures.md) are shared resources that are reference counted, which means their lifetime is managed by their reference count, rather than explicit ```Destroy``` method used for Entities and Components. When the resource is not assigned anywhere in the scene tree (for example, Mesh to a MeshComponent) and the user does not hold a reference to the resource with an instance of the Mesh class, then the resource is destroyed in the API on both client and server. The server will then release the native resource and free the memory.

## General Lifetime Management

All API objects lifetime is bound to a connection. On disconnect all resources and objects are destroyed on both the client and the server. The log can be checked for information about unreleased resources that were destroyed.

## Features

* [Render modes](../sdk/concepts-render-mode.md)
* [Entities](../sdk/concepts-entities.md)
* [Components](../sdk/concepts-components.md)
* [Meshes](../sdk/concepts-meshes.md)
* [Materials](../sdk/concepts-materials.md)
* [Textures](../sdk/concepts-textures.md)
* [Lights](../sdk/features-lights.md)
* [Spatial bounds](../sdk/concepts-spatial-bounds.md)
* [Ray cast queries](../sdk/concepts-spatial-queries.md)
* [Sky](../sdk/features-sky.md)
* [Cut planes](../sdk/features-cut-planes.md)
* [Override hierarchical state](../sdk/features-override-hierarchical-state.md)
* [Outline rendering](../sdk/features-outlines.md)
* [Single sided rendering](../sdk/concepts-single-sided-rendering.md)
* [Graphics binding](../sdk/concepts-graphics-binding.md)
