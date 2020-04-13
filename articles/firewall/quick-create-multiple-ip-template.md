---
title: 'Quickstart: Create an Azure Firewall with multiple public IP addresses - Resource Manager template'
description: Learn how to use a Resource Manager template to create an Azure Firewall with multiple public IP addresses.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: quickstart
ms.date: 04/13/2020
ms.author: victorh
---

# Quickstart: Create an Azure Firewall with multiple public IP addresses - Resource Manager template

In this quickstart, you use a Resource Manager template to deploy an Azure Firewall with multiple public IP addresses.

NAT rule collection rules allow RDP connections to two Windows Server 2019 virtual machines.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create an Azure Firewall

This template creates an Azure Firewall with two public IP addresses, along with the necessary resources to support the Azure Firewall.

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/fw-docs-qs/azuredeploy.json)

:::code language="json" source="~/quickstart-templates/fw-docs-qs/azuredeploy.json" range="001-391" highlight="238-370":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines)
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces)
- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageAccounts)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.network/routeTables)


### Deploy the template

Deploy Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an Azure Firewall, the network infrastructure, and two virtual machines.

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Ffw-docs-qs%2Fazuredeploy.json"><img src="./media/quick-create-multiple-ip-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. In the portal, on the **Create an Azure Firewall with multiple IP public addresses** page, type or select the following values:
   - Subscription: Select from existing subscriptions 
   - Resource group:  Select from existing resource groups or select **Create new**, and select **OK**.
   - Location: Select a location
   - Admin Username: Type username for the administrator user account 
   - Admin Password: Type an administrator password or key

3. Select **I agree to the terms and conditions stated above** and then select **Purchase**. The deployment can take 10 minutes or longer to complete.

## Validate the deployment

In the Azure portal, review the deployed resources. Note the firewall public IP addresses.  

Use Remote Desktop Connection to connect to the firewall public IP addresses. Successful connections demonstrates firewall NAT rules that allow the connection to the backend servers.

## Clean up resources

When you no longer need the resources that you created with the firewall, delete the resource group. This removes the firewall and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "<your resource group name>"
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Deploy and configure Azure Firewall in a hybrid network using the Azure portal](tutorial-hybrid-portal.md)