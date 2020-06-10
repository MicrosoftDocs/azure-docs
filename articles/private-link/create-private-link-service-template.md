---
title: Azure Private Link Service ARM template
description: Private link service ARM template
services: private-link
author: mblanco77
ms.service: private-link
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 05/29/2020
ms.author: allensu
---

# Quickstart: Create a private link service - Resource Manager template

In this quickstart, you use a Resource Manager template to create a private link service.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

You can also complete this quickstart using the [Azure portal](create-private-link-service-portal.md), [Azure PowerShell](create-private-link-service-powershell.md), or [Azure CLI](create-private-link-service-cli.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a private link service

this template creates a private link service.

### Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-privatelink-service/).

:::code language="json" source="~/quickstart-templates/101-privatelink-service/azuredeploy.json" range="001-432" highlight="263-289":::

Multiple Azure resources are defined in the template:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks) : one for each Virtual Machine
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers) : Load balancer that exposes the virtual machines that host the service
- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkinterfaces) : 2 Network Interfaces, one for each Virtual Machine
- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualmachines) : 2 Virtual machines, one that hosts the service and one to test the connection to the private endpoint
- [**Microsoft.Compute/virtualMachines/extensions**](/azure/templates/Microsoft.Compute/virtualMachines/extensions) : Extension that installs web server
- [**Microsoft.Network/privateLinkServices**](/azure/templates/microsoft.network/privateLinkServices) : private link service to expose privately the service
- [**Microsoft.Network/publicIpAddresses**](/azure/templates/microsoft.network/publicIpAddresses) : 2 Public IP address, one for each Virtual Machine
- [**Microsoft.Network/privateendpoints**](/azure/templates/microsoft.network/privateendpoints) : private endpoint to access privately the service

### Deploy the template

Deploy Resource Manager template to Azure:

1. Select **Deploy to Azure** to sign in to Azure and open the template. The template creates a Virtual Machine , standard load balancer, private link service, private endpoint, networking and a virtual machine to validate.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-privatelink-service%2Fazuredeploy.json)

2. Select or create your resource group,
3. Type the virtual machine administrator username and password.
4. Select **I agree to the terms and conditions stated above** and then select **Purchase**.

## Validate the deployment

> [!NOTE]
> the ARM template generates unique name for the Virtual Machine myConsumerVm<b>{uniqueid}</b> resource, please replace <b>{uniqueid}</b> with your generated value.

### Connect to a VM from the internet

Connect to the VM _myConsumerVm{uniqueid}_ from the internet as follows:

1.  In the portal's search bar, enter _myConsumerVm{uniqueid}_.

2.  Select the **Connect** button. After selecting the **Connect** button, **Connect to virtual machine** opens.

3.  Select **Download RDP File**. Azure creates a Remote Desktop Protocol (_.rdp_) file and downloads it to your computer.

4.  Open the downloaded.rdp\* file.

    a. If prompted, select **Connect**.

    b. Enter the username and password you specified when creating the VM.
    
    > [!NOTE]
    > You may need to select **More choices** > **Use a different account**, to specify the credentials you entered when you created the VM.

5.  Select **OK**.

6.  You may receive a certificate warning during the sign-in process. If you receive a certificate warning, select **Yes** or **Continue**.

7.  Once the VM desktop appears, minimize it to go back to your local desktop.

### Access the http service privately from the VM

In this section, you will connect to the http service from the VM using the Private Endpoint.

1.  In the Remote Desktop of _myConsumerVm{uniqueid}_
2.  Open a browser and enter the private endpoint address http://10.0.0.5/
3.  You'll see the default IIS page

## Clean up resources

When you no longer need the resources that you created with the private link service, delete the resource group. This removes the private link service and all the related resources.

To delete the resource group, call the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

- Learn more about [Azure Private Link](private-link-overview.md)
