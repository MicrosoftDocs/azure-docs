---
title: "Quickstart: Create a Standard Load Balancer - Azure Resource Manager template"
titlesuffix: Azure Load Balancer
description: This quickstart shows how to create a Standard Load Balancer by using the Azure Resource Manager template.
services: load-balancer
documentationcenter: na
author: KumudD
manager: twooley
Customer intent: I want to create a Standard Load Balancer by using Azure Resource Manager template so that I can load balance internet traffic to VMs.
ms.service: load-balancer
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/30/2019
ms.author: kumud
ms.custom: mvc
---

# Quickstart: Create a Standard Load Balancer to load balance VMs by using Azure Resource Manager template

Load balancing provides a higher level of availability and scale by spreading incoming requests across multiple virtual machines. You can deploy an Azure Resource Manager template to create a load balancer to load balance virtual machines (VMs). This quickstart shows you how to load balance VMs using a Standard Load Balancer.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a standard load balancer

In this section, you create a Standard Load Balancer that helps load balance virtual machines. Standard Load Balancer only supports a Standard Public IP address. When you create a Standard Load Balancer, and you must also create a new Standard Public IP address that is configured as the frontend (named as *LoadBalancerFrontend* by default) for the Standard Load Balancer. There are many methods that can be used to create a standard load balancer. In this quickstart, you use Azure PowerShell to deploy a [Resource Manager template](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/101-load-balancer-standard-create/azuredeploy.json). Resource Manager templates are JSON files that define the resources you need to deploy for your solution. To understand the concepts associated with deploying and managing your Azure solutions, see [Azure Resource Manager documentation](/azure/azure-resource-manager/). To find more Azure Load Balancer related template, see [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Network&pageNumber=1&sort=Popular).

To deploy the template, select **Try it** to open the Azure Cloud shell, and then paste the following PowerShell script into the shell window. To paste the code, right-click the shell window and then select **Paste**.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name with 12 or less letters or numbers that is used to generate Azure resource names"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$adminUserName = Read-Host -Prompt "Enter the virtual machine administrator account name"
$adminPassword = Read-Host -Prompt "Enter the virtual machine administrator password" -AsSecureString

$resourceGroupName = "${projectName}rg"
$templateUri = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/101-load-balancer-standard-create/azuredeploy.json"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -projectName $projectName -location $location -adminUsername $adminUsername -adminPassword $adminPassword
```

Notice the resource group name is the project name with **rg** appended. You need the resource group name in the next section.  It takes a few minutes to create the resources.

## Test the Load Balancer

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Resource groups** from the left pane.
1. Select the resource group you created in the last section.  The default resource group name is the project name with **rg** appended.
1. Select the load balancer.  There is only one load balancer. The default name is the project name with **-lb** appended.
1. Copy the public IP address (only the IP address part), and then paste it into the address bar of your browser. The default page of IIS Web server is displayed on the browser.

   ![IIS Web server](./media/tutorial-load-balancer-standard-zonal-portal/load-balancer-test.png)

To see the Load Balancer distribute traffic across all three VMs, you can force-refresh your web browser from the client machine.

## Clean up resources

When no longer needed, delete the resource group, Load Balancer, and all related resources. To do so, select the resource group that contains the Load Balancer from the Azure portal, and then select **Delete resource group**.

## Next steps

In this quickstart, you created a Standard Load Balancer, attached VMs to it, configured the Load Balancer traffic rule, health probe, and then tested the Load Balancer. To learn more about Azure Load Balancer, continue to the tutorials for Azure Load Balancer.

> [!div class="nextstepaction"]
> [Azure Load Balancer tutorials](tutorial-load-balancer-standard-public-zone-redundant-portal.md)
