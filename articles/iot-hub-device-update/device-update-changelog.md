---
title: Device Update for IoT Hub release notes and version history
description: Release notes and version history for Device Update for IoT Hub.
author: chrisjlin
ms.author: lichris
ms.date: 02/22/2023
ms.topic: release-notes
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub release notes and version history

Device Update for IoT Hub is an Azure service designed to work with an on-device agent built from the open-source Device Update for IoT Hub project hosted on GitHub. All new agent releases are made available under the [Releases section](https://github.com/Azure/iot-hub-device-update/releases) of the GitHub repository. Contributions, feature requests, and bug reports can also be filed on the [open-source Device Update for IoT Hub repository](https://github.com/Azure/iot-hub-device-update).

## Detailed release notes for "February 2023 Release"

This latest release consists of several improvements to the experience when using Azure portal. These improvements are compatible with the [GA launch API version ("2022-10-01")](/rest/api/deviceupdate/2022-10-01/device-update) and agent versions [v1.0.0](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0), [v1.0.1](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.1), and [v1.0.2](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.2).

### Improvements

* Improved the import experience by adding support for actionable notifications with update progress, enabling simplification of the **Updates** view by removing the dedicated tab for import history.
* Added the **Manage Device Update limits** section to the **Diagnostics** tab. This section details how close your instance is to hitting [Device Group and Device Class limits](device-update-limits.md).
* Added the ability to export Deployment details to a CSV file. This can be done by navigating to the **Deployment history** tab within a Device Group and selecting **View deployment details** then clicking **Export to CSV**.
* Added the ability to navigate directly to **Deployment details** after creating a new deployment from **Available updates**.
* Added a guided tutorial that walks through creation of an import manifest if one isn't included when importing a new update. This **Create manifest** tutorial can be accessed by starting a new import and selecting the desired update files from your storage container. If you don't include an import manifest (file with .importmanifest.json extension), the resulting error message contains a hyperlink ("create one") that opens the Import tutorial.
* Added a hyperlink to the storage container where log files from a successful log operation have been uploaded. This can be accessed by navigating to **Log upload operation details** and opening the **Devices** section. Each device that successfully completed the log upload operation should display a hyperlink ("Open storage container") in the **Log location** field.

## Version history

This table provides recent version history for the Device Update for IoT Hub service and agent, with a brief summary of the changes made for each version. Detailed breakdown of the most recent release's changes can be found in the **Detailed release notes** section of this page.

| Release notes and assets | Type | Release Date | Summary |
| ------------------------ | ---- | ------------ | ---------- |
| February 2023 Release | UX release | February 23, 2023 | This release brings new capabilities and quality-of-life improvements to the Azure portal experience.  |
| [Agent v1.0.2](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.2) | Agent patch | February 3, 2023 | This agent patch addresses several bugs (e.g. result codes for missing handlers) and contains several improvements (e.g. SWUpdate V2 handler for installed criteria).  |
| [Agent v1.0.1](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.1) | Agent patch | January 13, 2023 | This agent patch addresses several bugs (e.g. failure to reboot after installing new image) and contains several improvements (e.g. removed curl dependency in https_proxy_utils). |
| [GA launch (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0) | Full release | November 1, 2022 | This full release is made up of a new [API version ("2022-10-01")](/rest/api/deviceupdate/2022-10-01/device-update), an Azure portal UX refresh, and a new [agent version (v1.0.0)](https://github.com/Azure/iot-hub-device-update/releases/tag/1.0.0).|

## Next steps

* [View all Device Update for IoT Hub agent releases](https://github.com/Azure/iot-hub-device-update/releases)

* [File a bug, make a feature request, or submit a contribution](https://github.com/Azure/iot-hub-device-update/issues)