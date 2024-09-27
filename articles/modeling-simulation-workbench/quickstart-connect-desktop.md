---
title: "Quickstart: Connect to the desktop"
description: "Connect and distribute URLs to connect to Modeling and Simulation Workbench."
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: quickstart
ms.date: 09/27/2024

#customer intent: As a user, I want to connect to Modeling and Simulation Workbench desktops and also manage the desktop dashboard URLs.

---

# Quickstart: Connect to desktop

Once a workbench has been created, users can connect directly to the dashboard without visiting the portal. In this quickstart, you will connect to your Modeling and Simulation Workbench desktops and learn how to manage the desktop dashboard URLs.

If you don't have a service subscription, [create a free
trial account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Prerequisites

[!INCLUDE [prerequisite-mswb-chamber](includes/prerequisite-chamber.md)]

* If using a public IP connector, your current public facing IP address must be on the allow-list.

## Locate the desktop dashboard URL

Each [connector](concept-connector.md) has a **Desktop dashboard** URL that opens the dashboard of all created VMs. The dashboard URL can be distributed to users directly so that they don't have to visit the Azure portal and navigate to the connector. You will need to navigate to the connector to obtain the dashboard URL.

> [!TIP]
> From the resource group listing, you can select **Manage view** / **Show hidden types** to directly show all the nested resources of the workbench and select the connector from there without having to navigate the workbench hierarchy.

### Navigate to the connector

1. From the resource group where your workbench is deployed, select your workbench.
1. Once in the workbench, select **Chambers** from the **Settings** menu on the left.
1. In the chamber list, select the desired chamber.
1. From the chamber overview screen, select **Connector** from the **Settings** menu on the left.
1. In the connector list, select the connector.

## Open the desktop

1. In the connector overview screen, the **Desktop dashboard** link is in the right column. Select the *copy* icon to copy the URL to your clipboard or click on it. Clicking the link will open a new tab or window.
    :::image type="content" source="media/quickstart-connect-desktop/connector-dashboard-url.png" alt-text="Screenshot of connector overview page with desktop dashboard URL highlighted in a red rectangle.":::
1. The dashboard screen will open presenting all available VMs.
1. Select a VM. If you have not previously installed the desktop client, you will be prompted to do so. There is also a web client which does not require a local client to be installed.

## Next step

> [!div class="nextstepaction"]
> [Next sequential article title](link.md)
