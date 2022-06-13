---
title: Understanding the Azure Storage Mover resource hierarchy
description: Understanding the Azure Storage Mover resource hierarchy
author: stevenmatthew
ms.author: shaas
ms.service: storage
ms.topic: conceptual
ms.date: 06/13/2022
ms.custom: template-concept
---

# Understanding the Azure Storage Mover resource hierarchy

Several Azure Storage Mover resources are required to effectively manage all aspects of a migration. Some of these resources seem unnecessary given the current range of service functionality. However, over time we will build out more functionality.

:::image type="content" source="media/storage-hierarchy.png" alt-text="An image showing the Azure Storeage Mover hierachy.":::

## Storage Mover

Top level resource, you’ll deploy into an Azure resource group. It holds agent trust relationships for managing migration job and allows for storing a migration plan. Ideally, admins should deploy a single Storage Mover resource even when agents across regions are deployed. The agent never sends data through the Storage Mover service and therefore the proximity of agent and target storage account matter far more than the proximity to the Storage Mover resource. Only management signals are exchanged between Storage Mover and agent where higher latency connections have no impact. Only deploy multiple Storage Mover resources if you have distinct sets of admins that migrate with their own distinct agents. An agent registered to a storage mover resource cannot be used in a different storage mover resource.

## Storage Mover Agent

An agent resource appears when the agent has been successfully registered. From now on, the agent sends heartbeat information to the service and will look for configuration, or migration jobs on a regular basis. The agent always contacts the service, never the reverse.

## Endpoint

Endpoints serve as storage locations (shares) that ought to be connected from source to target during a migration. There is a rich set of properties on an endpoint. They differ based on the type of endpoint one creates. Endpoints in private preview release 1, are not easy to interact with. This is an artifact of auto-generating our cmdlets. We’ll fix that soon.

## Project

The purpose of a project is to group together multiple source and target location. Think along the lines of “I like to migrate all shares from this NAS 1” – then your project can be called “NAS 1 migration” – within it you’d have endpoints for each source share and matching endpoints for each target location in Azure.

Another good example of a project is: “I like to migrate all HR shares” or “I like to migrate all shares used by this app.” These can be shares from different source devices. 

## Job Definition

A Job Definition references a source and a target Endpoint. A Job Definition therefore describes from where to where files need to be migrated, it keeps track of copy iterations and settings for the copy. Possibly settings are sub-paths on source and target Endpoints, a mirror mode that is required for multiple copy runs, and others. Private Preview release 1 has only limited settings available.

## Job Run

A Job Run is a copy-run instance of a Job Definition. When initiating a copy, the admin first selects a Job Definition and then selects an agent to execute the run. Executing a Job Definition results in a Job Run. Starting a run is also the time when the selected agent is given permission to the target storage location. (…and source location access for SMB shares in the future.)

## Next steps

Add a context sentence for the following links.

- [Step 1](overview.md)
- [Step 2](overview.md)
