---
title: Azure Change Tracking extension version details and known issues
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


## Release notes for extension

### Extension version 2.35.0.0

| OS | Notes |
| --- | --- |
| **Windows** | Removed some security vulnerabilities. |
| **Linux** | Removed some security vulnerabilities. |

### Extension version 2.33.1.0

| OS | Notes |
| --- | --- |
| **Windows** | None |
| **Linux** | Removed some security vulnerabilities. |

### Extension version 2.30.0.0

| OS | Notes |
| --- | --- |
| **Windows** | Added ability to see details like the KB IDs for software patches. |
| **Linux** | Fixed bugs related to detecting the correct OS versions. |

### Extension version 2.29.0.0

| OS | Notes |
| --- | --- |
| **Windows** | For Windows Registry to work seamlessly, we recommend you move to extension version 2.29.0.0. |
| **Linux** | None |

### Extension version 2.27.0.0

| OS | Notes |
| --- | --- |
| **Windows** | Removed some security vulnerabilities. |
| **Linux** | Removed some security vulnerabilities. |

### Extension version 2.24.0.0

#### Known issues

After you migrate from FIM based on AMA to ChangeTracking based on AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

| OS | Notes |
| --- | --- |
| **Windows** | Fix the installation issues for the Arc-enabled machines having languages other than English. |
| **Linux** | Fix the installation issues for the Arc-enabled machines. |

### Extension version 2.23.0.0

#### Known issues

After you migrate from FIM based on AMA to ChangeTracking based on AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

| OS | Notes |
| --- | --- |
| **Windows** | Add support for environment variables in file path. |

### Extension version 2.22.0.0

#### Issue fixed

The **SvcName** or **SoftwareName** are displayed as garbled string for Japanese or Chinese language VMs. The issue is fixed in latest version of AMA windows (1.24.0). We recommend that you upgrade to Azure Monitor Agent.

#### Known issues

For Windows, **SvcDescription** field is coming as base64 encoded string. As a workaround, use base64_decode_tostring() kql function.

**OS-specific issues:**
| OS | Notes |
| --- | --- |
| **Windows** | None |
| **Linux** | The Fix file content upload isn't working for Linux machines. |

### Extension Version 2.21.0.0

#### Issues fixed

**SvcName** or **SoftwareName** are displayed as garbled string for Japanese or Chinese language VMs. The issue is fixed in latest version of AMA windows (1.24.0). We recommend that you upgrade to Azure Monitor Agent.
For Windows **SvcDescription** is coming as base64 encoded string. As a workaround, use base64_decode_tostring() kql function.

**OS-specific issues:**
| OS | Notes |
| --- | --- |
| **Windows** | The Fix Windows services data isn't getting uploaded for machines in some languages (Japanese, Chinese). |
| **Linux** | None |

## Next steps

To enable Azure Change Tracking and Inventory from the Azure portal, see [Quickstart: Enable Azure Change Tracking and Inventory](quickstart-monitor-changes-collect-inventory-azure-change-tracking-inventory.md).
