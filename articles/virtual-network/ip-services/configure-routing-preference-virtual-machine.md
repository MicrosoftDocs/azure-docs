---
title: 'Tutorial: Configure routing preference for a virtual machine'
description: Learn how to create a virtual machine with a public IP address with routing preference choice using the Azure portal.
ms.date: 12/11/2024
ms.author: mbender
author: mbender-ms
ms.service: azure-virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.custom: template-tutorial
---

# Tutorial: Configure routing preference for a virtual machine

This tutorial shows you how to configure routing preference for a virtual machine. Internet bound traffic from the virtual machine is routed via the ISP network when you choose **Internet** as your routing preference option. The default routing is via the Microsoft global network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual machine with a public IP address configured for **Internet** routing preference.
> * Verify the public IP address is set to **Internet** routing preference.

## Prerequisites

# [Azure portal](#tab/azure-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

# [Azure PowerShell](#tab/azure-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure PowerShell installed locally or Azure Cloud Shell

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

---

## Create virtual machine with a public IP address

# [Azure portal](#tab/azure-portal)

In this section, you create a virtual machine and public IP address in the Azure portal. During the public IP address configuration, you select **Internet** for routing preference.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the portal search box, enter **Virtual machine**. In the search results, select **Virtual machines**.

3. In **Virtual machines**, select **+ Create**, then **+ Virtual machine**.

4. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.</br> Enter **TutorVMRoutePref-rg**. Select **OK**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Zone options | Select **Self-selected zone**. |
    | Availability zone | Select **Zone 1**. |
    | Security type | Select **Standard**. |
    | Image | Select **Windows Server 2022 Datacenter: Azure Edition - x64 Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**.</br> _**Opening port 3389 from the internet is not recommended for production workloads**_. |

5. Select **Next: Disks** then **Next: Networking**, or select the **Networking** tab.

6. In the networking tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Leave the default of **(new) TutorVMRoutePref-rg-vnet**. |
    | Subnet | Leave the default of **(new) default (10.1.0.0/24)**. |
    | Public IP | Select **Create new**.</br> In **Name**, enter **myPublicIP**.</br> In **Routing preference**, select **Internet**.</br> In **Availability zone**, select **Zone 1**.</br> Select **OK**. |

7. Select **Review + create**.

8. Select **Create**.

# [Azure CLI](#tab/azure-cli)

In this section, you create a resource group, public IP address, and virtual machine using the Azure CLI. The public IP address created in the previous section is attached to the VM during creation.

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create) named **TutorVMRoutePref-rg** in the **westus2** location.

```azurecli-interactive
  az group create \
    --name TutorVMRoutePref-rg \
    --location westus2
```

## Create a public IP address

Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create a standard zone-redundant public IPv4 address named **myPublicIP** in **TutorVMRoutePref-rg**. The **Tag** of **Internet** is applied to the public IP address as a parameter in the CLI command enabling the **Internet** routing preference.

```azurecli-interactive
az network public-ip create \
    --resource-group TutorVMRoutePref-rg \
    --name myPublicIP \
    --version IPv4 \
    --ip-tags 'RoutingPreference=Internet' \
    --sku Standard \
    --zone 1 2 3
```

## Create virtual machine

Use [az vm create](/cli/azure/vm#az-vm-create) to create a virtual machine. The public IP address created in the previous section is added as part of the CLI command and is attached to the VM during creation.

```azurecli-interactive
az vm create \
--name myVM \
--resource-group TutorVMRoutePref-rg \
--public-ip-address myPublicIP \
--size Standard_D2a_v4 \
--image MicrosoftWindowsServer:WindowsServer:2019-Datacenter:latest \
--admin-username azureuser
```

# [Azure PowerShell](#tab/azure-powershell)

In this section, you create a resource group, public IP address, and virtual machine using Azure PowerShell. The public IP address created in the previous section is attached to the VM during creation.

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) named **TutorVMRoutePref-rg** in the **westus2** location.

