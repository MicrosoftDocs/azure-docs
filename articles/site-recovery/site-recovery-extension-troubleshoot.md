---
title: Troubleshoot the Azure VM extension for disaster recovery with Azure Site Recovery
description: Troubleshoot issues with the Azure VM extension for disaster recovery with Azure Site Recovery.
author: sideeksh
manager: rochakm
ms.topic: troubleshooting
ms.date: 11/27/2018
---

# Troubleshoot Azure VM extension issues

This article provides troubleshooting steps that can help you resolve Azure Site Recovery errors related to the VM agent and extension.


## Azure Site Recovery extension time-out  

Error message: "Task execution has timed out while tracking for extension operation to be started"<br>
Error code: "151076"

 Azure Site Recovery installed an extension on the virtual machine as a part of an enable protection job. Any of the following conditions might prevent the protection from being triggered and cause the job to fail. Complete the following troubleshooting steps, and then retry your operation:

- [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)
- [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)
- [The Site Recovery extension fails to update or load](#the-site-recovery-extension-fails-to-update-or-load)

Error message: "Previous Site Recovery extension operation is taking more time than expected."<br>
Error code: "150066"

- [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)
- [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)
- [The Site Recovery extension status is incorrect](#the-site-recovery-extension-fails-to-update-or-load)

## Protection fails because the VM agent is unresponsive

Error message: "Task execution has timed out while tracking for extension operation to be started."<br>
Error code: "151099"

This error can happen if the Azure guest agent in the virtual machine isn't in the ready state.

You can check the status of Azure guest agent in the [Azure portal](https://portal.azure.com/). Go to the virtual machine you're trying to protect and check the status in **VM** > **Settings** > **Properties** > **Agent status**. Most of the time, the status of the agent is ready after rebooting the virtual machine. However, if you can't reboot or you're still facing the issue, then complete the following troubleshooting steps:

- [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)
- [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)


Error message: "Task execution has timed out while tracking for extension operation to be started."<br>
Error code: "151095"

This error occurs when the agent version on the Linux machine is out of date. Complete the following troubleshooting step:

- [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)  

## Causes and solutions

### <a name="the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms"></a>The agent is installed in the VM, but it's unresponsive (for Windows VMs)

#### Solution
The VM agent might have been corrupted, or the service might have been stopped. Reinstalling the VM agent helps get the latest version. It also helps restart communication with the service.

1. Determine whether the Windows Azure Guest Agent service is running in the VM services (services.msc). Restart the Windows Azure Guest Agent service.    
1. If the Windows Azure Guest Agent service isn't visible in services, open the Control Panel. Go to **Programs and Features** to see whether the Windows Guest Agent service is installed.
1. If the Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Azure Guest Agent.
1. Download and install the [latest version of the agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You need administrator rights to complete the installation.
1. Verify that the Windows Azure Guest Agent service appears in services.
1. Restart the protection job.

Also, verify that [Microsoft .NET 4.5 is installed](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) in the VM. You need .NET 4.5 for the VM agent to communicate with the service.

### The agent installed in the VM is out of date (for Linux VMs)

#### Solution
Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an outdated VM agent. To troubleshoot this issue, follow these general guidelines:

1. Follow the instructions for [updating the Linux VM agent](../virtual-machines/linux/update-agent.md).

   > [!NOTE]
   > We *strongly recommend* that you update the agent only through a distribution repository. We don't recommend downloading the agent code directly from GitHub and updating it. If the latest agent for your distribution isn't available, contact distribution support for instructions on how to install it. To check for the most recent agent, go to the [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) page in the GitHub repository.

1. Ensure that the Azure agent is running on the VM by running the following command: `ps -e`

   If the process isn't running, restart it by using the following commands:

   - For Ubuntu: `service walinuxagent start`
   - For other distributions: `service waagent start`

1. [Configure the automatic restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
1. Enable protection of the virtual machine.

### The Site Recovery extension fails to update or load

The extension status shows as "Empty," "NotReady," or "Transitioning."

#### Solution

Uninstall the extension and restart the operation again.

To uninstall the extension:

1. In the [Azure portal](https://portal.azure.com/), go to the VM that is experiencing Backup failure.
1. Select **Settings**.
1. Select **Extensions**.
1. Select **Site Recovery Extension**.
1. Select **Uninstall**.

For Linux VM, if the VMSnapshot extension does not show in the Azure portal, [update the Azure Linux Agent](../virtual-machines/linux/update-agent.md). Then run the protection.

When you complete these steps, it causes the extension to be reinstalled during the protection.
