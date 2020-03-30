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
ms.date: 30/03/2020
ms.author: prtyag
ms.custom: H1Hack27Feb2017

---

# Enable kdump service
This document describes the details on how to enable Kdump service on HANA Large Instances

## Pre-requisites
- Kdump stores kernel core dumps under /var, so the partition /var is on must have enough available disk space for the vmcore files.
- Install the package kexec-tools.

## Setup details
- Script to enable Kdump can be found [here](https://github.com/Azure/sap-hana/blob/master/tools/enable-kdump.sh)
- Run this script on SAP HANA (Large Instances) using the below command
```
bash enable-kdump.sh
```
- Reboot the system to apply changes.

### Support issue
If the script fails with the following error
```
This script does not support current OS, VERSION. Please raise request to support this OS and Version
```
Raise a ticket with Microsoft Operations team by opening a support ticket.

Include in your ticket:

* Your HLI subscription ID.
* Your server name.
* OS name
* OS version

## Test Kdump
- Trigger a kernel crash
```
echo 1 > /proc/sys/kernel/sysrq
echo c > /proc/sysrq-trigger
```
- After the system reboots successfully, check the `/var/crash directory` for kernel crash logs.
- If the `/var/crash` has directory with current date, then the Kdump is successfully enabled.
- If not then raise a complain using the method describe above. 