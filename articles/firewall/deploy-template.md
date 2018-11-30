---
title: Deploy Azure Firewall using a template
description: Deploy Azure Firewall using a template
services: firewall
author: vhorne
manager: jpconnock

ms.service: firewall
ms.topic: article
ms.date: 11/30/2018
ms.author: victorh
---

# Deploy Azure Firewall using a template

The [Create AzureFirewall sandbox setup template](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-sandbox) creates a test network environment with a firewall. The network has one virtual network with three subnets: *AzureFirewallSubnet*, *ServersSubnet*, and *JumpboxSubnet*. The *ServersSubnet* and *JumpboxSubnet* each have a single, two-core Windows Server virtual machine.

The firewall is in the *AzureFirewallSubnet*, and has an application rule collection with a single rule that allows access to *www.microsoft.com*.

A user-defined route points network traffic from the *ServersSubnet* through the firewall, where the firewall rules are applied.

## Use the template to deploy Azure Firewall

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Access the **Create AzureFirewall sandbox setup** template at [https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-sandbox](https://github.com/Azure/azure-quickstart-templates/tree/master/101-azurefirewall-sandbox).

Read the introduction, and when ready to deploy, select **Deploy to Azure**.

Explore the resources that were created with the firewall. For more information about Azure Firewall, see [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md).

## Clean up resources

When you no longer need them, you can remove the resource group, firewall, and all related resources by running the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) PowerShell command.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```
## Next steps

Next, you can monitor the Azure Firewall logs:

> [!div class="nextstepaction"]
> [Tutorial: Monitor Azure Firewall logs](./tutorial-diagnostics.md)
