---
title: "Manage chamber idle mode: Azure Modeling and Simulation Workbench"
description: Place a chamber into idle mode to optimize cost in Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/17/2024

#CustomerIntent: As a Chamber Admin, I want to reduce cost and place a chamber into Idle mode.
---
# Manage chamber idle mode

To optimize cost management, chambers can be put into an idle state to reduce the running cost, while still maintaining the core infrastructure. Before enabling chamber idle, ensure that there are no running workloads and no active remote desktop user connections.

> [!IMPORTANT]
> To place a chamber into or take a chamber out of idle mode, you must perform the operations on both the chamber and its connector in the correct order, waiting for each operation to successfully complete before proceeding.

## Prerequisites

* An instance of Azure Modeling and Simulation Design Workbench with at least one chamber and connector.
* A user role with at Chamber Admin assignment for the target chambers.

## Place a chamber into idle state

To place a chamber into idle, the connector must be stopped before the chamber is stopped. Perform the following steps in the Azure portal.

1. Navigate to the chamber to be placed into idle.
1. From the **Settings** menu at the left, select **Connector**.
1. Select the connector to be stopped.
1. From the top action bar, select **Stop**. Connectors typically take about 8 minutes to shut down and dispose of resources.

    :::image type="content" source="media/howtoguide-idle/connector-stop.png" alt-text="Screenshot of connector action bar with Stop button highlighted in red.":::

    Wait until the connector completely stops and the Power state shows **Stopped**.

    :::image type="content" source="media/howtoguide-idle/connector-verify-stop.png" alt-text="Screenshot of connector overview with Power state of status highlighted in red.":::

1. Navigate back to the parent chamber.
1. From the top action bar, select **Stop**. Chambers typically take about 8 minutes to shut down and dispose of resources.

    :::image type="content" source="media/howtoguide-idle/chamber-stop.png" alt-text="Screenshot of chamber action bar with Stop button highlighted in red.":::

    Wait until the chamber completely stops and the Power state shows **Stopped**.

    :::image type="content" source="media/howtoguide-idle/chamber-verify-stop.png" alt-text="Screenshot of chamber overview with Power state as Stopped.":::

    > [!TIP]
    > The Activity log will show successful stop of both chamber and connector.

    :::image type="content" source="media/howtoguide-idle/connector-log-stop.png" alt-text="Screenshot of activity log showing chamber successfully stopped.":::

    :::image type="content" source="media/howtoguide-idle/connector-log-stop.png" alt-text="Screenshot of activity log showing connector successfully stopped.":::

## Take a chamber out of idle state

To take a chamber out of idle state, both the chamber and connector must be started in the correct order. The chamber must be fully running before the connector can be started.

1. Navigate to the chamber to be taken out of idle state.
1. From the top action bar, select **Start**. Chambers typically take about 8 minutes to start and create resources. Before proceeding, ensure that the chamber is successfully running by verifying that the Power state of the chamber **Running**.
1. Navigate to the chamber's connector by selecting **Connector** from the **Settings** menu at the left.
1. Select the connector to be stopped.
1. From the top action bar, select **Start**. Connectors typically take about 8 minutes to start and create resources. The Power state of the connector must show as **Running** before a connector can be used for connecting to a desktop or file upload and download.
