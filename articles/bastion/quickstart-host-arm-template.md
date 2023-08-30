---
title: 'Quickstart: Deploy Azure Bastion in a virtual network using an ARM template'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion in a virtual network using an ARM template.
author: abell
ms.author: abell
ms.service: bastion
ms.topic: quickstart 
ms.date: 06/27/2022
ms.custom: template-quickstart, devx-track-arm-template
Customer intent: As someone with a networking background, I want to deploy Azure Bastion to a virtual machine using a Bastion ARM Template.
---


# Quickstart: Deploy Azure Bastion in a virtual network using an ARM template

This quickstart describes how to use Azure Bastion template to deploy to a virtual network.

An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

:::image type="content" source="./media/create-host/host-architecture.png" alt-text="Diagram showing Azure Bastion architecture." lightbox="./media/create-host/host-architecture.png":::

If your environment meets the prerequisites and you're familiar with using ARM templates, select the Deploy to Azure button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)

## Prerequisites

Verify that you have an Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details) or sign up for a [free account](https://azure.microsoft.com/pricing/free-trial).

> [!NOTE]
> The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
>
## Review the template

To view the entire template used for this quickstart, see [Azure Quickstart Templates: Azure Bastion as a Service](https://azure.microsoft.com/resources/templates/azure-bastion-nsg/).

This template by default, creates an Azure Bastion deployment with a resource group, a virtual network, network security group settings, an AzureBastionSubnet subnet, a bastion host, and a public IP address resource that's used for the bastion host.

* [Microsoft.Network/bastionHosts](/azure/templates/microsoft.network/bastionhosts) creates the bastion host.
* [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks) creates a virtual network.
* [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets) creates the subnet.
* [Microsoft Network/networkSecurityGroups](/azure/templates/microsoft.network/virtualnetworks/subnets) controls the network security group settings.
* [Microsoft.Network/publicIpAddresses](/azure/templates/microsoft.network/publicIpAddresses) specifies the public IP address value used for the bastion host.

### Parameters

| PARAMETER NAME           | DESCRIPTION                                                                          |
|--------------------------|--------------------------------------------------------------------------------------|
| Region                   | Azure region for Bastion and virtual network.                                        |
| vnet-name                | Name of new or existing virtual network to which Azure Bastion should be deployed.   |
| vnet-ip-prefix           | IP prefix for available addresses in virtual network address space.                  |
| vnet-new-or-existing     | Specify whether to deploy new virtual network or deploy to an existing one.          |
| bastion-subnet-ip-prefix | Bastion subnet IP prefix MUST be within the virtual network IP prefix address space. |
| bastion-host-name        | Name of Azure Bastion resource.                                                      |

> [!NOTE]
> To find more templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).
>

## Deploy the template

> [!IMPORTANT]
> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]
>

In this section, you'll deploy Bastion using the **Deploy to Azure** button below or in the Azure portal. You don't connect and sign in to your virtual machine or deploy Bastion from your VM directly.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Deploy to Azure** button below.

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)

1. In the **Azure Bastion as a Service: Azure Quickstart Template**, enter or select the following information.

   * If you're using the template for a test environment, you can use the example values specified.
   * To view the template, click **Edit template**. On this page, you can adjust some of the values such as address space or the name of certain resources. **Save** to save your changes, or **Discard**.
   * If you decide to create your bastion host in an existing VNet, make sure to fill in the values for the template as they are in your deployed environment, or the template will fail.

    :::image type="content" source="./media/quickstart-host-arm-template/bastion-template-values.png" alt-text="Screenshot of Bastion ARM template example values." lightbox="./media/quickstart-host-arm-template/bastion-template-values.png":::

   | Setting                  | Example value             |
   |--------------------------|--------------------------------|
   | Subscription             | Select your Azure subscription |
   | Resource Group           |Select **Create new** enter **TestRG1**, and select **OK**             |
   | Region                   | Enter **East US**              |
   | vnet-name                | Enter **VNet1**                |
   | vnet-ip-prefix           | Enter **10.1.0.0/16**          |
   | vnet-new-or-existing     | Select **new**          |
   | bastion-subnet-ip-prefix | Enter **10.1.1.0/24**          |
   | bastion-host-name        | Enter **TestBastionHost**      |

1. Select the **Review + create** tab or select the **Review + create** button. Select **Create**.
1. The deployment will complete within 10 minutes. You can view the progress on the template **Overview** page. If you close the portal, deployment will continue.

## Validate the deployment

In this section, you'll validate the deployment of Azure Bastion.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **TestRG1** resource group that you created in the previous section.
1. From the Overview page of the resource group, scroll down to **Resources** in the middle pane. Validate the Bastion resource.
 :::image type="content" source="./media/quickstart-host-arm-template/bastion-validate-deployment-full.png" alt-text="Screenshot shows the Azure Bastion resource." lightbox="./media/quickstart-host-arm-template/bastion-validate-deployment.png":::

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.
1. Select **Delete resource group**.
1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you deployed Bastion using the Bastion ARM template, and then connected to a virtual machine securely via Bastion. Next, you can continue with the following steps if you want to copy and paste to your virtual machine.

> [!div class="nextstepaction"]
> [Quickstart: Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md)

> [Create an RDP connection to a Windows VM using Azure Bastion](../bastion/bastion-connect-vm-rdp-windows.md)
