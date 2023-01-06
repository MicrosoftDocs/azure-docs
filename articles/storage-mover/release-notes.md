---
title: Release notes for the Azure Storage Mover service | Microsoft Docs
description: Read the release notes for the Azure Storage Mover service, which allows you to migrate your on-premises unstructured data to the Azure Storage service.
services: storage-mover
author: stevenmatthew

ms.service: storage
ms.topic: conceptual
ms.date: 06/21/2022
ms.author: shaas
---

<!-- 
!########################################################
STATUS: DRAFT

CONTENT: 

REVIEW Stephen/Fabian: not reviewed
REVIEW Engineering: not reviewed

!########################################################
-->

# Release notes for the Azure Storage Mover service

Azure Storage Mover is a hybrid service, which continuously introduces new features and improvements to its cloud service and the agent components. New features often require a matching agent version that supports them. This article provides a summary of key improvements for each service and agent version combination that is released. The article also points out limitations and if possible, workarounds for identified issues.

## Supported agent versions

The following Azure Storage Mover agent versions are supported:

| Milestone              | Version number | Release date       | Status    |
|------------------------|----------------|--------------------|-----------|
| Public preview release | 0.1.116        | September 15, 2022 | Supported |

### Azure Storage Mover update policy

The Azure Storage Mover agents aren't automatically updated to new versions at this time. New functionality and fixes to any issues will require the [download](https://aka.ms/StorageMover/agent), [deployment](agent-deploy.md) and [registration](agent-register.md) of a new Storage Mover agent.

> [!TIP]
> Switching to the latest agent version can be done safely. Follow the section Upgrading to a newer agent version in the agent deployment article.

New agent versions will be released on Microsoft Download Center. [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent) We recommend retiring old agents and deploying agents of the current version, when they become available.

#### Major vs. minor versions

* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: 1.0.0
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: 1.1.0

#### Lifecycle and change management guarantees

Azure Storage Mover is a hybrid service, which continuously introduces new features and improvements. Azure Storage Mover agent versions can only be supported for a limited time. To facilitate your deployment, the following rules guarantee you have enough time, and notification to accommodate agent updates/upgrades in your change management process:

- Major versions are supported for at least six months from the date of initial release.
- We guarantee there's an overlap of at least three months between the support of major agent versions.
- Warnings are issued for registered servers using a soon-to-be expired agent at least three months prior to expiration. You can check if a registered server is using an older version of the agent in the registered agents section of a storage mover resource.

## 2022 September 15

Initial public preview release notes for:

- Service version: September 15, 2022
- Agent version: 0.1.116

### Migration scenarios

Support for a migration from an NFS (v3 / v4) source share to an Azure blob container (not [HNS enabled](../storage/blobs/data-lake-storage-namespace.md)).

### Migration options

Supports merging content from the source to the target:

- Files will be kept in the target, even if they don’t exist in the source.
- Files with matching names and paths will be updated to match the source.
- Folder renames between copies may lead to duplicate content in the target.

### Service

- When a job is started w/o the agent having permissions to the target storage and the job is immediately canceled, the job might not close down gracefully and remain in the `Cancel requested` state indefinitely. The only mitigation at the moment is to delete the job definition and recreate it.
- The Storage Mover service is currently not resilient to a zonal outage within the selected region. Appropriate configuration steps to achieve zonal redundancy are underway.

### Agent

- The storage mover agent appliance VM is currently only tested and supported as a `Version 1` Windows Hyper-V VM.
- Re-registration of a previously registered agent is currently not supported. [Download a new agent image](https://aka.ms/StorageMover/agent) instead.
- When you register an agent, a hybrid compute resource is also deployed into the same resource group as the storage mover resides in. In some cases, unregistering the server doesn't remove the agent's hybrid compute resource. Admins must manually remove it to complete unregistration of the agent and remove all permissions to target storage the agent previously held.
- Copy logs aren't configurable to be emitted to Azure and must be accessed locally.

To access copy logs on the agent:

1. Connect to the agent's administrative shell
[!INCLUDE [agent-shell-connect](includes/agent-shell-connect.md)]
1. Select option `3) Service and job status`
1. Select option `2) Job summary`
1. A list of jobs that have run on the agent is shown. Copy the ID in the format `Job definition id: Job run id` that represents the job you want to retrieve the copy logs for. You can confirm you've selected the right job by looking at the details of your selected job by pasting it into menu option `3) Job details`
1. Retrieve the copy logs by selecting option `4) Job copylogs` and providing the same ID from the previous step.
