---
title: Troubleshoot the Remote Desktop client for iOS and iPadOS - Azure Virtual Desktop
description: Troubleshoot issues you may experience with the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 11/01/2022
ms.author: daknappe
---

# Troubleshoot the Remote Desktop client for iOS and iPadOS when connecting to Azure Virtual Desktop

This article describes issues you may experience with the [Remote Desktop client for iOS and iPadOS](users/connect-ios-ipados.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) when connecting to Azure Virtual Desktop and how to fix them.

## General

In this section you'll find troubleshooting guidance for general issues with the Remote Desktop client.

[!INCLUDE [troubleshoot-remote-desktop-client-doesnt-show-resources](includes/include-troubleshoot-remote-desktop-client-doesnt-show-resources.md)]

[!INCLUDE [troubleshoot-aadj-connections-all](includes/include-troubleshoot-azure-ad-joined-connections-all.md)]

## Authentication and identity

In this section you'll find troubleshooting guidance for authentication and identity issues with the Remote Desktop client.

### Delete existing security tokens

If you're having issues signing in due to a cached token that has expired, do the following:

1. Open the **Settings** app for iOS or iPadOS.

1. From the list of apps, select **RD Client**.

1. Under **AVD Security Tokens**, toggle **Delete on App Launch** to **On**.

1. Try to subscribe to a workspace again. For more information, see [Connect to Azure Virtual Desktop with the Remote Desktop client for iOS and iPadOS](users/connect-ios-ipados.md).

1. Toggle **Delete on App Launch** to **Off** once you can connect again.

## Issue isn't listed here

If your issue isn't listed here, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](troubleshoot-set-up-overview.md) for information about how to open an Azure support case for Azure Virtual Desktop.