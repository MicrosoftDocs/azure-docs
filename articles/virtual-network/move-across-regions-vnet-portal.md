---
title: Move Azure Virtual Network to another Azure region using the Azure portal.
description: Use Azure Resource Manager template to move Azure Virtual Network from one Azure region to another using the Azure portal.
author: asudbring
ms.service: virtual-network
ms.topic: article
ms.date: 08/26/2019
ms.author: allensu
---

# Move Azure Virtual Network to another region using the Azure portal

There are various scenarios in which you'd want to move your existing Azure Virtual Networks (VNETs) from one region to another. For example, you may want to create a virtual network with the same configuration for testing and availability of your existing virtual network. You may also want to move a production virtual network to another region as part of disaster recovery planning.

You can use an Azure Resource Manager template to complete the move of the virtual network to another region. You do this by exporting the virtual network to a template, modifying the parameters to match the destination region, and then deploying the template to the new region.  For more information on Resource Manager and templates,, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quickstart-create-templates-use-the-portal)


## Prerequisites

- Make sure that the Azure Virtual Network is in the Azure region from which you want to move.

- To export a virtual network and deploy a template to create a virtual network in another region, you'll need the Network Contributor role or higher.

- Virtual network peerings won't be recreated and will fail if they're still present in the template.  You'll have to remove any virtual network peers before exporting the template and then re-establish the peers after the move of the virtual network.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups (NSGs), and public IPs.

- Verify that your Azure subscription allows you to create virtual networks in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of Virtual Networks for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the virtual network for the move using an Resource Manager template, and move the virtual network to the target region using the portal.

### Export the template and deploy from the portal

1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source virtual network and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
6. To edit the parameter of the virtual network name, change the **value** property under **parameters**:

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
7. Change the source virtual network name value in the editor to a name of your choice for the target VNET. Ensure you enclose the name in quotes.

8.  Click **Save** in the editor.

9.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the VNET will be moved, change the **location** property under **resources** in the online editor:

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

11. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Address Space** - The address space of the VNET can be altered before saving by modifying the **resources** > **addressSpace** section and changing the **addressPrefixes** property in the **template.json** file:

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

    * **Subnet** - The subnet name and the subnet address space can be changed or added to by modifying the **subnets** section of the **template.json** file. The name of the subnet can be changed by altering the **name** property. The subnet address space can be changed by altering the **addressPrefix** property in the **template.json** file:

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

         In the **template.json** file, to change the address prefix, it must be edited in two places, the section listed above and the **type** section listed below.  Change the **addressPrefix** property to match the one above:

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

13. Click **Save** in the online editor.

14. Click **BASICS** > **Subscription** to choose the subscription where the target VNET will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target VNET will be deployed.  You can click **Create new** to create a new resource group for the target VNET.  Ensure the name is not the same as the source resource group of the existing VNET.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the VNET to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Click the **Purchase** button to deploy the target virtual network.

## Discard

If you wish to discard the target virtual network, delete the resource group that contains the target virtual network.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the virtual network, delete the source virtual network or resource group. To do so, select the virtual network or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure Virtual Network from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
