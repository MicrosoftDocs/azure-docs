---
title: 'Quickstart: Create an Azure DNS zone and record - Bicep'
titleSuffix: Azure DNS
description: Learn how to create a DNS zone and record in Azure DNS. This is a step-by-step quickstart to create and manage your first DNS zone and record using Bicep.
services: dns
author: greg-lindsay
ms.author: greglin
ms.date: 09/27/2022
ms.topic: quickstart
ms.service: dns
ms.custom: subject-armqs, mode-arm, devx-track-bicep
#Customer intent: As an administrator or developer, I want to learn how to configure Azure DNS using Bicep so I can use Azure DNS for my name resolution.
---

# Quickstart: Create an Azure DNS zone and record using Bicep

This quickstart describes how to use Bicep to create a DNS zone with an `A` record in it.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azure-dns-new-zone).

In this quickstart, you'll create a unique DNS zone with a suffix of `azurequickstart.org`. An `A` record pointing to two IP addresses will also be placed in the zone.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azure-dns-new-zone/main.bicep":::

Two Azure resources have been defined in the Bicep file:

- [**Microsoft.Network/dnsZones**](/azure/templates/microsoft.network/dnsZones)
- [**Microsoft.Network/dnsZones/A**](/azure/templates/microsoft.network/dnsZones/A): Used to create an `A` record in the zone.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep
    ```

    ---

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a:

- DNS zone
- `A` record
