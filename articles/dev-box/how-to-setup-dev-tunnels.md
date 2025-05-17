--- 
title: Set Up and Connect to Azure Dev Box Using VS Code
description: Learn how to set up and connect to your Azure Dev Box using the Open in VS Code feature. Follow step-by-step instructions to provision a Dev Box, install the Dev Box extension, enable tunnels, and connect remotely for development.
author: RoseHJM
contributors:
ms.topic: concept-article
ms.date: 05/16/2025
ms.author: rosemalcolm
ms.reviewer: rosemalcolm
---

# Setup & Connect to your Dev Box via VS Code

Azure Dev Box makes it easy to provision and manage cloud-based development environments. This article shows you how to set up and connect to your Azure Dev Box using Visual Studio Code. You learn how to register for the Open in VS Code feature, install the required extension, enable secure tunnels, and connect remotely for a seamless development experience. Follow these steps to get started quickly and work efficiently from anywhere.

**Target audience**: Dev Box Users/Developers

In this doc, we walk you through the steps to connect to Dev Box with Open in VS Code feature.

1. Provision a new Dev Box with Dev Box Tunnel or create a Dev Box Tunnel on an existing Dev Box.

1. Enable the Dev Box Tunnel.

1. Connect to the Dev Box Tunnel.

1. Disable the Dev Box Tunnel.

Steps to connect to Dev Box with Open in VS Code Feature

1. Provision a Dev Box

You can skip this step if you already have a Dev Box.

Sign in to [<u>Developer Portal</u>](https://devportal.microsoft.com/) with your Microsoft account, and create a Dev Box in the project you have access to.

1. Install VS Code Extension

Search for **Dev Box** in the VS Code Extension Marketplace and install the latest version (2.0.0 as of 05/15/2025) in your **local** VS Code - **NOT** in the Dev Box you want to connect to.

:::image type="content" source="media/how-to-setup-dev-tunnels/image1.png" alt-text="Screenshot of the Dev Box extension in the VS Code Extension Marketplace.":::

1. Sign in to Dev Box Extension

Select the Dev Box icon in the left sidebar, and select Sign In.

:::image type="content" source="media/how-to-setup-dev-tunnels/image2.png" alt-text="Screenshot of the Dev Box extension sign-in screen in VS Code.":::

1. Create and Enable Dev Box Tunnel

After signing in, you'll see all the projects you have access to. Choose the project where you created the Dev Box, and select the Dev Box you want to connect to.

If you see **No Tunnel** in the description, you need to manually create a tunnel resource first.

:::image type="content" source="media/how-to-setup-dev-tunnels/image3.png" alt-text="Screenshot of the Dev Box extension showing the option to create a tunnel.":::

Before enabling the tunnel, you **MUST** log into the Dev Box at least once using any client (for example, browser, Windows App, Remote Desktop client). This step is **mandatory** after each shutdown and restart to establish the required user session for setting up the tunnel. Once logged in, you can disconnect from the Dev Box.

You **DO NOT** need to sign-in every time you enable or connect to the tunnel—only after a shutdown or restart.

:::image type="content" source="media/how-to-setup-dev-tunnels/image4.png" alt-text="Screenshot of enabling the tunnel in the Dev Box extension.":::

Then, you can enable the tunnel. This process might take up to 1-3 minutes, as it installs VS Code on the Dev Box (if not already installed) and set up the tunnel.

1. Connect to the Dev Box in VS Code

Once everything is set up, you can open the Dev Box in VS Code by clicking the **Connect to Tunnel** button.

:::image type="content" source="media/how-to-setup-dev-tunnels/image5.png" alt-text="Screenshot of the Connect to Tunnel button in the Dev Box extension.":::

1. Dev Box Remote experience in VS Code

You can open any folder or workspace on the remote Dev Box using **File > Open File/Folder/Workspace** just as you would locally!

If you have WSL environment on the Dev Box, you can connect to it using **Remote Explorer**.

:::image type="content" source="media/how-to-setup-dev-tunnels/image6.png" alt-text="Screenshot of the Remote Explorer in VS Code showing WSL targets.":::

Select WSL targets from the dropdown and all the WSL distributions are listed. You can open any WSL distribution in the current or new window.

:::image type="content" source="media/how-to-setup-dev-tunnels/image7.png" alt-text="Screenshot of a WSL distribution terminal in VS Code.":::

For more information on the WSL development experience, refer to the [<u>Remote - WSL</u>](https://code.visualstudio.com/docs/remote/wsl) and [<u>Set up a WSL development environment</u>](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) documentation.

FAQ

1. Why do I need to sign-in to the Dev Box before enabling the tunnel?

> This step is required to establish a user session for setting up the tunnel. After the initial login, you can just disconnect from the Dev Box. Then you can enable or connect to the tunnel without logging in again, unless the Dev Box is shut down or restarted.

1. Why can't I connect to the Dev Box even if the tunnel is enabled?

> Refresh the Dev Box extension explorer view with the button on the top right corner to check the latest status of the tunnel. If the tunnel is enabled, but you still can't connect, try disabling the tunnel, logging into the Dev Box, and then re-enabling the tunnel.
