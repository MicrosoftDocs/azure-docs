---
title: Managing Fluid containers
description: Overview of how to manage containers in Azure Fluid Relay service.
services: azure-fluid
author: hickeys
ms.author: hickeys
ms.date: 10/05/2021
ms.topic: article
ms.service: azure-fluid
---

# Managing Fluid containers

> [!NOTE]
> This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

A Container is the atomic unit of storage in the Azure Fluid Relay service and represents the data stored from a Fluid session, including operations and snapshots. The Fluid runtime uses the container to rehydrate the state of a Fluid session when a user joins for the first time or rejoins after leaving.

When building an application with the Fluid Framework, there are several things you need to account for regarding container creation and management, as summarized in this diagram.

:::image type="content" source="../images/fluid-service-architecture-ownership.jpg" alt-text="Illustration of the architecture of a Fluid service and what parts are owned by developers vs Microsoft.":::

## Key concepts

### Container permissions 

In most cases, developers will want to manage an inventory of containers and container permissions. This would include information about who has access to the containers as well as metadata like the friendly name of the container.

### Accessing containers

Containers are referenced by container ID. Before a user can create or open a container, they must request a JWT that the Fluid Runtime will use when communicating with the Azure Fluid Relay Service. Any process with a valid JWT can access a container. It is the responsibility of the developer to generate JWTs for container access, which puts them in control of the business logic to control access as appropriate for their scenario. The Azure Fluid Relay service has no knowledge of which users should have access to a container. For more information on this topic, see [Azure Fluid Relay token contract](../how-tos/fluid-json-web-token.md)

> [!NOTE]
> The JWT field **documentID** corresponds to the Fluid container ID.

### Container naming

Containers are named by the Azure Fluid Relay service at container creation time. The Create action returns a container name in the form of a GUID that must be used later to open the container. In most cases, developers will want to store this container ID GUID, along with a friendly name, in their own data store to facilitate container discovery flows. 

### Container discovery

Developers are responsible for any experience and business logic related to user discovery of existing containers. This could take the form of a browsable list of containers based on user participation in the Fluid session, direct sharing of containers between users, or programmatic assignment of containers to existing artifacts or processes.

## See also

- [Overview of Azure Fluid Relay architecture](architecture.md)
- [Distributed data structures](data-structures.md)
- [Azure Fluid Relay token contract](../how-tos/fluid-json-web-token.md)
