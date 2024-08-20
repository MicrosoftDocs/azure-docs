---
title: "How to start, stop, and restart Chambers, Connectors, and VMs: Azure Modeling and Simulation Workbench"
description: How to start, stop, and restart Chambers, Connectors, and VMs in the Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-and-simulation-workbench
ms.topic: how-to
ms.date: 08/18/2024

#CustomerIntent: As a workbench user, I want to control Chambers, VMs, and Connectors.
---
# Start, stop, and restart Chambers, Connectors, and VMs

**Applies to:** :heavy_check_mark: Chambers :heavy_check_mark: Connectors :heavy_check_mark: Chamber VMs

Chambers, Connectors, and VMs in the Azure Modeling and Simulation Workbench can be started, stopped, or restarted as needed. Idle mode, a cost optimization feature requires that Chambers and Connectors be stopped to realize cost savings. These resources are running after creation and do not need to be started.

License servers are controlled by the Chamber in which they reside and do not have start and stop controls. License servers can be only be enabled and disabled.  See [Manage license servers](./how-to-guide-licenses.md) to learn how to manage Chamber license servers.

## Prerequisites

* An instance of the Azure Modeling and Simulation Workbench with a Chamber, Connector, or VM.
* A user role with either Chamber Admin or Workbench Owner privileges.

## Start a Chamber, Connector, or VM

If stopped, use the following procedure to start. This procedure applies to Chambers, Connectors, and VMs. The action bar is located on the main page of the resource selected and is identical for each of these resources.

1. Navigate to the resource to be started. For Chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective Chamber.
1. Select **Start** from the action bar at the top of overview page.  The start operation can take up to 8 minutes.
1. Verify that the operation succeeeded by checking the **Power state** field on the overview page of the resource. The status should be **Running** if the resource started successfully.

## Stop a Chamber, Connector, or VM

If a Chamber, Connector, or VM is running, it can be stopped with the following procedure. Stopping properly shuts down and releases resources and does not destroy any user data.

1. Navigate to the resource to be stopped. For Chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective Chamber.
1. Select **Start** from the action bar at the top of overview page.  The stop operation can take up to 8 minutes.
1. Verify that the operation succeeeded by checking the **Power state** field on the overview page of the resource. The status should be **Stopped** if the resource stopped successfully.

## Restart a Chamber, Connector, or VM

A Chamber, Connector, or VM can be restarted. A restart operation is a stop operation immediately followed by a start. A restart may be necessary following the update of a VM or if a resource is malfunctioning.

1. Navigate to the resource to be restarted. For Chambers, select **Chamber** from the **Settings** menu in the Workbench overview. Connectors and VMs are listed in the **Settings** menu of their respective Chamber.
1. Select **Restart** from the action bar at the top of overview page.  The restart operation can take up to 8 minutes.
1. Verify that the operation succeeeded by checking the **Power state** field on the overview page of the resource. The status should be **Running** if the resource restarted successfully.
