---
title: 'Quickstart: Create an Azure WAF v2 on Application Gateway - Bicep'
titleSuffix: Azure Application Gateway
description: Learn how to use Bicep to create a Web Application Firewall v2 on Azure Application Gateway.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: quickstart
ms.date: 06/22/2022
ms.author: victorh
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm, devx-track-bicep
---

# Quickstart: Create an Azure WAF v2 on Application Gateway using Bicep

In this quickstart, you use Bicep to create an Azure Web Application Firewall v2 on Application Gateway.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a simple Web Application Firewall v2 on Azure Application Gateway. This includes a public IP frontend IP address, HTTP settings, a rule with a basic listener on port 80, and a backend pool. The file also creates a WAF policy with a custom rule to block traffic to the backend pool based on an IP address match type.

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/ag-docs-wafv2/).

:::code language="bicep" source="~/quickstart-templates/demos/ag-docs-wafv2/main.bicep":::

Multiple Azure resources are defined in the Bicep file:

- [**Microsoft.Network/applicationgateways**](/azure/templates/microsoft.network/applicationgateways)
- [**Microsoft.Network/ApplicationGatewayWebApplicationFirewallPolicies**](/azure/templates/microsoft.network/ApplicationGatewayWebApplicationFirewallPolicies)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses) : one for the application gateway, and two for the virtual machines.
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : two virtual machines
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : two for the virtual machines
- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) : to configure IIS and the web pages

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
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
> You'll be prompted to enter **adminPassword**, which is the password for the admin account on the backend servers. The password must be between 8-123 characters long and must contain at least three of the following: an uppercase character, a lowercase character, a numeric digit, or a special character.

When the deployment finishes, you should see a message indicating the deployment succeeded. The deployment can take 10 minutes or longer to complete.

## Validate the deployment

Although IIS isn't required to create the application gateway, it's installed on the backend servers to verify if Azure successfully created a WAF v2 on the application gateway.

Use IIS to test the application gateway:

1. Find the public IP address for the application gateway on its **Overview** page.![Record application gateway public IP address](../../application-gateway/media/application-gateway-create-gateway-bicep/app-gateway-ip-address-bicep.png)
2. Copy the public IP address, and then paste it into the address bar of your browser to browse that IP address.
3. Check the response. A **403 Forbidden** response verifies that the WAF was successfully created and is blocking connections to the backend pool.
4. Change the custom rule to **Allow traffic** using Azure PowerShell.

    ```azurepowershell
    
    $rgName = "exampleRG"
    $appGWName = "myAppGateway"
    $fwPolicyName = "WafPol01"

    # Pull the existing Azure resources

    $appGW = Get-AzApplicationGateway -Name $appGWName -ResourceGroupName $rgName
    $pol = Get-AzApplicationGatewayFirewallPolicy -Name $fwPolicyName -ResourceGroupName $rgName

    # Update the resources

    $pol[0].CustomRules[0].Action = "allow"
    $appGW.FirewallPolicy = $pol

    # Push your changes to Azure

    Set-AzApplicationGatewayFirewallPolicy -Name $fwPolicyName -ResourceGroupName $rgName -CustomRule $pol.CustomRules
    Set-AzApplicationGateway -ApplicationGateway $appGW
    ```

    ---

    Refresh your browser multiple times and you should see connections to both myVM1 and myVM2.

## Clean up resources

When you no longer need the resources that you created with the application gateway, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group. This removes the application gateway and all the related resources.

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
> [Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal](application-gateway-web-application-firewall-portal.md)
