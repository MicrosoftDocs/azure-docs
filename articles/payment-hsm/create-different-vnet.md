---
title: Create an Azure Payment HSM with host and management port in different VNets using CLI or PowerShell
description: Create an Azure Payment HSM with host and management port in different VNets using CLI or PowerShell
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: tutorial
ms.custom: devx-track-azurepowershell, devx-track-arm-template, devx-track-azurecli
ms.date: 05/25/2023
---

# Tutorial: Create a payment HSM with host and management port in different virtual networks using ARM template

[!INCLUDE [Payment HSM intro](./includes/about-payment-hsm.md)]

This tutorial describes how to create a payment HSM with the host and management port in different virtual networks, using Azure CLI or Azure PowerShell.  You can instead:
- [Create a payment HSM with the host and management port in the same virtual network using Azure CLI or PowerShell](create-payment-hsm.md)
- [Create a payment HSM with the host and management port in the same virtual network using an ARM template](quickstart-template.md)
- [Create a payment HSM with the host and management port in different virtual networks using an ARM template](create-different-vnet-template.md)
- [Create HSM resource with host and management port with IP addresses in different virtual networks using ARM template](create-different-ip-addresses.md)

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

[!INCLUDE [Specialized service](./includes/specialized-service.md)]

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (The output of this command is more readable when displayed in table-format.)

  ```azurecli-interactive
  az provider show --namespace "Microsoft.HardwareSecurityModules" -o table
  
  az provider show --namespace "Microsoft.Network" -o table
  
  az feature registration show -n "FastPathEnabled"  --provider-namespace "Microsoft.Network" -o table
  
  az feature registration show -n "AzureDedicatedHsm"  --provider-namespace "Microsoft.HardwareSecurityModules" -o table
  ```

  You can continue with this quick start if all four of these commands return "Registered".
- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.

