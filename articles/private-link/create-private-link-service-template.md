---
title: 'Quickstart: Create a private link service - ARM template'
titleSuffix: Azure Private Link
description: In this quickstart, you use an Azure Resource Manager template (ARM template) to create a private link service.
author: asudbring
ms.service: private-link
ms.topic: quickstart
ms.date: 03/30/2023
ms.author: allensu
ms.custom: subject-armqs, mode-arm, template-quickstart
---

# Quickstart: Create a private link service using an ARM template

In this quickstart, you use an Azure Resource Manager template (ARM template) to create a private link service.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart by using the [Azure portal](create-private-link-service-portal.md), [Azure PowerShell](create-private-link-service-powershell.md), or the [Azure CLI](create-private-link-service-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fprivatelink-service%2Fazuredeploy.json)

## Prerequisites

You need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a private link service.

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/privatelink-service/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/privatelink-service/azuredeploy.json":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks): There's one virtual network for each virtual machine.

- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers): The load balancer that exposes the virtual machines that host the service.

- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces): There are two network interfaces, one for each virtual machine.

- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines): There are two virtual machines, one that hosts the service and one that tests the connection to the private endpoint.

- [**Microsoft.Compute/virtualMachines/extensions**](/azure/templates/Microsoft.Compute/virtualMachines/extensions): The extension that installs a web server.

- [**Microsoft.Network/privateLinkServices**](/azure/templates/microsoft.network/privateLinkServices): The private link service to expose the service.

- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses): There are two public IP addresses, one for each virtual machine.

- [**Microsoft.Network/privateendpoints**](/azure/templates/microsoft.network/privateendpoints): The private endpoint to access the service.

## Deploy the template

Here's how to deploy the ARM template to Azure:

1. To sign in to Azure and open the template, select **Deploy to Azure**. The template creates a virtual machine, standard load balancer, private link service, private endpoint, networking, and a virtual machine to validate.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fprivatelink-service%2Fazuredeploy.json)

2. Select or create your resource group.

3. Enter the virtual machine administrator username and password.

4. Select **Review + create**.

5. Select **Create**.

   The deployment takes a few minutes to complete.

## Validate the deployment

> [!NOTE]
> The ARM template generates a unique name for the virtual machine myConsumerVm<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

### Connect to a VM from the internet

Connect to the VM _myConsumerVm{uniqueid}_ from the internet as follows:

1.  In the portal's search bar, enter _myConsumerVm{uniqueid}_.

2.  Select **Connect**. **Connect to virtual machine** opens.

3.  Select **Download RDP File**. Azure creates a Remote Desktop Protocol (_.rdp_) file and downloads it to your computer.

4.  Open the RDP file that was downloaded to your computer.

    a. If prompted, select **Connect**.

    b. Enter the username and password you specified when you created the VM.

    > [!NOTE]
    > You might need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

5.  Select **OK**.

6.  You might receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

7.  After the VM desktop appears, minimize it to go back to your local desktop.

### Access the http service privately from the VM

Here's how to connect to the http service from the VM by using the private endpoint.

1.  Go to the Remote Desktop of _myConsumerVm{uniqueid}_.

2.  Open a browser, and enter the private endpoint address: `http://10.0.0.5/`.

3.  The default IIS page appears.

## Clean up resources

When you no longer need the resources that you created with the private link service, delete the resource group. This operation removes the private link service and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information on the services that support a private endpoint, see:
> [!div class="nextstepaction"]
> [Private Link availability](private-link-overview.md#availability)
