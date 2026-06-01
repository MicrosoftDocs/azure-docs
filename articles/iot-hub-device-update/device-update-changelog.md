---
title: Device Update for IoT Hub release notes and version history
description: Release notes and version history for Device Update for IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.date: 05/21/2026
ms.topic: release-notes
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for IoT Hub release notes and version history

Device Update for IoT Hub is an Azure service designed to work with an on-device agent built from the open-source Device Update agent reference implementation hosted on GitHub. New versions of the reference implementation are made available under the [Releases section](https://github.com/Azure/iot-hub-device-update/releases) of the GitHub repository. Contributions, feature requests, and bug reports can also be filed on the[open-source Device Update for IoT Hub repository](https://github.com/Azure/iot-hub-device-update).

## Detailed release notes for Device Update agent reference implementation version 1.3.0

The Device Update agent reference implementation version 1.3.0 includes improvements to update workflows, reliability, and platform support. It adds capabilities such as enhanced delta download support to help reduce the amount of data transferred during updates, a device-side status API to improve visibility and coordination with device workloads, and expanded support for newer Linux versions to build on.

### Delta updates

- Delta updates enable devices to transfer only what changed between versions, reducing update payload size and bandwidth usage.
- Added Microsoft Delta Download Handler with component-based packaging.
- Improved caching behavior and download reliability.
  
### Device coordination and update control

- Added a new device-side status API that lets local processes coordinate with active updates, helping avoid conflicts and improve update reliability.
- Workflow data can now be passed to script handlers, enabling more flexible update scenarios.
- Improved restart coordination ensures reporting and cache operations complete before reboot.
  
### Update visibility and diagnostics

- More detailed failure reporting for update workflows.
- Extended result codes now surface in IoT Hub for deeper troubleshooting.
  
### Platform and environment support

- Added support for Ubuntu 24.04 and Debian 13, giving more flexibility to build and integrate on newer Linux environments.
- The curl handler is now the default content download handler.
  
### Security and authentication

- Added support for X.509 client certificate authentication.
  *X.509 authentication support in the Device Update agent uses standard Azure IoT Hub identity configuration. This capability isn't integrated with Azure Device Registry (ADR) certificate management (preview).*
  
### Reliability

- Improved agent logging, error handling, and overall workflow stability.
- Includes fixes to memory handling, thread safety, and platform stability.

## Version history

This table provides recent version history for the Device Update for IoT Hub service and agent reference implementation, with a brief summary of the changes made for each version. Detailed breakdown of the most recent release's changes can be found in the **Detailed release notes** section of this page.

| Release notes and assets | Type | Release Date | Summary |
| ------------------------ | ---- | ------------ | ---------- |
| [Agent v1.3.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.3.0) | Agent reference implementation release | May 2026 | Adds delta download support to reduce update size, a device-side status API for improved coordination, expanded diagnostics, and support for newer Linux platforms (Ubuntu 24.04, Debian 13). |
| [Agent v1.2.6](https://github.com/Azure/iot-hub-device-update/releases/tag/1.2.6) | Agent patch | March 23, 2026 | This agent patch includes bug fixes and stability improvements, along with updates to platform support and tooling. |
| [Agent v1.2.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.2.0) | Agent reference implementation release | April 8, 2025 | This release focuses on reliability and security fixes, along with improvements to update workflows and platform compatibility (including Debian 12 support). |
| [Agent v1.1.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.1.0) | Agent reference implementation release | December 22, 2023 | This release introduces improvements to root key certificate handling and platform support (Ubuntu 22.04, Debian 11 support), along with updates to agent configuration and update workflows |
| February 2023 Release | UX release | February 23, 2023 | This release brings new capabilities and quality-of-life improvements to the Azure portal experience.  |
| [Agent v1.0.2](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.2) | Agent patch | February 3, 2023 | This agent patch addresses several bugs (e.g. result codes for missing handlers) and contains several improvements (e.g. SWUpdate V2 handler for installed criteria).  |
| [Agent v1.0.1](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.1) | Agent patch | January 13, 2023 | This agent patch addresses several bugs (e.g. failure to reboot after installing new image) and contains several improvements (e.g. removed curl dependency in https_proxy_utils). |
| [GA launch (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0) | Full release | November 1, 2022 | Corresponds to the general availability of Device Update for IoT Hub, including a new [API version ("2022-10-01")](/rest/api/deviceupdate/2022-10-01/device-update), an Azure portal UX refresh, and a new [agent reference implementation version (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0). |

## Next steps

* [View all Device Update for IoT Hub agent releases](https://github.com/Azure/iot-hub-device-update/releases)

* [File a bug, make a feature request, or submit a contribution](https://github.com/Azure/iot-hub-device-update/issues)
