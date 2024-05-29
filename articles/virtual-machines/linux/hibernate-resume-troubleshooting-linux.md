---
title: Troubleshoot hibernation on Linux virtual machines
description: Learn how to troubleshoot hibernation on Linux VMs.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/16/2024
ms.author: jainan
ms.reviewer: mattmcinnes
---

# Troubleshooting hibernation on Linux VMs

Hibernating a virtual machine allows you to persist the VM state to the OS disk. This article describes how to troubleshoot issues with the hibernation feature on Linux, issues creating hibernation enabled Linux VMs, and issues with hibernating a Linux VM.

To view the general troubleshooting guide for hibernation, check out [Troubleshoot hibernation in Azure](../hibernate-resume-troubleshooting.md).

## Unable to hibernate a Linux VM

If you're unable to hibernate a VM, first [check whether hibernation is enabled on the VM](../hibernate-resume-troubleshooting.md#unable-to-hibernate-a-vm).

If hibernation is enabled on the VM, check if hibernation is successfully enabled in the guest OS. You can check the extension status if you used the extension to enable hibernation in the guest OS.

:::image type="content" source="../media/hibernate-resume/provisioning-success-linux.png" alt-text="Screenshot of the status and status message reporting that provisioning has succeeded for a Linux VM.":::

## Guest Linux VMs unable to hibernate
You can check the extension status if you used the extension to enable hibernation in the guest OS.

:::image type="content" source="../media/hibernate-resume/provisioning-success-linux.png" alt-text="Screenshot of the status and status message reporting that provisioning has succeeded on a Linux VM.":::

If you used the hibernation-setup-tool to configure the guest for hibernation, you can check if the tool executed successfully through this command:

```
systemctl status hibernation-setup-tool 
```

A successful status should return "Inactive (dead)”, and the log messages should say "Swap file for VM hibernation set up successfully"

Example:

```
azureuser@:~$ systemctl status hibernation-setup-tool
● hibernation-setup-tool.service - Hibernation Setup Tool
   Loaded: loaded (/lib/systemd/system/hibernation-setup-tool.service; enabled; vendor preset: enabled)
   Active: inactive (dead) since Wed 2021-08-25 22:44:29 UTC; 17min ago
  Process: 1131 ExecStart=/usr/sbin/hibernation-setup-tool (code=exited, status=0/SUCCESS)
 Main PID: 1131 (code=exited, status=0/SUCCESS)

linuxhib2 hibernation-setup-tool[1131]: INFO: update-grub2 finished successfully.
linuxhib2 hibernation-setup-tool[1131]: INFO: udev rule to hibernate with systemd set up in /etc/udev/rules.d/99-vm-hibernation.rules.  Telling udev about it.
...
...
linuxhib2 hibernation-setup-tool[1131]: INFO: systemctl finished successfully.
linuxhib2 hibernation-setup-tool[1131]: INFO: Swap file for VM hibernation set up successfully
```

If the guest OS isn't configured for hibernation, take the appropriate action to resolve the issue. For example, if the guest failed to configure hibernation due to insufficient space, resize the OS disk to resolve the issue.    


## Azure extensions disabled on Debian images
Azure extensions are currently disabled by default for Debian images (more details here: https://lists.debian.org/debian-cloud/2023/07/msg00037.html). If you wish to enable hibernation for Debian based VMs through the LinuxHibernationExtension, then you can re-enable support for VM extensions via cloud-init custom data:

```bash
#!/bin/sh
sed -i -e 's/^Extensions\.Enabled =.* $/Extensions.Enabled=y/" /etc/waagent.conf
```

:::image type="content" source="../media/hibernate-resume/debian-image-enable-extensions-via-cloud-init.png" alt-text="Screenshot of the cloud init input field for new Linux VMs.":::

Alternatively, you can enable hibernation on the guest by [installing the hibernation-setup-tool on your Linux VM](../linux/hibernate-resume-linux.md#hibernation-setup-tool).
