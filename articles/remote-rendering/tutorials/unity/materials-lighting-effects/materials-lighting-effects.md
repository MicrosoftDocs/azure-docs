---
title: Refining materials, lighting, and effects
description: Modify model materials and lighting. Add additional effects like outlining and cut planes.
author: michael-house
ms.author: v-mihous
ms.date: 04/09/2020
ms.topic: tutorial
---

# Tutorial: Refining materials, lighting, and effects

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Highlight and outline models and model components
> * Apply different materials to models
> * Slicing through models with cut planes
> * Simple animations for remotely rendered objects

## Prerequisites

* This tutorial builds on top of [Tutorial: Manipulating models](..\manipulate-models\manipulate-models.md).

## Highlighting and outlining

Providing visual feedback to the user is an important part of the user experience in any application. Azure Remote Rendering provides visual feedback mechanisms in the forms of [Hierarchical state overrides](../../../overview/features/override-hierarchical-state.md). The hierarchical state overrides are implemented with components attached to local instances of models, we learned to create these local instances in [Synchronizing the remote object graph into the Unity hierarchy](../manipulate-models/manipulate-models.md#synchronizing-the-remote-object-graph-into-the-unity-hierarchy).

We'll create a wrapper around the [**HierarchicalStateOverrideComponent**](https://docs.microsoft.com/dotnet/api/microsoft.azure.remoterendering.hierarchicalstateoverridecomponent) component. The **HierarchicalStateOverrideComponent** is the local script that controls the overrides on the remote entity. The [tutorial assets](../manipulate-models/manipulate-models.md#import-assets-used-by-this-tutorial) include an abstract base class called **BaseEntityOverrideController** which we'll extend to create the wrapper.

1. Create a new script named **EntityOverrideController** and replace its contents with the following code:

```csharp
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See LICENSE in the project root for license information.

using Microsoft.Azure.RemoteRendering;
using Microsoft.Azure.RemoteRendering.Unity;
using System;
using UnityEngine;

public class EntityOverrideController : BaseEntityOverrideController
{
    public override event Action<HierarchicalStates> OnFeatureOverrideChange;

    private ARRHierarchicalStateOverrideComponent localOverride;
    public override ARRHierarchicalStateOverrideComponent LocalOverride
    {
        get
        {
            if (localOverride == null)
            {
                localOverride = gameObject.GetComponent<ARRHierarchicalStateOverrideComponent>();
                if (localOverride == null)
                {
                    localOverride = gameObject.AddComponent<ARRHierarchicalStateOverrideComponent>();
                }

                var remoteStateOverride = TargetEntity.Entity.FindComponentOfType<HierarchicalStateOverrideComponent>();

                if (remoteStateOverride == null)
                {
                    // if there is no HierarchicalStateOverrideComponent on the remote side yet, create one
                    localOverride.Create(RemoteManagerUnity.CurrentSession);
                }
                else
                {
                    // otherwise, bind our local stateOverride component to the remote component
                    localOverride.Bind(remoteStateOverride);

                }
            }
            return localOverride;
        }
    }

    private RemoteEntitySyncObject targetEntity;
    public override RemoteEntitySyncObject TargetEntity
    {
        get
        {
            if (targetEntity == null)
                targetEntity = gameObject.GetComponent<RemoteEntitySyncObject>();
            return targetEntity;
        }
    }

    private HierarchicalEnableState ToggleState(HierarchicalStates feature)
    {
        HierarchicalEnableState setToState = HierarchicalEnableState.InheritFromParent;
        switch (LocalOverride.RemoteComponent.GetState(feature))
        {
            case HierarchicalEnableState.ForceOff:
            case HierarchicalEnableState.InheritFromParent:
                setToState = HierarchicalEnableState.ForceOn;
                break;
            case HierarchicalEnableState.ForceOn:
                setToState = HierarchicalEnableState.InheritFromParent;
                break;
        }

        return SetState(feature, setToState);
    }

    private HierarchicalEnableState SetState(HierarchicalStates feature, HierarchicalEnableState enableState)
    {
        if (GetState(feature) != enableState) //if this is actually different from the current state, act on it
        {
            LocalOverride.RemoteComponent.SetState(feature, enableState);
            OnFeatureOverrideChange?.Invoke(feature);
        }

        return enableState;
    }

    private HierarchicalEnableState GetState(HierarchicalStates feature) => LocalOverride.RemoteComponent.GetState(feature);

    public override void ToggleHidden() => ToggleState(HierarchicalStates.Hidden);

    public override void ToggleSelect() => ToggleState(HierarchicalStates.Selected);

    public override void ToggleSeeThrough() => ToggleState(HierarchicalStates.SeeThrough);

    public override void ToggleTint(Color tintColor)
    {
        LocalOverride.RemoteComponent.TintColor = tintColor.toRemote();
        ToggleState(HierarchicalStates.UseTintColor);
    }

    public override void ToggleDisabledCollision() => ToggleState(HierarchicalStates.DisableCollision);
}
```

**LocalOverride**'s main job is to create the link between itself and its `RemoteComponent`. The **LocalOverride** then allows us to set state flags on the local component, which are bound to the remote entity. The overrides and their states are described in the [Hierarchical state overrides](../../../overview/features/override-hierarchical-state.md) page. This implementation just toggles one state at a time. However, it's entirely possible to combine multiple overrides on single entities and to create combinations at different levels in the hierarchy. For example, combining `Selected` and `SeeThrough` on a single component would give it an outline while also making it transparent. Or setting the root entity `Hidden` override to `ForceOn` while making a child entity's `Hidden` override to `ForceOff` would hide everything except for the child entity with the override.

To easily apply the above states, we can modify the **RemoteEntityHelper** created previously.

1. Modify the **RemoteEntityHelper** class to implement the **BaseRemoteEntityHelper** abstract class. This will allow the use of a view controller provided in the Tutorial Assets. It should look like this when modified:\
`public class RemoteEntityHelper : BaseRemoteEntityHelper`
2. Override the required abstract methods using the following code:
```csharp
public override EntityOverrideController EnsureOverrideComponent(Entity entity)
{
var entityGameObject = entity.GetOrCreateGameObject(UnityCreationMode.DoNotCreateUnityComponents);
var overrideComponent = entityGameObject.GetComponent<EntityOverrideController>();
if (overrideComponent == null)
    overrideComponent = entityGameObject.AddComponent<EntityOverrideController>();
return overrideComponent;
}

public override void ToggleHidden(Entity entity)
{
var overrideComponent = EnsureOverrideComponent(entity);
overrideComponent.ToggleHidden();
}

public override void ToggleSelect(Entity entity)
{
var overrideComponent = EnsureOverrideComponent(entity);
overrideComponent.ToggleSelect();
}

public override void ToggleSeeThrough(Entity entity)
{
var overrideComponent = EnsureOverrideComponent(entity);
overrideComponent.ToggleSeeThrough();
}

public Color TintColor = new Color(0.0f, 1.0f, 0.0f, 0.1f);
public override void ToggleTint(Entity entity)
{
var overrideComponent = EnsureOverrideComponent(entity);
overrideComponent.ToggleTint(TintColor);
}

public override void ToggleDisableCollision(Entity entity)
{
var overrideComponent = EnsureOverrideComponent(entity);
overrideComponent.ToggleHidden();
}
```

This code ensures a **EnsureOverrideComponent** component is added to the target Entity, then calls one of the toggle methods defined in the **EntityOverrideController**. On the **TestModel** GameObject, calling these helper methods can be done as before, by adding the **RemoteEntityHelper** as a callback to the `OnRemoteEntityClicked` event on the **RemoteRayCastPointerHandler** component. Additionally, the **ModelViewController** prefab is configured with a control panel for switching between the overrides. The **EntitySelectionViewController** script included in the Tutorial Assets swaps the callback for the **RemoteRayCastPointerHandler** for each button pressed.

## Cut planes

## Editing materials

## Lighting / sky box
