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

The atomic unit of storage in the Azure Fluid Relay service is a container. The container represents the data stored from a Fluid session, including operations and snapshots. The Fluid runtime uses the container to rehydrate the state of a Fluid session.

## Accessing containers

Containers are referenced by containerID. Any process with a valid JWT can access a container. It is the responsibility of the developer to generate JWTs for container access, which puts them in control of the business logic to control that access as appropriate for their scenario. The Azure Fluid Relay service has no knowledge of which users should have access to a container.

> [!NOTE]
> The JWT field **documentID** corresponds to the Fluid container ID.

## Container naming

Containers are named by the Azure Fluid Relay service at container creation time. The **create** action returns a container name in the form of a GUID that must be used later to open the container.

## Container discovery

Developers are responsible for any experience and business logic related to user discovery of existing containers. This could take the form of a browsable list of containers based on user participation in the Fluid session, direct sharing of containers between users, or programmatic assignment of containers to existing artifacts or processes.

## Container tracking

In most cases, developers will want to manage an inventory of containers that includes information about who has access to the containers as well as metadata like the friendly name of the container.
