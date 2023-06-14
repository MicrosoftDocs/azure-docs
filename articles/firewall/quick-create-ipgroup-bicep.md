---
title: 'Quickstart: Create an Azure Firewall and IP Groups - Bicep'
description: In this quickstart, you learn how to use a Bicep file to create an Azure Firewall and IP Groups.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: quickstart
ms.custom: subject-bicepqs, mode-arm, devx-track-bicep
ms.date: 08/25/2022
ms.author: victorh
---

# Quickstart: Create an Azure Firewall and IP Groups - Bicep

In this quickstart, you use a Bicep file to deploy an Azure Firewall with sample IP Groups used in a network rule and application rule. An IP Group is a top-level resource that allows you to define and group IP addresses, ranges, and subnets into a single object. IP Group is useful for managing IP addresses in Azure Firewall rules. You can either manually enter IP addresses or import them from a file.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates an Azure Firewall and IP Groups, along with the necessary resources to support the Azure Firewall.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azurefirewall-create-with-ipgroups-and-linux-jumpbox).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azurefirewall-create-with-ipgroups-and-linux-jumpbox/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

- [**Microsoft.Network/ipGroups**](/azure/templates/microsoft.network/ipGroups?pivots=deployment-language-bicep)
- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageAccounts?pivots=deployment-language-bicep)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.network/routeTables?pivots=deployment-language-bicep)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups?pivots=deployment-language-bicep)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks?pivots=deployment-language-bicep)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses?pivots=deployment-language-bicep)
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces?pivots=deployment-language-bicep)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines?pivots=deployment-language-bicep)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls?pivots=deployment-language-bicep)

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

You'll be prompted to enter the following values:

- **Admin Username**: Type username for the administrator user account
- **Admin Password**: Type an administrator password or key

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to validate the deployment and review the deployed resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

To learn about the Bicep syntax and properties for a firewall in a Bicep file, see [Microsoft.Network azureFirewalls template reference](/azure/templates/microsoft.network/azurefirewalls?pivots=deployment-language-bicep).

## Clean up resources

When you no longer need them, use the Azure portal, Azure CLI, or Azure PowerShell to remove the resource group, firewall, and all related resources.

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

> [!div class="nextstepaction"]
> [Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal](tutorial-hybrid-portal.md)
