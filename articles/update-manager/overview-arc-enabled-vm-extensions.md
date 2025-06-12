---
title: Release notes of Arc-enabled VM extensions
description: Learn about Azure Arc-enabled VM extensions, including their latest releases, known issues, and bug fixes, to help you manage updates effectively.
ms.service: azure-update-manager
ms.date: 03/28/2025
ms.topic: overview
author: habibaum
ms.author: v-uhabiba
---

# Release notes for Azure Arc-enabled VM extensions - March 25

For Azure Arc-enabled machines, two extensions are installed. For more information, see [How Update Manager works](workflow-update-manager.md)


The Azure Arc-enabled VM extensions receive improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with the information about:

- The latest releases
- Known issues
- Bug fixes

## Windows extension

### March 2025

#### Extension name: Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension**
#### Extension Version: 1.0.28.0

**Fixed**

- Improvement in error message to make troubleshooting easier
    - Current error message:  *An internal error occurred while processing the operation.*
    - New error message: *Windows update API threw an exception while assessing the machine for available updates. HResult: 0x80004005*
    > [!NOTE]
    > The HResult could be different, based on the issue.

- Fixed an issue where at times the extension status is stuck in  **Creating state**. Then the assessment or install updates job fails with the following error: *Extension failed during enable. Extension Enable command timed out.*

- Fixed an issue where although the updates are installed and reboot is completed within the maintenance window, still the operation is stuck in **InProgress** state and completes the maintenance window end time with the following error message: *Maintenance window exceeded. Could not complete patching process within window specified.*

## Linux Extension

To be updated as and when future versions are released.


## Next steps

- [How Update Manager works](workflow-update-manager.md)
- [Prerequisites of Update Manager](prerequisites.md)
- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).

