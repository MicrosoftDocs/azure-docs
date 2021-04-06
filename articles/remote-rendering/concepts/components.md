---
title: Components
description: Definition of components in the scope of Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/04/2020
ms.topic: conceptual
ms.custom: devx-track-csharp
---

# Components

Azure Remote Rendering uses the [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) pattern. While [entities](entities.md) represent the position and the hierarchical composition of objects, components are responsible for implementing behavior.

The most frequently used types of components are [:::no-loc text="mesh components":::](meshes.md), which add meshes into the rendering pipeline. Similarly, [light components](../overview/features/lights.md) are used to add lighting and [cut plane components](../overview/features/cut-planes.md) are used to cut open meshes.

All these components use the transform (position, rotation, scale) of the entity they are attached to, as their reference point.

## Working with components

You can easily add, remove, and manipulate components programmatically:

```cs
// create a point light component
RenderingSession session = GetCurrentlyConnectedSession();
PointLightComponent lightComponent = session.Connection.CreateComponent(ObjectType.PointLightComponent, ownerEntity) as PointLightComponent;

lightComponent.Color = new Color4Ub(255, 150, 20, 255);
lightComponent.Intensity = 11;

// ...

// destroy the component
lightComponent.Destroy();
lightComponent = null;
```

```cpp
// create a point light component
ApiHandle<RenderingSession> session = GetCurrentlyConnectedSession();

ApiHandle<PointLightComponent> lightComponent = session->Connection()->CreateComponent(ObjectType::PointLightComponent, ownerEntity)->as<PointLightComponent>();

// ...

// destroy the component
lightComponent->Destroy();
lightComponent = nullptr;
```

A component is attached to an entity at creation time. It cannot be moved to another entity afterwards. Components are explicitly deleted with `Component.Destroy()` or automatically when the component's owner entity is destroyed.

Only one instance of each component type may be added to an entity at a time.

## Unity specific

The Unity integration has additional extension functions for interacting with components. See [Unity game objects and components](../how-tos/unity/objects-components.md).

## API documentation

* [C# ComponentBase](/dotnet/api/microsoft.azure.remoterendering.componentbase)
* [C# RenderingConnection.CreateComponent()](/dotnet/api/microsoft.azure.remoterendering.renderingconnection.createcomponent)
* [C# Entity.FindComponentOfType()](/dotnet/api/microsoft.azure.remoterendering.entity.findcomponentoftype)
* [C++ ComponentBase](/cpp/api/remote-rendering/componentbase)
* [C++ RenderingConnection::CreateComponent()](/cpp/api/remote-rendering/renderingconnection#createcomponent)
* [C++ Entity::FindComponentOfType()](/cpp/api/remote-rendering/entity#findcomponentoftype)

## Next steps

* [Object bounds](object-bounds.md)
* [Meshes](meshes.md)