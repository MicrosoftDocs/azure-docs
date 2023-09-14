---
title: 'Quickstart: Secure virtual hub using Azure Firewall Manager - Resource Manager template'
description: In this quickstart, you learn how to secure your virtual hub using Azure Firewall Manager.
services: firewall-manager
author: vhorne
ms.author: victorh
ms.date: 08/28/2020
ms.topic: quickstart
ms.service: firewall-manager
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Secure your virtual hub using Azure Firewall Manager - ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to secure your virtual hub using Azure Firewall Manager. The deployed firewall has an application rule that allows connections to `www.microsoft.com` . Two Windows Server 2019 virtual machines are deployed to test the firewall. One jump server is used to connect to the workload server. From the workload server, you can only connect to `www.microsoft.com`.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

For more information about Azure Firewall Manager, see [What is Azure Firewall Manager?](overview.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ffwm-docs-qs%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a secured virtual hub using Azure Firewall Manager, along with the necessary resources to support the scenario.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/fwm-docs-qs/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/fwm-docs-qs/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/virtualWans**](/azure/templates/microsoft.network/virtualWans)
- [**Microsoft.Network/virtualHubs**](/azure/templates/microsoft.network/virtualHubs)
- [**Microsoft.Network/firewallPolicies**](/azure/templates/microsoft.network/firewallPolicies)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines)
- [**Microsoft.Storage/storageAccounts**](/azure/templates/microsoft.storage/storageAccounts)
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)
- [**Microsoft.Network/routeTables**](/azure/templates/microsoft.network/routeTables)

## Deploy the template

Deploy the ARM template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an Azure Firewall, a virtual WAN and virtual hub, the network infrastructure, and two virtual machines.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Ffwm-docs-qs%2Fazuredeploy.json)

2. In the portal, on the **Secured virtual hubs** page, type or select the following values:
   - Subscription: Select from existing subscriptions 
   - Resource group:  Select from existing resource groups or select **Create new**, and select **OK**.
   - Location: Select a location
   - Admin Username: Type username for the administrator user account 
   - Admin Password: Type an administrator password or key

3. Select **Review + create** and then select **Create**. The deployment can take 10 minutes or longer to complete.

## Validate the deployment

Now, test the firewall rules to confirm that it works as expected.

1. From the Azure portal, review the network settings for the **Workload-Srv** virtual machine and note the private IP address.
2. Connect a remote desktop to **Jump-Srv** virtual machine, and sign in. From there, open a remote desktop connection to the **Workload-Srv** private IP address.

3. Open Internet Explorer and browse to `www.microsoft.com`.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Microsoft home page.

5. Browse to `www.google.com`.

   You should be blocked by the firewall.

So now you've verified that the firewall rules are working:

- You can browse to the one allowed FQDN, but not to any others.

## Clean up resources

When you no longer need the resources that you created with the firewall, delete the resource group. This removes the firewall and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name "<your resource group name>"
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about security partner providers](trusted-security-partners.md)
