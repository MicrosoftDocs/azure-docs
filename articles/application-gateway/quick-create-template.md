---
title: 'Quickstart: Direct web traffic using a Resource Manager template'
titleSuffix: Azure Application Gateway
description: In this quickstart, you learn how to use a Resource Manager template to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
services: application-gateway
author: greg-lindsay
ms.author: greglin
ms.date: 06/10/2022
ms.topic: quickstart
ms.service: application-gateway
ms.custom: mvc, subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Direct web traffic with Azure Application Gateway - ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create an Azure Application Gateway. Then you test the application gateway to make sure it works correctly.

:::image type="content" source="media/quick-create-portal/application-gateway-qs-resources.png" alt-text="application gateway resources":::

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](quick-create-portal.md), [Azure PowerShell](quick-create-powershell.md), or [Azure CLI](quick-create-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-docs-qs%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

For the sake of simplicity, this template creates a simple setup with a public frontend IP, a basic listener to host a single site on the application gateway, a basic request routing rule, and two virtual machines in the backend pool.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/ag-docs-qs/)

:::code language="json" source="~/quickstart-templates/demos/ag-docs-qs/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/applicationgateways**](/azure/templates/microsoft.network/applicationgateways)
- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses) : one for the application gateway, and two for the virtual machines.
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)
- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : two virtual machines
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : two for the virtual machines
- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) : to configure IIS and the web pages

## Deploy the template

Deploy the ARM template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates an application gateway, the network infrastructure, and two virtual machines in the backend pool running IIS.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fdemos%2Fag-docs-qs%2Fazuredeploy.json)

2. Select or create your resource group, type the virtual machine administrator user name and password.
3. Select **Review + Create** and then select **Create**.

   The deployment can take 20 minutes or longer to complete.

## Validate the deployment

Although IIS isn't required to create the application gateway, it's installed to verify if Azure successfully created the application gateway. Use IIS to test the application gateway:

1. Find the public IP address for the application gateway on its **Overview** page.![Record application gateway public IP address](./media/application-gateway-create-gateway-portal/application-gateway-record-ag-address.png) Or, you can select **All resources**, enter *myAGPublicIPAddress* in the search box, and then select it in the search results. Azure displays the public IP address on the **Overview** page.
2. Copy the public IP address, and then paste it into the address bar of your browser to browse that IP address.
3. Check the response. A valid response verifies that the application gateway was successfully created and can successfully connect with the backend.

   ![Test application gateway](./media/application-gateway-create-gateway-portal/application-gateway-iistest.png)

   Refresh the browser multiple times and you should see connections to both myVM1 and myVM2.

## Clean up resources

When you no longer need the resources that you created with the application gateway, delete the resource group. This removes the application gateway and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

> [!div class="nextstepaction"]
> [Manage web traffic with an application gateway using the Azure CLI](./tutorial-manage-web-traffic-cli.md)
