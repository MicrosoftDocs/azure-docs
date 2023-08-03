---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Azure Resource Manager template (ARM template)'
description: In this article, you create a mesh network topology with Azure Virtual Network Manager using using Azure Resource Manager template (ARM template).
services: virtual-network-manager
author: mbender-ms
ms.author: mbender
ms.date: 08/11/2023
ms.topic: quickstart
ms.service: virtual-network-manager
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Azure Resource Manager template (ARM template)

Get started with Azure Virtual Network Manager by using Bicep to manage connectivity for all your virtual networks.

In this quickstart, an Azure Resource Manager template is used to deploy Azure Virtual Network Manager and example Virtual Networks with different connectivity topology and network group membership types. Use deployment parameters to specify the type of configuration to deploy.

In order to support deploying Azure Policy for dynamic group membership, this sample is designed to deploy at the subscription scope. However, this is not a requirement for Azure Virtual Network Manager if using static group membership.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-create%2Fazuredeploy.json)
[![Deploy To Azure US Gov](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.svg?sanitize=true)](https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-create%2Fazuredeploy.json)
[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-create%2Fazuredeploy.json)

:::image type="content" source="media/create-virtual-network-manager-portal/virtual-network-manager-resources-diagram.png" alt-text="Diagram of resources deployed for a mesh virtual network topology with Azure virtual network manager.":::

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://learn.microsoft.com/samples/azure/azure-quickstart-templates/virtual-network-manager-connectivity/).

:::code language="json" source="~/quickstart-templates/subscription-deployments/microsoft.network/virtual-network-manager-connectivity/azuredeploy.json":::

The template defines multiple Azure resources:
* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks) - Three virtual networks are created in the same region. Each virtual network has a subnet named **default**.
* [**Microsoft.Resources/resourceGroups**](/azure/templates/microsoft.resources/resourcegroups) - A resource group is created for all resources.
* [**Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) - A deployment is created for each virtual network.
* [**Microsoft.Authorization/policyDefinitions**](/azure/templates/microsoft.authorization/policydefinitions) - A policy definition is created for the dynamic group membership policy.
* [**Microsoft.Authorization/policyAssignments**](/azure/templates/microsoft.authorization/policyassignments) - A policy assignment is created for the dynamic group membership policy.
* [**Microsoft.Network/networkManagers/networkGroups/staticMembers**](/azure/templates/microsoft.network/networkmanagers/networkgroups/staticmembers) - A static member is added to each network group.
* [**Microsoft.Network/networkManagers/networkGroups**](/azure/templates/microsoft.network/networkmanagers/networkgroups) - A network group is created for each virtual network.
* [**Microsoft.Network/networkManagers**](/azure/templates/microsoft.network/networkmanagers) - This is the Azure Virtual Network Manager which will be used to implement the connected group for spoke-to-spoke connectivity.
* [**Microsoft.Network/networkManagers/connectivityConfigurations**](Microsoft.Network/networkManagers/connectivityConfigurations) - A connectivity configuration is created for topologies.
* [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/microsoft.managedidentity/userassignedidentities) - A user-assigned identity is used by the Deployment Script resource to interact with Azure resources.
* [**Microsoft.Authorization/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments) - A role assignment is created for the user-assigned identity.
* [**Microsoft.Resources/deploymentScripts**](/azure/templates/microsoft.resources/deploymentscripts) - A deployment script is used to apply the connectivity configuration to the Azure Virtual Network Manager.

To find more templates that are related to Azure Traffic Manager, see [Azure Quickstart Templates](https://learn.microsoft.com/samples/browse/?terms=%22virtual%20network%20manager%22&products=azure&languages=bicep%2Cjson).

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button here. The template creates the private endpoint, the instance of SQL Database, the network infrastructure, and a virtual machine to be validated.

   [![The 'Deploy to Azure' button.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.sql%2Fprivate-endpoint-sql%2Fazuredeploy.json)

1. Select your resource group or create a new one.
1. Enter the SQL administrator sign-in name and password.
1. Enter the virtual machine administrator username and password.
1. Read the terms and conditions statement. If you agree, select **I agree to the terms and conditions stated above**, and then select **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. Doing so removes the private endpoint and all the related resources.

To delete the resource group, run the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> 