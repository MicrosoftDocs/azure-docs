---
title: 'Quickstart: Deploy Azure Bastion to a virtual network using an ARM template'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion to a virtual network by using an Azure Resource Manager template.
author: abell
ms.author: abell
ms.service: bastion
ms.topic: quickstart 
ms.date: 06/27/2022
ms.custom: template-quickstart, devx-track-arm-template
#Customer intent: As someone with a networking background, I want to deploy Azure Bastion to a virtual machine by using an ARM template.
---


# Quickstart: Deploy Azure Bastion to a virtual network by using an ARM template

This quickstart describes how to use an Azure Resource Manager template (ARM template) to deploy Azure Bastion to a virtual network.

An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

The following diagram shows the architecture of Bastion.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram that shows the Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

If your environment meets the prerequisites and you're familiar with using ARM templates, select the following **Deploy to Azure** button. The template opens in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

> [!NOTE]
> The use of Bastion with Azure Private DNS zones is not supported at this time. Before you begin, make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.

## Review the template

To view the entire template that this quickstart uses, see [Azure Bastion as a Service with NSG](https://azure.microsoft.com/resources/templates/azure-bastion-nsg/).

By default, this template creates a Bastion deployment with a resource group, a virtual network, network security group (NSG) settings, an AzureBastionSubnet subnet, a bastion host, and a public IP address resource that's used for the bastion host. Here's the purpose of each part of the template:

* [Microsoft.Network/bastionHosts](/azure/templates/microsoft.network/bastionhosts) creates the bastion host.
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks) creates a virtual network.
* [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets) creates the subnet.
* [Microsoft Network/networkSecurityGroups](/azure/templates/microsoft.network/virtualnetworks/subnets) controls the NSG settings.
* [Microsoft.Network/publicIpAddresses](/azure/templates/microsoft.network/publicIpAddresses) specifies the public IP address value for the bastion host.

### Parameters

| Parameter name           | Description                                                                          |
|--------------------------|--------------------------------------------------------------------------------------|
| `Region`                   | Azure region for Bastion and the virtual network.                                        |
| `vnet-name`                | Name of a new or existing virtual network to which Bastion should be deployed.   |
| `vnet-ip-prefix`           | IP prefix for available addresses in a virtual network address space.                  |
| `vnet-new-or-existing`     | Choice of whether to deploy new virtual network or deploy to an existing one.          |
| `bastion-subnet-ip-prefix` | Bastion subnet IP prefix, which must be within the virtual network IP prefix's address space. |
| `bastion-host-name`        | Name of the Bastion resource.                                                      |

> [!NOTE]
> To find more templates, see [Azure quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

In this section, you deploy Bastion by using the Azure portal. You don't connect and sign in to your virtual machine or deploy Bastion directly from your VM.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the following **Deploy to Azure** button:

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)

1. In the **Azure Bastion as a Service** template, enter or select information on the **Basics** tab. Keep these considerations in mind:

   * If you're using the template for a test environment, you can use the example values that this step provides.
   * To view the template, select **Edit template**. On this page, you can adjust some of the values, such as the address space or the name of certain resources. Select **Save** to save your changes, or select **Discard** to discard them.
   * If you decide to create your bastion host in an existing virtual network, be sure to fill in the values for the template as they exist in your deployed environment, or the template will fail.

    :::image type="content" source="./media/quickstart-host-arm-template/bastion-template-values.png" alt-text="Screenshot of example values for an Azure Bastion ARM template." lightbox="./media/quickstart-host-arm-template/bastion-template-values.png":::

   | Setting                  | Example value             |
   |--------------------------|--------------------------------|
   | **Subscription**             | Select your Azure subscription. |
   | **Resource group**           |Select **Create new**, enter **TestRG1**, and then select **OK**.             |
   | **Region**                   | Enter **East US**.              |
   | **Vnet-name**                | Enter **VNet1**.                |
   | **Vnet-ip-prefix**           | Enter **10.1.0.0/16**.          |
   | **Vnet-new-or-existing**     | Select **new**.          |
   | **Bastion-subnet-ip-prefix** | Enter **10.1.1.0/24**.          |
   | **Bastion-host-name**        | Enter **TestBastionHost**.      |

1. Select the **Review + create** tab, or select the **Review + create** button. Select **Create**.
1. The deployment finishes within 10 minutes. You can view the progress on the template **Overview** pane. If you close the portal, deployment continues.

## Validate the deployment

To validate the deployment of Bastion:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **TestRG1** resource group that you created in the previous section.
1. From the **Overview** pane of the resource group, scroll down to the **Resources** tab. Validate the Bastion resource.

   :::image type="content" source="./media/quickstart-host-arm-template/bastion-validate-deployment-full.png" alt-text="Screenshot that shows the Azure Bastion resource in a resource group." lightbox="./media/quickstart-host-arm-template/bastion-validate-deployment.png":::

## Clean up resources

When you finish using the virtual network and the virtual machines, delete the resource group and all of the resources that it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal, and then select it from the search results.
1. Select **Delete resource group**.
1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME**, and then select **Delete**.

## Next steps

In this quickstart, you deployed Bastion by using an ARM template. You then connected to a virtual machine securely via Bastion. Continue with the following steps if you want to copy and paste to your virtual machine.

> [!div class="nextstepaction"]
> [Quickstart: Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)

> [!div class="nextstepaction"]
> [Create an RDP connection to a Windows VM using Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md)
