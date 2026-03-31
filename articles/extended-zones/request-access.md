---
title: Request Access to Azure Extended Zones
description: Learn how to request and gain access to an Azure extended zone by using Azure PowerShell or the Azure CLI.
author: svaldesgzz
ms.author: svaldes
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 02/25/2026
---

# Request access to an Azure extended zone

To create Azure resources in Azure Extended Zones locations, you need to explicitly register your subscription with the respective Azure extended zone. You use a subscription owner account because this capability isn't enabled by default. After the subscription is registered with the Azure extended zone, you can create and manage resources within that specific Azure extended zone.

In this article, you learn how to request and gain access to an Azure extended zone by using PowerShell or the Azure CLI.

## Prerequisites

# [**PowerShell**](#tab/powershell)

- A billable Azure account.
- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the [Az.EdgeZones](/powershell/module/az.edgezones) module version 0.1.0 or later. Run the [Get-Module -ListAvailable Az.EdgeZones](/powershell/module/microsoft.powershell.core/get-module) cmdlet to find the installed version. Run the [Install-Module Az.EdgeZones](/powershell/module/powershellget/install-module) cmdlet to install the `Az.EdgeZones` module. If you run PowerShell locally, sign in to Azure by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- A billable Azure account.
- Azure Cloud Shell or the Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Cloud Shell](/azure/cloud-shell/overview). To run the commands in Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and then paste it into Cloud Shell to run it. You can also run Cloud Shell from within the Azure portal.

    You can also [install the Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the [edgezones](/cli/azure/edge-zones) extension, which is available in the Azure CLI version 2.57.0 or later. Run the [az --version](/cli/azure/reference-index#az-version) command to find the installed version. Run the [az extension add --name edgezones](/cli/azure/extension#az-extension-add) command to add the `edgezones` extension. If you run the Azure CLI locally, sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

---

## Register your subscription for the Microsoft.EdgeZones resource provider

In this section, you register the `Microsoft.EdgeZones` resource provider to your subscription.

# [**PowerShell**](#tab/powershell)

1. Use the [Select-AzContext](/powershell/module/az.accounts/select-azcontext) cmdlet to select the subscription for which you want to register Azure Extended Zones.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e'
    ```

1. Use the [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) cmdlet to register the `Microsoft.EdgeZones` resource provider.

    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.EdgeZones'
    ```

1. Use the [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) cmdlet to check the registration state.

    ```azurepowershell-interactive
    Get-AzResourceProvider –ProviderNamespace 'Microsoft.EdgeZones'
    ```

    Wait until the registration state becomes `Registered`. If it's still `PendingRegister`, attempting to show, list, register, or unregister the Azure extended zone fails.

# [**Azure CLI**](#tab/cli)

1. Use the [az account set](/cli/azure/account#az-account-set) command to select the subscription for which you want to register Azure Extended Zones.

    ```azurecli-interactive
    az account set --subscription 'aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e'
    ```

1. Use the [az provider register](/cli/azure/provider#az-provider-register) command to register the `Microsoft.EdgeZones` resource provider.

    ```azurecli-interactive
    az provider register --namespace 'Microsoft.EdgeZones'
    ```

1. Use the [az provider show](/cli/azure/provider#az-provider-show) command to check the registration state.

    ```azurecli-interactive
    az provider show --namespace 'Microsoft.EdgeZones'
    ```

    Wait until the registration state becomes `Registered`. If it's still `PendingRegister`, attempting to show, list, register, or unregister the Azure extended zone fails.

---

## Register for an Azure extended zone

To register for an Azure extended zone, select the subscription for which you want to register Azure Extended Zones, and specify the extended zone name.

> [!NOTE]
> The Azure account that you're using to register for Azure Extended Zones must be a billable account. To share your feedback or ask questions about Azure Extended Zones, contact [Azure Extended Zones support](mailto:aez-support@microsoft.com).

# [**PowerShell**](#tab/powershell)

1. Use the [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to list all the Azure extended zones that are available to your subscription.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone
    ```

1. Use the [Register-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/register-azedgezonesextendedzone) cmdlet to register for an Azure extended zone. The following example registers Los Angeles as an extended zone.

    ```azurepowershell-interactive
    Register-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

1. Use the [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to check the registration state of an Azure extended zone. The following example checks the registration state of the Los Angeles extended zone.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

    After your request is approved, the registration state becomes `Registered`.
    
    > [!NOTE]
    > You can't use an Azure extended zone until its registration state becomes `Registered`.

# [**Azure CLI**](#tab/cli)

1. Use the [az edge-zones extended-zone list](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-list) command to list all Azure extended zones that are available to your subscription.

    ```azurecli-interactive
    az edge-zones extended-zone list
    ```

1. Use the [az edge-zones extended-zone register](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-register) command to register for an Azure extended zone. The following example registers Los Angeles as an extended zone.

    ```azurecli-interactive
    az edge-zones extended-zone register --extended-zone-name 'losangeles'
    ```

1. Use the [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) command to check the registration state of an Azure extended zone. The following example checks the registration state of the Los Angeles extended zone.

    ```azurecli-interactive
    az edge-zones extended-zone show --extended-zone-name 'losangeles'
    ```

    After your request is approved, the registration state becomes `Registered`.
    
    > [!NOTE]
    > You can't use an Azure extended zone until its registration state becomes `Registered`.

---

## Unregister for an Azure extended zone

In this section, you learn how to unregister your subscription for an Azure extended zone.

# [**PowerShell**](#tab/powershell)

1. Use the [Unregister-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/unregister-azedgezonesextendedzone) cmdlet to unregister your subscription for an Azure extended zone. The following example unregisters Los Angeles as an extended zone.

    ```azurepowershell-interactive
    Unregister-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

1. Use the [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to check the registration state of an Azure extended zone. The following example checks the registration state of the Los Angeles extended zone.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

    > [!NOTE]
    > Unregistering an Azure extended zone shows the registration state as `PendingUnregister`. The extended zone stays in your subscription until the registration state becomes `NotRegistered`.

# [**Azure CLI**](#tab/cli)

1. Use the [az edge-zones extended-zone unregister](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-unregister) command to unregister your subscription for an Azure extended zone. The following example unregisters Los Angeles as an extended zone.

    ```azurecli-interactive
    az edge-zones extended-zone unregister --extended-zone-name 'losangeles'
    ```

1. Use the [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) command to check the registration state of an Azure extended zone. The following example checks the registration state of the Los Angeles extended zone.

    ```azurecli-interactive
    az edge-zones extended-zone show --extended-zone-name 'losangeles'
    ```

    > [!NOTE]
    > Unregistering an Azure extended zone shows the registration state as `PendingUnregister`. The extended zone stays in your subscription until the registration state becomes `NotRegistered`.

---

## Related content

- [Deploy a virtual machine in an extended zone](deploy-vm-portal.md)
- [Back up an Azure extended zone virtual machine](backup-virtual-machine.md)
- [Frequently asked questions](faq.md)
