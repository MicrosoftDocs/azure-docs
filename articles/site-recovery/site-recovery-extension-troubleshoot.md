---
title: Troubleshoot issues with Azure Site Recovery agents | Microsoft Docs'
description: Provides information about symptoms, causes, and resolutions of Azure Site Recovery agent failures.
author: carmonmills
manager: rochakm
ms.service: site-recovery
ms.topic: troubleshooting
ms.date: 11/27/2018
ms.author: carmonm
---

# Troubleshoot issues with the Azure Site Recovery agent

This article provides troubleshooting steps that can help you resolve Azure Site Recovery  errors related to VM agent and extension.


## Azure Site Recovery extension time out  

Error message: "Task execution has timed out while tracking for extension operation to be started"<br>
Error code: "151076"

 Azure Site Recovery install an extension on the virtual machine as a part of enable protection job. Any of the following conditions might prevent the protection from being triggered and job to fail. Complete the following troubleshooting steps, and then retry your operation:

**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**    
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
**Cause 3: [The Site Recovery extension fails to update or load](#the-site-recovery-extension-fails-to-update-or-load)**  

Error message: "Previous site recovery extension operation is taking more time than expected."<br>
Error code: "150066"<br>

**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**    
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
**Cause 3: [The Site Recovery extension status is incorrect](#the-site-recovery-extension-fails-to-update-or-load)**  

## Protection fails because the VM agent is unresponsive

Error message: "Task execution has timed out while tracking for extension operation to be started."<br>
Error code: "151099"<br>

This error can occur if the Azure guest agent in the virtual machine is not in the ready state.
You can check the status of Azure guest agent in [Azure portal](https://portal.azure.com/). Go to the virtual machine you are trying to protect and check the status in "VM > Settings > Properties > Agent status". Most of the time the status of the agent become ready after rebooting the virtual machine. However, if reboot is not a possible option or you are still facing the issue, then complete the following troubleshooting steps.

**Cause 1: [The agent is installed in the VM, but it's unresponsive (for Windows VMs)](#the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms)**    
**Cause 2: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  


Error message: "Task execution has timed out while tracking for extension operation to be started."<br>
Error code: "151095"<br>

This occur when the agent version on the Linux machine is old. Please complete the following troubleshooting step.<br>
  **Cause 1: [The agent installed in the VM is out of date (for Linux VMs)](#the-agent-installed-in-the-vm-is-out-of-date-for-linux-vms)**  
## Causes and solutions

### <a name="the-agent-installed-in-the-vm-but-unresponsive-for-windows-vms"></a>The agent is installed in the VM, but it's unresponsive (for Windows VMs)

#### Solution
The VM agent might have been corrupted, or the service might have been stopped. Re-installing the VM agent helps get the latest version. It also helps restart communication with the service.

1. Determine whether the "Windows Azure Guest Agent service" is running in the VM services (services.msc). Try to restart the "Windows Azure Guest Agent service".    
2. If the Windows Azure Guest Agent service isn't visible in services, in Control Panel, go to **Programs and Features** to determine whether the Windows Guest Agent service is installed.
4. If the Windows Azure Guest Agent appears in **Programs and Features**, uninstall the Windows Guest Agent.
5. Download and install the [latest version of the agent MSI](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You must have Administrator rights to complete the installation.
6. Verify that the Windows Azure Guest Agent services appears in services.
7. Restart the protection job.

Also, verify that [Microsoft .NET 4.5 is installed](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) in the VM. .NET 4.5 is required for the VM agent to communicate with the service.

### The agent installed in the VM is out of date (for Linux VMs)

#### Solution
Most agent-related or extension-related failures for Linux VMs are caused by issues that affect an outdated VM agent. To troubleshoot this issue, follow these general guidelines:

1. Follow the instructions for [updating the Linux VM agent](../virtual-machines/linux/update-agent.md).

   > [!NOTE]
   > We *strongly recommend* that you update the agent only through a distribution repository. We do not recommend downloading the agent code directly from GitHub and updating it. If the latest agent for your distribution is not available, contact distribution support for instructions on how to install it. To check for the most recent agent, go to the [Windows Azure Linux agent](https://github.com/Azure/WALinuxAgent/releases) page in the GitHub repository.

2. Ensure that the Azure agent is running on the VM by running the following command: `ps -e`

   If the process isn't running, restart it by using the following commands:

   * For Ubuntu: `service walinuxagent start`
   * For other distributions: `service waagent start`

3. [Configure the auto restart agent](https://github.com/Azure/WALinuxAgent/wiki/Known-Issues#mitigate_agent_crash).
4. Enable protection of the virtual machine.



### The Site Recovery extension fails to update or load
If extensions status is "Empty','NotReady' or Transitioning.

#### Solution

Uninstall the extension and restart the operation again.

To uninstall the extension:

1. In the [Azure portal](https://portal.azure.com/), go to the VM that is experiencing backup failure.
2. Select **Settings**.
3. Select **Extensions**.
4. Select **Site Recovery Extension**.
5. Select **Uninstall**.

For Linux VM, If the VMSnapshot extension does not show in the Azure portal, [update the Azure Linux Agent](../virtual-machines/linux/update-agent.md), and then run the protection. 

Completing these steps causes the extension to be reinstalled during the protection.


