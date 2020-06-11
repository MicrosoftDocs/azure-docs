---
title: Working with remote entities in Unity
description: Tutorial that shows how to work with ARR entities.
author: florianborn71
ms.author: flborn
ms.date: 02/01/2020
ms.topic: tutorial
---

# Tutorial: Working with remote entities in Unity

[Tutorial: Setting up a Unity project from scratch](project-setup.md) showed how to configure a new Unity project to work with Azure Remote Rendering. In this tutorial, we have a look at the most common functionality that every ARR user needs.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Pick objects using ray casts.
> * Override object states such as tint color, selection state, and visibility.
> * Delete remote entities.
> * Move remote entities around.
> * Use cut planes to look inside objects.

## Prerequisites

* This tutorial builds on top of [Tutorial: Setting up a Unity project from scratch](project-setup.md).

> [!TIP]
> The [ARR samples repository](https://github.com/Azure/azure-remote-rendering) contains prepared Unity projects for all tutorials in the *Unity* folder, that you can use as reference.

## Pick objects

We want to interact with objects, so the first thing we need, is picking objects under the mouse cursor.

Create a [new script](https://docs.unity3d.com/Manual/CreatingAndUsingScripts.html) called **RemoteRaycaster** and replace its entire content with the code below:

```csharp
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

[RequireComponent(typeof(ARRServiceUnity))]
public class RemoteRaycaster : MonoBehaviour
{
    public double MaxDistance = 30.0;

    private ARRServiceUnity arrService = null;

    private void Awake()
    {
        arrService = GetComponent<ARRServiceUnity>();
    }

    private async Task<Entity> RemoteRayCast(Vector3 origin, Vector3 dir)
    {
        Entity entity = null;

        var raycast = new RayCast(origin.toRemotePos(), dir.toRemoteDir(), MaxDistance, HitCollectionPolicy.ClosestHit);

        var hits = await arrService.CurrentActiveSession.Actions.RayCastQueryAsync(raycast).AsTask();

        if (hits != null)
        {
            foreach (var hit in hits)
            {
                var hitEntity = hit.HitEntity;
                if (hitEntity == null)
                {
                    continue;
                }

                entity = hitEntity;
                break;
            }
        }

        return entity;
    }

    private void Update()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        Vector3 position = Input.mousePresent ? Input.mousePosition : new Vector3(Screen.width / 2, Screen.height / 2, 0);
        var ray = Camera.main.ScreenPointToRay(position);

        Raycast(ray.origin, ray.direction);
    }

    public async void Raycast(Vector3 origin, Vector3 direction)
    {
        var entity = await RemoteRayCast(origin, direction);
        if (entity != null)
        {
            Debug.Log("Object Hit: " + entity.Name);
        }
    }
}
```

Add this component to the *RemoteRendering* object in your scene.

> [!WARNING]
>
> The *RemoteRaycaster* component requires an *ARRServiceUnity* component to be attached to the same object. *ARRServiceUnity* is a helper class to access some ARR functionality more easily. However, there can only be a single instance of this component in the scene. Therefore, be sure to add all components that require *ARRServiceUnity* to the same GameObject.
> If you want to access ARR functionality from multiple game objects, either add the *ARRServiceUnity* component only to one of them and reference that in the other scripts, or access the ARR functionality directly.

Press play, connect to a session and load a model. Now point at objects in the scene and watch the console output. It should print the object name of each part that you hover over.

## Highlight objects

As a next step, we want to give visual feedback, which parts of a model the user is pointing at. To achieve this, we attach a [HierarchicalStateOverrideComponent](../../overview/features/override-hierarchical-state.md) to the entity that we picked. This component can be used to enable or disable various features on an object. Here we use it to set a tint color and enable [outline rendering](../../overview/features/outlines.md).

Create another script file called **RemoteModelEntity** and replace its content with the following code:

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;

public class RemoteModelEntity : MonoBehaviour
{
    public Color HighlightColor = new Color(1.0f, 0.0f, 0.0f, 0.1f);

    public Entity Entity => localSyncObject != null ? localSyncObject?.Entity : null;

    private RemoteEntitySyncObject localSyncObject = null;
    private ARRHierarchicalStateOverrideComponent localStateOverride = null;

    public void OnEnable()
    {
        localSyncObject = GetComponent<RemoteEntitySyncObject>();
        localStateOverride = GetComponent<ARRHierarchicalStateOverrideComponent>();

        if (localStateOverride == null)
        {
            localStateOverride = gameObject.AddComponent<ARRHierarchicalStateOverrideComponent>();
            var remoteStateOverride = localSyncObject.Entity.FindComponentOfType<HierarchicalStateOverrideComponent>();

            if (remoteStateOverride == null)
            {
                // if there is no HierarchicalStateOverrideComponent on the remote side yet, create one
                localStateOverride.Create(RemoteManagerUnity.CurrentSession);
            }
            else
            {
                // otherwise, bind our local stateOverride component to the remote component
                localStateOverride.Bind(remoteStateOverride);
            }
        }

        localStateOverride.RemoteComponent.TintColor = HighlightColor.toRemote();
    }

    public void OnDisable()
    {
        SetStateOverride(false);

        if (localStateOverride.IsComponentValid)
        {
            localStateOverride.RemoteComponent.Enabled = false;
            localStateOverride.enabled = false;
        }
    }

    private void SetStateOverride(bool on)
    {
        if (localStateOverride.IsComponentValid)
        {
            localStateOverride.RemoteComponent.UseTintColorState = on ? HierarchicalEnableState.ForceOn : HierarchicalEnableState.InheritFromParent;
            localStateOverride.RemoteComponent.SelectedState = on ? HierarchicalEnableState.ForceOn : HierarchicalEnableState.InheritFromParent;
        }
    }

    public void SetFocus(bool on)
    {
        SetStateOverride(on);
    }
}
```
> [!CAUTION]
> Do not assign this script to any Unity game object as it will be assigned programmatically by the code below.

Next up, we have to extend our *RemoteRaycaster* to add the *RemoteModelEntity* component to the object that we just picked.

Add the following code to the **RemoteRaycaster** implementation and remove the duplicate functions:

```csharp
    private RemoteModelEntity focusedModel = null;

    public async void Raycast(Vector3 origin, Vector3 direction)
    {
        var remoteEntity = await RemoteRayCast(origin, direction);

        if (focusedModel != null)
        {
            if (focusedModel.Entity == remoteEntity)
            {
                // picked the same object as before
                return;
            }

            ClearFocus();
        }

        if (remoteEntity == null)
        {
            // picked no object at all
            return;
        }

        // get the instance of a Unity GameObject for the ARR entity
        var entityGO = remoteEntity.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);

        // ensure the game object has the RemoteModelEntity component
        focusedModel = entityGO.GetComponent<RemoteModelEntity>();
        if (focusedModel == null)
        {
            focusedModel = entityGO.AddComponent<RemoteModelEntity>();
        }

        focusedModel.SetFocus(true);
    }

    private void ClearFocus()
    {
        focusedModel.SetFocus(false);
        focusedModel = null;
    }
```

Run your project and point at a model, you should see it getting a red tint and a white selection outline.

## Isolate the selected object

Another use of the [HierarchicalStateOverrideComponent](../../overview/features/override-hierarchical-state.md) is the ability to override visibility. This enables you to isolate a selected object from the rest of the model. Open the **RemoteModelEntity** script, add the following code, and remove the duplicate functions:

```csharp
    private bool isolated = false;
    private HierarchicalStateOverrideComponent parentOverride = null;

    public void ToggleIsolate()
    {
        SetIsolated(!isolated);
    }

    public void SetIsolated(bool on)
    {
        if (localStateOverride == null || !localStateOverride.IsComponentValid || isolated == on)
        {
            return;
        }

        // find the top most parent object that has a HierarchicalStateOverrideComponent
        if (parentOverride == null)
        {
            var modelRoot = transform;

            while (modelRoot.parent != null)
            {
                modelRoot = modelRoot.parent;

                var parentSyncObject = modelRoot.GetComponent<RemoteEntitySyncObject>();

                var stateOverrideComp = parentSyncObject?.Entity.FindComponentOfType<HierarchicalStateOverrideComponent>();

                if (stateOverrideComp != null)
                {
                    parentOverride = stateOverrideComp;
                }
            }
        }

        if (parentOverride != null)
        {
            isolated = on;

            parentOverride.HiddenState = isolated ? HierarchicalEnableState.ForceOn : HierarchicalEnableState.InheritFromParent;
            localStateOverride.RemoteComponent.HiddenState = isolated ? HierarchicalEnableState.ForceOff : HierarchicalEnableState.InheritFromParent;
        }
    }

    public void SetFocus(bool on)
    {
        SetStateOverride(on);

        if (!on)
        {
            SetIsolated(false);
        }
    }
```

This code relies on having a state override component at the top-most object in the hierarchy, which makes all objects invisible. Then it overrides the visibility again at the selected object, to make that one object visible. Therefore, we need to create a state override component at the root object.

Open the **RemoteRendering** script and insert the code below at the top of the *LoadModel* function:

```csharp
    public async void LoadModel()
    {
        // create a root object to parent a loaded model to
        modelEntity = arrService.CurrentActiveSession.Actions.CreateEntity();
        arrService.CurrentActiveSession.Actions.CreateComponent(ObjectType.HierarchicalStateOverrideComponent, modelEntity);

        ...
    }
```

Finally we need a way to toggle visibility. Open the **RemoteRaycaster** script and replace the *Update* function:

```csharp
    private void Update()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

        Raycast(ray.origin, ray.direction);

        if (Input.GetMouseButtonDown(1) && focusedModel != null)
        {
            focusedModel.ToggleIsolate();
        }
    }
