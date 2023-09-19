---
title: Release notes for the Azure Storage Mover service | Microsoft Docs
description: Read the release notes for the Azure Storage Mover service, which allows you to migrate your on-premises unstructured data to the Azure Storage service.
services: storage-mover
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: conceptual
ms.date: 08/04/2023
---

# Release notes for the Azure Storage Mover service

Azure Storage Mover is a hybrid service, which continuously introduces new features and improvements to its cloud service and the agent components. New features often require a matching agent version that supports them. This article provides a summary of key improvements for each service and agent version combination that is released. The article also points out limitations and if possible, workarounds for identified issues.

## Supported agent versions

The following Azure Storage Mover agent versions are supported:

| Milestone                    | Version number | Release date       | Status                                                            |
|------------------------------|----------------|--------------------|-------------------------------------------------------------------|
| Refresh release              | 2.0.287        | August 5, 2023     | Supported                                                         |
| Refresh release              | 1.1.256        | June 14, 2023      | Supported                                                         |
| General availability release | 1.0.229        | April 17, 2023     | Supported                                                         |
| Public preview release       | 0.1.116        | September 15, 2022 | Functioning. No longer supported by Microsoft Azure Support teams.|

### Azure Storage Mover update policy

Preview agents aren't automatically updated.
Beginning with the general availability release of service and agent, all GA Azure Storage Mover agents are automatically updated to future versions. GA and newer agents automatically download and apply new functionality and bug fixes. If you need to [deploy another Storage Mover agent](agent-deploy.md), you can find the latest available agent version on [Microsoft Download Center](https://aka.ms/StorageMover/agent). Be sure to [register](agent-register.md) your newly deployed agent before you can utilize them for your migrations.

The automatic agent update doesn't affect running migration jobs. Running jobs are allowed to complete before the update is locally applied on the agent. Any errors during the update process result in the automatic use of the previous agent version. In parallel, a new update attempt is started automatically. This behavior ensures an uninterrupted migration experience.

> [!TIP]
> Always download the latest agent version from Microsoft Download Center. [https://aka.ms/StorageMover/agent](https://aka.ms/StorageMover/agent). Redistributing previously downloaded images may no longer be supported (check the [Supported agent versions](#supported-agent-versions) table), or they need to update themselves prior to being ready for use. Speed up your deployments by always obtaining a the latest image from Microsoft Download Center.

#### Major vs. minor versions

* Major agent versions often contain new features and have an increasing number as the first part of the version number. For example: 1.0.0
* Minor agent versions are also called "patches" and are released more frequently than major versions. They often contain bug fixes and smaller improvements but no new features. For example: 1.1.0

#### Lifecycle and change management guarantees

Azure Storage Mover is a hybrid service, which continuously introduces new features and improvements. Azure Storage Mover agent versions can only be supported for a limited time. Agents automatically update themselves to the latest version. There's no need to manage any part of the self-update process. However, agents need to be running and connected to the internet to check for updates. To facilitate updates to agents that haven't been running for a while:

- Major versions are supported for at least six months from the date of initial release.
- We guarantee there's an overlap of at least three months between the support of major agent versions.
- The [Supported agent versions](#supported-agent-versions) table lists expiration dates. Agent versions that have expired, might still be able to update themselves to a supported version but there are no guarantees.

> [!IMPORTANT]
> Preview versions of the Storage Mover agent cannot update themselves. You must replace them manually by deploying the [latest available agent](https://aka.ms/StorageMover/agent).

## 2023 August 5

Refresh release notes for:

- Service version: August 5, 2023
- Agent version: 2.0.287

### Migration scenarios
Azure Storage mover can migrate your SMB share to Azure file shares (in public preview).

### Service

- [Two new endpoints](endpoint-manage.md) have been introduced.
- [Error messages](status-code.md) have been improved.

### Agent

- Changes to include handling of SMB sources and the data plane transfer to Az Files
- Handling SMB credentials via Azure Key Vault.

### Limitations

- Folder ACLs are not updated on incremental transfers.
- Last modified dates on folders are not preserved.

## 2023 June 14

Refresh release notes for:

- Service version: June 12, 2023
- Agent version: 1.1.256

### Migration scenarios
Existing migration scenarios from the GA release remain unchanged. This release contains fixes to small issues and feature optimizations.

### Service

- Fixed a corner-case issue where the *mirror* copy mode may miss changes made in the source since the job was last ran.
- When moving the storage mover resource in your resource group, an issue was fixed where some properties may have been left behind.
- Error messages have been improved.

### Agent

- Fixed an issue with registration failing sometimes when a proxy server connection and a private link scope were configured at the same time.
- Improved the security stance by omitting to transmit a specific user input to the service that is no longer necessary.

## 2023 April 17

General availability release notes for:

- Service version: April 17, 2023
- Agent version: 1.0.229

### Migration scenarios

Support for a migration from an NFS (v3 / v4) source share to an Azure blob container (not [HNS enabled](../storage/blobs/data-lake-storage-namespace.md)).

### Migration options

In addition to merging content from the source to the target (public preview), the service now supports another migration option: Mirror content from source to target.

- Files in the target will be deleted if they don’t exist in the source.
- Files and folders in the target will be updated to match the source.
- Folder renames between copies will lead to the deletion of the cloud content and reupload of anything contained in the renamed folder on the source.

### Service

The service now supports viewing copy logs and job logs in the Azure portal. An Azure Log Analytics workspace must be configured to receive the logs. This configuration is done once for a Storage Mover resource and applies to all agents and migration jobs in that Storage Mover resource. To configure an existing Storage Mover resource or learn how to create a new Storage Mover resource with this configuration, follow the steps in the article: [How to enable Azure Storage Mover copy and job logs](log-monitoring.md).

It's possible to send the logs to a third party monitoring solution and even into a raw file in a storage account. However, the Storage Mover migration job blade in the Azure portal can only query a Log Analytics workspace for the logs. To get an integrated experience, be sure to select a Log Analytics workspace as a target.

### Agent

Private link connections from the agent into Azure are supported. Data that is migrated can travel from the agent over a private link connection to the target storage account in Azure. Agent registration can also be accomplished over a private link connection. Agent control messages (jobs, logs) can only be sent over the public endpoint of the Storage Mover agent gateway. If using a firewall or proxy server to restrict public access, make sure the following URL isn't blocked: *.agentgateway.prd.azsm.azure.com. The concrete URL is determined by the Azure region of the Storage Mover resource the agent is registered with.

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
