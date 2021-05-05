---
title: Get started with the Windows Virtual Desktop Agent
description: An overview of the Windows Virtual Desktop Agent and update processes.
author: Sefriend
ms.topic: conceptual
ms.date: 12/16/2020
ms.author: sefriend
manager: clarkn
---
# Get started with the Windows Virtual Desktop Agent

In the Windows Virtual Desktop Service framework, there are three main components: the Remote Desktop client, the service, and the virtual machines. These virtual machines live in the customer subscription where the Windows Virtual Desktop agent and agent bootloader are installed. The agent acts as the intermediate communicator between the service and the virtual machines, enabling connectivity. Therefore, if you're experiencing any issues with the agent installation, update, or configuration, your virtual machines won't be able to connect to the service. The agent bootloader is the executable that loads the agent. 

This article will give you a brief overview of the agent installation and update processes.

>[!NOTE]
>This documentation is not for the FSLogix agent or the Remote Desktop Client agent.


## Initial installation process

The Windows Virtual Desktop agent is initially installed in one of two ways. If you provision virtual machines (VMs) in the Azure portal and Azure Marketplace, the agent and agent bootloader are automatically installed. If you provision VMs using PowerShell, you must manually download the agent and agent bootloader .msi files when [creating a Windows Virtual Desktop host pool with PowerShell](create-host-pools-powershell.md#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool). Once the agent is installed, it installs the Windows Virtual Desktop side-by-side stack and Geneva Monitoring agent. The side-by-side stack component is required for users to securely establish reverse server-to-client connections. The Geneva Monitoring agent monitors the health of the agent. All three of these components are essential for end-to-end user connectivity to function properly.

>[!IMPORTANT]
>To successfully install the Windows Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent, you must unblock all the URLs listed in the [Required URL list](safe-url-list.md#virtual-machines). Unblocking these URLs is required to use the Windows Virtual Desktop service.

## Agent update process

The Windows Virtual Desktop service updates the agent whenever an update becomes available. Agent updates can include new functionality or fixes for previous issues. You must always have the latest stable version of the agent installed so your VMs don't lose connectivity or security. Once the initial version of the Windows Virtual Desktop agent is installed, the agent regularly queries the Windows Virtual Desktop service to determine if there’s a newer version of the agent, stack, or monitoring component available. If a newer version of any of the components has already been deployed, the updated component is automatically installed by the flighting system.

New versions of the agent are deployed at regular intervals in weeklong periods to all Azure subscriptions. These update periods are called "flights." When a flight happens, you may see VMs in your host pool receive the agent update at different times. All VM agents in all subscriptions will be updated by the end of the deployment period. The Windows Virtual Desktop flighting system enhances the reliability of the service by ensuring the stability and quality of the agent update.


Other important things you should keep in mind:

- Because VMs in your host pool may receive agent updates at different times, you'll need to be able to tell the difference between flighting issues and failed agent updates. If you go to the event logs for your VM at **Event Viewer** > **Windows Logs** > **Application** and see an event labeled "ID 3277," that means the Agent update didn't work. If you don't see that event, then the VM is in a different flight and will be updated later.
- When the Geneva Monitoring agent updates to the latest version, the old GenevaTask task is located and disabled before creating a new task for the new monitoring agent. The earlier version of the monitoring agent isn't deleted in case that the most recent version of the monitoring agent has a problem that requires reverting to the earlier version to fix. If the latest version has a problem, the old monitoring agent will be re-enabled to continue delivering monitoring data. All versions of the monitor that are earlier than the last one you installed before the update will be deleted from your VM.
- Your VM keeps three versions of the side-by-side stack at a time. This allows for quick recovery if something goes wrong with the update. The earliest version of the stack is removed from the VM whenever the stack updates.

The agent update normally lasts 2-3 minutes on a new VM and shouldn't cause your VM to lose connection or shut down. This update process applies to both Windows Virtual Desktop (classic) and the latest version of Windows Virtual Desktop with Azure Resource Manager.

## Next steps

Now that you have a better understanding of the Windows Virtual Desktop agent, here are some resources that might help you:

- If you're experiencing agent or connectivity-related issues, check out the [Windows Virtual Desktop Agent issues troubleshooting guide](troubleshoot-agent.md).
