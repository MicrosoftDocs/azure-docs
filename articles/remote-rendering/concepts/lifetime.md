---
title: Object and resource lifetime
description: Explains lifetime management for different types
author: jakrams
ms.author: jakras
ms.date: 02/06/2020
ms.topic: conceptual
---

# Object and resource lifetime

Azure Remote Rendering distinguishes between two types: **objects** and **resources**.

## Object lifetime

*Objects* are considered to be things that the user can create, modify, and destroy at their own discretion. Objects may be duplicated freely and each instance can mutate over time. Consequently [entities](entities.md) and [components](components.md) are objects.

The lifetime of objects is fully under user control. It is not related to the lifetime of the client-side representation, though. Classes like `Entity` and `Component` have a `Destroy` function that must be called to deallocate the object on the remote rendering host. Additionally, `Entity.Destroy()` will destroy the entity, its children, and all components in that hierarchy.

## Resource lifetime

*Resources* are things whose lifetime is entirely managed by the remote rendering host. Resources are reference counted internally. They get deallocated when no one references them any longer.

Most resources can only be created indirectly, typically by loading them from a file. When the same file is loaded multiple times, Azure Remote Rendering will return the same reference, and not load the data again.

Many resources are immutable, for instance [meshes](meshes.md) and [textures](textures.md). Some resources are mutable, though, for example [materials](materials.md). Since resources are often shared, modifying a resource may affect multiple objects. For instance, changing the color of a material will change the color of all objects that use meshes, which in turn reference that material.

### Built-in resources

Azure Remote Rendering contains some built-in resources, which can be loaded by prepending their respective identifier with `builtin://` during the call to `AzureSession.Actions.LoadXYZAsync()`. The available built-in resources are listed in the documentation for each respective feature. For example, the [sky chapter](../overview/features/sky.md) lists the built-in sky textures.

## General lifetime

The lifetime of all objects and resources is bound to the connection. On disconnect everything is discarded. When reconnecting to the same session, the scene graph will be empty and all resources are purged.

In practice, loading the same resource into a session, after a disconnect, is usually faster than the first time. This is the case because most resources must be downloaded from Azure Storage the first time, which is not necessary the second time, saving considerable amount of time.

## Next steps

* [Entities](entities.md)
* [Components](components.md)
* [Models](models.md)
