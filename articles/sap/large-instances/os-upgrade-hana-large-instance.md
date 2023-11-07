---
title: Operating system upgrade for the SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Learn to do an operating system upgrade for SAP HANA on Azure (Large Instances).
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
ms.date: 06/24/2021
ms.author: ladolan
ms.custom: H1Hack27Feb2017

---
# Operating System Upgrade
This article describes the details of operating system (OS) upgrades on HANA Large Instances (HLI), otherwise known as BareMetal Infrastructure.

> [!NOTE]
> This article contains references to terms that Microsoft no longer uses. When the terms are removed from the software, we'll remove them from this article.

>[!NOTE]
>Upgrading the OS is your responsibility. Microsoft operations support can guide you in key areas of the upgrade, but consult your operating system vendor as well when planning an upgrade.

During HLI provisioning, the Microsoft operations team installs the operating system.
You're required to maintain the operating system. For example, you need to do the patching, tuning, upgrading, and so on, on the HLI. Before you make major changes to the operating system, for example, upgrade SP1 to SP2, contact the Microsoft Operations team by opening a support ticket. They will consult with you. We recommend opening this ticket at least one week before the upgrade. 

Include in your ticket:

* Your HLI subscription ID.
* Your server name.
* The patch level you're planning to apply.
* The date you're planning this change. 

For the support matrix of the different SAP HANA versions with the different Linux versions, see [SAP Note #2235581](https://launchpad.support.sap.com/#/notes/2235581).

## Known issues

There are a couple of known issues with the upgrade:
- On SKU Type II class SKU, the software foundation software (SFS) is removed during the OS upgrade. You'll need to reinstall the compatible SFS after the OS upgrade is complete.
- Ethernet card drivers (ENIC and FNIC) are rolled back to an older version. You'll need to reinstall the compatible version of the drivers after the upgrade.

## SAP HANA Large Instance (Type I) recommended configuration

The OS configuration can drift from the recommended settings over time. This drift can occur because of patching, system upgrades, and other changes you may make. Microsoft identifies updates needed to ensure HANA Large Instances are optimally configured for the best performance and resiliency. The following instructions outline recommendations that address network performance, system stability, and optimal HANA performance.

### Compatible eNIC/fNIC driver versions
  To have proper network performance and system stability, ensure the appropriate OS-specific version of eNIC and fNIC drivers are installed per the following compatibility table (This table has the latest compatible driver version). Servers are delivered to customers with compatible versions. However, drivers can get rolled back to default versions during OS/kernel patching. Ensure the appropriate driver version is running post OS/kernel patching operations.
       
      
  |  OS Vendor    |  OS Package Version     |  Firmware Version  |  eNIC Driver	|  fNIC Driver |
  |---------------|-------------------------|--------------------|--------------|--------------|
  |   SuSE        |  SLES 12 SP2            |   3.2.3i           |  2.3.0.45    |   1.6.0.37   |
  |   SuSE        |  SLES 12 SP3            |   3.2.3i           |  2.3.0.43    |   1.6.0.36   |
  |   SuSE        |  SLES 12 SP4            |   3.2.3i           |  4.0.0.14    |   2.0.0.63   |
  |   SuSE        |  SLES 12 SP5            |   3.2.3i           |  4.0.0.14    |   2.0.0.63   |
  |   Red Hat     |  RHEL 7.6               |   3.2.3i           |  3.1.137.5   |   2.0.0.50   |
  |   SuSE        |  SLES 12 SP4            |   4.1.1b           |  4.0.0.6     |   2.0.0.60   |
  |   SuSE        |  SLES 12 SP5            |   4.1.1b           |  4.0.0.6     |   2.0.0.59   |
  |   SuSE        |  SLES 15 SP1            |   4.1.1b           |  4.0.0.8     |   2.0.0.60   |
  |   SuSE        |  SLES 15 SP2            |   4.1.1b           |  4.0.0.8     |   2.0.0.60   |
  |   Red Hat     |  RHEL 7.6               |   4.1.1b           |  4.0.0.8     |   2.0.0.60   |
  |   Red Hat     |  RHEL 8.2               |   4.1.1b           |  4.0.0.8     |   2.0.0.60   |
  |   SuSE        |  SLES 12 SP4	          |   4.1.3d           |  4.0.0.13    |   2.0.0.69   |
  |   SuSE        |  SLES 12 SP5	          |   4.1.3d           |  4.0.0.13    |   2.0.0.69   |
  |   SuSE        |  SLES 15 SP1	          |   4.1.3d           |  4.0.0.13    |   2.0.0.69   |
  |   Red Hat     |  RHEL 8.2               |   4.1.3d           |  4.0.0.13    |   2.0.0.69   |
  
 

### Commands for driver upgrade and to clean old rpm packages

#### Command to check existing installed drivers
```
rpm -qa | grep enic/fnic 
```
#### Delete existing eNIC/fNIC rpm
```
rpm -e <old-rpm-package>
```
#### Install recommended eNIC/fNIC driver packages
```
rpm -ivh <enic/fnic.rpm> 
```

#### Commands to confirm installation
```
modinfo enic
modinfo fnic
```

#### Steps for eNIC/fNIC drivers installation during OS upgrade

* Upgrade OS version
* Remove old rpm packages
* Install compatible eNIC/fNIC drivers as per installed OS version
* Reboot system
* After reboot, check the eNIC/fNIC version


### SuSE HLIs GRUB update failure
SAP on Azure HANA Large Instances (Type I) can be in a non-bootable state after upgrade. The following procedure fixes this issue.

#### Execution Steps

-	Execute the `multipath -ll` command.
-	Get the logical unit number (LUN) ID or use the command: `fdisk -l | grep mapper`
-	Update the `/etc/default/grub_installdevice` file with line `/dev/mapper/<LUN ID>`. Example: /dev/mapper/3600a09803830372f483f495242534a56

>[!NOTE]
>The LUN ID varies from server to server.


### Disable Error Detection And Correction 
   Error Detection And Correction (EDAC) modules help detect and correct memory errors. However, the underlying HLI Type I hardware already detects and corrects memory errors. Enabling the same feature at the hardware and OS levels can cause conflicts and lead to unplanned shutdowns of the server. We recommend disabling the EDAC modules from the OS.

#### Execution Steps

- Check whether the EDAC modules are enabled. If an output is returned from the following command, the modules are enabled.

```
lsmod | grep -i edac 
```
- Disable the modules by appending the following lines to the file `/etc/modprobe.d/blacklist.conf`
```
blacklist sb_edac
blacklist edac_core
```
A reboot is required for the changes to take place. After reboot, execute the `lsmod` command again and verify the modules aren't enabled.

### Kernel parameters
Make sure the correct settings for `transparent_hugepage`, `numa_balancing`, `processor.max_cstate`, `ignore_ce`, and `intel_idle.max_cstate` are applied.

* intel_idle.max_cstate=1
* processor.max_cstate=1
* transparent_hugepage=never
* numa_balancing=disable
* mce=ignore_ce

#### Execution Steps

- Add these parameters to the `GRB_CMDLINE_LINUX` line in the file `/etc/default/grub`:

```
intel_idle.max_cstate=1 processor.max_cstate=1 transparent_hugepage=never numa_balancing=disable mce=ignore_ce
```
- Create a new grub file.
```
grub2-mkconfig -o /boot/grub2/grub.cfg
```
- Reboot your system.

## Next steps

Learn to set up an SMT server for SUSE Linux.

> [!div class="nextstepaction"]
> [Set up SMT server for SUSE Linux](hana-setup-smt.md)
