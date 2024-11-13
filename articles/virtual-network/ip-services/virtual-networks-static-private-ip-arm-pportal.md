---
title: 'Create a VM with a static private IP address'
description: Learn to create a virtual machine with a static private IP address using the Azure portal, Azure PowerShell, or Azure CLI.
ms.date: 11/19/2024
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: how-to
ms.custom: template-how-to, engagement-fy23
---

# Create a virtual machine with a static private IP address

When you create a virtual machine (VM), it's automatically assigned a private IP address from a range that you specify. This IP address is based on the subnet in which the VM is deployed, and the VM keeps this address until the VM is deleted. Azure dynamically assigns the next available private IP address from the subnet you create a VM in. If you want to assign a specific IP address in this subnet for your VM, use a static IP address.

## Prerequisites

# [Azure portal](#tab/azureportal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [Azure PowerShell](#tab/azurepowershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [Azure CLI](#tab/azurecli)

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

# [Azure portal](#tab/azureportal)

## Create a VM

Use the following steps to create a VM, and its virtual network and subnet:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the portal, search for and select **Virtual machines**.

1. Select **Create** > **Azure virtual machine**.

1. On the **Basics** tab of the **Create a virtual machine** screen, enter or select the following values:

   - **Subscription**: Keep the default or select a different subscription.
   - **Resource group**: Select **Create new**, and then name the group *myResourceGroup*.
   - **Virtual machine name**: Enter *myVM*.
   - **Region**: Select **(US) East US**.
   - **Availability options**: Select **No infrastructure redundancy required**.
   - **Image**: Select **Windows Server 2019 Datacenter - x64 Gen2**.
   - **Size**: Accept the default, or drop down and select a size.
   - **Username**, **Password**, and **Confirm password**: Enter an admin username and password for the VM.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Select **RDP (3389)**.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/create-vm.png" alt-text="Screenshot that shows the Basic tab of the Create a virtual machine window." lightbox="./media/virtual-networks-static-private-ip-arm-pportal/create-vm.png":::

    > [!WARNING]
    > In this example, you open port 3389 to enable remote access to the Windows Server VM from the internet. However, opening port 3389 to the internet is not recommended to manage production workloads. For information about secure access to Azure VMs, see [What is Azure Bastion?](../../bastion/bastion-overview.md).

1. Select the **Networking** tab at the top of the page.
  
1. On the **Networking** page, enter or select the following values:

   - **Virtual network**: Accept the default network name.
   - **Subnet**: Select **default** if not already selected.
   - **Public IP**: Accept the default public IP configuration.
   - **Public inbound ports**: Select **Allow selected ports**.
   - **Select inbound ports**: Select **RDP (3389)**.

1. Select **Review + create**. Review the settings, and then select **Create**.

[!INCLUDE [ephemeral-ip-note.md](~/reusable-content/ce-skilling/azure/includes/ephemeral-ip-note.md)]

# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli)

---

## Change private IP address to static
# [Azure portal](#tab/azureportal)

In this procedure, you change the private IP address from **dynamic** to **static** for the VM you created previously:

1. In the portal, search for and select **Virtual machines**.

2. In **Virtual machines**, select **myVM** from the list.

3. On the **myVM** page, under **Settings**, select **Networking**.

4. In **Networking**, select the name of the network interface next to **Network interface**. In this example, the name of the NIC is **myvm472**.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-nic.png" alt-text="Screenshot of select network interface.":::

5. On the **Network interface** page, under **Settings**, select **IP configurations**.

6. In **IP configurations**, select **ipconfig1** in the list.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-ip-configuration.png" alt-text="Screenshot of select ip configuration.":::

7. Under **Assignment**, select **Static**. Change the private **IP address** if you want a different one, and then select **Save**.

    > [!WARNING]
    > If you change the private IP address, the VM associated with the network interface will be restarted to utilize the new IP address.

    :::image type="content" source="./media/virtual-networks-static-private-ip-arm-pportal/select-static-assignment.png" alt-text="Screenshot of select static assignment.":::

> [!WARNING]
> From within the operating system of a VM, avoid associating a static *private* IP address on an Azure VM. Only assign a static private IP when it's necessary, such as when [assigning many IP addresses to VMs](virtual-network-multiple-ip-addresses-portal.md).
>
>If you manually set the private IP address within the operating system, make sure it matches the private IP address assigned to the Azure [network interface](virtual-network-network-interface-addresses.md#change-ip-address-settings). Otherwise, you can lose connectivity to the VM. For more information, see [private IP address settings](virtual-network-network-interface-addresses.md#private).

# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli)

---

## Clean up resources
# [Azure portal](#tab/azureportal)

When you're finished, delete the resource group and all of the resources it contains:

1. In the portal, search for and select **myResourceGroup**.

1. From the **myResourceGroup** screen, select **Delete resource group**.

1. Enter *myResourceGroup* for **Enter resource group name to confirm deletion**, and then select **Delete**.
# [Azure PowerShell](#tab/azurepowershell)
# [Azure CLI](#tab/azurecli)

---
## Next steps

- Learn more about [static public IP addresses](public-ip-addresses.md#ip-address-assignment) in Azure.

- Learn more about [public IP addresses](public-ip-addresses.md#public-ip-addresses) in Azure.

- Learn more about Azure [public IP address settings](virtual-network-public-ip-address.md#create-a-public-ip-address).

- Learn more about [private IP addresses](private-ip-addresses.md) and assigning a [static private IP address](virtual-network-network-interface-addresses.md#add-ip-addresses) to an Azure VM.
