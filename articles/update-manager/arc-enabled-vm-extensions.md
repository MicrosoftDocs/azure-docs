---
title: Azure Arc VM Extensions Update – July 2025 Release Notes & Fixes
description: Explore the July 2025 release notes for Azure Arc-enabled VM extensions, including new Linux OS support, bug fixes, and known issues for Windows and Linux environments.
ms.service: azure-update-manager
ms.date: 07/09/2025
ms.topic: overview
author: habibaum
ms.author: v-uhabiba
---

# Release notes for Azure Arc-enabled VM extensions - July 25

For Azure Arc-enabled machines, two extensions are installed. For more information, see [How Update Manager works](workflow-update-manager.md)


The Azure Arc-enabled VM extensions receive improvements on an ongoing basis. This article provides you with the following information to help you stay up to date with the latest developments:

- The latest releases
- Known issues
- Bug fixes

## Windows extension

Update this when future versions are released.

## Linux extensions

### July 2025

#### Extension name: Microsoft.SoftwareUpdateManagement.LinuxOsUpdateExtension 
#### Extension Version: 1.0.55.0

Added support for management of following distributions: 

- Ubuntu 24 
- Debian 12 

In previous releases, patching an Ubuntu 24.04 server failed with the error: **E: the list of sources couldn't be read**.


## Next steps

- [How Update Manager works](workflow-update-manager.md)
- [Prerequisites of Update Manager](prerequisites.md)
- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).

