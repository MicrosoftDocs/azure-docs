---
title: Request access to Azure Extended Zones
description: Learn how to request and gain access to Azure Extended Zone using PowerShell or Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure-extended-zones
ms.topic: how-to
ms.date: 08/02/2024
---

# Request access to an Azure Extended Zone

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

To create Azure resources in Azure Extended Zone locations, you need to explicitly register your subscription with the respective Azure Extended Zone, using an account that is a subscription owner, as this capability isn't enabled by default. Once the subscription is registered with the Azure Extended Zone, you can create and manage resources within that specific Azure Extended Zone.

In this article, you learn how to request and gain access to an Azure Extended Zone using PowerShell or Azure CLI.

## Prerequisites

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the [Az.EdgeZones](/powershell/module/az.edgezones) module version 0.1.0 or later. Run [Get-Module -ListAvailable Az.EdgeZones](/powershell/module/microsoft.powershell.core/get-module) cmdlet to find the installed version. Run [Install-Module Az.EdgeZones](/powershell/module/powershellget/install-module) cmdlet to install **Az.EdgeZones** module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the [edgezones](/cli/azure/edge-zones) extension, which is available in Azure CLI version 2.57.0 or higher. Run [az --version](/cli/azure/reference-index#az-version) command to find the installed version. Run [az extension add --name edgezones](/cli/azure/extension#az-extension-add) command to add **edgezones** extension. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Register your subscription for resource provider Microsoft.EdgeZones

In this section, you register resource provider **Microsoft.EdgeZones** to your subscription.

# [**PowerShell**](#tab/powershell)

1. Use [Select-AzContext](/powershell/module/az.accounts/select-azcontext) cmdlet to select the subscription that you want to register Azure Extended Zones for.

    ```azurepowershell-interactive
    Set-AzContext -SubscriptionId '00000000-0000-0000-0000-000000000000'
    ```

1. Use [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider) cmdlet to register Microsoft.EdgeZones resource provider.

    ```azurepowershell-interactive
    Register-AzResourceProvider -ProviderNamespace 'Microsoft.EdgeZones'
    ```

1. Use [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider) cmdlet to check the registration state. 

    ```azurepowershell-interactive
    Get-AzResourceProvider –ProviderNamespace 'Microsoft.EdgeZones'
    ```

    You should wait until the registration state becomes `Registered`. If it's still `PendingRegister`, attempting to show, list, register, and unregister the Azure Extended Zones will fail.

# [**Azure CLI**](#tab/cli)

1. Use [az account set](/cli/azure/account#az-account-set) command to select the subscription that you want to register Azure Extended Zones for.

    ```azurecli-interactive
    az account set --subscription '00000000-0000-0000-0000-000000000000'
    ```

1. Use [az provider register](/cli/azure/provider#az-provider-register) command to register Microsoft.EdgeZones resource provider.

    ```azurecli-interactive
    az provider register --namespace 'Microsoft.EdgeZones'
    ```

1. Use [az provider show](/cli/azure/provider#az-provider-show) command to check the registration state. 

    ```azurecli-interactive
    az provider show --namespace 'Microsoft.EdgeZones'
    ```

    You should wait until the registration state becomes `Registered`. If it's still `PendingRegister`, attempting to show, list, register, and unregister the Azure Extended Zones will fail.

---

## Register for an Azure Extended Zone

To register for an Azure Extended Zone, you must select the subscription that you wish to register Azure Extended Zones for and specify the Extended Zone name.

# [**PowerShell**](#tab/powershell)

1. Use [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to list all Azure Extended Zones available to your subscription.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone
    ```

1. Use [Register-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/register-azedgezonesextendedzone) cmdlet to register for an Azure Extended Zone. The following example registers for Los Angeles as an Extended Zone.

    ```azurepowershell-interactive
    Register-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

1. Use [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to check the registration state of an Azure Extended Zone. The following example checks the registration state of the Extended Zone Los Angeles.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

    Once your request is approved, the registration state becomes `Registered`.
    
    > [!NOTE]
    > You can't use an Azure Extended Zone until its registration state becomes `Registered`.

# [**Azure CLI**](#tab/cli)

1. Use [az edge-zones extended-zone list](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-list) command to list all Azure Extended Zones available to your subscription.

    ```azurecli-interactive
    az edge-zones extended-zone list
    ```

1. Use [az edge-zones extended-zone register](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-register) command to register for an Azure Extended Zone. The following example registers for Los Angeles as an Extended Zone.

    ```azurecli-interactive
    az edge-zones extended-zone register --extended-zone-name 'losangeles'
    ```

1. Use [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) command to check the registration state of an Azure Extended Zone. The following example checks the registration state of the Extended Zone Los Angeles.

    ```azurecli-interactive
    az edge-zones extended-zone show --extended-zone-name 'losangeles'
    ```

    Once your request is approved, the registration state becomes `Registered`.
    
    > [!NOTE]
    > You can't use an Azure Extended Zone until its registration state becomes `Registered`.

---

## Unregister for an Azure Extended Zone

In this section, you learn how to unregister your subscription for an Azure Extended Zone.

# [**PowerShell**](#tab/powershell)

1. Use [Unregister-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/unregister-azedgezonesextendedzone) cmdlet to unregister your subscription for an Azure Extended Zone. The following example unregisters for Los Angeles as an Extended Zone.

    ```azurepowershell-interactive
    Unregister-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

1. Use [Get-AzEdgeZonesExtendedZone](/powershell/module/az.edgezones/get-azedgezonesextendedzone) cmdlet to check the registration state of an Azure Extended Zone. The following example checks the registration state of the Extended Zone Los Angeles.

    ```azurepowershell-interactive
    Get-AzEdgeZonesExtendedZone -Name 'losangeles'
    ```

    > [!NOTE]
    > Unregistering an Azure Extended Zone will show registration state as `PendingUnregister`.  The Extended Zone stays in your subscription until the registration state becomes `NotRegistered`.

# [**Azure CLI**](#tab/cli)

1. Use [az edge-zones extended-zone unregister](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-unregister) command to unregister your subscription for an Azure Extended Zone. The following example unregisters for Los Angeles as an Extended Zone.

    ```azurecli-interactive
    az edge-zones extended-zone unregister --extended-zone-name 'losangeles'
    ```

1. Use [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) command to check the registration state of an Azure Extended Zone. The following example checks the registration state of the Extended Zone Los Angeles.

    ```azurecli-interactive
    az edge-zones extended-zone show --extended-zone-name 'losangeles'
    ```

    > [!NOTE]
    > Unregistering an Azure Extended Zone will show registration state as `PendingUnregister`.  The Extended Zone stays in your subscription until the registration state becomes `NotRegistered`.

---

## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Back up an Azure Extended Zone virtual machine](backup-virtual-machine.md)
- [Frequently asked questions](faq.md)
