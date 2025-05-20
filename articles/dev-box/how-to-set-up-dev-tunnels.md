--- 
title: Set Up Dev Tunnels and Connect to Microsoft Dev Box Using VS Code
description: Learn how to set up and connect to your Microsoft Dev Box using the Open in VS Code feature. Follow step-by-step instructions to provision a Dev Box, install the Dev Box extension, enable tunnels, and connect remotely for development.
author: RoseHJM
contributors:
ms.topic: how-to
ms.date: 05/19/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
---

# Set up Dev tunnels in VS Code 

Use Microsoft Dev Box with Visual Studio Code (VS Code) to create secure, cloud-based development environments. This article explains how to set up dev tunnels and connect to your Dev Box from VS Code. You learn how to install the required extension, enable secure tunnels, and connect remotely for a streamlined development experience. Follow these steps to get started quickly and work efficiently from anywhere.

## Prerequisites
- A dev box.
    - If you don't have a dev box, create one following these steps: [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](quickstart-create-dev-box.md)

## Configure a dev tunnel

Follow these steps to set up a dev tunnel and connect to your dev box using VS Code.

1. Install VS Code extension

    In your **local** VS Code, install the [**Dev Box**](https://marketplace.visualstudio.com/items?itemName=DevCenter.ms-devbox) extension from the VS Code Extension Marketplace. Dev tunnels requires version 2.0.0 or later. Make sure you install the extension locally, not on the Dev Box you want to connect to.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-dev-box-extension.png" alt-text="Screenshot of the Dev Box extension in VS Code.":::

1. Sign in to Dev Box extension

   Select the Dev Box icon in the left sidebar, and select **Sign In**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-sign-in-extension.png" alt-text="Screenshot of the Dev Box extension showing the sign-in option.":::

1. Create and enable Dev Box Tunnel

   After signing in, you'll see all the projects you can access. Choose the project where you created the Dev Box, and select the Dev Box you want to connect to.

   If you see **No Tunnel** in the description, manually create a tunnel resource first.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-create-tunnel.png" alt-text="Screenshot of the Dev Box extension showing the option to create a tunnel.":::

   Before enabling the tunnel, you **MUST** log into the Dev Box at least once using any client (for example, browser, Windows App, Remote Desktop client). This step is **mandatory** after each shutdown and restart to establish the required user session for setting up the tunnel. Once logged in, you can disconnect from the Dev Box.

   You don't need to sign in every time you enable or connect to the tunnel—only after a shutdown or restart.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-enable-tunnel.png" alt-text="Screenshot of enabling the tunnel in the Dev Box extension.":::

   Then, enable the tunnel. This process can take 1–3 minutes, as it installs VS Code on the Dev Box (if not already installed) and sets up the tunnel.

1. Connect to the Dev Box in VS Code

   Once everything is set up, you can open the Dev Box in VS Code by clicking the **Connect to Tunnel** button.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-connect-tunnnel.png" alt-text="Screenshot of the Dev Box extension showing the option to connect to the tunnel.":::

1. Explore the remote experience in VS Code

   Open any folder or workspace on the remote Dev Box using **File > Open File/Folder/Workspace** just as you would locally. 

   If you have a Windows Subsystem for Linux (WSL) environment on the Dev Box, connect to it using **Remote Explorer**.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-wsl-targets.png" alt-text="Screenshot of the Remote Explorer in VS Code showing WSL targets.":::

   Select WSL targets from the dropdown to see all the WSL distributions. Open any WSL distribution in the current or a new window.

   :::image type="content" source="media/how-to-set-up-dev-tunnels/dev-tunnels-ubuntu.png" alt-text="Screenshot of a WSL distribution terminal in VS Code.":::

   For more information on the WSL development experience, see [Remote - WSL](https://code.visualstudio.com/docs/remote/wsl) and [Set up a WSL development environment](/windows/wsl/setup/environment).

## Frequently asked questions

- Why do I need to sign-in to the Dev Box before enabling the tunnel?

   This step is required to establish a user session for setting up the tunnel. After the initial sign-in, you can just disconnect from the Dev Box. Then you can enable or connect 

- Why can't I connect to the Dev Box even if the tunnel is enabled?

   Refresh the Dev Box extension explorer view with the button in the top right corner to check the latest status of the tunnel. If the tunnel is enabled, but you still can't connect, try disabling the tunnel, signing in to the Dev Box, and then re-enabling the tunnel.nnect, try disabling the tunnel, logging into the Dev Box, and then re-enabling the tunnel.

## Related content
- [Configure Conditional Access Policies for Dev Tunnels](how-to-conditional-access-dev-tunnels-service.md)
