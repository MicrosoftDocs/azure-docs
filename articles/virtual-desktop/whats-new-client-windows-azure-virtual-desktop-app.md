---
title: What's new in the Azure Virtual Desktop Store app for Windows (preview) - Azure Virtual Desktop
description: Learn about recent changes to the Azure Virtual Desktop Store app for Windows.
ms.topic: release-notes
author: dknappettmsft
ms.author: daknappe
ms.date: 08/04/2023
---

# What's new in the Azure Virtual Desktop Store app for Windows (preview)

> [!IMPORTANT]
> The Azure Virtual Desktop Store app for Windows is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article you'll learn about the latest updates for the Azure Virtual Desktop Store app for Windows. To learn more about using the Azure Virtual Desktop Store app for Windows with Azure Virtual Desktop, see [Connect to Azure Virtual Desktop with the Azure Virtual Desktop Store app for Windows](users/connect-windows-azure-virtual-desktop-app.md) and [Use features of the Azure Virtual Desktop Store app for Windows when connecting to Azure Virtual Desktop](users/client-features-windows-azure-virtual-desktop-app.md).

## Latest client versions

The following table lists the current version available for the public release. To enable Insider releases, see [Enable Insider releases](users/client-features-windows-azure-virtual-desktop-app.md#enable-insider-releases).

| Release     | Latest version   | Download |
|-------------|------------------|----------|
| Public      | 1.2.4487         | [Microsoft Store](https://aka.ms/AVDStoreClient) |
| Insider     | 1.2.4487         | Download the public release, then [Enable Insider releases](users/client-features-windows-azure-virtual-desktop-app.md#enable-insider-releases) and check for updates. |

## Updates for version 1.2.4487

*Date published: July 21, 2023*

In this release, we've made the following changes:

- Fixed an issue where the client doesn't auto-reconnect when the gateway WebSocket connection shuts down normally.

## Updates for version 1.2.4485

*Date published: July 11, 2023*

In this release, we've made the following changes: 

- Added a new RDP file property called *allowed security protocols*. This property restricts the list of security protocols the client can negotiate. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 
- Accessibility improvements:
  - Narrator now describes the toggle button in the display settings side panel as *toggle button* instead of *button*.
  - Control types for text now correctly say that they're *text* and not *custom*. 
  - Fixed an issue where Narrator didn't read the error message that appears after the user selects **Delete**. 
  - Added heading-level description to **Subscribe with URL**. 
- Dialog improvements:
  - Updated **file** and **URI launch** dialog error handling messages to be more specific and user-friendly. 
  - The client now displays an error message after unsuccessfully checking for updates instead of incorrectly notifying the user that the client is up to date.
  - Fixed an issue where, after having been automatically reconnected to the remote session, the **connection information** dialog gave inconsistent information about identity verification.

## Updates for version 1.2.4419

*Date published: July 6, 2023*

In this release, we've made the following changes: 

- General improvements to Narrator experience.
- Fixed an issue that caused the text in the message for subscribing to workspaces to be cut off when the user increases the text size.
- Fixed an issue that caused the client to sometimes stop responding when attempting to start new connections.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4337 

*Date published: June 13, 2023* 

In this release, we've made the following changes: 

- Fixed the vulnerability known as [CVE-2023-29362](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29362).
- Fixed the vulnerability known as [CVE-2023-29352](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29352).

## Updates for version 1.2.4331

*Date published: June 6, 2023*

In this release, we've made the following changes:

- Improved connection bar resizing so that resizing the bar to its minimum width doesn't make its buttons disappear.
- Fixed an application compatibility issue that affected preview versions of Windows.
- Moved the identity verification method from the lock window message in the connection bar to the end of the connection info message.
- Changed the error message that appears when the session host can't reach the authenticator to validate a user's credentials to be clearer.
- Added a reconnect button to the disconnect message boxes that appear whenever the local PC goes into sleep mode or the session is locked. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.4240 

*Date published: May 16, 2023*

In this release, we've made the following changes: 

- Fixed an issue where the connection bar remained visible on local sessions when the user changed their contrast themes.
- Made minor changes to connection bar UI, including improved button sizing. 
- Fixed an issue where the client stopped responding if closed from the system tray. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4159

*Date published: May 9, 2023*

In this release, we've made the following changes:

- Redesigned the connection bar for session desktops.
- Fixed an issue that caused the client to report misleading or incorrect *ErrorCode 0x108* error logs.
- Fixed an issue that made the client sometimes drop connections if doing something like using a Smart Card made the connection take a long time to start.
- Fixed a bug where users aren't able to update the client if the client is installed with the flags *ALLUSERS=2* and *MSIINSTALLPERUSER=1*
- Fixed an issue that made the client disconnect and display error message 0x3000018 instead of showing a prompt to reconnect if the endpoint doesn't let users save their credentials.
- Fixed the vulnerability known as [CVE-2023-28267](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-28267).
- Fixed an issue that generated duplicate Activity IDs for unique connections. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed an application compatibility issue for preview versions of Windows.

## Updates for version 1.2.4066

*Date published: March 28, 2023*

In this release, we've made the following changes:

- General improvements to Narrator experience.
- Fixed a bug that caused the client to stop responding when disconnecting from the session early.
- Fixed a bug that caused duplicate error messages to appear while connected to an Azure Active Directory-joined host using the new Remote Desktop Services (RDS) Azure Active Directory (Azure AD) Auth protocol.
- Fixed a bug that caused scale resolution options to not display in display settings for session desktops.
- Disabled UPnP for non-Insiders customers after reports of connectivity issues.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to MMR for Azure Virtual Desktop, including the following:
   - Fixed an issue that caused multimedia redirection (MMR) for Azure Virtual Desktop to not load for the ARM64 version of the client.
- Updates to Teams for Azure Virtual Desktop, including the following:
   - Fixed an issue that caused the application window sharing to freeze or show a black screen in scenarios with Topmost window occlusions.
   - Fixed an issue that caused Teams media optimizations for Azure Virtual Desktop to not load for the ARM64 version of the client.
