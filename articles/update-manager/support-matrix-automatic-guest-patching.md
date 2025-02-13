---
title: Automatic Guest Patching for Azure Virtual Machines
description: Learn how to automatically patch your Azure Virtual Machines and Scale Sets using Azure Update Manager. This article provides an overview of supported OS images, configuration steps, and best practices for maintaining security compliance through automatic guest patching.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 02/13/2025
ms.topic: overview
---
# Automatic Guest Patching for Azure Virtual Machines

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs

By enabling automatic guest patching for your Azure Virtual Machines (VMs), you can automatically and securely patch your VMs to ensure they remain compliant with security standards."

## Supported OS images

> [!NOTE]
>- Automatic VM guest patching, on-demand patch assessment and on-demand patch installation are supported only on VMs created from images with the exact combination of publisher, offer and sku from the below supported OS images list. Custom images or any other publisher, offer, sku combinations aren't supported. More images are added periodically. Don't see your SKU in the list? Request support by filing out [Image Support Request](https://forms.microsoft.com/r/6vfSgT0mFx).
>- If [automatic VM guest patching](/azure/virtual-machines/automatic-vm-guest-patching) is enabled on a VM, then the available Critical and Security patches are downloaded and applied automatically on the VM.


#### [Supported Windows Images (Hotpatchable)](#tab/win-hotpatch)

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-azure-edition-core |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-azure-edition-core-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-azure-edition-hotpatch |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-azure-edition-hotpatch-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2025-datacenter-azure-edition |
| MicrosoftWindowsServer  | WindowsServer | 2025-datacenter-azure-edition-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2025-datacenter-azure-edition-core |
| MicrosoftWindowsServer  | WindowsServer | 2025-datacenter-azure-edition-core-smalldisk |


#### [Supported Windows Images (non-Hotpatchable)](#tab/win-nonhotpatch)

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| MicrosoftWindowsServer  | WindowsServer | 2008-R2-SP1 |
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter-gensecond |
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter-smalldisk |
| MicrosoftWindowsServer  | WindowsServer | 2012-R2-Datacenter-smalldisk-g2 |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter    |
| MicrosoftWindowsServer  | WindowsServer | 2016-datacenter-gensecond  |
| MicrosoftWindowsServer  | WindowsServer | 2016-Datacenter-Server-Core |
| MicrosoftWindowsServer  | WindowsServer | 2016-datacenter-smalldisk  |
| MicrosoftWindowsServer  | WindowsServer | 2016-datacenter-with-containers  |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter |
| MicrosoftWindowsServer  | WindowsServer | 2019-Datacenter-Core |
| MicrosoftWindowsServer  | WindowsServer | 2019-datacenter-gensecond  |
| MicrosoftWindowsServer  | WindowsServer | 2019-datacenter-smalldisk  |
| MicrosoftWindowsServer  | WindowsServer | 2019-datacenter-smalldisk-g2  |
| MicrosoftWindowsServer  | WindowsServer | 2019-datacenter-with-containers  |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter    |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-smalldisk    |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-smalldisk-g2 |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-g2    |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-core |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-core-g2 |
| MicrosoftWindowsServer  | WindowsServer | 2022-datacenter-azure-edition |

#### [Supported Linux Images](#tab/lin-img)

| Publisher               | OS Offer      |  Sku               |
|-------------------------|---------------|--------------------|
| Canonical  | UbuntuServer | 16.04-LTS |
| Canonical  | UbuntuServer | 16.04.0-LTS |
| Canonical  | UbuntuServer | 18.04-LTS |
| Canonical  | UbuntuServer | 18.04-LTS-gen2 |
| Canonical  | 0001-com-ubuntu-pro-bionic | pro-18_04-lts |
| Canonical  | 0001-com-ubuntu-server-focal | 20_04-lts |
| Canonical  | 0001-com-ubuntu-server-focal | 20_04-lts-gen2 |
| Canonical  | 0001-com-ubuntu-pro-focal | pro-20_04-lts |
| Canonical  | 0001-com-ubuntu-pro-focal | pro-20_04-lts-gen2 |
| Canonical  | 0001-com-ubuntu-server-jammy | 22_04-lts |
| Canonical  | 0001-com-ubuntu-server-jammy | 22_04-lts-gen2 |
| microsoftcblmariner  | cbl-mariner | cbl-mariner-1 |
| microsoftcblmariner  | cbl-mariner | 1-gen2 |
| microsoftcblmariner  | cbl-mariner | cbl-mariner-2 |
| microsoftcblmariner  | cbl-mariner | cbl-mariner-2-gen2 |
| Redhat  | RHEL | 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7_9, 7-RAW, 7-LVM |
| Redhat  | RHEL | 8, 8.1, 81gen2, 8.2, 82gen2, 8_3, 83-gen2, 8_4, 84-gen2, 8_5, 85-gen2, 8_6, 86-gen2, 8_7, 8_8, 8-lvm, 8-lvm-gen2 |
| Redhat  | RHEL | 9_0, 9_1, 9-lvm, 9-lvm-gen2 |
| Redhat  | RHEL-RAW | 8-raw, 8-raw-gen2 |
| SUSE  | sles-12-sp5 | gen1, gen2 |
| SUSE  | sles-15-sp2 | gen1, gen2 |

---

For VMs created from customized images even if the Patch orchestration mode is set to `Azure Orchestrated/AutomaticByPlatform`, automatic VM guest patching doesn't work. We recommend that you use scheduled patching to patch the machines by defining your own schedules or install updates on-demand.

## Next steps

- [View updates for a single machine](view-updates.md)
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md)
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md)