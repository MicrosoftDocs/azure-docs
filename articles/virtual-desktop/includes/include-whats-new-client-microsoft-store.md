---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 06/13/2023
---

## Latest client versions

The following table lists the current version available for the public release:

| Release | Latest version | Download |
|---------|----------------|----------|
| Public  | 10.2.3012      | [Microsoft Store](https://go.microsoft.com/fwlink/?LinkID=616709) |

## Updates for version 10.2.3012

*Date published: June 12, 2023*

In this release, we've made the following change:

- Updated Store description to mention the end of Azure Virtual Desktop support.
- Fixed the vulnerability known as [CVE-2023-28290](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-28290).

## Updates for version 10.2.3000

*Date published: March 6, 2023*

There are no changes to the client in this release.

## Updates for version 10.2.1810

*Date published: March 29, 2021*

In this release, we've made the following changes:

- Fixed an issue that caused crashes during clipboard scenarios.
- Fixed an issue that happened when using the client with HoloLens.
- Fixed an issue where the lock screen wasn't appearing in the remote session.
- Fixed issues that happened when the client tried to connect to devices with the “Always prompt for password upon connection” group policy set.
- Added several stability improvements to the client.

## Updates for version 10.2.1534

*Date published: August 26, 2020*

In this release, we've made the following changes:

- Rewrote the client to use the same underlying RDP core engine as the iOS, macOS, and Android clients.
- Added support for the Azure Resource Manager-integrated version of Azure Virtual Desktop.
- Added support for x64 and ARM64.
- Updated the side panel design to full screen.
- Added support for light and dark modes.
- Added functionality to subscribe and connect to sovereign cloud deployments.
- Added functionality to enable backup and restore of workspaces (bookmarks) in release to manufacturing (RTM).
- Updated functionality to use existing Azure Active Directory (Azure AD) tokens during the subscription process to reduce the number of times users must sign in.
- Updated subscription can now detect whether you're using Azure Virtual Desktop or Azure Virtual Desktop (classic).
- Fixed issue with copying files to remote PCs.
- Fixed commonly reported accessibility issues with buttons.
- A limit of up to 20 credentials per app is allowed.

## Updates for version 10.1.1215

*Date published: April 20, 2020*

In this release, we've made the following change:

- Updated the user agent string for Azure Virtual Desktop.

## Updates for version 10.1.1195

*Date published: March 6, 2020*

In this release, we've made the following changes:

- Audio from the session now continues to play even when the app is minimized or in the background.
- Fixed an issue where the toggle keys (caps lock, num lock, and so on) went out of sync between the local and remote PCs.
- Performance improvements on 64-bit devices.
- Fixed a crash that occurred whenever the app was suspended.

## Updates for version 10.1.1107

*Date published: September 4, 2019*

In this release, we've made the following changes:

- You can now copy files between local and remote PCs.
- You can now use your email address to access remote resources (if enabled by your admin).
- You can now change user account assignments for remote resource feeds.
- The app now shows the proper icon for .rdp files assigned to this app in File Explorer instead of a blank default icon.

## Updates for version 10.1.1098

*Date published: March 15, 2019*

In this release, we've made the following changes:

- You can now set a display name for user accounts so you can save the same username with different passwords.
- It's now possible to select an existing user account when adding Remote Resources.
- Fixed an issue where the client wasn't terminating correctly.
- The client now properly handles being suspended when secondary windows are open.
- Additional bug fixes.

## Updates for version 10.1.1088

*Date published: November 6, 2018*

In this release, we've made the following changes:

- Connection display name is now more discoverable.
- Fixed a crash when closing the client window while a connection is still active.
- Fix a hang when reconnecting after the client is minimized.
- Allow desktops to be dragged anywhere in a group.
- Ensure launching a connection from the jump list results in a separate window when needed.
- Additional bug fixes.

## Updates for version 10.1.1060

*Date published: September 14, 2018*

In this release, we've made the following changes:

- Addressed an issue where double-clicking a desktop connection caused two sessions to be launched.
- Fixed a crash when switching between virtual desktops locally.
- Moving a session to a different monitor now also updates the session scale factor.
- Handle additional system keys like AltGr.
- Additional bug fixes.

## Updates for version 10.1.1046

*Date published: June 20, 2018*

In this release, we've made the following changes:

- Bug fixes.

## Updates for version 10.1.1042

*Date published: April 2, 2018*

In this release, we've made the following changes:

- Updates to address CredSSP encryption oracle remediation described in CVE-2018-0886.
- Additional bug fixes.
