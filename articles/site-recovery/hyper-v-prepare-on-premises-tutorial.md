---
title: Prepare on-premises Hyper-V server for disaster recovery of Hyper-V VMs to Azure| Microsoft Docs
description: Learn how to prepare on-premises Hyper-V VMs not managed by System Center VMM for disaster recovery to Azure with the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
ms.topic: article
ms.date: 09/12/2018
ms.author: raynew
ms.custom: MVC
---


# Prepare on-premises Hyper-V servers for disaster recovery to Azure

This tutorial shows you how to prepare your on-premises Hyper-V infrastructure when you want to replicate Hyper-V VMs to Azure, for the purposes of disaster recovery. Hyper-V hosts can be managed by System Center Virtual Machine Manager (VMM), but it's not required.  In this tutorial you learn how to:

> [!div class="checklist"]
> * Review Hyper-V requirements, and VMM requirements if applicable.
> * Prepare VMM if applicable
> * Verify internet access to Azure locations
> * Prepare VMs so that you can access them after failover to Azure

This is the second tutorial in the series. Make sure that you have
[set up the Azure components](tutorial-prepare-azure.md) as described in the previous tutorial.



## Review requirements and prerequisites

Make sure Hyper-V hosts and VMs comply with requirements.

1. [Verify](hyper-v-azure-support-matrix.md#on-premises-servers) on-premises server requirements.
2. [Check the requirements](hyper-v-azure-support-matrix.md#replicated-vms) for Hyper-V VMs you want to replicate to Azure.
3. Check Hyper-V host [networking](hyper-v-azure-support-matrix.md#hyper-v-network-configuration); and host and guest [storage](hyper-v-azure-support-matrix.md#hyper-v-host-storage) support for on-premises Hyper-V hosts.
4. Check what's supported for [Azure networking](hyper-v-azure-support-matrix.md#azure-vm-network-configuration-after-failover), [storage](hyper-v-azure-support-matrix.md#azure-storage), and [compute](hyper-v-azure-support-matrix.md#azure-compute-features), after failover.
5. Your on-premises VMs you replicate to Azure must comply with [Azure VM requirements](hyper-v-azure-support-matrix.md#azure-vm-requirements).


## Prepare VMM (optional)

If Hyper-V hosts are managed by VMM, you need to prepare the on-premises VMM server. 

- Make sure the VMM server has a least one cloud, with one or more host groups. The Hyper-V host on which VMs are running should be located in the cloud.
- Prepare the VMM server for network mapping.

### Prepare VMM for network mapping

If you're using VMM, [network mapping](site-recovery-network-mapping.md) maps between on-premises VMM VM networks, and Azure virtual networks. Mapping ensures that Azure VMs are connected to the right network when they're created after failover.

Prepare VMM for network mapping as follows:

1. Make sure you have a [VMM logical network](https://docs.microsoft.com/system-center/vmm/network-logical) that's associated with the cloud in which the Hyper-V hosts are located.
2. Ensure you have a [VM network](https://docs.microsoft.com/system-center/vmm/network-virtual) linked to the logical network.
3. In VMM, connect the VMs to the VM network.

## Verify internet access

1. For the purposes of the tutorial, the simplest configuration is for the Hyper-V hosts and VMM server to have direct access to the internet without using a proxy. 
2. Make sure that Hyper-V hosts, and the VMM server if relevant, can access the required URLs below.   
3. If you're controlling access by IP address, make sure that:
    - IP address-based firewall rules can connect to [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
    - Allow IP address ranges for the Azure region of your subscription.
    
### Required URLs


[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]


## Prepare to connect to Azure VMs after failover

During a failover scenario you may want to connect to your replicated on-premises network.

To connect to Windows VMs using RDP after failover, allow access as follows:

1. To access over the internet, enable RDP on the on-premises VM before failover. Make sure that
   TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows
   Firewall** > **Allowed Apps** for all profiles.
2. To access over site-to-site VPN, enable RDP on the on-premises machine. RDP should be allowed in
   the **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks.
   Check that the operating system's SAN policy is set to **OnlineAll**. [Learn
   more](https://support.microsoft.com/kb/3031135). There should be no Windows updates pending on
   the VM when you trigger a failover. If there are, you won't be able to log in to the virtual
   machine until the update completes.
3. On the Windows Azure VM after failover, check **Boot diagnostics** to view a screenshot of the
   VM. If you can't connect, check that the VM is running and review these
   [troubleshooting tips](http://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).

After failover, you can access Azure VMs using the same IP address as the replicated on-premises VM, or a different IP address. [Learn more](concepts-on-premises-to-azure-networking.md) about setting up IP addressing for failover.

## Next steps

> [!div class="nextstepaction"]
> [Set up disaster recovery to Azure for Hyper-V VMs](tutorial-hyper-v-to-azure.md)
> [Set up disaster recovery to Azure for Hyper-V VMs in VMM clouds](tutorial-hyper-v-vmm-to-azure.md)
