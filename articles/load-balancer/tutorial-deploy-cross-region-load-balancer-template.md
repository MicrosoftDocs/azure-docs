---
title: Deploy a cross-region load balancer with Azure Resource Manager templates | Microsoft Docs
description: Deploy a cross-region load balancer with Azure Resource Manager templates
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial 
ms.date: 04/12/2023
ms.custom: template-tutorial
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Deploy a cross-region load balancer with Azure Resource Manager templates

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

Using an ARM template takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fload-balancer-cross-region%2Fazuredeploy.json)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

## Prerequisites

-  An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Access to Azure Portal 
- An Azure Resource Group 
- An Azure Virtual Network and Subnet configured  

## Review the template
In this section, you will review the template and the parameters that are used to deploy the cross-region load balancer. 
The template used in this quickstart is from the [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/load-balancer-cross-region/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.compute/2-vms-internal-load-balancer/azuredeploy.json":::
1. Sign in to the [<service> portal](url).
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

To find more templates that are related to Azure Load Balancer, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

## Deploy the template

1. Sign in to the Azure portal.
1. Enter and select **Deploy a custom template** in the search bar
1. In the **Custom deployment** page, enter **load-balancer-cross-region** in the **Quickstart template** textbox and select **quickstarts/microsoft.network/load-balancer-cross-region**.

    :::image type="content" source="media/tutorial-deploy-cross-region-load-balancer-template/select-quickstart-template.png" alt-text="Screenshot of Custom deployment page for selecting quickstart ARM template.":::

1. Choose **Select template** and enter the following information:

    | Name | Value |
    | --- | --- |
    | Subscription | Select your subscription |
    | Resource group | Select your resource group or create a new resource group |
    | Region | Select the region where the resources will be deployed |
    | Project Name | Enter a project name that will be used to create unique resource names |
    | LocationCR | Select the location where the cross-region load balancer will be deployed |
    | Location-r1 | Select the region where the regional load balancer and VMs will be deployed |
    | Location-r2 | Select the region where the regional load balancer and VMs will be deployed |
    | Admin Username | Enter a username for the virtual machines |
    | Admin Password | Enter a password for the virtual machines |


1. Select **Review + create** to run template validation.
1. If no errors are present, Review the terms of the template and click **Create**.

## Verify the deployment

1. Select **Resource groups** from the left pane.
1. Select the resource group used for the deployment.
1. Select the cross-region load balancer. It will be the load balancer ending in **-cr**.
1. Note the public IP address of the cross-region load balancer listed under **Public IP address**.
1. Enter the public IP address in your webbrowser. The page will resovlve to the default IIS Windows Server web page.

    :::image type="content" source="media/tutorial-deploy-cross-region-load-balancer-template/default-web-page.png" alt-text="Screenshot of default IIS Windows Server web page in web browser.":::

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

In this tutorial, you:
- Created a cross region load balancer\
- Created a regional load balancer
- Created 3 virtual machines and linked them to the regional load balancer
- Configured the cross-region load balancer to work with the regional load balancer
- Tested the cross-region load balancer. 

Learn more about cross-region load balancer.  
Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
