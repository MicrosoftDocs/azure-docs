---
title: Move Azure internal Load Balancer to another Azure region - Azure portal
description: Use Azure Resource Manager template to move Azure internal Load Balancer from one Azure region to another using the Azure portal.
author: mbender-ms
ms.service: load-balancer
ms.topic: how-to
ms.date: 06/27/2023
ms.author: mbender
ms.custom: template-how-to, devx-track-arm-template, engagement-fy23
---

# Move Azure internal Load Balancer to another region using the Azure portal

There are various scenarios in which you'd want to move your existing internal load balancer from one region to another. For example, you may want to create an internal load balancer with the same configuration for testing. You may also want to move an internal load balancer to another region as part of disaster recovery planning.

Azure internal load balancers can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and virtual network of an internal load balancer.  You can then stage the resource in another region by exporting the load balancer and virtual network to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.  For more information on Resource Manager and templates, see [Quickstart: Create and deploy Azure Resource Manager templates by using the Azure portal](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md).


## Prerequisites

- Make sure that the Azure internal load balancer is in the Azure region from which you want to move.

- Azure internal load balancers can't be moved between regions.  You have to associate the new load balancer to resources in the target region.

- To export an internal load balancer configuration and deploy a template to create an internal load balancer in another region, you need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups, virtual machines, and virtual networks.

- Verify that your Azure subscription allows you to create internal load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process.  See [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits)


## Prepare and move
The following steps show how to prepare the internal load balancer for the move using a Resource Manager template, and move the internal load balancer configuration to the target region using the Azure portal.  As part of this process, the virtual network configuration of the internal load balancer must be included and must be done first before moving the internal load balancer.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the virtual network template and deploy from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source virtual network and select it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
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

8. Select **Save** in the editor.

9. Select **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the VNET will be moved, change the **location** property under resources:

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

12. You can also change other parameters in the **template.json** file if you choose, and are optional depending on your requirements:

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

13. Select **Save** in the online editor.

14. Select **BASICS** > **Subscription** to choose the subscription where the target VNET will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target VNET will be deployed.  You can select **Create new** to create a new resource group for the target VNET.  Ensure the name isn't the same as the source resource group of the existing VNET.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the VNET to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Select the **Purchase** button to deploy the target virtual network.

### Export the internal load balancer template and deploy from Azure PowerShell

1. Select to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source internal load balancer and select it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.

