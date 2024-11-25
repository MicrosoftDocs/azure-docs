---
title: "Enable copy/paste: Azure Modeling and Simulation Workbench"
description: Enable copy/paste functionality in Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/25/2024

#CustomerIntent: As a Workbench administrator, I want to enable copy/paste functionality to allow users to be able to copy and paste into and out of a Workbench VM.
---
# Enable copy/paste in Azure Modeling and Simulation Workbench

Copy/paste functionality is disabled by default for all chambers created in the Azure Modeling and Simulation Workbench. Workbench Owners can enable copy/paste for an entire chamber. Enabling copy/paste allows users to move text data between their local workstations and chamber VMs. Enabling copy/paste changes the security boundary of the service since data can be directly copied out instead of the data pipeline controls.

The Workbench Owner can enable this copy/paste when the connector is first created or later when needed. This article shows how to manage copy/paste configuration using OpenText Exceed TurboX (ETX), the remote client solution.

> [!WARNING]
> If copy/paste is enabled, users can export data through clipboard operations and without having to request file downloads. Only enable copy/paste if these additional controls aren't needed.

## Prerequisites

[!INCLUDE [prerequisite-user-chamber-admin](includes/prerequisite-user-chamber-admin.md)]

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

## View the current setting of copy/paste

The current setting of the control can be viewed on the connector overview page.

1. Navigate to the connector of the chamber to be checked.
1. On the Overview page, check the **Copy/paste** status in the right column.

    :::image type="content" source="media/howtoguide-enable-copy-paste/copy-paste-status.png" alt-text="Screenshot of connector overview with copy/paste status outlined in red.":::

## Enable or disable copy/paste

1. Navigate to the connector of the chamber to be configured.
1. On the Overview page, select **Configure copy/paste** from the action bar.

    :::image type="content" source="media/howtoguide-enable-copy-paste/copy-paste-configure-button.png" alt-text="Screenshot of connector overview with copy/paste configuration button highlighted in red.":::
The copy/paste control dialog appears.

1. Select the desired setting. Select **Save**.

    :::image type="content" source="media/howtoguide-enable-copy-paste/copy-paste-control.png" alt-text="Screenshot of copy/paste control dialog showing enable and disable radio buttons.":::

## Copy and paste using the client

When copying from or pasting to a virtual machine (VM), you must use the ETX client's controls.

#### [Windows client](#tab/windows)

In the Windows native ETX client, the copy/paste menu can be accessed from the application menu in the upper left.

1. Select the application icon at the far left of the title bar.
1. Select **Edit** then either **Copy X Selection** or **Paste to X Selection**.
1. Highlighting either option produces another flyout menu of sources or destinations.

    :::image type="content" source="media/howtoguide-enable-copy-paste/etx-windows-copy-paste-menu.png" alt-text="Screenshot of Windows ETX copy/paste menu.":::

#### [Web client](#tab/web)

In the web client, the menu is accessed from the main screen.

1. Select the blue box and white arrow in the left corner. The menu flies out and a menu icon is displayed.
1. Select the menu icon to reveal copy/paste actions.

    :::image type="content" source="media/howtoguide-enable-copy-paste/etx-web-client-copy-paste.png" alt-text="Screenshot of ETX web client copy/paste menu.":::

---

## Related content

* [Manage connectors](./how-to-guide-set-up-networking.md)
* [Upload data](./how-to-guide-upload-data.md)
* [Download data](./how-to-guide-download-data.md)
