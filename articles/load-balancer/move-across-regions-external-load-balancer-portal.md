---
title: Move an Azure external load balancer to another Azure region by using the Azure portal
description: Use an Azure Resource Manager template to move an external load balancer from one Azure region to another by using the Azure portal.
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/17/2019
ms.author: allensu
---

# Move an external load balancer to another region by using the Azure portal

There are various scenarios in which you'd want to move an external load balancer from one region to another. For example, you might want to create another external load balancer with the same configuration for testing. You also might  want to move an external load balancer to another region as part of disaster recovery planning.

In a literal sense, you can't move an Azure external load balancer from one region to another. But you can use an Azure Resource Manager template to export the existing configuration and public IP address of an external load balancer. You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploying the template to the new region. For more information on Resource Manager and templates, see [Export resource groups to templates](https://docs.microsoft.com/azure/azure-resource-manager/manage-resource-groups-powershell#export-resource-groups-to-templates).


## Prerequisites

- Make sure the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions. You'll have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you'll need to be assigned the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region. Contact support to enable the required quota.

- Make sure your subscription has enough resources to support the addition of the load balancers. See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#networking-limits).

## Prepare and move
The following procedures show how to prepare the external load balancer for the move by using a Resource Manager template and move the external load balancer configuration to the target region by using the Azure portal. You must first export the public IP configuration of external load balancer.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the public IP template and deploy the public IP from the portal

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
2. Locate the resource group that contains the source public IP and select it.
3. Select **Settings** > **Export template**.
4. Select **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the parameters.json file in the online editor.
8. To edit the parameter of the public IP name, change the **value** property under **parameters** from the source public IP name to the name of your target public IP. Enclose the name in quotation marks.

    ```json
            {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "publicIPAddresses_myVM1pubIP_name": {
            "value": "<target-publicip-name>"
              }
             }
            }

    ```

    Select **Save** in the editor.

9.  Select **TEMPLATE** > **Edit template** to open the template.json file in the online editor.

10. To edit the target region to which the public IP will be moved, change the **location** property under **resources**:

    ```json
            "resources": [
            {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Basic",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Dynamic",
                "idleTimeoutInMinutes": 4,
                "ipTags": []
               }
               }
             ]
    ```
  
    To get region location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces. For example, the code for Central US is **centralus**.
    
