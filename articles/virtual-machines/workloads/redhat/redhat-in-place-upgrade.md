---
title: In-place upgrade of Red Hat Enterprise Linux images on Azure
description: Learn how to do an in-place upgrade from Red Hat Enterprise 7.x images to the latest 8.x version.
author: mathapli
ms.service: virtual-machines
ms.subservice: redhat
ms.collection: linux
ms.topic: article
ms.date: 04/16/2020
ms.author: alsin

---

# Red Hat Enterprise Linux in-place upgrades

This article provides instructions about how to do an in-place upgrade from Red Hat Enterprise Linux (RHEL) 7 to Red Hat Enterprise Linux 8. The instructions use the `leapp` tool in Azure. During the in-place upgrade, the existing RHEL 7 operating system is replaced by the RHEL 8 version.

>[!Note] 
> Offerings of SQL Server on Red Hat Enterprise Linux don't support in-place upgrades on Azure.

## What to expect during the upgrade
During the upgrade, the system restarts a few times. The final restart upgrades the VM to the RHEL 8 latest minor release. 

The upgrade process can take anywhere from 20 minutes to 2 hours. The total time depends on several factors, such as the VM size and the number of packages installed on the system.

## Preparations
Red Hat and Azure recommend using an in-place upgrade to transition a system to the next major version. 

Before you start the upgrade, keep in mind the following considerations. 

>[!Important] 
> Take a snapshot of the image before you start the upgrade.

* Make sure you're using the latest RHEL 7 version. Currently, the latest version is RHEL 7.9. If you use a locked version and can't upgrade to RHEL 7.9, then follow [these steps to switch to a non-EUS (extended update support) repository](./redhat-rhui.md#switch-a-rhel-7x-vm-back-to-non-eus-remove-a-version-lock).

* Run the following command to check on your upgrade and see whether it will finish successfully. The command should generate */var/log/leapp/leapp-report.txt* file. This file explains the process, what's happening, and whether the upgrade is possible.

    >[!NOTE]
    > Use the root account to run the commands in this article. 

    ```bash
    leapp preupgrade --no-rhsm
    ```
* Ensure the serial console is functional. You'll use this console for monitoring during the upgrade process.

* Enable SSH root access in */etc/ssh/sshd_config*:
    1. Open the file */etc/ssh/sshd_config*.
    1. Search for `#PermitRootLogin yes`.
    1. Remove the number sign (`#`) to uncomment the string.

## Upgrade steps

Follow these steps carefully. We recommend trying the upgrade on a test machine before you try it on production instances.

1. Do a `yum` update to fetch the latest client packages.
    ```bash
    yum update -y
    ```

1. Install the `leapp-client-package`.
    ```bash
    yum install leapp-rhui-azure
    ```
    
1. In the [Red Hat portal](https://access.redhat.com/articles/3664871), obtain the *leapp-data.tar.gz* file that contains *repomap.csv* and *pes-events.json*. Extract the *leapp-data.tar.gz* file.
    1. Download the *leapp-data.tar.gz* file.
    1. Extract the contents and remove the file. Use the following command:
    ```bash
    tar -xzf leapp-data12.tar.gz -C /etc/leapp/files && rm leapp-data12.tar.gz
    ```

1. Add an `answers` file for `leapp`.
    ```bash
    leapp answer --section remove_pam_pkcs11_module_check.confirm=True --add
    ``` 

1. Start the upgrade.
    ```bash
    leapp upgrade --no-rhsm
    ```
1.  After the `leapp upgrade` command finishes successfully, manually restart the system to complete the process. The system is unavailable as it restarts a couple of times. Monitor the process by using the serial console.

1.  Verify the upgrade finished successfully.
    ```bash
    uname -a && cat /etc/redhat-release
    ```

1. When the upgrade finishes, remove root SSH access:
    1. Open the file */etc/ssh/sshd_config*.
    1. Search for `#PermitRootLogin yes`.
    1. Add a number sign (`#`) to comment the string.

1. Restart the SSHD service to apply the changes.
    ```bash
    systemctl restart sshd
    ```
## Common problems

The following errors commonly happen when either the `leapp preupgrade` process fails or the `leapp upgrade` process fails:

* **Error**: No matches found for the following disabled plugin patterns.

    ```plaintext
    STDERR:
    No matches found for the following disabled plugin patterns: subscription-manager
    Warning: Packages marked by Leapp for upgrade not found in repositories metadata: gpg-pubkey
    ```

    **Solution**: Disable the subscription-manager plug-in. Disable it by editing the file */etc/yum/pluginconf.d/subscription-manager.conf* and changing `enabled` to `enabled=0`.

    This error happens when the subscription-manager `yum` plug-in that's enabled isn't used for `PAYG` VMs.

* **Error**: Possible problems with remote login using root.

    You might see this error when the `leapp preupgrade` fails:

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
    **Solution**: Enable root access in */etc/sshd_config*.

    This error happens when root SSH access isn't enabled in */etc/sshd_config*. For more information, see the [Preparations](#preparations) section in this article. 


## Next steps
* Learn more about [Red Hat images in Azure](./redhat-images.md).
* Learn more about [Red Hat update infrastructure](./redhat-rhui.md).
* Learn more about the [RHEL BYOS offer](./byos.md).
* To learn more about the Red Hat in-place upgrade processes, see [Upgrading from RHEL 7 TO RHEL 8](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/upgrading_from_rhel_7_to_rhel_8/index) in the Red Hat documentation.
* To learn more about Red Hat support policies for all versions of RHEL, see [Red Hat Enterprise Linux life cycle](https://access.redhat.com/support/policy/updates/errata) in the Red Hat documentation.