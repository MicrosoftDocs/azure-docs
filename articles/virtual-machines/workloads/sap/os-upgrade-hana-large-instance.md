---
title: Operating system upgrade for the SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Perform Operating system upgrade for SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: juergent
editor:

ms.service: virtual-machines-linux

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
>The OS upgrade is customer's responsibility, Microsoft operations support can guide you to the key areas to watch out during the upgrade. You should consult your operating system vendor as well before you plan for an upgrade.

During HLI unit provisioning, the Microsoft operations team installs the operating system.
Over the time, you are required to maintain the operating system (Example: Patching, tuning, upgrading etc.) on the HLI unit.

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

## SAP HANA Large Instance (Type I) recommended configuration

Operating system configuration can drift from the recommended settings over time due to patching, system upgrades, and changes made by customers. Additionally, Microsoft identifies updates needed for existing systems to ensure they are optimally configured for the best performance and resiliency. Following instructions outline recommendations that address network performance, system stability, and optimal HANA performance.

### Compatible eNIC/fNIC driver versions
  In order to have proper network performance and system stability, it is advised to ensure that the OS-specific appropriate version of eNIC and fNIC drivers are installed as depicted in following compatibility table. Servers are delivered to customers with compatible versions. Note that, in some cases, during OS/Kernel patching, drivers can get rolled back to the default driver versions. Ensure that appropriate driver version is running post OS/Kernel patching operations.
       
      
  |  OS Vendor    |  OS Package Version     |  Firmware Version  |  eNIC Driver	|  fNIC Driver | 
  |---------------|-------------------------|--------------------|--------------|--------------|
  |   SuSE        |  SLES 12 SP2            |   3.1.3h           |  2.3.0.40    |   1.6.0.34   |
  |   SuSE        |  SLES 12 SP3            |   3.1.3h           |  2.3.0.44    |   1.6.0.36   |
  |   SuSE        |  SLES 12 SP4            |   3.2.3i           |  2.3.0.47    |   2.0.0.54   |
  |   SuSE        |  SLES 12 SP2            |   3.2.3i           |  2.3.0.45    |   1.6.0.37   |
  |   SuSE        |  SLES 12 SP3            |   3.2.3i           |  2.3.0.45    |   1.6.0.37   |
  |   Red Hat     |  RHEL 7.2               |   3.1.3h           |  2.3.0.39    |   1.6.0.34   |
 

### Commands for driver upgrade and to clean old rpm packages

#### Command to check existing installed drivers
```
rpm -qa | grep enic/fnic 
```
#### Delete existing eNIC/fNIC rpm
```
rpm -e <old-rpm-package>
```
#### Install the recommended eNIC/fNIC driver packages
```
rpm -ivh <enic/fnic.rpm> 
```

#### Commands to confirm the installation
```
modinfo enic
modinfo fnic
```

### SuSE HLIs GRUB update failure
SAP on Azure HANA Large Instances (Type I) can be in a non-bootable state after upgrade. The below procedure fixes this issue.
#### Execution Steps


*	Execute `multipath -ll` command.
*	Get the LUN ID whose size is approximately 50G or use the command: `fdisk -l | grep mapper`
*	Update `/etc/default/grub_installdevice` file with line `/dev/mapper/<LUN ID>`. Example: /dev/mapper/3600a09803830372f483f495242534a56
>[!NOTE]
>LUN ID varies from server to server.


### Disable EDAC 
   The Error Detection And Correction (EDAC) module helps in detecting and correcting memory errors. However, the underlying hardware for SAP HANA on Azure Large Instances (Type I) is already performing the same function. Having the same feature enabled at the hardware and operating system (OS) levels can cause conflicts and can lead to occasional, unplanned shutdowns of the server. Therefore, it is recommended to disable the module from the OS.

#### Execution Steps

* Check if EDAC module is enabled. If an output is returned in below command, that means the module is enabled. 
```
lsmod | grep -i edac 
```
* Disable the modules by appending the following lines to the file `/etc/modprobe.d/blacklist.conf`
```
blacklist sb_edac
blacklist edac_core
```
A reboot is required to take changes in place. Execute `lsmod` command and verify the module is not present there in output.


### Kernel parameters
   Make sure the correct setting for `transparent_hugepage`, `numa_balancing`, `processor.max_cstate`, `ignore_ce` and `intel_idle.max_cstate` are applied.

* intel_idle.max_cstate=1
* processor.max_cstate=1
* transparent_hugepage=never
* numa_balancing=disable
* mce=ignore_ce


#### Execution Steps

* Add these parameters to the `GRB_CMDLINE_LINUX` line in the file `/etc/default/grub`
```
intel_idle.max_cstate=1 processor.max_cstate=1 transparent_hugepage=never numa_balancing=disable mce=ignore_ce
```
* Create a new grub file.
```
grub2-mkconfig -o /boot/grub2/grub.cfg
```
* Reboot system.


## Next steps
- Refer [Backup and restore](hana-overview-high-availability-disaster-recovery.md) for OS backup Type I SKU class.
- Refer [OS Backup for Type II SKUs of Revision 3 stamps](os-backup-type-ii-skus.md) for Type II SKU class.
