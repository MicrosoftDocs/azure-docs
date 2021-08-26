---
title: Overview of Azure Fluid Relay Architecture
description: Overview of Azure Fluid Relay Architecture
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 08/19/2021
ms.topic: article
ms.service: azure-fluid
---

# Overview of Azure Fluid Relay architecture

> [!NOTE]
> Outstanding issues for this article:
> - Need a post-name change terminology review of the service and each component 
> - Each component (loader, containers, service) needs a link to the corresponding detail article
> - capitalization (e.g. is Loader capitalized in Fluid Loader?)

Architecturally, Azure Fluid Relay can be broken into three components: The [Fluid loader](), [Fluid containers](), and the [Fluid service](). This article provides a brief overview of each component, including what they do and how they fit into the Azure Fluid Relay service.

## Fluid Relay Service components

![A diagram of the Fluid Framework architecture](/docs/concepts/images/architecture.png)

At the highest level, the Fluid loader connects to the Fluid service and loads a Fluid container.

### Fluid containers

A **Fluid container** is a serverless app model with data persistence. The container itself contains app logic, app state, and logic to merge local and remote changes into the app state. Within a container, app logic is encapsulated in **Fluid Objects**. **Distributed data structures** (DDSes) contain app data and merge logic.

### Fluid service

The **Fluid service** has two primary functions. First, it serves as a repository of Fluid Containers, allowing new client apps to download and consume existing containers. Second, the service receives change operations ("ops") from client apps in real-time as changes are made, assigns each op a sequential order number, and broadcasts the ordered apps to all connected clients. Distributed data structures use these ops to reconstruct state on each client. The Fluid service doesn't parse any of these ops; in fact, the service knows nothing about the contents of any Fluid container.

![A diagram depicting operations being sent from a Fluid client to a Fluid service and broadcast to Fluid clients](/docs/concepts/images/fluid-service.png)
From the client perspective, this op flow is accessed through a **DeltaConnection** object.

For convenience, the service stores and distributes both a history of old operations, accessible to clients through a **DeltaStorageService** object, and a current summary of the Fluid container. Summaries allow connected apps to "fast forward" their state without having to merge potentially thousands of change ops.

### Fluid loader

The **Fluid loader** is the part of an app or website that enables Fluid functionality. The loader connects to the Fluid service to download and load Fluid containers, and maintains the service connection to send and receive change ops in real-time. In this way, the Fluid loader 'mimics the web.'

![A diagram of the Fluid loading sequence](/docs/concepts/images/load-flow.png)

The Fluid loader resolves a URL using **container resolver**,, connects to the Fluid service using the **Fluid service driver**, and loads the correct app code using the **code loader.**

The **container lookup & resolver** uses a URL to identify which service a container is bound to and where in that service it is located. The Fluid service driver consumes this information.

The **Fluid service driver** connects to the Fluid service, requests space for new Fluid containers, and creates the three objects: **DeltaConnection**, **DeltaStorageService**, and **DocumentStorageService**. These objects are used to communicate with the server and maintain a consistent state.

The **container code loader** fetches container code. Because all clients run the same code, clients use the code loader to fetch container code. The Loader executes this code to create Fluid containers.

**DDSes** are used to distribute state to clients. Instead of centralizing merge logic in the server, the server passes changes (also known as operations or ops) to clients and the clients perform the merge.

## Fluid Relay design principles

### Keep the server simple

In existing production-quality collaborative algorithms, like Operational Transformations (OT), significant latency is introduced during server-side processing of merge logic.

Fluid dramatically reduces latency by moving merge logic to the client, meaning requests spend fewer milliseconds in the datacenter.

### Move logic to the client

Because merge logic is performed on the client, other app logic that's connected to the distributed data should also be performed on the client.

All clients must load the same merge logic and app logic so that clients can compute an eventually consistent state.

### Mimic (and embrace) the web

The Fluid Framework creates a distributed app model by distributing state and logic to the client. Because the web is already a system for accessing app logic and app state, Fluid mimics existing web protocols when possible.
