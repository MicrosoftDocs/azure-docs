---
title: 'Quickstart: Create and configure Azure DDoS Network Protection - Bicep'
description: Learn how to create and enable an Azure DDoS Protection plan using Bicep.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: quickstart
ms.workload: infrastructure-services
ms.custom: subject-armqs, mode-arm, ignite-2022, devx-track-bicep
ms.author: abell
ms.date: 10/12/2022
---

# Quickstart: Create and configure Azure DDoS Network Protection using Bicep

This quickstart describes how to use Bicep to create a distributed denial of service (DDoS) protection plan and virtual network (VNet), then enable the protection plan for the VNet. An Azure DDoS Network Protection plan defines a set of virtual networks that have DDoS protection enabled across subscriptions. You can configure one DDoS protection plan for your organization and link virtual networks from multiple subscriptions to the same plan.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/create-and-enable-ddos-protection-plans).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/create-and-enable-ddos-protection-plans/main.bicep":::

The Bicep file defines two resources:

- [Microsoft.Network/ddosProtectionPlans](/azure/templates/microsoft.network/ddosprotectionplans)
- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)

## Deploy the Bicep file

In this example, the Bicep file creates a new resource group, a DDoS protection plan, and a VNet.

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters ddosProtectionPlanName=<plan-name> virtualNetworkName=<network-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -ddosProtectionPlanName "<plan-name>" -virtualNetworkName "<network-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<plan-name\>** with a DDoS protection plan name. Replace **\<network-name\>** with a DDoS virtual network name.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

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

To learn how to view and configure telemetry for your DDoS protection plan, continue to the tutorials.

> [!div class="nextstepaction"]
> [View and configure DDoS protection telemetry](telemetry.md)
