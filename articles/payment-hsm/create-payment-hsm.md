---
title: Create an Azure Payment HSM with Azure Payment HSM
description: Create an Azure Payment HSM with Azure Payment HSM
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.topic: quickstart
ms.devlang: azurecli
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.date: 09/12/2022
---

# Tutorial: Create a payment HSM

Azure Payment HSM Service is a "BareMetal" service delivered using Thales payShield 10K payment hardware security modules (HSM) to provide cryptographic key operations for real-time, critical payment transactions in the Azure cloud. This article describes how to create an Azure Payment HSM with the host and management port in same virtual network.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a resource group
> * Create a virtual network and subnet for your payment HSM
> * Create a payment HSM
> * Retrieve information about your payment HSM

> [!NOTE]
> If you wish to reuse an existing VNet, verify that you have met all of the [Prerequisites](#prerequisites) and then read [How to reuse an existing virtual network](reuse-vnet.md).

## Prerequisites

[!INCLUDE [Specialized Service](../../includes/payment-hsm/specialized-service.md)]

# [Azure CLI](#tab/azure-cli)

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  > [!WARNING]
  > You must apply the "FastPathEnabled" feature flag to **every** subscription ID, and add the "fastpathenabled" tag to **every** virtual network. For more details, see [Fastpathenabled](fastpathenabled.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (You will find the output of this command more readable if you display it in table-format.)

  ```azurecli-interactive
  az provider show --namespace "Microsoft.HardwareSecurityModules" -o table
  
  az provider show --namespace "Microsoft.Network" -o table
  
  az feature registration show -n "FastPathEnabled"  --provider-namespace "Microsoft.Network" -o table
  
  az feature registration show -n "AzureDedicatedHsm"  --provider-namespace "Microsoft.HardwareSecurityModules" -o table
  ```

  You can continue with this quick start if all four of these commands return "Registered".
- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]  

# [Azure PowerShell](#tab/azure-powershell)

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  > [!WARNING]
  > You must apply the "FastPathEnabled" feature flag to **every** subscription ID, and add the "fastpathenabled" tag to **every** virtual network. For more details, see [Fastpathenabled](fastpathenabled.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure PowerShell [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "AzureDedicatedHsm" -ProviderNamespace Microsoft.HardwareSecurityModules

Get-AzProviderFeature -FeatureName "FastPathEnabled" -ProviderNamespace Microsoft.Network
```

  You can continue with this quick start if the "RegistrationState" of both commands returns "Registered".

- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.
  
[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]\

- You must install the Az.DedicatedHsm PowerShell module:

  ```azurepowershell-interactive
  Install-Module -Name Az.DedicatedHsm
  ```

---

## Create a resource group

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [Create a resource group with the Azure CLI](../../includes/cli-rg-create.md)]

# [Azure PowerShell](#tab/azure-powershell)

[!INCLUDE [Create a resource group with the Azure PowerShell](../../includes/powershell-rg-create.md)]

---

## Create a virtual network and subnet

# [Azure CLI](#tab/azure-cli)

Before creating a payment HSM, you must first create a virtual network and a subnet. To do so, use the Azure CLI [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create) command:

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

Make note of the subnet's ID, as you will need it for the next step.  The ID of the subnet will end with the name of the subnet:

```json
"id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

# [Azure PowerShell](#tab/azure-powershell)

Before creating a payment HSM, you must first create a virtual network and a subnet.

First, set some variables for use in the subsequent operations:

```azurepowershell-interactive
$VNetAddressPrefix = @("10.0.0.0/16")
$SubnetAddressPrefix = "10.0.0.0/24"
$tags = @{fastpathenabled="true"}
```

Use the Azure PowerShell [New-AzDelegation](/powershell/module/az.network/new-azdelegation) cmdlet to create a service delegation to be added to your subnet, and save the output to the `$myDelegation` variable:

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

Make note of the subnet's ID, as you will need it for the next step.  The ID of the subnet will end with the name of the subnet:

```json
"Id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

---

## Create a payment HSM

# [Azure CLI](#tab/azure-cli)

To create a payment HSM, use the [az dedicated-hsm create](/cli/azure/dedicated-hsm#az-dedicated-hsm-create) command. The following example creates a payment HSM named `myPaymentHSM` in the `eastus` region, `myResourceGroup` resource group, and specified subscription, virtual network, and subnet:

```azurecli-interactive
az dedicated-hsm create \
   --resource-group "myResourceGroup" \
   --name "myPaymentHSM" \
   --location "EastUS" \
   --subnet id="<subnet-id>" \
   --stamp-id "stamp1" \
   --sku "payShield10K_LMK1_CPS60" 
```

# [Azure PowerShell](#tab/azure-powershell)

To create a payment HSM, use the [New-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/new-azdedicatedhsm) cmdlet and the VNet ID from the previous step:

```azurepowershell-interactive
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "payShield10K_LMK1_CPS60" -StampId "stamp1" -SubnetId "<subnet-id>"
```

The output of the payment HSM creation will look like this:

```Output
Name  Provisioning State SKU                     Location
----  ------------------ ---                     --------
myHSM Succeeded          payShield10K_LMK1_CPS60 East US
```

---

## View your payment HSM

# [Azure CLI](#tab/azure-cli)

To see your payment HSM and its properties, use the Azure CLI [az dedicated-hsm show](/cli/azure/dedicated-hsm#az-dedicated-hsm-show) command.

```azurecli-interactive
az dedicated-hsm show --resource-group "myResourceGroup" --name "myPaymentHSM"
```

To list all of your payment HSMs, use the [az dedicated-hsm list](/cli/azure/dedicated-hsm#az-dedicated-hsm-list) command. (You will find the output of this command more readable if you display it in table-format.)

```azurecli-interactive
az dedicated-hsm list --resource-group "myResourceGroup" -o table
```

# [Azure PowerShell](#tab/azure-powershell)

To see your payment HSM and its properties, use the Azure PowerShell [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet.

```azurepowershell-interactive
Get-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroup "myResourceGroup"
```

To list all of your payment HSMs, use the [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet with no parameters.

To get more information on your payment HSM, you can use the [Get-AzResource](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet, specifying the resource group, and "Microsoft.HardwareSecurityModules/dedicatedHSMs" as the resource type:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName "myResourceGroup" -ResourceType "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

---

## Next steps

Advance to the next article to learn how to access the payShield manager for your payment HSM
> [!div class="nextstepaction"]
> [Access the payShield manager](access-payshield-manager.md)

Additional information:

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
