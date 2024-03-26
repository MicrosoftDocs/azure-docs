---
title: Use features of the Remote Desktop client for Windows - Azure Virtual Desktop
description: Learn how to use features of the Remote Desktop client for Windows when connecting to Azure Virtual Desktop.
ms.topic: how-to
zone_pivot_groups: azure-virtual-desktop-windows-clients
author: dknappettmsft
ms.author: daknappe
ms.date: 02/21/2024
---

# Use features of the Remote Desktop client for Windows when connecting to Azure Virtual Desktop

::: zone pivot="avd-store"
> [!IMPORTANT]
> The Azure Virtual Desktop Store app for Windows is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
::: zone-end

Once you've connected to Azure Virtual Desktop using the Remote Desktop client, it's important to know how to use the features. This article shows you how to use the features available in the Remote Desktop client for Windows. If you want to learn how to connect to Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Remote Desktop client for Windows](connect-windows.md).

There are three versions of the Remote Desktop client for Windows, which are all supported for connecting to Azure Virtual Desktop:

- Standalone download as an MSI installer. This is the most common version of the Remote Desktop client for Windows.
- Azure Virtual Desktop app from the Microsoft Store. This is a preview version of the Remote Desktop client for Windows.
- Remote Desktop app from the Microsoft Store. This version is no longer being developed. 

> [!TIP]
> You can also connect to Azure Virtual Desktop with Windows App, a single app to securely connect you to Windows devices and apps from Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and remote PCs. For more information, see [What is Windows App?](/windows-app/overview)

You can find a list of all the Remote Desktop clients at [Remote Desktop clients overview](remote-desktop-clients-overview.md). For more information about the differences between the clients, see [Compare the Remote Desktop clients](../compare-remote-desktop-clients.md).

> [!NOTE]
> Your admin can choose to override some of these settings in Azure Virtual Desktop, such as being able to copy and paste between your local device and your remote session. If some of these settings are disabled, please contact your admin.

::: zone pivot="remote-desktop-msi"
[!INCLUDE [Remote Desktop (MSI)](../includes/include-client-features-windows-remote-desktop-msi.md)]
::: zone-end

::: zone pivot="avd-store"
[!INCLUDE [Azure Virtual Desktop Store app](../includes/include-client-features-windows-avd-store.md)]
::: zone-end

::: zone pivot="rd-store"
[!INCLUDE [Remote Desktop Store app](../includes/include-client-features-windows-remote-desktop-store.md)]
::: zone-end
