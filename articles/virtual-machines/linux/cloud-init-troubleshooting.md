---
title: Troubleshoot using cloud-init
description: Troubleshoot provisioning an Azure VM using cloud-init.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: troubleshooting
ms.date: 03/29/2023
ms.author: mattmcinnes
ms.reviewer: cynthn
ms.subservice: cloud-init
ms.custom: linux-related-content
---

# Troubleshooting VM provisioning with cloud-init

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets

If you have been creating generalized custom images, using cloud-init to do provisioning, but have found that VM did not create correctly, you will need to troubleshoot your custom images.

Some examples, of issues with provisioning:

- VM gets stuck at 'creating' for 40 minutes, and the VM creation is marked as failed.
- `CustomData` does not get processed.
- The ephemeral disk fails to mount.
- Users do not get created, or there are user access issues.
- Networking is not set up correctly.
- Swap file or partition failures.

This article steps you through how to troubleshoot cloud-init. For more in-depth details, see [cloud-init deep dive](./cloud-init-deep-dive.md).

## <a id="step1"></a> Step 1: Test the deployment without `customData`

Cloud-init can accept `customData`, that is passed to it, when the VM is created. First you should ensure this is not causing any issues with deployments. Try to provisioning the VM without passing in any configuration. If you find the VM fails to provision, continue with the steps below, if you find the configuration you are passing is not being applied go [step 4](#step4).

## <a id="step2"></a> Step 2: Review image requirements

The primary cause of VM provisioning failure is the OS image doesn't satisfy the prerequisites for running on Azure. Make sure your images are properly prepared before attempting to provision them in Azure.

The following articles illustrate the steps to prepare various linux distributions that are supported in Azure:

- [CentOS-based Distributions](create-upload-centos.md)
- [Debian Linux](debian-create-upload-vhd.md)
- [Flatcar Container Linux](flatcar-create-upload-vhd.md)
- [Oracle Linux](oracle-create-upload-vhd.md)
- [Red Hat Enterprise Linux](redhat-create-upload-vhd.md)
- [SLES & openSUSE](suse-create-upload-vhd.md)
- [Ubuntu](create-upload-ubuntu.md)
- [Others: Non-Endorsed Distributions](create-upload-generic.md)

For the [supported Azure cloud-init images](./using-cloud-init.md), the Linux distributions already have all the required packages and configurations in place to correctly provision the image in Azure. If you find your VM is failing to create from your own curated image, try a supported Azure Marketplace image that already is configured for cloud-init, with your optional `customData`. If the `customData` works correctly with an Azure Marketplace image, then there is probably an issue with your curated image.

## <a id="step3"></a> Step 3: Collect & review VM logs

When the VM fails to provision, Azure will show 'creating' status, for 20 minutes, and then reboot the VM, and wait another 20 minutes before finally marking the VM deployment as failed, before finally marking it with an `OSProvisioningTimedOut` error.

While the VM is running, you will need the logs from the VM to understand why provisioning failed.  To understand why VM provisioning failed, do not stop the VM. Keep the VM running. You will need to keep the failed VM in a running state in order to collect logs. To collect the logs, use one of the following methods:

- [Enable Boot Diagnostics](/previous-versions/azure/virtual-machines/linux/tutorial-monitor#enable-boot-diagnostics) before creating the VM and then [View](/previous-versions/azure/virtual-machines/linux/tutorial-monitor#view-boot-diagnostics) them during the boot.

- [Serial Console](/troubleshoot/azure/virtual-machines/serial-console-grub-single-user-mode)

- [Run AZ VM Repair](/troubleshoot/azure/virtual-machines/repair-linux-vm-using-azure-virtual-machine-repair-commands) to attach and mount the OS disk using [chroot](/troubleshoot/azure/virtual-machines/chroot-environment-linux), which will allow you to collect these logs:

```bash
sudo cat /rescue/var/log/cloud-init*
sudo cat /rescue/var/log/waagent*
sudo cat /rescue/var/log/syslog*
sudo cat /rescue/var/log/rsyslog*
sudo cat /rescue/var/log/messages*
sudo cat /rescue/var/log/kern*
sudo cat /rescue/var/log/dmesg*
sudo cat /rescue/var/log/boot*
```

> [!NOTE]
> Alternatively, you can create a rescue VM manually by using the Azure portal. For more information, see [Troubleshoot a Linux VM by attaching the OS disk to a recovery VM using the Azure portal](/troubleshoot/azure/virtual-machines/troubleshoot-recovery-disks-portal-linux).

To start initial troubleshooting, start with the cloud-init logs, and understand where the failure occurred, then use the other logs to deep dive, and provide additional insights.

* /var/log/cloud-init.log
* /var/log/cloud-init-output.log
* Serial/boot logs

In all logs, start searching for "Failed", "WARNING", "WARN", "err", "error", "ERROR". Setting configuration to ignore case-sensitive searches is recommended.

> [!TIP]
> If you are troubleshooting a custom image, you should consider adding a user during the image. If the provisioning fails to set the admin user, you can still log in to the OS.

## Analyzing the logs

Here are more details about what to look for in each cloud-init log.

### /var/log/cloud-init.log

By default, all cloud-init events with a priority of debug or higher, are written to `/var/log/cloud-init.log`. This provides verbose logs of every event that occurred during cloud-init initialization.

For example:

```console
2019-10-10 04:51:25,321 - util.py[DEBUG]: Failed mount of '/dev/sr0' as 'auto': Unexpected error while running command.
Command: ['mount', '-o', 'ro,sync', '-t', 'auto', u'/dev/sr0', '/run/cloud-init/tmp/tmpLIrklc']
Exit code: 32
Reason: -
Stdout:
Stderr: mount: unknown filesystem type 'udf'
2020-01-31 00:21:53,352 - DataSourceAzure.py[WARNING]: /dev/sr0 was not mountable
```

Once you have found an error or warning, read backwards in the cloud-init log to understand what cloud-init was attempting before it hit the error or warning. In many cases cloud-init will have run OS commands or performed provisioning operations prior to the error, which can provide insights as to why errors appeared in the logs. The following example shows that cloud-init attempted to mount a device right before it hit an error.

```output
2019-10-10 04:51:24,010 - util.py[DEBUG]: Running command ['mount', '-o', 'ro,sync', '-t', 'auto', u'/dev/sr0', '/run/cloud-init/tmp/tmpXXXXX'] with allowed return codes [0] (shell=False, capture=True)
```

If you have access to the [Serial Console](/troubleshoot/azure/virtual-machines/serial-console-grub-single-user-mode), you can try to rerun the command that cloud-init was trying to run.

The logging for `/var/log/cloud-init.log` can also be reconfigured within /etc/cloud/cloud.cfg.d/05_logging.cfg. For more details of cloud-init logging, refer to the [cloud-init documentation](https://cloudinit.readthedocs.io/en/latest/development/logging.html).

### /var/log/cloud-init-output.log

You can get information from the `stdout` and `stderr` during the [stages of cloud-init](cloud-init-deep-dive.md). This normally involves routing table information, networking information, ssh host key verification information, `stdout` and `stderr` for each stage of cloud-init, along with the timestamp for each stage. If desired, `stderr` and `stdout` logging can be reconfigured from `/etc/cloud/cloud.cfg.d/05_logging.cfg`.

### Serial/boot logs

Cloud-init has multiple dependencies, these are documented in required prerequisites for images on Azure, such as networking, storage, ability to mount an ISO, and mount and format the temporary disk. Any of these may throw errors and cause cloud-init to fail. For example, if the VM cannot get a DHCP lease, cloud-init will fail.

If you still cannot isolate why cloud-init failed to provision then you need to understand what cloud-init stages, and when modules run. See [Diving deeper into cloud-init](cloud-init-deep-dive.md) for more details.

## <a id="step4"></a> Step 4: Investigate why the configuration isn't being applied

Not every failure in cloud-init results in a fatal provisioning failure. For example, if you are using the `runcmd` module in a cloud-init config, a non-zero exit code from the command it is running will cause the VM provisioning to fail. This is because it runs after core provisioning functionality that happens in the first 3 stages of cloud-init. To troubleshoot why the configuration did not apply, review the logs in Step 3, and cloud-init modules manually. For example:

- `runcmd` - do the scripts run without errors? Run the configuration manually from the terminal to ensure they run as expected.
- Installing packages - does the VM have access to package repositories?
- You should also check the `customData` data configuration that was provided to the VM, this is located in `/var/lib/cloud/instances/<unique-instance-identifier>/user-data.txt`.

## Next steps

If you still cannot isolate why cloud-init did not run the configuration, you need to look more closely at what happens in each cloud-init stage, and when modules run. See [Diving deeper into cloud-init configuration](./cloud-init-deep-dive.md) for more information.
