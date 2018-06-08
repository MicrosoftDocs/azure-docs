---
title: Operating system upgrade for the SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Perform Operating system upgrade for SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/11/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Operating System Upgrade
This document describes the details on operating system upgrades on the HANA Large Instances.

>[!NOTE]
>The OS upgrade is customers responsibility, Microsoft operations support can guide you to the key areas to watch out during the upgrade. You should consult your operating system vendor as well before you plan for an upgrade.

At the time of the HLI unit provisioning, the Microsoft operations team install the operating system. Over the time, you are required to maintain the operating system (Example: Patching, tuning, upgrading etc.) on the HLI unit.

Before you do major changes to the operating system (for example, Upgrade an OS), you **must** consider the following compatibility matrix. You **must** also contact Microsoft Operations team by opening a support ticket to consult before you start the major operating system activities like upgrade.

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).

The following compatibility has been tested for the HLIs. If your HLI server is out of the compatibility matrix, contact the Microsoft operation support.

## For Type I class SKU category

| Configuration | SUSE12 SP1 | SUSE12 SP2 | RHEL 7.2 | RHEL 7.3|
| --- | --- | --- | --- | --- |
| Server Firmware | 3.1(2b) | 3.1(2b) | 3.1(2b) | 3.1(2b) |
| ENIC Version | 2.3.0.44 | 2.3.0.44 | 2.3.0.30 | 2.3.0.44 |
| FNIC Version | 1.6.0.34 | 1.6.0.34 | 1.6.0.27 | 1.6.0.36 |
| EDAC | Disabled | Disabled | Disabled | Disabled |
| Kernel Version | 4.4.21-69-default | 3.12.49-11-default | 3.10.0-327.el7.x86_64 | 3.10.0-693.17.1 |


## For Type II class SKU category

| Configuration | SUSE12 SP1 | SUSE12 SP2 | RHEL 7.2 | RHEL 7.3|
| --- | --- | --- | --- | --- |
| RMC Firmware Version | 1.1.121  | 1.1.121  | 1.1.121  | 1.1.121 |
| BMC Firmware Version | 1.0.43   | 1.0.43   | 1.0.43   | 1.0.43  |
| Software Foundation Server (SFS) Version | 2.16    | 2.16    | 2.14/2.16   | 2.16   |
| BIOS | 5.2.6    | 5.2.6    | 5.2.6    | 5.2.6   |
| i40e Version    | 2.0.19     | 2.0.19     | 1.5.10-k    | 1.5.10-k   |
| Kernel Version    | 3.12.49-11.1     | 4.4.21-69.1     | 3.10.0-327    | 3.10.0-693.17.1   |


## Known issues

The following are the few common known issues during the upgrade:
- On SKU Type II class SKU, the software foundation software (SFS) is removed after the OS upgrade. You must reinstall the compatible SFS after the OS upgrade.
- Ethernet card drivers (ENIC and FNIC) rolled back to older version. You must reinstall the compatible version of the drivers after the upgrade.

## Next steps
- Refer [Backup and restore](hana-overview-high-availability-disaster-recovery.md) for OS backup Type I SKU class.
- Refer [OS Backup for Type II SKUs](os-backup-type-ii-skus.md) for Type II SKU class.