---
title: 'Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Azure Resource Manager template (ARM template)'
description: In this article, you create a mesh network topology with Azure Virtual Network Manager using Azure Resource Manager template (ARM template).
services: virtual-network-manager
author: mbender-ms
ms.author: mbender
ms.date: 08/11/2023
ms.topic: quickstart
ms.service: virtual-network-manager
ms.custom: template-quickstart, subject-armqs, mode-arm, devx-track-arm-template
---

# Quickstart: Create a mesh network topology with Azure Virtual Network Manager using Azure Resource Manager template (ARM template)

Get started with Azure Virtual Network Manager by using Azure Resource Manager templates to manage connectivity for all your virtual networks.

In this tutorial, an Azure Resource Manager template is used to deploy Azure Virtual Network Manager and example Virtual Networks with different connectivity topology and network group membership types. Use deployment parameters to specify the type of configuration to deploy.

In order to support deploying Azure Policy for dynamic group membership, this sample is designed to deploy at the subscription scope. However, this isn't a requirement for Azure Virtual Network Manager if using static group membership.

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)
[![Deploy To Azure US Gov](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazuregov.svg?sanitize=true)](https://portal.azure.us/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)
[![Visualize](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/visualizebutton.svg?sanitize=true)](http://armviz.io/#/?load=https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)

> [!IMPORTANT]
> Azure Virtual Network Manager is generally available for Virtual Network Manager and hub-and-spoke connectivity configurations. Mesh connectivity configurations and security admin rules remain in public preview.
>
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template opens in the Azure portal.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/virtual-network-manager-connectivity/)

:::code language="json" source="~/quickstart-templates/subscription-deployments/microsoft.network/virtual-network-manager-connectivity/azuredeploy.json":::

The template defines multiple Azure resources:
* [**Microsoft.Network/virtualNetworks**](/azure/templates/microsoft.network/virtualnetworks) - Three virtual networks are created in the same region. Each virtual network has a subnet named **default**.
* [**Microsoft.Resources/resourceGroups**](/azure/templates/microsoft.resources/resourcegroups) - A resource group is created for all resources.
* [**Microsoft.Resources/deployments](/azure/templates/microsoft.resources/deployments) - A deployment is created for each virtual network.
* [**Microsoft.Authorization/policyDefinitions**](/azure/templates/microsoft.authorization/policydefinitions) - A policy definition is created for the dynamic group membership policy.
* [**Microsoft.Authorization/policyAssignments**](/azure/templates/microsoft.authorization/policyassignments) - A policy assignment is created for the dynamic group membership policy.
* [**Microsoft.Network/networkManagers/networkGroups/staticMembers**](/azure/templates/microsoft.network/networkmanagers/networkgroups/staticmembers) - A static member is added to each network group.
* [**Microsoft.Network/networkManagers/networkGroups**](/azure/templates/microsoft.network/networkmanagers/networkgroups) - A network group is created for each virtual network.
* [**Microsoft.Network/networkManagers**](/azure/templates/microsoft.network/networkmanagers) - This is the Azure Virtual Network Manager that is used to implement the connected group for spoke-to-spoke connectivity.
* [**Microsoft.Network/networkManagers/connectivityConfigurations**](/azure/templates/Microsoft.Network/networkManagers/connectivityconfigurations) - A connectivity configuration is created for topologies.
* [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/microsoft.managedidentity/userassignedidentities) - A user-assigned identity is used by the Deployment Script resource to interact with Azure resources.
* [**Microsoft.Authorization/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments) - A role assignment is created for the user-assigned identity.
* [**Microsoft.Resources/deploymentScripts**](/azure/templates/microsoft.resources/deploymentscripts) - A deployment script is used to apply the connectivity configuration to the Azure Virtual Network Manager.

## Solution deployment parameters

| Parameter | Type | Description | Default |
|---|---|---|--|
| `location` | string | Deployment location. Location must support availability zones. | *eastus* |
| `resourceGroupName` | string | The name of the resource group where the virtual network manager will be deployed | *rg-avnm-sample* |
| `connectivityTopology` | string | Defines how spokes connect to each other and how spokes connect the hub. Valid values: **mesh**, **hubAndSpoke**, **meshWithHubAndSpoke** | *meshWithHubAndSpoke* |
| `networkGroupMembershipType` | string | Connectivity group membership type | *static* |

## Deploy the template

1. Select **Try it** from the following code block to open Azure Cloud Shell, and then follow the instructions to sign in to Azure.

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button here. The template creates the instance of Azure Virtual Network Manager, the network infrastructure, and the network manager configurations.

   [![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsubscription-deployments%2Fmicrosoft.network%2Fvirtual-network-manager-connectivity%2Fazuredeploy.json)

1. In the Azure portal, select or enter the following information:

   | Setting | Value |
   |---|---|
   | Subscription | Select the subscription to use for the deployment. |
   | **Instance Details** |  |
   | Resource Group Name | Use the default of  |
   | Region | Select the region to deploy the resources. |
   | Location | Enter the location to deploy the resources.</br> This matches the **Region** you've chosen, and is written with no spaces. For example, *East US* is written as EastUS. |
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