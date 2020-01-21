---
title: Components
description: Definition of Components in the scope of Azure Remote Rendering API
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: conceptual
ms.service: azure-remote-rendering
---
# Components

Components add some functionality to an entity. For example, a [cut plane component](features-cut-planes.md) adds functionality to cut the rendered meshes open at the location of the component's owner entity, whereas a mesh component adds the functionality to render a specific mesh at the location of the entity.

Components can be added programmatically in code with the Client SDK:

```cs
    AzureSession session = GetCurrentlyConnectedSession();
    var component = session.Actions.CreateComponent(ObjectType.ComponentType, OwnerEntity);
```

Components are explicitly deleted by the user with `Component.Destroy()` or automatically deleted when the component's entity is destroyed with `Entity.Destroy()`. Components can also be destroyed when its owner's parent is destroyed.

Only one type of a particular component can exist on an `Entity` at a time.

For `CreateComponent` call to succeed, the `AzureSession` must be connected with `ConnectToRuntime` to a remote rendering machine.

The Unity Client has additional extension functions for interacting with components, see: [Unity Sdk Concepts](../concepts/sdk-unity-concepts.md).

See the reference documentation for a full list of components and their functionality.
