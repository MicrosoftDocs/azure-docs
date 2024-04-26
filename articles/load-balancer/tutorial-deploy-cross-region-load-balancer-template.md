---
title: Deploy a cross-region load balancer with Azure Resource Manager templates | Microsoft Docs
description: Deploy a cross-region load balancer with Azure Resource Manager templates
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial 
ms.date: 04/12/2023
ms.custom: template-tutorial, devx-track-arm-template
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Deploy a cross-region load balancer with Azure Resource Manager templates

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

Using an ARM template takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fload-balancer-cross-region%2Fazuredeploy.json":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

## Prerequisites

-  An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F) and access to the Azure portal.

## Review the template
In this section, you review the template and the parameters that are used to deploy the cross-region load balancer. 
The template used in this quickstart is from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/load-balancer-cross-region/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.compute/2-vms-internal-load-balancer/azuredeploy.json":::

> [!NOTE] 
> When you create a standard load balancer, you must also create a new standard public IP address that is configured as the frontend for the standard load balancer. Also, the Load balancers and public IP SKUs must match. In our case, we will create two standard public IP addresses, one for the regional level load balancer and another for the cross-region load balancer.  

Multiple Azure resources have been defined in the template:
- [**Microsoft.Network/loadBalancers**](/azure/templates/microsoft.network/loadBalancers):Regional and cross-region load balancers.

- [**Microsoft.Network/publicIPAddresses**](/azure/templates/microsoft.network/publicipaddresses): for the load balancer, bastion host, and for each of the virtual machines.
- [**Microsoft.Network/bastionHosts**](/azure/templates/microsoft.network/bastionhosts)
- [**Microsoft.Network/networkSecurityGroups**](/azure/templates/microsoft.network/networksecuritygroups)

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualNetworks): Virtual network for load balancer and virtual machines.

- [**Microsoft.Compute/virtualMachines**](/azure/templates/microsoft.compute/virtualMachines) (2): Virtual machines.

- [**Microsoft.Network/networkInterfaces**](/azure/templates/microsoft.network/networkInterfaces) (2): Network interfaces for virtual machines.

- [**Microsoft.Compute/virtualMachine/extensions**](/azure/templates/microsoft.compute/virtualmachines/extensions) (2): use to configure the Internet Information Server (IIS), and the web pages.

> [!IMPORTANT]

> [!INCLUDE [Pricing](../../includes/bastion-pricing.md)]

>

To find more templates that are related to Azure Load Balancer, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Enter and select **Deploy a custom template** in the search bar
1. In the **Custom deployment** page, enter **load-balancer-cross-region** in the **Quickstart template** textbox and select **quickstarts/microsoft.network/load-balancer-cross-region**.

    :::image type="content" source="media/tutorial-deploy-cross-region-load-balancer-template/select-quickstart-template.png" alt-text="Screenshot of Custom deployment page for selecting quickstart ARM template.":::

1. Choose **Select template** and enter the following information:

    | Name | Value |
    | --- | --- |
    | Subscription | Select your subscription |
    | Resource group | Select your resource group or create a new resource group |
    | Region | Select the deployment region for resources |
    | Project Name | Enter a project name used to create unique resource names |
    | LocationCR | Select the deployment region for the cross-region load balancer |
    | Location-r1 | Select the deployment region for the regional load balancer and VMs |
    | Location-r2 | Select the deployment region where the regional load balancer and VMs  |
    | Admin Username | Enter a username for the virtual machines |
    | Admin Password | Enter a password for the virtual machines |


1. Select **Review + create** to run template validation.
1. If no errors are present, Review the terms of the template and select **Create**.

## Verify the deployment

1. If necessary, sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** from the left pane.
1. Select the resource group used in the deployment. The default resource group name is the **project name** with **-rg** appended. For example, **crlb-learn-arm-rg**.
1. Select the cross-region load balancer. Its default name is the project name with **-cr** appended. For example, **crlb-learn-arm-cr**.
1. Copy only the IP address part of the public IP address, and then paste it into the address bar of your browser. The page resolves to a default IIS Windows Server web page.

    :::image type="content" source="media/tutorial-deploy-cross-region-load-balancer-template/default-web-page.png" alt-text="Screenshot of default IIS Windows Server web page in web browser.":::

## Clean up resources

When you no longer need them, delete the:

* Resource group
* Load balancer
* Related resources

1. Go to the Azure portal, select the resource group that contains the load balancer, and then select **Delete resource group**.
1. Select **apply force delete for selected Virtual machines and Virtual machine scale sets**, enter the name of the resource group, and then select **Delete > Delete **.

## Next steps

In this tutorial, you:
- Created a cross region load balancer\
- Created a regional load balancer
- Created three virtual machines and linked them to the regional load balancer
- Configured the cross-region load balancer to work with the regional load balancer
- Tested the cross-region load balancer. 

Learn more about cross-region load balancer.  
Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Tutorial: Create a load balancer with more than one availability set in the backend pool](tutorial-multi-availability-sets-portal.md)
