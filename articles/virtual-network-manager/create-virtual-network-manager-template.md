---
title: 'Quickstart: Deploy a network topology with Azure Virtual Network Manager using Azure Resource Manager template - ARM template'
description: In this article, you deploy various network topologies with Azure Virtual Network Manager using Azure Resource Manager template(ARM template).
services: virtual-network-manager
author: mbender-ms
ms.author: mbender
ms.date: 08/15/2023
ms.topic: quickstart
ms.service: virtual-network-manager
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Deploy a network topology with Azure Virtual Network Manager using Azure Resource Manager template - ARM template

Get started with Azure Virtual Network Manager by using Azure Resource Manager templates to manage connectivity for all your virtual networks.

In this quickstart, an Azure Resource Manager template is used to deploy Azure Virtual Network Manager with different connectivity topology and network group membership types. Use deployment parameters to specify the type of configuration to deploy.

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

   [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- To support deploying Azure Policy for [dynamic group membership](concept-network-groups.md#dynamic-membership), the template is designed to deploy at the subscription scope. However, it's not a requirement for Azure Virtual Network Manager if using static group membership.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/virtual-network-manager-connectivity/)

:::code language="json" source="~/quickstart-templates/subscription-deployments/microsoft.network/virtual-network-manager-connectivity/azuredeploy.json":::

The template defines multiple Azure resources:

- [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks)
- [**Microsoft.Resources/resourceGroups**](/azure/templates/microsoft.resources/resourcegroups)
- [**Microsoft.Resources/deployments**](/azure/templates/microsoft.resources/deployments)
- [**Microsoft.Authorization/policyDefinitions**](/azure/templates/microsoft.authorization/policydefinitions)
- [**Microsoft.Authorization/policyAssignments**](/azure/templates/microsoft.authorization/policyassignments)
- [**Microsoft.Network/networkManagers/networkGroups/staticMembers**](/azure/templates/microsoft.network/networkmanagers/networkgroups/staticmembers)
- [**Microsoft.Network/networkManagers/networkGroups**](/azure/templates/microsoft.network/networkmanagers/networkgroups)
- [**Microsoft.Network/networkManagers/connectivityConfigurations**](/azure/templates/Microsoft.Network/networkManagers/connectivityconfigurations)
- [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/microsoft.managedidentity/userassignedidentities)
- [**Microsoft.Authorization/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments)
- [**Microsoft.Resources/deploymentScripts**](/azure/templates/microsoft.resources/deploymentscripts)

## Deploy the template

1. Sign in to Azure and open the Azure Resource Manager template by selecting the **Deploy to Azure** button here. The template creates the instance of Azure Virtual Network Manager, the network infrastructure, and the network manager configurations.

   [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)

1. In the Azure portal, select or enter the following information:

   | Setting | Value |
   |---|---|
   | Subscription | Select the subscription to use for the deployment. |
   | **Instance Details** |  |
   | Resource Group Name | Use the default of **rg-avnm-sample** |
   | Region | Select the region to deploy the resources. |
   | Location | Enter the location to deploy the resources. The location value is used in the resource naming convention</br> The location matches the **Region** you've chosen, and is written with no spaces. For example, **East US** is written as **EastUS**. |
   | Connectivity Topology | Select the connectivity topology to deploy. The options include **mesh**, **hubAndSpoke**, and **meshWithHubAndSpoke**. |
   | Network Group Membership Type | Select the network group membership type. The options include **static** and **dynamic**. |

1. Select **Review + create** to review the settings and read the terms and conditions statement. 
1. Select **Create** to deploy the template.
1. The deployment takes a few minutes to complete. After the deployment is complete, the **Deployment succeeded** message appears.

## Validate the deployment

1. From the **Home** page in the Azure portal, select **Resource groups** and select **rg-avnm-sample**.
1. Verify all of the components are deployed successfully.

    :::image type="content" source="media/create-virtual-network-manager-template/template-resources.png" alt-text="Screenshot of all deployed resources in Azure portal.":::

1. Select the **avnm-EastUS** resource.
1. In the **Network Groups** page,  select **Settings>NetworkGroups>ng-EastUS-static**.
   
   :::image type="content" source="media/create-virtual-network-manager-template/static-network-group.png" alt-text="Screenshot of deployed network groups in Azure portal.":::

1. On the **ng-EastUS-static** page, select **Settings>Group Members** and verify a set of virtual networks are deployed.

    :::image type="content" source="media/create-virtual-network-manager-template/mesh-group-members.png" alt-text="Screenshot of static members in network group for a static topology deployment.":::

> [!NOTE]
> Depending on the selections you made for the deployment, you may see different virtual networks for the group members.

## Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. Doing so removes the private endpoint and all the related resources.

1. To delete the resource group, open the resource group in the Azure portal and select **Delete resource group**.
1. Enter the name of the resource group, and then select **Delete**.
1. One the resource group is deleted, verify the network manager instance and all related resources are deleted.

## Next steps

For more information about deploying Azure Virtual Network Manager, see:
> [!div class="nextstepaction"]
> [Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Terraform](create-virtual-network-manager-terraform.md)