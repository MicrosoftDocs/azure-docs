---
title: What's new in multimedia redirection? - Azure Virtual Desktop
description: New features and product updates for multimedia redirection for Azure Virtual Desktop.
author: dknappettmsft
ms.topic: release-notes
ms.date: 08/12/2024
ms.author: daknappe
ms.custom: docs_inherited
---

# What's new in multimedia redirection?

This article has the latest updates for the host component of multimedia redirection for Azure Virtual Desktop, which is installed on session hosts. To learn how to install and configure multimedia redirection, see [Multimedia redirection for video playback and calls in a remote session](multimedia-redirection.md).

## Latest available version

The following table shows the latest available version of multimedia redirection for Azure Virtual Desktop.

| Release | Latest version | Download |
|---------|----------------|----------|
| Public | 1.0.2404.4003 | [Multimedia redirection](https://aka.ms/avdmmr/msi) |

## Updates for version 1.0.2404.4003

*Published: July 23, 2024*

In this release, we've made the following changes:

- Fixed a deadlock issue and improved telemetry processing.

## Updates for version 1.0.2311.2004

*Published: January 23, 2024*

In this release, we've made the following changes:

- Fixed an issue that affected call redirection.
- Fixed an installer log file location issue.
- The extension no longer displays error messages for unsupported media formats.

## Updates for version 1.0.2309.7002

*Published: September 12, 2023*

In this release, we've made the following changes:

- Added support for using the Preview version of the extension.
- Fixed a memory leak that caused the host to not close.
- Added support for providing Telemetry IDs to the extension for customer support purposes.
- Improved call connection reliability.

## Updates for version 1.0.2304.12009 

*Published: June 13, 2023*

In this release, we've made the following changes: 

- Fixed various issues that caused crashes. 
- Improved telemetry.

## Updates for version 1.0.2301.24004

*Published: February 7, 2023*

In this release, we've made the following changes:

- Released general availability-compatible multimedia redirection host.
- Fixed an issue where content can cause the service to stop working instead of just giving a playback error.

## Updates for version 0.3.2210.12012

*Published: October 13, 2022*

In this release, we've made the following changes:

- Added telemetry for time to first frame rendered and detecting a possible stall issue.
- Added changes for calling redirection including dual-tone multiple-frequency (DTMF) tones, and initial support for video. 

## Next steps

Learn more about multimedia redirection at [Multimedia redirection for video playback and calls in a remote session](multimedia-redirection-video-playback-calls.md).
