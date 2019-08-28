---
layout: LandingPage
description: Learn how to troubleshoot virtual machine deployments.

title: Troubleshooting for Azure Virtual Machines Documentation | Microsoft Docs
services: virtual-machines
author: genlin
manager: gwallace
layout: LandingPage

ms.assetid:
ms.service: virtual-machines
ms.tgt_pltfrm: na

ms.topic: landing-page
ms.date: 10/3/2018
ms.author: genli
---

# Troubleshooting Azure virtual machines

## Tools for troubleshooting

- [Serial Console](serial-console-windows.md)
- [Boot diagnostics](boot-diagnostics.md)
- [Windows VM: Attach the OS disk to another VM for troubleshooting](troubleshoot-recovery-disks-portal-windows.md)
- [Linux VM: Attach the OS disk to another VM for troubleshooting](troubleshoot-recovery-disks-portal-linux.md)

## Can't connect to the VM

### Windows

**Common solution**

- [Reset RDP](reset-rdp.md)
- [RDP troubleshooting](troubleshoot-rdp-connection.md)
- [Detailed RDP troubleshooting](detailed-troubleshoot-rdp.md)

**RDP Errors**

- [No license server](troubleshoot-rdp-no-license-server.md)
- [An internal ](Troubleshoot-rdp-internal-error.md)
- [authentication errors](troubleshoot-authentication-error-rdp-vm.md)
- [Troubleshoot specific errors](troubleshoot-specific-rdp-errors.md)

**VM boot errors**

* [BitLocker boot errors](troubleshoot-bitlocker-boot-error.md) 
* [Windows show "Checking file system" during boot](troubleshoot-check-disk-boot-error.md)
* [Blue screen errors](troubleshoot-common-blue-screen-error.md)
* [VM startup is stuck on "Getting Windows Ready](troubleshoot-vm-boot-configure-update.md)
* ["CRITICAL SERVICE FAILED" error on blue screen](troubleshoot-critical-service-failed-boot-error.md)
* [Reboot loop problem](troubleshoot-reboot-loop.md)
* [VM startup is stuck at Windows update stage](troubleshoot-stuck-updating-boot-error.md)
* [VM boots to Safe Mode](troubleshoot-rdp-safe-mode.md)

**Other**
- [Reset VM password for Windows VM offline](reset-local-password-without-agent.md)
- [Reset NIC after misconfiguration](reset-network-interface.md)

### Linux

- [SSH troubleshooting](troubleshoot-ssh-connection.md)
- [Detailed SSH troubleshooting](detailed-troubleshoot-ssh-connection.md)
- [Common error messages](error-messages.md)
- [Reset VM password for Linux VM offline](reset-password.md)

## VM deployment issues

- [Allocation failures](allocation-failure.md)
- Redeploy a VM
	- [Linux](redeploy-to-new-node-linux.md)
	- [Windows](redeploy-to-new-node-windows.md)
- Troubleshoot deployments
	- [Linux](troubleshoot-deploy-vm-linux.md)
	- [Windows](troubleshoot-deploy-vm-windows.md)
- [Device names are changed](troubleshoot-device-names-problems.md)
- [Install Windows VM agent offline](install-vm-agent-offline.md)
- [Restarting or resizing a VM](restart-resize-error-troubleshooting.md)

## VM performance Issue
- [Performance issues with VMs](performance-diagnostics.md)
- Windows
    - [How to use PerfInsights](how-to-use-perfinsights.md)
    - [Performance diagnostics extension](performance-diagnostics-vm-extension.md)
- Linux
	- [How to use PerfInsights](how-to-use-perfinsights-linux.md)