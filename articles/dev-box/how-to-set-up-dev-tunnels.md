---
title: Connect to Microsoft Dev Box Using VS Code
description: Learn how to set up and connect to your Microsoft Dev Box using the Open in VS Code feature. Enable tunnels for a pool, install the Dev Box extension, and connect remotely for development.
author: RoseHJM
contributors:
ms.topic: how-to
ms.date: 01/27/2026
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
---

# Open a dev box in VS Code

Use Microsoft Dev Box with Visual Studio Code (VS Code) to create secure, cloud-based development environments. This article explains how to set up dev tunnels and connect to your Dev Box from VS Code. You learn how to install the required extension, enable secure tunnels, and connect remotely for a streamlined development experience. Follow these steps to get started quickly and work efficiently from anywhere.

## Prerequisites

- A dev center configured with at least one project and a dev box pool.
    - If you don't have a dev center, create one following these steps: [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
- A dev box.
    - If you don't have a dev box, create one following these steps: [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](quickstart-create-dev-box.md)

## Enable Dev Tunnels on a Dev Box Pool

Dev Box Dev Tunnels is a feature that developers use to connect to their Dev Box by using Visual Studio Code (VS Code) through secure tunnels. This feature is particularly useful for developers who want to work remotely or from different locations without needing a full remote desktop connection.

### Register the Dev Box Tunnels preview feature

While Dev Box Tunnels is in preview, register the feature in your Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Subscriptions**.

1. Select the subscription that contains your Dev Box resources.

1. In the left menu, select **Settings** > **Preview features**.

1. In the **Search** box, type **Dev Box**, select **Dev Box Dev Tunnels** from the results, and then select **Register**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-box-dev-tunnels-register.png" alt-text="Screenshot of the Azure portal Preview features page with the 'Dev Box Dev Tunnels' entry selected and the Register button visible." lightbox="media/how-to-set-up-dev-tunnels/dev-box-dev-tunnels-register-lg.png":::

1. In the **Do you want to register the selected features?** message, select **OK**.

### Enable dev tunnels for a dev box pool

Enable dev tunnels for each dev box pool. To enable tunnels for a dev box pool:

1. Go to the project that contains the dev box pool where you want to enable tunnels.

1. On the left menu, select **Manage** > **Dev box pools**.
 
1. For the pool you want to edit, from the dev box operations menu (**...**), select **Edit**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-box-edit-pool.png" alt-text="Screenshot of the Azure portal Dev box pool Edit pane with the operations menu and Edit command visible." lightbox="media/how-to-set-up-dev-tunnels/dev-box-edit-pool-lg.png":::

1. On the **Management** tab, select **Enable opening dev box in VS Code**, and then select **Save**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-box-edit-pool-headless-connection.png" alt-text="Screenshot of the Dev box pool Management tab in the Azure portal with the 'Enable opening dev box in VS Code' option highlighted.":::

## Connect to a dev box by using a dev tunnel

Follow these steps to set up a dev tunnel and connect to your dev box by using VS Code.

1. Install VS Code extension

   In your **local** VS Code, install the [**Dev Box**](https://marketplace.visualstudio.com/items?itemName=DevCenter.ms-devbox) extension from the VS Code Extension Marketplace. Dev tunnels require version 2.0.0 or later. Make sure you install the extension locally, not on the Dev Box you want to connect to.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-dev-box-extension.png" alt-text="Screenshot of the Dev Box extension in Visual Studio Code showing the extension details and the install option.":::

1. To sign in to the Dev Box extension, select the Dev Box icon in the left sidebar, and select **Sign In to Dev Box with Microsoft**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-sign-in-extension.png" alt-text="Screenshot of the Dev Box extension sign-in option in Visual Studio Code, showing the Dev Box icon and Sign In command.":::

1. Connect to the Dev Box in VS Code

   Once everything is set up, open your dev box in VS Code. From the Manage menu (settings wheel), select **Connect**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-connect-tunnel.png" alt-text="Screenshot of the Dev Box extension showing the Connect button used to open a tunnel to a Dev Box in Visual Studio Code.":::

1. Explore the remote experience in VS Code

   A new VS Code window opens. You can open any folder or workspace on the remote Dev Box by using **File** > **Open File/Folder/Workspace** just as you would locally.

### Connect to Windows Subsystem for Linux

If you have a Windows Subsystem for Linux (WSL) environment on the Dev Box, use **Remote Explorer** to connect to it.
   
Select WSL targets from the dropdown to see all the WSL distributions. Open any WSL distribution in the current window or a new window.

:::image type="content" source="media/how-to-set-up-dev-tunnels/dev-box-dev-tunnel-linux.png" alt-text="Screenshot of Visual Studio Code Remote Explorer showing available WSL distributions with the Dev Box WSL target highlighted.":::


For more information on the WSL development experience, see [Remote - WSL](https://code.visualstudio.com/docs/remote/wsl) and [Set up a WSL development environment](/windows/wsl/setup/environment).

## Troubleshoot connectivity problems with Copilot

If you have connectivity problems with your Dev Box, use **Copilot connectivity assist** to diagnose and resolve them. This feature provides guided troubleshooting through GitHub Copilot and the Dev Box MCP Server to help you identify and fix common connection problems.

To use Copilot connectivity assist:

1. In VS Code, open the Dev Box extension by selecting the Dev Box icon in the left sidebar.

1. In the **Dev Box Resources** panel, find the Dev Box you can't connect to.

1. Select the settings icon (gear) next to the Dev Box, or right-click the Dev Box name to open the context menu.

1. Select **Copilot connectivity assist**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-connect-tunnel-copilot.png" alt-text="Screenshot of the Dev Box extension in VS Code showing the context menu with the Copilot connectivity assist option highlighted.":::

1. Follow the guided prompts from Copilot to diagnose and resolve your connectivity problem.

> [!NOTE]
> This menu option runs `devbox_think` from the DevBox MCP Server. You must have the [DevBox MCP Server](overview-what-is-dev-box-mcp-server.md) installed and configured in VS Code to use this feature. Follow the prompts provided by Copilot to complete the troubleshooting process.

Copilot connectivity assist can help with problems such as:

- Tunnel connection failures
- Authentication problems
- Network configuration problems
- Dev Box state problems (stopped, hibernated, or unavailable)

## Frequently asked questions

- Why do I need to sign in to the Dev Box before enabling the tunnel?

    You need to sign in to create a user session for setting up the tunnel. After the initial authentication, you can disconnect from the Dev Box. You can enable or connect to the tunnel without signing in again, unless the Dev Box shuts down or restarts.

- Why can't I connect to the Dev Box even if the tunnel is enabled?

    Refresh the Dev Box extension explorer view by using the button in the upper right corner to check the latest status of the tunnel. If the tunnel is enabled, but you still can't connect, try disabling the tunnel, signing in to the Dev Box, and then re-enabling the tunnel.

## Related content

- [Configure Conditional Access Policies for Dev Tunnels](how-to-conditional-access-dev-tunnels-service.md)
