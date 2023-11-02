---
title: 'Quickstart: Direct web traffic using Bicep'
titleSuffix: Azure Application Gateway
description: In this quickstart, you learn how to use Bicep to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: greg-lindsay
ms.author: greglin
ms.date: 04/14/2022
ms.topic: quickstart
ms.service: application-gateway
ms.custom: mvc, subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Direct web traffic with Azure Application Gateway - Bicep

In this quickstart, you use Bicep to create an Azure Application Gateway. Then you test the application gateway to make sure it works correctly.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a simple setup with a public frontend IP address, a basic listener to host a single site on the application gateway, a basic request routing rule, and two virtual machines in the backend pool.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/ag-docs-qs/)

:::code language="bicep" source="~/quickstart-templates/demos/ag-docs-qs/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

- [**Microsoft.Network/applicationgateways**](/azure/templates/microsoft.network/applicationgateways)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses) : one for the application gateway, and two for the virtual machines.
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : two virtual machines
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : two for the virtual machines
- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) : to configure IIS and the web pages

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name myResourceGroupAG --location eastus
    az deployment group create --resource-group myResourceGroupAG --template-file main.bicep --parameters adminUsername=<admin-username>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name myResourceGroupAG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName myResourceGroupAG -TemplateFile ./main.bicep -adminUsername "<admin-username>"
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-username\>** with the admin username for the backend servers. You'll also be prompted to enter **adminPassword**.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group myResourceGroupAG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName myResourceGroupAG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name myResourceGroupAG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name myResourceGroupAG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
