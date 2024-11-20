---
title: "Start, stop, and restart chambers, connectors, and VMs: Azure Modeling and Simulation Workbench"
description: How to start, stop, and restart chambers, connectors, and VMs in the Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/18/2024

#CustomerIntent: As a workbench user, I want to control chambers, VMs, and connectors.
---
# Start, stop, and restart chambers, connectors, and VMs

**Applies to:** :heavy_check_mark: Chambers :heavy_check_mark: Connectors :heavy_check_mark: Chamber VMs

Chambers, connectors, and virtual machines (VM) in the Azure Modeling and Simulation Workbench can be started, stopped, or restarted as needed. Idle mode, a cost optimization feature requires that chambers and connectors be stopped to realize cost savings. These resources are running after creation and don't need to be started.

License servers are controlled by the chamber in which they reside and don't have their own start/stop controls. License servers can only be enabled or disabled. See [Manage license servers](./how-to-guide-licenses.md) to learn how to manage chamber license servers.

## Prerequisites

* An instance of the Azure Modeling and Simulation Workbench with a chamber, connector, or VM.
* A user role with either Chamber Admin or Workbench Owner privileges.

## Start a chamber, connector, or VM

If stopped, use the following procedure to start. This procedure applies to chambers, connectors, and VMs. The action bar is located on the main page of the resource selected and is identical for each of these resources.

1. Navigate to the resource to be started. For chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective chamber.
1. Select **Start** from the action bar at the top of overview page. The start operation can take up to 8 minutes.
1. Verify that the operation succeeded by checking the **Power state** field on the overview page of the resource. The status should be **Running** if the resource started successfully.

## Stop a chamber, connector, or VM

If a chamber, connector, or VM is running, it can be stopped with the following procedure. Stopping properly shuts down and releases resources and doesn't destroy any user data.

1. Navigate to the resource to be stopped. For chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective chamber.
1. Select **Start** from the action bar at the top of overview page. The stop operation can take up to 8 minutes.
1. Verify that the operation succeeded by checking the **Power state** field on the overview page of the resource. The status should be **Stopped** if the resource stopped successfully.

## Restart a chamber, connector, or VM

A chamber, connector, or VM can be restarted in a single action. Restarting a resource may be necessary after certain updates or if a resource is malfunctioning.

1. Navigate to the resource to be restarted. For chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective chamber.
1. Select **Restart** from the action bar at the top of overview page. The restart operation can take up to 8 minutes.
1. Verify that the operation succeeded by checking the **Power state** field on the overview page of the resource. The status should be **Running** if the resource restarted successfully.
