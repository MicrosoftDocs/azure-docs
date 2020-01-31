---
title: Working with remote entities in Unity
description: Tutorial that shows how to work with ARR entities.
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 02/01/2020
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Tutorial: Working with remote entities in Unity

The [previous tutorial](tutorial-1-unity-project-setup.md) showed how to configure a new Unity project to work with Azure Remote Rendering. In this tutorial we will have a look at the most common functionality that every ARR user needs.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Be awesome.

## Prerequisites

* This tutorial builds on top of the [previous tutorial](tutorial-1-unity-project-setup.md).

## Pick objects

To be able to interact with objects in a scene, the first thing we want to do, is pick objects under the mouse cursor.

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

        var ray = Camera.main.ScreenPointToRay(Input.mousePosition);

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

When you now press play, connect to a session and load a model, you can point at objects in the scene and watch the console output. It should print the object name of each part that you hover over.

## Highlight objects

As the next step, we want to give visual feedback to the user, which parts of a model she is pointing at. To achieve this, we attach a [HierarchicalStateOverrideComponent](../sdk/features-override-hierarchical-state.md) to the remote entity that we picked. This component can be used to enable or disable various features on an object. Here we use it to set a tint color and enable [outline rendering](../sdk/features-outlines.md) on the picked object.

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

The next step is to extend our raycasting component to add our new RemoteModelEntity component to picked game objects. The idea is to add it to objects that we never picked before, and deactivate the state override when the user does not point at the object anymore.

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

            focusedModel.SetFocus(false);
            focusedModel = null;
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
```

Run your project and point at a model, you should see it getting a red tint and a white selection outline.

## Isolate the selected object

Another use of the [HierarchicalStateOverrideComponent](../sdk/features-override-hierarchical-state.md) is the ability to override visibility. This allows you to isolate a selected object from the rest of the model. Open the **RemoteModelEntity** script, add the following code and remove the duplicate functions:

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

This code relies on having a state override component at the top-most object in the hierarchy, which makes all objects invisible. Then it overrides the visibility again at the selected object, to make that one object visible. Therefore we need to create this state override component at the root object.

Open the **RemoteRendering** script and insert this at the top of the *LoadModel* function:

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








## Remove created GameObject Instances

By now, you may noticed under the Hierarchy panel, the remote model that represents the remote model, is growing with every object that gets focus. The more objects in the scene will negatively affect performance.

Below is a quick way to remove child nodes that are no longer required:

```csharp
    private void ClearFocus()
    {
        ...
        focusedModel.ResetFocus();

        CleanHierarchy(focusedModel.gameObject);

        focusedModel = null;
        ...
    }
```

```csharp
    private void CleanHierarchy(GameObject focusedGO)
    {
        var sync = focusedGO?.GetComponent<RemoteEntitySyncObject>();
        if (sync == null ||!sync.IsEntityValid)
        {
            return;
        }

        sync.Entity.DestroyGameObject(EntityExtensions.DestroyGameObjectFlags.DestroyEmptyParents | EntityExtensions.DestroyGameObjectFlags.KeepRemoteRoot);
    }
```






## Moving focused RemoteObjects

In the previous tutorial, the Unity GameObject transform was used to set an offset location for the model's root node. This was achieved using the RemoteEntitySyncObject SyncEveryFrame property.

This can also be done dynamically by using focus to determine which object is selected and using the mouse to move the object around:

```csharp
    private bool hasFocus = false;
```

```csharp
    public bool SetFocus()
    {
        ...

        hasFocus = true;

        ...
    }

    public void ResetFocus()
    {
        ...

        hasFocus = false;

        ...
    }
```

Knowing the object has focus, in the Update method, track the mouse button state and determine how much to move the object:

```csharp
    private Vector3 lastPosition = Vector3.zero;
```

```csharp
    private void Update()
    {
        if (!hasFocus)
        {
            return;
        }

        if (Input.GetMouseButton(0))
        {
            var curPosition = Input.mousePosition;
            if (lastPosition == Vector3.zero)
            {
                lastPosition = curPosition;
            }

            var delta = curPosition - lastPosition;

            lastPosition = curPosition;

            // update position
            transform.position = Vector3.Lerp(transform.position, transform.position + delta, Time.deltaTime * 0.75f);
        }
        else
        {
            lastPosition = Vector3.zero;
        }

        ...
    }
```

For a focused object, when you hold the mouse button down, you can move the object in the scene. The Ray caster Update method will need to be modified to prevent losing the focus when the mouse is down. Remove the call to Ray cast and replace with the following in the RemoteRaycaster.cs file:

```csharp
    private void Update()
    {
        ...

        if (Input.GetMouseButtonDown(0))
        {
            Raycast(ray.origin, ray.direction);
        }
        else if (!Input.GetMouseButton(0)) // held down this frame?
        {
            Raycast(ray.origin, ray.direction);
        }
    }
