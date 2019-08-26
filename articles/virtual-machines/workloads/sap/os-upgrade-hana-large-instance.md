---
title: Operating system upgrade for the SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Perform Operating system upgrade for SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: gwallace
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/04/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---
# Operating System Upgrade
This document describes the details on operating system upgrades on the HANA Large Instances.

>[!NOTE]
>The OS upgrade is customers responsibility, Microsoft operations support can guide you to the key areas to watch out during the upgrade. You should consult your operating system vendor as well before you plan for an upgrade.

At the time, of the HLI unit provisioning, the Microsoft operations team install the operating system. Over the time, you are required to maintain the operating system (Example: Patching, tuning, upgrading etc.) on the HLI unit.

Before you do major changes to the operating system (for example, Upgrade SP1 to SP2), you need to contact Microsoft Operations team by opening a support ticket to consult.

Include in your ticket:

* Your HLI subscription ID.
* Your server name.
* The patch level you are planning to apply.
* The date you are planning this change. 

We would recommend you open this ticket at least one week before the desirable upgrade date due to having Operations team checking if a firmware upgrade will be necessary on your server blade.


For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).


## Known issues

The following are the few common known issues during the upgrade:
- On SKU Type II class SKU, the software foundation software (SFS) is removed after the OS upgrade. You need to reinstall the compatible SFS after the OS upgrade.
- Ethernet card drivers (ENIC and FNIC) rolled back to older version. You need to reinstall the compatible version of the drivers after the upgrade.

## Next steps
- Refer [Backup and restore](hana-overview-high-availability-disaster-recovery.md) for OS backup Type I SKU class.
- Refer [OS Backup for Type II SKUs of Revision 3 stamps](os-backup-type-ii-skus.md) for Type II SKU class.
