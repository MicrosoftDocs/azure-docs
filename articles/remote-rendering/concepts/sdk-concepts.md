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

## Session management

A session is composed on an ```AzureFrontend``` class which contains the credential information required to perform ARR API calls and connect to ARR Sessions. Once an ```AzureFrontend``` class has been initialized with account credentials, an ```AzureSession``` can either be created or a previously created session can be opened.

```AzureFrontend.CreateRenderingSessionAsync``` will create a new VM on the Azure service. 

This VM will transition from the ```Starting``` state to the ```Ready``` state over a number of minutes. Once the VM is in the ```Ready``` state, a ```RemoteManager``` instance can connect:

``` cs

    AzureFrontendAccountInfo accountInfo = new AzureFrontendAccountInfo();
    // Fill out account details...

    AzureFrontend frontend = new AzureFrontent(accountInfo);
    AzureSession session = await frontend.CreateRenderingSessionAsync(sessionCreationParams).AsTask();

    RRRenderingSessionProperties sessionProperties = null;
    while (true)
    {
        sessionProperties = await session.GetRenderingSessionPropertiesAsync().AsTask();
        if( sessionProperties.Status != ARRRenderingSessionStatus.Starting &
            sessionProperties.Status != ARRRenderingSessionStatus.Unknown)
        {
            break;
        }
    }

    if( sessionProperties.Status != ARRRenderingSessionStatus.Ready)
    {
        // Do some error handling and either terminate or retry.
    }

    // Initialize the remote manager
    RRInterface.ClientInit clientInit = new RRIntrface.ClientInit();
    RemoteManager.InitializeManager(clientInit);

    // Connect to server
    RemoteManager.Connect(sessionProperties.Hostname, frontend);

    // Close connection 
    RemoteManager.ShutdownManager();
```

The above code snippets creates a new session on Azure and, once the session is ready, connects the runtime to the VM to begin to stream images and manipulate content.

With regard to lifetime, the ```AzureFrontend``` manages accounts and VMs in Azure and the ```RemoteManager``` manages a specific connection to a VM. A single VM can only have either zero or one active connection to it at a time.

The lifetime of a VM is not tied to the ```AzureFrontend``` class or the ```AzureSession``` class. ```AzureSession.StopRenderingSessionAsync``` must be called. 
Session ID can be queried via `AzureSession.GetSessionId()` and cached locally, in case when application experienced unexpected termination the connection can be restored via call to `AzureFrontend.OpenSession`.

When finished, ```AzureFrontend``` and ```AzureSession``` objects must be manually disposed.

The ```RemoteManager``` class is responsible for connecting to the server, sending requests, sending object updates, and receiving responses from the server. 

In its handshake, the ```RemoteManager``` negotiates a coordinate system transform between the host engine and the remote engine to ensure the host can work in its native coordinate space.

After the initial load of an asset, the server treats its data as read-only. The RemoteRenderingClient buffers all pending updates for the remote engine until its `Update` method is called. `Update` is responsible for pushing messages to the server and for dispatching responses from the server back to the client.

The lifetime of a message from the host engine to the remote engine can be visualized as:

![Call Lifetime](./media/call-lifetime.png)

Only a single ```RemoteManager``` can exist at a time in the program. This instance can connect and disconnect to a RemoteRendering session (the same VM or different VMs) multiple times during its lifetime. No data persists on the client between sessions except for the initialization data (coordinate system, logging pointers). On disconnect, all existing data will be flushed from the RemoteRenderingClient.

## Notes on C#

C# uses a static RemoteManager instance. At program startup, RemoteManager.InitializeManager should be called and on program exit RemoteManager.ShutdownManager should be called.

``` cs
RRInterface.ClientInit clientInit = new RRInterface.ClientInit();

RemoteManager.InitializeManager(clientInit);
RemoteManager.Connect, etc.

RemoteManager.ShutdownManager();
```

Unity uses a special initialization function to bind to Unity's coordinate system which can be found in the [Unity docs](./sdk-unity-concepts.md).

RemoteManager events can be listened to before initialization and connection status can be queries, but all other function calls will throw an exception. Once initialized, functions can be freely called, although all but Connect() will fail with NoConnection if called before Connect().

## Loading Data

Data can be loaded through asynchronous APIs.  Models that have been [ingested](../how-tos/ingest-models.md) can be loaded through the following APIs:

C++:

``` cpp

void sampleLoadModel(RemoteRenderingClient& client, const char* modelId, ObjectId parentId = ObjectId_Invalid)
{
    client.LoadModelAsync(LoadModelCInfo(modelId, parentId), [](ARRResult error, ObjectId rootId)
    {
            if( err == ARRResult::Success)
            {
                // Do things with the rootId
            }
    }, ARRThreadCompletionHint::UpdateThread);
}

```

C#:

```cs
    void SampleLoadModel(string modelId, ObjectId parentId = Constants.ObjectId_Invalid)
    {
        RemoteManager.LoadModelAsync(new LoadModelParams(modelId, parentId)).Completed += (IAsync<uint> async) =>
        {
            if(async.IsRanToCompletion)
            {
                //Do things with async.Result
            }
        };
    }
```

Related asynchronous C# functions return an ```IAsync<Result>``` object where Completed and ProgressChanged callbacks can be registered. Furthermore the ```IAsync<Result>``` object has a ```AsTask``` member function to impose the ```await``` pattern.

C# sample code using ```await``` keyword:

```cs
void async SampleLoadModel(string modelId)
{
    IAsync<ObjectId> loadTask = RemoteManager.LoadModelAsync(modelId);
    ObjectId id = await loadTask.AsTask();
    var gameObject = RemoteManager.GetEntity(id);
}

```

### Built-in and external resources

Azure Remote Rendering contains some built-in resources, which can be loaded by prepending their respective identifier with `builtin://` during the call to `RemoteManager.LoadXXXAsync()`. These resources are listed with feature related to them, for example see [Sky](../sdk/features-sky.md)

Besides these built-in resources, the user may also use resources from external storage by specifying the respective web URI as the identifier. This way, resources can be downloaded from Azure blob storages and other http-accessible locations.  URIs are more frequently represented as a SAS URI to an ingested model in blob storage (see [Ingesting Models](../how-tos/ingest-models.md#ingested)).

## Resources
[Meshes](../sdk/concepts-meshes.md), [Materials](../sdk/concepts-materials.md) and [Textures](../sdk/concepts-textures.md) are shared resources that are reference counted, which means their lifetime is managed by their reference count, rather than explicit ```Destroy``` method used for Entities and Components. When working with these types, the user has to take care to keep appropriate ReferenceHandle in C++ or the class instance in C# and not just the ObjectId. When the resource is not assigned anywhere in the scene tree (that is, Mesh to a MeshComponent) and the user does not hold a reference to it, the resource is destroyed in the API on both client and server. Server will then release the native resource and free the memory.

All API objects life is tied to ```RemoteManager``` and connection so no matter the reference count all existing resources are destroyed when ```RemoteManager.ShutdownManager``` or ```RemoteManager.Connect``` is called. The log can be checked for information about unreleased resources that were destroyed.

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
