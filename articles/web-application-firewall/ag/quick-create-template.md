---
title: 'Quickstart: Create an Azure WAF v2 on Application Gateway - Resource Manager template'
titleSuffix: Azure Application Gateway
description: Learn how to use a Resource Manager template to create a Web Application Firewall v2 on Azure Application Gateway.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.topic: quickstart
ms.date: 03/26/2020
ms.author: victorh
---

# Quickstart: Create an Azure WAF v2 on Application Gateway - Resource Manager template

In this quickstart, you use a Resource Manager template to create an Azure Web Application Firewall v2 on Application Gateway.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a web application firewall

This template creates a simple web application firewall v2 on Azure Applicaton Gateway. This includes a public IP frontend IP address, HTTP settings, a rule with a basic listener on port 80, and a backend pool.

### Review the template

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/blob/master/ag-docs-wafv2/azuredeploy.json)

:::code language="json" source="~/quickstart-templates/ag-docs-wafv2/azuredeploy.json" range="001-291" highlight="182-289":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/applicationgateways**](/azure/templates/microsoft.network/applicationgateways)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses) : one for the application gateway, and two for the virtual machines.
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)


### Deploy the template

Deploy Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an application gateway, the network infrastructure, and two virtual machines in the backend pool running IIS.

   <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fag-docs-wafv2%2Fazuredeploy.json"><img src="../media/quick-create-template/deploy-to-azure.png" alt="deploy to azure"/></a>

2. Select or create your resource group.
3. Select **I agree to the terms and conditions stated above** and then select **Purchase**. The deployment can take 10 minutes or longer to complete.

## Review deployed resources

After deployment completes, go to your resource group and select the application gateway.

Examine the items under **Settings**. If you want, you can deploy some virtual machines and add them to the backend pool.

## Clean up resources

When you no longer need the resources that you created with the application gateway, delete the resource group. This removes the application gateway and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create an application gateway with a Web Application Firewall using the Azure portal](application-gateway-web-application-firewall-portal.md)
