---
author: dknappettmsft
ms.author: daknappe
ms.topic: include
ms.date: 11/08/2023
---

## Latest client versions

The following table lists the current versions available for the public and beta releases:

| Release | Latest version | Download |
|---------|----------------|----------|
| Public  | 10.5.2         | [App Store](https://apps.apple.com/app/microsoft-remote-desktop/id714464092) |
| Beta    | 10.5.2         | [TestFlight](https://testflight.apple.com/join/vkLIflUJ) |

## Updates for version 10.5.2

*Date published: October 24, 2023*

In this release, we've made the following changes:

- Added support for dual monitors when using iPads with Stage Manager.
- Addressed reported accessibility bugs.
- Fixed some keyboard mappings that stopped working after the iOS 17 update.

## Updates for version 10.5.1

*Date published: September 5th, 2023*

In this release, we've made the following changes:

- Added support for displaying sessions on an external monitor. You can use this new feature with iPad and iPhone using AirPlay or a physical cable.
- Added support for location redirection. To use this feature, you need access to your device location, and your session hosts must be running Windows 11 or later.

## Updates for version 10.5.0

*Date published: July 10, 2023*

In this release, we've made the following changes:

- Fixed an issue with IPv6 address resolution that was blocking connectivity.
- Addressed a deadlock that could occur in server redirection scenarios.

## Updates for version 10.4.8

*Date published: June 20, 2023*

In this release, we've made the following changes:

- We've changed the connection bar to always start expanded by default. You can minimize the connection bar by dragging it to a corner of the screen. To return the connection bar to its regular size, drag it to the center of the screen. 
- You can now dismiss all in-app messages by swiping downwards.
- Fixed an issue that caused graphics to look distorted in Lock to Landscape mode.

## Updates for version 10.4.7

*Date published: May 17, 2023*

In this release we've made some tweaks around the behavior of the connection bar on iPads and fixed some bugs to keep things running smoothly.

We've made the following changes to the iPad connection bar:

- We fixed an issue that caused the connection bar to get stuck under the Stage Manager ellipsis menu.
- The connection bar will now be docked on the right side of the screen when you turn your iPad on. The iOS client will also save the position you dock your screen in across all your iPad and iPhone devices.
- We moved the Add a PC or Workspace button to the center of the toolbar at the bottom of the screen.

We've also made the following other changes:

- Fixed an issue where session rotation wasn't working on iOS 16.
- Resolved an issue where the search box in the Connection Center went out of focus when the user tried entering characters.
- Improved audio rendering for low-bandwidth scenarios.

## Updates for version 10.4.6 

*Date published: March 7, 2023*

In this release, we've removed the global prompt for camera and microphone access when you first open and run the iOS client. Instead, whenever a connection bookmark or published resource requests access, you'll receive a prompt asking whether you want to give permission.

We also fixed some bugs and added some small additional features:

- Integrated privacy statement compliance flows for select geographical regions.
- Added functionality to delete all Azure Virtual Desktop workspaces and associated keychain items.
- Worked around an iOS 16 change that broke Korean language input.
- Addressed a bug that stopped the Apple Pencil from working when connected to Windows 8.1 and Windows Server 2012 R2 and earlier.

>[!NOTE]
>This release removes support for iOS 14 and is only compatible with iOS 15 and 16.

## Updates for version 10.4.5

*Date published: November 2, 2022*

In this release, we've made the following changes:

- Fixed a WebSocket transport bug that affected some Azure Virtual Desktop deployments
- Addressed accessibility compliance issues.

## Updates for version 10.4.4

*Date published: October 4, 2022*

In this release, we've made targeted bug fixes and performance improvements, and also added new features. Here's what we've included:

- You can now use Apple Pencil to draw, write, and interact with remote sessions.
- You can now see a live preview of the current active session when switching to the Connection Center from a remote session.
- Gather logs for troubleshooting by going to **Settings** > **Troubleshooting**.
- Review app highlights from previous versions by going to **Settings** > **About** > **Version Highlights**.
- We've made some small appearance changes to the connection bar user interface.
- We've fixed issues that affected locking to landscape or portrait on iOS 16.

## Updates for version 10.4.3

*Date published: August 11, 2022*

In this release, we resolved a customer bug that impacted authentication when connecting to Azure Virtual Desktop deployments.

## Updates for version 10.4.2

*Date published: July 11, 2022*

In this release, we resolved some bugs that impacted Azure Virtual Desktop deployment connectivity. We also fixed an issue that caused external keyboard input to stop working when you press **Command+Tab** to switch out of and return to the app.

## Updates for version 10.4.1

*Date published: June 27, 2022*

In this release, we added thumbnail snapshots for published PC resources to the Workspaces tab of the Connection Center. We also created an in-app highlights user interface (UI) to advertise new features. The UI automatically appears when you first turn your machine on after an update. You can also access it by going to **Settings** > **About** > **Version Highlights**. Finally, we fixed an issue where the mouse cursor would temporarily get stuck at the bottom of the screen.

## Updates for version 10.4.0 (5155)

*Date published: May 17, 2022*

This is a significant update with some new feature additions and lots of bug fixes and improvements.

The biggest change in this release is that you can now dynamically change the orientation of the remote session to either landscape or portrait mode while connected to a machine running Windows 8.1, Windows Server 2012 R2 or later. You can set your orientation preferences in **Settings** > **Display**.

To work seamlessly with dynamic orientation, we've made updates to the following experiences:

- The in-session immersive switcher has a revamped look and feel, and can accommodate both landscape and portrait orientation.
- The on-screen keyboard has been redesigned to support portrait orientation.
- The connecting UI now supports for both landscape and portrait orientation.
- The PC tab of the connection center now supports high-resolution thumbnails and portrait snapshots.

In addition, we’ve made the following improvements:

- Reworked the connection center to apply a consistent set of margins throughout the UI.
- Added the Shift-Command-Space key combo to toggle the visibility of the connection bar.
- Added the Command-Plus sign (+) and Command-Minus sign (-) key combos to zoom in and out respectively.
- Fixed RemoteApp resource launch and reconnect scenarios.
- Updated the client to send the correct physical dimensions for the iPad Mini 6.
- Added the username to PC bookmark thumbnails.
- Updated the in-session connection bar to fade back after three seconds if you minimize it.
- Added support for smooth scrolling in the connection center on ProMotion-compatible iPhones and iPads.

We've also made some updates to enhance Azure Virtual Desktop scenarios:

- Integrated the Microsoft Authentication Library (MSAL) or OneAuth component to improve current and future authentication scenarios.
- Added eTag support to speed up Azure Virtual Desktop workspace refresh.

> [!NOTE]
> This release removes support for iOS 13 and is only compatible with iOS 14 and 15.

## Updates for version 10.3.6 (5090)

*Date published: November 11, 2021*

In this release we added support for the iPad Mini 6 and addressed an issue with Slide Over windows and keyboard interaction. Thanks for all the feedback. We're working hard to make this app great!

## Updates for version 10.3.5

*Date published: October 28, 2021*

In this release, we've added support for time zone redirection. This new feature fixes an issue in Windows 11 remote sessions that caused the screen to flicker, making the session unusable.

## Updates for version 10.3.1

*Date published: June 28, 2021*

In this release, we worked around a 0x907 (mismatched certificate) error code that was caused by third-party infrastructure returning an incorrect certificate in redirection scenarios. We also made some updates to improve compatibility and performance metrics when connecting to Azure Virtual Desktop (formerly known as Windows Virtual Desktop).

## Updates for version 10.3.0

Date published: May 27, 2021*

In this release, we've made some significant updates to the shared underlying code that powers the Remote Desktop experience across all our clients. We've also added some new features and addressed bugs and crashes that were showing up in error reporting.

- You can now drag IME candidate window in the client.
- Integrated Kerberos support in the CredSSP security protocol sequence.
- Added support for HTTP proxies in Azure Virtual Desktop and on-premises scenarios.
- Made updates to improve interoperability with current and upcoming features in the Azure Virtual Desktop service.

## Updates for version 10.2.5

*Date published: 03/29/2021*

In this release, we made the following updates:

- Fixed NETBIOS name resolution on iOS 14.
- Updated the app to proactively request local network access to enable connections to PCs around you.
- Fixed an issue where an RD Gateway connection would fail with a 0x3000064 error code.
- Fixed a bug where workspace discovery and download would fail if the port number was included in HTTP GET requests.
- Added examples of PC host names to the PC Name page in the Add/Edit PC UX.
- Addressed some VoiceOver accessibility issues.

## Updates for version 10.2.4

*Date published: 02/01/2021*

In this release, we've made the following changes to the connection bar and in-session user experience:

- You can now collapse the connection bar by moving it into one of the four corners of the screen.
- On iPads and large iPhones you can dock the connection bar to the left or right edge of the screen.
- You can now see the zoom slider panel by pressing and holding the connection bar magnification button. The new zoom slider controls the magnification level of the session in both touch and mouse pointer mode.

We also addressed some accessibility bugs and the following two issues:

- The client now validates the PC name in the Add/Edit PC UI to make sure the name doesn't contain illegal characters.
- Addressed an issue where the UI would stop resolving a workspace name during subscription.

## Updates for version 10.2.3

*Date published: 12/15/2020*

In this release, we've fixed issues that caused crashes and interfered with the "Display Zoom View" setting. We've also tweaked the "Use Full Display" setting to only appear on applicable iPads and adjusted the available resolutions for iPhones and iPads.

## Updates for version 10.2.2

*Date published: 11/23/2020*

In this release, we've addressed some bugs affecting users running iOS 14 and iPadOS 14.

## Updates for version 10.2.1

*Date published: 11/11/2020*

In this release, we made the following fixes:

- Added support for newly released iPhone and iPad devices.
- Addressed an issue where the client would return a 0x30000066 error when connecting using an RD Gateway server.

## Updates for version 10.2.0

*Date published: 11/06/2020*

In this release, we addressed some compatibility issues with iOS and iPadOS 14. In addition, we made the following fixes and feature updates:

- Addressed crashes on iOS and iPadOS 14 that happened when entering input on keyboard.
- Added the Cmd+S and Cmd+N shortcuts to access the "Add Workspace" and "Add PC" processes, respectively.
- Added the Cmd+F shortcut to invoke Search UI in the Connection Center.
- Added the "Expand All" and "Collapse All" commands to the Workspaces tab.
- Resolved a bug that caused a 0xD06 protocol error to happen while running Outlook as a RemoteApp.
- The on-screen keyboard will now disappear when you scroll through search results in the Connection Center.
- Updated the animation used when hovering over workspace icons with a mouse or trackpad pointer on iPadOS 14.

## Updates for version 10.1.4

*Date published: 11/06/2020*

We've put together some bug fixes and small feature updates for this release. Here's what's new:

- Addressed an issue where the client would report a 0x5000007 error message when trying to connect to an RD Gateway server.
- User account passwords updated in the credential UI are now saved after successfully signing in.
- Addressed an issue where range and multi-select with the mouse or trackpad (Shift+click and Ctrl+click) didn't work consistently.
- Addressed a bug where apps displayed in the in-session switcher UI were out of sync with the remote session.
- Made some cosmetic changes to the layout of Connection Center workspace headers.
- Improved visibility of the on-screen keyboard buttons for dark backdrops.
- Fixed a localization bug in the disconnect dialog.

## Updates for version 10.1.3

*Date published: 11/06/2020*

We've put together some bug fixes and feature updates for this release. Here's what's new:

- The input mode (Mouse Pointer or Touch mode) is now global across all active PC and RemoteApp connections.
- Fixed an issue that prevented microphone redirection from working consistently.
- Fixed a bug that caused audio output to play from the iPhone earpiece instead of the internal speaker.
- The client now supports automatically switching audio output between the iPhone or iPad internal speakers, bluetooth speakers, and AirPods.
- Audio now continues to play in the background when switching away from the client or locking the device.
- The input mode automatically switches to Touch mode when using a SwiftPoint mouse on iPhones or iPads (not running iPadOS, version 13.4 or later).
- Addressed graphics output issues that occurred when the server was configured to use AVC444 full screen mode.
- Fixed some VoiceOver bugs.
- Panning around a zoomed in session works when using an external mouse or trackpad now works differently. To pan in a zoomed-in session with an external mouse or trackpad, select the pan knob, then drag your mouse cursor away while still holding the mouse button. To pan around in Touch mode, press on the pan knob, then move your finger. The session will stick to your finger and follow it around. In Mouse Pointer mode, push the virtual mouse cursor against the sides of the screen.

## Updates for version 10.1.2

*Date published 8/17/2020*

In this update, we've addressed issues that were reported in this release.

- Fixed a crash that occurred for some users when subscribing to an Azure Virtual Desktop feed using non-brokered authentication.
- Fixed the layout of workspace icons on the iPhone X, iPhone XS, and iPhone 11 Pro.

## Updates for version 10.1.1

*Date published: 11/06/2020*

Here’s what we've included in this release:

- Fixed a bug that prevented typing in Korean.
- Added support for F1 through F12, Home, End, PgUp and PgDn keys on hardware keyboards.
- Resolved a bug that made it difficult to move the mouse cursor to the top of the screen in letterboxed mode on iPadOS devices.
- Addressed an issue where pressing backspace after space deleted two characters.
- Fixed a bug that caused the iPadOS mouse cursor to appear on top of the Remote Desktop client mouse cursor in "Tap to Click" mode.
- Resolved an issue that prevented connections to some RD Gateway servers (error code 0x30000064).
- Fixed a bug that caused the mouse cursor to be shown in the in-session switcher UI on iOS devices when using a SwiftPoint mouse.
- Resized the RD client mouse cursor to be consistent with the current client scale factor.
- The client now checks for network connectivity before launching a workspace resource or PC connection.
- Hitting the remapped Escape button or Cmd+. now cancels out of any credential prompt.
- We've added some animations and polish that appear when you move the mouse cursor around on iPads running iPadOS 13.4 or later.

## Updates for version 10.1.0

*Date published: 11/06/2020*

In this release, we've made the following changes:

- If you're using iPadOS 13.4 or later, can now control the remote session with a mouse or trackpad.
- The client now supports the following Apple Magic Mouse 2 and Apple Magic Trackpad 2 gestures: left-click, left-drag, right-click, right-drag, horizontal and vertical scrolling, and local zooming.
- For external mice, the client now supports left-click, left-drag, right-click, right-drag, middle-click, and vertical scrolling.
- The client now supports keyboard shortcuts that use Ctrl, Alt, or Shift keys with the mouse or trackpad, including multi-select and range-select.
- The client now supports the "Tap-to-Click" feature for the trackpad.
- We've updated the Mouse Pointer mode's right-click gesture to press-and-hold (not press-and-hold-and-release). On the iPhone client we've thrown in some taptic feedback when we detect the right-click gesture.
- Added an option to disable NLA enforcement under **iOS Settings** > **RD Client**.
- Mapped Control+Shift+Escape to Ctrl+Shift+Esc, where Escape is generated using a remapped key on iPadOS or Command+.
- Mapped Command+F to Ctrl+F.
- Fixed an issue where the SwiftPoint middle mouse button didn't work in iPadOS version 13.3.1 or earlier and iOS.
- Fixed some bugs that prevented the client from recognizing the "rdp:" URI.
- Addressed an issue where the in-session Immersive Switcher UI showed outdated app entries if a disconnect was server-initiated.
- The client now supports the Azure Resource Manager-integrated version of Azure Virtual Desktop.

## Updates for version 10.0.7

*Date published: 4/29/2020*

In this update we've added the ability to sort the PC list view (available on iPhone) by name or time last connected.

## Updates for version 10.0.6

*Date published: 3/31/2020*

In this release, we've made the following changes:

- Fixed a number of VoiceOver accessibility issues.
- Fixed an issue where users couldn't connect with Turkish credentials.
- Sessions displayed in the switcher UI are now ordered by when they were launched.
- Selecting the Back button in the Connection Center now takes you back to the last active session.
- Swiftpoint mice are now released when switching away from the client to another app.
- Improved interoperability with the Azure Virtual Desktop service.
- Fixed crashes that were showing up in error reporting.

## Updates for version 10.0.5

*Date published: 03/09/20*

We've put together some bug fixes and feature updates for this release. Here's what's new:

- Launched RDP files are now automatically imported (look for the toggle in General settings).
- You can now launch iCloud-based RDP files that haven't been downloaded in the Files app yet.
- The remote session can now extend underneath the Home indicator on iPhones (look for the toggle in Display settings).
- Added support for typing composite characters with multiple keystrokes, such as é.
- Added support for the iPad on-screen floating keyboard.
- Added support for adjusting properties of redirected cameras from a remote session.
- Fixed a bug in the gesture recognizer that caused the client to become unresponsive when connected to a remote session.
- You can now enter App Switching mode with a single swipe up (except when you're in Touch mode with the session extended into the Home indicator area).
- The Home indicator will now automatically hide when connected to a remote session, and will reappear when you tap the screen.
- Added a keyboard shortcut to get to app settings in the Connection Center (**Command + ,**).
- Added a keyboard shortcut to refresh all workspaces in the Connection Center (**Command + R**).
- Hooked up the system keyboard shortcut for Escape when connected to a remote session (**Command + .**).
- Fixed scenarios where the Windows on-screen keyboard in the remote session was too small.
- Implemented auto-keyboard focus throughout the Connection Center to make data entry more seamless.
- Pressing **Enter** at a credential prompt now results in the prompt being dismissed and the current flow resuming.
- Fixed a scenario where the client would crash when pressing Shift + Option + Left, Up, or Down arrow key.
- Fixed a crash that occurred when removing a SwiftPoint device.
- Fixed other crashes reported to us by users since the last release.

## Updates for version 10.0.4

*Date published: 02/03/20*

In this release, we've made the following changes:

- Confirmation UI is now shown when deleting user accounts and gateways.
- The search UI in the Connection Center has been slightly reworked.
- The username hint, if it exists, is now shown in the credential prompt UI when launching from an RDP file or URI.
- Fixed an issue where the extended on-screen keyboard would extend underneath the iPhone notch.
- Fixed a bug where external keyboards would stop working after being disconnected and reconnected.
- Added support for the Esc key on external keyboards.
- Fixed a bug where English characters appeared when entering Chinese characters.
- Fixed a bug where some Chinese input would remain in the remote session after deletion.
- Fixed other crashes reported to us by users since the last release.

## Updates for version 10.0.3

*Date published: 01/16/20*

In this release, we've made the following changes:

- Support for launching connections from RDP files and RDP URIs.
- Workspace headers are now collapsible.
- Zooming and panning at the same time is now supported in Mouse Pointer mode.
- A press-and-hold gesture in Mouse Pointer mode will now trigger a right-click in the remote session.
- Removed force-touch gesture for right-click in Mouse Pointer mode.
- The in-session switcher screen now supports disconnecting, even if no apps are connected.
- Light dismiss is now supported in the in-session switcher screen.
- PCs and apps are no longer automatically reordered in the in-session switcher screen.
- Enlarged the hit test area for the PC thumbnail view ellipses menu.
- The Input Devices settings page now contains a link to supported devices.
- Fixed a bug that caused the Bluetooth permissions UI to repeatedly appear at launch for some users.
- Fixed other crashes reported to us by users since the last release.

## Updates for version 10.0.2

*Date published: 12/20/19*

We've been working hard to fix bugs and add useful features. Here's what's new in this release:

- Support for Japanese and Chinese input on hardware keyboards.
- The PC list view now shows the friendly name of the associated user account, if one exists.
- The permissions UI in the first-run experience is now rendered correctly in Light mode.
- Fixed a crash that happened whenever someone pressed the Option and Up or Down arrow keys at the same time on a hardware keyboard.
- Updated the on-screen keyboard layout used in the password prompt UI to make finding the Backslash key easier.
- Fixed other crashes reported to us by users since the last release.

## Updates for version 10.0.1

*Date published: 12/15/19*

Here's what new in this release:

- Support for the Azure Virtual Desktop service.
- Updated Connection Center UI.
- Updated in-session UI.

## Updates for version 10.0.0

*Date published: 12/13/19*

In this release, we've made the following changes:

- Support for the Azure Virtual Desktop service.
- A new Connection Center UI.
- A new in-session UI that can switch between connected PCs and apps.
- New layout for the auxiliary on-screen keyboard.
- Improved external keyboard support.
- SwiftPoint Bluetooth mouse support.
- Microphone redirection support.
- Local storage redirection support.
- Camera redirection support (only available for Windows 10, version 1809 or later).
- Support for new iPhone and iPad devices.
- Dark and light theme support.
- Control whether your phone can lock when connected to a remote PC or app.
- You can now collapse the in-session connection bar by pressing and holding the Remote Desktop logo button.

## Updates for version 8.1.42

*Date published: 06/20/2018*

In this release, we've made the following changes:

- Bug fixes and performance improvements.

## Updates for version 8.1.41

*Date published: 03/28/2018*

In this release, we've made the following changes:

- Updates to address CredSSP encryption oracle remediation described in CVE-2018-0886.
