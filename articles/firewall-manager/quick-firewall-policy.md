---
title: 'Quickstart: Create an Azure Firewall and a firewall policy - Resource Manager template'
description: In this quickstart, you deploy an Azure Firewall and a firewall policy.
services: firewall-manager
author: vhorne
ms.author: victorh
ms.date: 02/17/2021
ms.topic: quickstart
ms.service: firewall-manager
ms.custom:
  - subject-armqs
  - mode-arm
---

# Quickstart: Create an Azure Firewall and a firewall policy - ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an Azure Firewall and a firewall policy. The firewall policy has an application rule that allows connections to `www.microsoft.com` and a rule that allows connections to Windows Update using the **WindowsUpdate** FQDN tag. A network rule allows UDP connections to a time server at 13.86.101.172.

Also, IP Groups are used in the rules to define the **Source** IP addresses.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

For information about Azure Firewall Manager, see [What is Azure Firewall Manager?](overview.md).

For information about Azure Firewall, see [What is Azure Firewall?](../firewall/overview.md).

For information about IP Groups, see [IP Groups in Azure Firewall](../firewall/ip-groups.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a hub virtual network, along with the necessary resources to support the scenario.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups/).

:::code language="json" source="~/quickstart-templates/101-azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/ipGroups**](/azure/templates/microsoft.network/ipGroups)
- [**Microsoft.Network/firewallPolicies**](/azure/templates/microsoft.network/firewallPolicies)
- [**Microsoft.Network/firewallPolicies/ruleCollectionGroups**](/azure/templates/microsoft.network/firewallPolicies/ruleCollectionGroups)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)

## Deploy the template

Deploy the ARM template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an Azure Firewall, a virtual WAN and virtual hub, the network infrastructure, and two virtual machines.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups%2Fazuredeploy.json)

2. In the portal, on the **Create a Firewall and FirewallPolicy with Rules and Ipgroups** page, type or select the following values:
   - Subscription: Select from existing subscriptions.
   - Resource group:  Select from existing resource groups or select **Create new**, and select **OK**.
   - Region: Select a region.
   - Firewall Name: type a name for the firewall.

3. Select **Review + create** and then select **Create**. The deployment can take 10 minutes or longer to complete.

## Review deployed resources

After deployment completes, you'll see the following similar resources.

:::image type="content" source="media/quick-firewall-policy/qs-deployed-resources.png" alt-text="Deployed resources":::

## Clean up resources

When you no longer need the resources that you created with the firewall, delete the resource group. This removes the firewall and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "<your resource group name>"
```

## Next steps

> [!div class="nextstepaction"]
> [Azure Firewall Manager policy overview](policy-overview.md)
