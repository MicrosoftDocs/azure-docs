---
title: Move an Azure virtual network to another Azure region using the Azure portal.
description: Move an Azure virtual network from one Azure region to another by using a Resource Manager template and the Azure portal.
author: asudbring
ms.service: virtual-network
ms.topic: how-to
ms.date: 08/26/2019
ms.author: allensu
---

# Move an Azure virtual network to another region by using the Azure portal

There are various scenarios for moving an existing Azure virtual network from one region to another. For example, you might want to create a virtual network with the same configuration for testing and availability as your existing virtual network. Or you might want to move a production virtual network to another region as part of your disaster recovery planning.

You can use an Azure Resource Manager template to complete the move of the virtual network to another region. You do this by exporting the virtual network to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information about Resource Manager templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal).


## Prerequisites

- Make sure that your virtual network is in the Azure region that you want to move from.

- To export a virtual network and deploy a template to create a virtual network in another region, you need to have the Network Contributor role or higher.

- Virtual network peerings won't be re-created, and they'll fail if they're still present in the template. Before you export the template, you have to remove any virtual network peers. You can then reestablish them after the virtual network move.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and public IPs.

- Verify that your Azure subscription allows you to create virtual networks in the target region. To enable the required quota, contact support.

- Make sure that your subscription has enough resources to support the addition of virtual networks for this process. For more information, see [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#networking-limits).


## Prepare for the move
In this section, you prepare the virtual network for the move by using a Resource Manager template. You then move the virtual network to the target region by using the Azure portal.

To export the virtual network and deploy the target virtual network by using the Azure portal, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com), and then select **Resource Groups**.
1. Locate the resource group that contains the source virtual network, and then select it.
1. Select **Settings** > **Export template**.
1. In the **Export template** pane, select **Deploy**.
1. To open the *parameters.json* file in your online editor, select **Template** > **Edit parameters**.
1. To edit the parameter of the virtual network name, change the **value** property under **parameters**:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "virtualNetworks_myVNET1_name": {
                "value": "<target-virtual-network-name>"
            }
        }
    }
    ```

1. In the editor, change the source virtual network name value in the editor to a name that you want for the target virtual network. Be sure to enclose the name in quotation marks.

1. Select **Save** in the editor.

1. To open the *template.json* file in the online editor, select **Template** > **Edit template**.

1. In the online editor, to edit the target region where the virtual network will be moved, change the **location** property under **resources**:

    ```json
    "resources": [
                {
                    "type": "Microsoft.Network/virtualNetworks",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('virtualNetworks_myVNET1_name')]",
                    "location": "<target-region>",
                    "properties": {
                        "provisioningState": "Succeeded",
                        "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                        "addressSpace": {
                            "addressPrefixes": [
                                "10.0.0.0/16"
                            ]
                        },

    ```

1. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name, without spaces (for example, **Central US** = **centralus**).

1. (Optional) You can also change other parameters in the template, depending on your requirements:

    * **Address Space**: Before you save the file, you can alter the address space of the virtual network by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property:

        ```json
                "resources": [
                    {
                    "type": "Microsoft.Network/virtualNetworks",
                    "apiVersion": "2019-06-01",
                    "name": "[parameters('virtualNetworks_myVNET1_name')]",
                    "location": "<target-region",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "resourceGuid": "6e2652be-35ac-4e68-8c70-621b9ec87dcb",
                    "addressSpace": {
                        "addressPrefixes": [
                        "10.0.0.0/16"
                        ]
                    },

        ```

    * **Subnet**: You can change or add to the subnet name and the subnet address space by changing the template's **subnets** section. You can change the name of the subnet by changing the **name** property. And you can change the subnet address space by changing the **addressPrefix** property:

        ```json
                "subnets": [
                    {
                    "name": "subnet-1",
                    "etag": "W/\"d9f6e6d6-2c15-4f7c-b01f-bed40f748dea\"",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "addressPrefix": "10.0.0.0/24",
                    "delegations": [],
                    "privateEndpointNetworkPolicies": "Enabled",
                    "privateLinkServiceNetworkPolicies": "Enabled"
                    }
                    },
                    {
                    "name": "GatewaySubnet",
                    "etag": "W/\"d9f6e6d6-2c15-4f7c-b01f-bed40f748dea\"",
                    "properties": {
                    "provisioningState": "Succeeded",
                    "addressPrefix": "10.0.1.0/29",
                    "serviceEndpoints": [],
                    "delegations": [],
                    "privateEndpointNetworkPolicies": "Enabled",
                    "privateLinkServiceNetworkPolicies": "Enabled"
                    }
                    }

                ]
        ```

        To change the address prefix in the *template.json* file, edit it in two places: in the code in the preceding section and in the **type** section of the following code. Change the **addressPrefix** property in the following code to match the **addressPrefix** property in the code in the preceding section.

        ```json
         "type": "Microsoft.Network/virtualNetworks/subnets",
           "apiVersion": "2019-06-01",
           "name": "[concat(parameters('virtualNetworks_myVNET1_name'), '/GatewaySubnet')]",
              "dependsOn": [
                 "[resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworks_myVNET1_name'))]"
                   ],
              "properties": {
                 "provisioningState": "Succeeded",
                 "addressPrefix": "10.0.1.0/29",
                 "serviceEndpoints": [],
                 "delegations": [],
                 "privateEndpointNetworkPolicies": "Enabled",
                 "privateLinkServiceNetworkPolicies": "Enabled"
                  }
                 },
                  {
                  "type": "Microsoft.Network/virtualNetworks/subnets",
                  "apiVersion": "2019-06-01",
                  "name": "[concat(parameters('virtualNetworks_myVNET1_name'), '/subnet-1')]",
                     "dependsOn": [
                        "[resourceId('Microsoft.Network/virtualNetworks', parameters('virtualNetworks_myVNET1_name'))]"
                          ],
                     "properties": {
                        "provisioningState": "Succeeded",
                        "addressPrefix": "10.0.0.0/24",
                        "delegations": [],
                        "privateEndpointNetworkPolicies": "Enabled",
                        "privateLinkServiceNetworkPolicies": "Enabled"
                         }
                  }
         ]
        ```

1. In the online editor, select **Save**.

1. To choose the subscription where the target virtual network will be deployed, select **Basics** > **Subscription**.

1. To choose the resource group where the target virtual network will be deployed, select **Basics** > **Resource group**. 

    If you need to create a new resource group for the target virtual network, select **Create new**. Make sure that the name isn't the same as the source resource group name in the existing virtual network.

1. Verify that **Basics** > **Location** is set to the target location where you want the virtual network to be deployed.

1. Under **Settings**, verify that the name matches the name that you entered previously in the parameters editor.

1. Select the **Terms and Conditions** check box.

1. To deploy the target virtual network, select **Purchase**.

## Delete the target virtual network

To discard the target virtual network, you delete the resource group that contains the target virtual network. To do so:
1. On the Azure portal dashboard, select the resource group.
1. At the top of the **Overview** pane, select **Delete**.

## Clean up

To commit the changes and complete the virtual network move, you delete the source virtual network or resource group. To do so:
1. On the Azure portal dashboard, select the virtual network or resource group.
1. At the top of each pane, select **Delete**.

## Next steps

In this tutorial, you moved an Azure virtual network from one region to another by using the Azure portal and then cleaned up the unneeded source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure virtual machines to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
