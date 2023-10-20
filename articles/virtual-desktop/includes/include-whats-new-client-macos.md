---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 10/02/2023
---

## Latest client versions

The following table lists the current versions available for the public and beta releases:

| Release | Latest version | Download |
|---------|----------------|----------|
| Public  | 10.9.3         | [Mac App Store](https://apps.apple.com/app/microsoft-remote-desktop/id1295203466?mt=12) |
| Beta    | 10.9.3         | [Microsoft AppCenter](https://aka.ms/rdmacbeta) |

## Updates for version 10.9.3

*Date published: October 2, 2023*

In this release, we've made the following changes:

- Fixed an issue where using workspace refresh deleted the workspace.
- Resolved a RemoteApp issue where drag operations sometimes didn't work on certain apps.
- Fixed an incorrect error message displayed for expired passwords.
- Addressed a number of accessibility bugs.

## Updates for version 10.9.2

*Date published: September 11, 2023*

In this release, we've made the following changes:

- Addressed "Proof Key for Code Exchange is required" message users receive when refreshing AVD workspaces after upgrading from versions 10.9.0 and 10.9.1.

## Updates for version 10.9.1

*Date published: September 5, 2023*

In this release, we've made the following changes:

- Addressed clipboard redirection issue for macOS 11.

## Updates for version 10.9.0

*Date published: August 16, 2023*

In this release,  we added two new features for Azure Virtual Desktop and addressed a number of reported bugs and incidents. 

- Added support for RDP Shortpath for public networks for Azure Virtual Desktop connections.
- Integrated an Azure Virtual Desktop account profile switcher into the Connection Center.
- Improved diagnostics sent during Azure Virtual Desktop connections.
- Added support for video mirroring in Teams redirection.

>[!NOTE]
>This release isn't compatible with macOS 10.14 and macOS 10.15.

## Updates for Version 10.8.4

*Date published: June 16, 2023*

In this release, we've made the following changes:

- Updated time zone redirection to accommodate certain daylight savings scenarios.
- Resolved an issue that incorrectly toggled Caps Lock in RemoteApp connections.
- Changed gesture recognition to make small mouse-scrolling movements smoother.
- Fixed an issue that caused the client to stop responding when resuming a connection after entering sleep mode.
- Updated Azure Virtual Desktop diagnostics to align with service expectations.
- Created a workaround for a service-side simulcast regression that affected Teams redirection.

## Updates for Version 10.8.3

*Date published: May 20, 2023*

In this release, we've made the following changes:

- Fixed connectivity issue that affected connections with Windows XP and Windows Vista.
- Addressed an issue that caused diagnostics reporting for Azure Virtual Desktop connections to be inaccurate.

## Updates for Version 10.8.2

*Date published: April 25, 2023*

In this release, we've made the following changes:

- Integrated support for the new Remote Desktop Services (RDS) Azure Active Directory (Azure AD) Auth Protocol for authentication and session security.
- Added deterministic progress UI for Azure Virtual Desktop workspace refresh. 
- Resolved some of the most common crashes reported by debug telemetry.
- Fixed a bug that caused vertical lines to appear in the remote session rendering.
- Addressed a scenario where the app would stop responding when running Slack.
- Addressed issue with full-screen scenarios that happened when users disabled the "Displays have separate Spaces" setting.
- Fixed an issue that resulted in the caps lock state syncing incorrectly between client and server.
- Performance and reliability updates to Teams redirection
- Updates to improve Azure Virtual Desktop connectivity and diagnostics.

## Updates for Version 10.8.1

*Date published: January 25, 2023*

In this release, we've made the following changes:

- Bug fixes and feature updates.
- Teams redirection for Azure Virtual Desktop now supports Noise Cancellation and Give/Take Control.
- Fixed connection blocking issues that affected a small number of users.
- Updated Azure Virtual Desktop diagnostics to address a reporting error.
- New clipboard redirection options including bidirectional clipboard syncing, local to remote, or remote to local.

## Updates for Version 10.8.0

*Date published: December 14, 2022*

In this release, we've made the following changes:

- Fixed a few bugs, cleaned up some underlying code, and made changes to prepare for future updates.
- Added a button to the General Preferences dialog that allows you to clear stored PC thumbnails.

## Updates for Version 10.7.10

*Date published: October 24, 2022*

In this release, we've added some new features to Teams redirection for Azure Virtual Desktop and Windows 365 scenarios:

- Give/Take Control support.
- Background blur support.
- Background replacement support.

We've also made some additional fixes and performance improvements, including the following:

- We resolved some customer-reported time zone redirection mismatches.
- We've improved smart card redirection performance.
- We addressed overactive Azure Virtual Desktop diagnostics reporting.
- We fixed a crash that happened when users moved hidden windows in RemoteApp scenarios.

## Updates for version 10.7.9

*Date Published: August 11, 2022*

In this release, we fixed some customer-reported bugs and issues reported by telemetry. Two of the impacted feature areas include Teams redirection and multi-monitor support.

## Updates for version 10.7.8

*Date Published: July 25, 2022*

In this release, we've made the following changes:

- Added thumbnail snapshots for published PC resources to the Workspaces tab of the Connection Center.
- Integrated logging support that you could previously only access with user defaults to the UI. To access the logs, go to **Help** > **Troubleshooting** > **Logging**.
- You can now reset all subscribed Azure Virtual Desktop workspaces.
- Fixed a deadlock in the client logging infrastructure.
- Improved diagnostic error reporting for Azure Active Directory authentication failures in Azure Virtual Desktop scenarios.

## Updates for version 10.7.7

*Date Published: June 23, 2022*

In this release we added the following new features:

- A custom app switcher which spans multiple sessions for RemoteApp scenarios (triggered by the `Option+Tab` keyboard combination).
- Support for the in-session redirection of PIV smart cards (such as Yubikey).

We've also:

- Added support for audio and video stream optimizations when connecting to Azure Virtual Desktop session hosts that support Teams redirection. Learn more at [Use Microsoft Teams on Azure Virtual Desktop](/azure/virtual-desktop/teams-on-avd).
- Made updates to improve connectivity, performance and diagnostic metrics when connecting to Azure Virtual Desktop deployments.

With respect to bugs and smaller features, the following list summarizes some highlights:

- Added support for eTags in Azure Virtual Desktop workspace refresh scenarios to improve sync times.
- The read-only column in the folder redirection selection UI has been resized to show the full column header.
- Fixed an issue that resulted in the Outlook client showing the incorrect time or time zone for certain calendar entries.
- Resolved discrepancies with the reporting of device physical width and height across Retina and non-Retina scenarios.
- Updated the client to trigger an auto-reconnect in Azure Virtual Desktop scenarios when a `0x3` error is generated by the Gateway.
- Resolved an issue where the mouse cursor on a high DPI monitor is larger than a regular monitor.
- Updated the client to terminate auto-reconnect if the session window is closed after waking from sleep.
- Addressed an issue where the mapped hotkeys `CMD+C`, `CMD+V`, and `CMD+F` didn't work in nested sessions.
- Hid the "Import from Remote Desktop 8" option if there is no data to import.

## Updates for version 10.7.6

*Date Published: February 3, 2022*

In this release, we made some changes to improve connection reliability for Azure Virtual Desktop scenarios.

## Updates for version 10.7.5

*Date published: January 25, 2022*

In this release, we've made the following changes:

- Fixed an issue that caused display configuration to not work properly when using the client on 2021 MacBook Pro 14" and 16" devices with multiple monitors. This issue mainly affected devices with external monitors positioned above the MacBook display.
- Fixed an issue that caused the client to crash when used on earlier versions of macOS 12
- Fixed customer-reported smart card and folder redirection issues.

## Updates for version 10.7.4

*Date published: January 13, 2022*

In this release, we've made the following changes:

- Addressed full screen display issues with 2021 MacBook Pro 14" and 16" models.
- Better handle load-balanced Remote Desktop Gateway configurations.

## Updates for version 10.7.3

*Date published: December 17, 2021*

Unfortunately, the 10.7.2 update disabled smart card redirection for some users when they'd try to reconnect to their sessions. As a result, we've released this update to address the issue.

## Updates for version 10.7.2

*Date published: December 13, 2021*

In this release, we've made the following changes:

- Added support for the Touch Bar on MacBook Pro devices.
- Refreshed the look and feel of the PCs and Apps tabs in the Connection Center.
- Added a new **SHIFT+COMMAND+K** hotkey that opens the Connection Center.
- Improved compatibility with third-party network devices and load balancers for workspace download and Remote Desktop Gateway-based connections.
- Support for the ms-rd URI scheme.
- Improved support for invertible mouse cursors that straddle the image boundary.
- Support for `.RDPW` files produced by the Azure Virtual Desktop web client.
- Fixed an issue that caused the workspace subfolder to remain expanded even if you've collapsed the root folder.
- Updates and enhancements to Teams redirection (only available in Azure Virtual Desktop scenarios).
- Addressed reliability issues identified through crash reporting and feedback.

## Updates for version 10.7.1

*Date published: November 4, 2021*

In this release, we've made the following changes:

- Addressed issues that caused the app to crash.

## Updates for version 10.7.0

*Date published: October 21, 2021*

In this release, we've made the following changes:

- Addressed issues brought up by users in crash reports and general feedback.
- Invertible cursors, such as the text cursor, are now outlined to make them visible on dark backgrounds.
- Made improvements to the code for the Connection Center for both PCs and workspaces.
- Added support for moving the local window while using a RemoteApp.
  - By default, local window movement in RemoteApp scenarios is disabled. To enable local window movement, set the **EnableRemoteAppLocalMove** policy to **True**.
- Updated the Connection Information prompt that appears when you go to **Connections** > **Show Connection Information**.
- Added [screen capture protection for Azure Virtual Desktop scenarios](/azure/virtual-desktop/screen-capture-protection).
- Addressed an issue that allowed folders to be redirected multiple times.
- Added a link to the new support forum at **Help** > **Submit feedback**.
- Updates improving security, connectivity and performance while connecting to Azure Virtual Desktop.

## Updates for version 10.6.8

*Date published: August 16, 2021*

In this release, we've made the following changes:

- Added background refresh for subscribed workspaces.
- Addressed issues where the session window may switch to another monitor when auto-reconnecting.
- Addressed issues where the session window would intermittently enlarge after connecting.
- Addressed issues where the name of a redirected folder would be incorrect in the remote session.
- Addressed issues when resizing remote app windows.
- Improved error messages that are displayed when user accounts fail to update.
- Addressed issues where window titles in the list of connected remote apps were blank.
- Addressed multi-monitor issue where the mouse cursor shape would not update correctly when dragging between monitors.
- Added a checkbox to General Preferences to enable/disable Microsoft Teams optimizations.
- Added a UI to report if a remote app could not be launched on the server due to not being on the system allowlist.
- Addressed issues where the session window could not expand when placed at the top or bottom of the screen.
- Addressed scenarios where the mouse cursor would disappear while connected to a remote PC.
- Deletion of an Azure Virtual Desktop workspace now correctly removes all associated workspaces.
- Addressed issues where adding a folder to redirect to a bookmark would enable the "Add" button with an empty PC name.
- Addressed issues where double-clicking the title bar incorrectly stretches the session window.
- Updated the mouse to change to a hand glyph when hovering over a red input error indicator.
- Addressed issues where the session window would flash rapidly in the "Mission Control" or "Application windows" view.
- Improved connectivity and performance metrics when connecting to Azure Virtual Desktop.
- Subscribed workspaces are refreshed every six hours, by default, and can be changed using **ClientSettings.WorkspaceAutoRefreshInterval** (minimum interval is 30 minutes and 24 hours is the maximum).

## Updates for version 10.6.7

*Date published: June 21, 2021*

In this release, we've made the following changes:

- Addressed three connectivity errors that users reported to us:
  
  - Worked around a `0x907` (mismatched certificate) error code that was caused by third-party infrastructure returning an incorrect certificate in redirection scenarios.

  - Fixed the root cause of a `0x207` (handshake failure) error code that appeared when users accidentally tried to connect with an incorrect password to a pre-Windows 8 server with Network Level Authentication (NLA) enabled.

  - Resolved a `0x1107` (invalid workstation) error code that appeared when Active Directory workstation logon restrictions were set.

- Updated the default icon for published desktops and worked around an issue that caused smart card redirection to stop working with recently patched versions of Windows.

- Made some updates to improve compatibility and performance metrics when connecting to Azure Virtual Desktop.

## Updates for version 10.6.6

*Date published: May 4, 2021*

In this release, we've made the following changes:

- Enabled connections to Windows Server 2003 servers that have Transport Layer Security (TLS) enabled for Remote Desktop connections.
- Addressed a `0x3000066` error message that appeared in Remote Desktop Gateway scenarios, and aligned TLS version usage with the Windows Remote Desktop client.

## Updates for version 10.6.5

*Date published: April 29, 2021*

In this release, we've made the following changes:

- Fixed an issue that made the client return a `0x907` error code when connecting to a server endpoint with a certificate that had a Remote Desktop Authentication EKU property of `1.3.6.1.4.1.311.54.1.2`.
- Updated the client to address a `0x2407` error code that prevented the client from authorizing users for remote access.

## Updates for version 10.6.4

*Date published: April 22, 2021*

In this release, we've made the following changes:

- Fixed an issue that caused the client to return a `0x907` error code when processing a server authentication certificate with a validity lifetime of over 825 days.

## Updates for version 10.6.3

*Date published: April 20, 2021*

In this release, we've made the following changes:

- Fixed an issue that caused the client to return a `0x507` error code.
- Enabled support for the AVC420 codec on Apple Silicon.
- Enabled Smart card redirection (requires macOS 11.2 or later) on Apple Silicon.

## Updates for version 10.6.2

*Date published: April 20, 2021*

In this release, we've made the following changes:

- Removed a double prompt for credentials that occurred in some scenarios when users tried to connect with a Remote Desktop Gateway.

## Updates for version 10.6.1

*Date published: April 20, 2021*

In this update, we fixed an issue that caused the client to stop responding when connecting to a Remote Desktop Gateway.

## Updates for version 10.6.0

*Date published: April 19, 2021*

In this release we've made some significant updates to the shared underlying code that powers the Remote Desktop experience across all our clients. We've also added some new features and addressed bugs and crashes that were showing up in error reports.

- Added native support for Apple Silicon.
- Added client-side IME support when using Unicode keyboard mode.
- Integrated Kerberos support in the CredSSP security protocol sequence.
- Addressed macOS 11 compatibility issues.
- Made updates to improve interoperability with current and upcoming features in the Azure Virtual Desktop service.
- Fixed issues that caused mis-paints when decoding AVC data generated by a server-side hardware encoder.
- Addressed an issue that made remote Office app windows invisible even though they appeared in the app switcher.

>[!IMPORTANT]
>As of this update, the macOS client requires macOS version 10.14 or later to run.

## Updates for version 10.5.2

*Date published: February 15, 2021*

In this release, we've made the following changes:

- Added HTTP proxy support for Remote Desktop Gateway connections.
- Fixed an issue where a Remote Desktop Gateway connection would disconnect and a message with error code 0x3000064 would appear.
- Addressed a bug where workspace discovery and download wouldn't work if you included the port number in HTTP GET requests.
- Refreshed the application icon

> [!NOTE]
> This release is the last release that will be compatible with macOS version 10.13.

## Updates for version 10.5.1

*Date published: January 29, 2021*

In this release, we've made the following changes:

- Addressed an issue where the UI would stop resolving a workspace name during subscription.
- Fixed an in-session bug where graphics updates would stall while the client continued to send input.
- Resolved reliability issues identified through crash reporting.

## Updates for version 10.5.0

*Date published: December 2, 2020*

In this release, we've made the following changes:

- You can now edit the display, device, and folder redirection settings of published PC connections.
- RemoteApp windows now shrink to the dock when minimized.
- Added a Connection Information dialog that displays the current bandwidth and round-trip time.
- Added support for Remote Desktop Gateway consent and admin messages.
- Fixed an issue where an RDP file specifying a gatewayusagemethod value of 0 or 4 was incorrectly imported.
- The Edit Workspace sheet now shows the exact time at which the workspace was last updated.
- Removed trace spew that was output when using the *--script* parameter.
- Addressed an issue where the client would return a 0x30000066 error when connecting using a Remote Desktop Gateway server.
- Fixed an issue that caused the client to repeatedly prompt users for credentials if Extended Protection for Authentication was set on the server.
- Addressed reliability issues that users identified through crash reporting.
- Addressed keyboard and VoiceOver-related accessibility bugs.

## Updates for version 10.4.1

*Date published: November 6, 2020*

In this release, we've made the following changes:

- Addressed several reliability issues identified through crash reporting.
- Addressed keyboard and VoiceOver-related accessibility bugs.
- Fixed an issue where the client would hang on reconnect when resuming from sleep.
- Fixed an audio artifact heard when playing back the first chunk of a redirected audio stream.
- Addressed an issue where the client would report a 0x5000007 error message when connecting using a Remote Desktop Gateway server.
- Corrected the aspect ratio of PC thumbnails displayed in the Connection Center.
- Improved smart card redirection heuristics to better handle nested transactions.
- Fixed a bug that prevented bookmark export if the bookmark's display name contained the "/" character.
- Resolved a bug that caused a 0xD06 protocol error when running Outlook as a RemoteApp.
- Added support for a new integer RDP file property (ForceHiDpiOptimizations) to enable Retina display optimization.

## Updates for version 10.4.0

*Date published: August 20, 2020*

In this release, we've made substantial updates to the underlying code for the Remote Desktop experience across all our clients. We've also added some new features and addressed bugs and crashes that were showing up in error reporting. Here are some changes you may notice:

- PC Quick Connect (Cmd+K) allows you to connect to a PC without creating a bookmark.
- Auto-reconnect now recovers from transient network glitches for PC connections.
- When resuming a suspended MacBook, you can use auto-reconnect to reconnect to any disconnected PC connections.
- Added support for HTTP proxies when subscribing and connecting to Azure Virtual Desktop resources.
- Implemented support for HTTP proxy automatic configuration with PAC files.
- Integrated support for NETBIOS name resolution so you can connect to PCs on your local network more easily.
- Fixed an issue where the system menu bar wouldn't respond while the app was in focus.
- Fixed a client-side race condition that could cause decryption errors on the server.
- Made improvements to monitor layout and geometry heuristics for multimon scenarios involving Retina-class monitors.
- Multimon layout configurations are now maintained across session redirection scenarios.
- Addressed an issue that prevented the menu bar from dropping in multimon scenarios.
- User account UI that interacts with the macOS keychain will now surface keychain access errors.
- Hitting cancel during workspace subscription will now result in nothing being added to the Connection Center.
- Added key mappings for Cmd+Z and Cmd+F to map to Ctrl+Z and Ctrl+F respectively.
- Fixed a bug that caused a RemoteApp to open behind the Connection Center when launched.
- Worked around an issue in macOS 10.15 where AAC audio playback caused the client to stall.
- Shift+left-click now works in Unicode mode.
- Fixed a bug where using the Shift key triggered the Sticky Keys alert in Unicode mode.
- Added a check for network availability before connection initiation.
- Addressed pulsing of PC thumbnails that sometimes happened during the connection sequence.
- Fixed a bug where the password field in the Add/Edit User Account sheet become multiline.
- The "Collapse All" option is now greyed out if all workspaces are collapsed.
- The "Expand All" option is now greyed out if all workspaces are expanded.
- The first-run permissions UI is no longer shown on High Sierra.
- Fixed an issue where users were unable to connect to Azure Virtual Desktop endpoints using saved credentials in the DOMAIN\USERNAME format.
- The username field in the credential prompt is now always prepopulated for Azure Virtual Desktop connections.
- Fixed a bug that clipped the Edit, Delete, and Refresh buttons for workspaces if the Connection Center wasn't wide enough.
- The "email or workspace URL" field in the Add Workspace sheet is no longer case-sensitive.
- Fixed accessibility issues that impacted VoiceOver and keyboard navigation scenarios.
- Lots of updates to improve interoperability with current and upcoming features in the Azure Virtual Desktop service.
- You can now configure the AVC support level advertised by the client from a terminal prompt. Here are the support levels you can configure:
  - Don't advertise AVC support to the server: `defaults write com.microsoft.rdc.macos AvcSupportLevel disabled`
  - Advertise AVC420 support to the server: `defaults write com.microsoft.rdc.macos AvcSupportLevel avc420`
  - Advertise support for AVC444 support to the server: `defaults write com.microsoft.rdc.macos AvcSupportLevel avc444`

## Updates for version 10.3.9

*Date published: April 6, 2020*

In this release, we've made some changes to improve interoperability with the [Azure Virtual Desktop service](https://azure.microsoft.com/services/virtual-desktop/). In addition, we've included the following updates:

- **Control+Option+Delete** now triggers the **Ctrl+Alt+Del** sequence (previously required pressing the Fn key).
- Fixed the keyboard mode notification color scheme for Light mode.
- Addressed scenarios where connections initiated using the GatewayAccessToken RDP file property didn't work.

> [!NOTE]
> This is the last release that will be compatible with macOS 10.12.

## Updates for version 10.3.8

*Date published: February 12, 2020*

With this update, you can switch between Scancode (Ctrl+Command+K) and Unicode (Ctrl+Command+U) modes when entering keyboard input. Unicode mode allows extended characters to be typed using the Option key on a Mac keyboard. For example, on a US Mac keyboard, Option+2 will enter the trademark (&trade;) symbol. You can also enter accented characters in Unicode mode. For example, on a US Mac keyboard, entering Option+E and the "A" key at the same time will enter the character "á" on your remote session.

Other updates in this release include:

- Cleaned up the workspace refresh experience and UI.
- Addressed a smart card redirection issue that caused the remote session to stop responding at the sign-in screen when the "Checking Status" message appeared.
- Reduced time to create temporary files used for clipboard-based file copy and paste.
- Temporary files used for clipboard file copy and paste are now deleted automatically when you exit the app, instead of relying on macOS to delete them.
- PC bookmark actions are now rendered at the top-right corner of thumbnails.
- Made fixes to address issues reported through crash telemetry.

## Updates for version 10.3.7

*Date published: January 6, 2020*

In this release, we've made the following changes:

- Copying things from the remote session to a network share or USB drive no longer creates empty files.
- Specifying an empty password in a user account no longer causes a double certificate prompt.

## Updates for version 10.3.6

*Date published: January 6, 2020*

In this release, we've made the following changes:

- Addressed an issue that created zero-length files whenever you copied a folder from the remote session to the local machine using file copy and paste.

## Updates for version 10.3.5

*Date published: January 6, 2020*

In this release, we've made the following changes:

- Redirected folders can now be marked as read-only to prevent their contents from being changed in the remote session.
- We addressed a 0x607 error that appeared when connecting using RPC over HTTPS Remote Desktop Gateway scenarios.
- Fixed cases where users were double-prompted for credentials.
- Fixed cases where users received the certificate warning prompt twice.
- Added heuristics to improve trackpad-based scrolling.
- The client no longer shows the "Saved Desktops" group if there are no user-created groups.
- Updated UI for the tiles in PC view.
- Fixes to address crashes sent to us via application telemetry.

## Updates for version 10.3.4

*Date published: November 18, 2019*

In this release, we've made the following changes:

- When connecting via a Remote Desktop Gateway with multi-factor authentication, the gateway connection will be held open to avoid multiple MFA prompts.
- All the client UI is now fully keyboard-accessible with Voiceover support.
- Files copied to the clipboard in the remote session are now only transferred when pasting to the local computer.
- URLs copied to the clipboard in the remote session now paste correctly to the local computer.
- Scale factor remoting to support Retina displays is now available for multimonitor scenarios.
- Addressed a compatibility issue with FreeRDP-based RD servers that was causing connectivity issues in redirection scenarios.
- Addressed smart card redirection compatibility with future releases of Windows 10.
- Addressed an issue specific to macOS 10.15 where the incorrect available space was reported for redirected folders.
- Published PC connections are represented with a new icon in the Workspaces tab.
- "Feeds" are now called "Workspaces," and "Desktops" are now called "PCs."
- Fixed inconsistencies and bugs in user account handling in the preferences UI.
- Lots of bug fixes to make things run smoother and more reliably.

## Updates for version 10.3.3

*Date published: November 18, 2019*

In this release, we've made the following changes:

- Added user defaults to disable smart card, clipboard, microphone, camera, and folder redirection:

  - ClientSettings.DisableSmartcardRedirection
  - ClientSettings.DisableClipboardRedirection
  - ClientSettings.DisableMicrophoneRedirection
  - ClientSettings.DisableCameraRedirection
  - ClientSettings.DisableFolderRedirection

- Resolved an issue that was causing programmatic session window resizes to not be detected.
- Fixed an issue where the session window contents appeared small when connecting in windowed mode (with dynamic display enabled).
- Addressed initial flicker that occurred when connecting to a session in windowed mode with dynamic display enabled.
- Fixed graphics mis-paints that occurred when connected to Windows 7 after toggling fit-to-window with dynamic display enabled.
- Fixed a bug that caused an incorrect device name to be sent to the remote session (breaking licensing in some third-party apps).
- Resolved an issue where RemoteApp windows would occupy an entire monitor when maximized.
- Addressed an issue where the access permissions UI appeared underneath local windows.
- Cleaned up some shutdown code to ensure the client closes more reliably.

## Updates for version 10.3.2

*Date published: November 18, 2019*

In this release, we fixed a bug that made the display low resolution while connecting to a session

## Updates for version 10.3.1

*Date published: November 18, 2019*

In this release, we've made the following changes:

- Addressed connectivity issues with Remote Desktop Gateway servers that were using 4096-bit asymmetric keys.
- Fixed a bug that caused the client to randomly stop responding when downloading feed resources.
- Fixed a bug that caused the client to crash while opening.
- Fixed a bug that caused the client to crash while importing connections from Remote Desktop, version 8.

## Updates for version 10.3.0

*Date published: August 27, 2019*

In this release, we've made the following changes:

- Camera redirection is now possible when connecting to Windows 10 1809, Windows Server 2019 and later.
- On Mojave and Catalina we've added a new dialog that requests your permission to use the microphone and camera for device redirection.
- The feed subscription flow has been rewritten to be simpler and faster.
- Clipboard redirection now includes the Rich Text Format (RTF).
- When entering your password, you can now choose to reveal it by selecting the "Show password" checkbox.
- Addressed scenarios where the session window was jumping between monitors.
- The Connection Center displays high-resolution RemoteApp icons when available.
- Cmd+A maps to Ctrl+A when Mac clipboard shortcuts are being used.
- Cmd+R now refreshes all of your subscribed feeds.
- Added new secondary click options to expand or collapse all groups or feeds in the Connection Center.
- Added a new secondary click option to change the icon size in the Feeds tab of the Connection Center.
- A new, simplified, and clean app icon.

## Updates for version 10.2.13

*Date published: May 8, 2019*

In this release, we've made the following changes:

- Fixed a hang that occurred when connecting via a Remote Desktop Gateway.
- Added a privacy notice to the "Add Feed" dialog.

## Updates for version 10.2.12

*Date published: April 16, 2019*

In this release, we've made the following changes:

- Resolved random disconnects (with error code 0x904) that took place when connecting via a Remote Desktop Gateway.
- Fixed a bug that caused the resolutions list in application preferences to be empty after installation.
- Fixed a bug that caused the client to crash if certain resolutions were added to the resolutions list.
- Addressed an ADAL authentication prompt loop when connecting to Azure Virtual Desktop deployments.

## Updates for version 10.2.10

*Date published: March 30, 2019*

In this release, we've made the following changes:

- Addressed instability caused by the recent macOS 10.14.4 update.
- Fixed mis-paints that appeared when decoding AVC codec data encoded by a server using NVIDIA hardware.

## Updates for version 10.2.9

*Date published: March 6, 2019*

In this release, we've made the following changes:

- Fixed a Remote Desktop Gateway connectivity issue that can occur when server redirection takes place.
- We also addressed a Remote Desktop Gateway regression caused by the 10.2.8 update.

## Updates for version 10.2.8

*Date published: March 1, 2019*

In this release, we've made the following changes:

- Resolved connectivity issues that surfaced when using a Remote Desktop Gateway.
- Fixed incorrect certificate warnings that were displayed when connecting.
- Addressed some cases where the menu bar and dock would needlessly hide when launching a RemoteApp.
- Reworked the clipboard redirection code to address crashes and hangs that have been plaguing some users.
- Fixed a bug that caused the Connection Center to needlessly scroll when launching a connection.

## Updates for version 10.2.7

*Date published: February 6, 2019*

In this release, we addressed graphics mis-paints (caused by a server encoding bug) that appeared when using AVC444 mode.

## Updates for version 10.2.6

*Date published: January 28, 2019*

In this release, we've made the following changes:

- Added support for the AVC (420 and 444) codec, available when connecting to current versions of Windows 10.
- In Fit to Window mode, a window refresh now occurs immediately after a resize to ensure that content is rendered at the correct interpolation level.
- Fixed a layout bug that caused feed headers to overlap for some users.
- Cleaned up the Application Preferences UI.
- Polished the Add/Edit Desktop UI.
- Made lots of fit and finish adjustments to the Connection Center tile and list views for desktops and feeds.

>[!NOTE]
>There is a bug in macOS 10.14.0 and 10.14.1 that can cause the ".com.microsoft.rdc.application-data_SUPPORT/_EXTERNAL_DATA" folder (nested deep inside the ~/Library folder) to consume a large amount of disk space. To resolve this issue, delete the folder content and upgrade to macOS 10.14.2. Note that a side-effect of deleting the folder contents is that snapshot images assigned to bookmarks will be deleted. These images will be regenerated when reconnecting to the remote PC.

## Updates for version 10.2.4

*Date published: December 18, 2018*

In this release, we've made the following changes:

- Added dark mode support for macOS Mojave 10.14.
- An option to import from Microsoft Remote Desktop 8 now appears in the Connection Center if it is empty.
- Addressed folder redirection compatibility with some third-party enterprise applications.
- Resolved issues where users were getting a 0x30000069 Remote Desktop Gateway error due to security protocol fallback issues.
- Fixed progressive rendering issues some users were experiencing with fit to window mode.
- Fixed a bug that prevented file copy and paste from copying the latest version of a file.
- Improved mouse-based scrolling for small scroll deltas.

## Updates for version 10.2.3

*Date published: November 6, 2018*

In this release, we've made the following changes:

- Added support for the *remoteapplicationcmdline* RDP file setting for RemoteApp scenarios.
- The title of the session window now includes the name of the RDP file (and server name) when launched from an RDP file.
- Fixed reported Remote Desktop Gateway performance issues.
- Fixed reported Remote Desktop Gateway crashes.
- Fixed issues where the connection would hang when connecting through a Remote Desktop Gateway.
- Better handling of a RemoteApp in full-screen by intelligently hiding the menu bar and dock.
- Fixed scenarios where a RemoteApp remained hidden after being launched.
- Addressed slow rendering updates when using "Fit to Window" with hardware acceleration disabled.
- Handled database creation errors caused by incorrect permissions when the client starts up.
- Fixed an issue where the client was consistently crashing at launch and not starting for some users.
- Fixed a scenario where connections were incorrectly imported as full-screen from Remote Desktop 8.

## Updates for version 10.2.2

*Date published: October 9, 2018*

In this release, we've made the following changes:

- A brand new Connection Center that supports drag and drop, manual arrangement of desktops, resizable columns in list view mode, column-based sorting, and simpler group management.
- The Connection Center now remembers the last active pivot (Desktops or Feeds) when closing the app.
- The credential prompting UI and flows have been overhauled.
- Remote Desktop Gateway feedback is now part of the connecting status UI.
- Settings import from the version 8 client has been improved.
- RDP files pointing to RemoteApp endpoints can now be imported into the Connection Center.
- Retina display optimizations for single monitor Remote Desktop scenarios.
- Support for specifying the graphics interpolation level (which affects blurriness) when not using Retina optimizations.
- 256-color support to enable connectivity to Windows 2000.
- Fixed clipping of the right and bottom edges of the screen when connecting to Windows 7, Windows Server 2008 R2 and earlier.
- Copying a local file into Outlook (running in a remote session) now adds the file as an attachment.
- Fixed an issue that was slowing down pasteboard-based file transfers if the files originated from a network share.
- Addressed a bug that was causing to Excel (running in a remote session) to hang when saving to a file on a redirected folder.
- Fixed an issue that was causing no free space to be reported for redirected folders.
- Fixed a bug that caused thumbnails to consume too much disk storage on macOS 10.14.
- Added support for enforcing Remote Desktop Gateway device redirection policies.
- Fixed an issue that prevented session windows from closing when disconnecting from a connection using Remote Desktop Gateway.
- If Network Level Authentication (NLA) is not enforced by the server, you will now be routed to the sign-in screen if your password has expired.
- Fixed performance issues that surfaced when lots of data was being transferred over the network.
- Smart card redirection fixes.
- Support for all possible values of the **EnableCredSspSupport** and **Authentication Level** RDP file settings if the `ClientSettings.EnforceCredSSPSupport` user default key (in the `com.microsoft.rdc.macos` domain) is set to 0.
- Support for the "Prompt for Credentials on Client" RDP file setting when NLA is not negotiated.
- Support for smart card-based sign-in using smart card redirection at the Winlogon prompt when NLA is not negotiated.
- Fixed an issue that prevented downloading feed resources that have spaces in the URL.

## Updates for version 10.2.1

*Date published: August 6, 2018*

In this release, we've made the following changes:

- Enabled connectivity to Azure Active Directory (Azure AD) joined PCs. To connect to an Azure AD joined PC, your username must be in one of the following formats: "AzureAD\user" or "AzureAD\user@domain".
- Addressed some bugs affecting the usage of smart cards in a remote session.

## Updates for version 10.2.0

*Date published: July 24, 2018*

In this release, we've made the following changes:

- Incorporated updates for GDPR compliance.
- MicrosoftAccount\username@domain is now accepted as a valid username.
- Clipboard sharing has been rewritten to be faster and support more formats.
- Copy and pasting text, images, or files between sessions now bypasses the local machine's clipboard.
- You can now connect via a Remote Desktop Gateway server with an untrusted certificate (if you accept the warning prompts).
- Metal hardware acceleration is now used (where supported) to speed up rendering and optimize battery usage.
- When using Metal hardware acceleration, we try to work some magic to make the session graphics appear sharper.
- Got rid of some instances where windows would hang around after being closed.
- Fixed bugs that were preventing the launch of RemoteApp programs in some scenarios.
- Fixed a Remote Desktop Gateway channel synchronization error that was resulting in 0x204 errors.
- The mouse cursor shape now updates correctly when moving out of a session or RemoteApp window.
- Fixed a folder redirection bug that was causing data loss when copy and pasting folders.
- Fixed a folder redirection issue that caused incorrect reporting of folder sizes.
- Fixed a regression that was preventing logging into an Azure AD-joined machine using a local account.
- Fixed bugs that were causing the session window contents to be clipped.
- Added support for RD endpoint certificates that contain elliptic-curve asymmetric keys.
- Fixed a bug that was preventing the download of managed resources in some scenarios.
- Addressed a clipping issue with the pinned connection center.
- Fixed the checkboxes in the Display tab of the Add a Desktop window to work better together.
- Aspect ratio locking is now disabled when dynamic display change is in effect.
- Addressed compatibility issues with F5 infrastructure.
- Updated handling of blank passwords to ensure the correct messages are shown at connect-time.
- Fixed mouse scrolling compatibility issues with MapInfra Pro.
- Fixed some alignment issues in the Connection Center when running on Mojave.

## Updates for version 10.1.8

*Date published: May 4, 2018*

In this release, we've made the following changes:

- Added support for changing the remote resolution by resizing the session window!
- Fixed scenarios where remote resource feed download would take an excessively long time.
- Resolved the 0x207 error that could occur when connecting to servers not patched with the CredSSP encryption oracle remediation update (CVE-2018-0886).

## Updates for version 10.1.7

*Date published: April 5, 2018*

In this release, we've made the following changes:

- Made security fixes to incorporate CredSSP encryption oracle remediation updates as described in CVE-2018-0886.
- Improved RemoteApp icon and mouse cursor rendering to address reported mispaints.
- Addressed issues where RemoteApp windows appeared behind the Connection Center.
- Fixed a problem that occurred when you edit local resources after importing from Remote Desktop 8.
- You can now start a connection by pressing ENTER on a desktop tile.
- When you're in full screen view, Cmd+M now correctly maps to WIN+M.
- The Connection Center, Preferences, and About windows now respond to Cmd+M.
- You can now start discovering feeds by pressing ENTER on the **Adding Remote Resources*- page.
- Fixed an issue where a new remote resources feed showed up empty in the Connection Center until after you refreshed.

## Updates for version 10.1.6

*Date published: March 26, 2018*

In this release, we've made the following changes:

- Fixed an issue where RemoteApp windows would reorder themselves.
- Resolved a bug that caused some RemoteApp windows to get stuck behind their parent window.
- Addressed a mouse pointer offset issue that affected some RemoteApp programs.
- Fixed an issue where starting a new connection gave focus to an existing session, instead of opening a new session window.
- We fixed an error with an error message - you'll see the correct message now if we can't find your gateway.
- The Quit shortcut (⌘ + Q) is now consistently shown in the UI.
- Improved the image quality when stretching in "fit to window" mode.
- Fixed a regression that caused multiple instances of the home folder to show up in the remote session.
- Updated the default icon for desktop tiles.
