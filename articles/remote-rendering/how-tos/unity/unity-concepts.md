---
title: Unity SDK Concepts
description: Base concepts for the Unity integration
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Unity SDK concepts

Due to the nature of integrating into a third-party engine, there are some special considerations when interacting with Azure remote rendering in Unity.

## Session management

```RemoteManagerUnity.Initialize(RemoteUnityClientInit)``` should be called instead of `RemoteManager.StartRemoteRendering.` If ```RemoteManagerUnity.Initialize``` has not been called, the system will not be capable of connecting or rendering content.

If ```RemoteManager.StartRemoteRendering``` or ```RemoteManagerUnity.Initialize``` has already been called, an exception will be thrown on subsequent calls.

`RemoteUnityClientInit` initializes the session using Unity's coordinate system and initialize the graphics system for rendering into a Unity application.

After an AzureSession has been created and chosen as the primary rendering session, it must be registered with ```RemoteManagerUnity``` by calling ```RemoteManagerUnity.CurrentSession = session```. `ARRServiceUnity` is provided to streamline this process.

```RemoteManagerUnity``` emits a few events for when its session state changes via ```RemoteManagerUnity.OnSessionUpdate```:

* SessionSet: Emitted during the assignment of ```RemoteManagerUnity.CurrentSession``` after the internal reference has been assigned.
* SessionRemoved: Emitted when a previous session is removed during ```RemoteManagerUnity.CurrentSession```. SessionRemoved is emitted before the new session has been assigned.
* SessionConnected: Emitted once the registered session successfully connects to the remote renderer. The application is still responsible for calling `AzureSession.ConnectToRuntime`. 
* SessionDisconnected: Emitted if the connection to the session has been lost.

On application shutdown, ```RemoteManager.ShutdownRemoteRendering()``` should be called.

``` cs
RemoteUnityClientInit clientInit = new RemoteUnityClientInit(Camera.main);

RemoteManagerUnity.InitializeManager(clientInit);

// Create a frontend
AzureFrontend frontend = createFrontendForMyAccount();

AzureSession session = await frontend.CreateNewRenderingSessionAsync(new RenderingSessionCreationParams(RenderingSessionVmSize.Standard, 0, 30)).AsTask();

RemoteManagerUnity.CurrentSession = session;

session.ConnectToRuntime();

/// When connected, load and modify content

RemoteManager.ShutdownManager();
```

### ARRServiceUnity

```ARRServiceUnity``` is an optional component to perform session management in a Unity game session. It contains options to automatically stop its session when the application is exiting or play mode is exited in the Unity editor as well as automatically renew the session lease if the application is running.

A local cache of the session properties can be accessed through `LastProperties`, which will be updated at a user specified interval.

```ARRServiceUnity``` can only have a single session at a time. It will register the session with ```RemoteManagerUnity``` on the user's behalf.

```ARRServiceUnity``` contains a number of events:
* OnSessionEnded: Emitted when the session has ended.
* OnSessionStarted: Emitted when the session has been created.
* OnSessionStatusChange: Emitted when a session state change has been detected.

`ARRServiceUnity` must be initialized with `ARRServiceUnity.Initialize(AzureFrontendAccountInfo)`.

## Unity GameObjects and Azure remote rendering Entities

Unity will lose performance if too many GameObjects are in the scene, yet Azure Remote Rendering content is often dense and complex. By default, an Azure Remote Rendering entity will have no Unity GameObject representation, but an on-demand version can be created with the extension method ```Entity.GetOrCreateGameObject(UnityCreationMode)```. ```Entity.GetOrCreateGameObject``` has a single argument of type UnityCreationMode that controls whether or not MonoBehaviors should be created for each Azure Remote Rendering component. In general, UnityCreationMode should be set to ```DoNotCreateUnityComponents``` when possible to avoid additional performance overhead of MonoBehaviors.

As an example for loading a model and, on the load completion, creating a unity game object from the root:

```cs
    LoadModelAsync _pendingLoadTask = null;
    void LoadModel()
    {
        _pendingLoadTask = RemoteManagerUnity.CurrentSession.Actions.LoadModelAsync("builtin://UnitySampleModel");
            
        _pendingLoadTask.Completed += (LoadModelAsync res) =>
        {
            var gameObject = res.Result.Root?.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);
            _pendingLoadTask = null;
        };
        // also listen to progress updates: 
        _pendingLoadTask.ProgressChanged += (LoadModelAsync res) =>
        {
            // progress is a fraction in [0..1] range 
            int percentage = (int)(res.Progress * 100.0f); 
            // do something...
            // Since the updates are triggered by the main thread, we may access unity objects here.
        }
    }

```

