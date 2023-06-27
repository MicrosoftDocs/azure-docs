---
title: What's new in the Azure Virtual Desktop Store app for Windows (preview) - Azure Virtual Desktop
description: Learn about recent changes to the Azure Virtual Desktop Store app for Windows.
ms.topic: conceptual
author: dknappettmsft
ms.author: daknappe
ms.date: 04/27/2023
---

# What's new in the Azure Virtual Desktop Store app for Windows (preview)

> [!IMPORTANT]
> The Azure Virtual Desktop Store app for Windows is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article you'll learn about the latest updates for the Azure Virtual Desktop Store app for Windows. To learn more about using the Azure Virtual Desktop Store app for Windows with Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows](users/connect-windows.md) and [Use features of the Azure Virtual Desktop Store app for Windows when connecting to Azure Virtual Desktop ](users/client-features-windows.md).

## March 7, 2023

In this release, we've made the following changes:

- General improvements to Narrator experience.
- Fixed a bug that caused the client to stop responding when disconnecting from the session early.
- Fixed a bug that caused duplicate error messages to appear while connected to an Azure Active Directory-joined host using the new Remote Desktop Services (RDS) Azure Active Directory (Azure AD) Auth protocol.
- Fixed a bug that caused scale resolution options to not display in display settings for session desktops.
- Added support for Universal Plug and Play (UPnP) for improved User Datagram Protocol (UDP) connectivity.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to MMR for Azure Virtual Desktop, including the following:
  - Fixed an issue that caused multimedia redirection (MMR) for Azure Virtual Desktop to not load for the ARM64 version of the client.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - Fixed an issue that caused the application window sharing to freeze or show a black screen in scenarios with Topmost window occlusions.
  - Fixed an issue that caused Teams media optimizations for Azure Virtual Desktop to not load for the ARM64 version of the client.
