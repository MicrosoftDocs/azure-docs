---
title: 'Quickstart: Create an Azure Firewall with Availability Zones - Resource Manager template'
description: In this quickstart, you deploy Azure Firewall using a template. The virtual network has one VNet with three subnets. Two Windows Server virtual machines are deployed; a jump box and a server.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 05/10/2021
ms.author: victorh
---

# Quickstart: Deploy Azure Firewall with Availability Zones - ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to deploy an Azure Firewall in three Availability Zones.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

The template creates a test network environment with a firewall. The network has one virtual network (VNet) with three subnets: *AzureFirewallSubnet*, *ServersSubnet*, and *JumpboxSubnet*. The *ServersSubnet* and *JumpboxSubnet* subnet each have a single, two-core Windows Server virtual machine.

The firewall is in the *AzureFirewallSubnet* subnet, and has an application rule collection with a single rule that allows access to `www.microsoft.com`.

A user-defined route points network traffic from the *ServersSubnet* subnet through the firewall, where the firewall rules are applied.

For more information about Azure Firewall, see [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-with-zones-sandbox%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates an Azure Firewall with Availability Zones, along with the necessary resources to support the Azure Firewall.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azurefirewall-with-zones-sandbox).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/azurefirewall-with-zones-sandbox/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageAccounts?pivots=deployment-language-arm-template)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.network/routeTables?pivots=deployment-language-arm-template)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups?pivots=deployment-language-arm-template)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks?pivots=deployment-language-arm-template)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses?pivots=deployment-language-arm-template)
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces?pivots=deployment-language-arm-template)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines?pivots=deployment-language-arm-template)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls?pivots=deployment-language-arm-template)

## Deploy the template

Deploy the ARM template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an Azure Firewall, the network infrastructure, and two virtual machines.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-with-zones-sandbox%2Fazuredeploy.json)

2. In the portal, on the **Create a sandbox setup of Azure Firewall with Zones** page, type or select the following values:
   - **Resource group**: Select **Create new**, type a name for the resource group, and select **OK**.
   - **Virtual Network Name**: Type a name for the new VNet.
   - **Admin Username**: Type a username for the administrator user account.
   - **Admin Password**: Type an administrator password.

3. Read the terms and conditions, and then select **I agree to the terms and conditions stated above** and then select **Purchase**. The deployment can take 10 minutes or longer to complete.

## Review deployed resources

Explore the resources that were created with the firewall.

To learn about the JSON syntax and properties for a firewall in a template, see [Microsoft.Network/azureFirewalls](/azure/templates/microsoft.network/azurefirewalls).

## Clean up resources

When you no longer need them, you can remove the resource group, firewall, and all related resources by running the `Remove-AzResourceGroup` PowerShell command. To remove a resource group named *MyResourceGroup*, run:

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```

Don't remove the resource group and firewall if you plan to continue on to the firewall monitoring tutorial.

## Next steps

Next, you can monitor the Azure Firewall logs.

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./firewall-diagnostics.md)
