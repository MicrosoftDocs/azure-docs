---
title: An overview of pre and post events (preview) in your Azure Update Manager
description: This article provides an overview on pre and post events (preview) and its requirements.
ms.service: azure-update-manager
ms.date: 11/22/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# About pre and post events

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The pre and post events in Azure Update Manager allow you to perform certain tasks automatically before and after a scheduled maintenance configuration. For example, using pre-and-post events, you can:

-	Start VMs to apply patches and stop the VMs again.
-	Stop service on the machine, apply patches, and restart the service.

The pre-events run before the patch installation begins and the post-events run after the patch installation ends. If the VM requires a reboot, it happens before the post-event begins.

Update Manager uses [Event Grid](../event-grid/overview.md) to create and manage pre and post events on scheduled maintenance configurations. In the Event Grid, you can choose from Azure Webhooks, Azure Functions, Storage accounts, and Event hub to trigger your pre and post activity. If you're using pre and post events in Azure Automation Update management and plan to move to Azure Update Manager, we recommend that you use Azure Webhooks linked to Automation Runbooks.

## User scenarios

The following are the scenarios where you can define pre and post events:

#### [Pre Event user scenarios](#tab/preevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn on machines | Turn on the machine to apply updates.|
|Create snapshot | Disk snaps used to recover data.| 
|Start/configure Windows Update (WU) | Ensures that the WU is up and running before patching is attempted. | 
|Notification email | Send a notification alert before patching is triggered. |
|Add network security group| Add the network security group.|
|Stop services | To stop services like Gateway services, NPExServices, SQL services etc.| 

#### [Post Event user scenarios](#tab/postevent)

| **Scenario**| **Description**|
|----------|-------------|
|Turn off | Turn off the machines after applying updates. | 
|Disable maintenance | Disable the maintenance mode on machines. | 
|Stop/Configure WU| Ensures that the WU is stopped after the patching is complete.|
|Notifications | Send patch summary or an alert that patching is complete.|
|Delete network security group| Delete the network security group.|
|Hybrid Worker| Configuration of Hybrid runbook worker. |
|Mute VM alerts | Enable VM alerts post patching. |
|Start services | Start services like SQL, health services etc.|
|Reports| Post patching report.|
|Tag change | Change tags and occasionally, turns off with tag change.|

---

## Next steps

- Troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).
- Manage the [pre and post maintenance configuration events](manage-pre-post-events.md)
- Learn on the [common scenarios of pre and post events](pre-post-events-common-scenarios.md)