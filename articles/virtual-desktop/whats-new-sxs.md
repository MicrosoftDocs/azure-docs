---
title: What's new in the Azure Virtual Desktop SxS Network Stack? - Azure
description: New features and product updates for the Azure Virtual Desktop SxS Network Stack.
author: dougeby
ms.topic: release-notes
ms.date: 06/03/2025
ms.author: avdcontent
ms.custom: references_regions
---

# What's new in the Azure Virtual Desktop SxS Network Stack?

The Azure Virtual Desktop agent links your session hosts with the Azure Virtual Desktop service. It also includes a component called the SxS Network Stack. The Azure Virtual Desktop agent acts as the intermediate communicator between the service and the virtual machines, enabling connectivity. The SxS Network Stack component is required for users to securely establish reverse server-to-client connections.

The Azure Virtual Desktop SxS Network Stack is updated regularly. New versions of the Azure Virtual Desktop SxS Network Stack are installed automatically. When new versions are released, they're rolled out progressively to session hosts. This process is called *flighting* and it enables Microsoft to monitor the rollout in [validation environments](create-validation-host-pool.md) first.

A rollout might take several weeks before the agent is available in all environments. Some agent versions might not reach nonvalidation environments, so you might see multiple versions of the agent deployed across your environments.

This article is where you'll find out about:

- The latest updates
- New features
- Improvements to existing features
- Bug fixes

Make sure to check back here often to keep up with new updates.

## Latest available versions

Here's information about the SxS Network Stack.

| Release | Latest version |
|--|--|
| Production | 1.0.2502.25400  |
| Validation | 1.0.2502.25800  |

## Version 1.0.2502.25800

*Published June 2025*

In this release, we've made the following changes:

- Connection reliability bug fixes.

## Version 1.0.2502.25700

*Published May 2025*

In this release, we've made the following changes:

- Fixed high RemoteApp CPU usage caused by `rdpshell.exe`.

## Version 1.0.2502.25400

*Published May 2025*

In this release, we've made the following changes:

- Resolved issues affecting the performance monitoring of UDP connections, ensuring accurate and reliable metrics in Performance Monitor.
- Improved connection time for VMs with the **Always prompt for password** group policy setting enabled.
- Enhanced connection reliability and implemented security fixes to ensure stable and secure connections. 

## Version 1.0.2501.05600

*Published March 2025; updated April 2025*

In this release, we've made the following changes:

- Added two new binaries: `rdpstartuplauncher.exe` and `rdpstartup.exe` that enable future improvements to peripheral and resource redirection.
- Connection reliability bug fixes.
- Improved diagnostics checkpoints for UDP connections.
- Added a diagnostic checkpoint to log all graphics codecs in use and whether hardware graphics encoding is active for each connection session.
- Resolved a RemoteApp issue where the Office clipboard status box would disrupt the local work area.
- Fixed an issue with high-contrast settings to ensure proper RemoteApp connection establishment.

## Version 1.0.2409.29850

*Published: March 2025*

In this release, we've made the following changes:

- A fix has been implemented to resolve a deadlock issue that was causing session hosts to stop accepting new Azure Virtual Desktop connections. 

## Version 1.0.2409.29800

*Published: January 2025*

In this release, we've made the following changes:

- Fixed a bug that caused UDP connection failures when network latency exceeded 500ms RTT.
- Fixed a bug where disabling UDP Shortpath Public also unintentionally disabled Shortpath Private. This update ensures independent control of both settings.
- Addressed a key detection issue and enhanced diagnostic capabilities for RemoteApp execution.

## Version 1.0.2409.29600 

*Published: November 2024*

In this release, we've made the following changes:

- Rearchitected RemoteApp server processes for better shell integration.   
- Added EventLog for ImageQuality and Chroma settings; added graphics profile name in existing Eventlog. 
- Fixed Battery Status redirection to show status text of battery upon mouse hover. 

## Version 1.0.2407.05700

*Published: September 2024*

In this release, we've made the following changes:

- Support for the [preview of graphics encoding with HEVC/H.265](whats-new.md#enabling-hevc-gpu-acceleration-for-azure-virtual-desktop-is-now-in-preview).
- Addressed an issue when using a RemoteApp that could cause the text highlight color in the File Explorer's address bar to appear incorrectly.
  
## Version 1.0.2404.16760

*Published: July 2024*

In this release, we've made the following changes:

- General improvements and bug fixes mainly around `rdpshell` and RemoteApp. 

## Version 1.0.2402.09880

*Published: July 2024*

In this release, we've made the following changes:

- General improvements and bug fixes mainly around `rdpshell` and RemoteApp. 
- The default chroma value has been changed from 4:4:4 to 4:2:0. 
- Reduce chance of progressive update blocking real updates from driver. 
- Improve user experience when bad credentials are saved. 
- Improve session switching to avoid hangs.  
- Update Intune version numbers for the granular clipboard feature. 
- Bug fixes for RemoteApp V2 decoder. 
- Bug fixes for RemoteApp.  
- Fix issue with caps lock state when using the on-screen keyboard. 

