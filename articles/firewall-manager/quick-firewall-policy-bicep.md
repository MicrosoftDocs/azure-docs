---
title: 'Quickstart: Create an Azure Firewall and a firewall policy - Bicep'
description: In this quickstart, you deploy an Azure Firewall and a firewall policy using Bicep.
services: firewall-manager
author: vhorne
ms.author: victorh
ms.date: 09/28/2023
ms.topic: quickstart
ms.service: firewall-manager
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Create an Azure Firewall and a firewall policy - Bicep

In this quickstart, you use Bicep to create an Azure Firewall and a firewall policy. The firewall policy has an application rule that allows connections to `www.microsoft.com` and a rule that allows connections to Windows Update using the **WindowsUpdate** FQDN tag. A network rule allows UDP connections to a time server at 13.86.101.172.

Also, IP Groups are used in the rules to define the **Source** IP addresses.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

For information about Azure Firewall Manager, see [What is Azure Firewall Manager?](overview.md).

For information about Azure Firewall, see [What is Azure Firewall?](../firewall/overview.md).

For information about IP Groups, see [IP Groups in Azure Firewall](../firewall/ip-groups.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a hub virtual network, along with the necessary resources to support the scenario.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/azurefirewall-create-with-firewallpolicy-apprule-netrule-ipgroups/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

- [**Microsoft.Network/ipGroups**](/azure/templates/microsoft.network/ipGroups)
- [**Microsoft.Network/firewallPolicies**](/azure/templates/microsoft.network/firewallPolicies)
- [**Microsoft.Network/firewallPolicies/ruleCollectionGroups**](/azure/templates/microsoft.network/firewallPolicies/ruleCollectionGroups)
- [**Microsoft.Network/azureFirewalls**](/azure/templates/microsoft.network/azureFirewalls)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses)

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters firewallName=<firewall-name>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -firewallName "<firewall-name>"
    ```

    ---

    > [!NOTE]
    > Replace **\<firewall-name\>** with the name of the Azure Firewall.
  
When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use Azure CLI or Azure PowerShell to review the deployed resources.

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

When you no longer need the resources that you created with the firewall, delete the resource group. The firewall and all the related resources are deleted.


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
> [Azure Firewall Manager policy overview](policy-overview.md)
