---
title: Request access to Azure Extended Zones
description: Learn how to request and gain access to Azure Extended Zone using PowerShell or Azure CLI.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: how-to
ms.date: 07/12/2024

---

# Request access to Azure Extended Zones

> [!IMPORTANT]
> Azure Extended Zones service is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

In this article, you learn how to request and gain access to Azure Extended Zone using PowerShell or Azure CLI.

## Prerequisites

# [**PowerShell**](#tab/powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure PowerShell.

    The steps in this article run the Azure PowerShell cmdlets interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the cmdlets in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code and then paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) to run the cmdlets. This article requires the [Az.EdgeZones](/powershell/module/az.edgezones) module version 0.1.0 or later. Run [Get-Module -ListAvailable Az.EdgeZones](/powershell/module/microsoft.powershell.core/get-module) to find the installed version. Run [Install-Module -Name Az.EdgeZones](/powershell/module/powershellget/install-module) to install Az.EdgeZones module. If you run PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

# [**Azure CLI**](#tab/cli)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Azure Cloud Shell or Azure CLI.

    The steps in this article run the Azure CLI commands interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To run the commands in the Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block. Select **Copy** to copy the code, and paste it into Cloud Shell to run it. You can also run the Cloud Shell from within the Azure portal.

    You can also [install Azure CLI locally](/cli/azure/install-azure-cli) to run the commands. This article requires the [edgezones](/cli/azure/edge-zones) extension which is available in Azure CLI version 2.57.0 or higher. Run [az --version](/cli/azure/reference-index#az-version) command to find the installed version. If you run Azure CLI locally, sign in to Azure using the [az login](/cli/azure/reference-index#az-login) command.

---

## Register your subscription for resource provider Microsoft.EdgeZones

In this section, you register resource provider **Microsoft.EdgeZones** to your subscription.

# [**PowerShell**](#tab/powershell)

# [**Azure CLI**](#tab/cli)

Use [az account set](/cli/azure/account#az-account-set) to select the subscription that you want to register Azure Extended Zones for.

```azurecli-interactive
az account set --subscription '00000000-0000-0000-0000-000000000000'
```
Use [az provider register](/cli/azure/provider#az-provider-register) to register Microsoft.EdgeZones resource provider.

```azurecli-interactive
az provider register --namespace 'Microsoft.EdgeZones'
```

Use [az provider show](/cli/azure/provider#az-provider-show) to check the registration state. 

```azurecli-interactive
az provider show --namespace 'Microsoft.EdgeZones'
```

You should wait until the registration state becomes `Registered`. If it is still `PendingRegister`, attempting to show, list, register, and unregister the Azure Extended Zones will fail.

---

## Register for an Azure Extended Zone

To register for an Azure Extended Zone, you must select the subscription that you wish to register Azure Extended Zones for and specify the Extended Zone name.

# [**PowerShell**](#tab/powershell)

# [**Azure CLI**](#tab/cli)

Use [az edge-zones extended-zone list](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-list) to list all Azure Extended Zones available to your subscription.

```azurecli-interactive
az edge-zones extended-zone list
```

Use [az edge-zones extended-zone register](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-register) to register for an Azure Extended Zone. The following example registers for Los Angeles as an Extended Zone.

```azurecli-interactive
az edge-zones extended-zone register --extended-zone-name 'losangeles'
```

Use [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) to check the registration state of an Azure Extended Zone. The following example uses Los Angeles as an Extended Zone.

```azurecli-interactive
az edge-zones extended-zone show --extended-zone-name 'losangeles'
```

Once your request is approved, the registration state becomes `Registered`.

> [!NOTE]
> You can't use an Azure Extended Zone until its registration state becomes `Registered`.

---

## ## Register for an Azure Extended Zone

In this section, you learn how to unregister your subscription for an Azure Extended Zone.

# [**PowerShell**](#tab/powershell)

# [**Azure CLI**](#tab/cli)

Use [az edge-zones extended-zone unregister](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-unregister) to unregister your subscription for an Azure Extended Zone. The following example registers for Los Angeles as an Extended Zone.

```azurecli-interactive
az edge-zones extended-zone unregister --extended-zone-name 'losangeles'
```

Use [az edge-zones extended-zone show](/cli/azure/edge-zones/extended-zone#az-edge-zones-extended-zone-show) to check the registration state of an Azure Extended Zone. The following example uses Los Angeles as an Extended Zone.

```azurecli-interactive
az edge-zones extended-zone show --extended-zone-name 'losangeles'
```

> [!NOTE]
> Unregistering an Azure Extended Zone will show registration state as `PendingUnregister`.  The Extended Zone stays in your subscription until the registration state becomes `NotRegistered`.


---


## Related content

- [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
- [Deploy an AKS cluster in an Extended Zone](deploy-aks-cluster.md)
- [Frequently asked questions](faq.md)
