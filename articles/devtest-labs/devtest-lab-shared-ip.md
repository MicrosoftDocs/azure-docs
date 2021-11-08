---
title: Understand shared IP addresses
description: Learn how Azure DevTest Labs uses shared IP addresses to minimize the public IP addresses you need to access your lab VMs.
ms.topic: how-to
ms.date: 11/08/2021
---

# Understand shared IP addresses in Azure DevTest Labs

Azure DevTest Labs virtual machines (VMs) can share the same public IP address, to minimize the number of public IPs you need to access lab VMs.  This article describes how shared IPs work and how to configure shared IP options.

## Shared IP settings

Azure DevTest Labs creates labs in virtual networks that can have one or more subnets. The default subnet has **Enable shared public IP** set to **Yes**.  This configuration creates one public IP address for the entire subnet. For more information about configuring virtual networks and subnets, see [Configure a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md).

![New lab subnet](media/devtest-lab-shared-ip/lab-subnet.png)

For existing labs, you can check or set this option by selecting **Configuration and policies** in the lab's left navigation, and then selecting **Virtual networks** under **External resources**. Select a virtual network from the list to see the shared IP settings for its subnets.

To change the setting, select a subnet from the list, and then change **Enable shared public IP** to **Yes** or **No**.

Any VMs you create in this subnet default to using a shared IP.  When creating the VM, you can access this setting on the **Advanced settings** page next to **IP address**.

![New VM](media/devtest-lab-shared-ip/new-vm.png)

- **Shared:** All VMs you create as **Shared** go into the same resource group. The resource group has one assigned IP address that all VMs in the resource group use.
- **Public:** Every public VM has its own IP address and resource group.
- **Private:** Every private VM uses a private IP address. You can't connect to these VMs from the internet by using Remote Desktop protocol (RDP).

When you add a VM with shared IP to a subnet, DevTest Labs automatically adds the VM to a load balancer and assigns the VM a TCP port number on the public IP address. The port number forwards to the RDP port on the VM.

## Use a shared IP

- **Linux users:** Secure shell (SSH) connect to the VM by using the IP address or fully qualified domain name, followed by a colon, followed by the port number. For example, the following screenshot shows an RDP connection address of `mydevtestlab597975021002.eastus.cloudapp.azure.com:50661`.

  ![VM example](media/devtest-lab-shared-ip/vm-info.png)

- **Windows users:** Select the **Connect** button on the Azure portal to download a pre-configured RDP file and access the VM.

## Next steps

- [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md)
- [Configure a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md)