Using Unity coroutines:

```cs
LoadModelAsync _pendingLoadTask = null;
IEnumerator SampleLoadModel(string modelUrl)
{
    _pendingLoadTask = RemoteManagerUnity.CurrentSession.Actions.LoadModelAsync(modelUrl);
    while (!_pendingLoadTask.IsCompleted)
    {
        int percentage = (int)(loadTask.Progress * 100.0f);
 
        yield return null;
    }
    if( !_pendingLoadTask.IsFaulted )
    {
        var gameObject = _pendingLoadTask.Result.Root?.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);
    }
    _pendingLoadTask = null;
}
```

Using the await pattern:

```cs
void async SampleLoadModel(string modelUrl)
{
    IAsync<ObjectId> loadTask = RemoteManager.LoadModelAsync(modelUrl);
    ObjectId id = await loadTask.AsTask();
    var gameObject = RemoteManager.GetEntity(id)?.GetOrCreateGameObject();
}

```

Creating the Unity GameObject will implicitly add a ```RemoteEntitySyncObject``` component to the GameObject. `RemoteEntitySyncObject` synchronizes the entity transform to the server. The default configuration of ```RemoteEntitySyncObject``` requires the user to explicitly call `RemoteEntitySyncObject.SyncToRemote` to synchronize the local Unity state of the object to the remote engine. An object can be automatically synchronized if the property `SyncEveryFrame` is enabled on ```RemoteEntitySyncObject```.

Objects in the Unity Editor with a ```RemoteEntitySyncObject``` can have the Azure Remote Rendering children instantiated and shown in Unity through the 'Show Children' button.

![RemoteEntitySyncObject](media/remote-entity-sync-object.png)

### Lifetime

The lifetime of an Azure remote rendering Entity and a Unity Game Object is coupled while they are bound. To destroy Unity GameObject without destroying the Azure Remote Rendering Entity ```RemoteEntitySyncComponent.Unbind()``` has to be called before destroying the Unity Game Object or extension function ```Entity.DestroyGameObject()``` can be used.

## Override SetFocusPoint

By default, the focus plane is computed by the remote app using the remotely rendered geometry. There are use cases however where this should be replaced by custom planes provided by the local application. Unfortunately the player cannot distinguish between manual calls to ```SetFocusPoint``` in user scripts and the default implementation provided by Unity. Accordingly, the user needs to set a global flag to indicate whether remote or local computation should be used. Scripts can set this flag via:

```cs
    AzureSession.GraphicsBinding.FocusPointReprojectionMode(FocusPointMode.UseRemoteFocusPoint); 
    AzureSession.GraphicsBinding.FocusPointReprojectionMode(FocusPointMode.UseLocalFocusPoint);
```

To switch to local mode, this function has to be called only once at the beginning, however the status can be changed at any point in time.

To retrieve the focus point from the remote side (regardless of the ```UnitySetUseLocalFocusPoint``` state), this function can be called from a script:

~~~~ cs
        Float3 position = new Float3(0,0,0);
        Float3 normal = new Float3(0, 0, 0);
        Float3 velocity = new Float3(0, 0, 0);
        validResult = session.GraphicsBinding.GetRemoteFocusPoint(out position, out normal, out velocity);
 ~~~~

Coordinates are returned in Unity space, the only thing to do is a conversion from Float3 to Vector3:

~~~~ cs
      Vector3 focusPos = CommonExtensions.toUnity(position);
~~~~

Prefabs/FocusPointVisMarker.prefab can be added to the scene to visualize the focus point through a small sphere that changes color based on the current focus point.

## Component creation

Unity components wrap Azure remote rendering components in MonoBehaviors. There are two ways to instantiate a Unity component:

The ARRComponent ```Create``` method:

```cs
    var component = new ARRCutPlaneComponent(); // e.g. ARRCutPlaneComponent
    component.Create(AzureSession);
```

For each component, there is additionally an extension method on the Unity GameObject to create a component of that type, for example, for the ```ARRHierarchicalStateOverrideComponent```, you can create an instance as:

```cs
    GameObject object = GetGameObject();
    object.CreateArrComponent<ARRHierarchicalStateOverrideComponent>(AzureSession);
```

This function takes in a valid, connected AzureSession as an argument. Both functions will fail if the component already exists on the GameObject or the AzureSession is not connected.

To either create a component or get an existing instance then ```EnsureArrComponent``` can be called:

```cs
    GameObject object = GetGameObject();
    object.EnsureArrComponent<ARRHierarchicalStateOverrideComponent>(AzureSession);
```

```EnsureArrComponent``` will return the component if it already exists, otherwise create a new instance of the component locally and remotely.
