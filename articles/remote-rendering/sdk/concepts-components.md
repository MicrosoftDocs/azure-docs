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

Components add some functionality to an entity. For example, a cut plane component adds functionality to cut the rendered meshes open at the location of its owner entity, whereas a mesh component adds the functionality to render a specific mesh at the location of the entity.

Components can be added programmatically in code with the C++ API:

```cpp

void createSampleComponent(RemoteRenderingClient& client, ObjectType componentType, ObjectId componentOwner)
{
    // Untyped version
    if( ComponentBase* component = client.AccessObjectDatabase().CreateComponent(componentType, componentOwner) )
    {
        // cast component to appropriate type & manipulate
    }

    // Typed version
    if( auto* component = client.AccessObjectDatabase().CreateComponent<HierarchicalStateOverrideComponent>(componentOwner) )
    {
        // do useful things with the component
    }
}
```

Or the C# API:

```cs
    var component = RemoteManager.CreateComponent(ObjectType.ComponentType, Entity);
```

The Unity Client has additional extension functions for interacting with components, see: [Unity Sdk Concepts](../concepts/sdk-unity-concepts.md).

See the reference documentation for a full list of components and their functionality.