---
title: Add network interfaces to or remove from Azure VMs
description: Learn how to add network interfaces to or remove network interfaces from virtual machines.
services: virtual-network
author: asudbring
manager: mtillman
tags: azure-resource-manager
ms.service: virtual-network
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/16/2022
ms.author: allensu
ms.custom: template-how-to, engagement-fy23
---

# Add network interfaces to or remove network interfaces from virtual machines

Learn how to add an existing network interface when you create an Azure virtual machine (VM). Also learn how to add or remove network interfaces from an existing VM in the stopped (deallocated) state. A network interface enables an Azure VM to communicate with internet, Azure, and on-premises resources. A VM has one or more network interfaces. 

If you need to add, change, or remove IP addresses for a network interface, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md). To manage network interfaces, see [Create, change, or delete a network interface](virtual-network-network-interface.md).

## Prerequisites

If you don't have one, set up an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Complete one of these tasks before starting the remainder of this article:

- **Portal users**: Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

- **PowerShell users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/powershell), or run PowerShell locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **PowerShell** if it isn't already selected.

    If you're running PowerShell locally, use Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az.Network` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). Run `Connect-AzAccount` to sign in to Azure.

- **Azure CLI users**: Either run the commands in the [Azure Cloud Shell](https://shell.azure.com/bash), or run Azure CLI locally from your computer. The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. In the Azure Cloud Shell browser tab, find the **Select environment** dropdown list, then pick **Bash** if it isn't already selected.

    If you're running Azure CLI locally, use Azure CLI version 2.0.26 or later. Run `az --version` to find the installed version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). Run `az login` to create a connection with Azure.

## Add existing network interfaces to a new VM

When you create a virtual machine through the portal, the portal creates a network interface with default settings and attaches the network interface to the VM for you. You can't use the portal to add existing network interfaces to a new VM, or to create a VM with multiple network interfaces. You can do both by using the CLI or PowerShell. Be sure to familiarize yourself with the [constraints](#constraints). If you create a VM with multiple network interfaces, you must also configure the operating system to use them properly after you create the VM. Learn how to configure [Linux](../virtual-machines/linux/multiple-nics.md#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md#configure-guest-os-for-multiple-nics) for multiple network interfaces.

### Commands

Before you create the VM, [create a network interface](virtual-network-network-interface.md#create-a-network-interface).

|Tool|Command|
|---|---|
|CLI|[az vm create](/cli/azure/vm#az-vm-create). See [example](../virtual-machines/linux/multiple-nics.md#create-a-vm-and-attach-the-nics)|
|PowerShell|[New-AzNetworkInterface](/powershell/module/az.network/new-aznetworkinterface) and [New-AzVM](/powershell/module/az.compute/new-azvm). See [example](../virtual-machines/windows/multiple-nics.md#create-a-vm-with-multiple-nics)|

## Add a network interface to an existing VM

To add a network interface to your virtual machine:

1. Go to the [Azure portal](https://portal.azure.com) to find an existing virtual machine. Search for and select **Virtual machines**.

2. Select the name of your VM. The VM must support the number of network interfaces you want to add. To find out how many network interfaces each VM size supports, see the sizes in Azure for [Sizes for virtual machines in Azure](../virtual-machines/sizes.md).

3. In the VM **Overview** page, select **Stop**, and then **Yes**. Then wait until the **Status** of the VM changes to **Stopped (deallocated)**.

    :::image type="content" source="./media/virtual-network-network-interface-vm/stop-virtual-machine.png" alt-text="Screenshot of stop a virtual machine in Azure portal.":::

4. Select **Networking** > **Attach network interface**. Then in **Attach existing network interface**, select the network interface you'd like to attach, and select **OK**.

    :::image type="content" source="./media/virtual-network-network-interface-vm/attach-network-interface.png" alt-text="Screenshot of attach a network interface to a virtual machine in Azure portal.":::

    >[!NOTE]
    >The network interface you select must exist in the same virtual network with the network interface currently attached to the VM.

    If you don't have an existing network interface, you must first create one. To do so, select **Create network interface**. To learn more about how to create a network interface, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface). To learn more about additional constraints when adding network interfaces to virtual machines, see [Constraints](#constraints).

5. Select **Overview** > **Start** to start the virtual machine.

Now you can configure the VM operating system to use multiple network interfaces properly. Learn how to configure [Linux](../virtual-machines/linux/multiple-nics.md#configure-guest-os-for-multiple-nics) or [Windows](../virtual-machines/windows/multiple-nics.md#configure-guest-os-for-multiple-nics) for multiple network interfaces.

### Commands

|Tool|Command|
|---|---|
|CLI|[az vm nic add](/cli/azure/vm/nic#az-vm-nic-add). See [example](../virtual-machines/linux/multiple-nics.md#add-a-nic-to-a-vm)|
|PowerShell|[Add-AzVMNetworkInterface](/powershell/module/az.compute/add-azvmnetworkinterface). See [example](../virtual-machines/windows/multiple-nics.md#add-a-nic-to-an-existing-vm)|

## View network interfaces for a VM

You can view the network interfaces currently attached to a VM to learn about each network interface's configuration, and the IP addresses assigned to each network interface. 

1. Go to the [Azure portal](https://portal.azure.com) to find an existing virtual machine. Search for and select **Virtual machines**.

    >[!NOTE]
    >Sign in using an account that is assigned the Owner, Contributor, or Network Contributor role for your subscription. To learn more about how to assign roles to accounts, see [Built-in roles for Azure role-based access control](../role-based-access-control/built-in-roles.md#network-contributor).

2. Select the name of the VM for which you want to view attached network interfaces.

3. Select **Networking** to see the network interfaces currently attached to the VM. Select a network interface to see its configuration

    :::image type="content" source="./media/virtual-network-network-interface-vm/network-interfaces.png" alt-text="Screenshot of network interface attached to a virtual machine in Azure portal.":::

To learn about network interface settings and how to change them, see [Manage network interfaces](virtual-network-network-interface.md). To learn about how to add, change, or remove IP addresses assigned to a network interface, see [Manage network interface IP addresses](./ip-services/virtual-network-network-interface-addresses.md).

### Commands

|Tool|Command|
|---|---|
|CLI|[az vm nic list](/cli/azure/vm/nic#az-vm-nic-list)|
|PowerShell|[Get-AzVM](/powershell/module/az.compute/get-azvm)|

## Remove a network interface from a VM

1. Go to the [Azure portal](https://portal.azure.com) to find an existing virtual machine. Search for and select **Virtual machines**.

2. Select the name of the VM for which you want to delete attached network interfaces.

3. Select **Stop**.

4. Wait until the **Status** of the VM changes to **Stopped (deallocated)**.

5. Select **Networking** > **Detach network interface**.

6. In the **Detach network interface**, select the network interface you'd like to detach. Then select **OK**.

    >[!NOTE]
    >If only one network interface is listed, you can't detach it, because a virtual machine must always have at least one network interface attached to it.

### Commands

|Tool|Command|
|---|---|
|CLI|[az vm nic remove](/cli/azure/vm/nic#az-vm-nic-remove). See [example](../virtual-machines/linux/multiple-nics.md#remove-a-nic-from-a-vm)|
|PowerShell|[Remove-AzVMNetworkInterface](/powershell/module/az.compute/remove-azvmnetworkinterface). See [example](../virtual-machines/windows/multiple-nics.md#remove-a-nic-from-an-existing-vm)|

## Constraints

- A VM must have at least one network interface attached to it.

- A VM can only have as many network interfaces attached to it as the VM size supports. To learn more about how many network interfaces each VM size supports, see [Sizes for virtual machines in Azure](../virtual-machines/sizes.md). All sizes support at least two network interfaces.

- The network interfaces you add to a VM can't currently be attached to another VM. To learn more about how to create network interfaces, see [Create a network interface](virtual-network-network-interface.md#create-a-network-interface).

- In the past, you could add network interfaces only to VMs that supported multiple network interfaces and were created with at least two network interfaces. You couldn't add a network interface to a VM that was created with one network interface, even if the VM size supported more than one network interface. Conversely, you could only remove network interfaces from a VM with at least three network interfaces, because VMs created with at least two network interfaces always had to have at least two network interfaces. These constraints no longer apply. You can now create a VM with any number of network interfaces (up to the number supported by the VM size).

- By default, the first network interface attached to a VM is the *primary* network interface. All other network interfaces in the VM are *secondary* network interfaces.

- You can control which network interface you send outbound traffic to. However, a VM by default sends all outbound traffic to the IP address that's assigned to the primary IP configuration of the primary network interface.

- In the past, all VMs within the same availability set were required to have a single, or multiple, network interfaces. VMs with any number of network interfaces can now exist in the same availability set, up to the number supported by the VM size. You can only add a VM to an availability set when it's created. To learn more about availability sets, see [Availability options for Azure Virtual Machines](../virtual-machines/availability.md).

- You can connect network interfaces in the same VM to different subnets within a virtual network. However, the network interfaces must all be connected to the same virtual network.

- You can add any IP address for any IP configuration of any primary or secondary network interface to an Azure Load Balancer back-end pool. In the past, only the primary IP address for the primary network interface could be added to a back-end pool. To learn more about IP addresses and configurations, see [Configure IP addresses for an Azure network interface](./ip-services/virtual-network-network-interface-addresses.md).

- Deleting a VM doesn't delete the network interfaces that are attached to it. When you delete a VM, the network interfaces are detached from the VM. You can add those network interfaces to different VMs or delete them.

- Achieving the optimal performance documented requires Accelerated Networking. In some cases, you must explicitly enable Accelerated Networking for [Windows](create-vm-accelerated-networking-powershell.md) or [Linux](create-vm-accelerated-networking-cli.md) virtual machines.

[!INCLUDE [ephemeral-ip-note.md](../../includes/ephemeral-ip-note.md)]

## Next steps

To create a VM with multiple network interfaces or IP addresses, see:

|Task|Tool|
|---|---|
|Create a VM with multiple NICs|[CLI](../virtual-machines/linux/multiple-nics.md), [PowerShell](../virtual-machines/windows/multiple-nics.md)|
|Create a single NIC VM with multiple IPv4 addresses|[CLI](./ip-services/virtual-network-multiple-ip-addresses-cli.md), [PowerShell](./ip-services/virtual-network-multiple-ip-addresses-powershell.md)|
|Create a single NIC VM with a private IPv6 address (behind an Azure Load Balancer)|[CLI](../load-balancer/load-balancer-ipv6-internet-cli.md), [PowerShell](../load-balancer/load-balancer-ipv6-internet-ps.md), [Azure Resource Manager template](../load-balancer/load-balancer-ipv6-internet-template.md)|