```

## Bounds of an entity

Modify the RemoveModelEntity.cs file. Having a Unity bounding box helps with localized physics collision detection. Using this method will only generate bounds for a single entity, not including its children. If a node has children, you would have to take that into account and expand this further.

```csharp
    private ARRMeshComponent meshComponent = null;
    private BoxCollider boxCollider = null;
```

```csharp
    private void OnEnable()
    {
        ...

        meshComponent = GetComponent<ARRMeshComponent>();
        if (meshComponent == null)
        {
            var mesh = syncObject.Entity.FindComponentOfType<MeshComponent>();
            if (mesh != null)
            {
                gameObject.BindArrComponent<ARRMeshComponent>(mesh);
                meshComponent = gameObject.GetComponent<ARRMeshComponent>();
            }
        }
        meshComponent.enabled = true;

        boxCollider = GetComponent<BoxCollider>();
        if (boxCollider == null)
        {
            boxCollider = gameObject.AddComponent<BoxCollider>();
        }
        boxCollider.enabled = true;
        boxCollider.center = meshComponent.RemoteComponent.Mesh.Bounds.toUnity().center;
        boxCollider.size = meshComponent.RemoteComponent.Mesh.Bounds.toUnity().size;
    }

    private void OnDisable()
    {
        ...

        if (meshComponent)
        {
            meshComponent.enabled = false;
        }

        if (boxCollider)
        {
            boxCollider.enabled = false;
        }
    }
```

## Cut plane

Create a new GameObject in the scene hierarchy and name it "RemoteCutPlane". Change its position to a point near the model root is. Create a new script and call it RemoteCutPlane.cs and add the component to the new GameObject.

Add these variables to track state and components that represent the clip plane on the server:

```csharp
    private bool cutEnabled = false;

    private ARRCutPlaneComponent cutPlaneComponent = null;

    private RemoteEntitySyncObject remoteEntitySync = null;
```

Add a function to create the cut plane object and its sync component:

```csharp
    private void ToggleCutPlane()
    {
        cutEnabled = !cutEnabled;

        if (cutPlaneComponent == null)
        {
            cutPlaneComponent = gameObject.CreateArrComponent<ARRCutPlaneComponent>(RemoteManagerUnity.CurrentSession);
            cutPlaneComponent.RemoteComponent.Normal = Axis.X;
            cutPlaneComponent.RemoteComponent.FadeLength = 0.025f;
            cutPlaneComponent.RemoteComponent.FadeColor = new ColorUb(255, 128, 0, 255);
        }

        if (remoteEntitySync == null)
        {
            remoteEntitySync = gameObject.GetComponent<RemoteEntitySyncObject>();
        }

        remoteEntitySync.SyncEveryFrame = cutEnabled;

        if (cutPlaneComponent != null && cutPlaneComponent.RemoteComponent.IsValid)
        {
            cutPlaneComponent.RemoteComponent.Enabled = cutEnabled;
        }
    }
```

To activate the clip plane, create a GUI button:

```csharp
#if UNITY_EDITOR
    private void OnGUI()
    {
        if (RemoteManager.IsConnected)
        {
            int y = Screen.height - 50;

            if (GUI.Button(new Rect(50, y, 175, 30), "Toggle Cut Plane"))
            {
                ToggleCutPlane();
            }
        }
    }
#endif
```

At this point, the cut plane is using an arbitrary plane direction along the x-axis, but may be difficult to see. Add an Update() function that will use the arrow keys to move and rotate the cut plane:

```csharp
    private void Update()
    {
        if (!RemoteManagerUnity.IsConnected || !cutEnabled)
        {
            return;
        }

        Vector3 movement = Vector3.zero;
        if (Input.GetKey(KeyCode.LeftArrow))
        {
            movement += Vector3.left;
        }

        if (Input.GetKey(KeyCode.RightArrow))
        {
            movement += Vector3.right;
        }

        UnityEngine.Quaternion rotation = UnityEngine.Quaternion.identity;
        if (Input.GetKey(KeyCode.UpArrow))
        {
            rotation *= UnityEngine.Quaternion.FromToRotation(transform.forward, transform.forward + Vector3.left);
        }

        if (Input.GetKey(KeyCode.DownArrow))
        {
            rotation *= UnityEngine.Quaternion.FromToRotation(transform.forward, transform.forward + Vector3.right);
        }

        // align the movement value to the objects rotation
        movement = transform.rotation * movement;

        transform.position = Vector3.Lerp(transform.position, transform.position + movement, Time.deltaTime * 0.5f);
        transform.rotation = UnityEngine.Quaternion.Slerp(transform.rotation, transform.rotation * rotation, Time.deltaTime * 0.5f);
    }
```

## Next steps

You now know the most frequently used methods for interacting with a scene. In the next tutorial, we will have a look at customizing a scenes look by modifying the sky map and materials on models.

> [!div class="nextstepaction"]
> [Tutorial: Changing the environment and materials](tutorial-3-changing-environment-and-materials.md)
