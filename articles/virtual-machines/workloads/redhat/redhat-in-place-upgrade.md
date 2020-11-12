---
title: In-place upgrade of Red Hat Enterprise Linux images on Azure
description: Find steps to perform in-place upgrade from Red Hat Enterprise 7.x images to latest 8.x version
author: mathapli
ms.service: virtual-machines-linux
ms.topic: article
ms.date: 04/16/2020
ms.author: alsin
ms.reviewer: cynthn

---

# Red Hat Enterprise Linux in-place upgrades

This article provides step-by-step instructions on how to perform an in-place upgrade from Red Hat Enterprise Linux 7 to Red Hat Enterprise Linux 8 using the 'Leapp' utility on Azure. During the in-place upgrade, the existing RHEL 7 operating system is replaced by RHEL 8 version.

>[!Note] 
> SQL Server on Red Hat Enterprise Linux offers do not support in-place upgrade on Azure.

## What to expect during the upgrade
The system will reboot a few times during the upgrade and that is normal. The last reboot will upgrade the VM into RHEL 8 latest minor release. 

The upgrade process could take anywhere from 20 minutes to a couple of hours, this depends on several factors such as VM size and the number of packages installed on the system.

## Preparations for the upgrade
In-place upgrade is the officially recommended way by Red Hat and Azure to allow customers to upgrade system to the next major version. 
Before performing the upgrade here are some things, you should be aware of and take into consideration. 

>[!Important] 
> Please take a Snapshot of the image before performing the upgrade.

>[!NOTE]
> The commands in this article need to be run using the root account

* Make sure you are using the latest RHEL 7 version, which currently is RHEL 7.9. If you are using a locked version and cannot upgrade to RHEL 7.9, you can use the [steps here to switch to a non EUS repository](https://docs.microsoft.com/azure/virtual-machines/workloads/redhat/redhat-rhui#switch-a-rhel-7x-vm-back-to-non-eus-remove-a-version-lock).

* Run the command below to know how your upgrade is going and if it will complete. The command should generate a file under '/var/log/leapp/leapp-report.txt' that explains the process and what is being done and if the upgrade is possible or not
    ```bash
    leapp preupgrade --no-rhsm
    ```
* Ensure serial console is functional as this allows monitoring during the upgrade process.

* Enable SSH root access in `/etc/ssh/sshd_config`
    1. Open the file `/etc/ssh/sshd_config`
    1. Search for '#PermitRootLogin yes'
    1. Remove the '#' to uncomment

## Steps for performing the upgrade

Perform these steps carefully. It is definitely recommended to try the upgrade on a test machine before production instances.

1. Perform a yum update to fetch the latest client packages.
    ```bash
    yum update -y
    ```

1. Install the leapp-client-package.
    ```bash
    yum install leapp-rhui-azure
    ```
    
1. Use leapp-data.tar.gz file with repomap.csv and pes-events.json, present in [RedHat portal](https://access.redhat.com/articles/3664871), and extract them. 
    1. Download the file.
    1. Extract the contents and remove the file using the following command:
    ```bash
    tar -xzf leapp-data12.tar.gz -C /etc/leapp/files && rm leapp-data12.tar.gz
    ```

1. Add 'answers' file for 'Leapp'.
    ```bash
    leapp answer --section remove_pam_pkcs11_module_check.confirm=True --add
    ``` 

1. Perform 'Leapp' upgrade.
    ```bash
    leapp upgrade --no-rhsm
    ```
1.  After the `leapp upgrade` command completes successfully, manually reboot the system to complete the process. The system will reboot a couple of times during which it will be unavailable. Monitor the process using the serial console.

1.  Verify the upgrade completed successfully.
    ```bash
    uname -a && cat /etc/redhat-release
    ```

1. Remove root ssh access after the upgrade completes.
    1. Open the file `/etc/ssh/sshd_config`
    1. Search for '#PermitRootLogin yes'
    1. Add the '#' to comment

1. Restart sshd service for the changes to take effect
    ```bash
    systemctl restart sshd
    ```

## Common Issues
These are some of the common instances that either the `leapp preupgrade` or `leapp upgrade` process could fail.

**Error: No matches found for the following disabled plugin patterns**
```plaintext
STDERR:
No matches found for the following disabled plugin patterns: subscription-manager
Warning: Packages marked by Leapp for upgrade not found in repositories metadata: gpg-pubkey
```
**Solution**\
Disable subscription-manager plugin by editing the file `/etc/yum/pluginconf.d/subscription-manager.conf` and changing enabled to `enabled=0`.

This is caused by the subscription-manager yum plugin being enabled, which is not used for PAYG VMs.

**Error: Possible problems with remote login using root**
The `leapp preupgrade` could fail with the following error:
```structured-text
============================================================
                     UPGRADE INHIBITED
============================================================

Upgrade has been inhibited due to the following problems:
    1. Inhibitor: Possible problems with remote login using root account
Consult the pre-upgrade report for details and possible remediation.

============================================================
                     UPGRADE INHIBITED
============================================================
```
**Solution**\
Enable root access in `/etc/sshd_conf`.
This is caused by not enabling root ssh access in `/etc/sshd_conf` as per the “[Preparations for the upgrade](#preparations-for-the-upgrade)” section. 

## Next steps
* Learn more about the [Red Hat images in Azure](./redhat-images.md).
* Learn more about the [Red Hat Update Infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* Information on the Red Hat in-place upgrade processes can be found on the Red Hat documentation, [Upgrading from RHEL 7 TO RHEL 8](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/upgrading_from_rhel_7_to_rhel_8/index)
* Information on Red Hat support policies for all versions of RHEL can be found on the [Red Hat Enterprise Linux Life Cycle](https://access.redhat.com/support/policy/updates/errata) page.