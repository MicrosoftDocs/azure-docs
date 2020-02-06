---
title: Operating system upgrade for the SAP HANA on Azure (Large Instances)| Microsoft Docs
description: Perform Operating system upgrade for SAP HANA on Azure (Large Instances)
services: virtual-machines-linux
documentationcenter:
author: saghorpa
manager: gwallace
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

## SAP HANA on Azure Large Instance (Type I) Recommended SLES Configuration

Customer operating system configuration can drift from the recommended settings over time due to patching, system upgrades, and changes made by customers.  Additionally, Microsoft identifies updates needed for existing systems to ensure they are optimally configured for the best performance and resiliency. Below given description and instructions outline recommendations that address network performance, system stability, and optimal HANA performance.

### Compatible enic/fnic driver versions
  In order to have proper network performance and system stability, it is advised that customers maintain versions of the enic and        fnic drives below. Servers are usually delivered to customers with these versions, however, in some cases versions can get rolled        back to the default enic and fnic  versions when OS/Kernel patching is performed.
       
      
  |  OS Vendor    |  OS Package Version     |  eNIC Driver	|  fNIC Driver |
  |---------------|-------------------------|---------------|--------------|
  |   SUSE        |  SLES 12 SP2            |   2.3.0.40    |   1.6.0.34   |
  |   SUSE        |  SLES 12 SP3            |   2.3.0.44    |   1.6.0.36   |
  |   RHEL        |  RHEL 7.2               |   2.3.0.39    |   1.6.0.34   |
 

### Commands for driver upgrade and to clean old rpm packages
```
* rpm -U driverpackage.rpm
* rpm -e olddriverpackage.rpm
```

* Commands to confirm:
```
* modinfo enic
* modinfo fnic
```

#### SUSE HLIs GRUB UPDATE FAILURE
SAP on Azure HANA Large Instances (Type I) can be in a non-bootable state when updated. The below procedure fixes this.
##### Steps to perform 
```
* Take backup of file /etc/default/grub_installdevice
* Run below entire script
#!/bin/sh
file="/etc/multipath/wwids"
if [ ! -f "$file" ]
  then
  echo "$0: File '${file}' Multipath Not Configured. Configure Multipath and Rerun the Script"
  exit 0
fi
device_mapper="/dev/mapper/"
device_id=`ls -l /dev/disk/by-id/ | grep -i dm-0 | grep -i mpath | awk '{print $9}' | cut -d "-" -f 4`
device_mapper+=$device_id
sed -i '/\/disk\/by-uuid/c '"$device_mapper"'' /etc/default/grub_installdevice
```

#### Disable EDAC:
   The Error Detection And Correction (EDAC) module helps in detecting and correcting memory errors. However, the underlying hardware for SAP HNA on Azure Large Instances (Type I) is already preforming the same function. Having the same feature enabled at the hardware and Operating system (OS) levels can cause conflicts and can lead to occasional, unplanned shutdowns of the server. Therefore, it is recommended to disable the module from the OS.

##### Steps to perform
```
* Check if EDAC module is enabled. If an output is returned in below command, that means the module is enabled. 
    lsmod | grep -i edac 
* Add the modules in /etc/modprobe.d/blacklist.conf file using vi editor.
    #vim /etc/modprobe.d/blacklist.conf
* blacklist sb_edac
* blacklist edac_core

A reboot is required to have this reflected. Module should not be listed in ‘lsmod’ command output after blacklisting.
```

#### Kernel parameters
   Please make sure the correct setting for transparent_hugepage, numa_balancing, processor.max_cstate and intel_idle.max_cstate are applied.
```         
* intel_idle.max_cstate =1
* processor.max_cstate=1
* transparent_hugepage=never
* numa_balancing=disable
```
Incorrect settings have created both performance and instability issues in the past. Please follow SAP’s recommendation in your next maintenance window at the latest. Please check all your SAP HANA instances on SLES and ensure the correct setting is applied.

##### Steps to perform
```
* Add these parameters to the GRB_CMDLINE_LINUX line in the file /etc/default/grub 
      intel_idle.max_cstate=1 processor.max_cstate=1 transparent_hugepage=never numa_balancing=disable
* Create a new grub file.
      #grub2-mkconfig -o /boot/grub2/grub.cfg
* Reboot system.
```

## Next steps
- Refer [Backup and restore](hana-overview-high-availability-disaster-recovery.md) for OS backup Type I SKU class.
- Refer [OS Backup for Type II SKUs of Revision 3 stamps](os-backup-type-ii-skus.md) for Type II SKU class.
