---
title: 'Create a NAT gateway - Bicep'
titleSuffix: Azure NAT Gateway
description: This quickstart shows how to create a NAT gateway using Bicep.
author: asudbring
ms.service: virtual-network
ms.subservice: nat
ms.topic: how-to
ms.date: 07/21/2023
ms.author: allensu
ms.custom: subject-armqs, devx-track-bicep, devx-track-linux
# Customer intent: I want to create a NAT gateway using Bicep so that I can provide outbound connectivity for my virtual machines.
---

# Quickstart: Create a NAT gateway - Bicep

Get started with Azure NAT Gateway using Bicep. This Bicep file deploys a virtual network, a NAT gateway resource, and Ubuntu virtual machine. The Ubuntu virtual machine is deployed to a subnet that is associated with the NAT gateway resource.

:::image type="content" source="./media/quickstart-create-nat-gateway-portal/nat-gateway-qs-resources.png" alt-text="Diagram of resources created in nat gateway quickstart.":::

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/nat-gateway-1-vm/).

This Bicep file is configured to create a:

* Virtual network

* NAT gateway resource

* Ubuntu virtual machine

The Ubuntu VM is deployed to a subnet that's associated with the NAT gateway resource.

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/nat-gateway-1-vm/main.bicep":::

Nine Azure resources are defined in the Bicep file:

* **[Microsoft.Network/networkSecurityGroups](/azure/templates/microsoft.network/networksecuritygroups)**: Creates a network security group.

* **[Microsoft.Network/networkSecurityGroups/securityRules](/azure/templates/microsoft.network/networksecuritygroups/securityrules)**: Creates a security rule.

* **[Microsoft.Network/publicIPAddresses](/azure/templates/microsoft.network/publicipaddresses)**: Creates a public IP address.

* **[Microsoft.Network/publicIPPrefixes](/azure/templates/microsoft.network/publicipprefixes)**: Creates a public IP prefix.

* **[Microsoft.Compute/virtualMachines](/azure/templates/Microsoft.Compute/virtualMachines)**: Creates a virtual machine.

* **[Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks)**: Creates a virtual network.

* **[Microsoft.Network/natGateways](/azure/templates/microsoft.network/natgateways)**: Creates a NAT gateway resource.

* **[Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets)**: Creates a virtual network subnet.

* **[Microsoft.Network/networkinterfaces](/azure/templates/microsoft.network/networkinterfaces)**: Creates a network interface.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.

1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminusername=<admin-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminusername "<admin-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-name\>** with the administrator username for the virtual machine. You'll also be prompted to enter **adminpassword**.

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

In this quickstart, you created a:

* NAT gateway resource

* Virtual network

* Ubuntu virtual machine

The virtual machine is deployed to a virtual network subnet associated with the NAT gateway.

To learn more about Azure NAT Gateway and Bicep, continue to the following articles.

* Read an [Overview of Azure NAT Gateway](nat-overview.md)

* Read about the [NAT Gateway resource](nat-gateway-resource.md)

* Learn more about [Bicep](../azure-resource-manager/bicep/overview.md)