6. To edit the parameter of the internal load balancer name, change the property **defaultValue** of the source internal load balancer name to the name of your target internal load balancer, ensure the name is in quotes:

    ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-internal-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_internalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
    ```

6. To edit value of the target virtual network that was moved above, you must first obtain the resource ID and then copy and paste it into the **parameters.json** file. To obtain the ID:

    1. Select to the [Azure portal](https://portal.azure.com) > **Resource Groups** in another browser tab or window.
    2. Locate the target resource group that contains the moved virtual network from the steps above, and select it.
    3. Select > **Settings** > **Properties**.
    4. On the right side of the portal, highlight the **Resource ID** and copy it to the clipboard.  Alternatively, you can select the **copy to clipboard** button to the right of the **Resource ID** path.
    5. Paste the resource ID into the **defaultValue** property into the **Edit Parameters** editor open in the other browser window or tab:

        ```json
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "loadBalancers_myLoadBalancer_name": {
            "defaultValue": "<target-internal-lb-name>",
            "type": "String"
             },
            "virtualNetworks_myVNET2_internalid": {
             "defaultValue": "<target-vnet-resource-ID>",
             "type": "String"
             }
        ```
    6. Select **Save** in the online editor.

7. Select **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.
8. To edit the target region where the internal load balancer configuration will be moved, change the **location** property under **resources** in the **template.json** file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-internal-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

9.  To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

10. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the internal load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-internal-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](./load-balancer-overview.md)

    * **Availability zone** - You can change the zone(s) of the load balancer's frontend by changing the **zone** property. If the zone property isn't specified, the frontend is created as no-zone. You can specify a single zone to create a zonal frontend or all 3 zones for a zone-redundant frontend.

        ```json
        "frontendIPConfigurations": [
        { 
            "name": "myfrontendIPinbound",
            "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
            "type": "Microsoft.Network/loadBalancers/frontendIPConfigurations",
            "properties": {
                "provisioningState": "Succeeded",
                "privateIPAddress": "10.0.0.6",
                "privateIPAllocationMethod": "Dynamic",
                "subnet": {
                    "id": "[concat(parameters('virtualNetworks_myVNET2_internalid'), '/subnet-1')]"
                },
                "loadBalancingRules": [
                    {
                        "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/loadBalancingRules/myInboundRule')]"
                    }
                ],
                "privateIPAddressVersion": "IPv4"
            },
            "zones": [
                "1",
                "2",
                "3"
            ]
        },
        ```
        For more about availability zones, see [Regions and availability zones in Azure](../availability-zones/az-overview.md).

    * **Load balancing rules** - You can add or remove load balancing rules in the configuration by adding or removing entries to the **loadBalancingRules** section of the **template.json** file:

        ```json
        "loadBalancingRules": [
                    {
                        "name": "myInboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false,
                            "loadDistribution": "Default",
                            "disableOutboundSnat": true,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolInbound')]"
                            },
                            "probe": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/probes/myHTTPProbe')]"
                            }
                        }
                    }
                ]
        ```
       For more information on load balancing rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

    * **Probes** - You can add or remove a probe for the load balancer in the configuration by adding or removing entries to the **probes** section of the **template.json** file:

        ```json
        "probes": [
                    {
                        "name": "myHTTPProbe",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "protocol": "Http",
                            "port": 80,
                            "requestPath": "/",
                            "intervalInSeconds": 15,
                            "numberOfProbes": 2
                        }
                    }
                ],
        ```
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](./load-balancer-custom-probe-overview.md)

    * **Inbound NAT rules** - You can add or remove inbound NAT rules for the load balancer by adding or removing entries to the **inboundNatRules** section of the **template.json** file:

        ```json
        "inboundNatRules": [
                    {
                        "name": "myInboundNATRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "frontendIPConfiguration": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                            },
                            "frontendPort": 4422,
                            "backendPort": 3389,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 4,
                            "protocol": "Tcp",
                            "enableTcpReset": false
                        }
                    }
                ]
        ```
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the **template.json** file:

        ```json
        {
            "type": "Microsoft.Network/loadBalancers/inboundNatRules",
            "apiVersion": "2019-06-01",
            "name": "[concat(parameters('loadBalancers_myLoadBalancer_name'), '/myInboundNATRule')]",
            "dependsOn": [
                "[resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name'))]"
            ],
            "properties": {
                "provisioningState": "Succeeded",
                "frontendIPConfiguration": {
                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPinbound')]"
                },
                "frontendPort": 4422,
                "backendPort": 3389,
                "enableFloatingIP": false,
                "idleTimeoutInMinutes": 4,
                "protocol": "Tcp",
                "enableTcpReset": false
            }
        }
        ```
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](./load-balancer-overview.md)

12. Select **Save** in the online editor.

13. Select **BASICS** > **Subscription** to choose the subscription where the target internal load balancer will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target load balancer will be deployed.  You can select **Create new** to create a new resource group for the target internal load balancer or choose the existing resource group that was created above for the virtual network.  Ensure the name isn't the same as the source resource group of the existing source internal load balancer.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the internal load balancer to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.  Verify the resource IDs are populated for any virtual networks in the configuration.

18. Check the box under **TERMS AND CONDITIONS**.

19. Select the **Purchase** button to deploy the target virtual network.

## Discard

If you wish to discard the target virtual network and internal load balancer, delete the resource group that contains the target virtual network and internal load balancer.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the virtual network and internal load balancer, delete the source virtual network and internal load balancer or resource group. To do so, select the virtual network and internal load balancer or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure internal load balancer from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
