---
title: "Manage Chamber Idle Mode: Azure Modeling and Simulation Workbench"
description: Place a Chamber into Idle mode to optimize costs
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/17/2024

#CustomerIntent: As a Chamber Admin, I want to reduce cost and place a Chamber into Idle mode.
---
# Manage Chamber Idle mode

To optimize cost management, Chambers can be put into an idle state to reduce the running cost, while still maintaining the core infrastructure. Before enabling Chamber idle, ensure that there are no running workloads and no active remote desktop user connections.

> [!IMPORTANT]
> To place a Chamber into or take a Chamber out of idle mode, you must perform the operations on both the Chamber and its Connector in the correct order, waiting for each operation to successfully complete before proceeding.

## Prerequisites

* An instance of Azure Modeling and Simulation Design Workbench with at least one Chamber and Connector.
* A user role with at Chamber Admin assignment for the target Chambers.

## Place a Chamber into idle state

To place a Chamber into idle, the Connector must be stopped before the Chamber is stopped. Perform the following steps in the Azure portal.

1. Navigate to the Chamber to be placed into idle.
1. From the **Settings** menu at the left, select **Connector**.
1. Select the Connector to be stopped.
1. From the top action bar, select **Stop**. Connectors typically take about 8 minutes to shutdown and dispose of resources.  :::image type="content" source="media/howtoguide-idle/connector-stop.png" alt-text="Stop button highlighted in red in the action menu bar of a Connector.":::  Wait until the Connector has completely stopped before proceeding. The Power state of the Connector will show as Stopped. :::image type="content" source="media/howtoguide-idle/connector-verify-stop.png" alt-text="Power state of Connector confirmed Stopped in Chamber status, highlighted in red.":::
1. Navigate back to the parent Chamber.
1. From the top action bar, select **Stop**. Chambers typically take about 8 minutes to shutdown and dispose of resources. :::image type="content" source="media/howtoguide-idle/chamber-stop.png" alt-text="Stop button highlighted in red in the action menu bar of a Chamber.":::  Wait until the Chamber has completely stopped before proceeding. The Power state of the Chamber will show as Stopped. :::image type="content" source="media/howtoguide-idle/chamber-verify-stop.png" alt-text="Power state of Chamber confirmed Stopped in Chamber status, highlighted in red.":::

> [!TIP]
> The Activity log will show successful stop of both Chamber and Connector. :::image type="content" source="media/howtoguide-idle/connector-log-stop.png" alt-text="Screenshot of activity log showing Chamber successfully stopped."::: :::image type="content" source="media/howtoguide-idle/connector-log-stop.png" alt-text="Screenshot of activity log showing Connector successfully stopped.":::

## Take a Chamber out of idle state

To take a Chamber out of idle state, both the Chamber and Connector must be started in the correct order. The Chamber must be fully running before the Connector can be started.

1. Navigate to the Chamber to be taken out of idle state.
1. From the top action bar, select **Start**. Chambers typically take about 8 minutes to start and create resources. Before proceeding, ensure that the Chamber is successfully running by verifying that the Power state of the Chamber **Running**.
1. Navigate to the Chamber's Connector by selecting **Connector** from the **Settings** menu at the left.
1. Select the Connector to be stopped.
1. From the top action bar, select **Start**. Connectors typically take about 8 minutes to start and create resources. The Power state of the Connector must show as **Running** before a Connector can be used for connecting to a desktop or file upload and download.
