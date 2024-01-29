---
title: What's new in multimedia redirection MMR? - Azure Virtual Desktop
description: New features and product updates for multimedia redirection for Azure Virtual Desktop.
author: Heidilohr
ms.topic: release-notes
ms.date: 01/23/2024
ms.author: helohr
---

# What's new in multimedia redirection?

This article has the latest updates for multimedia redirection (MMR) for Azure Virtual Desktop.

## Latest available version

The following table shows the latest available version of the MMR extension for Azure Virtual Desktop. For setup instructions, see [Use multimedia redirection on Azure Virtual Desktop](multimedia-redirection.md).

| Release | Latest version | Download |
|---------|----------------|----------|
| Public | 1.0.2311.2004 | [MMR extension](https://aka.ms/avdmmr/msi) |

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

- Released general availability-compatible MMR host.
- Fixed an issue where content can cause the service to stop working instead of just giving a playback error.

## Updates for version 0.3.2210.12012

*Published: October 13, 2022*

In this release, we've made the following changes:

- Added telemetry for time to first frame rendered and detecting a possible stall issue.
- Added changes for calling redirection including dual-tone multiple-frequency (DTMF) tones, and initial support for video. 

## Next steps

Learn more about MMR at [Understanding multimedia direction for Azure Virtual Desktop](multimedia-redirection-intro.md) and [Use multimedia redirection for Azure Virtual Desktop](multimedia-redirection.md).