---
ms.topic: include
author: sipastak
ms.author: sipastak
ms.date: 02/28/2025
---

## Supported client versions

The following table lists the current versions available for the public and Insider releases. To enable Insider releases, see [Enable Insider releases](../users/client-features-windows.md#enable-insider-releases).

| Release | Latest version | Download |
|--|--|--|
| Public | 1.2.6014 | [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2139369) *(most common)*<br />[Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2139456)<br />[Windows Arm64](https://go.microsoft.com/fwlink/?linkid=2139370) |
| Insider | 1.2.6072 | [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2139233) *(most common)*<br />[Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2139144)<br />[Windows Arm64](https://go.microsoft.com/fwlink/?linkid=2139368) |

## Updates for version 1.2.6072 (Insider)

*Date published: February 25, 2025* 

Download: [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2139233), [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2139144), [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2139368)

- Fixed an issue with RemoteApps where a maximized window unexpectedly changes size.
- Improved accessibility for the **More Options** menu.

## Updates for version 1.2.6014  

*Date published: February 3, 2025* 

Download: [Windows 64-bit](https://go.microsoft.com/fwlink/?linkid=2139233), [Windows 32-bit](https://go.microsoft.com/fwlink/?linkid=2139144), [Windows ARM64](https://go.microsoft.com/fwlink/?linkid=2139368)

- Bug fixes and general improvements.

> [!NOTE]
> This version replaced the Insider version 1.2.6013. Changes noted above reflect all changes for these versions. 

## Updates for version 1.2.5910  

*Date published: January 21, 2025* 

Download: [Windows 64-bit](https://res.cdn.office.net/remote-desktop-windows-client/b6a8d075-5e2f-4166-a9c9-78180790dfa1/RemoteDesktop_1.2.5910.0_x64.msi), [Windows 32-bit](https://res.cdn.office.net/remote-desktop-windows-client/dbd2c29e-6b06-4c7c-ba49-56cc1a3ca8a0/RemoteDesktop_1.2.5910.0_x86.msi), [Windows Arm64](https://res.cdn.office.net/remote-desktop-windows-client/ebc331c2-c93e-48e9-8740-600218caf43c/RemoteDesktop_1.2.5910.0_ARM64.msi) 

- Fixed an issue for [CVE-2024-49105](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-49105).
- Added support to optimize screen and app sharing.
- Resolved an issue with keyboard shortcut <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Arrow</kbd> in a RemoteApp scenario.
- Improved the session relaunch experience, removing the requirement that the previous session fully process telemetry before the next session launches.

> [!NOTE]
> This version replaced the Insider versions 1.2.5900, 1.2.5905, and 1.2.5906. This list reflects all changes for these versions. 
  
## Updates for version 1.2.5807 
 
*Date published: January 7, 2025*

- Fixed an issue for [CVE-2024-49105](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-49105).
- Added list of graphics codecs to the Connection Information dialog. 
- Fixed an issue where the bottom portion of the Windows Authentication dialog could be cut off when connected to a RemoteApp.  
- Fixed an issue where the Connection Information dialog showed the lowest RTT instead of average RTT. 
- Fixed an issue where UDP type was incorrectly reported as "UDP (Private Network)" for all UDP connections in the Connection Info dialog.
 
> [!NOTE]
> This version contains all changes from Insider versions 1.2.5799, 1.2.5800, 1.2.5802, 1.2.5804, and 1.2.5806. Changes noted above reflect all changes for these versions.  
 
## Updates for version 1.2.5716 

*Date published: December 10, 2024*

- Fixed an issue for [CVE-2024-49105](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-49105). 

## Updates for version 1.2.5713

*Date published: November 12, 2024*   

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.5709

*Date published: October 8, 2024*

- Fixed an issue for [CVE-2024-43533](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-43533).
- Multimedia redirection call redirection is now generally available.

## Updates for version 1.2.5704 

*Date published: September 18, 2024*   

- Fixed an issue where initiating a screen capture while Teams is open as a RemoteApp caused the client to crash.  
- Fixed an issue where the client crashed for users who have Windows N SKUs without the media framework. 
- Addressed an issue that reduces the chance of encountering a **low virtual memory** error on reconnect attempts.
- Made an improvement where new session windows won't become the focused windows. 
- Fixed a bug to ensure that the `screen mode id` setting in an RDP file is honored.
- Fixed issue where Microsoft Teams rendered into the wrong window when multiple Remote Desktop session windows were open. 

> [!NOTE]
> This version replaced the Insider version 1.2.5702, 1.2.5701, and 1.2.5699. It contains all changes made in noted versions and was promoted to public on September 18, 2024. 

## Updates for version 1.2.5623 

*Date published: September 4, 2024*   

- Fixed an issue where the client crashed for users who have Windows N SKUs without the media framework.
- Addressed an issue that reduces the chance of encountering a “low virtual memory” error on reconnect attempts.

> [!NOTE]
> This hotfix version replaced the public version 1.2.5620 and has the same release notes with the addition of the above fixes. 

## Updates for version 1.2.5620

*Date published: August 13, 2024* 

- Fixed an issue for [CVE-2024-38131](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2024-38131).

> [!NOTE]
> This version replaced the Insider version 1.2.5617 and has the same release notes with the addition of the security release.  

## Updates for version 1.2.5560

*Date published: August 13, 2024* 

- Fixed an issue for [CVE-2024-38131 ](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2024-38131).


## Updates for version 1.2.5617

*Date published: July 23, 2024* 

In this release, we made the following changes:

- Stability and security improvements for printer redirection.
- Improved the experience for single sign-on lock screen dialogs.
- Fixed an issue with single sign-on sign-in failure.
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

- Fixed an issue where a minimized RemoteApp window maximizes when the lock screen timer runs out for a RemoteApp session.
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

- Fixed an issue where the client crashed when responding to an incoming Microsoft Teams call.  

> [!NOTE]
> This Insider release was originally version 1.2.5452, but we made this change and re-released it as 1.2.5453. This version contains all of the changes made in 1.2.5450 and 1.2.5452. 

## Updates for version 1.2.5452

*Date published: May 29, 2024* 

In this release, we made the following changes:

- Improved the graphics presentation latency.

> [!NOTE]
> This Insider release was originally version 1.2.5450, but we made this change and re-released it as 1.2.5452. This version contains all of the changes made in 1.2.5450. 

## Updates for version 1.2.5450  

*Date published: May 21, 2024* 

In this release, we made the following changes:

- When a user subscribes to feeds via URL, all message states for the status message box can be announced by screen readers. 
- When users search for workspaces via URL, they now see the searching status when entering URL-formatted input and receive an error if results aren't found. 
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

In this release, we made the following changes:

- Fixed an issue that caused the RemoteApp window to appear stretched.
- When users enter text into the email or URL field to search for a workspace while subscribing to a feed, screen readers now announce whether the client can find the workspace.
- Fixed an issue that made the MFA prompt appear twice when users tried to connect to a resource 
- Fixed an issue that caused an extra string to appear next to a user's tenant URL.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

> [!NOTE]
> This release was originally version 1.2.5326, but we made a hotfix after receiving user reports about issues that affected the MFA prompt and tenant URLs. Version 1.2.5331, which fixes these issues, replaces version 1.2.5326.

## Updates for version 1.2.5255

*Date published: March 11, 2024*

> [!NOTE]
> This version includes all the latest updates made in public build [1.2.5252](#updates-for-version-125252) and Insider builds [1.2.5248](#updates-for-version-125248) and [1.2.5126](#updates-for-version-125126). 

In this release, we made the following change:

- Fixed an issue that caused connections to stop working when users tried to connect from a Private Network to Azure Virtual Desktop environment.

## Updates for version 1.2.5254

*Date published: March 6, 2024*

>[!NOTE]
>This version replaced [1.2.5252](#updates-for-version-125252) and has the same release notes as [version 1.2.5112](#updates-for-version-125112). 

## Updates for version 1.2.5252

*Date published: February 29, 2024*

>[!NOTE]
>This version was released as a Public version on March 5, 2024 but was replaced by [version 1.2.5254](#updates-for-version-125254) on March 6, 2024.

In this release, we made the following changes:

- Devices no longer go into idle mode when video playback is active. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.5248

*Date published: February 13, 2024*

>[!NOTE]
>This version was an Insiders version that was replaced by version 1.2.5252 and never released to Public.
In this release, we made the following changes:

- Fixed an issue that caused artifacts to appear on the screen during RemoteApp sessions.
- Fixed an issue where resizing the Teams video call window caused the client to temporarily stop responding.
- Fixed an issue that made Teams calls echo after expanding a two-person call to meeting call.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.5126

*Published: January 24, 2024*

>[!NOTE]
>This version was an Insiders version that was replaced by version 1.2.5248 and never released to Public.
In this release, we made the following changes:

- Fixed the regression that caused a display issue when a user selects monitors for their session. 
- Made the following accessibility improvements: 
  - Improved screen reader experience.
  - Greater contrast for background color of the connection bar remote commands drop-down menu. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.5112

*Published: February 7, 2024*

In this release, we made the following changes:

- Fixed the regression that caused a display issue when a user selects monitors for their session.

## Updates for version 1.2.5105

*Published: January 9, 2024*

In this release, we made the following changes:

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

In this release, we made the following change:

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4763

*Published: November 7, 2023*

In this release, we made the following changes:

- Added a link to the troubleshooting documentation to error messages to help users resolve minor issues without needing to contact Microsoft Support. 
- Improved the connection bar user interface (UI). 
- Fixed an issue that caused the client to stop responding when a user tries to resize the client window during a Teams video call. 
- Fixed a bug that prevented the client from loading more than 255 workspaces.  
- Fixed an authentication issue that allowed users to choose a different account whenever the client required more interaction. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues. 

## Updates for version 1.2.4677

*Published: October 17, 2023*

In this release, we made the following changes:

- Added new parameters for multiple monitor configuration when connecting to a remote resource using the [Uniform Resource Identifier (URI) scheme](../uri-scheme.md).
- Added support for the following languages: Czech (Czechia), Hungarian (Hungary), Indonesian (Indonesia), Korean (Korea), Portuguese (Portugal), Turkish (Türkiye).
- Fixed a bug that caused a crash when using Teams Media Optimization. 
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

>[!NOTE]
>This Insiders release was originally version 1.2.4675, but we made a hotfix for the vulnerability known as [CVE-2023-5217](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-5217). 

## Updates for version 1.2.4583

*Published: October 6, 2023*

In this release, we made the following change:

- Fixed the [CVE-2023-5217](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-5217) security vulnerability.

## Updates for version 1.2.4582

*Published: September 19, 2023*

In this release, we made the following changes:

- Fixed an issue when using the default display settings and a change is made to the system display settings, where the bar doesn't show when hovering over top of screen after it's hidden.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Accessibility improvements:
   - Narrator now announces the view mode selector as "*View combo box*" instead of "*Tile view combo box*" or "*List view combo box*".
   - Narrator now focuses on and announces **Learn more** hyperlinks.
   - Keyboard focus is now set correctly when a warning dialog loads.
   - Tooltip for the close button on the **About** panel now dismisses when keyboard focus moves.
   - Keyboard focus is now properly displayed for certain drop-down selectors in the **Settings** panel for published desktops.

> [!NOTE]
> This release was originally version 1.2.4577, but we made a hotfix after reports that connections to machines with watermarking policy enabled were failing. Version 1.2.4582, which fixes this issue, replaces version 1.2.4577.

## Updates for version 1.2.4487

*Published: July 21, 2023*

In this release, we made the following changes:

- Fixed an issue where the client doesn't auto-reconnect when the gateway WebSocket connection shuts down normally.

## Updates for version 1.2.4485

*Published: July 11, 2023*

In this release, we made the following changes:

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

In this release, we made the following changes:

- General improvements to Narrator experience.
- Fixed an issue that caused the text in the message for subscribing to workspaces to be cut off when the user increases the text size.
- Fixed an issue that caused the client to sometimes stop responding when attempting to start new connections.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.4337

*Published: June 13, 2023*

In this release, we made the following changes:

- Fixed the vulnerability known as [CVE-2023-29362](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29362).
- Fixed the vulnerability known as [CVE-2023-29352](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-29352).

## Updates for version 1.2.4331

*Published: June 6, 2023*

In this release, we made the following changes:

- Improved connection bar resizing so that resizing the bar to its minimum width doesn't make its buttons disappear.
- Fixed an application compatibility issue that affected preview versions of Windows.
- Moved the identity verification method from the lock window message in the connection bar to the end of the connection info message.
- Changed the error message that appears when the session host can't reach the authenticator to validate a user's credentials to be clearer.
- Added a reconnect button to the disconnect message boxes that appear whenever the local PC goes into sleep mode or the session is locked.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.4240

*Published: May 16, 2023*

In this release, we made the following changes:

- Fixed an issue where the connection bar remained visible on local sessions when the user changed their contrast themes.
- Made minor changes to connection bar UI, including improved button sizing.
- Fixed an issue where the client stopped responding if closed from the system tray.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.4159

*Published: May 9, 2023*

In this release, we made the following changes:

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

In this release, we made the following changes:

- General improvements to Narrator experience.
- Fixed a bug that caused the client to stop responding when disconnecting from the session early.
- Fixed a bug that caused duplicate error messages to appear while connected to an Azure Active Directory-joined host using the new Remote Desktop Services (RDS) Azure Active Directory (Azure AD) Auth protocol.
- Fixed a bug that caused scale resolution options to not display in display settings for session desktops.
- Disabled UPnP for non-Insiders customers after reports of connectivity issues.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to multimedia redirection for Azure Virtual Desktop, including:
   - Fixed an issue that caused multimedia redirection for Azure Virtual Desktop to not load for the Arm64 version of the client.
- Updates to Teams for Azure Virtual Desktop, including:
   - Fixed an issue that caused the application window sharing to freeze or show a black screen in scenarios with Topmost window occlusions.
   - Fixed an issue that caused Teams media optimizations for Azure Virtual Desktop to not load for the Arm64 version of the client.

>[!NOTE]
>This release was originally version 1.2.4065, but we made a hotfix after reports that UPnP was causing connectivity issues. Version 1.2.4066 replaces the previous version and disables UPnP.

## Updates for version 1.2.3918

*Published: February 7, 2023*

In this release, we made the following changes:

- Fixed a bug where workspace refreshes increased memory usage.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including:
   - Bug fix for Background Effects persistence between Teams sessions.
- Updates to multimedia redirection for Azure Virtual Desktop, including:
   - Various bug fixes for multimedia redirection video playback redirection.
   - [Multimedia redirection for Azure Virtual Desktop](../multimedia-redirection.md) is now generally available.

>[!IMPORTANT]
>This is the final version of the Remote Desktop client with Windows 7 support. After this version, if you try to use the Remote Desktop client with Windows 7, it might not work as expected. For more information about which versions of Windows the Remote Desktop client currently supports, see [Prerequisites](../users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json&tabs=subscribe#prerequisites).

## Updates for version 1.2.3770

*Published: December 14, 2022*

In this release, we made the following changes:

- Fixed an issue where the app sometimes entered an infinite loop while disconnecting.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - Fixed an issue that caused the incorrect rendering of an incoming screen share when using an ultrawide (21:9) monitor.

## Updates for version 1.2.3667

*Published: November 30, 2022*

In this release, we made the following changes:

- Added User Datagram Protocol support to the client's Arm64 platform.
- Fixed an issue where the tooltip didn't disappear when the user moved the mouse cursor away from the tooltip area.
- Fixed an issue where the application crashes when calling reset manually from the command line.
- Fixed an issue where the client stops responding when disconnecting, which prevents the user from launching another connection.
- Fixed an issue where the client stops responding when coming out of sleep mode.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.3577

*Published: October 10, 2022*

In this release, we made the following change:

- Fixed a bug related to tracing that was blocking reconnections.

## Updates for version 1.2.3576

*Published: October 6, 2022*

In this release, we made the following change:

- Fixed a bug that affected users of some third-party plugins.

## Updates for version 1.2.3575

*Published: October 4, 2022*

In this release, we made the following change:

- Fixed an issue that caused unexpected disconnects in certain RemoteApp scenarios.

## Updates for version 1.2.3574

*Published: October 4, 2022*

In this release, we made the following changes:

- Added banner warning users running client on Windows 7 that support for Windows 7 will end starting January 10, 2023.
- Added page to installer warning users running client on Windows 7 that support for Windows 7 will end starting January 10, 2023.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to [Multimedia redirection for video playback and calls in a remote session](../multimedia-redirection-video-playback-calls.md) including the following:
   - Multimedia redirection now works on a browser published as a RemoteApp and supports up to 30 sites.
   - Multimedia redirection introduces better diagnostic tools with the new status icon and one-click Tracelog.

## Updates for version 1.2.3497

*Published: September 20, 2022*

In this release, we made the following changes:

- Accessibility improvements through increased color contrast in the virtual desktop connection blue bar.
- Updated connection information dialog to distinguish between WebSocket (renamed from TCP), RDP Shortpath for managed networks, and RDP Shortpath for public networks.
- Fixed bugs.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - Fixed an issue that caused calls to disconnect when using a microphone with a high sample rate (192 kbps).
- Resolved a connectivity issue with older RDP stacks.

## Updates for version 1.2.3496

*Published: September 8, 2022*

In this release, we made the following change:

- Reverted to version 1.2.3401 build to avoid a connectivity issue with older RDP stacks.

## Updates for version 1.2.3401

*Published: August 2, 2022*

In this release, we made the following changes:

- Fixed an issue where the narrator was announcing the **tenant expander** button as **on** or **off** instead of **expanded** or **collapsed**.
- Fixed an issue where the text size didn't change when the user adjusted the text size system setting.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.3317

*Published: July 12, 2022*

In this release, we made the following change:

- Fixed the vulnerability known as [CVE-2022-30221](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-30221).

## Updates for version 1.2.3316

*Published: July 6, 2022*

In this release, we made the following changes:

- Fixed an issue where the service couldn't render RemoteApp windows while RemoteFX Advanced Graphics were disabled.
- Fixed an issue that happened when a user tried to connect to an Azure Virtual Desktop endpoint while using the Remote Desktop Services Transport Layer Security protocol (RDSTLS) with CredSSP disabled, which caused the Windows Desktop client to not prompt the user for credentials. Because the client couldn't authenticate, it would get stuck in an infinite loop of failed connection attempts.
- Fixed an issue that happened when users tried to connect to an Azure Active Directory (Azure AD)-joined Azure Virtual Desktop endpoint from a client machine joined to the same Azure AD tenant while the Credential Security Support Provider protocol (CredSSP) was disabled.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - Better noise suppression during calls.
  - A diagnostic overlay now appears when you press **Shift+Ctrl+Semicolon (;)** during calls. The diagnostic overlay only works with version 1.17.2205.23001 or later of the Remote Desktop WebRTC Redirector Service. You can download the latest version of the service [here](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4YM8L).

## Updates for version 1.2.3213

*Published: June 2, 2022*

In this release, we made the following changes:

- Reduced flicker when application is restored to full-screen mode from minimized state in single-monitor configuration.
- The client now shows an error message when the user tries to open a connection from the UI, but the connection doesn't launch.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - The new hardware encoding feature increases the video quality (resolution and framerate) of the outgoing camera during Teams calls. Because this feature uses the underlying hardware on the PC and not just software, we're being extra careful to ensure broad compatibility before turning on the feature by default for all users. Therefore, this feature is currently off by default. To get an early preview of the feature, you can enable it on your local machine by creating a registry key at **Computer\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Terminal Server Client\Default\AddIns\WebRTC Redirector\UseHardwareEncoding** as a **DWORD** value and setting it to **1**. To disable the feature, set the key to **0**.

## Updates for version 1.2.3130

*Published: May 10, 2022*

In this release, we made the following changes:

- Fixed the vulnerability known as [CVE-2022-22017](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-22017).
- Fixed the vulnerability known as [CVE-2022-26940](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-26940).
- Fixed the vulnerability known as [CVE-2022-22015](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-22015).
- Fixed an issue where the [Class Identifier (CLSID)-based registration of the dynamic virtual channel (DVC) plug-in](/windows/win32/termserv/dvc-plug-in-registration) wasn't working.

## Updates for version 1.2.3128

*Published: May 3, 2022*

In this release, we made the following changes:

- Improved Narrator application experience.
- Accessibility improvements.
- Fixed a regression that prevented subsequent connections after reconnecting to an existing session with the group policy object (GPO) **User Configuration\Administrative Templates\System\Ctrl+Alt+Del Options\Remove Lock Computer** enabled.
- Added an error message for when a user selects a credential type for smart card or Windows Hello for Business but the required smart card redirection is disabled in the RDP file.
- Improved diagnostic for User Data Protocol (UDP)-based Remote Desktop Protocol (RDP) transport protocols.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including updating the WebRTC stack from version M88 to M98. M98 provides better reliability and performances when making audio and video calls.

## Updates for version 1.2.3004

*Published: March 29, 2022*

In this release, we made the following changes:

- Fixed an issue where Narrator didn't announce grid or list views correctly.
- Fixed an issue where the `msrdc.exe` process might take a long time to exit after closing the last Azure Virtual Desktop connection if customers have set a very short token expiration policy.
- Updated the error message that appears when users are unable to subscribe to their feed.
- Updated the disconnect dialog boxes that appear when the user locks their remote session or puts their local computer in sleep mode to be only informational.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- [Multimedia redirection for Azure Virtual Desktop](../multimedia-redirection.md) now has an update that gives it more site and media control compatibility.
- Improved connection reliability for Teams on Azure Virtual Desktop.

## Updates for version 1.2.2927

*Published: March 15, 2022*

In this release, we made the following change:

- Fixed an issue where the number pad didn't work on initial focus.

## Updates for version 1.2.2925

*Published: March 8, 2022*

In this release, we made the following changes:

- Fixed the vulnerability known as [CVE-2022-21990](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-21990).
- Fixed the vulnerability known as [CVE-2022-24503](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-24503).
- Fixed an issue where background updates could close active remote connections.

## Updates for version 1.2.2924

*Published: February 23, 2022*

In this release, we made the following changes:

- The Desktop client now supports Ctrl+Alt+arrow key keyboard shortcuts during desktop sessions.
- Improved graphics performance with certain mouse types.
- Fixed an issue that caused the client to randomly crash when something ends a RemoteApp connection.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - The background blur feature is rolling out this week for Windows endpoints.
  - Fixed an issue that caused the screen to turn black during Teams video calls.

## Updates for version 1.2.2860

*Published: February 15, 2022*

In this release, we made the following changes:

- Improved stability of Azure Active Directory authentication.
- Fixed an issue that was preventing users from opening multiple .RDP files from different host pools.

## Updates for version 1.2.2851

*Published: January 25, 2022*

In this release, we made the following changes:

- Fixed an issue that caused a redirected camera to give incorrect error codes when camera access was restricted in the Privacy settings on the client device. This update should give accurate error messages in apps using the redirected camera.
- Fixed an issue where the Azure Active Directory credential prompt appeared in the wrong monitor.
- Fixed an issue where the background refresh and update tasks were repeatedly registered with the task scheduler, which caused the background and update task times to change without user input.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams for Azure Virtual Desktop, including the following:
    - In September 2021 we released a preview of our GPU render path optimizations but defaulted them off. After extensive testing, we've now enabled them by default. These GPU render path optimizations reduce endpoint-to-endpoint latency and solve some performance issues. You can manually disable these optimizations by setting the registry key **HKEY_CURRENT_USER \SOFTWARE\Microsoft\Terminal Server Client\IsSwapChainRenderingEnabled** to **00000000**.

## Updates for version 1.2.2691

*Published: January 12, 2022*

In this release, we made the following changes:

- Fixed the vulnerability known as [CVE-2019-0887](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2019-0887).
- Fixed the vulnerability known as [CVE-2022-21850](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-21850).
- Fixed the vulnerability known as [CVE-2022-21851](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-21851).
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.2688

*Published: December 9, 2021*

In this release, we made the following change:

- Fixed an issue where some users were unable to subscribe using the **subscribe with URL** option after updating to version 1.2.2687.0.

## Updates for version 1.2.2687

*Published: December 2, 2021*

In this release, we made the following changes:

- Improved manual refresh functionality to acquire new user tokens, which ensures the service can accurately update user access to resources.
- Fixed an issue where the service sometimes pasted empty frames when a user tried to copy an image from a remotely running Internet Explorer browser to a locally running Word document.
- Fixed the vulnerability known as [CVE-2021-38665](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38665).
- Fixed the vulnerability known as [CVE-2021-38666](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38666).
- Fixed the vulnerability known as [CVE-2021-1669](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-1669).
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed a usability issue where the Windows Desktop client would sometimes prompt for a password (Azure Active Directory prompt) after the device went into sleep mode.
- Fixed an issue where the client didn't automatically expand and display interactive sign-in messages set by admins when a user signs in to their virtual machine.
- Fixed a reliability issue that appeared in version 1.2.2686 where the client stopped responding when users tried to launch new connections.
- Updates to Teams for Azure Virtual Desktop, including the following:
   - The notification volume level on the client device is now the same as the host device.
   - Fixed an issue where the device volume was low in Azure Virtual Desktop sessions
   - Fixed a multi-monitor screen sharing issue where screen sharing didn't appear correctly when moving from one monitor to the other.
   - Resolved a black screen issue that caused screen sharing to incorrectly show a black screen sometimes.
   - Increased the reliability of the camera stack when resizing the Teams app or turning the camera on or off.
   - Fixed a memory leak that caused issues like high memory usage or video freezing when reconnecting with Azure Virtual Desktop.
   - Fixed an issue that caused Remote Desktop connections to stop responding.

## Updates for version 1.2.2606

*Published: November 9, 2021*

In this release, we made the following changes:

- Fixed the vulnerability known as [CVE-2021-38665](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38665).
- Fixed the vulnerability known as [CVE-2021-38666](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-38666).
- Fixed an issue where the service sometimes pasted empty frames when a user tried to copy an image from a remotely running Internet Explorer browser to a locally running Word document.

## Updates for version 1.2.2600

*Published: October 26, 2021*

In this release, we made the following changes:

- Updates to Teams for Azure Virtual Desktop, including improvements to camera performance during video calls.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.

## Updates for version 1.2.2459

*Published: September 28, 2021*

In this release, we made the following changes:

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed an issue that caused the client to prompt for credentials a second time after closing a credential prompt window while subscribing.
- Updates to Teams for Azure Virtual Desktop, including the following:
  - Fixed an issue in that made the video screen turn black and crash during calls in the Chrome browser.
  - Reduced E2E latency and some performance issues by optimizing the GPU render path in the Windows Desktop client. To enable the new render path, add the registry key **HKEY_CURRENT_USER \SOFTWARE\Microsoft\Terminal Server Client\IsSwapChainRenderingEnabled** and set its value to **00000001**. To disable the new render path and revert to the original path, either set the key's value to **00000000** or delete the key.

## Updates for version 1.2.2322

*Published: August 24, 2021*

In this release, we made the following changes:

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Added updates to Teams on Azure Virtual Desktop, including:
  - Fixed an issue that caused the screen to turn black when Direct X wasn't available for hardware decoding.
  - Fixed a software decoding and camera preview issue that happened when falling back to software decode.
- [Multimedia redirection for Azure Virtual Desktop](../multimedia-redirection.md) is now in preview.

## Updates for version 1.2.2223

*Published: August 10, 2021*

In this release, we made the following change:

- Fixed the security vulnerability known as [CVE-2021-34535](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-34535).

## Updates for version 1.2.2222

*Published: July 27, 2021*

In this release, we made the following changes:

- The client also updates in the background when the auto-update feature is enabled, no remote connection is active, and `msrdcw.exe` isn't running.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed an ICE inversion parameter issue that prevented some Teams calls from connecting.

## Updates for version 1.2.2130

*Published: June 22, 2021*

In this release, we made the following changes:

- Windows Virtual Desktop has been renamed to Azure Virtual Desktop. Learn more about the name change at [our announcement on our blog](https://azure.microsoft.com/blog/azure-virtual-desktop-the-desktop-and-app-virtualization-platform-for-the-hybrid-workplace/).
- Fixed an issue where the client would ask for authentication after the user ended their session and closed the window.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Fixed an issue with Logitech C270 cameras where Teams only showed a black screen in the camera settings and while sharing images during calls.

## Updates for version 1.2.2061

*Published: May 25, 2021*

In this release, we made the following changes:

- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams on Azure Virtual Desktop, including the following:
  - Resolved a black screen video issue that also fixed a mismatch in video resolutions with Teams Server.
  - Teams on Azure Virtual Desktop now changes resolution and bitrate in accordance with what Teams Server expects.

## Updates for version 1.2.1954

*Published: May 13, 2021*

In this release, we made the following change:

- Fixed the vulnerability known as [CVE-2021-31186](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-31186).

## Updates for version 1.2.1953

*Published: May 6, 2021*

In this release, we made the following changes:

- Fixed an issue that caused the client to crash when users selected **Disconnect all sessions** in the system tray.
- Fixed an issue where the client wouldn't switch to full screen on a single monitor with a docking station.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates to Teams on Azure Virtual Desktop, including the following:
  - Added hardware acceleration for video processing outgoing video streams for Windows 10-based clients.
  - When joining a meeting with both a front-facing and rear-facing or external camera, the front-facing camera is selected by default.
  - Fixed an issue that made Teams on Azure Virtual Desktop crash while loading on x86-based machines.
  - Fixed an issue that caused striations during screen sharing.
  - Fixed an issue that prevented some people in meetings from seeing incoming video or screen sharing.

## Updates for version 1.2.1844

*Published: March 23, 2021*

In this release, we made the following changes:

- Updated background installation functionality to perform silently for the client auto-update feature.
- Fixed an issue where the client forwarded multiple attempts to launch a desktop to the same session. Depending on your group policy configuration, the session host can now allow the creation of multiple sessions for the same user on the same session host or disconnect the previous connection by default. This behavior wasn't consistent before version 1.2.1755.
- Improved client logging, diagnostics, and error classification to help admins troubleshoot connection and feed issues.
- Updates for Teams on Azure Virtual Desktop, including the following:
  - We've offloaded video processing (XVP) to reduce CPU utilization by 5-10% (depending on CPU generation). Combined with the hardware decode feature from February's update, we've now reduced the total CPU utilization by 10-20% (depending on CPU generation).
  - We've added XVP and hardware decode, which allows older machines to display more incoming video streams smoothly in 2x2 mode.
  - We've also updated the WebRTC stack from version M74 to M88. M88 has better reliability, AV sync performance, and fewer transient issues.
  - We've replaced our software H264 encoder with OpenH264. OpenH264 is an open-source codec that increases video quality of the outgoing camera stream.
  - The client now has simultaneous shipping with 2x2 mode. 2x2 mode shows up to four incoming video streams simultaneously.

## Updates for version 1.2.1755

*Published: February 23, 2021*

In this release, we made the following changes:

- Added the Experience Monitor access point to the system tray icon.
- Fixed an issue where entering an email address into the **Subscribe to a Workplace** tab caused the application to stop responding.
- Fixed an issue where the client sometimes didn't send Event Hubs and Diagnostics events.
- Updates to Teams on Azure Virtual Desktop, including:
  - Improved audio and video sync performance and added hardware accelerated decode that decreases CPU utilization on the client.
  - Addressed the most prevalent causes of black screen issues when a user joins a call or meeting with their video turned on, when a user performs screen sharing, and when a user toggles their camera on and off.
  - Improved quality of active speaker switching in single video view by reducing the time it takes for the video to appear and reducing intermittent black screens when switching video streams to another user.
  - Fixed an issue where hardware devices with special characters would sometimes not be available in Teams.

## Updates for version 1.2.1672

*Published: January 26, 2021*

In this release, we made the following changes:

- Added support for the screen capture protection feature for Windows 10 endpoints. To learn more, see [Session host security best practices](../security-guide.md#session-host-security-best-practices).
- Added support for proxies that require authentication for feed subscription.
- The client now shows a notification with an option to retry if an update didn't successfully download.
- Addressed some accessibility issues with keyboard focus and high-contrast mode.

## Updates for version 1.2.1525

*Published: December 1, 2020*

In this release, we made the following changes:

- Added List view for remote resources so that longer app names are readable.
- Added a notification icon that appears when an update for the client is available.

## Updates for version 1.2.1446

*Published: October 27, 2020*

In this release, we made the following changes:

- Added the auto-update feature, which allows the client to install the latest updates automatically.
- The client now distinguishes between different feeds in the Connection Center.
- Fixed an issue where the subscription account doesn't match the account the user signed in with.
- Fixed an issue where some users couldn't access a RemoteApp through a downloaded file.
- Fixed an issue with Smartcard redirection.

## Updates for version 1.2.1364

*Published: September 22, 2020*

In this release, we made the following changes:

- Fixed an issue where single sign-on (SSO) didn't work on Windows 7.
- Fixed the connection failure that happened when calling or joining a Teams call while another app has an audio stream opened in exclusive mode and when media optimization for Teams is enabled.
- Fixed a failure to enumerate audio or video devices in Teams when media optimization for Teams is enabled.
- Added a **Need help with settings?** link to the desktop settings page.
- Fixed an issue with the **Subscribe** button that happened when using high-contrast dark themes.

## Updates for version 1.2.1275

*Published: August 25, 2020*

In this release, we made the following changes:

- Added functionality to auto-detect sovereign clouds from the user’s identity.
- Added functionality to enable custom URL subscriptions for all users.
- Fixed an issue with app pinning on the feed taskbar.
- Fixed a crash when subscribing with URL.
- Improved experience when dragging a RemoteApp window with touch or pen.
- Fixed an issue with localization.

## Updates for version 1.2.1186

*Published: July 28, 2020*

In this release, we made the following changes:

- You can now be subscribed to Workspaces with multiple user accounts, using the overflow menu (**...**) option on the command bar at the top of the client. To differentiate Workspaces, the Workspace titles now include the username, as do all app shortcuts titles.
- Added additional information to subscription error messages to improve troubleshooting.
- The collapsed/expanded state of Workspaces is now preserved during a refresh.
- Added a **Send Diagnostics and Close** button to the **Connection information** dialog.
- Fixed an issue with the CTRL + SHIFT keys in remote sessions.

## Updates for version 1.2.1104

*Published: June 23, 2020*

In this release, we made the following changes:

- Updated the automatic discovery logic for the **Subscribe** option to support the Azure Resource Manager-integrated version of Azure Virtual Desktop. Customers with only Azure Virtual Desktop resources should no longer need to provide consent for Azure Virtual Desktop (classic).
- Improved support for high-DPI devices with scale factor up to 400%.
- Fixed an issue where the disconnect dialog didn't appear.
- Fixed an issue where command bar tooltips would remain visible longer than expected.
- Fixed a crash when you tried to subscribe immediately after a refresh.
- Fixed a crash from incorrect parsing of date and time in some languages.

## Updates for version 1.2.1026

*Published: May 27, 2020*

In this release, we made the following changes:

- When subscribing, you can now choose your account instead of typing your email address.
- Added a new **Subscribe with URL** option that allows you to specify the URL of the Workspace you're subscribing to or use email discovery when available in cases where we can't automatically find your resources. This is similar to the subscription process in the other Remote Desktop clients. This can be used to subscribe directly to Azure Virtual Desktop workspaces.
- Added support to subscribe to a Workspace using a new URI scheme that can be sent in an email to users or added to a support website.
- Added a new **Connection information** dialog that provides client, network, and server details for desktop and app sessions. You can access the dialog from the connection bar in full screen mode or from the System menu when windowed.
- Desktop sessions launched in windowed mode now always maximize instead of going full screen when maximizing the window. Use the **Full screen** option from the system menu to enter full screen.
- The Unsubscribe prompt now displays a warning icon and shows the workspace names as a bulleted list.
- Added the details section to additional error dialogs to help diagnose issues.
- Added a timestamp to the details section of error dialogs.
- Fixed an issue where the RDP file setting **desktop size ID** didn't work properly.
- Fixed an issue where the **Update the resolution on resize** display setting didn't apply after launching the session.
- Fixed localization issues in the desktop settings panel.
- Fixed the size of the focus box when tabbing through controls on the desktop settings panel.
- Fixed an issue causing the resource names to be difficult to read in high contrast mode.
- Fixed an issue causing the update notification in the action center to be shown more than once a day.

## Updates for version 1.2.945

*Published: April 28, 2020*

In this release, we made the following changes:

- Added new display settings options for desktop connections available when right-clicking a desktop icon on the Connection Center.
  - There are now three display configuration options: **All displays**, **Single display** and **Select displays**.
  - We now only show available settings when a display configuration is selected.
  - In Select display mode, a new **Maximize to current displays** option allows you to dynamically change the displays used for the session without reconnecting. When enabled, maximizing the session causes it to go full screen on all displays touched by the session window.
  - We've added a new **Single display when windowed** option for all displays and select displays modes. This option switches your session automatically to a single display when you exit full screen mode, and automatically returns to multiple displays when you maximize the window.
- We've added a new **Display settings** group to the system menu that appears when you right-click the title bar of a windowed desktop session. This lets you change some settings dynamically during a session. For example, you can change the new **Single display mode when windowed** and **Maximize to current displays** settings.
- When you exit full screen, the session window returns to its original location when you first entered full screen.
- The background refresh for Workspaces has changed to every four hours instead of every hour. A refresh now happens automatically when launching the client.
- Resetting your user data from the About page now redirects to the Connection Center when completed instead of closing the client.
- The items in the system menu for desktop connections were reordered and the Help topic now points to the client documentation.
- Addressed some accessibility issues with tab navigation and screen readers.
- Fixed an issue where the Azure Active Directory authentication dialog appeared behind the session window.
- Fixed a flickering and shrinking issue when dragging a desktop session window between displays of different scale factors.
- Fixed an error that occurred when redirecting cameras.
- Fixed multiple crashes to improve reliability.

## Updates for version 1.2.790

*Published: March 24, 2020*

In this release, we made the following changes:

- Renamed the **Update** action for Workspaces to **Refresh** for consistency with other Remote Desktop clients.
- You can now refresh a Workspace directly from its context menu.
- Manually refreshing a Workspace now ensures all local content is updated.
- You can now reset the client's user data from the About page without needing to uninstall the app.
- You can also reset the client's user data using `msrdcw.exe /reset` with an optional `/f` parameter to skip the prompt.
- We now automatically look for a client update when navigating to the About page.
- Updated the color of the buttons for consistency.

## Updates for version 1.2.675

*Published: February 25, 2020*

In this release, we made the following changes:

- Connections to Azure Virtual Desktop are now blocked if the RDP file is missing the signature or one of the signscope properties has been modified.
- When a Workspace is empty or has been removed, the Connection Center no longer appears to be empty.
- Added the activity ID and error code on disconnect messages to improve troubleshooting. You can copy the dialog message with **Ctrl+C**.
- Fixed an issue that caused the desktop connection settings to not detect displays.
- Client updates no longer automatically restart the PC.
- Windowless icons should no longer appear on the taskbar.

## Updates for version 1.2.605

*Published: January 29, 2020*

In this release, we made the following changes:

- You can now select which displays to use for desktop connections. To change this setting, right-click the icon of the desktop connection and select **Settings**.
- Fixed an issue where the connection settings didn't display the correct available scale factors.
- Fixed an issue where Narrator couldn't read the dialogue shown while the connection initiated.
- Fixed an issue where the wrong user name displayed when the Azure Active Directory and Active Directory names didn't match.
- Fixed an issue that made the client stop responding when initiating a connection while not connected to a network.
- Fixed an issue that caused the client to stop responding when attaching a headset.

## Updates for version 1.2.535

*Published: December 4, 2019*

In this release, we made the following changes:

- You can now access information about updates directly from the more options button on the command bar at the top of the client.
- You can now report feedback from the command bar of the client.
- The Feedback option is now only shown if the Feedback Hub is available.
- Ensured the update notification is not shown when notifications are disabled through policy.
- Fixed an issue that prevented some RDP files from launching.
- Fixed a crash on startup of the client caused by corruption of some persistent settings.

## Updates for version 1.2.431

*Published: November 12, 2019*

In this release, we made the following changes:

- The 32-bit and Arm64 versions of the client are now available!
- The client now saves any changes you make to the connection bar (such as its position, size, and pinned state) and applies those changes across sessions.
- Updated gateway information and connection status dialogs.
- Addressed an issue that caused two credentials to prompt at the same time while trying to connect after the Azure Active Directory token expired.
- On Windows 7, users are now properly prompted for credentials if they had saved credentials when the server disallows it.
- The Azure Active Directory prompt now appears in front of the connection window when reconnecting.
- Items pinned to the taskbar are now updated during a feed refresh.
- Improved scrolling on the Connection Center when using touch.
- Removed the empty line from the resolution drop-down menu.
- Removed unnecessary entries in Windows Credential Manager.
- Desktop sessions are now properly sized when exiting full screen.
- The RemoteApp disconnection dialog now appears in the foreground when you resume your session after entering sleep mode.
- Addressed accessibility issues like keyboard navigation.

## Updates for version 1.2.247

*Published: September 17, 2019*

In this release, we made the following changes:

- Improved the fallback languages for localized version. (For example, FR-CA will properly display in French instead of English.)
- When removing a subscription, the client now properly removes the saved credentials from Credential Manager.
- The client update process is now unattended once started and the client will relaunch once completed.
- The client can now be used on Windows 10 in S mode.
- Fixed an issue that caused the update process to fail for users with a space in their username.
- Fixed a crash that happened when authenticating during a connection.
- Fixed a crash that happened when closing the client.
