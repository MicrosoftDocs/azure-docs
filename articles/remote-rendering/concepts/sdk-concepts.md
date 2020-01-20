---
title: SDK concepts
description: Overview of the SDK concepts and links to sub-chapters
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---

# SDK concepts

This chapter explains some high level concepts of the Remote Rendering API.

## System Initialization

Before any action can be performed in Azure Remote Rendering, the system must be initialized. ```RemoteManagerStatic.StartupRemoteRendering``` will start the system. When initializing the system, the rendering mode, the coordinate system for the host engine, and the host engine id must be specified. 

In its initialization, coordinate system conventions for the forward, right, and up vector must be set via ```ClientInit.up, forward, right```. This will inform the Remote Rendering service of the expected convention of 3d space of the host engine and ensure that the host can work in its native coordinate space.

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

    RRRenderingSessionProperties sessionProperties = null;
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

    // Close connection 
    RemoteManager.ShutdownRemoteRendering();
```

The above code snippets creates a new session on Azure and, once the session is ready, connects the runtime to the VM to begin to stream images and manipulate content.

While code can maintain, manipulate, and interact with multiple ```AzureFrontend``` and ```AzureSession``` instances, only a single ```AzureSession``` may be connected to a runtime at a time. If a second ```AzureSession.ConnectToRuntime``` is called by a different ```AzureSession``` instance, the call will fail.

The lifetime of a virtual machine is not tied to the ```AzureFrontend``` class or the ```AzureSession``` class. ```AzureSession.StopAsync``` must be called to decommission a virtual machine.

As a virtual machine may persist for multiple application runs, the persistent Session ID can be queried via `AzureSession.SessionUUID()` and cached locally. With the Session ID, an application can call `AzureFrontend.OpenSession` to bind to that session.

```AzureSession.Actions``` will return an instance of ```RemoteManager.``` ```RemoteManager``` contains the member functions to load content, manipulate content, and query information about the rendered scene. A ```RemoteManager```'s functionality is only available if ```AzureSession.IsConnected```.

After connecting, content can be loaded on the remote server via ```AzureSession.Actions.LoadModelAsync```. ```LoadModelAsync``` returns an asynchronous object which, if successful, contains an ```Entity``` representing the root of the loaded asset.

The remote server will never alter the state of clientside data. All mutations of data (transform updates, load requests, and other options available in the clientside API) must be performed by the client application. An action will immediately update the client state.

Messages to the server are buffered locally until  `AzureSession.Actions.Update` method is called. `Update` is responsible for pushing all pending messages to the server and for dispatching responses from the server back to the client.

Data does not persist on an `AzureSession` between connections. On disconnect, all existing data will be flushed from the local `AzureSession.Actions` and the remote server. For example, if you call `LoadModel` on a remote rendering instance, the model will exist in the Remote Rendering runtime. If the application then disconnects from the session and reconnects to the same session, the model will no longer be available and must be loaded again.

Any remote rendering objects that still exist in the user's process space after the disconnect or from a previous connection will be invalid.

The lifetime of a message from the host engine to the remote engine can be visualized as:

![Call Lifetime](./media/call-lifetime.png)

## Notes on Unity

Unity uses a special initialization function to bind to Unity's coordinate system which can be found in the [Unity docs](./sdk-unity-concepts.md).

## Asynchronous Operations and Loading Data

Data can be loaded through asynchronous APIs.  Models that have been [ingested](../how-tos/ingest-models.md) can be loaded through the following APIs:

C#:

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

Related asynchronous C# functions return an asynchronous object where Completed and ProgressChanged callbacks can be registered. Furthermore all asynchronous objects have an ```AsTask``` member function to impose the ```await``` pattern.

C# sample code using ```await``` keyword:

```cs
void async SampleLoadModel(string modelId)
{
    AzureSession session = GetConnectedSession();

    LoadModelResult result = await session.Actions.LoadModelAsync(new LoadModelParams(modelId, parent)).AsTask();

    Entity root = result.Root;
}

```

### Built-in and external resources

Azure Remote Rendering contains some built-in resources, which can be loaded by prepending their respective identifier with `builtin://` during the call to `AzureSession.Actions.LoadXXXAsync()`. These resources are listed with feature related to them, for example see [Sky](../sdk/features-sky.md)

Besides these built-in resources, the user may also use resources from external storage by specifying the respective web URI as the identifier. This way, resources can be downloaded from Azure blob storages and other http-accessible locations.  URIs are more frequently represented as a SAS URI to an ingested model in blob storage (see [Ingesting Models](../how-tos/ingest-models.md#ingested)).

## Objects and Lifetime Management
[Components](../sdk/concepts-components.md) and [Entities](../sdk/concepts-entities.md) are unique objects with explicit lifetime manager. Both objects have a `ObjectBase.Destroy()` member function that will destroy the object when it can be freed from the remote rendering runtime. `Entity.Destroy()` will destroy the entity, its children, and all of its components.

The lifetime of these objects are not related to the lifetime of the user object representation, such as the `Entity` class.

## <span id="resources">Resources and Lifetime Management
[Meshes](../sdk/concepts-meshes.md), [Materials](../sdk/concepts-materials.md) and [Textures](../sdk/concepts-textures.md) are shared resources that are reference counted, which means their lifetime is managed by their reference count, rather than explicit ```Destroy``` method used for Entities and Components. When the resource is not assigned anywhere in the scene tree (that is, Mesh to a MeshComponent) and the user does not hold a reference to the resource, then the resource is destroyed in the API on both client and server. Server will then release the native resource and free the memory.

## General Lifetime Management
All API objects life is tied to a connection, on disconnect all resources and objects are destroyed on both the client and the server. The log can be checked for information about unreleased resources that were destroyed.

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