```azurepowershell-interactive
New-AzResourceGroup -Name 'TutorVMRoutePref-rg' -Location 'westus2'

```

## Create a public IP address

Use [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) to create a standard zone-redundant public IPv4 address named **myPublicIP** in **TutorVMRoutePref-rg**. The **Tag** of **Internet** is applied to the public IP address as a parameter in the PowerShell command enabling the **Internet** routing preference.

```azurepowershell-interactive
## Create IP tag for Internet and Routing Preference. ##
$tag = @{
    IpTagType = 'RoutingPreference'
    Tag = 'Internet'   
}
$ipTag = New-AzPublicIpTag @tag

## Create IP. ##
$ip = @{
    Name = 'myPublicIP'
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Location = 'westus2'
    Sku = 'Standard'
    AllocationMethod = 'Static'
    IpAddressVersion = 'IPv4'
    IpTag = $ipTag
    Zone = 1,2,3   
}
New-AzPublicIpAddress @ip
```

## Create virtual machine

Use [New-AzVM](/powershell/module/az.compute/new-azvm) to create a virtual machine. The public IP address created in the previous section is added as part of the PowerShell command and is attached to the VM during creation.

```azurepowershell-interactive
## Create virtual machine. ##
$vm = @{
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Location = 'West US 2'
    Name = 'myVM'
    PublicIpAddressName = 'myPublicIP'
}
New-AzVM @vm
```

---

## Verify internet routing preference

# [Azure portal](#tab/azure-portal)

In this section, you search for the public IP address previously created and verify the internet routing preference using the Azure portal.

1. In the portal search box, enter **Public IP address**. In the search results, select **Public IP addresses**.

2. In **Public IP addresses**, select **myPublicIP**.

3. Select **Properties** in **Settings**.

4. Verify **Internet** is displayed in **Routing preference**. 

    :::image type="content" source="./media/tutorial-routing-preference-virtual-machine-portal/verify-routing-preference.png" alt-text="Screenshot of verify internet routing preference.":::

# [Azure CLI](#tab/azure-cli)

In this section, you use [az network public-ip show](/cli/azure/network/public-ip#az-network-public-ip-show) to verify that **Internet** routing preference is configured for the public IP address with the Azure CLI.

```azurecli-interactive
az network public-ip show \
    --resource-group TutorVMRoutePref-rg \
    --name myPublicIP \
    --query ipTags \
    --output tsv
```

# [Azure PowerShell](#tab/azure-powershell)

In this section, you use [Get-AzPublicIpAddress](/powershell/module/az.network/get-azpublicipaddress) to verify that **Internet** routing preference is configured for the public IP address with Azure PowerShell.

```azurepowershell-interactive
$ip = @{
    ResourceGroupName = 'TutorVMRoutePref-rg'
    Name = 'myPublicIP'
}  
Get-AzPublicIPAddress @ip | select -ExpandProperty IpTags

```

---

## Clean up resources

# [Azure portal](#tab/azure-portal)

If you're not going to continue to use this application, delete the public IP address with the following steps:

1. In the search box at the top of the portal, enter **Resource group**.

2. In the search results, select **Resource groups**.

3. Select **TutorVMRoutePref-rg**

4. Select **Delete resource group**.

5. Enter **myResourceGroup** for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

# [Azure CLI](#tab/azure-cli)

When you're done with the virtual machine and public IP address, delete the resource group and all of the resources it contains with [az group delete](/cli/azure/group#az-group-delete).

```azurecli-interactive
  az group delete \
    --name TutorVMRoutePref-rg
```

# [Azure PowerShell](#tab/azure-powershell)

When you're done with the virtual machine and public IP address, delete the resource group and all of the resources it contains with [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup).

```azurepowershell-interactive
Remove-AzResourceGroup -Name 'TutorVMRoutePref-rg'

```

---

## Next steps

Advance to the next article to learn how to create a virtual machine with mixed routing preference:
> [!div class="nextstepaction"]
> [Configure both routing preference options for a virtual machine](routing-preference-mixed-network-adapter-portal.md)

