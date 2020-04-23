---
title: Script to enable Kdump in SAP HANA (Large Instances)| Microsoft Docs
description: Script to enable Kdump in SAP HANA (Large Instances) HLI Type I, HLI Type II
services: virtual-machines-linux
documentationcenter:
author: prtyag
manager: hrushib
editor:

ms.service: virtual-machines-linux

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/30/2020
ms.author: prtyag
ms.custom: H1Hack27Feb2017

---

# Enable Kdump service
This document describes the details on how to enable Kdump service on Azure HANA Large
Instance(**Type I and Type II**)

## Supported SKUs
|  Hana Large Instance Type   |  OS Vendor   |  OS Package Version   |  SKU	       |
|-----------------------------|--------------|-----------------------|-------------|
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S224m      |
|   Type I                    |  SuSE        |   SLES 12 SP4         |  S224m      |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S72m       |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S72m       |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S96        |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S96        |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S384       |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S576m      |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S384xm     |
|   Type II                   |  SuSE        |   SLES 12 SP4         |  S384xm     |

## Pre-requisites
- Kdump service uses `/var/crash` directory to write dumps, make sure the partition corresponds to this directory has sufficient space to accommodate dumps.
## Setup details
- Script to enable Kdump can be found [here](https://github.com/Azure/sap-hana/blob/master/tools/enable-kdump.sh)
- Run this script on HANA Large Instance using the below command
```
sudo bash enable-kdump.sh
```
- If the command output is "Kdump is successfully enabled, please reboot the system to apply the change", then the Kdump is succesfully enabled. Reboot the system to apply changes.
- If the command output is "Failed to do certain operation, Exiting !!!!", then Kdump service is not enabled. Refer to section [Support issue](#support-issue).

## Test Kdump
**Note**: Below operation will trigger a kernel crash and system reboot.
- Trigger a kernel crash
```
echo 1 > /proc/sys/kernel/sysrq
echo c > /proc/sysrq-trigger
```
- After the system reboots successfully, check the `/var/crash` directory for kernel crash logs.
- If the `/var/crash` has directory with current date, then the Kdump is successfully enabled.

## Support issue
If the script fails with an error or Kdump isn't enabled, raise service request with Microsoft support team with following details.

* HLI subscription ID.
* Server name
* OS vendor
* OS version
* Kernel version