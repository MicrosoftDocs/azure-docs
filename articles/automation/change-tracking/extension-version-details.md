---
title: Azure Automation Change Tracking extension version details and known issues.
description: This article describes the Change Tracking extension version details and known issues.
services: automation
ms.subservice: change-inventory-management
ms.date: 05/22/2024
ms.topic: conceptual
---

# Change tracking and inventory extension version details and known issues

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Windows Registry :heavy_check_mark: Windows Files :heavy_check_mark: Linux Files :heavy_check_mark: Windows Software :heavy_check_mark: Windows Services & Linux Daemons

This article explains the version details of change tracking extension.


## Release Notes for Extension

### Extension version 2.24.0.0

#### Known issues

After you migrate from FIM based on AMA to ChangeTracking based on AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

- **Windows** - Fix the installation issues for the Arc-enabled machines having languages other than English.
- **Linux** - Fix the installation issues for the Arc-enabled machines.

### Extension version 2.23.0.0

#### Known issues

After you migrate from FIM based on AMA to ChangeTracking based on AMA, the memory usage increases. To resolve this issue, we recommend that you restart the extension/machine.

- **Windows** - Add support for environment variables in file path.


### Extension version 2.22.0.0

#### Known issues

- The SvcName or SoftwareName are displayed as garbled string for Japanese or Chinese lang vms. The issue is fixed in latest version of AMA windows (1.24.0). We recommend that you upgrade to Azure Monitoring Agent.
- For Windows, SvcDescription field is coming as base64 encoded string. As a workaround for now you must use base64_decode_tostring() kql function.

**Windows** - None

**Linux** - The Fix file content upload isn't working for Linux machines.

### Extension Version 2.21.0.0

### Known issues

- SvcName or SoftwareName are displayed as garbled string for Japanese, or Chinese lang vms. The issue is fixed in latest version of AMA windows (1.24.0). We recommend that you upgrade to Azure Monitoring Agent.
For Windows SvcDescription is coming as base64 encoded string. As a workaround for now you must use base64_decode_tostring() kql function.

**Windows** - The Fix Windows services data isn't getting uploaded for machines in some languages (Japanese, Chinese).

**Linux** - None


## Next steps

- To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).
