---
title: Get started with the Windows Virtual Desktop Agent
description: An overview of the WVD Agent and update processes.
author: Sefriend
ms.topic: conceptual
ms.date: 12/16/2020
ms.author: sefriend
manager: clarkn
---
# Get started with the Windows Virtual Desktop agent

In the Windows Virtual Desktop Service framework, there are three main components: the Remote Desktop client, the service, and the virtual machines. These virtual machines live in the customer subscription where the Windows Virtual Desktop agent and agent bootloader are installed. The agent acts as the intermediate communicator between the service and the virtual machines, enabling connectivity. This means that if you are experiencing any issues with the agent installation, update, or configuration, your virtual machines will not be able to connect to the service. The agent bootloader is the executable that loads the agent. 

This article will give you a brief overview of the agent installation and update processes.

>[!NOTE]
>This documentation is not for the FSLogix agent or the Remote Desktop Client agent.


## Agent Initial Installation Process

The Windows Virtual Desktop agent gets initially installed in one of two ways. If you provision VMs in the Azure portal and Marketplace, the agent and agent bootloader automatically get installed. If you provision VMs via PowerShell, you must manually download the agent and agent bootloader .msi files when [creating a Windows Virtual Desktop host pool with PowerShell](https://docs.microsoft.com/azure/virtual-desktop/create-host-pools-powershell#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool). When the agent gets installed, the Windows Virtual Desktop side-by-side stack and Geneva Monitoring agent also get installed simultaneously. The side-by-side stack component is required for users to securely establish reverse connections from the server to the client. The Geneva Monitoring agent monitors the health of the agent. All three of these are essential for end-to-end user connectivity to function properly.

>[!IMPORTANT]
>For agent, side-by-side stack, and Geneva Monitoring agent installations to succeed over the network, all the URLs listed in the [Required URL list](https://docs.microsoft.com/azure/virtual-desktop/safe-url-list#virtual-machines) must be whitelisted. Note that unblocking these URLs is a prerequisite to using the Windows Virtual Desktop service.

## Agent Update Process

The Windows Virtual Desktop service automatically updates the agent whenever an update becomes available. Agent updates can include new functionality or a fix for previous issues. Once the initial version of the Windows Virtual Desktop agent is installed, either manually or via the Azure portal, the agent regularly queries the Windows Virtual Desktop service to ascertain if there is a newer version of the agent available. If there is a new version, the agent bootloader automatically downloads the latest version of the agent, in addition to the side-by-side stack and Geneva Monitoring agent components.

>[!NOTE]
>- When the Geneva Monitoring agent gets updated, the old GenevaTask is located and disabled prior to creating a new task for the new monitoring agent. The old version of the monitoring agent does not get deleted in the case that the new monitoring agent has a problem. In this case, the old monitoring agent will be re-enabled to continue delivering monitoring data. All older monitoring agents will be deleted from your VM.
>- A minimum of 3 versions of the side-by-side stack are kept on your VM at a time. This allows a quick recovery if something goes wrong with the update. The oldest stack component gets removed from the VM when the stack component gets updated.

This update installation normally lasts 2-3 minutes on a clean VM and should not cause an outage/shut down of your machine. This update process holds true for both Windows Virtual Desktop (classic) and the latest update of Windows Virtual Desktop with ARM.

## Next steps

Now that you have a better understanding of the Windows Virtual Desktop agent, here are some resources that might help you:

- Check out the [Windows Virtual Desktop Agent updates](whats-new.md/#Windows-Virtual-Desktop-agent-updates) section to see information about what the new agent update entails.
- If you are experiencing agent or connectivity related issues, check out the [Windows Virtual Desktop Agent issues troubleshooting guide](troubleshoot-agent.md).