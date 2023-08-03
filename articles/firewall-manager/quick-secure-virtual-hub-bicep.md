---
title: 'Quickstart: Secure virtual hub using Azure Firewall Manager - Bicep'
description: In this quickstart, you learn how to secure your virtual hub using Azure Firewall Manager and Bicep.
services: firewall-manager
author: vhorne
ms.author: victorh
ms.date: 06/28/2022
ms.topic: quickstart
ms.service: firewall-manager
ms.custom: subject-armqs, mode-arm, devx-track-bicep
---

# Quickstart: Secure your virtual hub using Azure Firewall Manager - Bicep

In this quickstart, you use Bicep to secure your virtual hub using Azure Firewall Manager. The deployed firewall has an application rule that allows connections to `www.microsoft.com` . Two Windows Server 2019 virtual machines are deployed to test the firewall. One jump server is used to connect to the workload server. From the workload server, you can only connect to `www.microsoft.com`.

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

For more information about Azure Firewall Manager, see [What is Azure Firewall Manager?](overview.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a secured virtual hub using Azure Firewall Manager, along with the necessary resources to support the scenario.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/fwm-docs-qs/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/fwm-docs-qs/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

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

## Deploy the Bicep file

1. Save the Bicep file as `main.bicep` to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters adminUsername=<admin-user>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -adminUsername "<admin-user>"
    ```

    ---

    > [!NOTE]
    > Replace **\<admin-user\>** with the administrator login username for the servers. You'll be prompted to enter **adminPassword**.

  When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

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

Now, test the firewall rules to confirm that it works as expected.

1. From the Azure portal, review the network settings for the **Workload-Srv** virtual machine and note the private IP address.
2. Connect a remote desktop to **Jump-Srv** virtual machine, and sign in. From there, open a remote desktop connection to the **Workload-Srv** private IP address.
3. Open Internet Explorer and browse to `www.microsoft.com`.
4. Select **OK** > **Close** on the Internet Explorer security alerts.

   You should see the Microsoft home page.

5. Browse to `www.google.com`.

   You should be blocked by the firewall.

Now you've verified that the firewall rules are working, you can browse to the one allowed FQDN, but not to any others.

## Clean up resources

When you no longer need the resources that you created with the firewall, use Azure portal, Azure CLI, or Azure PowerShell to delete the resource group. This removes the firewall and all the related resources.

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
> [Learn about security partner providers](trusted-security-partners.md)