[!INCLUDE [Azure CLI prepare your environment](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

---

## Create a resource group

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [Create a resource group with the Azure CLI](../../includes/cli-rg-create.md)]

# [Azure PowerShell](#tab/azure-powershell)

[!INCLUDE [Create a resource group with the Azure PowerShell](../../includes/powershell-rg-create.md)]

---

## Create virtual networks and subnets

Before creating a payment HSM, you must first create a virtual network / subnet for the host, and a different virtual network / subnet for the management port.

# [Azure CLI](#tab/azure-cli)

First, use the Azure CLI [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) command to create the virtual network for the host:

```azurecli-interactive
az network vnet create -g "myResourceGroup" -n "myVNet" --address-prefixes "10.0.0.0/16" --tags "fastpathenabled=True" --subnet-name "myPHSMSubnet" --subnet-prefix "10.0.0.0/24"
```

Afterward, use the Azure CLI [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) command to update the subnet and give it a delegation of "Microsoft.HardwareSecurityModules/dedicatedHSMs":

```azurecli-interactive
az network vnet subnet update -g "myResourceGroup" --vnet-name "myVNet" -n "myPHSMSubnet" --delegations "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

To verify that the VNet and subnet were created correctly, use the Azure CLI [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show) command:

```azurecli-interactive
az network vnet subnet show -g "myResourceGroup" --vnet-name "myVNet" -n myPHSMSubnet
```

Make note of the host's subnet ID, which is used when creating the payment HSM.  The ID of the subnet ends with the name of the subnet:

```json
"id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

Now create another virtual network and subnet for the management port:

```azurecli-interactive
az network vnet create -g "myResourceGroup" -n "myManagementVNet" --address-prefixes "10.1.0.0/16" --tags "fastpathenabled=True" --subnet-name "myManagementSubnet" --subnet-prefix "10.1.0.0/24"
```

Again, use the Azure CLI [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update) command to update the subnet and give it a delegation of "Microsoft.HardwareSecurityModules/dedicatedHSMs":

```azurecli-interactive
az network vnet subnet update -g "myResourceGroup" --vnet-name "myManagementVNet" -n "myManagementSubnet" --delegations "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

To verify that the management VNet and subnet were created correctly, use the Azure CLI [az network vnet subnet show](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-show) command:

```azurecli-interactive
az network vnet subnet show -g "myResourceGroup" --vnet-name "myManagementVNet" -n "myManagementSubnet"
```

You also need the management's subnet ID when creating the payment HSM.

# [Azure PowerShell](#tab/azure-powershell)

First, set some variables for use in creating the host VNet / subnet:

```azurepowershell-interactive
$VNetAddressPrefix = @("10.0.0.0/16")
$SubnetAddressPrefix = "10.0.0.0/24"
$tags = @{fastpathenabled="true"}
```

Use the Azure PowerShell [New-AzDelegation](/powershell/module/az.network/new-azdelegation) cmdlet to create a service delegation to be added to your host subnet, and save the output to the `$myDelegation` variable:

```azurepowershell-interactive
$myDelegation = New-AzDelegation -Name "myHSMDelegation" -ServiceName "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

Use the Azure PowerShell [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet to create a virtual network subnet configuration, and save the output to the `$myPHSMSubnet` variable:

```azurepowershell-interactive
$myPHSMSubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "myPHSMSubnet" -AddressPrefix $SubnetAddressPrefix -Delegation $myDelegation
```

> [!NOTE]
> The New-AzVirtualNetworkSubnetConfig cmdlet will generate a warning, which you can safely ignore.

To create an Azure Virtual Network, use the Azure PowerShell [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
New-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup" -Location "EastUS" -Tag $tags -AddressPrefix $VNetAddressPrefix -Subnet $myPHSMSubnetConfig
```

To verify that the VNet was created correctly, use the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
Get-AzVirtualNetwork -Name "myVNet" -ResourceGroupName "myResourceGroup"
```

Make note of the subnet's ID, which is used in the next step.  The ID of the subnet ends with the name of the subnet:

```json
"Id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

Now create another virtual network and subnet for the management port. First, set new variables:

```azurepowershell-interactive
$ManagementVNetAddressPrefix = @("10.1.0.0/16")
$ManagementSubnetAddressPrefix = "10.1.0.0/24"
$myManagementSubnetConfig = New-AzVirtualNetworkSubnetConfig -Name "myManagementSubnet" -AddressPrefix $ManagementSubnetAddressPrefix -Delegation $myDelegation
```

Use the Azure PowerShell [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) cmdlet to create the management virtual network and subnet:

```azurepowershell-interactive
New-AzVirtualNetwork -Name "myManagementVNet" -ResourceGroupName "myResourceGroup" -Location "EastUS" -Tag $tags -AddressPrefix $ManagementVNetAddressPrefix -Subnet $myManagementSubnetConfig
```

To verify that the VNet was created correctly, use the Azure PowerShell [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) cmdlet:

```azurepowershell-interactive
Get-AzVirtualNetwork -Name "myManagementVNet" -ResourceGroupName "myResourceGroup"
```

You also need the management's subnet ID when creating the payment HSM.

---

## Create a payment HSM

### Create with dynamic hosts

# [Azure CLI](#tab/azure-cli)

To create a payment HSM with dynamic hosts, use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az-dedicated-hsm-create) command. The following example creates a payment HSM named `myPaymentHSM` in the `eastus` region, `myResourceGroup` resource group, and specified subscription, virtual network, and subnet:

```azurecli-interactive
az dedicated-hsm create \
  --resource-group "myResourceGroup" \
  --name "myPaymentHSM" \
  --location "EastUS" \
  --subnet id="<host-subnet-id>" \
  --stamp-id "stamp1" \
  --sku "payShield10K_LMK1_CPS60" \
  --mgmt-network-subnet id="<management-subnet-id>"

```

To see the newly created network interfaces, use the [az network nic list](/cli/azure/network/nic#az-network-nic-list) command, providing the resource group:

```azurecli-interactive
az network nic list -g myResourceGroup -o table
```

In the output, host 1 and host 2 are listed, as well as a management interface:

```bash
...  Name                      NicType    Primary    ProvisioningState    ResourceGroup    ...
---  ------------------------  ---------  ---------  -------------------  ---------------  ---
...  myPaymentHSM_HSMHost1Nic  Standard   True       Succeeded            myResourceGroup  ...
...  myPaymentHSM_HSMHost2Nic  Standard   True       Succeeded            myResourceGroup  ...
...  myPaymentHSM_HSMMgmtNic   Standard   True       Succeeded            myResourceGroup  ...
```

To see the newly created network interfaces, use the [az network nic show](/cli/azure/network/nic#az-network-nic-show) command, providing the resource group and name of the network interface:

```azurecli-interactive
 az network nic show -g myresourcegroup -n myPaymentHSM_HSMHost1Nic
```

The output contains this line:

```json
  "privateIPAllocationMethod": "Dynamic",
```

# [Azure PowerShell](#tab/azure-powershell)

To create a payment HSM with dynamic hosts, use the [New-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/new-azdedicatedhsm) cmdlet and the VNet ID from the previous step:

```azurepowershell-interactive
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "payShield10K_LMK1_CPS60" -StampId "stamp1" -SubnetId "<subnet-id>" -ManagementSubnetId "<ManagementSubnetId>"
```

The output of the payment HSM creation looks like this:

```Output
Name  Provisioning State SKU                     Location
----  ------------------ ---                     --------
myHSM Succeeded          payShield10K_LMK1_CPS60 East US
```

To see the newly created network interfaces, use the [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) cmdlet, providing the resource group:

```azurecli-interactive
Get-AzNetworkInterface -ResourceGroupName myResourceGroup | Format-Table
```

In the output, host 1 and host 2 are listed, as well as the management interface:

```bash
ResourceGroupName Name                     Location ...
----------------- ----                     -------- ---
myResourceGroup   myPaymentHSM_HSMHost1Nic eastus   ...
myResourceGroup   myPaymentHSM_HSMHost2Nic eastus   ...
myResourceGroup   myPaymentHSM_HSMMgmtNic  eastus   ...
```

The Azure portal shows the "Private IP allocation method" as "Dynamic":

:::image type="content" source="./media/nic-dynamic.png" alt-text="Azure portal screenshot showing a network interface with a private IP allocation method of 'dynamic'." lightbox="./media/nic-dynamic.png":::

---

### Create with static hosts

# [Azure CLI](#tab/azure-cli)

To create a payment HSM with static hosts, use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az-dedicated-hsm-create) command. The following example creates a payment HSM named `myPaymentHSM` in the `eastus` region, `myResourceGroup` resource group, and specified subscription, virtual network, and subnet:

```azurecli-interactive
az dedicated-hsm create \
  --resource-group "myResourceGroup" \
  --name "myPaymentHSM" \
  --location "EastUS" \
  --subnet id="<subnet-id>" \
  --stamp-id "stamp1" \
  --sku "payShield10K_LMK1_CPS60" \
  --mgmt-network-subnet id="<management-subnet-id>"
  --network-interfaces private-ip-address='("10.0.0.5", "10.0.0.6")
```

If you wish to also specify a static IP for the management host, you can add:

```azurecli-interactive
  --mgmt-network-interfaces private-ip-address="10.0.0.7"
```

To see the newly created network interfaces, use the [az network nic list](/cli/azure/network/nic#az-network-nic-list) command, providing the resource group:

```azurecli-interactive
az network nic list -g myResourceGroup -o table
```

In the output, host 1 and host 2 are listed, as well as the management interface:

```bash
...  Name                      NicType    Primary    ProvisioningState    ResourceGroup    ...
---  ------------------------  ---------  ---------  -------------------  ---------------  ---
...  myPaymentHSM_HSMHost1Nic  Standard   True       Succeeded            myResourceGroup  ...
...  myPaymentHSM_HSMHost2Nic  Standard   True       Succeeded            myResourceGroup  ...
...  myPaymentHSM_HSMMgmtNic   Standard   True       Succeeded            myResourceGroup  ...
```

To view the properties of a network interface, use the [az network nic show](/cli/azure/network/nic#az-network-nic-show) command, providing the resource group and name of the network interface:

```azurecli-interactive
 az network nic show -g myresourcegroup -n myPaymentHSM_HSMHost1Nic
```

The output contains this line:

```json
  "privateIPAllocationMethod": "Static",
```

# [Azure PowerShell](#tab/azure-powershell)

To create a payment HSM with static hosts, use the [New-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/new-azdedicatedhsm) cmdlet and the VNet ID from the previous step:

```azurepowershell-interactive
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "payShield10K_LMK1_CPS60" -StampId "stamp1" -SubnetId "<host-subnet-id>" -NetworkInterface (@{PrivateIPAddress = '10.0.0.5'}, @{PrivateIPAddress = '10.0.0.6'}) -ManagementNetworkInterface @{PrivateIPAddress = '10.1.0.5'} -ManagementSubnetId "<management-subnet-id>"
```

The output of the payment HSM creation looks like this:

```Output
Name  Provisioning State SKU                     Location
----  ------------------ ---                     --------
myHSM Succeeded          payShield10K_LMK1_CPS60 East US
```

To see the newly created network interfaces, use the [Get-AzNetworkInterface](/powershell/module/az.network/get-aznetworkinterface) cmdlet, providing the resource group:

```azurecli-interactive
Get-AzNetworkInterface -ResourceGroupName myResourceGroup | Format-Table
```

In the output, host 1 and host 2 are listed, as well as the management interface:

```bash
ResourceGroupName Name                     Location ...
----------------- ----                     -------- ---
myResourceGroup   myPaymentHSM_HSMHost1Nic eastus   ...
myResourceGroup   myPaymentHSM_HSMHost2Nic eastus   ...
myResourceGroup   myPaymentHSM_HSMMgmtNic  eastus   ...
```

The Azure portal shows the "Private IP allocation method" as "Static":

:::image type="content" source="./media/nic-static.png" alt-text="Azure portal screenshot showing a network interface with a private IP allocation method of 'static'." lightbox="./media/nic-static.png":::

---

## Next steps

Advance to the next article to learn how to view your payment HSM.
> [!div class="nextstepaction"]
> [View your payment HSMs](view-payment-hsms.md)

Additional information:

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
