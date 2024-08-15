---
ms.topic: include
author: sipastak
ms.author: sipastak
ms.date: 08/14/2024 
---

## Supported client versions

The following table lists the current versions available for the public and Insider releases. To enable Insider releases, see [Enable Insider releases](../users/client-features-windows.md#enable-insider-releases).

| Release | Latest version | Download |
|--|--|--|
| Public | 1.2.5560 | [Microsoft Store](https://aka.ms/AVDStoreClient) |
| Insider | 1.2.5620 | Download the public release, then [Enable Insider releases](../users/client-features-windows.md#enable-insider-releases) and check for updates. |

## Updates for version 1.2.5560

*Date published: August 13, 2024* 

- Fixed an issue for [CVE-2024-38131 ](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2024-38131).

## Updates for version 1.2.5620

*Date published: August 13, 2024* 

- [CVE-2024-38131 ](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2024-38131)

> [!NOTE]
> This version replaced the Insider version 1.2.5617 and has the same release notes with the addition of the security release.  

## Updates for version 1.2.5617 

*Date published: July 23, 2024* 

In this release, we made the following changes:

- Stability and security improvements for printer redirections. 
- Improved experience for SSO Lock Screen dialogs.   
- Fixed an issue with SSO login failure. 
- Fixed an issue causing the client to crash on disconnect. 

## Updates for version 1.2.5559

*Date published: July 17, 2024* 

> [!NOTE]
> This version replaced 1.2.5552 and has the same release notes. 

## Updates for version 1.2.5552

*Date published: July 2, 2024* 

In this release, we made the following changes:

- Fixed an issue where users who were connecting using [protocol launch](../uri-scheme.md) had to complete two MFA prompts.

> [!NOTE]
>- This Insider release was originally version 1.2.5550, but we made a change to fix an issue with double MFA prompts and re-released as version 1.2.5552. This version contains all the changes made in 1.2.5550. 
>- This version was released as a public version on July 2, 2024, but was replaced by version 1.2.5559 on July 17, 2024. 


## Updates for version 1.2.5550

*Date published: June 25, 2024* 

In this release, we made the following changes:

- Fixed an issue where a minimized RemoteApp window will maximize when the lock screen timer runs out for a RemoteApp session.
- Improved usability of the connection bar by reducing the amount of time it displays on the screen after the mouse moves away.

## Updates for version 1.2.5454

*Date published: June 11, 2024* 

In this release, we made the following changes:

- Fixed an issue where the client crashed when a session is disconnected. 

> [!NOTE]
> > This Insider release was originally version 1.2.5453, but we made this change and re-released it as version 1.2.5454. This version contains all the changes made in 1.2.5450, 1.2.5452, and 1.2.5453.

## Updates for version 1.2.5453 

*Date published: June 4, 2024* 

In this release, we made the following changes:

- Fixed an issue where the client crashed when responding to an incoming Teams call.  

> [!NOTE]
> This Insider release was originally version 1.2.5452, but we made this change and re-released it as 1.2.5453. This version contains all of the changes made in 1.2.5450 and 1.2.5452. 

## Updates for version 1.2.5452 

*Date published: May 29, 2024* 

In this release, we made the following changes:

- Improve graphics presentation latency  

> [!NOTE]
> This Insider release was originally version 1.2.5450, but we made this change and re-released it as 1.2.5452. This version contains all of the changes made in 1.2.5450. 

## Updates for version 1.2.5450 

*Date published: May 21, 2024* 

In this release, we made the following changes:

- When subscribing to feeds via URL, all message states for the status message box can be announced by screen readers. 
- Users can try out the Windows App preview by selecting the toggle at the top of Azure Virtual Desktop Preview app. Users will be able to download and install the application. If Windows App is already downloaded, the toggle will close Azure Virtual Desktop app and open Windows App. 
- When users search for workspaces via URL, they now see the searching status when entering URL-formatted input and receive an error if results are not found. 
- Improved error messaging for end users when their saved credentials expire. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.5405

*Date published: April 17, 2024*

In this release, we made the following changes:

- Fixed an issue that made the multifactor authentication (MFA) prompt appear twice when users tried to connect to a resource 
- Fixed an issue that caused an extra string to appear next to a user's tenant URL.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.5331

*Date published: April 18, 2024*

In this release, we've made the following changes:

- Fixed an issue that caused the RemoteApp window to appear stretched.
- When users enter text into the email or URL field to search for a workspace while subscribing to a feed, screen readers now announce whether the client can find the workspace.
- Fixed an issue that made the MFA prompt appear twice when users tried to connect to a resource 
- Fixed an issue that caused an extra string to appear next to a user's tenant URL.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

> [!NOTE]
> This release was originally version 1.2.5326, but we made a hotfix after receiving user reports about issues that affected the MFA prompt and tenant URLs. Version 1.2.5331, which fixes these issues, has replaced version 1.2.5326.

## Updates for version 1.2.5255

*Date published: March 11, 2024*

> [!NOTE]
> This version includes all the latest updates made in public build [1.2.5252](#updates-for-version-125252) and Insider builds [1.2.5248](#updates-for-version-125248) and [1.2.5126](#updates-for-version-125126). 

In this release, we've made the following change:

- Fixed an issue that caused connections to stop working when users tried to connect from a Private Network to Azure Virtual Desktop environment.

## Updates for version 1.2.5254  

*Date published: March 6, 2024*

>[!NOTE]
>This version replaced [1.2.5252](#updates-for-version-125252) and has the same release notes as [version 1.2.5112](#updates-for-version-125112).

## Updates for version 1.2.5252

*Date published: February 29, 2024*

>[!NOTE]
>This version was released as a Public version on March 5, 2024 but was replaced by [version 1.2.5254](#updates-for-version-125254) on March 6, 2024.

In this release, we've made the following changes:

- Devices no longer go into idle mode when video playback is active. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.5248

*Date published: February 13, 2024*

>[!NOTE]
>This version was an Insiders version that was replaced by version 1.2.5252 and never released to Public.
In this release, we've made the following changes:

- Fixed an issue that caused artifacts to appear on the screen during RemoteApp sessions.
- Fixed an issue where resizing the Teams video call window caused the client to temporarily stop responding.
- Fixed an issue that made Teams calls echo after expanding a two-person call to meeting call.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.5126

*Published: January 24, 2024*

>[!NOTE]
>This version was an Insiders version that was replaced by version 1.2.5248 and never released to Public.
In this release, we've made the following changes:

- Fixed the regression that caused a display issue when a user selects monitors for their session. 
- Made the following accessibility improvements: 
  - Improved screen reader experience.
  - Greater contrast for background color of the connection bar remote commands drop-down menu. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.5112

*Published: February 7, 2024*

In this release, we've made the following changes:

- Fixed the regression that caused a display issue when a user selects monitors for their session.

## Updates for version 1.2.5105

*Published: January 9, 2024*

In this release, we've made the following changes:

- Fixed the [CVE-2024-21307](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21307) security vulnerability.
- Improved accessibility by making the **Change the size of text and apps** drop-down menu more visible in the High Contrast theme.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed a Teams issue that caused incoming videos to flicker green during meeting calls.

>[!NOTE]
>This release was originally 1.2.5102 in Insiders, but we changed the Public version number to 1.2.5105 after adding the security improvements addressing [CVE-2024-21307](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21307).

## Updates for version 1.2.5018

*Published: November 20, 2023*

> [!NOTE]
> We replaced this Insiders version with [version 1.2.5102](#updates-for-version-125105). As a result, version 1.2.5018 is no longer available for download.

In this release, we've made the following change:

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4763

*Published: November 7, 2023*

In this release, we've made the following changes:

- Added a link to the troubleshooting documentation to error messages to help users resolve minor issues without needing to contact Microsoft Support. 
- Improved the connection bar user interface (UI). 
- Fixed an issue that caused the client to stop responding when a user tries to resize the client window during a Teams video call. 
- Fixed a bug that prevented the client from loading more than 255 workspaces.  
- Fixed an authentication issue that allowed users to choose a different account whenever the client required more interaction. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4677

*Published: October 17, 2023*

In this release, we've made the following changes:

- Added new parameters for multiple monitor configuration when connecting to a remote resource using the [Uniform Resource Identifier (URI) scheme](../uri-scheme.md).
- Added support for the following languages: Czech (Czechia), Hungarian (Hungary), Indonesian (Indonesia), Korean (Korea), Portuguese (Portugal), Turkish (Türkiye).
- Fixed a bug that caused a crash when using Teams Media Optimization. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

>[!NOTE]
>This Insiders release was originally version 1.2.4675, but we made a hotfix for the vulnerability known as [CVE-2023-5217](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-5217). 

## Updates for version 1.2.4583

*Published: October 6, 2023*

In this release, we've made the following change:

- Fixed the [CVE-2023-5217](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-5217) security vulnerability.

## Updates for version 1.2.4582

*Published: September 19, 2023*

In this release, we've made the following changes:

- Fixed an issue when using the default display settings and a change is made to the system display settings, where the bar does not show when hovering over top of screen after it is hidden.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Accessibility improvements:
   - Narrator now announces the view mode selector as "*View combo box*", instead of "*Tile view combo box*" or "*List view combo box*".
   - Narrator now focuses on and announces **Learn more** hyperlinks.
   - Keyboard focus is now set correctly when a warning dialog loads.
   - Tooltip for the close button on the **About** panel now dismisses when keyboard focus moves.
   - Keyboard focus is now properly displayed for certain drop-down selectors in the **Settings** panel for published desktops.

> [!NOTE]
> This release was originally version 1.2.4577, but we made a hotfix after reports that connections to machines with watermarking policy enabled were failing. Version 1.2.4582, which fixes this issue, has replaced version 1.2.4577.

## Updates for version 1.2.4487

*Published: July 21, 2023*

In this release, we've made the following changes:

- Fixed an issue where the client doesn't auto-reconnect when the gateway WebSocket connection shuts down normally.

## Updates for version 1.2.4485

*Published: July 11, 2023*

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

*Published: July 6, 2023*

In this release, we've made the following changes: 

- General improvements to Narrator experience.
- Fixed an issue that caused the text in the message for subscribing to workspaces to be cut off when the user increases the text size.
- Fixed an issue that caused the client to sometimes stop responding when attempting to start new connections.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4337 

*Published: June 13, 2023* 

In this release, we've made the following changes: 

- Fixed the vulnerability known as [CVE-2023-29362](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29362).
- Fixed the vulnerability known as [CVE-2023-29352](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29352).

## Updates for version 1.2.4331

*Published: June 6, 2023*

In this release, we've made the following changes:

- Improved connection bar resizing so that resizing the bar to its minimum width doesn't make its buttons disappear.
- Fixed an application compatibility issue that affected preview versions of Windows.
- Moved the identity verification method from the lock window message in the connection bar to the end of the connection info message.
- Changed the error message that appears when the session host can't reach the authenticator to validate a user's credentials to be clearer.
- Added a reconnect button to the disconnect message boxes that appear whenever the local PC goes into sleep mode or the session is locked. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.4240 

*Published: May 16, 2023*

In this release, we've made the following changes: 

- Fixed an issue where the connection bar remained visible on local sessions when the user changed their contrast themes.
- Made minor changes to connection bar UI, including improved button sizing. 
- Fixed an issue where the client stopped responding if closed from the system tray. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4159

*Published: May 9, 2023*

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

*Published: March 28, 2023*

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
