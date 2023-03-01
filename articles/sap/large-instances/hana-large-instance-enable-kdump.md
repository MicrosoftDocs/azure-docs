---
title: Script to enable kdump in SAP HANA (Large Instances)| Microsoft Docs
description: Learn how to enable the kdump service on Azure HANA Large Instances Type I and Type II.
services: virtual-machines-linux
documentationcenter:
author: lauradolan
manager: juergent
editor:
ms.service: sap-on-azure
ms.subservice: sap-large-instances
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/22/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---

# kdump for SAP HANA on Azure Large Instances

In this article, we'll walk through enabling the kdump service on Azure HANA Large
Instances (HLI) **Type I and Type II**.

Configuring and enabling kdump is needed to troubleshoot system crashes that don't have a clear cause. Sometimes a system crash cannot be explained by a hardware or infrastructure problem. In such cases, an operating system or application may have caused the problem. kdump will allow SUSE to determine the reason for the system crash.

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

- The kdump service uses the `/var/crash` directory to write dumps. Make sure the partition corresponding to this directory has sufficient space to accommodate dumps.

## Setup details

- The script to enable kdump can be found in the [Azure sap-hana-tools on GitHub](https://github.com/Azure/sap-hana-tools/blob/master/tools/enable-kdump.sh)

> [!NOTE]
> This script is made based on our lab setup. You will need to contact your OS vendor for any further tuning.
> A separate logical unit number (LUN) will be provisioned for new and existing servers for saving the dumps. A script will take care of configuring the file system out of the LUN.
> Microsoft won't be responsible for analyzing the dump. You will need to open a ticket with your OS vendor to have it analyzed.

- Run this script on your HANA Large Instance by using the following command:

    > [!NOTE]
    > Sudo privileges are needed to run this command.

    ```bash
    sudo bash enable-kdump.sh
    ```

- If the command's output shows kdump is successfully enabled, reboot the system to apply the changes.

- If the command's output shows an operation failed, then the kdump service isn't enabled. Refer to a following section, [Support issues](#support-issues).

## Test kdump

> [!NOTE]
>  The following operation will trigger a kernel crash and system reboot.

- Trigger a kernel crash

    ```bash
    echo c > /proc/sysrq-trigger
    ```

- After the system reboots successfully, check the `/var/crash` directory for kernel crash logs.

- If the `/var/crash` has a directory with the current date, kdump is successfully enabled.

## Support issues

If the script fails with an error, or kdump isn't enabled, raise a service request with the Microsoft support team. Include the following details:

* HLI subscription ID

* Server name

* OS vendor

* OS version

* Kernel version

For more information, see [configuring the kdump](https://www.suse.com/support/kb/doc/?id=3374462).

## Next steps

Learn about operating system upgrades on HANA Large Instances.

> [!div class="nextstepaction"]
> [Operating system upgrades](os-upgrade-hana-large-instance.md)
