---
title: Quickstart - Create an Azure Payment HSM with Azure PowerShell
description: Create, show, list, update, and delete Azure Payment HSMs by using Azure PowerShell
services: payment-hsm
ms.service: payment-hsm
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/12/2022
ms.topic: quickstart
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell
---

# Quickstart: Create an Azure Payment HSM with Azure PowerShell

[!INCLUDE [Payment HSM intro](./includes/about-payment-hsm.md)]

This quickstart describes how you can create an Azure Payment HSM using the [Az.DedicatedHsm](/powershell/module/az.dedicatedhsm) PowerShell module.

## Prerequisites

[!INCLUDE [Specialized service](../../includes/payment-hsm/specialized-service.md)]

- You must register the "Microsoft.HardwareSecurityModules" and "Microsoft.Network" resource providers, as well as the Azure Payment HSM features. Steps for doing so are at [Register the Azure Payment HSM resource provider and resource provider features](register-payment-hsm-resource-providers.md).

  > [!WARNING]
  > You must apply the "FastPathEnabled" feature flag to **every** subscription ID, and add the "fastpathenabled" tag to **every** virtual network. For more information, see [Fastpathenabled](fastpathenabled.md).

  To quickly ascertain if the resource providers and features are already registered, use the Azure PowerShell [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "AzureDedicatedHsm" -ProviderNamespace Microsoft.HardwareSecurityModules

Get-AzProviderFeature -FeatureName "FastPathEnabled" -ProviderNamespace Microsoft.Network
```

You can continue with this quick start if the "RegistrationState" of both commands returns "Registered".

- You must have an Azure subscription. You can [create a free account](https://azure.microsoft.com/free/) if you don't have one.
  
    If you have more than one Azure subscription, set the subscription to use for billing with the Azure PowerShell [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.
  
    ```azurepowershell-interactive
    Set-AzContext -Subscription "<subscription-id>"
    ```

[!INCLUDE [azure-powershell-requirements-no-header.md](../../includes/azure-powershell-requirements-no-header.md)]

- You must install the Az.DedicatedHsm PowerShell module:

  ```azurepowershell-interactive
  Install-Module -Name Az.DedicatedHsm
  ```

## Create a resource group

[!INCLUDE [Create a resource group with the Azure PowerShell](../../includes/powershell-rg-create.md)]

## Create a virtual network and subnet

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

Make note of the value returned as `Id`, as it is used in the next step.  The `Id` is in the format:

```json
"Id": "/subscriptions/<subscriptionID>/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVNet/subnets/myPHSMSubnet",
```

## Create a payment HSM

To create a payment HSM, use the [New-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/new-azdedicatedhsm) cmdlet and the VNet ID from the previous step:

```azurepowershell-interactive
New-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "payShield10K_LMK1_CPS60" -StampId "stamp1" -SubnetId "<subnet-id>"
```

The output of payment HSM creation looks like this:

```Output
Name  Provisioning State SKU                     Location
----  ------------------ ---                     --------
myHSM Succeeded          payShield10K_LMK1_CPS60 East US
```

## Get a payment HSM

To see your payment HSM and its properties, use the Azure PowerShell [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet.

```azurepowershell-interactive
Get-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroup "myResourceGroup"
```

To list all of your payment HSMs, use the [Get-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet with no parameters.

To get more information on your payment HSM, you can use the [Get-AzResource](/powershell/module/az.dedicatedhsm/get-azdedicatedhsm) cmdlet, specifying the resource group, and "Microsoft.HardwareSecurityModules/dedicatedHSMs" as the resource type:

```azurepowershell-interactive
Get-AzResource -ResourceGroupName "myResourceGroup" -ResourceType "Microsoft.HardwareSecurityModules/dedicatedHSMs"
```

## Remove a payment HSM

To remove your payment HSM, use the Azure PowerShell [Remove-AzDedicatedHsm](/powershell/module/az.dedicatedhsm/remove-azdedicatedhsm) cmdlet. The following example deletes the `myPaymentHSM` payment HSM from the `myResourceGroup` resource group:

```azurepowershell-interactive
Remove-AzDedicatedHsm -Name "myPaymentHSM" -ResourceGroupName "myResourceGroup"
```

## Delete the resource group

[!INCLUDE [Delete a resource group with Azure PowerShell](../../includes/powershell-rg-delete.md)]

## Next steps

In this quickstart, you created a payment HSM, viewed and updated its properties, and deleted it. To learn more about Payment HSM and how to integrate it with your applications, continue on to these articles.

- Read an [Overview of Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- See some common [deployment scenarios](deployment-scenarios.md)
- Learn about [Certification and compliance](certification-compliance.md)
- Read the [frequently asked questions](faq.yml)
