---
title: 'Quickstart: Create an Azure Firewall and IP Groups - Resource Manager template'
description: In this quickstart, you learn how to use an Azure Resource Manager template (ARM template) to create an Azure Firewall and IP Groups.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 05/10/2021
ms.author: victorh
---

# Quickstart: Create an Azure Firewall and IP Groups - ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to deploy an Azure Firewall with sample IP Groups used in a network rule and application rule. An IP Group is a top-level resource that allows you to define and group IP addresses, ranges, and subnets into a single object. This is useful for managing IP addresses in Azure Firewall rules. You can either manually enter IP addresses or import them from a file.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-create-with-ipgroups-and-linux-jumpbox%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates an Azure Firewall and IP Groups, along with the necessary resources to support the Azure Firewall.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azurefirewall-create-with-ipgroups-and-linux-jumpbox).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/azurefirewall-create-with-ipgroups-and-linux-jumpbox/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/ipGroups**](/azure/templates/microsoft.network/ipGroups?pivots=deployment-language-arm-template)
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

   :::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fazurefirewall-create-with-ipgroups-and-linux-jumpbox%2Fazuredeploy.json":::

2. In the portal, on the **Create an Azure Firewall with IpGroups** page, type or select the following values:
   - Subscription: Select from existing subscriptions
   - Resource group:  Select from existing resource groups or select **Create new**, and select **OK**.
   - Location: Select a location
   - Virtual Network Name: Type a name for the new virtual network (VNet)
   - IP Group Name 1: Type name for IP Group 1
   - IP Group Name 2: Type name for IP Group 2
   - Admin Username: Type username for the administrator user account
   - Authentication: Select sshPublicKey or password
   - Admin Password: Type an administrator password or key

3. Select **I agree to the terms and conditions stated above** and then select **Purchase**. The deployment can take 10 minutes or longer to complete.

## Review deployed resources

In the Azure portal, review the deployed resources, especially the firewall rules that use IP Groups.

:::image type="content" source="media/quick-create-ipgroup-template/ipgroups.png" alt-text="IP Groups.":::

:::image type="content" source="media/quick-create-ipgroup-template/network-rule.png" alt-text="Network rules.":::

To learn about the JSON syntax and properties for a firewall in a template, see [Microsoft.Network azureFirewalls template reference](/azure/templates/microsoft.network/azurefirewalls).

## Clean up resources

When you no longer need the resources that you created with the firewall, delete the resource group. This removes the firewall and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "<your resource group name>"
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal](tutorial-hybrid-portal.md)
