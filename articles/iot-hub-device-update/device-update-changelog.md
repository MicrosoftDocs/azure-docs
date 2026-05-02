---
title: Device Update for IoT Hub release notes and version history
description: Release notes and version history for Device Update for IoT Hub.
author: cwatson-cat
ms.author: cwatson
ms.date: 02/22/2023
ms.topic: release-notes
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for IoT Hub release notes and version history

Device Update for IoT Hub is an Azure service designed to work with an on-device agent built from the open-source Device Update for IoT Hub project hosted on GitHub. All new agent releases are made available under the [Releases section](https://github.com/Azure/iot-hub-device-update/releases) of the GitHub repository. Contributions, feature requests, and bug reports can also be filed on the [open-source Device Update for IoT Hub repository](https://github.com/Azure/iot-hub-device-update).

## Detailed release notes for Device Update agent v1.3.0

The Device Update agent version 1.3.0 introduces updates across update workflows, reliability, and platform support, along with new capabilities such as enhanced delta download support (available for use in production scenarios through the open-source agent), a device-side status API, and expanded authentication options.


## Improvements

**Delta update and download enhancements**
  - Introduced enhanced support for delta downloads, available for production scenarios through the open-source agent.
  - Included improvements to caching behavior and reliability, along with component-based packaging support.

- **Update workflow visibility and diagnostics**
  - Improved reporting of update results, including more detailed failure information.
  - Added extended result codes to help diagnose update outcomes in IoT Hub.

- **Device-side agent status API**
  - Introduced a local API that allows processes on the device to query the current state of the Device Update agent.

- **Reboot coordination improvements**
  - Improved how the agent coordinates system restarts to allow update operations and reporting to complete before reboot.

- **Platform support updates**
  - Added support for:
    - Ubuntu 24.04 LTS
    - Debian 13 (Trixie)

- **Script and workflow enhancements**
  - Enabled passing workflow data to script handlers for more flexible update scenarios.

- **Authentication options**
  - Added support for X.509-based authentication using client certificates.


## Version history

This table provides recent version history for the Device Update for IoT Hub service and agent, with a brief summary of the changes made for each version. Detailed breakdown of the most recent release's changes can be found in the **Detailed release notes** section of this page.

| Release notes and assets | Type | Release Date | Summary |
| ------------------------ | ---- | ------------ | ---------- |

| [Agent v1.3.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.3.0) | Agent release | May 2026 | This release introduces enhanced delta download support for production scenarios, a device-side status API, improved update diagnostics, and expanded platform support (Ubuntu 24.04, Debian 13). |
| [Agent v1.2.6](https://github.com/Azure/iot-hub-device-update/releases/tag/1.2.6) | Agent patch | March 23, 2026 | This agent patch includes bug fixes and stability improvements, along with updates to platform support and tooling. |
| [Agent v1.2.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.2.0) | Agent release | April 8, 2025 | This release focuses on reliability and security fixes, along with improvements to update workflows and platform compatibility (including Debian 12 support). |
| [Agent v1.1.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.1.0) | Agent release | December 22, 2023 | This release introduces improvements to root key certificate handling and platform support (Ubuntu 22.04, Debian 11 support), along with updates to agent configuration and update workflows |
| February 2023 Release | UX release | February 23, 2023 | This release brings new capabilities and quality-of-life improvements to the Azure portal experience.  |
| [Agent v1.0.2](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.2) | Agent patch | February 3, 2023 | This agent patch addresses several bugs (e.g. result codes for missing handlers) and contains several improvements (e.g. SWUpdate V2 handler for installed criteria).  |
| [Agent v1.0.1](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.1) | Agent patch | January 13, 2023 | This agent patch addresses several bugs (e.g. failure to reboot after installing new image) and contains several improvements (e.g. removed curl dependency in https_proxy_utils). |
| [GA launch (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0) | Full release | November 1, 2022 | This full release is made up of a new [API version ("2022-10-01")](/rest/api/deviceupdate/2022-10-01/device-update), an Azure portal UX refresh, and a new [agent version (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0).|

## Next steps

* [View all Device Update for IoT Hub agent releases](https://github.com/Azure/iot-hub-device-update/releases)

* [File a bug, make a feature request, or submit a contribution](https://github.com/Azure/iot-hub-device-update/issues)
