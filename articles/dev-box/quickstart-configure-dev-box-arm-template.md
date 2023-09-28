---
title: 'Quickstart: Configure Microsoft Dev Box by using an ARM template'
description: In this quickstart, you learn how to configure the Microsoft Dev Box service to provide dev box workstations for users by using an ARM template.
services: dev-box
ms.service: dev-box
ms.topic: quickstart-arm
ms.custom: subject-armqs, devx-track-arm-template
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/20/2023
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components with an ARM template so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box by using an ARM template

This quickstart describes how to use an Azure Resource Manager (ARM) template to set up the Microsoft Dev Box Service in Azure. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="../media/template-deployments/deploy-to-azure.svg" alt-text="Screenshot of the Deploy to Azure button to deploy resources with a template." link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fdevbox-with-builtin-image%2Fazuredeploy.json":::

## Prerequisites 

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Entra AD. Your organization must use Entra AD for identity and access management.

## Review the template 

The template used in this QuickStart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/devbox-with-builtin-image/)

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.devcenter/devbox-with-builtin-image/azuredeploy.json":::

Multiple Azure resources are defined in the template: 

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): create a virtual network. 
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): create a subnet. 
- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters): create a dev center.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects): create a project.
- [Microsoft.DevCenter/networkConnections](/azure/templates/microsoft.devcenter/networkConnections): create a network connection. 
- [Microsoft.DevCenter/devcenters/devboxdefinitions](/azure/templates/microsoft.devcenter/devcenters/devboxdefinitions): create a dev box definition. 
- [Microsoft.DevCenter/projects/pools](/azure/templates/microsoft.devcenter/projects/pools): create a dev box pool.
 
### Find more templates

To find more templates that are related to Microsoft Dev Box, see [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter).

For example, the [Dev Box with customized image](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter/devbox-with-customized-image) template creates the following Dev Box resources: dev center, project, network connection, dev box definition, and dev box pool. You can then go to the [developer portal](https://aka.ms/devbox-portal) to [create your dev box](/azure/dev-box/quickstart-create-dev-box).

Next, you can use a template to [add other customized images for Base, Java, .NET and Data](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter/devbox-with-customized-image#add-other-customized-image-for-base-java-net-and-data). These images have the following software and tools installed:


|Image type  |Software and tools  |
|---------|---------|
|Base     |Git, Azure CLI, VS Code, VS Code Extension for GitHub Copilot |
|Java     |Git, Azure CLI, VS Code, Maven, OpenJdk11, VS Code Extension for Java Pack |
|.NET     |Git, Azure CLI, VS Code，.NET SDK, Visual Studio |
|Data     |Git, Azure CLI, VS Code，Python 3, VS Code Extension for Python and Jupyter |

## Deploy the template 

1. Select **Open Cloudshell** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure. 

   ```azurepowershell-interactive
   $vnetAddressPrefixes = Read-Host -Prompt "Enter a vnet address prefixes like 10.0.0.0/16" 
   $subnetAddressPrefixes = Read-Host -Prompt "Enter a vnet address prefixes like 10.0.0.0/24" 
   $location = Read-Host -Prompt "Enter the location (e.g. eastus)" 
   
   $resourceGroupName = "rg-devbox-test" 
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/devbox-with-builtin-image/azuredeploy.json" 
   New-AzResourceGroup -Name $resourceGroupName -Location $location 
   New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -vnetAddressPrefixes $vnetAddressPrefixes -subnetAddressPrefixes $subnetAddressPrefixes -location $location 

   Write-Host "After all the resources are provisioned, go to https://devportal.microsoft.com/ to create a Dev Box. You can also refer to this guide: [Quickstart: Create a dev box - Microsoft Dev Box | Microsoft Learn](https://learn.microsoft.com/azure/dev-box/quickstart-create-dev-box)." 
   Write-Host "Press [ENTER] to continue." 
   ```

   Wait until you see the prompt from the console.
 
2. Select **Copy** from the previous code block to copy the PowerShell script. 
3. Right-click the shell console pane and then select **Paste**. 
4. Enter the values. 

It takes about 10 minutes to deploy the template. When completed, the output is similar to: 

 :::image type="content" source="media/quickstart-configure-dev-box-arm-template/dev-box-template-output.png" alt-text="Screenshot showing the output of the template.":::

Azure PowerShell is used to deploy the template. You can also use the Azure portal and Azure CLI. To learn other deployment methods, see [Deploy templates](/azure/azure-resource-manager/templates/deploy-portal). 

#### Depending on your configuration, you may want to change the following parameters:  

- *Resource group name:* The default resource group name is “rg-devbox-test”; you can change it by editing `$resourceGroupName = "rg-devbox-test` in the template. 

- *Subnet:* If you have an existing subnet, you can use the parameter `-existingSubnetId` to pass the existing subnet ID. The template doesn't create a new Virtual network and subnet if you specify an existing one. 

- *Dev Box User role:* To grant the role [*DevCenter Dev Box User*](how-to-dev-box-user.md) to your user at Dev box project level, pass the principal ID to the `-principalId` parameter. 
   - **User:** You can find the principal ID listed as the object ID on the user Overview page.
     :::image type="content" source="media/quickstart-configure-dev-box-arm-template/user-object-id.png" alt-text="Screenshot showing the user overview page with object ID highlighted."::: 
   - **Group:** You can find the principal ID listed as the object ID on the group Overview page. 
     :::image type="content" source="media/quickstart-configure-dev-box-arm-template/group-object-id.png" alt-text="Screenshot showing the group overview page with object ID highlighted.":::

Alternatively, you can provide access to a dev box project in the Azure portal, see [Provide user-level access to projects for developers](how-to-dev-box-user.md) 
 
## Review deployed resources 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Resource groups** from the left pane. 
3. Select the resource group that you created in the previous section.  

   :::image type="content" source="media/quickstart-configure-dev-box-arm-template/dev-box-template-resources.png" alt-text="Screenshot showing the newly created dev box resource group and the resources it contains in the Azure portal.":::

1. Select the Dev Center. Its default name is dc-*resource-token*.
 
## Clean up resources 

When you no longer need them, delete the resource group: Go to the Azure portal, select the resource group that contains these resources, and then select Delete. 

 ## Next steps

- [Quickstart: Create a dev box](/azure/dev-box/quickstart-create-dev-box)
- [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md)
