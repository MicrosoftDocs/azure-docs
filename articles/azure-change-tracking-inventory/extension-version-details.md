---
title: Azure Change Tracking Extension Version Details and Known Issues
description: This article describes the Change Tracking extension version details and the known issues.
#customer intent: As a customer, I want to learn about the fixed vulnerabilities in recent extension updates so that I can maintain a secure environment.
services: automation
ms.date: 12/03/2025
ms.topic: overview
ms.service: azure-change-tracking-inventory
ms.author: v-rochak2
author: RochakSingh-blr
---

# Azure Change Tracking and Inventory extension version details and known issues

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: Windows Services & Linux Daemons

This article provides the release notes for Azure Change Tracking and Inventory extensions.

## Release notes for extensions

### Extension version 2.35.0.0

| OS | Notes |
| --- | --- |
| Windows | Removed some security vulnerabilities. |
| Linux | Removed some security vulnerabilities. |

### Extension version 2.33.1.0

| OS | Notes |
| --- | --- |
| Windows | None. |
| Linux | Removed some security vulnerabilities. |

### Extension version 2.30.0.0

| OS | Notes |
| --- | --- |
| Windows | Added the ability to see details like the Knowledge Base IDs for software patches. |
| Linux | Fixed bugs related to detecting the correct OS versions. |

### Extension version 2.29.0.0

| OS | Notes |
| --- | --- |
| Windows | For the Windows registry to work seamlessly, we recommend that you move to extension version 2.29.0.0. |
| Linux | None. |

### Extension version 2.27.0.0

| OS | Notes |
| --- | --- |
| Windows | Removed some security vulnerabilities. |
| Linux | Removed some security vulnerabilities. |

### Extension version 2.24.0.0

#### Known issues

After you migrate from file integrity monitoring (FIM) based on the Azure Monitor Agent (AMA) to Change Tracking based on the AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

| OS | Notes |
| --- | --- |
| Windows | Fixed the installation issues for the Azure Arc-enabled machines that have languages other than English. |
| Linux | Fixed the installation issues for the Azure Arc-enabled machines. |

### Extension version 2.23.0.0

#### Known issues

After you migrate from FIM based on the AMA to Change Tracking based on the AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

| OS | Notes |
| --- | --- |
| Windows | Added support for environment variables in file path. |

### Extension version 2.22.0.0

#### Issue fixed

The `SvcName` or `SoftwareName` fields are displayed as a garbled string for Japanese or Chinese language virtual machines (VMs). The issue is fixed in the latest version of the AMA for Windows (1.24.0). We recommend that you upgrade to the AMA.

#### Known issues

For Windows, the `SvcDescription` field is coming as a Base64-encoded string. As a workaround, use the `base64_decode_tostring() kql` function.

##### OS-specific issues

| OS | Notes |
| --- | --- |
| Windows | None |
| Linux | The Fix file content upload isn't working for Linux machines. |

### Extension version 2.21.0.0

#### Issues fixed

The `SvcName` or `SoftwareName` fields are displayed as a garbled string for Japanese or Chinese language VMs. The issue is fixed in the latest version of the AMA for Windows (1.24.0). We recommend that you upgrade to the AMA.
For Windows, the `SvcDescription` field is coming as a Base64-encoded string. As a workaround, use the `base64_decode_tostring() kql` function.

##### OS-specific issues

| OS | Notes |
| --- | --- |
| Windows | The Fix Windows services data isn't getting uploaded for machines in some languages (Japanese, Chinese). |
| Linux | None. |

## Related content

- To enable Azure Change Tracking and Inventory from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).
