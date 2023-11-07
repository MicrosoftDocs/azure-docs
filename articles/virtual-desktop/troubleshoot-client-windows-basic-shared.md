---
title: Basic troubleshooting for the Remote Desktop client for Windows - Azure Virtual Desktop
description: Troubleshoot issues you might experience with the Remote Desktop client for Windows when connecting to Azure Virtual Desktop, Windows 365, and Dev Box.
ms.topic: troubleshooting
zone_pivot_groups: azure-virtual-desktop-windows-client-troubleshoot
author: dknappettmsft
ms.author: daknappe
ms.date: 10/12/2023
---

# Basic troubleshooting for the Remote Desktop client for Windows

> [!TIP]
> Select a button at the top of this article to choose which product you're connecting to and see the relevant documentation.

::: zone pivot="azure-virtual-desktop"
This article provides some simple troubleshooting steps to try first for issues you might encounter when using the [Remote Desktop client for Windows](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) to connect to Azure Virtual Desktop.
::: zone-end

::: zone pivot="windows-365"
This article provides some simple troubleshooting steps to try first for issues you might encounter when using the [Remote Desktop client for Windows](/windows-365/end-user-access-cloud-pc#remote-desktop) to connect to a Cloud PC in Windows 365.
::: zone-end

::: zone pivot="dev-box"
This article provides some simple troubleshooting steps to try first for issues you might encounter when using the [Remote Desktop client for Windows](../dev-box/tutorial-connect-to-dev-box-with-remote-desktop-app.md) to connect to Dev Box.
::: zone-end

## Basic troubleshooting

::: zone pivot="azure-virtual-desktop"
There are a few basic troubleshooting steps you can try if you're having issues connecting to your desktops or applications:

1. Make sure you're connected to the internet.

1. Try to connect to your desktops or applications from the Azure Virtual Desktop web client. For more information, see [Connect to Azure Virtual Desktop with the Remote Desktop web client](users/connect-web.md).

1. Make sure you're using the latest version of the Remote Desktop client. By default, the client automatically updates when a new version is available. To check for updates manually, see [Update the client](users/client-features-windows.md#update-the-client).

1. If the connection fails frequently or you notice performance issues, check the status of the connection. You can find connection information in the connection bar, by selecting the signal icon:

   :::image type="content" source="media/troubleshoot-client-windows-basic-shared/troubleshoot-windows-client-connection-information.png" alt-text="A screenshot showing the connection bar in the Remote Desktop client for Windows.":::

1. Check the estimated connection round trip time (RTT) from your current location to the Azure Virtual Desktop service. For more information, see [Azure Virtual Desktop Experience Estimator](https://azure.microsoft.com/products/virtual-desktop/assessment/#estimation-tool)
::: zone-end

::: zone pivot="windows-365"
There are a few basic troubleshooting steps you can try if you're having issues connecting to your Cloud PC:

1. Make sure you're connected to the internet.

1. Make sure your Cloud PC is running. For more information, see [User actions](/windows-365/end-user-access-cloud-pc#user-actions).

1. Try to connect to your Cloud PC from the Windows 365 web client. For more information, see [Access a Cloud PC](/windows-365/end-user-access-cloud-pc#home-page).

1. Make sure you're using the latest version of the Remote Desktop client. By default, the client automatically updates when a new version is available. To check for updates manually, see [Update the client](users/client-features-windows.md?context=%2Fwindows-365%2Fcontext%2Fpr-context#update-the-client).

1. If the connection fails frequently or you notice performance issues, check the status of the connection. You can find connection information in the connection bar, by selecting the signal icon:

   :::image type="content" source="media/troubleshoot-client-windows-basic-shared/troubleshoot-windows-client-connection-information.png" alt-text="A screenshot showing the connection bar in the Remote Desktop client for Windows.":::

1. Restart your Cloud PC from the Windows 365 portal. For more information, see [User actions](/windows-365/end-user-access-cloud-pc#user-actions).

1. If none of the previous steps resolved your issue, you can use the *Troubleshoot* tool in the Windows 365 portal to diagnose and repair some common Cloud PC connectivity issues. To learn how to use the Troubleshoot, see [User actions](/windows-365/end-user-access-cloud-pc#user-actions).
::: zone-end

::: zone pivot="dev-box"
There are a few basic troubleshooting steps you can try if you're having issues connecting to your dev box:

1. Make sure you're connected to the internet.

1. Make sure your dev box is running. For more information, see [Shutdown, restart or start a dev box](../dev-box/how-to-create-dev-boxes-developer-portal.md#shutdown-restart-or-start-a-dev-box).

1. Try to connect to your dev box from the Dev Box developer portal. For more information, see [Connect to a dev box](../dev-box/quickstart-create-dev-box.md#connect-to-a-dev-box).

1. Make sure you're using the latest version of the Remote Desktop client. By default, the client automatically updates when a new version is available. To check for updates manually, see [Update the client](users/client-features-windows.md?toc=%2Fazure%2Fdev-box%2Ftoc.json#update-the-client).

1. If the connection fails frequently or you notice performance issues, check the status of the connection. You can find connection information in the connection bar, by selecting the signal icon:

   :::image type="content" source="media/troubleshoot-client-windows-basic-shared/troubleshoot-windows-client-connection-information.png" alt-text="A screenshot showing the connection bar in the Remote Desktop client for Windows.":::

1. Restart your dev box from the Dev Box developer portal.

1. If none of the previous steps resolved your issue, you can use the *Troubleshoot & repair* tool in the developer portal to diagnose and repair some common dev box connectivity issues. To learn how to use the Troubleshoot & repair tool, see [Troubleshoot and resolve dev box remote desktop connectivity issues](../dev-box/how-to-troubleshoot-repair-dev-box.md).
::: zone-end

## Client stops responding or can't be opened

If the client stops responding or can't be opened, you might need to reset user data. If you can open the client, you can reset user data from the **About** menu. The default settings for the client will be restored and you'll be unsubscribed from all workspaces.

To reset user data from the client:

1. Open the *Remote Desktop* app on your device.

1. Select the three dots at the top right-hand corner to show the menu, then select **About**.

1. In the section **Reset user data**, select **Reset**. To confirm you want to reset your user data, select **Continue**.

## Issue isn't listed here

::: zone pivot="azure-virtual-desktop"
If your issue isn't listed here, ask your Azure Virtual Desktop administrator for support, or see [Troubleshoot the Remote Desktop client for Windows when connecting to Azure Virtual Desktop](troubleshoot-client-windows.md) for further troubleshooting steps.
::: zone-end

::: zone pivot="windows-365"
If your issue isn't listed here, ask your Windows 365 administrator for support, or see [Troubleshooting for Windows 365](/windows-365/enterprise/troubleshooting) for information about how to open a support case for Windows 365.
::: zone-end

::: zone pivot="dev-box"
If none of the above steps can help, ask your Dev Box administrator for support.
::: zone-end
