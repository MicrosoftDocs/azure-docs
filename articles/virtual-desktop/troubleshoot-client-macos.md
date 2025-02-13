---
title: Troubleshoot the Remote Desktop client for macOS - Azure Virtual Desktop
description: Troubleshoot issues you may experience with the Remote Desktop client for macOS when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 11/01/2022
ms.author: daknappe
---

# Troubleshoot the Remote Desktop client for macOS when connecting to Azure Virtual Desktop

This article describes issues you may experience with the [Remote Desktop client for macOS](users/connect-macos.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) when connecting to Azure Virtual Desktop and how to fix them.

## General

In this section you'll find troubleshooting guidance for general issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-remote-desktop-client-doesnt-show-resources](includes/include-troubleshoot-remote-desktop-client-doesnt-show-resources.md)]

[!INCLUDE [troubleshoot-aadj-connections-all](includes/include-troubleshoot-azure-ad-joined-connections-all.md)]

## Collect logs

Here's how to collect logs from the Remote Desktop client for macOS:

1. Open **Microsoft Remote Desktop** and make sure there aren't any connections to devices or apps.

1. From the macOS menu bar, select **Help**, followed by **Troubleshooting**, then select **Logging**.

1. Select a **Core log level** and a **UI log level**.

1. For **When logging, write the output to**, select the drop-down menu, then select **Choose Folder** and choose which folder to save the logs to.

1. Select **Start Logging**.

1. Use the Remote Desktop client as you normally would. If you have an issue, reproduce it.

1. Once you're finished, select **Stop Logging**. You can find the log file in the directory you chose to save the logs to. You can open the files in a text editor, or provide them to support.

## Authentication and identity

In this section you'll find troubleshooting guidance for authentication and identity issues with the Remote Desktop client.

### Account switch detected

If you see the error **Account switch detected**, you need to refresh the Microsoft Entra token. To refresh the Microsoft Entra token, do the following:

1. Delete any workspaces from the Remote Desktop client. For more information, see [Edit, refresh, or delete a workspace](users/client-features-macos.md#edit-refresh-or-delete-a-workspace).

1. Open the **Keychain Access** app on your device.

1. Under **Default Keychains**, select **login**, then select **All Items**.

1. In the search box, enter `https://www.wvd.microsoft.com`.

1. Double-click to open an entry with the name **accesstoken**.

1. Copy the first part of the value for **Account**, up to the first hyphen, for example **70f0a61f**.

1. Enter the value you copied into the search box.

1. Right-click and delete each entry containing this value.

1. If you have multiple entries when searching for `https://www.wvd.microsoft.com`, repeat these steps for each entry.

1. Try to subscribe to a workspace again. For more information, see [Connect to Azure Virtual Desktop with the Remote Desktop client for macOS](users/connect-macos.md).

## Display

In this section you'll find troubleshooting guidance for display issues with the Remote Desktop client.

### Blank screen or cursor skipping when using multiple monitors

Using multiple monitors in certain topologies can cause issues such as blank screens or the cursor skipping. Often this is a result of customized display configurations that create edge cases for the client's graphics algorithm when Retina optimizations are turned on, we're aware of these issues and plan to resolve them in future updates. For now, if you encounter display issues such as these, use a different configuration or disabling Retina optimization. To disable Retina optimization, see [Display settings for each remote desktop](users/client-features-macos.md#display-settings-for-each-remote-desktop).

## Issue isn't listed here

If your issue isn't listed here, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-overview) for information about how to open an Azure support case for Azure Virtual Desktop.
