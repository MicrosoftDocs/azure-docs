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

*Objects* are considered to be things that the user can create, modify and destroy at their own discretion. Objects can be duplicated freely and each instance can mutate over time. [Entities](entities.md) and [components](components.md) are therefore objects.

The lifetime of objects is fully under user control. It is not related to the lifetime of the client-side representation, though. Classes like `Entity` and `Component` have a `Destroy` function that must be called to deallocate the object on the remote rendering host. Additionally, `Entity.Destroy()` will destroy the entity, its children, and all components in that hierarchy.

## Resource lifetime

*Resources* are things whose lifetime is entirely managed by the remote rendering host. Resources are reference counted internally. They get deallocated when no one references them any longer.

Most resources can only be create indirectly, typically by loading them from a file. When the same file is loaded multiple times, ARR will return the same reference, and not load the data again.

Many resources are immutable, meaning there is no option to modify their state. [Meshes](meshes.md) and [textures](textures.md) are such immutable resources. However, some resources are mutable, for example [materials](../overview/features/materials.md). Since resources are often shared, modifying a resource may affect multiple objects. For instance, changing the color of a material will change the color of all objects that use meshes, which reference that material.

## General lifetime

The lifetime of all objects is bound to a connection. On disconnect everything is discarded. When reconnecting to the same session, the scene graph will be empty. The same should be considered true for resources. In practice, loading the same resource into a session a second time, after a disconnect, is usually faster than the first time. This is the case because most resources must be downloaded from Azure Storage the first time, which is not necessary the second time, saving considerable amount of time.

## Next steps

* [Entities](entities.md)
* [Components](components.md)
* [Models](models.md)