```

Run the code and right click on a part of the model. The rest of the model will disappear and only the highlighted piece will stay visible.

## Remove GameObject instances of remote entities

You may have noticed that the code keeps creating objects, but never cleans them up. This is also visible in the object hierarchy panel. When you expand the remote object hierarchy during simulation, you can see more and more objects appearing every time you hover over a new part of the model.

Having many objects in a scene negatively affects performance. You should always clean up objects that are not needed anymore.

Insert the code below into the **RemoteRaycaster** script and remove the duplicate functions:

```csharp
    private void ClearFocus()
    {
        focusedModel.SetFocus(false);
        CleanHierarchy(focusedModel.gameObject);
        focusedModel = null;
    }

    private void CleanHierarchy(GameObject focusedGO)
    {
        var sync = focusedGO?.GetComponent<RemoteEntitySyncObject>();
        if (sync == null || !sync.IsEntityValid)
        {
            return;
        }

        sync.Entity.DestroyGameObject(EntityExtensions.DestroyGameObjectFlags.DestroyEmptyParents | EntityExtensions.DestroyGameObjectFlags.KeepRemoteRoot);
    }
```

## Move objects

As a next step we want to move a selected object around. In the **RemoteRaycaster** script, insert this code and remove the duplicate function:

```csharp
    private Vector3 lastPosition = Vector3.zero;

    private void Update()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            return;
        }

        if (Input.GetMouseButton(0))
        {
            if (focusedModel)
            {
                // note: mousePosition is in 2D screen-space coordinates and has no relation with
                // the 3D object position. This just happens to work good enough for demonstration.
                var delta = Input.mousePosition - lastPosition;
                focusedModel.transform.position += delta * Time.deltaTime;
            }
        }
        else
        {
            Vector3 position = Input.mousePresent ? Input.mousePosition : new Vector3(Screen.width / 2, Screen.height / 2, 0);
            var ray = Camera.main.ScreenPointToRay(position);

            Raycast(ray.origin, ray.direction);

            if (Input.GetMouseButtonDown(1) && focusedModel != null)
            {
                focusedModel.ToggleIsolate();
            }
        }

        lastPosition = Input.mousePosition;
    }
