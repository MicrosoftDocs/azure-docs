---
title: Deploy Azure Firewall using a template
description: Deploy Azure Firewall using a template
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 7/9/2018
ms.author: victorh
---

# Deploy Azure Firewall using a template

The [Create AzureFirewall sandbox setup template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-with-zones-sandbox) creates a test network environment with a firewall. The network has one virtual network (VNet) with three subnets: *AzureFirewallSubnet*, *ServersSubnet*, and *JumpboxSubnet*. The *ServersSubnet* and *JumpboxSubnet* subnet each have a single, two-core Windows Server virtual machine.

The firewall is in the *AzureFirewallSubnet* subnet, and has an application rule collection with a single rule that allows access to *www.microsoft.com*.

A user-defined route points network traffic from the *ServersSubnet* subnet through the firewall, where the firewall rules are applied.

For more information about Azure Firewall, see [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md).


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Use the template to deploy Azure Firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

**To install and deploy Azure Firewall by using the template:**

1. Access the template at [https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-with-zones-sandbox](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-with-zones-sandbox).
   
1. Read the introduction, and when ready to deploy, select **Deploy to Azure**.
   
1. Sign in to the Azure portal if necessary. 

1. In the portal, on the **Create a sandbox setup of AzureFirewall** page, type or select the following values:
   
   - **Resource group**: Select **Create new**, type a name for the resource group, and select **OK**. 
   - **Virtual Network Name**: Type a name for the new VNet. 
   - **Admin Username**: Type a username for the administrator user account.
   - **Admin Password**: Type an administrator password. 
   
1. Read the terms and conditions, and then select **I agree to the terms and conditions stated above**.
   
1. Select **Purchase**.
   
   It will take a few minutes to create the resources. 
   
1. Explore the resources that were created with the firewall. 

To learn about the JSON syntax and properties for a firewall in a template, see [Microsoft.Network/azureFirewalls](/azure/templates/microsoft.network/azurefirewalls).

## Clean up resources

When you no longer need them, you can remove the resource group, firewall, and all related resources by running the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) PowerShell command. To remove a resource group named *MyResourceGroup*, run: 

```azurepowershell-interactive
Remove-AzResourceGroup -Name MyResourceGroup
```
Don't remove the resource group and firewall yet, if you plan to continue on to the firewall monitoring tutorial. 

## Next steps

Next, you can monitor the Azure Firewall logs:

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
