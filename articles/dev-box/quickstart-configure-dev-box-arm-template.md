---
title: 'Quickstart: Configure Microsoft Dev Box by using an ARM template'
description: In this quickstart, you learn how to configure the Microsoft Dev Box service to provide dev box workstations for users by using an ARM template.
services: dev-box
ms.service: dev-box
ms.topic: quickstart-arm
ms.custom: subject-armqs, devx-track-arm-template
author: RoseHJM
ms.author: rosemalcolm
ms.date: 11/28/2023
#Customer intent: As an enterprise admin, I want to understand how to create and configure dev box components with an ARM template so that I can provide dev box projects for my users.
---

# Quickstart: Configure Microsoft Dev Box by using an ARM template

This quickstart describes how to use an Azure Resource Manager (ARM) template to set up the Microsoft Dev Box Service in Azure. 

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

This [Dev Box with customized image](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter/devbox-with-customized-image) template deploys a simple Dev Box environment that you can use for testing and exploring the service.

It creates the following Dev Box resources: dev center, project, network connection, dev box definition, and dev box pool. Once the template is deployed, you can go to the [developer portal](https://aka.ms/devbox-portal) to [create your dev box](quickstart-create-dev-box.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the
**Deploy to Azure** button. The template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.devcenter%2Fdevbox-with-customized-image%2Fazuredeploy.json":::

## Prerequisites 

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Owner or Contributor role on an Azure subscription or resource group.
- Microsoft Entra AD. Your organization must use Microsoft Entra AD for identity and access management.
- Microsoft Intune subscription. Your organization must use Microsoft Intune for device management.

## Review the template 

The template used in this QuickStart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/devbox-with-customized-image/).

The template for this article is too long to show here. To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/devbox-with-customized-image/azuredeploy.json)

Multiple Azure resources are defined in the template: 

- [Microsoft.Network/virtualNetworks](/azure/templates/microsoft.network/virtualnetworks): create a virtual network. 
- [Microsoft.Network/virtualNetworks/subnets](/azure/templates/microsoft.network/virtualnetworks/subnets): create a subnet. 
- [Microsoft.DevCenter/devcenters](/azure/templates/microsoft.devcenter/devcenters): create a dev center.
- [Microsoft.DevCenter/projects](/azure/templates/microsoft.devcenter/projects): create a project.
- [Microsoft.DevCenter/networkConnections](/azure/templates/microsoft.devcenter/networkConnections): create a network connection. 
- [Microsoft.DevCenter/devcenters/devboxdefinitions](/azure/templates/microsoft.devcenter/devcenters/devboxdefinitions): create a dev box definition. 
- [Microsoft.DevCenter/devcenters/galleries](/azure/templates/microsoft.devcenter/devcenters/galleries): create an Azure Compute Gallery. 
- [Microsoft.DevCenter/projects/pools](/azure/templates/microsoft.devcenter/projects/pools): create a dev box pool.
 
## Deploy the template 

1. Select **Open Cloudshell** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure. 

   ```azurepowershell-interactive
   $userPrincipalName = Read-Host "Please enter user principal name e.g. alias@xxx.com"
   $resourceGroupName = Read-Host "Please enter resource group name e.g. rg-devbox-dev"
   $location = Read-Host "Please enter region name e.g. eastus"
   $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.devcenter/devbox-with-customized-image/azuredeploy.json" 
   $userPrincipalId=(Get-AzADUser -UserPrincipalName $userPrincipalName).Id
   if($userPrincipalId){
       Write-Host "Start provisioning..."
       az group create -l $location -n $resourceGroupName
       az group deployment create -g $resourceGroupName --template-uri $templateUri  --parameters userPrincipalId=$userPrincipalId
   }else {
       Write-Host "User Principal Name cannot be found."
   }

   Write-Host "Provisioning Completed."

   ```

   Wait until you see the prompt from the console.
 
2. Select **Copy** from the previous code block to copy the PowerShell script. 
3. Right-click the shell console pane and then select **Paste**. 
4. Enter the values. 

It takes about 30 minutes to deploy the template. 

Azure PowerShell is used to deploy the template. You can also use the Azure portal and Azure CLI. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-portal.md). 

### Required parameters:  

- *User Principal ID*: The user principal ID of the user or group that is granted the *Devcenter Dev Box User* role.
- *User Principal Type*: The type of user principal. Valid values are *User* or *Group*.
- *Location*: The location where the resources are deployed. Choose a location close to the dev boxes users to reduce latency.

Alternatively, you can provide access to a dev box project in the Azure portal, see [Provide user-level access to projects for developers](how-to-dev-box-user.md). 

### Virtual network considerations

- **Security:** 
Planning for a Microsoft Dev Box deployment covers many areas, including securing the virtual network (VNet). For more information, see [Azure network security overview](../security/fundamentals/network-overview.md).

- **NIC resource group:**
Microsoft Dev Box automatically creates a resource group for each network connection, which holds the network interface cards (NICs) that use the virtual network assigned to the network connection. The resource group has a fixed name based on the name and region of the network connection. You can't change the name of the resource group, or specify an existing resource group.

## Review deployed resources 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Resource groups** from the left pane. 
3. Select the resource group that you created in the previous section.  

   :::image type="content" source="media/quickstart-configure-dev-box-arm-template/dev-box-template-resources.png" alt-text="Screenshot showing the newly created dev box resource group and the resources it contains in the Azure portal." lightbox="media/quickstart-configure-dev-box-arm-template/dev-box-template-resources.png":::
 
## Clean up resources 

When you no longer need them, delete the resource group: Go to the Azure portal, select the resource group that contains these resources, and then select Delete. 

## Find more templates

To find more templates that are related to Microsoft Dev Box, see [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter).

For example, you can use a template to [add other customized images for Base, Java, .NET and Data](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.devcenter/devbox-with-customized-image#add-other-customized-image-for-base-java-net-and-data). These images have the following software and tools installed:


|Image type  |Software and tools  |
|---------|---------|
|Base     |Git, Azure CLI, VS Code, VS Code Extension for GitHub Copilot |
|Java     |Git, Azure CLI, VS Code, Maven, OpenJdk11, VS Code Extension for Java Pack |
|.NET     |Git, Azure CLI, VS Code，.NET SDK, Visual Studio |
|Data     |Git, Azure CLI, VS Code，Python 3, VS Code Extension for Python and Jupyter |

 ## Next steps

- [Quickstart: Create a dev box](quickstart-create-dev-box.md)
- [Configure Azure Compute Gallery for Microsoft Dev Box](how-to-configure-azure-compute-gallery.md)
