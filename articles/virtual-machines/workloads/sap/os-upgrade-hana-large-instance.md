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
ms.date: 06/28/2018
ms.author: saghorpa
ms.custom: H1Hack27Feb2017

---
# Operating System Upgrade
This document describes the details on operating system upgrades on the HANA Large Instances.

>[!NOTE]
>The OS upgrade is customers responsibility, Microsoft operations support can guide you to the key areas to watch out during the upgrade. You should consult your operating system vendor as well before you plan for an upgrade.

At the time of the HLI unit provisioning, the Microsoft operations team install the operating system. Over the time, you are required to maintain the operating system (Example: Patching, tuning, upgrading etc.) on the HLI unit.

Before you do major changes to the operating system (for example, Upgrade SP1 to SP2), you must contact Microsoft Operations team by opening a support ticket to consult.


For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).


## Known issues

The following are the few common known issues during the upgrade:
- On SKU Type II class SKU, the software foundation software (SFS) is removed after the OS upgrade. You must reinstall the compatible SFS after the OS upgrade.
- Ethernet card drivers (ENIC and FNIC) rolled back to older version. You must reinstall the compatible version of the drivers after the upgrade.

## Next steps
- Refer [Backup and restore](hana-overview-high-availability-disaster-recovery.md) for OS backup Type I SKU class.
- Refer [OS Backup for Type II SKUs](os-backup-type-ii-skus.md) for Type II SKU class.