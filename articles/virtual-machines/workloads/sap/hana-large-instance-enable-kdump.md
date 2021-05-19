---
title: Script to enable Kdump in SAP HANA (Large Instances)| Microsoft Docs
description: Script to enable Kdump in SAP HANA (Large Instances) HLI Type I, HLI Type II
services: virtual-machines-linux
documentationcenter:
author: prtyag
manager: hrushib
editor:
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/30/2020
ms.author: prtyag
ms.custom: H1Hack27Feb2017

---

# Kdump for SAP HANA on Azure Large Instances (HLI)

Configuring and enabling kdump is a step that is needed to troubleshoot system crashes that do not have a clear cause.
There are times when a system will unexpectedly crash that cannot be explained by a hardware or infrastructure problem.
In these cases it can be an operating system or application problem and kdump will allow SUSE to determine why a system crashed.

## Enable Kdump service

This document describes the details on how to enable Kdump service on Azure HANA Large
Instance(**Type I and Type II**)

## Supported SKUs

|  Hana Large Instance type   |  OS vendor   |  OS package version   |  SKU |
|-----------------------------|--------------|-----------------------|-------------|
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S224m      |
|   Type I                    |  SuSE        |   SLES 12 SP4         |  S224m      |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S72        |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S72m       |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S72m       |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S96        |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S96        |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S192       |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S192       |
|   Type I                    |  SuSE        |   SLES 12 SP4         |  S192       |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S192m      |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S192m      |
|   Type I                    |  SuSE        |   SLES 12 SP4         |  S192m      |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S144       |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S144       |
|   Type I                    |  SuSE        |   SLES 12 SP2         |  S144m      |
|   Type I                    |  SuSE        |   SLES 12 SP3         |  S144m      |
|   Type II                   |  SuSE        |   SLES 12 SP2         |  S384       |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S384       |
|   Type II                   |  SuSE        |   SLES 12 SP4         |  S384       |
|   Type II                   |  SuSE        |   SLES 12 SP2         |  S384xm     |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S384xm     |
|   Type II                   |  SuSE        |   SLES 12 SP4         |  S384xm     |
|   Type II                   |  SuSE        |   SLES 12 SP2         |  S576m      |
|   Type II                   |  SuSE        |   SLES 12 SP3         |  S576m      |
|   Type II                   |  SuSE        |   SLES 12 SP4         |  S576m      |

## Prerequisites

- Kdump service uses `/var/crash` directory to write dumps, make sure the partition corresponds to this directory has sufficient space to accommodate dumps.

## Setup details

- Script to enable Kdump can be found [here](https://github.com/Azure/sap-hana-tools/blob/master/tools/enable-kdump.sh)
> [!NOTE]
> this script is made based on our lab setup and Customer is expected to contact OS vendor for any further tuning.
> Separate LUN is going to be provisioned for the new and existing servers for saving the dumps and script will take care of configuring the file system out of the LUN.
> Microsoft will not be responsible for analyzing the dump. Customer has to open a ticket with OS vendor to get it analyzed.

- Run this script on HANA Large Instance using the below command

    > [!NOTE]
    > sudo privilege needed to run this command.

    ```bash
    sudo bash enable-kdump.sh
    ```

- If the command outputs Kdump is successfully enabled, please make sure to reboot the system to apply the changes successfully.

- If the command output is Failed to do certain operation, Exiting!!!!, then Kdump service is not enabled. Refer to section [Support issue](#support-issue).

## Test Kdump

> [!NOTE]
>  Below operation will trigger a kernel crash and system reboot.

- Trigger a kernel crash

    ```bash
    echo c > /proc/sysrq-trigger
    ```

- After the system reboots successfully, check the `/var/crash` directory for kernel crash logs.

- If the `/var/crash` has directory with current date, then the Kdump is successfully enabled.

## Support issue

If the script fails with an error or Kdump isn't enabled, raise service request with Microsoft support team with following details.

* HLI subscription ID

* Server name

* OS vendor

* OS version

* Kernel version

## Related Documents
- To know more on [configuring the kdump](https://www.suse.com/support/kb/doc/?id=3374462)