12. You can also change other parameters in the template if you want to or need to, depending on your requirements:

    * **SKU**. You can change the SKU of the public IP in the configuration from standard to basic or from basic to standard by changing the **name** property under **sku** in the template.json file:

        ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Basic",
                "tier": "Regional"
            },
        ```

        For information on the differences between basic and standard SKU public IPs, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address).

    * **Public IP allocation method** and **Idle timeout**. You can change the public IP allocation method by changing the **publicIPAllocationMethod** property from **Dynamic** to **Static** or from **Static** to **Dynamic**. You can change the idle timeout by changing the **idleTimeoutInMinutes** property to the desired value. The default is **4**.

        ```json
          "resources": [
         {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2019-06-01",
            "name": "[parameters('publicIPAddresses_myPubIP_name')]",
            "location": "<target-region>",
            "sku": {
                "name": "Basic",
                "tier": "Regional"
            },
            "properties": {
                "provisioningState": "Succeeded",
                "resourceGuid": "7549a8f1-80c2-481a-a073-018f5b0b69be",
                "ipAddress": "52.177.6.204",
                "publicIPAddressVersion": "IPv4",
                "publicIPAllocationMethod": "Dynamic",
                "idleTimeoutInMinutes": 4,
                "ipTags": []

        ```

        For information on the allocation methods and idle timeout values, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address).

 
13. Select **Save** in the online editor.

14. Select **BASICS** > **Subscription** to choose the subscription where the target public IP will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target public IP will be deployed. You can select **Create new** to create a new resource group for the target public IP. Make sure the name isn't the same as the source resource group of the existing source public IP.

16. Verify that **BASICS** > **Location** is set to the target location where you want the public IP to be deployed.

17. Under **SETTINGS**, verify that the name matches the name that you entered earlier in the parameters editor.

18. Select the **TERMS AND CONDITIONS** check box.

19. Select **Purchase** to deploy the target public IP.

20. If you have another public IP that's being used for outbound NAT for the load balancer being moved, repeat the previous steps to export and deploy the second outbound public IP to the target region.

### Export the external load balancer template and deploy the load balancer from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
2. Locate the resource group that contains the source external load balancer and select it.
3. Select **Settings** > **Export template**.
4. Select **Deploy** under **Export template**.
5. Select **TEMPLATE** > **Edit parameters** to open the parameters.json file in the online editor.

5. To edit the parameter of the external load balancer name, change the **value** property of the source external load balancer name to the name of your target external load balancer. Enclose the name in quotation marks.

    ```json
       "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
       "contentVersion": "1.0.0.0",
       "parameters": {
          "loadBalancers_myLoadbalancer_ext_name": {
          "value": "<target-external-lb-name>"
    },
          "publicIPAddresses_myPubIP_in_externalid": {
          "value": "<target-publicIP-resource-ID>"
    },

    ```

6.  To edit value of the target public IP that you moved in the preceding steps, you must first obtain the resource ID and then paste it into the parameters.json file. To obtain the ID:

    1. In another browser tab or window, sign in to the [Azure portal](https://portal.azure.com) and select **Resource groups**.
    2. Locate the target resource group that contains the public IP that you moved in the preceding steps. Select it.
    3. Select **Settings** > **Properties**.
    4. In the blade to the right, highlight the **Resource ID** and copy it to the clipboard. Alternatively, you can select **copy to clipboard** to the right of the **Resource ID** path.
    5. Paste the resource ID into the **value** property in the **Edit Parameters** editor that's open in the other browser window or tab:

		```json
		   ```json
		   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
		   "contentVersion": "1.0.0.0",
		   "parameters": {
			  "loadBalancers_myLoadbalancer_ext_name": {
			  "value": "<target-external-lb-name>"
		},
			  "publicIPAddresses_myPubIP_in_externalid": {
			  "value": "<target-publicIP-resource-ID>"
		},

		```
    6. Select **Save** in the online editor.


7.  If you've configured outbound NAT and outbound rules for the load balancer, you'll see a third entry in this file for the external ID of the outbound public IP. Repeat the preceding steps in the **target region** to obtain the ID for the outbound public IP. Paste that ID into the parameters.json file:

    ```json
            "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
            "contentVersion": "1.0.0.0",
            "parameters": {
                "loadBalancers_myLoadbalancer_ext_name": {
                "value": "<target-external-lb-name>",

            },
                "publicIPAddresses_myPubIP_in_externalid": {
                "value": "<target-publicIP-resource-ID>",

            },
                "publicIPAddresses_myPubIP_out_externalid": {
                "defaultValue": "<target-publicIP-outbound-resource-ID>",

            }
        },
    ```

8.  Select **TEMPLATE** > **Edit template** to open the template.json file in the online editor.
9.  To edit the target region to which the external load balancer configuration will be moved, change the **location** property under **resources** in the template.json file:

    ```json
        "resources": [
            {
                "type": "Microsoft.Network/loadBalancers",
                "apiVersion": "2019-06-01",
                "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
                "location": "<target-external-lb-region>",
                "sku": {
                    "name": "Standard",
                    "tier": "Regional"
                },
    ```

10. To get region location codes, see [Azure locations](https://azure.microsoft.com/global-infrastructure/locations/). The code for a region is the region name with no spaces. For example, the code for Central US is **centralus**.

11. You can also change other parameters in the template if you want to or need to, depending on your requirements:

    * **SKU**. You can change the SKU of the external load balancer in the configuration from standard to basic or from basic to standard by changing the **name** property under **sku** in the template.json file:

        ```json
        "resources": [
        {
            "type": "Microsoft.Network/loadBalancers",
            "apiVersion": "2019-06-01",
            "name": "[parameters('loadBalancers_myLoadBalancer_name')]",
            "location": "<target-external-lb-region>",
            "sku": {
                "name": "Standard",
                "tier": "Regional"
            },
        ```
      For information on the differences between basic and standard SKU load balancers, see [Azure Standard Load Balancer overview](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview).

    * **Load balancing rules**. You can add or remove load balancing rules in the configuration by adding or removing entries in the **loadBalancingRules** section of the template.json file:

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
       For information on load balancing rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview).

    * **Probes**. You can add or remove a probe for the load balancer in the configuration by adding or removing entries in the **probes** section of the template.json file:

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
       For more information, see [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview).

    * **Inbound NAT rules**. You can add or remove inbound NAT rules for the load balancer by adding or removing entries in the **inboundNatRules** section of the template.json file:

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
        To complete the addition or removal of an inbound NAT rule, the rule must be present or removed as a **type** property at the end of the template.json file:

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
        For information on inbound NAT rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview).

    * **Outbound rules**. You can add or remove outbound rules in the configuration by editing the **outboundRules** property in the template.json file:

        ```json
        "outboundRules": [
                    {
                        "name": "myOutboundRule",
                        "etag": "W/\"39e5e9cd-2d6d-491f-83cf-b37a259d86b6\"",
                        "properties": {
                            "provisioningState": "Succeeded",
                            "allocatedOutboundPorts": 10000,
                            "protocol": "All",
                            "enableTcpReset": false,
                            "idleTimeoutInMinutes": 15,
                            "backendAddressPool": {
                                "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/backendAddressPools/myBEPoolOutbound')]"
                            },
                            "frontendIPConfigurations": [
                                {
                                    "id": "[concat(resourceId('Microsoft.Network/loadBalancers', parameters('loadBalancers_myLoadBalancer_name')), '/frontendIPConfigurations/myfrontendIPoutbound')]"
                                }
                            ]
                        }
                    }
                ]
        ```

         For more information, see [Load Balancer outbound rules](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-rules-overview).

12. Select **Save** in the online editor.

13. Select **BASICS** > **Subscription** to choose the subscription where the target external load balancer will be deployed.

15. Select **BASICS** > **Resource group** to choose the resource group where the target load balancer will be deployed. You can select **Create new** to create a new resource group for the target external load balancer. Or you can choose the existing resource group that you created earlier for the public IP. Make sure the name isn't the same as the source resource group of the existing source external load balancer.

16. Verify that **BASICS** > **Location** is set to the target location where you want the external load balancer to be deployed.

17. Under **SETTINGS**, verify that the name matches the name you entered earlier in the parameters editor. Verify that the resource IDs are populated for any public IPs in the configuration.

18. Select the **TERMS AND CONDITIONS** check box.

19. Select **Purchase** to deploy the target public IP.

## Discard

If you want to discard the target public IP and external load balancer, delete the resource group that contains them. To do so, select the resource group from your dashboard in the portal and then select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the public IP and external load balancer, delete the source public IP and external load balancer or resource group. To do so, select that resource group from your dashboard in the portal and then select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure external load balancer from one region to another and cleaned up the source resources. To learn more about moving resources between regions and disaster recovery in Azure, see:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
