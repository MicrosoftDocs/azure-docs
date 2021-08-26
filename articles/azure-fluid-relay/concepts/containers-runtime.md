---
title: Azure Fluid Relay containers and the container runtime
description: Azure Fluid Relay containers and the container runtime
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 08/19/2021
ms.topic: article
ms.service: azure-fluid
---

# Azure Fluid Relay containers and the container runtime

**Fluid containers** are the atomic unit of storage in the Azure Fluid Relay service, and are foundational concept for creating anything with the Fluid Framework. The container contains all data associated with a Fluid session, including operations and snapshots. The Fluid runtime uses the container's data to recreate the state of a Fluid session.

Fluid containers are *not* standalone applications. A Fluid container is a *code-plus-data package*. Containers must be loaded by a Fluid loader and connected to a Fluid service before the Fluid session is ready to be used.

## What does the Fluid container contain?

Fluid containers contain the app logic and state of a Fluid session, including the logic to merge remote state change operations into the local state stored in the container.

**Fluid Objects** contain the application logic for a Fluid session. Within a container, app logic is encapsulated in Fluid objects. Every container must include at least one Fluid object, and will frequently contain multiple objects composed together to create the overall experience.

**Fluid containers** are the atomic unit of storage in the Azure Fluid Relay service, and are foundational concept for creating anything with the Fluid Framework. The container contains all data associated with a Fluid session, including operations and snapshots. The Fluid runtime uses the container's data to recreate the state of a Fluid session.

Fluid containers are *not* standalone applications. A Fluid container is a *code-plus-data package*. Containers must be loaded by a Fluid loader and connected to a Fluid service before the Fluid session is ready to be used.

## What does the Fluid container do?

The Fluid container interacts with the [processes and distributes operations](../overview/overview.md), manages the lifecycle of Fluid objects, and provides a request API for accessing Fluid objects.

### Process and distribute operations

When a Fluid loader loads a Fluid container, it provides the container with several services and connections used for synchronization:

- **Delta Connection**: The Fluid container uses this connection to receive real-time change operations from the Fluid service, which it merges into its state data using logic stores in a DDS.
- **DeltaStorageService**: The Fluid container uses this service to retrieve historical change operations. This is useful to catch up on operations that occurred while the Fluid session was offline, or to ensure that the Fluid container has the complete set of change operations.
- **DocumentStorageService**: This service provides a current summary of the Fluid session state. When a Fluid session has a local state that is stale, for example when the session has been offline for some time, there may be many change operations that must be applied sequentially. In this case, it may be easier to download a summary of the app state instead of re-creating it by replaying change operations.

The Fluid container is responsible for passing operations to the relevant distributed data structures and Fluid objects.

### Manage Fluid object lifecycle

The container provides a `createDataStore` method to create new data stores. The container is responsible for instantiating the Fluid objects and creating the operations that let other connected clients know about the new Fluid object.

### Using a Fluid container: the Request API

Interactions with Fluid containers are accomplished through requests. Developers can create powerful request handlers with custom logic, but [Aqueduct](../overview/overview.md) creates a standard set of request handlers for each Fluid object by default. For example, the following request uses one of Aqueduct's default handlers to retrieve a container's default data store.

```ts
container.request({url: "/"})
```

## Container vs runtime

A Fluid container is the instantiated container JavaScript object, but it's also the definition of the container. We interchangeably use "container" to refer to the class, which can create new objects, and the instantiated object itself.

The `ContainerRuntime` refers to the inner mechanics of the Fluid container. As a developer you will interact with the runtime through the runtime methods that expose useful properties of the instantiated container object.
