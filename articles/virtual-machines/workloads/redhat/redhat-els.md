---
title: Red Hat Enterprise Linux Extended Life Phase 
description: Learn about Red Hat Enterprise Linux images in Microsoft Azure
author: mathapli
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 04/16/2020
ms.author: mathapli
ms.reviewer: cynthn

---

# Red Hat Enterprise Linux (RHEL) Extended Life Phase

## Red Hat Enterprise Linux 6 life cycle
Starting on 30th November 2020, Red Hat Enterprise Linux 6 will reach end of maintenance phase. The maintenance phase is followed by the Extended Life Phase. As Red Hat Enterprise Linux 6 transitions out of the Full/Maintenance Phases, it is strongly recommend to upgrade to Red Hat Enterprise Linux 7 or 8. If customers must stay on Red Hat Enterprise Linux 6, it is recommended to add the Red Hat Enterprise Linux Extended Life Cycle Support (ELS) Add-On to your current Red Hat Enterprise Linux subscription.

### Frequently Asked Questions

#### I am running Red Hat Enterprise Linux 6 and can’t migrate to a later version at this time. What options do I have?
* Continue to run Red Hat Enterprise Linux 6 and purchase the Extended Life Cycle Support (ELS) Add-On repositories to continue to receive limited software maintenance and technical support (See process to upgrade and pricing details below).
* Migrate to Red Hat Enterprise Linux 7 or 8 as soon as you can.

#### What is the upcharge for using Red Hat Enterprise Linux Extended Life Cycle Support (ELS) Add-On?

|VM size|Upcharge timeframe|Upcharge dollar amount (USD)| Notes|
|---|---|---|---|
| Small virtual guest (<=4 cores) | Hourly upcharge | $0.02 | |
|  | Monthly upcharge | $13 | For Reserved instances |
|  | Annual upcharge | $148 | For Reserved instances |
| Large virtual guest (>4 cores) | Hourly upcharge | $0.05 | |
|  | Monthly upcharge | $30 | For Reserved instances |
|  | Annual upcharge | $326 | For Reserved instances |

#### What is the process to add Extended Life Cycle Support (ELS) repositories to continue to receive software maintenance (bug and security fixes) and  support for Red Hat Enterprise Linux 6?

The end to end process of signing up for the ELS will be available soon here (latest by 15th November, 2020).

## Next steps

* To view the full list of RHEL images in Azure, see [Red Hat Enterprise Linux (RHEL) images available in Azure](./redhat-imagelist.md).
* To learn more about the Azure Red Hat Update Infrastructure, see [Red Hat Update Infrastructure for on-demand RHEL VMs in Azure](./redhat-rhui.md).
* To learn more about the RHEL BYOS offer, see [Red Hat Enterprise Linux bring-your-own-subscription Gold Images in Azure](./byos.md).
* For information on Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata).