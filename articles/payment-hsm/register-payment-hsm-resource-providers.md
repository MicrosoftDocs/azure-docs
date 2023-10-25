---
title: Register the Azure Payment HSM resource providers
description: Register the Azure Payment HSM resource providers
services: payment-hsm
author: msmbaldwin
ms.service: payment-hsm
ms.custom: devx-track-azurecli, devx-track-azurepowershell
ms.topic: overview
ms.date: 02/25/2023
ms.author: mbaldwin
---
# Register the Azure Payment HSM resource providers and resource provider features

Before using Azure Payment HSM, you must first register the Azure Payment HSM resource provider and the resource provider features. A resource provider is a service that supplies Azure resources.

## Register the resource providers and features

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI [az provider register](/cli/azure/provider#az-provider-register) command to register the Azure Payment HSM 'Microsoft.HardwareSecurityModules' resource provider, and the Azure CLI [az feature registration create](/cli/azure/feature/registration#az-feature-registration-create) command to register the "AzureDedicatedHsm" feature.  

```azurecli-interactive
az provider register --namespace "Microsoft.HardwareSecurityModules"

az feature registration create --namespace "Microsoft.HardwareSecurityModules" --name "AzureDedicatedHsm" 
```

You must also register the "Microsoft.Network" resource provider and the "FastPathEnabled" Azure Feature Exposure Control (AFEC) flag. For more information on the "FastPathEnabled" feature flag, see [Fathpathenabled](fastpathenabled.md).

```azurecli-interactive
az provider register --namespace "Microsoft.Network"

az feature registration create --namespace "Microsoft.Network" --name "FastPathEnabled" 
```

> [!IMPORTANT]
> After registering the "FastPathEnabled" feature flag, you **must** contact the [Azure Payment HSM support team](support-guide.md#microsoft-support) team to have your registration approved.  In your message to Microsoft support, include your subscription ID.  If multiple subsciptions must connect with the payment HSM, you must include **all** the subscriopts IDs.

You can verify that your registrations are complete with the Azure CLI [az provider show](/cli/azure/provider#az-provider-show) command. (You will find the output of this command more readable if you display it in table-format.)

```azurecli-interactive
az provider show --namespace "Microsoft.HardwareSecurityModules" -o table

az provider show --namespace "Microsoft.Network" -o table

az feature registration show -n "FastPathEnabled"  --provider-namespace "Microsoft.Network" -o table

az feature registration show -n "AzureDedicatedHsm"  --provider-namespace "Microsoft.HardwareSecurityModules" -o table
```

# [Azure PowerShell](#tab/azure-powershell)

Use the Azure PowerShell [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) cmdlet to register the "Microsoft.HardwareSecurityModules" resource provider and the "AzureDedicatedHsm" feature.  

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.HardwareSecurityModules

Register-AzProviderFeature -FeatureName "AzureDedicatedHsm" -ProviderNamespace Microsoft.HardwareSecurityModules
```

You must also register the "Microsoft.Network" resource provider and the "FastPathEnabled" Azure Feature Exposure Control (AFEC) flag. For more information on the "FastPathEnabled" feature flag, see [Fathpathenabled](fastpathenabled.md).

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Network

Register-AzProviderFeature -FeatureName "FastPathEnabled" -ProviderNamespace Microsoft.Network
```

> [!IMPORTANT]
> After registering the "FastPathEnabled" feature flag, you **must** contact the [Azure Payment HSM support team](support-guide.md#microsoft-support) team to have your registration approved.  In your message to Microsoft support, include the subscription IDs of **every** subscription you want to connect to the payment HSM.

You can verify that your registrations are complete with the Azure PowerShell [Get-AzProviderFeature](/powershell/module/az.resources/get-azproviderfeature) cmdlet:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName "AzureDedicatedHsm" -ProviderNamespace Microsoft.HardwareSecurityModules

Get-AzProviderFeature -FeatureName "FastPathEnabled" -ProviderNamespace Microsoft.Network
```

---

## Next Steps

- Learn more about [Azure Payment HSM](overview.md)
- Find out how to [get started with Azure Payment HSM](getting-started.md)
- Learn how to [Create a payment HSM](create-payment-hsm.md)
- Read the [frequently asked questions](faq.yml)