```

> [!IMPORTANT]
> If you run this code, you will notice that nothing happens. That's because changing an object's transform does not automatically synchronize the state change to the server, for performance reasons. Instead, you either have to push this state change to the server manually, or you enable **SyncEveryFrame** on the *RemoteEntitySyncObject* component.

Open the **RemoteModelEntity** script and add this line:

```csharp
    public void OnEnable()
    {
        ...

        localSyncObject.SyncEveryFrame = true;
    }
```

Running the code again, you should be able to left-click on an object and drag it around.

## Add a cut plane

The final feature we want to try out in this tutorial, is using [cut planes](../../overview/features/cut-planes.md). A cut plane cuts away parts of rendered objects, such that you can look inside of them.

Create a new GameObject in the scene **CutPlane**. Create a new script and call it **RemoteCutPlane**. Add the component to the new GameObject.

Open the script file and replace its content with the following code:

```csharp
using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RemoteCutPlane : MonoBehaviour
{
    private ARRCutPlaneComponent localCutPlaneComponent = null;
    private RemoteEntitySyncObject remoteEntitySync = null;

    void Update()
    {
        if (!RemoteManagerUnity.IsConnected)
        {
            // can't do anything while we are not connected
            return;
        }

        if (localCutPlaneComponent == null)
        {
            localCutPlaneComponent = gameObject.CreateArrComponent<ARRCutPlaneComponent>(RemoteManagerUnity.CurrentSession);
        }

        if (remoteEntitySync == null)
        {
            remoteEntitySync = gameObject.GetComponent<RemoteEntitySyncObject>();
            remoteEntitySync.SyncEveryFrame = true;
        }

        localCutPlaneComponent.RemoteComponent.Normal = Axis.X;
        localCutPlaneComponent.RemoteComponent.FadeLength = 0.025f;
        localCutPlaneComponent.RemoteComponent.FadeColor = new Color4Ub(255, 128, 0, 255);
        localCutPlaneComponent.RemoteComponent.Enabled = true;
    }

    void OnDisable()
    {
        if (localCutPlaneComponent && localCutPlaneComponent.IsComponentValid)
        {
            localCutPlaneComponent.RemoteComponent.Enabled = false;
        }

        if (remoteEntitySync && remoteEntitySync.IsEntityValid)
        {
            remoteEntitySync.SyncEveryFrame = false;
        }
    }
}
```

When you run your code now, you should see how the model is cut open by the plane. You can select the *CutPlane* object and move and rotate it in the *Scene* window. You can toggle the cut plane on and off by disabling the cut plane object.

## Next steps

You now know the most important functionality for interacting with remote objects. In the next tutorial, we will have a look at customizing a scene's look.

> [!div class="nextstepaction"]
> [Tutorial: Changing the environment and materials](changing-environment-and-materials.md)
