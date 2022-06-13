---
title: 'Quickstart: Deploy Azure Bastion in a virtual network using an ARM template'
titleSuffix: Azure Bastion
description: Learn how to deploy Azure Bastion in a virtual network using an ARM template.
author: abell
ms.author: abell
ms.service: bastion
ms.topic: quickstart 
ms.date: 06/13/2022
ms.custom: template-quickstart 
Customer intent: As someone with a networking background, I want to deploy Azure Bastion to a virtual machine using a Bastion ARM Template.
---


# Quickstart: Deploy Azure Bastion in a virtual network using an ARM template

This quickstart describes how to use Azure Bastion template to deploy to a virtual network.

An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment.

If your environment meets the prerequisites and you're familiar with using ARM templates, select the Deploy to Azure button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)
## Prerequisites

* **An Azure account with an active subscription**. If you don't have one, [create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

* **A VM in a VNet**.

    When you deploy Bastion using default values, the values are pulled from the VNet in which your VM resides. This VM doesn't become a part of the Bastion deployment itself, but you do connect to it later in the exercise.

  * If you don't already have a VM in a VNet, create one using [Quickstart: Create a Windows VM](../virtual-machines/windows/quick-create-portal.md), or [Quickstart: Create a Linux VM](../virtual-machines/linux/quick-create-portal.md).
  * If you need example values, see the [Example values](#values) section.
  * If you already have a virtual network, make sure it's selected on the Networking tab when you create your VM.
  * If you don't have a virtual network, you can create one at the same time you create your VM.

* **Required VM roles:**

  * Reader role on the virtual machine.
  * Reader role on the NIC with private IP of the virtual machine.

> [!NOTE]
> The use of Azure Bastion with Azure Private DNS Zones is not supported at this time. Before you begin, please make sure that the virtual network where you plan to deploy your Bastion resource is not linked to a private DNS zone.
>
### <a name="values"></a>Example values

You can use the following example values when creating this configuration, or you can substitute your own.

**Basic VNet and VM values:**

| **Name**        | **Value**             |
|-----------------|-----------------------|
| Virtual machine | TestVM                |
| Resource group  | TestRG1               |
| Region          | East US               |
| Virtual network | VNet1                 |
| Address space   | 10.1.0.0/16           |
| Subnets         | FrontEnd: 10.1.0.0/24 |

## Review the template
This template deploys an Azure Bastion service to your virtual network. The template that this quickstart uses is from [Azure Quickstart Templates: Azure Bastion as a Service](https://azure.microsoft.com/resources/templates/azure-bastion-nsg/).

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
>To find more templates, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).
>
## Deploy the template

In this section, you'll deploy Bastion using the **Deploy to Azure** button below or in the Azure portal. You don't connect and sign in to your virtual machine or deploy Bastion from your VM directly.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select the **Deploy to Azure** button below.

     [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2fquickstarts%2fmicrosoft.network%2fazure-bastion-nsg%2fazuredeploy.json)

3. In the **Azure Bastion as a Service: Azure Quickstart Template**, enter or select the following information.
    :::image type="content" source="./media/quickstart-host-arm-template/bastion-template-values.png" alt-text="Screenshot Bastion ARM template example values." lightbox="./media/quickstart-host-arm-template/bastion-template-values.png":::

| Setting                  | Value                          |
|--------------------------|--------------------------------|
| Subscription             | Select your Azure subscription |
| Resource Group           | Select **TestRG1**             |
| Region                   | Enter **East US**              |
| vnet-name                | Enter **VNet1**                |
| vnet-ip-prefix           | Enter **10.1.0.0/16**          |
| vnet-new-or-existing     | Select **existing**            |
| bastion-subnet-ip-prefix | Enter **10.1.1.0/24**          |
| bastion-host-name        | Enter **TestBastionHost**      |

4. Select the **Review + create** tab or select the **Review + create** button. Select **Create**.
5. The deployment will complete within 10 minutes. You can view the progress on the template **Overview** page. If you close the portal, deployment will continue.

> [!NOTE]
> To view the template, click **Edit template**. On this page, you can adjust some of the values such as address space or the name of certain resources. **Save** to save your changes, or **Discard**.
>

## Validate the deployment

In this section, you'll validate the deployment of Azure Bastion.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **TestRG1** resource group that you created in the previous section.
1. Select your **TestVM** virtual machine. From the Overview page, scroll down to **Operations** in the left pane and select **Bastion**.
1. Enter the username and password you created for your virtual machine and select **Connect**.
 :::image type="content" source="./media/quickstart-host-arm-template/connect-to-virtual-machine.png" alt-text="Screenshot shows the connect using Azure Bastion dialog." lightbox="./media/quickstart-host-arm-template/connect-to-virtual-machine.png":::
1. The connection to this virtual machine via Bastion will open directly in the Azure portal (over HTML5) using port 443 and the Bastion service. Select **Allow** when asked for permissions to the clipboard. This lets you use the remote clipboard arrows on the left of the screen.

   * When you connect, the desktop of the VM may look different than the example screenshot.
   * Using keyboard shortcut keys while connected to a VM may not result in the same behavior as shortcut keys on a local computer. For example, when connected to a Windows VM from a Windows client, CTRL+ALT+END is the keyboard shortcut for CTRL+ALT+Delete on a local computer. To do this from a Mac while connected to a Windows VM, the keyboard shortcut is Fn+CTRL+ALT+Backspace.

     :::image type="content" source="./media/quickstart-host-arm-template/connected.png" alt-text="Screenshot of RDP connection." lightbox="./media/quickstart-host-arm-template/connected.png":::

## Clean up resources

When you're done using the virtual network and the virtual machines, delete the resource group and all of the resources it contains:

1. Enter the name of your resource group in the **Search** box at the top of the portal and select it from the search results.

1. Select **Delete resource group**.

1. Enter your resource group for **TYPE THE RESOURCE GROUP NAME** and select **Delete**.

## Next steps

In this quickstart, you deployed Bastion from your virtual machine resource using the Bastion ARM template, and then connected to a virtual machine securely via Bastion. Next, you can continue with the following steps if you want to copy and paste to your virtual machine.

> [!div class="nextstepaction"]
> [Copy and paste to a Windows VM](bastion-vm-copy-paste.md)

> [Connect to a virtual machine scale set using Azure Bastion](bastion-connect-vm-scale-set.md)
