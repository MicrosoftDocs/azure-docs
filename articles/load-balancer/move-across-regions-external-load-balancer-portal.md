---
title: Move Azure external Load Balancer to another Azure region using the Azure portal
description: Use Azure Resource Manager template to move Azure external Load Balancer from one Azure region to another using the Azure portal.
author: asudbring
ms.service: load-balancer
ms.topic: article
ms.date: 09/17/2019
ms.author: allensu
---

# Move Azure external Load Balancer to another region using the Azure portal

There are various scenarios in which you'd want to move your existing external load balancer from one region to another. For example, you may want to create an external load balancer with the same configuration for testing. You may also want to move an external load balancer to another region as part of disaster recovery planning.

Azure external load balancers can't be moved from one region to another. You can however, use an Azure Resource Manager template to export the existing configuration and public IP of an external load balancer.  You can then stage the resource in another region by exporting the load balancer and public IP to a template, modifying the parameters to match the destination region, and then deploy the templates to the new region.  For more information on Resource Manager and templates, see [Export resource groups to templates](https://docs.microsoft.com/azure/azure-resource-manager/manage-resource-groups-powershell#export-resource-groups-to-templates)


## Prerequisites

- Make sure that the Azure external load balancer is in the Azure region from which you want to move.

- Azure external load balancers can't be moved between regions.  You'll have to associate the new load balancer to resources in the target region.

- To export an external load balancer configuration and deploy a template to create an external load balancer in another region, you'll need the Network Contributor role or higher.

- Identify the source networking layout and all the resources that you're currently using. This layout includes but isn't limited to load balancers, network security groups,  public IPs, and virtual networks.

- Verify that your Azure subscription allows you to create external load balancers in the target region that's used. Contact support to enable the required quota.

- Make sure that your subscription has enough resources to support the addition of load balancers for this process.  See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-subscription-service-limits#networking-limits)


## Prepare and move
The following steps show how to prepare the external load balancer for the move using a Resource Manager template, and move the external load balancer configuration to the target region using the Azure portal.  As part of this process, the public IP configuration of the external load balancer must be included and must me done first before moving the external load balancer.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

### Export the public IP template and deploy from the portal

1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source public IP and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.
8. To edit the parameter of the public IP name, change the property under **parameters** > **value** from the source public IP name to the name of your target public IP, ensure the name is in quotes:

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

    Click **Save** in the editor.

9.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.

10. To edit the target region where the public IP will be moved, change the **location** property under **resources**:

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

11. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

12. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the public IP in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

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

        For more information on the differences between basic and standard sku public ips, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address):

    * **Public IP allocation method** and **Idle timeout** - You can change both of these options in the template by altering the **publicIPAllocationMethod** property from **Dynamic** to **Static** or **Static** to **Dynamic**. The idle timeout can be changed by altering the **idleTimeoutInMinutes** property to your desired amount.  The default is **4**:

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

        For more information on the allocation methods and the idle timeout values, see [Create, change, or delete a public IP address](https://docs.microsoft.com/azure/virtual-network/virtual-network-public-ip-address).


13. Click **Save** in the online editor.

14. Click **BASICS** > **Subscription** to choose the subscription where the target public IP will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target public IP will be deployed.  You can click **Create new** to create a new resource group for the target public IP.  Ensure the name isn't the same as the source resource group of the existing source public IP.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the public IP to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.

18. Check the box under **TERMS AND CONDITIONS**.

19. Click the **Purchase** button to deploy the target public IP.
20. If you have another public IP that is being used for outbound NAT for the load balancer being moved, repeat the steps above to export and deploy the second outbound public IP to the target region.

### Export the external load balancer template and deploy from the Azure portal

1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups**.
2. Locate the Resource Group that contains the source external load balancer and click on it.
3. Select > **Settings** > **Export template**.
4. Choose **Deploy** in the **Export template** blade.
5. Click **TEMPLATE** > **Edit parameters** to open the **parameters.json** file in the online editor.

5. To edit the parameter of the external load balancer name, change the property **value** of the source external load balancer name to the name of your target external load balancer, ensure the name is in quotes:

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

6.  To edit value of the target public IP that was moved above, you must first obtain the resource ID and then copy and paste it into the **parameters.json** file. To obtain the ID:

    1. Login to the [Azure portal](https://portal.azure.com) > **Resource Groups** in another browser tab or window.
    2. Locate the target resource group that contains the moved public IP from the steps above, and click on it.
    3. Select > **Settings** > **Properties**.
    4. In the blade to the right, highlight the **Resource ID** and copy it to the clipboard.  Alternatively, you can click on the **copy to clipboard** button to the right of the **Resource ID** path.
    5. Paste the resource ID into the **value** property into the **Edit Parameters** editor open in the other browser window or tab:

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
    6. Click **Save** in the online editor.


7.  If you have configured outbound NAT and outbound rules for the load balancer, a third entry will be present in this file for the external ID for the outbound public IP.  Repeat the steps above in the **target region** to obtain the ID for the outbound public IP and paste that entry into the **parameters.json** file:

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

8.  Click **TEMPLATE** > **Edit template** to open the **template.json** file in the online editor.
9.  To edit the target region where the external load balancer configuration will be moved, change the **location** property under **resources** in the **template.json** file:

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

10. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

11. You can also change other parameters in the template if you choose, and are optional depending on your requirements:

    * **Sku** - You can change the sku of the external load balancer in the configuration from standard to basic or basic to standard by altering the **sku** > **name** property in the **template.json** file:

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
      For more information on the differences between basic and standard sku load balancers, see [Azure Standard Load Balancer overview](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview)

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
       For more information on load balancing rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

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
       For more information on Azure Load Balancer health probes, see [Load Balancer health probes](https://docs.microsoft.com/azure/load-balancer/load-balancer-custom-probe-overview)

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
        For more information on inbound NAT rules, see [What is Azure Load Balancer?](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview)

    * **Outbound rules** - You can add or remove outbound rules in the configuration by editing the **outboundRules** property in the **template.json** file:

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

         For more information on outbound rules, see [Load Balancer outbound rules](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-rules-overview)

12. Click **Save** in the online editor.

13. Click **BASICS** > **Subscription** to choose the subscription where the target external load balancer will be deployed.

15. Click **BASICS** > **Resource group** to choose the resource group where the target load balancer will be deployed.  You can click **Create new** to create a new resource group for the target external load balancer or choose the existing resource group that was created above for the public IP.  Ensure the name isn't the same as the source resource group of the existing source external load balancer.

16. Verify **BASICS** > **Location** is set to the target location where you wish for the external load balancer to be deployed.

17. Verify under **SETTINGS** that the name matches the name that you entered in the parameters editor above.  Verify the resource IDs are populated for any public IPs in the configuration.

18. Check the box under **TERMS AND CONDITIONS**.

19. Click the **Purchase** button to deploy the target public IP.

## Discard

If you wish to discard the target public IP and external load balancer, delete the resource group that contains the target public IP and external load balancer.  To do so, select the resource group from your dashboard in the portal and select **Delete** at the top of the overview page.

## Clean up

To commit the changes and complete the move of the public IP and external load balancer, delete the source public IP and external load balancer or resource group. To do so, select the public IP and external load balancer or resource group from your dashboard in the portal and select **Delete** at the top of each page.

## Next steps

In this tutorial, you moved an Azure external load balancer from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:


- [Move resources to a new resource group or subscription](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-move-resources)
- [Move Azure VMs to another region](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-migrate)
